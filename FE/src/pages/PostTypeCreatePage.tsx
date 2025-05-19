import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createPostTypeAPI,
	fetchPostTypesAPI,
	deletePostTypeAPI,
	updatePostTypeAPI,
} from "@/api/post";
import useCenterStore from "@/lib/store/centerStore";
import { Check, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function PostTypeCreatePage() {
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();
	const [newTypeName, setNewTypeName] = useState("");
	const [editingType, setEditingType] = useState<{
		id: number;
		name: string;
	} | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch existing post types
	const { data: postTypes = [], isLoading } = useQuery({
		queryKey: ["postTypes", selectedCenter?.centerId],
		queryFn: () => fetchPostTypesAPI(Number(selectedCenter?.centerId)),
		enabled: !!selectedCenter?.centerId,
	});

	const createMutation = useMutation({
		mutationFn: (name: string) =>
			createPostTypeAPI(Number(selectedCenter?.centerId), { name }),
		onSuccess: () => {
			toast.success("게시판 타입이 생성되었습니다");
			setNewTypeName("");
			queryClient.invalidateQueries({
				queryKey: ["postTypes", selectedCenter?.centerId],
			});
		},
		onError: () => {
			toast.error("게시판 타입 생성에 실패했습니다");
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, name }: { id: number; name: string }) =>
			updatePostTypeAPI(id, Number(selectedCenter?.centerId), { name }),
		onSuccess: () => {
			toast.success("게시판 타입이 수정되었습니다");
			setEditingType(null);
			queryClient.invalidateQueries({
				queryKey: ["postTypes", selectedCenter?.centerId],
			});
		},
		onError: () => {
			toast.error("게시판 타입 수정에 실패했습니다");
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) =>
			deletePostTypeAPI(id, Number(selectedCenter?.centerId)),
		onSuccess: () => {
			toast.success("게시판 타입이 삭제되었습니다");
			queryClient.invalidateQueries({
				queryKey: ["postTypes", selectedCenter?.centerId],
			});
		},
		onError: () => {
			toast.error("게시판 타입 삭제에 실패했습니다");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTypeName.trim()) return;
		setIsSubmitting(true);
		createMutation.mutate(newTypeName);
	};

	const handleUpdate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingType || !editingType.name.trim()) return;
		setIsSubmitting(true);
		updateMutation.mutate({ id: editingType.id, name: editingType.name });
	};

	const handleDelete = (id: number) => {
		if (
			window.confirm(
				"이 게시판 타입을 삭제하시겠습니까? 관련된 모든 게시글도 삭제됩니다.",
			)
		) {
			deleteMutation.mutate(id);
		}
	};

	return (
		<div className="flex flex-col min-h-[calc(100vh-3rem)]">
			<div className="flex-1 p-4 w-full">
				{/* Create new post type form */}
				<form onSubmit={handleSubmit} className="mb-8">
					<h2 className="text-lg font-semibold mb-2">
						새 게시판 추가
					</h2>
					<div className="flex gap-2">
						<input
							type="text"
							value={newTypeName}
							onChange={(e) => setNewTypeName(e.target.value)}
							placeholder="게시판 이름"
							className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
							disabled={isSubmitting}
						/>
						<button
							type="submit"
							className="bg-male text-white px-4 py-2 rounded-md flex items-center"
							disabled={isSubmitting || !newTypeName.trim()}
						>
							{isSubmitting ? (
								<Loader2 className="w-4 h-4 animate-spin mr-1" />
							) : (
								<Plus className="w-4 h-4 mr-1" />
							)}
							추가
						</button>
					</div>
				</form>

				{/* Existing post types list */}
				<div>
					<h2 className="text-lg font-semibold mb-2">게시판 목록</h2>
					{isLoading ? (
						<div className="flex justify-center items-center py-8">
							<Loader2 className="w-6 h-6 text-male animate-spin" />
						</div>
					) : postTypes.length === 0 ? (
						<p className="text-gray-500 text-center py-4">
							등록된 게시판이 없습니다.
						</p>
					) : (
						<ul className="divide-y divide-gray-200 border-t border-b">
							{postTypes.map((type) => (
								<li key={type.id} className="py-3">
									{editingType?.id === type.id ? (
										<form
											onSubmit={handleUpdate}
											className="flex gap-2"
										>
											<input
												type="text"
												value={editingType.name}
												onChange={(e) =>
													setEditingType({
														...editingType,
														name: e.target.value,
													})
												}
												className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
											/>
											<button
												type="submit"
												className="bg-green-500 text-white px-3 py-1 rounded-md"
												disabled={isSubmitting}
											>
												<Check className="w-4 h-4" />
											</button>
											<button
												type="button"
												className="bg-gray-200 px-3 py-1 rounded-md"
												onClick={() =>
													setEditingType(null)
												}
											>
												취소
											</button>
										</form>
									) : (
										<div className="flex justify-between items-center">
											<span className="font-medium">
												{type.name}
											</span>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() =>
														setEditingType({
															id: type.id,
															name: type.name,
														})
													}
													className="text-blue-500 p-1 rounded-full hover:bg-blue-50"
												>
													<Pencil className="w-4 h-4" />
												</button>
												<button
													type="button"
													onClick={() =>
														handleDelete(type.id)
													}
													className="text-red-500 p-1 rounded-full hover:bg-red-50"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</div>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

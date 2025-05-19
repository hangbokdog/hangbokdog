export interface commentAuthor {
	id: number;
	nickName: string;
	grade: string;
	profileImage: string;
}

export interface commentData {
	author: commentAuthor;
	isAuthor: boolean;
	id: number;
	parentId: number | null;
	content: string;
	isDeleted: boolean;
	createdAt: string;
	isLiked: boolean;
	likeCount: number;
}

export interface CommentItemData {
	comment: commentData;
	replies: {
		comment: commentData;
		replies: CommentItemData[];
	}[];
}

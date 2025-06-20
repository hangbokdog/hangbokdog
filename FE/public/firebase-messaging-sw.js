// Firebase Cloud Messaging 서비스 워커 스크립트
importScripts(
	"https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js",
);

// 주의: 서비스 워커에서는 import.meta.env를 사용할 수 없음
// 실제 배포 시에는 빌드 프로세스를 통해 이 값들을 주입하거나 다른 방식으로 관리해야 함
firebase.initializeApp({
	apiKey: "FIREBASE_API_KEY",
	authDomain: "FIREBASE_AUTH_DOMAIN",
	projectId: "FIREBASE_PROJECT_ID",
	storageBucket: "FIREBASE_STORAGE_BUCKET",
	messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
	appId: "FIREBASE_APP_ID",
	measurementId: "FIREBASE_MEASUREMENT_ID",
});

const messaging = firebase.messaging();

// 백그라운드 메시지 핸들링
messaging.onBackgroundMessage((payload) => {
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: "/logo.png", // 프로젝트의 실제 로고 경로로 변경
		badge: "/badge-icon.png", // 알림 배지 아이콘 경로
		data: payload.data,
		tag: "volunteer-notification", // 알림 그룹화를 위한 태그
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
	// 알림 닫기
	event.notification.close();

	// 알림 클릭 시 열릴 URL
	// 데이터에 따라 다른 URL로 이동
	let url = "/";

	if (event.notification.data) {
		const data = event.notification.data;

		if (data.type === "VOLUNTEER_APPLICATION") {
			url = `/manager/volunteer/applications?id=${data.volunteerId}`;
		}
	}

	// 알림 클릭 시 동작 정의
	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				// 이미 열린 탭이 있는지 확인
				for (const client of clientList) {
					if (client.url === url && "focus" in client) {
						return client.focus();
					}
				}

				// 열린 탭이 없으면 새 탭 열기
				if (clients.openWindow) {
					return clients.openWindow(url);
				}
			}),
	);
});

self.addEventListener("push", (event) => {
	try {
		const payload = event.data.json();

		if (payload.notification?.body) {
			try {
				// body가 JSON 문자열인지 확인하고 파싱
				const parsedBody = JSON.parse(payload.notification.body);

				// content 필드만 추출하여 알림 내용으로 사용
				if (parsedBody.content) {
					payload.notification.body = parsedBody.content;
				}
			} catch (e) {
				// 파싱 실패 시 원본 메시지 유지 (이미 문자열인 경우)
				console.log("JSON 파싱 실패, 원본 메시지 사용");
			}
		}

		// 수정된 알림 표시
		const title = payload.notification.title;
		const options = {
			body: payload.notification.body,
			icon: payload.notification.icon || "/logo.png",
		};

		event.waitUntil(self.registration.showNotification(title, options));
	} catch (error) {
		console.error("Push 이벤트 처리 중 오류 발생:", error);
	}
});

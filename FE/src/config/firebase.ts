// Firebase 초기화 설정
import { initializeApp } from "firebase/app";
import {
	getMessaging,
	getToken,
	onMessage,
	type MessagePayload,
	isSupported,
	type Messaging,
} from "firebase/messaging";

// Firebase 설정값
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// FCM 메시징 객체 가져오기 (안전하게 처리)
let messaging: Messaging | null = null;

// 브라우저가 FCM을 지원하는지 확인하고 messaging 초기화
const initMessaging = async () => {
	try {
		// 브라우저에서 FCM 지원 여부 확인
		const isFCMSupported = await isSupported();

		if (isFCMSupported) {
			messaging = getMessaging(app);
			return true;
		}

		console.warn(
			"이 브라우저는 Firebase Cloud Messaging을 지원하지 않습니다.",
		);
		return false;
	} catch (error) {
		console.error("Firebase 메시징 초기화 중 오류 발생:", error);
		return false;
	}
};

// FCM 초기화
initMessaging().catch((error) => {
	console.error("FCM 초기화 실패:", error);
});

// FCM 토큰 요청 함수
export const requestFCMToken = async () => {
	try {
		// 메시징이 초기화되지 않은 경우 초기화 시도
		if (!messaging) {
			const initialized = await initMessaging();
			if (!initialized) {
				console.warn(
					"Firebase 메시징 초기화 실패로 토큰을 요청할 수 없습니다.",
				);
				return null;
			}
		}

		// FCM 권한 요청
		let permission: NotificationPermission;
		try {
			permission = await Notification.requestPermission();
		} catch (permissionError) {
			console.error("FCM 권한 요청 중 오류:", permissionError);
			return null;
		}

		if (permission !== "granted") {
			return null;
		}

		// 토큰 생성
		try {
			// messaging이 null이 아님을 확인했으므로 타입 단언 사용
			const token = await getToken(messaging as Messaging, {
				vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
			});

			// 토큰을 서버에 저장하는 로직 추가
			if (!token) {
				return null;
			}

			return token;
		} catch (tokenError) {
			console.error("FCM 토큰 생성 중 오류:", tokenError);

			return null;
		}
	} catch (error) {
		console.error("FCM 토큰 요청 중 오류 발생:", error);
		return null;
	}
};

// 포그라운드 메시지 수신 리스너
export const onForegroundMessage = (
	callback: (payload: MessagePayload) => void,
) => {
	// 메시징이 초기화되지 않은 경우 빈 함수 반환
	if (!messaging) {
		console.warn(
			"Firebase 메시징이 초기화되지 않아 알림을 수신할 수 없습니다.",
		);
		return () => {}; // 빈 언서브스크라이브 함수
	}

	return onMessage(messaging, (payload) => {
		callback(payload);
	});
};

export { messaging };

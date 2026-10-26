export interface Review {
  id: string;
  title: string; // 예: "출퇴근 비용이 확실히 줄었어요"
  content: string; // 후기 본문
  author: string; // 예: "선*형님"
  rating: number; // 5
  carModel: string; // 예: "EV5 롱레인지", "EV5 에어"
  date: string; // "2026.04.12"
  imageUrl?: string; // 출고 차량 썸네일 이미지
  badge?: string; // "출고인증", "베스트"
  buddyReply?: {
    buddyName: string; // 예: "이혜연 버디", "박준수 버디"
    content: string; // 버디의 감사 및 출고 후속 케어 답변
    avatarColor?: string;
  };
}

interface HomeIllustrationProps {
  className?: string;
}

/**
 * Home 페이지용 따뜻한 톤의 SVG 일러스트레이션.
 * 집 + 가족 + 하트를 조합한 미니멀 일러스트입니다.
 */
export function HomeIllustration({ className = '' }: HomeIllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="따뜻한 집과 가족을 표현한 일러스트레이션"
    >
      {/* 배경 원 */}
      <circle cx="160" cy="140" r="130" fill="#FFF7ED" />

      {/* 집 본체 */}
      <rect x="100" y="130" width="120" height="100" rx="4" fill="#FBBF24" />

      {/* 지붕 */}
      <path d="M80 135 L160 75 L240 135 Z" fill="#F97316" />

      {/* 지붕 장식 */}
      <path d="M90 135 L160 82 L230 135 Z" fill="#FB923C" />

      {/* 문 */}
      <rect x="145" y="175" width="30" height="55" rx="3" fill="#92400E" />
      <circle cx="170" cy="205" r="3" fill="#FBBF24" />

      {/* 왼쪽 창문 */}
      <rect x="110" y="150" width="25" height="25" rx="2" fill="#FEF3C7" />
      <line x1="122.5" y1="150" x2="122.5" y2="175" stroke="#F59E0B" strokeWidth="1.5" />
      <line x1="110" y1="162.5" x2="135" y2="162.5" stroke="#F59E0B" strokeWidth="1.5" />

      {/* 오른쪽 창문 */}
      <rect x="185" y="150" width="25" height="25" rx="2" fill="#FEF3C7" />
      <line x1="197.5" y1="150" x2="197.5" y2="175" stroke="#F59E0B" strokeWidth="1.5" />
      <line x1="185" y1="162.5" x2="210" y2="162.5" stroke="#F59E0B" strokeWidth="1.5" />

      {/* 굴뚝 */}
      <rect x="190" y="80" width="20" height="40" rx="2" fill="#DC2626" />
      <rect x="187" y="76" width="26" height="8" rx="2" fill="#B91C1C" />

      {/* 연기 */}
      <circle cx="200" cy="65" r="5" fill="#E5E7EB" opacity="0.7" />
      <circle cx="205" cy="55" r="4" fill="#E5E7EB" opacity="0.5" />
      <circle cx="202" cy="45" r="3" fill="#E5E7EB" opacity="0.3" />

      {/* 하트 (집 위) */}
      <path
        d="M155 60 C155 55, 148 50, 148 55 C148 60, 155 67, 155 67 C155 67, 162 60, 162 55 C162 50, 155 55, 155 60 Z"
        fill="#F43F5E"
        opacity="0.8"
      />

      {/* 작은 하트들 */}
      <path
        d="M250 100 C250 97, 246 95, 246 97 C246 100, 250 103, 250 103 C250 103, 254 100, 254 97 C254 95, 250 97, 250 100 Z"
        fill="#FB7185"
        opacity="0.6"
      />
      <path
        d="M80 110 C80 107, 76 105, 76 107 C76 110, 80 113, 80 113 C80 113, 84 110, 84 107 C84 105, 80 107, 80 110 Z"
        fill="#FB7185"
        opacity="0.6"
      />

      {/* 사람 1 (왼쪽) */}
      <circle cx="120" cy="245" r="10" fill="#FECACA" />
      <rect x="113" y="255" width="14" height="20" rx="7" fill="#F97316" />

      {/* 사람 2 (오른쪽) */}
      <circle cx="200" cy="245" r="10" fill="#FECACA" />
      <rect x="193" y="255" width="14" height="20" rx="7" fill="#EC4899" />

      {/* 사람 3 (가운데 작은 - 아이) */}
      <circle cx="160" cy="250" r="7" fill="#FECACA" />
      <rect x="155" y="257" width="10" height="15" rx="5" fill="#10B981" />

      {/* 나무 (왼쪽) */}
      <rect x="55" y="200" width="8" height="30" rx="2" fill="#92400E" />
      <circle cx="59" cy="190" r="18" fill="#86EFAC" />
      <circle cx="50" cy="195" r="12" fill="#4ADE80" />

      {/* 나무 (오른쪽) */}
      <rect x="257" y="205" width="8" height="25" rx="2" fill="#92400E" />
      <circle cx="261" cy="195" r="15" fill="#86EFAC" />
      <circle cx="268" cy="200" r="10" fill="#4ADE80" />

      {/* 잔디 */}
      <ellipse cx="160" cy="235" rx="140" ry="8" fill="#BBF7D0" opacity="0.5" />
    </svg>
  );
}

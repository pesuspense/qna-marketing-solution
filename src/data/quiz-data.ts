import { Question, MarketingSolution } from '@/types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    text: "현재 운영 중인 치과의 진료 영역은 어떤가요?",
    options: [
      { id: "1a", text: "단일 진료(보존, 보철 등)중심의 기본 진료", value: "basic" },
      { id: "1b", text: "임플란트, 교정 등 특화 진료를 일부 병행", value: "specialized" },
      { id: "1c", text: "다양한 진료과를 운영하는 종합치과", value: "comprehensive" },
      { id: "1d", text: "아직 확장 계획 중이거나 초기 개원 단계", value: "startup" }
    ]
  },
  {
    id: 2,
    text: "현재 마케팅은 어떤 방식으로 진행중인가요?",
    options: [
      { id: "2a", text: "지인 소개 및 자연 유입에 의존", value: "referral" },
      { id: "2b", text: "블로그, 인스타그램 등 SNS 중심", value: "sns" },
      { id: "2c", text: "광고 대행사를 통한 온라인 광고 진행 중", value: "agency" },
      { id: "2d", text: "마케팅을 거의 하지 않고 있음", value: "none" }
    ]
  },
  {
    id: 3,
    text: "현재 마케팅 예산은 어느 정도인가요?",
    options: [
      { id: "3a", text: "월 100만원 미만", value: "low" },
      { id: "3b", text: "월 150-300만원", value: "medium" },
      { id: "3c", text: "월 300-500만원", value: "high" },
      { id: "3d", text: "월 800만원 이상", value: "veryHigh" }
    ]
  },
  {
    id: 4,
    text: "병원 홍보나 상담 전환에서 가장 어려운 점은 무엇인가요? (중복 선택 가능)",
    options: [
      { id: "4a", text: "병원에 맞는 콘텐츠나 전략이 없다", value: "content" },
      { id: "4b", text: "광고 대비 실질 방문/상담 전환율이 낮다", value: "conversion" },
      { id: "4c", text: "경쟁 치과에 밀려 차별화가 어렵다", value: "differentiation" },
      { id: "4d", text: "마케팅에 쓸 시간과 인력이 부족하다", value: "resources" }
    ],
    allowMultiple: true
  },
  {
    id: 5,
    text: "컨설팅을 받는다면 어떤 도움이 가장 필요하신가요?",
    options: [
      { id: "5a", text: "진료 분야별 타겟 마케팅 전략 수립", value: "strategy" },
      { id: "5b", text: "지역 경쟁 분석 및 포지셔닝 전략", value: "positioning" },
      { id: "5c", text: "효율적인 광고 예산 운영 및 성과 분석", value: "optimization" },
      { id: "5d", text: "브랜딩 및 병원 이미지 개선", value: "branding" }
    ]
  }
];

export const marketingSolutions: MarketingSolution[] = [
  {
    id: "dental-referral-to-digital",
    name: "입소문 중심 병원의 디지털 전환",
    description:
      "자연 유입과 소개에만 의존하던 병원이 온라인 채널을 통해 안정적인 신규 유입 구조를 구축할 수 있도록 돕는 솔루션입니다.",
    category: "전환",
    conditions: ["referral", "basic", "none", "content", "strategy"],
    benefits: [
      "입소문 강점을 유지하면서 디지털 채널 확장",
      "환자 유형 분석 후 타겟 설정",
      "기초 콘텐츠 및 광고 구조 설계"
    ],
    estimatedCost: "월 100-200만원",
    timeline: "2-3개월"
  },
  {
    id: "dental-agency-insight",
    name: "광고대행 성과 점검 및 구조 재설계",
    description:
      "기존 광고대행 성과가 기대에 못 미치는 경우, 내부 시각에서 성과를 분석하고 전략을 재설계하는 솔루션입니다.",
    category: "분석/최적화",
    conditions: ["agency", "conversion", "optimization", "high", "veryHigh"],
    benefits: [
      "기존 광고 매체 성과 리포트 제공",
      "전환율 기준의 광고 문구/타겟 분석",
      "광고-상담-예약 구조 정비"
    ],
    estimatedCost: "월 250-400만원",
    timeline: "2-4개월"
  },
  {
    id: "dental-hybrid-growth",
    name: "SNS × 광고 하이브리드 성장 전략",
    description:
      "SNS 운영과 광고를 병행 중인 병원에 최적화된 예산 분배와 콘텐츠-광고 전환 시너지 전략을 설계합니다.",
    category: "통합",
    conditions: ["sns", "agency", "medium", "high"],
    benefits: [
      "채널별 고객 여정 정의",
      "광고로 유입된 고객의 SNS 전환 유도",
      "월별 예산 분배 및 성과 모니터링 시스템"
    ],
    estimatedCost: "월 200-350만원",
    timeline: "2-4개월"
  },
  {
    id: "dental-premium-brand",
    name: "프리미엄 브랜드 이미지 구축",
    description:
      "고가 진료 중심 또는 경쟁이 심한 지역에서 병원의 전문성과 품격을 드러내는 브랜드 설계를 제공합니다.",
    category: "브랜딩",
    conditions: ["specialized", "branding", "differentiation", "high", "veryHigh"],
    benefits: [
      "프리미엄 이미지에 맞는 시각 브랜딩 설계",
      "전문화된 진료 기반 차별화 콘텐츠",
      "고가 진료 신뢰도 향상 콘텐츠 전략"
    ],
    estimatedCost: "월 400-700만원",
    timeline: "3-6개월"
  },
  {
    id: "dental-local-leader",
    name: "지역 1등 치과 만들기 프로젝트",
    description:
      "종합진료 병원을 위한 지역 내 인지도 확보 및 커뮤니티 기반 유입 확장을 위한 캠페인형 솔루션입니다.",
    category: "로컬 캠페인",
    conditions: ["comprehensive", "positioning", "branding", "content", "medium", "high"],
    benefits: [
      "지역 네트워크 기반 파트너십 마케팅",
      "지역주민 중심 메시지 개발",
      "온/오프라인 연계 캠페인 기획"
    ],
    estimatedCost: "월 300-600만원",
    timeline: "4-6개월"
  },
  {
    id: "dental-smart-automation",
    name: "마케팅 자동화 및 상담 시스템 설계",
    description:
      "마케팅 인력이 부족한 병원을 위해 최소한의 관리로 지속적인 전환을 만들어내는 자동화 기반 솔루션입니다.",
    category: "자동화",
    conditions: ["resources", "optimization", "conversion", "strategy"],
    benefits: [
      "자동 상담 응답 시스템 도입",
      "예약-상담-후기 흐름 자동화",
      "전환 중심의 마케팅 퍼널 구성"
    ],
    estimatedCost: "월 180-300만원",
    timeline: "3-5개월"
  },
  {
    id: "dental-performance-max",
    name: "하이엔드 광고 퍼포먼스 전략",
    description:
      "월 300만원 이상 광고 예산을 보유한 병원을 위해 성과 기반의 타겟 광고와 진료별 전환율 최적화를 동시에 추진하는 고효율 마케팅 캠페인 전략입니다.",
    category: "성과 광고",
    conditions: ["conversion", "optimization", "agency", "high", "veryHigh"],
    benefits: [
      "진료별 광고 캠페인 기획 및 운영",
      "데이터 기반 고객 여정 추적 및 분석",
      "고비용 대비 고전환을 위한 멀티채널 성과 전략"
    ],
    estimatedCost: "월 500-900만원",
    timeline: "2-4개월"
  },
  {
    id: "dental-total-digital-dx",
    name: "디지털 전환 DX 종합 솔루션",
    description:
      "병원 전체 마케팅 시스템의 디지털화, 브랜드 중심 구조 개편, 고객 경험 자동화까지 포함한 전방위 디지털 전환 프로젝트입니다.",
    category: "DX (Digital Transformation)",
    conditions: ["comprehensive", "strategy", "veryHigh", "branding", "resources"],
    benefits: [
      "전담 팀 기반 마케팅 체계 설계",
      "CRM, 상담, 후기 자동화 시스템 도입",
      "브랜드 재정립과 비주얼/콘텐츠 통합 설계"
    ],
    estimatedCost: "월 800만원 이상",
    timeline: "6-9개월"
  }
];

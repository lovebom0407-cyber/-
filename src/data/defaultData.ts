import { TeacherInfo, RubricItem, KptReflection, AttachedDocument } from '../types';

export const DEFAULT_TEACHER_INFO: TeacherInfo = {
  schoolName: "온누리초등학교",
  targetAudience: "초등 5학년 수학",
  teacherName: "김은서 교사",
  lessonTopic: "AI 보조 에듀테크 기반 분수와 소수의 사칙 연산 심화 탐험",
  date: new Date().toISOString().split("T")[0],
};

export const DEFAULT_RUBRIC_ITEMS: RubricItem[] = [
  {
    id: "lens_q1",
    questionNumber: "Q1",
    category: "E3",
    categoryLabel: "E3 실행 성찰",
    indicator: "학습자 주도성",
    question: "학생이 자신의 역량과 속도에 맞게 주도적으로 참여하는가?",
    score: 5,
    evidence: "디지털 일대일 가이드봇이 단계적으로 학생들의 오개념을 짚어주고, Padlet에 실시간으로 생각을 공유하며 동료 동시 피드백을 통해 100% 능동적 참여를 관찰함."
  },
  {
    id: "lens_q2",
    questionNumber: "Q2",
    category: "D3",
    categoryLabel: "D3 설계 성찰",
    indicator: "깊이 있는 학습",
    question: "단순 검색을 넘어 개념 이해와 사고 확장을 위한 탐구를 촉진하는가?",
    score: 5,
    evidence: "초등 수학 성취기준 '유리수의 사칙계산' 원리를 탐구하는 단계에서 학생 맞춤형 디지털 시뮬레이터를 활용해 단순 연산 반복을 탈피하고 개념 시각화와 계산 절차의 정합성을 한 단계 높임."
  },
  {
    id: "lens_q3",
    questionNumber: "Q3",
    category: "F3",
    categoryLabel: "F3 평가 환류",
    indicator: "과정 중심 평가",
    question: "생성된 학습 데이터가 진단, 피드백, 다음 수업 설계로 유기적으로 이어지는가?",
    score: 5,
    evidence: "형성평가 직후 평가 대시보드 정답률을 추출하여 특정 문항(소수 나눗셈 소수점 배치)의 오답률 집중을 즉각 감지하고, 추출된 결손 데이터를 토대로 후속 5분 클리닉 연계 전략을 수립함."
  },
  {
    id: "lens_q4",
    questionNumber: "Q4",
    category: "D3",
    categoryLabel: "D3 설계 성찰",
    indicator: "실행 가능성",
    question: "학교급과 학생의 실제 수준에서 무리 없이 실행 가능한 설계인가?",
    score: 4,
    evidence: "도입(Padlet 질문탐색)-전개(시뮬레이터 탐구)-정리(형성평가) 흐름상 기기 조작 시간을 20분 이내로 적정 배치하여 기술 과잉을 방지하고, 초등 5학년 눈높이에 맞게 직관적 UI를 적용함."
  }
];

export const DEFAULT_KPT: KptReflection = {
  keep: "학습자 개별 데이터 수집 대시보드를 구축하여 학생의 고유한 도달 속도와 약점을 명확히 파악하고, 비주얼 피드백 시스템과 개별 순회 지도를 연계하여 연수 기법을 실제 교실에 적재적소 적용한 점이 탁월했음.",
  problem: "일부 디지털 기기 오작동 및 데이터 연결 딜레이로 인해 연수 진동 속도가 잠깐 둔화되었고, 일부 내성적 학생들이 AI 가이드를 탐색할 때 적극적으로 질문하지 못하는 사각지대가 다소 존재했음.",
  tryNext: "교실 Wi-Fi 환경 사전 점검표를 정례화하고 기기 보조 '테크-인턴' 제도를 모둠별로 운영해 트러블을 예방하며, AI 질의 시 가이드 템플릿(질문 3대 공식 형태)을 칠판에 시각화해 넉넉히 발문을 도울 예정."
};

export const PRESET_TEACHER_INFO: TeacherInfo = {
  schoolName: "서울미래초등학교",
  targetAudience: "초등 6학년 과학 (AI 융합)",
  teacherName: "심아람 교사",
  date: "2026-06-04",
  lessonTopic: "AI 자율주행 알고리즘 가상 차고 시뮬레이션을 활용한 환경 물리 탐구"
};

export const PRESET_RUBRIC_EVIDENCES: Record<string, string> = {
  lens_q1: "Padlet을 통해 자신이 설계한 주행 마찰계수 가상 데이터를 실시간 공유하고, 피드백 챗봇의 변형 추천 가이드를 토대로 학생 각자의 속도에 맞춰 자발적으로 주행 궤적을 수정함.",
  lens_q2: "가상 자율주행 코딩 센서 배치 툴을 과학과 지체 저하 에너지 보정 이론과 맞물리게 활용하여 단순 코딩 기능 습득을 넘어 AI 차량 역학 궤적 분석을 심층 탐구함.",
  lens_q3: "교사용 관제 대시보드 화면으로 탈선 빈도 및 센서 배치 미완성 구간을 실시간 모니터링하여 공기 저항 개념에 결손이 발생한 모둠을 선별 진단하고 다음 차시 탐구에 즉각 환류함.",
  lens_q4: "수업 전체 40분 중 기기 설명은 8분에 한정하고, 나머지 시간은 탐사선 트랙 완성과 동료 토론에 온전히 할애하여 초등 6학년 발달 수준에서 과부하 없이 완주 가능하도록 최적화함."
};

export const PRESET_KPT: KptReflection = {
  keep: "실시간 교사 대시보드를 통하여 수업 한가운데 학생의 성취 결손 지점을 한눈에 확인하고, 학생 맞춤형 동시적 개별화 피드백을 막힘없이 실행함.",
  problem: "센서 코딩 조작 시 일부 태블릿 드래그 감도 저하로 지연이 생겼고, 빠른 모둠과 연수 속도가 조율되지 않아 완성 후 대기하는 유휴 시간이 일부 관제됨.",
  tryNext: "심화 학습용 자유 실험 가상 서킷 트랙(Extra Space)을 사전에 AI 맵핑으로 제공해 속진 학생들이 유효한 융합 탐구를 개별적으로 추가하도록 세팅하겠음."
};

// Warm, beautifully designed default document preview SVGs
export const DEFAULT_PLAN_PREVIEW_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#fffdfa" rx="16" />
  <rect x="15" y="15" width="470" height="320" fill="#fcfaf7" rx="12" stroke="#e8e1d7" stroke-width="1.5" />
  <rect x="30" y="32" width="100" height="24" rx="6" fill="#e06a3b" />
  <text x="80" y="48" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">지도안 PDF</text>
  <text x="140" y="49" font-family="'Noto Sans KR', sans-serif" font-size="14" font-weight="bold" fill="#2d2823">본시 교수·학습 과정안 (지도안)</text>
  <line x1="30" y1="68" x2="470" y2="68" stroke="#e8e1d7" stroke-width="1" />
  
  <rect x="30" y="82" width="135" height="110" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <rect x="30" y="82" width="135" height="26" rx="8" fill="#f7f2eb" />
  <text x="97" y="99" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">[1] 도입 (10분)</text>
  <text x="40" y="125" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 전시 학습 상기 및 동기유발</text>
  <text x="40" y="145" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• Padlet 생각 열기 질문</text>
  <text x="40" y="165" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 학습 목표 및 활동 안내</text>

  <rect x="182" y="82" width="135" height="110" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <rect x="182" y="82" width="135" height="26" rx="8" fill="#fdf4eb" />
  <text x="249" y="99" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#c2410c" text-anchor="middle">[2] 전개 (25분)</text>
  <text x="192" y="125" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• AI 시뮬레이터 탐구</text>
  <text x="192" y="145" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 모둠별 데이터 분석 토의</text>
  <text x="192" y="165" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 맞춤형 Scaffolding 지원</text>

  <rect x="335" y="82" width="135" height="110" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <rect x="335" y="82" width="135" height="26" rx="8" fill="#f0fdf4" />
  <text x="402" y="99" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">[3] 정리 (5분)</text>
  <text x="345" y="125" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 형성평가 및 대시보드 환류</text>
  <text x="345" y="145" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 배움 성찰 일지 작성</text>
  <text x="345" y="165" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">• 차기 차시 예고</text>

  <rect x="30" y="206" width="440" height="95" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <text x="45" y="228" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#854d0e">📑 지도안 핵심 점검 사항 (수업 설계의 타당성)</text>
  <text x="45" y="250" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#6b5e52">✔ Q1. 학습자 주도성: 학생의 수준별 자기 주도 탐구 시간 충분히 보장</text>
  <text x="45" y="268" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#6b5e52">✔ Q2. 깊이 있는 학습: 단순 지식 습득을 넘어선 개념 확장 모델 적용</text>
  <text x="45" y="286" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#6b5e52">✔ Q4. 실행 가능성: 40분 정규 수업 내 무리 없는 기술 연계 흐름</text>
  
  <text x="460" y="322" font-family="'Noto Sans KR', sans-serif" font-size="9" font-weight="bold" fill="#a89a8c" text-anchor="end">※ PDF 내보내기 시 본 지도안 문서가 2페이지로 자동 병합됩니다</text>
</svg>
`)}`;

export const DEFAULT_MATERIAL_PREVIEW_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="#fffdfa" rx="16" />
  <rect x="15" y="15" width="470" height="320" fill="#fcfaf7" rx="12" stroke="#e8e1d7" stroke-width="1.5" />
  <rect x="30" y="32" width="110" height="24" rx="6" fill="#2d6a4f" />
  <text x="85" y="48" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">학습자료 PDF</text>
  <text x="150" y="49" font-family="'Noto Sans KR', sans-serif" font-size="14" font-weight="bold" fill="#2d2823">학생용 맞춤형 탐구 활동지 및 대시보드</text>
  <line x1="30" y1="68" x2="470" y2="68" stroke="#e8e1d7" stroke-width="1" />

  <rect x="30" y="82" width="210" height="135" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <text x="45" y="104" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#1b4332">📊 학생 실시간 진단 대시보드</text>
  <line x1="45" y1="112" x2="225" y2="112" stroke="#f0ece6" stroke-width="1" />
  
  <rect x="45" y="124" width="70" height="36" rx="6" fill="#f0fdf4" stroke="#dcfce7" stroke-width="1" />
  <text x="80" y="139" font-family="'Noto Sans KR', sans-serif" font-size="9" fill="#15803d" text-anchor="middle">정답률</text>
  <text x="80" y="154" font-family="'Noto Sans KR', sans-serif" font-size="13" font-weight="bold" fill="#166534" text-anchor="middle">92.4%</text>

  <rect x="125" y="124" width="100" height="36" rx="6" fill="#eff6ff" stroke="#dbeafe" stroke-width="1" />
  <text x="175" y="139" font-family="'Noto Sans KR', sans-serif" font-size="9" fill="#1d4ed8" text-anchor="middle">참여 학생</text>
  <text x="175" y="154" font-family="'Noto Sans KR', sans-serif" font-size="13" font-weight="bold" fill="#1e40af" text-anchor="middle">24명 (전원)</text>

  <rect x="45" y="170" width="180" height="34" rx="6" fill="#faf5ff" stroke="#f3e8ff" stroke-width="1" />
  <text x="55" y="184" font-family="'Noto Sans KR', sans-serif" font-size="9" font-weight="bold" fill="#6b21a8">⚡ 즉각 피드백 제공율</text>
  <text x="55" y="197" font-family="'Noto Sans KR', sans-serif" font-size="10" font-weight="bold" fill="#581c87">오개념 발견 즉시 힌트봇 작동 완료</text>

  <rect x="255" y="82" width="215" height="135" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <text x="270" y="104" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#9a3412">📝 학생 맞춤형 탐구 활동지</text>
  <line x1="270" y1="112" x2="455" y2="112" stroke="#f0ece6" stroke-width="1" />
  <text x="270" y="130" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">[탐구 1] AI 시뮬레이터 수치 관찰 기록</text>
  <text x="270" y="148" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">[탐구 2] 분수 사칙 연산 규칙 추론하기</text>
  <text x="270" y="166" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#574c43">[탐구 3] 짝과 대시보드 결과 교차 점검</text>
  <text x="270" y="186" font-family="'Noto Sans KR', sans-serif" font-size="9" fill="#c2410c">⭐ 배움 성장 루브릭 자가 체크리스트 수록</text>

  <rect x="30" y="230" width="440" height="70" rx="8" fill="#ffffff" stroke="#e8dfd5" stroke-width="1" />
  <text x="45" y="252" font-family="'Noto Sans KR', sans-serif" font-size="11" font-weight="bold" fill="#1e3a8a">🔄 Q3. 과정 중심 평가 환류 정합성</text>
  <text x="45" y="272" font-family="'Noto Sans KR', sans-serif" font-size="10" fill="#6b5e52">본 학습자료를 통해 수집된 정량/정성 평가 데이터는 실시간 피드백 및 다음 차시 심화 학습 설계로 완벽히 연계됩니다.</text>
  
  <text x="460" y="322" font-family="'Noto Sans KR', sans-serif" font-size="9" font-weight="bold" fill="#a89a8c" text-anchor="end">※ PDF 내보내기 시 본 학습자료가 3페이지로 자동 병합됩니다</text>
</svg>
`)}`;

export const DEFAULT_PLAN_DOC: AttachedDocument = {
  name: "2026_수업지도안_요약본.pdf",
  type: "pdf",
  dataUrl: DEFAULT_PLAN_PREVIEW_SVG,
  fileSize: "1.2 MB",
  pageCount: 1,
};

export const DEFAULT_MATERIAL_DOC: AttachedDocument = {
  name: "2026_학생용_학습자료_및_대시보드.pdf",
  type: "pdf",
  dataUrl: DEFAULT_MATERIAL_PREVIEW_SVG,
  fileSize: "1.8 MB",
  pageCount: 1,
};

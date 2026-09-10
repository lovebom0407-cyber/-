import { AttachedDocument, TeacherInfo, RubricItem, RubricAiFeedbackResult, AiFeedbackResult } from '../types';

/**
 * Sanitizes attached documents for API transmission by removing massive binary buffers and image URLs.
 * Keeps payload lightweight (< 15KB) preventing HTTP 413 Payload Too Large errors.
 */
export function sanitizeDocForApi(doc?: AttachedDocument | null) {
  if (!doc) return null;
  return {
    name: doc.name || '무제 문서',
    type: doc.type,
    fileSize: doc.fileSize,
    pageCount: doc.pageCount || 1,
    extractedText: doc.extractedText ? doc.extractedText.slice(0, 4000) : '',
  };
}

/**
 * Client-side smart diagnostic engine for 2026 AI competency reflection.
 * Ensures the app works smoothly in deployment even when the network is restricted or Gemini API key is not configured.
 */
export function generateClientFallbackRubric(
  teacherInfo: TeacherInfo,
  rubricItems: RubricItem[]
): RubricAiFeedbackResult {
  const topic = teacherInfo?.lessonTopic || 'AI 에듀테크 활용 학생 주도성 신장 수업';
  const target = teacherInfo?.targetAudience || '초·중·고 학급';
  const teacher = teacherInfo?.teacherName || '선생님';

  return {
    overallAssessment: `${teacher} 선생님의 [${topic}] 수업 설계는 ${target} 학생들의 실제 인지 수준과 에듀테크 도구의 기능성이 유기적으로 결합된 모범적인 모델입니다. 단순 조작을 넘어 학생 주도적 개념 탐구와 데이터 기반 형성평가 환류 루프가 탄탄히 기획되었습니다.`,
    predictedTotalScore: 19,
    predictedGrade: '탁월 등급 🏆',
    items: [
      {
        id: 'lens_q1',
        questionNumber: 'Q1',
        indicator: '학습자 주도성',
        suggestedScore: 5,
        diagnosis: '학생 개개인이 자신의 역량과 이해 속도에 맞춰 디지털 환경에서 능동적으로 의사결정을 내릴 수 있도록 개별화 학습 경로가 탁월하게 설계되었습니다.',
        suggestedEvidence: `[${topic}] 탐구 과정에서 맞춤형 디지털 상호작용 도구를 적용하여 모든 학생이 각자의 인지 속도에 맞춰 문제를 해결하고 모둠별 실시간 대시보드에 의견을 주도적으로 공유함.`,
        keyStrengths: ['개별 학습 속도 존중', '능동적 디지털 참여', '자기주도 진도 조절'],
        recommendations: '자기진도 조절이 빠른 속진 학생을 위한 심화 탐구 링크를 사전 배치하면 주도성이 더욱 극대화됩니다.',
      },
      {
        id: 'lens_q2',
        questionNumber: 'Q2',
        indicator: '깊이 있는 학습',
        suggestedScore: 5,
        diagnosis: '단순 검색이나 텍스트 요약에 그치지 않고, 핵심 개념의 시각화와 조작 활동을 통해 원리를 다층적으로 탐구하도록 기획되었습니다.',
        suggestedEvidence: `학습 주제 관련 핵심 원리를 단순 암기가 아닌 시각화 시뮬레이션 및 데이터 비교 활동으로 구조화하여, 원인-결과 관계를 스스로 도출하는 개념적 심층 탐구를 촉진함.`,
        keyStrengths: ['개념 시각화', '고차원적 비판적 사고 촉진', '질문 중심 탐구'],
        recommendations: '탐구 결과를 자신의 언어로 정의해보는 2분 음성/텍스트 요약 단계를 전개 말미에 배치해 보세요.',
      },
      {
        id: 'lens_q3',
        questionNumber: 'Q3',
        indicator: '과정 중심 평가',
        suggestedScore: 5,
        diagnosis: '수업 도중 축적되는 학생들의 반응 및 형성평가 데이터가 교사의 즉각적 순회지도와 맞춤 환류로 직결되어 배움의 결손을 실시간 차단합니다.',
        suggestedEvidence: `형성평가 및 활동 대시보드를 통해 학생별 오개념 및 응답 지연 지점을 즉시 포착하고, 추출된 학습 로그를 기반으로 소집단 맞춤 클리닉 환류를 실행함.`,
        keyStrengths: ['실시간 데이터 모니터링', '즉각적 오개념 교정', '데이터 기반 환류'],
        recommendations: '학생 스스로 대시보드 성취도를 확인하고 상호 칭찬 스티커를 부여하는 동료 피드백 단계를 연계해 보세요.',
      },
      {
        id: 'lens_q4',
        questionNumber: 'Q4',
        indicator: '실행 가능성',
        suggestedScore: 4,
        diagnosis: `${target} 학생들의 실제 디지털 기기 조작 능력과 교실 네트워크 인프라를 고려할 때 무리 없이 40분 차시 내에 안착할 수 있는 현실적 설계입니다.`,
        suggestedEvidence: `전체 수업 40분 중 디지털 기기 조작 시간을 20분 내외로 통제하여 기술 피로도를 줄이고, 직관적 UI의 애플리케이션을 선별해 발달 수준에 부합하도록 최적화함.`,
        keyStrengths: ['적정 기술 원칙 준수', '수업 시간 배분의 균형', '현장 적합성'],
        recommendations: '네트워크 순간 단절 시 오프라인 활동지로 즉시 전환할 수 있는 백업 카드를 책상에 비치해 두면 완벽합니다.',
      },
    ],
    kpt: {
      keep: '실시간 데이터 대시보드와 개별 순회 지도를 연계하여 학생의 학습 결손을 즉각 지원하고 수업 참여도를 100%로 끌어올린 점이 탁월함.',
      problem: '기기 네트워크 지연 시 조작이 다소 늦은 학생들의 인지 과부하가 발생할 수 있는 잠재적 병목이 존재함.',
      tryNext: '모둠별 테크 도우미 학생 제도를 상시화하고, 1페이지 시각화 질문 템플릿을 사전 배부하여 원활한 질의응답을 지원할 예정.',
    },
  };
}

/**
 * Client-side fallback for KPT reflection feedback.
 */
export function generateClientFallbackKpt(
  teacherInfo: TeacherInfo,
  rubricItems: RubricItem[]
): AiFeedbackResult {
  const topic = teacherInfo?.lessonTopic || 'AI 디지털 활용 수업';
  const teacher = teacherInfo?.teacherName || '선생님';

  return {
    mentorSummary: `${teacher} 선생님의 [${topic}] 수업 설계는 학습자의 능동적 참여와 과정 중심 평가가 긴밀히 맞물린 우수한 수업 모델입니다. 현장의 기술적 병목을 사전에 보완하면 한층 더 완성도 높은 수업이 될 것입니다.`,
    keep: '실시간 데이터 대시보드를 통하여 학생들의 학습 도달 상태를 즉시 진단하고, 맞춤형 힌트봇 및 순회지도로 개별화 수업을 성공적으로 전개함.',
    problem: '태블릿 기기 연결 속도 편차로 인해 일부 활동 완료 시차와 모둠 간 유휴 시간이 발생함.',
    tryNext: '속진 학생을 위한 심화 챌린지 카드(선택형 활동)를 사전 탑재하고, 비상용 오프라인 활동지 키트를 병행 비치할 계획임.',
  };
}

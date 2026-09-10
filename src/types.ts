export type RubricCategory = 'D3' | 'E3' | 'F3';

export interface TeacherInfo {
  schoolName: string;
  targetAudience: string;
  teacherName: string;
  lessonTopic: string;
  date: string;
}

export interface RubricItem {
  id: string;
  questionNumber: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  category: RubricCategory;
  categoryLabel: string;
  indicator: string;
  question: string;
  score: number;
  evidence: string;
}

export interface KptReflection {
  keep: string;
  problem: string;
  tryNext: string;
  aiFeedback?: string; // AI 수석교사 멘토링 코멘트
}

export interface AiFeedbackResult {
  mentorSummary: string;
  keep: string;
  problem: string;
  tryNext: string;
}

export interface AttachedDocument {
  name: string;
  type: 'pdf' | 'image';
  dataUrl: string; // base64, canvas image, or preview data URL
  fileSize?: string;
  pageCount?: number;
  pdfBytes?: Uint8Array; // stored for pdf-lib merging
  blobUrl?: string; // object URL for native iframe/embed viewing
  extractedText?: string; // text extracted from PDF for deep AI understanding
  pageImages?: string[]; // rendered canvas images for each page
}

export interface RubricAiFeedbackItem {
  id: string; // 'lens_q1', 'lens_q2', 'lens_q3', 'lens_q4'
  questionNumber: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  suggestedScore: number; // 1 ~ 5
  indicator: string;
  diagnosis: string; // 수석교사 1차 진단 코멘트
  suggestedEvidence: string; // 추천 실천 근거 서술문
  keyStrengths: string[]; // 강점 키워드/포인트
  recommendations: string; // 수업 개선 권장 가이드
}

export interface RubricAiFeedbackResult {
  overallAssessment: string; // 수석교사 종합 총평
  predictedTotalScore: number; // 20점 만점 기준 예상 점수
  predictedGrade: string; // 탁월 / 우수 / 성장 등급
  items: RubricAiFeedbackItem[];
  kpt: {
    keep: string;
    problem: string;
    tryNext: string;
  };
}

export interface ImageModalData {
  src: string;
  title: string;
  isPdf?: boolean;
}

export interface SerializedState {
  b: TeacherInfo;
  c: Array<{
    id: string;
    s: number;
    e: string;
  }>;
  k: KptReflection;
  f?: string;
  lp?: string; // plan doc data
  di?: string; // material doc data
  af?: string; // ai feedback
}

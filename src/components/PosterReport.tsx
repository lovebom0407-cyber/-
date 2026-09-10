import React, { RefObject } from 'react';
import {
  Printer,
  Sparkle,
  Award,
  CircleCheck,
  ZoomIn,
  FileText,
  Compass,
  Brain,
  Clock,
  ShieldCheck,
  FileCheck2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { TeacherInfo, RubricItem, KptReflection, AttachedDocument, ImageModalData } from '../types';

interface PosterReportProps {
  posterRef: RefObject<HTMLDivElement | null>;
  isViewOnly: boolean;
  isFullView: boolean;
  teacherInfo: TeacherInfo;
  rubricItems: RubricItem[];
  kpt: KptReflection;
  planDoc: AttachedDocument | null;
  materialDoc: AttachedDocument | null;
  onOpenPdfModal: () => void;
  onOpenImageModal: (data: ImageModalData) => void;
  onOpenAiFeedbackModal?: () => void;
}

export const PosterReport: React.FC<PosterReportProps> = ({
  posterRef,
  isViewOnly,
  isFullView,
  teacherInfo,
  rubricItems,
  kpt,
  planDoc,
  materialDoc,
  onOpenPdfModal,
  onOpenImageModal,
  onOpenAiFeedbackModal,
}) => {
  const totalScore = rubricItems.reduce((acc, curr) => acc + curr.score, 0);

  // Sub-scores
  const d3Score = rubricItems
    .filter((item) => item.category === 'D3')
    .reduce((acc, curr) => acc + curr.score, 0); // max 10 (Q2 + Q4)

  const e3Score = rubricItems
    .filter((item) => item.category === 'E3')
    .reduce((acc, curr) => acc + curr.score, 0); // max 5 (Q1)

  const f3Score = rubricItems
    .filter((item) => item.category === 'F3')
    .reduce((acc, curr) => acc + curr.score, 0); // max 5 (Q3)

  const getEvaluationGrade = (score: number) => {
    if (score >= 18) return '타당성: 탁월 등급 🏆';
    if (score >= 15) return '타당성: 우수 등급 ⭐';
    if (score >= 12) return '타당성: 성장 등급 🌱';
    return '타당성: 노력 등급 💡';
  };

  const getQuestionIcon = (qNum: string) => {
    switch (qNum) {
      case 'Q1':
        return <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
      case 'Q2':
        return <Brain className="w-3.5 h-3.5 text-amber-700 shrink-0" />;
      case 'Q3':
        return <Clock className="w-3.5 h-3.5 text-indigo-700 shrink-0" />;
      case 'Q4':
        return <ShieldCheck className="w-3.5 h-3.5 text-orange-700 shrink-0" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-stone-700 shrink-0" />;
    }
  };

  return (
    <div
      className={`${
        isViewOnly || isFullView ? 'w-full max-w-6xl 2xl:max-w-7xl mx-auto' : 'w-full'
      } flex flex-col space-y-4 print-wrap`}
    >
      {/* Top Preview Controls (hidden on print) */}
      <div className="no-print bg-[#fffefc] rounded-2xl p-4 border border-[#ebdcd0] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
          </span>
          <span className="text-xs sm:text-sm font-bold text-stone-700">
            실시간 성장 리포트 포스터 미리보기
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {!isViewOnly && onOpenAiFeedbackModal && (
            <button
              id="btn-preview-ai-feedback"
              type="button"
              onClick={onOpenAiFeedbackModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-bold rounded-xl transition-all shadow-3xs cursor-pointer"
              title="수석교사 AI 피드백을 확인하고 KPT를 다듬습니다"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>수석교사 AI 피드백</span>
            </button>
          )}

          <button
            id="btn-open-pdf-modal"
            type="button"
            onClick={onOpenPdfModal}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-orange-100 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF 내보내기 (교수학습자료 자동 병합)</span>
          </button>
        </div>
      </div>

      {/* Actual Poster Container */}
      <div
        ref={posterRef}
        id="print-poster"
        className="print-area bg-[#fffdf9] rounded-3xl border border-[#e8ded5] p-6 sm:p-8 lg:p-10 xl:p-12 print:p-5 shadow-xl shadow-stone-100 flex flex-col space-y-7 print:space-y-4 relative overflow-hidden transition-all print-wrap"
      >
        {/* Frame Border with warm tone */}
        <div className="absolute inset-0 border-4 border-[#2d241e] pointer-events-none rounded-3xl margin-3 opacity-90 m-3 z-10" />

        {/* Watermark */}
        <div className="absolute right-8 top-8 text-[#ebdcd0]/35 font-mono text-[60px] leading-none font-bold select-none pointer-events-none tracking-tight">
          A.I COOP
        </div>

        {/* Poster Header */}
        <div className="text-center space-y-3.5 print:space-y-2 relative pt-3 pb-2.5 print:pt-1 print:pb-1 border-b-2 border-double border-[#2d241e]/85">
          <div className="inline-flex items-center space-x-2 bg-[#2d241e] text-[#fbf8f3] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest z-20 shadow-xs">
            <Sparkle className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>렌즈 1: 수업 설계의 타당성 점검 (동료 교차 피드백)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#231f1d] tracking-tight leading-tight">
            나의 수업 성장 리포트
          </h2>

          {/* 4 Metadata Columns */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 print:gap-1 text-center bg-[#f7f2ec] p-3 print:p-1.5 rounded-2xl border border-[#ebdcd0] text-xs font-semibold text-stone-600">
            <div className="p-1">
              <span className="text-stone-400 font-bold block text-[10px] sm:text-xs">소속</span>
              <span className="text-stone-800 text-xs sm:text-sm font-bold truncate block mt-0.5">
                {teacherInfo.schoolName || '미입력'}
              </span>
            </div>
            <div className="border-l border-[#ebdcd0] p-1">
              <span className="text-stone-400 font-bold block text-[10px] sm:text-xs">적용 대상</span>
              <span className="text-stone-800 text-xs sm:text-sm font-bold truncate block mt-0.5">
                {teacherInfo.targetAudience || '미입력'}
              </span>
            </div>
            <div className="border-l border-[#ebdcd0] p-1">
              <span className="text-stone-400 font-bold block text-[10px] sm:text-xs">수업자</span>
              <span className="text-stone-800 text-xs sm:text-sm font-bold truncate block mt-0.5">
                {teacherInfo.teacherName || '미입력'}
              </span>
            </div>
            <div className="border-l border-[#ebdcd0] p-1">
              <span className="text-stone-400 font-bold block text-[10px] sm:text-xs">작성일</span>
              <span className="text-stone-800 text-xs sm:text-sm font-bold block mt-0.5">
                {teacherInfo.date || '미입력'}
              </span>
            </div>
          </div>

          {teacherInfo.lessonTopic && (
            <div className="pt-2 text-center">
              <span className="text-xs bg-amber-100/80 text-amber-900 font-extrabold px-3 py-1 rounded-lg border border-amber-200">
                본시 학습 단원 및 주제
              </span>
              <p className="text-sm sm:text-base font-bold text-stone-800 mt-1.5 max-w-4xl mx-auto leading-relaxed">
                {teacherInfo.lessonTopic}
              </p>
            </div>
          )}
        </div>

        {/* Row 1: Achievement Diagram (Gauge) + 4 Lens Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Gauge & Progress (4 cols on lg screens for optimal horizontal balance) */}
          <div className="print-avoid-break lg:col-span-5 xl:col-span-4 bg-gradient-to-tr from-[#fbf8f3] to-[#f5eee6] p-5 rounded-2xl border border-[#ebdcd0] flex flex-col justify-between space-y-4 shadow-3xs">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-700" />
                <span>타당성 점검 종합 게이지</span>
              </span>
              <span className="text-xs bg-amber-100 font-mono font-bold text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                20점 만점
              </span>
            </div>

            {/* Circular Gauge for 20 points */}
            <div className="flex items-center justify-center py-2">
              <svg viewBox="0 0 160 160" className="w-40 h-40 sm:w-44 sm:h-44">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#ebdcd0"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#2d241e"
                  strokeWidth="8"
                  strokeDasharray={`${(totalScore / 20) * 440} 440`}
                  transform="rotate(-90 80 80)"
                  strokeLinecap="round"
                />
                <text
                  x="80"
                  y="70"
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="extrabold"
                  fontSize="28"
                  fill="#231f1d"
                >
                  {totalScore}
                </text>
                <text
                  x="80"
                  y="90"
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="bold"
                  fontSize="9"
                  fill="#786f66"
                >
                  / 20점 만점
                </text>
                <rect
                  x="25"
                  y="108"
                  width="110"
                  height="20"
                  rx="10"
                  fill="#2d241e"
                />
                <text
                  x="80"
                  y="121"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  fontSize="8.5"
                  fill="#ffffff"
                >
                  {getEvaluationGrade(totalScore)}
                </text>
              </svg>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-2.5 text-xs font-semibold text-stone-600 pt-2 border-t border-[#ebdcd0]">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>D3 설계 성찰 (Q2 탐구 + Q4 실행가능성)</span>
                  <span className="text-stone-800 font-extrabold">{d3Score} / 10점</span>
                </div>
                <div className="w-full h-2 bg-[#ebdcd0] rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(d3Score / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>E3 실행 성찰 (Q1 학습자 주도성)</span>
                  <span className="text-stone-800 font-extrabold">{e3Score} / 5점</span>
                </div>
                <div className="w-full h-2 bg-[#ebdcd0] rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(e3Score / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>F3 평가 환류 (Q3 과정 중심 평가)</span>
                  <span className="text-stone-800 font-extrabold">{f3Score} / 5점</span>
                </div>
                <div className="w-full h-2 bg-[#ebdcd0] rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(f3Score / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: 4 Core Lens Items (8 cols on lg screens for spacious, readable text) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-3 font-semibold">
            <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center space-x-1.5 border-b border-[#ebdcd0] pb-2">
              <CircleCheck className="w-4 h-4 text-emerald-600" />
              <span>렌즈 1: 4대 핵심 질문별 서술 데이터 (자가평가 및 실천근거)</span>
            </span>

            <div className="space-y-3 text-xs leading-relaxed text-stone-600 pr-1">
              {rubricItems.map((item) => (
                <div
                  key={item.id}
                  className="print-avoid-break bg-[#fcfaf7] hover:bg-[#faf5ee] p-3.5 sm:p-4 rounded-2xl border border-[#ebdcd0]/90 transition-colors shadow-3xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center space-x-2">
                      {getQuestionIcon(item.questionNumber)}
                      <span className="font-extrabold text-stone-900 text-xs bg-white border border-[#e4d7cc] rounded-lg px-2.5 py-1 shadow-3xs">
                        {item.questionNumber}. {item.indicator}
                      </span>
                      <span className="text-stone-500 font-bold text-xs">
                        ({item.categoryLabel})
                      </span>
                    </div>
                    <span className="font-extrabold text-amber-900 ml-auto bg-amber-50 border border-amber-300/80 px-2.5 py-1 rounded-lg text-xs shadow-3xs">
                      {item.score}점 / 5점
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-bold text-stone-900 mt-1 leading-snug">
                    {item.question}
                  </p>
                  <div className="text-xs sm:text-[13px] text-stone-700 mt-2 bg-white p-3 rounded-xl border border-[#ede3da] leading-relaxed shadow-3xs">
                    <span className="font-bold text-amber-800 mr-1.5">[실천 근거]</span>
                    {item.evidence || '서술된 실천 근거가 없습니다.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Visual Evidence Documents (교수학습자료) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebdcd0] pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <span className="text-xs sm:text-sm font-bold text-stone-800">
                주요 교수학습자료 (PDF 첨부)
              </span>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              지도안 PDF 및 학습자료 PDF (PDF 내보내기 시 후속 페이지 자동 병합)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1) 지도안 PDF Card */}
            <div className="print-avoid-break space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs sm:text-sm font-bold text-stone-700 flex items-center space-x-1.5">
                  <FileCheck2 className="w-4 h-4 text-orange-600" />
                  <span>1) 지도안 PDF</span>
                </span>
                <span className="text-xs text-amber-900 bg-amber-100 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                  {planDoc?.name || '지도안 문서'}
                </span>
              </div>

              <div
                onClick={() => {
                  if (planDoc?.dataUrl) {
                    onOpenImageModal({
                      src: planDoc.dataUrl,
                      title: `지도안 PDF - ${planDoc.name}`,
                      isPdf: planDoc.type === 'pdf',
                    });
                  }
                }}
                className="w-full aspect-[16/10] max-h-[340px] bg-[#fcfaf7] rounded-2xl overflow-hidden border border-[#ebdcd0] flex items-center justify-center p-2 shadow-sm hover:shadow-md hover:border-amber-400 hover:scale-[1.005] active:scale-[99.5%] transition-all duration-300 cursor-zoom-in relative group"
              >
                {planDoc?.dataUrl ? (
                  <>
                    <img
                      src={planDoc.dataUrl}
                      className="w-full h-full object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                      alt="지도안 미리보기"
                      referrerPolicy="no-referrer"
                    />
                    <div className="no-print absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-stone-900/90 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 flex items-center space-x-2 transform scale-95 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-4 h-4 text-amber-400" />
                        <span>문서 원본 확대보기</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-stone-400">
                    <FileText className="w-8 h-8 mx-auto opacity-50 mb-1.5" />
                    <span className="text-xs">지도안 PDF 미등록</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2) 학습자료 PDF Card */}
            <div className="print-avoid-break space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs sm:text-sm font-bold text-stone-700 flex items-center space-x-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>2) 학습자료 PDF</span>
                </span>
                <span className="text-xs text-emerald-900 bg-emerald-100 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                  {materialDoc?.name || '학습자료 문서'}
                </span>
              </div>

              <div
                onClick={() => {
                  if (materialDoc?.dataUrl) {
                    onOpenImageModal({
                      src: materialDoc.dataUrl,
                      title: `학습자료 PDF - ${materialDoc.name}`,
                      isPdf: materialDoc.type === 'pdf',
                    });
                  }
                }}
                className="w-full aspect-[16/10] max-h-[340px] bg-[#fcfaf7] rounded-2xl overflow-hidden border border-[#ebdcd0] flex items-center justify-center p-2 shadow-sm hover:shadow-md hover:border-emerald-400 hover:scale-[1.005] active:scale-[99.5%] transition-all duration-300 cursor-zoom-in relative group"
              >
                {materialDoc?.dataUrl ? (
                  <>
                    <img
                      src={materialDoc.dataUrl}
                      className="w-full h-full object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                      alt="학습자료 미리보기"
                      referrerPolicy="no-referrer"
                    />
                    <div className="no-print absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-stone-900/90 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 flex items-center space-x-2 transform scale-95 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-4 h-4 text-emerald-400" />
                        <span>문서 원본 확대보기</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-stone-400">
                    <FileText className="w-8 h-8 mx-auto opacity-50 mb-1.5" />
                    <span className="text-xs">학습자료 PDF 미등록</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Senior Teacher Mentor Quote Banner (if present) */}
        {kpt.aiFeedback && (
          <div className="print-avoid-break p-4 sm:p-5 bg-gradient-to-r from-amber-50/95 via-[#fffdfa] to-orange-50/90 rounded-2xl border border-amber-300/80 shadow-3xs flex items-start space-x-3.5">
            <div className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white p-2.5 rounded-2xl shrink-0 shadow-2xs mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 grow min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wide font-serif">
                  수석교사 맞춤형 성장 멘토링 코멘트
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-mono font-bold">
                  전문가 자문
                </span>
              </div>
              <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-serif italic text-stone-850">
                &ldquo;{kpt.aiFeedback}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Row 3: KPT Retrospective Cards (Warm & Friendly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-5">
          {/* Keep */}
          <div className="print-avoid-break p-4 sm:p-5 bg-[#f0f7f2] rounded-2xl border border-emerald-200/80 flex flex-col space-y-2 relative overflow-hidden shadow-2xs">
            <div className="absolute right-4 top-3 text-emerald-200/70 font-bold text-4xl font-mono leading-none select-none pointer-events-none">
              K
            </div>
            <span className="text-xs font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 w-fit px-2.5 py-1 rounded-lg">
              Keep 잘된 점
            </span>
            <p className="text-stone-800 text-xs sm:text-[13px] leading-relaxed font-medium mt-1">
              {kpt.keep || '수업 실행상 입증된 교육 보편적 장점을 여기에 서술할 수 있습니다.'}
            </p>
          </div>

          {/* Problem */}
          <div className="print-avoid-break p-4 sm:p-5 bg-[#fdf4ee] rounded-2xl border border-orange-200/80 flex flex-col space-y-2 relative overflow-hidden shadow-2xs">
            <div className="absolute right-4 top-3 text-orange-200/70 font-bold text-4xl font-mono leading-none select-none pointer-events-none">
              P
            </div>
            <span className="text-xs font-extrabold uppercase bg-orange-100 text-orange-900 border border-orange-300 w-fit px-2.5 py-1 rounded-lg">
              Problem 아쉬운 점
            </span>
            <p className="text-stone-800 text-xs sm:text-[13px] leading-relaxed font-medium mt-1">
              {kpt.problem || '수업 중 포착된 기기 장해 및 배움의 병목 요소를 기재해 주세요.'}
            </p>
          </div>

          {/* Try */}
          <div className="print-avoid-break p-4 sm:p-5 bg-[#f0f5fb] rounded-2xl border border-blue-200/80 flex flex-col space-y-2 relative overflow-hidden shadow-2xs">
            <div className="absolute right-4 top-3 text-blue-200/70 font-bold text-4xl font-mono leading-none select-none pointer-events-none">
              T
            </div>
            <span className="text-xs font-extrabold uppercase bg-blue-100 text-blue-900 border border-blue-300 w-fit px-2.5 py-1 rounded-lg">
              Try 실행 개선안
            </span>
            <p className="text-stone-800 text-xs sm:text-[13px] leading-relaxed font-medium mt-1">
              {kpt.tryNext || '차기 차시 수업에서 시도해볼 새로운 디지털 발문 및 교수 아이디어를 서술하세요.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#ebdcd0] flex items-center justify-between text-stone-500 text-xs font-bold">
          <p>© 2026 교원 대상 AI 디지털 활용 교육 연수 전문 성장 리포트 양식</p>
          <div className="flex items-center space-x-2 text-stone-700">
            <span>AI 디지털 활용 선도교사 양성 연수</span>
            <div className="w-6 h-6 rounded-full border border-red-500/60 flex items-center justify-center font-extrabold font-serif text-[9px] bg-red-50 text-red-700 shadow-3xs">
              印
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

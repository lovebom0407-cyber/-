import React, { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  School,
  Layers,
  User,
  FileText,
  Calendar,
  Lightbulb,
  ArrowRight,
  Compass,
  Brain,
  Clock,
  ShieldCheck,
  Upload,
  FileCheck2,
  File,
  Check,
  ChevronRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { TeacherInfo, RubricItem, KptReflection, AttachedDocument } from '../types';

interface EditorStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  teacherInfo: TeacherInfo;
  onTeacherInfoChange: (info: TeacherInfo) => void;
  rubricItems: RubricItem[];
  onRubricItemChange: (id: string, score: number, evidence: string) => void;
  kpt: KptReflection;
  onKptChange: (kpt: KptReflection) => void;
  planDoc: AttachedDocument | null;
  materialDoc: AttachedDocument | null;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>, type: 'plan' | 'material') => void;
  onComplete: () => void;
  onOpenAiFeedback: () => void;
  onOpenAiFeedbackTab?: () => void;
}

export const EditorSteps: React.FC<EditorStepsProps> = ({
  currentStep,
  onStepChange,
  teacherInfo,
  onTeacherInfoChange,
  rubricItems,
  onRubricItemChange,
  kpt,
  onKptChange,
  planDoc,
  materialDoc,
  onFileUpload,
  onComplete,
  onOpenAiFeedback,
  onOpenAiFeedbackTab,
}) => {
  const totalScore = rubricItems.reduce((acc, curr) => acc + curr.score, 0);

  const getEvaluationGrade = (score: number) => {
    if (score >= 18) return '탁월 등급 🏆';
    if (score >= 15) return '우수 등급 ⭐';
    if (score >= 12) return '성장 등급 🌱';
    return '노력 등급 💡';
  };

  const getQuestionIcon = (qNum: string) => {
    switch (qNum) {
      case 'Q1':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'Q2':
        return <Brain className="w-4 h-4 text-amber-600" />;
      case 'Q3':
        return <Clock className="w-4 h-4 text-indigo-600" />;
      case 'Q4':
        return <ShieldCheck className="w-4 h-4 text-orange-600" />;
      default:
        return <Compass className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="no-print w-full flex flex-col space-y-6">
      {/* Stepper Navigation */}
      <div className="bg-[#fffefc] rounded-2xl p-4 border border-[#ebdcd0] shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
          <button
            type="button"
            onClick={() => onStepChange(0)}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
              currentStep === 0
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent hover:text-stone-600'
            }`}
          >
            <span>1. 기본 정보 입력</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <button
            type="button"
            onClick={() => onStepChange(1)}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
              currentStep === 1
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent hover:text-stone-600'
            }`}
          >
            <span>2. 교수학습자료 탑재</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <button
            type="button"
            onClick={() => onStepChange(2)}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
              currentStep === 2
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent hover:text-stone-600'
            }`}
          >
            <span>3. 성찰 점수 및 서술</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: 기본 정보 입력 */}
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="bg-[#fffefc] rounded-3xl p-6 border border-[#ebdcd0] shadow-2xs space-y-6"
          >
            <div className="border-b border-[#ebdcd0]/70 pb-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-amber-50 text-amber-700 p-2 rounded-xl border border-amber-200/60">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-800">
                    수업 기본 개요 입력
                  </h2>
                  <p className="text-xs text-stone-400">선생님 및 수업 대상 기본 정보</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 font-mono">
                Step 1 / 3
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1.5 flex items-center space-x-1">
                    <School className="w-3.5 h-3.5 text-stone-400" />
                    <span>소속 학교명</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all placeholder-stone-300 text-stone-700"
                    placeholder="예시: 온누리초등학교"
                    value={teacherInfo.schoolName}
                    onChange={(e) =>
                      onTeacherInfoChange({ ...teacherInfo, schoolName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1.5 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    <span>적용 대상 학년 및 과목</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all placeholder-stone-300 text-stone-700"
                    placeholder="예시: 초등 5학년 수학"
                    value={teacherInfo.targetAudience}
                    onChange={(e) =>
                      onTeacherInfoChange({ ...teacherInfo, targetAudience: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>수업자 성명</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all placeholder-stone-300 text-stone-700"
                  placeholder="예시: 김은서 교사"
                  value={teacherInfo.teacherName}
                  onChange={(e) =>
                    onTeacherInfoChange({ ...teacherInfo, teacherName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>본시 학습 단원/주제</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all placeholder-stone-300 text-stone-700"
                  placeholder="예시: AI 에듀테크 기반 분수와 소수의 사칙 연산 심화 탐험"
                  value={teacherInfo.lessonTopic}
                  onChange={(e) =>
                    onTeacherInfoChange({ ...teacherInfo, lessonTopic: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>성찰 일자</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcd0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all text-stone-700"
                  value={teacherInfo.date}
                  onChange={(e) =>
                    onTeacherInfoChange({ ...teacherInfo, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#ebdcd0]/70 flex justify-between items-center">
              <div className="text-xs text-stone-500 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>정보를 입력하면 실시간 포스터 헤더에 즉각 반영됩니다.</span>
              </div>
              <button
                type="button"
                onClick={() => onStepChange(1)}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-100 cursor-pointer"
              >
                <span>교수학습자료 탑재</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1: 교수학습자료 탑재 (지도안 PDF & 학습자료 PDF) */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="bg-[#fffefc] rounded-3xl p-6 border border-[#ebdcd0] shadow-2xs space-y-6"
          >
            <div className="border-b border-[#ebdcd0]/70 pb-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-orange-50 text-orange-700 p-2 rounded-xl border border-orange-200/60">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-800">
                    교수학습자료 탑재
                  </h2>
                  <p className="text-xs text-stone-400">
                    지도안 PDF 및 학습자료 PDF (오른쪽 리더에서 실시간 확인 및 읽기 지원)
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 font-mono">
                Step 2 / 3
              </span>
            </div>

            {/* Guidance banner for Document Reader & AI */}
            <div className="p-3.5 bg-gradient-to-r from-amber-50 via-[#fffdfa] to-orange-50 rounded-2xl border border-amber-300/80 shadow-3xs flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-700 leading-relaxed">
                탑재하신 자료는 <strong>오른쪽 미리보기 화면(PDF 뷰어)</strong>에서 페이지별로 바로 읽고 검토하실 수 있으며, 다음 단계에서 <strong>수석교사 AI(제미나이)</strong>가 이 자료들을 읽고 자가평가 점수와 함께 KPT 성찰 피드백을 제공합니다.
              </p>
            </div>

            <div className="space-y-5">
              {/* 1) 지도안 PDF */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>1) 지도안 PDF</span>
                  </label>
                  <span className="text-3xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    수업 설계 타당성 증빙
                  </span>
                </div>

                <div className="relative border-2 border-dashed border-[#ebdcd0] rounded-2xl p-4 text-center hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => onFileUpload(e, 'plan')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Upload className="w-6 h-6 text-amber-600" />
                    <p className="text-xs font-bold text-stone-700">
                      지도안 파일 선택 (클릭 또는 드래그)
                    </p>
                    <p className="text-[10px] text-stone-400">
                      PDF 문서 권장 (.pdf, 이미지 파일 지원)
                    </p>
                  </div>
                </div>

                {planDoc && (
                  <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="p-2 bg-orange-100 text-orange-700 rounded-lg shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-stone-800 block truncate">
                          {planDoc.name}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {planDoc.fileSize || '문서 탑재 완료'} · 오른쪽 화면에서 읽기 가능
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      정상 등록됨
                    </span>
                  </div>
                )}
              </div>

              {/* 2) 학습자료 PDF */}
              <div className="space-y-2 pt-2 border-t border-[#ebdcd0]/70">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                    <File className="w-4 h-4 text-emerald-600" />
                    <span>2) 학습자료 PDF</span>
                  </label>
                  <span className="text-3xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    학생 탐구활동 및 대시보드 증빙
                  </span>
                </div>

                <div className="relative border-2 border-dashed border-[#ebdcd0] rounded-2xl p-4 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => onFileUpload(e, 'material')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Upload className="w-6 h-6 text-emerald-600" />
                    <p className="text-xs font-bold text-stone-700">
                      학습자료 파일 선택 (클릭 또는 드래그)
                    </p>
                    <p className="text-[10px] text-stone-400">
                      PDF 문서 권장 (.pdf, 이미지 파일 지원)
                    </p>
                  </div>
                </div>

                {materialDoc && (
                  <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-stone-800 block truncate">
                          {materialDoc.name}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {materialDoc.fileSize || '문서 탑재 완료'} · 오른쪽 화면에서 읽기 가능
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      정상 등록됨
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#ebdcd0]/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onStepChange(0)}
                className="flex items-center space-x-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>이전 단계</span>
              </button>
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-100 cursor-pointer"
              >
                <span>성찰 점수 및 서술 작성</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: 성찰 점수 및 서술 (4대 렌즈 관점 & KPT) */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="bg-[#fffefc] rounded-3xl p-6 border border-[#ebdcd0] shadow-2xs space-y-6"
          >
            <div className="border-b border-[#ebdcd0]/70 pb-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-amber-50 text-amber-700 p-2 rounded-xl border border-amber-200/60">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-800">
                    성찰 점수 및 서술 (렌즈 1 타당성 점검)
                  </h2>
                  <p className="text-xs text-stone-400">
                    동료 교차 피드백 4대 관점 (Q1~Q4) 역량 자가 진단 및 KPT 종합 성찰
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 font-mono">
                Step 3 / 3
              </span>
            </div>

            {/* AI Feedback Quick Tab Launcher Banner */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 rounded-2xl border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-stone-800 font-serif">
                      수석교사 AI 성찰점수 1차 진단 탭
                    </span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                      추천
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    탑재된 지도안과 학습자료를 분석하여 4대 질문별 추천 점수와 서술을 1차 제안합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAiFeedbackTab}
                className="flex items-center justify-center space-x-1 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 피드백 탭 열기</span>
              </button>
            </div>

            {/* Score Summary Box */}
            <div className="p-4 bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-950 rounded-2xl text-white flex items-center justify-between shadow-md">
              <div className="space-y-0.5">
                <span className="text-3xs text-amber-200 uppercase tracking-widest font-mono font-bold block">
                  총 역량 성찰 점수
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-extrabold font-mono text-white">{totalScore}</span>
                  <span className="text-xs text-amber-200">/ 20점 만점 (4개 문항)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xs text-stone-300 block font-semibold mb-1">
                  타당성 성취 등급
                </span>
                <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-extrabold border border-amber-400/40 text-amber-100">
                  {getEvaluationGrade(totalScore)}
                </span>
              </div>
            </div>

            {/* 4 Lens Rubric Items List */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {rubricItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#fcfaf7] rounded-2xl border border-[#ebdcd0] space-y-3 hover:bg-amber-50/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="p-1 rounded-lg bg-white border border-[#ebdcd0] shadow-3xs">
                        {getQuestionIcon(item.questionNumber)}
                      </div>
                      <span className="text-xs font-extrabold text-stone-800">
                        {item.questionNumber}. {item.indicator}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.category === 'D3'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.category === 'E3'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        {item.categoryLabel}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <label className="text-[11px] text-stone-500 font-bold">평정 점수:</label>
                      <select
                        value={item.score}
                        onChange={(e) =>
                          onRubricItemChange(item.id, Number(e.target.value), item.evidence)
                        }
                        className="bg-white border border-[#ebdcd0] rounded-xl text-xs font-bold text-stone-800 px-2 py-1 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-3xs"
                      >
                        <option value={5}>5점 (매우 우수)</option>
                        <option value={4}>4점 (우수)</option>
                        <option value={3}>3점 (보통)</option>
                        <option value={2}>2점 (미흡)</option>
                        <option value={1}>1점 (매우 미흡)</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-stone-700 bg-white/70 p-2 rounded-xl border border-stone-100">
                    {item.question}
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 mb-1">
                      [실천 근거 데이터 및 정성 기술]
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 text-xs bg-white border border-[#ebdcd0] rounded-xl outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all text-stone-700"
                      placeholder="성찰에 대한 수업 실행 근거와 학생 반응 데이터를 입력하세요..."
                      value={item.evidence}
                      onChange={(e) =>
                        onRubricItemChange(item.id, item.score, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* KPT Reflection Cards */}
            <div className="space-y-3.5 pt-2 border-t border-[#ebdcd0]/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <div>
                  <h3 className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>KPT 종합 성찰 서술 (Keep / Problem / Try)</span>
                  </h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    탑재된 지도안·학습자료와 4대 역량 평가를 토대로 차시 환류를 설계합니다.
                  </p>
                </div>
                <button
                  id="btn-ai-kpt-feedback"
                  type="button"
                  onClick={onOpenAiFeedback}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 hover:from-amber-700 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-100/70 transition-all cursor-pointer transform active:scale-98 shrink-0"
                  title="20년차 수업 전문 수석교사 AI가 지도안·학습자료 및 자가평가를 읽고 피드백합니다"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                  <span>AI 수석교사 피드백 받기</span>
                </button>
              </div>

              {/* AI Guidance Box */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-[11px] text-stone-600 leading-relaxed flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>수석교사 AI 피드백 연계:</strong> 2단계에서 탑재한 <strong>지도안 PDF</strong>와 <strong>학습자료 PDF</strong>, 그리고 상단의 <strong>4개 역량 질문 평가 점수(D3·E3·F3)와 실천근거</strong>를 결합 분석하여 맞춤형 조언을 드립니다.
                </span>
              </div>

              {/* If mentor comment exists, display editable mentor card */}
              {kpt.aiFeedback && (
                <div className="p-3.5 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 rounded-2xl border border-amber-200 shadow-3xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 font-serif">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>수석교사 멘토 총평 (성장 응원 코멘트)</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenAiFeedback}
                      className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                    >
                      다시 피드백 받기
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={kpt.aiFeedback}
                    onChange={(e) => onKptChange({ ...kpt, aiFeedback: e.target.value })}
                    className="w-full p-2 text-xs bg-white border border-amber-200/90 rounded-xl leading-relaxed text-stone-700 outline-none focus:ring-1 focus:ring-amber-500 font-serif"
                    placeholder="수석교사의 멘토링 총평을 직접 수정할 수 있습니다."
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="p-3 bg-[#f0f7f2] rounded-2xl border border-emerald-200/80">
                  <label className="block text-3xs font-extrabold text-emerald-800 uppercase tracking-widest mb-1">
                    Keep (수업의 잘된 점 / 증명된 강점)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2 text-xs bg-white border border-emerald-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-stone-700 leading-snug"
                    value={kpt.keep}
                    onChange={(e) => onKptChange({ ...kpt, keep: e.target.value })}
                    placeholder="수업에서 학생 주도성 및 깊이 있는 탐구가 잘 드러난 점을 적어주세요..."
                  />
                </div>

                <div className="p-3 bg-[#fdf4ee] rounded-2xl border border-orange-200/80">
                  <label className="block text-3xs font-extrabold text-orange-800 uppercase tracking-widest mb-1">
                    Problem (수업의 아쉬운 점 / 배움의 병목)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2 text-xs bg-white border border-orange-200 rounded-xl outline-none focus:ring-1 focus:ring-orange-500 text-stone-700 leading-snug"
                    value={kpt.problem}
                    onChange={(e) => onKptChange({ ...kpt, problem: e.target.value })}
                    placeholder="수업 중 포착된 기기 장해 또는 학생 참여의 인지적 병목 요소를 적어주세요..."
                  />
                </div>

                <div className="p-3 bg-[#f0f5fb] rounded-2xl border border-blue-200/80">
                  <label className="block text-3xs font-extrabold text-blue-800 uppercase tracking-widest mb-1">
                    Try (차기 수업 환류를 위한 행동 대안)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2 text-xs bg-white border border-blue-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-stone-700 leading-snug"
                    value={kpt.tryNext}
                    onChange={(e) => onKptChange({ ...kpt, tryNext: e.target.value })}
                    placeholder="다음 수업에서 시도해볼 개선 방안 및 새로운 디지털 지도 전략을 적어주세요..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ebdcd0]/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onStepChange(1)}
                className="flex items-center space-x-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>이전 단계</span>
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-100 cursor-pointer"
              >
                <span>🎉 나의 수업 성장 리포트 완성하기</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Card with Warm Tone */}
      <div className="bg-[#fcfaf7] rounded-2xl p-4 border border-[#ebdcd0] text-stone-800 shadow-3xs space-y-2">
        <h4 className="text-xs font-extrabold flex items-center space-x-1.5 text-amber-900">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>수업 성찰 기록장 및 교수학습자료 안내</span>
        </h4>
        <ul className="text-[11px] text-stone-600 space-y-1 pl-4 list-decimal leading-relaxed font-medium">
          <li>
            <strong>[PDF 내보내기]</strong>를 누르면 <strong>1쪽(수업 성찰 기록장)</strong> 뒤에 등록하신 <strong>지도안 PDF</strong>와 <strong>학습자료 PDF</strong>가 순서대로 자동 이어붙여져 하나의 통합 리포트 파일로 다운로드됩니다.
          </li>
          <li>
            별도의 PDF 병합 툴 없이도 브라우저 내부에서 안전하고 즉각적으로 고화질 A4 통합 문서가 생성됩니다.
          </li>
        </ul>
      </div>
    </div>
  );
};

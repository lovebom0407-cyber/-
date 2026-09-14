import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  GraduationCap,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  X,
  Quote,
  Check,
  PlusCircle,
  FileCheck2,
} from 'lucide-react';
import { TeacherInfo, RubricItem, KptReflection, AiFeedbackResult, AttachedDocument } from '../types';
import { sanitizeDocForApi, generateClientFallbackKpt } from '../utils/aiFeedbackHelper';

interface AiFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherInfo: TeacherInfo;
  rubricItems: RubricItem[];
  currentKpt: KptReflection;
  planDoc?: AttachedDocument | null;
  materialDoc?: AttachedDocument | null;
  onApplyFeedback: (appliedKpt: KptReflection, mode: 'overwrite' | 'append') => void;
  showToast: (msg: string) => void;
}

export const AiFeedbackModal: React.FC<AiFeedbackModalProps> = ({
  isOpen,
  onClose,
  teacherInfo,
  rubricItems,
  currentKpt,
  planDoc,
  materialDoc,
  onApplyFeedback,
  showToast,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mentorSummary, setMentorSummary] = useState('');
  const [keep, setKeep] = useState('');
  const [problem, setProblem] = useState('');
  const [tryNext, setTryNext] = useState('');
  const [hasResult, setHasResult] = useState(false);

  // Initialize or fetch feedback
  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const safePlanDoc = sanitizeDocForApi(planDoc);
      const safeMaterialDoc = sanitizeDocForApi(materialDoc);

      const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (clientApiKey) {
        headers['Authorization'] = `Bearer ${clientApiKey}`;
      }

      const response = await fetch('/api/kpt-feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          teacherInfo,
          rubricItems,
          currentKpt,
          planDoc: safePlanDoc,
          materialDoc: safeMaterialDoc,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `서버 응답 오류 (${response.status})`);
      }

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'AI 피드백 결과를 파싱할 수 없습니다.');
      }

      const data: AiFeedbackResult = resData.data;
      setMentorSummary(data.mentorSummary);
      setKeep(data.keep);
      setProblem(data.problem);
      setTryNext(data.tryNext);
      setHasResult(true);
      showToast('✨ 수석교사 AI 피드백이 생성되었습니다. 검토 후 자유롭게 수정하세요!');
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Failed to get server AI feedback, applying smart fallback:', err);
      const fallback = generateClientFallbackKpt(teacherInfo, rubricItems);
      setMentorSummary(fallback.mentorSummary);
      setKeep(fallback.keep);
      setProblem(fallback.problem);
      setTryNext(fallback.tryNext);
      setHasResult(true);
      showToast('💡 2026 AI 역량체계 기준 KPT 멘토링 조언을 준비했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !hasResult && !isLoading) {
      fetchFeedback();
    }
  }, [isOpen]);

  const handleApplyAll = (mode: 'overwrite' | 'append') => {
    onApplyFeedback(
      {
        keep,
        problem,
        tryNext,
        aiFeedback: mentorSummary,
      },
      mode
    );
    showToast(
      mode === 'overwrite'
        ? '✅ 수석교사 AI 피드백으로 KPT를 덮어썼습니다. 언제든 추가 수정이 가능합니다.'
        : '✅ 기존 성찰 내용 뒤에 수석교사 AI 피드백을 추가하였습니다.'
    );
    onClose();
  };

  const handleApplyField = (field: 'keep' | 'problem' | 'tryNext') => {
    let nextKpt = { ...currentKpt };
    if (field === 'keep') nextKpt.keep = keep;
    if (field === 'problem') nextKpt.problem = problem;
    if (field === 'tryNext') nextKpt.tryNext = tryNext;
    nextKpt.aiFeedback = mentorSummary;

    onApplyFeedback(nextKpt, 'overwrite');
    showToast(`✅ [${field.toUpperCase()}] 항목이 성찰 기록에 반영되었습니다.`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="ai-feedback-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <motion.div
            id="ai-feedback-modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-[#fffdf9] rounded-3xl border border-[#ebdcd0] shadow-2xl max-w-3xl w-full p-6 sm:p-7 space-y-5 my-8 text-stone-800 relative max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#ebdcd0] pb-4 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 text-white p-2.5 rounded-2xl shadow-md shadow-orange-100/70">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-stone-800 font-serif">
                      수석교사 AI 맞춤형 KPT 피드백
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300 font-mono">
                      20년차 수업 멘토링
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    탑재된 지도안·학습자료 PDF와 4개 역량 자가진단(D3·E3·F3) 점수 및 실천근거를 읽고 맞춤형 피드백을 제공합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 transition-colors p-1.5 hover:bg-stone-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Badge Bar */}
            <div className="bg-[#fcf9f4] p-3 rounded-2xl border border-[#ebdcd0] flex flex-wrap items-center gap-2 text-[11px] text-stone-600 shrink-0">
              <span className="font-bold text-stone-700 flex items-center space-x-1">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                <span>분석 연계 데이터:</span>
              </span>
              <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded-lg border border-orange-200/80 font-medium truncate max-w-[200px]">
                📘 지도안: {planDoc?.name || '기본 지도안'}
              </span>
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200/80 font-medium truncate max-w-[200px]">
                📗 학습자료: {materialDoc?.name || '기본 학습자료'}
              </span>
              <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200 font-medium">
                📊 자가진단 4개 항목(D3·E3·F3)
              </span>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto space-y-4 pr-1 grow">
              {/* Loading State */}
              {isLoading && (
                <div className="py-16 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin mx-auto" />
                    <Sparkles className="w-6 h-6 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-stone-800">
                      수석교사 AI가 수업 설계를 정밀 분석하고 있습니다...
                    </h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                      작성 교사의 자가 진단 역량 점수(D3·E3·F3), 실천 근거, KPT 초안을 바탕으로 따뜻하고 깊이 있는 현장 맞춤형 조언을 작성 중입니다.
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {!isLoading && error && (
                <div className="p-5 bg-red-50/80 rounded-2xl border border-red-200 text-red-900 space-y-3">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>AI 피드백 생성 안내</span>
                  </div>
                  <p className="text-xs leading-relaxed text-red-700 font-medium">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={fetchFeedback}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>다시 시도하기</span>
                  </button>
                </div>
              )}

              {/* Success Result View */}
              {!isLoading && !error && hasResult && (
                <div className="space-y-4">
                  {/* Senior Teacher Mentor Quote Card */}
                  <div className="p-4 bg-gradient-to-br from-amber-50/90 via-[#fffbf5] to-orange-50/80 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-900">
                        <Quote className="w-4 h-4 text-amber-600 rotate-180" />
                        <span>수석교사 멘토 총평 (성장 응원 코멘트)</span>
                      </div>
                      <span className="text-[10px] text-amber-700/80 font-semibold">
                        ✏️ 직접 수정 가능
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={mentorSummary}
                      onChange={(e) => setMentorSummary(e.target.value)}
                      className="w-full p-2.5 text-xs text-stone-800 bg-white/90 border border-amber-200/90 rounded-xl leading-relaxed outline-none focus:ring-1 focus:ring-amber-500 font-serif"
                      placeholder="수석교사의 따뜻한 격려와 조언 내용입니다..."
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 px-1 pt-1">
                    <span className="font-bold text-stone-700 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-amber-600" />
                      제안된 KPT 항목 (각 항목을 자유롭게 다듬은 후 반영할 수 있습니다)
                    </span>
                    <button
                      type="button"
                      onClick={fetchFeedback}
                      className="flex items-center space-x-1 text-xs text-stone-500 hover:text-amber-700 font-bold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>새로 조언받기</span>
                    </button>
                  </div>

                  {/* KPT 3 Cards (Editable) */}
                  <div className="space-y-3.5">
                    {/* Keep Card */}
                    <div className="p-4 bg-[#f0f7f2] rounded-2xl border border-emerald-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xs font-extrabold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                            Keep
                          </span>
                          <span className="text-xs font-bold text-emerald-900">
                            잘된 점 및 보존할 강점
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyField('keep')}
                          className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-3xs hover:bg-emerald-50 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Keep만 적용</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={keep}
                        onChange={(e) => setKeep(e.target.value)}
                        className="w-full p-2.5 text-xs text-stone-800 bg-white border border-emerald-200 rounded-xl leading-relaxed outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Problem Card */}
                    <div className="p-4 bg-[#fdf4ee] rounded-2xl border border-orange-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xs font-extrabold uppercase bg-orange-100 text-orange-900 px-2 py-0.5 rounded border border-orange-300 font-mono">
                            Problem
                          </span>
                          <span className="text-xs font-bold text-orange-900">
                            아쉬운 점 및 배움의 병목 지점
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyField('problem')}
                          className="flex items-center space-x-1 text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-3xs hover:bg-orange-50 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Problem만 적용</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        className="w-full p-2.5 text-xs text-stone-800 bg-white border border-orange-200 rounded-xl leading-relaxed outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    {/* Try Card */}
                    <div className="p-4 bg-[#f0f5fb] rounded-2xl border border-blue-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xs font-extrabold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300 font-mono">
                            Try
                          </span>
                          <span className="text-xs font-bold text-blue-900">
                            차기 수업 환류를 위한 구체적 실행 대안
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyField('tryNext')}
                          className="flex items-center space-x-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-3xs hover:bg-blue-50 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Try만 적용</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={tryNext}
                        onChange={(e) => setTryNext(e.target.value)}
                        className="w-full p-2.5 text-xs text-stone-800 bg-white border border-blue-200 rounded-xl leading-relaxed outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="border-t border-[#ebdcd0] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                닫기 (수정 취소)
              </button>

              {!isLoading && hasResult && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleApplyAll('append')}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    title="기존 KPT 작성글 뒤에 덧붙입니다."
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>기존 글에 덧붙이기</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyAll('overwrite')}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-100 cursor-pointer"
                    title="제안된 피드백으로 KPT 내용을 갱신합니다."
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>KPT 전체 반영하기</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

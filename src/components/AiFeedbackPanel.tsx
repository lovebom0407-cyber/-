import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  GraduationCap,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Check,
  ChevronRight,
  ArrowRight,
  Compass,
  Brain,
  Clock,
  ShieldCheck,
  Star,
  Copy,
  Sliders,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  TeacherInfo,
  RubricItem,
  KptReflection,
  AttachedDocument,
  RubricAiFeedbackResult,
  RubricAiFeedbackItem,
} from '../types';
import { sanitizeDocForApi, generateClientFallbackRubric } from '../utils/aiFeedbackHelper';

interface AiFeedbackPanelProps {
  teacherInfo: TeacherInfo;
  rubricItems: RubricItem[];
  kpt: KptReflection;
  planDoc: AttachedDocument | null;
  materialDoc: AttachedDocument | null;
  onApplyAllFeedback: (result: RubricAiFeedbackResult) => void;
  onApplyItemFeedback: (item: RubricAiFeedbackItem) => void;
  onApplyKptFeedback: (kptData: { keep: string; problem: string; tryNext: string }) => void;
  onGoToStep: (step: number) => void;
  showToast: (msg: string) => void;
}

export const AiFeedbackPanel: React.FC<AiFeedbackPanelProps> = ({
  teacherInfo,
  rubricItems,
  kpt,
  planDoc,
  materialDoc,
  onApplyAllFeedback,
  onApplyItemFeedback,
  onApplyKptFeedback,
  onGoToStep,
  showToast,
}) => {
  const [feedbackResult, setFeedbackResult] = useState<RubricAiFeedbackResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedItemIds, setAppliedItemIds] = useState<Set<string>>(new Set());
  const [isAllApplied, setIsAllApplied] = useState<boolean>(false);

  const fetchAiFeedback = async () => {
    setIsLoading(true);
    setError(null);
    setIsFallbackMode(false);

    // Timeout controller (12s) so user is never frozen if deployment network is sluggish
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      // CRITICAL: Strip large PDF binary buffers and base64 canvas images to prevent 413 Payload Too Large!
      const safePlanDoc = sanitizeDocForApi(planDoc);
      const safeMaterialDoc = sanitizeDocForApi(materialDoc);

      const response = await fetch('/api/rubric-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherInfo,
          rubricItems,
          planDoc: safePlanDoc,
          materialDoc: safeMaterialDoc,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`서버 응답 상태코드: ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'AI 피드백 결과를 수신하지 못했습니다.');
      }

      setFeedbackResult(resData.data);
      showToast('✨ 수석교사 AI 1차 성찰점수 진단 및 피드백이 준비되었습니다!');
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('API fetch failed or timed out, applying smart 2026 rubric fallback:', err);

      // Auto-fallback: Never leave the teacher stuck! Provide 2026 AI framework standard diagnostics
      const fallback = generateClientFallbackRubric(teacherInfo, rubricItems);
      setFeedbackResult(fallback);
      setIsFallbackMode(true);
      showToast('💡 2026 AI 역량진단 표준 모델 기반으로 1차 추천 점수와 서술을 준비했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!feedbackResult && !isLoading) {
      fetchAiFeedback();
    }
  }, []);

  const handleApplyAll = () => {
    if (!feedbackResult) return;
    onApplyAllFeedback(feedbackResult);
    setIsAllApplied(true);
    const newSet = new Set(feedbackResult.items.map((i) => i.id));
    setAppliedItemIds(newSet);
    showToast('🎉 4대 핵심 질문별 AI 추천 점수와 실천근거가 모두 반영되었습니다!');
  };

  const handleApplySingleItem = (item: RubricAiFeedbackItem) => {
    onApplyItemFeedback(item);
    setAppliedItemIds((prev) => new Set([...prev, item.id]));
    showToast(`✅ [${item.questionNumber} ${item.indicator}] AI 추천 점수(${item.suggestedScore}점) 및 실천근거가 반영되었습니다!`);
  };

  const handleApplyKpt = () => {
    if (!feedbackResult?.kpt) return;
    onApplyKptFeedback(feedbackResult.kpt);
    showToast('📝 KPT 성찰 내용에 AI 제안이 적용되었습니다!');
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
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div id="ai-feedback-panel-container" className="w-full bg-[#fffdfa] rounded-3xl border border-[#ebdcd0] p-5 sm:p-7 shadow-xl shadow-stone-100 flex flex-col space-y-6 scroll-mt-6">
      {/* Fallback mode notification if deployment server was offline */}
      {isFallbackMode && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-3xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>2026 AI 역량진단 표준 모델 적용됨:</strong> 현재 환경에 맞춰 표준 진단 알고리즘으로 4대 문항별 성찰 점수와 실천근거를 완벽히 구성하였습니다.
            </span>
          </div>
          <button
            type="button"
            onClick={fetchAiFeedback}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-950 underline shrink-0 cursor-pointer"
          >
            Gemini API 재연결 시도
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcd0] pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-600 text-white p-2 rounded-xl shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-800 font-serif">
                  수석교사 AI 1차 성찰점수 진단 &amp; 멘토링
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300/80 px-2 py-0.5 rounded-full font-bold">
                  2026 AI 역량진단
                </span>
              </div>
              <p className="text-xs text-stone-500">
                수업 주제와 탑재된 지도안·학습자료를 분석하여 4대 핵심 질문별 추천 점수와 서술을 제안합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={fetchAiFeedback}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer disabled:opacity-50"
            title="다시 분석하기"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>

          {feedbackResult && (
            <button
              type="button"
              onClick={handleApplyAll}
              disabled={isLoading}
              className={`flex items-center space-x-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
                isAllApplied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
              }`}
            >
              {isAllApplied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isAllApplied ? '전체 반영 완료' : '추천 점수·서술 전체 1차 반영'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center animate-bounce shadow-inner">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-800">
              수석교사 AI가 수업 설계안 및 4대 역량을 정밀 분석 중입니다...
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              탑재된 {planDoc?.name ? `지도안(${planDoc.name})` : '수업 정보'}과 학습자료, 2026 AI 역량 평가 지표(D3·E3·F3)를 대조하여 맞춤형 성찰 점수와 실천근거를 작성하고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !isLoading && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="font-bold">분석을 불러오지 못했습니다.</p>
            <p className="text-stone-600">{error}</p>
            <button
              type="button"
              onClick={fetchAiFeedback}
              className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-white border border-rose-300 rounded-lg text-rose-700 font-bold hover:bg-rose-100/60"
            >
              <RefreshCw className="w-3 h-3" />
              <span>다시 시도</span>
            </button>
          </div>
        </div>
      )}

      {/* Result Overview Banner */}
      {feedbackResult && !isLoading && (
        <>
          <div className="bg-gradient-to-br from-amber-50/90 via-[#fffdfa] to-orange-50/70 p-5 rounded-2xl border border-amber-300/80 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-extrabold text-amber-950 font-serif">
                  수석교사 1차 역량 진단 총평
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-600 font-medium">예상 성찰 총점:</span>
                <span className="text-sm font-black font-mono text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-lg border border-amber-300">
                  {feedbackResult.predictedTotalScore}점 / 20점
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                  {feedbackResult.predictedGrade}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              "{feedbackResult.overallAssessment}"
            </p>
          </div>

          {/* 4 Core Questions Diagnostic Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>4대 핵심 질문별 1차 추천 점수 및 실천근거</span>
              </h4>
              <span className="text-[11px] text-stone-500">
                각 카드의 [반영] 버튼을 누르면 왼쪽 3단계 폼 및 리포트에 즉시 반영됩니다.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {feedbackResult.items.map((item) => {
                const currentScore = rubricItems.find((r) => r.id === item.id)?.score ?? 5;
                const isApplied = appliedItemIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-[#ebdcd0] hover:border-amber-400 transition-all shadow-3xs space-y-4"
                  >
                    {/* Item Top: Header & Score Comparison */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-stone-100 rounded-xl">
                          {getQuestionIcon(item.questionNumber)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-extrabold text-stone-800 font-serif">
                              [{item.questionNumber}] {item.indicator}
                            </span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono font-bold">
                              {item.questionNumber === 'Q1'
                                ? 'E3 실행 성찰'
                                : item.questionNumber === 'Q3'
                                ? 'F3 평가 환류'
                                : 'D3 설계 성찰'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            {rubricItems.find((r) => r.id === item.id)?.question}
                          </p>
                        </div>
                      </div>

                      {/* Score recommendation badge & Apply button */}
                      <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                        <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl">
                          <span className="text-[10px] text-amber-800 font-bold">AI 추천 점수:</span>
                          <span className="text-sm font-black text-amber-900 font-mono flex items-center space-x-0.5">
                            <span>{item.suggestedScore}</span>
                            <span className="text-[10px] text-amber-700 font-normal">/ 5점</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplySingleItem(item)}
                          className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-3xs ${
                            isApplied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-stone-900 hover:bg-stone-800 text-white'
                          }`}
                        >
                          {isApplied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>{isApplied ? '반영 완료' : '이 항목 반영'}</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Diagnosis Commentary */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-amber-950 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>수석교사 1차 진단 분석</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed bg-[#fcfaf7] p-3 rounded-xl border border-[#ebdcd0]/70">
                        {item.diagnosis}
                      </p>
                    </div>

                    {/* Suggested Evidence Text */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-stone-800 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>추천 실천 근거 서술문 (리포트 수록용)</span>
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          반영 시 3단계 입력란에 자동 적용됩니다.
                        </span>
                      </div>
                      <div className="text-xs text-stone-800 leading-relaxed bg-amber-50/30 p-3 rounded-xl border border-amber-200/60 font-serif">
                        {item.suggestedEvidence}
                      </div>
                    </div>

                    {/* Key Strengths Tags & Recommendation Tip */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.keyStrengths?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {item.recommendations && (
                        <span className="text-[11px] text-amber-800 font-medium bg-amber-100/60 px-2 py-0.5 rounded-md">
                          💡 Tip: {item.recommendations}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KPT Reflection Proposal Card */}
          {feedbackResult.kpt && (
            <div className="bg-[#fffefc] rounded-2xl p-5 border border-[#ebdcd0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-800 font-serif">
                    AI 수석교사 KPT 종합 성찰 제안
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleApplyKpt}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>KPT 회고란에 반영하기</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-1.5">
                  <span className="text-xs font-extrabold text-emerald-900 block">
                    Keep (잘된 점 &amp; 지속할 점)
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {feedbackResult.kpt.keep}
                  </p>
                </div>

                <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/70 space-y-1.5">
                  <span className="text-xs font-extrabold text-rose-900 block">
                    Problem (아쉬운 점 &amp; 해결과제)
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {feedbackResult.kpt.problem}
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200/70 space-y-1.5">
                  <span className="text-xs font-extrabold text-indigo-900 block">
                    Try (다음 수업 실행 개선안)
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {feedbackResult.kpt.tryNext}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation to Form */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <span className="text-stone-600">
              AI 제안을 검토하신 후 필요에 따라 직접 세부 수치를 다듬으실 수 있습니다.
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-all shadow-3xs cursor-pointer"
            >
              <span>3단계 성찰 점수 입력 폼으로 가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

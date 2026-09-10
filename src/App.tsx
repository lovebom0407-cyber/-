import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { BookOpen, FileText, Sparkles, Bot, Award } from 'lucide-react';
import { Header } from './components/Header';
import { EditorSteps } from './components/EditorSteps';
import { PosterReport } from './components/PosterReport';
import { DocumentReader } from './components/DocumentReader';
import { AiFeedbackPanel } from './components/AiFeedbackPanel';
import { PdfExportModal } from './components/PdfExportModal';
import { AiFeedbackModal } from './components/AiFeedbackModal';
import { ImageModal } from './components/ImageModal';
import { Toast } from './components/Toast';
import {
  TeacherInfo,
  RubricItem,
  KptReflection,
  AttachedDocument,
  ImageModalData,
  SerializedState,
  RubricAiFeedbackResult,
  RubricAiFeedbackItem,
} from './types';
import {
  DEFAULT_TEACHER_INFO,
  DEFAULT_RUBRIC_ITEMS,
  DEFAULT_KPT,
  DEFAULT_PLAN_DOC,
  DEFAULT_MATERIAL_DOC,
  PRESET_TEACHER_INFO,
  PRESET_RUBRIC_EVIDENCES,
  PRESET_KPT,
} from './data/defaultData';
import { exportPosterToPdf } from './utils/pdfExporter';
import { renderPdfPages } from './utils/pdfRender';

export function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<'report' | 'documents' | 'ai-feedback'>('report');
  const [selectedDocType, setSelectedDocType] = useState<'plan' | 'material'>('plan');
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [isFullView, setIsFullView] = useState<boolean>(false);

  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>(DEFAULT_TEACHER_INFO);
  const [rubricItems, setRubricItems] = useState<RubricItem[]>(DEFAULT_RUBRIC_ITEMS);
  const [kpt, setKpt] = useState<KptReflection>(DEFAULT_KPT);
  const [planDoc, setPlanDoc] = useState<AttachedDocument | null>(DEFAULT_PLAN_DOC);
  const [materialDoc, setMaterialDoc] = useState<AttachedDocument | null>(DEFAULT_MATERIAL_DOC);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgressMsg, setPdfProgressMsg] = useState<string>('');
  const [imageModalData, setImageModalData] = useState<ImageModalData | null>(null);

  const posterRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, duration = 3500) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  // Hydrate state from URL query parameter if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');

    const applyState = (data: SerializedState) => {
      if (data.b) setTeacherInfo(data.b);
      if (data.c && Array.isArray(data.c)) {
        setRubricItems((prev) =>
          prev.map((item) => {
            const match = data.c.find((cItem) => cItem.id === item.id);
            return match
              ? {
                  ...item,
                  score: typeof match.s === 'number' ? match.s : item.score,
                  evidence: typeof match.e === 'string' ? match.e : item.evidence,
                }
              : item;
          })
        );
      }
      if (data.k) {
        setKpt({
          ...data.k,
          aiFeedback: data.af || data.k.aiFeedback || '',
        });
      }
      if (data.lp) {
        setPlanDoc({
          name: '공유된_지도안_자료.pdf',
          type: 'image',
          dataUrl: data.lp,
        });
      }
      if (data.di) {
        setMaterialDoc({
          name: '공유된_학습자료.pdf',
          type: 'image',
          dataUrl: data.di,
        });
      }

      setIsViewOnly(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('🔗 공유해 주신 수업 성장 리포트를 복원하였습니다!');
    };

    if (stateParam) {
      try {
        const normalized = stateParam.replace(/ /g, '+');
        const decodedStr = decodeURIComponent(atob(normalized));
        const parsed = JSON.parse(decodedStr);
        applyState(parsed);
      } catch (err) {
        console.error('공유된 상태 로드 에러:', err);
        showToast('공유 링크 복원 중 오류가 발생하였습니다.');
      }
    }
  }, []);

  const handleRubricItemChange = (id: string, score: number, evidence: string) => {
    setRubricItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score, evidence } : item))
    );
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'plan' | 'material') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    if (isPdf) {
      try {
        showToast(`⏳ [${file.name}] 문서를 로딩 및 캔버스 렌더링 중입니다...`);
        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const blobUrl = URL.createObjectURL(file);

        // Render PDF pages and extract text
        const renderResult = await renderPdfPages(pdfBytes, 6);

        const newDoc: AttachedDocument = {
          name: file.name,
          type: 'pdf',
          dataUrl: renderResult.firstPageDataUrl,
          fileSize: fileSizeFormatted,
          pageCount: renderResult.pageCount,
          pdfBytes,
          blobUrl,
          extractedText: renderResult.extractedText,
          pageImages: renderResult.pageImages,
        };

        if (type === 'plan') {
          setPlanDoc(newDoc);
          showToast(`📑 지도안 PDF (${file.name}, 총 ${renderResult.pageCount}p) 등록 및 미리보기 반영 완료!`);
        } else {
          setMaterialDoc(newDoc);
          showToast(`📊 학습자료 PDF (${file.name}, 총 ${renderResult.pageCount}p) 등록 및 미리보기 반영 완료!`);
        }

        setSelectedDocType(type);
        setPreviewMode('documents');
      } catch (err) {
        console.error('PDF file read error:', err);
        showToast('PDF 파일을 읽는 중 오류가 발생했습니다.');
      }
    } else {
      // Image upload
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const rawDataUrl = event.target.result as string;
          const blobUrl = URL.createObjectURL(file);
          const newDoc: AttachedDocument = {
            name: file.name,
            type: 'image',
            dataUrl: rawDataUrl,
            fileSize: fileSizeFormatted,
            pageCount: 1,
            blobUrl,
            pageImages: [rawDataUrl],
          };
          if (type === 'plan') {
            setPlanDoc(newDoc);
            showToast(`🖼️ 지도안 이미지 (${file.name}) 등록 및 미리보기 완료!`);
          } else {
            setMaterialDoc(newDoc);
            showToast(`🖼️ 학습자료 이미지 (${file.name}) 등록 및 미리보기 완료!`);
          }
          setSelectedDocType(type);
          setPreviewMode('documents');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyAllFeedback = (result: RubricAiFeedbackResult) => {
    setRubricItems((prev) =>
      prev.map((item) => {
        const found = result.items.find(
          (i) => i.id === item.id || i.questionNumber === item.questionNumber
        );
        if (found) {
          return {
            ...item,
            score: found.suggestedScore,
            evidence: found.suggestedEvidence || item.evidence,
          };
        }
        return item;
      })
    );

    if (result.kpt) {
      setKpt((prev) => ({
        ...prev,
        keep: result.kpt.keep || prev.keep,
        problem: result.kpt.problem || prev.problem,
        tryNext: result.kpt.tryNext || prev.tryNext,
        aiFeedback: result.overallAssessment || prev.aiFeedback,
      }));
    }
  };

  const handleApplyItemFeedback = (item: RubricAiFeedbackItem) => {
    setRubricItems((prev) =>
      prev.map((r) => {
        if (r.id === item.id || r.questionNumber === item.questionNumber) {
          return {
            ...r,
            score: item.suggestedScore,
            evidence: item.suggestedEvidence || r.evidence,
          };
        }
        return r;
      })
    );
  };

  const handleApplyKptFeedback = (kptData: { keep: string; problem: string; tryNext: string }) => {
    setKpt((prev) => ({
      ...prev,
      keep: kptData.keep,
      problem: kptData.problem,
      tryNext: kptData.tryNext,
    }));
  };

  const handleLoadPreset = () => {
    setTeacherInfo(PRESET_TEACHER_INFO);
    setRubricItems((prev) =>
      prev.map((item) => ({
        ...item,
        score: item.questionNumber === 'Q4' ? 4 : 5,
        evidence: PRESET_RUBRIC_EVIDENCES[item.id] || item.evidence,
      }))
    );
    setKpt(PRESET_KPT);
    showToast('✨ 2026 AI 에듀테크 연수 우수 실전사례 프리셋이 로드되었습니다!');
  };

  const handleShare = async () => {
    try {
      const stateObj: SerializedState = {
        b: teacherInfo,
        c: rubricItems.map((item) => ({
          id: item.id,
          s: item.score,
          e: item.evidence,
        })),
        k: kpt,
        af: kpt.aiFeedback,
        lp: planDoc?.dataUrl,
        di: materialDoc?.dataUrl,
      };

      const jsonStr = JSON.stringify(stateObj);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast('📋 수업 성장 리포트 공유 링크가 클립보드에 복사되었습니다!');
      } else {
        window.prompt('공유 링크를 복사하여 전달하세요:', shareUrl);
      }
    } catch (err) {
      console.error('Failed to copy share link:', err);
      showToast('공유 링크 생성 중 오류가 발생했습니다.');
    }
  };

  const handleApplyAiFeedback = (appliedKpt: KptReflection, mode: 'overwrite' | 'append') => {
    if (mode === 'overwrite') {
      setKpt(appliedKpt);
    } else {
      setKpt((prev) => ({
        keep: prev.keep
          ? `${prev.keep}\n\n[수석교사 제안]: ${appliedKpt.keep}`
          : appliedKpt.keep,
        problem: prev.problem
          ? `${prev.problem}\n\n[수석교사 제안]: ${appliedKpt.problem}`
          : appliedKpt.problem,
        tryNext: prev.tryNext
          ? `${prev.tryNext}\n\n[수석교사 제안]: ${appliedKpt.tryNext}`
          : appliedKpt.tryNext,
        aiFeedback: appliedKpt.aiFeedback || prev.aiFeedback,
      }));
    }
  };

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep === 1) {
      // Step 2: 교수학습자료 탑재 단계 -> 지도안/학습자료 뷰어로 전환
      setPreviewMode('documents');
    } else {
      // Step 1: 기본 정보 입력 / Step 3: 성찰 점수 및 서술 -> 리포트 포스터 미리보기로 전환
      setPreviewMode('report');
    }
  };

  const handleCompleteAll = () => {
    setCurrentStep(2);
    setPreviewMode('report');
    showToast('🎉 축하합니다! 모든 성찰 정보와 AI 피드백이 취합된 "나의 수업 성장 리포트"가 완성되었습니다.');
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfProgressMsg('1단계: 수업 성장 리포트 포스터 고해상도 렌더링 중...');
    try {
      await exportPosterToPdf({
        element: posterRef.current,
        teacherName: teacherInfo.teacherName,
        date: teacherInfo.date,
        planDoc,
        materialDoc,
        onProgress: (msg) => {
          setPdfProgressMsg(msg);
          showToast(msg);
        },
      });
      showToast('🎉 지도안과 학습자료가 병합된 완성본 PDF가 저장되었습니다!');
      setIsPdfModalOpen(false);
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('PDF 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgressMsg('');
    }
  };

  const handleBrowserPrint = () => {
    try {
      setIsPdfModalOpen(false);
      setTimeout(() => {
        try {
          window.focus();
          window.print();
        } catch (err) {
          console.error('Print call failed:', err);
          window.alert(
            `⚠️ 브라우저 보안 정책(iframe 제한)으로 인해 인쇄창을 직접 호출하지 못했습니다.\n\n💡 해결 방법:\n1. '통합 A4 PDF 다운로드' 버튼을 눌러 교수학습자료가 자동 병합된 PDF로 소장하세요.\n2. 또는 우측 상단의 '새 창에서 열기' 버튼을 눌러 새 탭에서 실행한 뒤 인쇄를 시도해 주세요!`
          );
        }
      }, 250);
    } catch (err) {
      console.error('Print action failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-stone-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Top App Header */}
      <Header
        teacherInfo={teacherInfo}
        isViewOnly={isViewOnly}
        isFullView={isFullView}
        onToggleFullView={() => setIsFullView(!isFullView)}
        onLoadPreset={handleLoadPreset}
        onShare={handleShare}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div
          className={`flex flex-col ${
            isViewOnly || isFullView ? 'items-center' : 'lg:flex-row'
          } gap-6 xl:gap-8 items-start justify-center`}
        >
          {/* Left Column: Form Stepper (Hidden in View-Only or Full-View mode) */}
          {!isViewOnly && !isFullView && (
            <div className="w-full lg:w-[370px] xl:w-[410px] 2xl:w-[440px] shrink-0">
              <EditorSteps
                currentStep={currentStep}
                onStepChange={handleStepChange}
                teacherInfo={teacherInfo}
                onTeacherInfoChange={setTeacherInfo}
                rubricItems={rubricItems}
                onRubricItemChange={handleRubricItemChange}
                kpt={kpt}
                onKptChange={setKpt}
                planDoc={planDoc}
                materialDoc={materialDoc}
                onFileUpload={handleFileUpload}
                onComplete={handleCompleteAll}
                onOpenAiFeedback={() => setIsAiModalOpen(true)}
                onOpenAiFeedbackTab={() => setPreviewMode('ai-feedback')}
              />
            </div>
          )}

          {/* Right Column: Live Poster Preview OR Document Reader OR AI Feedback Panel */}
          <div className="w-full lg:flex-1 min-w-0 space-y-3">
            {/* Preview switcher tab bar (shown in edit mode) */}
            {!isViewOnly && !isFullView && (
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-2xl border border-[#ebdcd0] shadow-3xs">
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('report')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      previewMode === 'report'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>나의 수업 성장 리포트 (포스터)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode('documents')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      previewMode === 'documents'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>교수학습자료 리더 (지도안 · 자료)</span>
                    {(planDoc || materialDoc) && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode('ai-feedback')}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      previewMode === 'ai-feedback'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI 수석교사 1차 피드백</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                      추천
                    </span>
                  </button>
                </div>

                <span className="text-[11px] text-stone-400 font-medium hidden xl:inline-block pr-2">
                  {previewMode === 'documents'
                    ? '📄 탑재된 문서를 페이지별로 바로 읽고 검토'
                    : previewMode === 'ai-feedback'
                    ? '🤖 4대 질문별 AI 1차 추천 점수 및 실천근거'
                    : '📊 4대 역량 성찰 및 포스터 리포트'}
                </span>
              </div>
            )}

            {previewMode === 'report' ? (
              <PosterReport
                posterRef={posterRef}
                isViewOnly={isViewOnly}
                isFullView={isFullView}
                teacherInfo={teacherInfo}
                rubricItems={rubricItems}
                kpt={kpt}
                planDoc={planDoc}
                materialDoc={materialDoc}
                onOpenPdfModal={() => setIsPdfModalOpen(true)}
                onOpenImageModal={setImageModalData}
                onOpenAiFeedbackModal={() => setIsAiModalOpen(true)}
              />
            ) : previewMode === 'documents' ? (
              <DocumentReader
                planDoc={planDoc}
                materialDoc={materialDoc}
                selectedDocType={selectedDocType}
                onSelectDocType={setSelectedDocType}
                onOpenImageModal={setImageModalData}
                onFileUpload={handleFileUpload}
                onGoToNextStep={() => handleStepChange(2)}
                onOpenAiFeedbackTab={() => setPreviewMode('ai-feedback')}
              />
            ) : (
              <AiFeedbackPanel
                teacherInfo={teacherInfo}
                rubricItems={rubricItems}
                kpt={kpt}
                planDoc={planDoc}
                materialDoc={materialDoc}
                onApplyAllFeedback={handleApplyAllFeedback}
                onApplyItemFeedback={handleApplyItemFeedback}
                onApplyKptFeedback={handleApplyKptFeedback}
                onGoToStep={handleStepChange}
                showToast={showToast}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals & Toast */}
      <AiFeedbackModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        teacherInfo={teacherInfo}
        rubricItems={rubricItems}
        currentKpt={kpt}
        planDoc={planDoc}
        materialDoc={materialDoc}
        onApplyFeedback={handleApplyAiFeedback}
        showToast={showToast}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        isGeneratingPdf={isGeneratingPdf}
        pdfProgressMsg={pdfProgressMsg}
        onClose={() => setIsPdfModalOpen(false)}
        onDownloadPdf={handleDownloadPdf}
        onBrowserPrint={handleBrowserPrint}
      />

      <ImageModal
        data={imageModalData}
        onClose={() => setImageModalData(null)}
      />

      <Toast message={toastMessage} />
    </div>
  );
}

export default App;

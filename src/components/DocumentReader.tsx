import React, { useState, ChangeEvent } from 'react';
import {
  FileText,
  FileCheck2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ExternalLink,
  Sparkles,
  Upload,
  Layers,
  ChevronRight,
  BookOpen,
  Info,
  ChevronLeft,
  ChevronDown,
  Eye,
  FileCode,
} from 'lucide-react';
import { AttachedDocument, ImageModalData } from '../types';

interface DocumentReaderProps {
  planDoc: AttachedDocument | null;
  materialDoc: AttachedDocument | null;
  selectedDocType: 'plan' | 'material';
  onSelectDocType: (type: 'plan' | 'material') => void;
  onOpenImageModal: (data: ImageModalData) => void;
  onFileUpload?: (e: ChangeEvent<HTMLInputElement>, type: 'plan' | 'material') => void;
  onGoToNextStep?: () => void;
  onOpenAiFeedbackTab?: () => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  planDoc,
  materialDoc,
  selectedDocType,
  onSelectDocType,
  onOpenImageModal,
  onFileUpload,
  onGoToNextStep,
  onOpenAiFeedbackTab,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'canvas' | 'native'>('canvas');

  const activeDoc = selectedDocType === 'plan' ? planDoc : materialDoc;
  const isPdf = activeDoc?.type === 'pdf' || activeDoc?.dataUrl?.startsWith('data:application/pdf') || !!activeDoc?.blobUrl;

  const totalPages = activeDoc?.pageImages?.length || activeDoc?.pageCount || 1;
  const currentImage = activeDoc?.pageImages?.[currentPage] || activeDoc?.dataUrl;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoomLevel(1);

  const handleOpenFullscreen = () => {
    if (activeDoc) {
      onOpenImageModal({
        src: currentImage || activeDoc.dataUrl,
        title: selectedDocType === 'plan' ? '지도안 (수업설계안)' : '학습자료 (학생용 활동지/데이터)',
        isPdf: activeDoc.type === 'pdf',
      });
    }
  };

  const handleOpenInNewTab = () => {
    if (activeDoc?.blobUrl) {
      window.open(activeDoc.blobUrl, '_blank');
    } else if (activeDoc?.dataUrl) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<img src="${activeDoc.dataUrl}" style="max-width:100%; height:auto; display:block; margin:20px auto; box-shadow:0 4px 12px rgba(0,0,0,0.15);" />`
        );
      }
    }
  };

  return (
    <div className="w-full bg-[#fffdf9] rounded-3xl border border-[#ebdcd0] p-5 sm:p-6 shadow-xl shadow-stone-100 flex flex-col space-y-5">
      {/* Top Header & Document Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebdcd0] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-amber-100 text-amber-900 p-1.5 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-800 font-serif">
              교수학습자료 실시간 리더 (PDF · 이미지 뷰어)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            선생님께서 탑재하신 지도안 및 학습자료를 실제 페이지별로 선명하게 확인하고 검토할 수 있습니다.
          </p>
        </div>

        {/* Tab switch between Plan & Material */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
          <button
            type="button"
            onClick={() => {
              onSelectDocType('plan');
              setCurrentPage(0);
              setZoomLevel(1);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDocType === 'plan'
                ? 'bg-white text-orange-800 shadow-xs border border-orange-200/60'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            <span>1) 지도안 PDF</span>
            {planDoc && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectDocType('material');
              setCurrentPage(0);
              setZoomLevel(1);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDocType === 'material'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>2) 학습자료 PDF</span>
            {materialDoc && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Active Document Info Bar & Controls */}
      {activeDoc ? (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#ebdcd0]/80">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div
              className={`p-2 rounded-xl text-white ${
                selectedDocType === 'plan' ? 'bg-orange-600' : 'bg-emerald-600'
              }`}
            >
              {selectedDocType === 'plan' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <FileCheck2 className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-800 truncate max-w-[220px]">
                  {activeDoc.name}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  {selectedDocType === 'plan' ? '지도안' : '학습자료'}
                </span>
                {activeDoc.pageCount && activeDoc.pageCount > 1 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    총 {activeDoc.pageCount}페이지
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {activeDoc.fileSize || '등록 완료'} · AI 성찰점수 진단 연계 준비 완료 ✨
              </p>
            </div>
          </div>

          {/* Controls: Page Navigator, Zoom, Fullscreen, Open Tab */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Page Navigator if multi-page */}
            {totalPages > 1 && (
              <div className="flex items-center bg-white border border-stone-200 rounded-xl px-1.5 py-1 space-x-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="p-1 hover:bg-stone-100 text-stone-600 rounded-lg disabled:opacity-30 cursor-pointer"
                  title="이전 페이지"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-stone-700 px-1.5">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="p-1 hover:bg-stone-100 text-stone-600 rounded-lg disabled:opacity-30 cursor-pointer"
                  title="다음 페이지"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-stone-200 rounded-xl px-1.5 py-1 space-x-1">
              <button
                type="button"
                onClick={handleZoomOut}
                title="축소"
                className="p-1 hover:bg-stone-100 text-stone-600 rounded-lg cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold text-stone-600 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                title="확대"
                className="p-1 hover:bg-stone-100 text-stone-600 rounded-lg cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="원래 크기"
                className="p-1 hover:bg-stone-100 text-stone-600 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Native vs Canvas view toggle if blobUrl exists */}
            {activeDoc.blobUrl && (
              <button
                type="button"
                onClick={() => setViewMode((m) => (m === 'canvas' ? 'native' : 'canvas'))}
                className={`flex items-center space-x-1 px-2.5 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'native'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
                title="내장 PDF 브라우저 뷰어로 보기"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{viewMode === 'native' ? '캔버스 뷰' : 'PDF 뷰'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenFullscreen}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold rounded-xl shadow-3xs cursor-pointer"
              title="크게 보기"
            >
              <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
              <span>크게 보기</span>
            </button>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold rounded-xl shadow-3xs cursor-pointer"
              title="새 창에서 원본 보기"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
              <span>새 창</span>
            </button>

            {/* Replace file button */}
            {onFileUpload && (
              <label
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl shadow-3xs cursor-pointer transition-all"
                title="다른 파일로 변경"
              >
                <Upload className="w-3.5 h-3.5 text-amber-700" />
                <span>파일 변경</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => onFileUpload(e, selectedDocType)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      ) : null}

      {/* Main Document Display Box */}
      <div className="w-full bg-[#f8f6f2] rounded-2xl border border-[#ebdcd0] overflow-hidden min-h-[540px] flex items-center justify-center relative p-3">
        {activeDoc ? (
          viewMode === 'native' && activeDoc.blobUrl ? (
            <div className="w-full h-[640px] rounded-xl overflow-hidden bg-white shadow-sm border border-stone-200">
              <iframe
                src={activeDoc.blobUrl}
                title={activeDoc.name}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <div className="w-full h-[640px] overflow-auto flex items-center justify-center p-4 bg-stone-100/60 rounded-xl">
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                className="transition-transform duration-200 ease-out max-w-full"
              >
                <img
                  src={currentImage || activeDoc.dataUrl}
                  alt={activeDoc.name}
                  className="rounded-xl shadow-xl border border-stone-200/90 max-w-full max-h-[600px] object-contain bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )
        ) : (
          <div className="text-center p-12 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <Upload className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-stone-700">
              {selectedDocType === 'plan' ? '지도안 PDF' : '학습자료 PDF'}가 아직 등록되지 않았습니다.
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              PDF 또는 이미지 형식의 문서를 탑재하시면 이곳에서 바로 페이지별로 실시간 확인하고 읽으실 수 있습니다.
            </p>
            {onFileUpload && (
              <label className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-amber-100">
                <Upload className="w-3.5 h-3.5" />
                <span>문서 탑재하기</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => onFileUpload(e, selectedDocType)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}
      </div>

      {/* AI Integration Advice Card */}
      <div className="p-4 bg-gradient-to-r from-amber-50/90 via-[#fffcf7] to-orange-50/80 rounded-2xl border border-amber-300/80 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-2.5">
          <div className="bg-amber-600 text-white p-2 rounded-xl shrink-0 mt-0.5 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-amber-950 font-serif">
                수석교사 AI 성찰점수 1차 진단 준비 완료
              </span>
              <span className="text-[9px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
                D3·E3·F3 역량평가
              </span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              탑재하신 문서를 바탕으로 AI 수석교사가 4대 핵심 질문별 추천 점수(1~5점)와 실천근거를 1차로 분석해 드립니다.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onOpenAiFeedbackTab && (
            <button
              type="button"
              onClick={onOpenAiFeedbackTab}
              className="flex items-center space-x-1 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-all cursor-pointer border border-amber-300/70"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>AI 성찰점수 피드백 보기</span>
            </button>
          )}

          {onGoToNextStep && (
            <button
              type="button"
              onClick={onGoToNextStep}
              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-orange-100 cursor-pointer"
            >
              <span>3단계 작성하기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

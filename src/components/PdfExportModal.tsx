import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, Download, FileText, CheckCircle2, Layers } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  isGeneratingPdf: boolean;
  pdfProgressMsg?: string;
  onClose: () => void;
  onDownloadPdf: () => void;
  onBrowserPrint: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  isGeneratingPdf,
  pdfProgressMsg = '',
  onClose,
  onDownloadPdf,
  onBrowserPrint,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="no-print fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="bg-[#fffdfa] rounded-3xl p-6 max-w-lg w-full border border-[#ebdcd0] shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ebdcd0] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white p-2 rounded-xl shadow-xs">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">
                    PDF 내보내기
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    나의 수업 성장 리포트 + 지도안 PDF + 학습자료 PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 transition-colors text-sm font-bold px-2 py-1 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                닫기
              </button>
            </div>

            {/* Merge Sequence Visualization */}
            <div className="p-4 bg-[#fcfaf7] border border-[#ebdcd0] rounded-2xl space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-900">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>PDF 자동 병합 인쇄 구성 안내</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-stone-700">
                <div className="p-2.5 bg-white rounded-xl border border-[#ebdcd0] shadow-3xs">
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded block mb-1">
                    1페이지
                  </span>
                  <FileText className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[10px] font-extrabold block text-stone-800 leading-tight">
                    나의 수업 성장 리포트
                  </span>
                  <span className="text-[9px] text-stone-400">포스터 리포트</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#ebdcd0] shadow-3xs">
                  <span className="text-[9px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded block mb-1">
                    이어 붙임
                  </span>
                  <FileText className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <span className="text-[10px] font-extrabold block text-stone-800 leading-tight">
                    지도안 PDF
                  </span>
                  <span className="text-[9px] text-stone-400">수업 설계안</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#ebdcd0] shadow-3xs">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded block mb-1">
                    이어 붙임
                  </span>
                  <FileText className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[10px] font-extrabold block text-stone-800 leading-tight">
                    학습자료 PDF
                  </span>
                  <span className="text-[9px] text-stone-400">탐구지/대시보드</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                ✔ <strong>나의 수업 성장 리포트</strong> 뒤에 등록하신 <strong>지도안 PDF</strong>와 <strong>학습자료 PDF</strong>가 하나의 PDF 파일로 합쳐져 다운로드됩니다.
              </p>
            </div>

            {/* Progress Status */}
            {isGeneratingPdf && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center space-x-2.5 text-xs text-amber-900 font-bold animate-pulse">
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>{pdfProgressMsg || '고화질 PDF 변환 및 자료 병합 중입니다...'}</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={onBrowserPrint}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-100 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>PDF 내보내기 (브라우저 기본 인쇄 창 열기)</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={onDownloadPdf}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-stone-600/40 border-t-stone-600 rounded-full animate-spin" />
                    <span>병합 PDF 생성 중... (잠시만 기다려주세요)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>통합 PDF 파일로 직접 다운로드</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={onClose}
                className="w-full py-2 bg-white hover:bg-stone-50 disabled:opacity-50 border border-stone-200 text-stone-500 hover:text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                취소 (성장 리포트로 돌아가기)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

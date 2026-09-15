import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCcw, Download, X, FileText } from 'lucide-react';
import { ImageModalData } from '../types';

interface ImageModalProps {
  data: ImageModalData | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ data, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(Math.round((prev + 0.25) * 100) / 100, 3.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(Math.round((prev - 0.25) * 100) / 100, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  // Reset zoom when modal closes
  const handleClose = () => {
    setZoomLevel(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="no-print fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fffdfa] rounded-3xl border border-[#ebdcd0] shadow-2xl max-w-[96vw] w-full flex flex-col overflow-hidden max-h-[96vh]"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebdcd0] px-4 sm:px-6 py-3.5 bg-[#fcfaf7]">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="bg-amber-100 text-amber-800 p-2 rounded-xl shrink-0">
                  {data.isPdf ? <FileText className="w-5 h-5 text-orange-600" /> : <ZoomIn className="w-5 h-5 text-amber-700" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-stone-800 truncate max-w-xs sm:max-w-md">
                    {data.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500">
                    {data.isPdf ? '교수학습자료 문서 원본 미리보기' : '세부 내용을 확대/축소하여 확인하실 수 있습니다.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Zoom controls + Download + Close */}
              <div className="flex items-center space-x-2 shrink-0">
                {/* Zoom In/Out Controls */}
                <div className="flex items-center bg-stone-100 border border-stone-300/80 rounded-xl px-1.5 py-1 space-x-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    className="p-1 hover:bg-stone-200 text-stone-700 rounded-lg disabled:opacity-30 transition-all cursor-pointer"
                    title="축소 (Zoom Out)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-stone-700 px-1 min-w-[3rem] text-center select-none">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3.0}
                    className="p-1 hover:bg-stone-200 text-stone-700 rounded-lg disabled:opacity-30 transition-all cursor-pointer"
                    title="확대 (Zoom In)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1 hover:bg-stone-200 text-stone-700 rounded-lg transition-all cursor-pointer"
                    title="원래 크기로 복원 (100%)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <a
                  href={data.src}
                  download={`${data.title}.png`}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-orange-100 cursor-pointer"
                  title="자료 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">다운로드</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all p-1.5 rounded-xl cursor-pointer"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-[#231b15] flex items-center justify-center min-h-[350px]">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full flex items-center justify-center"
              >
                <img
                  src={data.src}
                  alt={data.title}
                  className="max-h-[74vh] max-w-[90vw] object-contain mx-auto rounded-lg shadow-2xl border border-stone-800 bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#ebdcd0] bg-[#fcfaf7] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-stone-600 font-medium">
              <span className="flex items-center space-x-1.5">
                <span>💡 상단 확대/축소 버튼 또는 마우스 스크롤로 문서를 상세히 탐색할 수 있습니다.</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl transition-all cursor-pointer text-xs"
                >
                  닫기
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

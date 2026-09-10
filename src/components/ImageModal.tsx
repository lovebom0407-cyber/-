import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, Download, X, FileText } from 'lucide-react';
import { ImageModalData } from '../types';

interface ImageModalProps {
  data: ImageModalData | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ data, onClose }) => {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="no-print fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fffdfa] rounded-3xl border border-[#ebdcd0] shadow-2xl max-w-[95vw] w-full flex flex-col overflow-hidden max-h-[95vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ebdcd0] px-6 py-4 bg-[#fcfaf7]">
              <div className="flex items-center space-x-2.5">
                <div className="bg-amber-100 text-amber-800 p-2 rounded-xl">
                  {data.isPdf ? <FileText className="w-5 h-5 text-orange-600" /> : <ZoomIn className="w-5 h-5 text-amber-700" />}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-800 truncate max-w-md">
                    {data.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500">
                    {data.isPdf ? '교수학습자료 문서 원본 미리보기' : '세부 내용을 확대하여 선명하게 확인하실 수 있습니다.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={data.src}
                  download={`${data.title}.png`}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-orange-100 cursor-pointer"
                  title="자료 다운로드"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">다운로드</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all p-2 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-[#2d241e]/95 flex items-center justify-center min-h-0">
              <img
                src={data.src}
                alt={data.title}
                className="max-h-[76vh] w-full object-contain mx-auto rounded-lg shadow-lg border border-stone-800"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#ebdcd0] bg-[#fcfaf7] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-600 font-medium">
              <span>
                💡 본 교수학습자료는 성찰 리포트 PDF 출력 시 후속 페이지로 자동 병합됩니다.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl transition-all w-full sm:w-auto cursor-pointer"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

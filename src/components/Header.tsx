import React from 'react';
import { BookOpen, Sparkles, Share2, Layers, Eye } from 'lucide-react';
import { TeacherInfo } from '../types';

interface HeaderProps {
  teacherInfo: TeacherInfo;
  isViewOnly: boolean;
  isFullView: boolean;
  onToggleFullView: () => void;
  onLoadPreset: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  teacherInfo,
  isViewOnly,
  isFullView,
  onToggleFullView,
  onLoadPreset,
  onShare,
}) => {
  return (
    <>
      <header
        id="app-header"
        className="no-print bg-[#fffefc] border-b border-[#ebdcd0] sticky top-0 z-40 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shadow-2xs transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 p-2.5 rounded-2xl text-white shadow-md shadow-orange-100/70 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 tracking-tight">
                나의 수업 성장 리포트
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 font-mono">
                렌즈 1 타당성 점검
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              교원 대상 AI 디지털 교수·학습 역량(D3·E3·F3) 자가 진단 및 교수학습자료 연계 리포트
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isViewOnly && (
            <>
              <button
                id="btn-load-preset"
                type="button"
                onClick={onLoadPreset}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-800 text-xs font-semibold rounded-xl transition-all border border-amber-200 cursor-pointer shadow-3xs"
                title="2026 AI 에듀테크 실전사례 프리셋 불러오기"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">실전사례</span>
                <span>프리셋 불러오기</span>
              </button>

              <button
                id="btn-toggle-view"
                type="button"
                onClick={onToggleFullView}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold rounded-xl transition-all border border-stone-200 cursor-pointer"
                title={isFullView ? "에디터 분할 화면으로 전환" : "포스터 전용 넓은 화면으로 전환"}
              >
                {isFullView ? (
                  <>
                    <Layers className="w-3.5 h-3.5 text-stone-600" />
                    <span>에디터 분할 뷰</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-stone-600" />
                    <span>포스터 전용 뷰</span>
                  </>
                )}
              </button>

              <button
                id="btn-share-link"
                type="button"
                onClick={onShare}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold rounded-xl transition-all border border-stone-200 cursor-pointer"
                title="현재 작성된 수업 성장 리포트 공유 링크 복사"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">공유 링크</span>
                <span>복사</span>
              </button>
            </>
          )}
        </div>
      </header>

      {isViewOnly && (
        <div
          id="shared-view-banner"
          className="no-print bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white px-6 py-4 shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-3 max-w-5xl mx-auto w-full">
            <div className="bg-white/20 p-2 rounded-xl shrink-0">
              <Share2 className="w-5 h-5 text-amber-200 animate-pulse" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                <span>✨ {teacherInfo.teacherName || '동료 선생님'}님의 수업 성장 리포트 공유 결과 (조회 전용)</span>
              </h3>
              <p className="text-xs text-amber-100 font-medium mt-0.5 leading-relaxed">
                동료 교사분이 작성/공유한 &quot;수업 성장 리포트 및 교수학습자료&quot; 결과 페이지입니다.
                상단의 [PDF 내보내기]를 누르시면 수업 성장 리포트와 연계 교수학습자료가 결합된 통합 문서를 저장하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

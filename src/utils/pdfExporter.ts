import html2canvas from 'html2canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import { sanitizeClonedDocument } from './colorSanitizer';
import { AttachedDocument } from '../types';

export interface GeneratePdfOptions {
  elementId?: string;
  element?: HTMLElement | null;
  teacherName?: string;
  date?: string;
  planDoc?: AttachedDocument | null;
  materialDoc?: AttachedDocument | null;
  onProgress?: (msg: string) => void;
}

// Convert any image (including data:image/svg+xml or PNG) to JPEG bytes for pdf-lib
async function convertDataUrlToJpgBytes(dataUrl: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(img.naturalWidth || img.width, 1000);
      canvas.height = Math.round((canvas.width * (img.naturalHeight || img.height)) / (img.naturalWidth || img.width)) || 700;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve(new Uint8Array(buf));
        },
        'image/jpeg',
        0.95
      );
    };
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

export async function exportPosterToPdf({
  elementId = 'print-poster',
  element = null,
  teacherName = '선생님',
  date = new Date().toISOString().split('T')[0],
  planDoc = null,
  materialDoc = null,
  onProgress,
}: GeneratePdfOptions): Promise<boolean> {
  const targetElement = element || document.getElementById(elementId);
  if (!targetElement) {
    throw new Error('인쇄할 포스터 요소를 찾을 수 없습니다.');
  }

  onProgress?.('1단계: 수업 성장 리포트 포스터 고해상도 렌더링 중...');

  try {
    // 1. Render Poster to Canvas
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fbf9f5',
      logging: false,
      onclone: (clonedDoc) => {
        sanitizeClonedDocument(clonedDoc);
      },
    });

    const posterJpgBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.98);
    });

    if (!posterJpgBlob) {
      throw new Error('포스터 이미지 데이터 생성 실패');
    }

    const posterBytes = new Uint8Array(await posterJpgBlob.arrayBuffer());

    // 2. Create PDF with pdf-lib
    onProgress?.('2단계: A4 통합 PDF 문서 조립 중...');
    const mergedPdf = await PDFDocument.create();

    // Standard A4 dimensions in PDF points (72 DPI): 595.28 x 841.89 pt (210 x 297 mm)
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    // Page 1: Poster Report
    const posterJpg = await mergedPdf.embedJpg(posterBytes);
    const posterDims = posterJpg.scaleToFit(A4_WIDTH - 20, A4_HEIGHT - 20);

    const page1 = mergedPdf.addPage([A4_WIDTH, A4_HEIGHT]);
    page1.drawImage(posterJpg, {
      x: (A4_WIDTH - posterDims.width) / 2,
      y: (A4_HEIGHT - posterDims.height) / 2,
      width: posterDims.width,
      height: posterDims.height,
    });

    // 3. Append 지도안 PDF (Plan Document)
    if (planDoc) {
      onProgress?.('3단계: 지도안 PDF 자료 병합 중...');
      if (planDoc.pdfBytes && planDoc.pdfBytes.length > 0) {
        try {
          const planPdf = await PDFDocument.load(planDoc.pdfBytes);
          const copiedPages = await mergedPdf.copyPages(planPdf, planPdf.getPageIndices());
          copiedPages.forEach((p) => mergedPdf.addPage(p));
        } catch (err) {
          console.warn('Failed to load raw plan PDF bytes, falling back to preview image:', err);
          if (planDoc.dataUrl) {
            await appendImageAsPage(mergedPdf, planDoc.dataUrl, `[교수학습자료 1] ${planDoc.name || '지도안 PDF'}`);
          }
        }
      } else if (planDoc.dataUrl) {
        await appendImageAsPage(mergedPdf, planDoc.dataUrl, `[교수학습자료 1] ${planDoc.name || '지도안 PDF'}`);
      }
    }

    // 4. Append 학습자료 PDF (Material Document)
    if (materialDoc) {
      onProgress?.('4단계: 학습자료 PDF 자료 병합 중...');
      if (materialDoc.pdfBytes && materialDoc.pdfBytes.length > 0) {
        try {
          const matPdf = await PDFDocument.load(materialDoc.pdfBytes);
          const copiedPages = await mergedPdf.copyPages(matPdf, matPdf.getPageIndices());
          copiedPages.forEach((p) => mergedPdf.addPage(p));
        } catch (err) {
          console.warn('Failed to load raw material PDF bytes, falling back to preview image:', err);
          if (materialDoc.dataUrl) {
            await appendImageAsPage(mergedPdf, materialDoc.dataUrl, `[교수학습자료 2] ${materialDoc.name || '학습자료 PDF'}`);
          }
        }
      } else if (materialDoc.dataUrl) {
        await appendImageAsPage(mergedPdf, materialDoc.dataUrl, `[교수학습자료 2] ${materialDoc.name || '학습자료 PDF'}`);
      }
    }

    onProgress?.('5단계: 최종 통합 PDF 파일 생성 완료!');
    const finalPdfBytes = await mergedPdf.save();

    // Trigger Browser Download
    const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTeacherName = (teacherName || '선생님').replace(/[^\w가-힣]/g, '_');
    const safeDate = (date || '2026').replace(/[^\w-]/g, '_');
    link.href = downloadUrl;
    link.download = `수업_성장_리포트_${safeTeacherName}_${safeDate}_교수학습자료포함.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('PDF generation & merge error:', error);
    throw error;
  }
}

async function appendImageAsPage(pdfDoc: PDFDocument, dataUrl: string, title: string) {
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  try {
    const jpgBytes = await convertDataUrlToJpgBytes(dataUrl);
    const embeddedImg = await pdfDoc.embedJpg(jpgBytes);
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    // Draw background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: A4_WIDTH,
      height: A4_HEIGHT,
      color: rgb(0.985, 0.98, 0.97), // warm soft ivory
    });

    // Outer border
    page.drawRectangle({
      x: 18,
      y: 18,
      width: A4_WIDTH - 36,
      height: A4_HEIGHT - 36,
      borderWidth: 1.5,
      borderColor: rgb(0.85, 0.82, 0.78),
      color: rgb(1, 1, 1),
    });

    const maxImgWidth = A4_WIDTH - 60;
    const maxImgHeight = A4_HEIGHT - 80;
    const dims = embeddedImg.scaleToFit(maxImgWidth, maxImgHeight);

    page.drawImage(embeddedImg, {
      x: (A4_WIDTH - dims.width) / 2,
      y: (A4_HEIGHT - dims.height) / 2 - 10,
      width: dims.width,
      height: dims.height,
    });
  } catch (err) {
    console.warn(`Failed to append image page for ${title}:`, err);
  }
}

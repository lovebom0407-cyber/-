import * as pdfjsLib from 'pdfjs-dist';

// Setup worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface PdfRenderResult {
  pageCount: number;
  firstPageDataUrl: string;
  pageImages: string[];
  extractedText: string;
}

/**
 * Renders a PDF Uint8Array to images and extracts plain text.
 */
export async function renderPdfPages(
  pdfBytes: Uint8Array,
  maxPagesToRender: number = 4
): Promise<PdfRenderResult> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
    });

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;
    const pageImages: string[] = [];
    let extractedText = '';

    const pagesToRender = Math.min(pageCount, maxPagesToRender);

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);

      // Extract text
      try {
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        extractedText += `\n[페이지 ${pageNum}]\n` + pageText;
      } catch (err) {
        console.warn(`Failed to extract text from page ${pageNum}:`, err);
      }

      // Render canvas for preview
      if (pageNum <= pagesToRender) {
        try {
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (context) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext as any).promise;
            pageImages.push(canvas.toDataURL('image/png'));
          }
        } catch (err) {
          console.warn(`Failed to render canvas for page ${pageNum}:`, err);
        }
      }
    }

    return {
      pageCount: pageCount || 1,
      firstPageDataUrl: pageImages[0] || createFallbackPdfSvg('PDF 문서', '1 페이지'),
      pageImages: pageImages.length > 0 ? pageImages : [createFallbackPdfSvg('PDF 문서', '1 페이지')],
      extractedText: extractedText.trim(),
    };
  } catch (error) {
    console.warn('PDF.js rendering fallback triggered:', error);
    const fallbackSvg = createFallbackPdfSvg('PDF 문서 미리보기', '탑재 완료');
    return {
      pageCount: 1,
      firstPageDataUrl: fallbackSvg,
      pageImages: [fallbackSvg],
      extractedText: '',
    };
  }
}

export function createFallbackPdfSvg(title: string, subtitle: string): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" width="100%" height="100%">
    <rect width="600" height="420" fill="#fffdfa" rx="16" />
    <rect x="20" y="20" width="560" height="380" fill="#ffffff" rx="12" stroke="#ebdcd0" stroke-width="2" />
    <rect x="40" y="40" width="520" height="48" rx="10" fill="#fcf6f0" stroke="#f0e2d5" />
    <circle cx="65" cy="64" r="14" fill="#e06a3b" />
    <path d="M60 58 L70 58 L70 70 L60 70 Z" fill="#ffffff" />
    <text x="90" y="70" font-family="'Noto Sans KR', sans-serif" font-size="16" font-weight="bold" fill="#2d2823">${title}</text>
    <line x1="40" y1="110" x2="560" y2="110" stroke="#f0e5da" stroke-width="1.5" />
    <rect x="40" y="130" width="240" height="16" rx="4" fill="#f2eae1" />
    <rect x="40" y="160" width="520" height="12" rx="4" fill="#f8f4ef" />
    <rect x="40" y="184" width="500" height="12" rx="4" fill="#f8f4ef" />
    <rect x="40" y="208" width="480" height="12" rx="4" fill="#f8f4ef" />
    <rect x="40" y="240" width="250" height="120" rx="8" fill="#fcfaf7" stroke="#ebdcd0" />
    <rect x="310" y="240" width="250" height="120" rx="8" fill="#fcfaf7" stroke="#ebdcd0" />
    <text x="300" y="380" font-family="'Noto Sans KR', sans-serif" font-size="13" font-weight="bold" fill="#a89a8c" text-anchor="middle">📄 ${subtitle}</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

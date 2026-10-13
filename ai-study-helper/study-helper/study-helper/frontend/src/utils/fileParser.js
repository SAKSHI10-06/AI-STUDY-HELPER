import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Use standard CDN for the worker to avoid Vite build issues
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export const extractTextFromFile = async (file) => {
  if (!file) throw new Error("No file provided");

  const fileName = file.name.toLowerCase();

  try {
    if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractPdfText(file);
    }
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractDocxText(file);
    }
    else if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    }
    else {
      throw new Error('Unsupported format. Please upload PDF, DOCX, or TXT.');
    }
  } catch (error) {
    console.error("File Parsing Error:", error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
};

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  // Cap at 50 pages to prevent browser freezing on massive books
  const maxPages = Math.min(pdf.numPages, 50);

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  if (!fullText.trim()) {
    throw new Error("PDF text is empty. It might be a scanned image (OCR not supported).");
  }

  return fullText;
};

const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};
export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

export interface PdfJsonResult {
  text: string;
  pages: Array<{
    pageNumber: number;
    text: string;
    width: number;
    height: number;
  }>;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
    pageCount: number;
  };
  error?: string;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (!isBrowser) {
    throw new Error('PDF conversion is only available in browser environment');
  }
  
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    // Set the worker source to use local file
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

export async function pdf2json(file: File): Promise<PdfJsonResult> {
  // Early return if not in browser
  if (!isBrowser) {
    return {
      text: "",
      pages: [],
      metadata: { pageCount: 0 },
      error: "PDF conversion is only available in browser environment",
    };
  }
  
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    
    const pageCount = pdf.numPages;
    const pages: Array<{
      pageNumber: number;
      text: string;
      width: number;
      height: number;
    }> = [];
    
    let fullText = "";
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      pages.push({
        pageNumber: pageNum,
        text: pageText,
        width: viewport.width,
        height: viewport.height,
      });
      
      fullText += pageText + "\n";
    }
    
    // Extract metadata
    const metadata = await pdf.getMetadata();
    
    return {
      text: fullText.trim(),
      pages,
      metadata: {
        title: metadata?.info?.Title || undefined,
        author: metadata?.info?.Author || undefined,
        subject: metadata?.info?.Subject || undefined,
        creator: metadata?.info?.Creator || undefined,
        producer: metadata?.info?.Producer || undefined,
        creationDate: metadata?.info?.CreationDate || undefined,
        modificationDate: metadata?.info?.ModDate || undefined,
        pageCount,
      },
    };
  } catch (err) {
    return {
      text: "",
      pages: [],
      metadata: { pageCount: 0 },
      error: `Failed to convert PDF to JSON: ${err}`,
    };
  }
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  // Early return if not in browser
  if (!isBrowser) {
    return {
      imageUrl: "",
      file: null,
      error: "PDF conversion is only available in browser environment",
    };
  }
  
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    await page.render({ canvasContext: context!, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}
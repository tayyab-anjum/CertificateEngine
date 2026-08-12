import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker setup fallback', e);
}

/**
 * Reads a PDF or Image file and converts it into a high-resolution Data URL canvas image
 * @param {File} file 
 * @returns {Promise<{dataUrl: string, width: number, height: number}>}
 */
export const loadTemplateFromFile = async (file) => {
  const fileName = (file.name || '').toLowerCase();
  const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');

  if (isPdf) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Read 1st page of certificate template
      
      // Render at 2.5x scale for high crisp rendering quality
      const viewport = page.getViewport({ scale: 2.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return {
        dataUrl: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height
      };
    } catch (err) {
      console.error('PDF JS load error:', err);
      throw new Error('Could not render PDF template page: ' + err.message);
    }
  } else {
    // PNG, JPG, WebP image file
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            dataUrl: e.target.result,
            width: img.naturalWidth || 2000,
            height: img.naturalHeight || 1414
          });
        };
        img.onerror = () => reject(new Error('Selected image file could not be decoded.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsDataURL(file);
    });
  }
};

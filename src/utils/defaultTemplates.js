// Utility to generate procedural high-res certificate backgrounds if no file is uploaded yet

export const generateDefaultTemplateCanvas = (theme = 'gold') => {
  const canvas = document.createElement('canvas');
  canvas.width = 2000;
  canvas.height = 1414;
  const ctx = canvas.getContext('2d');

  if (theme === 'gold') {
    // Rich Gold Elegant Royalty Theme
    const bgGrad = ctx.createLinearGradient(0, 0, 2000, 1414);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2000, 1414);

    // Decorative Borders
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 12;
    ctx.strokeRect(50, 50, 1900, 1314);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(66, 66, 1868, 1282);

    // Corner Ornaments
    const drawCorner = (x, y, r) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();
    };
    drawCorner(100, 100, 30);
    drawCorner(1900, 100, 30);
    drawCorner(100, 1314, 30);
    drawCorner(1900, 1314, 30);

    // Header Text static watermark
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 48px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 1000, 240);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 24px Montserrat, sans-serif';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', 1000, 340);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 24px Montserrat, sans-serif';
    ctx.fillText('FOR SUCCESSFULLY COMPLETING THE PROGRAM', 1000, 680);

  } else if (theme === 'blue') {
    // Modern Blue Gradient Tech Theme
    const bgGrad = ctx.createLinearGradient(0, 0, 2000, 1414);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2000, 1414);

    // Modern Geometric Accents
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(400, 0);
    ctx.lineTo(0, 400);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(2000, 1414);
    ctx.lineTo(1600, 1414);
    ctx.lineTo(2000, 1014);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, 60, 1880, 1294);

    ctx.fillStyle = '#1e293b';
    ctx.font = '700 52px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF ACCOMPLISHMENT', 1000, 240);
  }

  return canvas.toDataURL('image/png');
};

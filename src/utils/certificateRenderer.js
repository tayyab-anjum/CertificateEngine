/**
 * Renders a single certificate onto an HTML Canvas with exact styling & text fields.
 * Fields are fully dynamic - field.id matches the column key in recipient data.
 */
export const renderCertificateToCanvas = async (templateImg, recipient, fields) => {
  const canvas = document.createElement('canvas');
  canvas.width = templateImg.naturalWidth || templateImg.width || 2000;
  canvas.height = templateImg.naturalHeight || templateImg.height || 1414;
  const ctx = canvas.getContext('2d');

  // Draw background template image
  ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

  // Render each text field on top
  fields.forEach(field => {
    if (!field.enabled) return;

    // Dynamic lookup: field.id is the column name from the uploaded data
    let textValue = recipient[field.id] || field.customText || '';

    if (field.isUppercase && textValue) {
      textValue = textValue.toUpperCase();
    }

    if (!textValue) return;

    ctx.save();
    
    // Font setup
    const fontStyle = field.fontStyle || 'normal';
    const fontWeight = field.fontWeight || '600';
    const fontSize = field.fontSize || 42;
    const fontFamily = field.fontFamily || 'Playfair Display';

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", serif`;
    ctx.fillStyle = field.color || '#0f172a';
    ctx.textAlign = field.align || 'center';
    ctx.textBaseline = 'middle';

    // Calculate X and Y coordinates (percentage based)
    const posX = (field.x / 100) * canvas.width;
    const posY = (field.y / 100) * canvas.height;

    // Optional text shadow
    if (field.shadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    ctx.fillText(textValue, posX, posY);
    ctx.restore();
  });

  return canvas;
};

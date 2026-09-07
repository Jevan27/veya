import { isDarkColor } from './card-colors';

export interface CardCanvasExportParams {
  name: string;
  role: string;
  company: string;
  sloganLines: string[] | null;
  phone: string;
  email: string;
  address: string;
  website: string;
  initials: string;
  primaryColor?: string;
  cardBackgroundColor?: string;
}

/**
 * Web Canvas Fallback Renderer:
 * Directly draws the high-resolution 1050x600 px digital business card on an HTML5 canvas
 * and triggers a direct PNG file download.
 */
export function downloadCardViaWebCanvas({
  name,
  role,
  company,
  sloganLines,
  phone,
  email,
  address,
  website,
  initials,
  primaryColor = '#111111',
  cardBackgroundColor = '#FFFFFF',
}: CardCanvasExportParams): void {
  if (typeof document === 'undefined') return;

  const isDark = isDarkColor(cardBackgroundColor);
  const canvas = document.createElement('canvas');
  canvas.width = 1050;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background with rounded corners
  const radius = 36;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(1050 - radius, 0);
  ctx.quadraticCurveTo(1050, 0, 1050, radius);
  ctx.lineTo(1050, 600 - radius);
  ctx.quadraticCurveTo(1050, 600, 1050 - radius, 600);
  ctx.lineTo(radius, 600);
  ctx.quadraticCurveTo(0, 600, 0, 600 - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = cardBackgroundColor;
  ctx.fill();
  ctx.clip();

  // Top-Right gradient accent curve
  const grad = ctx.createLinearGradient(800, 0, 1050, 200);
  grad.addColorStop(0, primaryColor + '70');
  grad.addColorStop(0.5, primaryColor + '50');
  grad.addColorStop(1, primaryColor + '20');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(700, 0);
  ctx.bezierCurveTo(800, 60, 940, 120, 1050, 160);
  ctx.lineTo(1050, 0);
  ctx.closePath();
  ctx.fill();

  // Avatar box
  const avatarX = 54;
  const avatarY = 54;
  const avatarSize = 140;
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : primaryColor + '18';
  ctx.beginPath();
  if ('roundRect' in ctx && typeof ctx.roundRect === 'function') {
    ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 32);
  } else {
    ctx.rect(avatarX, avatarY, avatarSize, avatarSize);
  }
  ctx.fill();
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2);

  // Identity Details
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(name, 222, 54);

  ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
  ctx.font = '500 26px sans-serif';
  ctx.fillText(role, 222, 108);

  // Veya Logo Badge & Company
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  if ('roundRect' in ctx && typeof ctx.roundRect === 'function') {
    ctx.roundRect(222, 150, 30, 30, 8);
  } else {
    ctx.rect(222, 150, 30, 30);
  }
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 19px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('v', 237, 156);

  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(company, 264, 150);

  // Slogan on top right (if provided)
  if (sloganLines && sloganLines.length > 0) {
    ctx.textAlign = 'right';
    ctx.fillStyle = isDark ? '#F1F5F9' : '#0F172A';
    ctx.font = '800 20px sans-serif';
    let sloganY = 54;
    sloganLines.forEach((line) => {
      ctx.fillText(line.toUpperCase(), 996, sloganY);
      sloganY += 26;
    });
    ctx.fillStyle = primaryColor;
    ctx.fillRect(996 - 65, sloganY + 4, 65, 5);
  }

  // Horizontal Divider
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : '#F1F5F9';
  ctx.fillRect(54, 238, 942, 2);

  // 2x2 Contact Grid (Clean icons without background, tight row spacing)
  const drawItem = (iconSymbol: string, text: string, x: number, y: number) => {
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconSymbol, x, y + 15);

    ctx.fillStyle = '#334155';
    ctx.font = '500 22px sans-serif';
    const lines = text.split('\n');
    if (lines.length > 1) {
      ctx.fillText(lines[0], x + 38, y + 6);
      ctx.font = '400 18px sans-serif';
      ctx.fillText(lines[1], x + 38, y + 26);
    } else {
      ctx.fillText(text, x + 38, y + 15);
    }
  };

  drawItem('📞', phone, 54, 275);
  drawItem('✉️', email, 540, 275);
  drawItem('📍', address, 54, 335);
  drawItem('🌐', website, 540, 335);

  // Download trigger
  const pngUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${name.toLowerCase().replace(/\s+/g, '_')}_card.png`;
  link.href = pngUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

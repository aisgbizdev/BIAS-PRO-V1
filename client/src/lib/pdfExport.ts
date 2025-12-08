import jsPDF from 'jspdf';
import type { BiasAnalysisResult } from '@shared/schema';

interface ExportOptions {
  language: 'en' | 'id';
  mode?: 'tiktok' | 'marketing';
}

export async function exportAnalysisToPDF(
  result: BiasAnalysisResult,
  options: ExportOptions
): Promise<void> {
  const { language, mode = 'tiktok' } = options;
  const isId = language === 'id';
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(236, 72, 153);
  doc.roundedRect(margin - 5, yPos - 5, contentWidth + 10, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BiAS Pro', margin, yPos + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const modeText = mode === 'tiktok' 
    ? (isId ? 'TikTok Pro Analysis' : 'TikTok Pro Analysis')
    : (isId ? 'Marketing Pro Analysis' : 'Marketing Pro Analysis');
  doc.text(modeText, pageWidth - margin - 5, yPos + 10, { align: 'right' });
  
  yPos += 35;

  doc.setFillColor(30, 30, 30);
  doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(isId ? 'Skor Keseluruhan' : 'Overall Score', margin + 10, yPos + 12);
  
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  const scoreColor = result.overallScore >= 7 ? [34, 197, 94] : result.overallScore >= 5 ? [234, 179, 8] : [239, 68, 68];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${result.overallScore}/10`, pageWidth - margin - 10, yPos + 28, { align: 'right' });
  
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summary = isId ? result.summaryId : result.summary;
  const summaryLines = doc.splitTextToSize(summary, contentWidth - 80);
  doc.text(summaryLines.slice(0, 2), margin + 10, yPos + 24);
  
  yPos += 50;

  addNewPageIfNeeded(60);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(isId ? 'Detail 8 Layer BIAS' : '8 Layer BIAS Details', margin, yPos);
  yPos += 10;

  for (const layer of result.layers) {
    addNewPageIfNeeded(25);
    
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(layer.layer, margin + 5, yPos + 7);
    
    const layerScoreColor = layer.score >= 7 ? [34, 197, 94] : layer.score >= 5 ? [234, 179, 8] : [239, 68, 68];
    doc.setTextColor(layerScoreColor[0], layerScoreColor[1], layerScoreColor[2]);
    doc.text(`${layer.score}/10`, pageWidth - margin - 5, yPos + 7, { align: 'right' });
    
    const progressWidth = 60;
    const progressHeight = 4;
    const progressX = pageWidth - margin - 70;
    const progressY = yPos + 10;
    
    doc.setFillColor(50, 50, 50);
    doc.roundedRect(progressX, progressY, progressWidth, progressHeight, 2, 2, 'F');
    
    doc.setFillColor(layerScoreColor[0], layerScoreColor[1], layerScoreColor[2]);
    doc.roundedRect(progressX, progressY, (layer.score / 10) * progressWidth, progressHeight, 2, 2, 'F');
    
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const feedback = isId && layer.feedbackId ? layer.feedbackId : layer.feedback;
    const feedbackLines = doc.splitTextToSize(feedback, contentWidth - 80);
    doc.text(feedbackLines[0] || '', margin + 5, yPos + 16);
    
    yPos += 25;
  }

  yPos += 5;
  addNewPageIfNeeded(50);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(isId ? 'Rekomendasi' : 'Recommendations', margin, yPos);
  yPos += 8;

  const recommendations = isId ? result.recommendationsId : result.recommendations;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  for (let i = 0; i < Math.min(recommendations.length, 5); i++) {
    addNewPageIfNeeded(15);
    
    doc.setFillColor(236, 72, 153);
    doc.circle(margin + 3, yPos + 2, 2, 'F');
    
    const recLines = doc.splitTextToSize(recommendations[i], contentWidth - 15);
    doc.text(recLines, margin + 10, yPos + 4);
    yPos += recLines.length * 5 + 5;
  }

  yPos = pageHeight - 25;
  
  doc.setFillColor(25, 25, 25);
  doc.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F');
  
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.text(isId ? 'Dibuat dengan BiAS Pro - Behavioral Intelligence Audit System' : 'Generated by BiAS Pro - Behavioral Intelligence Audit System', margin + 5, yPos + 6);
  
  const date = new Date().toLocaleDateString(isId ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(date, pageWidth - margin - 5, yPos + 6, { align: 'right' });
  
  doc.setTextColor(236, 72, 153);
  doc.text('@bias_pro', margin + 5, yPos + 11);
  doc.setTextColor(156, 163, 175);
  doc.text('bias-pro.replit.app', pageWidth - margin - 5, yPos + 11, { align: 'right' });

  const filename = `BiAS_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

export async function exportChatToPDF(
  messages: Array<{ type: string; content: string; timestamp: Date }>,
  options: ExportOptions
): Promise<void> {
  const { language, mode = 'tiktok' } = options;
  const isId = language === 'id';
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFillColor(236, 72, 153);
  doc.roundedRect(margin - 5, yPos - 5, contentWidth + 10, 25, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BiAS Pro', margin, yPos + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const title = isId ? 'Riwayat Chat' : 'Chat History';
  doc.text(title, pageWidth - margin - 5, yPos + 10, { align: 'right' });
  
  yPos += 35;

  for (const message of messages) {
    addNewPageIfNeeded(30);
    
    const isUser = message.type === 'user';
    const bgColor = isUser ? [236, 72, 153] : [30, 30, 30];
    
    const cleanContent = message.content.replace(/\*\*/g, '').replace(/#{1,3}\s/g, '');
    const lines = doc.splitTextToSize(cleanContent, contentWidth - 20);
    const boxHeight = Math.max(15, lines.length * 5 + 10);
    
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, margin + 10, yPos + 8);
    
    yPos += boxHeight + 5;
  }

  yPos = pageHeight - 15;
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.text('@bias_pro', margin, yPos);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin, yPos, { align: 'right' });

  const filename = `BiAS_Chat_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

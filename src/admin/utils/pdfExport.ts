/**
 * PDF Export Utility
 * Helper functions for adding watermark, logo, and branding to PDF exports
 */

import jsPDF from 'jspdf';

/**
 * Add watermark, logo, center text, and user info to PDF
 * @param doc - jsPDF document instance
 * @param userName - Name of the user exporting the file
 */
export const addPDFBranding = (doc: jsPDF, userName: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add watermark "The Hostel Hub" - rotated and semi-transparent
  // Using a lighter gray color to simulate transparency
  doc.setTextColor(200, 200, 200); // Light gray for watermark effect
  doc.setFontSize(50);
  doc.setFont('helvetica', 'bold');
  
  // Rotate text for watermark effect (jsPDF doesn't support angle directly, so we'll use a workaround)
  // For now, we'll place it centered without rotation
  const originalTextColor = doc.getTextColor();
  doc.text('The Hostel Hub', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    baseline: 'middle'
  });
  
  // Reset text color
  doc.setTextColor(originalTextColor.r || 0, originalTextColor.g || 0, originalTextColor.b || 0);
  
  // Add logo placeholder on left top (you can replace this with actual logo image)
  // For now, we'll add a text-based logo
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('The Hostel Hub', 20, 15);
  
  // Add center text "The Hostel Hub"
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('The Hostel Hub', pageWidth / 2, 20, { align: 'center' });
  
  // Add user name who exported the file
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Exported by: ${userName}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
};

/**
 * Add header to each new page
 * @param doc - jsPDF document instance
 * @param userName - Name of the user exporting the file
 */
export const addPDFHeader = (doc: jsPDF, userName: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add logo on left top
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('The Hostel Hub', 20, 15);
  
  // Add center text "The Hostel Hub"
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('The Hostel Hub', pageWidth / 2, 15, { align: 'center' });
  
  // Add user name
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Exported by: ${userName}`, pageWidth - 20, 15, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(20, 20, pageWidth - 20, 20);
};

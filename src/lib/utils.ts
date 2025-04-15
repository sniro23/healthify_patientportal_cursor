
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true 
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// Function to simulate generating a PDF from a medication or prescription
export function generateMedicationPDF(id: string, type: 'medication' | 'prescription'): Promise<Blob> {
  return new Promise((resolve) => {
    // This would be replaced with actual PDF generation logic
    setTimeout(() => {
      // In a real app, this would return a Blob representing a PDF
      const dummyBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      resolve(dummyBlob);
    }, 1000);
  });
}

// Function to download a blob as a file
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


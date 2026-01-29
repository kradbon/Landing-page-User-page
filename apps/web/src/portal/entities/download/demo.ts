import { DownloadItem } from "@/portal/entities/download/types";

export const DEMO_DOWNLOADS: DownloadItem[] = [
  {
    id: "d1",
    title: "Algebra I вЂ” Workbook (PDF)",
    description: "Practice problems for weekly lessons.",
    fileType: "PDF",
    sizeMb: 3.2,
    updatedAt: new Date("2025-12-01")
  },
  {
    id: "d2",
    title: "English вЂ” Essay Template (DOCX)",
    description: "Structured template for argumentative essays.",
    fileType: "DOCX",
    sizeMb: 0.4,
    updatedAt: new Date("2025-11-18")
  },
  {
    id: "d3",
    title: "CS вЂ” Starter Project (ZIP)",
    description: "Starter files for the mini project.",
    fileType: "ZIP",
    sizeMb: 8.9,
    updatedAt: new Date("2025-12-10")
  }
];


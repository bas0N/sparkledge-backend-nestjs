import { ReportType } from '@prisma/client';
export declare class AddReportDto {
    documentId: Number;
    reportType: ReportType;
    content: string;
}

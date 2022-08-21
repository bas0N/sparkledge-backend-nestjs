import { IsNotEmpty, IsOptional } from 'class-validator';
import { ReportType } from '@prisma/client';

export class AddReportDto {
  @IsNotEmpty()
  documentId: Number;
  @IsNotEmpty()
  reportType: ReportType;
  @IsOptional()
  content: string;
}

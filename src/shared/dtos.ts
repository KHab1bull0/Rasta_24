import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, Min } from 'class-validator';
import { IPagination } from './types/interfaces';

export class UploadFilesDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  files: Express.Multer.File[];
}

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class ReqIdDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;
}
export class PaginationDto {
  @ApiProperty({ type: Number, required: false, default: 0, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @ApiProperty({ type: Number, required: false, default: 100 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  perPage: number = 10;

  pagination: IPagination;
}

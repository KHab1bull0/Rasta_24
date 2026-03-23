import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateManagerDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  roleId?: number;
}

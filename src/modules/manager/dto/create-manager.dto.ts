import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateManagerDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  password?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitSignupDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  lastName: string;
}

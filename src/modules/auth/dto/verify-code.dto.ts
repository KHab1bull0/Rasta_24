import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;
}

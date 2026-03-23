import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitSignupDto {
  @ApiProperty({ type: String, example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

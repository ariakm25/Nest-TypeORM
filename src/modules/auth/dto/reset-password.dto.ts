import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'admin@admin.com',
  })
  email: string;
}

export class CheckTokenResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'token',
  })
  token: string;
}

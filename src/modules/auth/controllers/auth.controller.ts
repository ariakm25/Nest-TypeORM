import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdatePasswordDto } from '../dto/update-password.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import {
  CheckTokenResetPasswordDto,
  ResetPasswordDto,
} from 'src/modules/auth/dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'User Login',
    description:
      'Login to get access token & refresh token by email & password',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @ApiOperation({
    summary: 'User Refresh Token',
    description: 'Get new access token & refresh token by refresh token',
  })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('/reset-password')
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Get Reset Password Link from Email',
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.sendResetPasswordEmail(resetPasswordDto);
  }

  @Post('/check-token-reset-password')
  @ApiOperation({
    summary: 'Check Token Reset Password',
    description: 'Check Token Reset Password from Email is valid or not',
  })
  checkTokenResetPassword(
    @Body() checkTokenResetPasswordDto: CheckTokenResetPasswordDto,
  ) {
    return this.authService.checkResetPasswordToken(checkTokenResetPasswordDto);
  }

  @Post('/update-password')
  @ApiOperation({
    summary: 'Update Password By Token',
    description: 'Update Password by Token from Email',
  })
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'User Profile',
    description: 'Get current authenticated user profile',
  })
  @ApiBearerAuth()
  me(@Req() request: any) {
    return this.authService.me(request.user.id);
  }

  @Post('/logout')
  @ApiOperation({
    summary: 'User Logout',
    description: 'Logout current authenticated user',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  logout(@Req() request: any) {
    if (request.user) {
      return this.authService.logout(request.user.id);
    }
    return false;
  }
}

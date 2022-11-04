import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('User-login')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'this is user email id',
        },
        password: {
          type: 'string',
          example: 'johndeo@123',
          description: 'this is user password',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'login successfully!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}

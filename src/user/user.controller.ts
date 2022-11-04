import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Request,
  UploadedFile,
  ParseFilePipeBuilder,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { multerOptions } from '../config/multer.config';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

import {
  CreateUserDto,
  ChangePasswordDto,
  UpdateUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //Signup-User
  @Post('/signup')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User Registration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
          example: 'john deo',
          description: 'This is user full name',
        },
        email: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'This is user email id',
        },
        password: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'This is user password',
        },
        confirmPassword: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'Confirm password of user',
        },
        gender: {
          enum: ['Male', 'Female', 'Other', ''],
          example: ['Male', 'Female', 'Other'],
          description: 'Gender for user',
        },
        userName: {
          type: 'string',
          example: 'joe123',
          description: 'This is user name of user',
        },
        billingAddress: {
          type: 'string',
          example: '91/b newyork, USA',
          description: 'This is user biling address',
        },
        shippingAddress: {
          type: 'string',
          example: '91/a london, uk',
          description: 'This is user shipping address',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'User Profile',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registration successfully!!' })
  @ApiResponse({ status: 409, description: 'User already exists!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  registration(@Body() createUserDto: CreateUserDto, @UploadedFile() file) {
    return this.userService.registration(createUserDto, file);
  }

  //Get-All-User
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get All users!!' })
  @ApiResponse({ status: 200, description: 'Get all users!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  //User-Profile
  @UseGuards(AuthGuard('jwt'))
  @Get('/user-profile')
  @ApiOperation({ summary: 'User Profile!!' })
  @ApiResponse({ status: 200, description: 'User Profile!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  getUserProfile(@Request() req) {
    return this.userService.getUserProfile(req);
  }

  //Delete-User
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req);
  }

  //Update-Profile
  @UseGuards(AuthGuard('jwt'))
  @Put('/')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiOperation({ summary: 'Profile update' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
          example: 'john deo',
          description: 'This is user full name',
        },
        password: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'This is user password',
        },
        confirmPassword: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'Confirm password',
        },
        gender: {
          enum: ['Male', 'Female', 'Other'],
          example: ['Male', 'Female', 'Other'],
          description: 'User Gender',
        },
        userName: {
          type: 'string',
          example: 'joe123',
          description: 'This is username',
        },
        billingAddress: {
          type: 'string',
          example: '91/b newyork, USA',
          description: 'Biling address of user',
        },
        shippingAddress: {
          type: 'string',
          example: '91/a london, uk',
          description: 'This is user shipping address',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'User Profile',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    return this.userService.updateProfile(updateUserDto, req, file);
  }

  //Change-Password
  @UseGuards(AuthGuard('jwt'))
  @Put('/change-password')
  @ApiOperation({ summary: 'Change Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'this is user',
        },
        newPassword: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'This is user email id',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.userService.changePassword(changePasswordDto, req);
  }

  //Forget-Password
  @Post('/forget-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'This is user email',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Please verify details!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  //Reset-Password
  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'This is user email',
        },
        verifyToken: {
          type: 'string',
          example: '@##dfg$$fh$%$jnfjdnjn32222222nasdjnn@#$$$($(990jnfgffjnhnE',
          description: 'VerifyToken for validate user',
        },
        password: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'This is user password',
        },
        confirmPassword: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'Confirm password for user',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  //Verify
  @Post('/verify')
  @ApiOperation({ summary: 'Verify User for reset password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'This is user email',
        },
        verifyToken: {
          type: 'string',
          example: '@##dfg$$fh$%$jnfjdnjn32222222nasdjnn@#$$$($(990jnfgffjnhnE',
          description: 'VerifyToken for validate user',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Please verify details!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  verifyLink(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.userService.verifyLink(forgetPasswordDto);
  }
}

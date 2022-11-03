import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  CreateUserDto,
  ChangePasswordDto,
  UpdateUserDto,
  ForgetPasswordDto,
} from './dto/user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiBody, ApiParam,ApiTags,ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User Registration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1,
          description: 'this is unique id',
        },
        fullName: {
          type: 'string',
          example: 'john deo',
          description: 'this is user full name',
        },
        email: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'this is user email id',
        },
        password: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'this is user password',
        },
        confirmPassword: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'confirm password of user',
        },
        gender: {
          type: 'enum',
          example: 'Female',
          description: 'Gender for user',
        },
        userName: {
          type: 'string',
          example: 'joe123',
          description: 'this is user name of user',
        },
        billingAddress: {
          type: 'string',
          example: '91/b newyork, USA',
          description: 'this is user biling address',
        },
        shippingAddress: {
          type: 'string',
          example: '91/a london, uk',
          description: 'this is user shipping address',
        },
        profileImage: {
          type: 'string',
          example: 'banner.jpg',
          description: 'this is user profile',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registration successfully!!' })
  @ApiResponse({ status: 409, description: 'User already exists!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  store(@Body() createUserDto: CreateUserDto) {
    return this.userService.registration(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get All users!!' })
  @ApiResponse({ status: 200, description: 'Get all users!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId')
  @ApiOperation({ summary: 'User Profile!!' })
  @ApiResponse({ status: 200, description: 'User Profile!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  @ApiParam({
    name: 'userId',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
  getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:userId')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'userId',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:userId')
  @ApiOperation({ summary: 'Profile update' })
  @ApiParam({
    name: 'userId',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
          example: 'john deo',
          description: 'this is user full name',
        },
        password: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'this is user email id',
        },
        confirmPassword: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'this is user email id',
        },
        gender: {
          type: 'string',
          example: 'johndeo@gmail.com',
          description: 'this is user email id',
        },
        userName: {
          type: 'string',
          example: 'joe123',
          description: 'this is user name of user',
        },
        billingAddress: {
          type: 'string',
          example: '91/b newyork, USA',
          description: 'this is user biling address',
        },
        shippingAddress: {
          type: 'string',
          example: '91/a london, uk',
          description: 'this is user shipping address',
        },
        profileImage: {
          type: 'string',
          example: 'banner.jpg',
          description: 'this is user profile',
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
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.updateProfile(updateUserDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/change-password/:userId')
  @ApiOperation({ summary: 'Password change' })
  @ApiParam({
    name: 'userId',
    type: 'integer',
    description: 'enter unique id',
    required: true,
  })
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
          description: 'this is user email id',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully!!' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found!!' })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.changePassword(changePasswordDto, userId);
  }

  @Post('/forget-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'johndeo@123JOE',
          description: 'this is user email',
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
}

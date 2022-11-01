import { Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller("/user")
export class AppController {
  @Get()
  getUsers() {
    return { fullname: 'ayushi patidar' };
  }
  @Get('/:userId')
  getUser(@Param() params:{userId: Number}) {
    return params;
  }
  @Post('/signup')
  store(@Req() req: Request) {
    console.log(req.body);
    return req.body;
  }
  @Delete('/:userId')
  deleteUser(@Param() params:{userId: Number}) {
    return 'user deleted successfully!!';
  }
  @Patch('/:userId')
  updateUser(@Req() req: Request) {
    return 'user updated successfully!!';
  }
}

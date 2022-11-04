import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { log } from 'console';
import { Repository, Not } from 'typeorm';

import {
  CreateUserDto,
  ChangePasswordDto,
  UpdateUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Registration API
  async registration(createUserDto: CreateUserDto, file: any) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('user already exists!!');
    } else {
      if (file) {
        createUserDto.profileImage = file.filename;
      }
      const userName = await this.userRepository.findOne({
        where: { userName: createUserDto.userName },
      });
      if (userName) {
        throw new ConflictException(
          'This username alreday exists, please select different username!!',
        );
      } else {
        if (createUserDto.password === createUserDto.confirmPassword) {
          const hashPassword = await bcrypt.hash(createUserDto.password, 10);
          createUserDto.password = hashPassword;
          createUserDto.confirmPassword = hashPassword;

          return this.userRepository.save(createUserDto);
        } else {
          throw new HttpException('Please enter correct password!!', 400);
        }
      }
    }
  }

  // Get All User API
  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Get USer Profile
  async getUserProfile(req: any) {
    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    if (user) {
      return user;
    }
    throw new HttpException('User Not Found!!', 404);
  }

  // Delete User API
  async deleteUser(req: any) {
    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    if (user) {
      this.userRepository.delete({ email: req.user.email });
      return 'User deleted successfully!!';
    }
    throw new HttpException('User Not Found!!', 404);
  }

  // Update Profile API
  async updateProfile(updateUserDto: UpdateUserDto, req: any, file: any) {
    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    if (user) {
      const userName = await this.userRepository.find({
        where: { userName: updateUserDto.userName, email: Not(req.user.email) },
      });
      if (file) {
        updateUserDto.profileImage = file.filename;
      }
      if (userName.length > 0) {
        throw new ConflictException(
          'Username already exists. please enter unique username !!',
        );
      }
      if (
        updateUserDto.password &&
        updateUserDto.password === updateUserDto.confirmPassword
      ) {
        const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
        updateUserDto.password = hashPassword;
        updateUserDto.confirmPassword = hashPassword;
      } else {
        throw new HttpException('Please enter correct password!!', 400);
      }
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateUserDto)
        .where({ email: req.user.email })
        .execute();
      return 'Profile Updated successfully!!';
    }
    throw new HttpException('User Not Found!!', 404);
  }

  // Change PassWord API
  async changePassword(changePasswordDto: ChangePasswordDto, req: any) {
    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    if (user) {
      const oldPasswordMatch = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
      if (oldPasswordMatch) {
        const hashPassword = await bcrypt.hash(
          changePasswordDto.newPassword,
          10,
        );
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ password: hashPassword, confirmPassword: hashPassword })
          .where({ email: req.user.email })
          .execute();
        return 'Password changed successfully!!';
      }
      throw new HttpException('Please enter correct password!!', 400);
    }
    throw new HttpException('User Not Found!!', 404);
  }

  //Forget Password API
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgetPasswordDto.email },
    });
    if (user) {
      const encryptedEmail = forgetPasswordDto.email;
      const verifyToken = await bcrypt.hash(user.email, 12);
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ verifyToken })
        .where({ email: forgetPasswordDto.email })
        .execute();
      return { verifyToken, encryptedEmail };
    }
    throw new HttpException('User Not Found!!', 404);
  }

  // Verify API for Forget Password
  async verifyLink(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: forgetPasswordDto.email,
        verifyToken: forgetPasswordDto.verifyToken,
      },
    });
    if (user) {
      return 'Verify !!';
    }
    throw new HttpException('Link Expired !!', 200);
  }

  //Reset Password API
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: resetPasswordDto.email,
        verifyToken: resetPasswordDto.verifyToken,
      },
    });
    if (user) {
      if (resetPasswordDto.password === resetPasswordDto.confirmPassword) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            password: resetPasswordDto.password,
            confirmPassword: resetPasswordDto.confirmPassword,
            verifyToken: '',
          })
          .where({ email: resetPasswordDto.email })
          .execute();
        return 'Password changed successfully!!';
      }
      throw new HttpException('Please enter correct password!!', 400);
    }
    throw new HttpException('Link Expire', 400);
  }

  //Find by Email API
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return this.userRepository.findOne({ where: { email } });
    }
    throw new HttpException('Invalid credentials!!', 400);
  }
}

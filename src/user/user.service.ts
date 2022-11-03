import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import {
  CreateUserDto,
  ChangePasswordDto,
  UpdateUserDto,
  ForgetPasswordDto,
} from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    console.log('createUserDto------------', createUserDto);
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('user already exists!!');
    } else {
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
          const hashConfirmPassword = await bcrypt.hash(
            createUserDto.password,
            10,
          );
          createUserDto.password = hashConfirmPassword;
          createUserDto.confirmPassword = hashPassword;

          return this.userRepository.save(createUserDto);
        } else {
          throw new HttpException('Please enter correct password!!', 400);
        }
      }
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserProfile(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return this.userRepository.findOne({ where: { id } });
    }
    throw new HttpException('User Not Found!!', 404);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      this.userRepository.delete(id);
      return 'User deleted successfully!!';
    }
    throw new HttpException('User Not Found!!', 404);
  }

  async updateProfile(updateUserDto: UpdateUserDto, id: number) {
    console.log('updateUserDto-------------', updateUserDto);
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      if (
        updateUserDto.password &&
        updateUserDto.password === updateUserDto.confirmPassword
      ) {
        const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
        const hashConfirmPassword = await bcrypt.hash(
          updateUserDto.password,
          10,
        );
        updateUserDto.password = hashConfirmPassword;
        updateUserDto.confirmPassword = hashPassword;
        return this.userRepository.update(id, updateUserDto);
      }
      return this.userRepository.update(id, updateUserDto);
    }
    throw new HttpException('User Not Found!!', 404);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
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
        this.userRepository.update(id, {
          password: hashPassword,
          confirmPassword: hashPassword,
        });
        return "Password changed successfully!!"
      }
      throw new HttpException('Please enter correct password!!', 400);
    }
    throw new HttpException('User Not Found!!', 404);
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgetPasswordDto.email },
    });
    if (user) {
      const encryptedEmail = await bcrypt.hash(user.email, 12);
      console.log('encryptedEmail------------', encryptedEmail);
      const verifytoken = encryptedEmail + user.id;

      this.userRepository.update(
        { email: forgetPasswordDto.email },
        verifytoken,
      );
      return { verifytoken, encryptedEmail };
    }
    throw new HttpException('User Not Found!!', 404);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return this.userRepository.findOne({ where: { email } });
    }
    throw new HttpException('Invalid credentials!!', 400);
  }
}

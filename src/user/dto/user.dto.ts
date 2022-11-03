import {
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export type Gender = 'Male' | 'Female' | 'Other' | '';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  userName: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
  @IsEnum(['Male', 'Female', 'Other', ''])
  @IsOptional()
  gender: Gender;
  @IsString()
  @IsOptional()
  profileImage: string;
  @IsString()
  @IsOptional()
  shippingAddress: string;
  @IsString()
  @IsOptional()
  billingAddress: string;
  @IsOptional()
  verifyToken:string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  userName: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  confirmPassword: string;
  @IsEnum(['Male', 'Female', 'Other', ''])
  @IsOptional()
  gender: Gender;
  @IsString()
  @IsOptional()
  profileImage: string;
  @IsString()
  @IsOptional()
  shippingAddress: string;
  @IsString()
  @IsOptional()
  billingAddress: string;
}
export class ForgetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsOptional()
    verifyToken:string;
}
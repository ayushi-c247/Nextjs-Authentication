import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
export type Gender = 'Male' | 'Female' | 'Other' | '';

@Entity()
export class User {
  @ApiProperty({ description: 'primary key as user Id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'joedeo@gmail.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User full name', example: 'joe deo' })
  @Column()
  fullName: string;

  @ApiProperty({ description: 'User username', example: 'joe123' })
  @Column({ unique: true })
  userName: string;

  @ApiProperty({ description: 'User password', example: 'joe@123' })
  @Column()
  password: string;

  @ApiProperty({ description: 'User confirm password', example: 'joe@123' })
  @Column()
  confirmPassword: string;

  @ApiProperty({
    default:""
  })
  @Column({
    type: 'enum',
    enum: ['Male', 'Female', 'Other', ''],
    default: '',
  })
  gender: Gender;

  @ApiProperty({ description: 'User Profile', example: 'joe.jpg' })
  @Column({ default: '' })
  profileImage: string;

  @ApiProperty({
    description: 'User shippingAddress',
    example: '091/a gandhi dham, India',
  })
  @Column({ default: '' })
  shippingAddress: string;

  @ApiProperty({
    description: 'User billingAddress',
    example: '01/bb indore , India',
  })
  @Column({ default: '' })
  billingAddress: string;

  @Column({ default: '' })
  verifyToken: string;
}

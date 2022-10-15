import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import { UserStatus } from '../user-status.enum'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  password: string

  @IsEnum(UserStatus)
  status: UserStatus
}

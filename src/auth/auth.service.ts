import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { userName, password, status } = createUserDto
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    const user = this.userRepository.create({
      userName,
      password: hashPassword,
      status
    })

    await this.userRepository.save(user)
    return user
  }

  // async login() {

  // }
}

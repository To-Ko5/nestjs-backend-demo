import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { CredentialsDto } from './dto/credentials.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
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

  async signIn(
    credentialsDto: CredentialsDto
  ): Promise<{ accessToken: string }> {
    const { userName, password } = credentialsDto
    const user = await this.userRepository.findOne({ userName })

    // jwttokenの作成
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, userName: user.userName }
      const accessToken = await this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('ログインできません')
    }
  }
}

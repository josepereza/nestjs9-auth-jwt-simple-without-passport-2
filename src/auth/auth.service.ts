import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const { password, ...userData } = createUserDto;
    let newUser = new User();
    newUser = {
      password: await bcrypt.hash(password, saltOrRounds),
      ...userData,
    };
    this.usersRepository.save(newUser);
    return userData;
  }
  async login(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('auth-service', user);

    if (!user) {
      throw new UnauthorizedException('Error Credencials, error emal');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Error Credencials, error password');
    }
    const { password: _, ...rest } = user;
    const payload = { username: rest.email, sub: rest.id };
    const access_token = await this.jwtService.signAsync(payload);
    return { user: rest, access_token };
  }
  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  // as admin
  @Post('new')
  async create(@Body() dto: CreateUserDto) {
    return new UserEntity(await this.userService.create(dto));
  }

  @Get('get')
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.userService.findOne(+id));
  }

  @Patch('update/:id')
  async updateOne(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return new UserEntity(await this.userService.update(+id, dto));
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // as logged in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return new UserEntity(await this.userService.findOne(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(@Body() dto: UpdateUserDto, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return new UserEntity(await this.userService.update(id, dto));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteUser(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.remove(id);
  }
}

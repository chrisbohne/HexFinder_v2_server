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
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return new UserEntity(await this.userService.create(dto));
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.userService.findOne(+id));
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return new UserEntity(await this.userService.update(+id, dto));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // as logged in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUser(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/')
  updateMap(@Body() dto: UpdateUserDto, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  deleteMap(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.remove(id);
  }
}

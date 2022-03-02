import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // as admin
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(+id, dto);
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

import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Header,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { GameHistory } from 'src/game/game.history.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { HttpException } from '@nestjs/common';

const g_debug = true;

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile/ranking')
  async getRanking() {
    return await this.userService.getRanking();
  }

  @Get('/profile/game/:id')
  async getGameHistoryByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GameHistory[]> {
    return await this.userService.getGameHistoryByUserId(id);
  }

  @Get('/profile')
  async getMyProfile(
    @Body('user_id') id: number,
    @Req() req: Request,
  ): Promise<User> {
    console.log(req);
    return await this.userService.getMyProfile(id);
  }

  @Get('/profile/:id')
  async getProfileByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    if (g_debug) console.log('/profile/:id');
    return await this.userService.getProfileByUserId(id);
  }

  @Get('/profile/avatar/:id')
  @Header('Content-Type', 'image/png')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id,
  ): Promise<StreamableFile> {
    const found = await this.getProfileByUserId(id);
    if (!found) throw new HttpException('User not Found', 400);
    try {
      const filePath = await this.userService.getAvatarByUserId(id);
      const file = createReadStream(filePath);

      return new StreamableFile(file);
    } catch {
      throw new HttpException('File not Found', 404);
    }
  }

  @Patch('/updateName/:id/:nickName')
  async updateNickName(
    @Param('id', ParseIntPipe) id: number,
    @Param('nickName') nickName: string,
  ): Promise<void> {
    if (g_debug) console.log('/updateName/:id/:nickName');

    const regex = /^[a-zA-Z0-9]{4,16}$/;
    if (!regex.test(nickName)) {
      throw new HttpException('Unexist UserId', HttpStatus.CONFLICT);
    }
  
    await this.userService.updateNickName(id, nickName);
  }

  @Post('/updateAvatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (file.size > 1024 * 200) {
      throw new HttpException('Too Big Image', HttpStatus.CONFLICT);
    }
    const path = file.path.replace(__dirname + `/../../uploads`, '');
    await this.userService.updateAvatar(id, path);
    console.log(`/updateAvatar/:id path=${path}`);
    return {
      fileName: file.originalname,
      savedPath: path.replace(/\\/gi, '/'),
      size: file.size,
    };
  }

  @Patch('/updateTFA/:id/:twoFactor')
  async updateTwoFactor(
    @Param('id', ParseIntPipe) id: number,
    @Param('twoFactor', ParseBoolPipe) twoFactor: boolean,
  ): Promise<void> {
    if (g_debug) console.log('/updateTFA/:id/:twoFactor');
    await this.userService.updateTwoFactor(id, twoFactor);
  }
}

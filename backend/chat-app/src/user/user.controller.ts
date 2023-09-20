import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
// import { getUser } from './decorator/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

const g_debug = true;

@Controller()
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/profile')
    //가드 처리
    async getMyProfile(@Body('user_id') id: number, @Req() req: Request): Promise<User> {
        console.log(req);
        return await this.userService.getMyProfile(id);
    }

    @Get('/profile/:id')
    async getProfileByUserId(@Param('id', ParseIntPipe) id: number): Promise<User> {
				if (g_debug)
					console.log('/profile/:id');
        return await this.userService.getProfileByUserId(id);
    }

    @Patch('/updateName/:id/:nickName')
    async updateNickName(@Param('id', ParseIntPipe) id: number,
                        @Param('nickName') nickName: string): Promise<void> {
				if (g_debug)
					console.log('/updateName/:id/:nickName');
        await this.userService.updateNickName(id, nickName);
    }
    
    @Patch('/updateAvatar/:id/:avatar')
    async updateAvatar(@Param('id', ParseIntPipe) id: number,
                        @Param('avatar') avatar: string): Promise<void> {
				if (g_debug)
					console.log('/updateAvatar/:id/:avatar');
        await this.userService.updateAvatar(id, avatar);
    }
    
    @Patch('/updateTFA/:id/:twoFactor')
    async updateTwoFactor(@Param('id', ParseIntPipe) id: number,
                       @Param('twoFactor', ParseBoolPipe) twoFactor: boolean): Promise<void> {
				if (g_debug)
					console.log('/updateTFA/:id/:twoFactor');
        await this.userService.updateTwoFactor(id, twoFactor);
    }
    

}

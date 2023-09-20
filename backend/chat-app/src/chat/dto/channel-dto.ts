import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { ChannelType } from "../enum/channel_type.enum";

export class GroupChannelDto {
    @IsNotEmpty()
    @MaxLength(10)
    channelName: string;

    @IsEnum(ChannelType)
    channelType: ChannelType;

    @IsOptional()
    password?: string;
}

export class DmChannelDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    receiverId: number;
}

export class JoinChannelDto {
    @IsNumber()
    @IsPositive()
    channel_id: number;

    @IsOptional()
    password: string;
}
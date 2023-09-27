import { Channel } from './entity/channel.entity';
import { User } from 'src/user/entity/user.entity';
import { ChannelRepository } from './repository/channel.repository';
import { MessageRepository } from './repository/message.repository';
import { UcbRepository } from './repository/ucb.repository';
import { UserType } from './enum/user_type.enum';
import { UserService } from 'src/user/user.service';
import { UserChannelBridge } from './entity/user-channel-bridge.entity';
import { AuthService } from 'src/auth/auth.service';
import { Message } from './entity/message.entity';
import { GroupChannelDto } from './dto/channel-dto';
import { ChannelType } from './enum/channel_type.enum';
import { PreviousMessageDto } from './dto/message-dto';
import { BridgeDto } from './dto/bridge-dto';
import { RelationService } from 'src/relation/relation.service';
export declare class ChatService {
    private channelRepository;
    private messageRepository;
    private ucbRepository;
    private userService;
    private relationService;
    private authService;
    constructor(channelRepository: ChannelRepository, messageRepository: MessageRepository, ucbRepository: UcbRepository, userService: UserService, relationService: RelationService, authService: AuthService);
    createGroupChannelAndBridge(user: User, groupChannelDto: GroupChannelDto): Promise<Channel>;
    createDmChannelAndBridges(sender: User, senderId: number, receiverId: number): Promise<Channel>;
    createUCBridge(user: User, channel: Channel, userType: UserType): Promise<void>;
    getAllGroupChannelsByChannelType(channelType: ChannelType): Promise<Channel[]>;
    getJoinedGroupChannelsByUserId(userId: number): Promise<any[]>;
    getJoinedDmChannelsByUserId(userId: number): Promise<any[]>;
    createGroupMessage(sender: User, channel: Channel, content: string): Promise<Message>;
    createDM(sender: User, channel: Channel, content: string): Promise<Message>;
    getAllMessagesExceptBlockByChannelId(userId: number, channelId: number): Promise<PreviousMessageDto[]>;
    deleteUCBridge(userId: number, channelId: number): Promise<void>;
    deleteChannelIfEmpty(channelId: number): Promise<void>;
    deleteDmChannel(channelId: number): Promise<void>;
    deleteMessagesByChannelId(channelId: number): Promise<void>;
    updateUserTypeOfUCBridge(targetUserId: number, channelId: number, newType: UserType): Promise<void>;
    checkChannelPassword(channel: Channel, inputPwd: string): Promise<boolean>;
    checkDmRoomExists(senderId: number, receiverId: number): Promise<Channel>;
    isOwnerOfChannel(userId: number, channelId: number): Promise<boolean>;
    isAdminOfChannel(userId: number, channelId: number): Promise<boolean>;
    checkUserInThisChannel(userId: number, channelId: number): Promise<UserChannelBridge>;
    updatePassword(channel: Channel, newPassword: string): Promise<void>;
    removePassword(channel: Channel): Promise<void>;
    updateBanStatus(bridge: UserChannelBridge, newBanStatus: boolean): Promise<UserChannelBridge>;
    updateMuteStatus(bridge: UserChannelBridge, newMuteStatus: boolean): Promise<UserChannelBridge>;
    getChannelByName(channelName: string): Promise<Channel>;
    getChannelById(id: number): Promise<Channel>;
    getAllUsersInChannelByChannelId(newUserId: number, channelId: number): Promise<BridgeDto[]>;
    getReceiverIdByDmChannelName(senderId: number, channelName: string): number;
}
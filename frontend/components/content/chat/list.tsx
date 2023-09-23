import { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image'; 
import styles from "@/styles/chat.module.css";
import SideBar from "@/components/structure/sidebar";
import Modal from '@/components/structure/modal';
import { ChatCreate } from '@/components/content/chat/create';
import useSocketContext from '@/lib/socket';
import { useFetch } from '@/lib/hook';
import useChatContext, { IChatUser } from './context';
import usePlayerContext, { EPlayerState } from '@/components/content/player_state';

enum ChatType {
	public = 'public',
	protected = 'protected',
	private = 'private',
}

// test interface
interface IChatRoom {
  channel_id: number,
  channel_name: string,
	channel_type: string,
};

const serverUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}`;
const chatUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/chat`;
const pubChatReqUrl = `${chatUrl}/channel/all/public`; // path to fetch chat info
const protChatReqUrl = `${chatUrl}/channel/all/protected`; // path to fetch chat info

export default function ChatList() {
	const { user, setUser, joined, setJoined } = useChatContext();
	const {chatSocket} = useSocketContext();
	const [menuModal, setMenuModal] = useState<boolean>(false);
	const [pubChatList, updatePub] = useFetch<IChatRoom[]>(pubChatReqUrl, []);
	const [protChatList, updateProt] = useFetch<IChatRoom[]>(protChatReqUrl, []);
  const list = protChatList.concat(pubChatList);
	const {setPlayerData, setPlayerState} = usePlayerContext();

	useEffect(() => {
		updateProt();
		updatePub();
	}, [menuModal]);

	useEffect(() => {
		if (!chatSocket) return;
		chatSocket.off('join-fail');
		chatSocket.off('join-success');
		chatSocket.on('join-fail', (msg) => {
			console.log(`join-fail: ${msg}`)
			setJoined(false)
			setUser(msg);
		});
		chatSocket.on('join-success', (msg) => {
			console.log(`join-success: ${JSON.stringify(msg)}`); 
			setJoined(true)
			setUser(msg);
			setPlayerState(EPlayerState.CHAT_JOINING);
			setPlayerData(msg);
			chatSocket.off();
		});
	}, [chatSocket])

	function joinChat(info: IChatRoom) {
		if (!chatSocket) return;

		if (info.channel_type === ChatType.public) {
			chatSocket.emit('join-group-channel', {
				channelId: info.channel_id,
			});
		} else if (info.channel_type === ChatType.protected) {
			const password = window.prompt("비밀번호를 입력하세요.");
			chatSocket.emit('join-group-channel', {
				channelId: info.channel_id,
				password: password,
			});
		} else {
			alert("참가할 수 없습니다.");
		}
	};

	function ChatRoomBtn({ info, className }: { info: IChatRoom, className: string }) {
		return (
			<li>
				<button
					onClick={event => {event.preventDefault(); joinChat(info)}}
					className={`${styles.button} ${className}`}
					data-key={info.channel_id}
					style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
					{`${info.channel_name} (${info.channel_id})`}
					{
						info.channel_type == ChatType.protected &&
						<>
							<Image 
								src="/lock.png"
								height={20} 
								width={20}
								alt="protected channel"
							></Image>
						</>
					}
				</button>
			</li>
		);
	}
	return (
		<SideBar 
			className={"full-background-color overflow-y-scroll overflow-x-hidden"}>
			<ul>
				<li>
					<button
						type='button'
						onClick={(e) => {e.preventDefault(); setMenuModal(true);}}
						className={`${styles.button}`}
						style={{
							backgroundColor: 'lightgreen',
						}}>
						{'채널 만들기'} 
					</button>
					{menuModal &&
						<Modal onClose={setMenuModal}>
							<ChatCreate onClose={() => {setMenuModal(false)}}></ChatCreate>
						</Modal>
					}
				</li>
				{
					list.map(info => {
						return (
							<ChatRoomBtn
								info={info}
								key={info.channel_id}
								className={''}
							></ChatRoomBtn>
						);
					})
				}
			</ul>
		</SideBar>
	);
}

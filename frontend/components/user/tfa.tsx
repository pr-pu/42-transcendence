'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/tfa.module.css';
import { LoginData } from '@/components/user/callback';
import { useAuthContext } from '@/components/user/auth';
import { setTimeout } from 'timers';

const authUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/auth/twofactor`

export default function Tfa({ loginData }: { loginData: LoginData }) {
  const [message, setMessage] = useState('');
	const { loggedIn, updateLoginState } = useAuthContext();
	const router = useRouter();

  const checkAuthCode = useCallback(async () => {
		const inputField = document.querySelector("input")?.value;
		console.log(`checkAuthCode=${inputField}`)
		if (!inputField) return;
		const code = inputField;
    try {
			if (code.length !== 6) {
				setMessage("유효하지 않은 코드입니다.");
        setTimeout(() => {
          setMessage('');
        }, 3000);
				return;
			}
			setMessage("처리 중");
      const res = await fetch(`${authUrl}?inputCode=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
				},
				credentials: 'include',
        body: JSON.stringify(loginData),
			})
			.then(res => {
				if (!res.ok)
					throw new Error(`invalid response: ${res.status}`);
				return res.json();
			});
			console.log(`res=${res.state}`);
			if (res.state !== true) {
				setMessage('인증 실패');
        setTimeout(() => {
          setMessage('');
        }, 3000);
			} else {
				router.push('/');
			}
		} catch (error) {
			console.error('인증 요청 중 오류 발생:', error);
			setMessage('인증 요청 중 오류 발생');
      setTimeout(() => {
        setMessage('');
      }, 3000);
			router.push('/');
		}
  }, [updateLoginState, router]);

  const handleEnterKey = (e: any) => {
		if (e.key === 'Enter') {
			checkAuthCode();
		}
	};

  return (
    <>
    <hr></hr>
    <div className={styles.tfa}>
      <h1 className={styles.tfaLoading}>{message.length == 4 && message}</h1>
      <h1 className={styles.tfaFail}>{message.length == 14 && message}</h1>
      <h1 className={styles.tfaFail}>{message.length == 5 && message}</h1>
      <h1 className={styles.tfaFail}>{message.length == 13 && message}</h1>
      <h1 className={styles.tfaFont}>{!message && '인증 코드 입력'}</h1>
      <input className={styles.tfaInput}
        type="text"
        placeholder="6자리 코드를 입력해주세요"
        onKeyDown={handleEnterKey}
        maxLength={6} />
      <button onClick={checkAuthCode} className={styles.tfaConfirm}>확인</button>
    </div>
      </>
  );
}

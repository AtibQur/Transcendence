import { socket } from '@/utils/socket';
import axiosInstance from './axiosConfig';

export const loginPlayer = async () => {
  // load intraname from cookie, done after intra login auth
  const responsePlayerId = await axiosInstance.get('/user/id');
  const responseIntraname = await axiosInstance.get('/user/intraname');
  const responseUsername = await axiosInstance.get('/user/username');
  const hasAvatar = await axiosInstance.get('player/hasavatar/' + responsePlayerId.data);

  const playerId = parseInt(responsePlayerId.data);

  // set data in session storage
  localStorage.setItem('playerId', responsePlayerId.data);
  localStorage.setItem('intraUsername', responseIntraname.data);
  localStorage.setItem('username', responseUsername.data);

  // set default avatar
  if (!hasAvatar.data) {
    await setDefaultAvatar(responsePlayerId.data);
    localStorage.setItem('newUser', 'true');
  }

  socket.auth = { id: playerId };
  socket.connect();

  localStorage.setItem('logged', 'true');

  return true;
}

export async function setDefaultAvatar(playerId: string) {
  const randomDecimal = Math.random() ;
  const randomNumber = Math.floor(randomDecimal * 15) + 1;
  const defaultAvatarPath = './default_avatars/avatar_' + randomNumber + '.png';

  const defaultAvatarFile = await fetch(defaultAvatarPath);
  const defaultAvatarBlob = await defaultAvatarFile.blob();
  const defaultAvatar = new File([defaultAvatarBlob], 'default_avatar.png');

  const formData = new FormData();
  formData.append('avatar', defaultAvatar);
  await axiosInstance.post('player/avatar/upload/' + playerId, formData);
}
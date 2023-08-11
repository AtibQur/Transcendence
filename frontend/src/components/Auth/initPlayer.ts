import { socket } from '@/socket';
import axiosInstance from '../../axiosConfig';

export const loginPlayer = async () => {
  // load intraname from cookie, done after intra login auth
  const responsePlayerId = await axiosInstance.get('/user/id');
  const responseIntraname = await axiosInstance.get('/user/intraname');
  const responseUsername = await axiosInstance.get('/user/username');
  const hasAvatar = await axiosInstance.get('player/hasavatar/' + responsePlayerId.data);

  const playerId = parseInt(responsePlayerId.data);

  // set data in session storage
  sessionStorage.setItem('playerId', responsePlayerId.data);
  sessionStorage.setItem('intraUsername', responseIntraname.data);
  sessionStorage.setItem('username', responseUsername.data);

  // set default avatar
  if (!hasAvatar.data) {
    await setDefaultAvatar(responsePlayerId.data);
  }

  socket.auth = { id: playerId };
  socket.connect();

  localStorage.setItem('logged', 'true');

  return true;
}

export async function setDefaultAvatar(playerId: string) {
  const randomDecimal = Math.random() ;
  const randomNumber = Math.floor(randomDecimal * 7) + 1;
  const defaultAvatarPath = './default_avatars/avatar_' + randomNumber + '.png';

  // Fetch the default avatar file
  const defaultAvatarFile = await fetch(defaultAvatarPath);
  const defaultAvatarBlob = await defaultAvatarFile.blob();
  const defaultAvatar = new File([defaultAvatarBlob], 'default_avatar.png');

  // Send the default avatar file to the server
  const formData = new FormData();
  formData.append('avatar', defaultAvatar);

  console.log("avatar: ", defaultAvatarBlob);
  console.log("playerid: ", playerId);
  await axiosInstance.post('player/avatar/upload/' + playerId, formData);
}
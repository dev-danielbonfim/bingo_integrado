import { io } from 'socket.io-client';

// Se estiver em produção (compilado), conecta na mesma origem (URL do host). Se não, usa localhost.
const URL = import.meta.env.PROD ? window.location.origin : 'http://localhost:3001';

export const socket = io(URL);

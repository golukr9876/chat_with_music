import React, { useState, useMemo} from 'react';
import SaavnMusicPlayer from './components/Music/SaavnMusicPlayer';
import ChatArea from './components/Chat/ChatArea';
import {io} from "socket.io-client";

function App() {
  // const socket = useMemo(() => io("https://chat-app-lkaw.onrender.com"), []);
  const socket = useMemo(() => io("http://localhost:4100/"), []);

  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState('');


  const handleJoin = () => {
    // socket.emit('join-room', room);
    if (room.trim()) setJoined(true);
  };

  return (
    <div className="h-[92vh] md:h-[100vh] w-full flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-white px-2 py-4">
      {!joined ? (
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4 text-center">
          <h2 className="text-2xl font-bold text-purple-700">🎧 Join Music Room</h2>
          <input
            type="text"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={handleJoin}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full h-[90vh] max-w-4xl backdrop-blur-lg bg-white/50  rounded-2xl shadow-lg py-2 px-2 flex flex-col gap-4">
          <SaavnMusicPlayer room={room} />
          <div className="flex-1 overflow-y-auto max-h-[80vh] rounded-xl p-3 bg-white shadow-inner">
            <ChatArea  room={room} />
          </div>
        </div>

  
      )}
    </div>
  );
}

export default App;

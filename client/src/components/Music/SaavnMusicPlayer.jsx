import React, { useState, useEffect, useMemo, useRef } from 'react';
import 'remixicon/fonts/remixicon.css';
import MiniMusicPlayer from '../MusicUI/MiniMusicPlayer';
import ScrollingTitle from '../MusicUI/ScrollingTitle';
import { io, Socket } from 'socket.io-client';

const SaavnMusicPlayer = ({room}) => {
  // const socket = useMemo(() => io("https://chat-app-lkaw.onrender.com"), []);
  const socket = useMemo(() => io("http://localhost:4100/"), []);

  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);



  const searchSongs = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    socket.emit ("music", {query, room});
  };

  useEffect(()=>{

      socket.on("connect", () => {
        console.log("connected", socket.id);
        socket.emit("join-room", room);
      });

    socket.on("play-music", async (query) => {
      // setQuery(query);
      // searchSongs();
      if (!query) return;
      setIsLoading(true);
      try {
        console.log("hello");
        // const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
        const res = await fetch(`https://saavn.sumit.co/api/search/songs?query=${encodeURIComponent(query)}`);
        console.log("res",res);
        const data = await res.json();
        if (data.data.results.length > 0) {
          setSongs(data.data.results);
          setCurrentIndex(0);
        } else {
          alert("No songs found.");
          setSongs([]);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        alert("API error.");
      }
      setIsLoading(false);
    });

    return () => {
    socket.disconnect(); // clean up
  };

  }, [room])

    const handleKeyPress = (e) => {
    if (e.key === 'Enter') searchSongs();
  };


  const currentSong = songs[currentIndex];

  const memoizedSong = useMemo(() => {
  if (!currentSong) return null;
  return {
    title: currentSong.name,
    url: currentSong.downloadUrl[4].url,
    image: currentSong.image[2].url,
  };
}, [currentSong]);



  const nextSong = () => {
    setCurrentIndex((i) => (i + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);
  };

  return (
    <div className="max-w-md w-full mx-auto p-3  bg-white rounded-xl shadow text-center space-y-4">
       <form onSubmit={searchSongs}>
         <div className='flex items-center justify-center focus:ring-2 focus:ring-purple-500'>
             <input
                type="text"
                placeholder="Music Player.... search songs"
                className="border-l border-b border-t rounded-l-4xl p-2 w-4/5 focus:outline-none "
                value={query}
                onChange={(e) =>{
                  setQuery(e.target.value)}
                }
                   
                // onKeyDown={handleKeyPress}
            />
            <button
                // onClick={searchSongs}
                type='sybmit'
                className="bg-purple-600 rounded-r-4xl border-r border-b border-t text-white px-2 py-1 hover:bg-purple-400"
            >
                <i class="ri-search-2-line text-2xl"></i>
            </button>
        </div>
       </form>
      

      {isLoading && <p>Loading...</p>}

      
    {memoizedSong && (
      <MiniMusicPlayer
        song={memoizedSong}
        onNext={nextSong}
        onPrev={prevSong}
      />
    )}


    </div>
  );
};

export default SaavnMusicPlayer;

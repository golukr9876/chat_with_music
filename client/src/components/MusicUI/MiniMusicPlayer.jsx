import React, { useRef, useState, useEffect } from 'react';
import ScrollingTitle from './ScrollingTitle';

const MiniMusicPlayer = ({ song, onNext, onPrev }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.load();
      if (playing) audio.play();

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
    }
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      playing ? audio.play() : audio.pause();
    }
  }, [playing]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const ct = audio.currentTime;
      setCurrentTime(ct);
      setProgress((ct / audio.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="flex items-center p-2 rounded-xl bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 animate-gradient-x shadow-md w-full gap-3">
      {/* Cover */}
      <img
        src={song.image}
        alt="cover"
        className="w-14 h-14 object-cover rounded-md shadow"
      />

      {/* Info + Controls */}
      <div className="flex-1 w-4/5">
        <h3 className="text-sm w-4/5 font-semibold text-gray-800 truncate">
            <ScrollingTitle text={song.title} />
            </h3>

        {/* Seekbar + Timer */}
       {/* Seekbar with timer on sides */}
        <div className="flex items-center w-full gap-2">
            <span className="text-xs text-gray-600 w-7 text-left">
                {formatTime(currentTime)}
            </span>
            
            <input
                type="range"
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1 accent-purple-600"
            />
            
            <span className="text-xs text-gray-600 w-8">
                {formatTime(duration)}
            </span>
        </div>


        {/* Controls */}
        <div className="flex justify-between items-center  mt-2">
          {/* Prev / Play / Next */}
          <div className="flex gap-2 items-center">
            <button onClick={onPrev} className="text-lg text-gray-700 hover:text-black">
              <i className="ri-skip-back-fill"></i>
            </button>

            <button
              onClick={() => setPlaying(!playing)}
              className="w-9 h-9 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
            >
              {playing ? (
                <i className="ri-pause-line text-xl"></i>
              ) : (
                <i className="ri-play-line text-xl"></i>
              )}
            </button>

            <button onClick={onNext} className="text-lg text-gray-700 hover:text-black">
              <i className="ri-skip-forward-fill"></i>
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1 mr-1">
            <i className="ri-volume-up-line text-lg text-gray-700"></i>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className="w-17 h-1 accent-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        autoPlay
      />
    </div>
  );
};

export default MiniMusicPlayer;

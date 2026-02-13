
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send } from 'lucide-react';
import { io } from 'socket.io-client';

const ChatArea = ({ room}) => {

  // const socket = useMemo(() => io("https://chat-app-lkaw.onrender.com"), []);
  const socket = useMemo(() => io("http://localhost:4100/"), []);


  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [editMsgId, setEditMsgId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  
  const sendMessage = () => {
    const Id = Date.now();
    socket.emit ("message", {newMsg, room, Id});
    if (newMsg.trim()) {
      const msgData = {
        id: Id,
        message: newMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender:true,
        deleted: false,
        replyTo: replyTo ? replyTo.message : null,
        room,
      };

      if (editMsgId) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === editMsgId ? { ...msg, message: newMsg } : msg
        )
      );
      setEditMsgId(null);
    } else {
      setMessages(prev => [...prev, msgData]);
    }
      setNewMsg('');
      setReplyTo(null);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      socket.emit("join-room", room);
    });

    socket.on("recieve-message", ({newMsg, Id}) =>{
          if (newMsg.trim()) {
            const msgData = {
              id: Id,
              message: newMsg,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sender:false,
              deleted: false,
        };
      setMessages((prev) => [...prev, msgData]);
      }
    })

    socket.on("delete-message", (id) => {
      setMessages(prev =>
        prev.map(msg => (msg.id === id ? { ...msg, message: '🗑️ This message was deleted', deleted: true } : msg))
      );
    setSelectedMsg(null);
    })

  }, [])

 
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleDoubleClick = (msg) => {
    setSelectedMsg(msg);
  };

  const deleteForMe = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    setSelectedMsg(null);
  };

  const deleteForEveryone = (id) => {
    socket.emit("delete-for-everyone", {room, id});
    setMessages(prev =>
      prev.map(msg => (msg.id === id ? { ...msg, message: '🗑️ This message was deleted', deleted: true } : msg))
    );
    setSelectedMsg(null);
  };

  const editMessage = (msg) => {
    inputRef.current?.focus();
    setNewMsg(msg.message);
    setEditMsgId(msg.id);
    setSelectedMsg(null);
  };

  const replyMessage = (msg) => {
     inputRef.current?.focus();
    setReplyTo(msg);
    setSelectedMsg(null);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

useEffect(() => {
  try{ const savedMessages = localStorage.getItem(`chat-${room}`);
  if (savedMessages) {
    setMessages(JSON.parse(savedMessages));
  }}catch {}
}, [room]);

useEffect(() => {
  try{
    localStorage.setItem(`chat-${room}`, JSON.stringify(messages));
  }catch{}
}, [messages, room]);


  return (
    <div className="flex h-full flex-col">
      {/* Message Area */}
     <div className='min-h-[55vh] h-9/10'>
        <div className="flex flex-col h-full overflow-y-auto space-y-1.5 px-2 pb-2 chat-scroll">
          {messages.map((msg, i) => (
            <div
            key={msg.id}
            onDoubleClick={() => handleDoubleClick(msg)}
            className={`relative px-3 py-2 rounded-xl  shadow-md text-sm w-fit max-w-[80%] break-words${
                msg.sender? ' bg-gradient-to-br  from-purple-300 to-pink-100 self-end' : ' bg-gradient-to-br  from-purple-100 to-pink-300 self-start'
            }`}
            >
           {msg.replyTo && (
              <div className="text-xs text-gray-600 italic border-l-2 border-purple-300 pl-2 mb-1">
                Replying to: {msg.replyTo}
              </div>
            )}
            <p className="text-gray-800 pr-14 break-words whitespace-pre-wrap">
                {msg.message}
            </p>
            <span className="absolute  bottom-1 right-2 text-[10px] text-gray-500">
                {msg.time}
            </span>

             {selectedMsg?.id === msg.id && (
              <div className="absolute top-full bg-gray-100  right-0 mt-1 w-44  backdrop-blur-md shadow-xl rounded-lg text-sm z-20 overflow-hidden border border-gray-200">
                <button
                      className="w-full px-4 py-2 .transition border-  hover:bg-purple-100 text-left"
                      onClick={() => deleteForMe(msg.id)}
                    >
                      🚫 Delete for Me
                </button>
                {!msg.deleted && (
                  <>
               {msg.sender && (
                 <button
                    className="w-full px-4 py-2 .transition bg-gray-100 hover:bg-purple-100 text-left"
                    onClick={() => deleteForEveryone(msg.id)}>
                      🗑️ Delete for Everyone
                      </button>
                    )}
                 {msg.sender && (
                <button
                  className="w-full px-4 py-2 .transition hover:bg-purple-100 text-left"
                  onClick={() => editMessage(msg)}
                >
                  ✏️ Edit
                </button>
              )}
              <button
                className="w-full px-4 py-2 .transition bg-gray-100 hover:bg-purple-100 text-left"
                onClick={() => replyMessage(msg)}
              >
                💬 Reply
              </button>
                  </>
                )}
              </div>
            )}
        </div>

        ))}
        <div ref={bottomRef} />
      </div>
     </div>
      {replyTo && (
        <div className="px-3 py-1 bg-purple-50 text-sm text-gray-600 border-l-4 border-purple-500 mb-1">
          Replying to: {replyTo.message}
          <button className="ml-2 text-xs text-red-500" onClick={() => setReplyTo(null)}>x</button>
        </div>
      )}
    

      <div className="mt-2 flex h-[6vh]  items-center gap-2">
        <input
          ref={inputRef}
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={editMsgId ? "Edit your message..." : "Type a message..."}
          className="flex-1 px-4 py-2 rounded-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage, useAuth } from '../App';
import { Api } from '../services/api';
import { ChatMessage, GameEvent } from '../types';
import { ChevronLeft, Send, MoreVertical, Trophy } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventId) {
      loadData();
    }
  }, [eventId]);

  const loadData = async () => {
    if (!eventId) return;
    const [msgs, events] = await Promise.all([
      Api.getEventMessages(eventId),
      Api.getEvents()
    ]);
    setMessages(msgs);
    setEvent(events.find(e => e.id === eventId) || null);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !eventId) return;

    const sentMsg = await Api.sendMessage(eventId, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      content: newMessage
    });

    setMessages([...messages, sentMsg]);
    setNewMessage('');
    scrollToBottom();
  };

  if (!event) return <div className="p-8 text-center">{t.loading}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
         <div className="flex items-center">
            <Link to="/events" className="p-2 -ml-2 mr-2 text-gray-600 rounded-full hover:bg-gray-100"><ChevronLeft /></Link>
            <div className="flex items-center">
               <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3 border border-primary-100">
                  <Trophy size={18} className="text-primary-600" />
               </div>
               <div>
                  <h1 className="font-bold text-gray-900 text-sm leading-tight">{event.title}</h1>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString(locale)}</p>
               </div>
            </div>
         </div>
         <button className="p-2 text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map(msg => {
           const isMe = msg.userId === user?.id;
           const isSystem = msg.isSystem;

           if (isSystem) {
             return (
               <div key={msg.id} className="flex justify-center my-4">
                 <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                   {msg.content}
                 </span>
               </div>
             );
           }

           return (
             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
               {!isMe && (
                 <img src={msg.userAvatar} className="w-8 h-8 rounded-full mr-2 self-end mb-1" alt={msg.userName} />
               )}
               <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                 isMe 
                   ? 'bg-primary-600 text-white rounded-br-none' 
                   : 'bg-white text-gray-800 rounded-bl-none'
               }`}>
                 {!isMe && <p className="text-[10px] font-bold text-primary-600 mb-0.5">{msg.userName}</p>}
                 <p className="text-sm leading-relaxed">{msg.content}</p>
                 <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                   {new Date(msg.timestamp).toLocaleTimeString(locale, {hour:'2-digit', minute:'2-digit'})}
                 </span>
               </div>
             </div>
           );
         })}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="bg-white p-3 border-t border-gray-200 flex items-center space-x-2">
         <input
           type="text"
           value={newMessage}
           onChange={(e) => setNewMessage(e.target.value)}
           placeholder={t.typeMessage}
           className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
         />
         <button 
           type="submit"
           disabled={!newMessage.trim()}
           className="p-3 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-90"
         >
           <Send size={18} />
         </button>
      </form>
    </div>
  );
};

export default ChatPage;
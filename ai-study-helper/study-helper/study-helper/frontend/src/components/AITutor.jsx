import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { askAITutor } from '../services/gemini';

const AITutor = ({ context, darkMode }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I've read your notes. Ask me anything about them! 🧠" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !context) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass previous messages for context awareness
      const response = await askAITutor(context, userMsg.text, messages);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const theme = darkMode 
    ? { bg: 'bg-slate-900', border: 'border-slate-800', inputBg: 'bg-slate-800', text: 'text-slate-200' }
    : { bg: 'bg-white', border: 'border-slate-200', inputBg: 'bg-slate-50', text: 'text-slate-800' };

  return (
    <div className={`flex flex-col h-[600px] rounded-3xl border shadow-sm overflow-hidden ${theme.bg} ${theme.border}`}>
      
      {/* Header */}
      <div className={`p-4 border-b flex items-center gap-3 ${theme.border} ${darkMode ? 'bg-slate-950/50' : 'bg-indigo-50/50'}`}>
         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
            <Bot size={20} />
         </div>
         <div>
            <h3 className={`font-bold ${theme.text}`}>AI Personal Tutor</h3>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-500">Online & Ready</span>
            </div>
         </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
         {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                     {msg.role === 'user' ? <User size={16}/> : <Sparkles size={16}/>}
                 </div>
                 <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                     msg.role === 'user' 
                     ? 'bg-indigo-600 text-white rounded-tr-sm' 
                     : `${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'} rounded-tl-sm`
                 }`}>
                     {msg.text}
                 </div>
             </div>
         ))}
         {isLoading && (
             <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Sparkles size={16}/></div>
                 <div className={`p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                     <Loader2 size={16} className="animate-spin"/> Thinking...
                 </div>
             </div>
         )}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${theme.border} ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
         <div className={`flex items-center gap-2 p-2 rounded-xl border ${theme.border} ${theme.inputBg}`}>
             <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about your notes..."
                className={`flex-1 bg-transparent border-none outline-none px-2 text-sm ${theme.text} placeholder:text-slate-400`}
                disabled={!context} // Disable if no file uploaded
             />
             <button 
                onClick={handleSend}
                disabled={!input.trim() || !context || isLoading}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
                <Send size={16} />
             </button>
         </div>
         {!context && <p className="text-xs text-red-400 mt-2 text-center">Please upload a document to start chatting.</p>}
      </div>
    </div>
  );
};

export default AITutor;
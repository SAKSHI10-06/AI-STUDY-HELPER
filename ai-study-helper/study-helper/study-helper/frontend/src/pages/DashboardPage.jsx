import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, BarChart2, Settings, LogOut, Plus, Search, 
  Upload, Loader2, FileText, Brain, Sparkles, MoreVertical, 
  Trophy, ChevronRight, Clock, Trash2, PieChart, 
  Edit2, X, Check, Camera, ArrowRight, Network, Activity
} from 'lucide-react';

// Import the Study Components
import FlashcardViewer from '../components/FlashcardViewer';
import QuizTaker from '../components/QuizTaker';
import MermaidChart from '../components/MermaidChart';

const DashboardPage = ({ 
  user = { name: "Guest User", email: "guest@studyhelper.ai" }, 
  onLogout, 
  onUpload, 
  status, 
  studyData,
  recentSets = [], 
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // Study Mode State
  const [studyView, setStudyView] = useState('summary'); 
  const [summaryMode, setSummaryMode] = useState('standard'); 
  
  // Local Study Data State
  const [currentStudySet, setCurrentStudySet] = useState(null);

  // User & Settings State
  const [currentUser, setCurrentUser] = useState(user);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  const [appSettings, setAppSettings] = useState({
    darkMode: true,
    emailNotifs: true,
    publicProfile: false
  });

  const [profileColor] = useState('from-indigo-500 to-purple-500');
  
  // Ref for file upload
  const fileInputRef = useRef(null);

  // Sync props with local state when new upload finishes
  useEffect(() => {
    if (status === 'success' && studyData) {
      setCurrentStudySet(studyData);
      setActiveTab('study');
      setStudyView('summary');
    }
  }, [status, studyData]);

  const handleOpenSet = (set) => {
    const dataToLoad = set.data || set;
    if (dataToLoad) {
      setCurrentStudySet(dataToLoad);
      setActiveTab('study');
      setStudyView('summary');
    }
  };

  const handleSaveProfile = () => {
    setCurrentUser(tempUser);
    setIsEditingProfile(false);
  };

  const handleToggleSetting = (key) => {
    setAppSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Safe Data Accessors
  const ensureArray = (data) => Array.isArray(data) ? data : [];
  const ensureString = (data) => (typeof data === 'string' ? data : (data ? String(data) : ''));

  const safeFlashcards = ensureArray(currentStudySet?.flashcards);
  const safeQuiz = ensureArray(currentStudySet?.quiz);
  const safeMermaid = ensureString(currentStudySet?.mermaid);
  const safeSummary = ensureString(currentStudySet?.summary) || 'No summary available.';
  const safeDeepInsight = ensureString(currentStudySet?.deep_insight) || 'No insights available.';

  const totalCards = recentSets.reduce((acc, set) => acc + (set.cards || 0), 0);
  const totalSets = recentSets.length;
  const masteryScore = totalSets > 0 ? Math.min(100, 50 + (totalSets * 5)) : 0; 

  const theme = appSettings.darkMode 
    ? {
        bg: 'bg-slate-950',
        text: 'text-slate-100',
        textMuted: 'text-slate-400',
        card: 'bg-slate-900 border-slate-800',
        cardHover: 'hover:bg-slate-800',
        border: 'border-slate-800',
        sidebar: 'bg-slate-950 border-r border-slate-800',
        input: 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
      }
    : {
        bg: 'bg-slate-50',
        text: 'text-slate-900',
        textMuted: 'text-slate-500',
        card: 'bg-white border-slate-200',
        cardHover: 'hover:bg-slate-50',
        border: 'border-slate-200',
        sidebar: 'bg-slate-900 text-slate-300 border-r border-slate-800',
        input: 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
      };

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${theme.bg} ${theme.text}`}>
      
      {/* SIDEBAR */}
      <aside className={`w-64 flex flex-col hidden md:flex relative z-20 ${theme.sidebar}`}>
        <div className="p-6 flex items-center gap-3 text-white mb-6">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutGrid size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">StudyHelper</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            <SidebarItem icon={<LayoutGrid size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} darkMode={appSettings.darkMode}/>
            {currentStudySet && <SidebarItem icon={<Brain size={20}/>} label="Current Study" active={activeTab === 'study'} onClick={() => setActiveTab('study')} isSpecial darkMode={appSettings.darkMode}/>}
            <SidebarItem icon={<BookOpen size={20}/>} label="My Library" active={activeTab === 'my-library'} onClick={() => setActiveTab('my-library')} darkMode={appSettings.darkMode}/>
            <SidebarItem icon={<BarChart2 size={20}/>} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} darkMode={appSettings.darkMode}/>
            <SidebarItem icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={appSettings.darkMode}/>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${profileColor} flex items-center justify-center text-white font-bold shadow-md`}>
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
                <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" onClick={onLogout} />
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* --- FIXED: UNIVERSAL FILE INPUT --- */}
        {/* This input is always present in the DOM, solving the tab-switching bug */}
        <input 
            ref={fileInputRef} 
            type="file" 
            className="hidden" 
            onChange={(e) => {
                onUpload(e);
                e.target.value = null; // Allow re-uploading the same file
            }} 
            // This checks both extensions AND MIME types for maximum compatibility
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" 
        />
        {/* ----------------------------------- */}

        <header className={`h-16 border-b ${theme.border} ${appSettings.darkMode ? 'bg-slate-950/80' : 'bg-white/80'} backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0`}>
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`} size={18} />
                    <input type="text" placeholder="Search your study sets..." className={`w-full rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${theme.input}`} />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={16} /> New Study Set
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
            <AnimatePresence>
                {status === 'processing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 z-50 ${appSettings.darkMode ? 'bg-slate-950/90' : 'bg-white/90'} backdrop-blur-sm flex flex-col items-center justify-center`}>
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <h3 className={`text-xl font-bold ${theme.text}`}>Generating Knowledge...</h3>
                        <p className={theme.textMuted}>Analyzing document and creating flashcards.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard darkMode={appSettings.darkMode} icon={<BookOpen size={24} className="text-blue-400"/>} label="Study Sets" value={totalSets} sub="Total Created" color="blue" />
                            <StatCard darkMode={appSettings.darkMode} icon={<Brain size={24} className="text-purple-400"/>} label="Flashcards" value={totalCards} sub="Generated" color="purple" />
                            <StatCard darkMode={appSettings.darkMode} icon={<Trophy size={24} className="text-yellow-400"/>} label="Mastery" value={`${masteryScore}%`} sub="Estimated" color="yellow" />
                            <StatCard darkMode={appSettings.darkMode} icon={<Activity size={24} className="text-pink-400"/>} label="Activity" value="Active" sub="Just now" color="pink" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20 group cursor-pointer" onClick={handleUploadClick}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Create new study set</h2>
                                        <p className="text-indigo-100 mb-6 max-w-sm">Upload PDF, DOCX or text files to generate instant summaries and flashcards.</p>
                                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            <Upload size={16} /> Upload Material
                                        </button>
                                    </div>
                                    <div className="hidden sm:block bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <FileText size={48} className="text-indigo-100" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">Recent Activity</h3>
                                    <button onClick={() => setActiveTab('my-library')} className="text-sm font-bold text-indigo-500 hover:text-indigo-400">View Library</button>
                                </div>
                                {recentSets.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {recentSets.slice(0, 4).map((set, idx) => (
                                            <div key={set.id || idx} onClick={() => handleOpenSet(set)}>
                                                <StudySetCard 
                                                    title={set.title} date={set.date} items={`${set.cards} cards`} 
                                                    color="bg-indigo-500/10 text-indigo-400" darkMode={appSettings.darkMode}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center ${appSettings.darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-800 text-slate-500"><BookOpen size={24} /></div>
                                        <h3 className={`font-bold mb-1 ${theme.text}`}>Library Empty</h3>
                                        <p className={`text-sm ${theme.textMuted}`}>Upload a document to save your first set.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col ${theme.card}`}>
                            <h3 className="text-lg font-bold mb-6">Weekly Focus</h3>
                            <div className="flex-1 flex items-end justify-between gap-2 px-2 min-h-[150px]">
                                {[30, 45, 20, 60, 50, 80, 40].map((h, i) => (
                                    <div key={i} className={`w-full rounded-t-lg relative group overflow-hidden ${appSettings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all duration-1000 group-hover:bg-indigo-400" style={{ height: `${h}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className={`flex justify-between mt-4 text-xs font-bold uppercase ${theme.textMuted}`}>
                                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STUDY MODE */}
            {activeTab === 'study' && (
                <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button onClick={() => setActiveTab('overview')} className={`text-sm font-bold mb-1 flex items-center gap-1 transition-colors ${theme.textMuted} hover:text-indigo-500`}>
                                <ChevronRight className="rotate-180" size={14}/> Back to Overview
                            </button>
                            <h1 className="text-3xl font-bold">Study Session</h1>
                        </div>
                        <div className={`flex border p-1 rounded-xl shadow-sm ${appSettings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <StudyTab icon={<FileText size={16}/>} label="Summary" active={studyView === 'summary'} onClick={() => setStudyView('summary')} darkMode={appSettings.darkMode} />
                            <StudyTab icon={<BookOpen size={16}/>} label="Flashcards" active={studyView === 'flashcards'} onClick={() => setStudyView('flashcards')} darkMode={appSettings.darkMode} />
                            <StudyTab icon={<Brain size={16}/>} label="Quiz" active={studyView === 'quiz'} onClick={() => setStudyView('quiz')} darkMode={appSettings.darkMode} />
                            <StudyTab icon={<Network size={16}/>} label="Map" active={studyView === 'map'} onClick={() => setStudyView('map')} darkMode={appSettings.darkMode} />
                        </div>
                    </div>

                    <div className={`rounded-[2rem] border shadow-sm min-h-[600px] p-8 relative overflow-hidden ${theme.card}`}>
                        {!currentStudySet ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12">
                                <FileText size={48} className={`mb-4 ${theme.textMuted}`} />
                                <h3 className="text-xl font-bold mb-2">No Content Selected</h3>
                                <p className={theme.textMuted}>Please upload a file or select a set from your library.</p>
                                <button onClick={() => setActiveTab('overview')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500">Go to Overview</button>
                            </div>
                        ) : (
                            <>
                                {studyView === 'summary' && (
                                    <div className="max-w-3xl mx-auto pb-10">
                                        <div className="flex justify-center mb-8">
                                            <div className={`flex p-1 rounded-lg ${appSettings.darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                <button onClick={() => setSummaryMode('standard')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${summaryMode === 'standard' ? (appSettings.darkMode ? 'bg-slate-700 text-white shadow' : 'bg-white shadow text-indigo-600') : (appSettings.darkMode ? 'text-slate-400' : 'text-slate-500')}`}>Standard</button>
                                                <button onClick={() => setSummaryMode('deep')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${summaryMode === 'deep' ? (appSettings.darkMode ? 'bg-slate-700 text-white shadow' : 'bg-white shadow text-purple-600') : (appSettings.darkMode ? 'text-slate-400' : 'text-slate-500')}`}><Sparkles size={14}/> Deep Dive</button>
                                            </div>
                                        </div>
                                        <div className={`prose prose-lg leading-8 ${appSettings.darkMode ? 'prose-invert text-slate-300' : 'text-slate-600'}`}>
                                            {(summaryMode === 'deep' ? safeDeepInsight : safeSummary).split('\n').map((line, i) => (
                                                <p key={i} className="mb-4">{line}</p>
                                            ))}
                                        </div>
                                        {/* NEXT STEP BUTTON */}
                                        <div className="mt-12 flex justify-center">
                                            <button onClick={() => setStudyView('flashcards')} className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20">
                                                Start Flashcards <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {studyView === 'flashcards' && (
                                    <div className="py-10 flex flex-col items-center">
                                        {safeFlashcards.length > 0 ? <FlashcardViewer cards={safeFlashcards} darkMode={appSettings.darkMode} /> : <div className={`text-center ${theme.textMuted}`}>No flashcards available.</div>}
                                        {/* NEXT STEP BUTTON */}
                                        <button onClick={() => setStudyView('quiz')} className="mt-12 text-sm font-bold text-slate-500 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                                            Take a Quiz <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}

                                {studyView === 'quiz' && (
                                    <div className="max-w-2xl mx-auto py-4">
                                        {safeQuiz.length > 0 ? <QuizTaker questions={safeQuiz} onExit={() => setStudyView('summary')} darkMode={appSettings.darkMode} /> : <div className={`text-center ${theme.textMuted}`}>No quiz questions available.</div>}
                                    </div>
                                )}

                                {studyView === 'map' && (
                                    <div className="max-w-4xl mx-auto">
                                        {safeMermaid ? <MermaidChart chartDefinition={safeMermaid} /> : <div className={`text-center ${theme.textMuted}`}>No concept map available.</div>}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* MY LIBRARY */}
            {activeTab === 'my-library' && (
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-3xl font-bold mb-8">My Library</h1>
                    {recentSets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentSets.map((set, idx) => (
                                <div key={set.id || idx} onClick={() => handleOpenSet(set)}>
                                    <StudySetCard title={set.title} date={set.date} items={`${set.cards} items`} color="bg-indigo-500/10 text-indigo-400" darkMode={appSettings.darkMode} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`py-20 rounded-3xl border-2 border-dashed text-center ${appSettings.darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-white'}`}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-800 text-slate-400"><BookOpen size={32} /></div>
                            <h3 className="text-xl font-bold mb-2">Your library is empty</h3>
                            <p className={`mb-6 ${theme.textMuted}`}>Upload documents to start building your collection.</p>
                            <button onClick={handleUploadClick} className="text-indigo-500 font-bold hover:underline">Upload Now</button>
                        </div>
                    )}
                </div>
            )}

            {/* ANALYTICS */}
            {activeTab === 'analytics' && (
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-3xl font-bold mb-8">Analytics</h1>
                    {recentSets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={`p-8 rounded-[2rem] border shadow-sm ${theme.card}`}>
                                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.textMuted}`}><PieChart size={20}/> Subject Distribution</h3>
                                <div className="flex items-center justify-center h-64">
                                    <div className="w-48 h-48 rounded-full border-8 border-indigo-500 border-r-purple-500 border-b-pink-500 border-l-orange-500 flex items-center justify-center">
                                        <div className="text-center"><div className="text-3xl font-black">{totalSets}</div><div className={`text-xs font-bold uppercase ${theme.textMuted}`}>Sets</div></div>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-8 rounded-[2rem] border shadow-sm ${theme.card}`}>
                                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.textMuted}`}><Brain size={20}/> Learning Stats</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center"><span className="font-medium">Total Cards Created</span><span className="text-2xl font-bold text-indigo-500">{totalCards}</span></div>
                                    <div className="h-px bg-slate-800"></div>
                                    <div className="flex justify-between items-center"><span className="font-medium">Knowledge Base</span><span className="text-2xl font-bold text-purple-500">{totalSets} Docs</span></div>
                                    <div className="h-px bg-slate-800"></div>
                                    <div className="flex justify-between items-center"><span className="font-medium">Est. Mastery</span><span className="text-2xl font-bold text-emerald-500">{masteryScore}%</span></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`p-12 text-center rounded-[2rem] border border-dashed ${theme.card} border-slate-700`}>
                            <BarChart2 size={48} className={`mx-auto mb-4 ${theme.textMuted}`} /><h3 className="text-xl font-bold mb-2">No Data Available</h3><p className={theme.textMuted}>Complete your first study set to see analytics.</p>
                        </div>
                    )}
                </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-3xl font-bold mb-8">Settings</h1>
                    <div className={`p-8 rounded-[2rem] border shadow-sm space-y-8 ${theme.card}`}>
                        <div className={`space-y-6 pb-8 border-b ${appSettings.darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center justify-between"><h3 className="text-xl font-bold">Profile Settings</h3>{!isEditingProfile ? (<button onClick={() => setIsEditingProfile(true)} className="text-indigo-500 font-bold text-sm flex items-center gap-1 hover:underline"><Edit2 size={14}/> Edit Profile</button>) : (<div className="flex gap-2"><button onClick={() => setIsEditingProfile(false)} className={`font-bold text-sm flex items-center gap-1 ${theme.textMuted} hover:text-white`}><X size={14}/> Cancel</button><button onClick={handleSaveProfile} className="text-emerald-500 font-bold text-sm hover:text-emerald-400 flex items-center gap-1"><Check size={14}/> Save</button></div>)}</div>
                            <div className="flex items-start gap-6">
                                <div className="relative group cursor-pointer"><div className={`w-24 h-24 rounded-full bg-gradient-to-br ${profileColor} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>{tempUser.name.charAt(0).toUpperCase()}</div>{isEditingProfile && (<div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} className="text-white"/></div>)}</div>
                                {isEditingProfile ? (<div className="flex-1 space-y-4"><div><label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${theme.textMuted}`}>Full Name</label><input type="text" value={tempUser.name} onChange={(e) => setTempUser({...tempUser, name: e.target.value})} className={`w-full p-2 rounded-lg outline-none font-medium ${theme.input}`}/></div><div><label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${theme.textMuted}`}>Email</label><input type="email" value={tempUser.email} onChange={(e) => setTempUser({...tempUser, email: e.target.value})} className={`w-full p-2 rounded-lg outline-none font-medium ${theme.input}`}/></div></div>) : (<div className="flex-1 pt-2"><h3 className="text-2xl font-bold">{currentUser.name}</h3><p className={theme.textMuted}>{currentUser.email}</p></div>)}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold mb-4">Preferences</h3>
                            <div className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${appSettings.darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`} onClick={() => handleToggleSetting('darkMode')}><span className="font-medium">Dark Mode</span><div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${appSettings.darkMode ? 'bg-indigo-600' : 'bg-slate-400'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all duration-300 ${appSettings.darkMode ? 'left-6.5' : 'left-0.5'}`}></div></div></div>
                            <div className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${appSettings.darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`} onClick={() => handleToggleSetting('emailNotifs')}><span className="font-medium">Email Notifications</span><div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${appSettings.emailNotifs ? 'bg-indigo-600' : 'bg-slate-400'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all duration-300 ${appSettings.emailNotifs ? 'left-6.5' : 'left-0.5'}`}></div></div></div>
                        </div>
                        <button className="w-full py-4 rounded-xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 mt-8"><Trash2 size={18} /> Delete Account</button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, isSpecial, darkMode }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : isSpecial ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{icon}{label}{isSpecial && <span className="ml-auto w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>}</button>
);

const StatCard = ({ icon, label, value, sub, color, darkMode }) => (
    <div className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}><div className="flex items-start justify-between mb-4"><div><p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p><h4 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h4></div><div className={`p-3 rounded-xl bg-opacity-10 ${'bg-' + color + '-500'}`}>{icon}</div></div><p className={`text-xs font-bold ${'text-' + color + '-500'}`}>{sub}</p></div>
);

const StudySetCard = ({ title, date, items, color, darkMode }) => (
    <div className={`p-5 rounded-2xl border shadow-sm transition-all cursor-pointer group ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300'}`}><div className="flex items-start justify-between mb-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><BookOpen size={20} /></div><button className="text-slate-400 hover:text-indigo-500"><MoreVertical size={18}/></button></div><h4 className={`font-bold mb-1 transition-colors truncate ${darkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>{title}</h4><div className="flex items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock size={12}/> {date}</span><span className="flex items-center gap-1"><LayoutGrid size={12}/> {items}</span></div></div>
);

const StudyTab = ({ icon, label, active, onClick, darkMode }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>{icon} {label}</button>
);

export default DashboardPage;
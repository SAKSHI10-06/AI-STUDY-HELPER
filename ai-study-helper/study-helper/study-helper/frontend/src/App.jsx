import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { extractTextFromFile } from './utils/fileParser';
import { generateStudyMaterial } from './services/gemini';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'auth' | 'app'
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [extractedText, setExtractedText] = useState(''); // Stores raw text for Tutor/Regen
  const [recentSets, setRecentSets] = useState([]);

  // --- 1. File Upload Handler ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit file size to 25MB to prevent browser crashes during client-side parsing
    if (file.size > 25 * 1024 * 1024) {
      alert("File is too large (Max 25MB). Please upload a smaller document.");
      return;
    }

    try {
      setStatus('processing');
      
      // Step A: Parse File
      const text = await extractTextFromFile(file);
      
      // Validate extracted text
      if (!text || text.length < 50) {
        throw new Error("Could not extract enough text from this file. It might be empty or scanned images.");
      }

      setExtractedText(text); // Save for later use (Tutor/Regen)

      // Step B: Generate Content
      const aiResponse = await generateStudyMaterial(text);
      setData(aiResponse);
      
      // Step C: Save to History
      const newSet = {
        id: Date.now(),
        title: file.name,
        date: new Date().toLocaleDateString(),
        cards: aiResponse.flashcards?.length || 0,
        data: aiResponse
      };
      setRecentSets(prev => [newSet, ...prev]);
      
      setStatus('success');
    } catch (err) {
      console.error("Upload Failed:", err);
      // Show a friendly error message to the user
      alert(err.message || "Failed to process file. Please try a different document."); 
      setStatus('error');
    }
  };

  // --- 2. Regenerate Handler ---
  const handleRegenerate = async () => {
    if (!extractedText) {
      alert("No document loaded to regenerate from.");
      return;
    }
    
    try {
      // Set status to 'processing' so the UI shows the loading spinner again
      setStatus('processing');
      
      // Re-run AI generation with the same text
      // (The gemini service uses a random seed, so it will produce new results)
      const aiResponse = await generateStudyMaterial(extractedText);
      
      setData(aiResponse);
      setStatus('success');
    } catch (err) {
      console.error("Regen Failed:", err);
      alert("Failed to generate new questions. Please try again.");
      setStatus('success'); // Revert to success so user can see old data at least
    }
  };

  // --- Routing ---
  if (view === 'landing') return <LandingPage onGetStarted={() => setView('auth')} onLogin={() => setView('auth')} />;
  if (view === 'auth') return <AuthPage onAuthSuccess={() => setView('app')} />;

  return (
    <DashboardPage 
        user={{ name: "Student", email: "user@studyhelper.ai" }}
        onLogout={() => setView('landing')}
        onUpload={handleFileUpload}
        status={status}
        studyData={data}
        recentSets={recentSets}
        onRegenerate={handleRegenerate}
        rawText={extractedText}
    />
  );
}

export default App;
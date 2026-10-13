import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Brain, ArrowRight, Sparkles, Zap, Clock, FileText, CheckCircle2, ChevronRight, Play, RotateCw, Globe, Upload, Loader2, BookOpen, Network, BarChart3, Languages, Save, RefreshCw, Smartphone, History, Crown, Bot, Send, User } from 'lucide-react';

// --- IMPORTS FOR REAL DEMO ---
import FlashcardViewer from '../components/FlashcardViewer';
import QuizTaker from '../components/QuizTaker';
import MermaidChart from '../components/MermaidChart';

// --- TRANSLATIONS CONFIGURATION ---
const TRANSLATIONS = {
  en: {
    nav: { features: "Features", demo: "Live Demo", how: "How it works", benefits: "Why Sign Up", login: "Log in", signup: "Sign Up Free" },
    hero: {
      badge: "AI-Powered Study Assistant",
      titlePart1: "Master any subject",
      titlePart2: "in seconds.",
      desc: "Upload your chaotic notes. We instantly generate structured",
      descHighlight1: "Summaries",
      descHighlight2: "Flashcards",
      descHighlight3: "Quizzes",
      start: "Start Learning",
      watch: "Watch Demo"
    },
    problem: {
        badge: "Overwhelmed",
        title: "Drowning in PDFs?",
        desc: "Highlighting entire pages doesn't help you learn. You're wasting hours organizing notes instead of actually studying.",
        list1: "Wasting time formatting",
        list2: "500+ pages of unread slides"
    },
    how: {
        badge: "The Process",
        title: "From Chaos to Clarity in 3 Steps",
        step1Title: "Upload",
        step1Desc: "Drop your PDF, DOCX, or text file. We handle almost any format securely.",
        step2Title: "Analyze",
        step2Desc: "Our Gemini 2.5 engine reads every word and connects key concepts instantly.",
        step3Title: "Master",
        step3Desc: "Get summaries, active recall flashcards, and adaptive quizzes generated for you."
    },
    demo: {
        badge: "Interactive Demo",
        title: "Experience the magic.",
        desc: "Try the full flow below without creating an account. We've pre-loaded a Python Basics PDF to show you the power of AI.",
        uploadText: "Click to Upload Demo File",
        analyzing: "Analyzing Document...",
        extracting: "Extracting concepts...",
        results: "Results",
        regenerate: "Generate New Questions"
    },
    features: {
        titlePart1: "Everything you need to",
        titlePart2: "excel",
        desc: "Our AI handles the heavy lifting so you can focus on actually understanding the material.",
        card1Title: "Deep Context AI",
        card1Desc: "Gemini 2.5 doesn't just summarize; it understands. It extracts hidden connections and analogies.",
        card2Title: "Weakness Detect",
        card2Desc: "Visualizes your knowledge gaps instantly.",
        card3Title: "Auto Concept Maps",
        card3Desc: "Visual learner? We automatically generate mermaid.js flowcharts to visualize complex processes.",
        card4Title: "Multi-Language",
        card4Desc: "Study in English, Spanish, French, Hindi, and more.",
        card5Title: "AI Personal Tutor",
        card5Desc: "Stuck on a concept? Chat with our AI tutor who knows your exact notes."
    },
    benefits: {
      badge: "Why Sign Up?",
      title: "Unlock Your Full Potential",
      b1Title: "Save Your Study Sets",
      b1Desc: "Never lose your generated content. Access your summaries and flashcards anytime.",
      b2Title: "Track Progress",
      b2Desc: "Monitor your quiz scores over time and see your improvement history.",
      b3Title: "Fresh Questions",
      b3Desc: "Regenerate unlimited new quizzes from the same material to test your mastery.",
      b4Title: "Sync Everywhere",
      b4Desc: "Start on your laptop, review on your phone. Your study sets go where you go."
    },
    cta: {
        title: "Ready to ace it?",
        btn: "Get Started for Free"
    }
  },
  es: {
    nav: { features: "Características", demo: "Demo", how: "Cómo funciona", benefits: "Beneficios", login: "Entrar", signup: "Registrarse" },
    hero: {
      badge: "Asistente de Estudio IA",
      titlePart1: "Domina cualquier tema",
      titlePart2: "en segundos.",
      desc: "Sube tus notas caóticas. Generamos instantáneamente Resúmenes, Tarjetas y Cuestionarios estructurados.",
      descHighlight1: "Resúmenes",
      descHighlight2: "Tarjetas",
      descHighlight3: "Cuestionarios",
      start: "Empezar a Aprender",
      watch: "Ver Demo"
    },
    problem: {
        badge: "Abrumado",
        title: "¿Ahogado en PDFs?",
        desc: "Resaltar páginas enteras no ayuda a aprender. Estás perdiendo horas organizando notas en lugar de estudiar.",
        list1: "Perdiendo tiempo formateando",
        list2: "Más de 500 páginas sin leer"
    },
    how: {
        badge: "El Proceso",
        title: "Del Caos a la Claridad",
        step1Title: "Subir",
        step1Desc: "Arrastra tu archivo PDF, DOCX o texto. Manejamos casi cualquier formato.",
        step2Title: "Analizar",
        step2Desc: "Nuestro motor Gemini 2.5 lee cada palabra y conecta conceptos clave.",
        step3Title: "Dominar",
        step3Desc: "Obtén resúmenes, tarjetas de memoria y cuestionarios adaptativos."
    },
    demo: {
        badge: "Demo Interactiva",
        title: "Experimenta la magia.",
        desc: "Prueba el flujo completo sin crear una cuenta. Hemos precargado un PDF de Python.",
        uploadText: "Clic para Subir Archivo Demo",
        analyzing: "Analizando Documento...",
        extracting: "Extrayendo conceptos...",
        results: "Resultados",
        regenerate: "Generar Nuevas Preguntas"
    },
    features: {
        titlePart1: "Todo lo que necesitas para",
        titlePart2: "sobresalir",
        desc: "Nuestra IA hace el trabajo pesado para que puedas concentrarte en entender.",
        card1Title: "IA de Contexto",
        card1Desc: "Gemini 2.5 no solo resume; entiende. Extrae conexiones ocultas y analogías.",
        card2Title: "Detectar Debilidades",
        card2Desc: "Visualiza tus lagunas de conocimiento al instante.",
        card3Title: "Mapas Conceptuales",
        card3Desc: "¿Aprendiz visual? Generamos diagramas de flujo automáticamente.",
        card4Title: "Multi-Lenguaje",
        card4Desc: "Estudia en Inglés, Español, Francés o Hindi.",
        card5Title: "Tutor Personal IA",
        card5Desc: "¿Atascado en un concepto? Chatea con nuestro tutor IA que conoce tus notas."
    },
    benefits: {
      badge: "¿Por qué registrarse?",
      title: "Desbloquea tu potencial",
      b1Title: "Guarda tus estudios",
      b1Desc: "Nunca pierdas tu contenido. Accede a tus resúmenes en cualquier momento.",
      b2Title: "Sigue tu progreso",
      b2Desc: "Monitorea tus puntuaciones y ve tu historial de mejoras.",
      b3Title: "Preguntas Nuevas",
      b3Desc: "Regenera cuestionarios ilimitados del mismo material.",
      b4Title: "Sincronización",
      b4Desc: "Empieza en tu laptop, repasa en tu teléfono."
    },
    cta: {
        title: "¿Listo para triunfar?",
        btn: "Empieza Gratis"
    }
  },
  fr: {
      nav: { features: "Fonctionnalités", demo: "Démo", how: "Fonctionnement", benefits: "Avantages", login: "Connexion", signup: "S'inscrire" },
      hero: {
        badge: "Assistant d'étude IA",
        titlePart1: "Maîtrisez tout sujet",
        titlePart2: "en quelques secondes.",
        desc: "Téléchargez vos notes. Nous générons instantanément des Résumés, Flashcards et Quiz.",
        descHighlight1: "Résumés",
        descHighlight2: "Flashcards",
        descHighlight3: "Quiz",
        start: "Commencer",
        watch: "Voir la démo"
      },
      problem: {
        badge: "Débordé",
        title: "Noyé sous les PDF ?",
        desc: "Surligner des pages entières n'aide pas à apprendre. Vous perdez des heures à organiser vos notes.",
        list1: "Perte de temps en formatage",
        list2: "500+ pages non lues"
    },
    how: {
        badge: "Le Processus",
        title: "Du Chaos à la Clarté",
        step1Title: "Télécharger",
        step1Desc: "Déposez votre fichier PDF ou DOCX. Nous gérons presque tous les formats.",
        step2Title: "Analyser",
        step2Desc: "Notre moteur Gemini 2.5 lit chaque mot et connecte les concepts clés.",
        step3Title: "Maîtriser",
        step3Desc: "Obtenez des résumés, des flashcards et des quiz adaptatifs."
    },
    demo: {
        badge: "Démo Interactive",
        title: "Découvrez la magie.",
        desc: "Essayez le flux complet sans compte. Nous avons préchargé un PDF de Python.",
        uploadText: "Cliquez pour télécharger",
        analyzing: "Analyse du document...",
        extracting: "Extraction des concepts...",
        results: "Résultats",
        regenerate: "Générer de nouvelles questions"
    },
    features: {
        titlePart1: "Tout pour",
        titlePart2: "exceller",
        desc: "Notre IA fait le gros du travail pour que vous puissiez vous concentrer sur la compréhension.",
        card1Title: "IA Contextuelle",
        card1Desc: "Gemini 2.5 comprend le contexte et extrait les connexions cachées.",
        card2Title: "Détection Faiblesses",
        card2Desc: "Visualisez instantanément vos lacunes.",
        card3Title: "Cartes Conceptuelles",
        card3Desc: "Nous générons automatiquement des diagrammes de flux.",
        card4Title: "Multi-Langue",
        card4Desc: "Étudiez en Anglais, Espagnol, Français ou Hindi.",
        card5Title: "Tuteur Personnel IA",
        card5Desc: "Bloqué sur un concept ? Discutez avec notre tuteur IA."
    },
    benefits: {
      badge: "Pourquoi s'inscrire ?",
      title: "Libérez votre potentiel",
      b1Title: "Sauvegardez tout",
      b1Desc: "Ne perdez jamais vos fiches. Accédez-y à tout moment.",
      b2Title: "Suivi des progrès",
      b2Desc: "Surveillez vos scores et votre historique d'amélioration.",
      b3Title: "Nouvelles questions",
      b3Desc: "Régénérez des quiz illimités à partir du même support.",
      b4Title: "Sync partout",
      b4Desc: "Commencez sur PC, révisez sur mobile."
    },
    cta: {
        title: "Prêt à réussir ?",
        btn: "Commencer gratuitement"
    }
  },
  de: {
    nav: { features: "Funktionen", demo: "Live-Demo", how: "Wie es funktioniert", benefits: "Vorteile", login: "Anmelden", signup: "Kostenlos Starten" },
    hero: {
      badge: "KI-Lernassistent",
      titlePart1: "Meistere jedes Fach",
      titlePart2: "in Sekunden.",
      desc: "Laden Sie Ihre Notizen hoch. Wir generieren sofort strukturierte",
      descHighlight1: "Zusammenfassungen",
      descHighlight2: "Lernkarten",
      descHighlight3: "Quizze",
      start: "Jetzt Lernen",
      watch: "Demo ansehen"
    },
    problem: {
        badge: "Überfordert",
        title: "In PDFs ertrinken?",
        desc: "Das Markieren ganzer Seiten hilft nicht beim Lernen. Sie verschwenden Stunden mit Formatierung statt zu lernen.",
        list1: "Zeitverschwendung durch Formatierung",
        list2: "500+ ungelesene Seiten"
    },
    how: {
        badge: "Der Prozess",
        title: "Vom Chaos zur Klarheit",
        step1Title: "Hochladen",
        step1Desc: "PDF, DOCX oder Text ablegen. Wir verarbeiten fast jedes Format sicher.",
        step2Title: "Analysieren",
        step2Desc: "Unsere Gemini 2.5 Engine liest jedes Wort und verbindet Konzepte.",
        step3Title: "Meistern",
        step3Desc: "Erhalten Sie Zusammenfassungen, Lernkarten und adaptive Quizze."
    },
    demo: {
        badge: "Interaktive Demo",
        title: "Erleben Sie die Magie.",
        desc: "Testen Sie den Ablauf ohne Konto. Wir haben ein Python-PDF vorgeladen.",
        uploadText: "Demo-Datei hochladen",
        analyzing: "Analysiere Dokument...",
        extracting: "Extrahiere Konzepte...",
        results: "Ergebnisse",
        regenerate: "Neue Fragen generieren"
    },
    features: {
        titlePart1: "Alles was Sie brauchen um",
        titlePart2: "zu glänzen",
        desc: "Unsere KI erledigt die Schwerarbeit, damit Sie sich auf das Verstehen konzentrieren können.",
        card1Title: "Tiefenkontext-KI",
        card1Desc: "Gemini 2.5 fasst nicht nur zusammen; es versteht. Es extrahiert versteckte Verbindungen.",
        card2Title: "Schwächenerkennung",
        card2Desc: "Visualisiert Ihre Wissenslücken sofort.",
        card3Title: "Auto-Konzeptkarten",
        card3Desc: "Visueller Lerntyp? Wir generieren automatisch Mermaid.js Flussdiagramme.",
        card4Title: "Mehrsprachig",
        card4Desc: "Lernen Sie auf Englisch, Spanisch, Französisch, Deutsch und mehr.",
        card5Title: "Persönlicher KI-Tutor",
        card5Desc: "Chatten Sie sofort mit Ihren Dokumenten."
    },
    benefits: {
      badge: "Warum anmelden?",
      title: "Entfalten Sie Ihr Potenzial",
      b1Title: "Speichern Sie alles",
      b1Desc: "Verlieren Sie nie Ihre Lernsets. Jederzeit Zugriff.",
      b2Title: "Fortschritt verfolgen",
      b2Desc: "Überwachen Sie Ihre Quiz-Ergebnisse im Laufe der Zeit.",
      b3Title: "Neue Fragen",
      b3Desc: "Generieren Sie unbegrenzt neue Quizze aus demselben Material.",
      b4Title: "Überall synchron",
      b4Desc: "Beginnen Sie am Laptop, wiederholen Sie am Handy."
    },
    cta: {
        title: "Bereit für die Bestnote?",
        btn: "Kostenlos starten"
    }
  },
  hi: {
      nav: { features: "सुविधाएँ", demo: "लाइव डेमो", how: "प्रक्रिया", benefits: "लाभ", login: "लॉग इन", signup: "साइन अप" },
      hero: {
        badge: "AI अध्ययन सहायक",
        titlePart1: "किसी भी विषय में",
        titlePart2: "महारत हासिल करें",
        desc: "अपने नोट्स अपलोड करें। हम तुरंत सारांश, फ्लैशकार्ड और क्विज़ बनाते हैं।",
        descHighlight1: "सारांश",
        descHighlight2: "फ्लैशकार्ड",
        descHighlight3: "क्विज़",
        start: "सीखना शुरू करें",
        watch: "डेमो देखें"
      },
      problem: {
        badge: "परेशान",
        title: "PDFs में डूब रहे हैं?",
        desc: "पूरे पन्नों को हाइलाइट करने से सीखने में मदद नहीं मिलती। आप पढ़ाई के बजाय नोट्स व्यवस्थित करने में समय बर्बाद कर रहे हैं।",
        list1: "फॉर्मेटिंग में समय बर्बाद",
        list2: "500+ बिना पढ़े पेज"
    },
    how: {
        badge: "प्रक्रिया",
        title: "3 चरणों में स्पष्टता",
        step1Title: "अपलोड करें",
        step1Desc: "अपना PDF या DOCX फ़ाइल छोड़ें। हम इसे सुरक्षित रूप से संभालते हैं।",
        step2Title: "विश्लेषण",
        step2Desc: "हमारा जेमिनी 2.5 इंजन हर शब्द को पढ़ता है और मुख्य अवधारणाओं को जोड़ता है।",
        step3Title: "महारत",
        step3Desc: "अपने लिए बनाए गए सारांश, फ्लैशकार्ड और क्विज़ प्राप्त करें।"
    },
    demo: {
        badge: "इंटरैक्टिव डेमो",
        title: "जादू का अनुभव करें।",
        desc: "खाता बनाए बिना पूरा अनुभव लें। हमने एक पायथन PDF लोड किया है।",
        uploadText: "डेमो फ़ाइल अपलोड करें",
        analyzing: "दस्तावेज़ का विश्लेषण...",
        extracting: "अवधारणाएँ निकाल रहा है...",
        results: "परिणाम",
        regenerate: "नए प्रश्न उत्पन्न करें"
    },
    features: {
        titlePart1: "सफल होने के लिए",
        titlePart2: "सब कुछ",
        desc: "हमारी AI भारी काम करती है ताकि आप समझने पर ध्यान केंद्रित कर सकें।",
        card1Title: "डीप कॉन्टेक्स्ट AI",
        card1Desc: "जेमिनी 2.5 केवल सारांश नहीं बनाता; यह समझता है।",
        card2Title: "कमज़ोरी का पता लगाना",
        card2Desc: "अपनी ज्ञान की कमियों को तुरंत देखें।",
        card3Title: "ऑटो कॉन्सेप्ट मैप्स",
        card3Desc: "हम जटिल प्रक्रियाओं की कल्पना करने के लिए फ्लोचार्ट बनाते हैं।",
        card4Title: "बहु-भाषा",
        card4Desc: "अंग्रेजी, स्पेनिश, फ्रेंच या हिंदी में अध्ययन करें।",
        card5Title: "AI पर्सनल ट्यूटर",
        card5Desc: "अपने दस्तावेज़ों के साथ तुरंत चैट करें।"
    },
    benefits: {
      badge: "साइन अप क्यों करें?",
      title: "अपनी पूरी क्षमता अनलॉक करें",
      b1Title: "अध्ययन सेट सहेजें",
      b1Desc: "अपनी सामग्री कभी न खोएं। किसी भी समय एक्सेस करें।",
      b2Title: "प्रगति ट्रैक करें",
      b2Desc: "अपने क्विज़ स्कोर की निगरानी करें और सुधार देखें।",
      b3Title: "नए प्रश्न",
      b3Desc: "समान सामग्री से असीमित नए क्विज़ बनाएं।",
      b4Title: "हर जगह सिंक करें",
      b4Desc: "लैपटॉप पर शुरू करें, फोन पर समीक्षा करें।"
    },
    cta: {
        title: "सफल होने के लिए तैयार?",
        btn: "मुफ्त में शुरू करें"
    }
  },
  zh: {
    nav: { features: "功能", demo: "演示", how: "如何使用", benefits: "优势", login: "登录", signup: "免费注册" },
    hero: {
      badge: "AI 学习助手",
      titlePart1: "瞬间掌握",
      titlePart2: "任何学科",
      desc: "上传您的笔记。我们即刻生成结构化的",
      descHighlight1: "摘要",
      descHighlight2: "抽认卡",
      descHighlight3: "测验",
      start: "开始学习",
      watch: "观看演示"
    },
    problem: {
        badge: "不知所措",
        title: "被 PDF 淹没？",
        desc: "高亮整页内容无助于学习。您浪费了数小时整理笔记，而不是真正学习。",
        list1: "浪费时间格式化",
        list2: "500+ 页未读幻灯片"
    },
    how: {
        badge: "流程",
        title: "三步从混乱到清晰",
        step1Title: "上传",
        step1Desc: "拖放您的 PDF 或 DOCX 文件。我们安全处理几乎所有格式。",
        step2Title: "分析",
        step2Desc: "我们的 Gemini 2.5 引擎阅读每一个字并即时连接关键概念。",
        step3Title: "掌握",
        step3Desc: "获取为您生成的摘要、抽认卡和自适应测验。"
    },
    demo: {
        badge: "交互式演示",
        title: "体验魔法。",
        desc: "无需账户即可尝试完整流程。我们已预加载 Python PDF。",
        uploadText: "点击上传演示文件",
        analyzing: "正在分析文档...",
        extracting: "正在提取概念...",
        results: "结果",
        regenerate: "生成新问题"
    },
    features: {
        titlePart1: "您脱颖而出",
        titlePart2: "所需的一切",
        desc: "我们的 AI 处理繁重工作，让您专注于理解材料。",
        card1Title: "深度语境 AI",
        card1Desc: "Gemini 2.5 不仅总结，还能理解。它提取隐藏的联系和类比。",
        card2Title: "弱点检测",
        card2Desc: "即时可视化您的知识盲点。",
        card3Title: "自动概念图",
        card3Desc: "视觉学习者？我们自动生成流程图以可视化复杂过程。",
        card4Title: "多语言",
        card4Desc: "用英语、西班牙语、法语、印地语或中文学习。",
        card5Title: "AI 私人导师",
        card5Desc: "即时与您的文档聊天。"
    },
    benefits: {
      badge: "为什么注册？",
      title: "释放您的全部潜力",
      b1Title: "保存学习集",
      b1Desc: "永不丢失内容。随时访问您的摘要和抽认卡。",
      b2Title: "跟踪进度",
      b2Desc: "监控测验成绩并查看改进历史。",
      b3Title: "新问题",
      b3Desc: "从相同材料生成无限的新测验。",
      b4Title: "多端同步",
      b4Desc: "在笔记本电脑上开始，在手机上复习。"
    },
    cta: {
        title: "准备好拿高分了吗？",
        btn: "免费开始"
    }
  },
  ja: {
    nav: { features: "機能", demo: "デモ", how: "使い方", benefits: "メリット", login: "ログイン", signup: "無料登録" },
    hero: {
      badge: "AI学習アシスタント",
      titlePart1: "あらゆる科目を",
      titlePart2: "瞬時にマスター",
      desc: "ノートをアップロードしてください。構造化された",
      descHighlight1: "要約",
      descHighlight2: "単語カード",
      descHighlight3: "クイズ",
      start: "学習を開始",
      watch: "デモを見る"
    },
    problem: {
        badge: "圧倒されていませんか？",
        title: "PDFに溺れていませんか？",
        desc: "ページ全体をハイライトしても学習には役立ちません。勉強ではなく整理に時間を浪費しています。",
        list1: "フォーマットに時間を浪費",
        list2: "500ページ以上の未読スライド"
    },
    how: {
        badge: "プロセス",
        title: "3ステップで明確に",
        step1Title: "アップロード",
        step1Desc: "PDFやDOCXをドロップ。ほぼ全てのフォーマットを安全に処理します。",
        step2Title: "分析",
        step2Desc: "Gemini 2.5エンジンが全単語を読み、重要な概念を即座に接続します。",
        step3Title: "習得",
        step3Desc: "要約、単語カード、適応型クイズを自動生成します。"
    },
    demo: {
        badge: "インタラクティブデモ",
        title: "魔法を体験。",
        desc: "アカウントなしで全フローをお試しください。PythonのPDFをプリロードしました。",
        uploadText: "デモファイルをアップロード",
        analyzing: "ドキュメントを分析中...",
        extracting: "概念を抽出中...",
        results: "結果",
        regenerate: "新しい質問を生成"
    },
    features: {
        titlePart1: "卓越するために",
        titlePart2: "必要なすべて",
        desc: "AIが面倒な作業を行い、あなたは理解に集中できます。",
        card1Title: "深い文脈AI",
        card1Desc: "Gemini 2.5は要約するだけでなく理解します。隠れた関連性を抽出します。",
        card2Title: "弱点検出",
        card2Desc: "知識の空白を即座に可視化します。",
        card3Title: "自動概念マップ",
        card3Desc: "視覚的学習？複雑なプロセスのフローチャートを自動生成します。",
        card4Title: "多言語対応",
        card4Desc: "英語、スペイン語、フランス語、ヒンディー語、日本語で学習可能。",
        card5Title: "AI個人家庭教師",
        card5Desc: "ドキュメントと即座にチャット。"
    },
    benefits: {
      badge: "なぜ登録するのですか？",
      title: "あなたの可能性を解き放つ",
      b1Title: "学習セットを保存",
      b1Desc: "コンテンツを失うことはありません。いつでもアクセス可能。",
      b2Title: "進捗を追跡",
      b2Desc: "クイズのスコアを監視し、改善履歴を確認します。",
      b3Title: "新しい質問",
      b3Desc: "同じ資料から無制限の新しいクイズを生成します。",
      b4Title: "どこでも同期",
      b4Desc: "PCで開始し、スマホで復習。"
    },
    cta: {
        title: "準備はいいですか？",
        btn: "無料で始める"
    }
  }
};

// Mock Data for the Demo (UPDATED with 8 Flashcards & 5 Questions)
const DEMO_DATA = {
  summary: "Python is a high-level, interpreted programming language known for its simplicity and readability. It supports multiple programming paradigms, including procedural, object-oriented, and functional programming. Key features include dynamic typing, automatic memory management (garbage collection), and a comprehensive standard library. Python is widely used in web development, data science, AI, and automation.",
  deep_insight: "Think of Python as **Executable Pseudocode**. 🐍💻\n\nUnlike languages like C++ or Java which are like writing a formal legal contract (verbose, strict types), Python is like writing a recipe in English.\n\n* **Readable:** `print('Hello')` vs `System.out.println('Hello');`\n* **Dynamic:** No need to declare `int x = 5`, just `x = 5`.\n* **Versatile:** From building websites (Django) to training AI (PyTorch), it does it all.\nIt's the 'Swiss Army Knife' of coding.",
  flashcards: [
    { front: "What is a variable in Python?", back: "A container for storing data values (e.g., x = 5)." },
    { front: "How do you create a list?", back: "Using square brackets, e.g., my_list = [1, 2, 3]." },
    { front: "What is the purpose of indentation?", back: "To define blocks of code (scope), unlike braces {} in other languages." },
    { front: "What function outputs text to the console?", back: "print()" },
    { front: "What is a dictionary?", back: "A collection of key-value pairs, ordered and mutable." },
    { front: "How do you start a while loop?", back: "With the 'while' keyword followed by a condition." },
    { front: "What does 'def' keyword do?", back: "It is used to define a function." },
    { front: "What is a module?", back: "A file containing Python code that can be imported." }
  ],
  quiz: [
    { question: "Which symbol is used for comments in Python?", options: ["//", "#", "/*", "<!--"], answer: 1, difficulty: "Easy" },
    { question: "What is the correct file extension for Python files?", options: [".pyth", ".pt", ".py", ".p"], answer: 2, difficulty: "Easy" },
    { question: "Which data type is immutable?", options: ["List", "Dictionary", "Set", "Tuple"], answer: 3, difficulty: "Medium" },
    { question: "What is the output of 2 ** 3?", options: ["6", "8", "9", "5"], answer: 1, difficulty: "Medium" },
    { question: "Which method adds an item to the end of a list?", options: ["add()", "insert()", "append()", "push()"], answer: 2, difficulty: "Hard" }
  ],
  mermaid: "graph TD; A[Python] -->|Paradigm| B[Object-Oriented]; A -->|Paradigm| C[Procedural]; A -->|Use Case| D[Web Dev]; A -->|Use Case| E[Data Science];"
};

const LandingPage = ({ onGetStarted, onLogin }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Language State
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang]; // Current translation object

  // Helper for conditional font/spacing classes based on language
  const isHindi = lang === 'hi';
  const textClass = isHindi ? 'font-medium leading-loose' : '';

  return (
    <div className={`bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden ${textClass}`}>
      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-[100]" />
      
      {/* Pass lang and setLang to Navbar */}
      <Navbar onGetStarted={onGetStarted} onLogin={onLogin} currentLang={lang} setLang={setLang} t={t.nav} />
      
      {/* Pass translation strings to sections */}
      <HeroSection onGetStarted={onGetStarted} t={t.hero} />
      <ProblemSolutionSection t={t.problem} />
      <HowItWorksSection t={t.how} />
      <LiveDemoSection t={t.demo} />
      <FeaturesBentoGrid t={t.features} />
      <BenefitsSection t={t.benefits} />
      <CtaSection onGetStarted={onGetStarted} t={t.cta} />
      <Footer />
    </div>
  );
};

// --- NAVBAR ---
const Navbar = ({ onGetStarted, onLogin, currentLang, setLang, t }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'hi', label: 'Hindi' },
      { code: 'zh', label: '中文' },
      { code: 'ja', label: '日本語' }
  ];

  const handleLangSelect = (code) => {
      setLang(code);
      setIsLangMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
      scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-slate-800 py-3' : 'bg-transparent border-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Brain size={18} />
          </div>
          <span>Study<span className="text-indigo-400">Helper</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">{t.how}</a>
          <a href="#demo" className="hover:text-white transition-colors">{t.demo}</a>
          <a href="#features" className="hover:text-white transition-colors">{t.features}</a>
          <a href="#benefits" className="hover:text-white transition-colors">{t.benefits}</a>
          
          {/* STABLE Language Selector (Click-based) */}
          <div className="relative" ref={dropdownRef}>
             <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 hover:text-white uppercase font-semibold transition-colors py-2"
             >
                <Globe size={14} />
                <span>{currentLang}</span>
             </button>
             
             {isLangMenuOpen && (
                 <div className="absolute top-full right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                     {languages.map((l) => (
                         <button 
                            key={l.code}
                            onClick={() => handleLangSelect(l.code)}
                            className={`w-full text-left px-3 py-2 hover:bg-slate-800 rounded-lg text-slate-300 text-sm flex items-center justify-between ${currentLang === l.code ? 'bg-slate-800 text-white font-bold' : ''}`}
                         >
                            {l.label}
                            {currentLang === l.code && <CheckCircle2 size={12} className="text-indigo-400"/>}
                         </button>
                     ))}
                 </div>
             )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-slate-300 hover:text-white font-medium text-sm transition-colors">
            {t.login}
          </button>
          <button 
            onClick={onGetStarted}
            className="group relative px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-indigo-50 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.signup} <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform"/>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- HERO SECTION ---
const HeroSection = ({ onGetStarted, t }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <motion.div style={{ y: y1, opacity }} className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
      <motion.div style={{ y: y2, opacity }} className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 hover:bg-indigo-500/20 transition-colors cursor-default">
            <Sparkles size={12} /> {t.badge}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            {t.titlePart1} <br /> {t.titlePart2}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.desc} 
            <span className="text-indigo-400 font-bold"> {t.descHighlight1}</span>, 
            <span className="text-purple-400 font-bold"> {t.descHighlight2}</span>, & 
            <span className="text-pink-400 font-bold"> {t.descHighlight3}</span>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={onGetStarted} className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                {t.start} <ArrowRight size={20} />
             </button>
             <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-lg transition-all flex items-center justify-center gap-2"
             >
                <Play size={18} fill="currentColor" /> {t.watch}
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- STORY SECTION 1: PROBLEM/SOLUTION ---
const ProblemSolutionSection = ({ t }) => {
    return (
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Problem */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
               <ScrollReveal>
                 <div className="relative">
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
                    <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl -rotate-2 transform hover:rotate-0 transition-all duration-500">
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm rounded-3xl z-10">
                            <span className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-bold shadow-lg">{t.badge}</span>
                        </div>
                        <div className="space-y-4 opacity-30">
                            <div className="h-4 w-3/4 bg-slate-700 rounded"/>
                            <div className="h-4 w-full bg-slate-700 rounded"/>
                            <div className="h-4 w-5/6 bg-slate-700 rounded"/>
                            <div className="h-4 w-full bg-slate-700 rounded"/>
                        </div>
                    </div>
                 </div>
               </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h2 className="text-4xl font-bold mb-6">{t.title}</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                {t.desc}
              </p>
              <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-3"><Clock className="text-red-400" size={18}/> {t.list1}</li>
                  <li className="flex items-center gap-3"><FileText className="text-red-400" size={18}/> {t.list2}</li>
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
};

// --- STORY SECTION 2: HOW IT WORKS ---
const HowItWorksSection = ({ t }) => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-950 text-center relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="inline-block mb-4 text-indigo-400 font-bold tracking-widest text-xs uppercase">{t.badge}</div>
          <h2 className="text-4xl font-bold mb-16 text-white">{t.title}</h2>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
           {/* Step 1 */}
           <ScrollReveal delay={0.1}>
             <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all group hover:-translate-y-2">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-lg">1</div>
               <div className="mt-6">
                 <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-2 text-white">{t.step1Title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{t.step1Desc}</p>
               </div>
             </div>
           </ScrollReveal>

           {/* Step 2 */}
           <ScrollReveal delay={0.3}>
             <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all group hover:-translate-y-2">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-lg">2</div>
               <div className="mt-6">
                 <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                    <Brain size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-2 text-white">{t.step2Title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{t.step2Desc}</p>
               </div>
             </div>
           </ScrollReveal>

           {/* Step 3 */}
           <ScrollReveal delay={0.5}>
             <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all group hover:-translate-y-2">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-lg">3</div>
               <div className="mt-6">
                 <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                    <Zap size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-2 text-white">{t.step3Title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{t.step3Desc}</p>
               </div>
             </div>
           </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

// --- STORY SECTION 3: FULLY FUNCTIONAL LIVE DEMO ---
const LiveDemoSection = ({ t }) => {
    const [demoStep, setDemoStep] = useState('upload'); // 'upload' | 'processing' | 'dashboard'
    const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz' | 'summary' | 'map' | 'tutor'
    
    // AI Tutor States
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { role: 'ai', text: "Hello! I'm your AI Tutor. I've analyzed your Python PDF. Ask me anything! 🤖" }
    ]);
    const scrollRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages, activeTab]);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        
        const userMsg = { role: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput("");
        
        // Simulate AI Response
        setTimeout(() => {
            const aiMsg = { 
                role: 'ai', 
                text: "That's a great question! Based on the Python material, Python uses indentation to define code blocks instead of curly braces used in other languages like Java or C++." 
            };
            setChatMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const startDemo = () => {
        setDemoStep('processing');
        setTimeout(() => {
            setDemoStep('dashboard');
        }, 2500);
    };

    const resetDemo = () => {
        setDemoStep('upload');
        setActiveTab('flashcards');
        setChatMessages([{ role: 'ai', text: "Hello! I'm your AI Tutor. I've analyzed your Python PDF. Ask me anything! 🤖" }]);
    };

    const handleRegenerate = () => {
        setDemoStep('processing');
        setTimeout(() => {
            setDemoStep('dashboard');
        }, 1500);
    };

    return (
      <section id="demo" className="py-32 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
            <ScrollReveal>
                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-green-400 uppercase bg-green-900/30 border border-green-500/30 rounded-full">
                    {t.badge}
                </div>
                <h2 className="text-4xl font-bold mb-4">{t.title}</h2>
                <p className="text-slate-400 mb-12 max-w-xl mx-auto">
                    {t.desc}
                </p>
            </ScrollReveal>
            
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative"
            >
                {/* Browser Toolbar */}
                <div className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="bg-slate-950 px-4 py-1.5 rounded-md text-xs font-mono text-slate-500 flex items-center gap-2 border border-slate-800/50">
                        {demoStep === 'upload' ? 'Upload' : <><FileText size={12} className="text-blue-400"/> python_basics_101.pdf</>}
                    </div>
                    <div className="w-16 flex justify-end">
                       {demoStep === 'dashboard' && <button onClick={resetDemo} className="text-xs text-slate-500 hover:text-white transition-colors">Reset</button>}
                    </div>
                </div>

                <div className="flex-1 bg-slate-950 relative">
                    {/* STEP 1: UPLOAD SIMULATION */}
                    {demoStep === 'upload' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
                            <div 
                                onClick={startDemo}
                                className="group cursor-pointer p-12 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl bg-slate-900/50 hover:bg-slate-900 transition-all max-w-lg w-full text-center"
                            >
                                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all text-slate-400">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{t.uploadText}</h3>
                                <p className="text-slate-500 text-sm">"Python_Programming_Guide.pdf"</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PROCESSING SIMULATION */}
                    {demoStep === 'processing' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">{t.analyzing}</h3>
                            <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: "100%" }} 
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                            <p className="text-slate-500 text-xs mt-4 animate-pulse">{t.extracting}</p>
                        </div>
                    )}

                    {/* STEP 3: DASHBOARD SIMULATION (REAL COMPONENTS) */}
                    {demoStep === 'dashboard' && (
                        <div className="absolute inset-0 grid md:grid-cols-[240px_1fr] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Sidebar */}
                            <div className="border-r border-slate-800 p-6 space-y-2 bg-slate-900/30 hidden md:block text-left">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 px-2">{t.results}</p>
                                <button onClick={() => setActiveTab('summary')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><FileText size={16}/> Summary</button>
                                <button onClick={() => setActiveTab('flashcards')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><BookOpen size={16}/> Flashcards</button>
                                <button onClick={() => setActiveTab('quiz')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Brain size={16}/> Quiz</button>
                                <button onClick={() => setActiveTab('map')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'map' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Network size={16}/> Concept Map</button>
                                <button onClick={() => setActiveTab('tutor')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'tutor' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Bot size={16}/> AI Tutor</button>
                                
                                <div className="mt-8 pt-8 border-t border-slate-800">
                                    <button 
                                        onClick={handleRegenerate}
                                        className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider hover:text-white transition-colors group w-full"
                                    >
                                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/>
                                        {t.regenerate}
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 overflow-y-auto bg-slate-50 text-slate-900 h-full">
                                {activeTab === 'summary' && (
                                    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20}/></div>
                                                <h3 className="text-xl font-bold text-slate-800">Academic Summary</h3>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{DEMO_DATA.summary}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-100/50">
                                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Sparkles size={20}/></div>
                                                <h3 className="text-xl font-bold text-indigo-900">Deep Insight</h3>
                                            </div>
                                            <p className="text-indigo-800 leading-relaxed whitespace-pre-line">{DEMO_DATA.deep_insight}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'flashcards' && (
                                    <div className="max-w-xl mx-auto py-10 animate-in fade-in zoom-in-95">
                                        {/* Using the REAL component with mock data */}
                                        <FlashcardViewer cards={DEMO_DATA.flashcards} />
                                    </div>
                                )}

                                {activeTab === 'quiz' && (
                                    <div className="max-w-xl mx-auto py-4 animate-in fade-in slide-in-from-right-4">
                                        {/* Using the REAL component with mock data */}
                                        <QuizTaker questions={DEMO_DATA.quiz} onExit={() => setActiveTab('summary')} />
                                    </div>
                                )}

                                {activeTab === 'map' && (
                                    <div className="max-w-3xl mx-auto py-4 animate-in fade-in slide-in-from-right-4">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Network className="text-purple-600"/> Concept Map</h3>
                                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                                <MermaidChart chartDefinition={DEMO_DATA.mermaid} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {activeTab === 'tutor' && (
                                    <div className="max-w-xl mx-auto py-4 h-full animate-in fade-in slide-in-from-right-4">
                                       <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Bot size={20}/></div>
                                              <div>
                                                  <h3 className="font-bold text-slate-800">AI Tutor</h3>
                                                  <p className="text-xs text-slate-500">Ask about "Python"</p>
                                              </div>
                                          </div>
                                          
                                          {/* Chat Messages */}
                                          <div className="flex-1 p-6 overflow-y-auto space-y-4" ref={scrollRef}>
                                              {chatMessages.map((msg, i) => (
                                                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                          {msg.role === 'user' ? <User size={14}/> : <Sparkles size={14}/>}
                                                      </div>
                                                      <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                                                          {msg.text}
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>

                                          {/* Input Area */}
                                          <div className="p-4 border-t border-slate-100">
                                              <div className="flex gap-2">
                                                  <input 
                                                      type="text" 
                                                      value={chatInput}
                                                      onChange={(e) => setChatInput(e.target.value)}
                                                      onKeyDown={handleKeyPress}
                                                      placeholder="Ask a question..." 
                                                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-all"
                                                  />
                                                  <button 
                                                      onClick={handleSendMessage}
                                                      disabled={!chatInput.trim()}
                                                      className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                  >
                                                      <Send size={18}/>
                                                  </button>
                                              </div>
                                          </div>
                                       </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
      </section>
    );
};

// --- NEW BENTO GRID FEATURES ---
const FeaturesBentoGrid = ({ t }) => {
    return (
        <section id="features" className="py-32 px-6 bg-slate-950 relative z-10">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{t.titlePart1} <span className="text-indigo-400">{t.titlePart2}</span>.</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">{t.desc}</p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                    
                    {/* Card 1: Smart AI (Large - Top Left) */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                                <Brain size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t.card1Title}</h3>
                            <p className="text-slate-400 max-w-md text-sm">{t.card1Desc}</p>
                        </div>
                    </motion.div>

                    {/* Card 2: Weakness Detect (Tall - Top Right Spanning 2 Rows) */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-1 md:row-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group flex flex-col"
                    >
                        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mb-6 border border-red-500/20">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{t.card2Title}</h3>
                        <p className="text-slate-400 text-sm mb-auto">{t.card2Desc}</p>
                        {/* Visual graphic for chart */}
                        <div className="w-full h-40 flex items-end justify-center gap-3 px-4 pb-4 opacity-50 group-hover:opacity-80 transition-opacity mt-6">
                            <div className="w-full bg-slate-800 rounded-t-md relative h-full">
                                 <div className="absolute bottom-0 left-2 w-4 h-[40%] bg-slate-700 rounded-t-sm"></div>
                                 <div className="absolute bottom-0 left-8 w-4 h-[70%] bg-indigo-600 rounded-t-sm"></div>
                                 <div className="absolute bottom-0 left-14 w-4 h-[50%] bg-slate-700 rounded-t-sm"></div>
                                 <div className="absolute bottom-0 left-20 w-4 h-[85%] bg-red-500 rounded-t-sm"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Concept Maps (Medium - Bottom Left) */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-1 md:row-span-1 bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group"
                    >
                         <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-4 border border-green-500/20">
                                <Network size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{t.card3Title}</h3>
                            <p className="text-slate-400 text-sm">{t.card3Desc}</p>
                        </div>
                    </motion.div>

                    {/* Card 4: AI Tutor (Medium - Bottom Middle) */}
                     <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-1 md:row-span-1 bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{t.card5Title}</h3>
                            <p className="text-slate-400 text-sm">{t.card5Desc}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --- BENEFITS SECTION (PREMIUM REDESIGN) ---
const BenefitsSection = ({ t }) => {
  return (
    <section id="benefits" className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal>
            <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Crown size={14} /> {t.badge}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">{t.title}</h2>
            </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          <BenefitCard 
            icon={<Save size={28}/>}
            title={t.b1Title}
            desc={t.b1Desc}
            color="from-blue-500 to-cyan-400"
            delay={0.1}
          />
          <BenefitCard 
            icon={<History size={28}/>}
            title={t.b2Title}
            desc={t.b2Desc}
            color="from-emerald-500 to-teal-400"
            delay={0.2}
          />
          <BenefitCard 
            icon={<RefreshCw size={28}/>}
            title={t.b3Title}
            desc={t.b3Desc}
            color="from-orange-500 to-amber-400"
            delay={0.3}
          />
          <BenefitCard 
            icon={<Smartphone size={28}/>}
            title={t.b4Title}
            desc={t.b4Desc}
            color="from-pink-500 to-rose-400"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

const BenefitCard = ({ icon, title, desc, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="relative group p-1 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 transition-all duration-300"
  >
    {/* Gradient Border Effect */}
    <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`}></div>
    
    <div className="h-full bg-slate-950/90 backdrop-blur-xl p-8 rounded-[1.9rem] border border-white/5 flex items-start gap-6 relative overflow-hidden">
        {/* Glow behind icon */}
        <div className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${color} opacity-20 blur-3xl rounded-full`}></div>
        
        <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${color} p-0.5 shadow-lg`}>
            <div className="w-full h-full bg-slate-950 rounded-[0.9rem] flex items-center justify-center">
                <div className={`bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
                    {icon}
                </div>
            </div>
        </div>
        
        <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{title}</h3>
            <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
  </motion.div>
);

const CtaSection = ({ onGetStarted, t }) => (
    <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">{t.title}</h2>
            <button onClick={onGetStarted} className="px-12 py-6 bg-white text-slate-950 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl shadow-white/10">{t.btn}</button>
        </div>
    </section>
);

const Footer = () => (<footer className="py-8 border-t border-slate-900 text-center text-slate-600 text-sm"><p>&copy; 2025 StudyHelper.ai.</p></footer>);

const ScrollReveal = ({ children, className, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default LandingPage;
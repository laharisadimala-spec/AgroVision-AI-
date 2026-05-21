"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'home': 'Home',
    'scan': 'Scan Crop',
    'chat': 'Ask AI',
    'weather': 'Weather',
    'dashboard': 'Dashboard',
    'settings': 'Settings',
    
    // Upload page
    'error_invalid_image': 'Please upload a valid image file.',
    'error_analysis': 'An error occurred during analysis. Please try again.',
    'scan_title': 'Scan Crop',
    'scan_desc': 'Take a clear photo of the leaf',
    'open_camera': 'Open Camera',
    'choose_gallery': 'Choose from Gallery',
    'analyzing': 'Analyzing...',
    'analyze_now': 'Analyze Crop',

    // Results page
    'back_upload': 'Back to Upload',
    'analysis_complete': 'Analysis Complete',
    'listen_advice': 'Listen',
    'stop_audio': 'Stop',
    'scan_another': 'Scan Another',
    'detected_plant': 'Detected Plant',
    'disease_found': 'Status',
    'severity': 'Severity',
    'confidence': 'Confidence',
    'causes': 'Causes',
    'treatment': 'Treatment',
    'prevention': 'Prevention',
    'advisory': 'Sustainable Advisory',
    'disease': 'Disease',

    // Chat page
    'ai_assistant': 'AI Assistant',
    'ai_desc': 'Voice-enabled farming expert',
    'how_can_i_help': 'How can I help your farm today?',
    'ask_anything': 'Ask about crop diseases, fertilizers, or weather impacts in your language.',
    'q_yellow_leaves': 'Why are my leaves turning yellow?',
    'q_watering': 'How often should I water crops?',
    'q_fertilizer': 'What fertilizer should I use?',
    'q_fungal': 'How to stop fungal disease?',
    'listening': 'Listening...',
    'type_message': 'Ask a farming question...',
    'error_mic_support': 'Microphone not supported in this browser.',
    'error_chat': 'Sorry, I encountered an error. Please try again.',

    // Home page
    'tagline_1': 'Healthy Crops.',
    'tagline_2': 'Smarter Farming.',
    'hero_desc': 'AI-powered crop disease detection and smart farming guidance for sustainable agriculture. In your language.',
    'scan_crop': 'Scan Crop Now',
    'ask_ai': 'Ask AI Assistant',
    'features_title': 'Farm Smarter, Not Harder',
    'f1_title': 'Camera-First AI',
    'f1_desc': 'Instantly scan leaves for diseases in seconds using your mobile camera.',
    'f2_title': 'Your Language',
    'f2_desc': 'Listen to advice in Telugu, Hindi, Tamil, and English with voice output.',
    'f3_title': 'Sustainable Practices',
    'f3_desc': 'Get organic treatment and weather advisories to protect your crops.',
    'ready_transform': 'Ready to transform your farming?'
  },
  hi: {
    'home': 'होम',
    'scan': 'फसल स्कैन करें',
    'chat': 'एआई से पूछें',
    'weather': 'मौसम',
    'dashboard': 'डैशबोर्ड',
    'settings': 'सेटिंग्स',
    
    'error_invalid_image': 'कृपया एक वैध छवि फ़ाइल अपलोड करें।',
    'error_analysis': 'विश्लेषण के दौरान एक त्रुटि हुई। कृपया पुन: प्रयास करें।',
    'scan_title': 'फसल स्कैन करें',
    'scan_desc': 'पत्ते की एक स्पष्ट तस्वीर लें',
    'open_camera': 'कैमरा खोलें',
    'choose_gallery': 'गैलरी से चुनें',
    'analyzing': 'विश्लेषण हो रहा है...',
    'analyze_now': 'फसल का विश्लेषण करें',

    'back_upload': 'अपलोड पर वापस जाएं',
    'analysis_complete': 'विश्लेषण पूरा हुआ',
    'listen_advice': 'सुनें',
    'stop_audio': 'रुकें',
    'scan_another': 'दूसरा स्कैन करें',
    'detected_plant': 'पौधे की पहचान',
    'disease_found': 'स्थिति',
    'severity': 'गंभीरता',
    'confidence': 'विश्वास',
    'causes': 'कारण',
    'treatment': 'उपचार',
    'prevention': 'रोकथाम',
    'advisory': 'सलाह',
    'disease': 'बीमारी',

    'ai_assistant': 'एआई सहायक',
    'ai_desc': 'वॉयस-सक्षम खेती विशेषज्ञ',
    'how_can_i_help': 'आज मैं आपके खेत की क्या मदद कर सकता हूँ?',
    'ask_anything': 'अपनी भाषा में फसल की बीमारियों, उर्वरकों, या मौसम के बारे में पूछें।',
    'q_yellow_leaves': 'मेरे पत्ते पीले क्यों हो रहे हैं?',
    'q_watering': 'मुझे फसलों को कितनी बार पानी देना चाहिए?',
    'q_fertilizer': 'मुझे किस उर्वरक का उपयोग करना चाहिए?',
    'q_fungal': 'फफूंद रोग को कैसे रोकें?',
    'listening': 'सुन रहा हूँ...',
    'type_message': 'खेती का प्रश्न पूछें...',
    'error_mic_support': 'इस ब्राउज़र में माइक्रोफ़ोन समर्थित नहीं है।',
    'error_chat': 'क्षमा करें, मुझे एक त्रुटि मिली। कृपया पुन: प्रयास करें।',

    'tagline_1': 'स्वस्थ फसलें।',
    'tagline_2': 'स्मार्ट खेती।',
    'hero_desc': 'आपकी भाषा में टिकाऊ कृषि के लिए एआई-संचालित फसल रोग का पता लगाना और स्मार्ट खेती मार्गदर्शन।',
    'scan_crop': 'अभी फसल स्कैन करें',
    'ask_ai': 'एआई सहायक से पूछें',
    'features_title': 'स्मार्ट खेती करें',
    'f1_title': 'कैमरा-प्रथम एआई',
    'f1_desc': 'अपने मोबाइल कैमरे का उपयोग करके सेकंडों में बीमारियों के लिए पत्तियों को स्कैन करें।',
    'f2_title': 'आपकी भाषा',
    'f2_desc': 'वॉयस आउटपुट के साथ तेलुगु, हिंदी, तमिल और अंग्रेजी में सलाह सुनें।',
    'f3_title': 'टिकाऊ प्रथाएं',
    'f3_desc': 'अपनी फसलों की रक्षा के लिए जैविक उपचार और मौसम संबंधी सलाह लें।',
    'ready_transform': 'क्या आप अपनी खेती को बदलने के लिए तैयार हैं?'
  },
  te: {
    'home': 'హోమ్',
    'scan': 'పంటను స్కాన్ చేయండి',
    'chat': 'AI ని అడగండి',
    'weather': 'వాతావరణం',
    'dashboard': 'డాష్‌బోర్డ్',
    'settings': 'సెట్టింగులు',
    
    'error_invalid_image': 'దయచేసి చెల్లుబాటు అయ్యే చిత్ర ఫైల్‌ను అప్‌లోడ్ చేయండి.',
    'error_analysis': 'విశ్లేషణ సమయంలో లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    'scan_title': 'పంటను స్కాన్ చేయండి',
    'scan_desc': 'ఆకు యొక్క స్పష్టమైన ఫోటో తీయండి',
    'open_camera': 'కెమెరాను తెరవండి',
    'choose_gallery': 'గ్యాలరీ నుండి ఎంచుకోండి',
    'analyzing': 'విశ్లేషిస్తోంది...',
    'analyze_now': 'పంటను విశ్లేషించండి',

    'back_upload': 'అప్‌లోడ్‌కు తిరిగి వెళ్లండి',
    'analysis_complete': 'విశ్లేషణ పూర్తయింది',
    'listen_advice': 'వినండి',
    'stop_audio': 'ఆపు',
    'scan_another': 'మరొకటి స్కాన్ చేయండి',
    'detected_plant': 'గుర్తించబడిన మొక్క',
    'disease_found': 'స్థితి',
    'severity': 'తీవ్రత',
    'confidence': 'నమ్మకం',
    'causes': 'కారణాలు',
    'treatment': 'చికిత్స',
    'prevention': 'నివారణ',
    'advisory': 'సలహా',
    'disease': 'వ్యాధి',

    'ai_assistant': 'AI సహాయకుడు',
    'ai_desc': 'వాయిస్-ప్రారంభించబడిన వ్యవసాయ నిపుణుడు',
    'how_can_i_help': 'ఈ రోజు మీ పొలానికి నేను ఎలా సహాయం చేయగలను?',
    'ask_anything': 'మీ భాషలో పంట వ్యాధులు, ఎరువులు లేదా వాతావరణం గురించి అడగండి.',
    'q_yellow_leaves': 'నా ఆకులు ఎందుకు పసుపు రంగులోకి మారుతున్నాయి?',
    'q_watering': 'నేను పంటలకు ఎంత తరచుగా నీరు పెట్టాలి?',
    'q_fertilizer': 'నేను ఏ ఎరువు వాడాలి?',
    'q_fungal': 'ఫంగల్ వ్యాధిని ఎలా ఆపాలి?',
    'listening': 'వింటున్నాను...',
    'type_message': 'వ్యవసాయ ప్రశ్న అడగండి...',
    'error_mic_support': 'ఈ బ్రౌజర్‌లో మైక్రోఫోన్ మద్దతు లేదు.',
    'error_chat': 'క్షమించండి, నాకు ఒక లోపం ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',

    'tagline_1': 'ఆరోగ్యకరమైన పంటలు.',
    'tagline_2': 'స్మార్ట్ వ్యవసాయం.',
    'hero_desc': 'మీ భాషలో స్థిరమైన వ్యవసాయం కోసం AI-శక్తితో కూడిన పంట వ్యాధి గుర్తింపు మరియు స్మార్ట్ వ్యవసాయ మార్గదర్శకత్వం.',
    'scan_crop': 'ఇప్పుడే పంటను స్కాన్ చేయండి',
    'ask_ai': 'AI ని అడగండి',
    'features_title': 'స్మార్ట్‌గా వ్యవసాయం చేయండి',
    'f1_title': 'కెమెరా-మొదటి AI',
    'f1_desc': 'మీ మొబైల్ కెమెరాను ఉపయోగించి క్షణాల్లో వ్యాధుల కోసం ఆకులను స్కాన్ చేయండి.',
    'f2_title': 'మీ భాష',
    'f2_desc': 'వాయిస్ అవుట్‌పుట్‌తో తెలుగు, హిందీ, తమిళం మరియు ఆంగ్లంలో సలహాలను వినండి.',
    'f3_title': 'స్థిరమైన పద్ధతులు',
    'f3_desc': 'మీ పంటలను రక్షించడానికి సేంద్రీయ చికిత్స మరియు వాతావరణ సలహాలను పొందండి.',
    'ready_transform': 'మీ వ్యవసాయాన్ని మార్చడానికి సిద్ధంగా ఉన్నారా?'
  },
  ta: {
    'home': 'முகப்பு',
    'scan': 'பயிரை ஸ்கேன் செய்',
    'chat': 'AI யிடம் கேள்',
    'weather': 'வானிலை',
    'dashboard': 'டாஷ்போர்டு',
    'settings': 'அமைப்புகள்',
    
    'error_invalid_image': 'சரியான படக் கோப்பை பதிவேற்றவும்.',
    'error_analysis': 'பகுப்பாய்வின் போது பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    'scan_title': 'பயிரை ஸ்கேன் செய்',
    'scan_desc': 'இலையின் தெளிவான புகைப்படம் எடுக்கவும்',
    'open_camera': 'கேமராவைத் திற',
    'choose_gallery': 'கேலரியில் இருந்து தேர்ந்தெடு',
    'analyzing': 'பகுப்பாய்வு செய்யப்படுகிறது...',
    'analyze_now': 'பயிரை பகுப்பாய்வு செய்',

    'back_upload': 'பதிவேற்றத்திற்கு திரும்பு',
    'analysis_complete': 'பகுப்பாய்வு முடிந்தது',
    'listen_advice': 'கேள்',
    'stop_audio': 'நிறுத்து',
    'scan_another': 'மற்றொன்றை ஸ்கேன் செய்',
    'detected_plant': 'கண்டறியப்பட்ட தாவரம்',
    'disease_found': 'நிலை',
    'severity': 'தீவிரம்',
    'confidence': 'நம்பிக்கை',
    'causes': 'காரணங்கள்',
    'treatment': 'சிகிச்சை',
    'prevention': 'தடுப்பு',
    'advisory': 'ஆலோசனை',
    'disease': 'நோய்',

    'ai_assistant': 'AI உதவியாளர்',
    'ai_desc': 'குரல்-இயக்கப்பட்ட விவசாய நிபுணர்',
    'how_can_i_help': 'இன்று உங்கள் பண்ணைக்கு நான் எப்படி உதவ முடியும்?',
    'ask_anything': 'உங்கள் மொழியில் பயிர் நோய்கள், உரங்கள் அல்லது வானிலை பற்றி கேளுங்கள்.',
    'q_yellow_leaves': 'என் இலைகள் ஏன் மஞ்சள் நிறமாக மாறுகின்றன?',
    'q_watering': 'நான் எவ்வளவு அடிக்கடி பயிர்களுக்கு தண்ணீர் பாய்ச்ச வேண்டும்?',
    'q_fertilizer': 'நான் எந்த உரத்தைப் பயன்படுத்த வேண்டும்?',
    'q_fungal': 'பூஞ்சை நோயை எவ்வாறு நிறுத்துவது?',
    'listening': 'கேட்கிறது...',
    'type_message': 'விவசாயக் கேள்வி கேள்...',
    'error_mic_support': 'இந்த உலாவியில் மைக்ரோஃபோன் ஆதரிக்கப்படவில்லை.',
    'error_chat': 'மன்னிக்கவும், எனக்கு ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',

    'tagline_1': 'ஆரோக்கியமான பயிர்கள்.',
    'tagline_2': 'ஸ்மார்ட் விவசாயம்.',
    'hero_desc': 'உங்கள் மொழியில் நிலையான விவசாயத்திற்கான AI-இயங்கும் பயிர் நோய் கண்டறிதல் மற்றும் ஸ்மார்ட் விவசாய வழிகாட்டுதல்.',
    'scan_crop': 'இப்போதே பயிரை ஸ்கேன் செய்',
    'ask_ai': 'AI உதவியாளரிடம் கேள்',
    'features_title': 'ஸ்மார்ட் விவசாயம் செய்',
    'f1_title': 'கேமரா-முதல் AI',
    'f1_desc': 'உங்கள் மொபைல் கேமராவைப் பயன்படுத்தி சில வினாடிகளில் நோய்களுக்காக இலைகளை ஸ்கேன் செய்யுங்கள்.',
    'f2_title': 'உங்கள் மொழி',
    'f2_desc': 'குரல் வெளியீட்டுடன் தெலுங்கு, இந்தி, தமிழ் மற்றும் ஆங்கிலத்தில் ஆலோசனைகளைக் கேளுங்கள்.',
    'f3_title': 'நிலையான நடைமுறைகள்',
    'f3_desc': 'உங்கள் பயிர்களைப் பாதுகாக்க கரிம சிகிச்சை மற்றும் வானிலை ஆலோசனைகளைப் பெறுங்கள்.',
    'ready_transform': 'உங்கள் விவசாயத்தை மாற்ற தயாரா?'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('agro-language') as Language;
    if (saved && ['en', 'hi', 'te', 'ta'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agro-language', lang);
  };

  const translate = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

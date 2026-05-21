import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history, lang = 'en' } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const languageMap: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'te': 'Telugu',
      'ta': 'Tamil'
    };
    const targetLang = languageMap[lang] || 'English';

    const systemInstruction = `
      You are AgroVision AI, a friendly, expert, and beginner-friendly agricultural assistant. 
      Respond to the user's farming-related question. Keep answers concise, actionable, and easy to understand for farmers of all experience levels.
      If asked something completely unrelated to farming, agriculture, plants, weather, or crops, politely guide the conversation back to agriculture.
      CRITICAL: You must translate and provide your final response in this exact language: ${targetLang}.
    `;

    // Ensure history roles are correct
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts || [{ text: msg.content || '' }]
    }));

    const model = getGeminiModel('gemini-2.5-flash');

    const chatSession = model.startChat({
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(`${systemInstruction}\n\nUser: ${message}`);
    const responseText = result.response.text();

    return NextResponse.json({
      message: responseText,
      role: 'model'
    });

  } catch (error: any) {
    console.error('Error in chat API:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

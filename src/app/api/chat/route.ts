import { NextResponse } from 'next/server';
import { getGeminiModel, withGeminiRetry, isQuotaError } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const { message, history, lang = 'en' } = body as {
      message: string;
      history?: { role: string; parts?: { text: string }[]; content?: string }[];
      lang?: string;
    };

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const languageMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      te: 'Telugu',
      ta: 'Tamil',
    };
    const targetLang = languageMap[lang] || 'English';

    const systemInstruction = `
      You are AgroVision AI, a friendly, expert, and beginner-friendly agricultural assistant.
      Respond to the user's farming-related question. Keep answers concise, actionable, and easy to understand for farmers of all experience levels.
      If asked something completely unrelated to farming, agriculture, plants, weather, or crops, politely guide the conversation back to agriculture.
      CRITICAL: You must translate and provide your final response in this exact language: ${targetLang}.
    `;

    // Sanitise history — ensure roles and parts are valid
    const formattedHistory = (history ?? [])
      .filter((msg) => msg && (msg.parts?.[0]?.text || msg.content))
      .map((msg) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts ?? [{ text: msg.content ?? '' }],
      }));

    const model = getGeminiModel('gemini-2.5-flash');

    const result = await withGeminiRetry(() => {
      const chatSession = model.startChat({ history: formattedHistory });
      return chatSession.sendMessage(`${systemInstruction}\n\nUser: ${message}`);
    });

    const responseText = result.response.text();

    if (!responseText || responseText.trim() === '') {
      return NextResponse.json(
        { error: 'AI service is currently busy. Please try again shortly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: responseText, role: 'model' });
  } catch (error: unknown) {
    const message = (error as any)?.message ?? String(error);
    console.error('[chat] Error processing request:', message);

    if (isQuotaError(error)) {
      return NextResponse.json(
        { error: 'AI service is currently busy. Please try again shortly.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'AI service is currently busy. Please try again shortly.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getGeminiModel, withGeminiRetry, isQuotaError } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.image) {
      return NextResponse.json(
        { error: 'Image is required in base64 format' },
        { status: 400 }
      );
    }

    const { image, lang = 'en' } = body as { image: string; lang?: string };

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid image format. Please upload a valid image.' },
        { status: 400 }
      );
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const languageMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      te: 'Telugu',
      ta: 'Tamil',
    };
    const targetLang = languageMap[lang] || 'English';

    const prompt = `
      You are an expert agricultural AI assistant. Analyze this crop image and return a JSON object with the following structure exactly.
      Translate all your responses to the language: ${targetLang}.
      Ensure explanations are farmer-friendly and easy to understand.
      {
        "plant": "name of the plant",
        "disease": "name of the disease or 'Healthy' if none",
        "confidence": "number between 0-100",
        "severity": "Low | Moderate | High | Severe | None",
        "causes": ["cause 1", "cause 2"],
        "treatment": ["treatment 1", "treatment 2"],
        "prevention": ["tip 1", "tip 2"],
        "advisory": "one clear sentence of sustainable farming advice",
        "timeline": [
          { "time": "Today", "action": "action to take today" },
          { "time": "Tomorrow", "action": "action to take tomorrow" },
          { "time": "In 3 Days", "action": "action to take in 3 days" }
        ]
      }
    `;

    const model = getGeminiModel('gemini-2.5-flash');

    const result = await withGeminiRetry(() =>
      model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { data: base64Data, mimeType: mimeType } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      })
    );

    const responseText = result.response.text();

    let analysisData: unknown;
    try {
      analysisData = JSON.parse(responseText);
    } catch {
      // Fallback: extract JSON block if the model wrapped the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisData = JSON.parse(jsonMatch[0]);
        } catch {
          console.error('[analyze] Failed to parse extracted JSON block:', jsonMatch[0]);
          return NextResponse.json(
            { error: 'AI returned an unexpected response. Please try again.' },
            { status: 502 }
          );
        }
      } else {
        console.error('[analyze] No JSON found in Gemini response:', responseText);
        return NextResponse.json(
          { error: 'AI returned an unexpected response. Please try again.' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(analysisData);
  } catch (error: unknown) {
    const message = (error as any)?.message ?? String(error);
    console.error('[analyze] Error analyzing image:', message);

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

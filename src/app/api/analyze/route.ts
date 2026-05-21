import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { image, lang = 'en' } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required in base64 format' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid base64 image string' }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const model = getGeminiModel('gemini-2.5-flash');

    const languageMap: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'te': 'Telugu',
      'ta': 'Tamil'
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

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { data: base64Data, mimeType: mimeType } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const responseText = result.response.text();
    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
      return NextResponse.json(analysisData);
    } catch (parseError) {
      console.error('Failed to parse Gemini response directly:', responseText);
      // Fallback regex if somehow response is wrapped
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
        return NextResponse.json(analysisData);
      }
      throw new Error('Failed to extract JSON from response');
    }

  } catch (error: any) {
    console.error('Error analyzing image:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to analyze crop image' },
      { status: 500 }
    );
  }
}

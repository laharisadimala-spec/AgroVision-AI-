export interface AnalysisResponse {
  plantName: string;
  diseaseDetected: string;
  confidencePercentage: number;
  severityLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'None';
  causes: string[];
  treatmentRecommendations: string[];
  preventionTips: string[];
  sustainableAdvice: string;
}

export interface WeatherResponse {
  temperature: number;
  humidity: number;
  rainPrediction: number;
  windSpeed: number;
  advisory: {
    message: string;
    type: 'success' | 'warning' | 'danger' | 'info';
  };
}

export interface ChatRequest {
  message: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

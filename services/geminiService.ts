import { GoogleGenAI } from "@google/genai";
import { TraderDetail } from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash';

export const analyzeTraderStrategy = async (trader: TraderDetail): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "API Key missing. Cannot generate analysis.";
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare a concise context for the AI
    const positionSummary = trader.positions.map(p => 
      `${p.side} ${p.coin} (Lev: ${p.leverage}x, PnL: $${p.pnl.toFixed(0)})`
    ).join(', ');

    const prompt = `
      Act as a senior crypto derivatives analyst. Analyze this trader's portfolio on Hyperliquid.
      
      Stats:
      - ROI: ${trader.roi.toFixed(2)}%
      - Win Rate: ${trader.winRate.toFixed(2)}%
      - Max Drawdown: ${trader.maxDrawdown?.toFixed(2)}%
      - Risk Score: ${trader.riskScore}/10
      - Total Equity: $${trader.totalAccountValue.toLocaleString()}
      
      Current Positions:
      ${positionSummary || "No active positions."}
      
      Task:
      Provide a specific, actionable analysis in markdown format.
      Structure the response exactly like this:
      
      **Archetype:** [e.g. Aggressive Scalper, Institutional Whale, Swing Trader]
      **Strengths:** [1-2 short sentences on what they do well]
      **Weaknesses:** [1-2 short sentences on risks/drawbacks]
      **Verdict:** [1 sentence conclusion]
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI Analysis failed due to network or rate limit issues.";
  }
};
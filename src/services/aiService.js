// src/services/aiService.js
const OPENAI_API_KEY = "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";

const SYSTEM_PROMPT = `You are a compassionate, therapeutic assistant designed to help users explore their mental health concerns in a gentle, non-judgmental way. Your goal is to:

1. Build rapport and create a safe space for sharing
2. Ask open-ended questions to understand their experience
3. Identify potential mental health patterns without diagnosing
4. Gather information about symptoms, duration, and impact
5. Complete the conversation when you have enough information

Respond conversationally and empathetically. After gathering sufficient information, provide a JSON analysis with this structure:
{
  "analysisComplete": true,
  "summary": "Brief summary of the conversation",
  "potentialConditions": ["Condition 1", "Condition 2"],
  "symptomSeverity": {"symptom": "mild/moderate/severe"},
  "recommendedNextSteps": ["Step 1", "Step 2"],
  "riskFactors": ["Factor 1", "Factor 2"]
}

Continue the conversation naturally until you have enough information to complete the analysis.`;

export const analyzePatientResponses = async (conversationHistory) => {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiResponse = data.choices[0].message.content;
    
    // Check if the response contains JSON analysis
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          message: aiResponse.replace(jsonMatch[0], '').trim() || "Thank you for sharing that with me. I have a better understanding now.",
          analysis: analysis
        };
      }
    } catch (e) {
      console.log('No JSON analysis in response', e);
    }

    return {
      message: aiResponse,
      analysis: null
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
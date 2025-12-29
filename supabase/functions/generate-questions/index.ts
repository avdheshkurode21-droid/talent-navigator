import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, candidateName } = await req.json();
    const AZURE_OPENAI_API_KEY = Deno.env.get("AZURE_OPENAI_API_KEY");
    const AZURE_OPENAI_ENDPOINT = Deno.env.get("AZURE_OPENAI_ENDPOINT");
    const AZURE_OPENAI_DEPLOYMENT_NAME = Deno.env.get("AZURE_OPENAI_DEPLOYMENT_NAME");
    
    if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error("Azure OpenAI credentials are not configured");
    }

    const systemPrompt = `You are an expert HR interviewer and assessment specialist. Generate exactly 5 interview questions for a candidate applying for a ${domain} position.

Requirements:
- Questions should be relevant to the ${domain} field
- Mix of technical and behavioral questions
- Progressive difficulty (start easier, end harder)
- Questions should assess both knowledge and problem-solving ability
- Each question should be clear and professional

Return ONLY a JSON array of 5 question strings, no other text.
Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    const apiUrl = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 5 interview questions for ${candidateName} applying for the ${domain} position.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Azure OpenAI error:", response.status, errorText);
      throw new Error("Azure OpenAI error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON array from the response
    let questions: string[];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found");
      }
    } catch (parseError) {
      console.error("Failed to parse questions:", parseError, content);
      // Fallback questions
      questions = [
        `Tell us about your experience in ${domain}.`,
        `What are the key skills needed for success in ${domain}?`,
        `Describe a challenging project you've worked on.`,
        `How do you stay updated with industry trends?`,
        `Where do you see yourself in 5 years?`
      ];
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-questions error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

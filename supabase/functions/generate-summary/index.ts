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
    const { candidateName, domain, responses, averageScore } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const responseSummary = responses.map((r: any, i: number) => 
      `Q${i + 1}: ${r.question}\nAnswer: ${r.answer}\nScore: ${r.score}/100`
    ).join("\n\n");

    const systemPrompt = `You are an HR assessment expert. Based on the interview responses, provide a professional evaluation summary.

Candidate: ${candidateName}
Position: ${domain}
Average Score: ${averageScore}%

Interview Responses:
${responseSummary}

Return ONLY a JSON object with this exact format:
{
  "recommendation": "recommended" or "not_recommended",
  "summary": "<2-3 sentence professional summary of the candidate's performance and recommendation reasoning>"
}

Use "recommended" if average score >= 65, otherwise "not_recommended".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the final assessment summary and recommendation." }
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
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON from the response
    let result: { recommendation: string; summary: string };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON object found");
      }
    } catch (parseError) {
      console.error("Failed to parse summary:", parseError, content);
      // Fallback result
      result = {
        recommendation: averageScore >= 65 ? "recommended" : "not_recommended",
        summary: `${candidateName} achieved an average score of ${averageScore}% in the ${domain} assessment. ${averageScore >= 65 ? "The candidate demonstrated satisfactory performance and is recommended for further consideration." : "The candidate may require additional training or experience before proceeding."}`
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-summary error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

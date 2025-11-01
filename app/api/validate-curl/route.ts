import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { curlCommand } = await request.json()

    if (!curlCommand) {
      return NextResponse.json({ error: "No curl command provided" }, { status: 400 })
    }

    const groqApiKey = process.env.API_KEY_GROQ_API_KEY

    if (!groqApiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `You are an expert cURL command validator. Analyze this curl command and identify any issues:

curl command: ${curlCommand}

You must respond with ONLY a valid JSON object, no markdown formatting, no code blocks, no backticks. Just the raw JSON object with this exact structure:
{
  "isValid": true or false,
  "issues": ["array of issue strings, empty if none"],
  "suggestedFix": "corrected curl command string or null if valid",
  "explanation": "brief explanation string"
}

Be strict about syntax, headers, URL format, and API best practices.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Groq API error:", error)
      return NextResponse.json(
        { error: "Failed to validate curl command", details: error },
        { status: response.status },
      )
    }

    const data = await response.json()
    let content = data.choices[0].message.content

    try {
      // Clean up the response - remove markdown code blocks if present
      content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      
      const result = JSON.parse(content)
      return NextResponse.json(result)
    } catch (parseError) {
      console.error("[v0] Failed to parse JSON:", content)
      return NextResponse.json({
        isValid: false,
        issues: ["Unable to parse validation response"],
        explanation: content,
      })
    }
  } catch (error) {
    console.error("[v0] Error validating curl:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(req) {
    try {
        const { raw, platform } = await req.json();
        const apiKey = process.env.XAI_API_KEY;

        if (!apiKey) {
            return Response.json({ error: "Missing XAI_API_KEY environment variable" }, { status: 500 });
        }

        const systemPrompt = "You are a System Prompt optimization specialist. Below is a set of user preferences that were generated from slider inputs. Your job is to synthesize these into a polished, cohesive set of Custom Instructions that an AI should follow.\n\nRules:\n- Do NOT just restate the inputs. BLEND them into a natural, unified voice description.\n- Where settings create tension (e.g., blunt + analogies), resolve it creatively.\n- Use strong, specific behavioral verbs (\"always lead with...\", \"never pad with...\").\n- Define HOW the AI should behave, not WHAT the AI is. No role declarations (\"you are my...\"), relationship framing, or identity statements. Write behavioral rules that work across any type of conversation.\n- Output ONLY the final instructions block in Markdown. No preamble, no explanation.\n- Keep it under 200 words. Dense and usable.";

        const userMessage = `Target platform: ${platform === "claude" ? "Claude (Anthropic)" : platform === "chatgpt" ? "ChatGPT (OpenAI)" : platform === "gemini" ? "Gemini (Google)" : platform === "grok" ? "Grok (xAI)" : "Generic AI assistant"}\n\nRaw preferences:\n\n${raw}`;

        const resp = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "grok-4-fast-reasoning",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 1000,
            })
        });

        const data = await resp.json();

        if (!resp.ok || data.error) {
            const errMsg = data.error?.message || JSON.stringify(data);
            console.error("xAI API error:", errMsg);
            return Response.json({ error: errMsg }, { status: 500 });
        }

        let text = data.choices?.[0]?.message?.content || "Error generating prompt. Connection failed.";

        if (platform === "chatgpt" && !text.startsWith("#")) {
            text = `# Custom Instructions\n\n${text}`;
        } else if (platform !== "claude" && platform !== "chatgpt" && !text.startsWith("#")) {
            text = `# System Prompt\n\n${text}`;
        }

        return Response.json({ text });

    } catch (error) {
        console.error("API error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJson(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in LLM response");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function validateLayoutJson(json) {
  if (!json.rootNodes || !Array.isArray(json.rootNodes)) {
    throw new Error("Invalid JSON: rootNodes missing");
  }

  if (!json.nodes || typeof json.nodes !== "object") {
    throw new Error("Invalid JSON: nodes missing");
  }

  const artboardId = json.rootNodes[0];

  if (!json.nodes[artboardId]) {
    throw new Error("Invalid JSON: artboard node missing");
  }

  return true;
}

export const getUpdatedLayoutFromLLM = async (instruction, currentJson) => {
  const prompt = `
You are a layout JSON transformation agent.

Return ONLY valid JSON.
No markdown.
No explanation.
Do not wrap JSON inside another object.

Top-level JSON must be:
{
  "rootNodes": [],
  "imageUrl": "",
  "nodes": {}
}

Rules:
- Modify the given layout JSON based on user instruction.
- Preserve all node IDs.
- Preserve image URLs.
- Only update x, y, width, height, nx, ny, nw, nh, fontSize, fontSizeRatio, artboard width, artboard height.
- If converting to 9:16, set artboard width to 1080 and height to 1920.
- Do not delete nodes.

Semantic mapping:
headline = text_1778486306230_8
subheadline = text_1778486136643_7
bottom offer = text_1778486004640_6
social proof = text_1778486552508_9
offer badge circle = circle_1778488914968_15
offer badge text = text_1778489078397_16
product image = img_1778489515746_17
artboard = artboard_1778485662755_3

User instruction:
${instruction}

Current JSON:
${JSON.stringify(currentJson, null, 2)}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a JSON layout editor. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  const rawText = completion.choices[0].message.content;

  console.log("RAW LLM RESPONSE:", rawText);

  const jsonText = extractJson(rawText);
  const updatedJson = JSON.parse(jsonText);

  validateLayoutJson(updatedJson);

  return {
    updatedJson,
    explanation: `Done. I updated the layout based on: "${instruction}"`,
  };
};
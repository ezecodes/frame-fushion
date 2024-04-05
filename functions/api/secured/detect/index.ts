import {Ai} from "@cloudflare/ai"

interface Env {
  AI: any
}

export async function onRequestGet<Env>(context: any) {
  const ai = new Ai(context.env.AI);
  const input = { prompt: "What is the origin of the phrase Hello, World" }
  const answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', input)
  return Response.json(answer);
}
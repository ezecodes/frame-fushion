import {Ai} from "@cloudflare/ai"

interface Env {
  AI: any
}

export async function onRequestGet<Env>(context: any) {
  const ai = new Ai(context.env.AI);
  try {
    const {image} = context.params
    if (!image) {
      return new Response('Invalid image path', { status: 400 })
    }
    const res = await fetch(`https://res.cloudinary.com/duqny6afm/image/upload/v1712279525/beyonglense/${image}`)
    const blob = await res.arrayBuffer();
    const inputs = {
      image: [...new Uint8Array(blob)],
    };

    const response = await ai.run(
      "@cf/facebook/detr-resnet-50",
      inputs
    );
    return new Response(JSON.stringify({ response }));
  } catch (err) {
    console.log(err)
    return new Response("Something went wrong", {status: 500});
  }
  

}
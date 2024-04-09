import {Ai} from "@cloudflare/ai"

interface Env {
  AI: any
}
async function streamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let chunk;

  while (!(chunk = await reader.read()).done) {
    result += decoder.decode(chunk.value, { stream: true });
  }

  // Decode remaining bytes in the stream, if any
  result += decoder.decode();

  return result;
}
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return byteArray
  // return new Blob([byteArray], { type: contentType });
}
export async function onRequestPost<Env>(context: any) {
  const ai = new Ai(context.env.AI);
  try {
    // const blob = await streamToBlob(context.request.body);

    const string = await streamToString(context.request.body)
    const parseBody = JSON.parse(string)
    const blob = dataURLtoBlob(parseBody.imageDataURL);

    const imageDescription = await describeImage(blob, ai)

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

    return new Response(JSON.stringify({
      summary: imageDescription.summary,
      text: imageDescription.text,
      classified: imageDescription.classified,
      timeCaptured: new Date()
    }), {
      headers: responseHeaders
    });
  } catch (err) {
    console.error(err)
    return new Response("Could not parse image", {status: 400})
  }
    
}


async function describeImage(blob, ai) {
  const inputs = {
    image: [...new Uint8Array(blob)],
    prompt: "Given the image below, describe its content in detail, including objects, scenes, and any relevant context. Be as descriptive as possible, and imagine you're explaining the image to someone who can't see it. Use complete sentences and natural language"
  };

  // Image description
  const describe = await ai.run(
    "@cf/unum/uform-gen2-qwen-500m",
    inputs
  );

  // Text classification
  const classifyDescription = await ai.run(
    "@cf/huggingface/distilbert-sst-2-int8",
    {
      text: describe.description,
    }
  );

  // Summerize text
  const summerized = await ai.run(
    "@cf/facebook/bart-large-cnn",
    {
      input_text: describe.description,
    }
  );

  return {
    summary: summerized.summary,
    text: describe.description,
    classified: classifyDescription,
  }
}

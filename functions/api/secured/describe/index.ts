import {Ai} from "@cloudflare/ai"

interface Env {
  AI: any
}

const MODELS = {
  ImageToText: "@cf/unum/uform-gen2-qwen-500m",
  TextClassification: "@cf/huggingface/distilbert-sst-2-int8",
  ObjectDetection: "@cf/facebook/detr-resnet-50"
}
async function streamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let chunk;

  while (!(chunk = await reader.read()).done) {
    result += decoder.decode(chunk.value, { stream: true });
  }

  result += decoder.decode();

  return result;
}
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return byteArray
}
export async function onRequestPost<Env>(context: any) {
  const BASE_API = `https://api.cloudflare.com/client/v4/accounts/${context.env.ACCOUNT_ID}/ai/run`
  const ai = new Ai(context.env.AI);

  const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
  try {
    const string = await streamToString(context.request.body)
    const parseBody = JSON.parse(string)
    const blob = dataURLtoBlob(parseBody.imageDataURL);
    const snapshotId = parseBody.snapshotId

    const objectDection = await fetch(`${BASE_API}/${MODELS.ObjectDetection}`, {
      method: 'POST',
      body: JSON.stringify({
        image: [...new Uint8Array(blob)],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.env.API_TOKEN}`
      }
    })
    const objectDectionRes = await objectDection.json()
    const personLabels = objectDectionRes.result.filter(i => i.label === "person" && i.score > 0.5)
    if (personLabels.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        data: {
          snapshotId
        }
      }), {
        headers: responseHeaders
      });
    }

    const imageToText = await fetch(`${BASE_API}/${MODELS.ImageToText}`, {
      method: 'POST',
      body: JSON.stringify({
        image: [...new Uint8Array(blob)],
        prompt: "Given the image below, describe its content in summary, including objects, scenes, and any relevant context. Imagine you're explaining the image to someone who can't see it. Use complete sentences and natural language"
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.env.API_TOKEN}`
      }
    });
    const imageToTextRes = await imageToText.json()

    const textClassification = await fetch(`${BASE_API}/${MODELS.TextClassification}`, {
      method: "POST",
      body: JSON.stringify({
        text: imageToTextRes.result.description,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.env.API_TOKEN}`
      }
    })
    const textClassificationRes = await textClassification.json()
    const filtered = textClassificationRes.result.filter(i => {
      const positiveScore = textClassificationRes.result.find(i => i.label === "POSITIVE").score
      const negativeScore = textClassificationRes.result.find(i => i.label === "NEGATIVE").score

      const posDiff = positiveScore - negativeScore
      const negDiff = negativeScore - positiveScore

      if (negDiff > posDiff) return i
    })
    console.log(textClassificationRes)
    console.log(filtered)
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        snapshotId,
        summary: imageToTextRes.result.description,
        classified: textClassificationRes.result,
      }
      
    }), {
      headers: responseHeaders
    });
  } catch (err) {
    console.error(err)
    return new Response("Could not parse image", {status: 400})
  }
    
}


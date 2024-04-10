import { dataURLtoBlob, streamToString } from "../../../utils"

export async function onRequestPost<Env>(context: any) {
  const string = await streamToString(context.request.body)
  const jsonBody = JSON.parse(string)

  const blob = dataURLtoBlob(jsonBody.imageDataURL);
  console.log(blob)
  try {
    const des = await fetch('https://api.cloudflare.com/client/v4/accounts/1369d430bc2a9faae8085571fe0f4dde/ai/run/@cf/facebook/detr-resnet-50', {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: `Bearer L8ECj2Aq0V_9dnZ1q6YvaLs2s79BUDS1jDomK8rz`
      }
    })
    let res = await des.json()
    console.log(res)
    return new Response("hellp", {status: 200})
  } catch (err) {
    console.error(err)
  }
}


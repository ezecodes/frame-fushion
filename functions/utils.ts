function dataURLtoBlob(dataURL: any) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  // return byteArray
  return new Blob([byteArray], { type: contentType });
}
async function streamToString(stream: any) {
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
export {
  dataURLtoBlob,
  streamToString
}
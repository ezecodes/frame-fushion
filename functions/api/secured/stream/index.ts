export async function onRequestGet(context: any) {
	try {
        const cloudinaryUrl = 'https://res.cloudinary.com/duqny6afm/video/upload/v1712368523/beyonglense/Action_Short_Film_-_EXTREME_VENGEANCE_zvbxaz.mp4';
  
	  const videoResponse = await fetch(cloudinaryUrl);
	  
	  if (!videoResponse.ok) {
	    return new Response('Failed to fetch video', { status: 500 });
	  }

	  const responseHeaders = new Headers(videoResponse.headers);
	  responseHeaders.set('Content-Type', 'video/mp4');
	  responseHeaders.set('Access-Control-Allow-Origin', '*');
	  responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
	  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

	  const streamingResponse = new Response(videoResponse.body, {
	    status: videoResponse.status,
	    statusText: videoResponse.statusText,
	    headers: responseHeaders
	  });

	  return streamingResponse;
    } catch (error) {
        console.error('Error:', error);
        return new Response("Something went wrong", 500)
    }
}
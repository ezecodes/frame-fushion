# Frame fushion

## Description
A a web application built with React and cloudflare serverless functions that provides advanced video analysis capabilities. 

## Features
- **Video Upload:** Users can upload videos from their local machine for analysis.
- **Frame Analysis:** The tool analyzes individual frames of the video to extract and synthesize key information.
- **Object Detection:** Detects and tracks objects present in the video frames.
- **Scene Analysis:** Analyzes scenes to identify different environments or settings in the video.
- **Data Visualization:** Provides visualizations of the analysis results for easier interpretation.

## Prerequisites
1. **Node.js:** Ensure that Node.js is installed on your machine.
2. **Cloudflare Account:** Sign up for a Cloudflare account if you don't have one already.
   
## Getting Started
1. **Clone the Repository:**
   `git clone https://github.com/ezecodes/frame-fushion.git`
   cd frame-fushion
2. **Install dependencies**
   `npm install`
3. **Wrangler.toml**
   Append the following bindings to your `wrangler.toml` file
# wrangler.toml
`name =`

`pages_build_output_dir =`

`compatibility_date =`

`compatibility_flags = ["nodejs_compat"]`

`[ai]`

`binding = "AI"`

`[[d1_databases]]`

`binding = // available in your Worker on env.DB`

`database_name =`

`database_id =`

5. **Start the Development Server**
   Run `npm run dev` to start the Vite server
   Run `npm run preview` to start wrangler 
   

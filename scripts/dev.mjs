import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist');const port=Number(process.env.GALLERY_STUDIO_PORT)||8787;
http.createServer(async(req,res)=>{try{let url=new URL(req.url,'http://localhost');let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/gallery-configurator.html';const file=resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+'/'))throw Error();const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.txt':'text/plain; charset=utf-8'}[extname(file)]||'application/octet-stream'));res.setHeader('Cache-Control','no-store');res.end(data);}catch{res.statusCode=404;res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Gallery Studio at http://127.0.0.1:${port} (server only; no browser launched)`));

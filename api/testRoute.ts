import { VercelRequest, VercelResponse } from '@vercel/node';
 
export default function handler(req: VercelRequest, res: VercelResponse) {
  const name = req.query.name ?? 'World';
  res.writeHead(200);
  res.write(`Hello ${name}!`);
  res.end();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'World';
 
  return Response.json({ message: `Hello ${name}!` });
}
const SOURCE = 'https://estimathon.com/static/estimathon-rules.pdf'

export async function GET() {
  const res = await fetch(SOURCE, { cache: 'no-store' })
  if (!res.ok) {
    return new Response('Failed to fetch rules PDF', { status: 502 })
  }
  const buf = await res.arrayBuffer()
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff'
    }
  })
}

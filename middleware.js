/**
 * Strip ?lang=en|pt before the SPA loads.
 * vercel.json redirects re-append the original query even with absolute destinations.
 */
export default function middleware(request) {
  const url = new URL(request.url)
  const lang = url.searchParams.get('lang')
  if (lang !== 'en' && lang !== 'pt') {
    return
  }

  url.searchParams.delete('lang')
  return Response.redirect(url.toString(), 308)
}

export const config = {
  matcher: '/',
}

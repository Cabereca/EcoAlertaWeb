import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/'],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(req: NextRequest, res: NextResponse) {
  return NextResponse.rewrite(new NextURL('/login', req.url));
}

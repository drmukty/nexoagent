import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear every possible cookie name your app might be using
  const possibleNames = ['token', 'session', 'nexo_token', 'jwt', 'auth', 'nexoai_token', 'nexo_session'];

  possibleNames.forEach((cookieName) => {
    response.cookies.set({
      name: cookieName,
      value: '',
      httpOnly: true,
      expires: new Date(0), 
      maxAge: -1,           
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

  return response;
}

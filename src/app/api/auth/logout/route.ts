import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  const possibleNames = ['token', 'session', 'nexo_token', 'jwt', 'auth', 'nexoai_token'];

  possibleNames.forEach((cookieName) => {
    response.cookies.set({
      name: cookieName,
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

  return response;
}

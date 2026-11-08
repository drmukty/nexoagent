import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the token cookie securely
  response.cookies.set({
    name: 'token', // Ensure this matches the cookie name in your auth.ts!
    value: '',
    httpOnly: true,
    expires: new Date(0), // Sets expiration to 1970 so the browser deletes it
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}

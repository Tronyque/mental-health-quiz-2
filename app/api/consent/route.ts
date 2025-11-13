// app/api/consent/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set('mhq-consent', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    httpOnly: true,            // ✅ lisible serveur uniquement
    secure: process.env.NODE_ENV === 'production', // ✅ https only en prod
    sameSite: 'lax',
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('mhq-consent', '', {
    path: '/',
    maxAge: 0,                 // ✅ supprime le cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res;
}

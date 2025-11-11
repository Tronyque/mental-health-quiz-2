import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('mhq-consent', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    httpOnly: false,
    sameSite: 'lax',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('mhq-consent');
  return res;
}

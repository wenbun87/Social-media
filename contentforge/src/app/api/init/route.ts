import { initializeDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

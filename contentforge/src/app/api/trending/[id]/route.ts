import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const body = await request.json();
    const { title, platform, category, engagementScore, velocity, relatedKeywords } = body;
    await db.execute({
      sql: `UPDATE trending_topics SET title = ?, platform = ?, category = ?, engagement_score = ?, velocity = ?, related_keywords = ? WHERE id = ?`,
      args: [title, platform, category || '', engagementScore || 50, velocity || 'rising', JSON.stringify(relatedKeywords || []), id],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initializeDatabase();
    const { id } = await params;
    await db.execute({ sql: 'DELETE FROM trending_topics WHERE id = ?', args: [id] });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

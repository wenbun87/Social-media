import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    const result = await db.execute('SELECT * FROM content_pieces ORDER BY created_at DESC');
    const pieces = result.rows.map((row) => ({
      id: row.id, ideaId: row.idea_id, title: row.title,
      platform: row.platform, format: row.format, content: row.content,
      status: row.status, scheduledDate: row.scheduled_date,
      notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at,
    }));
    return NextResponse.json(pieces);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { id, ideaId, title, platform, format, content, status, scheduledDate, notes, createdAt, updatedAt } = body;
    await db.execute({
      sql: `INSERT INTO content_pieces (id, idea_id, title, platform, format, content, status, scheduled_date, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, ideaId || null, title, platform, format, content || '', status || 'draft', scheduledDate || null, notes || '', createdAt || new Date().toISOString(), updatedAt || new Date().toISOString()],
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const result = await db.execute({ sql: 'SELECT * FROM content_pieces WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const row = result.rows[0];
    return NextResponse.json({
      id: row.id,
      title: row.title,
      platform: row.platform,
      format: row.format,
      content: row.content,
      status: row.status,
      scheduledDate: row.scheduled_date,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const body = await request.json();
    const { title, platform, format, content, status, scheduledDate, notes } = body;
    await db.execute({
      sql: `UPDATE content_pieces SET title = ?, platform = ?, format = ?, content = ?, status = ?, scheduled_date = ?, notes = ?, updated_at = ? WHERE id = ?`,
      args: [
        title,
        platform,
        format,
        content || '',
        status || 'draft',
        scheduledDate || null,
        notes || '',
        new Date().toISOString(),
        id,
      ],
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
    await db.execute({ sql: 'DELETE FROM content_pieces WHERE id = ?', args: [id] });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

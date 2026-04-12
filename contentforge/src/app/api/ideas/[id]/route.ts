import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initializeDatabase();
    const { id } = await params;
    const result = await db.execute({ sql: 'SELECT * FROM ideas WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const row = result.rows[0];
    return NextResponse.json({
      id: row.id, title: row.title, content: row.content,
      tags: JSON.parse(row.tags as string), rating: row.rating,
      platforms: JSON.parse(row.platforms as string), status: row.status,
      createdAt: row.created_at, updatedAt: row.updated_at,
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
    const { title, content, tags, rating, platforms, status } = body;
    await db.execute({
      sql: `UPDATE ideas SET title = ?, content = ?, tags = ?, rating = ?, platforms = ?, status = ?, updated_at = ? WHERE id = ?`,
      args: [title, content || '', JSON.stringify(tags || []), rating || 3, JSON.stringify(platforms || []), status || 'raw', new Date().toISOString(), id],
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
    await db.execute({ sql: 'DELETE FROM ideas WHERE id = ?', args: [id] });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

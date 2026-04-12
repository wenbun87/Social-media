import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    const result = await db.execute('SELECT * FROM ideas ORDER BY created_at DESC');
    const ideas = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      tags: JSON.parse(row.tags as string),
      rating: row.rating,
      platforms: JSON.parse(row.platforms as string),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { id, title, content, tags, rating, platforms, status, createdAt, updatedAt } = body;
    await db.execute({
      sql: `INSERT INTO ideas (id, title, content, tags, rating, platforms, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, content || '', JSON.stringify(tags || []), rating || 3, JSON.stringify(platforms || []), status || 'raw', createdAt || new Date().toISOString(), updatedAt || new Date().toISOString()],
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

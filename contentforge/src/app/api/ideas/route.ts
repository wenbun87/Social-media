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
      format: JSON.parse((row.format as string) || '[]'),
      platforms: JSON.parse((row.platforms as string) || '[]'),
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
    const { id, title, content, format, platforms, createdAt, updatedAt } = body;
    await db.execute({
      sql: `INSERT INTO ideas (id, title, content, format, platforms, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        title,
        content || '',
        JSON.stringify(format || []),
        JSON.stringify(platforms || []),
        createdAt || new Date().toISOString(),
        updatedAt || new Date().toISOString(),
      ],
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

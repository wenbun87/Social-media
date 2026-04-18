import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    const result = await db.execute('SELECT * FROM todos ORDER BY created_at DESC');
    const todos = result.rows.map((row) => ({
      id: row.id,
      text: row.text,
      completed: !!row.completed,
      createdAt: row.created_at,
    }));
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { id, text, completed, createdAt } = body;
    await db.execute({
      sql: `INSERT INTO todos (id, text, completed, created_at) VALUES (?, ?, ?, ?)`,
      args: [
        id,
        text,
        completed ? 1 : 0,
        createdAt || new Date().toISOString(),
      ],
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

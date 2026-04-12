import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    const result = await db.execute('SELECT * FROM trending_topics ORDER BY created_at DESC');
    const topics = result.rows.map((row) => ({
      id: row.id, title: row.title, platform: row.platform,
      category: row.category, engagementScore: row.engagement_score,
      velocity: row.velocity, relatedKeywords: JSON.parse(row.related_keywords as string),
      createdAt: row.created_at,
    }));
    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { id, title, platform, category, engagementScore, velocity, relatedKeywords, createdAt } = body;
    await db.execute({
      sql: `INSERT INTO trending_topics (id, title, platform, category, engagement_score, velocity, related_keywords, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, platform, category || '', engagementScore || 50, velocity || 'rising', JSON.stringify(relatedKeywords || []), createdAt || new Date().toISOString()],
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

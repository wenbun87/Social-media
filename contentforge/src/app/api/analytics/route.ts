import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    const result = await db.execute('SELECT * FROM analytics_entries ORDER BY recorded_at DESC');
    const entries = result.rows.map((row) => ({
      id: row.id, contentPieceId: row.content_piece_id,
      impressions: row.impressions, engagement: row.engagement,
      clicks: row.clicks, shares: row.shares, saves: row.saves,
      comments: row.comments, recordedAt: row.recorded_at,
    }));
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { id, contentPieceId, impressions, engagement, clicks, shares, saves, comments, recordedAt } = body;
    await db.execute({
      sql: `INSERT INTO analytics_entries (id, content_piece_id, impressions, engagement, clicks, shares, saves, comments, recorded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, contentPieceId, impressions || 0, engagement || 0, clicks || 0, shares || 0, saves || 0, comments || 0, recordedAt || new Date().toISOString()],
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

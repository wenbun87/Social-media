import db, { initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    const result = await db.execute('SELECT * FROM voice_profile WHERE id = 1');
    if (result.rows.length === 0) {
      return NextResponse.json({
        tone: [], brandStatement: '', targetAudience: '', niche: [],
        recurringThemes: [], topicsToAvoid: [], sampleContent: '',
      });
    }
    const row = result.rows[0];
    return NextResponse.json({
      tone: JSON.parse(row.tone as string),
      brandStatement: row.brand_statement,
      targetAudience: row.target_audience,
      niche: JSON.parse(row.niche as string),
      recurringThemes: JSON.parse(row.recurring_themes as string),
      topicsToAvoid: JSON.parse(row.topics_to_avoid as string),
      sampleContent: row.sample_content,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { tone, brandStatement, targetAudience, niche, recurringThemes, topicsToAvoid, sampleContent } = body;
    await db.execute({
      sql: `UPDATE voice_profile SET tone = ?, brand_statement = ?, target_audience = ?, niche = ?, recurring_themes = ?, topics_to_avoid = ?, sample_content = ? WHERE id = 1`,
      args: [
        JSON.stringify(tone || []), brandStatement || '', targetAudience || '',
        JSON.stringify(niche || []), JSON.stringify(recurringThemes || []),
        JSON.stringify(topicsToAvoid || []), sampleContent || '',
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getSystemStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = getSystemStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

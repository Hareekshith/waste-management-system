import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUserPassword } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email and new password are required' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: 'No account registered with this email' }, { status: 404 });
    }

    updateUserPassword(email, newPassword);
    return NextResponse.json({ success: true, message: 'Password updated successfully! Please log in.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

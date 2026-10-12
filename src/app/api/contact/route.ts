import { NextRequest, NextResponse } from 'next/server';
import { addContactMessage, getAllContactMessages } from '@/lib/db';

export async function GET() {
  try {
    const messages = getAllContactMessages();
    return NextResponse.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fname, lname, contactEmail, contactPhone, comment } = body;

    if (!fname || !contactEmail || !comment) {
      return NextResponse.json({ success: false, error: 'First name, email, and message are required' }, { status: 400 });
    }

    const message = addContactMessage({
      fname: fname.trim(),
      lname: (lname || '').trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: (contactPhone || '').trim(),
      comment: comment.trim(),
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully! Our sanitation team will get back to you shortly.', data: message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

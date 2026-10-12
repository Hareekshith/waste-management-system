import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('wms_user')?.value;
    if (!userCookie) {
      return NextResponse.json({ success: true, user: null });
    }
    const user = JSON.parse(userCookie);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: true, user: null });
  }
}

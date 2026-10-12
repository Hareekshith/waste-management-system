import { NextRequest, NextResponse } from 'next/server';
import { getAllComplaints, createComplaint } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const complaints = getAllComplaints({ email, status, search });
    return NextResponse.json({ success: true, count: complaints.length, complaints });
  } catch (error: any) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobile, email, wastetype, location, locationdescription, file } = body;

    if (!name || !mobile || !email || !location || !locationdescription) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields (Name, Phone, Email, Location, Description).' },
        { status: 400 }
      );
    }

    const complaint = createComplaint({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      wastetype: wastetype || 'Mixed',
      location: location.trim(),
      locationdescription: locationdescription.trim(),
      file: file || '/assets/img/recycling.jpeg',
      date: new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Pending',
      adminRemarks: 'Complaint received and scheduled for municipal inspection.',
    });

    return NextResponse.json({ success: true, complaint }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register complaint' },
      { status: 500 }
    );
  }
}

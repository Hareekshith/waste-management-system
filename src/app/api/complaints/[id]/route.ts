import { NextRequest, NextResponse } from 'next/server';
import { getComplaintById, updateComplaint, deleteComplaint } from '@/lib/db';

function getSessionUser(request: NextRequest) {
  try {
    const cookie = request.cookies.get('wms_user')?.value;
    if (!cookie) return null;
    return JSON.parse(cookie);
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id, 10);
    if (isNaN(complaintId)) {
      return NextResponse.json({ success: false, error: 'Invalid complaint ID' }, { status: 400 });
    }

    const complaint = getComplaintById(complaintId);
    if (!complaint) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id, 10);
    if (isNaN(complaintId)) {
      return NextResponse.json({ success: false, error: 'Invalid complaint ID' }, { status: 400 });
    }

    const existing = getComplaintById(complaintId);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    const sessionUser = getSessionUser(request);
    const body = await request.json();

    // Check if administrative fields (status, adminRemarks) are present in the request
    if (body.status !== undefined || body.adminRemarks !== undefined) {
      if (!sessionUser || sessionUser.role !== 'admin') {
        return NextResponse.json(
          {
            success: false,
            error: 'Forbidden: Only authorized municipal administrators can update complaint status or remarks.',
          },
          { status: 403 }
        );
      }
    }

    // If changing citizen details (location, description, etc.), verify user is owner or admin
    if (body.location !== undefined || body.locationdescription !== undefined) {
      const isOwner = sessionUser && sessionUser.email.toLowerCase() === existing.email.toLowerCase();
      const isAdmin = sessionUser && sessionUser.role === 'admin';
      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You can only edit your own complaints.' },
          { status: 403 }
        );
      }
    }

    const updated = updateComplaint(complaintId, body);
    return NextResponse.json({ success: true, complaint: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = parseInt(id, 10);
    if (isNaN(complaintId)) {
      return NextResponse.json({ success: false, error: 'Invalid complaint ID' }, { status: 400 });
    }

    const existing = getComplaintById(complaintId);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
    }

    const sessionUser = getSessionUser(request);
    const isOwner = sessionUser && sessionUser.email.toLowerCase() === existing.email.toLowerCase();
    const isAdmin = sessionUser && sessionUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You cannot delete this complaint without authorization.' },
        { status: 403 }
      );
    }

    const success = deleteComplaint(complaintId);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete complaint' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

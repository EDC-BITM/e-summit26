import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrModerator } from '@/lib/admin/auth';
import { saveEventResult, deleteEventResult } from '@/lib/admin/queries';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    await requireAdminOrModerator();

    const body = await request.json();
    const { eventId, teamId, rank, marks } = body;

    // Validate input
    if (!eventId || !teamId || rank === undefined || marks === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(rank)) {
      return NextResponse.json(
        { error: 'Rank must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    if (marks < 0) {
      return NextResponse.json(
        { error: 'Marks must be positive' },
        { status: 400 }
      );
    }

    const result = await saveEventResult(eventId, teamId, rank, marks);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error saving event result:', error);
    return NextResponse.json(
      { error: 'Failed to save event result' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authorization
    await requireAdminOrModerator();

    const body = await request.json();
    const { eventId, teamId } = body;

    // Validate input
    if (!eventId || !teamId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await deleteEventResult(eventId, teamId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event result:', error);
    return NextResponse.json(
      { error: 'Failed to delete event result' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

type RouteContext = { params: Promise<{ submissionId: string }> };

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { submissionId } = await context.params;

    await query(`DELETE FROM content_submissions WHERE id = $1`, [submissionId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

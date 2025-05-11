import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const totalUsers = await User.countDocuments();

    return NextResponse.json({ totalUsers }, { status: 200 });
  } catch (error) {
    console.error('Failed to count users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

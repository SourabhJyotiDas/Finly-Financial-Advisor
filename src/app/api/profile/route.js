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

  const userId = session.user.id;

  try {
    await connectToDatabase();

    let userProfile = await User.findOne({ _id: userId });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not Found' }, { status: 500 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const data = await req.json();

  const { name, income, financialGoals } = data;

  try {
    await connectToDatabase();

    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (income !== undefined) updateData.income = income === '' ? undefined : Number(income);
    if (financialGoals !== undefined) updateData.financialGoals = financialGoals;

    const updatedProfile = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

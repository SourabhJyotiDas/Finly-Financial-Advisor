import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Expense from '@/models/expense';
import mongoose from 'mongoose';

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const expenseId = params.id;

  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    return NextResponse.json({ error: 'Invalid expense ID format' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const result = await Expense.deleteOne({
      _id: expenseId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Expense not found or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

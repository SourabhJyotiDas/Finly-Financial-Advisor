import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const expenseId = params.id;

  if (!ObjectId.isValid(expenseId)) {
    return NextResponse.json({ error: 'Invalid expense ID format' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const expensesCollection = db.collection('expenses');

    const result = await expensesCollection.deleteOne({
      _id: new ObjectId(expenseId),
      userId: userId, // Ensure user can only delete their own expenses
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

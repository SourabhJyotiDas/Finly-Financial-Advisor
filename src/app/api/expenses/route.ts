import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import type { Expense } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const client = await clientPromise;
    const db = client.db();
    const expensesCollection = db.collection<Expense>('expenses');
    const expenses = await expensesCollection.find({ userId }).sort({ date: -1 }).toArray();
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const expenseData = await req.json();
    
    // Basic validation (consider using Zod for more complex validation)
    if (!expenseData.description || !expenseData.amount || !expenseData.category || !expenseData.date) {
      return NextResponse.json({ error: 'Missing required expense fields' }, { status: 400 });
    }

    const newExpense: Omit<Expense, '_id' | 'id'> = {
      ...expenseData,
      userId,
      amount: Number(expenseData.amount),
      date: new Date(expenseData.date).toISOString(), // Ensure date is ISO string
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db();
    const expensesCollection = db.collection<Expense>('expenses');
    const result = await expensesCollection.insertOne(newExpense as Expense);
    
    // Fetch the inserted document to return it with its _id
    const insertedExpense = await expensesCollection.findOne({ _id: result.insertedId });

    return NextResponse.json(insertedExpense, { status: 201 });
  } catch (error) {
    console.error('Failed to add expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

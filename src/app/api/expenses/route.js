import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Expense from '@/models/expense';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const expenses = await Expense.find({ userId: session.user.id }).sort({ date: -1 });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const expenseData = await req.json();

    const { description, amount, category, date } = expenseData;

    if (!description || !amount || !category || !date) {
      return NextResponse.json({ error: 'Missing required expense fields' }, { status: 400 });
    }

    await connectToDatabase();

    const newExpense = await Expense.create({
      description,
      amount: Number(amount),
      category,
      date: new Date(date),
      userId: session.user.id,
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Failed to add expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

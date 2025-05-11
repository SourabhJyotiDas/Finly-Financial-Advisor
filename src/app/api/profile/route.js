import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const client = await clientPromise;
    const db = client.db();
    const userProfilesCollection = db.collection('userProfiles');
    
    let userProfile = await userProfilesCollection.findOne({ userId: userId });

    if (!userProfile) {
      const newUserProfileData = {
        userId: userId,
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await userProfilesCollection.insertOne(newUserProfileData);
      userProfile = await userProfilesCollection.findOne({ _id: result.insertedId });
       if (!userProfile) {
         return NextResponse.json({ error: 'Profile not found and failed to create' }, { status: 404 });
       }
    }
    
    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const data = await req.json();

  const { name, income, financialGoals } = data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const userProfilesCollection = db.collection('userProfiles');

    const updateData = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (income !== undefined) updateData.income = income === '' ? undefined : Number(income);
    if (financialGoals !== undefined) updateData.financialGoals = financialGoals;


    const result = await userProfilesCollection.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      { returnDocument: 'after', upsert: true } 
    );
    
    if (!result.value && result.ok !== 1) { 
        const newProfile = await userProfilesCollection.findOne({ userId: userId });
        if (newProfile) {
             return NextResponse.json(newProfile, { status: 200 });
        }
        return NextResponse.json({ error: 'Failed to update or create user profile' }, { status: 500 });
    }
    
    if (result.value) {
        return NextResponse.json(result.value, { status: 200 });
    }
    
    const createdProfile = await userProfilesCollection.findOne({ userId });
    if (createdProfile) {
        return NextResponse.json(createdProfile, { status: 200 });
    }


    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });

  } catch (error) {
    console.error('Failed to update user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

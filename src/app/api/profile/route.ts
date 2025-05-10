import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import type { UserProfile } from '@/lib/types';
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
    const userProfilesCollection = db.collection<UserProfile>('userProfiles');
    
    let userProfile = await userProfilesCollection.findOne({ userId: userId });

    if (!userProfile) {
      // If somehow profile doesn't exist, create a default one
      const newUserProfileData: UserProfile = {
        userId: userId,
        email: session.user.email!,
        name: session.user.name || session.user.email!.split('@')[0],
        // income: undefined, // Default to undefined
        // financialGoals: '', // Default to empty
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await userProfilesCollection.insertOne(newUserProfileData);
      // Re-fetch to get the _id
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

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const data = await req.json();

  // Validate data if necessary (e.g., using Zod)
  const { name, income, financialGoals } = data;

  try {
    const client = await clientPromise;
    const db = client.db();
    const userProfilesCollection = db.collection<UserProfile>('userProfiles');

    const updateData: Partial<UserProfile> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (income !== undefined) updateData.income = income === '' ? undefined : Number(income); // Handle empty string for income
    if (financialGoals !== undefined) updateData.financialGoals = financialGoals;


    const result = await userProfilesCollection.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      { returnDocument: 'after', upsert: true } // Upsert will create if not exists
    );
    
    if (!result.value && result.ok !== 1) { // Check if value is null AND ok is not 1 (older driver versions)
         // If upsert happened and value is null (older drivers), try to find it again.
        const newProfile = await userProfilesCollection.findOne({ userId: userId });
        if (newProfile) {
             return NextResponse.json(newProfile, { status: 200 });
        }
        return NextResponse.json({ error: 'Failed to update or create user profile' }, { status: 500 });
    }
    
    // For newer drivers, result.value will contain the document
    if (result.value) {
        return NextResponse.json(result.value, { status: 200 });
    }
    
    // Fallback if upsert happened but value is not returned as expected
    // This case might indicate an issue or very specific driver behavior
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

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';


export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users'); 
    const userProfilesCollection = db.collection('userProfiles');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = name || email.split('@')[0];

    const newUserResult = await usersCollection.insertOne({
      email,
      hashedPassword, 
      name: userName,
      emailVerified: null, 
      image: null, 
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newUserId = newUserResult.insertedId.toString();

    const newUserProfile = {
      userId: newUserId,
      email,
      name: userName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await userProfilesCollection.insertOne(newUserProfile);

    return NextResponse.json({ message: 'User registered successfully', userId: newUserId }, { status: 201 });

  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

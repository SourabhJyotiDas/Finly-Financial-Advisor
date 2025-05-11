import {connectToDatabase} from "@/lib/mongodb";
import Review from "@/models/Reviews";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
   try {
      
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const userId = session.user.id;
      await connectToDatabase();

      const { rating, comment } = await req.json();
      if (!rating || !comment) {
         return new Response("Missing fields", { status: 400 });
      }

      const review = new Review({ rating, comment, userId });
      await review.save();

      return new Response(JSON.stringify(review), { status: 201 });
   } catch (error) {
      console.error("Review POST error:", error);
      return new Response("Internal Server Error", { status: 500 });
   }
}

export async function GET() {
   try {
     await connectToDatabase();
 
     const reviews = await Review.aggregate([
       {
         $sort: { createdAt: -1 }
       },
       {
         $limit: 10
       },
       {
         $lookup: {
           from: "users", // The MongoDB collection name (usually lowercase plural)
           localField: "userId", // The field in Review
           foreignField: "_id", // The field in User
           as: "user"
         }
       },
       {
         $unwind: "$user" // Flatten the user array into a single object
       },
       {
         $project: {
           _id: 1,
           rating: 1,
           comment: 1,
           createdAt: 1,
           user: {
             _id: 1,
             name: 1,
             email: 1,
             image: 1 // Include any user fields you want to expose
           }
         }
       }
     ]);
 
     return new Response(JSON.stringify(reviews), { status: 200 });
   } catch (error) {
     console.error("[GET Reviews Error]", error);
     return new Response("Failed to fetch reviews", { status: 500 });
   }
 }

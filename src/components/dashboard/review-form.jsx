"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ReviewForm() {
  const { toast } = useToast();
  const [hover, setHover] = useState(0);

  const formSchema = z.object({
    rating: z.number().min(1, "Please select a rating"),
    comment: z.string().min(3, "Comment must be at least 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to submit review");

      toast({
        title: "Thank you!",
        description: "Your review has been submitted.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-6 py-8 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
        Leave a Review
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
        Share your experience with us. Your feedback helps us grow!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-700 dark:text-gray-200">Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                          (hover || field.value) >= star
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => field.onChange(star)}
                        fill={
                          (hover || field.value) >= star ? "currentColor" : "none"
                        }
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-700 dark:text-gray-200">Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your honest feedback..."
                    rows={4}
                    className="bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-150"
          >
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
}

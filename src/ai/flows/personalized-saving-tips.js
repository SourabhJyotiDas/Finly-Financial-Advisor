// src/ai/flows/personalized-saving-tips.js
'use server';

/**
 * @fileOverview Provides personalized saving tips to users based on their financial data and goals.
 *
 * - getPersonalizedSavingTips - A function that generates personalized saving tips.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSavingTipsInputSchema = z.object({
  income: z.number().describe('The user\u0027s monthly income.'),
  expenses: z.number().describe('The user\u0027s monthly expenses.'),
  financialGoals: z
    .string()
    .describe(
      'The user\u0027s financial goals, such as saving for a down payment on a house or paying off debt.'
    ),
  spendingPatterns: z
    .string()
    .describe(
      'A description of the user\u0027s spending patterns, including categories where they spend the most money.'
    ),
});


const PersonalizedSavingTipsOutputSchema = z.object({
  savingTips: z
    .string()
    .describe('Personalized saving tips based on the user\u0027s financial situation and goals.'),
});


export async function getPersonalizedSavingTips(
  input
) {
  return personalizedSavingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSavingTipsPrompt',
  input: {schema: PersonalizedSavingTipsInputSchema},
  output: {schema: PersonalizedSavingTipsOutputSchema},
  prompt: `You are a personal finance advisor. Provide personalized saving tips to the user based on their income, expenses, financial goals, and spending patterns. Assume all monetary values are in Indian Rupees (₹).

  Income: {{income}}
  Expenses: {{expenses}}
  Financial Goals: {{financialGoals}}
  Spending Patterns: {{spendingPatterns}}

  Provide specific and actionable saving tips tailored to the user's situation. Consider suggesting strategies to reduce expenses, increase income, and allocate funds effectively towards their goals. If you mention specific monetary amounts in your tips, use the ₹ symbol.`,
});

const personalizedSavingTipsFlow = ai.defineFlow(
  {
    name: 'personalizedSavingTipsFlow',
    inputSchema: PersonalizedSavingTipsInputSchema,
    outputSchema: PersonalizedSavingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output;
  }
);

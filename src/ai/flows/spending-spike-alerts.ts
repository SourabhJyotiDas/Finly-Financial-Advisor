'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting and alerting users about unusual spending spikes.
 *
 * - `spendingSpikeAlerts`:  The main function to trigger the spending spike analysis and alert generation.
 * - `SpendingSpikeAlertsInput`: Defines the input schema for the `spendingSpikeAlerts` function, which includes user's expense data.
 * - `SpendingSpikeAlertsOutput`: Defines the output schema, providing details on any detected spending spikes.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingSpikeAlertsInputSchema = z.object({
  userId: z.string().describe('Unique identifier for the user.'),
  expenses: z
    .array(
      z.object({
        category: z.string().describe('Expense category (e.g., food, rent, transport).'),
        amount: z.number().describe('Amount spent in the expense.'),
        date: z.string().describe('Date of the expense (ISO format).'),
      })
    )
    .describe('Array of user expenses.'),
});

export type SpendingSpikeAlertsInput = z.infer<typeof SpendingSpikeAlertsInputSchema>;

const SpendingSpikeAlertsOutputSchema = z.object({
  alerts:
    z.array(
      z.object({
        category: z.string().describe('Expense category with a spending spike.'),
        spikeAmount: z.number().describe('Amount of the spending spike.'),
        message: z.string().describe('Descriptive message about the spending spike.'),
      })
    ).
    describe('Array of alerts for detected spending spikes.'),
});

export type SpendingSpikeAlertsOutput = z.infer<typeof SpendingSpikeAlertsOutputSchema>;

export async function spendingSpikeAlerts(input: SpendingSpikeAlertsInput): Promise<SpendingSpikeAlertsOutput> {
  return spendingSpikeAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingSpikeAlertsPrompt',
  input: {schema: SpendingSpikeAlertsInputSchema},
  output: {schema: SpendingSpikeAlertsOutputSchema},
  prompt: `You are an AI financial advisor specializing in detecting spending spikes for users. All monetary values are in Indian Rupees (₹).

  Analyze the user's expenses and identify any unusual spending spikes in specific categories.
  Provide a clear message describing the spike, the category, and the amount. When mentioning amounts in the message, use the ₹ symbol.

  User ID: {{{userId}}}
  Expenses:{{#each expenses}} Category: {{{category}}}, Amount: {{{amount}}}, Date: {{{date}}}{{/each}}

  Based on the provided expenses, generate alerts ONLY for categories where there are significant spending spikes compared to typical spending patterns. Typical spending patterns are not provided, so determine spending spikes solely on the provided data.
  Do not generate alerts for categories without a clear and explainable spike.
  If no spending spikes are detected, return an empty array for the alerts field.
  `,
});

const spendingSpikeAlertsFlow = ai.defineFlow(
  {
    name: 'spendingSpikeAlertsFlow',
    inputSchema: SpendingSpikeAlertsInputSchema,
    outputSchema: SpendingSpikeAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

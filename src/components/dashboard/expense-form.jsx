'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
// import { useToast } from '@/hooks/use-toast'; // Toast is handled by parent
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function ExpenseForm({ onAddExpense }) {
  const t = useTranslations('ExpenseForm');
  // const { toast } = useToast(); // Parent component (ExpensesPage) handles toast

  const expenseSchema = z.object({
    description: z.string().min(1, { message: t('validationDescriptionRequired') }),
    amount: z.coerce.number().positive({ message: t('validationAmountPositive') }),
    category: z.enum(['food', 'rent', 'transport', 'entertainment', 'utilities', 'other']),
    date: z.date({ required_error: t('validationDateRequired') }),
  });

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: undefined,
      category: 'food',
      date: undefined,
    },
  });

  const [isClient, setIsClient] = useState(false);
  const [clientToday, setClientToday] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    setClientToday(today);
    if (form.getValues('date') === undefined) {
      form.setValue('date', today, { shouldValidate: false, shouldDirty: false });
    }
  }, [form]);

  function onSubmit(values) {
    const expenseDataToSubmit = {
      description: values.description,
      amount: Number(values.amount),
      category: values.category,
      date: values.date.toISOString(),
    };
    onAddExpense(expenseDataToSubmit);
    form.reset({
        description: '',
        amount: undefined,
        category: 'food',
        date: isClient ? new Date() : undefined,
    });
  }

  const categories = [
    { value: 'food', label: t('categories.food') },
    { value: 'rent', label: t('categories.rent') },
    { value: 'transport', label: t('categories.transport') },
    { value: 'entertainment', label: t('categories.entertainment') },
    { value: 'utilities', label: t('categories.utilities') },
    { value: 'other', label: t('categories.other') },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('descriptionLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('descriptionPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('amountLabel')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder={t('amountPlaceholder')} 
                    {...field} 
                    value={field.value === undefined ? '' : field.value}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('categoryLabel')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue="food">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCategoryPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('dateLabel')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={!isClient}
                    >
                      {field.value instanceof Date ? format(field.value, 'PPP') : (isClient ? <span>{t('pickDate')}</span> : <span>{t('loadingDate')}</span>)}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {isClient && clientToday ? (
                    <Calendar
                      mode="single"
                      selected={field.value instanceof Date ? field.value : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > clientToday || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  ) : <div className="p-4 text-center text-muted-foreground">{t('loadingCalendar')}</div> }
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={!isClient}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t('addExpenseButton')}
        </Button>
      </form>
    </Form>
  );
}

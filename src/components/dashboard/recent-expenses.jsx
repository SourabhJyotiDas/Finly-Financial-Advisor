'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Utensils, Home, Car, Ticket, Zap, CircleDollarSign, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from 'next-intl';

const categoryIcons = {
  food: <Utensils className="h-4 w-4" />,
  rent: <Home className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
  entertainment: <Ticket className="h-4 w-4" />,
  utilities: <Zap className="h-4 w-4" />,
  other: <CircleDollarSign className="h-4 w-4" />,
};

export function RecentExpenses({ expenses, onDeleteExpense }) {
  const t = useTranslations('RecentExpenses');
  const tCategories = useTranslations('ExpenseForm.categories');

  const categoryDisplayNames = {
    food: tCategories('food'),
    rent: tCategories('rent'),
    transport: tCategories('transport'),
    entertainment: tCategories('entertainment'),
    utilities: tCategories('utilities'),
    other: tCategories('other'),
  };


  if (expenses.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{t('noExpenses')}</p>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('headerDescription')}</TableHead>
              <TableHead>{t('headerCategory')}</TableHead>
              <TableHead>{t('headerDate')}</TableHead>
              <TableHead className="text-right">{t('headerAmount')}</TableHead>
              <TableHead className="text-right">{t('headerActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((expense) => (
                <TableRow key={expense._id || expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                      {categoryIcons[expense.category]}
                      {categoryDisplayNames[expense.category] || expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    ₹{expense.amount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('deleteExpenseSR')}</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('deleteExpenseAlertTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteExpenseAlertDescription', { description: expense.description })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteExpense(expense._id || expense.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('deleteButton')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from "@/components/ui/alert-dialog"


const categoryIcons = {
  food: <Utensils className="h-4 w-4" />,
  rent: <Home className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
  entertainment: <Ticket className="h-4 w-4" />,
  utilities: <Zap className="h-4 w-4" />,
  other: <CircleDollarSign className="h-4 w-4" />,
};

const categoryDisplayNames = {
  food: "Food",
  rent: "Rent/Mortgage",
  transport: "Transport",
  entertainment: "Entertainment",
  utilities: "Utilities",
  other: "Other",
};

export function RecentExpenses({ expenses, onDeleteExpense }) {
  if (expenses.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No expenses tracked yet. Add an expense to get started!</p>;
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
            <TableRow key={expense._id || expense.id}>
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                  {categoryIcons[expense.category]}
                  {categoryDisplayNames[expense.category]}
                </Badge>
              </TableCell>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the expense
                        "{expense.description}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteExpense(expense._id || expense.id)} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

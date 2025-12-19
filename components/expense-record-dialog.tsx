"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { createExpense } from "@/app/sales/actions";
import { Loader2 } from "lucide-react";

interface ExpenseRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseRecordDialog({
  open,
  onOpenChange,
}: ExpenseRecordDialogProps) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)

    const result = await createExpense({
      category,
      amount: Number(amount),
      description,
    });

    if (result.success) {
      toast.success("Expense recorded successfully");
      onOpenChange(false);

      // Reset form
      setIsLoading(false)
      setCategory("");
      setAmount("");
      setDescription("");
    
    } else {
      setIsLoading(false)
      toast.error(result.error ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Record Expense</DialogTitle>
          <DialogDescription>
            Enter the details for the daily expense
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="bg-secondary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseAmount">Amount</Label>
            <Input
              id="expenseAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-secondary min-h-[100px]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer" disabled={isLoading}>
             {isLoading ? <Loader2 className="animate-spin"/> :  "Record Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

interface ServiceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const servicesType = [
  { id: 1, service: "Standard Haircut" },
  { id: 2, service: "Premium/Celebrity Haircut" },
  { id: 3, service: "Children/Student Haircut" },
  { id: 4, service: "Beard Trim & Shaping" },
  { id: 5, service: "Mustache Grooming" },
  { id: 6, service: "Straight Razor Hot Shave" },
  { id: 7, service: "Hair Dye & Tinting (Black/Colors)" },
  { id: 8, service: "Beard Dye/Gray Blending" },
  { id: 9, service: "Dreadlocks (Fixing & Relocking)" },
  { id: 10, service: "Scalp Massage & Treatment" },
  { id: 11, service: "Hair Washing & Setting" },
  { id: 12, service: "Relaxer & Texturizer Application" },
  { id: 13, service: "Facial Therapy (Plain or Fruit Facials)" },
  { id: 14, service: "Manicure & Pedicure" },
  { id: 15, service: "Home Service Barbing" },
  { id: 16, service: "Ear & Nose Hair Trimming" },
  { id: 17, service: "Eyebrow Shaping/Threading" },
  { id: 18, service: "Bumps Treatment (Aftershave/Creme)" },
  { id: 19, service: "Toupee/Hair Replacement Installation" },
  { id: 20, service: "Braiding for Men (Cornrows/Twists)" },
];

export function ServiceRecordDialog({
  open,
  onOpenChange,
}: ServiceRecordDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [barberName, setBarberName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      customerName,
      customerPhone,
      barberName,
      serviceType,
      amount,
      paymentMethod,
    });
    onOpenChange(false);
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setBarberName("");
    setServiceType("");
    setAmount("");
    setPaymentMethod("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Record Service</DialogTitle>
          <DialogDescription>
            Enter the details for the completed service
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="John Smith"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="(555) 123-4567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barberName">Barber Name</Label>
            <Input
              id="barberName"
              type="text"
              placeholder="Write Barber Name"
              value={barberName}
              onChange={(e) => setBarberName(e.target.value)}
              required
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType} required>
              <SelectTrigger id="serviceType" className="bg-secondary">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {servicesType.map((servType) => (
                  <SelectItem
                    key={servType.id}
                    value={servType.service.toLowerCase()}
                  >
                    {servType.service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Paid</Label>
            <Input
              id="amount"
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
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              required
            >
              <SelectTrigger id="paymentMethod" className="bg-secondary">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="Transfer">Mobile Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Record Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

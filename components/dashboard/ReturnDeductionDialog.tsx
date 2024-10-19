import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import the Deduction interface from Deductions.tsx
import { Deduction } from './Deductions';

interface ReturnDeductionDialogProps {
  deduction: Deduction;
  isOpen: boolean;
  onClose: () => void;
  onReturn: (deduction: Deduction, amount: number) => Promise<void>;
}

const ReturnDeductionDialog: React.FC<ReturnDeductionDialogProps> = ({
  deduction,
  isOpen,
  onClose,
  onReturn,
}) => {
  const [amount, setAmount] = useState(deduction.amount);

  // Reset amount when the dialog opens with a new deduction
  useEffect(() => {
    if (isOpen) {
      setAmount(deduction.amount);
    }
  }, [isOpen, deduction]);

  const handleReturn = async () => {
    await onReturn(deduction, amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Deduction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Units to Return
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={deduction.amount}
              min={0}
              step={0.01}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className='bg-red-500 text-white hover:bg-red-600'>
            Cancel
          </Button>
          <Button onClick={handleReturn} className='bg-midBlue text-white hover:bg-midBlue/90'>Return</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnDeductionDialog;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DisputeForm } from './DisputeForm';

interface DisputeButtonProps {
  tenderId: string;
  tenderTitle: string;
  winnerId: string;
  winnerName: string;
  tenderEndDate: string;
  disputeTimeFrameDays: number;
}

export function DisputeButton({
  tenderId,
  tenderTitle,
  winnerId,
  winnerName,
  tenderEndDate,
  disputeTimeFrameDays = 7
}: DisputeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calculate if we're still within the dispute window
  const canFileDispute = () => {
    const tenderEnd = new Date(tenderEndDate);
    const disputeDeadline = new Date(tenderEnd);
    disputeDeadline.setDate(disputeDeadline.getDate() + disputeTimeFrameDays);
    
    return new Date() <= disputeDeadline;
  };
  
  const isWithinTimeFrame = canFileDispute();
  
  // Calculate days left for filing disputes
  const getDaysLeft = () => {
    const tenderEnd = new Date(tenderEndDate);
    const disputeDeadline = new Date(tenderEnd);
    disputeDeadline.setDate(disputeDeadline.getDate() + disputeTimeFrameDays);
    
    const now = new Date();
    const daysDiff = Math.ceil((disputeDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysDiff);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        disabled={!isWithinTimeFrame}
        className="flex items-center gap-2"
      >
        <Flag className="h-4 w-4" />
        File Dispute
        {isWithinTimeFrame && getDaysLeft() <= 3 && (
          <span className="text-xs text-red-500 font-medium">{getDaysLeft()} days left</span>
        )}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>File a Dispute</DialogTitle>
            <DialogDescription>
              {isWithinTimeFrame ? (
                <>
                  You have {getDaysLeft()} days left to file a dispute against the winner selection for this tender.
                  Please provide a detailed explanation for your dispute.
                </>
              ) : (
                <>
                  The {disputeTimeFrameDays}-day window for filing disputes for this tender has expired.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {isWithinTimeFrame ? (
            <DisputeForm
              tenderId={tenderId}
              tenderTitle={tenderTitle}
              winnerId={winnerId}
              winnerName={winnerName}
              onSuccess={() => setIsDialogOpen(false)}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

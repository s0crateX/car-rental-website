import React, { useState, ComponentType } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';



export function withConfirmation<P extends { onClick: (...args: any[]) => void }>(
  WrappedComponent: ComponentType<P>,
  confirmationProps: {
    title: string;
    description: string;
    cancelLabel?: string;
    confirmLabel?: string;
  }
) {
  const ComponentWithConfirmation = (props: P) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = (event: React.MouseEvent) => {
      event.preventDefault(); // Prevent default button behavior
      setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

    const handleConfirm = () => {
      props.onClick();
      handleCloseDialog();
    };

    return (
      <>
        <WrappedComponent {...props} onClick={handleOpenDialog} />
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmationProps.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmationProps.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseDialog}>
                {confirmationProps.cancelLabel || 'Cancel'}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {confirmationProps.confirmLabel || 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };

  return ComponentWithConfirmation;
}
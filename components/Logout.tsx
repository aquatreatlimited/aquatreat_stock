import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
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

const Logout: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // Handle error silently or use a toast notification
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='bg-darkBlue text-white text-sm md:text-base px-2 md:px-4 py-1 md:py-2'>Logout</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90vw] max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg md:text-xl">Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm md:text-base">
            This action will sign you out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <AlertDialogCancel className='bg-darkBlue text-white text-sm md:text-base'>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 text-white text-sm md:text-base' onClick={handleLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;

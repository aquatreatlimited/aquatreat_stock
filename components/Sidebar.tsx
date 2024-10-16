"use client";
import React from 'react';
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUndo,
  FaPlus,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AddCategoryForm from "./AddCategoryForm";
import AddProductForm from "./AddProductForm";
import Link from "next/link";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [showAddCategoryDialog, setShowAddCategoryDialog] = React.useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = React.useState(false);

  const handleAddCategory = () => {
    setShowAddProductDialog(false);
    setShowAddCategoryDialog(true);
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="flex flex-col h-full p-2 md:p-4">
      <div className="flex-grow space-y-2 md:space-y-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm md:text-base" 
          asChild
          onClick={handleLinkClick}
        >
          <Link href="/">
            <FaHome className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm md:text-base" 
          asChild
          onClick={handleLinkClick}
        >
          <Link href="/products">
            <FaBoxOpen className="mr-2 h-4 w-4" />
            Products
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm md:text-base" 
          asChild
          onClick={handleLinkClick}
        >
          <Link href="/returns">
            <FaUndo className="mr-2 h-4 w-4" />
            Returns
          </Link>
        </Button>
        <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full bg-darkBlue text-white justify-start"
              onClick={() => setShowAddCategoryDialog(true)}
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Add Category</DialogHeader>
            <AddCategoryForm onSuccess={() => {
              setShowAddCategoryDialog(false);
              onClose();
            }} />
          </DialogContent>
        </Dialog>
        <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start bg-darkBlue text-white"
              onClick={() => setShowAddProductDialog(true)}
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Add Product</DialogHeader>
            <AddProductForm 
              onSuccess={() => {
                setShowAddProductDialog(false);
                onClose();
              }} 
              onAddCategory={handleAddCategory}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;

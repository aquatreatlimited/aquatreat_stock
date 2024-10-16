import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUndo,
  FaPlus,
} from "react-icons/fa"; // React Icons
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AddCategoryForm from "./AddCategoryForm";
import AddProductForm from "./AddProductForm";
import { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);

  const handleAddCategory = () => {
    setShowAddProductDialog(false);
    setShowAddCategoryDialog(true);
  };

  return (
    <div className="flex flex-col h-full p-2 md:p-4">
      <div className="flex-grow space-y-2 md:space-y-3">
        <Button variant="ghost" className="w-full justify-start text-sm md:text-base" asChild>
          <Link href="/">
            <FaHome className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm md:text-base" asChild>
          <Link href="/products">
            <FaBoxOpen className="mr-2 h-4 w-4" />
            Products
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm md:text-base" asChild>
          <Link href="/sales">
            <FaShoppingCart className="mr-2 h-4 w-4" />
            Sales
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm md:text-base" asChild>
          <Link href="/returns">
            <FaUndo className="mr-2 h-4 w-4" />
            Returns
          </Link>
        </Button>
        <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full bg-darkBlue text-white justify-start">
              <FaPlus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Add Category</DialogHeader>
            <AddCategoryForm onSuccess={() => setShowAddCategoryDialog(false)} />
          </DialogContent>
        </Dialog>
        <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start bg-darkBlue text-white">
              <FaPlus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Add Product</DialogHeader>
            <AddProductForm 
              onSuccess={() => setShowAddProductDialog(false)} 
              onAddCategory={handleAddCategory}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;

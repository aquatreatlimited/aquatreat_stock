import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaEllipsisV, FaMinus, FaEdit, FaTrash } from "react-icons/fa";
import DeductProduct from "../DeductProduct";
import UpdateProduct from "../UpdateProduct";
import DeleteProduct from "../DeleteProduct";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Product {
  id: string;
  name: string;
  stock: number;
  categoryName: string;
  isDivisible: boolean;
  fractionPerUnit?: number;
  fractionRemaining?: number;
}

interface ProductTableProps {
  products: Product[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setProductToUpdate: React.Dispatch<React.SetStateAction<Product | null>>;
  setProductToDelete: React.Dispatch<React.SetStateAction<Product | null>>;
  selectedProduct: Product | null;
  productToUpdate: Product | null;
  productToDelete: Product | null;
  handleDeductSuccess: () => void;
  handleUpdateSuccess: () => void;
  handleDeleteSuccess: () => void;
  handleDeleteCancel: () => void;
  highlightedProductId: string | null;
  handleDeduct: (amount: number) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  setSelectedProduct,
  setProductToUpdate,
  setProductToDelete,
  selectedProduct,
  productToUpdate,
  productToDelete,
  handleDeductSuccess,
  handleUpdateSuccess,
  handleDeleteSuccess,
  handleDeleteCancel,
  highlightedProductId,
  handleDeduct,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    setTotalPages(Math.ceil(products.length / ITEMS_PER_PAGE));
  }, [products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Stock</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow
                key={product.id}
                className={cn(
                  product.id === highlightedProductId && "bg-midLightBlue",
                  "transition-colors duration-300"
                )}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.stock} units
                  {product.isDivisible && product.fractionRemaining !== undefined
                    ? ` + ${product.fractionRemaining} ${product.fractionPerUnit}`
                    : ""}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <FaEllipsisV className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-56'>
                      <div className='grid gap-4'>
                        <Button
                          className='w-full justify-start'
                          variant='ghost'
                          onClick={() => setSelectedProduct(product)}>
                          <FaMinus className='mr-2 h-4 w-4' />
                          Deduct
                        </Button>
                        <Button
                          className='w-full justify-start'
                          variant='ghost'
                          onClick={() => setProductToUpdate(product)}>
                          <FaEdit className='mr-2 h-4 w-4' />
                          Update
                        </Button>
                        <Button
                          className='w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100'
                          variant='ghost'
                          onClick={() => setProductToDelete(product)}>
                          <FaTrash className='mr-2 h-4 w-4' />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Deduct Dialog */}
                  <Dialog
                    open={selectedProduct?.id === product.id}
                    onOpenChange={(open) => !open && setSelectedProduct(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Deduct Product: {selectedProduct?.name}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedProduct && (
                        <DeductProduct
                          product={selectedProduct}
                          onSuccess={handleDeductSuccess}
                          handleDeduct={handleDeduct}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Update Dialog */}
                  <Dialog
                    open={productToUpdate?.id === product.id}
                    onOpenChange={(open) => !open && setProductToUpdate(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Update Product: {productToUpdate?.name}
                        </DialogTitle>
                      </DialogHeader>
                      {productToUpdate && (
                        <UpdateProduct
                          product={productToUpdate}
                          onSuccess={handleUpdateSuccess}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Delete Dialog */}
                  <Dialog
                    open={productToDelete?.id === product.id}
                    onOpenChange={(open) => !open && setProductToDelete(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Delete Product: {productToDelete?.name}
                        </DialogTitle>
                      </DialogHeader>
                      {productToDelete && (
                        <DeleteProduct
                          product={productToDelete}
                          onSuccess={handleDeleteSuccess}
                          onCancel={handleDeleteCancel}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductTable;

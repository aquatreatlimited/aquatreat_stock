"use client"

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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FaEllipsisV,
  FaUndo,
  FaTrash,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  Timestamp,
  where,
  Query,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { format } from 'date-fns'; // Add this import for date formatting
import { useMediaQuery } from "@/hooks/use-media-query";

interface Deduction {
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  amount: number;
  date: Date;
}

interface Category {
  id: string;
  name: string;
}

interface DeductionsProps {
  onReturnDeduction: (deduction: Deduction) => void;
  onDeleteDeduction: (deductionId: string) => void;
  categories: Category[];
}

interface SearchParams {
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

const ITEMS_PER_PAGE = 10;

const Deductions: React.FC<DeductionsProps> = ({
  onReturnDeduction,
  onDeleteDeduction,
  categories,
}) => {
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { toast } = useToast();

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const fetchDeductions = () => {
      setLoading(true);
      let deductionsQuery: Query<DocumentData> = query(
        collection(db, "deductions"),
        orderBy("date", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      if (selectedCategory && selectedCategory !== "All") {
        deductionsQuery = query(deductionsQuery, where("categoryName", "==", selectedCategory));
      }
      if (startDate) {
        deductionsQuery = query(deductionsQuery, where("date", ">=", new Date(startDate)));
      }
      if (endDate) {
        deductionsQuery = query(deductionsQuery, where("date", "<=", new Date(endDate)));
      }

      const unsubscribe = onSnapshot(deductionsQuery, (snapshot) => {
        const deductionList = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date instanceof Timestamp
              ? doc.data().date.toDate()
              : new Date(doc.data().date),
          } as Deduction)
        );
        setDeductions(deductionList);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchDeductions();

    return () => {
      unsubscribe();
    };
  }, [selectedCategory, startDate, endDate]);

  useEffect(() => {
    const fetchTotalPages = async () => {
      const totalSnapshot = await getDocs(query(collection(db, "deductions")));
      setTotalPages(Math.ceil(totalSnapshot.size / ITEMS_PER_PAGE));
    };

    fetchTotalPages();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    // The actual filtering is now handled in the useEffect
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // You might want to update the query with a new startAfter here
    // This would require keeping track of the last visible document for each page
  };

  const filteredDeductions = deductions.filter((deduction) =>
    deduction.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleReturnDeduction = async (deduction: Deduction) => {
    try {
      await onReturnDeduction(deduction);
      toast({
        title: "Deduction Returned",
        description: `Successfully returned ${deduction.amount} of ${deduction.productName}`,
        variant: "default",
        className: "bg-midBlue text-white",
        action: (
          <ToastAction altText="Dismiss">Dismiss</ToastAction>
        ),
      });
    } catch (error) {
      console.error("Error returning deduction:", error);
      toast({
        title: "Error",
        description: "Failed to return deduction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDeduction = async (deductionId: string) => {
    try {
      await onDeleteDeduction(deductionId);
      toast({
        title: "Deduction Deleted",
        description: "Successfully deleted the deduction",
        variant: "default",
        className: "bg-darkBlue text-white",
        action: (
          <ToastAction altText="Dismiss">Dismiss</ToastAction>
        ),
      });
    } catch (error) {
      console.error("Error deleting deduction:", error);
      toast({
        title: "Error",
        description: "Failed to delete deduction. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="bg-white p-3 md:p-6 rounded-lg shadow-md text-deepNavy mt-4 md:mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Recent Deductions</h2>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date and Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeductions.map((deduction) => (
              <TableRow key={deduction.id}>
                <TableCell>{deduction.productName}</TableCell>
                <TableCell>{deduction.amount} units</TableCell>
                <TableCell>{format(deduction.date, "dd/MM/yyyy 'at' hh:mm:ss a")}</TableCell>
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
                          onClick={() => handleReturnDeduction(deduction)}>
                          <FaUndo className='mr-2 h-4 w-4' />
                          Return
                        </Button>
                        <Button
                          className='w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100'
                          variant='ghost'
                          onClick={() => handleDeleteDeduction(deduction.id)}>
                          <FaTrash className='mr-2 h-4 w-4' />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                if (currentPage > 1 && !loading) {
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
                if (currentPage < totalPages && !loading) {
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

export default Deductions;

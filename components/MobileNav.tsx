import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FaBars, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
  where,
} from "firebase/firestore";
import Logout from './Logout';

interface Product {
  id: string;
  name: string;
  stock: number;
}

interface TopSellingProduct {
  productName: string;
  totalDeductions: number;
}

interface Deduction {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  date: Date;
}

const MobileNav: React.FC = () => {
  const [stockAlerts, setStockAlerts] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<TopSellingProduct[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const lowStockQuery = query(
      collection(db, "products"),
      where("stock", "<", 10),
      limit(20)
    );
    const unsubscribeLowStock = onSnapshot(lowStockQuery, (snapshot) => {
      const productList: Product[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      );
      setStockAlerts(productList);
    });

    const latestDeductionsQuery = query(
      collection(db, "deductions"),
      orderBy("date", "desc"),
      limit(100)
    );
    const unsubscribeDeductions = onSnapshot(
      latestDeductionsQuery,
      (snapshot) => {
        const deductionList: Deduction[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            productId: data.productId,
            productName: data.productName,
            amount: data.amount,
            date:
              data.date instanceof Timestamp
                ? data.date.toDate()
                : new Date(data.date),
          };
        });
        updateTopSelling(deductionList);
      }
    );

    return () => {
      unsubscribeLowStock();
      unsubscribeDeductions();
    };
  }, []);

  const updateTopSelling = (deductions: Deduction[]) => {
    const productDeductions = deductions.reduce((acc, deduction) => {
      const { productName, amount } = deduction;
      if (!acc[productName]) {
        acc[productName] = 0;
      }
      acc[productName] += amount;
      return acc;
    }, {} as Record<string, number>);

    const topSellingProducts = Object.entries(productDeductions)
      .map(([productName, totalDeductions]) => ({
        productName,
        totalDeductions,
      }))
      .sort((a, b) => b.totalDeductions - a.totalDeductions)
      .slice(0, 5);

    setTopSelling(topSellingProducts);
  };

  return (
    <div className='flex justify-between items-center p-2 bg-[#B0D3FF] text-[#001540]'>
      <Link href='/'>
        <Image
          src='/logo.png'
          alt='Logo'
          width={120}
          height={70}
          className='w-[120px] h-[40px]'
        />
      </Link>
      <div className='flex items-center space-x-2'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' size='icon'>
              <FaChartLine className='text-darkBlue w-5 h-5' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64'>
            <div className='bg-white'>
              <div className='flex items-center space-x-2 mb-2'>
                <FaChartLine className='text-darkBlue w-5 h-5' />
                <h2 className='text-lg font-semibold'>Top Selling</h2>
              </div>
              <div>
                {topSelling.length > 0 ? (
                  topSelling.map((product, index) => (
                    <p key={index} className='text-sm'>
                      {product.productName}:{" "}
                      <span className='font-bold'>
                        {product.totalDeductions}
                      </span>{" "}
                      units
                    </p>
                  ))
                ) : (
                  <p className='text-sm'>
                    No top selling products data available.
                  </p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' size='icon'>
              <FaExclamationTriangle className='text-red-500 w-5 h-5' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-64'>
            <div className='bg-white'>
              <div className='flex items-center space-x-2 mb-2'>
                <FaExclamationTriangle className='text-red-500 w-5 h-5' />
                <h2 className='text-lg font-semibold'>Stock Alert</h2>
              </div>
              <div>
                {stockAlerts.length > 0 ? (
                  stockAlerts.map((alert) => (
                    <p key={alert.id} className='text-sm'>
                      {alert.name}:{" "}
                      <span className='font-bold'>{alert.stock}</span> units
                      remaining
                    </p>
                  ))
                ) : (
                  <p className='text-sm'>No products with low stock.</p>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <FaBars className='w-5 h-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
            <div className='-mt-10'>
              <Logout />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;

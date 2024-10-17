"use client";
import React, { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import ProductTable from './dashboard/ProductTable';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  stock: number;
  categoryName: string;
  isDivisible: boolean;
  fractionPerUnit?: number;
  fractionRemaining?: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleDeduct = async (amount: number): Promise<void> => {
    if (!selectedProduct) return;
    
    try {
      const productRef = doc(db, "products", selectedProduct.id);
      const newStock = selectedProduct.stock - amount;
      await updateDoc(productRef, { stock: newStock });
      
      // Update the local state
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === selectedProduct.id ? { ...p, stock: newStock } : p
        )
      );

      toast({
        title: "Success",
        description: `Deducted ${amount} from ${selectedProduct.name}`,
      });
      
      handleDeductSuccess();
    } catch (error) {
      console.error("Error deducting product:", error);
      toast({
        title: "Error",
        description: "Failed to deduct product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeductSuccess = () => {
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = () => {
    setProductToUpdate(null);
    fetchProducts(); // Refresh the products list
  };

  const handleDeleteSuccess = () => {
    setProductToDelete(null);
    fetchProducts(); // Refresh the products list
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='p-6 space-y-6 text-darkerNavy bg-white rounded-lg'>
      <h2 className='text-2xl font-semibold mb-4'>All Products</h2>
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        {searchTerm && (
          <Button onClick={clearSearch} variant="ghost" size="icon">
            <FaTimes className="h-4 w-4" />
          </Button>
        )}
      </div>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ProductTable 
          products={filteredProducts}
          setSelectedProduct={setSelectedProduct}
          setProductToUpdate={setProductToUpdate}
          setProductToDelete={setProductToDelete}
          selectedProduct={selectedProduct}
          productToUpdate={productToUpdate}
          productToDelete={productToDelete}
          handleDeductSuccess={handleDeductSuccess}
          handleUpdateSuccess={handleUpdateSuccess}
          handleDeleteSuccess={handleDeleteSuccess}
          handleDeleteCancel={handleDeleteCancel}
          highlightedProductId={selectedProduct?.id || null}
          handleDeduct={handleDeduct}
        />
      )}
    </div>
  );
};

export default Products;

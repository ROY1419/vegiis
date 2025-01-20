"use client";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/product.model";
import { useEffect, useState } from "react";
import ProductGallery from "./components/ProductGallery";


export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([])
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }

    }
    fetchProduct()
  }, [])


  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
      <ProductGallery product={products} />
    </main>
  );
}

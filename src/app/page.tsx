"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import ProductList from '@/components/ProductList';

// It's good practice to define shared types in a central file,
// e.g., 'types/index.ts', but for simplicity, we define it here.
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function Home() {
  // State for the original, full list of products
  const [products, setProducts] = useState<Product[]>([]);
  // State for categories to populate the filter dropdown
  const [categories, setCategories] = useState<string[]>([]);
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for user inputs, managed here and passed down to Navigation
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('');

  // Fetch initial data for products and categories
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('https://fakestoreapi.com/products'),
          fetch('https://fakestoreapi.com/products/categories')
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error(`HTTP error! Failed to fetch initial data.`);
        }

        const productsData: Product[] = await productsResponse.json();
        const categoriesData: string[] = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // useMemo re-calculates the `filteredAndSortedProducts` only when dependencies change.
  const filteredAndSortedProducts = useMemo(() => {
    let processedProducts = [...products];

    if (selectedCategory) {
      processedProducts = processedProducts.filter(
        product => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      processedProducts = processedProducts.filter(product =>
        product.title.toLowerCase().includes(lowercasedSearchTerm) ||
        product.category.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    switch (sortOption) {
      case 'price-asc':
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        processedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        processedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return processedProducts;
  }, [products, selectedCategory, searchTerm, sortOption]);

  if (loading) {
    return <div className="container mx-auto p-4 flex justify-center items-center h-64">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 flex justify-center items-center h-64 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">

      <Navigation
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      
      <ProductList products={filteredAndSortedProducts} />
    </div>
  );
}

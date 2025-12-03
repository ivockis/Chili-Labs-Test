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

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 8; // Number of products to display per page

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

    // Reset to first page whenever filters or sorts change
    setCurrentPage(1);

    return processedProducts;
  }, [products, selectedCategory, searchTerm, sortOption]);

  // Calculate current products to display based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // If filters or sorts change, ensure we are on a valid page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [currentPage, totalPages]);


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
      
      <ProductList products={currentProducts} />

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 border rounded-lg shadow-sm ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

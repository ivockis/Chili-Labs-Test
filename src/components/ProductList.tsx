"use client";

import React from 'react';
import Link from 'next/link';

// The Product interface should be defined where it's most used, 
// or in a central 'types' file. For now, we define it here.
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} passHref>
          <div className="group border rounded-lg shadow-lg p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-shadow duration-200 h-full overflow-hidden">
            <img src={product.image} alt={product.title} className="w-32 h-32 object-contain mb-4 transition-transform duration-300 group-hover:scale-120" />
            <div className="flex flex-col flex-grow justify-between">
              <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
              <div>
                <p className="text-gray-700 font-bold mb-1">${product.price.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">{product.category}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
// components/product/product-card.tsx
"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatPriceToNaira } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  // Memoize price formatting
  const formattedPrice = useMemo(
    () => formatPriceToNaira(product.current_price),
    [product.current_price]
  );

  const formattedOldPrice = useMemo(
    () => (product.old_price ? formatPriceToNaira(product.old_price) : null),
    [product.old_price]
  );

  const discount = useMemo(() => {
    if (!product.old_price) return null;
    const oldPrice = product.old_price;
    const currentPrice = product.current_price;
    if (oldPrice <= currentPrice) return null;
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  }, [product.old_price, product.current_price]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
      <Link href={`/product/${product.id}`} className="relative block">
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
            -{discount}%
          </div>
        )}

        {/* Flash Sale Badge */}
        {product.is_on_flash_sales && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-bold z-10">
            FLASH SALE
          </div>
        )}

        <Image
          src={product.thumbnail}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      </Link>

      <div className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <p className="text-gray-800 text-lg font-semibold">
            {formattedPrice}
          </p>
          {formattedOldPrice && (
            <p className="text-gray-400 text-sm line-through">
              {formattedOldPrice}
            </p>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mb-3 text-sm">
          {product.is_in_stock ? (
            <span className="text-green-600">In Stock ({product.stock})</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>

        <Button
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!product.is_in_stock}
        >
          {product.is_in_stock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}

// Memoize to prevent re-renders when parent re-renders
export const ProductCard = memo(ProductCardComponent);

"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { formatPriceToNaira } from "@/lib/utils";
import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  // Memoize expensive calculations
  const formattedCurrentPrice = useMemo(
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative w-full h-96">
        <img
          src={product.thumbnail}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

        <div className="flex items-center gap-3 mb-4">
          <p className="text-2xl font-semibold text-gray-800">
            {formattedCurrentPrice}
          </p>
          {formattedOldPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formattedOldPrice}
              </span>
              {discount && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>

        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex items-center space-x-4 mb-6">
          <Button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
          {product.is_on_flash_sales && (
            <span className="bg-yellow-400 text-black px-3 py-1 rounded font-medium">
              Flash Sale
            </span>
          )}
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <p>
            <strong>Vendor:</strong> {product.vendor.brand_name}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock} units
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={product.stock > 0 ? "text-green-600" : "text-red-600"}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

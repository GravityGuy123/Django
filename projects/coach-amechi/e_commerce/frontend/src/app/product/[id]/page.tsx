import { Suspense } from "react";
import { GetProductDetails } from "@/lib/data";
import { ProductDetailsSkeleton } from "@/components/product/product-skeleton";
import { ProductDetails } from "@/components/product/product-details";

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

// component
export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetailsContent id={id} />
      </Suspense>
    </div>
  );
}

// Separate async component for data fetching
async function ProductDetailsContent({ id }: { id: string }) {
  const product = await GetProductDetails(id);

  if (!product) {
    return (
      <div className="text-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}

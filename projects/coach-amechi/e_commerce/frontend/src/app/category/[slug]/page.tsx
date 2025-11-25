import { Suspense } from "react";
import CategoryContent from "@/components/product/category";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";

interface Props {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: Props) {
  return (
    <div className="container mx-auto px-6 py-16">
      <Suspense fallback={<CategoryPageSkeleton slug={params.slug} />}>
        <CategoryContent slug={params.slug} />
      </Suspense>
    </div>
  );
}

function CategoryPageSkeleton({ slug }: { slug: string }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-10">
        Products in category: {slug}
      </h1>
      <ProductGridSkeleton count={8} />
    </>
  );
}

// Add metadata for SEO
export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.slug} Products`,
    description: `Browse products in ${params.slug} category`,
  };
}

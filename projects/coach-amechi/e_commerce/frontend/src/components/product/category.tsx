import { getCategories } from "@/lib/data";
import { notFound } from "next/navigation";
import ProductGrid from "./product-grid";

interface CategoryContentProps {
  slug: string;
}

export default async function CategoryContent({ slug }: CategoryContentProps) {
  const products = await getCategories(slug);

  if (!products || products.length === 0) {
    notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-10">
        Products in category: {slug}
      </h1>
      <ProductGrid products={products} />
    </>
  );
}

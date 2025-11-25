import ProductGrid from "@/components/product/product-grid";
import { GetAllProductDetails } from "@/lib/data";
import { Product } from "@/lib/types";

export default function ProductList() {
  return <LisProducts />;
}

async function LisProducts() {
  const products: Product[] | undefined = await GetAllProductDetails();
  if (!products) {
    return <div>No products found</div>;
  }
  return <ProductGrid products={products} />;
}

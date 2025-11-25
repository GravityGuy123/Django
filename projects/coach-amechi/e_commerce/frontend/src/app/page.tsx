import { Button } from "@/components/ui/button";
import Image from "next/image";

// Placeholder data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$99.99",
    imageUrl: "/head-phones.webp",
  },
  {
    id: 2,
    name: "Smartwatch",
    price: "$199.99",
    imageUrl: "/smart-watch.webp",
  },
  {
    id: 3,
    name: "Modern Camera",
    price: "$499.99",
    imageUrl: "/head-phones.webp",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: "$129.99",
    imageUrl: "/nike-shoes.webp",
  },
];

// Placeholder data for categories
const categories = [
  {
    name: "Electronics",
    imageUrl: "/laptop.avif",
  },
  {
    name: "Home Goods",
    imageUrl: "/kitchen.avif",
  },
  {
    name: "Fashion",
    imageUrl: "/fashion.avif",
  },
  {
    name: "Sports",
    imageUrl: "/laptop.avif",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center text-white bg-[url('/hero.avif')]">
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center"></div>
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Find Your Next Favorite Thing
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg">
            Explore our curated collection of high-quality products, designed to
            fit your lifestyle.
          </p>
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-lg mb-4">{product.price}</p>
                  <Button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative rounded-lg overflow-hidden shadow-lg group"
              >
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">
                    {category.name}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-blue-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a href="#" className="text-white text-xl font-bold">
                    Shop {category.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Button } from "../ui/button";

export function NavBar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-blue-600">
          ShopSphere
        </a>
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="text-gray-600 hover:text-blue-500">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-500">
            Shop
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-500">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-500">
            Contact
          </a>
          <Link
            href={"/auth/register"}
            className="text-gray-600 hover:text-blue-500"
          >
            Register
          </Link>
          <Link
            href={"/auth/login"}
            className="text-gray-600 hover:text-blue-500"
          >
            Login
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="text-gray-600 hover:text-blue-500">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </Button>
          <Button className="text-gray-600 hover:text-blue-500">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </Button>
        </div>
      </nav>
    </header>
  );
}

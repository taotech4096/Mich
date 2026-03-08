import { prisma } from "@/lib/db";
import { serializeProducts, serializeCategories } from "@/lib/serialize";
import { ProductsClient } from "./_components/products-client";

export const dynamic = "force-dynamic";

async function getProductsData(categorySlug?: string) {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug
          ? { category: { slug: categorySlug } }
          : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
  ]);
  return { 
    categories: serializeCategories(categories), 
    products: serializeProducts(products),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const { categories, products } = await getProductsData(searchParams?.categoria);
  return <ProductsClient categories={categories} products={products} currentCategory={searchParams?.categoria} />;
}

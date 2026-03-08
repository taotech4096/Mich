import { prisma } from "@/lib/db";
import { serializeProducts, serializeCategories } from "@/lib/serialize";
import { HomeClient } from "./_components/home-client";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      take: 8,
    }),
  ]);
  return { 
    categories: serializeCategories(categories), 
    featuredProducts: serializeProducts(featuredProducts),
  };
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();
  return <HomeClient categories={categories} featuredProducts={featuredProducts} />;
}

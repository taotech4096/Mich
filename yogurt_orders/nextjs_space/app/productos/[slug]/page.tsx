import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./_components/product-detail-client";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return serializeProduct(product);
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params?.slug ?? "");

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

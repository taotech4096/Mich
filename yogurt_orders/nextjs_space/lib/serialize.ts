// Utility to serialize Prisma objects with Decimal fields
export function serializeProduct(product: any): any {
  if (!product) return null;
  return {
    ...product,
    price: product?.price ? Number(product.price) : 0,
    comparePrice: product?.comparePrice ? Number(product.comparePrice) : null,
    createdAt: product?.createdAt?.toISOString?.() ?? product?.createdAt ?? null,
    updatedAt: product?.updatedAt?.toISOString?.() ?? product?.updatedAt ?? null,
    category: product?.category ? { ...product.category } : null,
  };
}

export function serializeProducts(products: any[]): any[] {
  return (products ?? []).map(serializeProduct);
}

export function serializeCategory(category: any): any {
  if (!category) return null;
  return {
    ...category,
  };
}

export function serializeCategories(categories: any[]): any[] {
  return (categories ?? []).map(serializeCategory);
}

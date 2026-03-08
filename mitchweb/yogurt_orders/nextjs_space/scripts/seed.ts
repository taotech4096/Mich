import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "john@doe.com";
  let adminPlainPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPlainPassword && process.env.NODE_ENV !== "production") {
    adminPlainPassword = "change-me-dev-password";
    console.warn("WARNING: Using default dev admin password. Set SEED_ADMIN_PASSWORD to override.");
  }

  if (!adminPlainPassword) {
    throw new Error("Missing SEED_ADMIN_PASSWORD. Set it before running seed in production.");
  }

  const adminPassword = await bcrypt.hash(adminPlainPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrador",
      password: adminPassword,
      role: "ADMIN",
      phone: "2221234567",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create categories
  const categories = [
    { name: "Yogurts", slug: "yogurts", description: "Yogurts naturales y con frutas", order: 1 },
    { name: "Jocoque", slug: "jocoque", description: "Jocoque natural y seco", order: 2 },
    { name: "Hummus", slug: "hummus", description: "Hummus de diferentes sabores", order: 3 },
    { name: "Otros", slug: "otros", description: "Otros productos artesanales", order: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("Categories created");

  // Get category IDs
  const yogurtCat = await prisma.category.findUnique({ where: { slug: "yogurts" } });
  const jocoqueCat = await prisma.category.findUnique({ where: { slug: "jocoque" } });
  const hummusCat = await prisma.category.findUnique({ where: { slug: "hummus" } });
  const otrosCat = await prisma.category.findUnique({ where: { slug: "otros" } });

  // Create products
  const products = [
    // Yogurts
    {
      name: "Yogurt Natural 1L",
      slug: "yogurt-natural-1l",
      description: "Yogurt natural sin azucar, cremoso y delicioso. Perfecto para acompanar con frutas o granola.",
      price: 65,
      categoryId: yogurtCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      stock: 50,
      unit: "litro",
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Yogurt Natural 500ml",
      slug: "yogurt-natural-500ml",
      description: "Yogurt natural sin azucar en presentacion mediana.",
      price: 38,
      categoryId: yogurtCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400",
      stock: 40,
      unit: "500ml",
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Yogurt con Fresa 1L",
      slug: "yogurt-fresa-1l",
      description: "Yogurt con mermelada de fresa natural. Dulce y refrescante.",
      price: 75,
      categoryId: yogurtCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
      stock: 30,
      unit: "litro",
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Yogurt con Durazno 1L",
      slug: "yogurt-durazno-1l",
      description: "Yogurt con mermelada de durazno natural.",
      price: 75,
      categoryId: yogurtCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400",
      stock: 25,
      unit: "litro",
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Yogurt Griego Natural",
      slug: "yogurt-griego-natural",
      description: "Yogurt griego extra cremoso, alto en proteina.",
      price: 85,
      categoryId: yogurtCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400",
      stock: 20,
      unit: "500ml",
      isActive: true,
      isFeatured: true,
    },
    // Jocoque
    {
      name: "Jocoque Natural 500g",
      slug: "jocoque-natural-500g",
      description: "Jocoque cremoso tradicional, perfecto para tacos o como dip.",
      price: 55,
      categoryId: jocoqueCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400",
      stock: 35,
      unit: "500g",
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Jocoque Seco 300g",
      slug: "jocoque-seco-300g",
      description: "Jocoque seco tradicional libanesa, ideal para platillos arabes.",
      price: 65,
      categoryId: jocoqueCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400",
      stock: 20,
      unit: "300g",
      isActive: true,
      isFeatured: false,
    },
    // Hummus
    {
      name: "Hummus Clasico 250g",
      slug: "hummus-clasico-250g",
      description: "Hummus tradicional con tahini, aceite de oliva y limon.",
      price: 58,
      categoryId: hummusCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400",
      stock: 30,
      unit: "250g",
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Hummus con Chile",
      slug: "hummus-chile-250g",
      description: "Hummus con un toque picante de chile chipotle.",
      price: 62,
      categoryId: hummusCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
      stock: 25,
      unit: "250g",
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Hummus de Pimiento Rojo",
      slug: "hummus-pimiento-250g",
      description: "Hummus con pimiento rojo asado.",
      price: 62,
      categoryId: hummusCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      stock: 20,
      unit: "250g",
      isActive: true,
      isFeatured: false,
    },
    // Otros
    {
      name: "Labneh 200g",
      slug: "labneh-200g",
      description: "Queso crema arabe tradicional, untable y delicioso.",
      price: 68,
      categoryId: otrosCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400",
      stock: 15,
      unit: "200g",
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Queso Cottage 400g",
      slug: "queso-cottage-400g",
      description: "Queso cottage fresco, bajo en grasa y alto en proteina.",
      price: 72,
      categoryId: otrosCat?.id ?? "",
      imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400",
      stock: 20,
      unit: "400g",
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const product of products) {
    if (!product.categoryId) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log("Products created:", products.length);

  // Create settings
  await prisma.settings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      businessName: "Tienda Artesanal",
      phone: "222 123 4567",
      email: "contacto@tiendaartesanal.mx",
      whatsapp: "522221234567",
      deliveryDays: ["Martes", "Viernes"],
      minOrderAmount: 100,
      defaultDeliveryFee: 0,
      mercadoPagoEnabled: false,
      cashEnabled: true,
      transferEnabled: true,
    },
  });
  console.log("Settings created");

  // Create delivery zones
  await prisma.deliveryZone.upsert({
    where: { id: "zona-puebla-cholula" },
    update: {},
    create: {
      id: "zona-puebla-cholula",
      name: "Puebla y Cholula",
      cities: ["Puebla", "Cholula", "San Andres Cholula", "San Pedro Cholula"],
      colonies: [],
      zipCodes: [],
      fee: 0,
      isActive: true,
    },
  });
  console.log("Delivery zones created");

  console.log("\nDatabase seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

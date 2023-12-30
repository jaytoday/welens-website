import type { User, Product } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Product } from "@prisma/client";

export function getProduct({
  id,
  userId,
}: Pick<Product, "id"> & {
  userId: User["id"];
}) {
  return prisma.product.findFirst({
    where: { id, userId },
  });
}

export function getProductBySlug({
  slug,
}: Pick<Product, "slug">) {
  return prisma.product.findFirst({
    where: { slug },
  });
}

export function getProductsOwnedByUser({ userId }: { userId: User["id"] }) {
  return prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getProducts() {
  return prisma.product.findMany({
    where: { },
    orderBy: { createdAt: "desc" },
  });
}

export function createProduct({
  description,
  name,
  slug,
  userId,
  productUrl,
  thumbnailUrl,
  integrationSettings,
}: Pick<Product, "description" | "name" | "slug" | "productUrl" | "thumbnailUrl" | "integrationSettings"> & {
  userId: User["id"];
}) {
  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      integrationSettings: String(integrationSettings), 
      productUrl,
      thumbnailUrl,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateProduct({
  id,
  description,
  name,
  productUrl,
  thumbnailUrl,
  integrationSettings,
}: Pick<Product, "description" | "name" | "productUrl" | "thumbnailUrl" | "integrationSettings" | "id">) {
  // For now, the slug cannot be updated. 
  // Updating the slug would likely require a way to resolve URLs to slugs that have been changed since the URL was shared. 
  return prisma.product.update({
    where: {
      id, // Use the product's ID to identify which product to update
    },
    data: {
      name,
      description,
      productUrl,
      thumbnailUrl,
      integrationSettings: String(integrationSettings),
    },
  });
}

export function deleteProduct({
  id,
  userId,
}: Pick<Product, "id"> & { userId: User["id"] }) {
  return prisma.product.deleteMany({
    where: { id, userId },
  });
}

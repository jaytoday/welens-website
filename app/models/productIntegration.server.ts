import type { User, Product, ProductIntegration } from "@prisma/client";

import { prisma } from "~/db.server";

export type { ProductIntegration } from "@prisma/client";

export function getProductIntegration({
  id,
}: Pick<ProductIntegration, "id">) {
  return prisma.productIntegration.findFirst({
    where: { id },
  });
}

export function getProductIntegrationByUserIdAndProductId({
  userId,
  productId,
}: Pick<ProductIntegration, "userId" | "productId">) {
  return prisma.productIntegration.findFirst({
    where: {
      userId,
      productId,
    },
  });
}


export function createProductIntegration({
  userId,
  productId,
  configuration,
}: Pick<ProductIntegration, "configuration"> & {
  userId: User["id"];
  productId: Product["id"];
}) {
  return prisma.productIntegration.create({
    data: {
      configuration: String(configuration),
      status: "pendingCreation",
      configurationUpdatedAt: new Date().toISOString(), // UTC time
      user: {
        connect: {
          id: userId,
        },
      },
        product: {
          connect: {
            id: productId,
          },
      },
    },
  });
}

export function updateProductIntegrationConfiguration({
  id,
  configuration,
}: Pick<ProductIntegration, "configuration" | "id"> & {
  userId: User["id"];
}) {
  // Another method should be used for non-configuration updates
  // For now, the slug cannot be updated. 
  // Updating the slug would likely require a way to resolve URLs to slugs that have been changed since the URL was shared. 
  return prisma.productIntegration.update({
    where: {
      id: id, // Use the product's ID to identify which product to update
    },
    data: {
      configuration: String(configuration),
      status: "pendingUpdate",
      // set as now()
      configurationUpdatedAt: new Date().toISOString(), // UTC time
    },
  });
}

export function updateProductIntegration({
  id,
  gptId,
  status,
}: Pick<ProductIntegration, "gptId" | "id"> & Partial<Pick<ProductIntegration, "status">>) {
  return prisma.productIntegration.update({
    where: {
      id: id, // Use the product's ID to identify which product to update
    },
    data: {
      gptId,
      ...(status !== undefined && { status }), // Conditionally include status if it's not undefined
    },
  });
}


export function deleteProductIntegration({
  id,
  userId,
}: Pick<Product, "id"> & { userId: User["id"] }) {
  return prisma.productIntegration.deleteMany({
    where: { id, userId },
  });
}


export function getProductIntegrations(
    limit = 1000, 
    orderBy='updatedAt',
    orderDirection='desc'
  ) {
  return prisma.productIntegration.findMany({
      take: limit,
      orderBy: [
          { [orderBy]: orderDirection }, 
      ],
      include: {
          user: {
              select: { email: true }
          },
          product: {
              select: { name: true }
          }
      }
  });
}
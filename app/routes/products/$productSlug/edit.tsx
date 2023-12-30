import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Link } from "@remix-run/react";

import ProductForm  from '~/components/product/ProductForm';
import { requireUserId } from "~/session.server";
import type { Product } from "~/models/product.server";
import { getProductBySlug } from "~/models/product.server";
import { handleProductForm } from '~/actions/handleProductForm';
import Button from "~/components/shared/button";

type LoaderData = {
    product: Product;
    userId?: string;
  };


export const loader: LoaderFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    invariant(params.productSlug, "product not found");

    const product = await getProductBySlug({ slug: params.productSlug });
    if (!product) {
      throw new Response("Not Found", { status: 404 });
    }
    if (!userId || userId !== product.userId) {
        throw new Response("Forbidden", { status: 403 });
    }
    return json<LoaderData>({ product, userId });
  };

export const action: ActionFunction = async ({ request }) => {
return handleProductForm(request, 'edit');
};

export default function EditProductPage() {
  const actionData = useActionData();
  const productData = useLoaderData(); // Assuming you've loaded the product data

  
  return (
    <>
    <ProductForm mode="edit" productId={productData.product.id} defaultValues={productData.product} actionData={actionData} />
    <div className="ml-6 pb-8">
      <Link to={`/products/${productData.product.slug}`}>
        <Button theme="gray" size="small">Cancel</Button>
      </Link>
    </div>
    </>

  );
}
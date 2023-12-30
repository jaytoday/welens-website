import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Link } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import ProductForm from "~/components/product/ProductForm";
import { handleProductForm } from '~/actions/handleProductForm';
import Button from "~/components/shared/button";

interface LinkItem {
  id: number;
  url: string;
}

interface FileItem {
  id: number;
  fileName: string;
}

interface QuestionItem {
  id: number;
  text: string;
}




export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return null;
};



export const action: ActionFunction = async ({ request }) => {
  return handleProductForm(request, 'create');
};

export default function NewProductPage() {
  const actionData = useActionData();

  return (
    <>
    <ProductForm mode="create" actionData={actionData} />
    <div className="ml-6 pb-8">
      <Link to={`/products`}>
        <Button theme="gray" size="small">Back</Button>
      </Link>
    </div>
    </>
  );
}
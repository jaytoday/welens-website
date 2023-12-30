import { type } from "os";

import { json, redirect } from "@remix-run/node";

import { createProduct, updateProduct } from "~/models/product.server";
import { requireUserId } from "~/session.server";
import { formatUrl } from "~/utils";

type ActionData = {
  errors?: {
    name?: string;
    description?: string;
  };
};

type ProductParams = {
  name: string;
  description: string;
  integrationSettings: string;
  slug?: string;
  userId?: string;
  productUrl: string|null;
  thumbnailUrl: string|null;
}

type CreateProductParams = ProductParams & {
  userId: string;
  slug: string;
}

export async function handleProductForm(request: Request, mode: 'create' | 'edit') {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const productId = formData.get("productId") as string;

  const validateName = (name: string): string|undefined => {
    if (name.length === 0) {
      return "Product name is required"
    }
    // TODO: need to check that name/slug isn't taken
    const MIN_PRODUCT_NAME_CHARACTERS = 6;
    if (name.length < MIN_PRODUCT_NAME_CHARACTERS) {
      return `Product name must be at least ${MIN_PRODUCT_NAME_CHARACTERS} characters`;
    }
    return undefined;
  }

  const validateDescription = (description: string): string|undefined => {
    if (description.length === 0) {
      return "Product description is required";
    }
    return undefined;
  }

  const nameError = validateName(formData.get("name") as string);
  if (nameError){
    return json<ActionData>(
      { errors: { name: nameError } },
      { status: 400 }
    );
  }
  const descriptionError = validateDescription(formData.get("description") as string);
  if (descriptionError){
    return json<ActionData>(
      { errors: { description: descriptionError } },
      { status: 400 }
    );
  }

  // extract links from form data 
  let links = [];
  let questions = [];
  let files = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('links[')) {
      links.push(value as string);
    } else if (key.startsWith('questions[')) {
      questions.push(value as string);
    } else if (key.startsWith('files[')) {
      files.push(value as string);
    }
  }

  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }
  
  const productParams: ProductParams = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    productUrl: formatUrl(String(formData.get("productUrl"))),
    thumbnailUrl: formatUrl(String(formData.get("thumbnailUrl"))),
    // Does this need to be JSONified?
    integrationSettings: JSON.stringify({
      links: links,
      files: files,
      questions: questions,
    }),
  };

  if (mode === "create"){
    productParams.userId = userId;
    productParams.slug = slugify(formData.get("name") as string);  // TODO: check uniqueness!
  }

  try {
    if (mode === 'create') {
      const product = await createProduct(productParams as CreateProductParams);
      return redirect(`/products/${product.slug}`);
    } else if (mode === 'edit' && productId) {
      const product = await updateProduct({ ...productParams, id: productId });
      return redirect(`/products/${product.slug}`);
    } else {
      throw new Error('Invalid operation');
    }
  } catch (error) {
    console.error(error);
    // Handle error
    return json({ error: 'Failed to process the form' }, { status: 500 });
  }
}

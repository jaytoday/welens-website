import { Link } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Product} from "~/models/product.server";
import { getProducts } from "~/models/product.server";
import Button from "~/components/shared/button";
import BaseLayout from "~/components/shared/base-layout";
import Card from "~/components/shared/card";

type LoaderData = {
  products: Product[]
};

export const loader: LoaderFunction = async ({ request, params }) => {
const products: Product[] = await getProducts();
return json<LoaderData>({ products });
};
export default function ProductIndexPage() {
  const data = useLoaderData<LoaderData>();


  return (
    <BaseLayout title="Products">
      <ul className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products.length > 0 ? data.products.map((product) => (
          <li className="col-span-1" key={product.id}>
            <Link to={`/products/${product.slug}`}>
              <Card title={product.name} className="h-32">
                <div className="flex items-start space-x-4">
                  {product.thumbnailUrl && (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded" 
                    />
                  )}
                  <div>
                    <p className={product.thumbnailUrl ? 'mt-1' : ''}>{product.description}</p>
                    {product.productUrl && (
                      <div className="mt-2">
                        <Link className="font-bold text-sm text-primary-300 hover:text-primary-700 focus:outline-none focus:underline transition ease-in-out duration-150" to={product.productUrl}>
                          {product.productUrl}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

            </Link>
          </li>
        )) : <li>No products found</li>}
      </ul>
      <p className="mt-20 mx-4">
        <Link to="/products/new">
          <Button size="small" theme="primary">Create New Product</Button>
        </Link>
      </p>
    </BaseLayout>
  );
}


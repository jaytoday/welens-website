import { useEffect, useState } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Product } from "~/models/product.server";
import { getProductBySlug } from "~/models/product.server";
import type { ProductIntegration} from "~/models/productIntegration.server";
import { createProductIntegration, updateProductIntegrationConfiguration, getProductIntegrationByUserIdAndProductId } from "~/models/productIntegration.server";
import { getUserId, getLoginRedirectUrl, requireUserId } from "~/session.server";
import HelpText from '~/components/shared/help-text';
import BaseLayout from "~/components/shared/base-layout";
import { formatUrl } from "~/utils";
import Button from "~/components/shared/button";

type LoaderData = {
  product: Product;
  userId?: string;
  loginRedirectUrl: string;
  existingProductIntegration: ProductIntegration | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const loginRedirectUrl = await getLoginRedirectUrl(request);
  invariant(params.productSlug, "product not found");

  const product = await getProductBySlug({ slug: params.productSlug });
  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const existingProductIntegration = userId
    ? await getProductIntegrationByUserIdAndProductId({ 
        userId, 
        productId: product.id 
      })
    : null;

  return json<LoaderData>({ product, userId, loginRedirectUrl, existingProductIntegration });
};

type Configuration = {
  questions: string[];
  answers: string[];
}
type ActionData = {
  productIntegration: ProductIntegration;
};

export const action: ActionFunction = async ({ request }) => {

  const userId = await requireUserId(request);
  const formData = await request.formData();
  const configuration: Configuration = { 
    questions: [], 
    answers: [] 
  };
  for (const [key, value] of formData.entries()) {
    console.log('form value', key, value);
    
    if (key.startsWith('question')) {
      configuration.questions.push(value as string);
    } else if (key.startsWith('answer')) {
      configuration.answers.push(value as string);
    } 
  }

    // Check if an existing product integration exists
    const existingIntegration = await getProductIntegrationByUserIdAndProductId({ 
      userId, 
      productId: String(formData.get('productId')) 
    });
  
    let productIntegration;
    if (existingIntegration) {
      // Update existing integration
      productIntegration = await updateProductIntegrationConfiguration({
        id: existingIntegration.id,
        configuration: JSON.stringify(configuration),
        userId
      });
    } else {
      // Create new integration
      productIntegration = await createProductIntegration({
        userId,
        productId: String(formData.get('productId')),
        configuration: JSON.stringify(configuration),
      });
    }
  
    console.log(productIntegration);
    return json<ActionData>({ productIntegration });

  };
  

export default function ProductDetailsPage() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  const integrationSettings = JSON.parse(String(data.product.integrationSettings));

  const isProductOwner = data.userId && data.userId === data.product.userId;

  const [productIntegration, setProductIntegration] = useState<ProductIntegration | null>(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);

  useEffect(() => {
    if (actionData?.productIntegration){
      setProductIntegration(actionData.productIntegration);
    }
    else if (data?.existingProductIntegration){
      setProductIntegration(data.existingProductIntegration);
    }
  }, [data?.existingProductIntegration, actionData?.productIntegration]); 



  return (
    <div className="p-6 text-gray-100 rounded-lg shadow-md" style={{ maxWidth: '800px', margin: 'auto' }}>
      <Button theme="gray" size="xs">
        <Link to="/products">Products</Link>
      </Button>
       <div className="form-section mt-4 bg-gray-800 p-4 rounded-md">
                  <div className="flex items-start space-x-4">
                {data.product.thumbnailUrl && (
                    <img
                        src={data.product.thumbnailUrl}
                        alt={data.product.name}
                        className="w-32 h-32 rounded" // 128x128px with rounded corners
                    />
                )}
                <div>
                    <h1 className="text-xl font-semibold mb-2">{data.product.name}</h1>
                    <div className="mb-2">
                        <HelpText>{data.product.description}</HelpText>
                        {data.product.productUrl && (
                            <div className="mt-2">
                                <Link className="font-bold text-sm text-primary-300 hover:text-primary-700 focus:outline-none focus:underline transition ease-in-out duration-150" to={data.product.productUrl}>
                                    {data.product.productUrl}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

              {isProductOwner && (
                <div className="pt-4">
                  <Link to={`/products/${data.product.slug}/edit`}><button className="rounded-md border border-secondary-800 bg-secondary-800 px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-secondary-700 hover:bg-secondary-700 focus:ring focus:ring-secondary-200 disabled:cursor-not-allowed disabled:border-secondary-300 disabled:bg-secondary-300">Edit Product Settings</button></Link>
                  
                </div>
          )}
        </div>
   
        {data.userId ? (
      <ProductIntegrationSetup 
        productId={data.product.id} 
        integrationSettings={integrationSettings} 
        hasUnsavedChanges={hasUnsavedChanges} 
        productIntegration={productIntegration}
        setHasUnsavedChanges={setHasUnsavedChanges}
        setProductIntegration={setProductIntegration}
      />
    ) : (
      <LoginRequired loginRedirectUrl={data.loginRedirectUrl} />
    )}
    
    </div>
  );
}



const LoginRequired = ({ loginRedirectUrl }: { loginRedirectUrl: string }) => {
  return (
    <div className="mt-10 form-section bg-gray-800 p-4 rounded-md">
          <div>Login to setup a custom product integration AI assistant.</div>
          
           <div className="mt-4">
             <Link to={loginRedirectUrl}>
              <button className="rounded-lg border border-primary-800 bg-primary-800 px-4 py-3 text-center text-md font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                Login
              </button>
              </Link>
          </div>
        </div>
  );
}

type IntegrationSettings = {
  questions: string[]
}

interface ProductIntegrationSetupProps {
  integrationSettings: IntegrationSettings
  productId: string;
  hasUnsavedChanges: boolean;
  productIntegration: ProductIntegration | null;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setProductIntegration: React.Dispatch<React.SetStateAction<ProductIntegration | null>>;
}
const ProductIntegrationSetup: React.FC<ProductIntegrationSetupProps> = ({
  integrationSettings,
  productId,
  hasUnsavedChanges,
  productIntegration,
  setHasUnsavedChanges,
  setProductIntegration
}) => {

  const [answers, setAnswers] = useState<string[]>([]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    console.log('useEffect', productIntegration);
    if (productIntegration) {
      const configuration = JSON.parse(String(productIntegration.configuration));
      setAnswers(configuration.answers);
      console.log('answers set',configuration.answers );
    }
  }, [productIntegration]);


  return (
    <Form method="post" onSubmit={handleSubmit}>
      <input type="hidden" name="productId" value={productId} />
    <div className="mt-10 form-section bg-gray-800 p-4 rounded-md">
      <h2 className="text-xl">Create Your Custom AI Solution Engineer</h2>
      <div className="mb-8">
        <HelpText>Answer the questions below to create an AI solution engineer customized for your integration of this product.</HelpText>
        </div>
          {integrationSettings.questions.map((question: any, index: number) => (
            <div key={index} className="mb-4">
              <label htmlFor={`question${index}`} className="block text-sm font-medium text-gray-300 mb-2">
                {question}
              </label>
              <input type="hidden" name={`question${index}`} value={question} />
              <textarea 
                placeholder="Write your answer here..."
                id={`answer${index}`} 
                name={`answer${index}`}
                value={answers[index]}
                onChange={(event) => {
                  setAnswers(prevState => {
                    const newState = [...prevState];
                    newState[index] = event.target.value;
                    return newState;
                  });
                  setHasUnsavedChanges(true);
                }}
                rows={5} 
                className="w-full text-gray-800 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          ))}
           <div className="mt-10">
            {hasUnsavedChanges ? (
              <button type="submit" className="rounded-lg border border-primary-800 bg-primary-800 px-4 py-3 text-center text-md font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
                <div className="flex space-x-4">
                  <div className="flex h-10 w-0 -mr-2 items-center justify-center text-green-500">
                  </div>
                  <div className="flex-1">
                    <h4 className="pr-2 pt-2 font-medium text-white">Save Changes</h4>
                  </div>
               </div>
              </button>
            ) :
            
            (
              <div className="space-y-5">
              <div className="relative  max-w-[400px] rounded-xl border border-secondary-50 bg-white p-4 text-sm shadow-lg">
                <button className="hidden absolute top-4 right-4 ml-auto text-secondary-500 hover:text-secondary-900">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <h4 className="pr-6 font-medium text-secondary-900">Preparing Your AI Solution Engineer</h4>
                    <div className="mt-1 text-secondary-500">You will receive an email when your AI solution engineer has been created.</div>
                    <div className="hidden mt-2 flex space-x-4">
                      <button className="inline-block font-medium leading-loose text-secondary-500 hover:text-secondary-900">Dismiss</button>
                      <button className="inline-block font-medium leading-loose text-primary-600 hover:text-primary-700">View more</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
              
    
          </div>
        </div>
      </Form>
    );
  }

  

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <BaseLayout title="Unexpected Error" subtitle={error.message}></BaseLayout>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Product not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

import { useState, useEffect } from 'react';
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {  useCatch, useLoaderData } from "@remix-run/react";
import { Resend } from 'resend';

import type { ProductIntegration} from "~/models/productIntegration.server";
import { getProductIntegrations } from "~/models/productIntegration.server"
import { requireUser } from "~/session.server";
import BaseLayout from "~/components/shared/base-layout";
import { gptUrl } from "~/utils/product-utils";
import IntegrationModal from '~/components/admin/IntegrationModal';
import IntegrationSummary from '~/components/admin/IntegrationSummary';
import { updateProductIntegration } from '~/models/productIntegration.server';

import { GptCreatedEmailTemplate } from '../../components/emailTemplates/gpt-created'
import { GptUpdatedEmailTemplate } from '../../components/emailTemplates/gpt-updated'




type LoaderData = {
    integrations: ProductIntegration[]
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  console.log(user);
  if (!user || user?.role !== "admin") {
    return redirect("/");
  }
  const integrations = await getProductIntegrations();
  return json<LoaderData>({ integrations });
};

type ActionData = {

}

export const action: ActionFunction = async ({ request }) => {
    const user = await requireUser(request);

    const email_to = process.env.DEBUG_EMAIL_TO || user.email;
    if (!user || user?.role !== "admin") {
      throw new Response("Forbidden", { status: 403 });
    }

    const formData = await request.formData();
    const params: any = {
        id: String(formData.get("integrationId")),
        gptId: String(formData.get("gptId")),
      };
      if (formData.get("setCreated")){
        params.status = 'created';
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'WithAI <info@getwith.ai>',
            to: [email_to],
            subject: 'Your AI Assistant is ready!',
            react: GptCreatedEmailTemplate({ 
                productName: formData.get("productName") as string,
                gptLink: gptUrl(formData.get("gptId") as string),
             }),
          });
          console.log('email response', data, error);
      }
      if (formData.get("setUpdated")){
        params.status = 'updated';
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'WithAI <info@getwith.ai>',
            to: [email_to],
            subject: 'Your AI Assistant has been updated!',
            react: GptUpdatedEmailTemplate({ 
                productName: formData.get("productName") as string,
                gptLink: gptUrl(formData.get("gptId") as string),
             }),
          });
          console.log('email response', data, error);
      }
    await updateProductIntegration(params);
    

    return json<ActionData>({});
}

export default function Integrations() {
    const { integrations } = useLoaderData();
    const [filteredIntegrations, setFilteredIntegrations] = useState(integrations);
    const [selectedIntegration, setSelectedIntegration] = useState<ProductIntegration|null>(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        let result = integrations;
        if (filter !== 'All') {
            result = integrations.filter((integration: ProductIntegration) => integration.status === filter);
        }
        setFilteredIntegrations(result);
    }, [filter, integrations]);

    const handleFilterChange = (event: React.ChangeEvent)  => {
        setFilter(event.target.value);
    };

    return (
        <BaseLayout title="Integrations Admin UI" subtitle="Review and generate GPTs for each integration below">
            
            <select value={filter} className="text-gray-800" onChange={handleFilterChange}>
                <option value="All">All</option>
                <option value="pendingCreation">Pending Creation</option>
                <option value="pendingUpdate">Pending Update</option>
            </select>
            <div className="grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-3">
                {filteredIntegrations.map((integration: ProductIntegration) => (
                    <div className="m-6 p-3 border border-gray-300 text-gray-100 rounded-lg shadow-md cursor-pointer" onClick={() => setSelectedIntegration(integration)}  key={integration.id}>
                        {<IntegrationSummary integration={integration} />}
                    </div>
                ))}
            </div>
            {selectedIntegration && (
                <IntegrationModal integration={selectedIntegration} setSelectedIntegration={setSelectedIntegration} />
            )}
        </BaseLayout>
    );
}



  

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);
  
    return <BaseLayout title="Unexpected Error" subtitle={error.message}></BaseLayout>;
  }

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 403) {
    return <div>Oops! You don't have permission to view this page.</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

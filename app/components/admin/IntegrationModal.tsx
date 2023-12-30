import React, { useEffect, useRef } from 'react';
import type { ProductIntegration } from '@prisma/client';
import { Form } from '@remix-run/react';

import IntegrationSummary from './IntegrationSummary';
import Button from '../shared/button';

const IntegrationModal = ({ integration, setSelectedIntegration }: { integration: ProductIntegration, setSelectedIntegration: React.Dispatch<React.SetStateAction<ProductIntegration | null>> }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = React.useState(false);

    // Close modal when clicking outside of it
    // TODO: make a reusable modal component that includes this 
    useEffect(() => {
        const handleModalClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setSelectedIntegration(null);
            }
        };

        document.addEventListener('mousedown', handleModalClick);
        return () => document.removeEventListener('mousedown', handleModalClick);
    }, [setSelectedIntegration]);

    
    const configuration = JSON.parse(String(integration.configuration));
    const integrationSettings = JSON.parse(String(integration?.product?.integrationSettings || '{}'));
    console.log(configuration);

    const disableSavebutton = () => {
        setIsSaveButtonDisabled(true);
        setTimeout(() => {
            setIsSaveButtonDisabled(false);
        }, 3000);
        return true;
    }
    


    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-10" style={{ backgroundColor: 'rgba(100,100,100,.8)' }}>
            <div ref={modalRef} className="m-10 p-10 text-gray-800 w-full h-full rounded-lg overflow-hidden bg-white shadow-xl relative overflow-scroll">
                {/* X Button */}
                <button
                    onClick={() => setSelectedIntegration(null)}
                    className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                    X
                </button>
                <div>
                    <div className="text-xl font-bold">{integration.product.name} integration for {integration.user.email}</div>
                </div>
                <div>
                    <div className="mt-8">
                        <IntegrationSummary integration={integration} />
                    </div>
                    <div className="my-8">
                        {/* Form element for integration.gptId */}
                    <div className="font-bold">GPT ID</div>
                    <div>
                        <Form method="post" onSubmit={disableSavebutton}>
                        <input type="hidden" name="integrationId" value={String(integration.id)} />
                        <input type="hidden" name="productName" value={String(integration.product.name)} />
                        <input 
                            name="gptId"
                            placeholder="GPT ID"
                            value={String(integration.gptId || '')} 
                            onChange={(event) => {
                                const newIntegration = { ...integration };
                                newIntegration.gptId = event.target.value;
                                setSelectedIntegration(newIntegration);
                            }}
                        />
                        {integration.status == 'pendingCreation' && integration.gptId && (
                            <div className="my-4 font-bold">
                                Set as Created and Notify Owner <input className="ml-2" type="checkbox" name="setCreated" />
                            </div>
                            )}
                            {integration.status == 'pendingUpdate' && integration.gptId && (
                            <div className="my-4 font-bold">
                                Set as Updated and Notify Owner <input className="ml-2" type="checkbox" name="setUpdated" />
                            </div>
                            )}
                      <Button disabled={isSaveButtonDisabled} className="ml-4"
                      type="submit" size="large">Save</Button>
                        </Form>
                    </div>
                    </div>
                    {integrationSettings?.links?.length && (
                    <div className="mt-8">
                        <div>Product Links</div>
                        {integrationSettings.links.map((link: string, index:number) => (
                            <div key={index}><a href={link} target="_blank" rel="noreferrer">{link}</a></div>
                        ))}
                    </div>
                    )}
                    <div className="mt-8">
                        <div className="font-bold text-lg">Additional Info for Product Integration</div>
                        <div>
                            {configuration.questions.map((question: string, index: number) => (
                                <div className="mt-4" key={String(index)}>
                                    <div className="font-bold">{question}</div>
                                    <div>{configuration.answers[index]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IntegrationModal;

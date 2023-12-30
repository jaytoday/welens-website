import { formatDistanceToNow } from 'date-fns';

import type { ProductIntegration } from "~/models/productIntegration.server"
import { gptUrl } from '~/utils/product-utils';
import Button from '~/components/shared/button';

function formatStatusString(str: string) {
    // Split the string into words based on uppercase letters
    const words = str.match(/[A-Z][a-z]+|[a-z]+/g);

    // Capitalize the first letter of each word and join them with a space
    return words ? words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : str;
}

const IntegrationSummary = ({ integration }: { integration: ProductIntegration }) => {
    return (
        <div>
            <p>Product: {integration.product.name}</p>
        <p>User Email: {integration.user.email}</p>
        <p>Status: {formatStatusString(integration.status)}</p>
        {integration.gptId && (
            <p className="my-2"><a className="font-bold text-lg" target='_blank' href={gptUrl(integration.gptId)} rel="noreferrer">
                   <Button theme="secondary" size="small" >
                        🔗 GPT Assistant
                    </Button>
                </a>   
                </p>
        )}
        <p>{integration.configurationUpdatedAt === integration.createdAt ? 'Created' : 'Updated'}: {formatDistanceToNow(new Date(integration.configurationUpdatedAt || integration.createdAt), { addSuffix: true })}</p>
        </div>
    );
}

export default IntegrationSummary;
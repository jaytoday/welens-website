import * as React from 'react';

interface EmailTemplateProps {
  productName: string;
  gptLink: string;
}

export const GptCreatedEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  productName,
  gptLink,
}) => (
  <div>
    <div>
        Your AI assisstant for integrating {productName} has been created!
    </div>
    <br/>
    <div>
        You can use it here: {gptLink}
    </div>
  </div>
);

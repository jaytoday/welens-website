import React from "react";

import HelpText from "./help-text";

const BaseLayout = ({ title, subtitle, children }:
    { title: string, subtitle?: string, children?: React.ReactNode }) => {
    return (
        <div className="p-6 text-gray-100 rounded-lg shadow-md">
        {title && (
        <h1 className="text-xl font-semibold mb-2">{title}</h1>
        )}
        {subtitle && (<div className="mb-4">
          <HelpText>{subtitle}</HelpText>
        </div>)}
         {children || ''}
        </div>

    )
}

export default BaseLayout;
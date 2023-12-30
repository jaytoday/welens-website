import React from 'react';

const Card = ({ title, children, className, ...props }: {
    title: string,
    children: React.ReactNode,
    className?: string,
    props?: any
}) => {

    return (
        <div className={`${className || ''} mx-auto max-w-md rounded-lg bg-gray-800 shadow hover:bg-gray-700`}>
        <div className="p-4">
          <h3 className="text-xl font-medium text-gray-200">{title}</h3>
          <p className="mt-1 text-gray-400">{children}</p>
        </div>
      </div>
    );
    }

export default Card;
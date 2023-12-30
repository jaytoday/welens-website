import React from 'react';

interface HelpTextProps {
    children: React.ReactNode;
}

const HelpText: React.FC<HelpTextProps> = ({ children }) => {
    return <p className="text-sm text-gray-300 mt-2">{children}</p>;
};

export default HelpText;

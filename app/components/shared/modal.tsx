import React, { useEffect, useRef } from 'react';


const Modal = ({ title, icon, children, buttons, setShowModal }: {
    title: string,
    icon?: React.ReactNode,
    children?: React.ReactNode
    buttons: React.ReactNode
    setShowModal: (showModal: boolean) => void
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    // Close modal when clicking outside of it
    // TODO: make a reusable modal component that includes this 
    useEffect(() => {
        const handleModalClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleModalClick);
        return () => document.removeEventListener('mousedown', handleModalClick);
    }, [setShowModal]);

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 sm:p-0" style={{ backgroundColor: 'rgba(100,100,100,.8)' }}>
            <div  ref={modalRef} style={{ marginTop: '-200px' }}  className="mx-auto z-50 w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm relative text-gray-800">
                
                <div className="relative p-5">
                    <div className="text-center">
                        {icon && (
                            <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-secondary-500">
                                {icon}
                            </div>
                        )}
                     <div>
            
          {title && (<h3 className="text-lg font-medium text-gray-900">{title}</h3>)}
          {children}
        </div>
      </div>
                <div className="mt-8 flex justify-center gap-3">
                    {buttons}
                </div>
            </div>
        </div>
        <div className="fixed inset-0 bg-primary-100/50"></div>
    </div>
    );
}

export default Modal;
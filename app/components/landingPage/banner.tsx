import React, { useState, useEffect } from 'react';

import Button from '../shared/button';
import Modal from '../shared/modal';
import { Form, useActionData } from '@remix-run/react';

const LandingPageBanner = () => {

  const data = useActionData();
  const signupId = data?.signup?.id;
  const [savedSignupId, setSavedSignupId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!showModal){ return; }
    if (signupId !== savedSignupId){
      setSavedSignupId(signupId);
      setShowModal(false);
    }
  }, [signupId, savedSignupId]);

    const [showModal, setShowModal] = useState(false);
    return (
        <section className="bg-gray-900 text-white">
  <div className="mx-auto max-w-screen-xl px-4 pt-32">
    <div className="mx-auto max-w-3xl text-center">
      <h1 style={{lineHeight: 1.3}}
        className="bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
      >
       Convert Any Video Into An Immersive <span className="bg-gradient-to-br to-purple-600 via-pink-300 from-orange-500 bg-clip-text text-transparent ">Vision Pro</span> Experience 
      </h1>

      <p className="mx-auto mt-4 max-w-xl sm:text-xl md:text-2xl font-bold">
        Provide a video and a description of the setting for your experience and WeLens will generate an app for Apple's <a href="https://www.apple.com/apple-vision-pro/" className="text-gray-400" target="_blank">Vision Pro</a> showcasing your video in a 3D environment custom built by AI.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Button size="large"
                    onClick={() => setShowModal(true)}
                >
                    Get Started
                </Button>

        <a
          className="hidden w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
          href="/about"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
  {showModal && <SignupModal setShowModal={setShowModal} />}
</section>
    );
}

interface SignupModalProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupModal: React.FC<SignupModalProps> = ({ setShowModal }) => {


    const icon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
      </svg>
    );

    const buttons = (
      <>
      <Button
      size="medium"
          type="submit"
          
      >
          Continue
      </Button>
      </>
    );

    return (
      <Form method="post">
      <Modal icon={icon} buttons={buttons} title="Create Your Account" setShowModal={setShowModal}>
        
                 
          <div className="mt-2">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div className="mt-2">
          <label htmlFor="additionalInfo" className="sr-only">
              Any additional info? Let us know what products you need help integrating or what products you would like to help your customers integrate.
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              autoComplete="additionalInfo"
              rows={4}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
              placeholder="Any additional info on how we can help you?"
            />

          </div>
          
      </Modal>
      </Form>
    );
}

export default LandingPageBanner;
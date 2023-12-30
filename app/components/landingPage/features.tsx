import React from 'react';


const LandingPageFeatures = () => {

return (
    <section className="bg-gray-900 text-white">
  <div className="max-w-screen-lg px-4 py-4 sm:px-6 sm:py-6 mx-auto ">

    <div className="mb-8 mt-2 grid grid-cols-1 gap-8 md:mt-4 md:grid-cols-3 md:gap-12">

      <div className="hidden flex items-start gap-4">
        <span className="shrink-0 rounded-lg bg-gray-900 p-2 text-3xl">
        📋 
        </span>

        <div>
          <h2 className="text-2xl font-bold font-serif"><span className="text-gray-400 text-lg pr-1">1.</span> Customize</h2>

          <p className="mt-1 text-md text-gray-300">
            Your customer answers a few simple questions about the specifics of their integration, and a personalized AI solution engineer is created for them.
          </p>
        </div>
      </div>

      <div className="hidden flex items-start gap-4">
      <span className="shrink-0 rounded-lg bg-gray-900 p-2 text-3xl">
      ✨ 
        </span>

        <div>
          <h2 className="text-2xl font-bold font-serif"><span className="text-gray-400 text-lg pr-1">2.</span> Integrate</h2>

          <p className="mt-1 text-md text-gray-300">
             The AI assistant provides a detailed action plan with code examples, and guides the customer through the integration process.
          </p>
        </div>
      </div>

      <div className="hidden flex items-start gap-4">
      <span className="shrink-0 rounded-lg bg-gray-900 p-1 text-3xl">
        🎯

        </span>

        <div>
          <h2 className="text-2xl font-bold font-serif"><span className="text-gray-400 text-lg pr-1">3.</span> Monitor</h2>

          <p className="mt-1 text-md text-gray-300">
           Track in real-time how each customer is progressing with their integration, and get notified when they reach milestones or need additional assistance.
          </p>
        </div>
      </div>
</div>
  </div>
</section>
);
}

export default LandingPageFeatures;
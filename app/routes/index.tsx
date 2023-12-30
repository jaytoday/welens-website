import { Link } from "@remix-run/react";
import { useCallback } from "react";
import { useOptionalUser } from "~/utils";
import LandingPageBanner from "~/components/landingPage/banner";
import LandingPageHeader from "~/components/landingPage/header";
import LandingPageFeatures from "~/components/landingPage/features";
import LandingPageFooter from "~/components/landingPage/footer";

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createEmailSignup } from "~/models/emailSignup.server";

import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadSeaAnemonePreset } from "tsparticles-preset-sea-anemone";



export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const additionalInfo = formData.get("additionalInfo") as string;
  const signup = await createEmailSignup({ email, additionalInfo });
  return json({
    signup,
  });
}

export default function Index() {

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadSeaAnemonePreset(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
   // await loadFull(engine);
   // await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async container => {
    await console.log(container);
}, []);


  const user = useOptionalUser();

  const particleOptions = {
    preset: "seaAnemone",
  };

  return (
    <div className="relative">
      <Particles
            style={{opacity:'0.05'}}
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particleOptions}
        />
    <main>
      <LandingPageHeader />
      <LandingPageBanner />
       <LandingPageFeatures /> 
      <LandingPageFooter />
      </main>
    </div>
  );

}

"use client";

import dynamic from "next/dynamic";
import WizardSkeleton from "./wizard-skeleton";

// Loaded on demand: the wizard is a large client bundle and its draft lives in sessionStorage
const PropertyWizard = dynamic(() => import("./property-wizard"), {
  ssr: false,
  loading: () => <WizardSkeleton />,
});

export default PropertyWizard;

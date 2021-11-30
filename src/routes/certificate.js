import CertificateVerificationPage from "../pages/certificate";

const certificateRoutes = [
  { path: "/certificate/validate/:certificate_code", component: CertificateVerificationPage },
];

export default certificateRoutes;

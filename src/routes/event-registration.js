import PageEventRegistration from "pages/ma/event-registration";
import { FormLigaJabar } from "pages/ma/event-registration/views/form-liga-jabar";

import PageEventRegistrationOfficial from "pages/ma/event-registrarion-official"

const eventRegistrationRoutes = [
  { path: "/event-registration/:slug", component: PageEventRegistration },
  { path: "/event-registration/regular/:slug", component: FormLigaJabar },
  { path: "/event-registration-official/:slug", component: PageEventRegistrationOfficial}
];

export default eventRegistrationRoutes;

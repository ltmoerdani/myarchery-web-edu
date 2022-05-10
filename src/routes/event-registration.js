import PageEventRegistration from "pages/ma/event-registration";
import PageEventRegistrationOfficial from "pages/ma/event-registrarion-official"

const eventRegistrationRoutes = [
  { path: "/event-registration/:slug", component: PageEventRegistration },
  { path: "/event-registration-official/:slug", component: PageEventRegistrationOfficial}
];

export default eventRegistrationRoutes;

import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { ServicesPage } from "./pages/ServicesPage";
import { InfluencerDirectory } from "./pages/InfluencerDirectory";
import { InfluencerProfile } from "./pages/InfluencerProfile";
import { EventsShowcase } from "./pages/EventsShowcase";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ContactPage } from "./pages/ContactPage";
import { UserLoginPage } from "./pages/UserLoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { LoginPage } from "./pages/admin/LoginPage";
import { Dashboard } from "./pages/admin/Dashboard";
import { InfluencerManagement } from "./pages/admin/InfluencerManagement";
import { EnquiryManagement } from "./pages/admin/EnquiryManagement";
import { EventsManagement } from "./pages/admin/EventsManagement";
import { PortfolioManagement } from "./pages/admin/PortfolioManagement";
import { BrandManagement } from "./pages/admin/BrandManagement";
import { TestimonialManagement } from "./pages/admin/TestimonialManagement";
import { SettingsPage } from "./pages/admin/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "services", Component: ServicesPage },
      { path: "influencers", Component: InfluencerDirectory },
      { path: "influencers/:id", Component: InfluencerProfile },
      { path: "events", Component: EventsShowcase },
      { path: "portfolio", Component: PortfolioPage },
      { path: "contact", Component: ContactPage },
      { path: "register", Component: RegisterPage },
      { path: "profile", Component: ProfilePage },
      { path: "profile/edit", Component: EditProfilePage },
    ],
  },
  { path: "/login", Component: UserLoginPage },
  { path: "/admin/login", Component: LoginPage },
  {
    path: "/admin",
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "influencers", Component: InfluencerManagement },
          { path: "enquiries", Component: EnquiryManagement },
          { path: "events", Component: EventsManagement },
          { path: "portfolio", Component: PortfolioManagement },
          { path: "brands", Component: BrandManagement },
          { path: "testimonials", Component: TestimonialManagement },
          { path: "settings", Component: SettingsPage },
        ],
      },
    ],
  },
]);

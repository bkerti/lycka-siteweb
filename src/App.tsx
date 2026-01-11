import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { BlogProvider } from "./providers/BlogProvider";
import { TestimonialsProvider } from "./providers/TestimonialsProvider";
import { ProjectsProvider } from "./providers/ProjectsProvider";
import { HomeModelsProvider } from "./providers/HomeModelsProvider";
import { ServicesProvider } from "./providers/ServicesProvider";
import ScrollToTop from "./components/ScrollToTop";
import { useVersionChecker } from "./hooks/useVersionChecker"; // Import the new hook

const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const LyckaHome = lazy(() => import("./pages/LyckaHome"));
const LyckaHomeDetail = lazy(() => import("./pages/LyckaHomeDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));


const queryClient = new QueryClient();

// Component to track page views
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin views to avoid noise
    if (location.pathname.startsWith('/admin')) {
      return;
    }
    
    fetch('/api/visits', {
      method: 'POST',
    }).catch(error => {
      console.error('Failed to track page view:', error);
    });
  }, [location.pathname]);

  return null;
};


// Component to handle routing based on state
const AdminWithStateRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handle section routing from AdminOverview
    if (location.state?.section) {
      // We don't replace here, we want the section to be preserved
    }
  }, [location, navigate]);

  return <Admin />;
};

// Component to handle links from admin dashboard to different sections
const ProjectDetailWithRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to admin with projects section selected
    navigate("/admin", { state: { section: "projects" } });
  }, [navigate]);
  
  return null;
};

const ServiceDetailWithRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to admin with services section selected
    navigate("/admin", { state: { section: "services" } });
  }, [navigate]);
  
  return null;
};

const LyckaHomeDetailWithRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to admin with lycka-home section selected
    navigate("/admin", { state: { section: "lycka-home" } });
  }, [navigate]);
  
  return null;
};

const App = () => {
  useVersionChecker(); // Call the hook here

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BlogProvider>
        <TestimonialsProvider>
          <ProjectsProvider>
            <HomeModelsProvider>
              <ServicesProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <PageViewTracker />
                  <Suspense fallback={<div>Chargement...</div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/lycka-home" element={<LyckaHome />} />
                      <Route path="/lycka-home/:id" element={<LyckaHomeDetail />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/admin" element={<AdminWithStateRouting />} />
                      <Route path="/admin/projects" element={<ProjectDetailWithRedirect />} />
                      <Route path="/admin/services" element={<ServiceDetailWithRedirect />} />
                      <Route path="/admin/lycka-home" element={<LyckaHomeDetailWithRedirect />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </ServicesProvider>
            </HomeModelsProvider>
          </ProjectsProvider>
        </TestimonialsProvider>
      </BlogProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
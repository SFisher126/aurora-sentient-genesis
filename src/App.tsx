
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Chat from "./pages/Chat";
import Memory from "./pages/Memory";
import Learning from "./pages/Learning";
import Settings from "./pages/Settings";
import APISettings from "./pages/APISettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 flex">
          <div className="hidden md:block md:w-64">
            <Navigation />
          </div>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/api-settings" element={<APISettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

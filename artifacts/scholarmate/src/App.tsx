import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';

import Home from '@/pages/home';
import Discover from '@/pages/discover';
import ScholarshipDetail from '@/pages/scholarship-detail';
import EligibilityChecker from '@/pages/eligibility-checker';
import CompareScholarships from '@/pages/compare-scholarships';
import Login from '@/pages/login';
import Register from '@/pages/register';
import StudentDashboard from '@/pages/student-dashboard';
import StudentProfile from '@/pages/student-profile';
import SavedScholarships from '@/pages/saved-scholarships';
import ApplicationTracker from '@/pages/application-tracker';
import AboutScholarMate from '@/pages/about';
import Contact from '@/pages/contact';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsOfUse from '@/pages/terms-of-use';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/discover" component={Discover} />
        <Route path="/scholarships/:id" component={ScholarshipDetail} />
        <Route path="/eligibility" component={EligibilityChecker} />
        <Route path="/compare" component={CompareScholarships} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={StudentDashboard} />
        <Route path="/profile" component={StudentProfile} />
        <Route path="/saved" component={SavedScholarships} />
        <Route path="/tracker" component={ApplicationTracker} />
        <Route path="/about" component={AboutScholarMate} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfUse} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from "react";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignUp,
  useAuth,
  useClerk,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Layout } from '@/components/layout';

import Home from '@/pages/home';
import Discover from '@/pages/discover';
import ScholarshipDetail from '@/pages/scholarship-detail';
import EligibilityChecker from '@/pages/eligibility-checker';
import CompareScholarships from '@/pages/compare-scholarships';
import StudentDashboard from '@/pages/student-dashboard';
import StudentProfile from '@/pages/student-profile';
import SavedScholarships from '@/pages/saved-scholarships';
import ApplicationTracker from '@/pages/application-tracker';
import AboutScholarMate from '@/pages/about';
import Contact from '@/pages/contact';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsOfUse from '@/pages/terms-of-use';
import AdminScholarshipsList from '@/pages/admin/scholarships-list';
import AdminScholarshipForm from '@/pages/admin/scholarship-form';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#c96b12",
    colorForeground: "#172033",
    colorMutedForeground: "#667085",
    colorDanger: "#c2413b",
    colorBackground: "#ffffff",
    colorInput: "#fffdf8",
    colorInputForeground: "#172033",
    colorNeutral: "#e4e0d7",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-slate-900",
    headerSubtitle: "text-slate-600",
    socialButtonsBlockButtonText: "text-slate-800",
    formFieldLabel: "text-slate-800",
    footerActionLink: "text-amber-700",
    footerActionText: "text-slate-600",
    dividerText: "text-slate-500",
    identityPreviewEditButton: "text-amber-700",
    formFieldSuccessText: "text-green-700",
    alertText: "text-red-700",
    logoBox: "mb-4",
    logoImage: "max-h-10",
    socialButtonsBlockButton: "hidden",
    dividerRow: "hidden",
    formButtonPrimary: "bg-amber-700 hover:bg-amber-800",
    formFieldInput: "border-slate-200 bg-amber-50/20 text-slate-900",
    footerAction: "border-t border-slate-100",
    dividerLine: "bg-slate-200",
    alert: "border-red-200 bg-red-50",
    otpCodeFieldInput: "border-slate-200 text-slate-900",
    formFieldRow: "text-slate-900",
    main: "text-slate-900",
  },
};

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading ScholarMate…</div>;
  }
  return isSignedIn ? <Redirect to="/dashboard" /> : <Home />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading your account…</div>;
  }
  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl={`${basePath}/dashboard`} />;
  }
  return <>{children}</>;
}

function AuthPages() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/20 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center">
        <div className="hidden max-w-md flex-1 flex-col justify-center rounded-2xl bg-primary p-10 text-primary-foreground lg:flex">
          <img src={`${basePath}/logo.svg`} alt="ScholarMate" className="mb-8 h-12 w-12" />
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Student-first funding</p>
          <h1 className="text-4xl font-bold leading-tight">Find the support behind your next big step.</h1>
          <p className="mt-5 text-primary-foreground/75">Keep your profile in one place and discover verified scholarship opportunities across India.</p>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-2xl border bg-background p-4 shadow-sm sm:p-8">
          <Switch>
            <Route path="/sign-in/*?">
              <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
            </Route>
            <Route path="/sign-up/*?">
              <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        client.clear();
      }
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);

  return null;
}

function ClerkAuthProvider() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to continue your scholarship journey" } },
        signUp: { start: { title: "Create your ScholarMate account", subtitle: "Start finding scholarships built for you" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/discover" component={Discover} />
        <Route path="/scholarships/:id" component={ScholarshipDetail} />
        <Route path="/eligibility" component={EligibilityChecker} />
        <Route path="/compare" component={CompareScholarships} />
        <Route path="/login"><Redirect to="/sign-in" /></Route>
        <Route path="/register"><Redirect to="/sign-up" /></Route>
        <Route path="/sign-in/*?" component={AuthPages} />
        <Route path="/sign-up/*?" component={AuthPages} />
        <Route path="/dashboard"><ProtectedRoute><StudentDashboard /></ProtectedRoute></Route>
        <Route path="/profile"><ProtectedRoute><StudentProfile /></ProtectedRoute></Route>
        <Route path="/saved"><ProtectedRoute><SavedScholarships /></ProtectedRoute></Route>
        <Route path="/tracker"><ProtectedRoute><ApplicationTracker /></ProtectedRoute></Route>
        <Route path="/about" component={AboutScholarMate} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfUse} />
        <Route path="/admin/scholarships/new" component={AdminScholarshipForm} />
        <Route path="/admin/scholarships/:id/edit" component={AdminScholarshipForm} />
        <Route path="/admin/scholarships" component={AdminScholarshipsList} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkAuthProvider />
    </WouterRouter>
  );
}

export default App;

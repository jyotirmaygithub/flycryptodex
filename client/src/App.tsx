import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Trading from "@/pages/Trading";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trading/:pair?" component={Trading} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;

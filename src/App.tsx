import { RootLayout } from "@/components/layout/root-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function App() {
  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Under Construction
          </Badge>
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Wedding Planner
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Your perfect day, perfectly planned.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                This scaffold is ready for development.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button>Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
}

export default App;

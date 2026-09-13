import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been removed."
      />
      <div className="mt-6 flex justify-center">
        <Button href="/">Back to Home</Button>
      </div>
    </Container>
  );
}

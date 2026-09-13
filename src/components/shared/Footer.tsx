import { Container } from "./Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-brand-50/40">
      <Container className="flex flex-col items-center gap-3 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-base font-bold text-ink">BestDoctorDhaka</p>
          <p className="text-sm text-muted">Find · Compare · Consult · Live Better</p>
        </div>
        <p className="text-sm text-muted">Trusted information for a healthier Dhaka</p>
      </Container>
      <div className="border-t border-slate-200 py-4">
        <Container>
          <p className="text-center text-xs text-muted">
            © {year} BestDoctorDhaka. Listings are for informational purposes — always verify
            details directly with the doctor or hospital before your visit.
          </p>
        </Container>
      </div>
    </footer>
  );
}

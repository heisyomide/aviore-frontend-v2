import { Container } from "./Container";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  bg?: boolean; // Toggle light gray background
}

export function Section({ title, children, className = "", bg = false }: SectionProps) {
  return (
    <section className={`${bg ? "bg-[#F7F7F7]" : "bg-white"} py-12 ${className}`}>
      <Container>
        {title && (
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-8 text-[#222]">
            {title}
          </h2>
        )}
        {children}
      </Container>
    </section>
  );
}
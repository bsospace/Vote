import Navbar from "@/components/Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}
export function PageLayout({ children }: PageLayoutProps) {
  //   const [breadcrumbs] = useBreadcrumb();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">{children}</div>
    </>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="mt-10 transition-all duration-100">
      <div className="mt-1 border-b-2 border-zinc-800">
        <div className="container  mx-auto flex items-center justify-between pl-4 pr-4 pb-3 md:pl-0 md:pr-0">
          <h1 className="text-2xl">Dashboard</h1>
        </div>
      </div>
      {children}
    </main>
  );
};

export default DashboardLayout;

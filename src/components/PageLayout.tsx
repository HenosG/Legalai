interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="w-full px-6 lg:px-8 py-8">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
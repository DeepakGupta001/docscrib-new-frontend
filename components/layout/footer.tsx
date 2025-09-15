export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="sticky bottom-0 z-50 flex flex-col">
      <footer className="flex h-14 items-center justify-start border-t bg-background px-4 lg:h-[60px]">
        <p className="text-sm text-muted-foreground">
          © {year} DocScrib. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

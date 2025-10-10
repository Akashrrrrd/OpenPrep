export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-muted-foreground">{"OpenPrep — Built by open-source contributors"}</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            GitHub Repo
          </a>
          <a href="#" className="hover:underline">
            Akash R
          </a>
        </div>
      </div>
    </footer>
  )
}

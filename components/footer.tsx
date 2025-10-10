import { Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-muted-foreground">{"OpenPrep — Built by open-source contributors"}</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/Akashrrrrd/OpenPrep" target="_blank" rel="noopener noreferrer" className="hover:underline">
            GitHub Repo
          </a>
          <div className="flex items-center gap-2">
            <a href="https://github.com/Akashrrrrd" target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-muted rounded-sm transition-colors">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/aaakashrajendran/" target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-muted rounded-sm transition-colors">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

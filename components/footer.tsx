import { Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
            {"OpenPrep — Built by open-source contributors"}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <a 
              href="https://github.com/Akashrrrrd/OpenPrep" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs sm:text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub Repo
            </a>
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/Akashrrrrd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/aaakashrajendran/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

# TODO: Improve Browse and Contribute Buttons

- [x] Revise homepage buttons in app/page.tsx: Keep icons, remove flashy hover effects (scale and shadow) for a professional look, ensure consistent sizing and responsiveness.
- [x] Reduce homepage button sizes: Smaller padding (px-4 py-2), smaller icons (h-4 w-4) for both desktop and mobile.
- [x] Revise navbar contribute button in components/navbar.tsx: Keep icon, remove scale hover effect for professionalism, ensure mobile sheet has consistent styling.
- [x] Increase logo and text size in navbar: Logo from h-8 w-8 to h-10 w-10, text to text-xl.
- [x] Reduce submit button size in contribute page: Height from h-12 to h-10, text from text-lg to text-base, icon from h-5 w-5 to h-4 w-4, remove hover:shadow-lg.
- [x] Fix mobile menu auto-close: Add state management to Sheet, onClick handlers to close menu on link clicks.
- [x] Fix accessibility error: Add SheetHeader and SheetTitle to mobile menu for screen readers.
- [x] Test the changes: Run the app to verify desktop and mobile responsiveness and professional appearance.
- [x] Set default theme to light mode: Change defaultTheme from "system" to "light" in layout.tsx for first-time visitors.

import { AuthProvider }  from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import { Inter }         from "next/font/google";
import { Toaster }       from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:       "Arukas",
  description: "Point of Sales System",
  manifest:    "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3B82F6" />
        {/*
          Script inline dijalankan sebelum React render
          agar tidak ada flash of unstyled content (FOUC)
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var isDark =
                    theme === 'dark' ||
                    (theme === 'system' &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`
          ${inter.className}
          bg-gray-50 dark:bg-slate-900
          text-gray-900 dark:text-white
          min-h-screen
          transition-colors duration-200
        `}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                className: [
                  "!text-sm !rounded-xl !shadow-lg",
                  "!bg-white dark:!bg-slate-800",
                  "!text-gray-900 dark:!text-white",
                  "!border !border-gray-200 dark:!border-slate-700",
                ].join(" "),
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
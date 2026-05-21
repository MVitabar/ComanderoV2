import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/hooks/use-locale"
import { IntegrationsProvider } from "@/hooks/use-integrations"
import { AuthProvider } from "@/hooks/use-auth"
import ToastProvider from "@/components/notifications/ToastProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Comandero",
  description: "Sistema de gestión de restaurantes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IntegrationsProvider>
            <LocaleProvider>
              <AuthProvider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </AuthProvider>
            </LocaleProvider>
          </IntegrationsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

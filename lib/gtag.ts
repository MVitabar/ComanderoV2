// Global gtag function declaration
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const gtag = (...args: any[]) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args)
  }
}

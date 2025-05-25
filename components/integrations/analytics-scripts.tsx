"use client"

import { useEffect } from "react"
import Script from "next/script"
import { useIntegrations } from "@/hooks/use-integrations"

export function AnalyticsScripts() {
  const { getEnabledIntegrations } = useIntegrations()

  const analyticsIntegrations = getEnabledIntegrations("analytics")

  useEffect(() => {
    // Track page views when integrations change
    analyticsIntegrations.forEach((integration) => {
      if (integration.id === "google-analytics" && integration.config.trackingId) {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("config", integration.config.trackingId, {
            page_title: document.title,
            page_location: window.location.href,
          })
        }
      }
    })
  }, [analyticsIntegrations])

  return (
    <>
      {analyticsIntegrations.map((integration) => {
        switch (integration.id) {
          case "google-analytics":
            if (!integration.config.trackingId) return null
            return (
              <div key={integration.id}>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${integration.config.trackingId}`}
                  strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    window.gtag = gtag;
                    gtag('js', new Date());
                    gtag('config', '${integration.config.trackingId}', {
                      anonymize_ip: ${integration.config.anonymizeIp || true}
                    });
                  `}
                </Script>
              </div>
            )

          case "facebook-pixel":
            if (!integration.config.pixelId) return null
            return (
              <Script key={integration.id} id="facebook-pixel" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${integration.config.pixelId}');
                  fbq('track', 'PageView');
                `}
              </Script>
            )

          case "hotjar":
            if (!integration.config.siteId) return null
            return (
              <Script key={integration.id} id="hotjar" strategy="afterInteractive">
                {`
                  (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${integration.config.siteId},hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `}
              </Script>
            )

          default:
            return null
        }
      })}
    </>
  )
}

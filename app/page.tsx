"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Check, Star, ArrowRight, Play, BarChart3, Clock, Shield, Zap, Globe, Menu } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { LanguageSelector } from "@/components/language-selector"
import { SocialSharing } from "@/components/integrations/social-sharing"
import { IntegrationSettings } from "@/components/integrations/integration-settings"
import { AnalyticsScripts } from "@/components/integrations/analytics-scripts"
import { useLocale } from "@/hooks/use-locale"

export default function LandingPage() {
  const { t, locale } = useLocale()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !t?.auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AnalyticsScripts />

      {/* Mobile-First Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">C</span>
              </div>
              <span className="text-lg lg:text-xl font-bold text-gray-900">Comandero</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                {t.header.features}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                {t.header.pricing}
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                {t.header.about}
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                {t.header.contact}
              </a>
            </nav>

            {/* Auth Buttons - Always visible on mobile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                href="/auth/login" 
                className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t.auth.login}
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-md hover:opacity-90 transition-opacity"
              >
                {t.auth.register}
              </Link>
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.features}
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.pricing}
              </a>
              <a
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.about}
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header.contact}
              </a>
              <div className="pt-2 border-t">
                <Link
                  href="/auth/login"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.auth.login}
                </Link>
                <Link
                  href="/auth/register"
                  className="mt-2 block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.auth.register}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile-First Hero Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-xs sm:text-sm px-3 py-1">
            {t.hero.subtitle}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 h-12 sm:h-14 text-base font-semibold">
                {t.hero.getStarted}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 h-12 sm:h-14 text-base font-semibold">
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.hero.watchDemo}
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 px-4">{t.hero.trustedBy}</p>
        </div>
      </section>

      {/* Mobile-First Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t.features.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl lg:max-w-2xl mx-auto px-4">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{t.features.tableManagement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t.features.tableManagement.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{t.features.orderTracking.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t.features.orderTracking.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{t.features.inventory.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t.features.inventory.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{t.features.analytics.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t.features.analytics.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{t.features.multiTenant.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t.features.multiTenant.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{t.features.realTime.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t.features.realTime.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-First Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t.pricing.title}</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl lg:max-w-2xl mx-auto px-4">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl">{t.pricing.plans.starter.name}</CardTitle>
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 my-2">
                  {t.pricing.plans.starter.price}
                </div>
                <CardDescription className="text-sm sm:text-base">
                  {t.pricing.plans.starter.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {t.pricing.plans.starter.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-11 sm:h-12 text-base font-semibold">{t.pricing.plans.starter.cta}</Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-2 border-orange-500 relative shadow-lg lg:scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-3 py-1 text-xs font-semibold">
                  {t.pricing.plans.professional.popular}
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-xl sm:text-2xl">{t.pricing.plans.professional.name}</CardTitle>
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 my-2">
                  {t.pricing.plans.professional.price}
                </div>
                <CardDescription className="text-sm sm:text-base">
                  {t.pricing.plans.professional.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {t.pricing.plans.professional.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-11 sm:h-12 text-base font-semibold">
                  {t.pricing.plans.professional.cta}
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl">{t.pricing.plans.enterprise.name}</CardTitle>
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 my-2">
                  {t.pricing.plans.enterprise.price}
                </div>
                <CardDescription className="text-sm sm:text-base">
                  {t.pricing.plans.enterprise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {t.pricing.plans.enterprise.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full h-11 sm:h-12 text-base font-semibold">
                  {t.pricing.plans.enterprise.cta}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile-First Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.author}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-First CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">{t.cta.title}</h2>
          <p className="text-base sm:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8 max-w-xl lg:max-w-2xl mx-auto px-4 leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto gap-2 h-12 sm:h-14 text-base font-semibold"
              >
                {t.cta.getStarted}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-orange-500 h-12 sm:h-14 text-base font-semibold"
            >
              {t.cta.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-First Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">Comandero</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{t.footer.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg">{t.footer.product.title}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.product.features}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.product.pricing}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.product.documentation}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.product.support}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg">{t.footer.company.title}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.company.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.company.blog}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.company.careers}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.company.contact}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg">{t.footer.legal.title}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.legal.privacy}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.legal.terms}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors text-sm sm:text-base">
                    {t.footer.legal.cookies}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

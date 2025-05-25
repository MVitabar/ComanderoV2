"use client"

import { Share2, Twitter, Facebook, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useIntegrations } from "@/hooks/use-integrations"

interface SocialSharingProps {
  url?: string
  title?: string
  description?: string
}

export function SocialSharing({ url, title, description }: SocialSharingProps) {
  const { getIntegration } = useIntegrations()
  const socialIntegration = getIntegration("social-sharing")

  if (!socialIntegration?.enabled) return null

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareTitle = title || "Check out Comandero - Restaurant Management Made Simple"
  const shareDescription =
    description || "Streamline your restaurant operations with our all-in-one management platform"

  const platforms = socialIntegration.config.platforms || ["twitter", "facebook", "linkedin"]

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  }

  const platformIcons = {
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
  }

  const platformNames = {
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
  }

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks]
    if (link) {
      window.open(link, "_blank", "width=600,height=400")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {platforms.map((platform: string) => {
          const Icon = platformIcons[platform as keyof typeof platformIcons]
          const name = platformNames[platform as keyof typeof platformNames]

          if (!Icon || !name) return null

          return (
            <DropdownMenuItem key={platform} onClick={() => handleShare(platform)} className="gap-2">
              <Icon className="h-4 w-4" />
              {name}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

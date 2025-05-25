"use client"

import { useState } from "react"
import { Settings, Eye, EyeOff, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useIntegrations } from "@/hooks/use-integrations"
import type { Integration } from "@/lib/integrations/types"

export function IntegrationSettings() {
  const { integrations, updateIntegration } = useIntegrations()
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const categories = {
    analytics: "Analytics",
    payments: "Payments",
    social: "Social",
    communication: "Communication",
  }

  const toggleSecret = (integrationId: string, field: string) => {
    const key = `${integrationId}-${field}`
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleConfigChange = (integration: Integration, field: string, value: string) => {
    updateIntegration(integration.id, {
      config: { ...integration.config, [field]: value },
    })
  }

  const handleToggle = (integration: Integration) => {
    updateIntegration(integration.id, { enabled: !integration.enabled })
  }

  const isFieldSecret = (field: string) => {
    return (
      field.toLowerCase().includes("secret") ||
      field.toLowerCase().includes("key") ||
      field.toLowerCase().includes("token") ||
      field.toLowerCase().includes("password")
    )
  }

  const renderConfigField = (integration: Integration, field: string) => {
    const isSecret = isFieldSecret(field)
    const secretKey = `${integration.id}-${field}`
    const showSecret = showSecrets[secretKey]

    return (
      <div key={field} className="space-y-2">
        <Label htmlFor={`${integration.id}-${field}`} className="text-sm font-medium">
          {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
        </Label>
        <div className="relative">
          <Input
            id={`${integration.id}-${field}`}
            type={isSecret && !showSecret ? "password" : "text"}
            value={integration.config[field] || ""}
            onChange={(e) => handleConfigChange(integration, field, e.target.value)}
            placeholder={`Enter ${field}`}
            className="pr-10"
          />
          {isSecret && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => toggleSecret(integration.id, field)}
            >
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Integrations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Integration Settings</DialogTitle>
          <DialogDescription>Configure third-party integrations for your application</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(categories).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categories).map(([category, categoryLabel]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4">
                {integrations
                  .filter((integration) => integration.category === category)
                  .map((integration) => (
                    <Card key={integration.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription>{integration.description}</CardDescription>
                            </div>
                          </div>
                          <Switch checked={integration.enabled} onCheckedChange={() => handleToggle(integration)} />
                        </div>
                      </CardHeader>
                      {integration.enabled && integration.requiredFields.length > 0 && (
                        <CardContent className="space-y-4">
                          {integration.requiredFields.map((field) => renderConfigField(integration, field))}
                          <Button size="sm" className="gap-2">
                            <Save className="h-4 w-4" />
                            Save Configuration
                          </Button>
                        </CardContent>
                      )}
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

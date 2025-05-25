"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building, Bell, CreditCard, Shield, Printer, Globe, Save, Upload, Trash2 } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function SettingsPage() {
  const [establishmentSettings, setEstablishmentSettings] = useState({
    name: "The Golden Spoon",
    type: "restaurant",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "+1 (555) 123-4567",
    email: "info@goldenspoon.com",
    website: "www.goldenspoon.com",
    description: "Fine dining restaurant with contemporary cuisine",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",
    logo: "/placeholder.svg?height=80&width=80",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    lowStock: true,
    staffLogin: false,
    dailyReports: true,
    weeklyReports: true,
    systemUpdates: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    thermalPrinter: {
      enabled: true,
      printerName: "Kitchen Printer",
      ipAddress: "192.168.1.100",
      port: "9100",
    },
    paymentGateway: {
      enabled: true,
      provider: "stripe",
      testMode: false,
    },
    analytics: {
      enabled: true,
      googleAnalytics: "GA-XXXXXXXXX",
    },
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "8",
    passwordPolicy: "medium",
    loginAttempts: "5",
    ipWhitelist: "",
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSaveEstablishment = () => {
    // Save establishment settings
    console.log("Saving establishment settings:", establishmentSettings)
  }

  const handleSaveNotifications = () => {
    // Save notification settings
    console.log("Saving notification settings:", notificationSettings)
  }

  const handleSaveIntegrations = () => {
    // Save integration settings
    console.log("Saving integration settings:", integrationSettings)
  }

  const handleSaveSecurity = () => {
    // Save security settings
    console.log("Saving security settings:", securitySettings)
  }

  const handleDeleteEstablishment = () => {
    // Handle establishment deletion
    console.log("Deleting establishment...")
    setShowDeleteDialog(false)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Settings</h1>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Professional Plan
            </Badge>
          </header>

          <main className="flex-1 p-6">
            <Tabs defaultValue="establishment" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="establishment" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Establishment
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </TabsTrigger>
              </TabsList>

              {/* Establishment Settings */}
              <TabsContent value="establishment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Establishment Information</CardTitle>
                    <CardDescription>Manage your restaurant's basic information and branding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={establishmentSettings.logo || "/placeholder.svg"} />
                        <AvatarFallback>
                          <Building className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Label>Restaurant Logo</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Restaurant Name</Label>
                        <Input
                          id="name"
                          value={establishmentSettings.name}
                          onChange={(e) => setEstablishmentSettings({ ...establishmentSettings, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={establishmentSettings.type}
                          onValueChange={(value) => setEstablishmentSettings({ ...establishmentSettings, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="restaurant">Restaurant</SelectItem>
                            <SelectItem value="cafe">Café</SelectItem>
                            <SelectItem value="bar">Bar</SelectItem>
                            <SelectItem value="fastfood">Fast Food</SelectItem>
                            <SelectItem value="pizzeria">Pizzeria</SelectItem>
                            <SelectItem value="bakery">Bakery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={establishmentSettings.phone}
                          onChange={(e) =>
                            setEstablishmentSettings({ ...establishmentSettings, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={establishmentSettings.email}
                          onChange={(e) =>
                            setEstablishmentSettings({ ...establishmentSettings, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={establishmentSettings.address}
                          onChange={(e) =>
                            setEstablishmentSettings({ ...establishmentSettings, address: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={establishmentSettings.city}
                            onChange={(e) =>
                              setEstablishmentSettings({ ...establishmentSettings, city: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={establishmentSettings.state}
                            onChange={(e) =>
                              setEstablishmentSettings({ ...establishmentSettings, state: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={establishmentSettings.zipCode}
                            onChange={(e) =>
                              setEstablishmentSettings({ ...establishmentSettings, zipCode: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={establishmentSettings.description}
                        onChange={(e) =>
                          setEstablishmentSettings({ ...establishmentSettings, description: e.target.value })
                        }
                        placeholder="Brief description of your restaurant"
                      />
                    </div>

                    {/* Localization */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={establishmentSettings.timezone}
                          onValueChange={(value) =>
                            setEstablishmentSettings({ ...establishmentSettings, timezone: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={establishmentSettings.currency}
                          onValueChange={(value) =>
                            setEstablishmentSettings({ ...establishmentSettings, currency: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={establishmentSettings.language}
                          onValueChange={(value) =>
                            setEstablishmentSettings({ ...establishmentSettings, language: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleSaveEstablishment}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Configure how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Order Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>New Orders</Label>
                            <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                          </div>
                          <Switch
                            checked={notificationSettings.newOrders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, newOrders: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Low Stock Alerts</Label>
                            <p className="text-sm text-muted-foreground">Alert when inventory items are running low</p>
                          </div>
                          <Switch
                            checked={notificationSettings.lowStock}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, lowStock: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Staff Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Staff Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Staff Login/Logout</Label>
                            <p className="text-sm text-muted-foreground">Track when staff members log in or out</p>
                          </div>
                          <Switch
                            checked={notificationSettings.staffLogin}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, staffLogin: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Report Notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Report Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Daily Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive daily sales and performance reports</p>
                          </div>
                          <Switch
                            checked={notificationSettings.dailyReports}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                          </div>
                          <Switch
                            checked={notificationSettings.weeklyReports}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Methods */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Delivery Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                          </div>
                          <Switch
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveNotifications}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations" className="space-y-6">
                <div className="grid gap-6">
                  {/* Thermal Printer */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Printer className="h-5 w-5" />
                        Thermal Printer
                      </CardTitle>
                      <CardDescription>Configure kitchen and receipt printers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Thermal Printing</Label>
                        <Switch
                          checked={integrationSettings.thermalPrinter.enabled}
                          onCheckedChange={(checked) =>
                            setIntegrationSettings({
                              ...integrationSettings,
                              thermalPrinter: { ...integrationSettings.thermalPrinter, enabled: checked },
                            })
                          }
                        />
                      </div>
                      {integrationSettings.thermalPrinter.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="printerName">Printer Name</Label>
                            <Input
                              id="printerName"
                              value={integrationSettings.thermalPrinter.printerName}
                              onChange={(e) =>
                                setIntegrationSettings({
                                  ...integrationSettings,
                                  thermalPrinter: {
                                    ...integrationSettings.thermalPrinter,
                                    printerName: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ipAddress">IP Address</Label>
                            <Input
                              id="ipAddress"
                              value={integrationSettings.thermalPrinter.ipAddress}
                              onChange={(e) =>
                                setIntegrationSettings({
                                  ...integrationSettings,
                                  thermalPrinter: { ...integrationSettings.thermalPrinter, ipAddress: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Gateway */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Gateway
                      </CardTitle>
                      <CardDescription>Configure payment processing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Payment Processing</Label>
                        <Switch
                          checked={integrationSettings.paymentGateway.enabled}
                          onCheckedChange={(checked) =>
                            setIntegrationSettings({
                              ...integrationSettings,
                              paymentGateway: { ...integrationSettings.paymentGateway, enabled: checked },
                            })
                          }
                        />
                      </div>
                      {integrationSettings.paymentGateway.enabled && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="provider">Payment Provider</Label>
                            <Select
                              value={integrationSettings.paymentGateway.provider}
                              onValueChange={(value) =>
                                setIntegrationSettings({
                                  ...integrationSettings,
                                  paymentGateway: { ...integrationSettings.paymentGateway, provider: value },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="stripe">Stripe</SelectItem>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Test Mode</Label>
                            <Switch
                              checked={integrationSettings.paymentGateway.testMode}
                              onCheckedChange={(checked) =>
                                setIntegrationSettings({
                                  ...integrationSettings,
                                  paymentGateway: { ...integrationSettings.paymentGateway, testMode: checked },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Analytics
                      </CardTitle>
                      <CardDescription>Configure analytics and tracking</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Analytics</Label>
                        <Switch
                          checked={integrationSettings.analytics.enabled}
                          onCheckedChange={(checked) =>
                            setIntegrationSettings({
                              ...integrationSettings,
                              analytics: { ...integrationSettings.analytics, enabled: checked },
                            })
                          }
                        />
                      </div>
                      {integrationSettings.analytics.enabled && (
                        <div className="space-y-2">
                          <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                          <Input
                            id="googleAnalytics"
                            value={integrationSettings.analytics.googleAnalytics}
                            onChange={(e) =>
                              setIntegrationSettings({
                                ...integrationSettings,
                                analytics: { ...integrationSettings.analytics, googleAnalytics: e.target.value },
                              })
                            }
                            placeholder="GA-XXXXXXXXX"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={handleSaveIntegrations}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Integration Settings
                </Button>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security and access controls</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Authentication */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Authentication</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
                          </div>
                          <Switch
                            checked={securitySettings.twoFactorAuth}
                            onCheckedChange={(checked) =>
                              setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Session Management</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                          <Select
                            value={securitySettings.sessionTimeout}
                            onValueChange={(value) =>
                              setSecuritySettings({ ...securitySettings, sessionTimeout: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                              <SelectItem value="8">8 hours</SelectItem>
                              <SelectItem value="24">24 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                          <Select
                            value={securitySettings.loginAttempts}
                            onValueChange={(value) =>
                              setSecuritySettings({ ...securitySettings, loginAttempts: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 attempts</SelectItem>
                              <SelectItem value="5">5 attempts</SelectItem>
                              <SelectItem value="10">10 attempts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Password Policy */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Password Policy</h3>
                      <div className="space-y-2">
                        <Label htmlFor="passwordPolicy">Password Strength</Label>
                        <Select
                          value={securitySettings.passwordPolicy}
                          onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordPolicy: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (8+ characters)</SelectItem>
                            <SelectItem value="medium">Medium (8+ chars, numbers)</SelectItem>
                            <SelectItem value="high">High (8+ chars, numbers, symbols)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleSaveSecurity}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Settings */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription & Billing</CardTitle>
                    <CardDescription>Manage your subscription and billing information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Plan */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Professional Plan</span>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            $79/month • Up to 50 tables • 15 staff members
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">Change Plan</Button>
                          <Button variant="outline">Cancel Subscription</Button>
                        </div>
                      </div>
                    </div>

                    {/* Usage */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Usage</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold">25</div>
                          <div className="text-sm text-muted-foreground">Tables (50 max)</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }} />
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-sm text-muted-foreground">Staff (15 max)</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }} />
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold">1</div>
                          <div className="text-sm text-muted-foreground">Establishments (3 max)</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "33%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <div className="space-y-2">
                        {[
                          { date: "Jan 15, 2024", amount: "$79.00", status: "Paid" },
                          { date: "Dec 15, 2023", amount: "$79.00", status: "Paid" },
                          { date: "Nov 15, 2023", amount: "$79.00", status: "Paid" },
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <span className="font-medium">{invoice.date}</span>
                              <div className="text-sm text-muted-foreground">Professional Plan</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{invoice.amount}</span>
                              <Badge className="bg-green-100 text-green-800">{invoice.status}</Badge>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions that will affect your establishment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div className="space-y-1">
                        <span className="font-medium text-red-600">Delete Establishment</span>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete this establishment and all associated data
                        </p>
                      </div>
                      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogTrigger asChild>
                          <Button variant="destructive">Delete Establishment</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Establishment</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your establishment and all
                              associated data including orders, inventory, and user accounts.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-2 pt-4">
                            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" className="flex-1" onClick={handleDeleteEstablishment}>
                              Delete Permanently
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

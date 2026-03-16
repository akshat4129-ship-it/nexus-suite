"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, ArrowRight, CreditCard, Receipt, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    recaps: 10,
    features: ["10 recaps/month", "1 team member", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    recaps: 100,
    features: ["100 recaps/month", "5 team members", "Custom branding", "Priority support"],
    current: true,
  },
  {
    name: "Business",
    price: "$79",
    period: "/month",
    recaps: "Unlimited",
    features: ["Unlimited recaps", "Unlimited team members", "Custom domain", "API access", "Dedicated support"],
    current: false,
    highlighted: true,
  },
]

export function BillingTab() {
  const currentPlan = plans.find((p) => p.current)
  const usedRecaps = 67
  const totalRecaps = 100
  const usagePercent = (usedRecaps / totalRecaps) * 100

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Billing & Usage</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and track your recap usage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Current Plan</CardTitle>
                <CardDescription>You are currently on the Pro plan</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                Pro
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recaps used this month</span>
                <span className="font-medium text-foreground">
                  {usedRecaps} / {totalRecaps}
                </span>
              </div>
              <Progress value={usagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {totalRecaps - usedRecaps} recaps remaining. Resets on April 1, 2026.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Receipt className="mr-2 h-4 w-4" />
                View Invoices
              </Button>
              <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Update Payment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Upgrade to Business</CardTitle>
            </div>
            <CardDescription>
              Get unlimited recaps and premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground">$79</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-6 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                Unlimited recaps
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                Custom email domain
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                API access
              </li>
            </ul>
            <Button className="w-full">
              Upgrade to Business
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Compare Plans
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted ? "border-2 border-primary" : ""
              } ${plan.current ? "ring-2 ring-primary/20" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Recommended
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="absolute right-3 top-3">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Current
                  </span>
                </div>
              )}
              <CardContent className="p-6">
                <h5 className="text-lg font-semibold text-foreground">{plan.name}</h5>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? "outline" : plan.highlighted ? "default" : "secondary"}
                  className="mt-6 w-full"
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

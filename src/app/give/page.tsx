import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, DollarSign, Building2, Smartphone } from "lucide-react";

export const revalidate = 60;

export default function GivePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Ways to Give</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">RCCG SANCTUARY OF DOUBLE PERFECTION</h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto pt-4">
          Thank you for partnering with Sanctuary of Double Perfection. Your generosity supports our ministry, outreaches, and the work of the gospel.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Mail */}
        <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Send Checks / Money Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground block mb-1">Sanctuary of Double Perfection</span>
              1520 Commercial Park Dr.<br />
              Lakeland, FL 33801
            </p>
          </CardContent>
        </Card>

        {/* Zelle */}
        <Card className="border-l-4 border-l-[#6d28d9] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 rounded-full bg-[#6d28d9]/10 text-[#6d28d9]">
              {/* Simple text representation or generic icon if logo unavailable */}
              <Smartphone className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Zelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground break-all">
              Rccgsodp2012@gmail.com
            </p>
          </CardContent>
        </Card>

        {/* CashApp */}
        <Card className="border-l-4 border-l-[#00d632] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 rounded-full bg-[#00d632]/10 text-[#00d632]">
              <DollarSign className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">CashApp</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground">
              $RCCGSODP1
            </p>
          </CardContent>
        </Card>

        {/* Wells Fargo */}
        <Card className="border-l-4 border-l-[#d71e28] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 rounded-full bg-[#d71e28]/10 text-[#d71e28]">
              <Building2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Wells Fargo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground">
              Account: 8813470500
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <blockquote className="bg-muted/30 p-6 rounded-xl border border-border inline-block max-w-3xl">
          <p className="text-lg italic text-muted-foreground">
            &ldquo;Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity; for God loveth a cheerful giver.&rdquo;
          </p>
          <footer className="mt-2 text-sm font-bold text-primary">
            — 2 Corinthians 9:7
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

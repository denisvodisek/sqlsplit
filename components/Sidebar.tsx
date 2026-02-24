import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdUnit } from '@/components/AdUnit'
import { ArrowSquareOut, Sparkle } from 'phosphor-react'

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Ad Unit */}
      <Card className="sticky top-24 overflow-hidden">
        <CardHeader className="pb-2 border-b border-border/50 bg-card/50">
          <CardTitle className="text-xs font-normal text-muted-foreground">Sponsored</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <AdUnit slot="7285338195" format="auto" />
        </CardContent>
      </Card>

      {/* Related Tools */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkle className="h-4 w-4 text-muted-foreground" weight="duotone" />
            <CardTitle className="text-sm font-medium">Related Tools</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {[
            { name: 'SQL Formatter', desc: 'Beautify SQL queries' },
            { name: 'CSV to SQL', desc: 'Convert CSV to INSERT' },
            { name: 'SQL Validator', desc: 'Check SQL syntax' },
          ].map((tool) => (
            <a
              key={tool.name}
              href="#"
              className="flex items-center justify-between rounded-xl bg-accent/50 p-3 text-sm hover:bg-accent transition-colors group"
            >
              <div>
                <span className="font-medium">{tool.name}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{tool.desc}</span>
              </div>
              <span className="text-[10px] text-muted-foreground px-2 py-1 rounded-full bg-background border border-border">
                Soon
              </span>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Hosting Recommendation */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">Recommended Hosting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <a
            href="https://www.cloudways.com/en/?id=XXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/25">
              C
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-medium group-hover:text-primary transition-colors">Cloudways</span>
                <ArrowSquareOut className="h-3 w-3 text-muted-foreground" weight="duotone" />
              </div>
              <p className="text-xs text-muted-foreground">Managed Cloud Hosting</p>
            </div>
          </a>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Affiliate link — we may earn a commission if you make a purchase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

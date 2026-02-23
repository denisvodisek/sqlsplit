import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Sidebar() {
  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-normal text-muted-foreground">Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-4524750683541633"
            data-ad-slot="7285338195"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Related Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {['SQL Formatter', 'CSV to SQL', 'SQL Validator'].map((tool) => (
            <a
              key={tool}
              href="#"
              className="block rounded-lg bg-muted p-3 text-sm font-medium hover:bg-muted/80"
            >
              {tool}
              <span className="ml-2 text-xs text-muted-foreground">Coming soon</span>
            </a>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended Hosting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <a
            href="https://www.cloudways.com/en/?id=XXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                C
              </div>
              <div>
                <p className="font-medium group-hover:text-primary">Cloudways</p>
                <p className="text-xs text-muted-foreground">Managed Cloud Hosting</p>
              </div>
            </div>
          </a>

          <p className="text-xs text-muted-foreground">Affiliate links — we earn a commission if you purchase.</p>
        </CardContent>
      </Card>
    </div>
  )
}

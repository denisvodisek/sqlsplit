import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

// Article content components defined first
function PhpMyAdminTimeoutContent() {
  return (
    <>
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        If you&apos;ve ever tried importing a large SQL file into phpMyAdmin, you&apos;ve probably hit the dreaded timeout error. 
        This guide covers why it happens and 4 proven methods to fix it — from quick configuration tweaks to splitting your database into manageable chunks.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Why phpMyAdmin Times Out (The Real Reasons)</h2>
      <p className="mb-4 leading-relaxed">
        phpMyAdmin is a web application written in PHP, and like all PHP applications, it&apos;s constrained by server configuration limits. 
        When you import a large SQL file, three specific limits come into play:
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>max_execution_time</strong> — How long a PHP script can run (default: 30 seconds)</li>
        <li><strong>upload_max_filesize</strong> — Maximum file upload size (default: 2MB)</li>
        <li><strong>memory_limit</strong> — How much RAM PHP can use (default: 128MB)</li>
      </ul>

      <p className="mb-4 leading-relaxed">
        When your import hits any of these limits, phpMyAdmin stops dead. The frustrating part? 
        You might see different error messages depending on which limit you hit:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>&quot;Fatal error: Maximum execution time exceeded&quot;</li>
        <li>&quot;The uploaded file exceeds the upload_max_filesize directive&quot;</li>
        <li>&quot;504 Gateway Timeout&quot;</li>
        <li>Or simply: a blank white screen</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Method 1: Increase PHP Limits (The Quick Fix)</h2>
      <p className="mb-4 leading-relaxed">
        The fastest solution is to increase PHP&apos;s limits. This works for moderately large files (up to ~100MB), 
        but shared hosting providers often block these changes.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">For cPanel Users</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Log into cPanel</li>
        <li>Find &quot;Select PHP Version&quot; or &quot;MultiPHP INI Editor&quot;</li>
        <li>Increase these values:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>max_execution_time = 300</li>
            <li>max_input_time = 300</li>
            <li>memory_limit = 512M</li>
            <li>post_max_size = 512M</li>
            <li>upload_max_filesize = 512M</li>
          </ul>
        </li>
        <li>Save and restart PHP</li>
      </ol>

      <h3 className="text-xl font-semibold mt-6 mb-3">For XAMPP/MAMP Users</h3>
      <p className="mb-4">Edit your php.ini file:</p>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4"><code className="text-sm font-mono">{`# Windows: C:\\xampp\\php\\php.ini
# Mac: /Applications/MAMP/bin/php/php8.x.x/conf/php.ini

max_execution_time = 300
max_input_time = 300
memory_limit = 512M
post_max_size = 512M
upload_max_filesize = 512M`}</code></pre>

      <p className="mb-6">Then restart Apache.</p>

      <div className="bg-muted p-4 rounded-lg mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> On shared hosting, you may not have access to php.ini. 
          Try creating a php.ini or .user.ini file in your public_html folder with these values. 
          If that doesn&apos;t work, contact your host or use Method 2 below.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Method 2: Split Your SQL File (RECOMMENDED)</h2>
      <p className="mb-4 leading-relaxed">
        For files over 100MB — or when you can&apos;t change PHP limits — splitting your SQL file is the most reliable solution. 
        Instead of one massive import, you get several smaller files that import quickly and reliably.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">How to Split Your SQL File</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Go to <Link href="/" className="text-primary hover:underline">SQLSplit</Link></li>
        <li>Upload your .sql or .gz file</li>
        <li>Choose your split method:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>By Lines:</strong> 10,000 lines per file (good for most cases)</li>
            <li><strong>By Size:</strong> 10MB per file (matches phpMyAdmin limits)</li>
          </ul>
        </li>
        <li>Download the split files</li>
        <li>Import each file into phpMyAdmin, one at a time</li>
      </ol>

      <h3 className="text-xl font-semibold mt-6 mb-3">Why This Works</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Each small file imports in seconds, not minutes</li>
        <li>No timeout risk</li>
        <li>If one chunk fails, you don&apos;t lose everything</li>
        <li>Works on any host, even restrictive shared hosting</li>
      </ul>

      <div className="bg-primary/10 border border-primary p-6 rounded-lg mb-8">
        <h4 className="font-semibold mb-2">Privacy Note</h4>
        <p className="text-sm">
          SQLSplit runs entirely in your browser. Your database never leaves your computer — 
          we don&apos;t have a server that processes your files. This is crucial when working with sensitive data.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Method 3: Use the MySQL Command Line</h2>
      <p className="mb-4 leading-relaxed">
        If you have SSH access to your server, the command line is the fastest and most reliable method. 
        No file size limits, no timeouts.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Import via Command Line</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4"><code className="text-sm font-mono">mysql -u username -p database_name < your_file.sql</code></pre>

      <p className="mb-4">You&apos;ll be prompted for your password. Then wait — large imports can take minutes or hours, but they won&apos;t time out.</p>

      <h3 className="text-xl font-semibold mt-6 mb-3">For Compressed Files</h3>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4"><code className="text-sm font-mono">{`# For .gz files
gunzip < your_file.sql.gz | mysql -u username -p database_name

# For .zip files
unzip -p your_file.sql.zip | mysql -u username -p database_name`}</code></pre>

      <h3 className="text-xl font-semibold mt-6 mb-3">Pros and Cons</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-semibold">Pros</th>
              <th className="text-left p-2 font-semibold">Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">No file size limits</td>
              <td className="p-2">Requires SSH access</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">No timeouts</td>
              <td className="p-2">Command line knowledge needed</td>
            </tr>
            <tr>
              <td className="p-2">Fastest method</td>
              <td className="p-2">No progress bar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Method 4: BigDump.php (Not Recommended)</h2>
      <p className="mb-4 leading-relaxed">
        You might find tutorials recommending BigDump.php — a PHP script that imports large SQL files in chunks. 
        While it works, we don&apos;t recommend it for security reasons:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Last updated in 2015 (10 years ago)</li>
        <li>No longer maintained</li>
        <li>Potential security vulnerabilities</li>
        <li>Requires uploading the script to your server</li>
      </ul>

      <p className="mb-6">Use one of the other three methods instead.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">FAQ</h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">What size is too big for phpMyAdmin?</h3>
      <p className="mb-4">It depends on your server configuration, but generally:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Under 10MB:</strong> Usually works fine</li>
        <li><strong>10-50MB:</strong> May need PHP limit increases</li>
        <li><strong>50-500MB:</strong> Split the file or use command line</li>
        <li><strong>Over 500MB:</strong> Command line strongly recommended</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6 mb-3">Will splitting my SQL file break my database?</h3>
      <p className="mb-6 leading-relaxed">
        No — if you use a proper SQL splitter. SQLSplit preserves your database structure, 
        including headers (SET statements, character sets) and footers. Each chunk is a valid SQL file 
        that can be imported independently.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">How long should a database import take?</h3>
      <p className="mb-4">Rough estimates:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>10MB: 30 seconds - 2 minutes</li>
        <li>100MB: 2-10 minutes</li>
        <li>1GB: 10-60 minutes</li>
        <li>10GB: 1-6 hours</li>
      </ul>
      <p className="mb-6">
        Factors affecting speed: server CPU, disk I/O, network speed, number of indexes, and INSERT statement complexity.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Can I resume a failed import?</h3>
      <p className="mb-6 leading-relaxed">
        Not easily with phpMyAdmin. That&apos;s why splitting is recommended — if chunk 5 of 10 fails, 
        you only need to re-import that one chunk, not start over.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Summary: Which Method Should You Choose?</h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-semibold">Your Situation</th>
              <th className="text-left p-2 font-semibold">Recommended Method</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Small file (&lt;10MB), full server access</td>
              <td className="p-2">Method 1: Increase PHP limits</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Medium file (10-500MB), no SSH</td>
              <td className="p-2">Method 2: Split with SQLSplit</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Large file (&gt;500MB), SSH available</td>
              <td className="p-2">Method 3: Command line</td>
            </tr>
            <tr>
              <td className="p-2">Shared hosting, no configuration access</td>
              <td className="p-2">Method 2: Split with SQLSplit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Ready to fix your import?</h3>
        <p className="mb-4">
          Try SQLSplit free — no signup required, works in your browser, handles files up to 2GB.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Split Your SQL File Now
        </Link>
      </div>
    </>
  )
}

// Post metadata
interface Post {
  slug: string
  title: string
  date: string
  readTime: string
  author: string
  component: React.FC
}

const posts: Record<string, Post> = {
  'fix-phpmyadmin-import-timeout': {
    slug: 'fix-phpmyadmin-import-timeout',
    title: 'How to Fix phpMyAdmin Import Timeout (The Complete Guide)',
    date: '2025-02-23',
    readTime: '12 min read',
    author: 'SQLSplit Team',
    component: PhpMyAdminTimeoutContent,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]

  if (!post) {
    notFound()
  }

  const ContentComponent = post.component

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            SQLSplit
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Tools
            </Link>
            <Link href="/blog" className="text-sm font-medium">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <article className="lg:col-span-2 max-w-none">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/blog" className="hover:text-foreground">Blog</Link>
                <span>/</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-muted-foreground">By {post.author}</p>
            </div>

            <ContentComponent />
          </article>

          <Sidebar />
        </div>
      </main>
    </div>
  )
}

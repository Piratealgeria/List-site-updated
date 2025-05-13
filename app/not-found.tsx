import Link from "next/link"
import { Terminal } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-3xl bg-black text-green-500 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-900 p-2 flex items-center border-b border-gray-800">
          <Terminal className="mr-2" size={20} />
          <span className="text-sm">terminal@user:~</span>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">$</span>
            <span className="typing-animation">find /page</span>
          </div>

          <pre className="text-red-500 mt-2">
            {`
 _   _    ___    _  _      _   _    ___   _____   _____ ___  _   _ _  _ ___
| | | |  / _ \\  | || |    | \\ | |  / _ \\ |_   _| |  ___/ _ \\| | | | \\| |   \\
| |_| | | (_) | | || |_   |  \\| | | | | |  | |   | |_ | | | | | | | . \\| |) |
|  _  |  \\__, | |__   _|  | |\\  | | |_| |  | |   |  _|| |_| | |_| | |\\  ___/
|_| |_|    /_/     |_|    |_| \\_|  \\___/   |_|   |_|   \\___/ \\___/|_| \\_|

Error 404: Page not found
`}
          </pre>

          <div className="flex items-center">
            <span className="text-green-500 mr-2">$</span>
            <span>cd /home</span>
          </div>

          <div className="space-y-4 mt-6">
            <p className="text-white">The page you're looking for doesn't exist or has been moved.</p>

            <div className="space-y-2">
              <p className="text-green-500">Available commands:</p>
              <ul className="space-y-2 text-white">
                <li>
                  <Link href="/" className="text-blue-400 hover:underline">
                    $ cd /home
                  </Link>
                  <span className="ml-2 text-gray-400">Return to homepage</span>
                </li>
                <li>
                  <Link href="/archive" className="text-blue-400 hover:underline">
                    $ ls /archive
                  </Link>
                  <span className="ml-2 text-gray-400">Browse all posts</span>
                </li>
                <li>
                  <Link href="/search" className="text-blue-400 hover:underline">
                    $ grep "keyword" /content
                  </Link>
                  <span className="ml-2 text-gray-400">Search for content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

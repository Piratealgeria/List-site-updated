import type { Metadata } from "next"
import Link from "next/link"
import { Coffee, Heart, DollarSign, ArrowLeft } from "lucide-react"
import { baseMetadata } from "../../utils/metadata"
import { KofiButton } from "../../components/kofi-button"
import { socialConfig } from "../../config/social"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Support Viking Algeria | Buy Me a Coffee",
  description: "Support Viking Algeria's content creation by buying me a coffee on Ko-fi",
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to home</span>
        </Link>

        <div className="bg-[#1a1a1a] border border-gray-700 rounded-md shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-black p-3 border-b border-gray-700 flex items-center">
            <div className="flex space-x-1.5 mr-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-mono">$ support.sh</span>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <Coffee size={48} className="text-[#29abe0]" />
            </div>

            <h1 className="text-2xl font-bold text-center mb-4">Support Viking Algeria</h1>

            <div className="mb-8 font-mono bg-black p-4 rounded text-green-400 text-sm">
              <p>$ echo "Thank you for considering supporting my work!"</p>
              <p>$ cat reasons_to_support.txt</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Help me create more content</li>
                <li>Support server costs and equipment</li>
                <li>Enable me to spend more time on quality videos</li>
                <li>Get a warm fuzzy feeling inside</li>
              </ul>
            </div>

            <div className="text-center mb-8">
              <p className="mb-4">
                If you enjoy my content and would like to support my work, consider buying me a coffee on Ko-fi. Every
                contribution helps me continue creating content and improving the site.
              </p>

              <div className="flex justify-center">
                <KofiButton username={socialConfig.kofi.username} text="Buy me a coffee" isDarkMode={true} size="lg" />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 mt-6">
              <h2 className="text-xl font-bold mb-4 text-center">Other Ways to Support</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#222] p-4 rounded border border-gray-700">
                  <div className="flex items-center mb-3">
                    <Heart className="text-red-500 mr-2" size={20} />
                    <h3 className="font-bold">Subscribe & Share</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Subscribe to my YouTube and Odysee channels, and share my content with friends who might enjoy it.
                  </p>
                </div>

                <div className="bg-[#222] p-4 rounded border border-gray-700">
                  <div className="flex items-center mb-3">
                    <DollarSign className="text-green-500 mr-2" size={20} />
                    <h3 className="font-bold">Monthly Support</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Consider becoming a monthly supporter on Ko-fi to help me plan and create content consistently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { siteConfig } from "../config/site"

export default function ChannelShowcase() {
  const [activeTab, setActiveTab] = useState<"youtube" | "odysee">("youtube")

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-black text-white rounded-md border border-gray-800">
      <div className="flex justify-center mb-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oi9JcDr1Gi24oqOCsYaTV9fHbhO6aA.png"
          alt="Viking Algeria Logo"
          width={120}
          height={120}
          className="rounded-full border-2 border-blue-500"
        />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">Viking Algeria Channels</h2>

      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "youtube" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"} rounded-t-md mr-2`}
          onClick={() => setActiveTab("youtube")}
        >
          YouTube
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "odysee" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"} rounded-t-md`}
          onClick={() => setActiveTab("odysee")}
        >
          Odysee
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded-md">
        {activeTab === "youtube" && (
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <Image
                src="https://sjc.microlink.io/_fgdm-agYsW6e_CPV0omhqLB44AqMmNIg0y66pYLzZrFLXsHMDag4OPWTMeNqj25wMaclmVMv18FqnjgT1zrwg.jpeg"
                alt="YouTube Channel"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
            <div className="md:w-2/3 md:pl-6">
              <h3 className="text-xl font-bold mb-2">Viking Algeria on YouTube</h3>
              <p className="mb-4">
                Subscribe to my YouTube channel for anime mixes, music compilations, and more content!
              </p>
              <ul className="list-disc list-inside mb-4 text-gray-300">
                <li>136K+ subscribers</li>
                <li>50+ videos</li>
                <li>Regular uploads of anime content</li>
                <li>Music mixes and compilations</li>
              </ul>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Visit YouTube Channel
              </a>
            </div>
          </div>
        )}

        {activeTab === "odysee" && (
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <Image
                src="https://sjc.microlink.io/mo763Vhj9uk9SgpjcA9thwwfSKqFxjupXaChyfuseW_8_9pJdi5H67dvj-MZ9rJ2mB0NZ26k4QLPAEVIv2NrZw.jpeg"
                alt="Odysee Channel"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
            <div className="md:w-2/3 md:pl-6">
              <h3 className="text-xl font-bold mb-2">Viking Algeria on Odysee</h3>
              <p className="mb-4">
                Follow my Odysee channel for exclusive content and alternative platform for all my videos!
              </p>
              <ul className="list-disc list-inside mb-4 text-gray-300">
                <li>Alternative to YouTube</li>
                <li>Exclusive content</li>
                <li>Uncensored videos</li>
                <li>Support through cryptocurrency</li>
              </ul>
              <a
                href={siteConfig.links.odysee}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Visit Odysee Channel
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-4">
          This website serves as an archive for my videos and lists of resources I use in my content.
        </p>
        <Link href="/posts" className="text-blue-400 hover:text-blue-300">
          Browse the Archive →
        </Link>
      </div>
    </div>
  )
}

const CACHE_VERSION = "v1.1.0"
const CACHE_NAME = `mrcherif-terminal-blog-${CACHE_VERSION}`

// Add reading queue cache
const READING_QUEUE_CACHE = `mrcherif-reading-queue-${CACHE_VERSION}`

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/favicon.ico",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/fonts/rubik-var.woff2",
  "/offline.html", // Add an offline fallback page
]

// Cache strategies
const STRATEGIES = {
  cacheFirst: [/\.(js|css|woff2)$/, /\.(png|jpg|jpeg|svg|gif|webp)$/],
  networkFirst: [/\/api\//, /\/posts\//],
}

// Install event - Cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting()

  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)))
})

// Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith("mrcherif-terminal-blog-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Helper function to determine cache strategy
function getStrategy(url) {
  const strategies = Object.entries(STRATEGIES)
  for (const [strategy, patterns] of strategies) {
    if (patterns.some((pattern) => pattern.test(url))) {
      return strategy
    }
  }
  return "networkFirst" // Default strategy
}

// Fetch event - Apply appropriate caching strategy
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip cross-origin requests
  if (new URL(event.request.url).origin !== location.origin) return

  const strategy = getStrategy(event.request.url)

  if (strategy === "cacheFirst") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          event.waitUntil(
            fetch(event.request).then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response))
              }
            }),
          )
          return cachedResponse
        }

        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clonedResponse = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse))
          }
          return response
        })
      }),
    )
  } else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clonedResponse = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse))
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // If the request is for a page, return the offline page
            if (event.request.mode === "navigate") {
              return caches.match("/offline.html")
            }
            return null
          })
        }),
    )
  }
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "ADD_TO_READING_QUEUE") {
    const { url, title, excerpt, timestamp } = event.data

    caches.open(READING_QUEUE_CACHE).then((cache) => {
      // Create a response with the article metadata
      const articleData = {
        url,
        title,
        excerpt,
        timestamp,
        added: new Date().toISOString(),
      }

      const response = new Response(JSON.stringify(articleData), {
        headers: { "Content-Type": "application/json" },
      })

      // Store in the reading queue cache
      cache.put(`reading-queue-${timestamp}`, response)

      // Also cache the actual page
      fetch(url).then((pageResponse) => {
        if (pageResponse.ok) {
          cache.put(url, pageResponse)
        }
      })
    })
  }

  if (event.data && event.data.type === "REMOVE_FROM_READING_QUEUE") {
    const { timestamp } = event.data

    caches.open(READING_QUEUE_CACHE).then((cache) => {
      cache.delete(`reading-queue-${timestamp}`)
    })
  }
})

// Handle push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || "New content available",
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title || "Terminal Blog Update", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const hadClientOpen = clientList.some((client) => {
        if (client.url === event.notification.data.url) {
          return client.focus()
        }
        return false
      })

      if (!hadClientOpen) {
        clients.openWindow(event.notification.data.url)
      }
    }),
  )
})

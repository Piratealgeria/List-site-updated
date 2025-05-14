// This file contains server-side only utilities
// These functions should only be imported in server components or API routes

// Example of a server-side function that uses fs
export async function readFileFromServer(filePath) {
  // This will only be called on the server
  if (typeof window === "undefined") {
    const fs = require("fs")
    const path = require("path")
    try {
      return fs.readFileSync(path.resolve(filePath), "utf8")
    } catch (error) {
      console.error("Error reading file:", error)
      return null
    }
  }
  return null
}

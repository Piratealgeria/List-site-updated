// This file contains client-side only utilities
// These functions are safe to import anywhere

// Example of a client-side function that doesn't use Node.js modules
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

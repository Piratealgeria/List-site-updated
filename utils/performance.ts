export function getImageLoadingPriority(index: number): "eager" | "lazy" {
  // Load the first few images eagerly for LCP optimization
  return index < 2 ? "eager" : "lazy"
}

// Web Vitals reporting function
export function reportWebVitals(metric: {
  id: string
  name: string
  label: string
  value: number
}) {
  // You can send to your analytics service here
  if (process.env.NODE_ENV !== "production") {
    console.log(metric)
  }

  // Example: send to your custom endpoint
  // const body = JSON.stringify(metric);
  // const url = 'https://example.com/analytics';
  //
  // if (navigator.sendBeacon) {
  //   navigator.sendBeacon(url, body);
  // } else {
  //   fetch(url, { body, method: 'POST', keepalive: true });
  // }
}

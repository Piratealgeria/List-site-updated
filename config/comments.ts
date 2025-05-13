export const commentsConfig = {
  provider: "giscus", // "giscus" or "utterances" or "disqus"

  // Giscus configuration
  giscus: {
    repo: "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME",
    repoId: "YOUR_REPO_ID",
    category: "Announcements",
    categoryId: "YOUR_CATEGORY_ID",
    mapping: "pathname",
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: "top",
    lang: "en",
  },

  // Utterances configuration (if you want to switch in the future)
  utterances: {
    repo: "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME",
    issueTerm: "pathname",
    label: "comment",
    theme: "github-dark",
  },

  // Disqus configuration (if you want to switch in the future)
  disqus: {
    shortname: "your-disqus-shortname",
  },
}

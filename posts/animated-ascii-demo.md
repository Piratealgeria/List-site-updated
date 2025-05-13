---
id: "animated-ascii-demo"
title: "Animated ASCII Art Demo"
excerpt: "Demonstrating the new animated ASCII art feature in blog posts."
author: "MrCherif"
date: "2025-03-25"
category: "TECH"
tags: ["ascii", "animation", "demo"]
animatedAsciiArt: [
  "  ∧_∧\n (・ω・)\n つ  つ\n しーＪ",
  "  ∧_∧\n (・ω・)\n  ⊂ ⊃\n しーＪ",
  "  ∧_∧\n (・ω・)\n (  つ\n しーＪ"
]
---

# Animated ASCII Art Demo

This post demonstrates the new animated ASCII art feature that allows for GIF-like animations using ASCII characters.

## How It Works

The animation works by cycling through a series of ASCII art frames, similar to how GIF animations work. You can define these frames in the post's frontmatter.

## Creating Your Own Animations

To create your own animated ASCII art, add an `animatedAsciiArt` array to your post's frontmatter, with each string in the array representing a single frame of the animation.

```yaml
animatedAsciiArt: [
  "Frame 1 ASCII art",
  "Frame 2 ASCII art",
  "Frame 3 ASCII art"
]

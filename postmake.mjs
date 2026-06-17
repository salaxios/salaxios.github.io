#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get date and title from command line
const args = process.argv.slice(2);
let title = args.join(' ') || 'Untitled Post';
let date = new Date();

// Allow custom date: node newpost.js "My Title" "2024-12-25"
if (args[1] && args[1].match(/^\d{4}-\d{2}-\d{2}$/)) {
    date = new Date(args[1]);
    title = args[0];
} else if (args[0] && args[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
    date = new Date(args[0]);
    title = args[1] || 'Untitled Post';
}

// Format date for filename and front matter
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

// Create slug from title
const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens
    .replace(/^-|-$/g, '');    // Trim hyphens

const filename = `${formattedDate}-${slug}.md`;
const postsDir = path.join(process.cwd(), '_posts');

// Ensure _posts directory exists
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
}

const filepath = path.join(postsDir, filename);

// Template with common Jekyll front matter
const template = `---
layout: post
title: "${title.replace(/"/g, '\\"')}"
date: ${formattedDate} ${date.toTimeString().split(' ')[0]} +0000
categories: [uncategorized]
tags: []
author: 
description: 
image: 
---

## Introduction

Write your content here.

<!--more-->

## Section 1

Content goes here...

## Conclusion

Wrap up your thoughts here.
`;

// Check if file already exists
if (fs.existsSync(filepath)) {
    console.error(`❌ Error: ${filename} already exists!`);
    process.exit(1);
}

// Write the file
fs.writeFileSync(filepath, template, 'utf8');
console.log(`✅ Created new post: ${filepath}`);
console.log(`\n📝 Front matter preview:`);
console.log(`---`);
console.log(`layout: post`);
console.log(`title: "${title}"`);
console.log(`date: ${formattedDate}`);
console.log(`---`);
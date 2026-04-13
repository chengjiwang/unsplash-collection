<h1 align="center">Unsplash Collection | devChallenges</h1>

<div align="center">
   Solution for a challenge <a href="https://devchallenges.io/challenge/unsplash-collection" target="_blank">Unsplash Collection
</a> from <a href="http://devchallenges.io" target="_blank">devChallenges.io</a>.
</div>

<div align="center">
  <h3>
    <a href="https://unsplash-collection-gallery.vercel.app/">
      Demo
    </a>
  </h3>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Overview](#overview)
- [Built with](#built-with)
- [Features](#features)

<!-- OVERVIEW -->

## Overview

A full-stack web application that integrates with the Unsplash API, allowing users to search for photos and organize them into personal collections. Users can browse search results, view image details, and manage collections — adding or removing images at any time.

### Built with

#### Frontend

- [Vue.js 3](https://vuejs.org/) — Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Reka UI](https://reka-ui.com/) — Headless UI components
- [TanStack Query](https://tanstack.com/query) — Server state management
- [Pinia](https://pinia.vuejs.org/) — Client state management
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Lucide Vue Next](https://lucide.dev/) — Icons

#### Backend

- [Node.js](https://nodejs.org/) + [Express.js v5](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/) — Database access
- [PostgreSQL](https://www.postgresql.org/) — Data persistence
- [Zod](https://zod.dev/) — Request validation

## Features

This application/site was created as a submission to a [DevChallenges](https://devchallenges.io/challenges-dashboard) challenge.

- **Image Search** — Search Unsplash photos by keyword; results display on Enter
- **Image Detail** — View full-size photo with author name and published date
- **Collection Management** — Create named collections and add/remove images
- **Smart Add Modal** — Search existing collections when adding an image; filters out collections the image already belongs to
- **Image Download** — Download original images directly from the detail page
- **Collections Gallery** — Browse all collections and preview the images inside each one



damus.io
=========

The damus.io website

## Installation

1. Install [nodejs](https://nodejs.org/en/download/) (v18.0.0 or higher is required)
2. Install dependencies with `npm install` (`yarn install` or `pnpm install` are possibilities if preferred)

## Running the development server (for local development)

First, run the development server from the root directory of the project:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying any page or component. The page auto-updates as you edit the file.

## Building for production

To build the project for production, run the following command from the root directory of the project:

```bash
npm run build
```

This will build the project for production and output the result to the `.next` directory.

## Deploying to production

This project can be deployed to any static hosting provider that supports Next.js. Examples include [Vercel](https://vercel.com), [Netlify](https://netlify.com).

## Project structure

The project is roughly structured as follows:

- `package.json` - The [npm](https://npmjs.com/) configuration file (contains dependencies, scripts, etc.)
- `src/components/` - React components used throughout the project
- `src/pages/` - The pages of the website
- `public/` - Static assets such as images, fonts, etc. Any files in this directory will be served under the `/` path.
- `tailwind.config.js` - The [Tailwind CSS](https://tailwindcss.com/) configuration file. This file is used to configure the Tailwind CSS framework, which is used for styling the website.
- `next.config.js` - The [Next.js](https://nextjs.org/) configuration file, which is used to configure the Next.js framework.
- `tsconfig.json` - The [TypeScript](https://www.typescriptlang.org/) configuration file, which is used to configure the TypeScript compiler.
- `postcss.config.js` - The [PostCSS](https://postcss.org/) configuration file, which is used to configure the PostCSS compiler. PostCSS is used to compile Tailwind CSS to regular CSS.
- `src/pages/api` - The [Next.js API routes](https://nextjs.org/docs/api-routes/introduction), which can used to implement server-side (serverless) functions.

## Contributing

You can send me patches over nostr or [email][email] at jb55@jb55.com

You can also just hit me up with a git-request-pull and ask me to pull one of
your branches. eg, from github:

    git request-pull origin/master https://github.com/bob/my-damus-io-fork

If you email or nostr me the output of this command I will be able to review &
merge your changes!

[email]: https://git-send-email.io/

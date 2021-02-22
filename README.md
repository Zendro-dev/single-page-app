<h1 align=center> Zendro Frontend</h1>

<p align=center>A generic web application to send CRUD requests to a Zendro GraphQL API.</p>


## Description

This application offers a generic graphical user interface to send CRUD requests to a Zendro-enabled GraphQL endpoint, and can serve as a starting point to design a fully customized user experience for your project.

The project leverages [Next.js](https://nextjs.org/) APIs to create a static site that is tailored specifically to support your custom data models, and contains all the necessary functionality used to communicate with the Zendro backend.

## Setup

Two steps are required before using the Zendro frontend:

- Adding your custom data model definitions (using our unified JSON schema format) to the `models` folder.
- Configuring of the Zendro GraphQL endpoint to be used. This is done in the `env.local` file.

### Data Models

Each model is an independent file that describes the shape, or schema, of one data set. These models also include the relations, or associations, that they have with other models.

To facilitate the development process, we use a unified `JSON` format that works in both Zendro backend and frontend projects. To learn more about how to set up data models, please visit our documentation on [how to define data models for developers](https://zendro-dev.github.io/setup_data_scheme.html). We also have available [documentation for non-developers](https://zendro-dev.github.io/non-developer_documentation.html) with a more abstract approach.

### Configuration

For the Zendro frontend to know the location of its GraphQL endpoint, as well as other parameters required for its functionality, several environmental variables need to be defined in an `.env.local` file.

This file is also used by Next.js to set any environment variables that should be available to either the built-in generator, or in the browser. Read more about Next.js environmental variables [in the official documentation](https://nextjs.org/docs/basic-features/environment-variables).

For security reasons, this file is never committed to the remote repository. However, we have included an example `.env.local.example` file with some reasonable defaults that may be used in development. To get started, you can begin by renaming `.env.local.example` to `.env.local`.

Below there is a brief explanation of what each variable is used for.

```bash
# Public port where the application is served
NEXT_PUBLIC_PORT=8080

# GraphQL endpoint address. Used to send data queries and mutations.
NEXT_PUBLIC_ZENDRO_GRAPHQL_URL='http://localhost:3000/graphql'

# Endpoing login address. Used for authentication.
NEXT_PUBLIC_ZENDRO_LOGIN_URL='http://localhost:3000/login'

# Endpoint export address. Used to request table downloads in CSV format.
NEXT_PUBLIC_ZENDRO_EXPORT_URL='http://localhost:3000/export'

# Maximum allowed upload size in megabytes.
NEXT_PUBLIC_ZENDRO_MAX_UPLOAD_SIZE=500

# Maximum number of records that can be returned per request.
NEXT_PUBLIC_ZENDRO_MAX_RECORD_LIMIT=10000
```

## Development

To start a development server, the following command is available.

```bash
yarn dev
```

- The Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
- You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.
- The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deployment

### Static Application

The default Zendro application is configured as a fully static site. The final build can be generated, and optionally previewed, via the following commands.

```bash
yarn build    # build the application in `.next` folder
yarn export   # export to `out` folder as as a static site
yarn serve    # optionally preview the exported static site
```

Once the `out` folder is generated, it can be served as static content from a custom webserver, for example using [NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/), or deployed to a static hosting site, such as [Netlify](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/) or [Github Pages](https://pages.github.com).

### Hybrid Application

If you have modified the application to use server-side logic, for example by adding support for [Incremental Static Generation](https://nextjs.org/blog/next-9-3#next-gen-static-site-generation-ssg-support) or [Server-Side Rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering), a Node.js server is required to host the application.

```bash
yarn build    # build the application in `.next` folder
yarn start    # serve the application using the provided Node.js server
```

Alternatively, you can deploy to the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Customization

### Custom Pages

Routes in the application automatically mirror the structure of the pages folder. The default static site contains a dynamic `[model]` route, with a home page ([`index.tsx`](./src/pages/[model]/index.tsx)) to display an interactive table of records, and one child route ([`item.tsx`](./src/pages/[model]/item.tsx)) to display data for a single record.

Overriding a model route with a custom page only requires to provide an appropriately named file within the pages folder. Because in Next.js predefined routes take precedence over dynamic routes, all requests for that model will now point to the new page.

In the example below, a custom `books.tsx` page is overriding the default `/books` route that would be otherwise provided by `[model]/index.tsx`.

```
pages
├── [model]
│   ├── index.tsx
│   └── [item].tsx
├── books.tsx
├── index.tsx
└── login.tsx
```

### Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

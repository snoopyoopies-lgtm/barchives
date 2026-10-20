# Publish barchives from GitHub

Use the separate files in barchives-github.zip. Its index.html is a normal, editable HTML document, with images in assets/, styles in style.css, and behaviour in site.js. The standalone barchives.html embeds all four pages and images and is much larger. You do not need that file for this deployment.

## 1. Upload the files to GitHub

1. Download barchives-github.zip and extract it on your computer.
2. Open your barchives repository and select its main branch (or the branch you intend to publish).
3. Choose Add file → Upload files.
4. Drag the extracted contents into the upload area. Preserve the folders. index.html must be at the repository root, beside style.css and site.js. Do not upload the ZIP itself or place everything inside an extra enclosing folder.
5. If an old standalone file already occupies index.html, upload this package's index.html at the same path to replace it. Keep the rest of your repository files unless you intend to remove them.
6. Commit the changes, or merge the proposed changes into the publishing branch if your repository requires a pull request.

The site files are index.html, finance/index.html, journal/index.html, clipboard/index.html, assets/, style.css, site.js, site-config.js, favicon.svg, robots.txt, and .nojekyll. Each product folder contains its own index.html. Keep these exact names, including the .html extension.

GitHub accepts browser uploads up to 25 MiB per file. Every file in this package is much smaller. A message that a file is too large to display does not by itself mean it cannot be uploaded or hosted.

Source: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## 2. Optional: publish a GitHub Pages preview

In the repository, open Settings → Pages. Under Build and deployment choose Deploy from a branch, select main (or your chosen branch), choose /(root), and Save. Keep the supplied .nojekyll file. Once the deployment finishes, use GitHub's Visit site link. For this repository the expected address is https://snoopyoopies-lgtm.github.io/barchives/.

GitHub Pages is optional if Cloudflare Pages will host your site. Cloudflare needs the repository files; it does not need an already running GitHub Pages site.

Source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 3. Connect the repository to Cloudflare Pages

In Cloudflare, open Workers & Pages → Create application → Pages → Import an existing Git repository. Connect GitHub, select the barchives repository, then configure:

| Setting | Value for this package |
| --- | --- |
| Production branch | main, or the branch where you uploaded the files |
| Framework preset | None |
| Build command | exit 0 |
| Build output directory | . |
| Root directory | Leave at the repository root |

These settings assume index.html is at the repository root. There is no build step or package installation: the files are ready to serve. The dot in the output directory means the root folder itself. Save and Deploy. Cloudflare will give you a pages.dev address; future pushes to the production branch will update that deployment.

The site's relative navigation and asset paths work both under GitHub's /barchives/ path and at the root of a Cloudflare Pages domain. After you choose a permanent domain, update the canonical and og:url metadata in the four HTML files to that domain; this does not change navigation.

Sources:
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/get-started/git-integration/

## Editing later

Edit homepage text in index.html, product text in each product folder's index.html, colours and spacing in style.css, and the public Clipboard checkout override in site-config.js. Keep the paid installation shortcut link in purchased materials.

Commit edits to GitHub and Cloudflare will publish them after the connected deployment runs. This ZIP contains the mobile gallery alignment and Finance screenshot sizing fixes.

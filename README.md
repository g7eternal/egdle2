> ⚠️ **Notice**
> 
> Egdle is now an integral part of another project: [Okayeg.com](https://github.com/badoge/okayeg.com).  
> 
> This repository will remain as a public archive, it will receive no updates. All changes to the game will be reflected in new repository.

# Egdle2

A rework of a daily egg-hunting game. Now with new game modes!

Available at [okayeg.com/egdle](https://okayeg.com/egdle)

## Development
Here's a simple way to run app locally.

```bash
# install all dependencies
npm install

# run locally with debugging
npm run dev
```
Then follow the instructions from console. Most likely the app will be available at localhost:5173

Suggested editor is VS Code with the following plugins:

* Svelte for VS Code
* ESLint
* Prettier
* GitLens

## Building
Project uses `@sveltejs/adapter-static` - the resulting build will consist of static resources.

To create a production version of your app:

```
npm run build
```

You can preview the production build with `npm run preview`.

The static version of app will be available at `/build` after you run a build.

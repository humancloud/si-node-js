# StackInsights NodeJS Release Guide

This documentation guides the release manager to release the StackInsights NodeJS in the Way, and also helps people to check the release for voting.


## Build and sign the source code package

```shell
export VERSION=<the version to release>

git clone --recurse-submodules git@github.com:humancloud/stackinsights-nodejs && cd stackinsights-nodejs
git tag -a "v$VERSION" -m "Release Humancloud StackInsights-NodeJS $VERSION"
git push --tags

npm install && npm run release-src
```

## Publish release

1. Refer [Github release page](https://github.com/humancloud/si-node-js/releases), follow the previous convention.

1. Publish to npmjs.com, this is optional for releases, but we usually want to do this to let users use it conveniently.

  ```shell
  npm run build && npm pack && npm publish
  ```

**NOTE**: please double check before publishing to npmjs.com, it's difficult to unpublish and republish the module at the moment.


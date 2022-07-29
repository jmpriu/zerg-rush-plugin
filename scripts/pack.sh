#bin/bash
npm run build
cp ./dist/index.bundle.js ./pack
cp ./extension-files/manifest.json ./pack
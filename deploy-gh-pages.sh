#!/usr/bin/env sh

# abort on errors
set -e

# build with GitHub Pages flag
echo "🔨 Building for GitHub Pages..."
export GITHUB_PAGES=true
npm run build

# navigate into the build output directory
cd dist

# create .nojekyll to bypass Jekyll processing
echo "📝 Creating .nojekyll file..."
touch .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

echo "📦 Initializing git repository..."
git init
git add -A
git commit -m "🚀 Deploy to GitHub Pages"

# if you are deploying to https://<USERNAME>.github.io/<REPO>
echo "🚀 Pushing to gh-pages branch..."
git push -f https://github.com/mahmoudelamir338/Quran-for-Kids.git main:gh-pages

cd ..

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://mahmoudelamir338.github.io/Quran-for-Kids/"
echo "⏳ Please wait 1-2 minutes for GitHub Pages to update..."
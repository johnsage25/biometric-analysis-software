echo "Setting up dependencies"
echo "Yarn installing dependencies"

yarn

echo "Building nextjs app...."

yarn build # build our app for production (npm build script: next build)

echo "Installing PM2 manager"

yarn global add pm2 # install pm2 to keep next app alive forever*

echo "Starting nextjs App"

pm2 start npm --name "next" -- start # start next app (npm start script: next start)

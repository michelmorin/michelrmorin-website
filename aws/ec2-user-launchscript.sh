
# Install nvm
curl -O https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh
bash install.sh
. ~/.nvm/nvm.sh

# Install node and npm
nvm install v14.16.0

# Install pm2
npm install pm2 -g

# get latest from github
mkdir /home/ec2-user/git
cd /home/ec2-user/git
git clone https://github.com/michelmorin/michelrmorin-website.git
git clone https://github.com/michelmorin/bowlingapp.git

# Install dependencies 
cd /home/ec2-user/git/michelrmorin-website
npm install
pm2 start app.js

cd /home/ec2-user/git/bowlingapp
npm install
pm2 start app.js

# Configure pm2 and start
pm2 startup
sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v14.16.0/bin /home/ec2-user/.nvm/versions/node/v14.16.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save
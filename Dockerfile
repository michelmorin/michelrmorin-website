FROM node:12

#Directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install dependencies
COPY package*.json ./
USER node
RUN npm install

# Copy project files
COPY --chown=node:node . .

# Expose running port
EXPOSE 5000

# Run the project
CMD [ "node", "app.js" ]

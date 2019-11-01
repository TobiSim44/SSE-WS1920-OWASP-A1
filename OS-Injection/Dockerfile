FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production
RUN export YOUR_CTF_FLAG=/{21c03acad5a7e68094b680725be8137a480a783564308d00612f9e301de9e3a2}

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]

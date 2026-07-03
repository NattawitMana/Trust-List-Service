FROM node:20-alpine

# Install git and ssh-client for repository management and pushes
RUN apk add --no-cache git openssh-client

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

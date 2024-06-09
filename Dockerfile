# Use Node.js 14 LTS as base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

COPY .env .env

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build TypeScript code
RUN npm run build

# Run database migrations
RUN npm run migrate

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]

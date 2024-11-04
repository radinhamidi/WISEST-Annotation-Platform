# Use the official Node.js image from DockerHub
FROM node:22-alpine
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json if present
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire current directory into the container at /app
COPY . .

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port 3016 to the outside world
EXPOSE 3016

# Command to run the application
CMD ["node", "app.js"]

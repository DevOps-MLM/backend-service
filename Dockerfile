# Step 1: Menggunakan Node.js sebagai base image
FROM node:16-alpine

# Step 2: Set working directory di dalam container
WORKDIR /app

# Step 3: Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Step 4: Copy folder prisma ke dalam container
COPY prisma ./primsa/

# Step 5: Copy seluruh file project ke dalam container
COPY . .

# Step 6: Install dependencies
RUN npm install

# Step 7: Generate Prisma
RUN npm run postinstall

# Step 8: Migrate Prisma
RUN npm run migrate

# Expose
EXPOSE 3000

# Jalankan Node
CMD ["node", "index.js"]
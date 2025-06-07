# -------------------------------
# Stage 1: Build dependencies
# -------------------------------
  FROM node:18-alpine AS build

  RUN apk add --no-cache libc6-compat
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm install --production
  COPY . .
  
  # -------------------------------
  # Stage 2: Runtime
  # -------------------------------
  FROM node:18-alpine
  
  WORKDIR /usr/src/app
  COPY --from=build /usr/src/app .
  
  # Tạo thư mục ảnh nếu chưa có
  RUN mkdir -p public/images
  
  # Khai báo volume – nơi lưu ảnh
  VOLUME ["/usr/src/app/public/images"]
  
  EXPOSE 3001
  CMD ["node", "app.js"]
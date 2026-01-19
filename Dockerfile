# === Build Stage ===
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 먼저 복사 (캐시 활용)
COPY package*.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# === Runtime Stage ===
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
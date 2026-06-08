# Dac-san-be-clean-architecture

Backend API cho website bán đặc sản vùng miền, thiết kế theo Clean Architecture.

## Stack

- NestJS
- PostgreSQL
- TypeORM
- Redis
- MinIO
- Docker Compose

## Domain ưu tiên MVP

1. Region - vùng miền / tỉnh / làng nghề
2. Product - sản phẩm đặc sản
3. Story - câu chuyện sản phẩm / vùng miền / nhà sản xuất
4. Gift Set - quà tặng tùy chỉnh
5. Order / Payment / Shipping

## Kiến trúc thư mục

```txt
src/
├── config/
├── shared/
├── database/
└── modules/
    └── product/
        ├── domain/
        │   ├── entities/
        │   └── repositories/
        ├── application/
        │   ├── dtos/
        │   └── use-cases/
        ├── infrastructure/
        │   └── persistence/
        │       └── typeorm/
        │           ├── entities/
        │           └── repositories/
        └── presentation/
            └── http/
```

## Chạy local

```bash
cp .env.example .env
docker compose up -d
npm install
npm run start:dev
```

Swagger:

```txt
http://localhost:3000/docs
```

## Tạo repo Git

```bash
git init
git add .
git commit -m "init backend clean architecture"
git branch -M main
git remote add origin <GIT_REPOSITORY_URL>
git push -u origin main
```

## Nguyên tắc Clean Architecture

- `domain`: entity, interface repository, business rule thuần.
- `application`: use-case, DTO, xử lý nghiệp vụ ứng dụng.
- `infrastructure`: database, TypeORM, external service.
- `presentation`: controller, route, request/response HTTP.
- Controller không gọi trực tiếp ORM.
- Use-case không phụ thuộc TypeORM/NestJS controller.

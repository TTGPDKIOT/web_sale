# Dac San Backend API

Backend cho website bán đặc sản vùng miền, được xây dựng bằng NestJS theo hướng Clean Architecture.

## Mục tiêu dự án

- Quản lý danh mục vùng miền, sản phẩm và câu chuyện thương hiệu
- Hỗ trợ API cho frontend bán hàng
- Dễ mở rộng cho các module như giỏ hàng, đơn hàng, thanh toán và vận chuyển

## Công nghệ sử dụng

- NestJS
- TypeORM
- PostgreSQL
- Swagger
- Docker Compose
- Node.js

## Tính năng hiện có

- Quản lý vùng miền (`regions`)
- Quản lý sản phẩm (`products`)
- Quản lý câu chuyện (`stories`)
- API document bằng Swagger
- Validation request bằng DTO

## Kiến trúc dự án

```txt
src/
├── app.module.ts
├── main.ts
├── database/
│   ├── database.module.ts
│   └── typeorm.config.ts
└── modules/
    ├── region/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── presentation/
    ├── product/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── presentation/
    └── story/
        ├── domain/
        ├── application/
        ├── infrastructure/
        └── presentation/
```

## Cấu trúc theo layer

- `domain`: entity, interface repository, business rules
- `application`: use-case, DTO, logic nghiệp vụ
- `infrastructure`: ORM, DB connection, repository implementation
- `presentation`: controller, request/response HTTP

## Cài đặt và chạy

### 1. Tạo file môi trường

```bash
cp .env.example .env
```

### 2. Khởi động database

```bash
docker compose up -d
```

### 3. Cài đặt dependencies

```bash
npm install
```

### 4. Chạy server ở mode dev

```bash
npm run start:dev
```

## API Docs

Sau khi chạy server, truy cập:

```txt
http://localhost:3000/docs
```

## API chính

- `GET /api/regions`
- `GET /api/regions/:slug`
- `POST /api/regions`
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/products`
- `GET /api/stories`
- `GET /api/stories/:slug`
- `POST /api/stories`

## Quy tắc phát triển

- Controller chỉ nhận request và trả response
- Use-case xử lý nghiệp vụ
- Repository chỉ giao tiếp với database
- Không gọi ORM trực tiếp từ controller
- Luôn dùng DTO để validate dữ liệu đầu vào

## Ghi chú

Nếu bạn muốn mở rộng thêm cho MVP, các module tiếp theo có thể là:
- giỏ hàng
- đơn hàng
- thanh toán
- vận chuyển
- upload ảnh
- kiểm tra quyền truy cập

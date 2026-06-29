# Dac San Backend API

Backend API cho website bán đặc sản vùng miền, xây dựng bằng NestJS theo hướng Clean Architecture.

## Mục tiêu

- Cung cấp API cho frontend thương mại điện tử bán sản phẩm đặc sản.
- Quản lý vùng miền, sản phẩm và câu chuyện thương hiệu.
- Giữ kiến trúc có thể mở rộng cho các module như giỏ hàng, đơn hàng, thanh toán và vận chuyển.

## Công nghệ

- NestJS
- TypeORM
- PostgreSQL
- Swagger
- Docker Compose
- Node.js
- TypeScript

## Tính năng hiện tại

- Quản lý vùng miền (`regions`)
- Quản lý sản phẩm (`products`)
- Quản lý câu chuyện (`stories`)
- API documentation với Swagger
- Validate request bằng DTO

## Cấu trúc dự án

```txt
src/
├── app.module.ts
├── main.ts
├── database/
│   ├── database.module.ts
│   └── typeorm.config.ts
├── modules/
│   ├── audit-logs/
│   ├── auth/
│   ├── permissions/
│   ├── product/
│   ├── region/
│   ├── roles/
│   ├── story/
│   └── users/
└── shared/
    └── errors/
```

## Kiến trúc theo layer

- `domain`: entity, interface repository, business rules.
- `application`: use-case, DTO, logic nghiệp vụ.
- `infrastructure`: ORM, DB connection, repository implementation.
- `presentation`: controller, request/response HTTP.

## Cài đặt và chạy

### Yêu cầu

- Node.js >= 20
- Docker
- PostgreSQL (có thể chạy qua Docker Compose)

### 1. Sao chép file môi trường

```bash
cp .env.example .env
```

### 2. Khởi động cơ sở dữ liệu

```bash
docker compose up -d
```

### 3. Cài đặt dependencies

```bash
npm install
```

### 4. Chạy server ở chế độ phát triển

```bash
npm run start:dev
```

### 5. Xây dựng production (nếu cần)

```bash
npm run build
```

## Các script hữu ích

- `npm run start`: chạy server NestJS.
- `npm run start:dev`: chạy server với chế độ watch.
- `npm run build`: build ứng dụng.
- `npm run lint`: chạy ESLint và tự sửa một số lỗi.
- `npm run test`: chạy Jest.
- `npm run migration:generate`: tạo migration mới.
- `npm run migration:run`: chạy migration.
- `npm run seed`: seed dữ liệu mẫu.

## API Documentation

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

- Controller chỉ nhận request và trả response.
- Use-case / application xử lý nghiệp vụ.
- Repository chỉ tương tác với database.
- Không gọi ORM trực tiếp từ controller.
- Luôn dùng DTO để validate input.

## Mở rộng tiếp theo

- Giỏ hàng
- Đơn hàng
- Thanh toán
- Vận chuyển
- Upload ảnh
- Phân quyền và authentication nâng cao

## Ghi chú

- Đảm bảo `.env` đã cấu hình đúng kết nối database.
- Nếu cần, chạy `docker compose logs -f` để kiểm tra logs Docker.
- Swagger giúp kiểm tra nhanh các endpoint và cấu trúc request/response.

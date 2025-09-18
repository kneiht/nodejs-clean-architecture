# Node.js Clean Architecture

`README này được viết bằng AI`

Dự án này là một implementation mẫu về Clean Architecture sử dụng Node.js, Express, và TypeScript. Nó thể hiện sự tách biệt rõ ràng giữa các layer khác nhau của ứng dụng, tuân thủ nghiêm ngặt các nguyên tắc SOLID để tạo ra một hệ thống linh hoạt, dễ bảo trì và mở rộng.

## 🏗️ Kiến trúc Clean Architecture

Dự án tuân theo nguyên tắc Clean Architecture của Uncle Bob, được chia thành 4 layer chính từ trong ra ngoài:

### 📦 1. Entities Layer (`src/entities/`)

**Trách nhiệm**: Chứa các business entities và business rules cốt lõi

- **BaseEntity**: Abstract class cung cấp validation, ID generation, password hashing
- **User Entity**: Định nghĩa cấu trúc user với validation rules
- **Post Entity**: Định nghĩa cấu trúc post với business logic

```typescript
// Ví dụ: User Entity với validation tích hợp
export class User extends BaseEntity {
  private constructor(data: UserData) {
    super();
    // Business logic và validation
  }

  static create(input: CreateUserInput): User {
    // Factory method với business rules
  }
}
```

**Đặc điểm quan trọng**:

- ✅ Không phụ thuộc vào layer nào khác
- ✅ Chứa business rules thuần túy
- ✅ Có validation tích hợp với Zod

### 🎯 2. Application Layer (`src/application/`)

**Trách nhiệm**: Chứa application business logic và orchestrate data flow

#### Use Cases (`src/application/use-cases/`)

Mỗi use case thực hiện một chức năng nghiệp vụ cụ thể:

```typescript
// Ví dụ: LoginUseCase - Single Responsibility
export class LoginUseCase implements IUseCase<LoginUseCaseInput> {
  constructor(
    private userRepository: IUserRepository, // DIP: depend on abstraction
    private passwordHasher: IPasswordHasher, // DIP: depend on abstraction
    private jsonWebToken: IJsonWebToken, // DIP: depend on abstraction
  ) {}

  async execute(
    input: LoginUseCaseInput,
  ): Promise<UseCaseResponse<LoginUseCaseData>> {
    // 1. Validate input
    // 2. Find user
    // 3. Verify password
    // 4. Generate tokens
    // 5. Return response
  }
}
```

#### Dependency Interfaces (`src/application/dependency-interfaces/`)

Định nghĩa contracts cho external services:

```typescript
// Repository abstraction
export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  add(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<void>;
}

// Utility abstractions
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
```

**Đặc điểm quan trọng**:

- ✅ Chỉ phụ thuộc vào Entities layer
- ✅ Định nghĩa interfaces cho dependencies
- ✅ Chứa application-specific business logic

### 🔌 3. Adapters Layer (`src/adapters/`)

**Trách nhiệm**: Implement các interfaces và kết nối với external systems

#### Express Adapters (`src/adapters/express/`)

```typescript
// Generic controller pattern
export function basicController<UseCaseInput>(useCase: IUseCase<UseCaseInput>) {
  return async (req: Request, res: Response) => {
    const input = extractor(req); // Extract data from HTTP request
    const output = await useCase.execute(input); // Execute use case
    res.status(statusCodeConverter(output.type)).json(output); // Return HTTP response
  };
}

// Route definition
authRoutes.post('/login', basicController(loginUseCase));
```

#### Repository Implementations (`src/adapters/repositories/`)

Implement repository interfaces với nhiều storage options:

```typescript
// In-memory implementation
export class InMemoryRepository<T extends { id: string }>
  implements IBaseRepository<T>
{
  constructor(protected items: T[] = []) {}
  // Implementation methods...
}

// MongoDB implementation
export class UserMongoRepository implements IUserRepository {
  // MongoDB-specific implementation
}
```

**Đặc điểm quan trọng**:

- ✅ Implement interfaces từ Application layer
- ✅ Handle external systems (database, web framework, etc.)
- ✅ Convert between external formats và domain models

### 🔧 4. Shared Layer (`src/shared/`)

**Trách nhiệm**: Utility functions có thể được sử dụng bởi bất kỳ layer nào

### 📋 5. Configuration & DI Container (`src/config/`, `src/container.ts`)

**Dependency Injection Container**: Wiring tất cả dependencies:

```typescript
// Smart repository selection based on environment
const userRepository =
  env.DB_SELECT === 'MONGODB'
    ? new UserMongoRepository()
    : new UserInMemoryRepository();

// Dependency injection
const loginUseCase = new LoginUseCase(
  userRepository, // Repository dependency
  passwordHasher, // Utility dependency
  jsonWebToken, // Utility dependency
);
```

## 🎯 Data Flow trong Clean Architecture

```
HTTP Request → Express Router → Controller → Use Case → Repository → Database
     ↓             ↓              ↓           ↓          ↓         ↓
HTTP Response ← Express Router ← Controller ← Use Case ← Repository ← Database
```

### Ví dụ Flow đăng nhập:

1. **Request**: `POST /auth/login` với email/password
2. **Router**: `authRoutes` route request đến `basicController(loginUseCase)`
3. **Controller**: `basicController` extract data và gọi `loginUseCase.execute()`
4. **Use Case**: `LoginUseCase` validate input, gọi repository và utilities
5. **Repository**: `UserRepository` query database tìm user
6. **Entity**: `User` entity được hydrate với data từ database
7. **Response**: Use case return token, controller convert thành HTTP response

## 🔩 Tuân thủ SOLID Principles

### 1. **Single Responsibility Principle (SRP)**

Mỗi class chỉ có một lý do để thay đổi:

```typescript
// ✅ LoginUseCase chỉ handle login logic
export class LoginUseCase {
  async execute(input: LoginUseCaseInput) {
    // Chỉ handle login business logic
  }
}

// ✅ PasswordHasher chỉ handle password operations
export class PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    /* */
  }
  async verify(password: string, hash: string): Promise<boolean> {
    /* */
  }
}
```

### 2. **Open/Closed Principle (OCP)**

Mở rộng functionality mà không sửa existing code:

```typescript
// Có thể thêm repository mới mà không sửa existing code
export class RedisUserRepository implements IUserRepository {
  // New Redis implementation
}

// Container tự động chọn implementation
const userRepository =
  env.DB_SELECT === 'REDIS'
    ? new RedisUserRepository()
    : env.DB_SELECT === 'MONGODB'
      ? new UserMongoRepository()
      : new UserInMemoryRepository();
```

### 3. **Liskov Substitution Principle (LSP)**

Subclasses có thể thay thế base classes:

```typescript
// Tất cả implementations đều tuân thủ IBaseRepository contract
const repositories: IBaseRepository<User>[] = [
  new InMemoryRepository<User>(),
  new UserMongoRepository(),
  // Có thể thêm implementation khác mà không break existing code
];

// Có thể swap repository implementations
function processUsers(repo: IBaseRepository<User>) {
  // Code hoạt động với bất kỳ implementation nào
}
```

### 4. **Interface Segregation Principle (ISP)**

Clients chỉ depend vào interfaces họ sử dụng:

```typescript
// Interfaces được tách nhỏ theo chức năng
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

export interface IJsonWebToken {
  sign(payload: object, expiresIn: ExpiresIn): Promise<string>;
  verify(token: string): Promise<JwtPayload | null>;
}

// Use cases chỉ inject những interface cần thiết
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository, // Chỉ cần user operations
    private passwordHasher: IPasswordHasher, // Chỉ cần password operations
    private jsonWebToken: IJsonWebToken, // Chỉ cần JWT operations
  ) {}
}
```

### 5. **Dependency Inversion Principle (DIP)**

High-level modules không depend vào low-level modules, cả hai depend vào abstractions:

```typescript
// ❌ Violation: Use case depend vào concrete implementation
export class LoginUseCase {
  constructor(private mongoUserRepository: UserMongoRepository) {} // Tightly coupled
}

// ✅ Correct: Use case depend vào abstraction
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository, // Depend on abstraction
    private passwordHasher: IPasswordHasher, // Depend on abstraction
    private jsonWebToken: IJsonWebToken, // Depend on abstraction
  ) {}
}

// Concrete implementations được inject từ bên ngoài (container.ts)
const loginUseCase = new LoginUseCase(
  userRepository, // Concrete implementation
  passwordHasher, // Concrete implementation
  jsonWebToken, // Concrete implementation
);
```

## 📊 Lợi ích của Architecture này

### 🔄 **Flexibility**

- Swap database từ In-memory sang MongoDB mà không sửa business logic
- Thay đổi web framework từ Express sang Fastify chỉ cần update Adapters layer

### 🧪 **Testability**

- Mock dependencies dễ dàng với interfaces
- Test use cases độc lập với external systems
- Unit test entities mà không cần database

### 📈 **Scalability**

- Thêm features mới bằng cách thêm use cases
- Extend functionality với implementations mới
- Tách services thành microservices dễ dàng

### 🛡️ **Maintainability**

- Business logic tập trung ở Use Cases layer
- Dependencies được quản lý tập trung
- Separation of concerns rõ ràng

## 🔍 Ví dụ thực tế

### Thêm một authentication provider mới:

```typescript
// 1. Định nghĩa interface (Application layer)
export interface IGoogleAuthProvider {
  verifyToken(token: string): Promise<GoogleUserInfo>;
}

// 2. Implement interface (Adapters layer)
export class GoogleAuthProvider implements IGoogleAuthProvider {
  async verifyToken(token: string): Promise<GoogleUserInfo> {
    // Google API integration
  }
}

// 3. Tạo use case mới (Application layer)
export class GoogleLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private googleAuth: IGoogleAuthProvider,
    private jsonWebToken: IJsonWebToken,
  ) {}
}

// 4. Wire dependencies (Container)
const googleLoginUseCase = new GoogleLoginUseCase(
  userRepository,
  new GoogleAuthProvider(),
  jsonWebToken,
);

// 5. Thêm route (Adapters layer)
authRoutes.post('/google', basicController(googleLoginUseCase));
```

➡️ **Kết quả**: Thêm Google authentication mà không sửa đổi existing code!

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- MongoDB (nếu sử dụng MongoDB storage) hoặc có thể chạy với In-memory storage

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/nodejs-clean-architecture.git
    cd nodejs-clean-architecture
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Setup environment variables:

    ```bash
    cp .env.example .env
    ```

    Cấu hình các biến môi trường trong `.env`:

    ```env
    PORT=3000
    DB_SELECT=MEMORY    # hoặc MONGODB
    JWT_SECRET=your-secret-key
    JWT_ACCESS_EXPIRES_IN=15m
    JWT_REFRESH_EXPIRES_IN=7d
    MONGODB_URI=mongodb://localhost:27017/clean-architecture  # nếu dùng MongoDB
    ```

### Running the Project

**Development mode với hot-reloading:**

```bash
pnpm dev
```

**Production mode:**

```bash
pnpm build
pnpm start
```

Server sẽ chạy tại `http://localhost:3000`

**Test UI**: Truy cập `http://localhost:3000/test.html` để test các API endpoints

## 📜 Available Scripts

| Script              | Mô tả                                   |
| ------------------- | --------------------------------------- |
| `pnpm start`        | Chạy server production mode             |
| `pnpm build`        | Compile TypeScript sang JavaScript      |
| `pnpm dev`          | Chạy development mode với hot-reloading |
| `pnpm lint`         | Kiểm tra code style với ESLint          |
| `pnpm lint:fix`     | Fix các lỗi ESLint tự động              |
| `pnpm format`       | Format code với Prettier                |
| `pnpm format:check` | Kiểm tra code formatting                |
| `pnpm seed`         | Seed database với dữ liệu mẫu           |

## 🛠️ Technologies Used

### Core Technologies

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset của JavaScript
- **[Express](https://expressjs.com/)** - Web framework

### Storage & Data

- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **In-Memory Storage** - Development storage option

### Validation & Security

- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript executor

## 📁 Project Structure

```
src/
├── entities/                 # 📦 Business entities
│   ├── base.entity.ts       # Abstract base entity
│   ├── user.entity.ts       # User business logic
│   └── post.entity.ts       # Post business logic
│
├── application/              # 🎯 Application layer
│   ├── use-cases/           # Business use cases
│   │   ├── auth/           # Authentication use cases
│   │   ├── user/           # User management
│   │   └── base/           # Generic CRUD operations
│   └── dependency-interfaces/  # Abstractions
│       ├── repositories/   # Repository interfaces
│       └── utils/          # Utility interfaces
│
├── adapters/                 # 🔌 External adapters
│   ├── express/            # Web framework adapter
│   │   ├── routes/        # HTTP routes
│   │   ├── middlewares/   # Express middlewares
│   │   └── controller.ts  # Generic controller
│   ├── repositories/      # Data access implementations
│   │   ├── in-memory/    # In-memory storage
│   │   └── mongodb/      # MongoDB implementation
│   └── utils/            # External utilities
│
├── shared/                  # 🔧 Shared utilities
├── config/                  # ⚙️ Configuration
└── container.ts            # 📋 Dependency injection
```

## 🧪 API Endpoints

### Authentication

- `POST /auth/register` - Đăng ký user mới
- `POST /auth/login` - Đăng nhập

### Users (Admin only)

- `GET /users` - Lấy danh sách users
- `GET /users/:id` - Lấy user theo ID
- `POST /users` - Tạo user mới
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Posts (User authenticated)

- `GET /posts` - Lấy danh sách posts
- `GET /posts/:id` - Lấy post theo ID
- `POST /posts` - Tạo post mới
- `PUT /posts/:id` - Cập nhật post
- `DELETE /posts/:id` - Xóa post

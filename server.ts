import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import jwt from "jsonwebtoken";
import type { Document, Person } from "./src/types/types";
import type { AuthRequest, User } from "./src/types/authTypes";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const app = express();
const PORT = 3001;
const JWT_SECRET = "secret";

app.use(cors());
app.use(bodyParser.json());

interface Templates {
  [key: string]: string;
}

interface Database {
  documents: Document[];
  personal: Person[];
  templates: Templates;
  users: User[];
}

// Middleware для проверки токена
const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ message: "Токен отсутствует" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ message: "Недействительный токен" });
  }
};

// Загрузка данных из файла
let db: Database = {
  documents: [],
  personal: [],
  templates: {},
  users: [
    {
      id: "1",
      name: "admin",
      email: "admin@admin.com",
      password: "admin123", // В реальном приложении храните хеши паролей
    },
  ],
};

try {
  const data = fs.readFileSync("db.json", "utf8");
  const parsedData = JSON.parse(data);
  db = { ...db, ...parsedData };
} catch {
  console.log("Создаем новую БД или используем дефолтные данные");
  // // Дефолтные данные для тестирования
  // db = {
  //   documents: [
  //     {
  //       id: "1",
  //       title: "Тестовый документ",
  //       content: "Содержание тестового документа",
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       versions: [],
  //     },
  //   ],
  //   personal: [
  //     {
  //       id: "1",
  //       name: "Иванов Иван Иванович",
  //       position: "Инженер",
  //       workshop: "Цех №1",
  //     },
  //     {
  //       id: "2",
  //       name: "Петров Петр Петрович",
  //       position: "Мастер",
  //       workshop: "Цех №2",
  //     },
  //   ],
  //   templates: {
  //     intLetter: "Шаблон внутреннего письма",
  //     extLetter: "Шаблон внешнего письма",
  //     order: "Шаблон приказа",
  //     instruction: "Шаблон распоряжения",
  //   },
  // };
}

// Сохранение данных в файл
const saveDB = () => {
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
};

// Роут для аутентификации
app.post("/api/auth/login", (req, res) => {
  try {
    const { name, email }: AuthRequest = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Имя и email обязательны",
      });
    }

    // Проверяем пользователя
    const user = db.users.find((u) => u.name === name && u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Неверные учетные данные",
      });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Роут для проверки токена
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  const userId = req.userId;
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Пользователь не найден",
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Роуты для документов
app.get("/api/documents", authenticateToken, (_, res) => {
  res.json(db.documents);
});

app.get("/api/documents/:id", authenticateToken, (req, res) => {
  const document = db.documents.find((d) => d.id === req.params.id);
  if (!document) return res.status(404).json({ message: "Документ не найден" });
  res.json(document);
});

app.post("/api/documents", authenticateToken, (req, res) => {
  const newDocument: Document = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  db.documents.push(newDocument);
  saveDB();
  res.json(newDocument);
});

app.put("/api/documents/:id", authenticateToken, (req, res) => {
  const index = db.documents.findIndex((d) => d.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Документ не найден" });

  db.documents[index] = {
    ...db.documents[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDB();
  res.json(db.documents[index]);
});

app.delete("/api/documents/:id", authenticateToken, (req, res) => {
  const index = db.documents.findIndex((d) => d.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Документ не найден" });

  db.documents.splice(index, 1);
  saveDB();
  res.json({ success: true });
});

// Роуты для personal
app.get("/api/personal", authenticateToken, (_, res) => {
  res.json(db.personal);
});

app.post("/api/personal", authenticateToken, (req, res) => {
  const newPerson: Person = {
    id: Date.now().toString(),
    ...req.body,
  };
  db.personal.push(newPerson);
  saveDB();
  res.json(newPerson);
});

// Роуты для templates
app.get("/api/templates", authenticateToken, (_, res) => {
  res.json(db.templates);
});

app.post("/api/templates", authenticateToken, (req, res) => {
  const { type, content } = req.body;
  if (type && content) {
    db.templates[type] = content;
    saveDB();
  }
  res.json(db.templates);
});

// Экспорт документа
app.get("/api/documents/:id/export", authenticateToken, (req, res) => {
  const document = db.documents.find((d) => d.id === req.params.id);
  if (!document) return res.status(404).json({ message: "Документ не найден" });

  const format = req.query.format || "txt";
  let content: string, mimeType: string;

  switch (format) {
    case "pdf":
      content = `PDF экспорт: ${document.title}\n${document.content}`;
      mimeType = "application/pdf";
      break;
    case "docx":
      content = `DOCX экспорт: ${document.title}\n${document.content}`;
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    default:
      content = document.content;
      mimeType = "text/plain";
  }

  res.setHeader("Content-Type", mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${document.title}.${format}"`,
  );
  res.send(content);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log("📋 Доступные эндпоинты:");
  console.log("  POST   /api/auth/login");
  console.log("  GET    /api/auth/verify");
  console.log("  GET    /api/documents");
  console.log("  GET    /api/documents/:id");
  console.log("  POST   /api/documents");
  console.log("  PUT    /api/documents/:id");
  console.log("  DELETE /api/documents/:id");
  console.log("  GET    /api/personal");
  console.log("  POST   /api/personal");
  console.log("  GET    /api/templates");
  console.log("  POST   /api/templates");
  console.log("  GET    /api/documents/:id/export?format=txt|pdf|docx");
});

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // 部署时必须
const DATA_FILE = path.join(__dirname, "data.json");

// 管理员密码（你改成自己的）
const ADMIN_PASSWORD = "18016";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// 读取数据
app.get("/api/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

// 访客 +1
app.post("/api/visit", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  data.visits++;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(data);
});

// 发留言
app.post("/api/message", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "留言不能为空" });

  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  data.messages.unshift({
    id: Date.now(),
    text,
    time: new Date().toLocaleString()
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// 删留言（需要密码）
app.post("/api/delete", (req, res) => {
  const { id, password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "密码错误" });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  data.messages = data.messages.filter(m => m.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
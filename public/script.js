// ===== 作品数据 =====
const works = [
  {
    id: 1, title: "个人主页 v1", desc: "我的第一个纯前端个人主页，用 HTML+CSS 实现。",
    icon: "🌐", tags: ["web"], link: "#", cat: "web",
    tagLabels: ["HTML", "CSS"]
  },
  {
    id: 2, title: "点击计数器", desc: "前后端打通的第一个项目，数据持久化到 JSON 文件。",
    icon: "🔢", tags: ["web", "tool"], link: "#", cat: "tool",
    tagLabels: ["Node.js", "Express"]
  },
  {
    id: 3, title: "作品集网站", desc: "你正在看的这个网站，支持移动端适配和项目管理。",
    icon: "🎨", tags: ["web"], link: "#", cat: "web",
    tagLabels: ["全栈", "响应式"]
  },
  {
    id: 4, title: "贪吃蛇小游戏", desc: "用 JavaScript 实现的经典贪吃蛇，支持键盘控制。",
    icon: "🐍", tags: ["game"], link: "#", cat: "game",
    tagLabels: ["JS", "Canvas"]
  },
  {
    id: 5, title: "待办清单", desc: "支持增删改查和本地存储的待办应用。",
    icon: "✅", tags: ["tool", "web"], link: "#", cat: "tool",
    tagLabels: ["JS", "LocalStorage"]
  },
  {
    id: 6, title: "2048", desc: "经典数字合并游戏，纯前端实现。",
    icon: "🎮", tags: ["game"], link: "#", cat: "game",
    tagLabels: ["JS", "CSS Grid"]
  }
];

// ===== 渲染作品 =====
function renderWorks(filter = "all") {
  const grid = document.getElementById("worksGrid");
  const filtered = filter === "all" ? works : works.filter(w => w.cat === filter);

  grid.innerHTML = filtered.map(w => `
    <div class="work-card" onclick="openModal(${w.id})">
      <div class="work-img" style="background:${getGradient(w.cat)}">${w.icon}</div>
      <div class="work-info">
        <h3>${w.title}</h3>
        <p>${w.desc}</p>
        <div class="work-tags">
          ${w.tagLabels.map(t => `<span class="work-tag">${t}</span>`).join("")}
        </div>
      </div>
    </div>
  `).join("");
}

function getGradient(cat) {
  const map = {
    web: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    tool: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
    game: "linear-gradient(135deg,#fefce8,#fef3c7)"
  };
  return map[cat] || "#f8fafc";
}

// ===== 筛选 =====
function filterWorks(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderWorks(cat);
}

// ===== 弹窗 =====
function openModal(id) {
  const w = works.find(x => x.id === id);
  if (!w) return;
  document.getElementById("modalTitle").textContent = w.title;
  document.getElementById("modalDesc").textContent = w.desc;
  document.getElementById("modalLink").href = w.link;
  document.getElementById("modal").classList.add("active");
}
function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// ===== 移动端菜单 =====
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
}

// ===== 留言板（保留之前功能） =====
let isAdmin = false;

async function loadData() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();
    document.getElementById("visitCount").innerText = `你是第 ${data.visits} 位访客`;

    const list = document.getElementById("messageList");
    list.innerHTML = data.messages.map(msg => `
      <li>
        <span>${msg.text}</span>
        <div>
          <small>${msg.time}</small>
          ${isAdmin ? `<button class="del-btn" onclick="deleteMsg(${msg.id})">删除</button>` : ""}
        </div>
      </li>
    `).join("");
  } catch (e) {
    document.getElementById("visitCount").innerText = "后端连接失败";
  }
}

async function postMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text) return;
  await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  input.value = "";
  loadData();
}

function adminLogin() {
  const pwd = prompt("请输入管理员密码：");
  if (pwd === "123456") {
    isAdmin = true;
    alert("管理员模式已开启 ✅");
    loadData();
  } else if (pwd !== null) {
    alert("密码错误 ❌");
  }
}

async function deleteMsg(id) {
  const pwd = prompt("确认密码：");
  await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password: pwd })
  });
  loadData();
}

// ===== 导航高亮（滚动监听） =====
window.addEventListener("scroll", () => {
  const sections = ["home", "about", "skills", "works", "timeline", "contact"];
  const scrollPos = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
      document.querySelectorAll("nav a").forEach(a => a.style.color = "");
      const activeLink = document.querySelector(`nav a[href="#${id}"]`);
      if (activeLink) activeLink.style.color = "var(--primary)";
    }
  });
});

// ===== 初始化 =====
window.onload = async () => {
  renderWorks();
  await fetch("/api/visit", { method: "POST" });
  loadData();
};
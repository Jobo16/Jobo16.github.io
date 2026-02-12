const todos = ["整理素材", "补充文案", "上线到 Pages"];
const list = document.getElementById("list");
todos.forEach((t) => {
  const li = document.createElement("li");
  li.textContent = t;
  list.appendChild(li);
});

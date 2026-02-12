const stats = [
  ["今日访问", 1284],
  ["新增用户", 93],
  ["转化率", "6.2%"],
  ["工单处理", 41],
  ["活跃项目", 12],
  ["发布次数", 7]
];

const grid = document.getElementById("grid");
stats.forEach(([label, value]) => {
  const card = document.createElement("section");
  card.className = "card";
  card.innerHTML = `<div class="label">${label}</div><div class="value">${value}</div>`;
  grid.appendChild(card);
});

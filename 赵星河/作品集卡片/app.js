const data = [
  { name: "品牌站改版", tech: "HTML/CSS" },
  { name: "企业官网落地页", tech: "HTML/JS" },
  { name: "内部组件库预览", tech: "Vanilla JS" }
];

const cards = document.getElementById("cards");
data.forEach((item) => {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `<h3>${item.name}</h3><p>${item.tech}</p>`;
  cards.appendChild(el);
});

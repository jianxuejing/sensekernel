const SITE = {
  brand: "SenseKernel",
  logo: "https://sensekernel.com/image/logo.png",
  company: "湖南苏科智能科技有限公司",
  blurb:
    "以万物互联为基础，以智能终端为载体，以数据与知识为驱动，构建面向公共安全的 AI 整体解决方案。",
  phone: "0731-85711507",
  mobile: "189-3240-5664",
  email: "contacts@sensekernel.com",
  address: "湖南湘江新区青山路699号 军民融合产业园3栋7楼",
  subscriptionUrl: "https://www.sensekernel.com/web/",
};

const NAV_ITEMS = [
  { key: "home", label: "首页", href: "index.html" },
  { key: "detection", label: "智慧检测", href: "detection.html" },
  { key: "monitoring", label: "智慧监测", href: "monitoring.html" },
  { key: "news", label: "新闻资讯", href: "news.html" },
  { key: "about", label: "关于苏科", href: "about.html" },
  { key: "honors", label: "资质荣誉", href: "honors.html" },
  { key: "contact", label: "联系我们", href: "contact.html" },
];

const FOOTER_GROUPS = [
  {
    title: "核心栏目",
    links: [
      { label: "智慧检测", href: "detection.html" },
      { label: "智慧监测", href: "monitoring.html" },
      { label: "新闻资讯", href: "news.html" },
    ],
  },
  {
    title: "企业信息",
    links: [
      { label: "关于我们", href: "about.html" },
      { label: "资质荣誉", href: "honors.html" },
      { label: "联系信息", href: "contact.html" },
    ],
  },
  {
    title: "外部入口",
    links: [{ label: "订阅平台", href: SITE.subscriptionUrl, external: true }],
  },
];

const MONITORING_SECTORS = [
  {
    name: "交通工程",
    items: [
      "交通运输部揭榜挂帅示范应用项目：G59、G55、G5513、G5517、S71、S20 及重庆部分路段",
      "港珠澳大桥大型跨海桥梁结构健康监测",
      "上海地铁轨道交通结构变形监测",
      "湖南高速 G55、G76、G0421、G0422、G5616、S19、S50、S70",
      "山东高速 G22 青兰高速、济南绕城高速",
      "广东高速 G1532 梅州至大埔高速",
      "陕西高速 G4015 丹宁高速",
      "贵州高速 G7512 贵金高速",
    ],
  },
  {
    name: "水利工程",
    items: [
      "洞庭湖流域河湖堤防重点工程监测",
      "长江防洪大堤流域安全监测",
      "香港西贡万宜水库重点设施监测",
      "湘潭涟水流域河湖堤防监测项目",
    ],
  },
  {
    name: "自然资源",
    items: [
      "湖南省地质灾害监测预警项目",
      "湘江新区切坡建房隐患监测",
      "宁乡市斜坡单元地质灾害排查",
      "新晃重点山体滑坡隐患点专项监测",
    ],
  },
];

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function normalizeRichContent(html) {
  return html
    .replaceAll('src="image/', 'src="https://sensekernel.com/image/')
    .replaceAll("src='image/", "src='https://sensekernel.com/image/")
    .replaceAll('href="image/', 'href="https://sensekernel.com/image/')
    .replaceAll("href='image/", "href='https://sensekernel.com/image/");
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function absoluteSenseKernelAsset(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  return `https://sensekernel.com/${String(path).replace(/^\/+/, "")}`;
}

function normalizeCollection(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const keys = Object.keys(data);
  if (!keys.length) return [];

  const lengths = keys
    .map((key) => (Array.isArray(data[key]) ? data[key].length : 0))
    .filter(Boolean);
  const total = lengths.length ? Math.max(...lengths) : 0;

  return Array.from({ length: total }, (_, index) => {
    const item = {};
    keys.forEach((key) => {
      const value = data[key];
      item[key] = Array.isArray(value) ? value[index] : value;
    });
    return item;
  });
}

function normalizeCasesData(data) {
  return normalizeCollection(data).map((item) => ({
    ...item,
    image: absoluteSenseKernelAsset(item.image),
  }));
}

function normalizeNewsIndexData(data) {
  return normalizeCollection(data).map((item) => ({
    ...item,
    image: absoluteSenseKernelAsset(item.image),
  }));
}

function renderShell() {
  const page = document.body.dataset.page || "";
  const header = qs("#site-header");
  const footer = qs("#site-footer");

  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="shell shell-wide nav-shell">
          <a class="brand" href="index.html" aria-label="${SITE.brand}">
            <img class="brand-logo" src="${SITE.logo}" alt="${SITE.brand} logo">
          </a>
          <button class="nav-toggle" aria-expanded="false" aria-label="切换菜单">
            <span></span>
            <span></span>
          </button>
          <nav class="site-nav">
            ${NAV_ITEMS.map(
              (item) => `
                <a class="nav-link ${item.key === page ? "is-active" : ""}" href="${item.href}">
                  ${item.label}
                </a>
              `,
            ).join("")}
            <a class="nav-cta" href="${SITE.subscriptionUrl}" target="_blank" rel="noreferrer">
              订阅平台
            </a>
          </nav>
        </div>
      </header>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="shell shell-wide footer-shell">
          <div class="footer-intro">
            <p class="eyebrow">SenseKernel Mission Control</p>
            <h2>${SITE.company}</h2>
            <p>${SITE.blurb}</p>
            <ul class="footer-contact">
              <li><span>电话</span><a href="tel:${SITE.phone}">${SITE.phone}</a></li>
              <li><span>邮箱</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
              <li><span>地址</span><span>${SITE.address}</span></li>
            </ul>
          </div>
          <div class="footer-links">
            ${FOOTER_GROUPS.map(
              (group) => `
                <section>
                  <h3>${group.title}</h3>
                  ${group.links
                    .map(
                      (link) => `
                        <a href="${link.href}" ${link.external ? 'target="_blank" rel="noreferrer"' : ""}>
                          ${link.label}
                        </a>
                      `,
                    )
                    .join("")}
                </section>
              `,
            ).join("")}
          </div>
        </div>
        <div class="shell shell-wide footer-meta">
          <span>版权所有 © 2022 ${SITE.company}</span>
          <span>湘ICP备16019313号 · 湘公网安备43019002002514号</span>
        </div>
      </footer>
    `;
  }

  const toggle = qs(".nav-toggle");
  const nav = qs(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
  }
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  qsa("[data-reveal]").forEach((node) => observer.observe(node));
}

function caseCard(caseItem) {
  return `
    <article class="story-card">
      <div class="story-media">
        <img src="${caseItem.image}" alt="${caseItem.title}" loading="lazy">
      </div>
      <div class="story-copy">
        <p class="story-meta">${caseItem.tag} · ${caseItem.category === "detection" ? "智慧检测" : "智慧监测"}</p>
        <h3>${caseItem.title}</h3>
        <p>${caseItem.description}</p>
      </div>
    </article>
  `;
}

function newsCard(newsItem) {
  return `
    <article class="news-card">
      <a href="news-detail.html?id=${newsItem.id}" class="news-card-link">
        <div class="news-card-media">
          <img src="${newsItem.image}" alt="${newsItem.title}" loading="lazy">
        </div>
        <div class="news-card-copy">
          <p class="story-meta">${formatDate(newsItem.date)}</p>
          <h3>${newsItem.title}</h3>
          <p>${newsItem.excerpt}</p>
        </div>
      </a>
    </article>
  `;
}

async function initHome() {
  const casesSlot = qs("#featured-cases");
  const newsSlot = qs("#latest-news");
  if (!casesSlot || !newsSlot) return;

  const [cases, news] = await Promise.all([
    fetchJson("data/cases.json"),
    fetchJson("data/news-index.json"),
  ]);

  const curatedCases = normalizeCasesData(cases)
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  const latestNews = normalizeNewsIndexData(news);
  casesSlot.innerHTML = curatedCases.map(caseCard).join("");
  newsSlot.innerHTML = latestNews.slice(0, 3).map(newsCard).join("");
}

async function initDetection() {
  const slot = qs("#detection-cases");
  if (!slot) return;

  const cases = normalizeCasesData(await fetchJson("data/cases.json"));
  slot.innerHTML = cases
    .filter((item) => item.category === "detection" && item.visible)
    .sort((a, b) => a.order - b.order)
    .map(caseCard)
    .join("");
}

async function initMonitoring() {
  const slot = qs("#monitoring-cases");
  const sectorsSlot = qs("#monitoring-sectors");
  if (!slot || !sectorsSlot) return;

  const cases = normalizeCasesData(await fetchJson("data/cases.json"));
  slot.innerHTML = cases
    .filter((item) => item.category === "monitoring" && item.visible)
    .sort((a, b) => a.order - b.order)
    .map(caseCard)
    .join("");

  sectorsSlot.innerHTML = MONITORING_SECTORS.map(
    (sector) => `
      <article class="sector-card">
        <p class="eyebrow">${sector.name}</p>
        <ul class="bullet-list">
          ${sector.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `,
  ).join("");
}

async function initNewsList() {
  const slot = qs("#news-list");
  const pager = qs("#news-pager");
  if (!slot || !pager) return;

  const news = normalizeNewsIndexData(await fetchJson("data/news-index.json"));
  const pageSize = 9;
  let currentPage = 1;
  const totalPages = Math.max(1, Math.ceil(news.length / pageSize));

  function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * pageSize;
    const items = news.slice(start, start + pageSize);
    slot.innerHTML = items.map(newsCard).join("");
    pager.innerHTML = `
      <button class="pager-btn" ${page === 1 ? "disabled" : ""} data-page="${page - 1}">
        上一页
      </button>
      <span>第 ${page} / ${totalPages} 页</span>
      <button class="pager-btn" ${page === totalPages ? "disabled" : ""} data-page="${page + 1}">
        下一页
      </button>
    `;
    qsa(".pager-btn", pager).forEach((button) => {
      button.addEventListener("click", () => renderPage(Number(button.dataset.page)));
    });
  }

  renderPage(currentPage);
}

async function initNewsDetail() {
  const slot = qs("#news-detail");
  if (!slot) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    slot.innerHTML = `<p class="empty-state">未找到新闻编号。</p>`;
    return;
  }

  try {
    const article = await fetchJson(`data/news/${id}.json`);
    document.title = `${article.title} | ${SITE.brand}`;
    slot.innerHTML = `
      <article class="article-shell">
        <div class="article-cover">
          <img src="${article.image}" alt="${article.title}" loading="lazy">
        </div>
        <div class="article-head">
          <p class="story-meta">${formatDate(article.date)}</p>
          <h1>${article.title}</h1>
          <p class="article-excerpt">${article.excerpt}</p>
        </div>
        <div class="rich-copy">
          ${normalizeRichContent(article.content)}
        </div>
        <div class="article-tail">
          <a class="button button-secondary" href="news.html">返回新闻列表</a>
        </div>
      </article>
    `;
  } catch (error) {
    slot.innerHTML = `<p class="empty-state">新闻内容加载失败。</p>`;
  }
}

function initPage() {
  const page = document.body.dataset.page || "";
  const jobs = {
    home: initHome,
    detection: initDetection,
    monitoring: initMonitoring,
    news: initNewsList,
    "news-detail": initNewsDetail,
  };

  if (jobs[page]) {
    jobs[page]().catch((error) => {
      console.error(error);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  initReveal();
  initPage();
});

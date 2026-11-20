const DEFAULT_PORT = 24599;
const PAIRING_TIMEOUT_MS = 60000;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reze Sub</title>
  <link rel="icon" type="image/jpeg" href="https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1795179151331.jpg">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Shantell+Sans:ital,wght@0,300..800;1,300..800&family=Tajawal:wght@400;500;700&display=swap');

    :root {
      --box-y: 45px;
    }

    * {
      font-family: "Shantell Sans", "Tajawal", sans-serif;
      color: #F4F0FA;
      box-sizing: border-box;
    }

    body {
      background-color: #0B0812;
      background-image: url(https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1795178954707.jpg);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      display: flex;
      align-items: center;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
      margin: 0;
    }

    header {
      width: 90%;
      height: 58px;
      margin-top: 12px;
      background: rgba(11, 8, 18, 0.55);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: solid 1px #4A346E;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
    }

    header h1 {
      font-size: 22px;
      margin: 0;
    }

    header img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: solid 2px #4A346E;
    }

    .box-sub {
      margin: auto 0;
      transform: translateY(var(--box-y));
      width: 85%;
      max-width: 350px;
      padding: 22px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 13px;
      background: rgba(11, 8, 18, 0.62);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: solid 1px #4A346E;
      border-radius: 15px;
    }

    .box-sub h1 {
      font-family: "Tajawal", sans-serif;
      font-weight: 700;
      font-size: 24px;
      margin: 0;
    }

    .box-sub input {
      width: 100%;
      height: 45px;
      background: rgba(11, 8, 18, 0.65);
      border: solid 1px #4A346E;
      border-radius: 8px;
      outline: none;
      padding: 0 12px;
      font-size: 16px;
      text-align: center;
    }

    .box-sub input:focus {
      border-color: #38E577;
    }

    .box-sub button {
      width: 100%;
      height: 45px;
      background: #4A346E;
      border: solid 1px #7B5AB0;
      border-radius: 8px;
      font-family: "Tajawal", sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #F4F0FA;
      cursor: pointer;
    }

    .box-sub button:active {
      background: #3B285A;
    }

    .box-sub button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .code-box {
      display: none;
      width: 100%;
      padding: 12px;
      background: rgba(11, 8, 18, 0.8);
      border: solid 1px #38E577;
      border-radius: 8px;
      color: #38E577;
      font-family: "Shantell Sans", sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 3px;
      text-align: center;
      cursor: pointer;
    }

    .status-msg {
      display: none;
      margin: 0;
      font-family: "Tajawal", sans-serif;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
    }

    .status-msg.error {
      color: #FF4D6D;
    }

    .status-msg.ok {
      color: #38E577;
    }

    .status-msg.warn {
      color: #F5B759;
    }

    .box-sub p {
      margin: 0;
      font-family: "Tajawal", sans-serif;
      font-weight: 500;
      font-size: 15px;
      color: #B8ACC9;
    }

    footer {
      margin-top: 0;
      padding: 12px 0;
    }

    footer p {
      margin: 0;
      font-size: 13px;
      color: #B8ACC9;
    }
  </style>
</head>

<body>
  <header>
    <h1>Reze Sub</h1>
    <img src="https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1795179151331.jpg" alt="logo" />
  </header>

  <div class="box-sub">
    <h1>رقم التنصيب</h1>
    <input type="tel" id="num" placeholder="2010xxxxxxxx" />
    <button type="button" id="submitBtn">طلب الكود</button>
    <div id="codeBox" class="code-box"></div>
    <p id="statusMsg" class="status-msg"></p>
    <p>عدد البوتات المتنصبة: <span id="botsCount">...</span></p>
  </div>

  <footer>
    <p>by : VII7</p>
  </footer>

  <script>
    const API_BASE = window.location.origin + "/api";

    const numInput = document.getElementById("num");
    const submitBtn = document.getElementById("submitBtn");
    const codeBox = document.getElementById("codeBox");
    const statusMsg = document.getElementById("statusMsg");
    const botsCount = document.getElementById("botsCount");

    let currentWatchId = 0;
    let watchTimeout = null;
    let watchAbortController = null;
    let isRequesting = false;
    let isFetchingCount = false;
    const activeCodes = {};

    function showMsg(text, type) {
      statusMsg.textContent = text;
      statusMsg.className = "status-msg " + type;
      statusMsg.style.display = "block";
    }

    function hideMsg() {
      statusMsg.style.display = "none";
    }

    function showCode(code) {
      codeBox.textContent = code;
      codeBox.style.display = "block";
    }

    function hideCode() {
      codeBox.style.display = "none";
      codeBox.textContent = "";
    }

    function saveCode(number, code) {
      activeCodes[number] = code;
      try {
        sessionStorage.setItem("reze_code_" + number, code);
      } catch (e) {
      }
    }

    function getSavedCode(number) {
      if (activeCodes[number]) return activeCodes[number];
      try {
        return sessionStorage.getItem("reze_code_" + number) || "";
      } catch (e) {
        return "";
      }
    }

    function clearSavedCode(number) {
      delete activeCodes[number];
      try {
        sessionStorage.removeItem("reze_code_" + number);
      } catch (e) {
      }
    }

    function stopWatching() {
      currentWatchId++;
      if (watchTimeout) {
        clearTimeout(watchTimeout);
        watchTimeout = null;
      }
      if (watchAbortController) {
        watchAbortController.abort();
        watchAbortController = null;
      }
    }

    async function fetchJson(url, timeoutMs = 20000, signal = null) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const onExternalAbort = () => controller.abort();
      if (signal) {
        if (signal.aborted) {
          clearTimeout(timer);
          throw new DOMException("Aborted", "AbortError");
        }
        signal.addEventListener("abort", onExternalAbort, { once: true });
      }

      try {
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal
        });
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          data = null;
        }
        return { ok: res.ok, status: res.status, data };
      } finally {
        clearTimeout(timer);
        if (signal) {
          signal.removeEventListener("abort", onExternalAbort);
        }
      }
    }

    async function fetchCount() {
      if (isFetchingCount) return;
      isFetchingCount = true;
      try {
        const { ok, data } = await fetchJson(
          API_BASE + "/count?t=" + Date.now() + "&r=" + Math.random(),
          8000
        );
        if (ok && data && typeof data.count !== "undefined") {
          botsCount.textContent = data.count;
        }
      } catch (err) {
        botsCount.textContent = "-";
      } finally {
        isFetchingCount = false;
      }
    }

    async function checkStatus(number, signal = null) {
      const { ok, data } = await fetchJson(
        API_BASE + "/status?number=" + encodeURIComponent(number) + "&t=" + Date.now() + "&r=" + Math.random(),
        8000,
        signal
      );
      if (!ok || !data) {
        throw new Error("status_error");
      }
      return Boolean(data.connected || data.status === "connected");
    }

    async function requestAdded(number, signal = null) {
      return fetchJson(
        API_BASE + "/added?number=" + encodeURIComponent(number) + "&t=" + Date.now() + "&r=" + Math.random(),
        25000,
        signal
      );
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        showMsg("تم نسخ الكود - بانتظار الربط...", "ok");
      } catch (err) {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showMsg("تم نسخ الكود - بانتظار الربط...", "ok");
      }
    }

    function startWatching(number) {
      stopWatching();
      const watchId = currentWatchId;

      async function step() {
        if (watchId !== currentWatchId) return;
        watchAbortController = new AbortController();

        try {
          const connected = await checkStatus(number, watchAbortController.signal);
          if (watchId !== currentWatchId) return;

          if (connected) {
            stopWatching();
            clearSavedCode(number);
            hideCode();
            showMsg("تم الربط بنجاح", "ok");
            fetchCount();
            return;
          }
        } catch (err) {
        }

        if (watchId === currentWatchId) {
          watchTimeout = setTimeout(step, 2500);
        }
      }

      watchTimeout = setTimeout(step, 2500);
    }

    async function handleSubmit() {
      if (isRequesting) return;

      const number = numInput.value.replace(/[^0-9]/g, "");
      if (!number || number.length < 8) {
        hideCode();
        showMsg("اكتب رقم صحيح بكود الدولة", "error");
        return;
      }

      stopWatching();
      hideMsg();
      isRequesting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "جاري فحص الرقم...";

      try {
        const alreadyConnected = await checkStatus(number);
        if (alreadyConnected) {
          clearSavedCode(number);
          hideCode();
          showMsg("الرقم مربوط بالفعل", "error");
          fetchCount();
          return;
        }

        submitBtn.textContent = "جاري طلب الكود...";
        const { ok, data } = await requestAdded(number);

        if (ok && data && data.success && data.code) {
          saveCode(number, data.code);
          showCode(data.code);
          showMsg("اضغط على الكود لنسخه - بانتظار الربط...", "ok");
          startWatching(number);
        } else {
          const existingCode = (data && data.code) || getSavedCode(number);
          if (existingCode) {
            saveCode(number, existingCode);
            showCode(existingCode);
            showMsg("جلسة الرقم لسا مفتوحة، ده الكود الحالي أو انتظر وأعد المحاولة", "warn");
          } else {
            hideCode();
            showMsg("جلسة الرقم لسا مفتوحة، انتظر قليلًا وأعد المحاولة", "warn");
          }
          startWatching(number);
        }
      } catch (err) {
        const existingCode = getSavedCode(number);
        if (existingCode) {
          showCode(existingCode);
          showMsg("جلسة الرقم لسا مفتوحة، ده الكود الحالي أو انتظر وأعد المحاولة", "warn");
          startWatching(number);
        } else {
          hideCode();
          showMsg("فشل الاتصال بالسيرفر، أعد المحاولة", "error");
        }
      } finally {
        isRequesting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "طلب الكود";
      }
    }

    submitBtn.addEventListener("click", handleSubmit);

    numInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    });

    codeBox.addEventListener("click", () => {
      if (codeBox.textContent) {
        copyText(codeBox.textContent);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        fetchCount();
      }
    });

    fetchCount();
    setInterval(fetchCount, 3000);
  </script>
</body>

</html>`;

const pendingSessions = new Map();

function getServerPort() {
  return Number(
    process.env.SERVER_PORT ||
    process.env.PORT ||
    process.env.APP_PORT ||
    DEFAULT_PORT
  );
}

async function resolveBaseUrl(port) {
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL.replace(/\/+$/, "");
  }
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, "");
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return "https://" + process.env.RAILWAY_PUBLIC_DOMAIN;
  }
  if (process.env.KOYEB_PUBLIC_DOMAIN) {
    return "https://" + process.env.KOYEB_PUBLIC_DOMAIN;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return "https://" + process.env.REPLIT_DEV_DOMAIN;
  }
  if (process.env.PROJECT_DOMAIN) {
    return "https://" + process.env.PROJECT_DOMAIN + ".glitch.me";
  }
  if (process.env.FLY_APP_NAME) {
    return "https://" + process.env.FLY_APP_NAME + ".fly.dev";
  }
  if (process.env.SERVER_IP && process.env.SERVER_IP !== "0.0.0.0") {
    return `http://${process.env.SERVER_IP}:${port}`;
  }

  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    if (data && data.ip) {
      return `http://${data.ip}:${port}`;
    }
  } catch (e) {
  }

  return `http://localhost:${port}`;
}

export async function startApi(client, subs) {
  const port = getServerPort();
  let baseUrl = await resolveBaseUrl(port);
  const app = await client.server({ port });

  function syncBaseUrl(c) {
    try {
      if (!c.req || typeof c.req.header !== "function") return;
      const host = c.req.header("x-forwarded-host") || c.req.header("host");
      if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
        const proto = c.req.header("x-forwarded-proto") || "http";
        baseUrl = `${proto}://${host}`;
      }
    } catch (e) {
    }
  }

  if (typeof app.use === "function") {
    app.use("*", async (c, next) => {
      syncBaseUrl(c);
      await next();
    });
  }

  app.get("/", (c) => {
    syncBaseUrl(c);
    return c.html(HTML_PAGE);
  });

  app.get("/api/info", (c) => {
    syncBaseUrl(c);
    c.header("Cache-Control", "no-store");
    return c.json({
      port,
      site: baseUrl,
      api: `${baseUrl}/api`
    });
  });

  app.get("/api/added", async (c) => {
    syncBaseUrl(c);
    c.header("Cache-Control", "no-store");
    const number = c.req.query("number");

    if (!number)
      return c.json({ success: false, error: "ex: ?number=20123456789" }, 400);

    if (subs.get(number)?.connected) {
      if (pendingSessions.has(number)) {
        clearTimeout(pendingSessions.get(number).timer);
        pendingSessions.delete(number);
      }
      return c.json({
        success: false,
        number,
        connected: true,
        status: "connected",
        error: "Already connected"
      }, 409);
    }

    if (pendingSessions.has(number)) {
      return c.json({
        success: false,
        number,
        code: pendingSessions.get(number).code,
        connected: false,
        status: "pending",
        error: "Session already open"
      }, 409);
    }

    const code = await subs.addBot(number);

    if (!code)
      return c.json({ success: false, error: "Failed to create pairing code" }, 500);

    const timer = setTimeout(async () => {
      pendingSessions.delete(number);
      if (!subs.get(number)?.connected) {
        await subs.remove(number);
      }
    }, PAIRING_TIMEOUT_MS);

    pendingSessions.set(number, { code, timer });

    return c.json({
      success: true,
      number,
      code,
      connected: false,
      status: "pending"
    });
  });

  app.get("/api/count", async (c) => {
    syncBaseUrl(c);
    c.header("Cache-Control", "no-store");
    return c.json({
      count: subs.list().length
    });
  });

  app.get("/api/status", async (c) => {
    syncBaseUrl(c);
    c.header("Cache-Control", "no-store");
    const number = c.req.query("number");

    if (!number)
      return c.json({ success: false, error: "Number is required" }, 400);

    const bot = subs.get(number);
    const connected = Boolean(bot?.connected);

    if (connected && pendingSessions.has(number)) {
      clearTimeout(pendingSessions.get(number).timer);
      pendingSessions.delete(number);
    }

    return c.json({
      success: true,
      number,
      connected,
      status: connected ? "connected" : "not_connected"
    });
  });

  app.port = port;
  app.getSiteUrl = () => baseUrl;
  app.getApiUrl = () => `${baseUrl}/api`;

  console.log("========================================");
  console.log("Reze Sub Server Running");
  console.log("Port :", port);
  console.log("Site :", baseUrl);
  console.log("API  :", `${baseUrl}/api`);
  console.log("========================================");

  return app;
}

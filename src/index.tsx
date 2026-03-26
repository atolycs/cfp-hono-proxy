import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { renderer } from "./renderer";

import { logger } from "hono/logger";
import { contextStorage } from "hono/context-storage";
import { generateKarabinerURL } from "./lib/generateURL";

const app = new Hono();

app.use(renderer);
app.use(contextStorage())
app.use(logger())

app.get("/", (c) => {
  console.log(c.req.header("User-Agent"));

  if (c.req.header("User-Agent")?.match("curl")) {
    return c.text(
      [
        "/setup.ps1",
        "/winget",
        "/ubuntu/autoinstall",
        "/setup.sh",
        "/nixos/init",
        "/darwin/setup.sh",
      ].join("\n"),
    );
  } else {

    return c.render(
      <div>
        <h3>Landing Pages</h3>
        <a href="/setup.ps1">Windows setup tool</a>
        <br />
        <a href="/winget">Winget setup tool</a>
        <br />
        <a href="/ubuntu/autoinstall">Ubuntu AutoInstall</a>
        <br />
        <a href="/setup.sh">Ubuntu setup tool</a>
        <br />
        <a href="/nixos/init">NixOS Bootstrap</a>
        <br />
        <a href="/darwin/setup.sh">macOS Environment setup tool</a>
        <br />
        <a href="/karabiner-elements">Karabiner Elements configuration</a>
      </div >,

    );
  }
});

app.get("/setup.ps1", (c) => {
  return proxy(
    "https://raw.githubusercontent.com/atolycs/setup-tools/refs/heads/main/win/deploy.ps1",
  );
});

app.get("/winget", (c) => {
  return proxy(
    "https://raw.githubusercontent.com/atolycs/setup-tools/refs/heads/main/win/winget_update.ps1",
  );
});

app.get("/setup.sh", (c) => {
  return c.render(<h1>Ubuntu Hello world</h1>);
});

app.get("/nixos/init", (c) => {
  return proxy(
    "https://raw.githubusercontent.com/atolycs/setup-tools/refs/heads/main/nixos/deploy.sh",
  );
});

app.get("/ubuntu/autoinstall", (c) => {
  return proxy(
    "https://github.com/atolycs/ubuntu-vm-autoinstall/raw/refs/heads/main/autoinstall.yaml",
  );
});

app.get("/darwin/setup.sh", (c) => {
  return proxy(
    "https://github.com/atolycs/setup-tools/raw/refs/heads/main/macos/machine-setup.sh",
  );
});

app.get("/json/atolycs-configuration.json", (c) => {
  const karabiner_url = `${new URL(c.req.url).origin}/static/atolycs-configuration.json`
  return proxy(karabiner_url)
})

app.get("/karabiner-elements", (c) => {
  // const karabiner_url = `${new URL(c.req.url).origin}/json/atolycs-configuration.json`
  return c.redirect(generateKarabinerURL("/json/atolycs-configuration.json"))
})

export default app;

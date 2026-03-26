import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { renderer } from "./renderer";

import { toAbsoluteUrl } from "./lib/url";
import { logger } from "hono/logger";

const app = new Hono();

app.use(renderer);

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

    const importJson = () => {
      const url = encodeURIComponent(toAbsoluteUrl("/static/atolycs-configuration.json"))
      window.location.href = `karabiner://arabiner/assets/complex_modifications/import?url=${url}`
    }

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
        <a href={
          `karabiner://karabiner/assets/complex_modifications/import?url=${encodeURIComponent(toAbsoluteUrl("/static/atolycs-configuration.json"))}
          `} > test </a>
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

export default app;

import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <div>
      <h3>Landing Pages</h3>
      <a href="/setup.ps1">Windows setup tool</a>
      <br />
      <a href="/winget">Winget setup tool</a>
      <br />
      <a href="/setup.sh">Ubuntu setup tool</a>
      <br />
      <a href="/nixos/init">NixOS Bootstrap</a>
    </div>,
  );
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

export default app;

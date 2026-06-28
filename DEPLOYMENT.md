# 部署说明

本项目使用 GitHub + Cloudflare Pages + Cloudinary 部署。

## 部署结构

- GitHub：保存 React + Vite 源码和本地图片素材。
- Cloudflare Pages：从 GitHub 拉取代码，运行构建命令并发布 `dist`。
- Cloudinary：托管所有视频 MP4，网页只读取外链。

## Cloudflare Pages 设置

- Framework preset：Vite
- Build command：`npm run build`
- Build output directory：`dist`
- Root directory：项目根目录
- Node.js version：`22.16.0`

项目已添加 `.node-version`，Cloudflare Pages 可据此使用固定 Node 版本。

## 视频规则

不要把本地 MP4 上传到 GitHub 或 Cloudflare Pages。视频统一写在：

```txt
src/data/videos.ts
```

每条视频使用 Cloudinary、YouTube、Vimeo 等外链：

```ts
{
  title: "H6112024119",
  videoUrl: "https://res.cloudinary.com/xxx/video/upload/xxx.mp4",
}
```

## 发布流程

1. 将代码推送到 GitHub。
2. 在 Cloudflare Pages 创建项目并连接 GitHub 仓库。
3. 使用上面的构建设置。
4. 部署完成后打开 Cloudflare 分配的域名检查首页和三维视频模块。

如果部署后视频打不开，先检查浏览器 Network 面板里视频请求是否为 `res.cloudinary.com`。如果仍是本地 `/三维视频/*.mp4`，说明 Cloudflare 还在使用旧部署，需要重新部署并清缓存。

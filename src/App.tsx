import { useLayoutEffect, type ReactNode } from "react";
import {
  ArrowUpRight,
  Boxes,
  Clapperboard,
  FolderKanban,
  History,
  IdCard,
  Layers3,
  MapPin,
  MessageCircle,
  MonitorPlay,
  Phone,
  Send,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Aurora from "./components/Aurora";
import BorderGlow from "./components/BorderGlow";
import LiquidEther from "./components/LiquidEther";
import { imageAssets } from "./data/assets";
import { videos, type PortfolioVideo } from "./data/videos";

type WorkImage = {
  title: string;
  path: string;
  width: number;
  height: number;
  note?: string;
};

type Research = {
  audiences: string[];
  pains: Array<{ label: string; value: number; text: string }>;
  priorities?: Array<{ label: string; value: number; text: string }>;
};

const asset = (path: string) => {
  const normalizedPath = path.replace(/\\/g, "/");
  const source = imageAssets[normalizedPath];

  if (!source) {
    throw new Error(`Missing asset: ${path}`);
  }

  return source;
};

const chargerMain: WorkImage[] = [
  { title: "主图 01", path: "视觉设计/充电器/主图/主图1.jpg", width: 1536, height: 2048 },
  { title: "主图 02", path: "视觉设计/充电器/主图/主图2.png", width: 1536, height: 2048 },
  { title: "主图 03", path: "视觉设计/充电器/主图/主图3.png", width: 1536, height: 2048 },
  { title: "主图 04", path: "视觉设计/充电器/主图/主图4.jpg", width: 1792, height: 2400 },
  { title: "主图 05", path: "视觉设计/充电器/主图/主图5.jpg", width: 1792, height: 2400 },
  { title: "主图 06", path: "视觉设计/充电器/主图/主图6.jpg", width: 1536, height: 2048 },
];

const chargerAplus: WorkImage[] = [
  { title: "A+ 01", path: "视觉设计/充电器/高级A+/A+1.png", width: 2048, height: 1536 },
  { title: "A+ 02", path: "视觉设计/充电器/高级A+/A+2.png", width: 2048, height: 1152 },
  { title: "A+ 03", path: "视觉设计/充电器/高级A+/A+3.png", width: 2048, height: 1152 },
  { title: "A+ 04", path: "视觉设计/充电器/高级A+/A+4.jpg", width: 2048, height: 1152 },
  { title: "A+ 05", path: "视觉设计/充电器/高级A+/A+5-1.png", width: 2048, height: 1152 },
  { title: "A+ 06", path: "视觉设计/充电器/高级A+/A+6.webp", width: 2048, height: 1152 },
];

const projectorMain: WorkImage[] = [
  { title: "主图 01", path: "视觉设计/投影仪/主图/主图1.jpg", width: 1792, height: 2400 },
  { title: "主图 02", path: "视觉设计/投影仪/主图/主图2.png", width: 1536, height: 2048 },
  { title: "主图 03", path: "视觉设计/投影仪/主图/主图3.png", width: 1536, height: 2048 },
  { title: "主图 04", path: "视觉设计/投影仪/主图/主图4.jpg", width: 1792, height: 2400 },
  { title: "主图 05", path: "视觉设计/投影仪/主图/主图5.png", width: 1536, height: 2048 },
  { title: "主图 06", path: "视觉设计/投影仪/主图/主图6.jpg", width: 1792, height: 2400 },
];

const projectorAplus: WorkImage[] = [
  { title: "A+ 01", path: "视觉设计/投影仪/高级A+/A+1.png", width: 1920, height: 1072 },
  { title: "A+ 02", path: "视觉设计/投影仪/高级A+/A+2.png", width: 1920, height: 1072 },
  { title: "A+ 03", path: "视觉设计/投影仪/高级A+/A+3.png", width: 1920, height: 1072 },
  { title: "A+ 04", path: "视觉设计/投影仪/高级A+/A+4.png", width: 1920, height: 1082 },
  { title: "A+ 05", path: "视觉设计/投影仪/高级A+/A+5.png", width: 1920, height: 1080 },
  { title: "A+ 06", path: "视觉设计/投影仪/高级A+/A+6.png", width: 1920, height: 1082 },
  { title: "A+ 07", path: "视觉设计/投影仪/高级A+/A+7.png", width: 1920, height: 1082 },
];

const chargerRender: WorkImage[] = [
  { title: "充电器 01", path: "三维渲染/充电器/充电器1.png", width: 1920, height: 1080 },
  { title: "充电器 02", path: "三维渲染/充电器/充电器2.png", width: 1920, height: 1080 },
  { title: "充电器 03", path: "三维渲染/充电器/充电器3.png", width: 1920, height: 1065 },
  { title: "充电器 04", path: "三维渲染/充电器/充电器4.png", width: 1920, height: 1080 },
  { title: "充电器 05", path: "三维渲染/充电器/充电器5.png", width: 1920, height: 1080 },
  { title: "充电器 06", path: "三维渲染/充电器/充电器6.png", width: 953, height: 953 },
  { title: "充电器 07", path: "三维渲染/充电器/充电器7.png", width: 957, height: 953 },
  { title: "充电器 08", path: "三维渲染/充电器/充电器8.png", width: 1920, height: 1080 },
];

const powerBankRender: WorkImage[] = [
  { title: "充电宝 01", path: "三维渲染/充电宝/充电宝1.png", width: 1920, height: 1080 },
  { title: "充电宝 02", path: "三维渲染/充电宝/充电宝2.png", width: 1920, height: 1080 },
  { title: "充电宝 03", path: "三维渲染/充电宝/充电宝3.png", width: 976, height: 1080 },
  { title: "充电宝 04", path: "三维渲染/充电宝/充电宝4.png", width: 933, height: 1080 },
  { title: "充电宝 05", path: "三维渲染/充电宝/充电宝5.png", width: 1920, height: 1080 },
  { title: "充电宝 06", path: "三维渲染/充电宝/充电宝6.png", width: 1920, height: 1080 },
  { title: "充电宝 07", path: "三维渲染/充电宝/充电宝7.png", width: 1920, height: 1080 },
  { title: "充电宝 08", path: "三维渲染/充电宝/充电宝8.png", width: 1920, height: 1080 },
];

const projectorRender: WorkImage[] = [
  { title: "投影仪 01", path: "三维渲染/投影仪/投影仪1.png", width: 1920, height: 1080 },
  { title: "投影仪 02", path: "三维渲染/投影仪/投影仪2.png", width: 1920, height: 1080 },
  { title: "投影仪 03", path: "三维渲染/投影仪/投影仪3.png", width: 1920, height: 1080 },
  { title: "投影仪 04", path: "三维渲染/投影仪/投影仪4.png", width: 1920, height: 1080 },
  { title: "投影仪 05", path: "三维渲染/投影仪/投影仪5.png", width: 1920, height: 1080 },
  { title: "投影仪 06", path: "三维渲染/投影仪/投影仪6.png", width: 957, height: 958 },
  { title: "投影仪 07", path: "三维渲染/投影仪/投影仪7.png", width: 953, height: 958 },
];

const vapeRender: WorkImage[] = [
  { title: "电子烟 01", path: "三维渲染/电子烟/1.jpg", width: 1280, height: 720 },
  { title: "电子烟 02", path: "三维渲染/电子烟/2(2).jpg", width: 1920, height: 1080 },
  { title: "电子烟 03", path: "三维渲染/电子烟/4_Main_0090.png", width: 1920, height: 1080 },
  { title: "电子烟 04", path: "三维渲染/电子烟/C3_Main_0090.png", width: 1920, height: 1080 },
  { title: "电子烟 05", path: "三维渲染/电子烟/C5_0050.png", width: 1920, height: 1080 },
  { title: "电子烟 06", path: "三维渲染/电子烟/H118大图.jpg", width: 5653, height: 8192 },
  { title: "电子烟 07", path: "三维渲染/电子烟/h602海报.jpg", width: 2500, height: 3250 },
  { title: "电子烟 08", path: "三维渲染/电子烟/Q3场景.jpg", width: 1920, height: 1080 },
  { title: "电子烟 09", path: "三维渲染/电子烟/Q3场景3.jpg", width: 2488, height: 1400 },
  { title: "电子烟 10", path: "三维渲染/电子烟/Q3场景4.jpg", width: 1920, height: 1080 },
  { title: "电子烟 11", path: "三维渲染/电子烟/Q3场景5.jpg", width: 1920, height: 1080 },
  { title: "电子烟 12", path: "三维渲染/电子烟/Ｃ1_0090.png", width: 1920, height: 1080 },
];

const heroVideo = videos[0];

const chargerResearch: Research = {
  audiences: ["高端数码商旅用户", "居家多设备家庭用户", "跨境礼品企业采购"],
  pains: [
    { label: "痛点排名 1", value: 35, text: "多设备同时充电功率骤降，无法满速充笔记本与手机。" },
    { label: "痛点排名 2", value: 25, text: "缺少实时功率显示，无法判断设备充电状态。" },
    { label: "痛点排名 3", value: 15, text: "体积厚重，出差携带占用大量背包空间。" },
    { label: "痛点排名 4", value: 15, text: "长时间充电高温烫手，带来安全顾虑。" },
    { label: "痛点排名 5", value: 10, text: "接口数量少，需要多个充电器混用。" },
  ],
  priorities: [
    { label: "性能参数", value: 40, text: "最大功率、多口分流、笔记本满速 PD 快充。" },
    { label: "价格价值", value: 20, text: "氮化镓工艺与多接口集成，一套替代多个充电器。" },
    { label: "用户体验", value: 30, text: "实时数显屏、体积轻薄、温控不发烫。" },
    { label: "外观设计", value: 10, text: "金属深空灰质感、霓虹彩屏与简约工业风。" },
  ],
};

const projectorResearch: Research = {
  audiences: ["家庭影院用户", "年轻科技用户", "游戏娱乐玩家", "户外露营用户"],
  pains: [
    { label: "痛点排名 1", value: 35, text: "担心投影画面模糊、细节丢失，影响电影、赛事与游戏体验。" },
    { label: "痛点排名 2", value: 25, text: "传统投影仪需要反复手动调节，安装复杂影响使用体验。" },
    { label: "痛点排名 3", value: 15, text: "摆放位置偏移后画面容易倾斜变形，影响观看舒适度。" },
    { label: "痛点排名 4", value: 15, text: "应用安装、投屏步骤复杂，系统响应慢。" },
    { label: "痛点排名 5", value: 10, text: "不便移动与收纳，难以覆盖家庭与户外双场景。" },
  ],
  priorities: [
    { label: "沉浸画质", value: 35, text: "以清晰度、细节和大屏观感建立主视觉记忆点。" },
    { label: "智能校正", value: 25, text: "突出自动对焦、梯形校正与低门槛安装体验。" },
    { label: "流畅系统", value: 25, text: "表达无线投屏、流媒体内容与低延迟娱乐能力。" },
    { label: "便携场景", value: 15, text: "覆盖家庭影院、露营、旅行与聚会场景。" },
  ],
};

const stats = [
  { value: "9+", label: "年行业经验" },
  { value: "70+", label: "张作品素材收录" },
  { value: String(videos.length), label: "组三维视频作品" },
  { value: "8+", label: "类 AI 工具经验" },
];

const profileFacts = [
  { label: "姓名", value: "廖国兵" },
  { label: "应聘职位", value: "视觉设计师" },
  { label: "学历", value: "大专" },
  { label: "现居", value: "深圳市松岗" },
];

const softwareTools = ["C4D", "OC 渲染", "KS 渲染", "Photoshop", "Illustrator", "After Effects", "Premiere Pro"];

const aiTools = [
  "ComfyUI",
  "Midjourney",
  "即梦 Seedance 2.0",
  "Nano Banana",
  "GPT Image 2",
  "Lovart",
  "豆包",
  "可灵",
];

const navItems = [
  { label: "资料", href: "#profile", icon: IdCard },
  { label: "经历", href: "#experience", icon: History },
  { label: "作品", href: "#directory", icon: FolderKanban },
  { label: "联系", href: "#contact", icon: Send },
];

const strengths = [
  {
    title: "9年+三维视觉经验",
    text: "长期深耕三维渲染、动画设计与视觉传达，覆盖产品展示、商业广告视频和品牌视觉内容制作。",
    icon: Boxes,
    tag: "Experience",
  },
  {
    title: "电商主图与高级 A+",
    text: "熟悉亚马逊等平台主图、A+ 页面与卖点图设计，能把产品卖点转化为清晰、有转化力的视觉结构。",
    icon: Layers3,
    tag: "E-Commerce",
  },
  {
    title: "三维动画与后期制作",
    text: "可独立完成产品外观 3D 动画、场景渲染、动态视频制作，并使用 AE、PR 完成专业后期。",
    icon: Clapperboard,
    tag: "Motion",
  },
  {
    title: "AI 工具融合应用",
    text: "熟练将 AI 视频生成与 3D 动画渲染结合，用更高效率完成从创意构思到视觉落地的完整流程。",
    icon: MonitorPlay,
    tag: "AI Workflow",
  },
];

const workExperience = [
  {
    period: "2025.5 - 至今",
    role: "深圳畅新扬科技有限公司 / 三维设计师",
    description:
      "主导 AI 工具在产品消费场景视频中的应用，实现 3D 产品卖点动画与 AI 生成内容的融合；负责商业宣传视频全流程制作、产品渲染图与卖点图渲染，提升品牌视觉呈现效果。",
  },
  {
    period: "2022.3 - 2025.5",
    role: "深圳汉清达科技有限公司 / 三维设计师",
    description:
      "深度挖掘产品卖点，策划三维视频脚本与制作方案；独立承担产品外观 3D 动画设计与渲染，协助完成产品场景渲染，并使用 AE、PR 进行后期制作，持续优化交付效率。",
  },
  {
    period: "2019.10 - 2022.3",
    role: "深圳智本有术科技有限公司 / 视觉设计师",
    description:
      "负责亚马逊平台主图与 A+ 页面设计，优化产品视觉呈现；制作 3D 动态视频及实拍内容，独立完成建模与渲染任务。",
  },
  {
    period: "2017.6 - 2019.9",
    role: "深圳亿拓源电子有限公司 / 设计组长",
    description:
      "负责店铺整体视觉设计，包括详情页、首页及店铺装修；承担产品摄影、视频制作、3D 建模与渲染工作，并于 2019 年晋升为设计主管，负责团队运营管理、任务分配及项目统筹。",
  },
];

const directoryItems = [
  {
    title: "充电器主图与高级 A+",
    href: "#charger",
    image: chargerMain[1],
    meta: "6 张主图 / 6 张 A+",
  },
  {
    title: "投影仪主图与高级 A+",
    href: "#projector",
    image: projectorMain[2],
    meta: "6 张主图 / 7 张 A+",
  },
  {
    title: "三维渲染合集",
    href: "#renders",
    image: projectorRender[0],
    meta: "35 张渲染作品",
  },
  {
    title: "三维视频作品",
    href: "#videos",
    image: vapeRender[2],
    meta: `${videos.length} 组视频`,
  },
];

const renderCatalog = [
  {
    title: "充电器渲染",
    description: "工业风材质、接口细节与场景光效。",
    images: chargerRender,
  },
  {
    title: "充电宝渲染",
    description: "便携电子产品的体块、屏幕与材质表达。",
    images: powerBankRender,
  },
  {
    title: "投影仪渲染",
    description: "家用影音设备的光影氛围与产品结构展示。",
    images: projectorRender,
  },
  {
    title: "电子烟渲染",
    description: "多场景产品海报、主视觉与系列化表现。",
    images: vapeRender,
  },
];

type MotionWindow = Window & {
  __portfolioMotionReady?: boolean;
};

function usePortfolioMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motionWindow = window as MotionWindow;
    const motionOverride = new URLSearchParams(window.location.search).get("motion");
    let savedMotionOverride = "";

    try {
      if (motionOverride === "on" || motionOverride === "off") {
        savedMotionOverride = motionOverride;
        window.localStorage.setItem("portfolio-motion", motionOverride);
      } else {
        savedMotionOverride = window.localStorage.getItem("portfolio-motion") ?? "";
      }
    } catch {
      savedMotionOverride = motionOverride === "on" || motionOverride === "off" ? motionOverride : "";
    }

    const forceMotion = savedMotionOverride === "on";
    const reduceMotion =
      !forceMotion &&
      (savedMotionOverride === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    document.documentElement.classList.remove("motion-enhanced", "motion-reduced");

    if (reduceMotion) {
      document.documentElement.classList.add("motion-reduced");
      motionWindow.__portfolioMotionReady = true;

      return () => {
        document.documentElement.classList.remove("motion-reduced");
      };
    }

    document.documentElement.classList.add("motion-enhanced");
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      const cinematicEase = "expo.out";
      const smoothEase = "power4.out";
      const longEase = "power3.out";

      gsap.set(".intro-curtain", { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(".intro-mark span, .intro-mark strong", {
        autoAlpha: 0,
        clipPath: "inset(0% 0% 100% 0%)",
        scaleX: 0.58,
        transformOrigin: "left center",
        yPercent: 120,
      });
      gsap.set(".intro-line", { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" });
      gsap.set(".site-header", { autoAlpha: 0, filter: "blur(16px)", xPercent: -50, y: -44 });
      gsap.set(".hero-video-bg img, .hero-video-bg video", {
        filter: "blur(30px) saturate(150%) contrast(116%) brightness(0.64)",
        scale: 1.18,
        xPercent: 2,
      });
      gsap.set(".hero-copy", {
        autoAlpha: 0,
        clipPath: "inset(0% 0% 100% 0%)",
        scaleX: 0.94,
        scaleY: 0.9,
        transformOrigin: "left center",
        y: 96,
      });
      gsap.set(".hero-copy .eyebrow, .hero-copy h1, .hero-lead", { autoAlpha: 0 });
      gsap.set(".profile-fact-glow, .contact-strip > *, .stat-card-shell", {
        autoAlpha: 0,
        clipPath: "inset(28% 0% 0% 0%)",
        y: 54,
      });

      const heroTimeline = gsap.timeline({ defaults: { ease: cinematicEase } });

      heroTimeline
        .to(".intro-line", { autoAlpha: 1, duration: 0.74, scaleX: 1 }, 0.1)
        .to(
          ".intro-mark span, .intro-mark strong",
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.12,
            scaleX: 1,
            stagger: 0.08,
            yPercent: 0,
          },
          0.18,
        )
        .to(".intro-mark", { autoAlpha: 0, duration: 0.58, filter: "blur(12px)", y: -48 }, 1.1)
        .to(".intro-curtain", {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.65,
        })
        .to(
          ".hero-video-bg img, .hero-video-bg video",
          {
            filter: "blur(16px) saturate(125%) contrast(108%) brightness(0.8)",
            scale: 1.04,
            duration: 2.6,
            xPercent: 0,
          },
          0,
        )
        .to(
          ".site-header",
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.22,
            xPercent: -50,
            y: 0,
          },
          0.8,
        )
        .to(
          ".hero-copy",
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.62,
            scaleX: 1,
            scaleY: 1,
            y: 0,
          },
          0.9,
        )
        .fromTo(
          ".hero-copy .eyebrow",
          { autoAlpha: 0, filter: "blur(12px)", letterSpacing: "0.42em", scaleX: 1.72, transformOrigin: "left center", x: -72, y: 32 },
          { autoAlpha: 1, duration: 1.36, filter: "blur(0px)", letterSpacing: "0.12em", scaleX: 1, x: 0, y: 0 },
          1.12,
        )
        .fromTo(
          ".hero-copy h1",
          {
            autoAlpha: 0,
            clipPath: "inset(0% 100% 0% 0%)",
            filter: "blur(22px)",
            scaleX: 0.52,
            scaleY: 1.24,
            transformOrigin: "left center",
            yPercent: 46,
          },
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.82,
            filter: "blur(0px)",
            scaleX: 1,
            scaleY: 1,
            yPercent: 0,
          },
          1.22,
        )
        .fromTo(
          ".hero-copy h1 span",
          { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)", scaleX: 0.84, transformOrigin: "left center", yPercent: 92 },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.24, scaleX: 1, yPercent: 0 },
          1.5,
        )
        .fromTo(
          ".hero-lead",
          { autoAlpha: 0, filter: "blur(12px)", y: 56 },
          { autoAlpha: 1, duration: 1.28, filter: "blur(0px)", y: 0 },
          1.66,
        )
        .to(
          ".profile-fact-glow",
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: smoothEase, stagger: 0.1, y: 0 },
          1.74,
        )
        .to(
          ".contact-strip > *",
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: smoothEase, stagger: 0.08, y: 0 },
          1.88,
        )
        .fromTo(
          ".stat-card-shell",
          { autoAlpha: 0, clipPath: "inset(34% 0% 0% 0%)", rotateX: -18, transformPerspective: 1000, y: 96 },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.24, ease: smoothEase, rotateX: 0, stagger: 0.1, y: 0 },
          2,
        );

      const headingSelectors = [".section-heading", ".project-header", ".render-block-title", ".gallery-title-row"];

      headingSelectors.forEach((selector) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((heading) => {
          const kicker =
            heading.querySelector<HTMLElement>(".eyebrow, .panel-kicker") ??
            (heading.classList.contains("gallery-title-row") ? heading.querySelector<HTMLElement>("span") : null);
          const title = heading.querySelector<HTMLElement>("h2, h3, h4");
          const copy =
            heading.querySelector<HTMLElement>(".section-lead") ??
            (heading.classList.contains("project-header") || heading.classList.contains("render-block-title")
              ? heading.querySelector<HTMLElement>(":scope > p")
              : null);
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: heading,
              start: "top 84%",
              once: true,
            },
          });

          if (kicker) {
            timeline.fromTo(
              kicker,
              {
                autoAlpha: 0,
                filter: "blur(18px)",
                letterSpacing: "0.56em",
                scale: 2.2,
                scaleX: 1.68,
                transformOrigin: "left center",
                x: -150,
                y: 72,
              },
              {
                autoAlpha: 1,
                duration: 1.34,
                filter: "blur(0px)",
                letterSpacing: heading.classList.contains("gallery-title-row") ? "0em" : "0.12em",
                scale: 1,
                scaleX: 1,
                x: 0,
                y: 0,
              },
            );
          }

          if (title) {
            timeline.fromTo(
              title,
              {
                autoAlpha: 0,
                clipPath: "inset(0% 100% 0% 0%)",
                filter: "blur(18px)",
                scaleX: 0.58,
                scaleY: 1.18,
                transformOrigin: "left center",
                y: 88,
              },
              {
                autoAlpha: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.48,
                ease: smoothEase,
                filter: "blur(0px)",
                scaleX: 1,
                scaleY: 1,
                y: 0,
              },
              kicker ? 0.16 : 0,
            );
          }

          if (copy) {
            timeline.fromTo(
              copy,
              { autoAlpha: 0, filter: "blur(10px)", y: 48 },
              { autoAlpha: 1, duration: 1.1, ease: smoothEase, filter: "blur(0px)", y: 0 },
              0.52,
            );
          }
        });
      });

      const revealGroups: Array<{ selector: string; targets?: string }> = [
        { selector: ".timeline", targets: ".timeline-item" },
        { selector: ".strength-grid", targets: ".strength-card-shell" },
        { selector: ".tool-panel", targets: ".tool-glow-card" },
        { selector: ".directory-grid", targets: ".directory-card" },
        { selector: ".research-glow-card" },
        { selector: ".gallery-grid", targets: ".image-card" },
        { selector: ".video-grid", targets: ".video-card-shell" },
        { selector: ".contact-actions", targets: ".contact-action-glow" },
      ];

      revealGroups.forEach(({ selector, targets }) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((group) => {
          const elements = targets ? Array.from(group.querySelectorAll<HTMLElement>(targets)) : [group];

          if (!elements.length) return;

          gsap.fromTo(
            elements,
            {
              autoAlpha: 0,
              clipPath: "inset(32% 0% 0% 0%)",
              rotateX: -16,
              rotateY: -4,
              scale: 0.94,
              transformOrigin: "center top",
              transformPerspective: 1200,
              willChange: "transform, opacity, clip-path",
              y: 140,
            },
            {
              autoAlpha: 1,
              clearProps: "willChange",
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.38,
              ease: smoothEase,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              stagger: { each: 0.11, from: "start" },
              y: 0,
              scrollTrigger: {
                trigger: group,
                start: "top 82%",
                once: true,
              },
            },
          );
        });
      });

      gsap.utils.toArray<HTMLElement>(".image-frame img, .directory-card img, .video-card iframe, .video-card video").forEach((media) => {
        const trigger = media.closest<HTMLElement>(".image-frame, .directory-card, .video-card") ?? media;

        gsap.fromTo(
          media,
          {
            clipPath: "inset(0% 100% 0% 0%)",
            scale: 1.12,
            willChange: "transform, clip-path",
            xPercent: -5,
            yPercent: 4,
          },
          {
            clearProps: "willChange",
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.72,
            ease: longEase,
            scale: 1,
            xPercent: 0,
            yPercent: 0,
            scrollTrigger: {
              trigger,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    motionWindow.__portfolioMotionReady = true;

    return () => {
      document.documentElement.classList.remove("motion-enhanced");
      ctx.revert();
    };
  }, []);
}

function FadeIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <FadeIn className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p className="section-lead">{text}</p> : null}
    </FadeIn>
  );
}

function dimensionLabel(image: WorkImage) {
  const ratio = image.width / image.height;

  if (ratio < 0.82) return "竖版 3:4";
  if (ratio < 1.15) return "方图 1:1";
  if (ratio < 1.55) return "横版 4:3";
  return "横版 16:9";
}

function groupByDimension(images: WorkImage[]) {
  const order = ["竖版 3:4", "方图 1:1", "横版 4:3", "横版 16:9"];

  return order
    .map((label) => ({
      label,
      images: images.filter((image) => dimensionLabel(image) === label),
    }))
    .filter((group) => group.images.length > 0);
}

function GlowFrame({
  animated = false,
  children,
  className = "",
  compact = false,
}: {
  animated?: boolean;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <BorderGlow
      animated={animated}
      backgroundColor="#121516"
      borderRadius={8}
      className={className}
      colors={["#8ccfd8", "#5b5873", "#d7a24a"]}
      coneSpread={compact ? 18 : 22}
      edgeSensitivity={compact ? 30 : 24}
      fillOpacity={compact ? 0.18 : 0.28}
      glowColor="186 46 70"
      glowIntensity={compact ? 0.72 : 0.85}
      glowRadius={compact ? 18 : 26}
    >
      {children}
    </BorderGlow>
  );
}

function ImageCard({ image }: { image: WorkImage }) {
  return (
    <figure className="image-card">
      <GlowFrame className="image-glow-card" compact>
        <div className="image-frame" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
          <img src={asset(image.path)} alt={`${image.title} ${dimensionLabel(image)}`} loading="lazy" />
        </div>
      </GlowFrame>
    </figure>
  );
}

function DimensionGallery({
  images,
  showHeader = true,
  showLabels = false,
  title,
}: {
  images: WorkImage[];
  showHeader?: boolean;
  showLabels?: boolean;
  title: string;
}) {
  return (
    <div className={`dimension-gallery ${!showHeader && !showLabels ? "gallery-plain" : ""}`}>
      {showHeader ? (
        <div className="gallery-title-row">
          <h4>{title}</h4>
          <span>{images.length} Pieces</span>
        </div>
      ) : null}
      {groupByDimension(images).map((group) => {
        const gridClassName = [
          "gallery-grid",
          group.label.includes("竖版") ? "vertical-grid" : "",
          group.label.includes("方图") ? "square-grid" : "",
          group.label.includes("4:3") ? "landscape-grid" : "",
          group.label.includes("16:9") ? "wide-grid" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className="dimension-group" key={`${title}-${group.label}`}>
            {showLabels ? (
              <div className="dimension-label">
                <span>{group.label}</span>
                <small>{group.images.length} 张</small>
              </div>
            ) : null}
            <div className={gridClassName}>
            {group.images.map((image) => (
              <ImageCard key={image.path} image={image} />
            ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const isDirectVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url) || /\/video\/upload\//i.test(url);

const getEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (host.endsWith("youtube.com")) {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (host.endsWith("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }

    return url;
  } catch {
    return url;
  }
};

function VideoPlayer({ video }: { video: PortfolioVideo }) {
  if (isDirectVideoUrl(video.videoUrl)) {
    return <video controls preload="metadata" src={video.videoUrl} />;
  }

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      src={getEmbedUrl(video.videoUrl)}
      title={video.title}
    />
  );
}

function ResearchPanel({ research }: { research: Research }) {
  return (
    <GlowFrame className="research-glow-card">
      <div className="research-panel">
      <div>
        <p className="panel-kicker">Crowd</p>
        <h3>项目背景与用户画像</h3>
        <div className="audience-list">
          {research.audiences.map((audience) => (
            <span key={audience}>{audience}</span>
          ))}
        </div>
      </div>

      <div className="pain-list">
        {research.pains.map((pain) => (
          <div className="pain-row" key={pain.label}>
            <div className="pain-head">
              <span>{pain.label}</span>
              <strong>{pain.value}%</strong>
            </div>
            <div className="bar-track" aria-label={`${pain.label} ${pain.value}%`}>
              <span style={{ width: `${pain.value}%` }} />
            </div>
            <p>{pain.text}</p>
          </div>
        ))}
      </div>

      {research.priorities ? (
        <div className="priority-list">
          {research.priorities.map((priority) => (
            <div key={priority.label}>
              <strong>{priority.label}</strong>
              <span>{priority.value}%</span>
              <p>{priority.text}</p>
            </div>
          ))}
        </div>
        ) : null}
      </div>
    </GlowFrame>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a href="#profile" className="brand" aria-label="廖国兵个人作品集首页">
        廖国兵
      </a>
      <nav aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <a href={item.href} key={item.href}>
              <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}

function ProfileSection() {
  return (
    <section className="hero-section" id="profile">
      <div className="hero-video-bg" aria-hidden="true">
        {heroVideo ? <video autoPlay loop muted playsInline preload="metadata" src={heroVideo.videoUrl} /> : null}
      </div>
      <div className="hero-aurora-bg" aria-hidden="true">
        <Aurora colorStops={["#8ccfd8", "#5227ff", "#dd6b5a"]} blend={0.44} amplitude={0.92} speed={0.42} />
      </div>
      <div className="hero-bg-glass" aria-hidden="true" />
      <div className="intro-curtain" aria-hidden="true">
        <div className="intro-mark">
          <span>3D Visual</span>
          <strong>Portfolio</strong>
          <i className="intro-line" />
        </div>
      </div>
      <Header />
      <div className="wide-container hero-grid">
        <FadeIn className="hero-copy">
          <p className="eyebrow">3D Visual Designer</p>
          <h1>
            廖国兵
            <span>视觉设计师 / 三维设计师</span>
          </h1>
          <p className="hero-lead">
            我是一名懂设计、懂商业、懂 AI 工具的设计师，拥有 9 年+行业经验，专注三维渲染、视觉设计与三维动画，能够高效完成从创意构思到视觉落地的完整设计流程。
          </p>
          <div className="profile-facts" aria-label="个人资料">
            {profileFacts.map((fact) => (
              <GlowFrame className="profile-fact-glow" compact key={fact.label}>
                <div className="profile-fact">
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </div>
              </GlowFrame>
            ))}
          </div>
          <div className="contact-strip" aria-label="联系方式">
            <a href="tel:+8617376860991">
              <Phone size={18} />
              17376860991
            </a>
            <span>
              <MapPin size={18} />
              深圳市松岗
            </span>
            <span>
              <MessageCircle size={18} />
              三维渲染 / 视觉设计 / 三维动画
            </span>
          </div>
        </FadeIn>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <FadeIn className="stat-card-shell" delay={0.05 * index} key={stat.label}>
              <GlowFrame className="stat-glow-card" compact>
                <div className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </GlowFrame>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="section section-light" id="experience">
      <div className="wide-container">
        <SectionHeading
          eyebrow="Experience"
          title="工作经历"
          text="从店铺视觉、亚马逊主图 A+，到产品三维动画、AI 视频生成和商业宣传视频，逐步形成完整的视觉交付能力。"
        />
        <div className="timeline">
          {workExperience.map((item, index) => (
            <FadeIn className="timeline-item" delay={index * 0.08} key={item.period}>
              <div className="timeline-period">{item.period}</div>
              <div className="timeline-dot" aria-hidden="true" />
              <GlowFrame className="timeline-glow-card" compact>
                <div className="timeline-content">
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                </div>
              </GlowFrame>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function StrengthSection() {
  return (
    <section className="section section-dark" id="strengths">
      <div className="wide-container">
        <SectionHeading
          eyebrow="Strength"
          title="个人优势"
          text="熟悉三维渲染、动态视频、电商视觉和 AI 工具融合，能独立推进从策划、建模、渲染到后期交付的完整流程。"
        />
        <div className="strength-grid">
          {strengths.map((strength, index) => {
            const Icon = strength.icon;

            return (
              <FadeIn className="strength-card-shell" delay={index * 0.08} key={strength.title}>
                <GlowFrame animated={index === 0} className="strength-glow-card">
                  <div className="strength-card">
                    <div className="icon-box">
                      <Icon size={28} strokeWidth={1.7} />
                    </div>
                    <span>{strength.tag}</span>
                    <h3>{strength.title}</h3>
                    <p>{strength.text}</p>
                  </div>
                </GlowFrame>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn className="tool-panel" delay={0.16}>
          <GlowFrame className="tool-glow-card">
            <div className="tool-card">
            <p className="panel-kicker">Software</p>
            <h3>熟练使用的软件</h3>
            <div className="tool-tags">
              {softwareTools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            </div>
          </GlowFrame>
          <GlowFrame className="tool-glow-card">
            <div className="tool-card">
            <p className="panel-kicker">AI Tools</p>
            <h3>AI 工具掌握</h3>
            <div className="tool-tags">
              {aiTools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            </div>
          </GlowFrame>
        </FadeIn>
      </div>
    </section>
  );
}

function DirectorySection() {
  return (
    <section className="section section-light" id="directory">
      <div className="wide-container">
        <SectionHeading
          eyebrow="Selected Catalog"
          title="精选目录"
          text="从主图、A+、渲染图到视频，按照求职网站的浏览节奏组织完整作品。"
        />
        <div className="directory-grid">
          {directoryItems.map((item, index) => (
            <FadeIn className="directory-card" delay={index * 0.08} key={item.title}>
              <GlowFrame className="directory-glow-card">
                <a href={item.href}>
                <img src={asset(item.image.path)} alt={`${item.title} 封面`} loading="lazy" />
                <div>
                  <span>{item.meta}</span>
                  <h3>{item.title}</h3>
                  <p>
                    查看作品
                    <ArrowUpRight size={20} />
                  </p>
                </div>
                </a>
              </GlowFrame>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisualProjectSection({
  id,
  index,
  title,
  summary,
  research,
  mainImages,
  aplusImages,
}: {
  id: string;
  index: string;
  title: string;
  summary: string;
  research: Research;
  mainImages: WorkImage[];
  aplusImages: WorkImage[];
}) {
  return (
    <section className="section project-section" id={id}>
      <div className="wide-container">
        <FadeIn className="project-header">
          <div>
            <p className="eyebrow">Case {index}</p>
            <h2>{title}</h2>
          </div>
          <p>{summary}</p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <ResearchPanel research={research} />
        </FadeIn>
        <DimensionGallery title="主图作品" images={mainImages} />
        <DimensionGallery title="高级 A+ 模块" images={aplusImages} />
      </div>
    </section>
  );
}

function RenderSection() {
  return (
    <section className="section section-light render-section" id="renders">
      <div className="wide-container">
        <SectionHeading
          eyebrow="3D Rendering"
          title="三维渲染"
        />
        <div className="render-catalog">
          {renderCatalog.map((catalog) => (
            <FadeIn className="render-block" key={catalog.title}>
              <div className="render-block-title">
                <div>
                  <p className="panel-kicker">Render Series</p>
                  <h3>{catalog.title}</h3>
                </div>
                <p>{catalog.description}</p>
              </div>
              <DimensionGallery title={catalog.title} images={catalog.images} showHeader={false} showLabels={false} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="section section-dark" id="videos">
      <div className="wide-container">
        <SectionHeading
          eyebrow="3D Motion"
          title="三维视频"
          text="从脚本策划,视觉设定,卖点表现,个人SOLO"
        />
        <div className="video-grid">
          {videos.map((video, index) => (
            <FadeIn className="video-card-shell" delay={index * 0.04} key={`${video.title}-${video.videoUrl}`}>
              <GlowFrame className="video-glow-card">
                <div className="video-card">
                  <VideoPlayer video={video} />
                  <div>
                    <span>{video.title}</span>
                    <strong>{video.title}</strong>
                  </div>
                </div>
              </GlowFrame>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <footer className="contact-section" id="contact">
      <div className="wide-container contact-grid">
        <FadeIn>
          <p className="eyebrow">Contact</p>
          <h2>期待与你聊聊新的视觉设计机会。</h2>
        </FadeIn>
        <FadeIn className="contact-actions" delay={0.1}>
          <GlowFrame className="contact-action-glow" compact>
            <a className="contact-action-item" href="tel:+8617376860991">
            <Phone size={24} />
            17376860991
            <ArrowUpRight size={22} />
            </a>
          </GlowFrame>
          <GlowFrame className="contact-action-glow" compact>
            <span className="contact-action-item">
              <MapPin size={24} />
            深圳市松岗
          </span>
          </GlowFrame>
          <GlowFrame className="contact-action-glow" compact>
            <span className="contact-action-item">
              <MonitorPlay size={24} />
            三维渲染 / 视觉设计 / 三维动画
            </span>
          </GlowFrame>
        </FadeIn>
      </div>
    </footer>
  );
}

function BelowHeroBackground({ children }: { children: ReactNode }) {
  return (
    <div className="below-hero-background">
      <div className="below-hero-aurora" aria-hidden="true">
        <LiquidEther
          colors={["#071011", "#17363b", "#8ccfd8", "#5b5873"]}
          mouseForce={8}
          cursorSize={140}
          resolution={0.42}
          autoDemo
          autoSpeed={0.28}
          autoIntensity={1.24}
          autoResumeDelay={1400}
          autoRampDuration={1.1}
          takeoverDuration={0.2}
        />
      </div>
      <div className="below-hero-scrim" aria-hidden="true" />
      <div className="below-hero-content">{children}</div>
    </div>
  );
}

function App() {
  usePortfolioMotion();

  return (
    <main>
      <ProfileSection />
      <BelowHeroBackground>
        <ExperienceSection />
        <StrengthSection />
        <DirectorySection />
        <VisualProjectSection
        id="charger"
        index="01"
        title="充电器主图与高级 A+"
        summary="围绕多设备快充、实时功率显示、轻薄便携与金属科技感，建立从主图到详情页的整套商业视觉。"
        research={chargerResearch}
        mainImages={chargerMain}
        aplusImages={chargerAplus}
      />
        <VisualProjectSection
        id="projector"
        index="02"
        title="投影仪主图与高级 A+"
        summary="围绕家庭影院、智能校正、低延迟娱乐和户外便携场景，强化大屏沉浸感与产品可信度。"
        research={projectorResearch}
        mainImages={projectorMain}
        aplusImages={projectorAplus}
      />
        <RenderSection />
        <VideoSection />
        <ContactSection />
      </BelowHeroBackground>
    </main>
  );
}

export default App;

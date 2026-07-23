---
title: "一个不会消失的移动端导航"
date: 2026-07-22
description: "修复一个移动端导航与文档侧边栏都是 display:none、毫无替代方案的站点 -- 以及藏在下面的两个 CSS 陷阱,和内联语言三元表达式的清理。"
tags: ["mobile", "css", "i18n", "astro", "awareride"]
author: "AwareRide"
source: "https://github.com/awareride/awareride.github.io"
---

桌面端看着没问题。然后在手机上打开,我才意识到移动端体验不是"极简" -- 是 *坏的*。导航和文档侧边栏
在 768px 以下都是 `display: none`,没有汉堡按钮、没有开关,什么都没有。手机访客能读完一页,然后就
... 停住。他们到不了 Projects、Posts、Packscope 或 GitHub,也切换不了语言,因为语言切换器藏在那个
被隐藏的列表里。

这篇讲的就是怎么修它,以及藏在那个明显问题底下的两个微妙 CSS bug。

## 像艺术家一样偷师(经允许)

我不想从零发明一个移动菜单。我想要 [anthropic.com/research](https://www.anthropic.com/research)
上那个从容、宽敞的:无边框汉堡按钮、满屏奶油色遮罩、23px 的大号链接、没有分隔线、充裕的垂直内边距。

问题是我看不见它 -- 我的环境没有浏览器截图审阅。于是我驱动 headless Chrome 走 DevTools 协议,让它把
展开后遮罩的*计算样式*作为 JSON 报回来:面板的尺寸、背景,导航链接的字号、字重、内边距、字间距。
一段贴在控制台里的代码,贴回来,就给了我规格:

```json
{ "w": 390, "h": 844, "bg": "rgb(250, 249, 245)", "z": "9999" }
{ "text": "Research", "fs": "23px", "fw": "600", "pt": "24px", "pb": "24px" }
```

他们的奶油色是 `rgb(250, 249, 245)`。我们的是 `--color-bg: #faf9f7`,即 `rgb(250, 249, 247)`。蓝色
通道差 6。我用了我们自己的 token。重点从来不是照抄他们的数值 -- 而是匹配他们的*感觉*,同时与我们
自己的设计系统保持一致。

## 一个只打开 56 像素的汉堡菜单

第一版是头部下方的一条下拉条。能用,但不是我要的满屏面板。于是我重写了:在移动端 `.nav-menu` 变成
`position: fixed; inset: 0; top: 56px`,填满头部条以下的视口。

我渲染出来量了一下。遮罩的高度是 **56px**。不是 844。是五十六。正好是头部高度。

罪魁是 `.site-header` 上的一行:

```css
.site-header {
  backdrop-filter: blur(12px); /* <-- 就是它 */
}
```

`backdrop-filter` 是那种默默干着比字面更多事的属性之一。它为 `position: fixed` 的后代创建一个
**包含块(containing block)**。所以我那个满屏遮罩并不是固定在视口上 -- 它固定在了 56 像素高的头部上,
并被裁剪到那个尺寸。修法不是去对抗它:

```css
@media (max-width: 768px) {
  .site-header {
    background: var(--color-bg); /* 移动端不透明就够了 */
    backdrop-filter: none;
  }
}
```

移动端遮罩本来就是不透明的奶油色,模糊什么都没加,只添了坑。去掉它,`position: fixed` 才终于指向
视口。

## 横着滚动的文档页

导航修好了。文档页没有。在手机上打开 `/packscope/docs/cli-reference/`,页面横向滚动了 -- 390px 的
视口上 `scrollWidth: 723`。

出问题的是 `.docs-main` 本身,宽 703px。为什么?两条规则合谋的结果:

```css
.docs-main {
  flex: 1;
  min-width: 0;
  max-width: 760px; /* 桌面端 */
}
.docs-page {
  display: flex;
  align-items: flex-start; /* <-- 这个 */
}
```

桌面端 `.docs-page` 是**一行(row)**:侧边栏 | 主区。`flex: 1` 和 `min-width: 0` 沿主轴约束
`.docs-main` 的宽度,让它乖巧地待在 240px 侧边栏旁边,从不溢出。

移动端 `.docs-page` 变成 `flex-direction: column` -- 侧边栏堆在主区*上方*。这时主轴是垂直的。`flex`
和 `min-width` 管的是*高度*,不是宽度。加上 `align-items: flex-start`,交叉轴(默认是宽度)会把每个
子元素尺寸设为其**内容的固有宽度**。而 `.docs-main` 的内容里有一个 600px 宽的 `<pre>` 块。于是
`.docs-main` 变成了 700px,冲出了视口。移动端的覆盖规则只改了内边距。

修法是大声说出来:

```css
@media (max-width: 768px) {
  .docs-main {
    width: 100%;      /* 填满列,而不是填满内容 */
    max-width: 100%;
  }
}
```

现在 `.docs-main` 是 350px。它里面的 `<pre>` 块保留各自的 `overflow-x: auto`,在内部滚动 -- 这正是
你要的。代码块滚动,正文不滚动。

## 拒绝换行的内联代码

即便修完,有一个页面仍溢出 31 像素。我追到出问题的元素,发现是一个内联 `<code>` -- 字符 `{}`,宽
29px -- 落在 `x: 392`,超出了内容边界。问题不在 `{}`;而在它所在的那一行:

```md
`if`/`else`/`for`/`while`/`switch`/`try`/`catch`/`{}`
```

八个内联代码 token 用 `/` 连起来,**中间没有空格**。浏览器没有任何断行机会,于是整条链作为一个不可
断开的词冲出了边界。一条规则到处解决:

```css
.prose {
  overflow-wrap: break-word;
}
```

`overflow-wrap: break-word` 只在真正不可断开的内容上生效。普通正文不受影响(它有空格可断)。`<pre>`
块不受影响(它们是 `white-space: pre`,且会滚动)。它只在病态情况下介入 -- 一个超长 URL,或一条
用 `/` 连起的代码链 -- 让它在 token 中间断行,而不是溢出。加完这条,每个文档页都报
`scrollWidth: 390`。

## 只在 hover 时打开的语言切换器

另一个独立、更小的罪过:语言下拉只在 `:hover` 和 `:focus-within` 时打开。这在带鼠标的桌面端没问题。
在手机上没有 hover,而 `focus-within` 在触摸上不可靠。于是切换器在移动端实际上够不着 -- 这尤其残忍,
因为切换器还*被困在*导航遮罩里,你得先打开菜单才能看见它。

两处修复。第一,通过 `.open` 类加上点击展开(用 Escape 和外部点击关闭),叠加在 hover 行为之上:

```css
.locale-switcher:hover .locale-switcher-menu,
.locale-switcher:focus-within .locale-switcher-menu,
.locale-switcher.open .locale-switcher-menu { /* 点击(触摸) */
  opacity: 1; visibility: visible; transform: translateY(0);
}
```

第二,把切换器从遮罩里*移出来*,放进头部条,在汉堡按钮左边。现在不打开菜单也够得着,它的下拉也不再
在接近屏幕底部的位置打开(那里会被裁掉)。这还顺带修了一个副作用:GitHub 按钮,过去用
`margin-top: auto` 钉在遮罩底部(短屏上要滚动才看得到),现在紧贴链接下方,永远可见。

## 我差点就提交的那个,以及发现它的人

我有了一个能用的移动导航,准备提交。然后协作者看了看 diff,指着其中一行:

```astro
<li><a href={projectsHref}>{locale === 'zh' ? '项目' : 'Projects'}</a></li>
```

"为什么不用 i18n?"有道理。项目在 `src/lib/i18n.ts` 里有一个 `t` 字典,文档里写着它是 UI 字符串的
单一真相来源。`ui.posts` 和 `ui.home` 已经存在了。但 `projects` 没有,于是原作者图省事用了内联三元
表达式 -- 而我在重构导航时把它原样保留了。一次 grep 又在另外五处发现了同样的捷径:Footer 标题、版权
行、PostCard 里的 tooltip,还有 -- 我的最爱 -- 一个靠*嗅探* `ui.home === '首页'` 来本地化的标语。

我差点就把这版提交了。完整清扫是一次 37 行的重构:把缺失的键加进 `t`,把每个三元表达式换成 `ui.*`,
并顺手把三处 `toLocaleDateString` 调用点里硬编码的日期语言代码(`'en-US'` / `'zh-CN'`)集中进一个
`localeCode` 映射。现在加一种语言,字符串层面真的只改一个文件,而不是在组件里到处找。

教训是:"只是保留"不一致的重构,仍然是在提交不一致。grep 一下 `locale === 'zh'` 很便宜;提交它
不便宜。

## 我到底建了什么

这些都不需要 UI 框架。三个小的内联 `<script>` 块(汉堡开关、文档侧边栏开关、语言切换器的点击展开)
-- 由 Astro 打包,每次整页加载都重新运行。一个 `--nav-control-h` CSS 变量,让汉堡按钮、GitHub 胶囊
和语言按钮保持同样高度,而不用三个魔法数字。一个 `:has()` 选择器,在遮罩展开时锁定背景滚动。

还有一条全程保持绿色的构建 -- 用 headless Chrome 在 390px 下验证,每个页面都报
`scrollWidth: 390, overflow: false`。

移动端站点现在做到了它以前做不到的那件事:从任何地方去到任何地方。

---

*这是"构建 open.awareride.com"系列的一部分。上一篇:
[通过 Pull Request 同步的内容中心](/zh/posts/awareride/2026-07-22-a-content-hub-synced-via-pull-requests/)。
从头读起:[用 Astro 重建 open.awareride.com](/zh/posts/awareride/2026-07-21-rebuilding-open-awareride-on-astro/)。*

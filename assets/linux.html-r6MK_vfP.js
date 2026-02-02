import{_ as n,c as a,b as e,o as i}from"./app-DWlosiBp.js";const l="/awesome/linux.png",c={};function p(r,s){return i(),a("div",null,[...s[0]||(s[0]=[e('<h1 id="linux" tabindex="-1"><a class="header-anchor" href="#linux"><span>linux</span></a></h1><h2 id="目录示例" tabindex="-1"><a class="header-anchor" href="#目录示例"><span>目录示例</span></a></h2><p><img src="'+l+`" alt="linux"></p><h2 id="目录释义" tabindex="-1"><a class="header-anchor" href="#目录释义"><span>目录释义</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"></span>
<span class="line">bin -<span class="token operator">&gt;</span> usr/bin  <span class="token builtin class-name">:</span> 存放普通用户和管理员都能使用的基础命令，比如：ls cp等，这里是软链接，执行usr/bin</span>
<span class="line">dev <span class="token builtin class-name">:</span> 设备文件目录，Linux里所有硬件设备都以文件形式存在这里，比如硬盘、键盘</span>
<span class="line">etc: 存放系统和应用的配置文件，比如网络配置。服务启动脚本都在这里</span>
<span class="line">home: 普通用户的家目录，每个用户登录后会默认进入自己的home子目录</span>
<span class="line">lib -<span class="token operator">&gt;</span> usr/lib</span>
<span class="line">lib64 -<span class="token operator">&gt;</span> usr/lib64: 存放系统和应用依赖的共享库文件，类似windows的.dll文件</span>
<span class="line">lost+found: 文件系统修复时存放恢复文件的目录，一般至于在磁盘出现问题时才会用到</span>
<span class="line">media: 可移动设备的挂载点，比如 U 盘、光盘插入后会自动挂载到这里</span>
<span class="line">mnt: 临时挂载点，手动挂载其他文件系统时常用</span>
<span class="line">opt: 存放第三方软件的目录，比如一些大型商业软件会安装在这里</span>
<span class="line">proc / proc1: 虚拟文件系统，反映当前系统的进程和内核状态，proc1 是额外的实例，可能和容器或多实例环境有关</span>
<span class="line">root: 管理员（root 用户）的家目录</span>
<span class="line">run: 存放系统运行时的临时文件，比如进程 PID 文件、锁文件，重启后会清空</span>
<span class="line">sbin -<span class="token operator">&gt;</span> usr/sbin: 存放管理员专用的系统命令，比如 ifconfig、reboot 等</span>
<span class="line">srv: 存放服务相关的数据，比如网站、FTP 服务的文件</span>
<span class="line">sys: 虚拟文件系统，用于和内核交互，查看和配置硬件设备信息</span>
<span class="line">tmp: 临时文件目录，所有用户都可以读写，系统会定期清理这里的文件</span>
<span class="line">usr: 存放用户相关的应用程序、库文件和文档，是系统中最大的目录之一</span>
<span class="line">var: 存放经常变化的文件，比如日志、缓存、邮件等</span>
<span class="line">data: 自定义数据目录，一般用来存放业务数据或持久化文件</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)])])}const t=n(c,[["render",p]]),o=JSON.parse('{"path":"/linux.html","title":"linux","lang":"zh-CN","frontmatter":{},"git":{"contributors":[{"name":"安晓凯","username":"","email":"xiaokai.an@17zuoye.com","commits":2}],"changelog":[{"hash":"89965a42494d9c8305309898224302d58d966a55","time":1769588316000,"email":"xiaokai.an@17zuoye.com","author":"安晓凯","message":"增加linux"},{"hash":"fc04e79210f4e1d9d1f2c18f9de6fe1ef9d3e5b0","time":1769585249000,"email":"xiaokai.an@17zuoye.com","author":"安晓凯","message":"feat: 添加代码"}]},"filePathRelative":"linux.md"}');export{t as comp,o as data};

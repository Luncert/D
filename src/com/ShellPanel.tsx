import React, { Component } from 'react';
import './ShellCom.css';

const O = `<!DOCTYPE html>
<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-878633-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'UA-878633-1');
    </script>
    <meta charset="gbk" />
    <meta name="robots" content="all" />
    <meta name="author" content="w3school.com.cn" />
    <link rel="stylesheet" type="text/css" href="/c5.css" />
    <link rel="icon" type="image/png" sizes="16x16" href="/ui2019/logo-16-red.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/ui2019/logo-32-red.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/ui2019/logo-48-red.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/ui2019/logo-96-red.png">
    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/ui2019/logo-180.png">
    <title>CSS white-space 属性</title>
</head>

<body class="html" id="cssref">
    <div id="wrapper">
        <div id="header">
            <a id="logo" href="/index.html" title="w3school 在线教程" style="float:left;">w3school 在线教程</a>
            <div id="header_gg">
                <script type="text/javascript">
                    <!--
                    google_ad_client = "pub-3381531532877742";
                    /* 728x90, 鍒涘缓浜?08-12-1 */
                    google_ad_slot = "7423315034";
                    google_ad_width = 728;
                    google_ad_height = 90;
                    //
                    -->
                </script>
                <script type="text/javascript" src="https://pagead2.googlesyndication.com/pagead/show_ads.js">
                </script>
            </div>
        </div>
        <div id="navfirst">
            <ul id="menu">
                <li id="h"><a href="/h.asp" title="HTML 系列教程">HTML 系列教程</a></li>
                <li id="b"><a href="/b.asp" title="浏览器脚本教程">浏览器脚本</a></li>
                <li id="s"><a href="/s.asp" title="服务器脚本教程">服务器脚本</a></li>
                <li id="p"><a href="/p.asp" title="编程教程">编程教程</a></li>
                <li id="x"><a href="/x.asp" title="XML 系列教程">XML 系列教程</a></li>
                <li id="w"><a href="/w.asp" title="建站手册">建站手册</a></li>
                <li id="r"><a href="/r.asp" title="参考手册">参考手册</a></li>
            </ul>
        </div>
        <div id="navsecond">
            <div id="course">
                <h2>CSS 参考手册</h2>
                <ul>
                    <li><a href="/cssref/index.asp" title="CSS 参考手册">CSS 参考手册</a></li>
                    <li><a href="/cssref/css_selectors.asp" title="CSS 选择器参考手册">CSS 选择器</a></li>
                    <li><a href="/cssref/css_ref_aural.asp" title="CSS 听觉参考手册">CSS 听觉参考手册</a></li>
                    <li><a href="/cssref/css_websafe_fonts.asp" title="CSS 网络安全字体组合">CSS 网络安全字体</a></li>
                    <li><a href="/cssref/css_units.asp" title="CSS 单位">CSS 单位</a></li>
                    <li><a href="/cssref/css_colors.asp" title="CSS 颜色">CSS 颜色</a></li>
                    <li><a href="/cssref/css_colors_legal.asp" title="CSS 合法颜色值">CSS 颜色值</a></li>
                    <li><a href="/cssref/css_colornames.asp" title="CSS 颜色名">CSS 颜色名</a></li>
                    <li><a href="/cssref/css_colorsfull.asp" title="CSS 颜色十六进制值">CSS 颜色十六进制</a></li>
                </ul>
            </div>
        </div>
        <div id="maincontent">
            <h1>CSS white-space 属性</h1>
            <div class="backtoreference">
                <p><a href="/cssref/index.asp" title="CSS 参考手册">CSS 参考手册</a></p>
            </div>
            <div>
                <h2>实例</h2>
                <p>规定段落中的文本不进行换行：</p>
                <pre>
p
  {
  <code>white-space: nowrap</code>
  }
</pre>
                <p class="tiy"><a target="_blank" href="/tiy/t.asp?f=csse_text_white-space">亲自试一试</a></p>
            </div>
            <div>
                <h2>浏览器支持</h2>

                <table class="dataintable browsersupport">
                    <tr>
                        <th>IE</th>
                        <th>Firefox</th>
                        <th>Chrome</th>
                        <th>Safari</th>
                        <th>Opera</th>
                    </tr>
                    <tr>
                        <td class="bsIE"></td>
                        <td class="bsFirefox"></td>
                        <td class="bsChrome"></td>
                        <td class="bsSafari"></td>
                        <td class="bsOpera"></td>
                    </tr>
                </table>

                <p>所有浏览器都支持 white-space 属性。</p>

                <p class="note"><span>注释：</span>任何的版本的 Internet Explorer （包括 IE8）都不支持属性值 &quot;inherit&quot;。</p>
            </div>


            <div>
                <h2>定义和用法</h2>

                <p>white-space 属性设置如何处理元素内的空白。</p>

                <p>这个属性声明建立布局过程中如何处理元素中的空白符。值 pre-wrap 和 pre-line 是 curl: (23) Failed writing body (4096 != 6891)
`

interface Props {
    className?: string
    bgColor?: string
}

// TODO: click to copy the content
class Tag extends Component<Props> {

    render() {
        let className = 'tag'
        let bgColor = this.props.bgColor || 'rgb(12, 207, 175)'
        if (this.props.className) {
            className += ' ' + this.props.className
        }
        return (
            <span className={className} style={{backgroundColor: bgColor}}>
                {this.props.children}
                <span className='tag-tail' style={{borderLeftColor: bgColor}}></span>
            </span>
        )
    }
}

const CMD_STATUS = {
    Success: 0,
    Failed: 1,
}

const STATUS_COLOR = [
    'rgb(16, 228, 97)',
    'rgb(228, 16, 16)',
]

interface History {
    username: string
    hostname: string
    workpath: string
    command: string
    output: string
    status: number
}

export default class ShellPanel extends Component<any, any> {
    private history: History[]
    private username: string = ''
    private hostname: string = ''
    private workpath: string = ''

    constructor(props: any) {
        super(props)
        this.history = []
        this.username = 'root'
        this.hostname = 'ASxjoIJSAD'
        this.workpath = '/home/root/.bin/'
    }

    onInput(evt: React.KeyboardEvent) {
        let keyCode = evt.keyCode
        if (keyCode === 13) {
            let cmdInput = (this.refs.cmdInput as HTMLDivElement)
            this.history.push({
                username: this.username,
                hostname: this.hostname,
                workpath: this.workpath,
                command: cmdInput.innerHTML,
                status: CMD_STATUS.Success,
                output: O
            })
            this.forceUpdate()

            evt.stopPropagation()
            evt.preventDefault()
        } else if (keyCode === 9) {
            // handle TAB
            console.log('TAB')
            
            evt.stopPropagation()
            evt.preventDefault()
        }
    }

    focusInput() {
        (this.refs.cmdInput as HTMLDivElement).focus()
    }

    componentDidMount() {
        this.focusInput()
    }

    componentDidUpdate() {
        this.focusInput()
    }

    render() {
        return (
            <div className='container scroller'>
                {
                    this.history.map((item, idx) =>
                        <div key={idx} className='section'>
                            <div style={{borderBottom: '1px solid ' + STATUS_COLOR[item.status]}}>
                                <Tag bgColor='blue'>{item.username}</Tag>
                                <Tag>{item.hostname}</Tag>
                                <Tag bgColor='red'>{item.workpath}</Tag>
                                <div className='cmd-input'>{item.command}</div>
                            </div>
                            <div className='cmd-output'>{item.output}</div>
                        </div>
                    )
                }
                <div key={this.history.length + 1} className='section'
                    onClick={this.focusInput.bind(this)}>
                    <div>
                        <Tag bgColor='blue'>{this.username}</Tag>
                        <Tag>{this.hostname}</Tag>
                        <Tag bgColor='red'>{this.workpath}</Tag>
                        <div ref='cmdInput' className='cmd-input'
                            contentEditable={true}
                            onKeyDown={this.onInput.bind(this)}></div>
                    </div>
                </div>
            </div>
        )
    }
}
// TODO: 在container上监听键盘事件，而不是最后一个section
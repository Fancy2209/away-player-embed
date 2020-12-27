var AWAYFL=function(e){"use strict";const t="DecompressionStream"in self,s=e=>new DataView(e.buffer).getUint32(4,!0);function r(e="",r=(e=>e)){let i,n=0;return fetch(e).then((e=>(n=+e.headers.get("Content-Length"),i=e.body.getReader(),i.read()))).then((e=>{const o=e.value;console.debug("[Loader] Header:",String.fromCharCode.apply(null,o.slice(0,3).reverse()));let a,h,l=0;if(t&&(67===(c=o)[0]&&87===c[1]&&83===c[2])){const e=s(o),r=o.slice(0,8);r[0]=70,console.debug("[Loader] SWC size:",s(o)),h=function(e,s=8){if(!t)throw"Your browser not support DecompressionStream =(";const r=new self.DecompressionStream("deflate"),i=r.writable.getWriter(),n=r.readable.getReader(),o=new Uint8Array(e);let a,h=!1,l=!1;function c(){n.read().then((function t(r){const i=r.done,h=r.value;return h&&(o.set(h,s),s+=h.length),i||s>=e?(l=!0,a&&a(),void console.debug("[Loader] Decoder closed:",s)):n.read().then(t)}))}return{get buffer(){return o},write(e){i.ready.then((()=>{i.write(e),h||(h=!0,c())}))},readAll:()=>l?Promise.resolve(o):new Promise((e=>{a=()=>{e(o)}}))}}(e,8),a=h.buffer,a.set(r),h.write(o.slice(8))}else a=new Uint8Array(n),a.set(o);var c;return l+=o.length,i.read().then((function e(t){const s=t.done,o=t.value;return r&&r(l/n),s?h?h.readAll():a:(h?h.write(o):a.set(o,l),l+=o.length,i.read().then(e))}))}))}function i(e,s=(e=>e)){const i=e.path.indexOf(".js")>-1;if(!i&&t)return r(e.path,s).then((t=>Object.assign(e,{data:t.buffer,type:"swf"})));const o=new XMLHttpRequest;return o.addEventListener("progress",(t=>{const r=t.total||+o.getResponseHeader("content-length")||e.size||0;r?(console.log("XHR",t.loaded,r),s(Math.min(1,t.loaded/r))):s(1)})),o.open("GET",e.path,!0),o.responseType=i?"text":"arraybuffer",new Promise(((t,r)=>{o.addEventListener("error",r),o.addEventListener("load",(()=>{if(s(1),i){const e=new Blob([o.response],{type:"text/javascript"});n(URL.createObjectURL(e)).then((()=>t(void 0)))}else t({meta:e.meta||{},name:e.name,path:e.path,resourceType:e.resourceType,data:o.response,type:i?"js":"swf"})})),o.send()}))}function n(e,t){const s=document.querySelector("head"),r=document.createElement("script");return new Promise(((i,n)=>{Object.assign(r,{type:"text/javascript",async:!0,src:"string"==typeof e?e:e.path,onload:()=>{t&&t(1),i(r)},onerror:n}),s.appendChild(r)}))}class o{constructor(e,t,s=1){this.callback=e,this.weight=s,this.id=o.ID++,this.value=0,this._childs=[],this._report=this._report.bind(this),this.childs=t}set childs(e){for(let e of this._childs)e.callback===this._report&&(e.callback=null);if(this._childs.length=0,e){for(let t of e){if(t===this)throw"Reporter loop";t.callback=this._report}this._childs=e.slice()}}get childs(){return this._childs}_report(e){if(0===this._childs.length)this.value=e*this.weight;else{let e=0,t=0;this._childs.forEach((s=>{e+=s.weight||1,t+=s.value||0})),this.value=t/e}this.callback&&this.callback(this.value)}get report(){return this._report}}o.ID=0;class a{constructor(e){this.config=e}run(e,t,s=(e=>{}),r=!1){const a=e.length,h=t.length,l=e.concat(t),c=Array.from({length:a+h},(()=>new o));let d;return this.progress=new o(s,c),r?(d=t.map(((e,t)=>i(e,c[t].report))),d=d.concat(e.map(((e,t)=>n(e,c[t+h].report))))):d=l.map(((e,t)=>i(e,c[t].report))),Promise.all(d).then((e=>e.filter((e=>e&&"swf"===e.type))))}}const h=(e,t)=>"string"!=typeof e?+e:e.includes("%")?parseFloat(e)/100*t:parseFloat(e);class l{constructor(e=document,t){this.root=e,this.config=t,this.onUpdate=this.onUpdate.bind(this),this.onProgress=this.onProgress.bind(this),window.addEventListener("resize",this.onUpdate)}build(){this.splash=this.root.querySelector("#splash__image"),this.prRoot=this.root.querySelector("#progress__root"),this.prLine=this.root.querySelector("#progress__line")}init(){this.build();const e=this.config;Object.assign(this.splash.style,{backgroundImage:`url(${e.splash})`,visibility:"visible"});const t=e.progress;t.rect=t.rect||[.1,.9,.8,.01],Object.assign(this.prRoot.style,{background:t.back,left:100*t.rect[0]+"%",top:100*t.rect[1]+"%",width:100*t.rect[2]+"%",height:100*t.rect[3]+"%"}),Object.assign(this.prRoot.style,{background:t.line}),this.onUpdate()}onProgress(e){switch(this.config.progress.direction){case"tb":Object.assign(this.prLine.style,{height:100*e+"%",width:"100%"});break;case"lr":default:Object.assign(this.prLine.style,{height:"100%",width:100*e+"%"})}}onUpdate(){if(!this.splash)return;const e=this.config;let t=h(e.x,window.innerWidth)||0,s=h(e.y,window.innerHeight)||0,r=h(e.w,window.innerWidth)||window.innerWidth,i=h(e.h,window.innerHeight)||window.innerHeight;const n=Math.min(i/e.height,r/e.width),o=Math.ceil(e.width*n),a=Math.ceil(e.height*n),l=t+(r-o)/2,c=s+(i-a)/2;Object.assign(this.splash.style,{width:`${o}px`,height:`${a}px`,left:`${l}px`,top:`${c}px`})}ready(){this.config.start&&(this.splash.style.background=`url(${this.config.start})`),Object.assign(this.prRoot.style,{visibility:"hidden",opacity:0})}hide(e=!1){Object.assign(this.prRoot.style,{visibility:"hidden",opacity:0}),Object.assign(this.splash.style,{visibility:"hidden",opacity:0});const t=new Promise((e=>setTimeout(e,500)));return e?t.then((()=>this.dispose())):t}dispose(){window.removeEventListener("resize",this.onUpdate),this.splash.remove(),this.prRoot.remove(),this.splash=null}}class c{constructor(e,t){this.loader=e,this.config=t}runGame(e=(e=>e)){const t=this.config,s=t.binary=(Array.isArray(t.binary)?t.binary:[t.binary]).map((e=>"string"==typeof e?{path:e}:e)),r=t.runtime=(Array.isArray(t.runtime)?t.runtime:[t.runtime]).map((e=>"string"==typeof e?{path:e,type:"js"}:e)),i=new o(null,null,4),n=new o((e=>{console.log("AVM Load",e)}),null,t.progressParserWeigth?t.progressParserWeigth:.001);return this.progress=new o(e,[i,n]),Object.assign(window,{updatePokiProgressBar:n.report}),this.loader.run(r,s,i.report,t.debug).then((e=>(t.files=e,t)))}}let d,p,g;const u={init(e){p=new a(e),d=new c(p,e),g=new l(document,e),g.init(),window.setStageDimensions=function(t,s,r,i){e.x=t,e.y=s,e.w=r,e.h=i,window.AVMPlayerPoki&&window.AVMPlayerPoki.setStageDimensions(t,s,r,i),g.onUpdate()}},runGame(e=(e=>e),t=((e,t)=>0)){const s=d.config,r=e=>{if(s.start){g.ready();const t=t=>{if(g.hide(!0),!e)throw"PokiPlayer did not send a callback for starting game";e()};window.addEventListener("click",t,{once:!0})}else g.hide(!0)};return Object.assign(window,{pokiGameParseComplete:r}),d.runGame((t=>{console.log("progress:",t),g.onProgress(t),e(t)})).then((e=>{t(e,r)}))}};return e.LegacyLoader=u,e.Loader=a,e.ProgressUI=l,e.Reporter=o,e.Runner=c,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
//# sourceMappingURL=loader.js.map

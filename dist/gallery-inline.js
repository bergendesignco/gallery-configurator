var qa=Object.defineProperty;var te=(t,e)=>()=>(t&&(e=t(t=0)),e);var Co=(t,e)=>{for(var r in e)qa(t,r,{get:e[r],enumerable:!0})};function Ao(t,e){if(t===void 0)return null;let r=new Map([...t.matchAll(Ra)].map(o=>[o[1].toLowerCase(),o[2]??o[3]??o[4]??""]));if(!r.has("data-gallery-layout"))return null;if(r.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let i;try{i=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(i?.v!==1||typeof i.selector!="string"||!["list","gallery","summary"].includes(i.type)||!i.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return i}function Fa(t,e,r=!1){let i=[...e.matchAll(Mo)];if(i.length!==1||i[0][0]!==e.trim())throw Error("Invalid gallery settings.");let o=Ao(i[0][1],i[0][2]);if(!o)throw Error("Missing gallery settings.");let a=!1,s=t.replace(Mo,(c,n,u)=>{let m=Ao(n,u);return!m||m.selector!==o.selector?c:r||a?"":(a=!0,e)});return r||a?s:s+(s&&!s.endsWith(`
`)?`
`:"")+e+`
`}function Eo(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,r=e?.collection?.id,i=e?.website?.id,o=t.document.cookie.split(";").map(a=>a.trim()).find(a=>a.startsWith("crumb="))?.slice(6);if(!Et.test(r||"")||!Et.test(i||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!o)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:r,websiteId:i,crumb:decodeURIComponent(o)}}async function Po({snippet:t,context:e,remove:r=!1,fetchImpl:i=fetch,onBackup:o=()=>{}}){let{collectionId:a,websiteId:s,crumb:c}=e;if(!Et.test(a||"")||!Et.test(s||"")||!c)throw Error("A signed-in Squarespace page is required.");async function n(){let v=await i("/api/commondata/GetCollectionSettings?collectionId="+a,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!v.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let S=await v.json(),h=S.collectionData??S;if(h?.id!==a||h.websiteId!==s||h.deleted===!0||h.folder===!0||h.dropdown===!0)throw Error("Page settings do not match this page.");if(h.headerInjectCode!=null&&typeof h.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:h,memberAreaData:S.memberAreaData??{}}}let u=await n();if(u.model.passwordProtected&&typeof u.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let m=u.model.headerInjectCode??"",f=Fa(m,t,r);if(f===m)return{unchanged:!0};o({collectionId:a,header:m,savedAt:new Date().toISOString()});let x=await n();if(JSON.stringify(x)!==JSON.stringify(u))throw Error("Page settings changed while saving. Review the page and save again.");let y;try{y=await i("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...x.model,collectionId:a,headerInjectCode:f},memberAreaData:x.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!y.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await n()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==f.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var Et,Mo,Ra,Lo=te(()=>{Et=/^[a-f0-9]{24}$/i,Mo=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Ra=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function zo(t){let e=document.createElement("template");return e.innerHTML=t,e.content}function ft(t,e){return t&&URL.canParse(t,e)?new URL(t,e).href:null}function Ba(t,e){let r=t.querySelector(".sqs-gallery-container"),i=Array.from(t.querySelectorAll(".slide"),o=>{let a=o.querySelector("img[data-src], img[data-image], img[src]"),s=o.querySelector(".image-slide-anchor, a[href]");return{type:o.dataset.type||null,imageUrl:ft(a?.dataset.src||a?.dataset.image||a?.getAttribute("src"),e),imageId:a?.dataset.imageId??null,dimensions:a?.dataset.imageDimensions??null,focalPoint:a?.dataset.imageFocalPoint??null,alt:a?.getAttribute("alt")??null,title:s?.dataset.title??o.querySelector(".meta-title")?.textContent??null,descriptionHtml:s?.dataset.description??o.querySelector(".meta-description")?.innerHTML??null,href:ft(s?.getAttribute("href"),e),lightbox:!!s?.classList.contains("js-gallery-lightbox-opener"),html:o.outerHTML}});return{layout:r?.dataset.design??null,settings:{...r?.dataset},slides:i}}function Da(t,e){return Array.from(zo(t).querySelectorAll(".sqs-block"),r=>{let i=r.dataset.sqspBlock||[...r.classList].find(a=>a.startsWith("sqs-block-")&&a!=="sqs-block-website-component")?.slice(10),o={id:r.id||null,type:i||null,typeId:r.dataset.blockType??null,html:r.outerHTML};return(i==="gallery"||r.matches(".gallery-block, .sqs-block-gallery"))&&(o.gallery=Ba(r,e)),o})}async function Wa(t,e){let r=await fetch(t,{mode:"same-origin",signal:e});if(!r.ok)return null;let i=await r.text(),o=zo(i.split(/<\/head\s*>/i,1)[0]),a=Array.from(o.querySelectorAll("meta[content]"),s=>({name:s.getAttribute("property")||s.getAttribute("name")||s.getAttribute("itemprop"),content:s.getAttribute("content")})).filter(s=>s.name);return{title:o.querySelector("title")?.textContent??null,description:a.find(s=>s.name.toLowerCase()==="description")?.content??null,canonicalUrl:ft(o.querySelector('link[rel~="canonical"]')?.getAttribute("href"),r.url),meta:a}}async function Pt(t,{signal:e,includeSeo:r=!0}={}){if(!t)throw new Error("A linked post URL is required.");let i=new URL(t,location.href);if(i.origin!==location.origin)throw new Error("The linked post must be on this site.");i.hash="",i.searchParams.delete("format");let o=new URL(i);o.searchParams.set("format","json");let a=await fetch(o,{mode:"same-origin",signal:e});if(!a.ok)throw new Error("Could not load post JSON ("+a.status+").");let{item:s}=await a.json();if(!s?.id||typeof s.body!="string")throw new Error("This URL did not return a post body.");let c=ft(s.fullUrl,a.url)||i.href,n=null;try{r&&(n=await Wa(i,e))}catch(u){if(e?.aborted)throw u}return{id:s.id,url:c,title:s.title??null,excerptHtml:s.excerpt??null,publishedAt:s.publishOn??null,createdAt:s.addedOn??null,updatedAt:s.updatedOn??null,author:s.author??null,authorId:s.authorId??null,location:s.location??null,tags:s.tags??[],categories:s.categories??[],featuredImageUrl:ft(s.assetUrl,c),seo:{item:s.seoData??null,page:n},bodyHtml:s.body,blocks:Da(s.body,c),rawItem:s}}var Vt=te(()=>{});function To(t,e,{range:r,select:i,swatch:o},a){let s=(h,p)=>({key:h,label:p,type:"checkbox"}),c=(h,p,b,P,L="px",A=1)=>r(h,p,b,P,A,L),n=(h,p,b)=>b.map(P=>({...P,when:[h,p]})),u=(h,...p)=>({title:h,fields:p.flat()}),m=h=>a.flatMap(p=>p.fields).find(p=>p.key===h),f=e!=="gallery",x={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(h,p)=>[100*(p+1),String(100*(p+1))]))},y={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function d(h,p,b,P,L,A){return{...u(h,c(b,"Size",0,4,"rem",.05),i(P,"Weight",x),o(L,"Color"),i(A,"Alignment",y)),typography:p}}function v(h,p,b,P){return[s(h,p),...n(h,!0,[c(b+"Angle","Angle",0,360,"\xB0"),c(b+"Distance","Distance",0,48),c(b+"Blur","Blur",0,40),c(b+"Spread","Spread",0,16),o(P,"Color")])]}let S=(h,p)=>({...m(p),key:h,label:"Mobile "+m(p).label.toLowerCase(),inherits:p});return[u("Elements",s("showImage","Show image"),s("showTitles","Show title"),...f?[s("showDescription","Show description"),s("showButton","Show button")]:[],s("showControls","Show controls")),u("Main carousel",...f?[i("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...n("heightMode","pixels",[c("stageHeight","Height",120,1600)]),...n("heightMode","viewport",[c("viewportHeight","Window height",15,100,"%")])]:[],c("carouselPadding","Carousel padding",0,64),m("spiralWidth"),s("surfaceEnabled","Background"),...n("surfaceEnabled",!0,[o("surfaceColor","Color"),c("surfaceRadius","Corner radius",0,64)]),i("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),m("edgeFade"),m("spiralGap"),s("autoplay","Autoplay"),...n("autoplay",!0,[i("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),i("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...c("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:h=>h.playbackMode==="continuous"},{...c("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:h=>h.playbackMode==="step"}),u("Spiral",m("spiralRiseUnit"),{...m("spiralRise"),label:"Rise"},i("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),m("showSlots")),u("Image",i("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(h=>[h,h==="original"?"Original":h==="circle"?"Circle":h]))),i("fit","Image sizing",{cover:"Fill",contain:"Fit"}),c("imageWidth","Image width",20,100,"%"),i("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),m("imagePadding"),s("imageBorder","Image border"),...n("imageBorder",!0,[o("imageBorderColor","Color"),c("imageBorderSize","Thickness",0,12),c("imageRadius","Corner radius",0,64)]),v("shadowEnabled","Image shadow","shadow","shadowColor"),s("overlayEnabled","Overlay"),...n("overlayEnabled",!0,[o("imageTint","Color")])),d("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...f?[d("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],u("Card",m("cardWidth"),i("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),i("cardOrder","Element order",{media:"Media first",content:"Content first"}),c("cardPadding","Card padding",0,80),c("mediaGap","Space between image and text",0,80),c("titleGap","Space below title",0,80),...f?[c("buttonGap","Space above button",0,80)]:[],i("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),s("cardBackground","Background"),...n("cardBackground",!0,[o("cardColor","Color")]),s("cardBorderEnabled","Card border"),...n("cardBorderEnabled",!0,[o("spiralRim","Color"),m("borderWidth")]),m("spiralRadius"),v("cardShadow","Card shadow","cardShadow","cardShadowColor"),m("backFace"),m("backColor"),...n("backFace","mirror",[s("mirrorOverlay","Mirrored image overlay")]),{...o("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:h=>h.backFace==="mirror"}),u("Interaction",s("pauseOnHover","Pause on hover"),m("hoverEffect"),m("hoverAmount"),c("hoverDuration","Hover duration",0,1e3,"ms",10),i("clickAction","Card click",{source:f?"Button only":"Image link only",link:f?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),m("reducedMotion")),u("Control styling",m("controlSize"),c("controlIconSize","Icon size",0,60),c("controlPadding","Button padding",0,32),m("controlShape"),m("arrowStyle"),s("controlBackground","Button background"),m("controlPalette"),m("controlInk"),m("controlFill")),u("Mobile",s("mobileSizing","Customize mobile sizing"),S("mobileCardWidth","cardWidth"),S("mobileGap","spiralGap"),{...c("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...c("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},S("mobileSpiralWidth","spiralWidth"),...f?[i("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...c("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),u("Theme",i("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...n("colorSource","custom",[o("background","Background"),o("ink","Text"),o("accent","Accent")]),i("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),a.find(h=>h.title==="Popup")]}var jo,Io,Lt=te(()=>{jo={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},Io=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function qo({range:t,swatch:e,select:r}){let i=(o,a)=>({key:o,label:a,type:"checkbox"});return[{title:"Card content",fields:[i("showImage","Show image"),i("showTitles","Show title"),i("showDescription","Show description"),i("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),i("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),i("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(o=>({...o,when:["shadowEnabled",!0]})),r("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[i("popupImage","Show popup image"),i("popupTitle","Show popup title"),i("popupDescription","Show popup description"),i("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),i("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Zt(t,e){if(!Jt.has(e.preset))return e;let r={...e},i=getComputedStyle(t),o;for(let a of jt){let s=e[a+"Swatch"],c=e[a];if(Object.hasOwn(Kt,s)){let u=i.getPropertyValue("--"+s+"-hsl").trim();u&&(o??=document.createElement("canvas").getContext("2d"),o&&(o.fillStyle=c,o.fillStyle="hsl("+u+")",c=o.fillStyle))}let n=Math.round((e[a+"Opacity"]??100)*2.55);r[a]=n===255?c:c+n.toString(16).padStart(2,"0")}return r}var Jt,Kt,jt,zt,Qt=te(()=>{Lt();Jt=new Set(["spiral"]),Kt={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},jt=[...Io,"titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],zt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of jt)zt[t+"Swatch"]="custom",zt[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function It(t){let e=document.createElement("template");return e.innerHTML=t??"",e.content}function it(t,e){if(e||=location.href,!t||!URL.canParse(t,e))return null;let r=new URL(t,e);return["http:","https:"].includes(r.protocol)?r.href:null}function Bo(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let r=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches(Oa))return r;let i=t.localName==="h1"?"h2":t.localName,o;if(i==="img"){if(o=it(t.dataset.src||t.dataset.image||t.getAttribute("src"),e),!o)return r}else i==="a"&&(o=it(t.getAttribute("href"),e));let a=Na.has(i)&&(i!=="a"||o)?document.createElement(i):r;i==="a"&&o?(a.href=o,a.rel="noopener noreferrer"):i==="img"&&(a.src=o,a.alt=t.alt,a.loading="lazy");for(let s of t.childNodes)a.append(Bo(s,e));return a}function Tt(t,e){let r=document.createDocumentFragment();for(let i of t.childNodes)r.append(Bo(i,e));return r}function to(t){return t.textContent.replace(/\s+/g," ").trim()}function eo(t,e){let r=to(e);if(!r&&!e.querySelector("img")||r&&to(t)===r)return;let i=document.createElement("div");i.append(e),t.append(i)}function Ro(t,e){let r=Array.isArray(e)?[...new Set(e.filter(i=>typeof i=="string").map(i=>i.trim()).filter(Boolean))]:[];t.replaceChildren(...r.map(i=>{let o=document.createElement("li");return o.textContent=i,o})),t.hidden=!r.length}function Fo(t,e,r){let i=(t?.blocks??[]).flatMap(a=>a.gallery?.slides??[]).flatMap(a=>{let s=it(a.imageUrl,r);return s?[{src:s,alt:a.alt?.trim()||a.title?.trim()||"",caption:a.title?.trim()||"",description:a.descriptionHtml||""}]:[]});if(i.length)return i;let o=it(t?.featuredImageUrl,r)||it(e.src,r);return o?[{src:o,alt:e.alt||"",caption:"",description:""}]:[]}function Do(t,e,r){let i=document.createElement("dialog");i.className="gc-post-dialog",i.dataset.desktopLayout=e.popupDesktopLayout==="drawer"?"drawer":"split",i.dataset.reducedMotion=String(!!e.reducedMotion),e.popupPadding>0&&i.style.setProperty("--post-padding",e.popupPadding+"px"),e.popupRadius!=null&&i.style.setProperty("--post-radius",e.popupRadius+"px"),e.popupCustom&&e.popupColor&&e.popupInk&&(i.style.setProperty("--post-surface",e.popupColor),i.style.setProperty("--post-ink",e.popupInk),i.style.setProperty("--post-body",e.popupInk)),i.innerHTML=`
    <div class="gc-post-toolbar"><button type="button" class="gc-post-icon gc-post-close" aria-label="Close project" autofocus>${Ua}</button></div>
    <div class="gc-post-layout">
      <div class="gc-post-copy">
        <h2 class="gc-post-title"></h2>
        <div class="gc-post-reading"></div>
        <ul class="gc-post-pills gc-post-categories" aria-label="Project categories" hidden></ul>
        <ul class="gc-post-pills gc-post-tags" aria-label="Project tags" hidden></ul>
        <p class="gc-post-status" role="status">Loading project\u2026</p>
        <a class="gc-post-link">View full project</a>
      </div>
      <section class="gc-post-gallery" aria-label="Project images" hidden>
        <figure class="gc-post-figure">
          <div class="gc-post-image-well"><img class="gc-post-image" alt="" draggable="false"></div>
          <figcaption class="gc-post-image-description" hidden></figcaption>
        </figure>
        <div class="gc-post-photo-nav" hidden>
          <div class="gc-post-photo-label" aria-live="polite" aria-atomic="true">
            <strong class="gc-post-image-label"></strong>
            <span class="gc-post-counter"></span>
          </div>
          <div class="gc-post-step-buttons">
            <button type="button" class="gc-post-icon" data-post-prev aria-label="Previous image">${$a}</button>
            <button type="button" class="gc-post-icon" data-post-next aria-label="Next image">${Ga}</button>
          </div>
        </div>
        <div class="gc-post-thumbs" role="group" aria-label="Select a project image" hidden></div>
      </section>
    </div>`;let o=R=>i.querySelector(R),a=o(".gc-post-close"),s=o(".gc-post-title"),c=o(".gc-post-reading"),n=o(".gc-post-categories"),u=o(".gc-post-tags"),m=o(".gc-post-status"),f=o(".gc-post-link"),x=o(".gc-post-gallery"),y=o(".gc-post-layout"),d=o(".gc-post-image-well"),v=o(".gc-post-image"),S=o(".gc-post-image-description"),h=o(".gc-post-photo-nav"),p=o(".gc-post-image-label"),b=o(".gc-post-counter"),P=o(".gc-post-thumbs"),L=new AbortController,A=matchMedia("(max-width: 680px)"),C=[],w=0,D=null,W=it(t.postUrl,location.href);function M(){A.matches?y.prepend(x):y.append(x)}M(),A.addEventListener("change",M);function I(R){if(!C.length)return;w=(R+C.length)%C.length;let H=C[w];v.src=H.src,v.alt=H.alt,p.textContent=H.caption,p.hidden=!H.caption,b.textContent=w+1+" / "+C.length,S.replaceChildren(Tt(It(H.description),W)),S.hidden=!to(S);for(let[z,G]of Array.from(P.children).entries())z===w?G.setAttribute("aria-current","true"):G.removeAttribute("aria-current");let re=P.children[w];if(re&&P.clientWidth){let{left:z,right:G}=re.getBoundingClientRect(),O=P.getBoundingClientRect();z<O.left&&(P.scrollLeft+=z-O.left),G>O.right&&(P.scrollLeft+=G-O.right)}}function B(R){C=e.popupImage===!1?[]:R,x.hidden=!C.length,h.hidden=C.length<2,P.hidden=C.length<2,P.replaceChildren(...C.length>1?C.map((H,re)=>{let z=document.createElement("button"),G=document.createElement("img");return z.type="button",z.setAttribute("aria-label","Show image "+(re+1)+(H.caption?" \u2013 "+H.caption:"")),G.src=H.src,G.alt="",G.loading="lazy",z.append(G),z.addEventListener("click",()=>I(re)),z}):[]),i.toggleAttribute("data-without-gallery",!C.length),I(0)}function U(R,H){s.textContent=R||"",s.hidden=e.popupTitle===!1||!R,i.setAttribute("aria-label",R||"Project details"),f.hidden=e.popupButton===!1||!H,H&&(f.href=H)}function X(R){if(W=it(R.url,W)||W,U(R.title||t.title,W),c.replaceChildren(),e.popupDescription!==!1){for(let H of R.blocks??[]){if(!Ha.has(H.type))continue;let re=It(H.html),z=re.querySelector(".sqs-html-content,.sqs-block-content")||re;eo(c,Tt(z,W))}c.childElementCount||eo(c,Tt(It(R.excerptHtml||t.description),W))}Ro(n,R.categories),Ro(u,R.tags),B(Fo(R,t,W)),m.hidden=!0}return a.addEventListener("click",r),o("[data-post-prev]").addEventListener("click",()=>I(w-1)),o("[data-post-next]").addEventListener("click",()=>I(w+1)),i.addEventListener("keydown",R=>{C.length<2||R.altKey||R.metaKey||R.ctrlKey||["ArrowLeft","ArrowRight"].includes(R.key)&&(R.preventDefault(),I(w+(R.key==="ArrowLeft"?-1:1)))}),d.addEventListener("pointerdown",R=>{C.length<2||!R.isPrimary||R.pointerType==="mouse"||(D={id:R.pointerId,x:R.clientX,y:R.clientY},d.setPointerCapture(R.pointerId))}),d.addEventListener("pointercancel",()=>{D=null}),d.addEventListener("pointerup",R=>{if(D?.id!==R.pointerId)return;let H=R.clientX-D.x,re=R.clientY-D.y;D=null,Math.abs(H)>35&&Math.abs(H)>Math.abs(re)*1.2&&I(w+(H<0?1:-1))}),U(t.title,W),e.popupDescription!==!1&&eo(c,Tt(It(t.description),W)),B(Fo(null,t,W)),{dialog:i,async load(){try{let R=await Pt(W,{signal:L.signal,includeSeo:!1});L.signal.aborted||X(R)}catch{if(L.signal.aborted)return;m.textContent="The project details couldn\u2019t load."}},destroy(){L.abort(),A.removeEventListener("change",M)}}}var Na,Ha,Oa,$a,Ga,Ua,Wo=te(()=>{Vt();Na=new Set("p h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" ")),Ha=new Set(["html","text","markdown","image"]),Oa="script,style,template,noscript,iframe,form,svg,object,embed,video,audio,button",$a='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-14 0 6 6m-6-6 6-6"/></svg>',Ga='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',Ua='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'});function oo(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],r=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${_a[t]}${r}</svg>`}function Xe(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?oo("play")+oo("pause"):oo(e),t}var _a,qt=te(()=>{_a={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function qe(t,e,r){let i=document.createElement(t);return i.className=e,r!==void 0&&(i.textContent=r),i}function dt(t,e,r){let i=qe("button",t,r);return i.type="button",i.setAttribute("aria-label",e),i}function Ya(t,e,r,i,o,a){let s=r/2,c=i/2,n=.26,u=e/2+48,m=(r*Math.cos(n)+a)/(2*Math.sin(n)),f=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-o)*.7),r*(3.8-o*2.1),c+Math.max(m,u/Math.sin(Math.PI/3))),x=f-c,y=Math.atan2(s,x),d=Math.hypot(s,x),v=2*(y+Math.asin(a/(2*d))),S=y+Math.asin(u/d),h=f+c,p=Math.hypot(h,s)-h,b=x-Math.sqrt((x-u)*(x+u));return{radius:f,step:v,reach:S/v,above:p,below:b}}function Va(t,e,r){let i=e/2,o=10+r*9,a=0,s=0;for(let c=0;c<4.1;c+=.5){let n=Math.min(4.1,c+.5),u=Math.max(.48,1-c*(.09+r*.035)),m=(n*(4+r*7)+(c===0?4:0))*Math.PI/180,f=u*(i+t/2*Math.sin(m))-i;a=Math.max(a,f-Math.min(c,4)*o),s=Math.max(s,f+Math.min(n,4)*o)}return{above:a,below:s}}function No({host:t,items:e=[],initialIndex:r=0,options:i={},makeCard:o,onChange:a,nativeList:s,loadImage:c}){let n=Xa.has(i.preset)?i.preset:"infinite",u=n==="arc"||n==="arc-tabs",m=u||n==="showcase",f=e.length,x=!!i.reducedMotion,y=Ne(rt(i.depth,55),0,100)/100,d,v,S;function h(l){d=Ne(rt(l.gap,24),0,180),v=Ne(rt(l.cardWidth,n==="timed"?760:380),80,1800),S=l.phoneWidthOverride}h(i);let p=Ne(rt(i.duration,5),1,60)*1e3,b=qe("section",`gc-carousel gc-preset-${n}`);b.setAttribute("aria-roledescription","carousel"),b.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[n]),b.style.setProperty("--gc-card-radius",`${Ne(rt(i.radius,14),0,120)}px`),b.style.setProperty("--gc-stage-height",`${Ne(rt(i.stageHeight,0),0,1400)}px`),x&&b.classList.add("gc-reduced-motion");let P=[],L=(l,g,k,E)=>{l.addEventListener(g,k,E),P.push(()=>l.removeEventListener(g,k,E))},A=[],C=[],w=i.navigation==="dots"||i.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),D=n==="arc-tabs"||n==="timed"&&!w,W=qe("nav","gc-carousel-tabs");w&&W.classList.add("gc-choice-dots"),W.setAttribute("aria-label","Choose a slide"),D&&(e.forEach((l,g)=>{let E=(typeof l.title=="string"?l.title.trim():"")||`Slide ${g+1}`,N=w?dt("gc-choice-dot",E):dt("gc-carousel-tab",E,E);L(N,"click",()=>Te(g)),L(N,"keydown",q=>{let j;q.key==="ArrowRight"&&(j=at(g+1,f)),q.key==="ArrowLeft"&&(j=at(g-1,f)),q.key==="Home"&&(j=0),q.key==="End"&&(j=f-1),j!==void 0&&(q.preventDefault(),Te(j),A[j]?.focus({preventScroll:!0}))}),W.append(N),A.push(N)}),b.append(W));let M=qe("div","gc-carousel-stage");M.tabIndex=f?0:-1,M.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let I=s?.track??qe("div","gc-carousel-track");I.classList.add("gc-carousel-track"),M.append(I),b.append(M);function B(l){let g=o(e[l],l,{caption:i.showTitles!==!1,description:n==="arc-tabs"||n==="timed"});g.classList.add("gc-carousel-card"),g.dataset.gcItemIndex=String(l),g.style.width="var(--gc-carousel-slot-width)",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),s||g.querySelectorAll("img").forEach(E=>{E.draggable=!1,E.style.objectFit=i.fit==="contain"?"contain":"cover"});let k=s?.slot(g)??g;return I.append(k),{card:g,node:k,index:l,logical:l,active:!1}}let U=e.map((l,g)=>B(g)),X=new Map,R=!1,H=qe("div","gc-carousel-controls"),re=qe("div","gc-carousel-counter");re.setAttribute("aria-hidden","true");let z=qe("span","gc-carousel-current",f?"01":"00");re.append(z,qe("span","gc-carousel-divider","/"),qe("span","gc-carousel-total",String(f).padStart(2,"0")));let G=qe("div","gc-carousel-arrows"),O=Xe(dt("gc-carousel-arrow","Previous slide"),"previous"),_=Xe(dt("gc-carousel-arrow","Next slide"),"next");O.disabled=_.disabled=f<2,G.append(O,_);let T=Xe(dt("gc-carousel-playback","Play slideshow"),"playback");T.hidden=f<2||x;let V=qe("div","gc-carousel-pagination");V.setAttribute("aria-label","Slide pagination"),n==="timed"&&e.forEach((l,g)=>{let k=dt("gc-carousel-dot",l.title?.trim()||`Go to slide ${g+1}`),E=qe("span","gc-carousel-dot-fill");E.setAttribute("aria-hidden","true"),k.append(E),L(k,"click",()=>Te(g)),V.append(k),C.push({dot:k,fill:E})}),H.append(re,G),n==="timed"&&H.append(V),H.append(T),b.append(H);let $=qe("p","gc-carousel-sr");$.setAttribute("aria-atomic","true"),b.append($);let K=qe("span","gc-carousel-cursor","Drag");K.setAttribute("aria-hidden","true"),(n==="arc-tabs"||n==="showcase"||n==="arc")&&M.append(K),t.append(b);let ae=!1,F=r,Y=r,ne=-1,J=0,ce=0,ue=0,se=!!i.autoplay&&!x&&f>1,de=!1,be=!1,xe=!1,we=!1,Q=null,fe=0,oe=0,Ae=0,pe=0,ke=()=>Math.max(12,pe*(.36-y*.12)+d-28),Ce=-1,Ee,ye=1,Re=0,Oe=0,De=()=>we||de||be||xe||document.hidden||!!Q,lt=l=>{let g=at(Math.round(F),f),k=at(l-g,f);return k>f/2&&(k-=f),Math.round(F)+k};function Fe(){let l=A[ne];if(!l)return;let g=l.offsetLeft,k=g+l.offsetWidth;g<W.scrollLeft?W.scrollLeft=Math.max(0,g-14):k>W.scrollLeft+W.clientWidth&&(W.scrollLeft=k-W.clientWidth+14)}function ot(){let l=f?at(Math.round(F),f):-1;if(l===ne)return;ne=l,z.textContent=f?String(l+1).padStart(2,"0"):"00",A.forEach((k,E)=>{k.classList.toggle("is-active",E===l),k.setAttribute("aria-pressed",String(E===l))}),Fe(),C.forEach(({dot:k},E)=>{k.classList.toggle("is-active",E===l),E===l?k.setAttribute("aria-current","true"):k.removeAttribute("aria-current")});let g=e[l]?.title;$.textContent=f?`${l+1} of ${f}${g?`: ${g}`:""}`:"No gallery items",l>=0&&a?.(l)}function We(){if(ae||!oe)return;ot();let l=Math.abs(Y-F)>.002;b.classList.toggle("is-moving",l||!!Q);let g=[...U];for(let k of U)k.logical=k.index+Math.round((F-k.index)/f)*f;if(f>1){let k=pe+d,E=n==="infinite"&&oe>660?oe*.61:oe/2,N=(E+pe/2+40)/k,q=(oe-E+pe/2+40)/k;u?N=q=Ee.reach:n==="showcase"&&(N=q=Math.min(4.1,(oe/2+pe)/ke()));let j=Math.ceil(F-N),Z=Math.floor(F+q);for(let[le,ee]of X)(le<j||le>Z||U[ee.index].logical===le)&&(ee.node.remove(),X.delete(le));for(let le=j;le<=Z;le++){let ee=at(le,f);if(U[ee].logical===le)continue;let ge=X.get(le);ge||(ge=B(ee),ge.logical=le,X.set(le,ge),R&&c&&ge.card.querySelectorAll("img").forEach(me=>c(me,{nativeCard:!!s}))),g.push(ge)}}g.forEach(k=>{let E=f===1?0:k.logical-F,N=Math.abs(E),q=k.logical===Math.round(F),j=oe/2,Z=0,le=0,ee=1,ge=1,me=!0,ve=0,he=0;if(n==="infinite")j=(oe>660?oe*.61:oe/2)+E*(pe+d),ge=1-Math.min(1,N)*.68,me=j+pe/2>-40&&j-pe/2<oe+40;else if(n==="timed")j+=E*(pe+d),ee=1-Math.min(N,1)*.035,me=j+pe/2>-40&&j-pe/2<oe+40;else if(n==="showcase")j+=E*ke(),Z+=Math.min(N,4)*(10+y*9),ee=Math.max(.48,1-N*(.09+y*.035)),le=E*(4+y*7),he=-E*(3+y*4),ge=Ne(1-N*.19,0,1),me=N<4.1,q&&!x&&(ve=Oe,he+=Re,le+=Ne(Y-F,-1,1)*-3);else{let Se=E*Ee.step;j+=Ee.radius*Math.sin(Se),Z=Ee.radius*(1-Math.cos(Se)),le=Se*180/Math.PI,me=N<=Ee.reach,ge=n==="arc-tabs"?1-Math.min(N,1)*.16:1}k.card.style.transform=`translate3d(${j}px,${Z}px,0) translateX(-50%) rotate(${le}deg) rotateX(${ve}deg) rotateY(${he}deg) scale(${ee})`,k.card.style.zIndex=String(1e3-Math.round(N*100)),k.card.style.opacity=String(ge),k.card.style.visibility=me?"visible":"hidden",k.card.style.pointerEvents=me&&ge>.08?"auto":"none",k.active!==q&&(k.active=q,k.card.classList.toggle("is-active",q)),k.card.tabIndex=q?0:-1,k.card.setAttribute("aria-hidden",String(!q)),s?.syncFocus(k.card)}),C.forEach(({fill:k},E)=>{k.style.transform=`scaleX(${E===ne?Ne(ue/p,0,1):0})`})}function He(){let l=oe;oe=M.clientWidth;let g=S?1:n==="timed"?.86:n==="infinite"&&oe>660?.48:.76,k=Math.max(80,Math.min(v,oe*g));if(k!==pe&&(pe=k,I.style.setProperty("--gc-carousel-slot-width",`${pe}px`)),m){let E=I.offsetHeight;if(oe!==l||E!==Ce){Ce=E,u&&(Ee=Ya(n,oe,pe,Ce,y,d));let N=Ee??Va(pe,Ce,y);f>1&&(M.style.setProperty("--gc-sweep-above",Math.ceil(N.above)+"px"),M.style.setProperty("--gc-sweep-below",Math.ceil(N.below)+"px"))}}Ae=M.clientHeight,ye=u?Ee.radius*Ee.step:n==="showcase"?pe*.54:pe+d,We()}function Ie(){!ae&&!J&&(J=requestAnimationFrame(Ve))}function Ve(l){if(J=0,ae)return;let g=ce?Ne(l-ce,0,64):0;ce=l,Q||(x?F=Y:F+=(Y-F)*(1-Math.exp(-g/85)),Math.abs(Y-F)<5e-4&&(F=Y));let k=Math.abs(Y-F)<.002&&!Q;se&&!De()&&k&&(ue+=g,ue>=p&&(ue=0,Y=Math.round(F)+1)),We(),Math.abs(Y-F)>5e-4||se&&!De()?Ie():ce=0}function Te(l){ae||f<2||(Y=lt(at(Math.round(rt(l,0)),f)),ue=0,x&&(F=Y),We(),Ie())}function Ze(l){f<2||(Y=Math.round(Y)+l,ue=0,x&&(F=Y),We(),Ie())}function Ue(l){se=!!l&&!x&&f>1,T.dataset.paused=String(!se),T.setAttribute("aria-label",se?"Pause slideshow":"Play slideshow"),T.setAttribute("aria-pressed",String(se)),$.setAttribute("aria-live",se?"off":"polite"),b.classList.toggle("is-playing",se),ce=0,Ie()}function Me(l){we=!!l,ce=0,Ie()}L(O,"click",()=>Ze(-1)),L(_,"click",()=>Ze(1)),L(T,"click",()=>Ue(!se)),L(M,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),M.focus({preventScroll:!0}),Ze(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),M.focus({preventScroll:!0}),Te(l.key==="Home"?0:f-1))}),L(M,"pointerdown",l=>{f<2||l.button!==0||!l.isPrimary||(Q={id:l.pointerId,x:l.clientX,y:l.clientY,start:F,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},Y=F,ue=0)}),L(M,"pointermove",l=>{let g=M.getBoundingClientRect(),k=g.width/Math.max(1,M.clientWidth)||1,E=(l.clientX-g.left)/k,N=(l.clientY-g.top)/k;if(K.style.left=`${E}px`,K.style.top=`${N}px`,l.pointerType==="mouse"&&M.classList.add("has-pointer"),!Q){n==="showcase"&&!x&&(Re=Ne((E-oe/2)/pe,-1,1)*4,Oe=Ne((N-Ae/2)/Ae,-.5,.5)*-5,We());return}if(l.pointerId!==Q.id)return;let q=l.clientX-Q.x,j=l.clientY-Q.y;if(!Q.axis&&Math.hypot(q,j)>6&&(Q.axis=Math.abs(q)>Math.abs(j)?"horizontal":"vertical",Q.axis==="horizontal"&&(M.setPointerCapture(l.pointerId),M.classList.add("is-dragging"))),Q.axis!=="horizontal")return;l.preventDefault(),Q.moved=!0;let Z=performance.now(),le=Math.max(8,Z-Q.lastTime),ee=-(l.clientX-Q.lastX)/k/ye/le;Q.velocity=Q.velocity*.45+ee*.55,Q.lastX=l.clientX,Q.lastTime=Z,F=Q.start-q/k/ye,Y=F,We()},{passive:!1});function _e(l){if(!Q||l.pointerId!==Q.id)return;let g=Q;if(Q=null,M.hasPointerCapture(l.pointerId)&&M.releasePointerCapture(l.pointerId),M.classList.remove("is-dragging"),g.moved){fe=performance.now()+400;let k=performance.now()-g.lastTime,E=x||l.type==="pointercancel"||k>120?0:Ne(g.velocity*210,-4,4);Y=Math.round(F+E)}else Y=Math.round(F);x&&(F=Y),Ie()}L(M,"pointerup",_e),L(M,"pointercancel",_e),L(window,"pointerup",_e),L(M,"lostpointercapture",l=>{Q?.id===l.pointerId&&_e(l)}),L(M,"dragstart",l=>l.preventDefault()),L(M,"click",l=>{if(performance.now()<fe){l.preventDefault(),l.stopImmediatePropagation();return}let g=l.target.closest(".gc-carousel-card");!g||!M.contains(g)||g.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Te(Number(g.dataset.gcItemIndex)))},!0),L(M,"pointerleave",()=>{M.classList.remove("has-pointer"),Re=Oe=0,Q||We()}),L(b,"pointerenter",l=>{l.pointerType==="mouse"&&(de=!0)}),L(b,"pointerleave",()=>{de=!1,ce=0,Ie()}),L(b,"focusin",()=>{be=!0}),L(b,"focusout",()=>{queueMicrotask(()=>{ae||(be=b.contains(document.activeElement),ce=0,Ie())})}),L(document,"visibilitychange",()=>{ce=0,Ie()});let Be;typeof ResizeObserver<"u"?(Be=new ResizeObserver(l=>{l.some(({target:g})=>g===M||g===I)&&He(),D&&l.some(({target:g})=>g!==M&&g!==I)&&Fe()}),Be.observe(M),m&&Be.observe(I),D&&(Be.observe(W),A.forEach(l=>Be.observe(l,{box:"border-box"})))):L(window,"resize",()=>{He(),Fe()});let $e;return typeof IntersectionObserver<"u"&&($e=new IntersectionObserver(l=>{xe=!l[0]?.isIntersecting,ce=0,Ie()}),$e.observe(b)),He(),R=!0,Ue(se),{goTo:Te,setGeometry(l){h(l),Ce=-1,He()},setPlaying:Ue,setSuspended:Me,destroy(){ae=!0,cancelAnimationFrame(J),Be?.disconnect(),$e?.disconnect(),P.forEach(l=>l()),b.remove()}}}var Xa,Ne,at,rt,Ho=te(()=>{qt();Xa=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Ne=(t,e,r)=>Math.min(r,Math.max(e,t)),at=(t,e)=>(t%e+e)%e,rt=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Oo(t){let{host:e,makeCard:r,nativeList:i}=t,o=Array.isArray(t.items)?t.items:[],a=t.options||{},s=["wall","ring","angled"].includes(a.preset)?a.preset:"wall",c=!!a.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=o.length,u=s==="ring"?16:s==="wall"?12:n,m=!c&&n>1&&n<12&&s!=="angled"?Math.ceil(u/n)*n:n,f=Array.from({length:n},(l,g)=>g),x=Je(et(a.depth,55),0,100),y=Je(et(a.cardWidth,280),80,900),d=Je(et(a.gap,24),0,160),v=Math.max(1,et(a.duration,5)),S=new AbortController,h=(l,g,k,E={})=>l.addEventListener(g,k,{...E,signal:S.signal}),p={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},b=`gc-spatial-help-${++Ja}`,P=["gc-spatial",`gc-${s}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...P);let L=new Map,A=(l,g)=>{L.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,g)};A("--gc-spatial-height",`${Je(et(a.stageHeight,620),300,1400)}px`),A("--gc-spatial-radius",`${Je(et(a.radius,18),0,100)}px`),A("--gc-spatial-fit",a.fit==="contain"?"contain":"cover"),A("--gc-spatial-card-width",`${y}px`),A("--gc-spatial-gap",`${d}px`);let C=i?.track??document.createElement("div");C.classList.add("gc-spatial-canvas"),i&&C.classList.add("gc-spatial-native-track"),C.setAttribute("role",i?"list":"group"),C.setAttribute("aria-label",p[s]),C.setAttribute("aria-describedby",b);let w=document.createElement("p");w.id=b,w.className="gc-spatial-sr",w.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let D=document.createElement("span");D.className="gc-spatial-sr",D.setAttribute("aria-live","polite"),D.setAttribute("aria-atomic","true"),e.append(w,C,D);let W=a.showTitles!==!1&&(s!=="ring"||c||n===1),M=Array.from({length:m},(l,g)=>{let k=g%n,E=o[k],N=r(E,k,{caption:W,description:!1,thumbnail:!0}),q=i?.slot(N)??document.createElement("div");return q.classList.add("gc-spatial-position"),N.classList.add("gc-spatial-card"),N.dataset.spatialIndex=String(g),N.dataset.spatialSourceIndex=String(k),N.tabIndex=g===0?0:-1,g>=n&&N.setAttribute("aria-hidden","true"),!N.getAttribute("aria-label")&&!N.textContent.trim()&&N.setAttribute("aria-label",`View item ${k+1}`),q.contains(N)||q.append(N),q.parentNode!==C&&C.append(q),{position:q,card:N,sourceIndex:k,x:0,y:0,flip:0,tilt:0,lift:0}}),I=document.createElement("div");I.className="gc-spatial-nav";let B=(l,g)=>{let k=document.createElement("button");return k.type="button",k.className="gc-spatial-control",k.setAttribute("aria-label",g),Xe(k,l)},U=B("previous","Previous item"),X=B("next","Next item"),R=document.createElement("span");R.className="gc-spatial-count",R.setAttribute("aria-hidden","true"),I.append(U,R,X);let H=a.autoplay&&!c?B("playback","Pause gallery motion"):null;H&&(H.disabled=n<2,H.dataset.paused=String(n<2),H.disabled&&H.setAttribute("aria-label","Play gallery motion"),I.append(H)),e.append(I),U.disabled=X.disabled=n<2;let re,z;if(s==="ring"&&n>1&&!c){re=document.createElement("div"),re.className="gc-ring-center",re.setAttribute("aria-hidden","true"),a.showTitles!==!1&&(z=document.createElement("span"),z.className="gc-ring-label",re.append(z));let l=document.createElement("span");l.textContent="Drag to explore",re.append(l),C.after(re)}let G;n||(G=document.createElement(i?"li":"p"),G.className="gc-spatial-empty",G.textContent="No items available.",C.append(G));let O=!1,_=0,T=-1,V=1,$=1,K=1,ae=1,F=1,Y=1,ne=0,J=1,ce=1,ue=0,se=0,de=1,be=!!a.autoplay&&!c&&n>1,xe=!1,we=!1,Q=!1,fe=!0,oe=null,Ae=0,pe=0,ke=0,Ce=-1,Ee=!1,ye={x:-1e4,y:-1e4,inside:!1};function Re(l=_){if(!z)return;let g=typeof o[l]?.title=="string"?o[l].title.trim():"";z.textContent===g&&z.hidden===!g||(z.textContent=g,z.hidden=!g,Oe())}function Oe(){!re||O||(re.classList.remove("is-below"),re.offsetHeight>ne&&re.classList.add("is-below"))}function De(l,g=!1,k=null){if(!n){R.textContent="00 / 00";return}let E=nt(l,n),N=k!==null&&M[k]?.sourceIndex===E,q=N&&f[E]!==k;if(N){let j=M[f[E]].card;f[E]=k,q&&(M[k].card.removeAttribute("aria-hidden"),i?.syncFocus(M[k].card),document.activeElement===j&&(Ee=!0,M[k].card.focus({preventScroll:!0}),Ee=!1))}if(T===E&&!q){g&&(D.textContent=`Item ${E+1} of ${n}${o[E].title?`: ${o[E].title}`:""}`);return}_=E,Re(),R.textContent=`${String(_+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`,M.forEach(({card:j,sourceIndex:Z},le)=>{let ee=f[Z]===le;j.tabIndex=ee&&Z===_?0:-1,j.classList.toggle("is-selected",ee&&Z===_),ee?j.removeAttribute("aria-hidden"):j.setAttribute("aria-hidden","true"),i?.syncFocus(j)}),g&&(D.textContent=`Item ${_+1} of ${n}${o[_].title?`: ${o[_].title}`:""}`),T!==_&&(T=_,t.onChange?.(_))}function lt(l){be=!!l&&!c&&n>1,H&&(H.dataset.paused=String(!be),H.setAttribute("aria-label",be?"Pause gallery motion":"Play gallery motion")),Me()}function Fe(l){xe=!!l,xe||Me()}function ot(l,g,k){return g+Math.round((l-g)/k)*k}function We(l){let g={index:f[l],target:l,distance:1/0};return M.forEach((k,E)=>{if(k.sourceIndex!==l)return;let N=E;if(s==="ring")N=ot(ue,E,m);else if(s==="wall"){let j=Math.floor(E/J);N=ce>2?ot(ue,j,ce):j}let q=Math.abs(N-ue);q<g.distance&&(g={index:E,target:N,distance:q})}),g}function He(l){let g=l.getBoundingClientRect();return g.left+g.width/2}function Ie(){if(n<2)return;let l=He(M[0].position),g=He(M[1].position)-l;if(Math.abs(g)<1)return;let k=Je(Math.round((He(C)-l)/g),0,n-1);De(k,!1,k)}function Ve(l,g=!1){if(!n)return;let k=nt(Math.round(et(l,0)),n),E=c?{index:k,target:k}:We(k);if(De(k,!0,E.index),c){let N=M[k].position;C.scrollTo({left:C.scrollLeft+He(N)-He(C),behavior:"auto"})}else se=E.target;g&&M[E.index].card.focus({preventScroll:!0}),Me()}function Te(){if(!O){if(V=Math.max(1,C.clientWidth),$=Math.max(1,C.clientHeight),s==="ring"){let l=Math.max(80,Math.min(V-32,$-42)),g=Je(et(a.ringDiameter,l),80,l);Y=Math.max(0,g*.38);let k=io*Y/Math.max(1,m),E=Math.min(g*.17,k*.8),N=1.15-Je(d,0,100)/160;if(K=n<=1?Math.min(y,V*.65,$*.58):Math.max(18,Math.min(Math.min(y*.22,E)*N,k*.94)),ae=K*1.28,re){let q=Math.max(0,Y-Math.max(32,ae)/2-10);ne=Math.floor(q*Math.SQRT2),re.style.setProperty("--gc-ring-label-width",`${ne}px`),re.style.setProperty("--gc-ring-label-y",`${C.offsetTop+$/2}px`),Oe()}F=Math.max(24,io*Math.max(1,Y)/Math.max(1,m))}else s==="wall"?(J=m>=10?3:m>=4?2:1,ce=Math.max(1,Math.ceil(m/J)),ae=Math.min(($-56-(J-1)*d)/J,y*.62,230),K=Math.max(60,Math.min(ae*1.5,y,V*.43)),ae=K/1.5,F=K+Math.min(d,70)):(K=Math.min(y,V*.68,($-70)*.76),ae=K/.76,F=K*(.72+(100-x)*.001)+d);M.forEach(({position:l})=>{l.style.width=`${Math.max(24,K)}px`,l.style.height=`${Math.max(32,ae)}px`}),c&&M.forEach(({position:l})=>{l.style.width=`${Math.min(y,V*.72)}px`,l.style.height=`${Math.min($-40,y*1.15)}px`}),Me()}}function Ze(l){if(c||!n||xe)return!1;let g=be&&!we&&!Q&&!oe&&fe&&!document.hidden;if(g){let q=l/v;s==="angled"?(se+=q*de,se>=n-1&&(se=n-1,de=-1),se<=0&&(se=0,de=1)):se+=q}let k=oe?.moved?1:1-Math.exp(-l*11);ue+=(se-ue)*k,Math.abs(se-ue)<1e-4&&(ue=se);let E=Math.abs(se-ue)>1e-4||g;if(g||oe?.moved){let q=oe?.moved?ue:se,j=s==="wall"?Math.round(q)*J+f[_]%J:Math.round(q),Z=s==="wall"?Math.min(nt(j,ce*J),m-1):nt(j,m);De(M[Z].sourceIndex,!1,Z)}let N=1-Math.exp(-l*13);return M.forEach((q,j)=>{let{position:Z,card:le}=q;if(s==="ring"){let ee=-Math.PI/2+(j-ue)*io/m;q.x=n===1?0:Math.cos(ee)*Y,q.y=n===1?0:Math.sin(ee)*Y;let ge=Math.hypot(ye.x-(V/2+q.x),ye.y-($/2+q.y)),me=Math.max(65,K*2.6),ve=ye.inside&&!oe?.moved?Math.max(0,1-ge/me):0,he=ve*ve*(50+x*1.3);q.flip+=(he-q.flip)*N,Math.abs(q.flip-he)>.05&&(E=!0),le.toggleAttribute("data-gc-back-facing",q.flip>90);let Se=n===1?0:ee*180/Math.PI+90;Z.style.transform=`translate3d(${q.x}px,${q.y}px,0) rotate(${Se}deg)`,le.style.transform=`perspective(700px) rotateY(${q.flip}deg) translateZ(${ve*12}px)`,Z.style.zIndex=String(j===Ce?m+2:1)}else if(s==="wall"){let ee=j%J,me=Math.floor(j/J)-ue;if(ce>2){let At=ce%2===0?.5:0;me=nt(me-At+ce/2,ce)-ce/2}let ve=Math.min(.68,2.6/Math.max(3,ce)),he=me*ve,Se=Math.max(F/ve,V*.4),mt=x/100,St=Math.sin(he)*Se,Ct=(1-Math.cos(he))*Se*mt*.65,Mt=(ee-(J-1)/2)*(ae+Math.min(d,50)),Qe=j===Ce||Q&&j===f[_]?1:0;q.lift+=(Qe-q.lift)*N,Math.abs(Qe-q.lift)>.002&&(E=!0),Z.style.transform=`translate3d(${St}px,${Mt}px,${Ct+q.lift*20}px) rotateY(${-he*180/Math.PI*mt}deg)`,Z.style.zIndex=String(Math.round(Ct)+(Qe?1e3:1)),le.style.transform=`scale(${1+q.lift*.035})`,Z.style.opacity=Math.abs(he)>1.6?"0":"1",Z.style.visibility=Math.abs(he)>1.6?"hidden":"visible"}else{let ee=j-ue,ge=j===Ce||Q&&j===f[_]?1:0;q.lift+=(ge-q.lift)*N,Math.abs(ge-q.lift)>.002&&(E=!0);let me=-(25+x*.28)*(1-q.lift);Z.style.transform=`translate3d(${ee*F}px,${-q.lift*14}px,${q.lift*110}px) rotateY(${me}deg)`,Z.style.zIndex=String(ge?n+2:n-j),le.style.transform="none"}}),E}function Ue(l){if(pe=0,O)return;let g=Math.min(.05,Math.max(.001,(l-(ke||l-16.7))/1e3));ke=l,Ze(g)&&fe&&!document.hidden?pe=requestAnimationFrame(Ue):ke=0}function Me(){!O&&!pe&&!c&&(pe=requestAnimationFrame(Ue))}c&&h(C,"scroll",Ie,{passive:!0}),h(U,"click",()=>Ve(_-1)),h(X,"click",()=>Ve(_+1)),H&&h(H,"click",()=>lt(!be)),h(C,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let g=l.key==="Home"?0:l.key==="End"?n-1:_+(l.key==="ArrowRight"?1:-1);Ve(g,!0)}),h(C,"focusin",l=>{Q=!0;let g=l.target.closest?.("[data-spatial-index]");g&&!Ee&&De(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),Me()}),h(C,"focusout",()=>{queueMicrotask(()=>{O||(Q=C.contains(document.activeElement),Me())})}),h(C,"pointerenter",l=>{l.pointerType!=="touch"&&(we=!0,ye.inside=!0,Me())}),h(C,"pointerleave",()=>{we=!1,ye.inside=!1,Ce=-1,Re(),Me()}),h(C,"pointermove",l=>{if(l.pointerType==="touch")return;let g=C.getBoundingClientRect();ye.x=l.clientX-g.left,ye.y=l.clientY-g.top,ye.inside=!0;let k=l.target.closest?.("[data-spatial-index]");Ce=k?Number(k.dataset.spatialIndex):-1,Re(Ce>=0?M[Ce].sourceIndex:_),Me()}),h(C,"pointerdown",l=>{let g=l.target.closest?.("[data-spatial-index]");g&&De(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),!(c||n<2||l.pointerType==="mouse"&&l.button!==0)&&(oe={id:l.pointerId,x:l.clientX,y:l.clientY,start:se,moved:!1})}),h(window,"pointermove",l=>{if(!oe||l.pointerId!==oe.id)return;let g=l.clientX-oe.x,k=l.clientY-oe.y;if(!oe.moved){if(Math.abs(k)>12&&Math.abs(k)>Math.abs(g)*1.2){oe=null;return}if(Math.abs(g)<7)return;oe.moved=!0,C.classList.add("is-dragging"),C.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),se=oe.start-g/F,(s==="angled"||s==="wall"&&ce<=2)&&(se=Je(se,0,s==="wall"?ce-1:n-1)),Me()},{passive:!1});let _e=l=>{if(!oe||l.pointerId!==oe.id)return;let g=oe.moved;if(oe=null,C.classList.remove("is-dragging"),C.hasPointerCapture?.(l.pointerId)&&C.releasePointerCapture(l.pointerId),g){Ae=performance.now()+350,se=Math.round(se);let k=s==="wall"?Math.round(se)*J+f[_]%J:Math.round(se),E=s==="wall"?Math.min(nt(k,ce*J),m-1):nt(k,m);De(M[E].sourceIndex,!0,E)}Me()};h(window,"pointerup",_e),h(window,"pointercancel",_e),h(C,"click",l=>{performance.now()<Ae&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),h(C,"dragstart",l=>l.preventDefault()),h(document,"visibilitychange",Me);let Be=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(g=>g.target===C)?Te():Oe()}):null;Be?.observe(C),re&&Be?.observe(re),Be||h(window,"resize",Te);let $e=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{fe=l[0]?.isIntersecting??!0,fe&&Me()},{rootMargin:"100px"}):null;return $e?.observe(e),Te(),De(0),{goTo:Ve,setPlaying:lt,setSuspended:Fe,destroy(){O||(O=!0,cancelAnimationFrame(pe),Be?.disconnect(),$e?.disconnect(),S.abort(),w.remove(),D.remove(),I.remove(),re?.remove(),i?G?.remove():C.remove(),e.classList.remove(...P),L.forEach((l,g)=>l?e.style.setProperty(g,l):e.style.removeProperty(g)))}}}var Ja,Je,nt,et,io,$o=te(()=>{qt();Ja=0,Je=(t,e,r)=>Math.max(e,Math.min(r,t)),nt=(t,e)=>(t%e+e)%e,et=(t,e)=>Number.isFinite(Number(t))?Number(t):e,io=Math.PI*2});function Go({host:t,items:e,options:r,makeCard:i,onChange:o,nativeList:a}){let s=Number(r.stageHeight)||680,c=Math.max(300,s-120),n=Math.max(0,Number(r.gap)||0),u=Number.isFinite(Number(r.depth))?Number(r.depth):45,m=r.previewScroll===!1,f=m?window:t;t.classList.add("gc-stack"),t.style.height=m?"auto":s+"px",t.style.overflowY=m?"visible":"auto",t.style.overscrollBehavior=m?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let x=a?.track??document.createElement("div");x.classList.add("gc-stack-track"),t.append(x);let y=e.map((P,L)=>{let A=i(P,L,{caption:r.showTitles,description:!0}),C=a?.slot(A)??document.createElement("div");C.classList.add("gc-stack-slot"),A.parentElement!==C&&C.append(A),x.append(C),C.style.zIndex=L+1,A.style.width=`min(${r.stackCardWidth}px,calc(100% - 48px))`,A.style.minHeight=c+"px";let w=A.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),D=!Array.from(w).some(W=>!W.closest("[hidden]")&&W.textContent.trim());return A.classList.toggle("gc-stack-image-only",D),{card:A,wrap:C,imageOnly:D,start:0,duration:1/0}}),d=0;function v(){return m?-x.getBoundingClientRect().top:t.scrollTop}function S(){d=0;let P=v(),L=0;y.forEach(({card:A,start:C,duration:w},D)=>{let W=Math.max(0,Math.min(1,(P-C)/w));A.style.transform=r.reducedMotion?"none":`perspective(1300px) translateY(${W*-32}px) scale(${1-W*.14}) rotateX(${W*u*.25}deg)`,A.style.filter=`brightness(${1-W*.23})`,W>=.5&&(L=Math.min(D+1,y.length-1))}),y.length&&o?.(L)}function h(){d||(d=requestAnimationFrame(S))}function p(){let P=y.map(({card:C,wrap:w})=>({height:C.offsetHeight,rowHeight:w.offsetHeight})),L=m?window.innerHeight:t.clientHeight,A=x.clientTop+(parseFloat(getComputedStyle(x).paddingTop)||0);y.forEach((C,w)=>{let{height:D,rowHeight:W}=P[w],M=Math.min(40,L-24-D);C.wrap.style.top=M+"px",C.start=A-M,w&&(y[w-1].duration=Math.max(1,C.start-y[w-1].start));let I=C.imageOnly&&D<=L-64?D*.24:0,B=w<y.length-1?n-I:0;C.wrap.style.marginBottom=B+"px",A+=W+B,w===y.length-1&&(C.duration=1/0,x.style.paddingBottom=Math.max(40,L-M-W)+"px")}),h()}let b;return p(),typeof ResizeObserver<"u"&&(b=new ResizeObserver(p),b.observe(x,{box:"border-box"}),y.forEach(({card:P})=>b.observe(P,{box:"border-box"}))),window.addEventListener("resize",p),f.addEventListener("scroll",h,{passive:!0}),{goTo(P){let L=y[Math.max(0,Math.min(y.length-1,Math.round(P)))];if(!L)return;let A=m?window.scrollY+L.start-v():L.start;f.scrollTo({top:A,behavior:r.reducedMotion?"instant":"smooth"})},destroy(){b?.disconnect(),window.removeEventListener("resize",p),cancelAnimationFrame(d),f.removeEventListener("scroll",h),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",x.remove()}}}var Uo=te(()=>{});function Rt(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function ao(t,e,r,i,o,a){t.beginPath(),t.roundRect(e,r,i,o,Math.max(0,Math.min(a,i/2,o/2)))}function Ka(t,e,r){let i=[];for(let o of e.split(/\n/)){let a="";for(let s of o.split(/\s+/)){let c=a?a+" "+s:s;a&&t.measureText(c).width>r?(i.push(a),a=s):a=c}i.push(a)}return i}function _o(t,e,r){let i=Math.max(80,e.cardWidth),o=Math.min(e.cardPadding,i*.4),a=i-2*o,s=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,c=document.createElement("canvas").getContext("2d"),n=t.map(({item:m,image:f})=>{let x=[],y=(L,A,C,w,D,W,M=!1,I=r.bodyFamily)=>{if(!L)return;let B=C+" "+A+"px "+I;c.font=B;let U=Ka(c,L,Math.max(1,a-(M?16:0)));x.push({font:B,size:A,color:w,align:D,lines:U,height:U.length*A*1.25+(M?10:0),gap:W,isButton:M})},d=a*e.imageWidth/100,v=f?.naturalWidth/f?.naturalHeight||1,[S,h]=e.aspectRatio.split(":").map(Number),p=e.aspectRatio==="circle"?1:S&&h?S/h:v,b=f&&e.showImage?{image:f,width:d,height:d/p,gap:0}:null;return(e.textPlacement==="card"||!m.src||!e.showImage)&&(e.showTitles&&y(m.title,e.titleCustom&&e.titleSize?e.titleSize*s:r.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:r.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:r.ink,e.titleAlign,0,!1,r.family),e.showDescription&&y(m.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*s:r.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:r.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:r.ink,e.descriptionAlign,x.length?e.titleGap:0),e.showButton&&m.buttonLabel&&m.link&&y(m.buttonLabel,r.size,r.weight,r.buttonInk,"center",e.buttonGap,!0)),b&&(e.cardOrder==="content"?(b.gap=x.length?e.mediaGap:0,x.push(b)):(x.length&&(x[0].gap+=e.mediaGap),x.unshift(b))),{pieces:x,height:Math.max(1,2*o+x.reduce((L,A)=>L+A.gap+A.height,0))}}),u=Math.max(1,...n.map(m=>m.height));return n.map(({pieces:m,height:f})=>{let x=document.createElement("canvas"),y=Math.min(2,2048/Math.max(i,u));x.width=Math.max(1,Math.round(i*y)),x.height=Math.max(1,Math.round(u*y));let d=x.getContext("2d");d.scale(y,y);let v=e.cardSizing==="equal"?u:f,S=(u-v)/2;e.cardBackground&&(d.fillStyle=e.cardColor,ao(d,0,S,i,v,e.spiralRadius),d.fill());let h=S+o+(e.cardAlign==="bottom"?v-f:e.cardAlign==="middle"?(v-f)/2:0),p;for(let b of m){if(h+=b.gap,b.image){let P=b.image.naturalWidth/b.image.naturalHeight,L=e.fit==="contain"||e.fit==="fit",A=L?Math.min(b.width,b.height*P):b.width,C=L?A/P:b.height,w=o+(e.imageAlign==="left"?0:e.imageAlign==="right"?a-b.width:(a-b.width)/2)+(b.width-A)/2,D=h+(b.height-C)/2,W=e.aspectRatio==="circle"?b.width/2:e.imageRadius;if(e.shadowEnabled){d.save(),d.shadowColor=e.shadowColor,d.shadowBlur=e.shadowBlur*y;let U=e.shadowAngle*Math.PI/180;d.shadowOffsetX=Math.cos(U)*e.shadowDistance*y,d.shadowOffsetY=Math.sin(U)*e.shadowDistance*y;let X=e.shadowSpread;ao(d,w-X,D-X,A+2*X,C+2*X,W+X),d.fillStyle=e.shadowColor,d.fill(),d.restore()}d.save(),e.aspectRatio==="circle"&&(d.beginPath(),d.arc(w+A/2,D+C/2,b.width/2,0,Math.PI*2),d.clip()),ao(d,w,D,A,C,e.aspectRatio==="circle"?0:W),d.clip();let M=L?Math.min(A/b.image.naturalWidth,C/b.image.naturalHeight):Math.max(A/b.image.naturalWidth,C/b.image.naturalHeight),I=b.image.naturalWidth*M,B=b.image.naturalHeight*M;d.drawImage(b.image,w+(A-I)/2,D+(C-B)/2,I,B),e.overlayEnabled&&(d.fillStyle=e.imageTint,d.fillRect(w,D,A,C)),e.imageBorder&&(d.strokeStyle=e.imageBorderColor,d.lineWidth=2*e.imageBorderSize,d.stroke()),d.restore()}else{let P=b.align==="inherit"?"center":b.align;if(d.font=b.font,d.textBaseline="top",d.textAlign=P,d.fillStyle=b.color,b.isButton){let A=Math.min(a,Math.max(...b.lines.map(w=>d.measureText(w).width))+16),C=(i-A)/2;d.fillStyle=r.accent,d.fillRect(C,h,A,b.height),d.fillStyle=b.color,p={left:C/i,right:(C+A)/i,top:h/u,bottom:(h+b.height)/u}}let L=P==="left"?o:P==="right"?i-o:i/2;b.lines.forEach((A,C)=>d.fillText(A,L,h+(b.isButton?5:0)+C*b.size*1.25,a))}h+=b.height}return{canvas:x,buttonBounds:p,aspect:i/u}})}var Xo=te(()=>{});function Yo(t,e){let r="http://www.w3.org/2000/svg";function i(v,S,h){let p=document.createElementNS(r,v);for(let[b,P]of Object.entries(S))p.setAttribute(b,P);return h?.append(p),p}let o=i("svg",{width:0,height:0,"aria-hidden":"true"});o.style.position="absolute",t.append(o);let a=i("defs",{},o),s=i("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},a),c=i("feMorphology",{in:"SourceAlpha",operator:"dilate"},s),n=i("feGaussianBlur",{},s),u=i("feOffset",{result:"mask"},s),m=i("feFlood",{},s);i("feComposite",{in2:"mask",operator:"in"},s);let f=i("feMerge",{},s);i("feMergeNode",{},f),i("feMergeNode",{in:"SourceGraphic"},f);let x=i("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},a),y=i("feFlood",{},x);i("feComposite",{in2:"SourceGraphic",operator:"atop"},x);let d=s.cloneNode(!0);return d.id=e+"-card-shadow",a.append(d),v=>{let S=(v.cardShadowAngle??90)*Math.PI/180;d.querySelector("feMorphology").setAttribute("radius",v.cardShadowSpread||0),d.querySelector("feGaussianBlur").setAttribute("stdDeviation",(v.cardShadowBlur||0)/2);let h=d.querySelector("feOffset");h.setAttribute("dx",Math.cos(S)*(v.cardShadowDistance||0)),h.setAttribute("dy",Math.sin(S)*(v.cardShadowDistance||0)),d.querySelector("feFlood").setAttribute("flood-color",v.cardShadowColor||"#000");let p=[];v.shadowEnabled&&p.push("url(#"+s.id+")"),v.cardShadow&&p.push("url(#"+d.id+")");let b=v.shadowAngle*Math.PI/180;c.setAttribute("radius",v.shadowSpread),n.setAttribute("stdDeviation",v.shadowBlur/2),u.setAttribute("dx",Math.cos(b)*v.shadowDistance),u.setAttribute("dy",Math.sin(b)*v.shadowDistance),m.setAttribute("flood-color",v.shadowColor),y.setAttribute("flood-color",v.imageTint),t.style.setProperty("--gc-shadow-filter",p.join(" ")||"none"),t.style.setProperty("--gc-image-filter",v.imageTint.endsWith("00")&&v.imageTint.length===9?"none":"url(#"+x.id+")")}}var Vo=te(()=>{});var Jo,Ft,Ko=te(()=>{Jo='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',Ft=class{constructor(e,r,i){this.root=e,this.cards=r,this.projects=i;let o=r[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(o)?o:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${Jo}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${Jo}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",c=>{if(c.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(c.clientX<n.left||c.clientX>n.right||c.clientY<n.top||c.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",c=>{(c.key==="ArrowLeft"||c.key==="ArrowRight")&&(c.preventDefault(),this.showFrame(this.frame+(c.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",c=>{!c.isPrimary||c.target.closest("button")||(this.galleryPointer={id:c.pointerId,x:c.clientX,y:c.clientY},s.setPointerCapture(c.pointerId))}),s.addEventListener("pointerup",c=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==c.pointerId)return;s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId);let u=c.clientX-n.x,m=c.clientY-n.y;Math.abs(u)>35&&Math.abs(u)>Math.abs(m)*1.2&&this.showFrame(this.frame+(u<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let r=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!r,this.dialog.querySelector("[data-gallery-next]").hidden=!r,this.thumbnails.hidden=!r,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(o=>{let a=document.createElement("li");return a.textContent=o,a})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((o,a)=>{let s=document.createElement("button");s.type="button",s.className="project-thumbnail",s.setAttribute("aria-label",`Show ${o.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(o.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,s.append(c),s.addEventListener("click",()=>this.showFrame(a)),s})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let r=this.project.gallery[this.frame];this.image.src=new URL(r.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${r.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${r.label}`,[...this.thumbnails.children].forEach((i,o)=>i.setAttribute("aria-current",String(o===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Ye,bt,Bt=te(()=>{Lt();Ye=Object.freeze({...jo,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),bt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function Zo(t,e,{pauseOnHover:r=!0,interactionRestMs:i=6e3}={}){let o=t.querySelector("[data-orbit-toggle]"),a=new AbortController,s=(p,b,P)=>p.addEventListener(b,P,{signal:a.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let n=0,u=0,m=!1,f=p=>!!p&&t.contains(p)&&(p.matches(":focus-visible")||!!p.closest(".orbit-card")),x=()=>!m&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,y=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(n),e.autoFrame=0,n=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},d=p=>{if(e.autoFrame=0,!x()){y();return}let b=Math.min(.05,Math.max(0,(p-e.autoTime)/1e3));e.autoTime=p;let P=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(u+=b,u>=Number(t.dataset.interval||5)){u=0,e.autoTime=0,c.animateTo.call(e,Math.round(e.position)+P),n=setTimeout(v,100);return}}else e.position=(e.position+P*b*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(d)},v=()=>{if(!x()){y(),e.frame&&!m&&(n=setTimeout(v,100));return}let p=e.resumeAt-performance.now();if(p>0){y(),n=setTimeout(v,p);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(d))},S=(p=6e3)=>{y(),e.resumeAt=performance.now()+p};e.animateTo=function(...p){S(i),c.animateTo.apply(this,p),v()},e.settleImmediately=function(...p){c.settleImmediately.apply(this,p),v()},e.openProject=function(...p){S(),c.openProject.apply(this,p),v()},s(t,"pointerenter",p=>{p.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||r)&&(e.hovered=!0,v())}),s(t,"pointerleave",p=>{p.pointerType!=="touch"&&(e.hovered=!1,v())}),s(t,"focusin",p=>{e.keyboardFocused=f(p.target),v()}),s(t,"focusout",p=>{e.keyboardFocused=f(p.relatedTarget),v()}),s(t,"pointerup",()=>{S(i),v()}),s(t,"pointercancel",()=>{S(i),v()}),s(e.viewer.dialog,"close",()=>{S(),v()}),s(document,"visibilitychange",v),s(e.reducedMotion,"change",v),s(o,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,o.dataset.paused=String(e.manuallyPaused),o.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),v()});let h=new IntersectionObserver(p=>{e.inView=p.some(b=>b.isIntersecting&&b.intersectionRatio>=.15),v()},{threshold:.15});return h.observe(e.stage),e.stopAutoplay=y,e.syncAutoplay=v,()=>{m=!0,y(),a.abort(),h.disconnect(),Object.assign(e,c)}}var Qo=te(()=>{});var Pe,ei,ro,ti,oi,ii,ai,ri,ni,si,ci,li,di,pi,Dt,gi,yt,ui,no=te(async()=>{Pe=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),ei=Pe.CanvasTexture,ro=Pe.BufferGeometry,ti=Pe.Float32BufferAttribute,oi=Pe.LineBasicMaterial,ii=Pe.LineLoop,ai=Pe.DoubleSide,ri=Pe.Mesh,ni=Pe.NoToneMapping,si=Pe.PerspectiveCamera,ci=Pe.PlaneGeometry,li=Pe.Raycaster,di=Pe.Scene,pi=Pe.ShaderMaterial,Dt=Pe.SRGBColorSpace,gi=Pe.TextureLoader,yt=Pe.Vector2,ui=Pe.WebGLRenderer});var Za,vt,hi=te(async()=>{Za=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),vt=Za.default});var Qa,so,mi=te(async()=>{Qa=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),so=Qa.CustomEase});function fi(t,e,r=64){let i=t/e,o=new ci(t,t*9/16,r,1),a=o.attributes.position,s=o.attributes.uv;for(let c=0;c<a.count;c++){let n=(s.getX(c)-.5)*e;a.setX(c,i*Math.sin(n)),a.setZ(c,i*(Math.cos(n)-1))}return o.computeVertexNormals(),o.computeBoundingSphere(),o}function bi(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var co=te(async()=>{await no()});function xt(t,e){let r=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*r,panelArc:t.radiansPerSlide*r,height:t.slotHeight*r}}function Wt(t,{radius:e,pitch:r,radiansPerSlide:i}){let o=t*i;return{x:Math.sin(o)*e,y:-t*r,z:(Math.cos(o)-1)*e,angle:o,taper:1,shade:(1-Math.cos(o))/2*.58}}function yi(t,e){let r=xt(t,e);return fi(r.cardWidth,r.panelArc)}function lo(t,e=64){let r=[];for(let i=0;i<=e;i++){let o=(i/e-.5)*t.radiansPerSlide;r.push(t.radius*Math.sin(o),t.slotHeight/2,t.radius*(Math.cos(o)-1))}for(let i=e;i>=0;i--){let o=(i/e-.5)*t.radiansPerSlide;r.push(t.radius*Math.sin(o),-t.slotHeight/2,t.radius*(Math.cos(o)-1))}return r}var Nt=te(async()=>{await co()});function po(t,e){let r=yi(t,e);return r.scale(1,1/t.aspect/(9/16),1),r.computeVertexNormals(),r.computeBoundingSphere(),r}function vi(t,e,r,i,o){let a=Math.min(t,e)*Math.min(40,Math.max(0,o))/100,s=t-2*a,c=e-2*a,n=s/c,u=i==="fit"?Math.max:Math.min,m=u(1,n/r),f=u(1,r/n);return{contentWidth:s,contentHeight:c,uvScaleX:m,uvScaleY:f,imageWidth:s/m,imageHeight:c/f,padding:a}}var xi=te(async()=>{await Nt();await Nt()});function go({stageWidth:t,stageHeight:e,spiralWidthPercent:r,cardWidth:i,aspect:o,rise:a,riseUnit:s}){let c=Math.max(1,t*r/200),n=Math.max(1,Math.min(i,c*Math.PI/3,e*.4*o)),u=Math.PI*2*c/n,m=s==="percent"?e*a/100:a*Math.min(1,t/640);return{radius:c,slotWidth:n,slotHeight:n/o,aspect:o,pitch:Math.max(n/o*1.25/u,m),radiansPerSlide:n/c,cardsPerTurn:Math.PI*2*c/n}}var wi=te(()=>{});function Si(t,e,r){let i=e.radius*2.4,o=i/(i+2*e.radius),a=Math.ceil((r/(2*o)+e.slotHeight/2)/e.pitch)+2,s=Math.floor(t);return{first:s-a,last:s+a,count:a*2+1}}function Ci(t,e,r){let i=t*e.radiansPerSlide,o=i-r.panelArc/2,a=i+r.panelArc/2,s=Math.PI*2,c=S=>Math.ceil((o-S)/s)<=Math.floor((a-S)/s),n=c(0)?1:Math.max(Math.cos(o),Math.cos(a)),u=c(Math.PI)?-1:Math.min(Math.cos(o),Math.cos(a)),m=e.radius*2.4,f=m/(m+e.radius*(1-n)),x=m/(m+e.radius*(1-u)),y=-t*e.pitch,d=y+r.height/2,v=y-r.height/2;return{minY:Math.min(v*f,v*x),maxY:Math.max(d*f,d*x)}}function Mi(t,e){let r=Math.min(80,e*.08),i=a=>Math.max(0,Math.min(1,a)),o=Math.min(i((e/2-t.minY)/r),i((t.maxY+e/2)/r));return o*o*(3-2*o)}function Ai(t,e,r,i){let o=r-e;return Math.abs(o)>i/2&&(o-=Math.round(o/i)*i),t+o}var ki,Ei=te(async()=>{await Nt();wi();ki=(t,e)=>(t%e+e)%e});var Li,Pi=te(()=>{Li=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function zi(t,{textureSource:e=r=>r.querySelector("img").src}={}){let{root:r,stage:i}=t,o;try{o=new ui({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return r.dataset.renderer="css-fallback",()=>{delete r.dataset.renderer}}o.outputColorSpace=Dt,o.toneMapping=ni,o.setClearColor(0,0);let a=o.domElement;a.style.removeProperty("display"),a.className="orbit-webgl",a.setAttribute("aria-hidden","true"),i.append(a);let s=new di,c=new si,n=new li,u=new yt,m=new AbortController,f=(T,V,$)=>T.addEventListener(V,$,{signal:m.signal}),x=t.render,y=t.pointerDown,d=new Map,v=new Map;function S(){for(let T of t.cards){let V=v.get(T);if(V?.image!==T.artwork&&(V?.dispose(),v.delete(T),T.artwork)){let $=new ei(T.artwork);$.colorSpace=Dt,v.set(T,$)}}}let h=[],p,b,P=t.position,L=t.position,A="",C=!1,w=!1,D=null,W=null,M=!1,I=!1;r.dataset.renderer="loading-webgl";let B=()=>go({stageWidth:i.clientWidth,stageHeight:i.clientHeight,spiralWidthPercent:Number(r.dataset.spiralWidth),cardWidth:Number(r.dataset.cardWidth),aspect:Number(r.dataset.cardAspect),rise:Number(r.dataset.rise),riseUnit:r.dataset.riseUnit}),U=()=>{let T=t.cards[0],V=new pi({uniforms:{screenshot:{value:d.get(e(T))},dimensions:{value:new yt},contentDimensions:{value:new yt(1,1)},imageScale:{value:new yt(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:tr,fragmentShader:or,transparent:!0,side:ai,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),$=new ri(p,V),K=new ii(b,new oi({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),ae={card:T,mesh:$,guide:K,material:V,surface:{scale:0,target:0}};$.userData.panel=ae,h.push(ae),s.add($,K)},X=T=>{let V=Si(P,T,i.clientHeight);for(;h.length<V.count;)U();for(;h.length>V.count;){let $=h.pop();s.remove($.mesh,$.guide),$.material.dispose(),$.guide.material.dispose()}h.forEach(($,K)=>{$.offset=V.first+K-P,$.card=t.cards[ki(V.first+K,t.count)],$.material.uniforms.screenshot.value=v.get($.card)||d.get(e($.card))})},R=()=>{let T=i.clientWidth,V=i.clientHeight,$=B(),K=Number(r.dataset.slotGap||3);X($);let ae=xt($,K),{cardWidth:F,panelArc:Y}=ae,{radius:ne}=$;r.dataset.slotMetrics=JSON.stringify({...$,cardArc:Y,cardWidth:F,cardHeight:ae.height,gap:K,imageFit:r.dataset.imageFit,imagePadding:Number(r.dataset.imagePadding||0)}),h.forEach(de=>{de.material.uniforms.dimensions.value.set(F,ae.height);let be=de.material.uniforms;be.cornerRadius.value=Math.min(Number(r.dataset.cornerRadius)||0,F/2,ae.height/2),be.borderWidth.value=Number(r.dataset.borderWidth)||0,be.solidBack.value=r.dataset.backFace==="solid",be.showImage.value=!!de.card.artwork||r.dataset.showImage!=="false";for(let Q of["backColor","borderColor","imageTint","mirrorColor"]){let fe=be[Q],oe=Q==="imageTint"&&de.card.artwork?"#00000000":r.dataset[Q]||"#00000000";if(fe.hex!==oe){fe.hex=oe;let Ae=oe.length===7?oe+"ff":oe;fe.value=[1,3,5,7].map(pe=>parseInt(Ae.slice(pe,pe+2),16)/255)}}let xe=de.material.uniforms.screenshot.value.image;if(!xe)return;let we=vi(F,ae.height,(xe.naturalWidth||xe.width)/(xe.naturalHeight||xe.height),de.card.artwork?"fit":r.dataset.imageFit,de.card.artwork?0:Number(r.dataset.imagePadding||0));de.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),de.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let J=Math.min(window.devicePixelRatio||1,2),ce=`${T}:${V}:${F}:${Y}:${ae.height}:${ne}:${J}`;if(ce===A||!T||!V)return;A=ce,o.setPixelRatio(J),o.setSize(T,V,!1),c.position.set(0,0,ne*2.4),c.fov=bi(V,c.position.z),c.aspect=T/V,c.near=.1,c.far=ne*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let ue=p;p=po($,K);let se=b;b=new ro,b.setAttribute("position",new ti(lo($),3)),h.forEach(de=>{de.mesh.geometry=p,de.guide.geometry=b,de.material.uniforms.dimensions.value.set(F,ae.height)}),ue?.dispose(),se?.dispose()},H=()=>{if(!C||w||M||I||!t.geometry)return;I=!0,P=Ai(P,L,t.position,t.count),L=t.position,R();let T=B(),V=xt(T,Number(r.dataset.slotGap||3)),$=r.dataset.focusMode==="keyboard"&&r.contains(document.activeElement),K=0;h.forEach(F=>{let{card:Y,mesh:ne,material:J}=F,ce=Wt(F.offset,T),ue=Ci(F.offset,T,V),se=Mi(ue,i.clientHeight),de=r.dataset.edgeMode==="preset"?se:+(se>0),be=$&&Y===t.cards[t.active]&&Math.abs(F.offset)<.5;J.polygonOffsetUnits=Math.abs(F.offset)*8,ne.position.set(ce.x,ce.y,ce.z),ne.rotation.y=ce.angle;let xe=F===D&&!t.pointer&&!t.reducedMotion.matches,we=Number(r.dataset.hoverAmount)||0,Q=xe?1:0;F.surface.target!==Q&&(F.surface.target=Q,vt.to(F.surface,{scale:Q,duration:(Number(r.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:H})),ne.scale.setScalar(r.dataset.hoverEffect==="zoom"?1+F.surface.scale*we/100:1),r.dataset.hoverEffect==="lift"&&(ne.position.y+=F.surface.scale*we),ne.visible=de>.001&&!!J.uniforms.screenshot.value.image,ne.visible&&K++,F.guide.position.copy(ne.position),F.guide.rotation.copy(ne.rotation),F.guide.visible=r.dataset.showSlots==="true"&&ne.visible,F.guide.material.opacity=de*.42,J.uniforms.fade.value=de,J.uniforms.shade.value=ce.shade,J.uniforms.focused.value=be?1:0});let ae=JSON.stringify({cardsPerTurn:T.cardsPerTurn,visibleCount:K,poolCount:h.length,stageWidth:i.clientWidth,stageHeight:i.clientHeight,cardWidth:V.cardWidth,cardHeight:V.height,pitch:T.pitch,radius:T.radius,uniqueCount:t.count});r.dataset.responsiveMetrics!==ae&&(r.dataset.responsiveMetrics=ae),W&&!t.pointer&&(D=re(W)),s.updateMatrixWorld(!0),o.render(s,c),I=!1},re=T=>{if(!C||M)return null;let V=a.getBoundingClientRect();u.set((T.clientX-V.left)/V.width*2-1,-(T.clientY-V.top)/V.height*2+1),n.setFromCamera(u,c);for(let $ of n.intersectObjects(h.map(K=>K.mesh))){let K=$.object.userData.panel;if(!$.object.visible||K.material.uniforms.fade.value<=.25)continue;let{x:ae,y:F}=K.material.uniforms.dimensions.value,Y=K.material.uniforms.cornerRadius.value,ne=Math.abs(($.uv.x-.5)*ae)-ae/2+Y,J=Math.abs(($.uv.y-.5)*F)-F/2+Y;if(!(Math.hypot(Math.max(ne,0),Math.max(J,0))+Math.min(Math.max(ne,J),0)>Y))return K.hitUv=$.uv,K}return null};t.render=function(){x.call(this),H()},t.pointerDown=function(T){if(y.call(this,T),C&&!M&&this.pointer?.id===T.pointerId){let V=re(T);this.pointer.card=V?.card||null;let $=V?.card.buttonBounds,K=V?.hitUv;$&&K.x>=$.left&&K.x<=$.right&&1-K.y>=$.top&&1-K.y<=$.bottom&&(this.pointer.buttonLink=V.card.dataset.buttonLink)}W=null,D=null},f(i,"pointermove",T=>{W=T.pointerType==="mouse"?{clientX:T.clientX,clientY:T.clientY}:null,D=T.pointerType==="mouse"&&!t.pointer?re(T):null,a.style.cursor=t.pointer?.dragging?"grabbing":D?"pointer":"grab",H()}),f(i,"pointerleave",()=>{W=null,D=null,H()}),f(i,"pointerup",()=>{D=null,H()}),f(r,"focusin",H),f(r,"focusout",()=>queueMicrotask(H)),f(document,"keydown",()=>queueMicrotask(H)),f(document,"pointerdown",()=>queueMicrotask(H)),f(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&h.forEach(({surface:T})=>{vt.killTweensOf(T),T.scale=T.target}),H()}),f(r,"playground-change",()=>{S(),H()}),f(r,"artwork-change",()=>{S(),H()}),f(r,"slot-guides-change",H),f(a,"webglcontextlost",T=>{T.preventDefault(),M=!0,r.classList.remove("has-webgl-carousel"),r.dataset.renderer="css-fallback"}),f(a,"webglcontextrestored",()=>{M=!1,C&&(r.classList.add("has-webgl-carousel"),r.dataset.renderer="webgl",H())});let z=new ResizeObserver(()=>H());z.observe(i);let G=new gi,O=!1,_=()=>{w||(O=!0,C=!1,r.classList.remove("has-webgl-carousel"),r.dataset.renderer="css-fallback")};for(let T of t.cards){let V=e(T);if(d.has(V))continue;let $=G.load(V,H,void 0,_);$.colorSpace=Dt,$.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),d.set(V,$)}return O||(p=po(B(),Number(r.dataset.slotGap||3)),b=new ro,C=!0,r.classList.add("has-webgl-carousel"),r.dataset.renderer="webgl",H()),()=>{w=!0,m.abort(),z.disconnect(),t.render=x,t.pointerDown=y,r.classList.remove("has-webgl-carousel"),delete r.dataset.renderer,h.forEach(({material:T,surface:V,guide:$})=>{vt.killTweensOf(V),T.dispose(),$.material.dispose()}),v.forEach(T=>T.dispose()),p?.dispose(),b?.dispose(),d.forEach(T=>T.dispose()),o.dispose(),o.forceContextLoss(),a.remove()}}var vn,tr,or,ji=te(async()=>{await no();await hi();await mi();await co();await xi();await Ei();vt.registerPlugin(so);vn=so.create("portfolio-surface",".2,.75,.25,1"),tr=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,or=`
  uniform sampler2D screenshot;
  uniform vec2 dimensions;
  uniform float cornerRadius;
  uniform float borderWidth;
  uniform vec4 borderColor;
  uniform vec4 imageTint;
  uniform vec4 mirrorColor;
  uniform bool showImage;
  uniform vec4 backColor;
  uniform bool solidBack;
  uniform vec2 contentDimensions;
  uniform vec2 imageScale;
  uniform float fade;
  uniform float shade;
  uniform float focused;
  varying vec2 imageUv;
  void main() {
    vec2 p = (imageUv - .5) * dimensions;
    vec2 q = abs(p) - dimensions * .5 + cornerRadius;
    float edge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - cornerRadius;
    float aa = max(fwidth(edge), .35);
    float coverage = 1.0 - smoothstep(-aa, aa, edge);
    if (coverage < .001 || fade < .001) discard;
    vec2 contentUv=p/contentDimensions+.5;
    vec2 sampleUv=(contentUv-.5)*imageScale+.5;
    float inContent=step(0.0,contentUv.x)*step(contentUv.x,1.0)*step(0.0,contentUv.y)*step(contentUv.y,1.0);
    float inImage=step(0.0,sampleUv.x)*step(sampleUv.x,1.0)*step(0.0,sampleUv.y)*step(sampleUv.y,1.0);
    gl_FragColor = texture2D(screenshot,clamp(sampleUv,vec2(0.0),vec2(1.0)));
    #include <colorspace_fragment>
    gl_FragColor.a *= inContent * inImage;
    gl_FragColor.rgb = mix(gl_FragColor.rgb,imageTint.rgb,imageTint.a);
    if (!showImage) gl_FragColor = backColor;
    if(!gl_FrontFacing) gl_FragColor.rgb=mix(gl_FragColor.rgb,mirrorColor.rgb,mirrorColor.a);
    if (solidBack && !gl_FrontFacing) gl_FragColor = backColor;
    if (borderWidth > 0.0) {
      float rim = smoothstep(-borderWidth-aa,-borderWidth+aa,edge);
      gl_FragColor = mix(gl_FragColor,borderColor,rim);
    }
    if (gl_FragColor.a < .001) discard;
    // Match the old sRGB darkening, without a second coplanar overlay.
    gl_FragColor.rgb *= 1.0 - shade;
    float topBottom = smoothstep(dimensions.y * .5 - 1.0, dimensions.y * .5, abs(p.y));
    float focusBorder = smoothstep(-2.0 - aa, -2.0 + aa, edge) * focused;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), max(topBottom * .086, focusBorder));
    gl_FragColor.a *= coverage * fade;
  }
`});var Ii=te(()=>{(()=>{"use strict";let t=Math.PI*2,e=(a,s)=>(a%s+s)%s,r=(a,s,c)=>Math.min(c,Math.max(s,a));class i{constructor(s){this.root=s,this.stage=s.querySelector(".orbit-stage"),this.cards=[...s.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,n)=>{c.dataset.slideIndex=n;let u=c.cloneNode(!0);u.dataset.repeat="true",u.tabIndex=-1,u.setAttribute("aria-hidden","true"),u.removeAttribute("aria-pressed"),c.parentElement.append(u),this.visualCards.push(u)}),!(!this.count||!this.stage)&&(this.title=s.querySelector(".orbit-title"),this.description=s.querySelector(".orbit-description"),this.status=s.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(s,this.cards),this.pagination=s.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((s,c)=>{let n=document.createElement("button");return n.type="button",n.className="orbit-dot",n.setAttribute("aria-label",`Show ${s.dataset.title||`screenshot ${c+1}`}`),n.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(n),n}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(s=>{s.disabled=!0})}bindEvents(){let s=(c,n,u,m={})=>c.addEventListener(n,u,{...this.options,...m});s(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),s(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),s(this.stage,"keydown",c=>{let n={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in n?(c.preventDefault(),this.step(n[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),s(this.stage,"pointerdown",c=>this.pointerDown(c)),s(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),s(this.stage,"pointerup",c=>this.pointerUp(c)),s(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),s(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),s(this.stage,"dragstart",c=>c.preventDefault()),s(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),s(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let n=c.target.closest(".orbit-card");n&&this.openProject(Number(n.dataset.slideIndex))}),s(this.stage,"focusin",c=>{let n=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&n>=0&&n!==this.active&&this.goTo(n)}),s(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),s(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(s=>{let c=s.querySelector(".orbit-surface"),n=c.querySelector("img"),u=Array.from({length:this.segmentCount},(m,f)=>{let x=document.createElement("span");return x.className="orbit-strip",x.setAttribute("aria-hidden","true"),x.dataset.stripIndex=f,x.style.backgroundImage=`url("${n.src}")`,c.append(x),x});return s.classList.add("is-curved"),{card:s,strips:u}})}measure(){let s=this.stage.clientWidth,c=this.stage.clientHeight,n=s<=700;this.cards[0].style.removeProperty("width");let u=this.cards[0].offsetWidth,m=t/8,f=m*.88,x=u/f;this.geometry={radius:x,panelArc:f,cardWidth:u,pitch:r(c/13,36,52),halfWindow:6.5,radiansPerSlide:m,dragUnitX:Math.max(85,s*(n?.32:.18)),dragUnitY:r(c*.13,65,105)},this.stage.style.perspective=`${(x*2.4).toFixed(3)}px`;let y=f/this.segmentCount,d=2*x*Math.sin(y/2),v=u*9/16;this.panels.forEach(({card:S,strips:h})=>{S.style.width=`${u}px`,h.forEach((p,b)=>{let P=-f/2+(b+.5)*y,L=x*Math.sin(P),A=x*(Math.cos(P)-1);p.style.width=`${(d+.6).toFixed(4)}px`,p.style.backgroundSize=`${u}px ${v}px`,p.style.backgroundPosition=`${(-b*u/this.segmentCount).toFixed(4)}px 0px`,p.style.transform=`translateX(-50%) translate3d(${L.toFixed(4)}px, 0px, ${A.toFixed(4)}px) rotateY(${(P*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:s,pitch:c,halfWindow:n,radiansPerSlide:u}=this.geometry;this.visualCards.forEach(f=>{let x=Number(f.dataset.slideIndex),y=e(x-this.position+this.count/2,this.count)-this.count/2;f.dataset.repeat&&(y+=y<0?this.count:-this.count);let d=y*u,v=Math.cos(d),S=Math.sin(d),h=(1-v)/2,p=1-y/n*.11,b=S*s*p,P=y*c,L=v*s*p-s,A=d*180/Math.PI,C=r((n-Math.abs(y))/.65,0,1);f.style.transform=`translate(-50%, -50%) translate3d(${b.toFixed(3)}px, ${P.toFixed(3)}px, ${L.toFixed(3)}px) rotateY(${A.toFixed(3)}deg) scale(${p.toFixed(4)})`,f.style.zIndex="auto",f.style.setProperty("--orbit-shade",String(h*.58)),f.style.setProperty("--orbit-fade",String(C)),f.style.opacity="1",f.style.visibility=C>0?"visible":"hidden",f.style.pointerEvents=C>.25?"auto":"none",f.toggleAttribute("data-gc-back-facing",v<0),f.dataset.offset=y.toFixed(5)});let m=e(Math.round(this.position),this.count);m!==this.active&&this.updateActive(m)}updateActive(s){let c=this.visualCards.includes(document.activeElement);this.active=s,this.cards.forEach((n,u)=>{let m=u===s;n.classList.toggle("is-centered",m),n.tabIndex=m?0:-1,n.setAttribute("aria-pressed",String(m)),this.dots[u].setAttribute("aria-current",String(m))}),this.title&&(this.title.textContent=this.cards[s].dataset.title||""),this.description&&(this.description.textContent=this.cards[s].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[s].dataset.title}, project ${s+1} of ${this.count}`),c&&!this.pointer&&this.cards[s].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(s)}goTo(s){let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(s){this.animateTo(Math.round(this.target)+s)}animateTo(s,c=0){if(this.target=Math.round(s),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(s){this.frame=0;let c=Math.min((s-this.lastTime)/1e3,.032);this.lastTime=s;let n=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=n*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(s){if(this.viewer.dialog.open||!Number.isInteger(s)||!this.cards[s])return;let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(s)}pointerDown(s){if(!s.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}s.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:s.pointerId,x:s.clientX,y:s.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:s.target.closest(".orbit-card")},this.stage.setPointerCapture(s.pointerId))}pointerMove(s){let c=this.pointer;if(!c||c.id!==s.pointerId)return;let n=s.clientX-c.x,u=s.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(n),Math.abs(u))<6)return;if(s.pointerType==="touch"&&Math.abs(n)<=Math.abs(u)){c.card=null;return}c.axis=Math.abs(u)>Math.abs(n)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}s.preventDefault();let m=c.axis==="x"?s.clientX:s.clientY,f=c.axis==="x"?n:u,x=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,y=s.pointerType==="touch"?r(x*.38,32,48):x,d=performance.now(),v=Math.max(8,d-c.lastTime),S=-(m-c.lastCoordinate)/y/v*1e3;c.speed=c.speed*.35+S*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=m,c.travel=f,this.position=c.startPosition-f/y,this.render()}pointerUp(s,c=!1){let n=this.pointer;if(!n||n.id!==s.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(n.id)&&this.stage.releasePointerCapture(n.id),!n.dragging){if(this.animateTo(Math.round(this.position)),!c&&n.buttonLink){location.assign(n.buttonLink);return}!c&&n.card&&this.openProject(Number(n.card.dataset.slideIndex));return}let u=c||performance.now()-n.lastMovement>90?0:r(n.speed,-10,10),m=Math.round(this.position+(this.reducedMotion.matches?0:u*(s.pointerType==="touch"?.32:.2))),f=this.position-n.startPosition;!c&&Math.abs(n.travel)>18&&Math.abs(f)>.12&&m===Math.round(n.startPosition)&&(m+=Math.sign(f)),this.animateTo(m,u)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:s,strips:c})=>{c.forEach(n=>n.remove()),s.classList.remove("is-curved"),s.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(s=>s.dataset.repeat).forEach(s=>s.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function o(a=document){a.querySelectorAll("[data-spiral-carousel]").forEach(s=>{s.spiralCarousel||(s.spiralCarousel=new i(s))})}window.SpiralCarousel={init:o},o()})()});var qi,Ti=te(()=>{qi=`/* Generated selector scope; source geometry declarations are unchanged. */
/* All component rules are scoped. Text inherits your site's typeface. */
.reference-carousel-shell .orbit-carousel {
  --orbit-ink: #f3f4f0;
  --orbit-muted: #989c9c;
  --orbit-line: #ffffff30;
  --orbit-accent: #c6e0ce;
  --orbit-card-width: clamp(280px, 39vw, 620px);
  --orbit-hover-scale: 1.08;
  --orbit-card-radius: 7px;
  color: var(--orbit-ink);
  width: 100%;
  isolation: isolate;
}
.reference-carousel-shell .orbit-carousel *, .reference-carousel-shell .orbit-carousel *::before, .reference-carousel-shell .orbit-carousel *::after { box-sizing: border-box; }
.reference-carousel-shell .orbit-stage {
  position: relative;
  width: 100%;
  height: clamp(370px, 31vw, 520px);
  overflow: hidden;
  overflow: clip;
  touch-action: pan-y pinch-zoom;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.reference-carousel-shell .orbit-stage:focus { outline: none; }
.reference-carousel-shell .orbit-stage:focus-visible { outline: 1px solid var(--orbit-accent); outline-offset: -8px; border-radius: 12px; }
.reference-carousel-shell .orbit-ring { position: absolute; inset: 0; }
.reference-carousel-shell .orbit-card {
  position: absolute;
  left: 50%;
  top: 53%;
  display: block;
  width: var(--orbit-card-width);
  aspect-ratio: 16 / 9;
  padding: 0;
  border: 0;
  margin: 0;
  border-radius: var(--orbit-card-radius);
  background: transparent;
  color: inherit;
  cursor: grab;
  font: inherit;
  transform-origin: center;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}
.reference-carousel-shell .orbit-surface {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: #292d2e;
  box-shadow: 0 16px 45px #00000032;
  transform: scale(1);
  transition: transform 360ms cubic-bezier(.2,.75,.25,1);
}
.reference-carousel-shell .orbit-surface::after { content: ''; position: absolute; inset: 0; border: 1px solid #ffffff1c; border-radius: inherit; background: rgb(0 0 0 / var(--orbit-shade, 0)); pointer-events: none; }
.reference-carousel-shell .orbit-card img { display: block; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.reference-carousel-shell .orbit-card:focus { outline: none; }
.reference-carousel-shell .orbit-card:focus-visible .orbit-surface { outline: 3px solid var(--orbit-accent); outline-offset: 5px; }
@media (hover: hover) and (pointer: fine) {
  .reference-carousel-shell .orbit-carousel:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface { transform: scale(var(--orbit-hover-scale)); }
}
.reference-carousel-shell .orbit-carousel:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:focus-visible .orbit-surface { transform: scale(var(--orbit-hover-scale)); }
.reference-carousel-shell .orbit-carousel.is-dragging .orbit-stage, .reference-carousel-shell .orbit-carousel.is-dragging .orbit-card { cursor: grabbing; }
.reference-carousel-shell .orbit-controls { display: flex; align-items: center; justify-content: center; gap: 36px; padding-inline: 24px; }
.reference-carousel-shell .orbit-arrow { display: grid; place-items: center; flex: 0 0 44px; width: 44px; height: 44px; border: 1px solid var(--orbit-line); border-radius: 50%; padding: 0; color: var(--orbit-ink); background: transparent; cursor: pointer; transition: background 180ms, border-color 180ms, transform 180ms; }
.reference-carousel-shell .orbit-arrow:hover { background: #ffffff0e; border-color: var(--orbit-accent); transform: scale(1.06); }
.reference-carousel-shell .orbit-arrow:active { transform: scale(.95); }
.reference-carousel-shell .orbit-arrow:focus-visible, .reference-carousel-shell .orbit-dot:focus-visible { outline: 2px solid var(--orbit-accent); outline-offset: 5px; }
.reference-carousel-shell .orbit-arrow:disabled { opacity: .35; cursor: default; transform: none; }
.reference-carousel-shell .orbit-caption { min-width: 200px; text-align: center; }
.reference-carousel-shell .orbit-title { margin: 0; font-size: 19px; font-weight: 500; line-height: 1.3; letter-spacing: -.02em; }
.reference-carousel-shell .orbit-description { margin: 7px 0 0; font-size: 12px; line-height: 1.4; color: var(--orbit-muted); }
.reference-carousel-shell .orbit-pagination { display: flex; align-items: center; justify-content: center; gap: 0; margin-top: 20px; }
.reference-carousel-shell .orbit-dot { display: grid; place-items: center; width: 24px; height: 28px; padding: 0; border: 0; background: transparent; border-radius: 6px; color: var(--orbit-muted); cursor: pointer; }
.reference-carousel-shell .orbit-dot::after { content: ''; width: 4px; height: 4px; background: currentColor; opacity: .5; border-radius: 50%; transition: opacity 180ms, transform 180ms; }
.reference-carousel-shell .orbit-dot[aria-current="true"] { color: var(--orbit-accent); }
.reference-carousel-shell .orbit-dot[aria-current="true"]::after { opacity: 1; transform: scale(1.6); }
.reference-carousel-shell .orbit-dot:hover::after { opacity: 1; transform: scale(1.4); }
.reference-carousel-shell .orbit-hint { margin: 12px 24px 0; text-align: center; color: var(--orbit-muted); font-size: 11px; line-height: 1.6; }
.reference-carousel-shell .orbit-hint span { padding-inline: 8px; }
.reference-carousel-shell .orbit-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
@media (min-width: 1700px) { .reference-carousel-shell .orbit-stage { max-width: 1900px; margin-inline: auto; } }
@media (max-width: 700px) {
  .reference-carousel-shell .orbit-carousel { --orbit-card-width: 76vw; --orbit-card-radius: 5px; }
  .reference-carousel-shell .orbit-stage { height: clamp(325px, 68vw, 440px); }
  .reference-carousel-shell .orbit-controls { gap: 18px; }
  .reference-carousel-shell .orbit-caption { min-width: 0; width: 170px; }
  .reference-carousel-shell .orbit-title { font-size: 17px; }
  .reference-carousel-shell .orbit-description { font-size: 11px; }
  .reference-carousel-shell .orbit-hint { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .reference-carousel-shell .orbit-carousel *, .reference-carousel-shell .orbit-carousel *::before, .reference-carousel-shell .orbit-carousel *::after { transition-duration: 0ms !important; }
}
@media (forced-colors: active) {
  .reference-carousel-shell .orbit-arrow { border-color: ButtonText; }
  .reference-carousel-shell .orbit-dot::after { background: ButtonText; }
  .reference-carousel-shell .orbit-dot[aria-current="true"] { outline: 1px solid Highlight; }
}

/* Version two: a tall, open helix. Shared component rules come from ../carousel.css. */
.reference-carousel-shell .spiral-carousel {
  --orbit-card-width: clamp(180px, 18vw, 240px);
  --orbit-hover-scale: 1.08;
}
.reference-carousel-shell .spiral-carousel .orbit-stage {
  height: max(500px, calc(100svh - 210px));
  max-height: 830px;
  /* Only the edges of the open spiral fade. The ends never form a ring. */
  mask-image: linear-gradient(transparent, #000 5%, #000 95%, transparent);
}
.reference-carousel-shell .spiral-carousel .orbit-card { top: 50%; }
.reference-carousel-shell .spiral-carousel .orbit-controls { margin-top: 1px; }
.reference-carousel-shell .spiral-carousel .orbit-title { font-size: 17px; }
.reference-carousel-shell .spiral-carousel .orbit-description { font-size: 11px; margin-top: 5px; }
.reference-carousel-shell .spiral-carousel .orbit-pagination { margin-top: 10px; }
.reference-carousel-shell .spiral-carousel .orbit-hint { margin-top: 3px; }
.reference-carousel-shell body .demo-header { padding-block: 19px; }
.reference-carousel-shell .demo-header a { color: inherit; text-decoration: none; text-underline-offset: 4px; }
.reference-carousel-shell .demo-header a:hover { color: #f3f4f0; text-decoration: underline; }
.reference-carousel-shell .demo-header a:focus-visible { outline: 2px solid #c6e0ce; outline-offset: 5px; }
.reference-carousel-shell .demo-version { color: #c6e0ce; }
.reference-carousel-shell body .demo-footer { margin-top: 20px; padding-block: 15px; }
@media (max-width: 700px) {
  .reference-carousel-shell .spiral-carousel { --orbit-card-width: clamp(128px, 39vw, 196px); }
  .reference-carousel-shell .spiral-carousel .orbit-stage { height: max(520px, calc(100svh - 230px)); }
  .reference-carousel-shell .spiral-carousel .orbit-hint { font-size: 10px; }
  .reference-carousel-shell .spiral-carousel .orbit-hint span { padding-inline: 3px; }
}
@media (prefers-reduced-motion: reduce) {
  .reference-carousel-shell .spiral-carousel .orbit-stage { mask-image: none; }
}

/* Vertical scrolling and pinch zoom stay native over the spiral. */
.reference-carousel-shell .spiral-carousel .orbit-stage { touch-action: pan-y pinch-zoom; -webkit-touch-callout: none; }
.reference-carousel-shell .spiral-carousel .orbit-controls { gap: 18px; margin-top: 4px; }
.reference-carousel-shell .spiral-carousel .orbit-card { cursor: pointer; }
.reference-carousel-shell .spiral-carousel.is-dragging .orbit-card { cursor: grabbing; }
.reference-carousel-shell .spiral-carousel .orbit-pagination { margin-top: 8px; }

/* Double-sided panels rotate fully around the axis; rear screenshots show through in reverse. */
.reference-carousel-shell .spiral-carousel .orbit-card,
.reference-carousel-shell .spiral-carousel .orbit-surface { backface-visibility: visible; -webkit-backface-visibility: visible; }

/* Curved screenshot panels: all strips participate in one shared 3D scene. */
.reference-carousel-shell .spiral-carousel .orbit-stage { perspective-origin: 50% 50%; }
.reference-carousel-shell .spiral-carousel .orbit-ring,
.reference-carousel-shell .spiral-carousel .orbit-card.is-curved,
.reference-carousel-shell .spiral-carousel .orbit-card.is-curved .orbit-surface { transform-style: preserve-3d; }
.reference-carousel-shell .spiral-carousel .orbit-card.is-curved { appearance: none; -webkit-appearance: none; overflow: visible; }
.reference-carousel-shell .spiral-carousel .orbit-card.is-curved .orbit-surface {
  overflow: visible;
  background: transparent;
  box-shadow: none;
}
.reference-carousel-shell .spiral-carousel .orbit-card.is-curved .orbit-surface > img { visibility: hidden; }
.reference-carousel-shell .spiral-carousel .orbit-card.is-curved .orbit-surface::after { content: none; }
.reference-carousel-shell .spiral-carousel .orbit-strip {
  position: absolute;
  left: 50%;
  top: 0;
  display: block;
  height: 100%;
  background-repeat: no-repeat;
  transform-origin: center;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
  opacity: var(--orbit-fade, 1);
}
.reference-carousel-shell .spiral-carousel .orbit-strip::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / var(--orbit-shade, 0));
  border-block: 1px solid #ffffff16;
  border-radius: inherit;
  pointer-events: none;
}
.reference-carousel-shell .spiral-carousel .orbit-strip:first-of-type { border-radius: var(--orbit-card-radius) 0 0 var(--orbit-card-radius); }
.reference-carousel-shell .spiral-carousel .orbit-strip:last-of-type { border-radius: 0 var(--orbit-card-radius) var(--orbit-card-radius) 0; }

`});var Fi,Ri=te(()=>{Fi=`.project-dialog {
  --viewer-ink: #f3f4f0;
  --viewer-muted: #a3aaa6;
  width: min(1220px, 94vw);
  max-width: none;
  max-height: 92svh;
  padding: 0;
  border: 1px solid #ffffff24;
  border-radius: 12px;
  color: var(--viewer-ink);
  background: #1b1f1e;
  font-family: Arial, Helvetica, sans-serif;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #68716c #1b1f1e;
}
.project-dialog[open] { animation: project-open 220ms cubic-bezier(.2,.75,.25,1) both; }
.project-dialog::backdrop { background: #080b0be8; backdrop-filter: blur(8px); }
.project-dialog *, .project-dialog *::before, .project-dialog *::after { box-sizing: border-box; }
.project-topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; position: sticky; top: 0; z-index: 5; min-height: 64px; padding: 10px 18px 10px 26px; background: #1b1f1e; border-bottom: 1px solid #ffffff16; }
.project-frame-label { color: var(--viewer-muted); font-size: 12px; letter-spacing: .01em; }
.project-icon-button { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 1px solid #ffffff35; border-radius: 50%; background: #151a18e8; color: var(--viewer-ink); cursor: pointer; transition: background 150ms, border-color 150ms; }
.project-icon-button:hover { background: #35453b; border-color: #c6e0ce; }
.project-icon-button:active { background: #496151; }
.project-icon-button:focus-visible, .project-thumbnail:focus-visible, .project-notes summary:focus-visible { outline: 2px solid #c6e0ce; outline-offset: 4px; }
.project-close { border-color: transparent; background: transparent; }
.project-layout { display: grid; grid-template-columns: minmax(0, 1fr) 310px; }
.project-gallery { min-width: 0; padding: 26px; background: #101413; }
.project-image-stage { position: relative; display: grid; align-items: center; width: 100%; aspect-ratio: 16 / 9; touch-action: pan-y pinch-zoom; }
.project-image { display: block; width: 100%; height: 100%; aspect-ratio: 16 / 9; object-fit: contain; border-radius: 5px; user-select: none; -webkit-user-select: none; }
.project-gallery-prev, .project-gallery-next { position: absolute; top: calc(50% - 22px); box-shadow: 0 2px 12px #0004; }
.project-gallery-prev { left: 12px; }
.project-gallery-prev svg { transform: rotate(180deg); }
.project-gallery-next { right: 12px; }
.project-thumbnails { display: flex; gap: 10px; flex-wrap: wrap; padding-top: 18px; }
.project-thumbnail { width: 94px; aspect-ratio: 16 / 9; border: 2px solid transparent; border-radius: 4px; padding: 0; background: transparent; overflow: hidden; cursor: pointer; opacity: .55; transition: opacity 150ms, border-color 150ms; }
.project-thumbnail img { display: block; width: 100%; height: 100%; object-fit: cover; }
.project-thumbnail[aria-current="true"] { opacity: 1; border-color: #c6e0ce; }
.project-thumbnail:hover { opacity: 1; }
.project-info { padding: 28px 26px; }
.project-category { margin: 0 0 12px; color: #c6e0ce; font-size: 12px; line-height: 1.5; }
.project-title { margin: 0 0 20px; font-size: 34px; font-weight: 500; line-height: 1.05; letter-spacing: -.05em; }
.project-summary { margin: 0; color: #c3cbc5; font-size: 14px; line-height: 1.7; }
.project-services { margin-top: 28px; padding-top: 22px; border-top: 1px solid #ffffff20; }
.project-services h3 { margin: 0 0 10px; font-size: 12px; font-weight: 500; color: var(--viewer-muted); }
.project-services p { margin: 0; font-size: 13px; line-height: 1.7; }
.project-notes { margin-top: 24px; border-block: 1px solid #ffffff20; }
.project-notes summary { padding-block: 17px; font-size: 13px; cursor: pointer; }
.project-notes summary:hover { color: #c6e0ce; }
.project-notes ul { margin: 0 0 18px; padding-left: 18px; color: #c3cbc5; font-size: 13px; line-height: 1.7; }
.project-notes li + li { margin-top: 10px; }
.project-demo-note { margin: 24px 0 0; font-size: 11px; color: var(--viewer-muted); }
@keyframes project-open { from { opacity: 0; transform: translateY(12px) scale(.96); } to { opacity: 1; transform: none; } }
@media (max-width: 760px) {
  .project-dialog { width: 100%; height: 100dvh; max-height: 100dvh; margin: 0; border: 0; border-radius: 0; }
  .project-topbar { min-height: 64px; padding: max(10px, env(safe-area-inset-top)) 14px 10px 20px; }
  .project-layout { grid-template-columns: minmax(0, 1fr); }
  .project-gallery { padding: 18px 16px 22px; }
  .project-gallery-prev { left: 6px; }
  .project-gallery-next { right: 6px; }
  .project-thumbnails { padding-top: 14px; }
  .project-thumbnail { width: 82px; }
  .project-info { padding: 26px 24px max(30px, env(safe-area-inset-bottom)); }
  .project-title { font-size: 34px; }
  .project-summary { max-width: 50ch; }
}
@media (prefers-reduced-motion: reduce) { .project-dialog[open] { animation: none; } .project-dialog * { transition: none !important; } }
`});var Di,Bi=te(()=>{Di=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
.gc-spiral-root .slot-carousel{--orbit-ink:var(--gc-ink,#20252d);--orbit-muted:var(--gc-muted,#65717c);--orbit-line:var(--gc-line,#bfc9d1);--orbit-accent:var(--gc-accent,#476dc2);--orbit-card-radius:0px;--orbit-hover-scale:1}
.gc-spiral-root .slot-carousel .orbit-stage{min-height:0;max-height:none;height:680px;mask-image:linear-gradient(transparent,#000 5%,#000 95%,transparent)}
.gc-spiral-root .orbit-controls{justify-content:center;padding:12px 0 0;margin:0;gap:12px}
.gc-spiral-root .orbit-pagination[hidden]{display:none!important}
.gc-spiral-root .gc-spiral-caption{margin:12px 16px 4px;text-align:center;font-family:inherit;font-size:14px;font-weight:500;line-height:1.4;min-height:20px}
.gc-spiral-root .gc-spiral-caption-space{display:grid;min-width:0}
.gc-spiral-root .gc-spiral-caption-space[hidden]{display:none}
.gc-spiral-root .gc-spiral-caption-space>.gc-spiral-caption{grid-area:1/1;min-width:0;letter-spacing:-.02em}
.gc-spiral-root .gc-spiral-caption-measure{visibility:hidden;pointer-events:none}
.gc-spiral-root .gc-spiral-caption,
.gc-spiral-dialog .project-info{overflow-wrap:anywhere}
.gc-spiral-dialog .gc-spiral-source-link{max-width:100%}
.gc-spiral-root .orbit-card:focus-visible .orbit-surface{transform:scale(1)}
.gc-spiral-root .orbit-carousel:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
.gc-spiral-empty{padding:48px 24px;text-align:center}
.gc-spiral-dialog .gc-spiral-source-link{display:inline-flex;align-items:center;min-height:44px;margin-top:24px;color:inherit;text-underline-offset:4px}
.gc-spiral-dialog .gc-spiral-source-link[hidden]{display:none}
.gc-spiral-dialog .gc-spiral-source-link:focus-visible{outline:2px solid #c6e0ce;outline-offset:4px}
.gc-spiral-dialog [hidden]{display:none!important}
.gc-spiral-reduced,.gc-spiral-reduced *{animation:none!important;transition:none!important}
@media(prefers-reduced-motion:reduce){.gc-spiral-root .slot-carousel .orbit-stage{mask-image:none}}

/* A single image per fallback card avoids seams between rotated CSS strips. */
.gc-spiral-root .spiral-carousel .orbit-strip { display: none; }
.gc-spiral-root .spiral-carousel .orbit-card.is-curved .orbit-surface > img {
  visibility: inherit;
  opacity: var(--orbit-fade, 1);
}
.gc-spiral-root .spiral-carousel[data-image-fit="fit"] .orbit-card img { object-fit: contain; }

.gc-spiral-root .orbit-surface > img {border-radius:var(--orbit-card-radius)}
.gc-spiral-root .spiral-carousel .orbit-card.is-curved .orbit-surface::after {
  content:"";border:var(--gc-line-size) solid var(--orbit-rim);border-radius:var(--orbit-card-radius);background:none;
}
.gc-spiral-root [data-back-face=solid] .orbit-card[data-gc-back-facing] .orbit-surface > img {opacity:0}
.gc-spiral-root [data-back-face=solid] .orbit-card[data-gc-back-facing] .orbit-surface {background:var(--gc-back-color);border-radius:var(--orbit-card-radius)}

.gc-item-details {display:grid;text-align:center}
.gc-item-details[hidden],.gc-item-details [hidden]{display:none!important}
.gc-item-detail {grid-area:1/1;min-width:0;overflow-wrap:anywhere}
.gc-item-description {margin:.35em 0;color:var(--gc-detail-color);font-size:var(--gc-detail-size)}
.gc-item-detail a {display:inline-block;color:inherit;text-decoration:underline}
.gc-item-details,.gc-spiral-caption-space {padding-inline:var(--gc-detail-padding)}
.gc-item-details:not([hidden]),.gc-spiral-caption-space:not([hidden]) {padding-block:var(--gc-detail-padding)}
.gc-spiral-root [data-show-image=false] .orbit-surface img {visibility:hidden!important}
.gc-spiral-root [data-show-image=false] .orbit-surface {background:var(--gc-back-color)}
.gc-stage .gc-spiral-dialog,.gc-stage .gc-dialog {border-radius:var(--gc-popup-radius,12px)}
.gc-stage[data-gc-popup-padding] :is(.project-info,.gc-dialog-copy){padding:var(--gc-popup-padding)}
.gc-stage[data-gc-popup-colors] :is(.project-dialog,.project-info,.project-topbar,.gc-dialog,.gc-dialog-copy){
  background:var(--gc-popup-color);color:var(--gc-popup-ink)}
.gc-stage[data-gc-popup-colors] :is(.project-title,.project-summary,.project-frame-label,.gc-dialog-copy h2){color:var(--gc-popup-ink)}
.gc-spiral-dialog .project-layout:has(>[hidden]){grid-template-columns:1fr}
@media (hover:hover) and (prefers-reduced-motion:no-preference){
  .gc-spiral-root .spiral-carousel[data-hover-effect=zoom]:not(.has-webgl-carousel) .orbit-card:hover .orbit-surface{transform:scale(var(--gc-hover-scale))}
  .gc-spiral-root .spiral-carousel[data-hover-effect=lift]:not(.has-webgl-carousel) .orbit-card:hover .orbit-surface{transform:translateY(var(--gc-hover-rise))}
}

.gc-spiral-root .orbit-webgl,.gc-spiral-root .spiral-carousel:not(.has-webgl-carousel) .orbit-surface {filter:var(--gc-shadow-filter,none)}
.gc-spiral-root .spiral-carousel:not(.has-webgl-carousel) .orbit-surface img {filter:var(--gc-image-filter,none)}
.gc-spiral-root .orbit-carousel{box-sizing:border-box}
.gc-block-fit .gc-spiral-root .orbit-stage{height:max(1px,calc(var(--gc-block-stage-height) - 2 * var(--gc-card-inset,0px)))!important}
.gc-spiral-root [data-composite=true][data-show-image=false] .orbit-surface img{visibility:inherit!important}
.gc-spiral-root .orbit-carousel button.gc-transport svg{width:var(--gc-icon-size);height:var(--gc-icon-size)}
.gc-spiral-root .orbit-carousel button.gc-transport{padding:var(--gc-button-padding);min-width:calc(var(--gc-icon-size) + 2 * var(--gc-button-padding));min-height:calc(var(--gc-icon-size) + 2 * var(--gc-button-padding))}
.gc-spiral-root [data-hide-control-background=true] button.gc-transport{background:transparent;border-color:transparent}
.gc-spiral-root .orbit-surface{transition-duration:var(--gc-hover-time)}
.gc-spiral-root [data-composite=true]:not(.has-webgl-carousel) .orbit-surface{aspect-ratio:var(--gc-art-aspect,16/9)}
.gc-stage .gc-spiral-root [data-custom-control-size=true] button.gc-transport{width:calc(var(--gc-icon-size) + 2 * var(--gc-button-padding));height:calc(var(--gc-icon-size) + 2 * var(--gc-button-padding));flex-basis:calc(var(--gc-icon-size) + 2 * var(--gc-button-padding))}
`});var Ni={};Co(Ni,{mountSpiral:()=>lr,spiralControls:()=>bt,spiralDefaults:()=>Ye});function uo(t,e,r){for(let i of Wi)t.removeAttribute(i);for(let[i,o]of Object.entries(e.imageAttrs||{}))Wi.has(i)&&o!=null&&t.setAttribute(i,String(o));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&r?.(t)}function ho(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function lr(t){let{host:e,onChange:r=()=>{},loadImage:i}=t,o=t.items.filter(z=>z.src||z.title||z.description||z.link),a={...Ye,...t.options},s=!1;if(!o.length){let z=document.createElement("p");return z.className="gc-spiral-empty",z.textContent="Add content to this source to preview the spiral.",e.append(z),{destroy(){z.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let n=document.createElement("div");n.className="orbit-carousel spiral-carousel slot-carousel",n.dataset.spiralCarousel="",n.id=`gc-spiral-${++sr}`,n.setAttribute("role","region"),n.setAttribute("aria-label","Spiral gallery"),n.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let u=n.querySelector(".orbit-stage"),m=n.querySelector(".orbit-ring"),f=n.querySelector("[data-orbit-toggle]");Xe(n.querySelector("[data-orbit-prev]"),"previous"),Xe(n.querySelector("[data-orbit-next]"),"next"),Xe(f,"playback");let x=n.querySelector(".gc-spiral-caption"),y=document.createElement("div");y.className="gc-spiral-caption-space",x.before(y),y.append(x);let d=o.some(z=>!!z.title);for(let z of new Set(o.map(G=>G.title).filter(Boolean))){let G=x.cloneNode(!1);G.setAttribute("aria-hidden","true"),G.classList.add("gc-spiral-caption-measure"),G.textContent=z,y.append(G)}let v=document.createElement("div");v.className="gc-item-details",y.after(v);let S=o.map(z=>{let G=document.createElement("div");G.className="gc-item-detail";let O=document.createElement("p");O.className="gc-item-description",O.textContent=Ht(z.description);let _=document.createElement("a"),T=ho(z.link);return T&&(_.href=T),_.textContent=z.buttonLabel||"Open link",G.append(O,_),v.append(G),{group:G,body:O,link:_,href:T}}),h="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),p=[];o.forEach((z,G)=>{let O=document.createElement("button");O.className="orbit-card",O.type="button",O.dataset.title=z.title||"",O.dataset.imageSource=z.src||h,O.setAttribute("aria-label",z.title?`View ${z.title}`:`View image ${G+1}`);let _=document.createElement("span");_.className="orbit-surface";let T=document.createElement("img");z.src?uo(T,z):T.src=h,p.push(O),O.dataset.buttonLink=ho(z.link)||"",_.append(T),O.append(_),m.append(O)}),c.append(n),e.append(c);let b=new Map,P=0,L="";async function A(){let z=JSON.stringify(a);if(L===z)return;L=z;let G=++P,O=o.some(Y=>Rt(Y,a));if(n.dataset.composite=String(O),!O){for(let[Y,ne]of p.entries())if(ne.artwork=null,ne.buttonBounds=null,ne.hasAttribute("data-artwork")){for(let J of m.querySelectorAll('[data-slide-index="'+Y+'"] img'))J.src=o[Y].src||h;ne.removeAttribute("data-artwork")}return}let _=Y=>!Y||!a.showImage?null:(b.has(Y)||b.set(Y,new Promise(ne=>{let J=new Image;J.crossOrigin="anonymous",J.onload=()=>ne(J),J.onerror=()=>ne(null),J.src=Y})),b.get(Y));if(await new Promise(requestAnimationFrame),s||G!==P)return;let T=await Promise.all(o.map(async Y=>({item:{...Y,plain:Ht(Y.description)},image:await _(Y.src)})));if(s||G!==P)return;let V=a.typeSource==="native"?e.closest(".user-items-list-section"):null,$=getComputedStyle(V?.querySelector(".list-item-content__title")||x),K=getComputedStyle(V?.querySelector(".list-item-content__description p")||S[0].body),ae=getComputedStyle(e).color,F=_o(T,a,{family:$.fontFamily,bodyFamily:K.fontFamily,ink:ae,titleSize:parseFloat($.fontSize)||16,titleWeight:$.fontWeight,size:parseFloat(K.fontSize)||16,weight:K.fontWeight,accent:getComputedStyle(f).color,buttonInk:getComputedStyle(f).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(f).backgroundColor});F.forEach(({canvas:Y,buttonBounds:ne},J)=>{if(p[J].artwork=Y,p[J].buttonBounds=ne,p[J].setAttribute("data-artwork",""),n.dataset.renderer!=="webgl"){let ce=Y.toDataURL();for(let ue of n.querySelectorAll('.orbit-card[data-slide-index="'+J+'"] img'))ue.src=ce}}),m.querySelectorAll("[data-repeat]").forEach(Y=>{let ne=p[Number(Y.dataset.slideIndex)];Y.buttonBounds=ne?.buttonBounds}),n.dataset.cardAspect=String(F[0].aspect),n.style.setProperty("--gc-art-aspect",F[0].aspect),n.dispatchEvent(new Event("artwork-change"))}let C=Yo(c,n.id),w=()=>{let z=a.textPlacement==="card",G=o.some(O=>Rt(O,a));C({...a,shadowEnabled:a.shadowEnabled&&!G,imageTint:a.overlayEnabled&&!G?a.imageTint:"#00000000"}),a.titleCustom?e.dataset.gcTitlePalette=a.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),y.style.textAlign=a.titleAlign,c.style.setProperty("--gc-card-inset",a.carouselPadding+"px"),n.style.padding=a.carouselPadding+"px",n.style.overflow=a.surfaceRadius?"hidden":"",n.style.borderRadius=a.surfaceRadius+"px",n.style.backgroundColor=a.surfaceEnabled?a.surfaceColor:"",n.style.setProperty("--gc-hover-time",a.hoverDuration+"ms"),n.dataset.hoverDuration=a.hoverDuration,n.dataset.mirrorColor=a.mirrorOverlay?a.mirrorColor:"#00000000",n.dataset.playbackMode=a.playbackMode,n.dataset.rate=a.cardsPerMinute,n.dataset.interval=a.duration,n.dataset.direction=a.direction,n.dataset.pauseOnHover=String(a.pauseOnHover),n.dataset.customControlSize=String(!!(a.controlPadding||a.controlIconSize)),n.dataset.hideControlBackground=String(!a.controlBackground),n.style.setProperty("--gc-icon-size",a.controlIconSize?a.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),n.style.setProperty("--gc-button-padding",a.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let O of y.children)O.style.textAlign=a.titleCustom?a.titleAlign:"",O.style.marginBottom=a.titleGap?a.titleGap+"px":"";for(let{body:O,link:_}of S)O.style.textAlign=a.bodyCustom?a.descriptionAlign:"",O.style.fontWeight=a.bodyCustom?a.descriptionWeight:"",O.style.color=a.bodyCustom&&a.descriptionCustom?a.descriptionColor:"inherit",O.style.fontSize=a.bodyCustom&&a.descriptionSize?a.descriptionSize+"rem":"",_.style.marginTop=a.buttonGap+"px";n.dataset.showImage=String(a.showImage!==!1),n.dataset.imageTint=a.overlayEnabled?a.imageTint:"#00000000",n.dataset.hoverEffect=a.reducedMotion?"none":a.hoverEffect,n.dataset.hoverAmount=a.hoverAmount;for(let[O,{body:_,link:T,href:V}]of S.entries())_.hidden=!a.showDescription||!_.textContent,T.hidden=!a.showButton||!V||!o[O].buttonLabel;v.hidden=z||S.every(({body:O,link:_})=>O.hidden&&_.hidden),n.dataset.edgeMode=a.edgeMode,n.dataset.backFace=a.backFace,n.dataset.cornerRadius=a.spiralRadius,n.dataset.borderWidth=a.cardBorderEnabled?a.borderWidth:0,n.dataset.borderColor=a.spiralRim,n.dataset.backColor=a.backColor,n.style.setProperty("--orbit-card-radius",a.spiralRadius+"px"),n.style.setProperty("--orbit-rim",a.spiralRim),c.style.width=`${Ke(a.containerWidth,100,20,100)}%`,u.style.height=a.heightMode==="viewport"?Ke(a.viewportHeight,65,15,100)+"vh":a.heightMode==="auto"?"clamp(160px,calc("+a.cardWidth+"px + "+a.spiralRise*4+"px),90svh)":Ke(a.stageHeight,680,120,1600)+"px",n.style.setProperty("--orbit-card-width",`${Ke(a.cardWidth,280,80,720)}px`),n.dataset.spiralWidth=String(Ke(a.spiralWidth,87,20,100)),n.dataset.cardWidth=String(Ke(a.cardWidth,280,80,720)),n.dataset.rise=String(Ke(a.spiralRise,52,a.spiralRiseUnit==="percent"?1:8,a.spiralRiseUnit==="percent"?50:500)),n.dataset.riseUnit=a.spiralRiseUnit==="percent"?"percent":"px",(!p[0].artwork||!o.some(O=>Rt(O,a)))&&(n.dataset.cardAspect=String(cr(a.aspectRatio))),n.dataset.imageFit=a.fit==="contain"||a.fit==="fit"?"fit":"fill",n.dataset.imagePadding=String(Ke(a.imagePadding,0,0,20)),n.dataset.slotGap=String(Ke(a.spiralGap,3,0,16)),n.dataset.showSlots=String(!!a.showSlots),y.hidden=z||!a.showTitles||!d,A(),n.classList.toggle("gc-spiral-reduced",!!a.reducedMotion)};w();let D=o.map(z=>({title:z.title||"",category:"",description:Ht(z.description),services:[],notes:[],gallery:[{file:z.src||h,label:"Image"}]}));class W extends Ft{constructor(G,O){super(G,O,D),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(G){let O=o[G];if(!O||a.clickAction==="none"||a.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let _=ho(O.link);if(a.clickAction==="link"||a.clickAction==="source"){_&&location.assign(_);return}if(O.postUrl){t.openPost(O,G);return}super.open(G);let T=this.dialog.querySelector(".project-title");T.hidden=!O.title||!a.popupTitle,T.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",T.id),this.dialog.querySelector(".project-summary").hidden=!a.popupDescription||!Ht(O.description),this.dialog.querySelector(".project-gallery").hidden=!a.popupImage||!O.src,this.dialog.querySelector(".project-frame-label").hidden=!a.popupTitle,this.dialog.querySelector(".project-info").hidden=T.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(_&&a.popupButton),this.sourceLink.hidden=!_||!a.popupButton,_?(this.sourceLink.href=_,this.sourceLink.textContent=O.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!a.reducedMotion)}showFrame(G){super.showFrame(G);let O=D.indexOf(this.project),_=o[O];_?.src&&(uo(this.image,_,i),this.dialog.querySelectorAll(".project-thumbnail img").forEach(T=>uo(T,_,i)),this.dialog.querySelector(".project-frame-label").textContent=_.title||"")}}let M=window.ProjectViewer;window.ProjectViewer=W;try{nr.init(c)}finally{M===void 0?delete window.ProjectViewer:window.ProjectViewer=M}let I=n.spiralCarousel;n.querySelectorAll("img").forEach(z=>i?.(z));let B=()=>{for(let[z,G]of p.entries()){if(!G.artwork)continue;let O=G.artwork.toDataURL();for(let _ of m.querySelectorAll('[data-slide-index="'+z+'"] img'))_.src=O}};u.addEventListener("webglcontextlost",B,!0);let U=I.updateActive;I.updateActive=function(z){U.call(this,z),S.forEach(({group:G},O)=>{G.inert=O!==z,G.style.visibility=O===z?"visible":"hidden"}),this.status.textContent=`${o[z]?.title?`${o[z].title}, `:""}image ${z+1} of ${o.length}`,r(z)},I.updateActive(I.active);let X=I.animateTo;I.animateTo=function(z,G=0){a.reducedMotion?(this.target=Math.round(z),this.settleImmediately()):X.call(this,z,G)};let R=zi(I,{textureSource:z=>z.dataset.imageSource}),H=Zo(n,I,{pauseOnHover:!1,interactionRestMs:0});function re(z){a.autoplay=!!z,I.manuallyPaused=!z||!!a.reducedMotion,I.resumeAt=0,f.disabled=!!a.reducedMotion||I.reducedMotion.matches||o.length<2,f.dataset.paused=String(I.manuallyPaused),f.setAttribute("aria-label",I.manuallyPaused?"Resume carousel":"Pause carousel"),I.syncAutoplay()}return re(!!a.autoplay),{update(z){let G=a;a={...a,...z},w(),I.measure(),n.dispatchEvent(new Event("playground-change")),n.dispatchEvent(new Event("slot-guides-change")),I.updateActive(I.active),(G.autoplay!==a.autoplay||G.reducedMotion!==a.reducedMotion)&&re(!!a.autoplay)},goTo(z){s||I.goTo(z)},setPlaying:re,getMetrics(){try{return JSON.parse(n.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return n.dataset.renderer||"loading"},destroy(){s||(s=!0,u.removeEventListener("webglcontextlost",B,!0),H(),R(),I.destroy(),c.remove())}}}var nr,sr,Ke,cr,Ht,Wi,Hi=te(async()=>{Xo();Vo();Ko();qt();Bt();Bt();Qo();await ji();Ii();nr=window.SpiralCarousel,sr=0,Ke=(t,e,r,i)=>Number.isFinite(Number(t))?Math.max(r,Math.min(i,Number(t))):e,cr=t=>{if(typeof t=="number"&&t>0)return t;let[e,r]=String(t||"16:9").split(":").map(Number);return e>0&&r>0?e/r:16/9},Ht=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Wi=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Oi(t){let{host:e}=t,r={...t.options},i=null,o=null,a=!1,s="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),Hi().then(()=>Ni).then(n=>{a||(c.remove(),o=n.mountSpiral({...t,options:r}),i!==null&&o.goTo?.(i))}).catch(n=>{a||(s="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",n))}),{update(n){r={...r,...n},o?.update?.(r)},goTo(n){i=n,o?.goTo?.(n)},setPlaying(n){r.autoplay=n,o?.setPlaying?.(n)},getStatus(){return o?.getStatus?.()??s},getMetrics(){return o?.getMetrics?.()??null},destroy(){a=!0,c.remove(),o?.destroy()}}}var $i=te(()=>{});function pt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let r=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(r.protocol)?r.href:""}catch{return""}}function $t(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(r=>r.remove()),e.content.querySelectorAll("*").forEach(r=>{for(let i of[...r.attributes])(/^on/i.test(i.name)||i.name==="style"||i.name==="id")&&r.removeAttribute(i.name);if(r.hasAttribute("href")){let i=pt(r.getAttribute("href"));i?r.setAttribute("href",i):r.removeAttribute("href")}}),e.innerHTML}function Gi(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let r of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(r)&&(e[r]=t.getAttribute(r));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function wt(t,e){let r=Ot[e];if(!t||!r)return null;let i=t.closest(r);if(!i){let n=t.querySelectorAll(r);if(n.length!==1)return null;i=n[0]}let o=e==="list"?i:i.querySelector(":scope > .sqs-block-content");if(!o)return null;let a=n=>Array.from(o.querySelectorAll(n)).filter(u=>u.closest(r)===i&&(!u.closest(".gc-embed")||u.hasAttribute("data-gc-native-track")));if(e==="summary"){let n=a(".summary-block-wrapper");if(n.length!==1)return null;let u=a(".summary-item").filter(m=>n[0].contains(m)&&!m.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:i,originals:n,rows:u}}let s=e==="list"?".list-item":".slide",c=a(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=a(".sqs-gallery")),c.length===1){let n=Array.from(c[0].querySelectorAll(s)).filter(u=>u.closest(r)===i&&!u.hasAttribute("data-gc-repeat"));return{source:i,originals:c,rows:n}}if(e==="gallery"&&!c.length){let n=a(s);if(n.length&&n.every(u=>u.parentElement===n[0].parentElement))return{source:i,originals:n,rows:n}}return null}function gt(t,e,r=location.href){return(wt(t,e)?.rows||[]).map(o=>{let a=o.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let u=o.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),m=pt(u?.getAttribute("href"),r);return{...Gi(a),title:o.querySelector(".summary-title")?.textContent.trim()||a?.alt||"",description:$t(o.querySelector(".summary-excerpt")?.innerHTML),link:m,postUrl:m,buttonLabel:"Read post"}}let s=o.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=$t(o.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),n=o.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Gi(a),title:s,description:c,link:pt(n?.getAttribute("href"),r),buttonLabel:e==="list"&&n?.textContent.trim()||""}}).filter(o=>e==="summary"?!!o.link:e==="list"||!!(o.src||o.title||o.link))}function dr(t,e){let r=e==="list"?t.getAttribute("data-section-id"):t.id;if(!r?.trim())return"";let i=e==="list"?'section[data-section-id="'+CSS.escape(r)+'"]':"#"+CSS.escape(r);return t.ownerDocument.querySelectorAll(i).length===1?i:""}function Ui(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Ot).join(","))).filter(r=>!r.closest(".gc-embed")).flatMap(r=>{let i=r.matches(Ot.list)?"list":r.matches(Ot.summary)?"summary":"gallery",o=dr(r,i);if(!o||!wt(r,i))return[];let a=++e[i];return{name:(i==="list"?"List Section":i==="summary"?"Summary Block":"Gallery Block")+(a>1?" "+a:""),type:i,selector:o,root:r,items:gt(r,i)}})}function Gt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let r=t.ownerDocument.defaultView?.ImageLoader;if(r&&typeof r.load=="function")try{r.load(t,{load:!0})}catch(i){console.warn("Gallery Studio: native image loader",i)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+_i(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function _i(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function mo(t){let e=document.createElement("img");for(let[r,i]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(r)&&e.setAttribute(r,i);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=_i(t.imageAttrs?.["data-image-focal-point"]),e}var Ot,fo=te(()=>{Ot={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function Xi(t,e,r){let i=new WeakMap,o=new WeakMap,a=Array.from(e.childNodes),s=r.map(S=>Array.from(S.childNodes)),c=[];function n(S,h){S&&c.push([S,h.map(p=>[p,S.getAttribute(p)])])}let u=new Set,m=!1;function f(){n(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let S of r)n(S,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),m=!0}function x(S,h,p,b,P){let L=r[h],A=u.has(h),C=A?L.cloneNode(!1):L,w=document.createElement("div");if(w.className="gc-card gc-native-card",w.tabIndex=0,w.setAttribute("role","group"),S.imageAttrs?.["data-image-focal-point"]){let[X,R]=S.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(X)&&Number.isFinite(R)&&w.style.setProperty("--gc-native-focus",X*100+"% "+R*100+"%")}let D=S.title||S.alt||`Item ${h+1}`;if(w.setAttribute("aria-label",D),A){C.removeAttribute("id"),C.setAttribute("data-gc-repeat","");for(let X of s[h])w.append(X.cloneNode(!0));w.querySelectorAll("[id]").forEach(X=>X.removeAttribute("id"))}else u.add(h),w.append(...s[h]);C.replaceChildren(w),i.set(w,C);let W=w.querySelector(".list-item-media"),M=w.querySelector(".list-item-content"),I=w.querySelector(".list-item-content__title"),B=w.querySelector(".list-item-content__description");if(!A){for(let X of[W,M])n(X,["class"]);for(let X of[I,B])n(X,["class","hidden"])}if(W?.classList.add("gc-card-media"),M?.classList.add("gc-card-copy"),b.typeSource!=="native"&&(I?.classList.add("gc-card-title"),B?.classList.add("gc-card-description")),I&&(!b.showTitles||p.caption===!1)&&(I.hidden=!0),B&&!p.description&&(B.hidden=!0),p.thumbnail){let X=w.querySelector(".list-item-content__button-wrapper")||w.querySelector(".list-item-content__button");X&&(A||n(X,["hidden"]),X.hidden=!0),M&&(!S.title||p.caption===!1)&&(A||n(M,["hidden"]),M.hidden=!0)}let U=Array.from(w.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!A)for(let X of U)n(X,["tabindex"]);if(o.set(w,U.map(X=>[X,X.getAttribute("tabindex")])),b.clickAction!=="none"&&(b.clickAction!=="link"||S.link)){let X=document.createElement("button");X.type="button",X.className="gc-native-action",X.tabIndex=-1,X.setAttribute("aria-label",(b.clickAction==="link"?"Open link for ":"Open ")+D),X.addEventListener("click",()=>P(S,h)),w.append(X),w.setAttribute("aria-keyshortcuts","Enter Space"),w.addEventListener("click",R=>{R.defaultPrevented||R.target.closest("a,button,input,select,textarea,label")||P(S,h)}),w.addEventListener("keydown",R=>{R.target!==w||!["Enter"," "].includes(R.key)||(R.preventDefault(),X.click())})}return w}function y(S){let h=S.tabIndex===0&&S.getAttribute("aria-hidden")!=="true";for(let[p,b]of o.get(S)||[]){let P=h?b:"-1";p.getAttribute("tabindex")!==P&&(P===null?p.removeAttribute("tabindex"):p.setAttribute("tabindex",P))}}function d(S){if(!m)return;let h=S!=="native";e.querySelectorAll(".list-item-content__title").forEach(p=>p.classList.toggle("gc-card-title",h)),e.querySelectorAll(".list-item-content__description").forEach(p=>p.classList.toggle("gc-card-description",h))}function v(){if(e.classList.remove("gc-native-items-hidden"),!!m){r.forEach((S,h)=>S.replaceChildren(...s[h])),e.replaceChildren(...a);for(let[S,h]of c)for(let[p,b]of h)S.getAttribute(p)!==b&&(b===null?S.removeAttribute(p):S.setAttribute(p,b));t.after(e),c.length=0,u.clear(),m=!1}}return{track:e,begin:f,makeCard:x,slot:S=>i.get(S),syncFocus:y,setType:d,restore:v}}var Yi=te(()=>{});function Vi(t,e,r){if(!r.closest(".fluid-engine > .fe-block"))return()=>{};r.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let o=0,a=!1,s=new WeakSet,c=x=>{x&&!s.has(x)&&(s.add(x),u.observe(x))},n=()=>{!o&&!a&&(o=requestAnimationFrame(f))},u=new ResizeObserver(n),m=new MutationObserver(n);function f(){if(o=0,a||!e.isConnected)return;let x=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!x)return;let y=x.classList.contains("gc-carousel-stage"),d=x.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(x);let v=0;for(let h of d.children){if(h===x||h.contains(x))continue;c(h);let p=getComputedStyle(h);p.display==="none"||["absolute","fixed"].includes(p.position)||(v+=h.offsetHeight+(parseFloat(p.marginTop)||0)+(parseFloat(p.marginBottom)||0))}let S=Math.max(1,t.clientHeight-v);if(y){let h=x.parentElement;h.classList.contains("gc-block-stage-window")||(h=document.createElement("div"),h.className="gc-block-stage-window",x.before(h),h.append(x));let p=Math.min(1,S/Math.max(1,x.offsetHeight));h.style.height=S+"px",x.style.setProperty("--gc-block-scale",String(p)),x.style.setProperty("--gc-block-top",Math.max(0,(S-x.offsetHeight*p)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",S+"px")}return c(t),m.observe(e,{childList:!0,subtree:!0}),n(),()=>{a=!0,cancelAnimationFrame(o),u.disconnect(),m.disconnect(),r.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let x=e.querySelector(".gc-block-stage-window");if(x){let y=x.firstElementChild;y.style.removeProperty("--gc-block-scale"),y.style.removeProperty("--gc-block-top"),x.replaceWith(y)}}}var Ji=te(()=>{});function Ki(t,e,r,i){let o=r.ownerDocument,a=o.defaultView,s=i!=="list"?r.closest(".fluid-engine > .fe-block"):null;s?.classList.add("gc-viewport-cell");let c=[],n=s||r;for(let f=t.parentElement;f&&(["hidden","clip","auto","scroll"].includes(a.getComputedStyle(f).overflowX)&&c.push(f),f!==n);f=f.parentElement);function u(){let f=o.documentElement.clientWidth;if(!f||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let v=d.getBoundingClientRect().left+a.scrollX+d.clientLeft,S=v>.5||v+d.clientWidth<f-.5;d.classList.toggle("gc-viewport-unclip",S)}let x=-(t.getBoundingClientRect().left+a.scrollX),y=(d,v)=>{e.style.getPropertyValue(d)!==v&&e.style.setProperty(d,v)};y("--gc-viewport-width",f+"px"),y("--gc-viewport-offset",x+"px")}u();let m=a.ResizeObserver?new a.ResizeObserver(u):null;return m?.observe(t),m?.observe(o.documentElement),a.addEventListener("resize",u),()=>{m?.disconnect(),a.removeEventListener("resize",u);for(let f of c)f.classList.remove("gc-viewport-unclip");s?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var Zi=te(()=>{});var ea,Qi=te(()=>{ea=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
.gc-stack.gc-finish .gc-card{position:relative}
.gc-finish .gc-card::after{content:"";position:absolute;inset:0;z-index:3;border:var(--gc-line-size,0px) solid var(--gc-line-color,transparent);border-radius:inherit;pointer-events:none}
.gc-finish .gc-card-media{position:relative}
.gc-finish .gc-card-media::after{content:"";position:absolute;inset:0;background:var(--gc-tint);opacity:var(--gc-tint-opacity,0);pointer-events:none}
.gc-finish[data-gc-shadow=none] .gc-card{box-shadow:none}
.gc-finish[data-gc-shadow=soft] .gc-card{box-shadow:0 5px 16px rgb(15 23 42/.16)}
.gc-finish[data-gc-shadow=deep] .gc-card{box-shadow:0 16px 36px -8px rgb(15 23 42/.38),0 3px 9px rgb(15 23 42/.12)}
@media(hover:hover) and (prefers-reduced-motion:no-preference){
 .gc-finish[data-gc-hover=zoom]:not([data-gc-still]) .gc-card-media img{transition:scale .24s ease}
 .gc-finish[data-gc-hover=zoom]:not([data-gc-still]) .gc-card:is(:hover,:focus-visible) .gc-card-media img{scale:1.07}
 .gc-finish[data-gc-hover=lift]:not([data-gc-still]) .gc-card{transition:translate .24s ease}
 .gc-finish[data-gc-hover=lift]:not([data-gc-still]) .gc-card:is(:hover,:focus-visible){translate:0 -7px}
}

/* Mask only the moving stage. Navigation and captions stay fully opaque. */
.gc-stage[data-gc-edges=gradient]:not(.gc-spatial-reduced) :is(.gc-carousel-stage,.gc-spatial-canvas,.orbit-stage) {
  mask-image:linear-gradient(var(--gc-edge-direction),transparent,#000 var(--gc-edge-fade),#000 calc(100% - var(--gc-edge-fade)),transparent);
}
.gc-stage[data-gc-edges=hard] :is(.gc-carousel-stage,.gc-spatial-canvas,.orbit-stage) {mask-image:none}
.gc-stage:is([data-gc-edges=hard],[data-gc-edges=gradient]) :is(.gc-preset-infinite .gc-carousel-stage,.gc-spatial-canvas)::after {display:none}

.gc-stage[data-gc-control-shape] button.gc-transport {
  width:var(--gc-control-size);height:var(--gc-control-size);flex-basis:var(--gc-control-size);
}
.gc-stage[data-gc-control-shape] button.gc-transport > svg {width:calc(var(--gc-control-size) * .455);height:calc(var(--gc-control-size) * .455)}
.gc-stage[data-gc-control-shape=rounded] button.gc-transport {border-radius:22%}
.gc-stage[data-gc-control-shape=square] button.gc-transport {border-radius:0}
.gc-stage[data-gc-arrows=chevron] :is(.gc-icon-next,.gc-icon-previous) path:first-child {display:none}
.gc-stage[data-gc-arrows=chevron] .gc-chevron {display:inline}
.gc-stage[data-gc-control-palette=custom] button.gc-transport {background:var(--gc-control-fill);color:var(--gc-control-ink);border-color:currentColor}
.gc-stage[data-gc-title-size] :is(.gc-card-title,.list-item-content__title,.gc-ring-label,.gc-spiral-caption) {font-size:var(--gc-title-size)!important}
.gc-stage[data-gc-title-weight] :is(.gc-card-title,.list-item-content__title,.gc-ring-label,.gc-spiral-caption) {font-weight:var(--gc-title-weight)!important}
.gc-stage[data-gc-title-palette=custom] :is(.gc-card-title,.list-item-content__title,.gc-ring-label,.gc-spiral-caption) {color:var(--gc-title-color)!important}

.gc-ring[data-gc-back=solid] .gc-card[data-gc-back-facing] {background:var(--gc-back-color)}
.gc-ring[data-gc-back=solid] .gc-card[data-gc-back-facing] > * {visibility:hidden}
`});function ta(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let i=document.createElement("style");i.id="gc-finish-css",i.textContent=ea,document.head.append(i)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let r={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[i,o]of Object.entries(r))t.style.setProperty(i,o);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var bo,oa=te(()=>{Qi();bo={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function ia(t,e){let r=t.classList.contains("gc-embed"),i=r&&e.colorSource==="section";i?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,r&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let o=t.style;o.setProperty("--gc-custom-background",e.background),o.setProperty("--gc-custom-ink",e.ink),o.setProperty("--gc-custom-accent",e.accent),o.setProperty("--gc-background",i?"var(--gc-section-surface)":e.background),o.setProperty("--gc-ink",i?"var(--gc-section-body)":e.ink),o.setProperty("--gc-accent",i?"var(--gc-section-action)":e.accent),o.setProperty("--gc-muted",i?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),o.setProperty("--gc-spatial-surface","var(--gc-background)"),o.setProperty("--gc-spatial-ink","var(--gc-ink)"),i&&(o.setProperty("--gc-line-color","var(--gc-section-line)"),o.setProperty("--gc-tint","var(--gc-section-body)")),o.background=i?"transparent":e.background,o.color=i?"var(--gc-section-body)":e.ink;for(let a of t.querySelectorAll(":scope > dialog"))aa(t,a)}function aa(t,e){for(let r of["gcColorSource","gcTypeSource"])t.dataset[r]?e.dataset[r]=t.dataset[r]:delete e.dataset[r]}function yo(t,e){let r=t.classList.contains("gc-embed")?t:t.ownerDocument.body;aa(t,e),e.parentElement!==r&&r.append(e)}var ra=te(()=>{});var sa,na=te(()=>{sa=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
.gc-stage *,.gc-stage *:before,.gc-stage *:after{box-sizing:border-box}.gc-stage button{font-family:inherit}.gc-stage button:focus-visible{outline:3px solid var(--gc-accent);outline-offset:4px}.gc-stage [hidden]{display:none!important}
.gc-card{display:block;border:0;padding:0;margin:0;background:#fff;color:#172332;border-radius:var(--gc-card-radius,16px);overflow:hidden;text-align:left;box-shadow:0 12px 40px #15243610;cursor:pointer;-webkit-tap-highlight-color:transparent}
.gc-card-media{display:block;width:100%;aspect-ratio:4/3;overflow:hidden;background:#dde2e7}.gc-card-media img{display:block;width:100%;height:100%;object-fit:var(--gc-fit);pointer-events:none;user-select:none}.gc-card-copy{display:block;padding:20px}.gc-card-title{display:block;font-size:22px;line-height:1.15;font-weight:500;letter-spacing:-.035em}.gc-card-description{display:block;font-size:14px;line-height:1.55;margin-top:12px;font-weight:400;letter-spacing:0;opacity:.72}
.gc-embed.gc-stage{font-family:inherit}
/* Only an integrated gallery gets a viewport-wide stage. Keep its in-flow
   slot the width of its original parent, including in classic columns. */
.fluid-engine > .fe-block.gc-viewport-cell { grid-column: 1 / -1 !important; min-width: 0; }
.gc-viewport-unclip { overflow: visible !important; }
.gc-viewport-slot { display: flow-root; width: 100%; min-width: 0; box-sizing: border-box; }
.gc-viewport-slot.user-items-list-simple { display: flow-root; padding-block: 0; }
.gc-viewport-slot > .gc-embed {
  box-sizing: border-box;
  width: var(--gc-viewport-width, 100%);
  max-width: none;
  padding-inline: 0;
  margin-left: var(--gc-viewport-offset, 0px);
  margin-right: calc(100% - var(--gc-viewport-width, 100%) - var(--gc-viewport-offset, 0px));
}
.gc-native-items-hidden:not(.sqs-edit-mode-active *){display:none!important}
.gc-stack-page-scroll:not(.gc-viewport-unclip):not(.sqs-edit-mode-active):not(.sqs-edit-mode-active *){overflow-x:clip!important;overflow-y:visible!important}
.sqs-edit-mode-active .gc-app,.sqs-edit-mode-active .gc-embed{display:none!important}
.gc-dialog{padding:0;border:0;border-radius:20px;background:#fff;color:#172332;width:min(1040px,92vw);max-height:90vh;overflow:auto;box-shadow:0 30px 140px #0005;font-family:Arial,Helvetica,sans-serif}.gc-dialog::backdrop{background:#111b29b8;backdrop-filter:blur(7px)}.gc-dialog-close{position:sticky;float:right;top:16px;right:16px;margin:16px;z-index:2;background:#fff;color:#172332;border:1px solid #dce1e8;border-radius:30px;padding:12px 18px;font:500 13px Arial;cursor:pointer}.gc-dialog-content{clear:both;padding:0 24px 28px}.gc-dialog-media{max-height:62vh;aspect-ratio:16/10;background:#f0f2f5;border-radius:12px;overflow:hidden}.gc-dialog-media img{object-fit:contain!important}.gc-dialog-copy{padding:22px 12px 0}.gc-dialog h2{font:500 clamp(24px,3vw,36px)/1.1 Arial;margin:0 0 12px;letter-spacing:-.04em}.gc-dialog p{font-size:15px;line-height:1.6;margin:0 0 16px}.gc-dialog a{display:inline-block;margin-top:12px;color:#345bf2}.gc-dialog .gc-dialog-count{font-size:12px;color:#768292;margin:24px 0 0}.gc-dialog-drawer{position:fixed;inset:0 0 0 auto;margin:0;width:min(580px,94vw);height:100dvh;max-height:none;border-radius:0}.gc-dialog-drawer .gc-dialog-media{aspect-ratio:4/3}.gc-empty{padding:70px 20px;text-align:center}
.gc-stack{scrollbar-width:thin}.gc-stack-track{position:relative;padding-top:40px;min-height:100%;perspective:1300px}.gc-stack-slot{position:sticky;top:40px;width:100%;display:flex;justify-content:center;align-items:flex-start}.gc-stack .gc-card{display:flex;flex-direction:column-reverse;transform-origin:center top;flex-shrink:0;padding:24px;box-shadow:0 12px 50px #101e2b18}.gc-stack .gc-card-copy{display:flex;gap:36px;padding:0 0 24px;align-items:flex-start}.gc-stack .gc-card-title{flex:1;font-size:clamp(20px,3vw,32px)}.gc-stack .gc-card-description{flex:1;margin:0;font-size:13px}.gc-stack .gc-card-media{border-radius:calc(var(--gc-card-radius) * .65);min-height:0;flex:1;aspect-ratio:auto}.gc-stack .gc-stack-slot:nth-child(3n+1) .gc-card{background:#dce5f0}.gc-stack .gc-stack-slot:nth-child(3n+2) .gc-card{background:#e1e7d7}.gc-stack .gc-stack-slot:nth-child(3n) .gc-card{background:#e9dcda}
@media(max-width:600px){.gc-card-copy{padding:14px}.gc-stack .gc-card{padding:18px}.gc-stack .gc-card-copy{display:block;padding-bottom:18px}.gc-dialog-content{padding:0 14px 20px}.gc-dialog-media{aspect-ratio:4/5}}
@media(prefers-reduced-motion:reduce){.gc-stage *{scroll-behavior:auto!important}.gc-dialog{scroll-behavior:auto}}
/* The transformed list keeps its native type and fills the viewport stage. */
.gc-embed [data-gc-native-track]{display:block;list-style:none;grid-template-columns:none!important;gap:0!important;max-width:none!important;margin:0!important;padding-inline:0!important;box-sizing:border-box;width:100%}
.gc-embed .gc-carousel-track[data-gc-native-track]{padding:0!important}
.gc-embed .gc-carousel-track[data-gc-native-track]>.list-item{display:contents}
.gc-embed [data-gc-native-track].gc-stack-track>.list-item{display:flex;flex-direction:row;justify-content:center;align-items:flex-start;position:sticky;margin:0;padding:0;background:transparent;overflow:visible}
.gc-stack .gc-native-card .gc-card-copy{display:block;flex:none}
.gc-stack .gc-card:not(.gc-native-card) .gc-card-copy{display:flex;flex:none;flex-wrap:wrap;row-gap:.6em;overflow-wrap:anywhere}
.gc-stack .gc-card:not(.gc-native-card) :is(.gc-card-title,.gc-card-description){flex:1 1 12rem;min-width:0}
.gc-stack .gc-card.gc-stack-image-only .gc-card-copy{display:none}
.gc-stack .gc-card .gc-card-media{position:relative;flex:1 0 auto}
/* Reserve a 4:3 image area up to 240px. Short captions can leave more space. */
.gc-stack .gc-card .gc-card-media::before{content:"";display:block;padding-top:min(75%,240px)}
/* Generated images receive inline position:static from the Squarespace loader adapter. */
.gc-stack .gc-card .gc-card-media>img{position:absolute!important;inset:0}
.gc-stack .gc-native-card .list-item-media-inner{position:absolute;inset:0}
.gc-embed [data-gc-native-track].gc-spatial-canvas>.list-item{padding:0;background:transparent}
.gc-native-card{position:relative}
.gc-native-card .list-item-media{margin:0!important;max-width:none!important;width:100%!important}
.gc-native-card .list-item-media-inner{height:100%!important;width:100%!important;padding:0!important}
.gc-native-card .list-item-media-inner img{display:block!important;position:static!important;width:100%!important;height:100%!important;opacity:1!important;object-fit:var(--gc-fit,cover)!important;object-position:var(--gc-native-focus,50% 50%)!important}
.gc-native-card .list-item-content__text-wrapper{max-width:none!important}
.gc-native-card [hidden]{display:none!important}
.gc-native-card .list-item-content a{pointer-events:auto}
.gc-native-action{position:absolute;width:1px;height:1px;clip-path:inset(50%);overflow:hidden;padding:0;border:0}
.gc-native-card:focus-visible{outline:3px solid var(--gc-accent);outline-offset:4px}
.gc-stage button.gc-transport {
  display: inline-grid;
  place-items: center;
  place-content: center;
  box-sizing: border-box;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  flex: 0 0 44px;
  padding: 0;
  border-radius: 50%;
  line-height: 1;
}
.gc-stage button.gc-transport > .gc-transport-icon {
  display: block;
  width: 20px;
  height: 20px;
  margin: 0;
  pointer-events: none;
}
.gc-stage button.gc-transport > .gc-icon-pause,
.gc-stage button.gc-transport[data-paused="false"] > .gc-icon-play { display: none; }
.gc-stage button.gc-transport[data-paused="false"] > .gc-icon-pause { display: block; }

/* Bound Fluid Engine galleries to the dimensions chosen in the page editor. */
.gc-block-bound{height:100%!important;min-height:0!important}
.gc-block-bound>.sqs-block-content{position:relative!important;height:100%!important;min-height:0!important}
.gc-block-slot{position:absolute!important;inset:0;height:100%;min-height:0}
.gc-block-slot>.gc-block-fit{height:100%!important;min-height:0;overflow:auto;overscroll-behavior-x:contain}
.gc-block-fit .orbit-stage{height:var(--gc-block-stage-height,100%)!important;min-height:0!important}
.gc-block-fit .gc-spatial-canvas{height:var(--gc-block-stage-height,100%)!important;min-height:0!important}
.gc-block-stage-window{position:relative;overflow:clip}
.gc-block-stage-window>.gc-carousel-stage{position:absolute;left:50%;top:var(--gc-block-top,0px);transform:translateX(-50%) scale(var(--gc-block-scale,1));transform-origin:top center}

.sqs-edit-mode-active .gc-edit-preview .gc-embed{display:block!important}
.sqs-edit-mode-active .gc-edit-preview .gc-native-items-hidden{display:none!important}

.gc-stage.gc-hide-controls :is(.orbit-controls, .gc-carousel-controls, .gc-carousel-tabs, .gc-spatial-nav) { display: none !important; }
.gc-dialog-copy article img { max-width: 100%; height: auto; }
`});var la,ca=te(()=>{la=`:root:has(.gc-post-dialog[open]) { overflow: hidden; }

.gc-post-dialog {
  color-scheme: light dark;
  --post-surface: var(--bdco-home-paper, light-dark(#fff, #101817));
  --post-ink: var(--bdco-home-ink, light-dark(#0c0d0e, #f3f9f7));
  --post-body: var(--bdco-home-body, light-dark(#465359, #c0cecb));
  --post-muted: var(--bdco-home-muted, light-dark(#5c6870, #b1c4c0));
  --post-line: var(--bdco-home-rule, light-dark(#c5cccf, #48615c));
  --post-accent: var(--bdco-home-accent, light-dark(#006f69, #71dfcf));
  --post-on-accent: var(--bdco-home-on-accent, light-dark(#fff, #10211f));
  --post-tint: var(--bdco-home-tint, light-dark(#e4f5f2, #1b302d));
  --post-gallery-surface: light-dark(#e9eaeb, #1b302d);
  --post-radius: 14px;
  --post-gutter: clamp(20px, 3.1vw, 42px);
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  inline-size: min(1140px, calc(100vw - 64px));
  max-inline-size: none;
  max-block-size: calc(100dvh - 56px);
  padding: 0;
  border: 0;
  border-radius: var(--post-radius);
  color: var(--post-ink);
  background: var(--post-surface);
  font: 400 16px/1.5 var(--body-font-font-family, "Albert Sans", system-ui, sans-serif);
  overflow: auto;
  overscroll-behavior: contain;
  box-shadow: 0 24px 58px #0c0d0e3d;
}

:root[data-bdco-review-theme="light"] .gc-post-dialog { color-scheme: light; }
:root[data-bdco-review-theme="dark"] .gc-post-dialog { color-scheme: dark; }

.gc-post-dialog::backdrop {
  background: light-dark(#0c0d0e80, #0009);
  backdrop-filter: blur(3px);
}

.gc-post-dialog *, .gc-post-dialog *::before, .gc-post-dialog *::after { box-sizing: border-box; }
.gc-post-dialog [hidden] { display: none !important; }

.gc-post-dialog .gc-post-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 0;
}

.gc-post-dialog button.gc-post-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--post-line);
  border-radius: 50%;
  background: var(--post-surface);
  color: var(--post-ink);
  cursor: pointer;
  touch-action: manipulation;
}

.gc-post-dialog .gc-post-icon:hover {
  color: var(--post-accent);
  border-color: var(--post-accent);
}

.gc-post-dialog button.gc-post-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
}

.gc-post-dialog :is(button, a):focus-visible {
  outline: 2px solid var(--post-accent);
  outline-offset: 3px;
}

.gc-post-layout {
  display: grid;
  grid-template-columns: minmax(0, 36%) minmax(0, 1fr);
  grid-template-areas: "copy gallery";
  align-items: stretch;
}

.gc-post-dialog[data-without-gallery] .gc-post-layout {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "copy";
}

.gc-post-dialog[data-without-gallery]:not([data-desktop-layout="drawer"]) {
  inline-size: min(640px, calc(100vw - 64px));
}

.gc-post-copy {
  grid-area: copy;
  min-width: 0;
  align-self: center;
  padding: var(--post-padding, var(--post-gutter));
}

.gc-post-dialog[data-without-gallery] .gc-post-copy {
  padding-block-start: max(62px, var(--post-padding, var(--post-gutter)));
}

.gc-post-dialog h2.gc-post-title {
  margin: 0 0 16px;
  color: var(--post-ink);
  overflow-wrap: anywhere;
  font: 640 clamp(29px, 4.1vw, 54px)/1 var(--heading-font-font-family, "Albert Sans", system-ui, sans-serif);
  letter-spacing: -.06em;
}

.gc-post-reading { color: var(--post-body); overflow-wrap: anywhere; }
.gc-post-reading > div + div { margin-top: .65em; }
.gc-post-reading :is(p, ul, ol, blockquote, pre, figure, h2, h3, h4, h5, h6) { margin: 0 0 .55em; color: inherit; }
.gc-post-reading :is(h2, h3, h4, h5, h6) { font-size: 1.15em; line-height: 1.25; }
.gc-post-reading a, .gc-post-image-description a { color: var(--post-accent); text-decoration: underline; }
.gc-post-reading img { display: block; max-inline-size: 100%; block-size: auto; }
.gc-post-reading :is(table, pre) { display: block; overflow-x: auto; max-inline-size: 100%; }

.gc-post-dialog .gc-post-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.gc-post-dialog .gc-post-pills li {
  margin: 0;
  padding: 5px 9px;
  border-radius: 100px;
  background: var(--post-tint);
  color: var(--post-ink);
  font-size: 12px;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.gc-post-dialog .gc-post-categories li {
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--post-line);
}

.gc-post-dialog .gc-post-status { margin: 12px 0 0; color: var(--post-muted); font-size: 14px; }

.gc-post-dialog .gc-post-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  margin: 20px 0 0;
  padding: 12px 27px;
  border-radius: 100px;
  color: var(--post-on-accent);
  background: var(--post-accent);
  font: 600 18px/1.2 var(--body-font-font-family, "Albert Sans", system-ui, sans-serif);
  letter-spacing: -.01em;
  text-decoration: none;
}
.gc-post-dialog .gc-post-link:hover { background: color-mix(in srgb, var(--post-accent) 88%, var(--post-ink)); }

.gc-post-gallery {
  grid-area: gallery;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 61px clamp(15px, 2.15vw, 26px) 21px;
  background: var(--post-gallery-surface);
}

.gc-post-figure { min-width: 0; margin: 0; }
.gc-post-image-well {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 64dvh;
  touch-action: pan-y pinch-zoom;
}
.gc-post-image { width: 100%; height: 100%; min-height: 0; display: block; object-fit: contain; user-select: none; -webkit-user-drag: none; }
.gc-post-image-description { padding: 5px 0 0; color: var(--post-body); font-size: 13px; overflow-wrap: anywhere; }
.gc-post-image-description > :first-child { margin-top: 0; }
.gc-post-image-description > :last-child { margin-bottom: 0; }

.gc-post-photo-nav, .gc-post-photo-label, .gc-post-step-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
}
.gc-post-photo-nav { margin-top: 8px; justify-content: space-between; }
.gc-post-photo-label { flex-wrap: wrap; min-width: 0; color: var(--post-muted); font-size: 12px; }
.gc-post-photo-label strong { color: var(--post-ink); font-weight: 600; overflow-wrap: anywhere; }
.gc-post-counter { white-space: nowrap; font-variant-numeric: tabular-nums; }

.gc-post-thumbs {
  display: flex;
  gap: 5px;
  margin: 9px -4px -5px;
  padding: 5px 4px;
  overflow-x: auto;
  scrollbar-width: thin;
}
.gc-post-thumbs button {
  flex: 0 0 clamp(46px, 6vw, 76px);
  width: 0;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  opacity: .68;
  cursor: pointer;
}
.gc-post-thumbs button:is(:hover, [aria-current="true"]) { opacity: 1; }
.gc-post-thumbs button[aria-current="true"] { border-color: var(--post-accent); }
.gc-post-thumbs img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: contain; }

@media (min-width: 681px) {
  .gc-post-dialog[data-desktop-layout="drawer"] {
    inset: 0 0 0 auto;
    width: min(525px, 87vw);
    max-height: none;
    height: 100dvh;
    margin: 0;
    border-radius: 0;
  }
  .gc-post-dialog[data-desktop-layout="drawer"]::backdrop {
    background: light-dark(#0c0d0e50, #0008);
    backdrop-filter: blur(1.5px);
  }
  .gc-post-dialog[data-desktop-layout="drawer"] .gc-post-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "copy" "gallery";
  }
  .gc-post-dialog[data-desktop-layout="drawer"][data-without-gallery] .gc-post-layout { grid-template-areas: "copy"; }
  .gc-post-dialog[data-desktop-layout="drawer"] .gc-post-copy { padding: max(58px, var(--post-padding, 24px)) var(--post-padding, 24px) 19px; }
  .gc-post-dialog[data-desktop-layout="drawer"] .gc-post-title { font-size: clamp(30px, 4.2vw, 48px); }
  .gc-post-dialog[data-desktop-layout="drawer"] .gc-post-gallery { padding: 0 var(--post-padding, 24px) 22px; background: var(--post-surface); }
  .gc-post-dialog[data-desktop-layout="drawer"] .gc-post-thumbs { display: none; }
}

@media (min-width: 681px) and (max-width: 900px) {
  .gc-post-dialog { inline-size: calc(100vw - 32px); }
  .gc-post-layout { grid-template-columns: minmax(0, 40%) minmax(0, 1fr); }
}

@media (max-width: 680px) {
  .gc-post-dialog, .gc-post-dialog[data-without-gallery]:not([data-desktop-layout="drawer"]) {
    inline-size: 100%;
    max-block-size: none;
    block-size: 100dvh;
    margin: 0;
    border-radius: 0;
  }
  .gc-post-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "gallery" "copy";
  }
  .gc-post-copy { padding: var(--post-padding, 22px) var(--post-padding, 18px) max(30px, env(safe-area-inset-bottom)); }
  .gc-post-dialog h2.gc-post-title { font-size: clamp(30px, 9vw, 44px); margin-bottom: 13px; }
  .gc-post-gallery { padding: 61px 12px 8px; border-bottom: 1px solid var(--post-line); }
  .gc-post-dialog .gc-post-close { top: max(8px, env(safe-area-inset-top)); right: max(8px, env(safe-area-inset-right)); }
  .gc-post-dialog button.gc-post-icon { width: 44px; height: 44px; }
  .gc-post-dialog .gc-post-link { min-height: 54px; padding-inline: 18px; margin-top: 14px; }
  .gc-post-dialog .gc-post-thumbs { display: none; }
}

@media (prefers-reduced-motion: no-preference) {
  .gc-post-dialog[open][data-reduced-motion="false"] { animation: gc-post-enter 180ms ease-out; }
  @media (min-width: 681px) {
    .gc-post-dialog[open][data-reduced-motion="false"][data-desktop-layout="drawer"] {
      animation: gc-post-drawer-enter 240ms cubic-bezier(.2,.75,.25,1);
    }
  }
}
@keyframes gc-post-enter { from { opacity: .7; } to { opacity: 1; } }
@keyframes gc-post-drawer-enter { from { transform: translateX(100%); } to { transform: translateX(0); } }
`});var pa,da=te(()=>{pa=`/* Squarespace assigns complete color values to these inheritable section roles. */
.gc-embed[data-gc-color-source="section"] {
  --gc-section-surface: var(--siteBackgroundColor, var(--gc-custom-background));
  --gc-section-body: var(--paragraphMediumColor, var(--gc-custom-ink));
  --gc-section-heading: var(--headingMediumColor, var(--gc-section-body));
  --gc-section-action: var(--primaryButtonBackgroundColor, var(--gc-custom-accent));
  --gc-section-action-text: var(--primaryButtonTextColor, var(--gc-section-surface));
  --gc-section-nav: var(--list-section-carousel-arrow-background-color, var(--gc-section-action));
  --gc-section-nav-text: var(--list-section-carousel-arrow-color, var(--gc-section-action-text));
  --gc-section-card: var(--list-section-simple-card-color, var(--gc-section-surface));
  --gc-section-card-title: var(--list-section-simple-card-title-color, var(--gc-section-heading));
  --gc-section-card-body: var(--list-section-simple-card-description-color, var(--gc-section-body));
  --gc-section-card-link: var(--list-section-simple-card-description-link-color, var(--gc-section-card-title));
  --gc-section-card-button: var(--list-section-simple-card-button-background-color, var(--gc-section-action));
  --gc-section-card-button-text: var(--list-section-simple-card-button-text-color, var(--gc-section-action-text));
  --gc-section-line: color-mix(in srgb, var(--gc-section-body) 32%, transparent);
  --gc-line: var(--gc-section-line);
  --gc-spatial-line: var(--gc-section-line);
}

/* Text outside a painted card follows the Simple List's regular text roles. */
.user-items-list-section .gc-stage[data-gc-color-source="section"] {
  --gc-section-heading: var(--list-section-simple-title-color, var(--headingMediumColor, var(--gc-custom-ink)));
  --gc-section-body: var(--list-section-simple-description-color, var(--paragraphMediumColor, var(--gc-custom-ink)));
}

/* Keep the section's own color or image visible behind each layout. */
.gc-stage[data-gc-color-source="section"] :is(.gc-carousel, .gc-preset-showcase) {
  color: var(--gc-section-body);
  background: transparent;
}
.gc-stage[data-gc-color-source="section"] .gc-card,
.gc-stage.gc-stack[data-gc-color-source="section"] .gc-stack-slot .gc-card {
  background: var(--gc-section-card);
  color: var(--gc-section-card-body);
}
.gc-stage[data-gc-color-source="section"] .gc-card-media {
  background: var(--gc-section-card);
}
.gc-stage[data-gc-color-source="section"] .gc-card :is(.gc-card-title, .list-item-content__title) {
  color: var(--gc-section-card-title);
}
.gc-stage[data-gc-color-source="section"] .gc-card :is(.gc-card-description, .list-item-content__description) {
  color: var(--gc-section-card-body);
  opacity: 1;
}
.gc-stage[data-gc-color-source="section"] .gc-card .list-item-content__description a {
  color: var(--gc-section-card-link);
}
.gc-stage[data-gc-color-source="section"] .gc-card .list-item-content__button {
  background-color: var(--gc-section-card-button);
  color: var(--gc-section-card-button-text);
}

/* Each button and selected tab keeps its Squarespace background/text pair. */
.gc-stage[data-gc-color-source="section"] :is(.gc-carousel-arrow, .gc-carousel-playback, .gc-spatial-control, .orbit-arrow),
.gc-stage[data-gc-color-source="section"] .gc-carousel-tab.is-active,
.gc-stage[data-gc-color-source="section"] .gc-carousel-cursor {
  background: var(--gc-section-nav);
  border-color: var(--gc-section-nav);
  color: var(--gc-section-nav-text);
}
.gc-stage[data-gc-color-source="section"] :is(.gc-carousel-arrow, .gc-carousel-playback, .gc-spatial-control, .orbit-arrow):hover {
  background: var(--gc-section-nav);
  color: var(--gc-section-nav-text);
  border-color: currentColor;
}
.gc-stage[data-gc-color-source="section"] .gc-carousel-dot {
  background: color-mix(in srgb, var(--gc-section-body) 26%, var(--gc-section-surface));
  color: var(--gc-section-body);
}
.gc-stage[data-gc-color-source="section"] .gc-preset-showcase .gc-carousel-card {
  border-color: var(--gc-section-line);
}
.gc-stage[data-gc-color-source="section"] .gc-preset-showcase .gc-carousel-card.is-active {
  border-color: var(--gc-section-nav);
}
.gc-stage[data-gc-color-source="section"] .gc-preset-showcase .is-active .gc-card-copy {
  --gc-section-card-title: var(--gc-section-nav-text);
  --gc-section-card-body: var(--gc-section-nav-text);
  --gc-section-card-link: var(--gc-section-nav-text);
  background: var(--gc-section-nav);
  color: var(--gc-section-nav-text);
}
.gc-stage[data-gc-color-source="section"] .gc-preset-timed .gc-carousel-card {
  --gc-timed-scrim: var(--gc-section-card);
}
.gc-stage.gc-spatial[data-gc-color-source="section"] .gc-card-copy {
  background: var(--gc-section-card);
  color: var(--gc-section-card-body);
}
.gc-stage.gc-wall[data-gc-color-source="section"] .gc-spatial-canvas::after {
  background: linear-gradient(0deg, var(--gc-section-surface), transparent 15% 85%, var(--gc-section-surface));
}
.gc-stage[data-gc-color-source="section"] :is(.gc-spiral-caption, .gc-ring-label) {
  color: var(--gc-section-heading);
}

/* showModal() promotes the element visually while preserving its section ancestry. */
:is(.gc-dialog,.gc-spiral-dialog)[data-gc-color-source="section"] {
  --viewer-ink: var(--gc-section-body);
  --viewer-muted: var(--gc-section-body);
  background: var(--gc-section-surface);
  color: var(--gc-section-body);
  border-color: var(--gc-section-line);
  scrollbar-color: var(--gc-section-line) var(--gc-section-surface);
}
:is(.gc-dialog,.gc-spiral-dialog)[data-gc-color-source="section"] :is(h2, .project-title) {
  color: var(--gc-section-heading);
}
:is(.gc-dialog,.gc-spiral-dialog)[data-gc-color-source="section"] :is(.gc-dialog-count, .project-summary, .project-frame-label) {
  color: var(--gc-section-body);
}
:is(.gc-dialog,.gc-spiral-dialog)[data-gc-color-source="section"] :is(.gc-dialog-media, .project-gallery) {
  background: var(--gc-section-card);
}
.gc-spiral-dialog[data-gc-color-source="section"] .project-topbar {
  background: var(--gc-section-surface);
  border-color: var(--gc-section-line);
}
:is(.gc-dialog,.gc-spiral-dialog)[data-gc-color-source="section"] :is(.gc-dialog-close, .project-icon-button) {
  color: var(--gc-section-nav-text);
  background: var(--gc-section-nav);
  border-color: var(--gc-section-nav);
}
:is(.gc-dialog,.gc-spiral-dialog)[data-gc-color-source="section"] a {
  color: var(--gc-section-body);
  text-decoration: underline;
}
`});var ua,ga=te(()=>{ua=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
   selectors. These rules style text generated by the gallery itself. */
.gc-embed.gc-stage[data-gc-type-source="native"] :is(.gc-card-title, .gc-ring-label, .gc-spiral-caption),
.gc-dialog[data-gc-type-source="native"] h2,
.gc-spiral-dialog[data-gc-type-source="native"] .project-title {
  font-family: var(--heading-font-font-family, inherit);
  font-style: var(--heading-font-font-style, normal);
  font-weight: var(--heading-font-font-weight, inherit);
  font-size: var(--heading-4-size, 1.2em);
  line-height: var(--heading-font-line-height, normal);
  letter-spacing: var(--heading-font-letter-spacing, normal);
  text-transform: var(--heading-font-text-transform, none);
}

.gc-embed.gc-stage[data-gc-type-source="native"] :is(
  .gc-card-description, .gc-carousel-tab, .gc-carousel-cursor,
  .gc-spatial-count, .gc-spatial-playback, .gc-ring-center
),
.gc-dialog[data-gc-type-source="native"],
.gc-spiral-dialog[data-gc-type-source="native"],
.gc-dialog[data-gc-type-source="native"] :is(.gc-dialog-close, p),
.gc-spiral-dialog[data-gc-type-source="native"] :is(.project-frame-label, .project-summary, .gc-spiral-source-link) {
  font-family: var(--body-font-font-family, inherit);
  font-style: var(--body-font-font-style, normal);
  font-weight: var(--body-font-font-weight, inherit);
  font-size: var(--small-text-size, 1em);
  line-height: var(--body-font-line-height, normal);
  letter-spacing: var(--body-font-letter-spacing, normal);
  text-transform: var(--body-font-text-transform, none);
}

.gc-embed.gc-stage[data-gc-type-source="native"] .gc-carousel-counter {
  font-family: var(--heading-font-font-family, inherit);
  font-weight: var(--heading-font-font-weight, inherit);
  letter-spacing: var(--heading-font-letter-spacing, normal);
}

.gc-dialog[data-gc-type-source="native"] h2,
.gc-spiral-dialog[data-gc-type-source="native"] .project-title {
  font-size: var(--heading-2-size, var(--heading-4-size, 1.2em));
}
.gc-dialog[data-gc-type-source="native"] .gc-dialog-copy,
.gc-dialog[data-gc-type-source="native"] .gc-dialog-copy p:not(.gc-dialog-count),
.gc-spiral-dialog[data-gc-type-source="native"] .project-summary {
  font-size: var(--normal-text-size, 1em);
}
`});var ma,ha=te(()=>{ma=`.gc-carousel {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  isolation: isolate;
  color: inherit;
  container: gc-carousel / inline-size;
}
.gc-carousel *, .gc-carousel *::before, .gc-carousel *::after { box-sizing: border-box; }
.gc-carousel button { font: inherit; -webkit-tap-highlight-color: transparent; }
.gc-carousel-stage {
  position: relative;
  display: grid;
  align-items: center;
  width: 100%;
  min-height: var(--gc-stage-height, 0px);
  padding-block: var(--gc-carousel-shadow-room, clamp(28px, 4cqw, 52px));
  overflow: hidden;
  /* Focusing a native CTA or returning from a modal must not scroll the mask. */
  overflow: clip;
  perspective: 1400px;
  touch-action: pan-y pinch-zoom;
  cursor: grab;
}
.gc-carousel-stage.is-dragging, .gc-carousel-stage.is-dragging * { cursor: grabbing !important; }
.gc-carousel:is(.gc-preset-arc, .gc-preset-arc-tabs, .gc-preset-showcase) .gc-carousel-stage {
  --gc-sweep-shadow: var(--gc-carousel-shadow-room, 40px);
  padding-block-start: calc(var(--gc-sweep-above, 0px) + var(--gc-sweep-shadow));
  padding-block-end: calc(var(--gc-sweep-below, 0px) + var(--gc-sweep-shadow));
  /* Match the real card center after reserving different amounts above/below. */
  perspective-origin: 50% calc(50% + (var(--gc-sweep-above, 0px) - var(--gc-sweep-below, 0px)) / 2);
}
.gc-stage[data-gc-shadow="none"] { --gc-carousel-shadow-room: 14px; }
.gc-stage[data-gc-shadow="soft"] { --gc-carousel-shadow-room: 30px; }
.gc-stage[data-gc-shadow="deep"] { --gc-carousel-shadow-room: 54px; }
/* Overlap real cards in flow: the tallest caption and CTA reserve their
   natural height as images, fonts, card width and Squarespace styles change. */
.gc-carousel .gc-carousel-track { display: grid; align-items: center; min-width: 0; pointer-events: none; }
.gc-carousel .gc-carousel-card {
  position: relative;
  grid-area: 1 / 1;
  justify-self: left;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--gc-card-radius, 14px);
  background: var(--gc-card-background, #f0efeb);
  color: var(--gc-card-color, #1d1d1b);
  text-align: left;
  cursor: pointer;
  transform-origin: center;
  pointer-events: auto;
  user-select: none;
  backface-visibility: hidden;
  will-change: transform;
  box-shadow: 0 3px 18px rgb(0 0 0 / 6%);
}
.gc-carousel .gc-card-media {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #d8d7d1;
}
.gc-carousel .gc-card-media img { display: block; width: 100%; height: 100%; pointer-events: none; }
.gc-carousel .gc-card-copy { padding: 18px 22px; overflow-wrap: anywhere; }
.gc-carousel .gc-card-title { margin: 0; font-size: clamp(16px, 2.2vw, 24px); font-weight: 550; line-height: 1.15; }
.gc-carousel .gc-card-description p, .gc-carousel .gc-card-description { margin: 10px 0 0; font-size: 14px; line-height: 1.45; }
.gc-carousel .gc-card-title:empty, .gc-carousel .gc-card-copy:empty { display: none; }
.gc-carousel .gc-carousel-controls {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 64px;
  padding: 8px clamp(16px, 3vw, 44px) 24px;
}
.gc-carousel-counter { display: flex; align-items: baseline; gap: 6px; font-variant-numeric: tabular-nums; font-size: 20px; line-height: 1; }
.gc-carousel-divider { opacity: .5; }
.gc-carousel-arrows { display: flex; gap: 8px; margin-left: auto; }
.gc-preset-arc .gc-carousel-controls, .gc-preset-arc-tabs .gc-carousel-controls { gap: 8px; }
.gc-carousel-arrow, .gc-carousel-playback {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  padding: 0;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
  line-height: 1;
  transition: background .18s, color .18s, opacity .18s;
}
.gc-carousel button[hidden] { display: none; }
.gc-carousel button:disabled { opacity: .25; cursor: default; }
.gc-carousel button:focus-visible, .gc-carousel-stage:focus-visible { outline: 3px solid var(--gc-accent, #7456f6); outline-offset: 5px; }
.gc-carousel-arrow:hover:not(:disabled), .gc-carousel-playback:hover { background: rgb(127 127 127 / 13%); }
.gc-carousel-tabs {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  max-width: 100%;
  padding: 20px 16px 10px;
  overflow-x: auto;
  scrollbar-width: thin;
}
.gc-carousel .gc-carousel-tab {
  flex: 0 0 auto;
  max-width: 260px;
  overflow: hidden;
  padding: 11px 18px;
  border: 0;
  border-radius: 99px;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.gc-carousel-tab.is-active { background: #23231f; color: #fff; }
.gc-carousel-tab:first-child { margin-left: auto; }
.gc-carousel-tab:last-child { margin-right: auto; }
.gc-carousel .gc-choice-dots { gap: 0; }
.gc-choice-dot:first-child { margin-left: auto; }
.gc-choice-dot:last-child { margin-right: auto; }
.gc-carousel .gc-choice-dot {
  display: grid; flex: none; place-items: center; width: 32px; height: 32px;
  border: 0; padding: 0; border-radius: 50%; cursor: pointer; color: inherit; background: transparent;
}
.gc-choice-dot::before {
  content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .4;
}
.gc-choice-dot.is-active::before { width: 11px; height: 11px; opacity: 1; }
.gc-carousel-cursor {
  position: absolute;
  z-index: 1500;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #252521;
  color: #fff;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(.8);
  opacity: 0;
  transition: opacity .15s, transform .15s;
}
.gc-carousel-stage.has-pointer .gc-carousel-cursor { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.gc-carousel-stage.is-dragging .gc-carousel-cursor { transform: translate(-50%, -50%) scale(.85); }
.gc-carousel-sr { position: absolute !important; width: 1px !important; height: 1px !important; overflow: hidden !important; clip-path: inset(50%) !important; white-space: nowrap !important; padding: 0 !important; margin: -1px !important; border: 0 !important; }

/* The offset active image leaves a quiet rail for count and navigation. */
.gc-preset-infinite .gc-carousel-stage::after {
  content: '';
  position: absolute;
  z-index: 1100;
  inset: 0 auto 0 0;
  width: 30%;
  pointer-events: none;
  background: linear-gradient(90deg, var(--gc-background, #f5f4f0) 8%, transparent);
}
.gc-preset-infinite .gc-carousel-controls { position: absolute; inset: 0 auto 0 0; width: 29%; padding: 28px; pointer-events: none; display: block; }
.gc-preset-infinite .gc-carousel-counter { position: absolute; top: 20%; left: 28px; font-size: clamp(28px, 4.5vw, 62px); letter-spacing: -.06em; }
.gc-preset-infinite .gc-carousel-arrows { position: absolute; bottom: 19%; left: 28px; pointer-events: auto; }
.gc-preset-infinite .gc-carousel-playback { position: absolute; bottom: 19%; left: calc(44px + 2 * var(--gc-control-size, 44px)); pointer-events: auto; }
.gc-preset-infinite .gc-card-title, .gc-preset-arc .gc-card-title { font-size: 15px; }
.gc-preset-infinite .gc-card-copy, .gc-preset-arc .gc-card-copy { padding: 13px 16px; }
.gc-preset-arc .gc-carousel-stage::before, .gc-preset-arc-tabs .gc-carousel-stage::before {
  content: '';
  position: absolute;
  left: 50%;
  top: calc(50% + (var(--gc-sweep-above, 0px) - var(--gc-sweep-below, 0px)) / 2);
  width: 130%;
  height: 145%;
  border: 1px dashed currentColor;
  border-radius: 50%;
  transform: translateX(-50%);
  opacity: .09;
  pointer-events: none;
}
.gc-preset-arc-tabs .gc-card-media { aspect-ratio: 4 / 3; }
.gc-preset-arc-tabs .gc-card-copy { min-height: 88px; }
.gc-preset-arc-tabs .gc-carousel-card.is-active { box-shadow: 0 10px 40px rgb(0 0 0 / 12%); }
.gc-preset-showcase { background: var(--gc-showcase-background, #20201e); color: #f6f5ef; }
.gc-preset-showcase .gc-carousel-stage { perspective: 1500px; }
.gc-preset-showcase .gc-carousel-card { border: 5px solid #3b3b35; border-radius: var(--gc-card-radius, 8px); background: #30302b; color: #f3f3ed; }
.gc-preset-showcase .gc-carousel-card.is-active { border-color: var(--gc-accent, #b5f65c); }
.gc-preset-showcase .gc-carousel-card.is-active .gc-card-copy { background: var(--gc-accent, #b5f65c); color: #171913; }
.gc-preset-showcase .gc-card-copy { padding: 12px 14px; }
.gc-preset-showcase .gc-card-title { font-size: 16px; }
.gc-preset-showcase .gc-carousel-counter { opacity: .65; }

.gc-preset-timed .gc-card-media { grid-area: 1 / 1; align-self: stretch; aspect-ratio: 16 / 10; }
.gc-preset-timed .gc-carousel-card { display: grid; container: gc-timed-card / inline-size; background: #25251f; color: white; }
.gc-preset-timed .gc-carousel-card .gc-card-copy {
  grid-area: 1 / 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: stretch;
  padding: clamp(20px, 5cqw, 48px);
  padding-inline-end: 44%;
  --gc-timed-shade: color-mix(in srgb, var(--gc-timed-scrim, #171717) 88%, transparent);
  background: linear-gradient(90deg, var(--gc-timed-shade) 0% 52%, transparent 82%);
}
@container gc-timed-card (max-width: 480px) {
  .gc-preset-timed .gc-carousel-card .gc-card-copy {
    --gc-timed-photo-top: clamp(92px, 36cqw, 152px);
    justify-content: flex-end;
    padding: var(--gc-timed-photo-top) clamp(16px, 6cqw, 28px) clamp(16px, 6cqw, 28px);
    background: linear-gradient(180deg, transparent 0 calc(var(--gc-timed-photo-top) / 2), var(--gc-timed-shade) var(--gc-timed-photo-top));
  }
}
.gc-preset-timed .gc-card-title { max-width: 90%; font-size: clamp(23px, 4vw, 48px); letter-spacing: -.035em; }
.gc-preset-timed .gc-card-description p, .gc-preset-timed .gc-card-description { max-width: 38ch; font-size: clamp(13px, 1.8vw, 18px); line-height: 1.4; }
.gc-preset-timed .gc-carousel-controls { display: grid; grid-template-columns: 1fr auto 1fr; }
.gc-preset-timed .gc-carousel-counter { display: none; }
.gc-preset-timed .gc-carousel-arrows { margin: 0; justify-self: start; }
.gc-preset-timed .gc-carousel-playback { justify-self: end; }
.gc-carousel-pagination { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 32px; }
.gc-carousel-dot {
  position: relative;
  width: 9px;
  height: 9px;
  padding: 0;
  border: 0;
  border-radius: 99px;
  background: #a3a3a0;
  color: #171715;
  cursor: pointer;
  transition: width .28s;
}
.gc-carousel-dot::before { content: ''; position: absolute; inset: -10px -4px; }
.gc-carousel-dot.is-active { width: 52px; }
.gc-carousel-dot-fill { position: absolute; inset: 0; border-radius: inherit; background: currentColor; transform: scaleX(0); transform-origin: left; pointer-events: none; }
.gc-reduced-motion .gc-carousel-dot.is-active .gc-carousel-dot-fill { transform: scaleX(1) !important; }
.gc-reduced-motion *, .gc-reduced-motion *::before { transition-duration: 0s !important; }
@media (max-width: 660px) {
  .gc-carousel-tabs { justify-content: flex-start; padding: 16px 14px 8px; scroll-padding-inline: 14px; }
  .gc-carousel-tab:first-child { margin-left: 0; }
  .gc-carousel-tab:last-child { margin-right: 0; }
  .gc-carousel .gc-carousel-tab { padding: 10px 14px; font-size: 13px; }
  .gc-carousel .gc-card-copy { padding: 14px 16px; }
  .gc-carousel .gc-card-description p, .gc-carousel .gc-card-description { font-size: 12px; }
  .gc-carousel .gc-card-title { font-size: 18px; }
  .gc-carousel-controls { gap: 12px; }
  .gc-preset-infinite .gc-carousel-stage::after { display: none; }
  .gc-preset-infinite .gc-carousel-controls { position: relative; inset: auto; width: 100%; display: flex; padding: 4px 18px 22px; }
  .gc-preset-infinite .gc-carousel-counter, .gc-preset-infinite .gc-carousel-arrows, .gc-preset-infinite .gc-carousel-playback { position: static; }
  .gc-preset-infinite .gc-carousel-counter { font-size: 25px; }
  .gc-preset-infinite .gc-carousel-arrows { margin-left: auto; }
  .gc-preset-timed .gc-carousel-controls { column-gap: 12px; padding-inline: 16px; }
  .gc-preset-timed .gc-carousel-arrows { gap: 4px; }
  .gc-preset-timed .gc-carousel-pagination { gap: 6px; }
  .gc-preset-timed .gc-carousel-dot { width: 6px; height: 6px; }
  .gc-preset-timed .gc-carousel-dot.is-active { width: 32px; }
  .gc-preset-timed .gc-card-title { font-size: 24px; }
}
@container gc-carousel (max-width: 660px) {
  .gc-carousel-tabs { padding: 16px 14px 8px; scroll-padding-inline: 14px; }
  .gc-carousel .gc-carousel-tab { padding: 10px 14px; font-size: 13px; }
  .gc-carousel-tab:first-child { margin-left: 0; }
  .gc-carousel-tab:last-child { margin-right: 0; }
  .gc-carousel .gc-card-copy { padding: 14px 16px; }
  .gc-carousel .gc-card-description p, .gc-carousel .gc-card-description { font-size: 12px; }
  .gc-carousel .gc-card-title { font-size: 18px; }
  .gc-carousel-controls { gap: 12px; }
  .gc-preset-infinite .gc-carousel-stage::after { display: none; }
  .gc-preset-infinite .gc-carousel-controls { position: relative; inset: auto; width: 100%; display: flex; padding: 4px 18px 22px; }
  .gc-preset-infinite .gc-carousel-counter, .gc-preset-infinite .gc-carousel-arrows, .gc-preset-infinite .gc-carousel-playback { position: static; }
  .gc-preset-infinite .gc-carousel-counter { font-size: 25px; }
  .gc-preset-infinite .gc-carousel-arrows { margin-left: auto; }
  .gc-preset-timed .gc-carousel-controls { column-gap: 12px; padding-inline: 16px; }
  .gc-preset-timed .gc-carousel-arrows { gap: 4px; }
  .gc-preset-timed .gc-carousel-pagination { gap: 6px; }
  .gc-preset-timed .gc-carousel-dot { width: 6px; height: 6px; }
  .gc-preset-timed .gc-carousel-dot.is-active { width: 32px; }
  .gc-preset-timed .gc-card-title { font-size: 24px; }
}
@media (hover: none) { .gc-carousel-cursor { display: none; } }
@media (prefers-reduced-motion: reduce) {
  .gc-carousel *, .gc-carousel *::before { transition-duration: 0s !important; }
  .gc-carousel-cursor { display: none; }
}
`});var ba,fa=te(()=>{ba=`.gc-spatial {
  position: relative;
  min-width: 0;
  isolation: isolate;
  --gc-spatial-ink: #20241f;
  --gc-spatial-surface: #f5f6f2;
  --gc-spatial-line: rgba(32, 36, 31, .18);
  color: var(--gc-spatial-ink);
  background: var(--gc-spatial-surface);
  border-radius: 24px;
  overflow: hidden;
}

.gc-spatial .gc-spatial-canvas {
  position: relative;
  width: 100%;
  height: var(--gc-spatial-height, 620px);
  min-height: 280px;
  overflow: hidden;
  perspective: 1100px;
  perspective-origin: 50% 50%;
  touch-action: pan-y;
  cursor: grab;
  -webkit-user-select: none;
  user-select: none;
}

.gc-spatial .gc-spatial-canvas.is-dragging,
.gc-spatial .gc-spatial-canvas.is-dragging * { cursor: grabbing !important; }

.gc-spatial .gc-spatial-native-track { box-sizing: border-box; list-style: none; }
.gc-spatial .gc-spatial-native-track > .gc-spatial-position {
  position: absolute;
  box-sizing: border-box;
  min-width: 0;
  max-width: none;
  max-height: none;
  list-style: none;
}

.gc-spatial .gc-spatial-position {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  translate: -50% -50%;
  margin: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

.gc-spatial .gc-spatial-card {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  container-type: inline-size;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: var(--gc-spatial-radius, 18px);
  overflow: hidden;
  color: inherit;
  background: #dddeda;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .08);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transform-style: preserve-3d;
  -webkit-tap-highlight-color: transparent;
}

.gc-spatial .gc-spatial-card:focus-visible {
  outline: 3px solid var(--gc-accent, #dfff79);
  outline-offset: 5px;
}

.gc-spatial .gc-spatial-card .gc-card-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  aspect-ratio: auto;
  overflow: hidden;
  border-radius: inherit;
}

.gc-spatial .gc-spatial-card img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: var(--gc-spatial-fit, cover);
  border-radius: inherit;
  pointer-events: none;
  -webkit-user-drag: none;
}

.gc-spatial .gc-spatial-card .gc-card-copy {
  position: absolute;
  inset: auto 0 0;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  max-height: 45%;
  padding: clamp(2px, 2cqi, 7px) clamp(4px, 5cqi, 14px);
  margin: 0;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(transparent, rgba(0, 0, 0, .76));
  pointer-events: none;
}

.gc-spatial .gc-spatial-card .gc-card-copy:empty { display: none; }
.gc-spatial .gc-spatial-card .list-item-content__text-wrapper { width: 100%; min-width: 0; }
.gc-spatial.gc-stage .gc-spatial-card :is(.gc-card-title, .list-item-content__title) {
  display: block;
  min-width: 0;
  max-width: 100%;
  margin: 0;
  color: var(--gc-section-card-title, inherit);
  /* Native headings retain their Site Styles font. Only the tile label is compact. */
  font-size: clamp(10px, 7cqi, 16px) !important;
  line-height: 1.2 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gc-spatial .gc-spatial-nav {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 68px;
  padding: 0 20px 18px;
}

.gc-spatial .gc-spatial-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--gc-spatial-line);
  border-radius: 50%;
  color: inherit;
  background: transparent;
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background-color .16s, color .16s;
}

.gc-spatial .gc-spatial-control:hover:not(:disabled) { background: var(--gc-spatial-ink); color: var(--gc-spatial-surface); }
.gc-spatial .gc-spatial-control:focus-visible { outline: 3px solid var(--gc-accent, #739530); outline-offset: 3px; }
.gc-spatial .gc-spatial-control:disabled { opacity: .3; cursor: default; }
.gc-spatial .gc-spatial-count { min-width: 67px; text-align: center; font: 11px/1.2 ui-monospace, SFMono-Regular, monospace; font-variant-numeric: tabular-nums; letter-spacing: .07em; }
.gc-spatial .gc-spatial-empty { position: absolute; inset: 45% 20px auto; margin: 0; text-align: center; opacity: .65; }
.gc-spatial .gc-spatial-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

.gc-wall {
  --gc-spatial-ink: #f8f9f3;
  --gc-spatial-surface: #101310;
  --gc-spatial-line: rgba(255, 255, 255, .25);
}

.gc-wall .gc-spatial-canvas { perspective: 1000px; }
.gc-wall .gc-spatial-canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  background: linear-gradient(0deg, #101310 0%, transparent 15%, transparent 85%, #101310 100%);
}
.gc-wall .gc-spatial-card { background: #282d27; box-shadow: 0 12px 28px rgba(0, 0, 0, .3); }
.gc-wall .gc-spatial-card .gc-card-copy { opacity: 0; transition: opacity .16s; }
.gc-wall .gc-spatial-card:hover .gc-card-copy,
.gc-wall .gc-spatial-card:focus-within .gc-card-copy { opacity: 1; }
.gc-wall .gc-spatial-position { transition: opacity .12s; }

.gc-ring .gc-spatial-canvas { perspective: 1400px; }
.gc-ring .gc-spatial-card { border-radius: min(var(--gc-spatial-radius, 18px), 8px); box-shadow: 0 3px 7px rgba(20, 25, 18, .12); }
.gc-ring .gc-ring-center {
  position: absolute;
  top: var(--gc-ring-label-y);
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--gc-ring-label-width);
  pointer-events: none;
  text-align: center;
  overflow-wrap: anywhere;
  color: var(--gc-spatial-ink);
  opacity: .55;
  font-size: 10px;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.gc-ring .gc-ring-center.is-below {
  position: static;
  transform: none;
  width: auto;
  padding: 0 20px 12px;
}
.gc-ring .gc-ring-label { display: block; margin-bottom: 10px; font-size: clamp(12px, 1.4vw, 19px); line-height: 1.3; letter-spacing: 0; text-transform: none; }
.gc-ring .gc-ring-label[hidden] { display: none; }

.gc-angled .gc-spatial-canvas { perspective: 1200px; }
.gc-angled .gc-spatial-card { box-shadow: 3px 7px 18px rgba(0, 0, 0, .11); }
.gc-angled .gc-spatial-card .gc-card-copy { opacity: 0; transition: opacity .18s; }
.gc-angled .gc-spatial-card:hover .gc-card-copy,
.gc-angled .gc-spatial-card:focus-within .gc-card-copy { opacity: 1; }

.gc-spatial.gc-spatial-reduced .gc-spatial-canvas {
  display: flex;
  align-items: center;
  --gc-reduced-gutter: max(0px, calc((100% - min(var(--gc-spatial-card-width), 72%)) / 2));
  gap: var(--gc-spatial-gap, 20px);
  padding: 20px var(--gc-reduced-gutter);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  perspective: none;
  scroll-snap-type: x proximity;
  touch-action: pan-x pan-y;
  cursor: auto;
}
.gc-spatial-reduced .gc-spatial-canvas[data-gc-native-track] {
  gap: var(--gc-spatial-gap, 20px) !important;
  padding-inline: var(--gc-reduced-gutter) !important;
}
.gc-spatial.gc-spatial-reduced .gc-spatial-position {
  position: relative;
  flex: 0 0 auto;
  top: auto;
  left: auto;
  translate: none;
  transform: none !important;
  will-change: auto;
  scroll-snap-align: center;
}
.gc-spatial.gc-spatial-reduced .gc-spatial-card { transform: none !important; }
.gc-spatial.gc-spatial-reduced .gc-spatial-card .gc-card-copy { display: block; opacity: 1; }
.gc-spatial.gc-spatial-reduced .gc-spatial-card .gc-card-copy:empty { display: none; }
.gc-spatial.gc-spatial-reduced .gc-spatial-canvas::after { display: none; }
.gc-spatial.gc-spatial-reduced * { transition: none !important; }

@media (hover: none) {
  .gc-wall .gc-spatial-card.is-selected .gc-card-copy,
  .gc-angled .gc-spatial-card.is-selected .gc-card-copy { opacity: 1; }
}

@media (max-width: 600px) {
  .gc-spatial { border-radius: 16px; }
  .gc-spatial .gc-spatial-canvas { height: min(var(--gc-spatial-height, 620px), 68svh); min-height: 290px; }
  .gc-spatial .gc-spatial-nav { min-height: 64px; padding-bottom: 14px; gap: 12px; }
  .gc-wall .gc-spatial-canvas { perspective: 850px; }
}

@media (prefers-reduced-motion: reduce) {
  .gc-spatial *, .gc-spatial *::before, .gc-spatial *::after { transition: none !important; scroll-behavior: auto !important; }
}
`});function tt(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Ut(t,e){let r=tt(e.preset??t.preset),i=r===tt(t.preset)?t.stageHeight:r?0:590;return{...e.preset==="spiral"?Ye:{},...t,...e,stageHeight:e.stageHeight??i}}function ya(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function va(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[sa,pa,ua,la].join(`
`),document.head.append(e));let r=ya(t);if(r==="common")return()=>{};let i=`gc-runtime-${r}-css`,o=document.getElementById(i);o||(o=document.createElement("style"),o.id=i,r==="carousel"?o.textContent=ma:r==="spatial"?o.textContent=ba:o.textContent=[qi,Li,Fi,Di].join(`
`),e.after(o)),o.dataset.gcOwners=String(Number(o.dataset.gcOwners||0)+1);let a=!1;return()=>{if(a)return;a=!0;let s=Number(o.dataset.gcOwners)-1;s>0?o.dataset.gcOwners=String(s):o.remove()}}function yr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function xa(t,e,r={},i=null){let o=Ut(st,r),a=null,s=null,c=null,n=null,u=0,m=0,f,x;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function y(){s&&(c?.destroy(),c=null,s.close(),s.remove(),s=null,a?.setSuspended?.(!1),n?.focus({preventScroll:!0}))}function d(w,D){if(o.clickAction==="none")return;if(o.clickAction==="link"){let R=pt(w.link);R&&window.open(R,"_blank","noopener,noreferrer");return}let W=document.activeElement;if(s&&y(),n=W,w.postUrl){c=Do(w,b(),y),s=c.dialog,v(),c.load();return}s=document.createElement("dialog"),s.className="gc-dialog"+(o.preset==="showcase"?" gc-dialog-drawer":""),s.setAttribute("aria-label",w.title||"Image preview");let M=document.createElement("button");M.className="gc-dialog-close",M.type="button",M.textContent="Close \xD7",M.addEventListener("click",y);let I=document.createElement("div");I.className="gc-dialog-content";let B=document.createElement("div");B.className="gc-dialog-media",w.src&&o.popupImage!==!1&&(B.append(mo(w)),I.append(B));let U=document.createElement("div");if(U.className="gc-dialog-copy",w.title&&o.popupTitle!==!1){let R=document.createElement("h2");R.textContent=w.title,U.append(R)}if(w.description&&o.popupDescription!==!1){let R=document.createElement("div");R.innerHTML=$t(w.description),U.append(R)}if(w.link&&o.popupButton!==!1){let R=document.createElement("a");R.href=pt(w.link),R.textContent=w.buttonLabel||"Open link",R.target="_blank",R.rel="noopener noreferrer",U.append(R)}let X=document.createElement("p");X.className="gc-dialog-count",X.textContent=`${D+1} / ${e.length}`,U.append(X),I.append(U),s.append(M,I),v(),Gt(B.querySelector("img")),M.focus()}function v(){yo(t,s),s.showModal(),a?.setSuspended?.(!0),s.addEventListener("cancel",w=>{w.preventDefault(),y()}),s.addEventListener("click",w=>{if(w.target===s){let D=s.getBoundingClientRect();(w.clientX<D.left||w.clientX>D.right||w.clientY<D.top||w.clientY>D.bottom)&&y()}})}function S(w,D,W={}){if(i)return i.makeCard(w,D,W,o,d);let M=document.createElement("button");M.type="button",M.className="gc-card",M.setAttribute("aria-label",w.title||`Image ${D+1}`);let I=document.createElement("span");I.className="gc-card-media",w.src&&o.popupImage!==!1&&(I.append(mo(w)),M.append(I));let B=document.createElement("span");if(B.className="gc-card-copy",W.caption!==!1&&o.showTitles&&w.title){let U=document.createElement("span");U.className="gc-card-title",U.textContent=w.title,B.append(U)}if(W.description&&w.description){let U=document.createElement("span");U.className="gc-card-description",U.textContent=yr(w.description),B.append(U)}return B.childNodes.length&&M.append(B),M.addEventListener("click",()=>d(w,D)),M}let h=matchMedia("(prefers-reduced-motion: reduce)"),p=matchMedia("(max-width: 660px)");function b(){let w={...Zt(t,o),reducedMotion:o.reducedMotion||h.matches};if(p.matches&&(o.preset!=="spiral"||o.mobileSizing)){if(o.preset==="spiral"){for(let[D,W]of[["spiralWidth","mobileSpiralWidth"],["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])o[W]!=null&&(w[D]=o[W]);o.mobileHeightMode&&o.mobileHeightMode!=="inherit"&&(w.heightMode=o.mobileHeightMode,w.stageHeight=o.mobileStageHeight??w.stageHeight,w.viewportHeight=o.mobileViewportHeight)}o.mobileCardWidth!=null&&(w.cardWidth=o.mobileCardWidth),o.mobileGap!=null&&(w[o.preset==="spiral"?"spiralGap":"gap"]=o.mobileGap)}return w.phoneWidthOverride=p.matches&&o.mobileCardWidth!=null,o.preset==="stack"&&(w.stackCardWidth=p.matches&&o.mobileCardWidth!=null?o.mobileCardWidth:Math.max(360,o.cardWidth*2.2)),w}function P(){t.classList.toggle("gc-hide-controls",o.showControls===!1);let w=Zt(t,o);ta(t,w),t.style.setProperty("--gc-fit",o.fit),t.style.setProperty("--gc-card-radius",o.radius+"px"),ia(t,w)}function L(w=0){y(),a?.destroy(),a=null,i?.restore(),cancelAnimationFrame(m),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let D=ya(o.preset);D!==f&&(x?.(),x=va(o.preset),f=D),P(),t.setAttribute("aria-label",o.previewScroll===!1?"Gallery":"Gallery preview");let W=i&&o.preset!=="spiral"?i:null;W?W.begin():i&&i.track.classList.add("gc-native-items-hidden");let M={host:t,items:e,openPost:d,initialIndex:w,nativeList:W,attachDialog:I=>yo(t,I),options:b(),makeCard:S,loadImage:Gt,onChange(I){u=I,o.onChange?.(I)}};if(!e.length){let I=document.createElement("p");I.className="gc-empty",I.textContent="Add images to your source to start exploring.",t.append(I);return}o.preset==="spiral"?a=Oi(M):o.preset==="stack"?a=Go(M):["wall","ring","angled"].includes(o.preset)?(a=Oo(M),w&&a.goTo(w)):a=No(M),o.preset!=="spiral"&&(m=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(I=>{Gt(I,{nativeCard:!!W})})))}let A=()=>L(u);function C(){o.preset!=="spiral"&&o.mobileCardWidth==null&&o.mobileGap==null||(a?.setGeometry?a.setGeometry(b()):o.preset==="spiral"?a?.update(b()):L(u))}try{L()}catch(w){throw x?.(),i?.restore(),w}return h.addEventListener("change",A),p.addEventListener("change",C),{update(w){let D=o.preset,W=b();o=Ut(o,w);let M=b(),I=Object.keys(M).filter(U=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(U)&&M[U]!==W[U]);if(!I.length)return;if(a?.setGeometry&&I.every(U=>["cardWidth","gap","phoneWidthOverride"].includes(U))){a.setGeometry(M);return}let B=U=>["colorSource","typeSource","background","ink","accent"].includes(U);if(I.every(U=>B(U)||D!=="spiral"&&(U==="radius"||Object.hasOwn(bo,U)))){P(),I.includes("typeSource")&&i?.setType(o.typeSource);return}D==="spiral"&&o.preset==="spiral"&&a?.update?(P(),a.update(M)):L(D===o.preset?u:0)},goTo(w){a?.goTo?.(w)},setPlaying(w){o.autoplay=w,a?.setPlaying?.(w)},getOptions(){return{...o}},getActive(){return u},destroy(){y(),cancelAnimationFrame(m),a?.destroy(),i?.restore(),h.removeEventListener("change",A),p.removeEventListener("change",C),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),x?.()}}}function vr(t,e){let r=e.closest("section")||e,i=[];for(let o=t.parentElement;o;o=o.parentElement){let a=Le.scrollBoundaries.get(o)||0;if((a||["hidden","auto","scroll","overlay"].includes(getComputedStyle(o).overflowY))&&(Le.scrollBoundaries.set(o,a+1),o.classList.add("gc-stack-page-scroll"),i.push(o)),o===r)break}return()=>{for(let o of i){let a=Le.scrollBoundaries.get(o)-1;a?Le.scrollBoundaries.set(o,a):(Le.scrollBoundaries.delete(o),o.classList.remove("gc-stack-page-scroll"))}}}function ut(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function vo(t){if(!Le.editListeners?.size){Le.editListeners=new Set;let e=ut();Le.editObserver=new MutationObserver(()=>{let r=ut();if(r!==e){e=r;for(let i of Le.editListeners)try{i(r)}catch(o){console.warn("Gallery Studio: could not resume a list layout.",o)}}});for(let r of[document.body,document.documentElement])Le.editObserver.observe(r,{attributes:!0,attributeFilter:["class"]})}return Le.editListeners.add(t),()=>{Le.editListeners.delete(t),Le.editListeners.size||Le.editObserver.disconnect()}}function xo({selector:t,type:e="gallery",options:r={}}={}){let i=t;if(typeof t=="string")try{let B=document.querySelectorAll(t);if(B.length!==1)return null;i=B[0]}catch{return null}if(!i?.isConnected||typeof i.closest!="function")return null;let o=wt(i,e);if(!o)return null;let{source:a}=o,s=Le.mounts.get(a);if(s)return s.instance.update(r),s;if(!gt(a,e).length)return null;let c=document.createElement("div"),n=document.createElement("div");c.dataset.sourceType=e,c.className="gc-embed",n.className="gc-viewport-slot",n.append(c);let u={...Ut(st,r),previewScroll:!1},m=null,f=null,x=null,y=null,d=null,v=!1,S=[],h=null,p=!1,b=null;function P(){u.galleryWidth==="source"?(x?.(),x=null,h&&(n.classList.add("user-items-list-simple"),n.dataset.layoutWidth=h.mode,n.style.maxWidth=h.maximum)):x||(n.classList.remove("user-items-list-simple"),delete n.dataset.layoutWidth,n.style.removeProperty("max-width"),x=Ki(n,c,a,e))}function L(){return e!=="list"&&u.preset!=="stack"&&u.galleryHeight!=="custom"&&!!a.closest(".fluid-engine > .fe-block")}function A(){L()?y||(y=Vi(n,c,a)):(y?.(),y=null)}function C(B){B==="stack"?f||(f=vr(c,a)):f&&(f(),f=null)}function w(){try{m?.destroy()}finally{m=null,y?.(),y=null,C(null),x?.(),x=null,S.forEach(B=>B.classList.remove("gc-native-items-hidden")),S=[],b?.remove(),b=null,n.remove(),n.replaceChildren(c),c.inert=!1}}function D(){if(v||m||!a.isConnected)return;let B=wt(a,e),U=gt(a,e);if(!B||!U.length)return;B.originals[0].before(n),va();let X=B.originals[0];h=e==="list"?{mode:X.dataset.layoutWidth||"full",maximum:X.style.maxWidth}:null,P();let R=null;if(e==="list"){let H=p?X.cloneNode(!0):X;p&&(b=H,H.removeAttribute("id"),H.querySelectorAll("[id]").forEach(re=>re.removeAttribute("id")),n.append(H)),R=Xi(n,H,p?[...H.querySelectorAll(".list-item")]:B.rows)}(!R||p)&&(S=B.originals,S.forEach(H=>H.classList.add("gc-native-items-hidden"))),A(),C(u.preset),m=xa(c,U,u,R),c.inert=p}function W(){if(!v){v=!0,a.classList.remove("gc-edit-preview");try{w()}finally{d?.(),Le.mounts.delete(a)}}}let I={instance:{update(B={}){if(v)return;let U=u.galleryWidth;u={...Ut(u,B),previewScroll:!1},m&&(u.galleryWidth!==U&&P(),A(),C(u.preset),m.update(u))},setEditPreview(B){if(!(v||!ut()||B===p)){if(p=B,a.classList.toggle("gc-edit-preview",B),!B){w();return}try{D()}catch(U){throw this.setEditPreview(!1),U}}},goTo(B){m?.goTo(B)},setPlaying(B){u.autoplay=B,m?.setPlaying(B)},getOptions(){return{...u}},getActive(){return m?.getActive()??0},destroy:W},host:c,source:a,destroy:W};try{d=vo(B=>{if((p||B)&&w(),p=!1,a.classList.remove("gc-edit-preview"),!B)try{D()}catch(U){throw w(),U}}),ut()||D(),Le.mounts.set(a,I)}catch(B){throw W(),B}return I}var kt,st,Le,wo=te(()=>{Vt();Qt();Wo();Ho();$o();Uo();$i();Bt();fo();Yi();Ji();Zi();oa();ra();na();ca();da();ga();ha();fa();Bi();Ti();Ri();Pi();kt=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],st={...zt,...bo,popupDesktopLayout:"split",colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};Le=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:xa,embed:xo,presets:kt,loadPostData:Pt}});var ka,wa=te(()=>{ka=`:host {
  all: initial;
  position: fixed;
  z-index: 2147483000;
  inset: auto max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) auto;
  display: block;
  width: min(350px, calc(100vw - 32px));
  --gc-panel-accent: #354b9c;
  --gc-panel-border: #cdd1c5;
  --gc-panel-arrow: #555b50;
  color-scheme: light;
  font: 13px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #20231e;
  text-align: left;
  -webkit-text-size-adjust: 100%;
}

*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
h2, p { margin: 0; }
button, select, input, textarea { font: inherit; color: inherit; }
button, select { cursor: pointer; }
button { border: 0; margin: 0; }
button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible, summary:focus-visible {
  outline: 2px solid #2848c5;
  outline-offset: 3px;
}

.panel {
  display: flex;
  flex-direction: column;
  max-height: min(720px, calc(100vh - 40px));
  max-height: min(720px, calc(100dvh - 40px));
  overflow: hidden;
  border: 1px solid #d5d7ce;
  border-radius: 16px;
  background: #fafaf7;
  box-shadow: 0 16px 48px #10180d2b, 0 2px 8px #10180d14;
}
.header { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 14px 14px 18px; border-bottom: 1px solid #dfe1d8; }
.heading { min-width: 0; }
.heading h2 { font-size: 16px; font-weight: 650; line-height: 1.25; letter-spacing: -.025em; }
.target { margin-top: 3px; color: #60645b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.header-actions { display: flex; align-items: center; gap: 2px; }
.icon-button { display: grid; place-items: center; width: 34px; height: 34px; padding: 0; border-radius: 8px; background: transparent; font-size: 23px; font-weight: 350; line-height: 1; }
.icon-button:hover, .secondary:hover, .text-button:hover { background: #e9ebe3; }
:host([data-minimized]) { width: min(300px, calc(100vw - 32px)); }
:host([data-minimized]) .header { border-bottom: 0; padding-block: 9px; }

.controls { display: flex; flex-direction: column; min-height: 0; }
.scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
.preset-row { display: grid; gap: 6px; padding: 16px 18px; }
.field-label, .code-label { font-size: 12px; font-weight: 550; }
select {
  appearance: none;
  width: 100%;
  min-width: 0;
  min-height: 36px;
  padding: 6px 32px 6px 10px;
  border: 1px solid var(--gc-panel-border);
  border-radius: 7px;
  background: #fff;
}
.select-box {position:relative;display:grid;min-width:0}
.select-box::after, .group summary::after {
  content:"";
  width:7px;
  height:7px;
  border:solid var(--gc-panel-arrow);
  border-width:0 1.5px 1.5px 0;
  transform:translateY(-2px) rotate(45deg);
  pointer-events:none;
}
.select-box::after {position:absolute;right:12px;top:calc(50% - 3.5px)}
@media(forced-colors:active) {
  select {appearance:auto;padding-inline-end:6px}
  .select-box::after {display:none}
}

.preset-select { width: 100%; min-height: 39px; font-weight: 600; }
.style-actions { display: flex; gap: 8px; padding: 0 13px 8px; margin-top: -6px; }
.style-transfer { padding: 0 18px 12px; }
.style-transfer textarea { margin-bottom: 6px; }
.override-toggle { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.field-range .override-toggle input { width: 16px; height: 16px; }
.field-range input[type=range]:disabled { cursor: default; opacity: .55; }
.group { border-top: 1px solid #dfe1d8; }
.group summary { display: flex; justify-content: space-between; align-items: center; min-height: 43px; padding: 10px 18px; cursor: pointer; list-style: none; font-size: 13px; font-weight: 600; }
.group summary::-webkit-details-marker { display: none; }
.group summary::after {flex:none;margin-inline-end:12px}
.group[open] summary::after { transform: translateY(2px) rotate(225deg); }
.group summary:hover { background: #f0f1ea; }
.group-body { display: grid; gap: 12px; padding: 4px 18px 16px; }
.field { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 5px 9px; min-width: 0; }
.field .field-label { font-weight: 450; }
.field-select {grid-template-columns:minmax(0,1fr) minmax(174px,59%)}
.field-select select {font-size:12px}
@media(max-width:340px) {
  .field-select {grid-template-columns:minmax(0,1fr)}
}
.value { font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: #60665a; font-variant-numeric: tabular-nums; }
.field-range input[type=range] { grid-column: 1 / -1; display: block; width: 100%; height: 20px; margin: 0; accent-color: var(--gc-panel-accent); cursor: pointer; }
input[type=checkbox] {accent-color:var(--gc-panel-accent);margin:0}
.field-checkbox input { justify-self:end;align-self:center;width: 17px; height: 17px; margin: 0; accent-color: var(--gc-panel-accent); }
.field-color { grid-template-columns: minmax(0, 1fr) auto 36px; }
.field-color input { width: 36px; height: 26px; padding: 2px; border: 1px solid #cdd1c5; border-radius: 5px; background: #fff; cursor: pointer; }

.footer { flex: none; padding: 13px 16px 8px; border-top: 1px solid #d7dbd0; background: #f3f4ee; }
.export-actions { display: flex; gap: 7px; }
.primary, .secondary { min-height: 39px; border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 600; }
.primary { flex: 1; background: #263c88; color: #fff; }
.primary:hover { background: #17295f; }
.secondary { border: 1px solid #cbd0c3; background: #fafaf7; }
.footer-line { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; padding-top: 4px; }
.status { color: #3d5843; font-size: 11px; }
.text-button { flex: none; padding: 5px; border-radius: 4px; background: transparent; color: #52594e; font-size: 11px; text-decoration: underline; text-underline-offset: 2px; }
.code-view { margin-top: 10px; }
.code-label { display: grid; gap: 4px; color: #52594e; font-size: 11px; }
textarea { display: block; width: 100%; height: 80px; min-height: 48px; max-height: 130px; padding: 7px 9px; border: 1px solid #cbd0c3; border-radius: 6px; background: #fff; resize: vertical; font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; }

@media (max-width: 600px) {
  :host { inset: auto max(8px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) auto; width: min(390px, calc(100vw - 16px)); }
  .panel { max-height: min(530px, 56vh); max-height: min(530px, 56dvh); border-radius: 13px; }
  .header { padding: 8px 10px 8px 14px; }
  .icon-button { width: 37px; height: 37px; }
  .preset-row { padding: 10px 14px; }
  .group summary { padding-inline: 14px; }
  .group-body { padding-inline: 14px; }
  .footer { padding: 8px 12px 4px; }
  textarea { height: 62px; }
}

@media (max-height: 450px) {
  .panel { max-height: calc(100vh - 20px); max-height: calc(100dvh - 20px); }
  textarea { max-height: 54px; }
}

/* A real scroll container, isolated from page smooth scrolling. */
.controls{flex:1 1 auto;overflow:hidden}
.scroll{flex:1 1 auto;overflow-y:scroll;scrollbar-gutter:stable;touch-action:pan-y;scrollbar-width:auto;padding-bottom:16px}
.scroll::-webkit-scrollbar{width:10px}
.scroll::-webkit-scrollbar-thumb{background:#9ba28f;border:2px solid #fafaf7;border-radius:8px}
.scroll::-webkit-scrollbar-track{background:#eef0e8}

.backup-actions { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:7px; }
.backup-actions .secondary { min-height:28px; padding:4px 8px; font-weight:450; }
button:disabled { cursor:wait; opacity:.65; }
.footer-line { align-items:flex-start; }
.status { overflow-wrap:anywhere; }

.save-state { display:flex; align-items:center; gap:5px; margin-top:3px; font-size:11px; color:#75440d; }
.save-state::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; }
.save-state[data-saved=true] { color:#346249; }

.removal p {margin:0 0 10px;font-size:13px}
.removal button {margin:0 6px 4px 0}

:host { bottom:calc(max(16px, env(safe-area-inset-bottom)) + var(--gc-editor-bottom, 0px)) }
.panel {max-height:min(720px, calc(100dvh - 40px - var(--gc-editor-bottom, 0px)))}
.footer-line .text-button {min-height:32px}
@media(max-width:600px) {
  :host {bottom:calc(max(8px, env(safe-area-inset-bottom)) + var(--gc-editor-bottom, 0px))}
  .panel {max-height:min(530px, 56dvh, calc(100dvh - 16px - var(--gc-editor-bottom, 0px)))}
  .footer-line .text-button {min-height:44px}
}
@media(max-height:450px) {
  .panel {max-height:calc(100dvh - 20px - var(--gc-editor-bottom, 0px))}
}

.field-error {margin:2px 0 8px;color:#933821;font-size:12px}
textarea[aria-invalid=true] {border-color:#933821}
@media(max-height:500px) {
  .controls {overflow-y:auto;overscroll-behavior:contain}
  .scroll {flex:none;overflow:visible;scrollbar-gutter:auto}
}

.palette-chips {display:flex;gap:5px;flex-wrap:wrap}
.palette-chips .palette-chip {width:auto;min-width:26px;height:26px;padding:0 4px;border:1px solid #aaa;border-radius:50%;color:inherit;cursor:pointer}
.palette-chip[aria-pressed=true] {outline:2px solid currentColor;outline-offset:1px}
.paint-row{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:36px}
.paint-trigger{width:32px;height:32px;border:1px solid var(--gc-panel-border);background:#efefea;padding:5px;border-radius:6px}
.paint-trigger::after{content:"";display:block;height:100%;background:var(--chip);opacity:var(--alpha);border-radius:50%}
.paint-popup{position:fixed;inset:auto;margin:0;width:min(260px,calc(100vw - 16px));max-height:calc(100dvh - 16px);overflow:auto;border:1px solid var(--gc-panel-border);border-radius:12px;padding:12px;background:#fafaf7;color:#20231e;box-shadow:0 5px 20px #17261d25}
.paint-popup .field-palette>.field-label{display:none}
.paint-popup .field-palette{display:block}
.group-body .field[data-subsetting],.group-body .paint-row{margin-inline-start:10px}
`});function ie(t,e,r){let i=document.createElement(t);return e&&(i.className=e),r!==void 0&&(i.textContent=r),i}function ze(t,e,r){let i=ie("button",t,e);return i.type="button",r&&i.setAttribute("aria-label",r),i}function Sa(t){let e=ie("span","select-box");return e.append(t),e}function je(t,e,r,i,o,a=""){return{key:t,label:e,type:"range",min:r,max:i,step:o,unit:a}}function Ge(t,e,r){return{key:t,label:e,type:"select",choices:Object.entries(r).map(([i,o])=>({value:i,label:o}))}}function ct(t,e,r){return{key:t,label:e,type:"color",when:r,independent:!0}}function ko(t,e){let r=t.preset,i=tt(r),o=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,r==="timed"?960:r==="spiral"?720:560,1,"px"),je("stageHeight",i?"Minimum gallery height":"Gallery height",i?0:300,1200,1,"px")];if(e!=="list"&&(o.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&o.splice(o.findIndex(n=>n.key==="stageHeight"),1)),r==="spiral")o.push(...bt);else if(o.push(je("gap","Spacing",0,100,1,"px")),r!=="infinite"&&r!=="timed"){let n={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[r]||"Depth";o.push(je("depth",n,0,100,1))}let a=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":r==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(r==="arc-tabs"||r==="timed")&&a.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),r!=="stack"&&(a.push({key:"showControls",label:"Show controls",type:"checkbox"}),a.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),r!=="spiral"&&a.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),a.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let s=Jt.has(r),c=[{title:"Size & spacing",fields:o},{title:"Mobile overrides",fields:[{...o.find(n=>n.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...o.find(n=>n.key===(r==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:r==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:a},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:wr},...r==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),ct("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(r)?[Ge("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),ct("backColor","Back color",["backFace","solid"])]:[],...r==="stack"?[]:[Ge("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...s?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...r==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ge("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ge("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ge("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),ct("controlFill","Button background",["controlPalette","custom"]),ct("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...s?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(n=>({value:n,label:n+" rem"}))]}],Ge("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ge("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),ct("titleColor","Custom title color",["titlePalette","custom"])]},...s?qo({range:je,select:Ge,swatch:ct}):[]];if(r==="spiral"){c=To(t,e,{range:je,select:Ge,swatch:ct},c);for(let n of c)if(n.title==="Mobile")for(let u of n.fields.slice(1))u.condition=m=>m.mobileSizing,u.mobileRange=!!u.inherits}if(e==="summary"){let n={...Ge("popupDesktopLayout","Desktop layout",{split:"Split panel",drawer:"Slide-in drawer"}),when:["clickAction","preview"]},u=c.find(m=>m.title==="Popup");u?u.fields.unshift(n):c.push({title:"Popup",fields:[n]})}if(s){for(let n of c)if(n.fields=n.fields.flatMap(u=>{if(u.type!=="color"||!jt.includes(u.key))return[u];let m=u.when||(u.independent?void 0:["colorSource","custom"]);return[{...Ge(u.key+"Swatch",u.label+" palette",{custom:"Custom",...Kt}),type:"palette",when:m,condition:u.condition},{...u,when:m,condition:u.condition,customFor:u.key+"Swatch"},{...je(u.key+"Opacity",u.label+" opacity",0,100,1,"%"),when:m}]}),n.typography)for(let u of n.fields)u.typography=n.typography}return c}function Ca(t){return{...st,stageHeight:tt(t.preset??st.preset)?0:590,...t.preset==="spiral"?Ye:{},colorSource:"section",typeSource:"native",...t}}function kr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",r=t.name?.trim()||e,i=t.items?.length||0;return`${r.toLowerCase().includes(e.toLowerCase())?r:`${r} \xB7 ${e}`} \xB7 ${i} ${i===1?"item":"items"}`}function Sr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let r=e.ownerDocument,i=r.defaultView,o=0;function a(){o=0;let u=e.getBoundingClientRect();if(!u.width||!u.height||!e.offsetHeight)return;let m=u.height/e.offsetHeight,f=t.getBoundingClientRect(),x=u.width/e.offsetWidth,y=Math.min(u.bottom,i.innerHeight),d=y;for(let v of[.1,.5,.9]){let S=u.left+(f.left+f.width*v)*x,h=r.elementFromPoint(S,y-2);if(!(!h||h===e))for(;h&&!h.contains(e);){let p=h.getBoundingClientRect();p.bottom>=y-2&&p.height>0&&p.height<u.height/2&&(d=Math.min(d,p.top)),h=h.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((u.bottom-d)/m))+"px")}function s(){o||(o=requestAnimationFrame(a))}let c=new ResizeObserver(s);c.observe(e),c.observe(r.documentElement);let n=new MutationObserver(s);return n.observe(r.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),i.addEventListener("resize",s),i.addEventListener("transitionend",s),a(),()=>{c.disconnect(),n.disconnect(),i.removeEventListener("resize",s),i.removeEventListener("transitionend",s),cancelAnimationFrame(o)}}function Ma({source:t,options:e,onPreset:r,onOption:i,onClose:o,onRestore:a,onSave:s,getSaveState:c,getCode:n,getStyle:u,applyStyle:m}){let f=document.activeElement,x=t,y=Ca(e),d=!1,v=!1,S=0,h=new Map,p=[],b=new Map;function P(){for(let[l,g]of b)l.hidden=!y[g]}let L=new Map,A=ie("div");A.setAttribute("data-gc-author-panel",""),A.setAttribute("data-lenis-prevent",""),A.addEventListener("wheel",l=>l.stopPropagation(),{passive:!0}),A.addEventListener("touchmove",l=>l.stopPropagation(),{passive:!0});let C=A.attachShadow({mode:"open"}),w=ie("style");w.textContent=ka;let D=ie("aside","panel");D.setAttribute("aria-labelledby","gc-author-heading");let W=ie("header","header"),M=ie("div","heading"),I=ie("h2","","Gallery settings");I.id="gc-author-heading";let B=ie("p","target"),U=ie("p","save-state");U.setAttribute("role","status"),M.append(I,B,U);function X(l=c()){U.textContent!==l&&(U.textContent=l,U.dataset.saved=String(l==="Saved to page"))}let R=ie("div","header-actions"),H=ze("icon-button","\u2212","Minimize settings");H.setAttribute("aria-controls","gc-author-controls"),H.setAttribute("aria-expanded","true");let re=ze("icon-button","\xD7","Close settings");R.append(H,re),W.append(M,R);let z=ie("div","controls");z.id="gc-author-controls";let G=ie("div","scroll");G.tabIndex=0,G.setAttribute("aria-label","Layout settings");let O=ie("label","preset-row"),_=ie("select","preset-select");_.setAttribute("aria-label","Layout");for(let l of kt.filter(g=>t.type==="list"||g.id!=="stack")){let g=ie("option","",l.name);g.value=l.id,_.append(g)}O.append(ie("span","field-label","Layout"),Sa(_));let T=ie("div","groups"),V=ie("div","style-actions"),$=ze("text-button","Copy style"),K=ze("text-button","Paste style");V.append($,K);let ae=ie("div","style-transfer");ae.hidden=!0;let F=ie("textarea");F.setAttribute("aria-label","Gallery style"),F.spellcheck=!1;let Y=ze("secondary","Apply style"),ne=ze("text-button","Close","Close style transfer"),J=ie("p","field-error","Paste a gallery style created with Copy style.");J.id="gc-style-error",J.hidden=!0,J.setAttribute("role","alert");function ce(){J.hidden=!0,F.removeAttribute("aria-invalid"),F.removeAttribute("aria-describedby")}F.addEventListener("input",ce),ae.append(F,J,Y,ne),G.append(O,V,ae,T);let ue=ie("footer","footer"),se=ie("div","export-actions"),de=ze("primary","Save to page"),be=ze("secondary","Copy code"),xe=ze("text-button","Download header backup");xe.hidden=!0;let we=null,Q=ze("secondary","View code");Q.setAttribute("aria-expanded","false"),Q.setAttribute("aria-controls","gc-author-code"),se.append(de,be);let fe=ie("div","code-view");fe.id="gc-author-code",fe.hidden=!0;let oe=ie("label","code-label","Page Header Code Injection"),Ae=ie("textarea");Ae.readOnly=!0,Ae.spellcheck=!1,Ae.setAttribute("aria-label","Page header code"),oe.append(Ae),fe.append(oe);let pe=ie("div","footer-line"),ke=ie("span","status");ke.setAttribute("role","status");let Ce=ze("text-button","Reset preview");pe.append(ke,Ce);let Ee=ie("div","backup-actions"),ye=ze("text-button","Remove layout");ye.hidden=c()==="Not saved yet",Ee.append(Q,xe,ye);let Re=ie("div","removal");Re.hidden=!0,Re.append(ie("p","","Restore the native "+x.name+" and remove its saved layout from this page?"));let Oe=ze("secondary","Keep layout"),De=ze("secondary","Remove saved layout");Re.append(Oe,De),ue.append(se,Ee,fe,Re,pe),z.append(G,ue),D.append(W,z),C.append(w,D),document.body.append(A);let lt=Sr(A);function Fe(l){let{definition:g,input:k,output:E,row:N}=l,q=y[g.key];if(g.when&&(N.hidden=y[g.when[0]]!==g.when[1]),g.condition&&(N.hidden=g.when&&y[g.when[0]]!==g.when[1]||!g.condition(y)),g.type==="palette"){l.refresh?.();for(let j of k.children)j.setAttribute("aria-pressed",String(j.value===q));return}if(g.customFor&&y[g.customFor]!=="custom"){N.hidden=!0;return}if(g.type==="checkbox"){k.checked=!!q;return}if(g.type==="range"){let j=g.key==="spiralRise"&&y.spiralRiseUnit==="percent"?{...g,...g.percent}:g;k.min=String(j.min),k.max=String(j.max),k.step=String(j.step);let Z=g.inherits&&q==null;l.enable&&(l.enable.checked=!Z,k.disabled=!!Z),k.value=String(Z?y[g.inherits]:q);let ee=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(j.key)&&j.min===0&&Number(k.value)===0?"Auto":`${k.value}${j.unit||""}`;E.textContent=Z?`Inherit \xB7 ${ee}`:ee,k.setAttribute("aria-valuetext",ee);return}k.value=String(q),g.type==="color"&&(g.independent||(N.hidden=y.colorSource==="section"),E.textContent=k.value.toUpperCase())}function ot(){X(),S+=1,ke.textContent="",fe.hidden||(Ae.value=n())}function We(l,g){let k=y.spiralRiseUnit,E=h.get(l)?.definition.typography;if(E&&!y[E]&&(y[E]=!0,i(E,!0)),y={...y,[l]:g},l==="spiralRiseUnit"&&k!==g){let j=Math.max(1,y.stageHeight),Z=g==="percent"?Math.max(1,Math.min(30,Math.round(y.spiralRise/j*1e3)/10)):Math.max(8,Math.min(280,Math.round(y.spiralRise*j/100)));y.spiralRise=Z,i(l,g),i("spiralRise",Z),Fe(h.get("spiralRise"))}else i(l,g);let N=l.replace(/Swatch$|Opacity$/,""),q=N==="titleColor"?"titlePalette":N==="descriptionColor"?"descriptionCustom":null;if(y.preset==="spiral"&&q){let j=q==="titlePalette"?"custom":!0;y[q]=j,i(q,j)}l==="galleryHeight"&&(Ie(),h.get(l).input.focus({preventScroll:!0})),l==="colorSource"?h.forEach(Fe):Fe(h.get(l));for(let j of h.values())(j.definition.inherits===l||j.definition.when?.[0]===l||j.definition.customFor===l)&&Fe(j);y.preset==="spiral"&&(h.forEach(Fe),P()),ot()}function He(l){let{key:g,label:k,type:E}=l,N=ie(l.inherits||E==="palette"?"div":"label",`field field-${E}`);y.preset==="spiral"&&l.when&&N.setAttribute("data-subsetting","");let q=ie("span","field-label",k);if(E==="palette"){let ee=ie("div","palette-chips"),ge=getComputedStyle(x.root);ee.setAttribute("role","group"),ee.setAttribute("aria-label",k);for(let ve of l.choices){let he=ze("palette-chip",ve.value==="custom"?"+":"",ve.label);he.value=ve.value,he.title=ve.label;let Se=ge.getPropertyValue("--"+ve.value+"-hsl").trim();Se?he.style.backgroundColor="hsl("+Se+")":ve.value!=="custom"&&(he.textContent=ve.label),he.addEventListener("click",()=>We(g,ve.value)),ee.append(he)}N.append(q,ee);let me={definition:l,row:N,input:ee};return h.set(g,me),Fe(me),N}let j=ie(E==="select"?"select":"input");if(j.setAttribute("aria-label",k),j.dataset.option=g,E==="select")for(let ee of l.choices){let ge=ie("option","",ee.label);ge.value=ee.value,j.append(ge)}else j.type=E;let Z;(E==="range"||E==="color")&&(Z=ie("output","value"),Z.setAttribute("aria-hidden","true")),N.append(q),Z&&N.append(Z),N.append(E==="select"?Sa(j):j);let le={definition:l,input:j,output:Z,row:N};if(l.inherits&&!l.mobileRange){let ee=ie("input");ee.type="checkbox",ee.setAttribute("aria-label","Customize "+k.toLowerCase());let ge=ie("label","override-toggle");ge.append(ee,q),N.prepend(ge),le.enable=ee,ee.addEventListener("change",()=>We(g,ee.checked?y[l.inherits]:null))}return h.set(g,le),Fe(le),j.addEventListener(E==="range"||E==="color"?"input":"change",()=>{let ee=E==="range"||l.numeric?Number(j.value):E==="checkbox"?j.checked:j.value;We(g,ee)}),N}function Ie(){let l=new Map([...L].map(([g,k])=>[g,k.open]));p.splice(0).forEach(g=>g()),b.clear(),h.clear(),L.clear(),T.replaceChildren();for(let g of ko(y,x.type)){let k=ie("details","group");k.open=l.get(g.title)??["Elements","Size & spacing"].includes(g.title);let E=ie("summary","",g.title),N=ie("div","group-body"),q=y.preset==="spiral"?{Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[g.title]:null;q&&b.set(k,q);let j;for(let Z of g.fields){let le=He(Z);if(y.preset==="spiral"&&Z.type==="palette"){let ee=Z.key.slice(0,-6),ge=ie("div","paint-row"),me=ze("paint-trigger","",Z.label.replace(/ palette$/,"")),ve=ie("span","field-label",Z.label.replace(/ palette$/,""));j=ie("div","paint-popup"),j.popover="auto",me.popoverTargetElement=j,ge.append(ve,me,j),N.append(ge),j.append(le);let he=()=>{ge.hidden=le.hidden;let Ct=y[Z.key],Mt=getComputedStyle(x.root).getPropertyValue("--"+Ct+"-hsl");if(me.style.setProperty("--chip",Mt?"hsl("+Mt+")":y[ee]),me.style.setProperty("--alpha",y[ee+"Opacity"]/100),!Se.matches(":popover-open"))return;let Qe=me.getBoundingClientRect(),At=Se.offsetWidth,Yt=Se.offsetHeight;Se.style.left=Math.max(8,Math.min(innerWidth-At-8,Qe.right-At))+"px",Se.style.top=Math.max(8,Math.min(innerHeight-Yt-8,Qe.bottom+Yt+8<=innerHeight?Qe.bottom+4:Qe.top-Yt-4))+"px"},Se=j,mt=new ResizeObserver(he),St=()=>{mt.disconnect(),window.removeEventListener("scroll",he,!0),window.removeEventListener("resize",he)};p.push(St),j.addEventListener("toggle",()=>{Se.matches(":popover-open")?(mt.observe(Se),window.addEventListener("scroll",he,!0),window.addEventListener("resize",he),he()):St()}),h.get(Z.key).refresh=he,he()}else j&&(Z.customFor||Z.key.endsWith("Opacity"))?(j.append(le),Z.customFor||(j=null)):(j=null,N.append(le))}k.append(E,N),T.append(k),L.set(g.title,k)}P()}function Ve(l){if(v)return;let g=y.preset;x=l.source??x,l.options&&(y=Ca(l.options)),B.textContent=kr(x),B.title=x.selector||B.textContent,_.value=y.preset,!h.size||g!==y.preset?Ie():(h.forEach(Fe),P()),ot()}function Te(l){fe.hidden=!l,Q.textContent=l?"Hide code":"View code",Q.setAttribute("aria-expanded",String(l)),l&&(Ae.value=n(),Ae.focus({preventScroll:!0}),Ae.select())}function Ze(){if(v)return;v=!0,S+=1;let l=document.activeElement===A;document.removeEventListener("keydown",Me),p.splice(0).forEach(g=>g()),lt(),A.remove(),l&&f?.isConnected&&f.focus({preventScroll:!0})}function Ue(l){if(!v)try{l()}finally{Ze()}}function Me(l){if(!(l.key!=="Escape"||l.defaultPrevented||l.isComposing)&&!C.querySelector(".paint-popup:popover-open")){if(!Re.hidden){l.preventDefault(),$e(!1);return}document.querySelector("dialog[open]")||l.composedPath().some(g=>g?.getAttribute?.("aria-modal")==="true")||(l.preventDefault(),!ae.hidden&&(ae.contains(C.activeElement)||fe.hidden)?(ae.hidden=!0,(F.readOnly?$:K).focus()):fe.hidden?Ue(o):(Te(!1),Q.focus()))}}H.addEventListener("click",()=>{d=!d,z.hidden=d,A.toggleAttribute("data-minimized",d),H.textContent=d?"+":"\u2212",H.setAttribute("aria-expanded",String(!d)),H.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),re.addEventListener("click",()=>Ue(o)),Ce.addEventListener("click",()=>Ue(a)),_.addEventListener("change",()=>r(_.value)),Q.addEventListener("click",()=>Te(fe.hidden));function _e(l,g){ce(),ae.hidden=!1,Y.hidden=l,F.readOnly=l,F.value=g,F.placeholder=l?"":"Paste the copied gallery style",F.focus(),l&&F.select()}$.addEventListener("click",async()=>{let l=u();try{await navigator.clipboard.writeText(l),v||(ae.hidden=!0,ke.textContent="Style copied")}catch{if(v)return;_e(!0,l),ke.textContent="Style selected. Choose Copy."}}),K.addEventListener("click",()=>{ke.textContent="",_e(!1,"")}),ne.addEventListener("click",()=>{ae.hidden=!0,(F.readOnly?$:K).focus()}),Y.addEventListener("click",()=>{if(!m(F.value)){J.hidden=!1,F.setAttribute("aria-invalid","true"),F.setAttribute("aria-describedby",J.id),F.focus();return}ae.hidden=!0,ke.textContent="Style applied to this preview",K.focus()}),xe.addEventListener("click",()=>{if(!we)return;let l=URL.createObjectURL(new Blob([we.header],{type:"text/plain"})),g=document.createElement("a");g.href=l,g.download="gallery-header-backup-"+we.collectionId+".txt",g.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)});async function Be(l=!1){if(l&&$e(!1),!de.disabled){de.disabled=Ce.disabled=ye.disabled=!0,G.inert=!0,de.textContent="Saving\u2026",X(l?"Removing\u2026":"Saving\u2026"),ke.textContent=l?"Removing layout\u2026":"Saving to page header\u2026";try{await s(g=>{we=g,v||(xe.hidden=!1)},l),v||(ke.textContent="Saved to page header")}catch(g){v||(ke.textContent=g.message||"Save failed. Copy code is still available.")}finally{v||(de.disabled=Ce.disabled=ye.disabled=!1,ye.hidden=c()==="Not saved yet",G.inert=!1,de.textContent="Save to page",X())}}}de.addEventListener("click",()=>Be());function $e(l){Re.hidden=!l,G.inert=l,se.hidden=Ee.hidden=pe.hidden=l,l?(Te(!1),Oe.focus()):ye.focus()}return ye.addEventListener("click",()=>$e(!0)),Oe.addEventListener("click",()=>$e(!1)),De.addEventListener("click",()=>Be(!0)),be.addEventListener("click",async()=>{let l=++S,g=n();try{await navigator.clipboard.writeText(g),!v&&l===S&&(ke.textContent="Page code copied")}catch{if(v||l!==S)return;Te(!0),ke.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Me),Ve({source:t,options:e}),_.focus({preventScroll:!0}),{element:A,update:Ve,destroy:Ze}}var wr,Aa=te(()=>{Lt();Qt();wo();wa();wr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var Pa,Ea=te(()=>{Pa=`.gc-config-position{position:relative!important}
button.gc-config-launch{all:unset;box-sizing:border-box;position:absolute;inset:12px 12px auto auto;z-index:12;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:35px;padding:0 13px;border:1px solid #ffffff4a;border-radius:999px;background:#172331;color:white;box-shadow:0 2px 9px #12203233;font:550 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.01em;cursor:pointer;touch-action:manipulation}
.gc-config-launch svg{height:16px;width:16px}
button.gc-config-launch:hover,button.gc-config-launch[aria-expanded=true]{background:#2547b3}
button.gc-config-launch:focus-visible{outline:3px solid #6281ff;outline-offset:3px}
button.gc-config-launch:disabled{opacity:.65;cursor:default}
.sqs-edit-mode-active .gc-config-launch,.sqs-edit-mode-active [data-gc-author-panel]{display:none!important}
@media(max-width:700px){button.gc-config-launch{min-height:40px;inset:8px 8px auto auto}}

button.gc-edit-eye{position:fixed;bottom:24px;right:24px;z-index:2147483000;display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid #ffffff60;border-radius:30px;background:#172331;color:white;font:550 13px/1.3 system-ui;cursor:pointer}
button.gc-edit-eye[hidden]{display:none!important}
.gc-edit-eye svg{width:20px;height:20px}
.gc-edit-eye[aria-pressed=true]{background:#2547b3}
`});var Ia={};Co(Ia,{startInline:()=>So});function ht(t,e={}){let r=Xt.get(t),i={...st,...t==="spiral"?Ye:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:r.width,stageHeight:tt(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[o,a]of Object.entries(e))o.startsWith("mobile")&&i[o]===null?Number.isFinite(a)&&a>=0&&(i[o]=a):o!=="preset"&&Object.hasOwn(i,o)&&typeof a==typeof i[o]&&(i[o]=a);return i.popupDesktopLayout!=="drawer"&&(i.popupDesktopLayout="split"),t==="spiral"&&("mobileSizing"in e||(i.mobileSizing=i.mobileGap!=null||i.mobileCardWidth!=null),"titleCustom"in e||(i.titleCustom=!!(i.titleSize||i.titlePalette==="custom"||i.titleWeight!=="inherit")),"bodyCustom"in e||(i.bodyCustom=!!(i.descriptionCustom||i.descriptionSize)),"overlayEnabled"in e||(i.overlayEnabled=i.imageTintOpacity>0),"cardBorderEnabled"in e||(i.cardBorderEnabled=i.borderWidth>0)),i}function ja(t){return ko(t).flatMap(e=>e.typography?[...e.fields,{key:e.typography,type:"checkbox"}]:e.fields).filter(e=>!za.has(e.key))}function Mr(t){let e=Object.fromEntries(ja(t).map(({key:r})=>[r,t[r]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Ar(t,e){let r;try{r=JSON.parse(t)}catch{return null}if(r?.format!=="gallery-studio-style"||r.version!==1||!Xt.has(r.preset)||!r.values||typeof r.values!="object"||Array.isArray(r.values))return null;let i=ht(r.preset);for(let o of za)i[o]=e[o];for(let o of ja(i)){let a=r.values[o.key];if(a!==void 0){if(o.type==="range"){if(o.inherits&&a===null)continue;let s=o.percent&&r.values.spiralRiseUnit==="percent"?o.percent:o;if(!Number.isFinite(a)||a<s.min||a>s.max)return null}else{if(o.type==="checkbox"&&typeof a!="boolean")return null;if(["select","palette"].includes(o.type)&&!o.choices.some(s=>s.value===a))return null}if(o.type==="color"&&!/^#[0-9a-f]{6}$/i.test(a))return null;i[o.key]=a}}return i}function Er(t){return ht(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function _t(t,e){let r=ht(e.preset),i={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};if(e.preset==="spiral")for(let a of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])i[a]=e[a];tt(e.preset)&&(i.stageHeight=e.stageHeight);for(let a of Object.keys(r))e.colorSource==="section"&&La.has(a)||e[a]!==r[a]&&(i[a]=e[a]);let o={v:1,selector:t.selector,type:t.type,options:i};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(o,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function So(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let r=Ui(),i=new Map(r.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),o=null,a=null,s=null,c=!1,n=[];function u(d,v){return d.mounted?d.mounted.instance.update({...v,previewScroll:!1}):d.mounted=xo({selector:d.source.selector,type:d.source.type,options:v}),d.mounted&&(d.options={...v}),!!d.mounted}function m(d=!0){if(!a)return;let v=a;a=null,o?.destroy(),o=null,v.button?.setAttribute("aria-expanded","false"),d&&v.button?.focus({preventScroll:!0})}function f(d){m(),d.presets.clear(),d.installed?u(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function x(d){if(a===d){m();return}m(!1);let{source:v}=d;if(d.mounted||(v.items=gt(v.root,v.type)),!v.items.length){let p="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=p,d.button.setAttribute("aria-label",p);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+v.name+" layout");let S=d.options||d.installed||ht("arc-tabs",v.type!=="list"?{galleryWidth:"source"}:{});if(v.type!=="list"&&S.preset==="stack"&&(S=ht("arc-tabs",{galleryWidth:"source"}),u(d,S)),!d.mounted&&!u(d,S)){d.button.textContent="No supported layout here";return}a=d;let h=p=>{u(d,p),d.presets.set(p.preset,{...p})};o=Ma({source:v,options:{...d.options},onClose:()=>m(),onRestore:()=>f(d),onPreset:p=>{!Xt.has(p)||v.type!=="list"&&p==="stack"||(d.presets.set(d.options.preset,{...d.options}),h({...d.presets.get(p)||ht(p),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),o.update({source:v,options:{...d.options}}))},onOption:(p,b)=>{if(!Object.hasOwn(d.options,p)||p==="preset")return;let P={...d.options,[p]:b};h(P)},getSaveState:()=>d.installed?_t(v,d.options)===_t(v,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>_t(v,d.options),onSave:async(p,b=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let P={...d.options},L=Eo();c=!0;try{await Po({snippet:_t(v,P),context:L,onBackup:p,remove:b}),b?(d.installed=null,a===d?f(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=P}finally{c=!1}},getStyle:()=>Mr(d.options),applyStyle:p=>{let b=Ar(p,d.options);return!b||v.type!=="list"&&b.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),h(b),o.update({source:v,options:d.options}),!0)}}),o.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let v=JSON.parse(d.textContent),S=document.querySelectorAll(v.selector),h=S.length===1&&i.get(S[0]);if(!h||v.v!==1||v.type!==h.source.type||!Xt.has(v.options?.preset))continue;h.installed=Er(v.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of i.values())d.installed&&u(d,d.installed);if(t&&i.size){let v=function(p=!1){d.setAttribute("aria-pressed",String(p)),d.querySelector("span").textContent=p?"Edit native content":"Preview galleries",d.hidden=!ut()||![...i.values()].some(b=>b.mounted)},S=function(p){if(!p.mounted||p.source.root.isConnected)return;let b=p.source.root,P=document.querySelectorAll(p.source.selector);if(P.length!==1)return;let L=P[0];p.mounted.destroy(),p.mounted=null,p.source.root=L,i.delete(b),i.set(L,p),u(p,p.options);let A=L.querySelector(p.source.type==="list"?".user-items-list":".sqs-block-content")||L;p.button&&(getComputedStyle(A).position==="static"&&A.classList.add("gc-config-position"),A.append(p.button))};s=document.createElement("style"),s.textContent=Pa,document.head.append(s);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let p=d.getAttribute("aria-pressed")!=="true";for(let b of[...i.values()])S(b),b.mounted?.instance.setEditPreview(p);v(p)},document.body.append(d),v();let h=vo(p=>{p||requestAnimationFrame(()=>{if(d.isConnected)for(let b of[...i.values()])S(b)}),v()});n.push(()=>{h(),d.remove()});for(let p of i.values()){let{source:b}=p;if(!b.selector)continue;let P=b.root.querySelector(b.type==="list"?".user-items-list":".sqs-block-content")||b.root,L=getComputedStyle(P).position==="static";L&&P.classList.add("gc-config-position");let A=document.createElement("button");A.type="button",A.className="gc-config-launch",A.setAttribute("aria-expanded","false"),A.setAttribute("aria-label","Configure "+b.name+" layout"),A.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',A.addEventListener("click",()=>x(p)),P.append(A),p.button=A,n.push(()=>{A.remove(),L&&P.classList.remove("gc-config-position")})}}let y={version:1,destroy(){m(!1);for(let d of i.values())d.mounted?.destroy();for(let d of n)d();s?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=y,y}var Xt,La,za,Ta=te(()=>{Lo();wo();fo();Aa();Ea();Xt=new Map(kt.map(t=>[t.id,t])),La=new Set(["background","ink","accent","borderColor","overlayColor"]);za=new Set([...La,"colorSource","typeSource","clickAction","popupDesktopLayout"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",So,{once:!0}):So()});var Pr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(Pr=(await Promise.resolve().then(()=>(Ta(),Ia))).startInline);export{Pr as startInline};

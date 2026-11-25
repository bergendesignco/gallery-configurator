var Ma=Object.defineProperty;var ee=(t,e)=>()=>(t&&(e=t(t=0)),e);var fi=(t,e)=>{for(var a in e)Ma(t,a,{get:e[a],enumerable:!0})};function yi(t,e){if(t===void 0)return null;let a=new Map([...t.matchAll(Aa)].map(o=>[o[1].toLowerCase(),o[2]??o[3]??o[4]??""]));if(!a.has("data-gallery-layout"))return null;if(a.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let r;try{r=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(r?.v!==1||typeof r.selector!="string"||!["list","gallery","summary"].includes(r.type)||!r.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return r}function Ea(t,e,a=!1){let r=[...e.matchAll(bi)];if(r.length!==1||r[0][0]!==e.trim())throw Error("Invalid gallery settings.");let o=yi(r[0][1],r[0][2]);if(!o)throw Error("Missing gallery settings.");let i=!1,s=t.replace(bi,(c,n,h)=>{let f=yi(n,h);return!f||f.selector!==o.selector?c:a||i?"":(i=!0,e)});return a||i?s:s+(s&&!s.endsWith(`
`)?`
`:"")+e+`
`}function vi(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,a=e?.collection?.id,r=e?.website?.id,o=t.document.cookie.split(";").map(i=>i.trim()).find(i=>i.startsWith("crumb="))?.slice(6);if(!At.test(a||"")||!At.test(r||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!o)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:a,websiteId:r,crumb:decodeURIComponent(o)}}async function xi({snippet:t,context:e,remove:a=!1,fetchImpl:r=fetch,onBackup:o=()=>{}}){let{collectionId:i,websiteId:s,crumb:c}=e;if(!At.test(i||"")||!At.test(s||"")||!c)throw Error("A signed-in Squarespace page is required.");async function n(){let y=await r("/api/commondata/GetCollectionSettings?collectionId="+i,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let S=await y.json(),u=S.collectionData??S;if(u?.id!==i||u.websiteId!==s||u.deleted===!0||u.folder===!0||u.dropdown===!0)throw Error("Page settings do not match this page.");if(u.headerInjectCode!=null&&typeof u.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:u,memberAreaData:S.memberAreaData??{}}}let h=await n();if(h.model.passwordProtected&&typeof h.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let f=h.model.headerInjectCode??"",m=Ea(f,t,a);if(m===f)return{unchanged:!0};o({collectionId:i,header:f,savedAt:new Date().toISOString()});let w=await n();if(JSON.stringify(w)!==JSON.stringify(h))throw Error("Page settings changed while saving. Review the page and save again.");let x;try{x=await r("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...w.model,collectionId:i,headerInjectCode:m},memberAreaData:w.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!x.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await n()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==m.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var At,bi,Aa,wi=ee(()=>{At=/^[a-f0-9]{24}$/i,bi=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Aa=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function ki(t){let e=document.createElement("template");return e.innerHTML=t,e.content}function mt(t,e){return t&&URL.canParse(t,e)?new URL(t,e).href:null}function Pa(t,e){let a=t.querySelector(".sqs-gallery-container"),r=Array.from(t.querySelectorAll(".slide"),o=>{let i=o.querySelector("img[data-src], img[data-image], img[src]"),s=o.querySelector(".image-slide-anchor, a[href]");return{type:o.dataset.type||null,imageUrl:mt(i?.dataset.src||i?.dataset.image||i?.getAttribute("src"),e),imageId:i?.dataset.imageId??null,dimensions:i?.dataset.imageDimensions??null,focalPoint:i?.dataset.imageFocalPoint??null,alt:i?.getAttribute("alt")??null,title:s?.dataset.title??o.querySelector(".meta-title")?.textContent??null,descriptionHtml:s?.dataset.description??o.querySelector(".meta-description")?.innerHTML??null,href:mt(s?.getAttribute("href"),e),lightbox:!!s?.classList.contains("js-gallery-lightbox-opener"),html:o.outerHTML}});return{layout:a?.dataset.design??null,settings:{...a?.dataset},slides:r}}function La(t,e){return Array.from(ki(t).querySelectorAll(".sqs-block"),a=>{let r=a.dataset.sqspBlock||[...a.classList].find(i=>i.startsWith("sqs-block-")&&i!=="sqs-block-website-component")?.slice(10),o={id:a.id||null,type:r||null,typeId:a.dataset.blockType??null,html:a.outerHTML};return(r==="gallery"||a.matches(".gallery-block, .sqs-block-gallery"))&&(o.gallery=Pa(a,e)),o})}async function za(t,e){let a=await fetch(t,{mode:"same-origin",signal:e});if(!a.ok)return null;let r=await a.text(),o=ki(r.split(/<\/head\s*>/i,1)[0]),i=Array.from(o.querySelectorAll("meta[content]"),s=>({name:s.getAttribute("property")||s.getAttribute("name")||s.getAttribute("itemprop"),content:s.getAttribute("content")})).filter(s=>s.name);return{title:o.querySelector("title")?.textContent??null,description:i.find(s=>s.name.toLowerCase()==="description")?.content??null,canonicalUrl:mt(o.querySelector('link[rel~="canonical"]')?.getAttribute("href"),a.url),meta:i}}async function Si(t,{signal:e}={}){if(!t)throw new Error("A linked post URL is required.");let a=new URL(t,location.href);if(a.origin!==location.origin)throw new Error("The linked post must be on this site.");a.hash="",a.searchParams.delete("format");let r=new URL(a);r.searchParams.set("format","json");let o=await fetch(r,{mode:"same-origin",signal:e});if(!o.ok)throw new Error("Could not load post JSON ("+o.status+").");let{item:i}=await o.json();if(!i?.id||typeof i.body!="string")throw new Error("This URL did not return a post body.");let s=mt(i.fullUrl,o.url)||a.href,c=null;try{c=await za(a,e)}catch(n){if(e?.aborted)throw n}return{id:i.id,url:s,title:i.title??null,excerptHtml:i.excerpt??null,publishedAt:i.publishOn??null,createdAt:i.addedOn??null,updatedAt:i.updatedOn??null,author:i.author??null,authorId:i.authorId??null,location:i.location??null,tags:i.tags??[],categories:i.categories??[],featuredImageUrl:mt(i.assetUrl,s),seo:{item:i.seoData??null,page:c},bodyHtml:i.body,blocks:La(i.body,s),rawItem:i}}var Ci=ee(()=>{});function Ei(t,e,{range:a,select:r,swatch:o},i){let s=(u,p)=>({key:u,label:p,type:"checkbox"}),c=(u,p,b,T,z="px",v=1)=>a(u,p,b,T,v,z),n=(u,p,b)=>b.map(T=>({...T,when:[u,p]})),h=(u,...p)=>({title:u,fields:p.flat()}),f=u=>i.flatMap(p=>p.fields).find(p=>p.key===u),m=e!=="gallery",w={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(u,p)=>[100*(p+1),String(100*(p+1))]))},x={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function d(u,p,b,T,z,v){return{...h(u,c(b,"Size",0,4,"rem",.05),r(T,"Weight",w),o(z,"Color"),r(v,"Alignment",x)),typography:p}}function y(u,p,b,T){return[s(u,p),...n(u,!0,[c(b+"Angle","Angle",0,360,"\xB0"),c(b+"Distance","Distance",0,48),c(b+"Blur","Blur",0,40),c(b+"Spread","Spread",0,16),o(T,"Color")])]}let S=(u,p)=>({...f(p),key:u,label:"Mobile "+f(p).label.toLowerCase(),inherits:p});return[h("Elements",s("showImage","Show image"),s("showTitles","Show title"),...m?[s("showDescription","Show description"),s("showButton","Show button")]:[],s("showControls","Show controls")),h("Main carousel",...m?[r("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...n("heightMode","pixels",[c("stageHeight","Height",120,1600)]),...n("heightMode","viewport",[c("viewportHeight","Window height",15,100,"%")])]:[],c("carouselPadding","Carousel padding",0,64),f("spiralWidth"),s("surfaceEnabled","Background"),...n("surfaceEnabled",!0,[o("surfaceColor","Color"),c("surfaceRadius","Corner radius",0,64)]),r("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),f("edgeFade"),f("spiralGap"),s("autoplay","Autoplay"),...n("autoplay",!0,[r("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),r("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...c("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:u=>u.playbackMode==="continuous"},{...c("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:u=>u.playbackMode==="step"}),h("Spiral",f("spiralRiseUnit"),{...f("spiralRise"),label:"Rise"},r("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),f("showSlots")),h("Image",r("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(u=>[u,u==="original"?"Original":u==="circle"?"Circle":u]))),r("fit","Image sizing",{cover:"Fill",contain:"Fit"}),c("imageWidth","Image width",20,100,"%"),r("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),f("imagePadding"),s("imageBorder","Image border"),...n("imageBorder",!0,[o("imageBorderColor","Color"),c("imageBorderSize","Thickness",0,12),c("imageRadius","Corner radius",0,64)]),y("shadowEnabled","Image shadow","shadow","shadowColor"),s("overlayEnabled","Overlay"),...n("overlayEnabled",!0,[o("imageTint","Color")])),d("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...m?[d("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],h("Card",f("cardWidth"),r("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),r("cardOrder","Element order",{media:"Media first",content:"Content first"}),c("cardPadding","Card padding",0,80),c("mediaGap","Space between image and text",0,80),c("titleGap","Space below title",0,80),...m?[c("buttonGap","Space above button",0,80)]:[],r("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),s("cardBackground","Background"),...n("cardBackground",!0,[o("cardColor","Color")]),s("cardBorderEnabled","Card border"),...n("cardBorderEnabled",!0,[o("spiralRim","Color"),f("borderWidth")]),f("spiralRadius"),y("cardShadow","Card shadow","cardShadow","cardShadowColor"),f("backFace"),f("backColor"),...n("backFace","mirror",[s("mirrorOverlay","Mirrored image overlay")]),{...o("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:u=>u.backFace==="mirror"}),h("Interaction",s("pauseOnHover","Pause on hover"),f("hoverEffect"),f("hoverAmount"),c("hoverDuration","Hover duration",0,1e3,"ms",10),r("clickAction","Card click",{source:m?"Button only":"Image link only",link:m?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),f("reducedMotion")),h("Control styling",f("controlSize"),c("controlIconSize","Icon size",0,60),c("controlPadding","Button padding",0,32),f("controlShape"),f("arrowStyle"),s("controlBackground","Button background"),f("controlPalette"),f("controlInk"),f("controlFill")),h("Mobile",s("mobileSizing","Customize mobile sizing"),S("mobileCardWidth","cardWidth"),S("mobileGap","spiralGap"),{...c("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...c("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},S("mobileSpiralWidth","spiralWidth"),...m?[r("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...c("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),h("Theme",r("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...n("colorSource","custom",[o("background","Background"),o("ink","Text"),o("accent","Accent")]),r("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),i.find(u=>u.title==="Popup")]}var Mi,Ai,Et=ee(()=>{Mi={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},Ai=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function Pi({range:t,swatch:e,select:a}){let r=(o,i)=>({key:o,label:i,type:"checkbox"});return[{title:"Card content",fields:[r("showImage","Show image"),r("showTitles","Show title"),r("showDescription","Show description"),r("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),r("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),r("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(o=>({...o,when:["shadowEnabled",!0]})),a("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[r("popupImage","Show popup image"),r("popupTitle","Show popup title"),r("popupDescription","Show popup description"),r("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),r("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Xt(t,e){if(!Ut.has(e.preset))return e;let a={...e},r=getComputedStyle(t),o;for(let i of Lt){let s=e[i+"Swatch"],c=e[i];if(Object.hasOwn(_t,s)){let h=r.getPropertyValue("--"+s+"-hsl").trim();h&&(o??=document.createElement("canvas").getContext("2d"),o&&(o.fillStyle=c,o.fillStyle="hsl("+h+")",c=o.fillStyle))}let n=Math.round((e[i+"Opacity"]??100)*2.55);a[i]=n===255?c:c+n.toString(16).padStart(2,"0")}return a}var Ut,_t,Lt,Pt,Yt=ee(()=>{Et();Ut=new Set(["spiral"]),_t={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},Lt=[...Ai,"titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],Pt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of Lt)Pt[t+"Swatch"]="custom",Pt[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function Li(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let a=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches("script,style,template,noscript,iframe,form,svg"))return a;let r=t.localName,o=ja.has(r)?document.createElement(r):a;if(r==="a"||r==="img"){let i=r==="img"?"src":"href",s=r==="img"?t.dataset.src||t.getAttribute("src"):t.getAttribute("href"),c=s&&URL.canParse(s,e)?new URL(s,e):null;c&&["https:","http:"].includes(c.protocol)&&o.setAttribute(i,c.href),r==="img"&&(o.alt=t.alt,o.loading="lazy")}for(let i of t.childNodes)o.append(Li(i,e));return o}async function zi(t,e){t.textContent="Loading post\u2026";try{let a=new URL(e.postUrl);if(a.origin!==location.origin)throw Error();let r=await fetch(a,{mode:"same-origin"});if(!r.ok)throw Error();let i=new DOMParser().parseFromString(await r.text(),"text/html").querySelector(".blog-item-content,article .entry-content,article .body");if(!i)throw Error();t.replaceChildren(Li(i,r.url))}catch{t.textContent="Open the full post using the link below."}}var ja,ji=ee(()=>{ja=new Set("p h1 h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" "))});function Vt(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],a=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Ta[t]}${a}</svg>`}function _e(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Vt("play")+Vt("pause"):Vt(e),t}var Ta,zt=ee(()=>{Ta={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function qe(t,e,a){let r=document.createElement(t);return r.className=e,a!==void 0&&(r.textContent=a),r}function lt(t,e,a){let r=qe("button",t,a);return r.type="button",r.setAttribute("aria-label",e),r}function qa(t,e,a,r,o,i){let s=a/2,c=r/2,n=.26,h=e/2+48,f=(a*Math.cos(n)+i)/(2*Math.sin(n)),m=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-o)*.7),a*(3.8-o*2.1),c+Math.max(f,h/Math.sin(Math.PI/3))),w=m-c,x=Math.atan2(s,w),d=Math.hypot(s,w),y=2*(x+Math.asin(i/(2*d))),S=x+Math.asin(h/d),u=m+c,p=Math.hypot(u,s)-u,b=w-Math.sqrt((w-h)*(w+h));return{radius:m,step:y,reach:S/y,above:p,below:b}}function Fa(t,e,a){let r=e/2,o=10+a*9,i=0,s=0;for(let c=0;c<4.1;c+=.5){let n=Math.min(4.1,c+.5),h=Math.max(.48,1-c*(.09+a*.035)),f=(n*(4+a*7)+(c===0?4:0))*Math.PI/180,m=h*(r+t/2*Math.sin(f))-r;i=Math.max(i,m-Math.min(c,4)*o),s=Math.max(s,m+Math.min(n,4)*o)}return{above:i,below:s}}function Ti({host:t,items:e=[],initialIndex:a=0,options:r={},makeCard:o,onChange:i,nativeList:s,loadImage:c}){let n=Ia.has(r.preset)?r.preset:"infinite",h=n==="arc"||n==="arc-tabs",f=h||n==="showcase",m=e.length,w=!!r.reducedMotion,x=Ne(at(r.depth,55),0,100)/100,d,y,S;function u(l){d=Ne(at(l.gap,24),0,180),y=Ne(at(l.cardWidth,n==="timed"?760:380),80,1800),S=l.phoneWidthOverride}u(r);let p=Ne(at(r.duration,5),1,60)*1e3,b=qe("section",`gc-carousel gc-preset-${n}`);b.setAttribute("aria-roledescription","carousel"),b.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[n]),b.style.setProperty("--gc-card-radius",`${Ne(at(r.radius,14),0,120)}px`),b.style.setProperty("--gc-stage-height",`${Ne(at(r.stageHeight,0),0,1400)}px`),w&&b.classList.add("gc-reduced-motion");let T=[],z=(l,g,k,A)=>{l.addEventListener(g,k,A),T.push(()=>l.removeEventListener(g,k,A))},v=[],C=[],E=r.navigation==="dots"||r.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),W=n==="arc-tabs"||n==="timed"&&!E,D=qe("nav","gc-carousel-tabs");E&&D.classList.add("gc-choice-dots"),D.setAttribute("aria-label","Choose a slide"),W&&(e.forEach((l,g)=>{let A=(typeof l.title=="string"?l.title.trim():"")||`Slide ${g+1}`,B=E?lt("gc-choice-dot",A):lt("gc-carousel-tab",A,A);z(B,"click",()=>Ie(g)),z(B,"keydown",I=>{let P;I.key==="ArrowRight"&&(P=ot(g+1,m)),I.key==="ArrowLeft"&&(P=ot(g-1,m)),I.key==="Home"&&(P=0),I.key==="End"&&(P=m-1),P!==void 0&&(I.preventDefault(),Ie(P),v[P]?.focus({preventScroll:!0}))}),D.append(B),v.push(B)}),b.append(D));let M=qe("div","gc-carousel-stage");M.tabIndex=m?0:-1,M.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let F=s?.track??qe("div","gc-carousel-track");F.classList.add("gc-carousel-track"),M.append(F),b.append(M);function L(l){let g=o(e[l],l,{caption:r.showTitles!==!1,description:n==="arc-tabs"||n==="timed"});g.classList.add("gc-carousel-card"),g.dataset.gcItemIndex=String(l),g.style.width="var(--gc-carousel-slot-width)",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),s||g.querySelectorAll("img").forEach(A=>{A.draggable=!1,A.style.objectFit=r.fit==="contain"?"contain":"cover"});let k=s?.slot(g)??g;return F.append(k),{card:g,node:k,index:l,logical:l,active:!1}}let oe=e.map((l,g)=>L(g)),_=new Map,ge=!1,X=qe("div","gc-carousel-controls"),ce=qe("div","gc-carousel-counter");ce.setAttribute("aria-hidden","true");let R=qe("span","gc-carousel-current",m?"01":"00");ce.append(R,qe("span","gc-carousel-divider","/"),qe("span","gc-carousel-total",String(m).padStart(2,"0")));let U=qe("div","gc-carousel-arrows"),N=_e(lt("gc-carousel-arrow","Previous slide"),"previous"),O=_e(lt("gc-carousel-arrow","Next slide"),"next");N.disabled=O.disabled=m<2,U.append(N,O);let j=_e(lt("gc-carousel-playback","Play slideshow"),"playback");j.hidden=m<2||w;let G=qe("div","gc-carousel-pagination");G.setAttribute("aria-label","Slide pagination"),n==="timed"&&e.forEach((l,g)=>{let k=lt("gc-carousel-dot",l.title?.trim()||`Go to slide ${g+1}`),A=qe("span","gc-carousel-dot-fill");A.setAttribute("aria-hidden","true"),k.append(A),z(k,"click",()=>Ie(g)),G.append(k),C.push({dot:k,fill:A})}),X.append(ce,U),n==="timed"&&X.append(G),X.append(j),b.append(X);let H=qe("p","gc-carousel-sr");H.setAttribute("aria-atomic","true"),b.append(H);let V=qe("span","gc-carousel-cursor","Drag");V.setAttribute("aria-hidden","true"),(n==="arc-tabs"||n==="showcase"||n==="arc")&&M.append(V),t.append(b);let ie=!1,q=a,$=a,ae=-1,Y=0,ne=0,ue=0,re=!!r.autoplay&&!w&&m>1,le=!1,be=!1,xe=!1,we=!1,K=null,fe=0,Q=0,Ae=0,de=0,ke=()=>Math.max(12,de*(.36-x*.12)+d-28),Ce=-1,Ee,ye=1,Fe=0,Oe=0,We=()=>we||le||be||xe||document.hidden||!!K,ct=l=>{let g=ot(Math.round(q),m),k=ot(l-g,m);return k>m/2&&(k-=m),Math.round(q)+k};function Re(){let l=v[ae];if(!l)return;let g=l.offsetLeft,k=g+l.offsetWidth;g<D.scrollLeft?D.scrollLeft=Math.max(0,g-14):k>D.scrollLeft+D.clientWidth&&(D.scrollLeft=k-D.clientWidth+14)}function it(){let l=m?ot(Math.round(q),m):-1;if(l===ae)return;ae=l,R.textContent=m?String(l+1).padStart(2,"0"):"00",v.forEach((k,A)=>{k.classList.toggle("is-active",A===l),k.setAttribute("aria-pressed",String(A===l))}),Re(),C.forEach(({dot:k},A)=>{k.classList.toggle("is-active",A===l),A===l?k.setAttribute("aria-current","true"):k.removeAttribute("aria-current")});let g=e[l]?.title;H.textContent=m?`${l+1} of ${m}${g?`: ${g}`:""}`:"No gallery items",l>=0&&i?.(l)}function De(){if(ie||!Q)return;it();let l=Math.abs($-q)>.002;b.classList.toggle("is-moving",l||!!K);let g=[...oe];for(let k of oe)k.logical=k.index+Math.round((q-k.index)/m)*m;if(m>1){let k=de+d,A=n==="infinite"&&Q>660?Q*.61:Q/2,B=(A+de/2+40)/k,I=(Q-A+de/2+40)/k;h?B=I=Ee.reach:n==="showcase"&&(B=I=Math.min(4.1,(Q/2+de)/ke()));let P=Math.ceil(q-B),J=Math.floor(q+I);for(let[se,Z]of _)(se<P||se>J||oe[Z.index].logical===se)&&(Z.node.remove(),_.delete(se));for(let se=P;se<=J;se++){let Z=ot(se,m);if(oe[Z].logical===se)continue;let pe=_.get(se);pe||(pe=L(Z),pe.logical=se,_.set(se,pe),ge&&c&&pe.card.querySelectorAll("img").forEach(me=>c(me,{nativeCard:!!s}))),g.push(pe)}}g.forEach(k=>{let A=m===1?0:k.logical-q,B=Math.abs(A),I=k.logical===Math.round(q),P=Q/2,J=0,se=0,Z=1,pe=1,me=!0,ve=0,he=0;if(n==="infinite")P=(Q>660?Q*.61:Q/2)+A*(de+d),pe=1-Math.min(1,B)*.68,me=P+de/2>-40&&P-de/2<Q+40;else if(n==="timed")P+=A*(de+d),Z=1-Math.min(B,1)*.035,me=P+de/2>-40&&P-de/2<Q+40;else if(n==="showcase")P+=A*ke(),J+=Math.min(B,4)*(10+x*9),Z=Math.max(.48,1-B*(.09+x*.035)),se=A*(4+x*7),he=-A*(3+x*4),pe=Ne(1-B*.19,0,1),me=B<4.1,I&&!w&&(ve=Oe,he+=Fe,se+=Ne($-q,-1,1)*-3);else{let Se=A*Ee.step;P+=Ee.radius*Math.sin(Se),J=Ee.radius*(1-Math.cos(Se)),se=Se*180/Math.PI,me=B<=Ee.reach,pe=n==="arc-tabs"?1-Math.min(B,1)*.16:1}k.card.style.transform=`translate3d(${P}px,${J}px,0) translateX(-50%) rotate(${se}deg) rotateX(${ve}deg) rotateY(${he}deg) scale(${Z})`,k.card.style.zIndex=String(1e3-Math.round(B*100)),k.card.style.opacity=String(pe),k.card.style.visibility=me?"visible":"hidden",k.card.style.pointerEvents=me&&pe>.08?"auto":"none",k.active!==I&&(k.active=I,k.card.classList.toggle("is-active",I)),k.card.tabIndex=I?0:-1,k.card.setAttribute("aria-hidden",String(!I)),s?.syncFocus(k.card)}),C.forEach(({fill:k},A)=>{k.style.transform=`scaleX(${A===ae?Ne(ue/p,0,1):0})`})}function He(){let l=Q;Q=M.clientWidth;let g=S?1:n==="timed"?.86:n==="infinite"&&Q>660?.48:.76,k=Math.max(80,Math.min(y,Q*g));if(k!==de&&(de=k,F.style.setProperty("--gc-carousel-slot-width",`${de}px`)),f){let A=F.offsetHeight;if(Q!==l||A!==Ce){Ce=A,h&&(Ee=qa(n,Q,de,Ce,x,d));let B=Ee??Fa(de,Ce,x);m>1&&(M.style.setProperty("--gc-sweep-above",Math.ceil(B.above)+"px"),M.style.setProperty("--gc-sweep-below",Math.ceil(B.below)+"px"))}}Ae=M.clientHeight,ye=h?Ee.radius*Ee.step:n==="showcase"?de*.54:de+d,De()}function Te(){!ie&&!Y&&(Y=requestAnimationFrame(Ve))}function Ve(l){if(Y=0,ie)return;let g=ne?Ne(l-ne,0,64):0;ne=l,K||(w?q=$:q+=($-q)*(1-Math.exp(-g/85)),Math.abs($-q)<5e-4&&(q=$));let k=Math.abs($-q)<.002&&!K;re&&!We()&&k&&(ue+=g,ue>=p&&(ue=0,$=Math.round(q)+1)),De(),Math.abs($-q)>5e-4||re&&!We()?Te():ne=0}function Ie(l){ie||m<2||($=ct(ot(Math.round(at(l,0)),m)),ue=0,w&&(q=$),De(),Te())}function Ze(l){m<2||($=Math.round($)+l,ue=0,w&&(q=$),De(),Te())}function Ge(l){re=!!l&&!w&&m>1,j.dataset.paused=String(!re),j.setAttribute("aria-label",re?"Pause slideshow":"Play slideshow"),j.setAttribute("aria-pressed",String(re)),H.setAttribute("aria-live",re?"off":"polite"),b.classList.toggle("is-playing",re),ne=0,Te()}function Me(l){we=!!l,ne=0,Te()}z(N,"click",()=>Ze(-1)),z(O,"click",()=>Ze(1)),z(j,"click",()=>Ge(!re)),z(M,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),M.focus({preventScroll:!0}),Ze(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),M.focus({preventScroll:!0}),Ie(l.key==="Home"?0:m-1))}),z(M,"pointerdown",l=>{m<2||l.button!==0||!l.isPrimary||(K={id:l.pointerId,x:l.clientX,y:l.clientY,start:q,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},$=q,ue=0)}),z(M,"pointermove",l=>{let g=M.getBoundingClientRect(),k=g.width/Math.max(1,M.clientWidth)||1,A=(l.clientX-g.left)/k,B=(l.clientY-g.top)/k;if(V.style.left=`${A}px`,V.style.top=`${B}px`,l.pointerType==="mouse"&&M.classList.add("has-pointer"),!K){n==="showcase"&&!w&&(Fe=Ne((A-Q/2)/de,-1,1)*4,Oe=Ne((B-Ae/2)/Ae,-.5,.5)*-5,De());return}if(l.pointerId!==K.id)return;let I=l.clientX-K.x,P=l.clientY-K.y;if(!K.axis&&Math.hypot(I,P)>6&&(K.axis=Math.abs(I)>Math.abs(P)?"horizontal":"vertical",K.axis==="horizontal"&&(M.setPointerCapture(l.pointerId),M.classList.add("is-dragging"))),K.axis!=="horizontal")return;l.preventDefault(),K.moved=!0;let J=performance.now(),se=Math.max(8,J-K.lastTime),Z=-(l.clientX-K.lastX)/k/ye/se;K.velocity=K.velocity*.45+Z*.55,K.lastX=l.clientX,K.lastTime=J,q=K.start-I/k/ye,$=q,De()},{passive:!1});function Ue(l){if(!K||l.pointerId!==K.id)return;let g=K;if(K=null,M.hasPointerCapture(l.pointerId)&&M.releasePointerCapture(l.pointerId),M.classList.remove("is-dragging"),g.moved){fe=performance.now()+400;let k=performance.now()-g.lastTime,A=w||l.type==="pointercancel"||k>120?0:Ne(g.velocity*210,-4,4);$=Math.round(q+A)}else $=Math.round(q);w&&(q=$),Te()}z(M,"pointerup",Ue),z(M,"pointercancel",Ue),z(window,"pointerup",Ue),z(M,"lostpointercapture",l=>{K?.id===l.pointerId&&Ue(l)}),z(M,"dragstart",l=>l.preventDefault()),z(M,"click",l=>{if(performance.now()<fe){l.preventDefault(),l.stopImmediatePropagation();return}let g=l.target.closest(".gc-carousel-card");!g||!M.contains(g)||g.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Ie(Number(g.dataset.gcItemIndex)))},!0),z(M,"pointerleave",()=>{M.classList.remove("has-pointer"),Fe=Oe=0,K||De()}),z(b,"pointerenter",l=>{l.pointerType==="mouse"&&(le=!0)}),z(b,"pointerleave",()=>{le=!1,ne=0,Te()}),z(b,"focusin",()=>{be=!0}),z(b,"focusout",()=>{queueMicrotask(()=>{ie||(be=b.contains(document.activeElement),ne=0,Te())})}),z(document,"visibilitychange",()=>{ne=0,Te()});let Be;typeof ResizeObserver<"u"?(Be=new ResizeObserver(l=>{l.some(({target:g})=>g===M||g===F)&&He(),W&&l.some(({target:g})=>g!==M&&g!==F)&&Re()}),Be.observe(M),f&&Be.observe(F),W&&(Be.observe(D),v.forEach(l=>Be.observe(l,{box:"border-box"})))):z(window,"resize",()=>{He(),Re()});let $e;return typeof IntersectionObserver<"u"&&($e=new IntersectionObserver(l=>{xe=!l[0]?.isIntersecting,ne=0,Te()}),$e.observe(b)),He(),ge=!0,Ge(re),{goTo:Ie,setGeometry(l){u(l),Ce=-1,He()},setPlaying:Ge,setSuspended:Me,destroy(){ie=!0,cancelAnimationFrame(Y),Be?.disconnect(),$e?.disconnect(),T.forEach(l=>l()),b.remove()}}}var Ia,Ne,ot,at,Ii=ee(()=>{zt();Ia=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Ne=(t,e,a)=>Math.min(a,Math.max(e,t)),ot=(t,e)=>(t%e+e)%e,at=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function qi(t){let{host:e,makeCard:a,nativeList:r}=t,o=Array.isArray(t.items)?t.items:[],i=t.options||{},s=["wall","ring","angled"].includes(i.preset)?i.preset:"wall",c=!!i.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=o.length,h=s==="ring"?16:s==="wall"?12:n,f=!c&&n>1&&n<12&&s!=="angled"?Math.ceil(h/n)*n:n,m=Array.from({length:n},(l,g)=>g),w=Je(et(i.depth,55),0,100),x=Je(et(i.cardWidth,280),80,900),d=Je(et(i.gap,24),0,160),y=Math.max(1,et(i.duration,5)),S=new AbortController,u=(l,g,k,A={})=>l.addEventListener(g,k,{...A,signal:S.signal}),p={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},b=`gc-spatial-help-${++Ra}`,T=["gc-spatial",`gc-${s}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...T);let z=new Map,v=(l,g)=>{z.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,g)};v("--gc-spatial-height",`${Je(et(i.stageHeight,620),300,1400)}px`),v("--gc-spatial-radius",`${Je(et(i.radius,18),0,100)}px`),v("--gc-spatial-fit",i.fit==="contain"?"contain":"cover"),v("--gc-spatial-card-width",`${x}px`),v("--gc-spatial-gap",`${d}px`);let C=r?.track??document.createElement("div");C.classList.add("gc-spatial-canvas"),r&&C.classList.add("gc-spatial-native-track"),C.setAttribute("role",r?"list":"group"),C.setAttribute("aria-label",p[s]),C.setAttribute("aria-describedby",b);let E=document.createElement("p");E.id=b,E.className="gc-spatial-sr",E.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let W=document.createElement("span");W.className="gc-spatial-sr",W.setAttribute("aria-live","polite"),W.setAttribute("aria-atomic","true"),e.append(E,C,W);let D=i.showTitles!==!1&&(s!=="ring"||c||n===1),M=Array.from({length:f},(l,g)=>{let k=g%n,A=o[k],B=a(A,k,{caption:D,description:!1,thumbnail:!0}),I=r?.slot(B)??document.createElement("div");return I.classList.add("gc-spatial-position"),B.classList.add("gc-spatial-card"),B.dataset.spatialIndex=String(g),B.dataset.spatialSourceIndex=String(k),B.tabIndex=g===0?0:-1,g>=n&&B.setAttribute("aria-hidden","true"),!B.getAttribute("aria-label")&&!B.textContent.trim()&&B.setAttribute("aria-label",`View item ${k+1}`),I.contains(B)||I.append(B),I.parentNode!==C&&C.append(I),{position:I,card:B,sourceIndex:k,x:0,y:0,flip:0,tilt:0,lift:0}}),F=document.createElement("div");F.className="gc-spatial-nav";let L=(l,g)=>{let k=document.createElement("button");return k.type="button",k.className="gc-spatial-control",k.setAttribute("aria-label",g),_e(k,l)},oe=L("previous","Previous item"),_=L("next","Next item"),ge=document.createElement("span");ge.className="gc-spatial-count",ge.setAttribute("aria-hidden","true"),F.append(oe,ge,_);let X=i.autoplay&&!c?L("playback","Pause gallery motion"):null;X&&(X.disabled=n<2,X.dataset.paused=String(n<2),X.disabled&&X.setAttribute("aria-label","Play gallery motion"),F.append(X)),e.append(F),oe.disabled=_.disabled=n<2;let ce,R;if(s==="ring"&&n>1&&!c){ce=document.createElement("div"),ce.className="gc-ring-center",ce.setAttribute("aria-hidden","true"),i.showTitles!==!1&&(R=document.createElement("span"),R.className="gc-ring-label",ce.append(R));let l=document.createElement("span");l.textContent="Drag to explore",ce.append(l),C.after(ce)}let U;n||(U=document.createElement(r?"li":"p"),U.className="gc-spatial-empty",U.textContent="No items available.",C.append(U));let N=!1,O=0,j=-1,G=1,H=1,V=1,ie=1,q=1,$=1,ae=0,Y=1,ne=1,ue=0,re=0,le=1,be=!!i.autoplay&&!c&&n>1,xe=!1,we=!1,K=!1,fe=!0,Q=null,Ae=0,de=0,ke=0,Ce=-1,Ee=!1,ye={x:-1e4,y:-1e4,inside:!1};function Fe(l=O){if(!R)return;let g=typeof o[l]?.title=="string"?o[l].title.trim():"";R.textContent===g&&R.hidden===!g||(R.textContent=g,R.hidden=!g,Oe())}function Oe(){!ce||N||(ce.classList.remove("is-below"),ce.offsetHeight>ae&&ce.classList.add("is-below"))}function We(l,g=!1,k=null){if(!n){ge.textContent="00 / 00";return}let A=rt(l,n),B=k!==null&&M[k]?.sourceIndex===A,I=B&&m[A]!==k;if(B){let P=M[m[A]].card;m[A]=k,I&&(M[k].card.removeAttribute("aria-hidden"),r?.syncFocus(M[k].card),document.activeElement===P&&(Ee=!0,M[k].card.focus({preventScroll:!0}),Ee=!1))}if(j===A&&!I){g&&(W.textContent=`Item ${A+1} of ${n}${o[A].title?`: ${o[A].title}`:""}`);return}O=A,Fe(),ge.textContent=`${String(O+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`,M.forEach(({card:P,sourceIndex:J},se)=>{let Z=m[J]===se;P.tabIndex=Z&&J===O?0:-1,P.classList.toggle("is-selected",Z&&J===O),Z?P.removeAttribute("aria-hidden"):P.setAttribute("aria-hidden","true"),r?.syncFocus(P)}),g&&(W.textContent=`Item ${O+1} of ${n}${o[O].title?`: ${o[O].title}`:""}`),j!==O&&(j=O,t.onChange?.(O))}function ct(l){be=!!l&&!c&&n>1,X&&(X.dataset.paused=String(!be),X.setAttribute("aria-label",be?"Pause gallery motion":"Play gallery motion")),Me()}function Re(l){xe=!!l,xe||Me()}function it(l,g,k){return g+Math.round((l-g)/k)*k}function De(l){let g={index:m[l],target:l,distance:1/0};return M.forEach((k,A)=>{if(k.sourceIndex!==l)return;let B=A;if(s==="ring")B=it(ue,A,f);else if(s==="wall"){let P=Math.floor(A/Y);B=ne>2?it(ue,P,ne):P}let I=Math.abs(B-ue);I<g.distance&&(g={index:A,target:B,distance:I})}),g}function He(l){let g=l.getBoundingClientRect();return g.left+g.width/2}function Te(){if(n<2)return;let l=He(M[0].position),g=He(M[1].position)-l;if(Math.abs(g)<1)return;let k=Je(Math.round((He(C)-l)/g),0,n-1);We(k,!1,k)}function Ve(l,g=!1){if(!n)return;let k=rt(Math.round(et(l,0)),n),A=c?{index:k,target:k}:De(k);if(We(k,!0,A.index),c){let B=M[k].position;C.scrollTo({left:C.scrollLeft+He(B)-He(C),behavior:"auto"})}else re=A.target;g&&M[A.index].card.focus({preventScroll:!0}),Me()}function Ie(){if(!N){if(G=Math.max(1,C.clientWidth),H=Math.max(1,C.clientHeight),s==="ring"){let l=Math.max(80,Math.min(G-32,H-42)),g=Je(et(i.ringDiameter,l),80,l);$=Math.max(0,g*.38);let k=Jt*$/Math.max(1,f),A=Math.min(g*.17,k*.8),B=1.15-Je(d,0,100)/160;if(V=n<=1?Math.min(x,G*.65,H*.58):Math.max(18,Math.min(Math.min(x*.22,A)*B,k*.94)),ie=V*1.28,ce){let I=Math.max(0,$-Math.max(32,ie)/2-10);ae=Math.floor(I*Math.SQRT2),ce.style.setProperty("--gc-ring-label-width",`${ae}px`),ce.style.setProperty("--gc-ring-label-y",`${C.offsetTop+H/2}px`),Oe()}q=Math.max(24,Jt*Math.max(1,$)/Math.max(1,f))}else s==="wall"?(Y=f>=10?3:f>=4?2:1,ne=Math.max(1,Math.ceil(f/Y)),ie=Math.min((H-56-(Y-1)*d)/Y,x*.62,230),V=Math.max(60,Math.min(ie*1.5,x,G*.43)),ie=V/1.5,q=V+Math.min(d,70)):(V=Math.min(x,G*.68,(H-70)*.76),ie=V/.76,q=V*(.72+(100-w)*.001)+d);M.forEach(({position:l})=>{l.style.width=`${Math.max(24,V)}px`,l.style.height=`${Math.max(32,ie)}px`}),c&&M.forEach(({position:l})=>{l.style.width=`${Math.min(x,G*.72)}px`,l.style.height=`${Math.min(H-40,x*1.15)}px`}),Me()}}function Ze(l){if(c||!n||xe)return!1;let g=be&&!we&&!K&&!Q&&fe&&!document.hidden;if(g){let I=l/y;s==="angled"?(re+=I*le,re>=n-1&&(re=n-1,le=-1),re<=0&&(re=0,le=1)):re+=I}let k=Q?.moved?1:1-Math.exp(-l*11);ue+=(re-ue)*k,Math.abs(re-ue)<1e-4&&(ue=re);let A=Math.abs(re-ue)>1e-4||g;if(g||Q?.moved){let I=Q?.moved?ue:re,P=s==="wall"?Math.round(I)*Y+m[O]%Y:Math.round(I),J=s==="wall"?Math.min(rt(P,ne*Y),f-1):rt(P,f);We(M[J].sourceIndex,!1,J)}let B=1-Math.exp(-l*13);return M.forEach((I,P)=>{let{position:J,card:se}=I;if(s==="ring"){let Z=-Math.PI/2+(P-ue)*Jt/f;I.x=n===1?0:Math.cos(Z)*$,I.y=n===1?0:Math.sin(Z)*$;let pe=Math.hypot(ye.x-(G/2+I.x),ye.y-(H/2+I.y)),me=Math.max(65,V*2.6),ve=ye.inside&&!Q?.moved?Math.max(0,1-pe/me):0,he=ve*ve*(50+w*1.3);I.flip+=(he-I.flip)*B,Math.abs(I.flip-he)>.05&&(A=!0),se.toggleAttribute("data-gc-back-facing",I.flip>90);let Se=n===1?0:Z*180/Math.PI+90;J.style.transform=`translate3d(${I.x}px,${I.y}px,0) rotate(${Se}deg)`,se.style.transform=`perspective(700px) rotateY(${I.flip}deg) translateZ(${ve*12}px)`,J.style.zIndex=String(P===Ce?f+2:1)}else if(s==="wall"){let Z=P%Y,me=Math.floor(P/Y)-ue;if(ne>2){let Mt=ne%2===0?.5:0;me=rt(me-Mt+ne/2,ne)-ne/2}let ve=Math.min(.68,2.6/Math.max(3,ne)),he=me*ve,Se=Math.max(q/ve,G*.4),ht=w/100,kt=Math.sin(he)*Se,St=(1-Math.cos(he))*Se*ht*.65,Ct=(Z-(Y-1)/2)*(ie+Math.min(d,50)),Qe=P===Ce||K&&P===m[O]?1:0;I.lift+=(Qe-I.lift)*B,Math.abs(Qe-I.lift)>.002&&(A=!0),J.style.transform=`translate3d(${kt}px,${Ct}px,${St+I.lift*20}px) rotateY(${-he*180/Math.PI*ht}deg)`,J.style.zIndex=String(Math.round(St)+(Qe?1e3:1)),se.style.transform=`scale(${1+I.lift*.035})`,J.style.opacity=Math.abs(he)>1.6?"0":"1",J.style.visibility=Math.abs(he)>1.6?"hidden":"visible"}else{let Z=P-ue,pe=P===Ce||K&&P===m[O]?1:0;I.lift+=(pe-I.lift)*B,Math.abs(pe-I.lift)>.002&&(A=!0);let me=-(25+w*.28)*(1-I.lift);J.style.transform=`translate3d(${Z*q}px,${-I.lift*14}px,${I.lift*110}px) rotateY(${me}deg)`,J.style.zIndex=String(pe?n+2:n-P),se.style.transform="none"}}),A}function Ge(l){if(de=0,N)return;let g=Math.min(.05,Math.max(.001,(l-(ke||l-16.7))/1e3));ke=l,Ze(g)&&fe&&!document.hidden?de=requestAnimationFrame(Ge):ke=0}function Me(){!N&&!de&&!c&&(de=requestAnimationFrame(Ge))}c&&u(C,"scroll",Te,{passive:!0}),u(oe,"click",()=>Ve(O-1)),u(_,"click",()=>Ve(O+1)),X&&u(X,"click",()=>ct(!be)),u(C,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let g=l.key==="Home"?0:l.key==="End"?n-1:O+(l.key==="ArrowRight"?1:-1);Ve(g,!0)}),u(C,"focusin",l=>{K=!0;let g=l.target.closest?.("[data-spatial-index]");g&&!Ee&&We(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),Me()}),u(C,"focusout",()=>{queueMicrotask(()=>{N||(K=C.contains(document.activeElement),Me())})}),u(C,"pointerenter",l=>{l.pointerType!=="touch"&&(we=!0,ye.inside=!0,Me())}),u(C,"pointerleave",()=>{we=!1,ye.inside=!1,Ce=-1,Fe(),Me()}),u(C,"pointermove",l=>{if(l.pointerType==="touch")return;let g=C.getBoundingClientRect();ye.x=l.clientX-g.left,ye.y=l.clientY-g.top,ye.inside=!0;let k=l.target.closest?.("[data-spatial-index]");Ce=k?Number(k.dataset.spatialIndex):-1,Fe(Ce>=0?M[Ce].sourceIndex:O),Me()}),u(C,"pointerdown",l=>{let g=l.target.closest?.("[data-spatial-index]");g&&We(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),!(c||n<2||l.pointerType==="mouse"&&l.button!==0)&&(Q={id:l.pointerId,x:l.clientX,y:l.clientY,start:re,moved:!1})}),u(window,"pointermove",l=>{if(!Q||l.pointerId!==Q.id)return;let g=l.clientX-Q.x,k=l.clientY-Q.y;if(!Q.moved){if(Math.abs(k)>12&&Math.abs(k)>Math.abs(g)*1.2){Q=null;return}if(Math.abs(g)<7)return;Q.moved=!0,C.classList.add("is-dragging"),C.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),re=Q.start-g/q,(s==="angled"||s==="wall"&&ne<=2)&&(re=Je(re,0,s==="wall"?ne-1:n-1)),Me()},{passive:!1});let Ue=l=>{if(!Q||l.pointerId!==Q.id)return;let g=Q.moved;if(Q=null,C.classList.remove("is-dragging"),C.hasPointerCapture?.(l.pointerId)&&C.releasePointerCapture(l.pointerId),g){Ae=performance.now()+350,re=Math.round(re);let k=s==="wall"?Math.round(re)*Y+m[O]%Y:Math.round(re),A=s==="wall"?Math.min(rt(k,ne*Y),f-1):rt(k,f);We(M[A].sourceIndex,!0,A)}Me()};u(window,"pointerup",Ue),u(window,"pointercancel",Ue),u(C,"click",l=>{performance.now()<Ae&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),u(C,"dragstart",l=>l.preventDefault()),u(document,"visibilitychange",Me);let Be=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(g=>g.target===C)?Ie():Oe()}):null;Be?.observe(C),ce&&Be?.observe(ce),Be||u(window,"resize",Ie);let $e=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{fe=l[0]?.isIntersecting??!0,fe&&Me()},{rootMargin:"100px"}):null;return $e?.observe(e),Ie(),We(0),{goTo:Ve,setPlaying:ct,setSuspended:Re,destroy(){N||(N=!0,cancelAnimationFrame(de),Be?.disconnect(),$e?.disconnect(),S.abort(),E.remove(),W.remove(),F.remove(),ce?.remove(),r?U?.remove():C.remove(),e.classList.remove(...T),z.forEach((l,g)=>l?e.style.setProperty(g,l):e.style.removeProperty(g)))}}}var Ra,Je,rt,et,Jt,Fi=ee(()=>{zt();Ra=0,Je=(t,e,a)=>Math.max(e,Math.min(a,t)),rt=(t,e)=>(t%e+e)%e,et=(t,e)=>Number.isFinite(Number(t))?Number(t):e,Jt=Math.PI*2});function Ri({host:t,items:e,options:a,makeCard:r,onChange:o,nativeList:i}){let s=Number(a.stageHeight)||680,c=Math.max(300,s-120),n=Math.max(0,Number(a.gap)||0),h=Number.isFinite(Number(a.depth))?Number(a.depth):45,f=a.previewScroll===!1,m=f?window:t;t.classList.add("gc-stack"),t.style.height=f?"auto":s+"px",t.style.overflowY=f?"visible":"auto",t.style.overscrollBehavior=f?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let w=i?.track??document.createElement("div");w.classList.add("gc-stack-track"),t.append(w);let x=e.map((T,z)=>{let v=r(T,z,{caption:a.showTitles,description:!0}),C=i?.slot(v)??document.createElement("div");C.classList.add("gc-stack-slot"),v.parentElement!==C&&C.append(v),w.append(C),C.style.zIndex=z+1,v.style.width=`min(${a.stackCardWidth}px,calc(100% - 48px))`,v.style.minHeight=c+"px";let E=v.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),W=!Array.from(E).some(D=>!D.closest("[hidden]")&&D.textContent.trim());return v.classList.toggle("gc-stack-image-only",W),{card:v,wrap:C,imageOnly:W,start:0,duration:1/0}}),d=0;function y(){return f?-w.getBoundingClientRect().top:t.scrollTop}function S(){d=0;let T=y(),z=0;x.forEach(({card:v,start:C,duration:E},W)=>{let D=Math.max(0,Math.min(1,(T-C)/E));v.style.transform=a.reducedMotion?"none":`perspective(1300px) translateY(${D*-32}px) scale(${1-D*.14}) rotateX(${D*h*.25}deg)`,v.style.filter=`brightness(${1-D*.23})`,D>=.5&&(z=Math.min(W+1,x.length-1))}),x.length&&o?.(z)}function u(){d||(d=requestAnimationFrame(S))}function p(){let T=x.map(({card:C,wrap:E})=>({height:C.offsetHeight,rowHeight:E.offsetHeight})),z=f?window.innerHeight:t.clientHeight,v=w.clientTop+(parseFloat(getComputedStyle(w).paddingTop)||0);x.forEach((C,E)=>{let{height:W,rowHeight:D}=T[E],M=Math.min(40,z-24-W);C.wrap.style.top=M+"px",C.start=v-M,E&&(x[E-1].duration=Math.max(1,C.start-x[E-1].start));let F=C.imageOnly&&W<=z-64?W*.24:0,L=E<x.length-1?n-F:0;C.wrap.style.marginBottom=L+"px",v+=D+L,E===x.length-1&&(C.duration=1/0,w.style.paddingBottom=Math.max(40,z-M-D)+"px")}),u()}let b;return p(),typeof ResizeObserver<"u"&&(b=new ResizeObserver(p),b.observe(w,{box:"border-box"}),x.forEach(({card:T})=>b.observe(T,{box:"border-box"}))),window.addEventListener("resize",p),m.addEventListener("scroll",u,{passive:!0}),{goTo(T){let z=x[Math.max(0,Math.min(x.length-1,Math.round(T)))];if(!z)return;let v=f?window.scrollY+z.start-y():z.start;m.scrollTo({top:v,behavior:a.reducedMotion?"instant":"smooth"})},destroy(){b?.disconnect(),window.removeEventListener("resize",p),cancelAnimationFrame(d),m.removeEventListener("scroll",u),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",w.remove()}}}var Bi=ee(()=>{});function jt(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function Kt(t,e,a,r,o,i){t.beginPath(),t.roundRect(e,a,r,o,Math.max(0,Math.min(i,r/2,o/2)))}function Ba(t,e,a){let r=[];for(let o of e.split(/\n/)){let i="";for(let s of o.split(/\s+/)){let c=i?i+" "+s:s;i&&t.measureText(c).width>a?(r.push(i),i=s):i=c}r.push(i)}return r}function Wi(t,e,a){let r=Math.max(80,e.cardWidth),o=Math.min(e.cardPadding,r*.4),i=r-2*o,s=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,c=document.createElement("canvas").getContext("2d"),n=t.map(({item:f,image:m})=>{let w=[],x=(z,v,C,E,W,D,M=!1,F=a.bodyFamily)=>{if(!z)return;let L=C+" "+v+"px "+F;c.font=L;let oe=Ba(c,z,Math.max(1,i-(M?16:0)));w.push({font:L,size:v,color:E,align:W,lines:oe,height:oe.length*v*1.25+(M?10:0),gap:D,isButton:M})},d=i*e.imageWidth/100,y=m?.naturalWidth/m?.naturalHeight||1,[S,u]=e.aspectRatio.split(":").map(Number),p=e.aspectRatio==="circle"?1:S&&u?S/u:y,b=m&&e.showImage?{image:m,width:d,height:d/p,gap:0}:null;return(e.textPlacement==="card"||!f.src||!e.showImage)&&(e.showTitles&&x(f.title,e.titleCustom&&e.titleSize?e.titleSize*s:a.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:a.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:a.ink,e.titleAlign,0,!1,a.family),e.showDescription&&x(f.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*s:a.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:a.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:a.ink,e.descriptionAlign,w.length?e.titleGap:0),e.showButton&&f.buttonLabel&&f.link&&x(f.buttonLabel,a.size,a.weight,a.buttonInk,"center",e.buttonGap,!0)),b&&(e.cardOrder==="content"?(b.gap=w.length?e.mediaGap:0,w.push(b)):(w.length&&(w[0].gap+=e.mediaGap),w.unshift(b))),{pieces:w,height:Math.max(1,2*o+w.reduce((z,v)=>z+v.gap+v.height,0))}}),h=Math.max(1,...n.map(f=>f.height));return n.map(({pieces:f,height:m})=>{let w=document.createElement("canvas"),x=Math.min(2,2048/Math.max(r,h));w.width=Math.max(1,Math.round(r*x)),w.height=Math.max(1,Math.round(h*x));let d=w.getContext("2d");d.scale(x,x);let y=e.cardSizing==="equal"?h:m,S=(h-y)/2;e.cardBackground&&(d.fillStyle=e.cardColor,Kt(d,0,S,r,y,e.spiralRadius),d.fill());let u=S+o+(e.cardAlign==="bottom"?y-m:e.cardAlign==="middle"?(y-m)/2:0),p;for(let b of f){if(u+=b.gap,b.image){let T=b.image.naturalWidth/b.image.naturalHeight,z=e.fit==="contain"||e.fit==="fit",v=z?Math.min(b.width,b.height*T):b.width,C=z?v/T:b.height,E=o+(e.imageAlign==="left"?0:e.imageAlign==="right"?i-b.width:(i-b.width)/2)+(b.width-v)/2,W=u+(b.height-C)/2,D=e.aspectRatio==="circle"?b.width/2:e.imageRadius;if(e.shadowEnabled){d.save(),d.shadowColor=e.shadowColor,d.shadowBlur=e.shadowBlur*x;let oe=e.shadowAngle*Math.PI/180;d.shadowOffsetX=Math.cos(oe)*e.shadowDistance*x,d.shadowOffsetY=Math.sin(oe)*e.shadowDistance*x;let _=e.shadowSpread;Kt(d,E-_,W-_,v+2*_,C+2*_,D+_),d.fillStyle=e.shadowColor,d.fill(),d.restore()}d.save(),e.aspectRatio==="circle"&&(d.beginPath(),d.arc(E+v/2,W+C/2,b.width/2,0,Math.PI*2),d.clip()),Kt(d,E,W,v,C,e.aspectRatio==="circle"?0:D),d.clip();let M=z?Math.min(v/b.image.naturalWidth,C/b.image.naturalHeight):Math.max(v/b.image.naturalWidth,C/b.image.naturalHeight),F=b.image.naturalWidth*M,L=b.image.naturalHeight*M;d.drawImage(b.image,E+(v-F)/2,W+(C-L)/2,F,L),e.overlayEnabled&&(d.fillStyle=e.imageTint,d.fillRect(E,W,v,C)),e.imageBorder&&(d.strokeStyle=e.imageBorderColor,d.lineWidth=2*e.imageBorderSize,d.stroke()),d.restore()}else{let T=b.align==="inherit"?"center":b.align;if(d.font=b.font,d.textBaseline="top",d.textAlign=T,d.fillStyle=b.color,b.isButton){let v=Math.min(i,Math.max(...b.lines.map(E=>d.measureText(E).width))+16),C=(r-v)/2;d.fillStyle=a.accent,d.fillRect(C,u,v,b.height),d.fillStyle=b.color,p={left:C/r,right:(C+v)/r,top:u/h,bottom:(u+b.height)/h}}let z=T==="left"?o:T==="right"?r-o:r/2;b.lines.forEach((v,C)=>d.fillText(v,z,u+(b.isButton?5:0)+C*b.size*1.25,i))}u+=b.height}return{canvas:w,buttonBounds:p,aspect:r/h}})}var Di=ee(()=>{});function Ni(t,e){let a="http://www.w3.org/2000/svg";function r(y,S,u){let p=document.createElementNS(a,y);for(let[b,T]of Object.entries(S))p.setAttribute(b,T);return u?.append(p),p}let o=r("svg",{width:0,height:0,"aria-hidden":"true"});o.style.position="absolute",t.append(o);let i=r("defs",{},o),s=r("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},i),c=r("feMorphology",{in:"SourceAlpha",operator:"dilate"},s),n=r("feGaussianBlur",{},s),h=r("feOffset",{result:"mask"},s),f=r("feFlood",{},s);r("feComposite",{in2:"mask",operator:"in"},s);let m=r("feMerge",{},s);r("feMergeNode",{},m),r("feMergeNode",{in:"SourceGraphic"},m);let w=r("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},i),x=r("feFlood",{},w);r("feComposite",{in2:"SourceGraphic",operator:"atop"},w);let d=s.cloneNode(!0);return d.id=e+"-card-shadow",i.append(d),y=>{let S=(y.cardShadowAngle??90)*Math.PI/180;d.querySelector("feMorphology").setAttribute("radius",y.cardShadowSpread||0),d.querySelector("feGaussianBlur").setAttribute("stdDeviation",(y.cardShadowBlur||0)/2);let u=d.querySelector("feOffset");u.setAttribute("dx",Math.cos(S)*(y.cardShadowDistance||0)),u.setAttribute("dy",Math.sin(S)*(y.cardShadowDistance||0)),d.querySelector("feFlood").setAttribute("flood-color",y.cardShadowColor||"#000");let p=[];y.shadowEnabled&&p.push("url(#"+s.id+")"),y.cardShadow&&p.push("url(#"+d.id+")");let b=y.shadowAngle*Math.PI/180;c.setAttribute("radius",y.shadowSpread),n.setAttribute("stdDeviation",y.shadowBlur/2),h.setAttribute("dx",Math.cos(b)*y.shadowDistance),h.setAttribute("dy",Math.sin(b)*y.shadowDistance),f.setAttribute("flood-color",y.shadowColor),x.setAttribute("flood-color",y.imageTint),t.style.setProperty("--gc-shadow-filter",p.join(" ")||"none"),t.style.setProperty("--gc-image-filter",y.imageTint.endsWith("00")&&y.imageTint.length===9?"none":"url(#"+w.id+")")}}var Hi=ee(()=>{});var Oi,Tt,$i=ee(()=>{Oi='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',Tt=class{constructor(e,a,r){this.root=e,this.cards=a,this.projects=r;let o=a[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(o)?o:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let i=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",i),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${Oi}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${Oi}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${i}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",c=>{if(c.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(c.clientX<n.left||c.clientX>n.right||c.clientY<n.top||c.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",c=>{(c.key==="ArrowLeft"||c.key==="ArrowRight")&&(c.preventDefault(),this.showFrame(this.frame+(c.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",c=>{!c.isPrimary||c.target.closest("button")||(this.galleryPointer={id:c.pointerId,x:c.clientX,y:c.clientY},s.setPointerCapture(c.pointerId))}),s.addEventListener("pointerup",c=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==c.pointerId)return;s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId);let h=c.clientX-n.x,f=c.clientY-n.y;Math.abs(h)>35&&Math.abs(h)>Math.abs(f)*1.2&&this.showFrame(this.frame+(h<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let a=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!a,this.dialog.querySelector("[data-gallery-next]").hidden=!a,this.thumbnails.hidden=!a,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(o=>{let i=document.createElement("li");return i.textContent=o,i})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((o,i)=>{let s=document.createElement("button");s.type="button",s.className="project-thumbnail",s.setAttribute("aria-label",`Show ${o.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(o.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,s.append(c),s.addEventListener("click",()=>this.showFrame(i)),s})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let a=this.project.gallery[this.frame];this.image.src=new URL(a.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${a.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${a.label}`,[...this.thumbnails.children].forEach((r,o)=>r.setAttribute("aria-current",String(o===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Xe,ft,It=ee(()=>{Et();Xe=Object.freeze({...Mi,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),ft=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function Gi(t,e,{pauseOnHover:a=!0,interactionRestMs:r=6e3}={}){let o=t.querySelector("[data-orbit-toggle]"),i=new AbortController,s=(p,b,T)=>p.addEventListener(b,T,{signal:i.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let n=0,h=0,f=!1,m=p=>!!p&&t.contains(p)&&(p.matches(":focus-visible")||!!p.closest(".orbit-card")),w=()=>!f&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,x=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(n),e.autoFrame=0,n=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},d=p=>{if(e.autoFrame=0,!w()){x();return}let b=Math.min(.05,Math.max(0,(p-e.autoTime)/1e3));e.autoTime=p;let T=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(h+=b,h>=Number(t.dataset.interval||5)){h=0,e.autoTime=0,c.animateTo.call(e,Math.round(e.position)+T),n=setTimeout(y,100);return}}else e.position=(e.position+T*b*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(d)},y=()=>{if(!w()){x(),e.frame&&!f&&(n=setTimeout(y,100));return}let p=e.resumeAt-performance.now();if(p>0){x(),n=setTimeout(y,p);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(d))},S=(p=6e3)=>{x(),e.resumeAt=performance.now()+p};e.animateTo=function(...p){S(r),c.animateTo.apply(this,p),y()},e.settleImmediately=function(...p){c.settleImmediately.apply(this,p),y()},e.openProject=function(...p){S(),c.openProject.apply(this,p),y()},s(t,"pointerenter",p=>{p.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||a)&&(e.hovered=!0,y())}),s(t,"pointerleave",p=>{p.pointerType!=="touch"&&(e.hovered=!1,y())}),s(t,"focusin",p=>{e.keyboardFocused=m(p.target),y()}),s(t,"focusout",p=>{e.keyboardFocused=m(p.relatedTarget),y()}),s(t,"pointerup",()=>{S(r),y()}),s(t,"pointercancel",()=>{S(r),y()}),s(e.viewer.dialog,"close",()=>{S(),y()}),s(document,"visibilitychange",y),s(e.reducedMotion,"change",y),s(o,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,o.dataset.paused=String(e.manuallyPaused),o.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),y()});let u=new IntersectionObserver(p=>{e.inView=p.some(b=>b.isIntersecting&&b.intersectionRatio>=.15),y()},{threshold:.15});return u.observe(e.stage),e.stopAutoplay=x,e.syncAutoplay=y,()=>{f=!0,x(),i.abort(),u.disconnect(),Object.assign(e,c)}}var Ui=ee(()=>{});var Pe,_i,Zt,Xi,Yi,Vi,Ji,Ki,Zi,Qi,eo,to,io,oo,qt,ao,bt,ro,Qt=ee(async()=>{Pe=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),_i=Pe.CanvasTexture,Zt=Pe.BufferGeometry,Xi=Pe.Float32BufferAttribute,Yi=Pe.LineBasicMaterial,Vi=Pe.LineLoop,Ji=Pe.DoubleSide,Ki=Pe.Mesh,Zi=Pe.NoToneMapping,Qi=Pe.PerspectiveCamera,eo=Pe.PlaneGeometry,to=Pe.Raycaster,io=Pe.Scene,oo=Pe.ShaderMaterial,qt=Pe.SRGBColorSpace,ao=Pe.TextureLoader,bt=Pe.Vector2,ro=Pe.WebGLRenderer});var Wa,yt,no=ee(async()=>{Wa=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),yt=Wa.default});var Da,ei,so=ee(async()=>{Da=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),ei=Da.CustomEase});function co(t,e,a=64){let r=t/e,o=new eo(t,t*9/16,a,1),i=o.attributes.position,s=o.attributes.uv;for(let c=0;c<i.count;c++){let n=(s.getX(c)-.5)*e;i.setX(c,r*Math.sin(n)),i.setZ(c,r*(Math.cos(n)-1))}return o.computeVertexNormals(),o.computeBoundingSphere(),o}function lo(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var ti=ee(async()=>{await Qt()});function vt(t,e){let a=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*a,panelArc:t.radiansPerSlide*a,height:t.slotHeight*a}}function Ft(t,{radius:e,pitch:a,radiansPerSlide:r}){let o=t*r;return{x:Math.sin(o)*e,y:-t*a,z:(Math.cos(o)-1)*e,angle:o,taper:1,shade:(1-Math.cos(o))/2*.58}}function po(t,e){let a=vt(t,e);return co(a.cardWidth,a.panelArc)}function ii(t,e=64){let a=[];for(let r=0;r<=e;r++){let o=(r/e-.5)*t.radiansPerSlide;a.push(t.radius*Math.sin(o),t.slotHeight/2,t.radius*(Math.cos(o)-1))}for(let r=e;r>=0;r--){let o=(r/e-.5)*t.radiansPerSlide;a.push(t.radius*Math.sin(o),-t.slotHeight/2,t.radius*(Math.cos(o)-1))}return a}var Rt=ee(async()=>{await ti()});function oi(t,e){let a=po(t,e);return a.scale(1,1/t.aspect/(9/16),1),a.computeVertexNormals(),a.computeBoundingSphere(),a}function go(t,e,a,r,o){let i=Math.min(t,e)*Math.min(40,Math.max(0,o))/100,s=t-2*i,c=e-2*i,n=s/c,h=r==="fit"?Math.max:Math.min,f=h(1,n/a),m=h(1,a/n);return{contentWidth:s,contentHeight:c,uvScaleX:f,uvScaleY:m,imageWidth:s/f,imageHeight:c/m,padding:i}}var uo=ee(async()=>{await Rt();await Rt()});function ai({stageWidth:t,stageHeight:e,spiralWidthPercent:a,cardWidth:r,aspect:o,rise:i,riseUnit:s}){let c=Math.max(1,t*a/200),n=Math.max(1,Math.min(r,c*Math.PI/3,e*.4*o)),h=Math.PI*2*c/n,f=s==="percent"?e*i/100:i*Math.min(1,t/640);return{radius:c,slotWidth:n,slotHeight:n/o,aspect:o,pitch:Math.max(n/o*1.25/h,f),radiansPerSlide:n/c,cardsPerTurn:Math.PI*2*c/n}}var ho=ee(()=>{});function fo(t,e,a){let r=e.radius*2.4,o=r/(r+2*e.radius),i=Math.ceil((a/(2*o)+e.slotHeight/2)/e.pitch)+2,s=Math.floor(t);return{first:s-i,last:s+i,count:i*2+1}}function bo(t,e,a){let r=t*e.radiansPerSlide,o=r-a.panelArc/2,i=r+a.panelArc/2,s=Math.PI*2,c=S=>Math.ceil((o-S)/s)<=Math.floor((i-S)/s),n=c(0)?1:Math.max(Math.cos(o),Math.cos(i)),h=c(Math.PI)?-1:Math.min(Math.cos(o),Math.cos(i)),f=e.radius*2.4,m=f/(f+e.radius*(1-n)),w=f/(f+e.radius*(1-h)),x=-t*e.pitch,d=x+a.height/2,y=x-a.height/2;return{minY:Math.min(y*m,y*w),maxY:Math.max(d*m,d*w)}}function yo(t,e){let a=Math.min(80,e*.08),r=i=>Math.max(0,Math.min(1,i)),o=Math.min(r((e/2-t.minY)/a),r((t.maxY+e/2)/a));return o*o*(3-2*o)}function vo(t,e,a,r){let o=a-e;return Math.abs(o)>r/2&&(o-=Math.round(o/r)*r),t+o}var mo,xo=ee(async()=>{await Rt();ho();mo=(t,e)=>(t%e+e)%e});var ko,wo=ee(()=>{ko=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function So(t,{textureSource:e=a=>a.querySelector("img").src}={}){let{root:a,stage:r}=t,o;try{o=new ro({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return a.dataset.renderer="css-fallback",()=>{delete a.dataset.renderer}}o.outputColorSpace=qt,o.toneMapping=Zi,o.setClearColor(0,0);let i=o.domElement;i.style.removeProperty("display"),i.className="orbit-webgl",i.setAttribute("aria-hidden","true"),r.append(i);let s=new io,c=new Qi,n=new to,h=new bt,f=new AbortController,m=(j,G,H)=>j.addEventListener(G,H,{signal:f.signal}),w=t.render,x=t.pointerDown,d=new Map,y=new Map;function S(){for(let j of t.cards){let G=y.get(j);if(G?.image!==j.artwork&&(G?.dispose(),y.delete(j),j.artwork)){let H=new _i(j.artwork);H.colorSpace=qt,y.set(j,H)}}}let u=[],p,b,T=t.position,z=t.position,v="",C=!1,E=!1,W=null,D=null,M=!1,F=!1;a.dataset.renderer="loading-webgl";let L=()=>ai({stageWidth:r.clientWidth,stageHeight:r.clientHeight,spiralWidthPercent:Number(a.dataset.spiralWidth),cardWidth:Number(a.dataset.cardWidth),aspect:Number(a.dataset.cardAspect),rise:Number(a.dataset.rise),riseUnit:a.dataset.riseUnit}),oe=()=>{let j=t.cards[0],G=new oo({uniforms:{screenshot:{value:d.get(e(j))},dimensions:{value:new bt},contentDimensions:{value:new bt(1,1)},imageScale:{value:new bt(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:Ha,fragmentShader:Oa,transparent:!0,side:Ji,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),H=new Ki(p,G),V=new Vi(b,new Yi({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),ie={card:j,mesh:H,guide:V,material:G,surface:{scale:0,target:0}};H.userData.panel=ie,u.push(ie),s.add(H,V)},_=j=>{let G=fo(T,j,r.clientHeight);for(;u.length<G.count;)oe();for(;u.length>G.count;){let H=u.pop();s.remove(H.mesh,H.guide),H.material.dispose(),H.guide.material.dispose()}u.forEach((H,V)=>{H.offset=G.first+V-T,H.card=t.cards[mo(G.first+V,t.count)],H.material.uniforms.screenshot.value=y.get(H.card)||d.get(e(H.card))})},ge=()=>{let j=r.clientWidth,G=r.clientHeight,H=L(),V=Number(a.dataset.slotGap||3);_(H);let ie=vt(H,V),{cardWidth:q,panelArc:$}=ie,{radius:ae}=H;a.dataset.slotMetrics=JSON.stringify({...H,cardArc:$,cardWidth:q,cardHeight:ie.height,gap:V,imageFit:a.dataset.imageFit,imagePadding:Number(a.dataset.imagePadding||0)}),u.forEach(le=>{le.material.uniforms.dimensions.value.set(q,ie.height);let be=le.material.uniforms;be.cornerRadius.value=Math.min(Number(a.dataset.cornerRadius)||0,q/2,ie.height/2),be.borderWidth.value=Number(a.dataset.borderWidth)||0,be.solidBack.value=a.dataset.backFace==="solid",be.showImage.value=!!le.card.artwork||a.dataset.showImage!=="false";for(let K of["backColor","borderColor","imageTint","mirrorColor"]){let fe=be[K],Q=K==="imageTint"&&le.card.artwork?"#00000000":a.dataset[K]||"#00000000";if(fe.hex!==Q){fe.hex=Q;let Ae=Q.length===7?Q+"ff":Q;fe.value=[1,3,5,7].map(de=>parseInt(Ae.slice(de,de+2),16)/255)}}let xe=le.material.uniforms.screenshot.value.image;if(!xe)return;let we=go(q,ie.height,(xe.naturalWidth||xe.width)/(xe.naturalHeight||xe.height),le.card.artwork?"fit":a.dataset.imageFit,le.card.artwork?0:Number(a.dataset.imagePadding||0));le.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),le.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let Y=Math.min(window.devicePixelRatio||1,2),ne=`${j}:${G}:${q}:${$}:${ie.height}:${ae}:${Y}`;if(ne===v||!j||!G)return;v=ne,o.setPixelRatio(Y),o.setSize(j,G,!1),c.position.set(0,0,ae*2.4),c.fov=lo(G,c.position.z),c.aspect=j/G,c.near=.1,c.far=ae*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let ue=p;p=oi(H,V);let re=b;b=new Zt,b.setAttribute("position",new Xi(ii(H),3)),u.forEach(le=>{le.mesh.geometry=p,le.guide.geometry=b,le.material.uniforms.dimensions.value.set(q,ie.height)}),ue?.dispose(),re?.dispose()},X=()=>{if(!C||E||M||F||!t.geometry)return;F=!0,T=vo(T,z,t.position,t.count),z=t.position,ge();let j=L(),G=vt(j,Number(a.dataset.slotGap||3)),H=a.dataset.focusMode==="keyboard"&&a.contains(document.activeElement),V=0;u.forEach(q=>{let{card:$,mesh:ae,material:Y}=q,ne=Ft(q.offset,j),ue=bo(q.offset,j,G),re=yo(ue,r.clientHeight),le=a.dataset.edgeMode==="preset"?re:+(re>0),be=H&&$===t.cards[t.active]&&Math.abs(q.offset)<.5;Y.polygonOffsetUnits=Math.abs(q.offset)*8,ae.position.set(ne.x,ne.y,ne.z),ae.rotation.y=ne.angle;let xe=q===W&&!t.pointer&&!t.reducedMotion.matches,we=Number(a.dataset.hoverAmount)||0,K=xe?1:0;q.surface.target!==K&&(q.surface.target=K,yt.to(q.surface,{scale:K,duration:(Number(a.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:X})),ae.scale.setScalar(a.dataset.hoverEffect==="zoom"?1+q.surface.scale*we/100:1),a.dataset.hoverEffect==="lift"&&(ae.position.y+=q.surface.scale*we),ae.visible=le>.001&&!!Y.uniforms.screenshot.value.image,ae.visible&&V++,q.guide.position.copy(ae.position),q.guide.rotation.copy(ae.rotation),q.guide.visible=a.dataset.showSlots==="true"&&ae.visible,q.guide.material.opacity=le*.42,Y.uniforms.fade.value=le,Y.uniforms.shade.value=ne.shade,Y.uniforms.focused.value=be?1:0});let ie=JSON.stringify({cardsPerTurn:j.cardsPerTurn,visibleCount:V,poolCount:u.length,stageWidth:r.clientWidth,stageHeight:r.clientHeight,cardWidth:G.cardWidth,cardHeight:G.height,pitch:j.pitch,radius:j.radius,uniqueCount:t.count});a.dataset.responsiveMetrics!==ie&&(a.dataset.responsiveMetrics=ie),D&&!t.pointer&&(W=ce(D)),s.updateMatrixWorld(!0),o.render(s,c),F=!1},ce=j=>{if(!C||M)return null;let G=i.getBoundingClientRect();h.set((j.clientX-G.left)/G.width*2-1,-(j.clientY-G.top)/G.height*2+1),n.setFromCamera(h,c);for(let H of n.intersectObjects(u.map(V=>V.mesh))){let V=H.object.userData.panel;if(!H.object.visible||V.material.uniforms.fade.value<=.25)continue;let{x:ie,y:q}=V.material.uniforms.dimensions.value,$=V.material.uniforms.cornerRadius.value,ae=Math.abs((H.uv.x-.5)*ie)-ie/2+$,Y=Math.abs((H.uv.y-.5)*q)-q/2+$;if(!(Math.hypot(Math.max(ae,0),Math.max(Y,0))+Math.min(Math.max(ae,Y),0)>$))return V.hitUv=H.uv,V}return null};t.render=function(){w.call(this),X()},t.pointerDown=function(j){if(x.call(this,j),C&&!M&&this.pointer?.id===j.pointerId){let G=ce(j);this.pointer.card=G?.card||null;let H=G?.card.buttonBounds,V=G?.hitUv;H&&V.x>=H.left&&V.x<=H.right&&1-V.y>=H.top&&1-V.y<=H.bottom&&(this.pointer.buttonLink=G.card.dataset.buttonLink)}D=null,W=null},m(r,"pointermove",j=>{D=j.pointerType==="mouse"?{clientX:j.clientX,clientY:j.clientY}:null,W=j.pointerType==="mouse"&&!t.pointer?ce(j):null,i.style.cursor=t.pointer?.dragging?"grabbing":W?"pointer":"grab",X()}),m(r,"pointerleave",()=>{D=null,W=null,X()}),m(r,"pointerup",()=>{W=null,X()}),m(a,"focusin",X),m(a,"focusout",()=>queueMicrotask(X)),m(document,"keydown",()=>queueMicrotask(X)),m(document,"pointerdown",()=>queueMicrotask(X)),m(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&u.forEach(({surface:j})=>{yt.killTweensOf(j),j.scale=j.target}),X()}),m(a,"playground-change",()=>{S(),X()}),m(a,"artwork-change",()=>{S(),X()}),m(a,"slot-guides-change",X),m(i,"webglcontextlost",j=>{j.preventDefault(),M=!0,a.classList.remove("has-webgl-carousel"),a.dataset.renderer="css-fallback"}),m(i,"webglcontextrestored",()=>{M=!1,C&&(a.classList.add("has-webgl-carousel"),a.dataset.renderer="webgl",X())});let R=new ResizeObserver(()=>X());R.observe(r);let U=new ao,N=!1,O=()=>{E||(N=!0,C=!1,a.classList.remove("has-webgl-carousel"),a.dataset.renderer="css-fallback")};for(let j of t.cards){let G=e(j);if(d.has(G))continue;let H=U.load(G,X,void 0,O);H.colorSpace=qt,H.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),d.set(G,H)}return N||(p=oi(L(),Number(a.dataset.slotGap||3)),b=new Zt,C=!0,a.classList.add("has-webgl-carousel"),a.dataset.renderer="webgl",X()),()=>{E=!0,f.abort(),R.disconnect(),t.render=w,t.pointerDown=x,a.classList.remove("has-webgl-carousel"),delete a.dataset.renderer,u.forEach(({material:j,surface:G,guide:H})=>{yt.killTweensOf(G),j.dispose(),H.material.dispose()}),y.forEach(j=>j.dispose()),p?.dispose(),b?.dispose(),d.forEach(j=>j.dispose()),o.dispose(),o.forceContextLoss(),i.remove()}}var on,Ha,Oa,Co=ee(async()=>{await Qt();await no();await so();await ti();await uo();await xo();yt.registerPlugin(ei);on=ei.create("portfolio-surface",".2,.75,.25,1"),Ha=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Oa=`
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
`});var Mo=ee(()=>{(()=>{"use strict";let t=Math.PI*2,e=(i,s)=>(i%s+s)%s,a=(i,s,c)=>Math.min(c,Math.max(s,i));class r{constructor(s){this.root=s,this.stage=s.querySelector(".orbit-stage"),this.cards=[...s.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,n)=>{c.dataset.slideIndex=n;let h=c.cloneNode(!0);h.dataset.repeat="true",h.tabIndex=-1,h.setAttribute("aria-hidden","true"),h.removeAttribute("aria-pressed"),c.parentElement.append(h),this.visualCards.push(h)}),!(!this.count||!this.stage)&&(this.title=s.querySelector(".orbit-title"),this.description=s.querySelector(".orbit-description"),this.status=s.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(s,this.cards),this.pagination=s.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((s,c)=>{let n=document.createElement("button");return n.type="button",n.className="orbit-dot",n.setAttribute("aria-label",`Show ${s.dataset.title||`screenshot ${c+1}`}`),n.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(n),n}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(s=>{s.disabled=!0})}bindEvents(){let s=(c,n,h,f={})=>c.addEventListener(n,h,{...this.options,...f});s(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),s(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),s(this.stage,"keydown",c=>{let n={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in n?(c.preventDefault(),this.step(n[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),s(this.stage,"pointerdown",c=>this.pointerDown(c)),s(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),s(this.stage,"pointerup",c=>this.pointerUp(c)),s(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),s(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),s(this.stage,"dragstart",c=>c.preventDefault()),s(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),s(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let n=c.target.closest(".orbit-card");n&&this.openProject(Number(n.dataset.slideIndex))}),s(this.stage,"focusin",c=>{let n=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&n>=0&&n!==this.active&&this.goTo(n)}),s(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),s(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(s=>{let c=s.querySelector(".orbit-surface"),n=c.querySelector("img"),h=Array.from({length:this.segmentCount},(f,m)=>{let w=document.createElement("span");return w.className="orbit-strip",w.setAttribute("aria-hidden","true"),w.dataset.stripIndex=m,w.style.backgroundImage=`url("${n.src}")`,c.append(w),w});return s.classList.add("is-curved"),{card:s,strips:h}})}measure(){let s=this.stage.clientWidth,c=this.stage.clientHeight,n=s<=700;this.cards[0].style.removeProperty("width");let h=this.cards[0].offsetWidth,f=t/8,m=f*.88,w=h/m;this.geometry={radius:w,panelArc:m,cardWidth:h,pitch:a(c/13,36,52),halfWindow:6.5,radiansPerSlide:f,dragUnitX:Math.max(85,s*(n?.32:.18)),dragUnitY:a(c*.13,65,105)},this.stage.style.perspective=`${(w*2.4).toFixed(3)}px`;let x=m/this.segmentCount,d=2*w*Math.sin(x/2),y=h*9/16;this.panels.forEach(({card:S,strips:u})=>{S.style.width=`${h}px`,u.forEach((p,b)=>{let T=-m/2+(b+.5)*x,z=w*Math.sin(T),v=w*(Math.cos(T)-1);p.style.width=`${(d+.6).toFixed(4)}px`,p.style.backgroundSize=`${h}px ${y}px`,p.style.backgroundPosition=`${(-b*h/this.segmentCount).toFixed(4)}px 0px`,p.style.transform=`translateX(-50%) translate3d(${z.toFixed(4)}px, 0px, ${v.toFixed(4)}px) rotateY(${(T*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:s,pitch:c,halfWindow:n,radiansPerSlide:h}=this.geometry;this.visualCards.forEach(m=>{let w=Number(m.dataset.slideIndex),x=e(w-this.position+this.count/2,this.count)-this.count/2;m.dataset.repeat&&(x+=x<0?this.count:-this.count);let d=x*h,y=Math.cos(d),S=Math.sin(d),u=(1-y)/2,p=1-x/n*.11,b=S*s*p,T=x*c,z=y*s*p-s,v=d*180/Math.PI,C=a((n-Math.abs(x))/.65,0,1);m.style.transform=`translate(-50%, -50%) translate3d(${b.toFixed(3)}px, ${T.toFixed(3)}px, ${z.toFixed(3)}px) rotateY(${v.toFixed(3)}deg) scale(${p.toFixed(4)})`,m.style.zIndex="auto",m.style.setProperty("--orbit-shade",String(u*.58)),m.style.setProperty("--orbit-fade",String(C)),m.style.opacity="1",m.style.visibility=C>0?"visible":"hidden",m.style.pointerEvents=C>.25?"auto":"none",m.toggleAttribute("data-gc-back-facing",y<0),m.dataset.offset=x.toFixed(5)});let f=e(Math.round(this.position),this.count);f!==this.active&&this.updateActive(f)}updateActive(s){let c=this.visualCards.includes(document.activeElement);this.active=s,this.cards.forEach((n,h)=>{let f=h===s;n.classList.toggle("is-centered",f),n.tabIndex=f?0:-1,n.setAttribute("aria-pressed",String(f)),this.dots[h].setAttribute("aria-current",String(f))}),this.title&&(this.title.textContent=this.cards[s].dataset.title||""),this.description&&(this.description.textContent=this.cards[s].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[s].dataset.title}, project ${s+1} of ${this.count}`),c&&!this.pointer&&this.cards[s].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(s)}goTo(s){let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(s){this.animateTo(Math.round(this.target)+s)}animateTo(s,c=0){if(this.target=Math.round(s),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(s){this.frame=0;let c=Math.min((s-this.lastTime)/1e3,.032);this.lastTime=s;let n=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=n*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(s){if(this.viewer.dialog.open||!Number.isInteger(s)||!this.cards[s])return;let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(s)}pointerDown(s){if(!s.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}s.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:s.pointerId,x:s.clientX,y:s.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:s.target.closest(".orbit-card")},this.stage.setPointerCapture(s.pointerId))}pointerMove(s){let c=this.pointer;if(!c||c.id!==s.pointerId)return;let n=s.clientX-c.x,h=s.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(n),Math.abs(h))<6)return;if(s.pointerType==="touch"&&Math.abs(n)<=Math.abs(h)){c.card=null;return}c.axis=Math.abs(h)>Math.abs(n)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}s.preventDefault();let f=c.axis==="x"?s.clientX:s.clientY,m=c.axis==="x"?n:h,w=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,x=s.pointerType==="touch"?a(w*.38,32,48):w,d=performance.now(),y=Math.max(8,d-c.lastTime),S=-(f-c.lastCoordinate)/x/y*1e3;c.speed=c.speed*.35+S*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=f,c.travel=m,this.position=c.startPosition-m/x,this.render()}pointerUp(s,c=!1){let n=this.pointer;if(!n||n.id!==s.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(n.id)&&this.stage.releasePointerCapture(n.id),!n.dragging){if(this.animateTo(Math.round(this.position)),!c&&n.buttonLink){location.assign(n.buttonLink);return}!c&&n.card&&this.openProject(Number(n.card.dataset.slideIndex));return}let h=c||performance.now()-n.lastMovement>90?0:a(n.speed,-10,10),f=Math.round(this.position+(this.reducedMotion.matches?0:h*(s.pointerType==="touch"?.32:.2))),m=this.position-n.startPosition;!c&&Math.abs(n.travel)>18&&Math.abs(m)>.12&&f===Math.round(n.startPosition)&&(f+=Math.sign(m)),this.animateTo(f,h)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:s,strips:c})=>{c.forEach(n=>n.remove()),s.classList.remove("is-curved"),s.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(s=>s.dataset.repeat).forEach(s=>s.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function o(i=document){i.querySelectorAll("[data-spiral-carousel]").forEach(s=>{s.spiralCarousel||(s.spiralCarousel=new r(s))})}window.SpiralCarousel={init:o},o()})()});var Eo,Ao=ee(()=>{Eo=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Lo,Po=ee(()=>{Lo=`.project-dialog {
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
`});var jo,zo=ee(()=>{jo=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var Io={};fi(Io,{mountSpiral:()=>Va,spiralControls:()=>ft,spiralDefaults:()=>Xe});function ri(t,e,a){for(let r of To)t.removeAttribute(r);for(let[r,o]of Object.entries(e.imageAttrs||{}))To.has(r)&&o!=null&&t.setAttribute(r,String(o));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&a?.(t)}function ni(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function Va(t){let{host:e,onChange:a=()=>{},loadImage:r}=t,o=t.items.filter(R=>R.src||R.title||R.description||R.link),i={...Xe,...t.options},s=!1;if(!o.length){let R=document.createElement("p");return R.className="gc-spiral-empty",R.textContent="Add content to this source to preview the spiral.",e.append(R),{destroy(){R.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let n=document.createElement("div");n.className="orbit-carousel spiral-carousel slot-carousel",n.dataset.spiralCarousel="",n.id=`gc-spiral-${++Xa}`,n.setAttribute("role","region"),n.setAttribute("aria-label","Spiral gallery"),n.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let h=n.querySelector(".orbit-stage"),f=n.querySelector(".orbit-ring"),m=n.querySelector("[data-orbit-toggle]");_e(n.querySelector("[data-orbit-prev]"),"previous"),_e(n.querySelector("[data-orbit-next]"),"next"),_e(m,"playback");let w=n.querySelector(".gc-spiral-caption"),x=document.createElement("div");x.className="gc-spiral-caption-space",w.before(x),x.append(w);let d=o.some(R=>!!R.title);for(let R of new Set(o.map(U=>U.title).filter(Boolean))){let U=w.cloneNode(!1);U.setAttribute("aria-hidden","true"),U.classList.add("gc-spiral-caption-measure"),U.textContent=R,x.append(U)}let y=document.createElement("div");y.className="gc-item-details",x.after(y);let S=o.map(R=>{let U=document.createElement("div");U.className="gc-item-detail";let N=document.createElement("p");N.className="gc-item-description",N.textContent=Bt(R.description);let O=document.createElement("a"),j=ni(R.link);return j&&(O.href=j),O.textContent=R.buttonLabel||"Open link",U.append(N,O),y.append(U),{group:U,body:N,link:O,href:j}}),u="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),p=[];o.forEach((R,U)=>{let N=document.createElement("button");N.className="orbit-card",N.type="button",N.dataset.title=R.title||"",N.dataset.imageSource=R.src||u,N.setAttribute("aria-label",R.title?`View ${R.title}`:`View image ${U+1}`);let O=document.createElement("span");O.className="orbit-surface";let j=document.createElement("img");R.src?ri(j,R):j.src=u,p.push(N),N.dataset.buttonLink=ni(R.link)||"",O.append(j),N.append(O),f.append(N)}),c.append(n),e.append(c);let b=new Map,T=0,z="";async function v(){let R=JSON.stringify(i);if(z===R)return;z=R;let U=++T,N=o.some($=>jt($,i));if(n.dataset.composite=String(N),!N){for(let[$,ae]of p.entries())if(ae.artwork=null,ae.buttonBounds=null,ae.hasAttribute("data-artwork")){for(let Y of f.querySelectorAll('[data-slide-index="'+$+'"] img'))Y.src=o[$].src||u;ae.removeAttribute("data-artwork")}return}let O=$=>!$||!i.showImage?null:(b.has($)||b.set($,new Promise(ae=>{let Y=new Image;Y.crossOrigin="anonymous",Y.onload=()=>ae(Y),Y.onerror=()=>ae(null),Y.src=$})),b.get($));if(await new Promise(requestAnimationFrame),s||U!==T)return;let j=await Promise.all(o.map(async $=>({item:{...$,plain:Bt($.description)},image:await O($.src)})));if(s||U!==T)return;let G=i.typeSource==="native"?e.closest(".user-items-list-section"):null,H=getComputedStyle(G?.querySelector(".list-item-content__title")||w),V=getComputedStyle(G?.querySelector(".list-item-content__description p")||S[0].body),ie=getComputedStyle(e).color,q=Wi(j,i,{family:H.fontFamily,bodyFamily:V.fontFamily,ink:ie,titleSize:parseFloat(H.fontSize)||16,titleWeight:H.fontWeight,size:parseFloat(V.fontSize)||16,weight:V.fontWeight,accent:getComputedStyle(m).color,buttonInk:getComputedStyle(m).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(m).backgroundColor});q.forEach(({canvas:$,buttonBounds:ae},Y)=>{if(p[Y].artwork=$,p[Y].buttonBounds=ae,p[Y].setAttribute("data-artwork",""),n.dataset.renderer!=="webgl"){let ne=$.toDataURL();for(let ue of n.querySelectorAll('.orbit-card[data-slide-index="'+Y+'"] img'))ue.src=ne}}),f.querySelectorAll("[data-repeat]").forEach($=>{let ae=p[Number($.dataset.slideIndex)];$.buttonBounds=ae?.buttonBounds}),n.dataset.cardAspect=String(q[0].aspect),n.style.setProperty("--gc-art-aspect",q[0].aspect),n.dispatchEvent(new Event("artwork-change"))}let C=Ni(c,n.id),E=()=>{let R=i.textPlacement==="card",U=o.some(N=>jt(N,i));C({...i,shadowEnabled:i.shadowEnabled&&!U,imageTint:i.overlayEnabled&&!U?i.imageTint:"#00000000"}),i.titleCustom?e.dataset.gcTitlePalette=i.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),x.style.textAlign=i.titleAlign,c.style.setProperty("--gc-card-inset",i.carouselPadding+"px"),n.style.padding=i.carouselPadding+"px",n.style.overflow=i.surfaceRadius?"hidden":"",n.style.borderRadius=i.surfaceRadius+"px",n.style.backgroundColor=i.surfaceEnabled?i.surfaceColor:"",n.style.setProperty("--gc-hover-time",i.hoverDuration+"ms"),n.dataset.hoverDuration=i.hoverDuration,n.dataset.mirrorColor=i.mirrorOverlay?i.mirrorColor:"#00000000",n.dataset.playbackMode=i.playbackMode,n.dataset.rate=i.cardsPerMinute,n.dataset.interval=i.duration,n.dataset.direction=i.direction,n.dataset.pauseOnHover=String(i.pauseOnHover),n.dataset.customControlSize=String(!!(i.controlPadding||i.controlIconSize)),n.dataset.hideControlBackground=String(!i.controlBackground),n.style.setProperty("--gc-icon-size",i.controlIconSize?i.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),n.style.setProperty("--gc-button-padding",i.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let N of x.children)N.style.textAlign=i.titleCustom?i.titleAlign:"",N.style.marginBottom=i.titleGap?i.titleGap+"px":"";for(let{body:N,link:O}of S)N.style.textAlign=i.bodyCustom?i.descriptionAlign:"",N.style.fontWeight=i.bodyCustom?i.descriptionWeight:"",N.style.color=i.bodyCustom&&i.descriptionCustom?i.descriptionColor:"inherit",N.style.fontSize=i.bodyCustom&&i.descriptionSize?i.descriptionSize+"rem":"",O.style.marginTop=i.buttonGap+"px";n.dataset.showImage=String(i.showImage!==!1),n.dataset.imageTint=i.overlayEnabled?i.imageTint:"#00000000",n.dataset.hoverEffect=i.reducedMotion?"none":i.hoverEffect,n.dataset.hoverAmount=i.hoverAmount;for(let[N,{body:O,link:j,href:G}]of S.entries())O.hidden=!i.showDescription||!O.textContent,j.hidden=!i.showButton||!G||!o[N].buttonLabel;y.hidden=R||S.every(({body:N,link:O})=>N.hidden&&O.hidden),n.dataset.edgeMode=i.edgeMode,n.dataset.backFace=i.backFace,n.dataset.cornerRadius=i.spiralRadius,n.dataset.borderWidth=i.cardBorderEnabled?i.borderWidth:0,n.dataset.borderColor=i.spiralRim,n.dataset.backColor=i.backColor,n.style.setProperty("--orbit-card-radius",i.spiralRadius+"px"),n.style.setProperty("--orbit-rim",i.spiralRim),c.style.width=`${Ke(i.containerWidth,100,20,100)}%`,h.style.height=i.heightMode==="viewport"?Ke(i.viewportHeight,65,15,100)+"vh":i.heightMode==="auto"?"clamp(160px,calc("+i.cardWidth+"px + "+i.spiralRise*4+"px),90svh)":Ke(i.stageHeight,680,120,1600)+"px",n.style.setProperty("--orbit-card-width",`${Ke(i.cardWidth,280,80,720)}px`),n.dataset.spiralWidth=String(Ke(i.spiralWidth,87,20,100)),n.dataset.cardWidth=String(Ke(i.cardWidth,280,80,720)),n.dataset.rise=String(Ke(i.spiralRise,52,i.spiralRiseUnit==="percent"?1:8,i.spiralRiseUnit==="percent"?50:500)),n.dataset.riseUnit=i.spiralRiseUnit==="percent"?"percent":"px",(!p[0].artwork||!o.some(N=>jt(N,i)))&&(n.dataset.cardAspect=String(Ya(i.aspectRatio))),n.dataset.imageFit=i.fit==="contain"||i.fit==="fit"?"fit":"fill",n.dataset.imagePadding=String(Ke(i.imagePadding,0,0,20)),n.dataset.slotGap=String(Ke(i.spiralGap,3,0,16)),n.dataset.showSlots=String(!!i.showSlots),x.hidden=R||!i.showTitles||!d,v(),n.classList.toggle("gc-spiral-reduced",!!i.reducedMotion)};E();let W=o.map(R=>({title:R.title||"",category:"",description:Bt(R.description),services:[],notes:[],gallery:[{file:R.src||u,label:"Image"}]}));class D extends Tt{constructor(U,N){super(U,N,W),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(U){let N=o[U];if(!N||i.clickAction==="none"||i.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let O=ni(N.link);if(i.clickAction==="link"||i.clickAction==="source"){O&&location.assign(O);return}if(N.postUrl){t.openPost(N,U);return}super.open(U);let j=this.dialog.querySelector(".project-title");j.hidden=!N.title||!i.popupTitle,j.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",j.id),this.dialog.querySelector(".project-summary").hidden=!i.popupDescription||!Bt(N.description),this.dialog.querySelector(".project-gallery").hidden=!i.popupImage||!N.src,this.dialog.querySelector(".project-frame-label").hidden=!i.popupTitle,this.dialog.querySelector(".project-info").hidden=j.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(O&&i.popupButton),this.sourceLink.hidden=!O||!i.popupButton,O?(this.sourceLink.href=O,this.sourceLink.textContent=N.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!i.reducedMotion)}showFrame(U){super.showFrame(U);let N=W.indexOf(this.project),O=o[N];O?.src&&(ri(this.image,O,r),this.dialog.querySelectorAll(".project-thumbnail img").forEach(j=>ri(j,O,r)),this.dialog.querySelector(".project-frame-label").textContent=O.title||"")}}let M=window.ProjectViewer;window.ProjectViewer=D;try{_a.init(c)}finally{M===void 0?delete window.ProjectViewer:window.ProjectViewer=M}let F=n.spiralCarousel;n.querySelectorAll("img").forEach(R=>r?.(R));let L=()=>{for(let[R,U]of p.entries()){if(!U.artwork)continue;let N=U.artwork.toDataURL();for(let O of f.querySelectorAll('[data-slide-index="'+R+'"] img'))O.src=N}};h.addEventListener("webglcontextlost",L,!0);let oe=F.updateActive;F.updateActive=function(R){oe.call(this,R),S.forEach(({group:U},N)=>{U.inert=N!==R,U.style.visibility=N===R?"visible":"hidden"}),this.status.textContent=`${o[R]?.title?`${o[R].title}, `:""}image ${R+1} of ${o.length}`,a(R)},F.updateActive(F.active);let _=F.animateTo;F.animateTo=function(R,U=0){i.reducedMotion?(this.target=Math.round(R),this.settleImmediately()):_.call(this,R,U)};let ge=So(F,{textureSource:R=>R.dataset.imageSource}),X=Gi(n,F,{pauseOnHover:!1,interactionRestMs:0});function ce(R){i.autoplay=!!R,F.manuallyPaused=!R||!!i.reducedMotion,F.resumeAt=0,m.disabled=!!i.reducedMotion||F.reducedMotion.matches||o.length<2,m.dataset.paused=String(F.manuallyPaused),m.setAttribute("aria-label",F.manuallyPaused?"Resume carousel":"Pause carousel"),F.syncAutoplay()}return ce(!!i.autoplay),{update(R){let U=i;i={...i,...R},E(),F.measure(),n.dispatchEvent(new Event("playground-change")),n.dispatchEvent(new Event("slot-guides-change")),F.updateActive(F.active),(U.autoplay!==i.autoplay||U.reducedMotion!==i.reducedMotion)&&ce(!!i.autoplay)},goTo(R){s||F.goTo(R)},setPlaying:ce,getMetrics(){try{return JSON.parse(n.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return n.dataset.renderer||"loading"},destroy(){s||(s=!0,h.removeEventListener("webglcontextlost",L,!0),X(),ge(),F.destroy(),c.remove())}}}var _a,Xa,Ke,Ya,Bt,To,qo=ee(async()=>{Di();Hi();$i();zt();It();It();Ui();await Co();Mo();_a=window.SpiralCarousel,Xa=0,Ke=(t,e,a,r)=>Number.isFinite(Number(t))?Math.max(a,Math.min(r,Number(t))):e,Ya=t=>{if(typeof t=="number"&&t>0)return t;let[e,a]=String(t||"16:9").split(":").map(Number);return e>0&&a>0?e/a:16/9},Bt=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},To=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Fo(t){let{host:e}=t,a={...t.options},r=null,o=null,i=!1,s="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),qo().then(()=>Io).then(n=>{i||(c.remove(),o=n.mountSpiral({...t,options:a}),r!==null&&o.goTo?.(r))}).catch(n=>{i||(s="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",n))}),{update(n){a={...a,...n},o?.update?.(a)},goTo(n){r=n,o?.goTo?.(n)},setPlaying(n){a.autoplay=n,o?.setPlaying?.(n)},getStatus(){return o?.getStatus?.()??s},getMetrics(){return o?.getMetrics?.()??null},destroy(){i=!0,c.remove(),o?.destroy()}}}var Ro=ee(()=>{});function dt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let a=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(a.protocol)?a.href:""}catch{return""}}function Dt(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(a=>a.remove()),e.content.querySelectorAll("*").forEach(a=>{for(let r of[...a.attributes])(/^on/i.test(r.name)||r.name==="style"||r.name==="id")&&a.removeAttribute(r.name);if(a.hasAttribute("href")){let r=dt(a.getAttribute("href"));r?a.setAttribute("href",r):a.removeAttribute("href")}}),e.innerHTML}function Bo(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let a of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(a)&&(e[a]=t.getAttribute(a));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function xt(t,e){let a=Wt[e];if(!t||!a)return null;let r=t.closest(a);if(!r){let n=t.querySelectorAll(a);if(n.length!==1)return null;r=n[0]}let o=e==="list"?r:r.querySelector(":scope > .sqs-block-content");if(!o)return null;let i=n=>Array.from(o.querySelectorAll(n)).filter(h=>h.closest(a)===r&&(!h.closest(".gc-embed")||h.hasAttribute("data-gc-native-track")));if(e==="summary"){let n=i(".summary-block-wrapper");if(n.length!==1)return null;let h=i(".summary-item").filter(f=>n[0].contains(f)&&!f.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:r,originals:n,rows:h}}let s=e==="list"?".list-item":".slide",c=i(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=i(".sqs-gallery")),c.length===1){let n=Array.from(c[0].querySelectorAll(s)).filter(h=>h.closest(a)===r&&!h.hasAttribute("data-gc-repeat"));return{source:r,originals:c,rows:n}}if(e==="gallery"&&!c.length){let n=i(s);if(n.length&&n.every(h=>h.parentElement===n[0].parentElement))return{source:r,originals:n,rows:n}}return null}function pt(t,e,a=location.href){return(xt(t,e)?.rows||[]).map(o=>{let i=o.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let h=o.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),f=dt(h?.getAttribute("href"),a);return{...Bo(i),title:o.querySelector(".summary-title")?.textContent.trim()||i?.alt||"",description:Dt(o.querySelector(".summary-excerpt")?.innerHTML),link:f,postUrl:f,buttonLabel:"Read post"}}let s=o.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=Dt(o.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),n=o.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Bo(i),title:s,description:c,link:dt(n?.getAttribute("href"),a),buttonLabel:e==="list"&&n?.textContent.trim()||""}}).filter(o=>e==="summary"?!!o.link:e==="list"||!!(o.src||o.title||o.link))}function Ja(t,e){let a=e==="list"?t.getAttribute("data-section-id"):t.id;if(!a?.trim())return"";let r=e==="list"?'section[data-section-id="'+CSS.escape(a)+'"]':"#"+CSS.escape(a);return t.ownerDocument.querySelectorAll(r).length===1?r:""}function Wo(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Wt).join(","))).filter(a=>!a.closest(".gc-embed")).flatMap(a=>{let r=a.matches(Wt.list)?"list":a.matches(Wt.summary)?"summary":"gallery",o=Ja(a,r);if(!o||!xt(a,r))return[];let i=++e[r];return{name:(r==="list"?"List Section":r==="summary"?"Summary Block":"Gallery Block")+(i>1?" "+i:""),type:r,selector:o,root:a,items:pt(a,r)}})}function Nt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let a=t.ownerDocument.defaultView?.ImageLoader;if(a&&typeof a.load=="function")try{a.load(t,{load:!0})}catch(r){console.warn("Gallery Studio: native image loader",r)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Do(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Do(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function si(t){let e=document.createElement("img");for(let[a,r]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(a)&&e.setAttribute(a,r);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Do(t.imageAttrs?.["data-image-focal-point"]),e}var Wt,ci=ee(()=>{Wt={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function No(t,e,a){let r=new WeakMap,o=new WeakMap,i=Array.from(e.childNodes),s=a.map(S=>Array.from(S.childNodes)),c=[];function n(S,u){S&&c.push([S,u.map(p=>[p,S.getAttribute(p)])])}let h=new Set,f=!1;function m(){n(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let S of a)n(S,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),f=!0}function w(S,u,p,b,T){let z=a[u],v=h.has(u),C=v?z.cloneNode(!1):z,E=document.createElement("div");if(E.className="gc-card gc-native-card",E.tabIndex=0,E.setAttribute("role","group"),S.imageAttrs?.["data-image-focal-point"]){let[_,ge]=S.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(_)&&Number.isFinite(ge)&&E.style.setProperty("--gc-native-focus",_*100+"% "+ge*100+"%")}let W=S.title||S.alt||`Item ${u+1}`;if(E.setAttribute("aria-label",W),v){C.removeAttribute("id"),C.setAttribute("data-gc-repeat","");for(let _ of s[u])E.append(_.cloneNode(!0));E.querySelectorAll("[id]").forEach(_=>_.removeAttribute("id"))}else h.add(u),E.append(...s[u]);C.replaceChildren(E),r.set(E,C);let D=E.querySelector(".list-item-media"),M=E.querySelector(".list-item-content"),F=E.querySelector(".list-item-content__title"),L=E.querySelector(".list-item-content__description");if(!v){for(let _ of[D,M])n(_,["class"]);for(let _ of[F,L])n(_,["class","hidden"])}if(D?.classList.add("gc-card-media"),M?.classList.add("gc-card-copy"),b.typeSource!=="native"&&(F?.classList.add("gc-card-title"),L?.classList.add("gc-card-description")),F&&(!b.showTitles||p.caption===!1)&&(F.hidden=!0),L&&!p.description&&(L.hidden=!0),p.thumbnail){let _=E.querySelector(".list-item-content__button-wrapper")||E.querySelector(".list-item-content__button");_&&(v||n(_,["hidden"]),_.hidden=!0),M&&(!S.title||p.caption===!1)&&(v||n(M,["hidden"]),M.hidden=!0)}let oe=Array.from(E.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!v)for(let _ of oe)n(_,["tabindex"]);if(o.set(E,oe.map(_=>[_,_.getAttribute("tabindex")])),b.clickAction!=="none"&&(b.clickAction!=="link"||S.link)){let _=document.createElement("button");_.type="button",_.className="gc-native-action",_.tabIndex=-1,_.setAttribute("aria-label",(b.clickAction==="link"?"Open link for ":"Open ")+W),_.addEventListener("click",()=>T(S,u)),E.append(_),E.setAttribute("aria-keyshortcuts","Enter Space"),E.addEventListener("click",ge=>{ge.defaultPrevented||ge.target.closest("a,button,input,select,textarea,label")||T(S,u)}),E.addEventListener("keydown",ge=>{ge.target!==E||!["Enter"," "].includes(ge.key)||(ge.preventDefault(),_.click())})}return E}function x(S){let u=S.tabIndex===0&&S.getAttribute("aria-hidden")!=="true";for(let[p,b]of o.get(S)||[]){let T=u?b:"-1";p.getAttribute("tabindex")!==T&&(T===null?p.removeAttribute("tabindex"):p.setAttribute("tabindex",T))}}function d(S){if(!f)return;let u=S!=="native";e.querySelectorAll(".list-item-content__title").forEach(p=>p.classList.toggle("gc-card-title",u)),e.querySelectorAll(".list-item-content__description").forEach(p=>p.classList.toggle("gc-card-description",u))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!f){a.forEach((S,u)=>S.replaceChildren(...s[u])),e.replaceChildren(...i);for(let[S,u]of c)for(let[p,b]of u)S.getAttribute(p)!==b&&(b===null?S.removeAttribute(p):S.setAttribute(p,b));t.after(e),c.length=0,h.clear(),f=!1}}return{track:e,begin:m,makeCard:w,slot:S=>r.get(S),syncFocus:x,setType:d,restore:y}}var Ho=ee(()=>{});function Oo(t,e,a){if(!a.closest(".fluid-engine > .fe-block"))return()=>{};a.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let o=0,i=!1,s=new WeakSet,c=w=>{w&&!s.has(w)&&(s.add(w),h.observe(w))},n=()=>{!o&&!i&&(o=requestAnimationFrame(m))},h=new ResizeObserver(n),f=new MutationObserver(n);function m(){if(o=0,i||!e.isConnected)return;let w=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!w)return;let x=w.classList.contains("gc-carousel-stage"),d=w.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(w);let y=0;for(let u of d.children){if(u===w||u.contains(w))continue;c(u);let p=getComputedStyle(u);p.display==="none"||["absolute","fixed"].includes(p.position)||(y+=u.offsetHeight+(parseFloat(p.marginTop)||0)+(parseFloat(p.marginBottom)||0))}let S=Math.max(1,t.clientHeight-y);if(x){let u=w.parentElement;u.classList.contains("gc-block-stage-window")||(u=document.createElement("div"),u.className="gc-block-stage-window",w.before(u),u.append(w));let p=Math.min(1,S/Math.max(1,w.offsetHeight));u.style.height=S+"px",w.style.setProperty("--gc-block-scale",String(p)),w.style.setProperty("--gc-block-top",Math.max(0,(S-w.offsetHeight*p)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",S+"px")}return c(t),f.observe(e,{childList:!0,subtree:!0}),n(),()=>{i=!0,cancelAnimationFrame(o),h.disconnect(),f.disconnect(),a.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let w=e.querySelector(".gc-block-stage-window");if(w){let x=w.firstElementChild;x.style.removeProperty("--gc-block-scale"),x.style.removeProperty("--gc-block-top"),w.replaceWith(x)}}}var $o=ee(()=>{});function Go(t,e,a,r){let o=a.ownerDocument,i=o.defaultView,s=r!=="list"?a.closest(".fluid-engine > .fe-block"):null;s?.classList.add("gc-viewport-cell");let c=[],n=s||a;for(let m=t.parentElement;m&&(["hidden","clip","auto","scroll"].includes(i.getComputedStyle(m).overflowX)&&c.push(m),m!==n);m=m.parentElement);function h(){let m=o.documentElement.clientWidth;if(!m||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let y=d.getBoundingClientRect().left+i.scrollX+d.clientLeft,S=y>.5||y+d.clientWidth<m-.5;d.classList.toggle("gc-viewport-unclip",S)}let w=-(t.getBoundingClientRect().left+i.scrollX),x=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};x("--gc-viewport-width",m+"px"),x("--gc-viewport-offset",w+"px")}h();let f=i.ResizeObserver?new i.ResizeObserver(h):null;return f?.observe(t),f?.observe(o.documentElement),i.addEventListener("resize",h),()=>{f?.disconnect(),i.removeEventListener("resize",h);for(let m of c)m.classList.remove("gc-viewport-unclip");s?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var Uo=ee(()=>{});var Xo,_o=ee(()=>{Xo=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function Yo(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let r=document.createElement("style");r.id="gc-finish-css",r.textContent=Xo,document.head.append(r)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let a={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[r,o]of Object.entries(a))t.style.setProperty(r,o);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var li,Vo=ee(()=>{_o();li={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function Jo(t,e){let a=t.classList.contains("gc-embed"),r=a&&e.colorSource==="section";r?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,a&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let o=t.style;o.setProperty("--gc-custom-background",e.background),o.setProperty("--gc-custom-ink",e.ink),o.setProperty("--gc-custom-accent",e.accent),o.setProperty("--gc-background",r?"var(--gc-section-surface)":e.background),o.setProperty("--gc-ink",r?"var(--gc-section-body)":e.ink),o.setProperty("--gc-accent",r?"var(--gc-section-action)":e.accent),o.setProperty("--gc-muted",r?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),o.setProperty("--gc-spatial-surface","var(--gc-background)"),o.setProperty("--gc-spatial-ink","var(--gc-ink)"),r&&(o.setProperty("--gc-line-color","var(--gc-section-line)"),o.setProperty("--gc-tint","var(--gc-section-body)")),o.background=r?"transparent":e.background,o.color=r?"var(--gc-section-body)":e.ink;for(let i of t.querySelectorAll(":scope > dialog"))Ko(t,i)}function Ko(t,e){for(let a of["gcColorSource","gcTypeSource"])t.dataset[a]?e.dataset[a]=t.dataset[a]:delete e.dataset[a]}function di(t,e){let a=t.classList.contains("gc-embed")?t:t.ownerDocument.body;Ko(t,e),e.parentElement!==a&&a.append(e)}var Zo=ee(()=>{});var ea,Qo=ee(()=>{ea=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var ia,ta=ee(()=>{ia=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var aa,oa=ee(()=>{aa=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var na,ra=ee(()=>{na=`.gc-carousel {
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
`});var ca,sa=ee(()=>{ca=`.gc-spatial {
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
`});function tt(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Ht(t,e){let a=tt(e.preset??t.preset),r=a===tt(t.preset)?t.stageHeight:a?0:590;return{...e.preset==="spiral"?Xe:{},...t,...e,stageHeight:e.stageHeight??r}}function la(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function da(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[ea,ia,aa].join(`
`),document.head.append(e));let a=la(t);if(a==="common")return()=>{};let r=`gc-runtime-${a}-css`,o=document.getElementById(r);o||(o=document.createElement("style"),o.id=r,a==="carousel"?o.textContent=na:a==="spatial"?o.textContent=ca:o.textContent=[Eo,ko,Lo,jo].join(`
`),e.after(o)),o.dataset.gcOwners=String(Number(o.dataset.gcOwners||0)+1);let i=!1;return()=>{if(i)return;i=!0;let s=Number(o.dataset.gcOwners)-1;s>0?o.dataset.gcOwners=String(s):o.remove()}}function or(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function pa(t,e,a={},r=null){let o=Ht(nt,a),i=null,s=null,c=null,n=0,h=0,f,m;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function w(){s&&(s.close(),s.remove(),s=null,i?.setSuspended?.(!1),c?.focus({preventScroll:!0}))}function x(v,C){if(o.clickAction==="none")return;if(o.clickAction==="link"){let L=dt(v.link);L&&window.open(L,"_blank","noopener,noreferrer");return}c=document.activeElement,s&&w(),s=document.createElement("dialog"),s.className="gc-dialog"+(o.preset==="showcase"?" gc-dialog-drawer":""),s.setAttribute("aria-label",v.title||"Image preview");let E=document.createElement("button");E.className="gc-dialog-close",E.type="button",E.textContent="Close \xD7",E.addEventListener("click",w);let W=document.createElement("div");W.className="gc-dialog-content";let D=document.createElement("div");D.className="gc-dialog-media",v.src&&o.popupImage!==!1&&(D.append(si(v)),W.append(D));let M=document.createElement("div");if(M.className="gc-dialog-copy",v.title&&o.popupTitle!==!1){let L=document.createElement("h2");L.textContent=v.title,M.append(L)}if(v.postUrl&&o.popupDescription!==!1){let L=document.createElement("article");M.append(L),zi(L,v)}else if(v.description&&o.popupDescription!==!1){let L=document.createElement("div");L.innerHTML=Dt(v.description),M.append(L)}if(v.link&&o.popupButton!==!1){let L=document.createElement("a");L.href=dt(v.link),L.textContent=v.buttonLabel||"Open link",L.target="_blank",L.rel="noopener noreferrer",M.append(L)}let F=document.createElement("p");F.className="gc-dialog-count",F.textContent=`${C+1} / ${e.length}`,M.append(F),W.append(M),s.append(E,W),di(t,s),s.showModal(),i?.setSuspended?.(!0),Nt(D.querySelector("img")),E.focus(),s.addEventListener("cancel",L=>{L.preventDefault(),w()}),s.addEventListener("click",L=>{if(L.target===s){let oe=s.getBoundingClientRect();(L.clientX<oe.left||L.clientX>oe.right||L.clientY<oe.top||L.clientY>oe.bottom)&&w()}})}function d(v,C,E={}){if(r)return r.makeCard(v,C,E,o,x);let W=document.createElement("button");W.type="button",W.className="gc-card",W.setAttribute("aria-label",v.title||`Image ${C+1}`);let D=document.createElement("span");D.className="gc-card-media",v.src&&o.popupImage!==!1&&(D.append(si(v)),W.append(D));let M=document.createElement("span");if(M.className="gc-card-copy",E.caption!==!1&&o.showTitles&&v.title){let F=document.createElement("span");F.className="gc-card-title",F.textContent=v.title,M.append(F)}if(E.description&&v.description){let F=document.createElement("span");F.className="gc-card-description",F.textContent=or(v.description),M.append(F)}return M.childNodes.length&&W.append(M),W.addEventListener("click",()=>x(v,C)),W}let y=matchMedia("(prefers-reduced-motion: reduce)"),S=matchMedia("(max-width: 660px)");function u(){let v={...Xt(t,o),reducedMotion:o.reducedMotion||y.matches};if(S.matches&&(o.preset!=="spiral"||o.mobileSizing)){if(o.preset==="spiral"){for(let[C,E]of[["spiralWidth","mobileSpiralWidth"],["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])o[E]!=null&&(v[C]=o[E]);o.mobileHeightMode&&o.mobileHeightMode!=="inherit"&&(v.heightMode=o.mobileHeightMode,v.stageHeight=o.mobileStageHeight??v.stageHeight,v.viewportHeight=o.mobileViewportHeight)}o.mobileCardWidth!=null&&(v.cardWidth=o.mobileCardWidth),o.mobileGap!=null&&(v[o.preset==="spiral"?"spiralGap":"gap"]=o.mobileGap)}return v.phoneWidthOverride=S.matches&&o.mobileCardWidth!=null,o.preset==="stack"&&(v.stackCardWidth=S.matches&&o.mobileCardWidth!=null?o.mobileCardWidth:Math.max(360,o.cardWidth*2.2)),v}function p(){t.classList.toggle("gc-hide-controls",o.showControls===!1);let v=Xt(t,o);Yo(t,v),t.style.setProperty("--gc-fit",o.fit),t.style.setProperty("--gc-card-radius",o.radius+"px"),Jo(t,v)}function b(v=0){w(),i?.destroy(),i=null,r?.restore(),cancelAnimationFrame(h),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let C=la(o.preset);C!==f&&(m?.(),m=da(o.preset),f=C),p(),t.setAttribute("aria-label",o.previewScroll===!1?"Gallery":"Gallery preview");let E=r&&o.preset!=="spiral"?r:null;E?E.begin():r&&r.track.classList.add("gc-native-items-hidden");let W={host:t,items:e,openPost:x,initialIndex:v,nativeList:E,attachDialog:D=>di(t,D),options:u(),makeCard:d,loadImage:Nt,onChange(D){n=D,o.onChange?.(D)}};if(!e.length){let D=document.createElement("p");D.className="gc-empty",D.textContent="Add images to your source to start exploring.",t.append(D);return}o.preset==="spiral"?i=Fo(W):o.preset==="stack"?i=Ri(W):["wall","ring","angled"].includes(o.preset)?(i=qi(W),v&&i.goTo(v)):i=Ti(W),o.preset!=="spiral"&&(h=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(D=>{Nt(D,{nativeCard:!!E})})))}let T=()=>b(n);function z(){o.preset!=="spiral"&&o.mobileCardWidth==null&&o.mobileGap==null||(i?.setGeometry?i.setGeometry(u()):o.preset==="spiral"?i?.update(u()):b(n))}try{b()}catch(v){throw m?.(),r?.restore(),v}return y.addEventListener("change",T),S.addEventListener("change",z),{update(v){let C=o.preset,E=u();o=Ht(o,v);let W=u(),D=Object.keys(W).filter(F=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(F)&&W[F]!==E[F]);if(!D.length)return;if(i?.setGeometry&&D.every(F=>["cardWidth","gap","phoneWidthOverride"].includes(F))){i.setGeometry(W);return}let M=F=>["colorSource","typeSource","background","ink","accent"].includes(F);if(D.every(F=>M(F)||C!=="spiral"&&(F==="radius"||Object.hasOwn(li,F)))){p(),D.includes("typeSource")&&r?.setType(o.typeSource);return}C==="spiral"&&o.preset==="spiral"&&i?.update?(p(),i.update(W)):b(C===o.preset?n:0)},goTo(v){i?.goTo?.(v)},setPlaying(v){o.autoplay=v,i?.setPlaying?.(v)},getOptions(){return{...o}},getActive(){return n},destroy(){w(),cancelAnimationFrame(h),i?.destroy(),r?.restore(),y.removeEventListener("change",T),S.removeEventListener("change",z),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),m?.()}}}function ar(t,e){let a=e.closest("section")||e,r=[];for(let o=t.parentElement;o;o=o.parentElement){let i=Le.scrollBoundaries.get(o)||0;if((i||["hidden","auto","scroll","overlay"].includes(getComputedStyle(o).overflowY))&&(Le.scrollBoundaries.set(o,i+1),o.classList.add("gc-stack-page-scroll"),r.push(o)),o===a)break}return()=>{for(let o of r){let i=Le.scrollBoundaries.get(o)-1;i?Le.scrollBoundaries.set(o,i):(Le.scrollBoundaries.delete(o),o.classList.remove("gc-stack-page-scroll"))}}}function gt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function pi(t){if(!Le.editListeners?.size){Le.editListeners=new Set;let e=gt();Le.editObserver=new MutationObserver(()=>{let a=gt();if(a!==e){e=a;for(let r of Le.editListeners)try{r(a)}catch(o){console.warn("Gallery Studio: could not resume a list layout.",o)}}});for(let a of[document.body,document.documentElement])Le.editObserver.observe(a,{attributes:!0,attributeFilter:["class"]})}return Le.editListeners.add(t),()=>{Le.editListeners.delete(t),Le.editListeners.size||Le.editObserver.disconnect()}}function gi({selector:t,type:e="gallery",options:a={}}={}){let r=t;if(typeof t=="string")try{let L=document.querySelectorAll(t);if(L.length!==1)return null;r=L[0]}catch{return null}if(!r?.isConnected||typeof r.closest!="function")return null;let o=xt(r,e);if(!o)return null;let{source:i}=o,s=Le.mounts.get(i);if(s)return s.instance.update(a),s;if(!pt(i,e).length)return null;let c=document.createElement("div"),n=document.createElement("div");c.dataset.sourceType=e,c.className="gc-embed",n.className="gc-viewport-slot",n.append(c);let h={...Ht(nt,a),previewScroll:!1},f=null,m=null,w=null,x=null,d=null,y=!1,S=[],u=null,p=!1,b=null;function T(){h.galleryWidth==="source"?(w?.(),w=null,u&&(n.classList.add("user-items-list-simple"),n.dataset.layoutWidth=u.mode,n.style.maxWidth=u.maximum)):w||(n.classList.remove("user-items-list-simple"),delete n.dataset.layoutWidth,n.style.removeProperty("max-width"),w=Go(n,c,i,e))}function z(){return e!=="list"&&h.preset!=="stack"&&h.galleryHeight!=="custom"&&!!i.closest(".fluid-engine > .fe-block")}function v(){z()?x||(x=Oo(n,c,i)):(x?.(),x=null)}function C(L){L==="stack"?m||(m=ar(c,i)):m&&(m(),m=null)}function E(){try{f?.destroy()}finally{f=null,x?.(),x=null,C(null),w?.(),w=null,S.forEach(L=>L.classList.remove("gc-native-items-hidden")),S=[],b?.remove(),b=null,n.remove(),n.replaceChildren(c),c.inert=!1}}function W(){if(y||f||!i.isConnected)return;let L=xt(i,e),oe=pt(i,e);if(!L||!oe.length)return;L.originals[0].before(n),da();let _=L.originals[0];u=e==="list"?{mode:_.dataset.layoutWidth||"full",maximum:_.style.maxWidth}:null,T();let ge=null;if(e==="list"){let X=p?_.cloneNode(!0):_;p&&(b=X,X.removeAttribute("id"),X.querySelectorAll("[id]").forEach(ce=>ce.removeAttribute("id")),n.append(X)),ge=No(n,X,p?[...X.querySelectorAll(".list-item")]:L.rows)}(!ge||p)&&(S=L.originals,S.forEach(X=>X.classList.add("gc-native-items-hidden"))),v(),C(h.preset),f=pa(c,oe,h,ge),c.inert=p}function D(){if(!y){y=!0,i.classList.remove("gc-edit-preview");try{E()}finally{d?.(),Le.mounts.delete(i)}}}let F={instance:{update(L={}){if(y)return;let oe=h.galleryWidth;h={...Ht(h,L),previewScroll:!1},f&&(h.galleryWidth!==oe&&T(),v(),C(h.preset),f.update(h))},setEditPreview(L){if(!(y||!gt()||L===p)){if(p=L,i.classList.toggle("gc-edit-preview",L),!L){E();return}try{W()}catch(oe){throw this.setEditPreview(!1),oe}}},goTo(L){f?.goTo(L)},setPlaying(L){h.autoplay=L,f?.setPlaying(L)},getOptions(){return{...h}},getActive(){return f?.getActive()??0},destroy:D},host:c,source:i,destroy:D};try{d=pi(L=>{if((p||L)&&E(),p=!1,i.classList.remove("gc-edit-preview"),!L)try{W()}catch(oe){throw E(),oe}}),gt()||W(),Le.mounts.set(i,F)}catch(L){throw D(),L}return F}var wt,nt,Le,ui=ee(()=>{Ci();Yt();ji();Ii();Fi();Bi();Ro();It();ci();Ho();$o();Uo();Vo();Zo();Qo();ta();oa();ra();sa();zo();Ao();Po();wo();wt=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],nt={...Pt,...li,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};Le=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:pa,embed:gi,presets:wt,loadPostData:Si}});var ua,ga=ee(()=>{ua=`:host {
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
`});function te(t,e,a){let r=document.createElement(t);return e&&(r.className=e),a!==void 0&&(r.textContent=a),r}function ze(t,e,a){let r=te("button",t,e);return r.type="button",a&&r.setAttribute("aria-label",a),r}function ha(t){let e=te("span","select-box");return e.append(t),e}function je(t,e,a,r,o,i=""){return{key:t,label:e,type:"range",min:a,max:r,step:o,unit:i}}function Ye(t,e,a){return{key:t,label:e,type:"select",choices:Object.entries(a).map(([r,o])=>({value:r,label:o}))}}function st(t,e,a){return{key:t,label:e,type:"color",when:a,independent:!0}}function hi(t,e){let a=t.preset,r=tt(a),o=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,a==="timed"?960:a==="spiral"?720:560,1,"px"),je("stageHeight",r?"Minimum gallery height":"Gallery height",r?0:300,1200,1,"px")];if(e!=="list"&&(o.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&o.splice(o.findIndex(n=>n.key==="stageHeight"),1)),a==="spiral")o.push(...ft);else if(o.push(je("gap","Spacing",0,100,1,"px")),a!=="infinite"&&a!=="timed"){let n={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[a]||"Depth";o.push(je("depth",n,0,100,1))}let i=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":a==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(a==="arc-tabs"||a==="timed")&&i.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),a!=="stack"&&(i.push({key:"showControls",label:"Show controls",type:"checkbox"}),i.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),a!=="spiral"&&i.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),i.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let s=Ut.has(a),c=[{title:"Size & spacing",fields:o},{title:"Mobile overrides",fields:[{...o.find(n=>n.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...o.find(n=>n.key===(a==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:a==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:i},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:nr},...a==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),st("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(a)?[Ye("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),st("backColor","Back color",["backFace","solid"])]:[],...a==="stack"?[]:[Ye("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...s?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...a==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ye("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ye("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ye("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),st("controlFill","Button background",["controlPalette","custom"]),st("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...s?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(n=>({value:n,label:n+" rem"}))]}],Ye("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ye("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),st("titleColor","Custom title color",["titlePalette","custom"])]},...s?Pi({range:je,select:Ye,swatch:st}):[]];if(a==="spiral"){c=Ei(t,e,{range:je,select:Ye,swatch:st},c);for(let n of c)if(n.title==="Mobile")for(let h of n.fields.slice(1))h.condition=f=>f.mobileSizing,h.mobileRange=!!h.inherits}if(s){for(let n of c)if(n.fields=n.fields.flatMap(h=>{if(h.type!=="color"||!Lt.includes(h.key))return[h];let f=h.when||(h.independent?void 0:["colorSource","custom"]);return[{...Ye(h.key+"Swatch",h.label+" palette",{custom:"Custom",..._t}),type:"palette",when:f,condition:h.condition},{...h,when:f,condition:h.condition,customFor:h.key+"Swatch"},{...je(h.key+"Opacity",h.label+" opacity",0,100,1,"%"),when:f}]}),n.typography)for(let h of n.fields)h.typography=n.typography}return c}function ma(t){return{...nt,stageHeight:tt(t.preset??nt.preset)?0:590,...t.preset==="spiral"?Xe:{},colorSource:"section",typeSource:"native",...t}}function sr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",a=t.name?.trim()||e,r=t.items?.length||0;return`${a.toLowerCase().includes(e.toLowerCase())?a:`${a} \xB7 ${e}`} \xB7 ${r} ${r===1?"item":"items"}`}function cr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let a=e.ownerDocument,r=a.defaultView,o=0;function i(){o=0;let h=e.getBoundingClientRect();if(!h.width||!h.height||!e.offsetHeight)return;let f=h.height/e.offsetHeight,m=t.getBoundingClientRect(),w=h.width/e.offsetWidth,x=Math.min(h.bottom,r.innerHeight),d=x;for(let y of[.1,.5,.9]){let S=h.left+(m.left+m.width*y)*w,u=a.elementFromPoint(S,x-2);if(!(!u||u===e))for(;u&&!u.contains(e);){let p=u.getBoundingClientRect();p.bottom>=x-2&&p.height>0&&p.height<h.height/2&&(d=Math.min(d,p.top)),u=u.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((h.bottom-d)/f))+"px")}function s(){o||(o=requestAnimationFrame(i))}let c=new ResizeObserver(s);c.observe(e),c.observe(a.documentElement);let n=new MutationObserver(s);return n.observe(a.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),r.addEventListener("resize",s),r.addEventListener("transitionend",s),i(),()=>{c.disconnect(),n.disconnect(),r.removeEventListener("resize",s),r.removeEventListener("transitionend",s),cancelAnimationFrame(o)}}function fa({source:t,options:e,onPreset:a,onOption:r,onClose:o,onRestore:i,onSave:s,getSaveState:c,getCode:n,getStyle:h,applyStyle:f}){let m=document.activeElement,w=t,x=ma(e),d=!1,y=!1,S=0,u=new Map,p=[],b=new Map;function T(){for(let[l,g]of b)l.hidden=!x[g]}let z=new Map,v=te("div");v.setAttribute("data-gc-author-panel",""),v.setAttribute("data-lenis-prevent",""),v.addEventListener("wheel",l=>l.stopPropagation(),{passive:!0}),v.addEventListener("touchmove",l=>l.stopPropagation(),{passive:!0});let C=v.attachShadow({mode:"open"}),E=te("style");E.textContent=ua;let W=te("aside","panel");W.setAttribute("aria-labelledby","gc-author-heading");let D=te("header","header"),M=te("div","heading"),F=te("h2","","Gallery settings");F.id="gc-author-heading";let L=te("p","target"),oe=te("p","save-state");oe.setAttribute("role","status"),M.append(F,L,oe);function _(l=c()){oe.textContent!==l&&(oe.textContent=l,oe.dataset.saved=String(l==="Saved to page"))}let ge=te("div","header-actions"),X=ze("icon-button","\u2212","Minimize settings");X.setAttribute("aria-controls","gc-author-controls"),X.setAttribute("aria-expanded","true");let ce=ze("icon-button","\xD7","Close settings");ge.append(X,ce),D.append(M,ge);let R=te("div","controls");R.id="gc-author-controls";let U=te("div","scroll");U.tabIndex=0,U.setAttribute("aria-label","Layout settings");let N=te("label","preset-row"),O=te("select","preset-select");O.setAttribute("aria-label","Layout");for(let l of wt.filter(g=>t.type==="list"||g.id!=="stack")){let g=te("option","",l.name);g.value=l.id,O.append(g)}N.append(te("span","field-label","Layout"),ha(O));let j=te("div","groups"),G=te("div","style-actions"),H=ze("text-button","Copy style"),V=ze("text-button","Paste style");G.append(H,V);let ie=te("div","style-transfer");ie.hidden=!0;let q=te("textarea");q.setAttribute("aria-label","Gallery style"),q.spellcheck=!1;let $=ze("secondary","Apply style"),ae=ze("text-button","Close","Close style transfer"),Y=te("p","field-error","Paste a gallery style created with Copy style.");Y.id="gc-style-error",Y.hidden=!0,Y.setAttribute("role","alert");function ne(){Y.hidden=!0,q.removeAttribute("aria-invalid"),q.removeAttribute("aria-describedby")}q.addEventListener("input",ne),ie.append(q,Y,$,ae),U.append(N,G,ie,j);let ue=te("footer","footer"),re=te("div","export-actions"),le=ze("primary","Save to page"),be=ze("secondary","Copy code"),xe=ze("text-button","Download header backup");xe.hidden=!0;let we=null,K=ze("secondary","View code");K.setAttribute("aria-expanded","false"),K.setAttribute("aria-controls","gc-author-code"),re.append(le,be);let fe=te("div","code-view");fe.id="gc-author-code",fe.hidden=!0;let Q=te("label","code-label","Page Header Code Injection"),Ae=te("textarea");Ae.readOnly=!0,Ae.spellcheck=!1,Ae.setAttribute("aria-label","Page header code"),Q.append(Ae),fe.append(Q);let de=te("div","footer-line"),ke=te("span","status");ke.setAttribute("role","status");let Ce=ze("text-button","Reset preview");de.append(ke,Ce);let Ee=te("div","backup-actions"),ye=ze("text-button","Remove layout");ye.hidden=c()==="Not saved yet",Ee.append(K,xe,ye);let Fe=te("div","removal");Fe.hidden=!0,Fe.append(te("p","","Restore the native "+w.name+" and remove its saved layout from this page?"));let Oe=ze("secondary","Keep layout"),We=ze("secondary","Remove saved layout");Fe.append(Oe,We),ue.append(re,Ee,fe,Fe,de),R.append(U,ue),W.append(D,R),C.append(E,W),document.body.append(v);let ct=cr(v);function Re(l){let{definition:g,input:k,output:A,row:B}=l,I=x[g.key];if(g.when&&(B.hidden=x[g.when[0]]!==g.when[1]),g.condition&&(B.hidden=g.when&&x[g.when[0]]!==g.when[1]||!g.condition(x)),g.type==="palette"){l.refresh?.();for(let P of k.children)P.setAttribute("aria-pressed",String(P.value===I));return}if(g.customFor&&x[g.customFor]!=="custom"){B.hidden=!0;return}if(g.type==="checkbox"){k.checked=!!I;return}if(g.type==="range"){let P=g.key==="spiralRise"&&x.spiralRiseUnit==="percent"?{...g,...g.percent}:g;k.min=String(P.min),k.max=String(P.max),k.step=String(P.step);let J=g.inherits&&I==null;l.enable&&(l.enable.checked=!J,k.disabled=!!J),k.value=String(J?x[g.inherits]:I);let Z=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(P.key)&&P.min===0&&Number(k.value)===0?"Auto":`${k.value}${P.unit||""}`;A.textContent=J?`Inherit \xB7 ${Z}`:Z,k.setAttribute("aria-valuetext",Z);return}k.value=String(I),g.type==="color"&&(g.independent||(B.hidden=x.colorSource==="section"),A.textContent=k.value.toUpperCase())}function it(){_(),S+=1,ke.textContent="",fe.hidden||(Ae.value=n())}function De(l,g){let k=x.spiralRiseUnit,A=u.get(l)?.definition.typography;if(A&&!x[A]&&(x[A]=!0,r(A,!0)),x={...x,[l]:g},l==="spiralRiseUnit"&&k!==g){let P=Math.max(1,x.stageHeight),J=g==="percent"?Math.max(1,Math.min(30,Math.round(x.spiralRise/P*1e3)/10)):Math.max(8,Math.min(280,Math.round(x.spiralRise*P/100)));x.spiralRise=J,r(l,g),r("spiralRise",J),Re(u.get("spiralRise"))}else r(l,g);let B=l.replace(/Swatch$|Opacity$/,""),I=B==="titleColor"?"titlePalette":B==="descriptionColor"?"descriptionCustom":null;if(x.preset==="spiral"&&I){let P=I==="titlePalette"?"custom":!0;x[I]=P,r(I,P)}l==="galleryHeight"&&(Te(),u.get(l).input.focus({preventScroll:!0})),l==="colorSource"?u.forEach(Re):Re(u.get(l));for(let P of u.values())(P.definition.inherits===l||P.definition.when?.[0]===l||P.definition.customFor===l)&&Re(P);x.preset==="spiral"&&(u.forEach(Re),T()),it()}function He(l){let{key:g,label:k,type:A}=l,B=te(l.inherits||A==="palette"?"div":"label",`field field-${A}`);x.preset==="spiral"&&l.when&&B.setAttribute("data-subsetting","");let I=te("span","field-label",k);if(A==="palette"){let Z=te("div","palette-chips"),pe=getComputedStyle(w.root);Z.setAttribute("role","group"),Z.setAttribute("aria-label",k);for(let ve of l.choices){let he=ze("palette-chip",ve.value==="custom"?"+":"",ve.label);he.value=ve.value,he.title=ve.label;let Se=pe.getPropertyValue("--"+ve.value+"-hsl").trim();Se?he.style.backgroundColor="hsl("+Se+")":ve.value!=="custom"&&(he.textContent=ve.label),he.addEventListener("click",()=>De(g,ve.value)),Z.append(he)}B.append(I,Z);let me={definition:l,row:B,input:Z};return u.set(g,me),Re(me),B}let P=te(A==="select"?"select":"input");if(P.setAttribute("aria-label",k),P.dataset.option=g,A==="select")for(let Z of l.choices){let pe=te("option","",Z.label);pe.value=Z.value,P.append(pe)}else P.type=A;let J;(A==="range"||A==="color")&&(J=te("output","value"),J.setAttribute("aria-hidden","true")),B.append(I),J&&B.append(J),B.append(A==="select"?ha(P):P);let se={definition:l,input:P,output:J,row:B};if(l.inherits&&!l.mobileRange){let Z=te("input");Z.type="checkbox",Z.setAttribute("aria-label","Customize "+k.toLowerCase());let pe=te("label","override-toggle");pe.append(Z,I),B.prepend(pe),se.enable=Z,Z.addEventListener("change",()=>De(g,Z.checked?x[l.inherits]:null))}return u.set(g,se),Re(se),P.addEventListener(A==="range"||A==="color"?"input":"change",()=>{let Z=A==="range"||l.numeric?Number(P.value):A==="checkbox"?P.checked:P.value;De(g,Z)}),B}function Te(){let l=new Map([...z].map(([g,k])=>[g,k.open]));p.splice(0).forEach(g=>g()),b.clear(),u.clear(),z.clear(),j.replaceChildren();for(let g of hi(x,w.type)){let k=te("details","group");k.open=l.get(g.title)??["Elements","Size & spacing"].includes(g.title);let A=te("summary","",g.title),B=te("div","group-body"),I=x.preset==="spiral"?{Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[g.title]:null;I&&b.set(k,I);let P;for(let J of g.fields){let se=He(J);if(x.preset==="spiral"&&J.type==="palette"){let Z=J.key.slice(0,-6),pe=te("div","paint-row"),me=ze("paint-trigger","",J.label.replace(/ palette$/,"")),ve=te("span","field-label",J.label.replace(/ palette$/,""));P=te("div","paint-popup"),P.popover="auto",me.popoverTargetElement=P,pe.append(ve,me,P),B.append(pe),P.append(se);let he=()=>{pe.hidden=se.hidden;let St=x[J.key],Ct=getComputedStyle(w.root).getPropertyValue("--"+St+"-hsl");if(me.style.setProperty("--chip",Ct?"hsl("+Ct+")":x[Z]),me.style.setProperty("--alpha",x[Z+"Opacity"]/100),!Se.matches(":popover-open"))return;let Qe=me.getBoundingClientRect(),Mt=Se.offsetWidth,Gt=Se.offsetHeight;Se.style.left=Math.max(8,Math.min(innerWidth-Mt-8,Qe.right-Mt))+"px",Se.style.top=Math.max(8,Math.min(innerHeight-Gt-8,Qe.bottom+Gt+8<=innerHeight?Qe.bottom+4:Qe.top-Gt-4))+"px"},Se=P,ht=new ResizeObserver(he),kt=()=>{ht.disconnect(),window.removeEventListener("scroll",he,!0),window.removeEventListener("resize",he)};p.push(kt),P.addEventListener("toggle",()=>{Se.matches(":popover-open")?(ht.observe(Se),window.addEventListener("scroll",he,!0),window.addEventListener("resize",he),he()):kt()}),u.get(J.key).refresh=he,he()}else P&&(J.customFor||J.key.endsWith("Opacity"))?(P.append(se),J.customFor||(P=null)):(P=null,B.append(se))}k.append(A,B),j.append(k),z.set(g.title,k)}T()}function Ve(l){if(y)return;let g=x.preset;w=l.source??w,l.options&&(x=ma(l.options)),L.textContent=sr(w),L.title=w.selector||L.textContent,O.value=x.preset,!u.size||g!==x.preset?Te():(u.forEach(Re),T()),it()}function Ie(l){fe.hidden=!l,K.textContent=l?"Hide code":"View code",K.setAttribute("aria-expanded",String(l)),l&&(Ae.value=n(),Ae.focus({preventScroll:!0}),Ae.select())}function Ze(){if(y)return;y=!0,S+=1;let l=document.activeElement===v;document.removeEventListener("keydown",Me),p.splice(0).forEach(g=>g()),ct(),v.remove(),l&&m?.isConnected&&m.focus({preventScroll:!0})}function Ge(l){if(!y)try{l()}finally{Ze()}}function Me(l){if(!(l.key!=="Escape"||l.defaultPrevented||l.isComposing)&&!C.querySelector(".paint-popup:popover-open")){if(!Fe.hidden){l.preventDefault(),$e(!1);return}document.querySelector("dialog[open]")||l.composedPath().some(g=>g?.getAttribute?.("aria-modal")==="true")||(l.preventDefault(),!ie.hidden&&(ie.contains(C.activeElement)||fe.hidden)?(ie.hidden=!0,(q.readOnly?H:V).focus()):fe.hidden?Ge(o):(Ie(!1),K.focus()))}}X.addEventListener("click",()=>{d=!d,R.hidden=d,v.toggleAttribute("data-minimized",d),X.textContent=d?"+":"\u2212",X.setAttribute("aria-expanded",String(!d)),X.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),ce.addEventListener("click",()=>Ge(o)),Ce.addEventListener("click",()=>Ge(i)),O.addEventListener("change",()=>a(O.value)),K.addEventListener("click",()=>Ie(fe.hidden));function Ue(l,g){ne(),ie.hidden=!1,$.hidden=l,q.readOnly=l,q.value=g,q.placeholder=l?"":"Paste the copied gallery style",q.focus(),l&&q.select()}H.addEventListener("click",async()=>{let l=h();try{await navigator.clipboard.writeText(l),y||(ie.hidden=!0,ke.textContent="Style copied")}catch{if(y)return;Ue(!0,l),ke.textContent="Style selected. Choose Copy."}}),V.addEventListener("click",()=>{ke.textContent="",Ue(!1,"")}),ae.addEventListener("click",()=>{ie.hidden=!0,(q.readOnly?H:V).focus()}),$.addEventListener("click",()=>{if(!f(q.value)){Y.hidden=!1,q.setAttribute("aria-invalid","true"),q.setAttribute("aria-describedby",Y.id),q.focus();return}ie.hidden=!0,ke.textContent="Style applied to this preview",V.focus()}),xe.addEventListener("click",()=>{if(!we)return;let l=URL.createObjectURL(new Blob([we.header],{type:"text/plain"})),g=document.createElement("a");g.href=l,g.download="gallery-header-backup-"+we.collectionId+".txt",g.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)});async function Be(l=!1){if(l&&$e(!1),!le.disabled){le.disabled=Ce.disabled=ye.disabled=!0,U.inert=!0,le.textContent="Saving\u2026",_(l?"Removing\u2026":"Saving\u2026"),ke.textContent=l?"Removing layout\u2026":"Saving to page header\u2026";try{await s(g=>{we=g,y||(xe.hidden=!1)},l),y||(ke.textContent="Saved to page header")}catch(g){y||(ke.textContent=g.message||"Save failed. Copy code is still available.")}finally{y||(le.disabled=Ce.disabled=ye.disabled=!1,ye.hidden=c()==="Not saved yet",U.inert=!1,le.textContent="Save to page",_())}}}le.addEventListener("click",()=>Be());function $e(l){Fe.hidden=!l,U.inert=l,re.hidden=Ee.hidden=de.hidden=l,l?(Ie(!1),Oe.focus()):ye.focus()}return ye.addEventListener("click",()=>$e(!0)),Oe.addEventListener("click",()=>$e(!1)),We.addEventListener("click",()=>Be(!0)),be.addEventListener("click",async()=>{let l=++S,g=n();try{await navigator.clipboard.writeText(g),!y&&l===S&&(ke.textContent="Page code copied")}catch{if(y||l!==S)return;Ie(!0),ke.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Me),Ve({source:t,options:e}),O.focus({preventScroll:!0}),{element:v,update:Ve,destroy:Ze}}var nr,ba=ee(()=>{Et();Yt();ui();ga();nr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var va,ya=ee(()=>{va=`.gc-config-position{position:relative!important}
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
`});var Sa={};fi(Sa,{startInline:()=>mi});function ut(t,e={}){let a=$t.get(t),r={...nt,...t==="spiral"?Xe:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:a.width,stageHeight:tt(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[o,i]of Object.entries(e))o.startsWith("mobile")&&r[o]===null?Number.isFinite(i)&&i>=0&&(r[o]=i):o!=="preset"&&Object.hasOwn(r,o)&&typeof i==typeof r[o]&&(r[o]=i);return t==="spiral"&&("mobileSizing"in e||(r.mobileSizing=r.mobileGap!=null||r.mobileCardWidth!=null),"titleCustom"in e||(r.titleCustom=!!(r.titleSize||r.titlePalette==="custom"||r.titleWeight!=="inherit")),"bodyCustom"in e||(r.bodyCustom=!!(r.descriptionCustom||r.descriptionSize)),"overlayEnabled"in e||(r.overlayEnabled=r.imageTintOpacity>0),"cardBorderEnabled"in e||(r.cardBorderEnabled=r.borderWidth>0)),r}function ka(t){return hi(t).flatMap(e=>e.typography?[...e.fields,{key:e.typography,type:"checkbox"}]:e.fields).filter(e=>!wa.has(e.key))}function dr(t){let e=Object.fromEntries(ka(t).map(({key:a})=>[a,t[a]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function pr(t,e){let a;try{a=JSON.parse(t)}catch{return null}if(a?.format!=="gallery-studio-style"||a.version!==1||!$t.has(a.preset)||!a.values||typeof a.values!="object"||Array.isArray(a.values))return null;let r=ut(a.preset);for(let o of wa)r[o]=e[o];for(let o of ka(r)){let i=a.values[o.key];if(i!==void 0){if(o.type==="range"){if(o.inherits&&i===null)continue;let s=o.percent&&a.values.spiralRiseUnit==="percent"?o.percent:o;if(!Number.isFinite(i)||i<s.min||i>s.max)return null}else{if(o.type==="checkbox"&&typeof i!="boolean")return null;if(["select","palette"].includes(o.type)&&!o.choices.some(s=>s.value===i))return null}if(o.type==="color"&&!/^#[0-9a-f]{6}$/i.test(i))return null;r[o.key]=i}}return r}function gr(t){return ut(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function Ot(t,e){let a=ut(e.preset),r={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};if(e.preset==="spiral")for(let i of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])r[i]=e[i];tt(e.preset)&&(r.stageHeight=e.stageHeight);for(let i of Object.keys(a))e.colorSource==="section"&&xa.has(i)||e[i]!==a[i]&&(r[i]=e[i]);let o={v:1,selector:t.selector,type:t.type,options:r};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(o,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function mi(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let a=Wo(),r=new Map(a.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),o=null,i=null,s=null,c=!1,n=[];function h(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=gi({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function f(d=!0){if(!i)return;let y=i;i=null,o?.destroy(),o=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function m(d){f(),d.presets.clear(),d.installed?h(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function w(d){if(i===d){f();return}f(!1);let{source:y}=d;if(d.mounted||(y.items=pt(y.root,y.type)),!y.items.length){let p="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=p,d.button.setAttribute("aria-label",p);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+y.name+" layout");let S=d.options||d.installed||ut("arc-tabs",y.type!=="list"?{galleryWidth:"source"}:{});if(y.type!=="list"&&S.preset==="stack"&&(S=ut("arc-tabs",{galleryWidth:"source"}),h(d,S)),!d.mounted&&!h(d,S)){d.button.textContent="No supported layout here";return}i=d;let u=p=>{h(d,p),d.presets.set(p.preset,{...p})};o=fa({source:y,options:{...d.options},onClose:()=>f(),onRestore:()=>m(d),onPreset:p=>{!$t.has(p)||y.type!=="list"&&p==="stack"||(d.presets.set(d.options.preset,{...d.options}),u({...d.presets.get(p)||ut(p),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),o.update({source:y,options:{...d.options}}))},onOption:(p,b)=>{if(!Object.hasOwn(d.options,p)||p==="preset")return;let T={...d.options,[p]:b};u(T)},getSaveState:()=>d.installed?Ot(y,d.options)===Ot(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Ot(y,d.options),onSave:async(p,b=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let T={...d.options},z=vi();c=!0;try{await xi({snippet:Ot(y,T),context:z,onBackup:p,remove:b}),b?(d.installed=null,i===d?m(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=T}finally{c=!1}},getStyle:()=>dr(d.options),applyStyle:p=>{let b=pr(p,d.options);return!b||y.type!=="list"&&b.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),u(b),o.update({source:y,options:d.options}),!0)}}),o.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),S=document.querySelectorAll(y.selector),u=S.length===1&&r.get(S[0]);if(!u||y.v!==1||y.type!==u.source.type||!$t.has(y.options?.preset))continue;u.installed=gr(y.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of r.values())d.installed&&h(d,d.installed);if(t&&r.size){let y=function(p=!1){d.setAttribute("aria-pressed",String(p)),d.querySelector("span").textContent=p?"Edit native content":"Preview galleries",d.hidden=!gt()||![...r.values()].some(b=>b.mounted)},S=function(p){if(!p.mounted||p.source.root.isConnected)return;let b=p.source.root,T=document.querySelectorAll(p.source.selector);if(T.length!==1)return;let z=T[0];p.mounted.destroy(),p.mounted=null,p.source.root=z,r.delete(b),r.set(z,p),h(p,p.options);let v=z.querySelector(p.source.type==="list"?".user-items-list":".sqs-block-content")||z;p.button&&(getComputedStyle(v).position==="static"&&v.classList.add("gc-config-position"),v.append(p.button))};s=document.createElement("style"),s.textContent=va,document.head.append(s);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let p=d.getAttribute("aria-pressed")!=="true";for(let b of[...r.values()])S(b),b.mounted?.instance.setEditPreview(p);y(p)},document.body.append(d),y();let u=pi(p=>{p||requestAnimationFrame(()=>{if(d.isConnected)for(let b of[...r.values()])S(b)}),y()});n.push(()=>{u(),d.remove()});for(let p of r.values()){let{source:b}=p;if(!b.selector)continue;let T=b.root.querySelector(b.type==="list"?".user-items-list":".sqs-block-content")||b.root,z=getComputedStyle(T).position==="static";z&&T.classList.add("gc-config-position");let v=document.createElement("button");v.type="button",v.className="gc-config-launch",v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","Configure "+b.name+" layout"),v.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',v.addEventListener("click",()=>w(p)),T.append(v),p.button=v,n.push(()=>{v.remove(),z&&T.classList.remove("gc-config-position")})}}let x={version:1,destroy(){f(!1);for(let d of r.values())d.mounted?.destroy();for(let d of n)d();s?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=x,x}var $t,xa,wa,Ca=ee(()=>{wi();ui();ci();ba();ya();$t=new Map(wt.map(t=>[t.id,t])),xa=new Set(["background","ink","accent","borderColor","overlayColor"]);wa=new Set([...xa,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mi,{once:!0}):mi()});var ur;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(ur=(await Promise.resolve().then(()=>(Ca(),Sa))).startInline);export{ur as startInline};

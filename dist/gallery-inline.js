var wa=Object.defineProperty;var te=(t,e)=>()=>(t&&(e=t(t=0)),e);var mi=(t,e)=>{for(var r in e)wa(t,r,{get:e[r],enumerable:!0})};function bi(t,e){if(t===void 0)return null;let r=new Map([...t.matchAll(ka)].map(i=>[i[1].toLowerCase(),i[2]??i[3]??i[4]??""]));if(!r.has("data-gallery-layout"))return null;if(r.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let n;try{n=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(n?.v!==1||typeof n.selector!="string"||!["list","gallery","summary"].includes(n.type)||!n.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return n}function Sa(t,e,r=!1){let n=[...e.matchAll(fi)];if(n.length!==1||n[0][0]!==e.trim())throw Error("Invalid gallery settings.");let i=bi(n[0][1],n[0][2]);if(!i)throw Error("Missing gallery settings.");let o=!1,c=t.replace(fi,(s,a,h)=>{let f=bi(a,h);return!f||f.selector!==i.selector?s:r||o?"":(o=!0,e)});return r||o?c:c+(c&&!c.endsWith(`
`)?`
`:"")+e+`
`}function yi(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,r=e?.collection?.id,n=e?.website?.id,i=t.document.cookie.split(";").map(o=>o.trim()).find(o=>o.startsWith("crumb="))?.slice(6);if(!Mt.test(r||"")||!Mt.test(n||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!i)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:r,websiteId:n,crumb:decodeURIComponent(i)}}async function vi({snippet:t,context:e,remove:r=!1,fetchImpl:n=fetch,onBackup:i=()=>{}}){let{collectionId:o,websiteId:c,crumb:s}=e;if(!Mt.test(o||"")||!Mt.test(c||"")||!s)throw Error("A signed-in Squarespace page is required.");async function a(){let y=await n("/api/commondata/GetCollectionSettings?collectionId="+o,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let S=await y.json(),u=S.collectionData??S;if(u?.id!==o||u.websiteId!==c||u.deleted===!0||u.folder===!0||u.dropdown===!0)throw Error("Page settings do not match this page.");if(u.headerInjectCode!=null&&typeof u.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:u,memberAreaData:S.memberAreaData??{}}}let h=await a();if(h.model.passwordProtected&&typeof h.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let f=h.model.headerInjectCode??"",m=Sa(f,t,r);if(m===f)return{unchanged:!0};i({collectionId:o,header:f,savedAt:new Date().toISOString()});let w=await a();if(JSON.stringify(w)!==JSON.stringify(h))throw Error("Page settings changed while saving. Review the page and save again.");let x;try{x=await n("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":s},body:JSON.stringify({collectionData:{...w.model,collectionId:o,headerInjectCode:m},memberAreaData:w.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!x.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await a()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==m.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var Mt,fi,ka,xi=te(()=>{Mt=/^[a-f0-9]{24}$/i,fi=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,ka=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function Si(t,e,{range:r,select:n,swatch:i},o){let c=(u,g)=>({key:u,label:g,type:"checkbox"}),s=(u,g,b,I,j="px",v=1)=>r(u,g,b,I,v,j),a=(u,g,b)=>b.map(I=>({...I,when:[u,g]})),h=(u,...g)=>({title:u,fields:g.flat()}),f=u=>o.flatMap(g=>g.fields).find(g=>g.key===u),m=e!=="gallery",w={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(u,g)=>[100*(g+1),String(100*(g+1))]))},x={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function d(u,g,b,I,j,v){return{...h(u,s(b,"Size",0,4,"rem",.05),n(I,"Weight",w),i(j,"Color"),n(v,"Alignment",x)),switchKey:g}}function y(u,g,b,I){return[c(u,g),...a(u,!0,[s(b+"Angle","Angle",0,360,"\xB0"),s(b+"Distance","Distance",0,48),s(b+"Blur","Blur",0,40),s(b+"Spread","Spread",0,16),i(I,"Color")])]}let S=(u,g)=>({...f(g),key:u,label:"Mobile "+f(g).label.toLowerCase(),inherits:g});return[h("Elements",c("showImage","Show image"),c("showTitles","Show title"),...m?[c("showDescription","Show description"),c("showButton","Show button")]:[],c("showControls","Show controls")),h("Main carousel",...m?[n("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...a("heightMode","pixels",[s("stageHeight","Height",120,1600)]),...a("heightMode","viewport",[s("viewportHeight","Window height",15,100,"%")])]:[],s("carouselPadding","Carousel padding",0,64),f("spiralWidth"),c("surfaceEnabled","Background"),...a("surfaceEnabled",!0,[i("surfaceColor","Color"),s("surfaceRadius","Corner radius",0,64)]),n("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),f("edgeFade"),f("spiralGap"),c("autoplay","Autoplay"),...a("autoplay",!0,[n("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),n("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...s("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:u=>u.playbackMode==="continuous"},{...s("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:u=>u.playbackMode==="step"}),h("Spiral",f("spiralRiseUnit"),{...f("spiralRise"),label:"Rise"},n("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),f("showSlots")),h("Image",n("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(u=>[u,u==="original"?"Original":u==="circle"?"Circle":u]))),n("fit","Image sizing",{cover:"Fill",contain:"Fit"}),s("imageWidth","Image width",20,100,"%"),n("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),f("imagePadding"),c("imageBorder","Image border"),...a("imageBorder",!0,[i("imageBorderColor","Color"),s("imageBorderSize","Thickness",0,12),s("imageRadius","Corner radius",0,64)]),y("shadowEnabled","Image shadow","shadow","shadowColor"),c("overlayEnabled","Overlay"),...a("overlayEnabled",!0,[i("imageTint","Color")])),d("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...m?[d("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],h("Card",f("cardWidth"),n("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),n("cardOrder","Element order",{media:"Media first",content:"Content first"}),s("cardPadding","Card padding",0,80),s("mediaGap","Space between image and text",0,80),s("titleGap","Space below title",0,80),...m?[s("buttonGap","Space above button",0,80)]:[],n("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),c("cardBackground","Background"),...a("cardBackground",!0,[i("cardColor","Color")]),c("cardBorderEnabled","Card border"),...a("cardBorderEnabled",!0,[i("spiralRim","Color"),f("borderWidth")]),f("spiralRadius"),y("cardShadow","Card shadow","cardShadow","cardShadowColor"),f("backFace"),f("backColor"),...a("backFace","mirror",[c("mirrorOverlay","Mirrored image overlay")]),{...i("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:u=>u.backFace==="mirror"}),h("Interaction",c("pauseOnHover","Pause on hover"),f("hoverEffect"),f("hoverAmount"),s("hoverDuration","Hover duration",0,1e3,"ms",10),n("clickAction","Card click",{source:m?"Button only":"Image link only",link:m?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),f("reducedMotion")),h("Control styling",f("controlSize"),s("controlIconSize","Icon size",0,60),s("controlPadding","Button padding",0,32),f("controlShape"),f("arrowStyle"),c("controlBackground","Button background"),f("controlPalette"),f("controlInk"),f("controlFill")),h("Mobile",c("mobileSizing","Customize mobile sizing"),S("mobileCardWidth","cardWidth"),S("mobileGap","spiralGap"),{...s("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...s("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},S("mobileSpiralWidth","spiralWidth"),...m?[n("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...s("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...s("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),h("Theme",n("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...a("colorSource","custom",[i("background","Background"),i("ink","Text"),i("accent","Accent")]),n("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),o.find(u=>u.title==="Popup")]}var wi,ki,At=te(()=>{wi={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},ki=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function Ci({range:t,swatch:e,select:r}){let n=(i,o)=>({key:i,label:o,type:"checkbox"});return[{title:"Card content",fields:[n("showImage","Show image"),n("showTitles","Show title"),n("showDescription","Show description"),n("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),n("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),n("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(i=>({...i,when:["shadowEnabled",!0]})),r("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[n("popupImage","Show popup image"),n("popupTitle","Show popup title"),n("popupDescription","Show popup description"),n("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),n("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function _t(t,e){if(!Gt.has(e.preset))return e;let r={...e},n=getComputedStyle(t),i;for(let o of Pt){let c=e[o+"Swatch"],s=e[o];if(Object.hasOwn(Ut,c)){let h=n.getPropertyValue("--"+c+"-hsl").trim();h&&(i??=document.createElement("canvas").getContext("2d"),i&&(i.fillStyle=s,i.fillStyle="hsl("+h+")",s=i.fillStyle))}let a=Math.round((e[o+"Opacity"]??100)*2.55);r[o]=a===255?s:s+a.toString(16).padStart(2,"0")}return r}var Gt,Ut,Pt,Et,Xt=te(()=>{At();Gt=new Set(["spiral"]),Ut={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},Pt=[...ki,"titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],Et={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of Pt)Et[t+"Swatch"]="custom",Et[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function Mi(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let r=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches("script,style,template,noscript,iframe,form,svg"))return r;let n=t.localName,i=Ca.has(n)?document.createElement(n):r;if(n==="a"||n==="img"){let o=n==="img"?"src":"href",c=n==="img"?t.dataset.src||t.getAttribute("src"):t.getAttribute("href"),s=c&&URL.canParse(c,e)?new URL(c,e):null;s&&["https:","http:"].includes(s.protocol)&&i.setAttribute(o,s.href),n==="img"&&(i.alt=t.alt,i.loading="lazy")}for(let o of t.childNodes)i.append(Mi(o,e));return i}async function Ai(t,e){t.textContent="Loading post\u2026";try{let r=new URL(e.postUrl);if(r.origin!==location.origin)throw Error();let n=await fetch(r,{mode:"same-origin"});if(!n.ok)throw Error();let o=new DOMParser().parseFromString(await n.text(),"text/html").querySelector(".blog-item-content,article .entry-content,article .body");if(!o)throw Error();t.replaceChildren(Mi(o,n.url))}catch{t.textContent="Open the full post using the link below."}}var Ca,Ei=te(()=>{Ca=new Set("p h1 h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" "))});function Yt(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],r=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Ma[t]}${r}</svg>`}function _e(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Yt("play")+Yt("pause"):Yt(e),t}var Ma,Lt=te(()=>{Ma={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Fe(t,e,r){let n=document.createElement(t);return n.className=e,r!==void 0&&(n.textContent=r),n}function lt(t,e,r){let n=Fe("button",t,r);return n.type="button",n.setAttribute("aria-label",e),n}function Ea(t,e,r,n,i,o){let c=r/2,s=n/2,a=.26,h=e/2+48,f=(r*Math.cos(a)+o)/(2*Math.sin(a)),m=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-i)*.7),r*(3.8-i*2.1),s+Math.max(f,h/Math.sin(Math.PI/3))),w=m-s,x=Math.atan2(c,w),d=Math.hypot(c,w),y=2*(x+Math.asin(o/(2*d))),S=x+Math.asin(h/d),u=m+s,g=Math.hypot(u,c)-u,b=w-Math.sqrt((w-h)*(w+h));return{radius:m,step:y,reach:S/y,above:g,below:b}}function Pa(t,e,r){let n=e/2,i=10+r*9,o=0,c=0;for(let s=0;s<4.1;s+=.5){let a=Math.min(4.1,s+.5),h=Math.max(.48,1-s*(.09+r*.035)),f=(a*(4+r*7)+(s===0?4:0))*Math.PI/180,m=h*(n+t/2*Math.sin(f))-n;o=Math.max(o,m-Math.min(s,4)*i),c=Math.max(c,m+Math.min(a,4)*i)}return{above:o,below:c}}function Pi({host:t,items:e=[],initialIndex:r=0,options:n={},makeCard:i,onChange:o,nativeList:c,loadImage:s}){let a=Aa.has(n.preset)?n.preset:"infinite",h=a==="arc"||a==="arc-tabs",f=h||a==="showcase",m=e.length,w=!!n.reducedMotion,x=He(at(n.depth,55),0,100)/100,d,y,S;function u(l){d=He(at(l.gap,24),0,180),y=He(at(l.cardWidth,a==="timed"?760:380),80,1800),S=l.phoneWidthOverride}u(n);let g=He(at(n.duration,5),1,60)*1e3,b=Fe("section",`gc-carousel gc-preset-${a}`);b.setAttribute("aria-roledescription","carousel"),b.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[a]),b.style.setProperty("--gc-card-radius",`${He(at(n.radius,14),0,120)}px`),b.style.setProperty("--gc-stage-height",`${He(at(n.stageHeight,0),0,1400)}px`),w&&b.classList.add("gc-reduced-motion");let I=[],j=(l,p,k,A)=>{l.addEventListener(p,k,A),I.push(()=>l.removeEventListener(p,k,A))},v=[],C=[],E=n.navigation==="dots"||n.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),W=a==="arc-tabs"||a==="timed"&&!E,D=Fe("nav","gc-carousel-tabs");E&&D.classList.add("gc-choice-dots"),D.setAttribute("aria-label","Choose a slide"),W&&(e.forEach((l,p)=>{let A=(typeof l.title=="string"?l.title.trim():"")||`Slide ${p+1}`,B=E?lt("gc-choice-dot",A):lt("gc-carousel-tab",A,A);j(B,"click",()=>Ie(p)),j(B,"keydown",P=>{let T;P.key==="ArrowRight"&&(T=ot(p+1,m)),P.key==="ArrowLeft"&&(T=ot(p-1,m)),P.key==="Home"&&(T=0),P.key==="End"&&(T=m-1),T!==void 0&&(P.preventDefault(),Ie(T),v[T]?.focus({preventScroll:!0}))}),D.append(B),v.push(B)}),b.append(D));let M=Fe("div","gc-carousel-stage");M.tabIndex=m?0:-1,M.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let R=c?.track??Fe("div","gc-carousel-track");R.classList.add("gc-carousel-track"),M.append(R),b.append(M);function L(l){let p=i(e[l],l,{caption:n.showTitles!==!1,description:a==="arc-tabs"||a==="timed"});p.classList.add("gc-carousel-card"),p.dataset.gcItemIndex=String(l),p.style.width="var(--gc-carousel-slot-width)",p.tabIndex=-1,p.setAttribute("aria-hidden","true"),c||p.querySelectorAll("img").forEach(A=>{A.draggable=!1,A.style.objectFit=n.fit==="contain"?"contain":"cover"});let k=c?.slot(p)??p;return R.append(k),{card:p,node:k,index:l,logical:l,active:!1}}let oe=e.map((l,p)=>L(p)),_=new Map,ge=!1,X=Fe("div","gc-carousel-controls"),ce=Fe("div","gc-carousel-counter");ce.setAttribute("aria-hidden","true");let q=Fe("span","gc-carousel-current",m?"01":"00");ce.append(q,Fe("span","gc-carousel-divider","/"),Fe("span","gc-carousel-total",String(m).padStart(2,"0")));let U=Fe("div","gc-carousel-arrows"),N=_e(lt("gc-carousel-arrow","Previous slide"),"previous"),O=_e(lt("gc-carousel-arrow","Next slide"),"next");N.disabled=O.disabled=m<2,U.append(N,O);let z=_e(lt("gc-carousel-playback","Play slideshow"),"playback");z.hidden=m<2||w;let G=Fe("div","gc-carousel-pagination");G.setAttribute("aria-label","Slide pagination"),a==="timed"&&e.forEach((l,p)=>{let k=lt("gc-carousel-dot",l.title?.trim()||`Go to slide ${p+1}`),A=Fe("span","gc-carousel-dot-fill");A.setAttribute("aria-hidden","true"),k.append(A),j(k,"click",()=>Ie(p)),G.append(k),C.push({dot:k,fill:A})}),X.append(ce,U),a==="timed"&&X.append(G),X.append(z),b.append(X);let H=Fe("p","gc-carousel-sr");H.setAttribute("aria-atomic","true"),b.append(H);let K=Fe("span","gc-carousel-cursor","Drag");K.setAttribute("aria-hidden","true"),(a==="arc-tabs"||a==="showcase"||a==="arc")&&M.append(K),t.append(b);let ie=!1,F=r,$=r,ae=-1,Y=0,se=0,ue=0,re=!!n.autoplay&&!w&&m>1,le=!1,be=!1,xe=!1,we=!1,J=null,fe=0,ee=0,Ae=0,de=0,ke=()=>Math.max(12,de*(.36-x*.12)+d-28),Ce=-1,Ee,ye=1,Re=0,Oe=0,We=()=>we||le||be||xe||document.hidden||!!J,ct=l=>{let p=ot(Math.round(F),m),k=ot(l-p,m);return k>m/2&&(k-=m),Math.round(F)+k};function qe(){let l=v[ae];if(!l)return;let p=l.offsetLeft,k=p+l.offsetWidth;p<D.scrollLeft?D.scrollLeft=Math.max(0,p-14):k>D.scrollLeft+D.clientWidth&&(D.scrollLeft=k-D.clientWidth+14)}function it(){let l=m?ot(Math.round(F),m):-1;if(l===ae)return;ae=l,q.textContent=m?String(l+1).padStart(2,"0"):"00",v.forEach((k,A)=>{k.classList.toggle("is-active",A===l),k.setAttribute("aria-pressed",String(A===l))}),qe(),C.forEach(({dot:k},A)=>{k.classList.toggle("is-active",A===l),A===l?k.setAttribute("aria-current","true"):k.removeAttribute("aria-current")});let p=e[l]?.title;H.textContent=m?`${l+1} of ${m}${p?`: ${p}`:""}`:"No gallery items",l>=0&&o?.(l)}function De(){if(ie||!ee)return;it();let l=Math.abs($-F)>.002;b.classList.toggle("is-moving",l||!!J);let p=[...oe];for(let k of oe)k.logical=k.index+Math.round((F-k.index)/m)*m;if(m>1){let k=de+d,A=a==="infinite"&&ee>660?ee*.61:ee/2,B=(A+de/2+40)/k,P=(ee-A+de/2+40)/k;h?B=P=Ee.reach:a==="showcase"&&(B=P=Math.min(4.1,(ee/2+de)/ke()));let T=Math.ceil(F-B),V=Math.floor(F+P);for(let[ne,Z]of _)(ne<T||ne>V||oe[Z.index].logical===ne)&&(Z.node.remove(),_.delete(ne));for(let ne=T;ne<=V;ne++){let Z=ot(ne,m);if(oe[Z].logical===ne)continue;let pe=_.get(ne);pe||(pe=L(Z),pe.logical=ne,_.set(ne,pe),ge&&s&&pe.card.querySelectorAll("img").forEach(me=>s(me,{nativeCard:!!c}))),p.push(pe)}}p.forEach(k=>{let A=m===1?0:k.logical-F,B=Math.abs(A),P=k.logical===Math.round(F),T=ee/2,V=0,ne=0,Z=1,pe=1,me=!0,ve=0,he=0;if(a==="infinite")T=(ee>660?ee*.61:ee/2)+A*(de+d),pe=1-Math.min(1,B)*.68,me=T+de/2>-40&&T-de/2<ee+40;else if(a==="timed")T+=A*(de+d),Z=1-Math.min(B,1)*.035,me=T+de/2>-40&&T-de/2<ee+40;else if(a==="showcase")T+=A*ke(),V+=Math.min(B,4)*(10+x*9),Z=Math.max(.48,1-B*(.09+x*.035)),ne=A*(4+x*7),he=-A*(3+x*4),pe=He(1-B*.19,0,1),me=B<4.1,P&&!w&&(ve=Oe,he+=Re,ne+=He($-F,-1,1)*-3);else{let Se=A*Ee.step;T+=Ee.radius*Math.sin(Se),V=Ee.radius*(1-Math.cos(Se)),ne=Se*180/Math.PI,me=B<=Ee.reach,pe=a==="arc-tabs"?1-Math.min(B,1)*.16:1}k.card.style.transform=`translate3d(${T}px,${V}px,0) translateX(-50%) rotate(${ne}deg) rotateX(${ve}deg) rotateY(${he}deg) scale(${Z})`,k.card.style.zIndex=String(1e3-Math.round(B*100)),k.card.style.opacity=String(pe),k.card.style.visibility=me?"visible":"hidden",k.card.style.pointerEvents=me&&pe>.08?"auto":"none",k.active!==P&&(k.active=P,k.card.classList.toggle("is-active",P)),k.card.tabIndex=P?0:-1,k.card.setAttribute("aria-hidden",String(!P)),c?.syncFocus(k.card)}),C.forEach(({fill:k},A)=>{k.style.transform=`scaleX(${A===ae?He(ue/g,0,1):0})`})}function Ne(){let l=ee;ee=M.clientWidth;let p=S?1:a==="timed"?.86:a==="infinite"&&ee>660?.48:.76,k=Math.max(80,Math.min(y,ee*p));if(k!==de&&(de=k,R.style.setProperty("--gc-carousel-slot-width",`${de}px`)),f){let A=R.offsetHeight;if(ee!==l||A!==Ce){Ce=A,h&&(Ee=Ea(a,ee,de,Ce,x,d));let B=Ee??Pa(de,Ce,x);m>1&&(M.style.setProperty("--gc-sweep-above",Math.ceil(B.above)+"px"),M.style.setProperty("--gc-sweep-below",Math.ceil(B.below)+"px"))}}Ae=M.clientHeight,ye=h?Ee.radius*Ee.step:a==="showcase"?de*.54:de+d,De()}function Te(){!ie&&!Y&&(Y=requestAnimationFrame(Ve))}function Ve(l){if(Y=0,ie)return;let p=se?He(l-se,0,64):0;se=l,J||(w?F=$:F+=($-F)*(1-Math.exp(-p/85)),Math.abs($-F)<5e-4&&(F=$));let k=Math.abs($-F)<.002&&!J;re&&!We()&&k&&(ue+=p,ue>=g&&(ue=0,$=Math.round(F)+1)),De(),Math.abs($-F)>5e-4||re&&!We()?Te():se=0}function Ie(l){ie||m<2||($=ct(ot(Math.round(at(l,0)),m)),ue=0,w&&(F=$),De(),Te())}function Ze(l){m<2||($=Math.round($)+l,ue=0,w&&(F=$),De(),Te())}function Ge(l){re=!!l&&!w&&m>1,z.dataset.paused=String(!re),z.setAttribute("aria-label",re?"Pause slideshow":"Play slideshow"),z.setAttribute("aria-pressed",String(re)),H.setAttribute("aria-live",re?"off":"polite"),b.classList.toggle("is-playing",re),se=0,Te()}function Me(l){we=!!l,se=0,Te()}j(N,"click",()=>Ze(-1)),j(O,"click",()=>Ze(1)),j(z,"click",()=>Ge(!re)),j(M,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),M.focus({preventScroll:!0}),Ze(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),M.focus({preventScroll:!0}),Ie(l.key==="Home"?0:m-1))}),j(M,"pointerdown",l=>{m<2||l.button!==0||!l.isPrimary||(J={id:l.pointerId,x:l.clientX,y:l.clientY,start:F,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},$=F,ue=0)}),j(M,"pointermove",l=>{let p=M.getBoundingClientRect(),k=p.width/Math.max(1,M.clientWidth)||1,A=(l.clientX-p.left)/k,B=(l.clientY-p.top)/k;if(K.style.left=`${A}px`,K.style.top=`${B}px`,l.pointerType==="mouse"&&M.classList.add("has-pointer"),!J){a==="showcase"&&!w&&(Re=He((A-ee/2)/de,-1,1)*4,Oe=He((B-Ae/2)/Ae,-.5,.5)*-5,De());return}if(l.pointerId!==J.id)return;let P=l.clientX-J.x,T=l.clientY-J.y;if(!J.axis&&Math.hypot(P,T)>6&&(J.axis=Math.abs(P)>Math.abs(T)?"horizontal":"vertical",J.axis==="horizontal"&&(M.setPointerCapture(l.pointerId),M.classList.add("is-dragging"))),J.axis!=="horizontal")return;l.preventDefault(),J.moved=!0;let V=performance.now(),ne=Math.max(8,V-J.lastTime),Z=-(l.clientX-J.lastX)/k/ye/ne;J.velocity=J.velocity*.45+Z*.55,J.lastX=l.clientX,J.lastTime=V,F=J.start-P/k/ye,$=F,De()},{passive:!1});function Ue(l){if(!J||l.pointerId!==J.id)return;let p=J;if(J=null,M.hasPointerCapture(l.pointerId)&&M.releasePointerCapture(l.pointerId),M.classList.remove("is-dragging"),p.moved){fe=performance.now()+400;let k=performance.now()-p.lastTime,A=w||l.type==="pointercancel"||k>120?0:He(p.velocity*210,-4,4);$=Math.round(F+A)}else $=Math.round(F);w&&(F=$),Te()}j(M,"pointerup",Ue),j(M,"pointercancel",Ue),j(window,"pointerup",Ue),j(M,"lostpointercapture",l=>{J?.id===l.pointerId&&Ue(l)}),j(M,"dragstart",l=>l.preventDefault()),j(M,"click",l=>{if(performance.now()<fe){l.preventDefault(),l.stopImmediatePropagation();return}let p=l.target.closest(".gc-carousel-card");!p||!M.contains(p)||p.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Ie(Number(p.dataset.gcItemIndex)))},!0),j(M,"pointerleave",()=>{M.classList.remove("has-pointer"),Re=Oe=0,J||De()}),j(b,"pointerenter",l=>{l.pointerType==="mouse"&&(le=!0)}),j(b,"pointerleave",()=>{le=!1,se=0,Te()}),j(b,"focusin",()=>{be=!0}),j(b,"focusout",()=>{queueMicrotask(()=>{ie||(be=b.contains(document.activeElement),se=0,Te())})}),j(document,"visibilitychange",()=>{se=0,Te()});let Be;typeof ResizeObserver<"u"?(Be=new ResizeObserver(l=>{l.some(({target:p})=>p===M||p===R)&&Ne(),W&&l.some(({target:p})=>p!==M&&p!==R)&&qe()}),Be.observe(M),f&&Be.observe(R),W&&(Be.observe(D),v.forEach(l=>Be.observe(l,{box:"border-box"})))):j(window,"resize",()=>{Ne(),qe()});let $e;return typeof IntersectionObserver<"u"&&($e=new IntersectionObserver(l=>{xe=!l[0]?.isIntersecting,se=0,Te()}),$e.observe(b)),Ne(),ge=!0,Ge(re),{goTo:Ie,setGeometry(l){u(l),Ce=-1,Ne()},setPlaying:Ge,setSuspended:Me,destroy(){ie=!0,cancelAnimationFrame(Y),Be?.disconnect(),$e?.disconnect(),I.forEach(l=>l()),b.remove()}}}var Aa,He,ot,at,Li=te(()=>{Lt();Aa=new Set(["infinite","arc","arc-tabs","showcase","timed"]),He=(t,e,r)=>Math.min(r,Math.max(e,t)),ot=(t,e)=>(t%e+e)%e,at=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function zi(t){let{host:e,makeCard:r,nativeList:n}=t,i=Array.isArray(t.items)?t.items:[],o=t.options||{},c=["wall","ring","angled"].includes(o.preset)?o.preset:"wall",s=!!o.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=i.length,h=c==="ring"?16:c==="wall"?12:a,f=!s&&a>1&&a<12&&c!=="angled"?Math.ceil(h/a)*a:a,m=Array.from({length:a},(l,p)=>p),w=Ke(et(o.depth,55),0,100),x=Ke(et(o.cardWidth,280),80,900),d=Ke(et(o.gap,24),0,160),y=Math.max(1,et(o.duration,5)),S=new AbortController,u=(l,p,k,A={})=>l.addEventListener(p,k,{...A,signal:S.signal}),g={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},b=`gc-spatial-help-${++La}`,I=["gc-spatial",`gc-${c}`,...s?["gc-spatial-reduced"]:[]];e.classList.add(...I);let j=new Map,v=(l,p)=>{j.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,p)};v("--gc-spatial-height",`${Ke(et(o.stageHeight,620),300,1400)}px`),v("--gc-spatial-radius",`${Ke(et(o.radius,18),0,100)}px`),v("--gc-spatial-fit",o.fit==="contain"?"contain":"cover"),v("--gc-spatial-card-width",`${x}px`),v("--gc-spatial-gap",`${d}px`);let C=n?.track??document.createElement("div");C.classList.add("gc-spatial-canvas"),n&&C.classList.add("gc-spatial-native-track"),C.setAttribute("role",n?"list":"group"),C.setAttribute("aria-label",g[c]),C.setAttribute("aria-describedby",b);let E=document.createElement("p");E.id=b,E.className="gc-spatial-sr",E.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let W=document.createElement("span");W.className="gc-spatial-sr",W.setAttribute("aria-live","polite"),W.setAttribute("aria-atomic","true"),e.append(E,C,W);let D=o.showTitles!==!1&&(c!=="ring"||s||a===1),M=Array.from({length:f},(l,p)=>{let k=p%a,A=i[k],B=r(A,k,{caption:D,description:!1,thumbnail:!0}),P=n?.slot(B)??document.createElement("div");return P.classList.add("gc-spatial-position"),B.classList.add("gc-spatial-card"),B.dataset.spatialIndex=String(p),B.dataset.spatialSourceIndex=String(k),B.tabIndex=p===0?0:-1,p>=a&&B.setAttribute("aria-hidden","true"),!B.getAttribute("aria-label")&&!B.textContent.trim()&&B.setAttribute("aria-label",`View item ${k+1}`),P.contains(B)||P.append(B),P.parentNode!==C&&C.append(P),{position:P,card:B,sourceIndex:k,x:0,y:0,flip:0,tilt:0,lift:0}}),R=document.createElement("div");R.className="gc-spatial-nav";let L=(l,p)=>{let k=document.createElement("button");return k.type="button",k.className="gc-spatial-control",k.setAttribute("aria-label",p),_e(k,l)},oe=L("previous","Previous item"),_=L("next","Next item"),ge=document.createElement("span");ge.className="gc-spatial-count",ge.setAttribute("aria-hidden","true"),R.append(oe,ge,_);let X=o.autoplay&&!s?L("playback","Pause gallery motion"):null;X&&(X.disabled=a<2,X.dataset.paused=String(a<2),X.disabled&&X.setAttribute("aria-label","Play gallery motion"),R.append(X)),e.append(R),oe.disabled=_.disabled=a<2;let ce,q;if(c==="ring"&&a>1&&!s){ce=document.createElement("div"),ce.className="gc-ring-center",ce.setAttribute("aria-hidden","true"),o.showTitles!==!1&&(q=document.createElement("span"),q.className="gc-ring-label",ce.append(q));let l=document.createElement("span");l.textContent="Drag to explore",ce.append(l),C.after(ce)}let U;a||(U=document.createElement(n?"li":"p"),U.className="gc-spatial-empty",U.textContent="No items available.",C.append(U));let N=!1,O=0,z=-1,G=1,H=1,K=1,ie=1,F=1,$=1,ae=0,Y=1,se=1,ue=0,re=0,le=1,be=!!o.autoplay&&!s&&a>1,xe=!1,we=!1,J=!1,fe=!0,ee=null,Ae=0,de=0,ke=0,Ce=-1,Ee=!1,ye={x:-1e4,y:-1e4,inside:!1};function Re(l=O){if(!q)return;let p=typeof i[l]?.title=="string"?i[l].title.trim():"";q.textContent===p&&q.hidden===!p||(q.textContent=p,q.hidden=!p,Oe())}function Oe(){!ce||N||(ce.classList.remove("is-below"),ce.offsetHeight>ae&&ce.classList.add("is-below"))}function We(l,p=!1,k=null){if(!a){ge.textContent="00 / 00";return}let A=rt(l,a),B=k!==null&&M[k]?.sourceIndex===A,P=B&&m[A]!==k;if(B){let T=M[m[A]].card;m[A]=k,P&&(M[k].card.removeAttribute("aria-hidden"),n?.syncFocus(M[k].card),document.activeElement===T&&(Ee=!0,M[k].card.focus({preventScroll:!0}),Ee=!1))}if(z===A&&!P){p&&(W.textContent=`Item ${A+1} of ${a}${i[A].title?`: ${i[A].title}`:""}`);return}O=A,Re(),ge.textContent=`${String(O+1).padStart(2,"0")} / ${String(a).padStart(2,"0")}`,M.forEach(({card:T,sourceIndex:V},ne)=>{let Z=m[V]===ne;T.tabIndex=Z&&V===O?0:-1,T.classList.toggle("is-selected",Z&&V===O),Z?T.removeAttribute("aria-hidden"):T.setAttribute("aria-hidden","true"),n?.syncFocus(T)}),p&&(W.textContent=`Item ${O+1} of ${a}${i[O].title?`: ${i[O].title}`:""}`),z!==O&&(z=O,t.onChange?.(O))}function ct(l){be=!!l&&!s&&a>1,X&&(X.dataset.paused=String(!be),X.setAttribute("aria-label",be?"Pause gallery motion":"Play gallery motion")),Me()}function qe(l){xe=!!l,xe||Me()}function it(l,p,k){return p+Math.round((l-p)/k)*k}function De(l){let p={index:m[l],target:l,distance:1/0};return M.forEach((k,A)=>{if(k.sourceIndex!==l)return;let B=A;if(c==="ring")B=it(ue,A,f);else if(c==="wall"){let T=Math.floor(A/Y);B=se>2?it(ue,T,se):T}let P=Math.abs(B-ue);P<p.distance&&(p={index:A,target:B,distance:P})}),p}function Ne(l){let p=l.getBoundingClientRect();return p.left+p.width/2}function Te(){if(a<2)return;let l=Ne(M[0].position),p=Ne(M[1].position)-l;if(Math.abs(p)<1)return;let k=Ke(Math.round((Ne(C)-l)/p),0,a-1);We(k,!1,k)}function Ve(l,p=!1){if(!a)return;let k=rt(Math.round(et(l,0)),a),A=s?{index:k,target:k}:De(k);if(We(k,!0,A.index),s){let B=M[k].position;C.scrollTo({left:C.scrollLeft+Ne(B)-Ne(C),behavior:"auto"})}else re=A.target;p&&M[A.index].card.focus({preventScroll:!0}),Me()}function Ie(){if(!N){if(G=Math.max(1,C.clientWidth),H=Math.max(1,C.clientHeight),c==="ring"){let l=Math.max(80,Math.min(G-32,H-42)),p=Ke(et(o.ringDiameter,l),80,l);$=Math.max(0,p*.38);let k=Vt*$/Math.max(1,f),A=Math.min(p*.17,k*.8),B=1.15-Ke(d,0,100)/160;if(K=a<=1?Math.min(x,G*.65,H*.58):Math.max(18,Math.min(Math.min(x*.22,A)*B,k*.94)),ie=K*1.28,ce){let P=Math.max(0,$-Math.max(32,ie)/2-10);ae=Math.floor(P*Math.SQRT2),ce.style.setProperty("--gc-ring-label-width",`${ae}px`),ce.style.setProperty("--gc-ring-label-y",`${C.offsetTop+H/2}px`),Oe()}F=Math.max(24,Vt*Math.max(1,$)/Math.max(1,f))}else c==="wall"?(Y=f>=10?3:f>=4?2:1,se=Math.max(1,Math.ceil(f/Y)),ie=Math.min((H-56-(Y-1)*d)/Y,x*.62,230),K=Math.max(60,Math.min(ie*1.5,x,G*.43)),ie=K/1.5,F=K+Math.min(d,70)):(K=Math.min(x,G*.68,(H-70)*.76),ie=K/.76,F=K*(.72+(100-w)*.001)+d);M.forEach(({position:l})=>{l.style.width=`${Math.max(24,K)}px`,l.style.height=`${Math.max(32,ie)}px`}),s&&M.forEach(({position:l})=>{l.style.width=`${Math.min(x,G*.72)}px`,l.style.height=`${Math.min(H-40,x*1.15)}px`}),Me()}}function Ze(l){if(s||!a||xe)return!1;let p=be&&!we&&!J&&!ee&&fe&&!document.hidden;if(p){let P=l/y;c==="angled"?(re+=P*le,re>=a-1&&(re=a-1,le=-1),re<=0&&(re=0,le=1)):re+=P}let k=ee?.moved?1:1-Math.exp(-l*11);ue+=(re-ue)*k,Math.abs(re-ue)<1e-4&&(ue=re);let A=Math.abs(re-ue)>1e-4||p;if(p||ee?.moved){let P=ee?.moved?ue:re,T=c==="wall"?Math.round(P)*Y+m[O]%Y:Math.round(P),V=c==="wall"?Math.min(rt(T,se*Y),f-1):rt(T,f);We(M[V].sourceIndex,!1,V)}let B=1-Math.exp(-l*13);return M.forEach((P,T)=>{let{position:V,card:ne}=P;if(c==="ring"){let Z=-Math.PI/2+(T-ue)*Vt/f;P.x=a===1?0:Math.cos(Z)*$,P.y=a===1?0:Math.sin(Z)*$;let pe=Math.hypot(ye.x-(G/2+P.x),ye.y-(H/2+P.y)),me=Math.max(65,K*2.6),ve=ye.inside&&!ee?.moved?Math.max(0,1-pe/me):0,he=ve*ve*(50+w*1.3);P.flip+=(he-P.flip)*B,Math.abs(P.flip-he)>.05&&(A=!0),ne.toggleAttribute("data-gc-back-facing",P.flip>90);let Se=a===1?0:Z*180/Math.PI+90;V.style.transform=`translate3d(${P.x}px,${P.y}px,0) rotate(${Se}deg)`,ne.style.transform=`perspective(700px) rotateY(${P.flip}deg) translateZ(${ve*12}px)`,V.style.zIndex=String(T===Ce?f+2:1)}else if(c==="wall"){let Z=T%Y,me=Math.floor(T/Y)-ue;if(se>2){let Ct=se%2===0?.5:0;me=rt(me-Ct+se/2,se)-se/2}let ve=Math.min(.68,2.6/Math.max(3,se)),he=me*ve,Se=Math.max(F/ve,G*.4),ht=w/100,wt=Math.sin(he)*Se,kt=(1-Math.cos(he))*Se*ht*.65,St=(Z-(Y-1)/2)*(ie+Math.min(d,50)),Qe=T===Ce||J&&T===m[O]?1:0;P.lift+=(Qe-P.lift)*B,Math.abs(Qe-P.lift)>.002&&(A=!0),V.style.transform=`translate3d(${wt}px,${St}px,${kt+P.lift*20}px) rotateY(${-he*180/Math.PI*ht}deg)`,V.style.zIndex=String(Math.round(kt)+(Qe?1e3:1)),ne.style.transform=`scale(${1+P.lift*.035})`,V.style.opacity=Math.abs(he)>1.6?"0":"1",V.style.visibility=Math.abs(he)>1.6?"hidden":"visible"}else{let Z=T-ue,pe=T===Ce||J&&T===m[O]?1:0;P.lift+=(pe-P.lift)*B,Math.abs(pe-P.lift)>.002&&(A=!0);let me=-(25+w*.28)*(1-P.lift);V.style.transform=`translate3d(${Z*F}px,${-P.lift*14}px,${P.lift*110}px) rotateY(${me}deg)`,V.style.zIndex=String(pe?a+2:a-T),ne.style.transform="none"}}),A}function Ge(l){if(de=0,N)return;let p=Math.min(.05,Math.max(.001,(l-(ke||l-16.7))/1e3));ke=l,Ze(p)&&fe&&!document.hidden?de=requestAnimationFrame(Ge):ke=0}function Me(){!N&&!de&&!s&&(de=requestAnimationFrame(Ge))}s&&u(C,"scroll",Te,{passive:!0}),u(oe,"click",()=>Ve(O-1)),u(_,"click",()=>Ve(O+1)),X&&u(X,"click",()=>ct(!be)),u(C,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let p=l.key==="Home"?0:l.key==="End"?a-1:O+(l.key==="ArrowRight"?1:-1);Ve(p,!0)}),u(C,"focusin",l=>{J=!0;let p=l.target.closest?.("[data-spatial-index]");p&&!Ee&&We(Number(p.dataset.spatialSourceIndex),!1,Number(p.dataset.spatialIndex)),Me()}),u(C,"focusout",()=>{queueMicrotask(()=>{N||(J=C.contains(document.activeElement),Me())})}),u(C,"pointerenter",l=>{l.pointerType!=="touch"&&(we=!0,ye.inside=!0,Me())}),u(C,"pointerleave",()=>{we=!1,ye.inside=!1,Ce=-1,Re(),Me()}),u(C,"pointermove",l=>{if(l.pointerType==="touch")return;let p=C.getBoundingClientRect();ye.x=l.clientX-p.left,ye.y=l.clientY-p.top,ye.inside=!0;let k=l.target.closest?.("[data-spatial-index]");Ce=k?Number(k.dataset.spatialIndex):-1,Re(Ce>=0?M[Ce].sourceIndex:O),Me()}),u(C,"pointerdown",l=>{let p=l.target.closest?.("[data-spatial-index]");p&&We(Number(p.dataset.spatialSourceIndex),!1,Number(p.dataset.spatialIndex)),!(s||a<2||l.pointerType==="mouse"&&l.button!==0)&&(ee={id:l.pointerId,x:l.clientX,y:l.clientY,start:re,moved:!1})}),u(window,"pointermove",l=>{if(!ee||l.pointerId!==ee.id)return;let p=l.clientX-ee.x,k=l.clientY-ee.y;if(!ee.moved){if(Math.abs(k)>12&&Math.abs(k)>Math.abs(p)*1.2){ee=null;return}if(Math.abs(p)<7)return;ee.moved=!0,C.classList.add("is-dragging"),C.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),re=ee.start-p/F,(c==="angled"||c==="wall"&&se<=2)&&(re=Ke(re,0,c==="wall"?se-1:a-1)),Me()},{passive:!1});let Ue=l=>{if(!ee||l.pointerId!==ee.id)return;let p=ee.moved;if(ee=null,C.classList.remove("is-dragging"),C.hasPointerCapture?.(l.pointerId)&&C.releasePointerCapture(l.pointerId),p){Ae=performance.now()+350,re=Math.round(re);let k=c==="wall"?Math.round(re)*Y+m[O]%Y:Math.round(re),A=c==="wall"?Math.min(rt(k,se*Y),f-1):rt(k,f);We(M[A].sourceIndex,!0,A)}Me()};u(window,"pointerup",Ue),u(window,"pointercancel",Ue),u(C,"click",l=>{performance.now()<Ae&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),u(C,"dragstart",l=>l.preventDefault()),u(document,"visibilitychange",Me);let Be=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(p=>p.target===C)?Ie():Oe()}):null;Be?.observe(C),ce&&Be?.observe(ce),Be||u(window,"resize",Ie);let $e=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{fe=l[0]?.isIntersecting??!0,fe&&Me()},{rootMargin:"100px"}):null;return $e?.observe(e),Ie(),We(0),{goTo:Ve,setPlaying:ct,setSuspended:qe,destroy(){N||(N=!0,cancelAnimationFrame(de),Be?.disconnect(),$e?.disconnect(),S.abort(),E.remove(),W.remove(),R.remove(),ce?.remove(),n?U?.remove():C.remove(),e.classList.remove(...I),j.forEach((l,p)=>l?e.style.setProperty(p,l):e.style.removeProperty(p)))}}}var La,Ke,rt,et,Vt,ji=te(()=>{Lt();La=0,Ke=(t,e,r)=>Math.max(e,Math.min(r,t)),rt=(t,e)=>(t%e+e)%e,et=(t,e)=>Number.isFinite(Number(t))?Number(t):e,Vt=Math.PI*2});function Ti({host:t,items:e,options:r,makeCard:n,onChange:i,nativeList:o}){let c=Number(r.stageHeight)||680,s=Math.max(300,c-120),a=Math.max(0,Number(r.gap)||0),h=Number.isFinite(Number(r.depth))?Number(r.depth):45,f=r.previewScroll===!1,m=f?window:t;t.classList.add("gc-stack"),t.style.height=f?"auto":c+"px",t.style.overflowY=f?"visible":"auto",t.style.overscrollBehavior=f?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let w=o?.track??document.createElement("div");w.classList.add("gc-stack-track"),t.append(w);let x=e.map((I,j)=>{let v=n(I,j,{caption:r.showTitles,description:!0}),C=o?.slot(v)??document.createElement("div");C.classList.add("gc-stack-slot"),v.parentElement!==C&&C.append(v),w.append(C),C.style.zIndex=j+1,v.style.width=`min(${r.stackCardWidth}px,calc(100% - 48px))`,v.style.minHeight=s+"px";let E=v.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),W=!Array.from(E).some(D=>!D.closest("[hidden]")&&D.textContent.trim());return v.classList.toggle("gc-stack-image-only",W),{card:v,wrap:C,imageOnly:W,start:0,duration:1/0}}),d=0;function y(){return f?-w.getBoundingClientRect().top:t.scrollTop}function S(){d=0;let I=y(),j=0;x.forEach(({card:v,start:C,duration:E},W)=>{let D=Math.max(0,Math.min(1,(I-C)/E));v.style.transform=r.reducedMotion?"none":`perspective(1300px) translateY(${D*-32}px) scale(${1-D*.14}) rotateX(${D*h*.25}deg)`,v.style.filter=`brightness(${1-D*.23})`,D>=.5&&(j=Math.min(W+1,x.length-1))}),x.length&&i?.(j)}function u(){d||(d=requestAnimationFrame(S))}function g(){let I=x.map(({card:C,wrap:E})=>({height:C.offsetHeight,rowHeight:E.offsetHeight})),j=f?window.innerHeight:t.clientHeight,v=w.clientTop+(parseFloat(getComputedStyle(w).paddingTop)||0);x.forEach((C,E)=>{let{height:W,rowHeight:D}=I[E],M=Math.min(40,j-24-W);C.wrap.style.top=M+"px",C.start=v-M,E&&(x[E-1].duration=Math.max(1,C.start-x[E-1].start));let R=C.imageOnly&&W<=j-64?W*.24:0,L=E<x.length-1?a-R:0;C.wrap.style.marginBottom=L+"px",v+=D+L,E===x.length-1&&(C.duration=1/0,w.style.paddingBottom=Math.max(40,j-M-D)+"px")}),u()}let b;return g(),typeof ResizeObserver<"u"&&(b=new ResizeObserver(g),b.observe(w,{box:"border-box"}),x.forEach(({card:I})=>b.observe(I,{box:"border-box"}))),window.addEventListener("resize",g),m.addEventListener("scroll",u,{passive:!0}),{goTo(I){let j=x[Math.max(0,Math.min(x.length-1,Math.round(I)))];if(!j)return;let v=f?window.scrollY+j.start-y():j.start;m.scrollTo({top:v,behavior:r.reducedMotion?"instant":"smooth"})},destroy(){b?.disconnect(),window.removeEventListener("resize",g),cancelAnimationFrame(d),m.removeEventListener("scroll",u),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",w.remove()}}}var Ii=te(()=>{});function zt(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function Kt(t,e,r,n,i,o){t.beginPath(),t.roundRect(e,r,n,i,Math.max(0,Math.min(o,n/2,i/2)))}function za(t,e,r){let n=[];for(let i of e.split(/\n/)){let o="";for(let c of i.split(/\s+/)){let s=o?o+" "+c:c;o&&t.measureText(s).width>r?(n.push(o),o=c):o=s}n.push(o)}return n}function Fi(t,e,r){let n=Math.max(80,e.cardWidth),i=Math.min(e.cardPadding,n*.4),o=n-2*i,c=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,s=document.createElement("canvas").getContext("2d"),a=t.map(({item:f,image:m})=>{let w=[],x=(j,v,C,E,W,D,M=!1,R=r.bodyFamily)=>{if(!j)return;let L=C+" "+v+"px "+R;s.font=L;let oe=za(s,j,Math.max(1,o-(M?16:0)));w.push({font:L,size:v,color:E,align:W,lines:oe,height:oe.length*v*1.25+(M?10:0),gap:D,isButton:M})},d=o*e.imageWidth/100,y=m?.naturalWidth/m?.naturalHeight||1,[S,u]=e.aspectRatio.split(":").map(Number),g=e.aspectRatio==="circle"?1:S&&u?S/u:y,b=m&&e.showImage?{image:m,width:d,height:d/g,gap:0}:null;return(e.textPlacement==="card"||!f.src||!e.showImage)&&(e.showTitles&&x(f.title,e.titleCustom&&e.titleSize?e.titleSize*c:r.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:r.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:r.ink,e.titleAlign,0,!1,r.family),e.showDescription&&x(f.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*c:r.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:r.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:r.ink,e.descriptionAlign,w.length?e.titleGap:0),e.showButton&&f.buttonLabel&&f.link&&x(f.buttonLabel,r.size,r.weight,r.buttonInk,"center",e.buttonGap,!0)),b&&(e.cardOrder==="content"?(b.gap=w.length?e.mediaGap:0,w.push(b)):(w.length&&(w[0].gap+=e.mediaGap),w.unshift(b))),{pieces:w,height:Math.max(1,2*i+w.reduce((j,v)=>j+v.gap+v.height,0))}}),h=Math.max(1,...a.map(f=>f.height));return a.map(({pieces:f,height:m})=>{let w=document.createElement("canvas"),x=Math.min(2,2048/Math.max(n,h));w.width=Math.max(1,Math.round(n*x)),w.height=Math.max(1,Math.round(h*x));let d=w.getContext("2d");d.scale(x,x);let y=e.cardSizing==="equal"?h:m,S=(h-y)/2;e.cardBackground&&(d.fillStyle=e.cardColor,Kt(d,0,S,n,y,e.spiralRadius),d.fill());let u=S+i+(e.cardAlign==="bottom"?y-m:e.cardAlign==="middle"?(y-m)/2:0),g;for(let b of f){if(u+=b.gap,b.image){let I=b.image.naturalWidth/b.image.naturalHeight,j=e.fit==="contain"||e.fit==="fit",v=j?Math.min(b.width,b.height*I):b.width,C=j?v/I:b.height,E=i+(e.imageAlign==="left"?0:e.imageAlign==="right"?o-b.width:(o-b.width)/2)+(b.width-v)/2,W=u+(b.height-C)/2,D=e.aspectRatio==="circle"?b.width/2:e.imageRadius;if(e.shadowEnabled){d.save(),d.shadowColor=e.shadowColor,d.shadowBlur=e.shadowBlur*x;let oe=e.shadowAngle*Math.PI/180;d.shadowOffsetX=Math.cos(oe)*e.shadowDistance*x,d.shadowOffsetY=Math.sin(oe)*e.shadowDistance*x;let _=e.shadowSpread;Kt(d,E-_,W-_,v+2*_,C+2*_,D+_),d.fillStyle=e.shadowColor,d.fill(),d.restore()}d.save(),e.aspectRatio==="circle"&&(d.beginPath(),d.arc(E+v/2,W+C/2,b.width/2,0,Math.PI*2),d.clip()),Kt(d,E,W,v,C,e.aspectRatio==="circle"?0:D),d.clip();let M=j?Math.min(v/b.image.naturalWidth,C/b.image.naturalHeight):Math.max(v/b.image.naturalWidth,C/b.image.naturalHeight),R=b.image.naturalWidth*M,L=b.image.naturalHeight*M;d.drawImage(b.image,E+(v-R)/2,W+(C-L)/2,R,L),e.overlayEnabled&&(d.fillStyle=e.imageTint,d.fillRect(E,W,v,C)),e.imageBorder&&(d.strokeStyle=e.imageBorderColor,d.lineWidth=2*e.imageBorderSize,d.stroke()),d.restore()}else{let I=b.align==="inherit"?"center":b.align;if(d.font=b.font,d.textBaseline="top",d.textAlign=I,d.fillStyle=b.color,b.isButton){let v=Math.min(o,Math.max(...b.lines.map(E=>d.measureText(E).width))+16),C=(n-v)/2;d.fillStyle=r.accent,d.fillRect(C,u,v,b.height),d.fillStyle=b.color,g={left:C/n,right:(C+v)/n,top:u/h,bottom:(u+b.height)/h}}let j=I==="left"?i:I==="right"?n-i:n/2;b.lines.forEach((v,C)=>d.fillText(v,j,u+(b.isButton?5:0)+C*b.size*1.25,o))}u+=b.height}return{canvas:w,buttonBounds:g,aspect:n/h}})}var Ri=te(()=>{});function qi(t,e){let r="http://www.w3.org/2000/svg";function n(y,S,u){let g=document.createElementNS(r,y);for(let[b,I]of Object.entries(S))g.setAttribute(b,I);return u?.append(g),g}let i=n("svg",{width:0,height:0,"aria-hidden":"true"});i.style.position="absolute",t.append(i);let o=n("defs",{},i),c=n("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},o),s=n("feMorphology",{in:"SourceAlpha",operator:"dilate"},c),a=n("feGaussianBlur",{},c),h=n("feOffset",{result:"mask"},c),f=n("feFlood",{},c);n("feComposite",{in2:"mask",operator:"in"},c);let m=n("feMerge",{},c);n("feMergeNode",{},m),n("feMergeNode",{in:"SourceGraphic"},m);let w=n("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},o),x=n("feFlood",{},w);n("feComposite",{in2:"SourceGraphic",operator:"atop"},w);let d=c.cloneNode(!0);return d.id=e+"-card-shadow",o.append(d),y=>{let S=(y.cardShadowAngle??90)*Math.PI/180;d.querySelector("feMorphology").setAttribute("radius",y.cardShadowSpread||0),d.querySelector("feGaussianBlur").setAttribute("stdDeviation",(y.cardShadowBlur||0)/2);let u=d.querySelector("feOffset");u.setAttribute("dx",Math.cos(S)*(y.cardShadowDistance||0)),u.setAttribute("dy",Math.sin(S)*(y.cardShadowDistance||0)),d.querySelector("feFlood").setAttribute("flood-color",y.cardShadowColor||"#000");let g=[];y.shadowEnabled&&g.push("url(#"+c.id+")"),y.cardShadow&&g.push("url(#"+d.id+")");let b=y.shadowAngle*Math.PI/180;s.setAttribute("radius",y.shadowSpread),a.setAttribute("stdDeviation",y.shadowBlur/2),h.setAttribute("dx",Math.cos(b)*y.shadowDistance),h.setAttribute("dy",Math.sin(b)*y.shadowDistance),f.setAttribute("flood-color",y.shadowColor),x.setAttribute("flood-color",y.imageTint),t.style.setProperty("--gc-shadow-filter",g.join(" ")||"none"),t.style.setProperty("--gc-image-filter",y.imageTint.endsWith("00")&&y.imageTint.length===9?"none":"url(#"+w.id+")")}}var Bi=te(()=>{});var Wi,jt,Di=te(()=>{Wi='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',jt=class{constructor(e,r,n){this.root=e,this.cards=r,this.projects=n;let i=r[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(i)?i:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let o=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",o),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${Wi}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${Wi}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${o}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",s=>{if(s.target!==this.dialog)return;let a=this.dialog.getBoundingClientRect();(s.clientX<a.left||s.clientX>a.right||s.clientY<a.top||s.clientY>a.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",s=>{(s.key==="ArrowLeft"||s.key==="ArrowRight")&&(s.preventDefault(),this.showFrame(this.frame+(s.key==="ArrowRight"?1:-1)))});let c=this.dialog.querySelector(".project-image-stage");c.addEventListener("pointerdown",s=>{!s.isPrimary||s.target.closest("button")||(this.galleryPointer={id:s.pointerId,x:s.clientX,y:s.clientY},c.setPointerCapture(s.pointerId))}),c.addEventListener("pointerup",s=>{let a=this.galleryPointer;if(this.galleryPointer=null,!a||a.id!==s.pointerId)return;c.hasPointerCapture(s.pointerId)&&c.releasePointerCapture(s.pointerId);let h=s.clientX-a.x,f=s.clientY-a.y;Math.abs(h)>35&&Math.abs(h)>Math.abs(f)*1.2&&this.showFrame(this.frame+(h<0?1:-1))}),c.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let r=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!r,this.dialog.querySelector("[data-gallery-next]").hidden=!r,this.thumbnails.hidden=!r,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(i=>{let o=document.createElement("li");return o.textContent=i,o})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((i,o)=>{let c=document.createElement("button");c.type="button",c.className="project-thumbnail",c.setAttribute("aria-label",`Show ${i.label.toLowerCase()}`);let s=document.createElement("img");return s.src=new URL(i.file,this.assetDirectory).href,s.alt="",s.width=1600,s.height=900,c.append(s),c.addEventListener("click",()=>this.showFrame(o)),c})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let r=this.project.gallery[this.frame];this.image.src=new URL(r.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${r.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${r.label}`,[...this.thumbnails.children].forEach((n,i)=>n.setAttribute("aria-current",String(i===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Xe,mt,Tt=te(()=>{At();Xe=Object.freeze({...wi,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),mt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function Ni(t,e,{pauseOnHover:r=!0,interactionRestMs:n=6e3}={}){let i=t.querySelector("[data-orbit-toggle]"),o=new AbortController,c=(g,b,I)=>g.addEventListener(b,I,{signal:o.signal}),s={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let a=0,h=0,f=!1,m=g=>!!g&&t.contains(g)&&(g.matches(":focus-visible")||!!g.closest(".orbit-card")),w=()=>!f&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,x=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(a),e.autoFrame=0,a=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},d=g=>{if(e.autoFrame=0,!w()){x();return}let b=Math.min(.05,Math.max(0,(g-e.autoTime)/1e3));e.autoTime=g;let I=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(h+=b,h>=Number(t.dataset.interval||5)){h=0,e.autoTime=0,s.animateTo.call(e,Math.round(e.position)+I),a=setTimeout(y,100);return}}else e.position=(e.position+I*b*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(d)},y=()=>{if(!w()){x(),e.frame&&!f&&(a=setTimeout(y,100));return}let g=e.resumeAt-performance.now();if(g>0){x(),a=setTimeout(y,g);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(d))},S=(g=6e3)=>{x(),e.resumeAt=performance.now()+g};e.animateTo=function(...g){S(n),s.animateTo.apply(this,g),y()},e.settleImmediately=function(...g){s.settleImmediately.apply(this,g),y()},e.openProject=function(...g){S(),s.openProject.apply(this,g),y()},c(t,"pointerenter",g=>{g.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||r)&&(e.hovered=!0,y())}),c(t,"pointerleave",g=>{g.pointerType!=="touch"&&(e.hovered=!1,y())}),c(t,"focusin",g=>{e.keyboardFocused=m(g.target),y()}),c(t,"focusout",g=>{e.keyboardFocused=m(g.relatedTarget),y()}),c(t,"pointerup",()=>{S(n),y()}),c(t,"pointercancel",()=>{S(n),y()}),c(e.viewer.dialog,"close",()=>{S(),y()}),c(document,"visibilitychange",y),c(e.reducedMotion,"change",y),c(i,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,i.dataset.paused=String(e.manuallyPaused),i.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),y()});let u=new IntersectionObserver(g=>{e.inView=g.some(b=>b.isIntersecting&&b.intersectionRatio>=.15),y()},{threshold:.15});return u.observe(e.stage),e.stopAutoplay=x,e.syncAutoplay=y,()=>{f=!0,x(),o.abort(),u.disconnect(),Object.assign(e,s)}}var Hi=te(()=>{});var Pe,Oi,Jt,$i,Gi,Ui,_i,Xi,Yi,Vi,Ki,Ji,Zi,Qi,It,eo,ft,to,Zt=te(async()=>{Pe=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),Oi=Pe.CanvasTexture,Jt=Pe.BufferGeometry,$i=Pe.Float32BufferAttribute,Gi=Pe.LineBasicMaterial,Ui=Pe.LineLoop,_i=Pe.DoubleSide,Xi=Pe.Mesh,Yi=Pe.NoToneMapping,Vi=Pe.PerspectiveCamera,Ki=Pe.PlaneGeometry,Ji=Pe.Raycaster,Zi=Pe.Scene,Qi=Pe.ShaderMaterial,It=Pe.SRGBColorSpace,eo=Pe.TextureLoader,ft=Pe.Vector2,to=Pe.WebGLRenderer});var ja,bt,io=te(async()=>{ja=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),bt=ja.default});var Ta,Qt,oo=te(async()=>{Ta=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),Qt=Ta.CustomEase});function ao(t,e,r=64){let n=t/e,i=new Ki(t,t*9/16,r,1),o=i.attributes.position,c=i.attributes.uv;for(let s=0;s<o.count;s++){let a=(c.getX(s)-.5)*e;o.setX(s,n*Math.sin(a)),o.setZ(s,n*(Math.cos(a)-1))}return i.computeVertexNormals(),i.computeBoundingSphere(),i}function ro(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var ei=te(async()=>{await Zt()});function yt(t,e){let r=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*r,panelArc:t.radiansPerSlide*r,height:t.slotHeight*r}}function Ft(t,{radius:e,pitch:r,radiansPerSlide:n}){let i=t*n;return{x:Math.sin(i)*e,y:-t*r,z:(Math.cos(i)-1)*e,angle:i,taper:1,shade:(1-Math.cos(i))/2*.58}}function no(t,e){let r=yt(t,e);return ao(r.cardWidth,r.panelArc)}function ti(t,e=64){let r=[];for(let n=0;n<=e;n++){let i=(n/e-.5)*t.radiansPerSlide;r.push(t.radius*Math.sin(i),t.slotHeight/2,t.radius*(Math.cos(i)-1))}for(let n=e;n>=0;n--){let i=(n/e-.5)*t.radiansPerSlide;r.push(t.radius*Math.sin(i),-t.slotHeight/2,t.radius*(Math.cos(i)-1))}return r}var Rt=te(async()=>{await ei()});function ii(t,e){let r=no(t,e);return r.scale(1,1/t.aspect/(9/16),1),r.computeVertexNormals(),r.computeBoundingSphere(),r}function so(t,e,r,n,i){let o=Math.min(t,e)*Math.min(40,Math.max(0,i))/100,c=t-2*o,s=e-2*o,a=c/s,h=n==="fit"?Math.max:Math.min,f=h(1,a/r),m=h(1,r/a);return{contentWidth:c,contentHeight:s,uvScaleX:f,uvScaleY:m,imageWidth:c/f,imageHeight:s/m,padding:o}}var co=te(async()=>{await Rt();await Rt()});function oi({stageWidth:t,stageHeight:e,spiralWidthPercent:r,cardWidth:n,aspect:i,rise:o,riseUnit:c}){let s=Math.max(1,t*r/200),a=Math.max(1,Math.min(n,s*Math.PI/3,e*.4*i)),h=Math.PI*2*s/a,f=c==="percent"?e*o/100:o*Math.min(1,t/640);return{radius:s,slotWidth:a,slotHeight:a/i,aspect:i,pitch:Math.max(a/i*1.25/h,f),radiansPerSlide:a/s,cardsPerTurn:Math.PI*2*s/a}}var lo=te(()=>{});function go(t,e,r){let n=e.radius*2.4,i=n/(n+2*e.radius),o=Math.ceil((r/(2*i)+e.slotHeight/2)/e.pitch)+2,c=Math.floor(t);return{first:c-o,last:c+o,count:o*2+1}}function uo(t,e,r){let n=t*e.radiansPerSlide,i=n-r.panelArc/2,o=n+r.panelArc/2,c=Math.PI*2,s=S=>Math.ceil((i-S)/c)<=Math.floor((o-S)/c),a=s(0)?1:Math.max(Math.cos(i),Math.cos(o)),h=s(Math.PI)?-1:Math.min(Math.cos(i),Math.cos(o)),f=e.radius*2.4,m=f/(f+e.radius*(1-a)),w=f/(f+e.radius*(1-h)),x=-t*e.pitch,d=x+r.height/2,y=x-r.height/2;return{minY:Math.min(y*m,y*w),maxY:Math.max(d*m,d*w)}}function ho(t,e){let r=Math.min(80,e*.08),n=o=>Math.max(0,Math.min(1,o)),i=Math.min(n((e/2-t.minY)/r),n((t.maxY+e/2)/r));return i*i*(3-2*i)}function mo(t,e,r,n){let i=r-e;return Math.abs(i)>n/2&&(i-=Math.round(i/n)*n),t+i}var po,fo=te(async()=>{await Rt();lo();po=(t,e)=>(t%e+e)%e});var yo,bo=te(()=>{yo=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function vo(t,{textureSource:e=r=>r.querySelector("img").src}={}){let{root:r,stage:n}=t,i;try{i=new to({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return r.dataset.renderer="css-fallback",()=>{delete r.dataset.renderer}}i.outputColorSpace=It,i.toneMapping=Yi,i.setClearColor(0,0);let o=i.domElement;o.style.removeProperty("display"),o.className="orbit-webgl",o.setAttribute("aria-hidden","true"),n.append(o);let c=new Zi,s=new Vi,a=new Ji,h=new ft,f=new AbortController,m=(z,G,H)=>z.addEventListener(G,H,{signal:f.signal}),w=t.render,x=t.pointerDown,d=new Map,y=new Map;function S(){for(let z of t.cards){let G=y.get(z);if(G?.image!==z.artwork&&(G?.dispose(),y.delete(z),z.artwork)){let H=new Oi(z.artwork);H.colorSpace=It,y.set(z,H)}}}let u=[],g,b,I=t.position,j=t.position,v="",C=!1,E=!1,W=null,D=null,M=!1,R=!1;r.dataset.renderer="loading-webgl";let L=()=>oi({stageWidth:n.clientWidth,stageHeight:n.clientHeight,spiralWidthPercent:Number(r.dataset.spiralWidth),cardWidth:Number(r.dataset.cardWidth),aspect:Number(r.dataset.cardAspect),rise:Number(r.dataset.rise),riseUnit:r.dataset.riseUnit}),oe=()=>{let z=t.cards[0],G=new Qi({uniforms:{screenshot:{value:d.get(e(z))},dimensions:{value:new ft},contentDimensions:{value:new ft(1,1)},imageScale:{value:new ft(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:Fa,fragmentShader:Ra,transparent:!0,side:_i,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),H=new Xi(g,G),K=new Ui(b,new Gi({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),ie={card:z,mesh:H,guide:K,material:G,surface:{scale:0,target:0}};H.userData.panel=ie,u.push(ie),c.add(H,K)},_=z=>{let G=go(I,z,n.clientHeight);for(;u.length<G.count;)oe();for(;u.length>G.count;){let H=u.pop();c.remove(H.mesh,H.guide),H.material.dispose(),H.guide.material.dispose()}u.forEach((H,K)=>{H.offset=G.first+K-I,H.card=t.cards[po(G.first+K,t.count)],H.material.uniforms.screenshot.value=y.get(H.card)||d.get(e(H.card))})},ge=()=>{let z=n.clientWidth,G=n.clientHeight,H=L(),K=Number(r.dataset.slotGap||3);_(H);let ie=yt(H,K),{cardWidth:F,panelArc:$}=ie,{radius:ae}=H;r.dataset.slotMetrics=JSON.stringify({...H,cardArc:$,cardWidth:F,cardHeight:ie.height,gap:K,imageFit:r.dataset.imageFit,imagePadding:Number(r.dataset.imagePadding||0)}),u.forEach(le=>{le.material.uniforms.dimensions.value.set(F,ie.height);let be=le.material.uniforms;be.cornerRadius.value=Math.min(Number(r.dataset.cornerRadius)||0,F/2,ie.height/2),be.borderWidth.value=Number(r.dataset.borderWidth)||0,be.solidBack.value=r.dataset.backFace==="solid",be.showImage.value=!!le.card.artwork||r.dataset.showImage!=="false";for(let J of["backColor","borderColor","imageTint","mirrorColor"]){let fe=be[J],ee=J==="imageTint"&&le.card.artwork?"#00000000":r.dataset[J]||"#00000000";if(fe.hex!==ee){fe.hex=ee;let Ae=ee.length===7?ee+"ff":ee;fe.value=[1,3,5,7].map(de=>parseInt(Ae.slice(de,de+2),16)/255)}}let xe=le.material.uniforms.screenshot.value.image;if(!xe)return;let we=so(F,ie.height,(xe.naturalWidth||xe.width)/(xe.naturalHeight||xe.height),le.card.artwork?"fit":r.dataset.imageFit,le.card.artwork?0:Number(r.dataset.imagePadding||0));le.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),le.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let Y=Math.min(window.devicePixelRatio||1,2),se=`${z}:${G}:${F}:${$}:${ie.height}:${ae}:${Y}`;if(se===v||!z||!G)return;v=se,i.setPixelRatio(Y),i.setSize(z,G,!1),s.position.set(0,0,ae*2.4),s.fov=ro(G,s.position.z),s.aspect=z/G,s.near=.1,s.far=ae*12,s.updateProjectionMatrix(),s.updateMatrixWorld();let ue=g;g=ii(H,K);let re=b;b=new Jt,b.setAttribute("position",new $i(ti(H),3)),u.forEach(le=>{le.mesh.geometry=g,le.guide.geometry=b,le.material.uniforms.dimensions.value.set(F,ie.height)}),ue?.dispose(),re?.dispose()},X=()=>{if(!C||E||M||R||!t.geometry)return;R=!0,I=mo(I,j,t.position,t.count),j=t.position,ge();let z=L(),G=yt(z,Number(r.dataset.slotGap||3)),H=r.dataset.focusMode==="keyboard"&&r.contains(document.activeElement),K=0;u.forEach(F=>{let{card:$,mesh:ae,material:Y}=F,se=Ft(F.offset,z),ue=uo(F.offset,z,G),re=ho(ue,n.clientHeight),le=r.dataset.edgeMode==="preset"?re:+(re>0),be=H&&$===t.cards[t.active]&&Math.abs(F.offset)<.5;Y.polygonOffsetUnits=Math.abs(F.offset)*8,ae.position.set(se.x,se.y,se.z),ae.rotation.y=se.angle;let xe=F===W&&!t.pointer&&!t.reducedMotion.matches,we=Number(r.dataset.hoverAmount)||0,J=xe?1:0;F.surface.target!==J&&(F.surface.target=J,bt.to(F.surface,{scale:J,duration:(Number(r.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:X})),ae.scale.setScalar(r.dataset.hoverEffect==="zoom"?1+F.surface.scale*we/100:1),r.dataset.hoverEffect==="lift"&&(ae.position.y+=F.surface.scale*we),ae.visible=le>.001&&!!Y.uniforms.screenshot.value.image,ae.visible&&K++,F.guide.position.copy(ae.position),F.guide.rotation.copy(ae.rotation),F.guide.visible=r.dataset.showSlots==="true"&&ae.visible,F.guide.material.opacity=le*.42,Y.uniforms.fade.value=le,Y.uniforms.shade.value=se.shade,Y.uniforms.focused.value=be?1:0});let ie=JSON.stringify({cardsPerTurn:z.cardsPerTurn,visibleCount:K,poolCount:u.length,stageWidth:n.clientWidth,stageHeight:n.clientHeight,cardWidth:G.cardWidth,cardHeight:G.height,pitch:z.pitch,radius:z.radius,uniqueCount:t.count});r.dataset.responsiveMetrics!==ie&&(r.dataset.responsiveMetrics=ie),D&&!t.pointer&&(W=ce(D)),c.updateMatrixWorld(!0),i.render(c,s),R=!1},ce=z=>{if(!C||M)return null;let G=o.getBoundingClientRect();h.set((z.clientX-G.left)/G.width*2-1,-(z.clientY-G.top)/G.height*2+1),a.setFromCamera(h,s);for(let H of a.intersectObjects(u.map(K=>K.mesh))){let K=H.object.userData.panel;if(!H.object.visible||K.material.uniforms.fade.value<=.25)continue;let{x:ie,y:F}=K.material.uniforms.dimensions.value,$=K.material.uniforms.cornerRadius.value,ae=Math.abs((H.uv.x-.5)*ie)-ie/2+$,Y=Math.abs((H.uv.y-.5)*F)-F/2+$;if(!(Math.hypot(Math.max(ae,0),Math.max(Y,0))+Math.min(Math.max(ae,Y),0)>$))return K.hitUv=H.uv,K}return null};t.render=function(){w.call(this),X()},t.pointerDown=function(z){if(x.call(this,z),C&&!M&&this.pointer?.id===z.pointerId){let G=ce(z);this.pointer.card=G?.card||null;let H=G?.card.buttonBounds,K=G?.hitUv;H&&K.x>=H.left&&K.x<=H.right&&1-K.y>=H.top&&1-K.y<=H.bottom&&(this.pointer.buttonLink=G.card.dataset.buttonLink)}D=null,W=null},m(n,"pointermove",z=>{D=z.pointerType==="mouse"?{clientX:z.clientX,clientY:z.clientY}:null,W=z.pointerType==="mouse"&&!t.pointer?ce(z):null,o.style.cursor=t.pointer?.dragging?"grabbing":W?"pointer":"grab",X()}),m(n,"pointerleave",()=>{D=null,W=null,X()}),m(n,"pointerup",()=>{W=null,X()}),m(r,"focusin",X),m(r,"focusout",()=>queueMicrotask(X)),m(document,"keydown",()=>queueMicrotask(X)),m(document,"pointerdown",()=>queueMicrotask(X)),m(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&u.forEach(({surface:z})=>{bt.killTweensOf(z),z.scale=z.target}),X()}),m(r,"playground-change",()=>{S(),X()}),m(r,"artwork-change",()=>{S(),X()}),m(r,"slot-guides-change",X),m(o,"webglcontextlost",z=>{z.preventDefault(),M=!0,r.classList.remove("has-webgl-carousel"),r.dataset.renderer="css-fallback"}),m(o,"webglcontextrestored",()=>{M=!1,C&&(r.classList.add("has-webgl-carousel"),r.dataset.renderer="webgl",X())});let q=new ResizeObserver(()=>X());q.observe(n);let U=new eo,N=!1,O=()=>{E||(N=!0,C=!1,r.classList.remove("has-webgl-carousel"),r.dataset.renderer="css-fallback")};for(let z of t.cards){let G=e(z);if(d.has(G))continue;let H=U.load(G,X,void 0,O);H.colorSpace=It,H.anisotropy=Math.min(8,i.capabilities.getMaxAnisotropy()),d.set(G,H)}return N||(g=ii(L(),Number(r.dataset.slotGap||3)),b=new Jt,C=!0,r.classList.add("has-webgl-carousel"),r.dataset.renderer="webgl",X()),()=>{E=!0,f.abort(),q.disconnect(),t.render=w,t.pointerDown=x,r.classList.remove("has-webgl-carousel"),delete r.dataset.renderer,u.forEach(({material:z,surface:G,guide:H})=>{bt.killTweensOf(G),z.dispose(),H.material.dispose()}),y.forEach(z=>z.dispose()),g?.dispose(),b?.dispose(),d.forEach(z=>z.dispose()),i.dispose(),i.forceContextLoss(),o.remove()}}var Yr,Fa,Ra,xo=te(async()=>{await Zt();await io();await oo();await ei();await co();await fo();bt.registerPlugin(Qt);Yr=Qt.create("portfolio-surface",".2,.75,.25,1"),Fa=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ra=`
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
`});var wo=te(()=>{(()=>{"use strict";let t=Math.PI*2,e=(o,c)=>(o%c+c)%c,r=(o,c,s)=>Math.min(s,Math.max(c,o));class n{constructor(c){this.root=c,this.stage=c.querySelector(".orbit-stage"),this.cards=[...c.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((s,a)=>{s.dataset.slideIndex=a;let h=s.cloneNode(!0);h.dataset.repeat="true",h.tabIndex=-1,h.setAttribute("aria-hidden","true"),h.removeAttribute("aria-pressed"),s.parentElement.append(h),this.visualCards.push(h)}),!(!this.count||!this.stage)&&(this.title=c.querySelector(".orbit-title"),this.description=c.querySelector(".orbit-description"),this.status=c.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(c,this.cards),this.pagination=c.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((c,s)=>{let a=document.createElement("button");return a.type="button",a.className="orbit-dot",a.setAttribute("aria-label",`Show ${c.dataset.title||`screenshot ${s+1}`}`),a.addEventListener("click",()=>this.goTo(s),this.options),this.pagination?.append(a),a}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(c=>{c.disabled=!0})}bindEvents(){let c=(s,a,h,f={})=>s.addEventListener(a,h,{...this.options,...f});c(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),c(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),c(this.stage,"keydown",s=>{let a={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};s.key in a?(s.preventDefault(),this.step(a[s.key])):(s.key==="Home"||s.key==="End")&&(s.preventDefault(),this.goTo(s.key==="Home"?0:this.count-1))}),c(this.stage,"pointerdown",s=>this.pointerDown(s)),c(this.stage,"pointermove",s=>this.pointerMove(s),{passive:!1}),c(this.stage,"pointerup",s=>this.pointerUp(s)),c(this.stage,"pointercancel",s=>this.pointerUp(s,!0)),c(this.stage,"lostpointercapture",s=>this.pointerUp(s,!0)),c(this.stage,"dragstart",s=>s.preventDefault()),c(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),c(this.stage,"click",s=>{if(s.detail!==0&&performance.now()<this.ignoreClickUntil){s.preventDefault(),s.stopPropagation();return}let a=s.target.closest(".orbit-card");a&&this.openProject(Number(a.dataset.slideIndex))}),c(this.stage,"focusin",s=>{let a=this.cards.indexOf(s.target.closest(".orbit-card"));!this.pointer&&a>=0&&a!==this.active&&this.goTo(a)}),c(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),c(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(c=>{let s=c.querySelector(".orbit-surface"),a=s.querySelector("img"),h=Array.from({length:this.segmentCount},(f,m)=>{let w=document.createElement("span");return w.className="orbit-strip",w.setAttribute("aria-hidden","true"),w.dataset.stripIndex=m,w.style.backgroundImage=`url("${a.src}")`,s.append(w),w});return c.classList.add("is-curved"),{card:c,strips:h}})}measure(){let c=this.stage.clientWidth,s=this.stage.clientHeight,a=c<=700;this.cards[0].style.removeProperty("width");let h=this.cards[0].offsetWidth,f=t/8,m=f*.88,w=h/m;this.geometry={radius:w,panelArc:m,cardWidth:h,pitch:r(s/13,36,52),halfWindow:6.5,radiansPerSlide:f,dragUnitX:Math.max(85,c*(a?.32:.18)),dragUnitY:r(s*.13,65,105)},this.stage.style.perspective=`${(w*2.4).toFixed(3)}px`;let x=m/this.segmentCount,d=2*w*Math.sin(x/2),y=h*9/16;this.panels.forEach(({card:S,strips:u})=>{S.style.width=`${h}px`,u.forEach((g,b)=>{let I=-m/2+(b+.5)*x,j=w*Math.sin(I),v=w*(Math.cos(I)-1);g.style.width=`${(d+.6).toFixed(4)}px`,g.style.backgroundSize=`${h}px ${y}px`,g.style.backgroundPosition=`${(-b*h/this.segmentCount).toFixed(4)}px 0px`,g.style.transform=`translateX(-50%) translate3d(${j.toFixed(4)}px, 0px, ${v.toFixed(4)}px) rotateY(${(I*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:c,pitch:s,halfWindow:a,radiansPerSlide:h}=this.geometry;this.visualCards.forEach(m=>{let w=Number(m.dataset.slideIndex),x=e(w-this.position+this.count/2,this.count)-this.count/2;m.dataset.repeat&&(x+=x<0?this.count:-this.count);let d=x*h,y=Math.cos(d),S=Math.sin(d),u=(1-y)/2,g=1-x/a*.11,b=S*c*g,I=x*s,j=y*c*g-c,v=d*180/Math.PI,C=r((a-Math.abs(x))/.65,0,1);m.style.transform=`translate(-50%, -50%) translate3d(${b.toFixed(3)}px, ${I.toFixed(3)}px, ${j.toFixed(3)}px) rotateY(${v.toFixed(3)}deg) scale(${g.toFixed(4)})`,m.style.zIndex="auto",m.style.setProperty("--orbit-shade",String(u*.58)),m.style.setProperty("--orbit-fade",String(C)),m.style.opacity="1",m.style.visibility=C>0?"visible":"hidden",m.style.pointerEvents=C>.25?"auto":"none",m.toggleAttribute("data-gc-back-facing",y<0),m.dataset.offset=x.toFixed(5)});let f=e(Math.round(this.position),this.count);f!==this.active&&this.updateActive(f)}updateActive(c){let s=this.visualCards.includes(document.activeElement);this.active=c,this.cards.forEach((a,h)=>{let f=h===c;a.classList.toggle("is-centered",f),a.tabIndex=f?0:-1,a.setAttribute("aria-pressed",String(f)),this.dots[h].setAttribute("aria-current",String(f))}),this.title&&(this.title.textContent=this.cards[c].dataset.title||""),this.description&&(this.description.textContent=this.cards[c].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[c].dataset.title}, project ${c+1} of ${this.count}`),s&&!this.pointer&&this.cards[c].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(c)}goTo(c){let s=e(c-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+s)}step(c){this.animateTo(Math.round(this.target)+c)}animateTo(c,s=0){if(this.target=Math.round(c),this.velocity=s,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(c){this.frame=0;let s=Math.min((c-this.lastTime)/1e3,.032);this.lastTime=c;let a=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=a*s,this.position+=this.velocity*s,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(c){if(this.viewer.dialog.open||!Number.isInteger(c)||!this.cards[c])return;let s=e(c-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+s),this.settleImmediately(),this.viewer.open(c)}pointerDown(c){if(!c.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}c.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:c.pointerId,x:c.clientX,y:c.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:c.target.closest(".orbit-card")},this.stage.setPointerCapture(c.pointerId))}pointerMove(c){let s=this.pointer;if(!s||s.id!==c.pointerId)return;let a=c.clientX-s.x,h=c.clientY-s.y;if(!s.dragging){if(Math.max(Math.abs(a),Math.abs(h))<6)return;if(c.pointerType==="touch"&&Math.abs(a)<=Math.abs(h)){s.card=null;return}s.axis=Math.abs(h)>Math.abs(a)?"y":"x",s.lastCoordinate=s.axis==="x"?s.x:s.y,s.dragging=!0,this.root.classList.add("is-dragging")}c.preventDefault();let f=s.axis==="x"?c.clientX:c.clientY,m=s.axis==="x"?a:h,w=s.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,x=c.pointerType==="touch"?r(w*.38,32,48):w,d=performance.now(),y=Math.max(8,d-s.lastTime),S=-(f-s.lastCoordinate)/x/y*1e3;s.speed=s.speed*.35+S*.65,s.lastMovement=d,s.lastTime=d,s.lastCoordinate=f,s.travel=m,this.position=s.startPosition-m/x,this.render()}pointerUp(c,s=!1){let a=this.pointer;if(!a||a.id!==c.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(a.id)&&this.stage.releasePointerCapture(a.id),!a.dragging){if(this.animateTo(Math.round(this.position)),!s&&a.buttonLink){location.assign(a.buttonLink);return}!s&&a.card&&this.openProject(Number(a.card.dataset.slideIndex));return}let h=s||performance.now()-a.lastMovement>90?0:r(a.speed,-10,10),f=Math.round(this.position+(this.reducedMotion.matches?0:h*(c.pointerType==="touch"?.32:.2))),m=this.position-a.startPosition;!s&&Math.abs(a.travel)>18&&Math.abs(m)>.12&&f===Math.round(a.startPosition)&&(f+=Math.sign(m)),this.animateTo(f,h)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:c,strips:s})=>{s.forEach(a=>a.remove()),c.classList.remove("is-curved"),c.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(c=>c.dataset.repeat).forEach(c=>c.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function i(o=document){o.querySelectorAll("[data-spiral-carousel]").forEach(c=>{c.spiralCarousel||(c.spiralCarousel=new n(c))})}window.SpiralCarousel={init:i},i()})()});var So,ko=te(()=>{So=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Mo,Co=te(()=>{Mo=`.project-dialog {
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
`});var Eo,Ao=te(()=>{Eo=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var Lo={};mi(Lo,{mountSpiral:()=>Oa,spiralControls:()=>mt,spiralDefaults:()=>Xe});function ai(t,e,r){for(let n of Po)t.removeAttribute(n);for(let[n,i]of Object.entries(e.imageAttrs||{}))Po.has(n)&&i!=null&&t.setAttribute(n,String(i));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&r?.(t)}function ri(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function Oa(t){let{host:e,onChange:r=()=>{},loadImage:n}=t,i=t.items.filter(q=>q.src||q.title||q.description||q.link),o={...Xe,...t.options},c=!1;if(!i.length){let q=document.createElement("p");return q.className="gc-spiral-empty",q.textContent="Add content to this source to preview the spiral.",e.append(q),{destroy(){q.remove()}}}let s=document.createElement("div");s.className="gc-spiral-root reference-carousel-shell";let a=document.createElement("div");a.className="orbit-carousel spiral-carousel slot-carousel",a.dataset.spiralCarousel="",a.id=`gc-spiral-${++Na}`,a.setAttribute("role","region"),a.setAttribute("aria-label","Spiral gallery"),a.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let h=a.querySelector(".orbit-stage"),f=a.querySelector(".orbit-ring"),m=a.querySelector("[data-orbit-toggle]");_e(a.querySelector("[data-orbit-prev]"),"previous"),_e(a.querySelector("[data-orbit-next]"),"next"),_e(m,"playback");let w=a.querySelector(".gc-spiral-caption"),x=document.createElement("div");x.className="gc-spiral-caption-space",w.before(x),x.append(w);let d=i.some(q=>!!q.title);for(let q of new Set(i.map(U=>U.title).filter(Boolean))){let U=w.cloneNode(!1);U.setAttribute("aria-hidden","true"),U.classList.add("gc-spiral-caption-measure"),U.textContent=q,x.append(U)}let y=document.createElement("div");y.className="gc-item-details",x.after(y);let S=i.map(q=>{let U=document.createElement("div");U.className="gc-item-detail";let N=document.createElement("p");N.className="gc-item-description",N.textContent=qt(q.description);let O=document.createElement("a"),z=ri(q.link);return z&&(O.href=z),O.textContent=q.buttonLabel||"Open link",U.append(N,O),y.append(U),{group:U,body:N,link:O,href:z}}),u="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),g=[];i.forEach((q,U)=>{let N=document.createElement("button");N.className="orbit-card",N.type="button",N.dataset.title=q.title||"",N.dataset.imageSource=q.src||u,N.setAttribute("aria-label",q.title?`View ${q.title}`:`View image ${U+1}`);let O=document.createElement("span");O.className="orbit-surface";let z=document.createElement("img");q.src?ai(z,q):z.src=u,g.push(N),N.dataset.buttonLink=ri(q.link)||"",O.append(z),N.append(O),f.append(N)}),s.append(a),e.append(s);let b=new Map,I=0,j="";async function v(){let q=JSON.stringify(o);if(j===q)return;j=q;let U=++I,N=i.some($=>zt($,o));if(a.dataset.composite=String(N),!N){for(let[$,ae]of g.entries())if(ae.artwork=null,ae.buttonBounds=null,ae.hasAttribute("data-artwork")){for(let Y of f.querySelectorAll('[data-slide-index="'+$+'"] img'))Y.src=i[$].src||u;ae.removeAttribute("data-artwork")}return}let O=$=>!$||!o.showImage?null:(b.has($)||b.set($,new Promise(ae=>{let Y=new Image;Y.crossOrigin="anonymous",Y.onload=()=>ae(Y),Y.onerror=()=>ae(null),Y.src=$})),b.get($));if(await new Promise(requestAnimationFrame),c||U!==I)return;let z=await Promise.all(i.map(async $=>({item:{...$,plain:qt($.description)},image:await O($.src)})));if(c||U!==I)return;let G=o.typeSource==="native"?e.closest(".user-items-list-section"):null,H=getComputedStyle(G?.querySelector(".list-item-content__title")||w),K=getComputedStyle(G?.querySelector(".list-item-content__description p")||S[0].body),ie=getComputedStyle(e).color,F=Fi(z,o,{family:H.fontFamily,bodyFamily:K.fontFamily,ink:ie,titleSize:parseFloat(H.fontSize)||16,titleWeight:H.fontWeight,size:parseFloat(K.fontSize)||16,weight:K.fontWeight,accent:getComputedStyle(m).color,buttonInk:getComputedStyle(m).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(m).backgroundColor});F.forEach(({canvas:$,buttonBounds:ae},Y)=>{if(g[Y].artwork=$,g[Y].buttonBounds=ae,g[Y].setAttribute("data-artwork",""),a.dataset.renderer!=="webgl"){let se=$.toDataURL();for(let ue of a.querySelectorAll('.orbit-card[data-slide-index="'+Y+'"] img'))ue.src=se}}),f.querySelectorAll("[data-repeat]").forEach($=>{let ae=g[Number($.dataset.slideIndex)];$.buttonBounds=ae?.buttonBounds}),a.dataset.cardAspect=String(F[0].aspect),a.style.setProperty("--gc-art-aspect",F[0].aspect),a.dispatchEvent(new Event("artwork-change"))}let C=qi(s,a.id),E=()=>{let q=o.textPlacement==="card",U=i.some(N=>zt(N,o));C({...o,shadowEnabled:o.shadowEnabled&&!U,imageTint:o.overlayEnabled&&!U?o.imageTint:"#00000000"}),o.titleCustom?e.dataset.gcTitlePalette=o.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),x.style.textAlign=o.titleAlign,s.style.setProperty("--gc-card-inset",o.carouselPadding+"px"),a.style.padding=o.carouselPadding+"px",a.style.overflow=o.surfaceRadius?"hidden":"",a.style.borderRadius=o.surfaceRadius+"px",a.style.backgroundColor=o.surfaceEnabled?o.surfaceColor:"",a.style.setProperty("--gc-hover-time",o.hoverDuration+"ms"),a.dataset.hoverDuration=o.hoverDuration,a.dataset.mirrorColor=o.mirrorOverlay?o.mirrorColor:"#00000000",a.dataset.playbackMode=o.playbackMode,a.dataset.rate=o.cardsPerMinute,a.dataset.interval=o.duration,a.dataset.direction=o.direction,a.dataset.pauseOnHover=String(o.pauseOnHover),a.dataset.customControlSize=String(!!(o.controlPadding||o.controlIconSize)),a.dataset.hideControlBackground=String(!o.controlBackground),a.style.setProperty("--gc-icon-size",o.controlIconSize?o.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),a.style.setProperty("--gc-button-padding",o.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let N of x.children)N.style.textAlign=o.titleCustom?o.titleAlign:"",N.style.marginBottom=o.titleGap?o.titleGap+"px":"";for(let{body:N,link:O}of S)N.style.textAlign=o.bodyCustom?o.descriptionAlign:"",N.style.fontWeight=o.bodyCustom?o.descriptionWeight:"",N.style.color=o.bodyCustom&&o.descriptionCustom?o.descriptionColor:"inherit",N.style.fontSize=o.bodyCustom&&o.descriptionSize?o.descriptionSize+"rem":"",O.style.marginTop=o.buttonGap+"px";a.dataset.showImage=String(o.showImage!==!1),a.dataset.imageTint=o.overlayEnabled?o.imageTint:"#00000000",a.dataset.hoverEffect=o.reducedMotion?"none":o.hoverEffect,a.dataset.hoverAmount=o.hoverAmount;for(let[N,{body:O,link:z,href:G}]of S.entries())O.hidden=!o.showDescription||!O.textContent,z.hidden=!o.showButton||!G||!i[N].buttonLabel;y.hidden=q||S.every(({body:N,link:O})=>N.hidden&&O.hidden),a.dataset.edgeMode=o.edgeMode,a.dataset.backFace=o.backFace,a.dataset.cornerRadius=o.spiralRadius,a.dataset.borderWidth=o.cardBorderEnabled?o.borderWidth:0,a.dataset.borderColor=o.spiralRim,a.dataset.backColor=o.backColor,a.style.setProperty("--orbit-card-radius",o.spiralRadius+"px"),a.style.setProperty("--orbit-rim",o.spiralRim),s.style.width=`${Je(o.containerWidth,100,20,100)}%`,h.style.height=o.heightMode==="viewport"?Je(o.viewportHeight,65,15,100)+"vh":o.heightMode==="auto"?"clamp(160px,calc("+o.cardWidth+"px + "+o.spiralRise*4+"px),90svh)":Je(o.stageHeight,680,120,1600)+"px",a.style.setProperty("--orbit-card-width",`${Je(o.cardWidth,280,80,720)}px`),a.dataset.spiralWidth=String(Je(o.spiralWidth,87,20,100)),a.dataset.cardWidth=String(Je(o.cardWidth,280,80,720)),a.dataset.rise=String(Je(o.spiralRise,52,o.spiralRiseUnit==="percent"?1:8,o.spiralRiseUnit==="percent"?50:500)),a.dataset.riseUnit=o.spiralRiseUnit==="percent"?"percent":"px",(!g[0].artwork||!i.some(N=>zt(N,o)))&&(a.dataset.cardAspect=String(Ha(o.aspectRatio))),a.dataset.imageFit=o.fit==="contain"||o.fit==="fit"?"fit":"fill",a.dataset.imagePadding=String(Je(o.imagePadding,0,0,20)),a.dataset.slotGap=String(Je(o.spiralGap,3,0,16)),a.dataset.showSlots=String(!!o.showSlots),x.hidden=q||!o.showTitles||!d,v(),a.classList.toggle("gc-spiral-reduced",!!o.reducedMotion)};E();let W=i.map(q=>({title:q.title||"",category:"",description:qt(q.description),services:[],notes:[],gallery:[{file:q.src||u,label:"Image"}]}));class D extends jt{constructor(U,N){super(U,N,W),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(U){let N=i[U];if(!N||o.clickAction==="none"||o.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let O=ri(N.link);if(o.clickAction==="link"||o.clickAction==="source"){O&&location.assign(O);return}if(N.postUrl){t.openPost(N,U);return}super.open(U);let z=this.dialog.querySelector(".project-title");z.hidden=!N.title||!o.popupTitle,z.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",z.id),this.dialog.querySelector(".project-summary").hidden=!o.popupDescription||!qt(N.description),this.dialog.querySelector(".project-gallery").hidden=!o.popupImage||!N.src,this.dialog.querySelector(".project-frame-label").hidden=!o.popupTitle,this.dialog.querySelector(".project-info").hidden=z.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(O&&o.popupButton),this.sourceLink.hidden=!O||!o.popupButton,O?(this.sourceLink.href=O,this.sourceLink.textContent=N.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!o.reducedMotion)}showFrame(U){super.showFrame(U);let N=W.indexOf(this.project),O=i[N];O?.src&&(ai(this.image,O,n),this.dialog.querySelectorAll(".project-thumbnail img").forEach(z=>ai(z,O,n)),this.dialog.querySelector(".project-frame-label").textContent=O.title||"")}}let M=window.ProjectViewer;window.ProjectViewer=D;try{Da.init(s)}finally{M===void 0?delete window.ProjectViewer:window.ProjectViewer=M}let R=a.spiralCarousel;a.querySelectorAll("img").forEach(q=>n?.(q));let L=()=>{for(let[q,U]of g.entries()){if(!U.artwork)continue;let N=U.artwork.toDataURL();for(let O of f.querySelectorAll('[data-slide-index="'+q+'"] img'))O.src=N}};h.addEventListener("webglcontextlost",L,!0);let oe=R.updateActive;R.updateActive=function(q){oe.call(this,q),S.forEach(({group:U},N)=>{U.inert=N!==q,U.style.visibility=N===q?"visible":"hidden"}),this.status.textContent=`${i[q]?.title?`${i[q].title}, `:""}image ${q+1} of ${i.length}`,r(q)},R.updateActive(R.active);let _=R.animateTo;R.animateTo=function(q,U=0){o.reducedMotion?(this.target=Math.round(q),this.settleImmediately()):_.call(this,q,U)};let ge=vo(R,{textureSource:q=>q.dataset.imageSource}),X=Ni(a,R,{pauseOnHover:!1,interactionRestMs:0});function ce(q){o.autoplay=!!q,R.manuallyPaused=!q||!!o.reducedMotion,R.resumeAt=0,m.disabled=!!o.reducedMotion||R.reducedMotion.matches||i.length<2,m.dataset.paused=String(R.manuallyPaused),m.setAttribute("aria-label",R.manuallyPaused?"Resume carousel":"Pause carousel"),R.syncAutoplay()}return ce(!!o.autoplay),{update(q){let U=o;o={...o,...q},E(),R.measure(),a.dispatchEvent(new Event("playground-change")),a.dispatchEvent(new Event("slot-guides-change")),R.updateActive(R.active),(U.autoplay!==o.autoplay||U.reducedMotion!==o.reducedMotion)&&ce(!!o.autoplay)},goTo(q){c||R.goTo(q)},setPlaying:ce,getMetrics(){try{return JSON.parse(a.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return a.dataset.renderer||"loading"},destroy(){c||(c=!0,h.removeEventListener("webglcontextlost",L,!0),X(),ge(),R.destroy(),s.remove())}}}var Da,Na,Je,Ha,qt,Po,zo=te(async()=>{Ri();Bi();Di();Lt();Tt();Tt();Hi();await xo();wo();Da=window.SpiralCarousel,Na=0,Je=(t,e,r,n)=>Number.isFinite(Number(t))?Math.max(r,Math.min(n,Number(t))):e,Ha=t=>{if(typeof t=="number"&&t>0)return t;let[e,r]=String(t||"16:9").split(":").map(Number);return e>0&&r>0?e/r:16/9},qt=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Po=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function jo(t){let{host:e}=t,r={...t.options},n=null,i=null,o=!1,c="loading",s=document.createElement("p");return s.className="gc-empty",s.setAttribute("role","status"),s.textContent="Loading spiral\u2026",e.append(s),zo().then(()=>Lo).then(a=>{o||(s.remove(),i=a.mountSpiral({...t,options:r}),n!==null&&i.goTo?.(n))}).catch(a=>{o||(c="error",s.textContent="The spiral could not load.",e.replaceChildren(s),console.warn("Gallery Studio: spiral unavailable",a))}),{update(a){r={...r,...a},i?.update?.(r)},goTo(a){n=a,i?.goTo?.(a)},setPlaying(a){r.autoplay=a,i?.setPlaying?.(a)},getStatus(){return i?.getStatus?.()??c},getMetrics(){return i?.getMetrics?.()??null},destroy(){o=!0,s.remove(),i?.destroy()}}}var To=te(()=>{});function dt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let r=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(r.protocol)?r.href:""}catch{return""}}function Wt(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(r=>r.remove()),e.content.querySelectorAll("*").forEach(r=>{for(let n of[...r.attributes])(/^on/i.test(n.name)||n.name==="style"||n.name==="id")&&r.removeAttribute(n.name);if(r.hasAttribute("href")){let n=dt(r.getAttribute("href"));n?r.setAttribute("href",n):r.removeAttribute("href")}}),e.innerHTML}function Io(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let r of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(r)&&(e[r]=t.getAttribute(r));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function vt(t,e){let r=Bt[e];if(!t||!r)return null;let n=t.closest(r);if(!n){let a=t.querySelectorAll(r);if(a.length!==1)return null;n=a[0]}let i=e==="list"?n:n.querySelector(":scope > .sqs-block-content");if(!i)return null;let o=a=>Array.from(i.querySelectorAll(a)).filter(h=>h.closest(r)===n&&(!h.closest(".gc-embed")||h.hasAttribute("data-gc-native-track")));if(e==="summary"){let a=o(".summary-block-wrapper");if(a.length!==1)return null;let h=o(".summary-item").filter(f=>a[0].contains(f)&&!f.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:n,originals:a,rows:h}}let c=e==="list"?".list-item":".slide",s=o(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!s.length&&(s=o(".sqs-gallery")),s.length===1){let a=Array.from(s[0].querySelectorAll(c)).filter(h=>h.closest(r)===n&&!h.hasAttribute("data-gc-repeat"));return{source:n,originals:s,rows:a}}if(e==="gallery"&&!s.length){let a=o(c);if(a.length&&a.every(h=>h.parentElement===a[0].parentElement))return{source:n,originals:a,rows:a}}return null}function pt(t,e,r=location.href){return(vt(t,e)?.rows||[]).map(i=>{let o=i.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let h=i.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),f=dt(h?.getAttribute("href"),r);return{...Io(o),title:i.querySelector(".summary-title")?.textContent.trim()||o?.alt||"",description:Wt(i.querySelector(".summary-excerpt")?.innerHTML),link:f,postUrl:f,buttonLabel:"Read post"}}let c=i.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",s=Wt(i.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),a=i.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Io(o),title:c,description:s,link:dt(a?.getAttribute("href"),r),buttonLabel:e==="list"&&a?.textContent.trim()||""}}).filter(i=>e==="summary"?!!i.link:e==="list"||!!(i.src||i.title||i.link))}function $a(t,e){let r=e==="list"?t.getAttribute("data-section-id"):t.id;if(!r?.trim())return"";let n=e==="list"?'section[data-section-id="'+CSS.escape(r)+'"]':"#"+CSS.escape(r);return t.ownerDocument.querySelectorAll(n).length===1?n:""}function Fo(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Bt).join(","))).filter(r=>!r.closest(".gc-embed")).flatMap(r=>{let n=r.matches(Bt.list)?"list":r.matches(Bt.summary)?"summary":"gallery",i=$a(r,n);if(!i||!vt(r,n))return[];let o=++e[n];return{name:(n==="list"?"List Section":n==="summary"?"Summary Block":"Gallery Block")+(o>1?" "+o:""),type:n,selector:i,root:r,items:pt(r,n)}})}function Dt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let r=t.ownerDocument.defaultView?.ImageLoader;if(r&&typeof r.load=="function")try{r.load(t,{load:!0})}catch(n){console.warn("Gallery Studio: native image loader",n)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Ro(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Ro(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function ni(t){let e=document.createElement("img");for(let[r,n]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(r)&&e.setAttribute(r,n);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Ro(t.imageAttrs?.["data-image-focal-point"]),e}var Bt,si=te(()=>{Bt={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function qo(t,e,r){let n=new WeakMap,i=new WeakMap,o=Array.from(e.childNodes),c=r.map(S=>Array.from(S.childNodes)),s=[];function a(S,u){S&&s.push([S,u.map(g=>[g,S.getAttribute(g)])])}let h=new Set,f=!1;function m(){a(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let S of r)a(S,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),f=!0}function w(S,u,g,b,I){let j=r[u],v=h.has(u),C=v?j.cloneNode(!1):j,E=document.createElement("div");if(E.className="gc-card gc-native-card",E.tabIndex=0,E.setAttribute("role","group"),S.imageAttrs?.["data-image-focal-point"]){let[_,ge]=S.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(_)&&Number.isFinite(ge)&&E.style.setProperty("--gc-native-focus",_*100+"% "+ge*100+"%")}let W=S.title||S.alt||`Item ${u+1}`;if(E.setAttribute("aria-label",W),v){C.removeAttribute("id"),C.setAttribute("data-gc-repeat","");for(let _ of c[u])E.append(_.cloneNode(!0));E.querySelectorAll("[id]").forEach(_=>_.removeAttribute("id"))}else h.add(u),E.append(...c[u]);C.replaceChildren(E),n.set(E,C);let D=E.querySelector(".list-item-media"),M=E.querySelector(".list-item-content"),R=E.querySelector(".list-item-content__title"),L=E.querySelector(".list-item-content__description");if(!v){for(let _ of[D,M])a(_,["class"]);for(let _ of[R,L])a(_,["class","hidden"])}if(D?.classList.add("gc-card-media"),M?.classList.add("gc-card-copy"),b.typeSource!=="native"&&(R?.classList.add("gc-card-title"),L?.classList.add("gc-card-description")),R&&(!b.showTitles||g.caption===!1)&&(R.hidden=!0),L&&!g.description&&(L.hidden=!0),g.thumbnail){let _=E.querySelector(".list-item-content__button-wrapper")||E.querySelector(".list-item-content__button");_&&(v||a(_,["hidden"]),_.hidden=!0),M&&(!S.title||g.caption===!1)&&(v||a(M,["hidden"]),M.hidden=!0)}let oe=Array.from(E.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!v)for(let _ of oe)a(_,["tabindex"]);if(i.set(E,oe.map(_=>[_,_.getAttribute("tabindex")])),b.clickAction!=="none"&&(b.clickAction!=="link"||S.link)){let _=document.createElement("button");_.type="button",_.className="gc-native-action",_.tabIndex=-1,_.setAttribute("aria-label",(b.clickAction==="link"?"Open link for ":"Open ")+W),_.addEventListener("click",()=>I(S,u)),E.append(_),E.setAttribute("aria-keyshortcuts","Enter Space"),E.addEventListener("click",ge=>{ge.defaultPrevented||ge.target.closest("a,button,input,select,textarea,label")||I(S,u)}),E.addEventListener("keydown",ge=>{ge.target!==E||!["Enter"," "].includes(ge.key)||(ge.preventDefault(),_.click())})}return E}function x(S){let u=S.tabIndex===0&&S.getAttribute("aria-hidden")!=="true";for(let[g,b]of i.get(S)||[]){let I=u?b:"-1";g.getAttribute("tabindex")!==I&&(I===null?g.removeAttribute("tabindex"):g.setAttribute("tabindex",I))}}function d(S){if(!f)return;let u=S!=="native";e.querySelectorAll(".list-item-content__title").forEach(g=>g.classList.toggle("gc-card-title",u)),e.querySelectorAll(".list-item-content__description").forEach(g=>g.classList.toggle("gc-card-description",u))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!f){r.forEach((S,u)=>S.replaceChildren(...c[u])),e.replaceChildren(...o);for(let[S,u]of s)for(let[g,b]of u)S.getAttribute(g)!==b&&(b===null?S.removeAttribute(g):S.setAttribute(g,b));t.after(e),s.length=0,h.clear(),f=!1}}return{track:e,begin:m,makeCard:w,slot:S=>n.get(S),syncFocus:x,setType:d,restore:y}}var Bo=te(()=>{});function Wo(t,e,r){if(!r.closest(".fluid-engine > .fe-block"))return()=>{};r.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let i=0,o=!1,c=new WeakSet,s=w=>{w&&!c.has(w)&&(c.add(w),h.observe(w))},a=()=>{!i&&!o&&(i=requestAnimationFrame(m))},h=new ResizeObserver(a),f=new MutationObserver(a);function m(){if(i=0,o||!e.isConnected)return;let w=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!w)return;let x=w.classList.contains("gc-carousel-stage"),d=w.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),s(d),s(w);let y=0;for(let u of d.children){if(u===w||u.contains(w))continue;s(u);let g=getComputedStyle(u);g.display==="none"||["absolute","fixed"].includes(g.position)||(y+=u.offsetHeight+(parseFloat(g.marginTop)||0)+(parseFloat(g.marginBottom)||0))}let S=Math.max(1,t.clientHeight-y);if(x){let u=w.parentElement;u.classList.contains("gc-block-stage-window")||(u=document.createElement("div"),u.className="gc-block-stage-window",w.before(u),u.append(w));let g=Math.min(1,S/Math.max(1,w.offsetHeight));u.style.height=S+"px",w.style.setProperty("--gc-block-scale",String(g)),w.style.setProperty("--gc-block-top",Math.max(0,(S-w.offsetHeight*g)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",S+"px")}return s(t),f.observe(e,{childList:!0,subtree:!0}),a(),()=>{o=!0,cancelAnimationFrame(i),h.disconnect(),f.disconnect(),r.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let w=e.querySelector(".gc-block-stage-window");if(w){let x=w.firstElementChild;x.style.removeProperty("--gc-block-scale"),x.style.removeProperty("--gc-block-top"),w.replaceWith(x)}}}var Do=te(()=>{});function No(t,e,r,n){let i=r.ownerDocument,o=i.defaultView,c=n!=="list"?r.closest(".fluid-engine > .fe-block"):null;c?.classList.add("gc-viewport-cell");let s=[],a=c||r;for(let m=t.parentElement;m&&(["hidden","clip","auto","scroll"].includes(o.getComputedStyle(m).overflowX)&&s.push(m),m!==a);m=m.parentElement);function h(){let m=i.documentElement.clientWidth;if(!m||!t.isConnected||!t.getClientRects().length)return;for(let d of s){let y=d.getBoundingClientRect().left+o.scrollX+d.clientLeft,S=y>.5||y+d.clientWidth<m-.5;d.classList.toggle("gc-viewport-unclip",S)}let w=-(t.getBoundingClientRect().left+o.scrollX),x=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};x("--gc-viewport-width",m+"px"),x("--gc-viewport-offset",w+"px")}h();let f=o.ResizeObserver?new o.ResizeObserver(h):null;return f?.observe(t),f?.observe(i.documentElement),o.addEventListener("resize",h),()=>{f?.disconnect(),o.removeEventListener("resize",h);for(let m of s)m.classList.remove("gc-viewport-unclip");c?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var Ho=te(()=>{});var $o,Oo=te(()=>{$o=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function Go(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let n=document.createElement("style");n.id="gc-finish-css",n.textContent=$o,document.head.append(n)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let r={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[n,i]of Object.entries(r))t.style.setProperty(n,i);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var ci,Uo=te(()=>{Oo();ci={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function _o(t,e){let r=t.classList.contains("gc-embed"),n=r&&e.colorSource==="section";n?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,r&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let i=t.style;i.setProperty("--gc-custom-background",e.background),i.setProperty("--gc-custom-ink",e.ink),i.setProperty("--gc-custom-accent",e.accent),i.setProperty("--gc-background",n?"var(--gc-section-surface)":e.background),i.setProperty("--gc-ink",n?"var(--gc-section-body)":e.ink),i.setProperty("--gc-accent",n?"var(--gc-section-action)":e.accent),i.setProperty("--gc-muted",n?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),i.setProperty("--gc-spatial-surface","var(--gc-background)"),i.setProperty("--gc-spatial-ink","var(--gc-ink)"),n&&(i.setProperty("--gc-line-color","var(--gc-section-line)"),i.setProperty("--gc-tint","var(--gc-section-body)")),i.background=n?"transparent":e.background,i.color=n?"var(--gc-section-body)":e.ink;for(let o of t.querySelectorAll(":scope > dialog"))Xo(t,o)}function Xo(t,e){for(let r of["gcColorSource","gcTypeSource"])t.dataset[r]?e.dataset[r]=t.dataset[r]:delete e.dataset[r]}function li(t,e){let r=t.classList.contains("gc-embed")?t:t.ownerDocument.body;Xo(t,e),e.parentElement!==r&&r.append(e)}var Yo=te(()=>{});var Ko,Vo=te(()=>{Ko=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var Zo,Jo=te(()=>{Zo=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var ea,Qo=te(()=>{ea=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var ia,ta=te(()=>{ia=`.gc-carousel {
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
`});var aa,oa=te(()=>{aa=`.gc-spatial {
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
`});function tt(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Nt(t,e){let r=tt(e.preset??t.preset),n=r===tt(t.preset)?t.stageHeight:r?0:590;return{...e.preset==="spiral"?Xe:{},...t,...e,stageHeight:e.stageHeight??n}}function ra(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function na(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[Ko,Zo,ea].join(`
`),document.head.append(e));let r=ra(t);if(r==="common")return()=>{};let n=`gc-runtime-${r}-css`,i=document.getElementById(n);i||(i=document.createElement("style"),i.id=n,r==="carousel"?i.textContent=ia:r==="spatial"?i.textContent=aa:i.textContent=[So,yo,Mo,Eo].join(`
`),e.after(i)),i.dataset.gcOwners=String(Number(i.dataset.gcOwners||0)+1);let o=!1;return()=>{if(o)return;o=!0;let c=Number(i.dataset.gcOwners)-1;c>0?i.dataset.gcOwners=String(c):i.remove()}}function Ka(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function sa(t,e,r={},n=null){let i=Nt(nt,r),o=null,c=null,s=null,a=0,h=0,f,m;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function w(){c&&(c.close(),c.remove(),c=null,o?.setSuspended?.(!1),s?.focus({preventScroll:!0}))}function x(v,C){if(i.clickAction==="none")return;if(i.clickAction==="link"){let L=dt(v.link);L&&window.open(L,"_blank","noopener,noreferrer");return}s=document.activeElement,c&&w(),c=document.createElement("dialog"),c.className="gc-dialog"+(i.preset==="showcase"?" gc-dialog-drawer":""),c.setAttribute("aria-label",v.title||"Image preview");let E=document.createElement("button");E.className="gc-dialog-close",E.type="button",E.textContent="Close \xD7",E.addEventListener("click",w);let W=document.createElement("div");W.className="gc-dialog-content";let D=document.createElement("div");D.className="gc-dialog-media",v.src&&i.popupImage!==!1&&(D.append(ni(v)),W.append(D));let M=document.createElement("div");if(M.className="gc-dialog-copy",v.title&&i.popupTitle!==!1){let L=document.createElement("h2");L.textContent=v.title,M.append(L)}if(v.postUrl&&i.popupDescription!==!1){let L=document.createElement("article");M.append(L),Ai(L,v)}else if(v.description&&i.popupDescription!==!1){let L=document.createElement("div");L.innerHTML=Wt(v.description),M.append(L)}if(v.link&&i.popupButton!==!1){let L=document.createElement("a");L.href=dt(v.link),L.textContent=v.buttonLabel||"Open link",L.target="_blank",L.rel="noopener noreferrer",M.append(L)}let R=document.createElement("p");R.className="gc-dialog-count",R.textContent=`${C+1} / ${e.length}`,M.append(R),W.append(M),c.append(E,W),li(t,c),c.showModal(),o?.setSuspended?.(!0),Dt(D.querySelector("img")),E.focus(),c.addEventListener("cancel",L=>{L.preventDefault(),w()}),c.addEventListener("click",L=>{if(L.target===c){let oe=c.getBoundingClientRect();(L.clientX<oe.left||L.clientX>oe.right||L.clientY<oe.top||L.clientY>oe.bottom)&&w()}})}function d(v,C,E={}){if(n)return n.makeCard(v,C,E,i,x);let W=document.createElement("button");W.type="button",W.className="gc-card",W.setAttribute("aria-label",v.title||`Image ${C+1}`);let D=document.createElement("span");D.className="gc-card-media",v.src&&i.popupImage!==!1&&(D.append(ni(v)),W.append(D));let M=document.createElement("span");if(M.className="gc-card-copy",E.caption!==!1&&i.showTitles&&v.title){let R=document.createElement("span");R.className="gc-card-title",R.textContent=v.title,M.append(R)}if(E.description&&v.description){let R=document.createElement("span");R.className="gc-card-description",R.textContent=Ka(v.description),M.append(R)}return M.childNodes.length&&W.append(M),W.addEventListener("click",()=>x(v,C)),W}let y=matchMedia("(prefers-reduced-motion: reduce)"),S=matchMedia("(max-width: 660px)");function u(){let v={..._t(t,i),reducedMotion:i.reducedMotion||y.matches};if(S.matches&&(i.preset!=="spiral"||i.mobileSizing)){if(i.preset==="spiral"){for(let[C,E]of[["spiralWidth","mobileSpiralWidth"],["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])i[E]!=null&&(v[C]=i[E]);i.mobileHeightMode&&i.mobileHeightMode!=="inherit"&&(v.heightMode=i.mobileHeightMode,v.stageHeight=i.mobileStageHeight??v.stageHeight,v.viewportHeight=i.mobileViewportHeight)}i.mobileCardWidth!=null&&(v.cardWidth=i.mobileCardWidth),i.mobileGap!=null&&(v[i.preset==="spiral"?"spiralGap":"gap"]=i.mobileGap)}return v.phoneWidthOverride=S.matches&&i.mobileCardWidth!=null,i.preset==="stack"&&(v.stackCardWidth=S.matches&&i.mobileCardWidth!=null?i.mobileCardWidth:Math.max(360,i.cardWidth*2.2)),v}function g(){t.classList.toggle("gc-hide-controls",i.showControls===!1);let v=_t(t,i);Go(t,v),t.style.setProperty("--gc-fit",i.fit),t.style.setProperty("--gc-card-radius",i.radius+"px"),_o(t,v)}function b(v=0){w(),o?.destroy(),o=null,n?.restore(),cancelAnimationFrame(h),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let C=ra(i.preset);C!==f&&(m?.(),m=na(i.preset),f=C),g(),t.setAttribute("aria-label",i.previewScroll===!1?"Gallery":"Gallery preview");let E=n&&i.preset!=="spiral"?n:null;E?E.begin():n&&n.track.classList.add("gc-native-items-hidden");let W={host:t,items:e,openPost:x,initialIndex:v,nativeList:E,attachDialog:D=>li(t,D),options:u(),makeCard:d,loadImage:Dt,onChange(D){a=D,i.onChange?.(D)}};if(!e.length){let D=document.createElement("p");D.className="gc-empty",D.textContent="Add images to your source to start exploring.",t.append(D);return}i.preset==="spiral"?o=jo(W):i.preset==="stack"?o=Ti(W):["wall","ring","angled"].includes(i.preset)?(o=zi(W),v&&o.goTo(v)):o=Pi(W),i.preset!=="spiral"&&(h=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(D=>{Dt(D,{nativeCard:!!E})})))}let I=()=>b(a);function j(){i.preset!=="spiral"&&i.mobileCardWidth==null&&i.mobileGap==null||(o?.setGeometry?o.setGeometry(u()):i.preset==="spiral"?o?.update(u()):b(a))}try{b()}catch(v){throw m?.(),n?.restore(),v}return y.addEventListener("change",I),S.addEventListener("change",j),{update(v){let C=i.preset,E=u();i=Nt(i,v);let W=u(),D=Object.keys(W).filter(R=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(R)&&W[R]!==E[R]);if(!D.length)return;if(o?.setGeometry&&D.every(R=>["cardWidth","gap","phoneWidthOverride"].includes(R))){o.setGeometry(W);return}let M=R=>["colorSource","typeSource","background","ink","accent"].includes(R);if(D.every(R=>M(R)||C!=="spiral"&&(R==="radius"||Object.hasOwn(ci,R)))){g(),D.includes("typeSource")&&n?.setType(i.typeSource);return}C==="spiral"&&i.preset==="spiral"&&o?.update?(g(),o.update(W)):b(C===i.preset?a:0)},goTo(v){o?.goTo?.(v)},setPlaying(v){i.autoplay=v,o?.setPlaying?.(v)},getOptions(){return{...i}},getActive(){return a},destroy(){w(),cancelAnimationFrame(h),o?.destroy(),n?.restore(),y.removeEventListener("change",I),S.removeEventListener("change",j),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),m?.()}}}function Ja(t,e){let r=e.closest("section")||e,n=[];for(let i=t.parentElement;i;i=i.parentElement){let o=Le.scrollBoundaries.get(i)||0;if((o||["hidden","auto","scroll","overlay"].includes(getComputedStyle(i).overflowY))&&(Le.scrollBoundaries.set(i,o+1),i.classList.add("gc-stack-page-scroll"),n.push(i)),i===r)break}return()=>{for(let i of n){let o=Le.scrollBoundaries.get(i)-1;o?Le.scrollBoundaries.set(i,o):(Le.scrollBoundaries.delete(i),i.classList.remove("gc-stack-page-scroll"))}}}function gt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function di(t){if(!Le.editListeners?.size){Le.editListeners=new Set;let e=gt();Le.editObserver=new MutationObserver(()=>{let r=gt();if(r!==e){e=r;for(let n of Le.editListeners)try{n(r)}catch(i){console.warn("Gallery Studio: could not resume a list layout.",i)}}});for(let r of[document.body,document.documentElement])Le.editObserver.observe(r,{attributes:!0,attributeFilter:["class"]})}return Le.editListeners.add(t),()=>{Le.editListeners.delete(t),Le.editListeners.size||Le.editObserver.disconnect()}}function pi({selector:t,type:e="gallery",options:r={}}={}){let n=t;if(typeof t=="string")try{let L=document.querySelectorAll(t);if(L.length!==1)return null;n=L[0]}catch{return null}if(!n?.isConnected||typeof n.closest!="function")return null;let i=vt(n,e);if(!i)return null;let{source:o}=i,c=Le.mounts.get(o);if(c)return c.instance.update(r),c;if(!pt(o,e).length)return null;let s=document.createElement("div"),a=document.createElement("div");s.dataset.sourceType=e,s.className="gc-embed",a.className="gc-viewport-slot",a.append(s);let h={...Nt(nt,r),previewScroll:!1},f=null,m=null,w=null,x=null,d=null,y=!1,S=[],u=null,g=!1,b=null;function I(){h.galleryWidth==="source"?(w?.(),w=null,u&&(a.classList.add("user-items-list-simple"),a.dataset.layoutWidth=u.mode,a.style.maxWidth=u.maximum)):w||(a.classList.remove("user-items-list-simple"),delete a.dataset.layoutWidth,a.style.removeProperty("max-width"),w=No(a,s,o,e))}function j(){return e!=="list"&&h.preset!=="stack"&&h.galleryHeight!=="custom"&&!!o.closest(".fluid-engine > .fe-block")}function v(){j()?x||(x=Wo(a,s,o)):(x?.(),x=null)}function C(L){L==="stack"?m||(m=Ja(s,o)):m&&(m(),m=null)}function E(){try{f?.destroy()}finally{f=null,x?.(),x=null,C(null),w?.(),w=null,S.forEach(L=>L.classList.remove("gc-native-items-hidden")),S=[],b?.remove(),b=null,a.remove(),a.replaceChildren(s),s.inert=!1}}function W(){if(y||f||!o.isConnected)return;let L=vt(o,e),oe=pt(o,e);if(!L||!oe.length)return;L.originals[0].before(a),na();let _=L.originals[0];u=e==="list"?{mode:_.dataset.layoutWidth||"full",maximum:_.style.maxWidth}:null,I();let ge=null;if(e==="list"){let X=g?_.cloneNode(!0):_;g&&(b=X,X.removeAttribute("id"),X.querySelectorAll("[id]").forEach(ce=>ce.removeAttribute("id")),a.append(X)),ge=qo(a,X,g?[...X.querySelectorAll(".list-item")]:L.rows)}(!ge||g)&&(S=L.originals,S.forEach(X=>X.classList.add("gc-native-items-hidden"))),v(),C(h.preset),f=sa(s,oe,h,ge),s.inert=g}function D(){if(!y){y=!0,o.classList.remove("gc-edit-preview");try{E()}finally{d?.(),Le.mounts.delete(o)}}}let R={instance:{update(L={}){if(y)return;let oe=h.galleryWidth;h={...Nt(h,L),previewScroll:!1},f&&(h.galleryWidth!==oe&&I(),v(),C(h.preset),f.update(h))},setEditPreview(L){if(!(y||!gt()||L===g)){if(g=L,o.classList.toggle("gc-edit-preview",L),!L){E();return}try{W()}catch(oe){throw this.setEditPreview(!1),oe}}},goTo(L){f?.goTo(L)},setPlaying(L){h.autoplay=L,f?.setPlaying(L)},getOptions(){return{...h}},getActive(){return f?.getActive()??0},destroy:D},host:s,source:o,destroy:D};try{d=di(L=>{if((g||L)&&E(),g=!1,o.classList.remove("gc-edit-preview"),!L)try{W()}catch(oe){throw E(),oe}}),gt()||W(),Le.mounts.set(o,R)}catch(L){throw D(),L}return R}var xt,nt,Le,gi=te(()=>{Xt();Ei();Li();ji();Ii();To();Tt();si();Bo();Do();Ho();Uo();Yo();Vo();Jo();Qo();ta();oa();Ao();ko();Co();bo();xt=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],nt={...Et,...ci,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};Le=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:sa,embed:pi,presets:xt}});var la,ca=te(()=>{la=`:host {
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
.field-checkbox input { width: 17px; height: 17px; margin: 0; accent-color: var(--gc-panel-accent); }
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
.paint-row,.type-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:36px}
.type-heading{padding:10px 12px;font-weight:600}
.type-heading .field{width:auto;display:flex;gap:8px;margin:0}
.paint-trigger{width:32px;height:32px;border:1px solid var(--gc-panel-border);background:#efefea;padding:5px;border-radius:6px}
.paint-trigger::after{content:"";display:block;height:100%;background:var(--chip);opacity:var(--alpha);border-radius:50%}
.paint-popup{position:fixed;inset:auto;margin:0;width:min(260px,calc(100vw - 16px));max-height:calc(100dvh - 16px);overflow:auto;border:1px solid var(--gc-panel-border);border-radius:12px;padding:12px;background:#fafaf7;color:#20231e;box-shadow:0 5px 20px #17261d25}
.paint-popup .field-palette>.field-label{display:none}
.paint-popup .field-palette{display:block}
.group-body .field[data-subsetting],.group-body .paint-row{margin-inline-start:10px}
`});function Q(t,e,r){let n=document.createElement(t);return e&&(n.className=e),r!==void 0&&(n.textContent=r),n}function ze(t,e,r){let n=Q("button",t,e);return n.type="button",r&&n.setAttribute("aria-label",r),n}function da(t){let e=Q("span","select-box");return e.append(t),e}function je(t,e,r,n,i,o=""){return{key:t,label:e,type:"range",min:r,max:n,step:i,unit:o}}function Ye(t,e,r){return{key:t,label:e,type:"select",choices:Object.entries(r).map(([n,i])=>({value:n,label:i}))}}function st(t,e,r){return{key:t,label:e,type:"color",when:r,independent:!0}}function ui(t,e){let r=t.preset,n=tt(r),i=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,r==="timed"?960:r==="spiral"?720:560,1,"px"),je("stageHeight",n?"Minimum gallery height":"Gallery height",n?0:300,1200,1,"px")];if(e!=="list"&&(i.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&i.splice(i.findIndex(a=>a.key==="stageHeight"),1)),r==="spiral")i.push(...mt);else if(i.push(je("gap","Spacing",0,100,1,"px")),r!=="infinite"&&r!=="timed"){let a={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[r]||"Depth";i.push(je("depth",a,0,100,1))}let o=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":r==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(r==="arc-tabs"||r==="timed")&&o.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),r!=="stack"&&(o.push({key:"showControls",label:"Show controls",type:"checkbox"}),o.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),r!=="spiral"&&o.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),o.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let c=Gt.has(r),s=[{title:"Size & spacing",fields:i},{title:"Mobile overrides",fields:[{...i.find(a=>a.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...i.find(a=>a.key===(r==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:r==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:o},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:Qa},...r==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),st("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(r)?[Ye("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),st("backColor","Back color",["backFace","solid"])]:[],...r==="stack"?[]:[Ye("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...c?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...r==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ye("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ye("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ye("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),st("controlFill","Button background",["controlPalette","custom"]),st("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...c?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(a=>({value:a,label:a+" rem"}))]}],Ye("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ye("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),st("titleColor","Custom title color",["titlePalette","custom"])]},...c?Ci({range:je,select:Ye,swatch:st}):[]];if(r==="spiral"){s=Si(t,e,{range:je,select:Ye,swatch:st},s);for(let a of s){if(a.title==="Mobile")for(let h of a.fields.slice(1))h.condition=f=>f.mobileSizing,h.mobileRange=!!h.inherits;a.switchKey&&a.fields.unshift({key:a.switchKey,label:"Custom",type:"checkbox"}),a.switchKey&&a.fields.slice(1).forEach(h=>h.when=[a.switchKey,!0])}}if(c)for(let a of s)a.fields=a.fields.flatMap(h=>{if(h.type!=="color"||!Pt.includes(h.key))return[h];let f=h.when||(h.independent?void 0:["colorSource","custom"]);return[{...Ye(h.key+"Swatch",h.label+" palette",{custom:"Custom",...Ut}),type:"palette",when:f,condition:h.condition},{...h,when:f,condition:h.condition,customFor:h.key+"Swatch"},{...je(h.key+"Opacity",h.label+" opacity",0,100,1,"%"),when:f}]});return s}function pa(t){return{...nt,stageHeight:tt(t.preset??nt.preset)?0:590,...t.preset==="spiral"?Xe:{},colorSource:"section",typeSource:"native",...t}}function er(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",r=t.name?.trim()||e,n=t.items?.length||0;return`${r.toLowerCase().includes(e.toLowerCase())?r:`${r} \xB7 ${e}`} \xB7 ${n} ${n===1?"item":"items"}`}function tr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let r=e.ownerDocument,n=r.defaultView,i=0;function o(){i=0;let h=e.getBoundingClientRect();if(!h.width||!h.height||!e.offsetHeight)return;let f=h.height/e.offsetHeight,m=t.getBoundingClientRect(),w=h.width/e.offsetWidth,x=Math.min(h.bottom,n.innerHeight),d=x;for(let y of[.1,.5,.9]){let S=h.left+(m.left+m.width*y)*w,u=r.elementFromPoint(S,x-2);if(!(!u||u===e))for(;u&&!u.contains(e);){let g=u.getBoundingClientRect();g.bottom>=x-2&&g.height>0&&g.height<h.height/2&&(d=Math.min(d,g.top)),u=u.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((h.bottom-d)/f))+"px")}function c(){i||(i=requestAnimationFrame(o))}let s=new ResizeObserver(c);s.observe(e),s.observe(r.documentElement);let a=new MutationObserver(c);return a.observe(r.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),n.addEventListener("resize",c),n.addEventListener("transitionend",c),o(),()=>{s.disconnect(),a.disconnect(),n.removeEventListener("resize",c),n.removeEventListener("transitionend",c),cancelAnimationFrame(i)}}function ga({source:t,options:e,onPreset:r,onOption:n,onClose:i,onRestore:o,onSave:c,getSaveState:s,getCode:a,getStyle:h,applyStyle:f}){let m=document.activeElement,w=t,x=pa(e),d=!1,y=!1,S=0,u=new Map,g=[],b=new Map;function I(){for(let[l,p]of b)l.hidden=!x[p]}let j=new Map,v=Q("div");v.setAttribute("data-gc-author-panel",""),v.setAttribute("data-lenis-prevent",""),v.addEventListener("wheel",l=>l.stopPropagation(),{passive:!0}),v.addEventListener("touchmove",l=>l.stopPropagation(),{passive:!0});let C=v.attachShadow({mode:"open"}),E=Q("style");E.textContent=la;let W=Q("aside","panel");W.setAttribute("aria-labelledby","gc-author-heading");let D=Q("header","header"),M=Q("div","heading"),R=Q("h2","","Gallery settings");R.id="gc-author-heading";let L=Q("p","target"),oe=Q("p","save-state");oe.setAttribute("role","status"),M.append(R,L,oe);function _(l=s()){oe.textContent!==l&&(oe.textContent=l,oe.dataset.saved=String(l==="Saved to page"))}let ge=Q("div","header-actions"),X=ze("icon-button","\u2212","Minimize settings");X.setAttribute("aria-controls","gc-author-controls"),X.setAttribute("aria-expanded","true");let ce=ze("icon-button","\xD7","Close settings");ge.append(X,ce),D.append(M,ge);let q=Q("div","controls");q.id="gc-author-controls";let U=Q("div","scroll");U.tabIndex=0,U.setAttribute("aria-label","Layout settings");let N=Q("label","preset-row"),O=Q("select","preset-select");O.setAttribute("aria-label","Layout");for(let l of xt.filter(p=>t.type==="list"||p.id!=="stack")){let p=Q("option","",l.name);p.value=l.id,O.append(p)}N.append(Q("span","field-label","Layout"),da(O));let z=Q("div","groups"),G=Q("div","style-actions"),H=ze("text-button","Copy style"),K=ze("text-button","Paste style");G.append(H,K);let ie=Q("div","style-transfer");ie.hidden=!0;let F=Q("textarea");F.setAttribute("aria-label","Gallery style"),F.spellcheck=!1;let $=ze("secondary","Apply style"),ae=ze("text-button","Close","Close style transfer"),Y=Q("p","field-error","Paste a gallery style created with Copy style.");Y.id="gc-style-error",Y.hidden=!0,Y.setAttribute("role","alert");function se(){Y.hidden=!0,F.removeAttribute("aria-invalid"),F.removeAttribute("aria-describedby")}F.addEventListener("input",se),ie.append(F,Y,$,ae),U.append(N,G,ie,z);let ue=Q("footer","footer"),re=Q("div","export-actions"),le=ze("primary","Save to page"),be=ze("secondary","Copy code"),xe=ze("text-button","Download header backup");xe.hidden=!0;let we=null,J=ze("secondary","View code");J.setAttribute("aria-expanded","false"),J.setAttribute("aria-controls","gc-author-code"),re.append(le,be);let fe=Q("div","code-view");fe.id="gc-author-code",fe.hidden=!0;let ee=Q("label","code-label","Page Header Code Injection"),Ae=Q("textarea");Ae.readOnly=!0,Ae.spellcheck=!1,Ae.setAttribute("aria-label","Page header code"),ee.append(Ae),fe.append(ee);let de=Q("div","footer-line"),ke=Q("span","status");ke.setAttribute("role","status");let Ce=ze("text-button","Reset preview");de.append(ke,Ce);let Ee=Q("div","backup-actions"),ye=ze("text-button","Remove layout");ye.hidden=s()==="Not saved yet",Ee.append(J,xe,ye);let Re=Q("div","removal");Re.hidden=!0,Re.append(Q("p","","Restore the native "+w.name+" and remove its saved layout from this page?"));let Oe=ze("secondary","Keep layout"),We=ze("secondary","Remove saved layout");Re.append(Oe,We),ue.append(re,Ee,fe,Re,de),q.append(U,ue),W.append(D,q),C.append(E,W),document.body.append(v);let ct=tr(v);function qe(l){let{definition:p,input:k,output:A,row:B}=l,P=x[p.key];if(p.when&&(B.hidden=x[p.when[0]]!==p.when[1]),p.condition&&(B.hidden=p.when&&x[p.when[0]]!==p.when[1]||!p.condition(x)),p.type==="palette"){l.refresh?.();for(let T of k.children)T.setAttribute("aria-pressed",String(T.value===P));return}if(p.customFor&&x[p.customFor]!=="custom"){B.hidden=!0;return}if(p.type==="checkbox"){k.checked=!!P;return}if(p.type==="range"){let T=p.key==="spiralRise"&&x.spiralRiseUnit==="percent"?{...p,...p.percent}:p;k.min=String(T.min),k.max=String(T.max),k.step=String(T.step);let V=p.inherits&&P==null;l.enable&&(l.enable.checked=!V,k.disabled=!!V),k.value=String(V?x[p.inherits]:P);let Z=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(T.key)&&T.min===0&&Number(k.value)===0?"Auto":`${k.value}${T.unit||""}`;A.textContent=V?`Inherit \xB7 ${Z}`:Z,k.setAttribute("aria-valuetext",Z);return}k.value=String(P),p.type==="color"&&(p.independent||(B.hidden=x.colorSource==="section"),A.textContent=k.value.toUpperCase())}function it(){_(),S+=1,ke.textContent="",fe.hidden||(Ae.value=a())}function De(l,p){let k=x.spiralRiseUnit;if(x={...x,[l]:p},l==="spiralRiseUnit"&&k!==p){let P=Math.max(1,x.stageHeight),T=p==="percent"?Math.max(1,Math.min(30,Math.round(x.spiralRise/P*1e3)/10)):Math.max(8,Math.min(280,Math.round(x.spiralRise*P/100)));x.spiralRise=T,n(l,p),n("spiralRise",T),qe(u.get("spiralRise"))}else n(l,p);let A=l.replace(/Swatch$|Opacity$/,""),B=A==="titleColor"?"titlePalette":A==="descriptionColor"?"descriptionCustom":null;if(x.preset==="spiral"&&B){let P=B==="titlePalette"?"custom":!0;x[B]=P,n(B,P)}l==="galleryHeight"&&(Te(),u.get(l).input.focus({preventScroll:!0})),l==="colorSource"?u.forEach(qe):qe(u.get(l));for(let P of u.values())(P.definition.inherits===l||P.definition.when?.[0]===l||P.definition.customFor===l)&&qe(P);x.preset==="spiral"&&(u.forEach(qe),I()),it()}function Ne(l){let{key:p,label:k,type:A}=l,B=Q(l.inherits||A==="palette"?"div":"label",`field field-${A}`);x.preset==="spiral"&&l.when&&B.setAttribute("data-subsetting","");let P=Q("span","field-label",k);if(A==="palette"){let Z=Q("div","palette-chips"),pe=getComputedStyle(w.root);Z.setAttribute("role","group"),Z.setAttribute("aria-label",k);for(let ve of l.choices){let he=ze("palette-chip",ve.value==="custom"?"+":"",ve.label);he.value=ve.value,he.title=ve.label;let Se=pe.getPropertyValue("--"+ve.value+"-hsl").trim();Se?he.style.backgroundColor="hsl("+Se+")":ve.value!=="custom"&&(he.textContent=ve.label),he.addEventListener("click",()=>De(p,ve.value)),Z.append(he)}B.append(P,Z);let me={definition:l,row:B,input:Z};return u.set(p,me),qe(me),B}let T=Q(A==="select"?"select":"input");if(T.setAttribute("aria-label",k),T.dataset.option=p,A==="select")for(let Z of l.choices){let pe=Q("option","",Z.label);pe.value=Z.value,T.append(pe)}else T.type=A;let V;(A==="range"||A==="color")&&(V=Q("output","value"),V.setAttribute("aria-hidden","true")),B.append(P),V&&B.append(V),B.append(A==="select"?da(T):T);let ne={definition:l,input:T,output:V,row:B};if(l.inherits&&!l.mobileRange){let Z=Q("input");Z.type="checkbox",Z.setAttribute("aria-label","Customize "+k.toLowerCase());let pe=Q("label","override-toggle");pe.append(Z,P),B.prepend(pe),ne.enable=Z,Z.addEventListener("change",()=>De(p,Z.checked?x[l.inherits]:null))}return u.set(p,ne),qe(ne),T.addEventListener(A==="range"||A==="color"?"input":"change",()=>{let Z=A==="range"||l.numeric?Number(T.value):A==="checkbox"?T.checked:T.value;De(p,Z)}),B}function Te(){let l=new Map([...j].map(([p,k])=>[p,k.open]));g.splice(0).forEach(p=>p()),b.clear(),u.clear(),j.clear(),z.replaceChildren();for(let p of ui(x,w.type)){let k=Q("details","group");k.open=l.get(p.title)??["Elements","Size & spacing"].includes(p.title);let A=Q("summary","",p.title),B=Q("div","group-body"),P=x.preset==="spiral"?{Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[p.title]:null;if(P&&!p.switchKey&&b.set(k,P),p.switchKey){let V=Q("section","group"),ne=Q("div","type-heading",p.title);ne.append(Ne(p.fields[0])),P&&b.set(V,P),V.append(ne,B),z.append(V)}let T;for(let V of p.fields){if(V.key===p.switchKey)continue;let ne=Ne(V);if(x.preset==="spiral"&&V.type==="palette"){let Z=V.key.slice(0,-6),pe=Q("div","paint-row"),me=ze("paint-trigger","",V.label.replace(/ palette$/,"")),ve=Q("span","field-label",V.label.replace(/ palette$/,""));T=Q("div","paint-popup"),T.popover="auto",me.popoverTargetElement=T,pe.append(ve,me,T),B.append(pe),T.append(ne);let he=()=>{pe.hidden=ne.hidden;let kt=x[V.key],St=getComputedStyle(w.root).getPropertyValue("--"+kt+"-hsl");if(me.style.setProperty("--chip",St?"hsl("+St+")":x[Z]),me.style.setProperty("--alpha",x[Z+"Opacity"]/100),!Se.matches(":popover-open"))return;let Qe=me.getBoundingClientRect(),Ct=Se.offsetWidth,$t=Se.offsetHeight;Se.style.left=Math.max(8,Math.min(innerWidth-Ct-8,Qe.right-Ct))+"px",Se.style.top=Math.max(8,Math.min(innerHeight-$t-8,Qe.bottom+$t+8<=innerHeight?Qe.bottom+4:Qe.top-$t-4))+"px"},Se=T,ht=new ResizeObserver(he),wt=()=>{ht.disconnect(),window.removeEventListener("scroll",he,!0),window.removeEventListener("resize",he)};g.push(wt),T.addEventListener("toggle",()=>{Se.matches(":popover-open")?(ht.observe(Se),window.addEventListener("scroll",he,!0),window.addEventListener("resize",he),he()):wt()}),u.get(V.key).refresh=he,he()}else T&&(V.customFor||V.key.endsWith("Opacity"))?(T.append(ne),V.customFor||(T=null)):(T=null,B.append(ne))}p.switchKey||(k.append(A,B),z.append(k),j.set(p.title,k))}I()}function Ve(l){if(y)return;let p=x.preset;w=l.source??w,l.options&&(x=pa(l.options)),L.textContent=er(w),L.title=w.selector||L.textContent,O.value=x.preset,!u.size||p!==x.preset?Te():(u.forEach(qe),I()),it()}function Ie(l){fe.hidden=!l,J.textContent=l?"Hide code":"View code",J.setAttribute("aria-expanded",String(l)),l&&(Ae.value=a(),Ae.focus({preventScroll:!0}),Ae.select())}function Ze(){if(y)return;y=!0,S+=1;let l=document.activeElement===v;document.removeEventListener("keydown",Me),g.splice(0).forEach(p=>p()),ct(),v.remove(),l&&m?.isConnected&&m.focus({preventScroll:!0})}function Ge(l){if(!y)try{l()}finally{Ze()}}function Me(l){if(!(l.key!=="Escape"||l.defaultPrevented||l.isComposing)&&!C.querySelector(".paint-popup:popover-open")){if(!Re.hidden){l.preventDefault(),$e(!1);return}document.querySelector("dialog[open]")||l.composedPath().some(p=>p?.getAttribute?.("aria-modal")==="true")||(l.preventDefault(),!ie.hidden&&(ie.contains(C.activeElement)||fe.hidden)?(ie.hidden=!0,(F.readOnly?H:K).focus()):fe.hidden?Ge(i):(Ie(!1),J.focus()))}}X.addEventListener("click",()=>{d=!d,q.hidden=d,v.toggleAttribute("data-minimized",d),X.textContent=d?"+":"\u2212",X.setAttribute("aria-expanded",String(!d)),X.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),ce.addEventListener("click",()=>Ge(i)),Ce.addEventListener("click",()=>Ge(o)),O.addEventListener("change",()=>r(O.value)),J.addEventListener("click",()=>Ie(fe.hidden));function Ue(l,p){se(),ie.hidden=!1,$.hidden=l,F.readOnly=l,F.value=p,F.placeholder=l?"":"Paste the copied gallery style",F.focus(),l&&F.select()}H.addEventListener("click",async()=>{let l=h();try{await navigator.clipboard.writeText(l),y||(ie.hidden=!0,ke.textContent="Style copied")}catch{if(y)return;Ue(!0,l),ke.textContent="Style selected. Choose Copy."}}),K.addEventListener("click",()=>{ke.textContent="",Ue(!1,"")}),ae.addEventListener("click",()=>{ie.hidden=!0,(F.readOnly?H:K).focus()}),$.addEventListener("click",()=>{if(!f(F.value)){Y.hidden=!1,F.setAttribute("aria-invalid","true"),F.setAttribute("aria-describedby",Y.id),F.focus();return}ie.hidden=!0,ke.textContent="Style applied to this preview",K.focus()}),xe.addEventListener("click",()=>{if(!we)return;let l=URL.createObjectURL(new Blob([we.header],{type:"text/plain"})),p=document.createElement("a");p.href=l,p.download="gallery-header-backup-"+we.collectionId+".txt",p.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)});async function Be(l=!1){if(l&&$e(!1),!le.disabled){le.disabled=Ce.disabled=ye.disabled=!0,U.inert=!0,le.textContent="Saving\u2026",_(l?"Removing\u2026":"Saving\u2026"),ke.textContent=l?"Removing layout\u2026":"Saving to page header\u2026";try{await c(p=>{we=p,y||(xe.hidden=!1)},l),y||(ke.textContent="Saved to page header")}catch(p){y||(ke.textContent=p.message||"Save failed. Copy code is still available.")}finally{y||(le.disabled=Ce.disabled=ye.disabled=!1,ye.hidden=s()==="Not saved yet",U.inert=!1,le.textContent="Save to page",_())}}}le.addEventListener("click",()=>Be());function $e(l){Re.hidden=!l,U.inert=l,re.hidden=Ee.hidden=de.hidden=l,l?(Ie(!1),Oe.focus()):ye.focus()}return ye.addEventListener("click",()=>$e(!0)),Oe.addEventListener("click",()=>$e(!1)),We.addEventListener("click",()=>Be(!0)),be.addEventListener("click",async()=>{let l=++S,p=a();try{await navigator.clipboard.writeText(p),!y&&l===S&&(ke.textContent="Page code copied")}catch{if(y||l!==S)return;Ie(!0),ke.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Me),Ve({source:t,options:e}),O.focus({preventScroll:!0}),{element:v,update:Ve,destroy:Ze}}var Qa,ua=te(()=>{At();Xt();gi();ca();Qa=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var ma,ha=te(()=>{ma=`.gc-config-position{position:relative!important}
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
`});var va={};mi(va,{startInline:()=>hi});function ut(t,e={}){let r=Ot.get(t),n={...nt,...t==="spiral"?Xe:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:r.width,stageHeight:tt(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[i,o]of Object.entries(e))i.startsWith("mobile")&&n[i]===null?Number.isFinite(o)&&o>=0&&(n[i]=o):i!=="preset"&&Object.hasOwn(n,i)&&typeof o==typeof n[i]&&(n[i]=o);return t==="spiral"&&("mobileSizing"in e||(n.mobileSizing=n.mobileGap!=null||n.mobileCardWidth!=null),"titleCustom"in e||(n.titleCustom=!!(n.titleSize||n.titlePalette==="custom"||n.titleWeight!=="inherit")),"bodyCustom"in e||(n.bodyCustom=!!(n.descriptionCustom||n.descriptionSize)),"overlayEnabled"in e||(n.overlayEnabled=n.imageTintOpacity>0),"cardBorderEnabled"in e||(n.cardBorderEnabled=n.borderWidth>0)),n}function ya(t){return ui(t).flatMap(e=>e.fields).filter(e=>!ba.has(e.key))}function or(t){let e=Object.fromEntries(ya(t).map(({key:r})=>[r,t[r]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function ar(t,e){let r;try{r=JSON.parse(t)}catch{return null}if(r?.format!=="gallery-studio-style"||r.version!==1||!Ot.has(r.preset)||!r.values||typeof r.values!="object"||Array.isArray(r.values))return null;let n=ut(r.preset);for(let i of ba)n[i]=e[i];for(let i of ya(n)){let o=r.values[i.key];if(o!==void 0){if(i.type==="range"){if(i.inherits&&o===null)continue;let c=i.percent&&r.values.spiralRiseUnit==="percent"?i.percent:i;if(!Number.isFinite(o)||o<c.min||o>c.max)return null}else{if(i.type==="checkbox"&&typeof o!="boolean")return null;if(["select","palette"].includes(i.type)&&!i.choices.some(c=>c.value===o))return null}if(i.type==="color"&&!/^#[0-9a-f]{6}$/i.test(o))return null;n[i.key]=o}}return n}function rr(t){return ut(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function Ht(t,e){let r=ut(e.preset),n={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};if(e.preset==="spiral")for(let o of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])n[o]=e[o];tt(e.preset)&&(n.stageHeight=e.stageHeight);for(let o of Object.keys(r))e.colorSource==="section"&&fa.has(o)||e[o]!==r[o]&&(n[o]=e[o]);let i={v:1,selector:t.selector,type:t.type,options:n};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(i,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function hi(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let r=Fo(),n=new Map(r.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),i=null,o=null,c=null,s=!1,a=[];function h(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=pi({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function f(d=!0){if(!o)return;let y=o;o=null,i?.destroy(),i=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function m(d){f(),d.presets.clear(),d.installed?h(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function w(d){if(o===d){f();return}f(!1);let{source:y}=d;if(d.mounted||(y.items=pt(y.root,y.type)),!y.items.length){let g="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=g,d.button.setAttribute("aria-label",g);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+y.name+" layout");let S=d.options||d.installed||ut("arc-tabs",y.type!=="list"?{galleryWidth:"source"}:{});if(y.type!=="list"&&S.preset==="stack"&&(S=ut("arc-tabs",{galleryWidth:"source"}),h(d,S)),!d.mounted&&!h(d,S)){d.button.textContent="No supported layout here";return}o=d;let u=g=>{h(d,g),d.presets.set(g.preset,{...g})};i=ga({source:y,options:{...d.options},onClose:()=>f(),onRestore:()=>m(d),onPreset:g=>{!Ot.has(g)||y.type!=="list"&&g==="stack"||(d.presets.set(d.options.preset,{...d.options}),u({...d.presets.get(g)||ut(g),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),i.update({source:y,options:{...d.options}}))},onOption:(g,b)=>{if(!Object.hasOwn(d.options,g)||g==="preset")return;let I={...d.options,[g]:b};u(I)},getSaveState:()=>d.installed?Ht(y,d.options)===Ht(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Ht(y,d.options),onSave:async(g,b=!1)=>{if(s)throw Error("Another gallery is still saving. Please wait.");let I={...d.options},j=yi();s=!0;try{await vi({snippet:Ht(y,I),context:j,onBackup:g,remove:b}),b?(d.installed=null,o===d?m(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=I}finally{s=!1}},getStyle:()=>or(d.options),applyStyle:g=>{let b=ar(g,d.options);return!b||y.type!=="list"&&b.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),u(b),i.update({source:y,options:d.options}),!0)}}),i.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),S=document.querySelectorAll(y.selector),u=S.length===1&&n.get(S[0]);if(!u||y.v!==1||y.type!==u.source.type||!Ot.has(y.options?.preset))continue;u.installed=rr(y.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of n.values())d.installed&&h(d,d.installed);if(t&&n.size){let y=function(g=!1){d.setAttribute("aria-pressed",String(g)),d.querySelector("span").textContent=g?"Edit native content":"Preview galleries",d.hidden=!gt()||![...n.values()].some(b=>b.mounted)},S=function(g){if(!g.mounted||g.source.root.isConnected)return;let b=g.source.root,I=document.querySelectorAll(g.source.selector);if(I.length!==1)return;let j=I[0];g.mounted.destroy(),g.mounted=null,g.source.root=j,n.delete(b),n.set(j,g),h(g,g.options);let v=j.querySelector(g.source.type==="list"?".user-items-list":".sqs-block-content")||j;g.button&&(getComputedStyle(v).position==="static"&&v.classList.add("gc-config-position"),v.append(g.button))};c=document.createElement("style"),c.textContent=ma,document.head.append(c);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let g=d.getAttribute("aria-pressed")!=="true";for(let b of[...n.values()])S(b),b.mounted?.instance.setEditPreview(g);y(g)},document.body.append(d),y();let u=di(g=>{g||requestAnimationFrame(()=>{if(d.isConnected)for(let b of[...n.values()])S(b)}),y()});a.push(()=>{u(),d.remove()});for(let g of n.values()){let{source:b}=g;if(!b.selector)continue;let I=b.root.querySelector(b.type==="list"?".user-items-list":".sqs-block-content")||b.root,j=getComputedStyle(I).position==="static";j&&I.classList.add("gc-config-position");let v=document.createElement("button");v.type="button",v.className="gc-config-launch",v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","Configure "+b.name+" layout"),v.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',v.addEventListener("click",()=>w(g)),I.append(v),g.button=v,a.push(()=>{v.remove(),j&&I.classList.remove("gc-config-position")})}}let x={version:1,destroy(){f(!1);for(let d of n.values())d.mounted?.destroy();for(let d of a)d();c?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=x,x}var Ot,fa,ba,xa=te(()=>{xi();gi();si();ua();ha();Ot=new Map(xt.map(t=>[t.id,t])),fa=new Set(["background","ink","accent","borderColor","overlayColor"]);ba=new Set([...fa,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",hi,{once:!0}):hi()});var nr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(nr=(await Promise.resolve().then(()=>(xa(),va))).startInline);export{nr as startInline};

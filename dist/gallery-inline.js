var Ia=Object.defineProperty;var oe=(t,e)=>()=>(t&&(e=t(t=0)),e);var ko=(t,e)=>{for(var a in e)Ia(t,a,{get:e[a],enumerable:!0})};function Co(t,e){if(t===void 0)return null;let a=new Map([...t.matchAll(Ta)].map(o=>[o[1].toLowerCase(),o[2]??o[3]??o[4]??""]));if(!a.has("data-gallery-layout"))return null;if(a.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let i;try{i=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(i?.v!==1||typeof i.selector!="string"||!["list","gallery","summary"].includes(i.type)||!i.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return i}function qa(t,e,a=!1){let i=[...e.matchAll(So)];if(i.length!==1||i[0][0]!==e.trim())throw Error("Invalid gallery settings.");let o=Co(i[0][1],i[0][2]);if(!o)throw Error("Missing gallery settings.");let r=!1,s=t.replace(So,(c,n,g)=>{let h=Co(n,g);return!h||h.selector!==o.selector?c:a||r?"":(r=!0,e)});return a||r?s:s+(s&&!s.endsWith(`
`)?`
`:"")+e+`
`}function Mo(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,a=e?.collection?.id,i=e?.website?.id,o=t.document.cookie.split(";").map(r=>r.trim()).find(r=>r.startsWith("crumb="))?.slice(6);if(!Et.test(a||"")||!Et.test(i||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!o)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:a,websiteId:i,crumb:decodeURIComponent(o)}}async function Ao({snippet:t,context:e,remove:a=!1,fetchImpl:i=fetch,onBackup:o=()=>{}}){let{collectionId:r,websiteId:s,crumb:c}=e;if(!Et.test(r||"")||!Et.test(s||"")||!c)throw Error("A signed-in Squarespace page is required.");async function n(){let y=await i("/api/commondata/GetCollectionSettings?collectionId="+r,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let C=await y.json(),b=C.collectionData??C;if(b?.id!==r||b.websiteId!==s||b.deleted===!0||b.folder===!0||b.dropdown===!0)throw Error("Page settings do not match this page.");if(b.headerInjectCode!=null&&typeof b.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:b,memberAreaData:C.memberAreaData??{}}}let g=await n();if(g.model.passwordProtected&&typeof g.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let h=g.model.headerInjectCode??"",m=qa(h,t,a);if(m===h)return{unchanged:!0};o({collectionId:r,header:h,savedAt:new Date().toISOString()});let w=await n();if(JSON.stringify(w)!==JSON.stringify(g))throw Error("Page settings changed while saving. Review the page and save again.");let x;try{x=await i("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...w.model,collectionId:r,headerInjectCode:m},memberAreaData:w.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!x.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await n()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==m.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var Et,So,Ta,Eo=oe(()=>{Et=/^[a-f0-9]{24}$/i,So=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Ta=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function Po(t){let e=document.createElement("template");return e.innerHTML=t,e.content}function mt(t,e){return t&&URL.canParse(t,e)?new URL(t,e).href:null}function Ra(t,e){let a=t.querySelector(".sqs-gallery-container"),i=Array.from(t.querySelectorAll(".slide"),o=>{let r=o.querySelector("img[data-src], img[data-image], img[src]"),s=o.querySelector(".image-slide-anchor, a[href]");return{type:o.dataset.type||null,imageUrl:mt(r?.dataset.src||r?.dataset.image||r?.getAttribute("src"),e),imageId:r?.dataset.imageId??null,dimensions:r?.dataset.imageDimensions??null,focalPoint:r?.dataset.imageFocalPoint??null,alt:r?.getAttribute("alt")??null,title:s?.dataset.title??o.querySelector(".meta-title")?.textContent??null,descriptionHtml:s?.dataset.description??o.querySelector(".meta-description")?.innerHTML??null,href:mt(s?.getAttribute("href"),e),lightbox:!!s?.classList.contains("js-gallery-lightbox-opener"),html:o.outerHTML}});return{layout:a?.dataset.design??null,settings:{...a?.dataset},slides:i}}function Fa(t,e){return Array.from(Po(t).querySelectorAll(".sqs-block"),a=>{let i=a.dataset.sqspBlock||[...a.classList].find(r=>r.startsWith("sqs-block-")&&r!=="sqs-block-website-component")?.slice(10),o={id:a.id||null,type:i||null,typeId:a.dataset.blockType??null,html:a.outerHTML};return(i==="gallery"||a.matches(".gallery-block, .sqs-block-gallery"))&&(o.gallery=Ra(a,e)),o})}async function Ba(t,e){let a=await fetch(t,{mode:"same-origin",signal:e});if(!a.ok)return null;let i=await a.text(),o=Po(i.split(/<\/head\s*>/i,1)[0]),r=Array.from(o.querySelectorAll("meta[content]"),s=>({name:s.getAttribute("property")||s.getAttribute("name")||s.getAttribute("itemprop"),content:s.getAttribute("content")})).filter(s=>s.name);return{title:o.querySelector("title")?.textContent??null,description:r.find(s=>s.name.toLowerCase()==="description")?.content??null,canonicalUrl:mt(o.querySelector('link[rel~="canonical"]')?.getAttribute("href"),a.url),meta:r}}async function Pt(t,{signal:e,includeSeo:a=!0}={}){if(!t)throw new Error("A linked post URL is required.");let i=new URL(t,location.href);if(i.origin!==location.origin)throw new Error("The linked post must be on this site.");i.hash="",i.searchParams.delete("format");let o=new URL(i);o.searchParams.set("format","json");let r=await fetch(o,{mode:"same-origin",signal:e});if(!r.ok)throw new Error("Could not load post JSON ("+r.status+").");let{item:s}=await r.json();if(!s?.id||typeof s.body!="string")throw new Error("This URL did not return a post body.");let c=mt(s.fullUrl,r.url)||i.href,n=null;try{a&&(n=await Ba(i,e))}catch(g){if(e?.aborted)throw g}return{id:s.id,url:c,title:s.title??null,excerptHtml:s.excerpt??null,publishedAt:s.publishOn??null,createdAt:s.addedOn??null,updatedAt:s.updatedOn??null,author:s.author??null,authorId:s.authorId??null,location:s.location??null,tags:s.tags??[],categories:s.categories??[],featuredImageUrl:mt(s.assetUrl,c),seo:{item:s.seoData??null,page:n},bodyHtml:s.body,blocks:Fa(s.body,c),rawItem:s}}var Xt=oe(()=>{});function jo(t,e,{range:a,select:i,swatch:o},r){let s=(f,M)=>({key:f,label:M,type:"checkbox"}),c=(f,M,q,W,_="px",Z=1)=>a(f,M,q,W,Z,_),n=(f,M,q)=>q.map(W=>({...W,when:[f,M]})),g=(f,...M)=>({title:f,fields:M.flat()}),h=f=>r.flatMap(M=>M.fields).find(M=>M.key===f),m=t.preset==="spiral",w=t.preset==="stack",x=["wall","ring","angled"].includes(t.preset),d=x||t.preset==="timed",y=m?"spiralGap":"gap",C=e!=="gallery",b={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(f,M)=>[100*(M+1),String(100*(M+1))]))},u={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function v(f,M,q,W,_,Z){return{...g(f,c(q,"Size",0,4,"rem",.05),i(W,"Weight",b),o(_,"Color"),i(Z,"Alignment",u)),typography:M}}function B(f,M,q,W){return[s(f,M),...n(f,!0,[c(q+"Angle","Angle",0,360,"\xB0"),c(q+"Distance","Distance",0,48),c(q+"Blur","Blur",0,40),c(q+"Spread","Spread",0,16),o(W,"Color")])]}let T=(f,M)=>({...h(M),key:f,label:"Mobile "+h(M).label.toLowerCase(),inherits:M}),A=[g("Elements",s("showImage","Show image"),s("showTitles","Show title"),...C?[s("showDescription","Show description"),s("showButton","Show button")]:[],s("showControls","Show controls")),g("Main carousel",...C?[i("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...n("heightMode","pixels",[c("stageHeight","Height",120,1600)]),...n("heightMode","viewport",[c("viewportHeight","Window height",15,100,"%")])]:[],c("carouselPadding","Carousel padding",0,64),h("spiralWidth"),s("surfaceEnabled","Background"),...n("surfaceEnabled",!0,[o("surfaceColor","Color"),c("surfaceRadius","Corner radius",0,64)]),i("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),h("edgeFade"),h("spiralGap"),s("autoplay","Autoplay"),...n("autoplay",!0,[i("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),i("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...c("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:f=>f.playbackMode==="continuous"},{...c("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:f=>f.playbackMode==="step"}),g("Spiral",h("spiralRiseUnit"),{...h("spiralRise"),label:"Rise"},i("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),h("showSlots")),g("Image",i("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(f=>[f,f==="original"?"Original":f==="circle"?"Circle":f]))),i("fit","Image sizing",{cover:"Fill",contain:"Fit"}),c("imageWidth","Image width",20,100,"%"),i("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),c("imagePadding","Image padding",0,20,"%"),s("imageBorder","Image border"),...n("imageBorder",!0,[o("imageBorderColor","Color"),c("imageBorderSize","Thickness",0,12),c("imageRadius","Corner radius",0,64)]),B("shadowEnabled","Image shadow","shadow","shadowColor"),s("overlayEnabled","Overlay"),...n("overlayEnabled",!0,[o("imageTint","Color")])),v("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...C?[v("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],g("Card",h("cardWidth"),i("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),i("cardOrder","Element order",{media:"Media first",content:"Content first"}),c("cardPadding","Card padding",0,80),c("mediaGap","Space between image and text",0,80),c("titleGap","Space below title",0,80),...C?[c("buttonGap","Space above button",0,80)]:[],i("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),s("cardBackground","Background"),...n("cardBackground",!0,[o("cardColor","Color")]),s("cardBorderEnabled","Card border"),...n("cardBorderEnabled",!0,[o(m?"spiralRim":"borderColor","Color"),h("borderWidth")]),h(m?"spiralRadius":"radius"),B("cardShadow","Card shadow","cardShadow","cardShadowColor"),h("backFace"),h("backColor"),...n("backFace","mirror",[s("mirrorOverlay","Mirrored image overlay")]),{...o("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:f=>f.backFace==="mirror"}),g("Interaction",s("pauseOnHover","Pause on hover"),h("hoverEffect"),h("hoverAmount"),c("hoverDuration","Hover duration",0,1e3,"ms",10),i("clickAction","Card click",{source:C?"Button only":"Image link only",link:C?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),h("reducedMotion")),g("Control styling",h("controlSize"),c("controlIconSize","Icon size",0,60),c("controlPadding","Button padding",0,32),h("controlShape"),h("arrowStyle"),s("controlBackground","Button background"),h("controlPalette"),h("controlInk"),h("controlFill")),g("Mobile",s("mobileSizing","Customize mobile sizing"),T("mobileCardWidth","cardWidth"),T("mobileGap",y),{...c("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...c("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},...m?[T("mobileSpiralWidth","spiralWidth")]:[],...C?[i("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...c("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),g("Theme",i("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...n("colorSource","custom",[o("background","Background"),o("ink","Text"),o("accent","Accent")]),i("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),r.find(f=>f.title==="Popup")];if(m)return A;let E=A.find(f=>f.title==="Main carousel");E.fields=[h("galleryWidth"),h("galleryHeight"),h("stageHeight"),...E.fields.filter(f=>["carouselPadding","surfaceEnabled","surfaceColor","surfaceRadius"].includes(f?.key)),h("gap"),h("edgeMode"),h("edgeFade"),h("autoplay"),h("duration")];let k=A.find(f=>f.title==="Spiral");k.title="Layout",k.fields=[h("depth"),h("navigation")];let j=new Set(["mirrorOverlay","mirrorColor","mobileHeightMode","mobileViewportHeight"]);if(t.preset!=="ring")for(let f of["backFace","backColor"])j.add(f);if(w)for(let f of["showControls","pauseOnHover"])j.add(f);if(d)for(let f of["cardOrder","cardSizing","mediaGap"])j.add(f);x&&j.add("cardAlign");let H=A.find(f=>f.title==="Mobile");H.fields=H.fields.filter(f=>f.key!=="mobileStageHeight"),h("stageHeight")&&H.fields.push({...h("stageHeight"),key:"mobileStageHeight",label:"Mobile height",inherits:"stageHeight"});for(let f of A)f.fields=f.fields.filter(M=>M?.key&&!j.has(M.key));return A.filter(f=>f.fields.length&&!(w&&f.title==="Control styling"))}var Lo,zo,Lt=oe(()=>{Lo={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},zo=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function Io({range:t,swatch:e,select:a}){let i=(o,r)=>({key:o,label:r,type:"checkbox"});return[{title:"Card content",fields:[i("showImage","Show image"),i("showTitles","Show title"),i("showDescription","Show description"),i("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),i("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),i("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(o=>({...o,when:["shadowEnabled",!0]})),a("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[i("popupImage","Show popup image"),i("popupTitle","Show popup title"),i("popupDescription","Show popup description"),i("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),i("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Jt(t,e){if(!Yt.has(e.preset))return e;let a={...e},i=getComputedStyle(t),o;for(let r of jt){let s=e[r+"Swatch"],c=e[r];if(Object.hasOwn(Vt,s)){let g=i.getPropertyValue("--"+s+"-hsl").trim();g&&(o??=document.createElement("canvas").getContext("2d"),o&&(o.fillStyle=c,o.fillStyle="hsl("+g+")",c=o.fillStyle))}let n=Math.round((e[r+"Opacity"]??100)*2.55);a[r]=n===255?c:c+n.toString(16).padStart(2,"0")}return a}var Yt,Vt,jt,zt,Kt=oe(()=>{Lt();Yt=new Set(["spiral","stack","infinite","arc","arc-tabs","timed","showcase","wall","ring","angled"]),Vt={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},jt=[...zo,"borderColor","titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],zt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of jt)zt[t+"Swatch"]="custom",zt[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function Zt(t){let e=document.createElement("template");return e.innerHTML=t??"",e.content}function ft(t,e){if(e||=location.href,!t||!URL.canParse(t,e))return null;let a=new URL(t,e);return["http:","https:"].includes(a.protocol)?a.href:null}function Ro(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let a=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches(Wa))return a;let i=t.localName==="h1"?"h2":t.localName,o;if(i==="img"){if(o=ft(t.dataset.src||t.dataset.image||t.getAttribute("src"),e),!o)return a}else i==="a"&&(o=ft(t.getAttribute("href"),e));let r=Da.has(i)&&(i!=="a"||o)?document.createElement(i):a;i==="a"&&o?(r.href=o,r.rel="noopener noreferrer"):i==="img"&&(r.src=o,r.alt=t.alt,r.loading="lazy");for(let s of t.childNodes)r.append(Ro(s,e));return r}function To(t,e){let a=document.createDocumentFragment();for(let i of t.childNodes)a.append(Ro(i,e));return a}function Qt(t){return t.textContent.replace(/\s+/g," ").trim()}function Ga(t,e){let a=Qt(e);if(!a&&!e.querySelector("img")||a&&Qt(t)===a)return;let i=document.createElement("div");i.append(e),t.append(i)}function qo(t,e){let a=Array.isArray(e)?[...new Set(e.filter(i=>typeof i=="string").map(i=>i.trim()).filter(Boolean))]:[];t.replaceChildren(...a.map(i=>{let o=document.createElement("li");return o.textContent=i,o})),t.hidden=!a.length}function Ua(t,e){return(t.blocks??[]).flatMap(a=>a.gallery?.slides??[]).flatMap(a=>{let i=ft(a.imageUrl,e);return i?[{src:i,alt:a.alt?.trim()||a.title?.trim()||"",caption:a.title?.trim()||"",description:a.descriptionHtml||""}]:[]})}function Fo(t,e,a){let i=document.createElement("dialog");i.className="gc-post-dialog",i.setAttribute("aria-label","Project details"),i.dataset.desktopLayout=e.popupDesktopLayout==="drawer"?"drawer":"split",i.dataset.reducedMotion=String(!!e.reducedMotion),e.popupPadding>0&&i.style.setProperty("--post-padding",e.popupPadding+"px"),e.popupRadius!=null&&i.style.setProperty("--post-radius",e.popupRadius+"px"),e.popupCustom&&e.popupColor&&e.popupInk&&(i.style.setProperty("--post-surface",e.popupColor),i.style.setProperty("--post-ink",e.popupInk),i.style.setProperty("--post-body",e.popupInk)),i.innerHTML=`
    <div class="gc-post-toolbar"><button type="button" class="gc-post-icon gc-post-close" aria-label="Close project" autofocus>${$a}</button></div>
    <div class="gc-post-pending" data-loading>
      <span class="gc-post-spinner" aria-hidden="true"></span>
      <p class="gc-post-status" role="status">Loading project\u2026</p>
      <a class="gc-post-link gc-post-error-link" hidden>View full project</a>
    </div>
    <div class="gc-post-layout" hidden>
      <div class="gc-post-copy">
        <h2 class="gc-post-title"></h2>
        <div class="gc-post-reading"></div>
        <ul class="gc-post-pills gc-post-categories" aria-label="Project categories" hidden></ul>
        <ul class="gc-post-pills gc-post-tags" aria-label="Project tags" hidden></ul>
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
            <button type="button" class="gc-post-icon" data-post-prev aria-label="Previous image">${Na}</button>
            <button type="button" class="gc-post-icon" data-post-next aria-label="Next image">${Oa}</button>
          </div>
        </div>
        <div class="gc-post-thumbs" role="group" aria-label="Select a project image" hidden></div>
      </section>
    </div>`;let o=$=>i.querySelector($),r=o(".gc-post-close"),s=o(".gc-post-title"),c=o(".gc-post-reading"),n=o(".gc-post-categories"),g=o(".gc-post-tags"),h=o(".gc-post-pending"),m=o(".gc-post-status"),w=o(".gc-post-error-link"),x=o(".gc-post-link"),d=o(".gc-post-gallery"),y=o(".gc-post-layout"),C=o(".gc-post-image-well"),b=o(".gc-post-image"),u=o(".gc-post-image-description"),v=o(".gc-post-photo-nav"),B=o(".gc-post-image-label"),T=o(".gc-post-counter"),A=o(".gc-post-thumbs"),E=new AbortController,k=matchMedia("(max-width: 680px)"),j=[],H=0,f=null,M=ft(t,location.href);function q(){k.matches?y.prepend(d):y.append(d)}q(),k.addEventListener("change",q);function W($){if(!j.length)return;H=($+j.length)%j.length;let P=j[H];b.src=P.src,b.alt=P.alt,B.textContent=P.caption,B.hidden=!P.caption,T.textContent=H+1+" / "+j.length,u.replaceChildren(To(Zt(P.description),M)),u.hidden=!Qt(u);for(let[R,N]of Array.from(A.children).entries())R===H?N.setAttribute("aria-current","true"):N.removeAttribute("aria-current");let G=A.children[H];if(G&&A.clientWidth){let{left:R,right:N}=G.getBoundingClientRect(),I=A.getBoundingClientRect();R<I.left&&(A.scrollLeft+=R-I.left),N>I.right&&(A.scrollLeft+=N-I.right)}}function _($){j=e.popupImage===!1?[]:$,d.hidden=!j.length,v.hidden=j.length<2,A.hidden=j.length<2,A.replaceChildren(...j.length>1?j.map((P,G)=>{let R=document.createElement("button"),N=document.createElement("img");return R.type="button",R.setAttribute("aria-label","Show image "+(G+1)+(P.caption?" \u2013 "+P.caption:"")),N.src=P.src,N.alt="",N.loading="lazy",R.append(N),R.addEventListener("click",()=>W(G)),R}):[]),i.toggleAttribute("data-without-gallery",!j.length),W(0)}function Z($,P){s.textContent=$||"",s.hidden=e.popupTitle===!1||!$,i.setAttribute("aria-label",$||"Project details"),x.hidden=e.popupButton===!1||!P,P&&(x.href=P)}function V($){M=ft($.url,M)||M;let P=$.title?.replace(/&(?:#(?:[0-9]+|x[0-9a-f]+)|[a-z][a-z0-9]+);/gi,G=>Zt(G).textContent);if(Z(P,M),e.popupDescription!==!1)for(let G of $.blocks??[]){if(!Ha.has(G.type))continue;let R=Zt(G.html),N=R.querySelector(".sqs-html-content,.sqs-block-content")||R;Ga(c,To(N,M))}qo(n,$.categories),qo(g,$.tags),_(Ua($,M))}return r.addEventListener("click",a),o("[data-post-prev]").addEventListener("click",()=>W(H-1)),o("[data-post-next]").addEventListener("click",()=>W(H+1)),i.addEventListener("keydown",$=>{j.length<2||$.altKey||$.metaKey||$.ctrlKey||["ArrowLeft","ArrowRight"].includes($.key)&&($.preventDefault(),W(H+($.key==="ArrowLeft"?-1:1)))}),C.addEventListener("pointerdown",$=>{j.length<2||!$.isPrimary||$.pointerType==="mouse"||(f={id:$.pointerId,x:$.clientX,y:$.clientY},C.setPointerCapture($.pointerId))}),C.addEventListener("pointercancel",()=>{f=null}),C.addEventListener("pointerup",$=>{if(f?.id!==$.pointerId)return;let P=$.clientX-f.x,G=$.clientY-f.y;f=null,Math.abs(P)>35&&Math.abs(P)>Math.abs(G)*1.2&&W(H+(P<0?1:-1))}),{dialog:i,async load(){try{let $=await Pt(M,{signal:E.signal,includeSeo:!1});if(E.signal.aborted||(V($),j.length&&await b.decode().catch(()=>{}),E.signal.aborted))return;h.hidden=!0,y.hidden=!1}catch{if(E.signal.aborted)return;h.removeAttribute("data-loading"),m.textContent="The project details couldn\u2019t load.",M&&e.popupButton!==!1&&(w.href=M,w.hidden=!1)}},destroy(){E.abort(),k.removeEventListener("change",q)}}}var Da,Ha,Wa,Na,Oa,$a,Bo=oe(()=>{Xt();Da=new Set("p h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" ")),Ha=new Set(["html","text","markdown","image"]),Wa="script,style,template,noscript,iframe,form,svg,object,embed,video,audio,button",Na='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-14 0 6 6m-6-6 6-6"/></svg>',Oa='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',$a='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'});function eo(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],a=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${_a[t]}${a}</svg>`}function Xe(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?eo("play")+eo("pause"):eo(e),t}var _a,It=oe(()=>{_a={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function qe(t,e,a){let i=document.createElement(t);return i.className=e,a!==void 0&&(i.textContent=a),i}function lt(t,e,a){let i=qe("button",t,a);return i.type="button",i.setAttribute("aria-label",e),i}function Ya(t,e,a,i,o,r){let s=a/2,c=i/2,n=.26,g=e/2+48,h=(a*Math.cos(n)+r)/(2*Math.sin(n)),m=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-o)*.7),a*(3.8-o*2.1),c+Math.max(h,g/Math.sin(Math.PI/3))),w=m-c,x=Math.atan2(s,w),d=Math.hypot(s,w),y=2*(x+Math.asin(r/(2*d))),C=x+Math.asin(g/d),b=m+c,u=Math.hypot(b,s)-b,v=w-Math.sqrt((w-g)*(w+g));return{radius:m,step:y,reach:C/y,above:u,below:v}}function Va(t,e,a){let i=e/2,o=10+a*9,r=0,s=0;for(let c=0;c<4.1;c+=.5){let n=Math.min(4.1,c+.5),g=Math.max(.48,1-c*(.09+a*.035)),h=(n*(4+a*7)+(c===0?4:0))*Math.PI/180,m=g*(i+t/2*Math.sin(h))-i;r=Math.max(r,m-Math.min(c,4)*o),s=Math.max(s,m+Math.min(n,4)*o)}return{above:r,below:s}}function Do({host:t,items:e=[],initialIndex:a=0,options:i={},makeCard:o,onChange:r,nativeList:s,loadImage:c}){let n=Xa.has(i.preset)?i.preset:"infinite",g=n==="arc"||n==="arc-tabs",h=g||n==="showcase",m=e.length,w=!!i.reducedMotion,x=We(at(i.depth,55),0,100)/100,d,y,C;function b(l){d=We(at(l.gap,24),0,180),y=We(at(l.cardWidth,n==="timed"?760:380),80,1800),C=l.phoneWidthOverride}b(i);let u=We(at(i.duration,5),1,60)*1e3,v=qe("section",`gc-carousel gc-preset-${n}`);v.setAttribute("aria-roledescription","carousel"),v.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[n]),v.style.setProperty("--gc-card-radius",`${We(at(i.radius,14),0,120)}px`),v.style.setProperty("--gc-stage-height",`${We(at(i.stageHeight,0),0,1400)}px`),w&&v.classList.add("gc-reduced-motion");let B=[],T=(l,p,S,L)=>{l.addEventListener(p,S,L),B.push(()=>l.removeEventListener(p,S,L))},A=[],E=[],k=i.navigation==="dots"||i.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),j=n==="arc-tabs"||n==="timed"&&!k,H=qe("nav","gc-carousel-tabs");k&&H.classList.add("gc-choice-dots"),H.setAttribute("aria-label","Choose a slide"),j&&(e.forEach((l,p)=>{let L=(typeof l.title=="string"?l.title.trim():"")||`Slide ${p+1}`,O=k?lt("gc-choice-dot",L):lt("gc-carousel-tab",L,L);T(O,"click",()=>Te(p)),T(O,"keydown",F=>{let z;F.key==="ArrowRight"&&(z=it(p+1,m)),F.key==="ArrowLeft"&&(z=it(p-1,m)),F.key==="Home"&&(z=0),F.key==="End"&&(z=m-1),z!==void 0&&(F.preventDefault(),Te(z),A[z]?.focus({preventScroll:!0}))}),H.append(O),A.push(O)}),v.append(H));let f=qe("div","gc-carousel-stage");f.tabIndex=m?0:-1,f.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let M=s?.track??qe("div","gc-carousel-track");M.classList.add("gc-carousel-track"),f.append(M),v.append(f);function q(l){let p=o(e[l],l,{caption:i.showTitles!==!1,description:n==="arc-tabs"||n==="timed"});p.classList.add("gc-carousel-card"),p.dataset.gcItemIndex=String(l),p.style.width="var(--gc-carousel-slot-width)",p.tabIndex=-1,p.setAttribute("aria-hidden","true"),s||p.querySelectorAll("img").forEach(L=>{L.draggable=!1,L.style.objectFit=i.fit==="contain"?"contain":"cover"});let S=s?.slot(p)??p;return M.append(S),{card:p,node:S,index:l,logical:l,active:!1}}let W=e.map((l,p)=>q(p)),_=new Map,Z=!1,V=qe("div","gc-carousel-controls"),$=qe("div","gc-carousel-counter");$.setAttribute("aria-hidden","true");let P=qe("span","gc-carousel-current",m?"01":"00");$.append(P,qe("span","gc-carousel-divider","/"),qe("span","gc-carousel-total",String(m).padStart(2,"0")));let G=qe("div","gc-carousel-arrows"),R=Xe(lt("gc-carousel-arrow","Previous slide"),"previous"),N=Xe(lt("gc-carousel-arrow","Next slide"),"next");R.disabled=N.disabled=m<2,G.append(R,N);let I=Xe(lt("gc-carousel-playback","Play slideshow"),"playback");I.hidden=m<2||w;let Y=qe("div","gc-carousel-pagination");Y.setAttribute("aria-label","Slide pagination"),n==="timed"&&e.forEach((l,p)=>{let S=lt("gc-carousel-dot",l.title?.trim()||`Go to slide ${p+1}`),L=qe("span","gc-carousel-dot-fill");L.setAttribute("aria-hidden","true"),S.append(L),T(S,"click",()=>Te(p)),Y.append(S),E.push({dot:S,fill:L})}),V.append($,G),n==="timed"&&V.append(Y),V.append(I),v.append(V);let U=qe("p","gc-carousel-sr");U.setAttribute("aria-atomic","true"),v.append(U);let K=qe("span","gc-carousel-cursor","Drag");K.setAttribute("aria-hidden","true"),(n==="arc-tabs"||n==="showcase"||n==="arc")&&f.append(K),t.append(v);let re=!1,D=a,X=a,ne=-1,J=0,ce=0,ue=0,se=!!i.autoplay&&!w&&m>1,de=!1,be=!1,xe=!1,we=!1,ee=null,fe=0,ie=0,Ae=0,pe=0,ke=()=>Math.max(12,pe*(.36-x*.12)+d-28),Ce=-1,Ee,ye=1,Re=0,Oe=0,De=()=>we||de||be||xe||document.hidden||!!ee,ct=l=>{let p=it(Math.round(D),m),S=it(l-p,m);return S>m/2&&(S-=m),Math.round(D)+S};function Fe(){let l=A[ne];if(!l)return;let p=l.offsetLeft,S=p+l.offsetWidth;p<H.scrollLeft?H.scrollLeft=Math.max(0,p-14):S>H.scrollLeft+H.clientWidth&&(H.scrollLeft=S-H.clientWidth+14)}function ot(){let l=m?it(Math.round(D),m):-1;if(l===ne)return;ne=l,P.textContent=m?String(l+1).padStart(2,"0"):"00",A.forEach((S,L)=>{S.classList.toggle("is-active",L===l),S.setAttribute("aria-pressed",String(L===l))}),Fe(),E.forEach(({dot:S},L)=>{S.classList.toggle("is-active",L===l),L===l?S.setAttribute("aria-current","true"):S.removeAttribute("aria-current")});let p=e[l]?.title;U.textContent=m?`${l+1} of ${m}${p?`: ${p}`:""}`:"No gallery items",l>=0&&r?.(l)}function He(){if(re||!ie)return;ot();let l=Math.abs(X-D)>.002;v.classList.toggle("is-moving",l||!!ee);let p=[...W];for(let S of W)S.logical=S.index+Math.round((D-S.index)/m)*m;if(m>1){let S=pe+d,L=n==="infinite"&&ie>660?ie*.61:ie/2,O=(L+pe/2+40)/S,F=(ie-L+pe/2+40)/S;g?O=F=Ee.reach:n==="showcase"&&(O=F=Math.min(4.1,(ie/2+pe)/ke()));let z=Math.ceil(D-O),Q=Math.floor(D+F);for(let[le,te]of _)(le<z||le>Q||W[te.index].logical===le)&&(te.node.remove(),_.delete(le));for(let le=z;le<=Q;le++){let te=it(le,m);if(W[te].logical===le)continue;let ge=_.get(le);ge||(ge=q(te),ge.logical=le,_.set(le,ge),Z&&c&&ge.card.querySelectorAll("img").forEach(me=>c(me,{nativeCard:!!s}))),p.push(ge)}}p.forEach(S=>{let L=m===1?0:S.logical-D,O=Math.abs(L),F=S.logical===Math.round(D),z=ie/2,Q=0,le=0,te=1,ge=1,me=!0,ve=0,he=0;if(n==="infinite")z=(ie>660?ie*.61:ie/2)+L*(pe+d),ge=1-Math.min(1,O)*.68,me=z+pe/2>-40&&z-pe/2<ie+40;else if(n==="timed")z+=L*(pe+d),te=1-Math.min(O,1)*.035,me=z+pe/2>-40&&z-pe/2<ie+40;else if(n==="showcase")z+=L*ke(),Q+=Math.min(O,4)*(10+x*9),te=Math.max(.48,1-O*(.09+x*.035)),le=L*(4+x*7),he=-L*(3+x*4),ge=We(1-O*.19,0,1),me=O<4.1,F&&!w&&(ve=Oe,he+=Re,le+=We(X-D,-1,1)*-3);else{let Se=L*Ee.step;z+=Ee.radius*Math.sin(Se),Q=Ee.radius*(1-Math.cos(Se)),le=Se*180/Math.PI,me=O<=Ee.reach,ge=n==="arc-tabs"?1-Math.min(O,1)*.16:1}S.card.style.transform=`translate3d(${z}px,${Q}px,0) translateX(-50%) rotate(${le}deg) rotateX(${ve}deg) rotateY(${he}deg) scale(${te})`,S.card.style.zIndex=String(1e3-Math.round(O*100)),S.card.style.opacity=String(ge),S.card.style.visibility=me?"visible":"hidden",S.card.style.pointerEvents=me&&ge>.08?"auto":"none",S.active!==F&&(S.active=F,S.card.classList.toggle("is-active",F)),S.card.tabIndex=F?0:-1,S.card.setAttribute("aria-hidden",String(!F)),s?.syncFocus(S.card)}),E.forEach(({fill:S},L)=>{S.style.transform=`scaleX(${L===ne?We(ue/u,0,1):0})`})}function Ne(){let l=ie;ie=f.clientWidth;let p=C?1:n==="timed"?.86:n==="infinite"&&ie>660?.48:.76,S=Math.max(80,Math.min(y,ie*p));if(S!==pe&&(pe=S,M.style.setProperty("--gc-carousel-slot-width",`${pe}px`)),h){let L=M.offsetHeight;if(ie!==l||L!==Ce){Ce=L,g&&(Ee=Ya(n,ie,pe,Ce,x,d));let O=Ee??Va(pe,Ce,x);m>1&&(f.style.setProperty("--gc-sweep-above",Math.ceil(O.above)+"px"),f.style.setProperty("--gc-sweep-below",Math.ceil(O.below)+"px"))}}Ae=f.clientHeight,ye=g?Ee.radius*Ee.step:n==="showcase"?pe*.54:pe+d,He()}function Ie(){!re&&!J&&(J=requestAnimationFrame(Ve))}function Ve(l){if(J=0,re)return;let p=ce?We(l-ce,0,64):0;ce=l,ee||(w?D=X:D+=(X-D)*(1-Math.exp(-p/85)),Math.abs(X-D)<5e-4&&(D=X));let S=Math.abs(X-D)<.002&&!ee;se&&!De()&&S&&(ue+=p,ue>=u&&(ue=0,X=Math.round(D)+1)),He(),Math.abs(X-D)>5e-4||se&&!De()?Ie():ce=0}function Te(l){re||m<2||(X=ct(it(Math.round(at(l,0)),m)),ue=0,w&&(D=X),He(),Ie())}function Ze(l){m<2||(X=Math.round(X)+l,ue=0,w&&(D=X),He(),Ie())}function Ue(l){se=!!l&&!w&&m>1,I.dataset.paused=String(!se),I.setAttribute("aria-label",se?"Pause slideshow":"Play slideshow"),I.setAttribute("aria-pressed",String(se)),U.setAttribute("aria-live",se?"off":"polite"),v.classList.toggle("is-playing",se),ce=0,Ie()}function Me(l){we=!!l,ce=0,Ie()}T(R,"click",()=>Ze(-1)),T(N,"click",()=>Ze(1)),T(I,"click",()=>Ue(!se)),T(f,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),f.focus({preventScroll:!0}),Ze(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),f.focus({preventScroll:!0}),Te(l.key==="Home"?0:m-1))}),T(f,"pointerdown",l=>{m<2||l.button!==0||!l.isPrimary||(ee={id:l.pointerId,x:l.clientX,y:l.clientY,start:D,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},X=D,ue=0)}),T(f,"pointermove",l=>{let p=f.getBoundingClientRect(),S=p.width/Math.max(1,f.clientWidth)||1,L=(l.clientX-p.left)/S,O=(l.clientY-p.top)/S;if(K.style.left=`${L}px`,K.style.top=`${O}px`,l.pointerType==="mouse"&&f.classList.add("has-pointer"),!ee){n==="showcase"&&!w&&(Re=We((L-ie/2)/pe,-1,1)*4,Oe=We((O-Ae/2)/Ae,-.5,.5)*-5,He());return}if(l.pointerId!==ee.id)return;let F=l.clientX-ee.x,z=l.clientY-ee.y;if(!ee.axis&&Math.hypot(F,z)>6&&(ee.axis=Math.abs(F)>Math.abs(z)?"horizontal":"vertical",ee.axis==="horizontal"&&(f.setPointerCapture(l.pointerId),f.classList.add("is-dragging"))),ee.axis!=="horizontal")return;l.preventDefault(),ee.moved=!0;let Q=performance.now(),le=Math.max(8,Q-ee.lastTime),te=-(l.clientX-ee.lastX)/S/ye/le;ee.velocity=ee.velocity*.45+te*.55,ee.lastX=l.clientX,ee.lastTime=Q,D=ee.start-F/S/ye,X=D,He()},{passive:!1});function _e(l){if(!ee||l.pointerId!==ee.id)return;let p=ee;if(ee=null,f.hasPointerCapture(l.pointerId)&&f.releasePointerCapture(l.pointerId),f.classList.remove("is-dragging"),p.moved){fe=performance.now()+400;let S=performance.now()-p.lastTime,L=w||l.type==="pointercancel"||S>120?0:We(p.velocity*210,-4,4);X=Math.round(D+L)}else X=Math.round(D);w&&(D=X),Ie()}T(f,"pointerup",_e),T(f,"pointercancel",_e),T(window,"pointerup",_e),T(f,"lostpointercapture",l=>{ee?.id===l.pointerId&&_e(l)}),T(f,"dragstart",l=>l.preventDefault()),T(f,"click",l=>{if(performance.now()<fe){l.preventDefault(),l.stopImmediatePropagation();return}let p=l.target.closest(".gc-carousel-card");!p||!f.contains(p)||p.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Te(Number(p.dataset.gcItemIndex)))},!0),T(f,"pointerleave",()=>{f.classList.remove("has-pointer"),Re=Oe=0,ee||He()}),T(v,"pointerenter",l=>{l.pointerType==="mouse"&&(de=!0)}),T(v,"pointerleave",()=>{de=!1,ce=0,Ie()}),T(v,"focusin",()=>{be=!0}),T(v,"focusout",()=>{queueMicrotask(()=>{re||(be=v.contains(document.activeElement),ce=0,Ie())})}),T(document,"visibilitychange",()=>{ce=0,Ie()});let Be;typeof ResizeObserver<"u"?(Be=new ResizeObserver(l=>{l.some(({target:p})=>p===f||p===M)&&Ne(),j&&l.some(({target:p})=>p!==f&&p!==M)&&Fe()}),Be.observe(f),h&&Be.observe(M),j&&(Be.observe(H),A.forEach(l=>Be.observe(l,{box:"border-box"})))):T(window,"resize",()=>{Ne(),Fe()});let $e;return typeof IntersectionObserver<"u"&&($e=new IntersectionObserver(l=>{xe=!l[0]?.isIntersecting,ce=0,Ie()}),$e.observe(v)),Ne(),Z=!0,Ue(se),{goTo:Te,setGeometry(l){b(l),Ce=-1,Ne()},setPlaying:Ue,setSuspended:Me,destroy(){re=!0,cancelAnimationFrame(J),Be?.disconnect(),$e?.disconnect(),B.forEach(l=>l()),v.remove()}}}var Xa,We,it,at,Ho=oe(()=>{It();Xa=new Set(["infinite","arc","arc-tabs","showcase","timed"]),We=(t,e,a)=>Math.min(a,Math.max(e,t)),it=(t,e)=>(t%e+e)%e,at=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Wo(t){let{host:e,makeCard:a,nativeList:i}=t,o=Array.isArray(t.items)?t.items:[],r=t.options||{},s=["wall","ring","angled"].includes(r.preset)?r.preset:"wall",c=!!r.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=o.length,g=s==="ring"?16:s==="wall"?12:n,h=!c&&n>1&&n<12&&s!=="angled"?Math.ceil(g/n)*n:n,m=Array.from({length:n},(l,p)=>p),w=Je(et(r.depth,55),0,100),x=Je(et(r.cardWidth,280),80,900),d=Je(et(r.gap,24),0,160),y=Math.max(1,et(r.duration,5)),C=new AbortController,b=(l,p,S,L={})=>l.addEventListener(p,S,{...L,signal:C.signal}),u={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},v=`gc-spatial-help-${++Ja}`,B=["gc-spatial",`gc-${s}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...B);let T=new Map,A=(l,p)=>{T.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,p)};A("--gc-spatial-height",`${Je(et(r.stageHeight,620),300,1400)}px`),A("--gc-spatial-radius",`${Je(et(r.radius,18),0,100)}px`),A("--gc-spatial-fit",r.fit==="contain"?"contain":"cover"),A("--gc-spatial-card-width",`${x}px`),A("--gc-spatial-gap",`${d}px`);let E=i?.track??document.createElement("div");E.classList.add("gc-spatial-canvas"),i&&E.classList.add("gc-spatial-native-track"),E.setAttribute("role",i?"list":"group"),E.setAttribute("aria-label",u[s]),E.setAttribute("aria-describedby",v);let k=document.createElement("p");k.id=v,k.className="gc-spatial-sr",k.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let j=document.createElement("span");j.className="gc-spatial-sr",j.setAttribute("aria-live","polite"),j.setAttribute("aria-atomic","true"),e.append(k,E,j);let H=r.showTitles!==!1&&(s!=="ring"||c||n===1),f=Array.from({length:h},(l,p)=>{let S=p%n,L=o[S],O=a(L,S,{caption:H,description:!1,thumbnail:!0}),F=i?.slot(O)??document.createElement("div");return F.classList.add("gc-spatial-position"),O.classList.add("gc-spatial-card"),O.dataset.spatialIndex=String(p),O.dataset.spatialSourceIndex=String(S),O.tabIndex=p===0?0:-1,p>=n&&O.setAttribute("aria-hidden","true"),!O.getAttribute("aria-label")&&!O.textContent.trim()&&O.setAttribute("aria-label",`View item ${S+1}`),F.contains(O)||F.append(O),F.parentNode!==E&&E.append(F),{position:F,card:O,sourceIndex:S,x:0,y:0,flip:0,tilt:0,lift:0}}),M=document.createElement("div");M.className="gc-spatial-nav";let q=(l,p)=>{let S=document.createElement("button");return S.type="button",S.className="gc-spatial-control",S.setAttribute("aria-label",p),Xe(S,l)},W=q("previous","Previous item"),_=q("next","Next item"),Z=document.createElement("span");Z.className="gc-spatial-count",Z.setAttribute("aria-hidden","true"),M.append(W,Z,_);let V=r.autoplay&&!c?q("playback","Pause gallery motion"):null;V&&(V.disabled=n<2,V.dataset.paused=String(n<2),V.disabled&&V.setAttribute("aria-label","Play gallery motion"),M.append(V)),e.append(M),W.disabled=_.disabled=n<2;let $,P;if(s==="ring"&&n>1&&!c){$=document.createElement("div"),$.className="gc-ring-center",$.setAttribute("aria-hidden","true"),r.showTitles!==!1&&(P=document.createElement("span"),P.className="gc-ring-label",$.append(P));let l=document.createElement("span");l.textContent="Drag to explore",$.append(l),E.after($)}let G;n||(G=document.createElement(i?"li":"p"),G.className="gc-spatial-empty",G.textContent="No items available.",E.append(G));let R=!1,N=0,I=-1,Y=1,U=1,K=1,re=1,D=1,X=1,ne=0,J=1,ce=1,ue=0,se=0,de=1,be=!!r.autoplay&&!c&&n>1,xe=!1,we=!1,ee=!1,fe=!0,ie=null,Ae=0,pe=0,ke=0,Ce=-1,Ee=!1,ye={x:-1e4,y:-1e4,inside:!1};function Re(l=N){if(!P)return;let p=typeof o[l]?.title=="string"?o[l].title.trim():"";P.textContent===p&&P.hidden===!p||(P.textContent=p,P.hidden=!p,Oe())}function Oe(){!$||R||($.classList.remove("is-below"),$.offsetHeight>ne&&$.classList.add("is-below"))}function De(l,p=!1,S=null){if(!n){Z.textContent="00 / 00";return}let L=rt(l,n),O=S!==null&&f[S]?.sourceIndex===L,F=O&&m[L]!==S;if(O){let z=f[m[L]].card;m[L]=S,F&&(f[S].card.removeAttribute("aria-hidden"),i?.syncFocus(f[S].card),document.activeElement===z&&(Ee=!0,f[S].card.focus({preventScroll:!0}),Ee=!1))}if(I===L&&!F){p&&(j.textContent=`Item ${L+1} of ${n}${o[L].title?`: ${o[L].title}`:""}`);return}N=L,Re(),Z.textContent=`${String(N+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`,f.forEach(({card:z,sourceIndex:Q},le)=>{let te=m[Q]===le;z.tabIndex=te&&Q===N?0:-1,z.classList.toggle("is-selected",te&&Q===N),te?z.removeAttribute("aria-hidden"):z.setAttribute("aria-hidden","true"),i?.syncFocus(z)}),p&&(j.textContent=`Item ${N+1} of ${n}${o[N].title?`: ${o[N].title}`:""}`),I!==N&&(I=N,t.onChange?.(N))}function ct(l){be=!!l&&!c&&n>1,V&&(V.dataset.paused=String(!be),V.setAttribute("aria-label",be?"Pause gallery motion":"Play gallery motion")),Me()}function Fe(l){xe=!!l,xe||Me()}function ot(l,p,S){return p+Math.round((l-p)/S)*S}function He(l){let p={index:m[l],target:l,distance:1/0};return f.forEach((S,L)=>{if(S.sourceIndex!==l)return;let O=L;if(s==="ring")O=ot(ue,L,h);else if(s==="wall"){let z=Math.floor(L/J);O=ce>2?ot(ue,z,ce):z}let F=Math.abs(O-ue);F<p.distance&&(p={index:L,target:O,distance:F})}),p}function Ne(l){let p=l.getBoundingClientRect();return p.left+p.width/2}function Ie(){if(n<2)return;let l=Ne(f[0].position),p=Ne(f[1].position)-l;if(Math.abs(p)<1)return;let S=Je(Math.round((Ne(E)-l)/p),0,n-1);De(S,!1,S)}function Ve(l,p=!1){if(!n)return;let S=rt(Math.round(et(l,0)),n),L=c?{index:S,target:S}:He(S);if(De(S,!0,L.index),c){let O=f[S].position;E.scrollTo({left:E.scrollLeft+Ne(O)-Ne(E),behavior:"auto"})}else se=L.target;p&&f[L.index].card.focus({preventScroll:!0}),Me()}function Te(){if(!R){if(Y=Math.max(1,E.clientWidth),U=Math.max(1,E.clientHeight),s==="ring"){let l=Math.max(80,Math.min(Y-32,U-42)),p=Je(et(r.ringDiameter,l),80,l);X=Math.max(0,p*.38);let S=to*X/Math.max(1,h),L=Math.min(p*.17,S*.8),O=1.15-Je(d,0,100)/160;if(K=n<=1?Math.min(x,Y*.65,U*.58):Math.max(18,Math.min(Math.min(x*.22,L)*O,S*.94)),re=K*1.28,$){let F=Math.max(0,X-Math.max(32,re)/2-10);ne=Math.floor(F*Math.SQRT2),$.style.setProperty("--gc-ring-label-width",`${ne}px`),$.style.setProperty("--gc-ring-label-y",`${E.offsetTop+U/2}px`),Oe()}D=Math.max(24,to*Math.max(1,X)/Math.max(1,h))}else s==="wall"?(J=h>=10?3:h>=4?2:1,ce=Math.max(1,Math.ceil(h/J)),re=Math.min((U-56-(J-1)*d)/J,x*.62,230),K=Math.max(60,Math.min(re*1.5,x,Y*.43)),re=K/1.5,D=K+Math.min(d,70)):(K=Math.min(x,Y*.68,(U-70)*.76),re=K/.76,D=K*(.72+(100-w)*.001)+d);f.forEach(({position:l})=>{l.style.width=`${Math.max(24,K)}px`,l.style.height=`${Math.max(32,re)}px`}),c&&f.forEach(({position:l})=>{l.style.width=`${Math.min(x,Y*.72)}px`,l.style.height=`${Math.min(U-40,x*1.15)}px`}),Me()}}function Ze(l){if(c||!n||xe)return!1;let p=be&&!we&&!ee&&!ie&&fe&&!document.hidden;if(p){let F=l/y;s==="angled"?(se+=F*de,se>=n-1&&(se=n-1,de=-1),se<=0&&(se=0,de=1)):se+=F}let S=ie?.moved?1:1-Math.exp(-l*11);ue+=(se-ue)*S,Math.abs(se-ue)<1e-4&&(ue=se);let L=Math.abs(se-ue)>1e-4||p;if(p||ie?.moved){let F=ie?.moved?ue:se,z=s==="wall"?Math.round(F)*J+m[N]%J:Math.round(F),Q=s==="wall"?Math.min(rt(z,ce*J),h-1):rt(z,h);De(f[Q].sourceIndex,!1,Q)}let O=1-Math.exp(-l*13);return f.forEach((F,z)=>{let{position:Q,card:le}=F;if(s==="ring"){let te=-Math.PI/2+(z-ue)*to/h;F.x=n===1?0:Math.cos(te)*X,F.y=n===1?0:Math.sin(te)*X;let ge=Math.hypot(ye.x-(Y/2+F.x),ye.y-(U/2+F.y)),me=Math.max(65,K*2.6),ve=ye.inside&&!ie?.moved?Math.max(0,1-ge/me):0,he=ve*ve*(50+w*1.3);F.flip+=(he-F.flip)*O,Math.abs(F.flip-he)>.05&&(L=!0),le.toggleAttribute("data-gc-back-facing",F.flip>90);let Se=n===1?0:te*180/Math.PI+90;Q.style.transform=`translate3d(${F.x}px,${F.y}px,0) rotate(${Se}deg)`,le.style.transform=`perspective(700px) rotateY(${F.flip}deg) translateZ(${ve*12}px)`,Q.style.zIndex=String(z===Ce?h+2:1)}else if(s==="wall"){let te=z%J,me=Math.floor(z/J)-ue;if(ce>2){let At=ce%2===0?.5:0;me=rt(me-At+ce/2,ce)-ce/2}let ve=Math.min(.68,2.6/Math.max(3,ce)),he=me*ve,Se=Math.max(D/ve,Y*.4),ht=w/100,St=Math.sin(he)*Se,Ct=(1-Math.cos(he))*Se*ht*.65,Mt=(te-(J-1)/2)*(re+Math.min(d,50)),Qe=z===Ce||ee&&z===m[N]?1:0;F.lift+=(Qe-F.lift)*O,Math.abs(Qe-F.lift)>.002&&(L=!0),Q.style.transform=`translate3d(${St}px,${Mt}px,${Ct+F.lift*20}px) rotateY(${-he*180/Math.PI*ht}deg)`,Q.style.zIndex=String(Math.round(Ct)+(Qe?1e3:1)),le.style.transform=`scale(${1+F.lift*.035})`,Q.style.opacity=Math.abs(he)>1.6?"0":"1",Q.style.visibility=Math.abs(he)>1.6?"hidden":"visible"}else{let te=z-ue,ge=z===Ce||ee&&z===m[N]?1:0;F.lift+=(ge-F.lift)*O,Math.abs(ge-F.lift)>.002&&(L=!0);let me=-(25+w*.28)*(1-F.lift);Q.style.transform=`translate3d(${te*D}px,${-F.lift*14}px,${F.lift*110}px) rotateY(${me}deg)`,Q.style.zIndex=String(ge?n+2:n-z),le.style.transform="none"}}),L}function Ue(l){if(pe=0,R)return;let p=Math.min(.05,Math.max(.001,(l-(ke||l-16.7))/1e3));ke=l,Ze(p)&&fe&&!document.hidden?pe=requestAnimationFrame(Ue):ke=0}function Me(){!R&&!pe&&!c&&(pe=requestAnimationFrame(Ue))}c&&b(E,"scroll",Ie,{passive:!0}),b(W,"click",()=>Ve(N-1)),b(_,"click",()=>Ve(N+1)),V&&b(V,"click",()=>ct(!be)),b(E,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let p=l.key==="Home"?0:l.key==="End"?n-1:N+(l.key==="ArrowRight"?1:-1);Ve(p,!0)}),b(E,"focusin",l=>{ee=!0;let p=l.target.closest?.("[data-spatial-index]");p&&!Ee&&De(Number(p.dataset.spatialSourceIndex),!1,Number(p.dataset.spatialIndex)),Me()}),b(E,"focusout",()=>{queueMicrotask(()=>{R||(ee=E.contains(document.activeElement),Me())})}),b(E,"pointerenter",l=>{l.pointerType!=="touch"&&(we=!0,ye.inside=!0,Me())}),b(E,"pointerleave",()=>{we=!1,ye.inside=!1,Ce=-1,Re(),Me()}),b(E,"pointermove",l=>{if(l.pointerType==="touch")return;let p=E.getBoundingClientRect();ye.x=l.clientX-p.left,ye.y=l.clientY-p.top,ye.inside=!0;let S=l.target.closest?.("[data-spatial-index]");Ce=S?Number(S.dataset.spatialIndex):-1,Re(Ce>=0?f[Ce].sourceIndex:N),Me()}),b(E,"pointerdown",l=>{let p=l.target.closest?.("[data-spatial-index]");p&&De(Number(p.dataset.spatialSourceIndex),!1,Number(p.dataset.spatialIndex)),!(c||n<2||l.pointerType==="mouse"&&l.button!==0)&&(ie={id:l.pointerId,x:l.clientX,y:l.clientY,start:se,moved:!1})}),b(window,"pointermove",l=>{if(!ie||l.pointerId!==ie.id)return;let p=l.clientX-ie.x,S=l.clientY-ie.y;if(!ie.moved){if(Math.abs(S)>12&&Math.abs(S)>Math.abs(p)*1.2){ie=null;return}if(Math.abs(p)<7)return;ie.moved=!0,E.classList.add("is-dragging"),E.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),se=ie.start-p/D,(s==="angled"||s==="wall"&&ce<=2)&&(se=Je(se,0,s==="wall"?ce-1:n-1)),Me()},{passive:!1});let _e=l=>{if(!ie||l.pointerId!==ie.id)return;let p=ie.moved;if(ie=null,E.classList.remove("is-dragging"),E.hasPointerCapture?.(l.pointerId)&&E.releasePointerCapture(l.pointerId),p){Ae=performance.now()+350,se=Math.round(se);let S=s==="wall"?Math.round(se)*J+m[N]%J:Math.round(se),L=s==="wall"?Math.min(rt(S,ce*J),h-1):rt(S,h);De(f[L].sourceIndex,!0,L)}Me()};b(window,"pointerup",_e),b(window,"pointercancel",_e),b(E,"click",l=>{performance.now()<Ae&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),b(E,"dragstart",l=>l.preventDefault()),b(document,"visibilitychange",Me);let Be=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(p=>p.target===E)?Te():Oe()}):null;Be?.observe(E),$&&Be?.observe($),Be||b(window,"resize",Te);let $e=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{fe=l[0]?.isIntersecting??!0,fe&&Me()},{rootMargin:"100px"}):null;return $e?.observe(e),Te(),De(0),{goTo:Ve,setPlaying:ct,setSuspended:Fe,destroy(){R||(R=!0,cancelAnimationFrame(pe),Be?.disconnect(),$e?.disconnect(),C.abort(),k.remove(),j.remove(),M.remove(),$?.remove(),i?G?.remove():E.remove(),e.classList.remove(...B),T.forEach((l,p)=>l?e.style.setProperty(p,l):e.style.removeProperty(p)))}}}var Ja,Je,rt,et,to,No=oe(()=>{It();Ja=0,Je=(t,e,a)=>Math.max(e,Math.min(a,t)),rt=(t,e)=>(t%e+e)%e,et=(t,e)=>Number.isFinite(Number(t))?Number(t):e,to=Math.PI*2});function Oo({host:t,items:e,options:a,makeCard:i,onChange:o,nativeList:r}){let s=Number(a.stageHeight)||680,c=Math.max(300,s-120),n=Math.max(0,Number(a.gap)||0),g=Number.isFinite(Number(a.depth))?Number(a.depth):45,h=a.previewScroll===!1,m=h?window:t;t.classList.add("gc-stack"),t.style.height=h?"auto":s+"px",t.style.overflowY=h?"visible":"auto",t.style.overscrollBehavior=h?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let w=r?.track??document.createElement("div");w.classList.add("gc-stack-track"),t.append(w);let x=e.map((B,T)=>{let A=i(B,T,{caption:a.showTitles,description:!0}),E=r?.slot(A)??document.createElement("div");E.classList.add("gc-stack-slot"),A.parentElement!==E&&E.append(A),w.append(E),E.style.zIndex=T+1,A.style.width=`min(${a.stackCardWidth}px,calc(100% - 48px))`,A.style.minHeight=c+"px";let k=A.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),j=!Array.from(k).some(H=>!H.closest("[hidden]")&&H.textContent.trim());return A.classList.toggle("gc-stack-image-only",j),{card:A,wrap:E,imageOnly:j,start:0,duration:1/0}}),d=0;function y(){return h?-w.getBoundingClientRect().top:t.scrollTop}function C(){d=0;let B=y(),T=0;x.forEach(({card:A,start:E,duration:k},j)=>{let H=Math.max(0,Math.min(1,(B-E)/k));A.style.transform=a.reducedMotion?"none":`perspective(1300px) translateY(${H*-32}px) scale(${1-H*.14}) rotateX(${H*g*.25}deg)`,A.style.filter=`brightness(${1-H*.23})`,H>=.5&&(T=Math.min(j+1,x.length-1))}),x.length&&o?.(T)}function b(){d||(d=requestAnimationFrame(C))}function u(){let B=x.map(({card:E,wrap:k})=>({height:E.offsetHeight,rowHeight:k.offsetHeight})),T=h?window.innerHeight:t.clientHeight,A=w.clientTop+(parseFloat(getComputedStyle(w).paddingTop)||0);x.forEach((E,k)=>{let{height:j,rowHeight:H}=B[k],f=Math.min(40,T-24-j);E.wrap.style.top=f+"px",E.start=A-f,k&&(x[k-1].duration=Math.max(1,E.start-x[k-1].start));let M=E.imageOnly&&j<=T-64?j*.24:0,q=k<x.length-1?n-M:0;E.wrap.style.marginBottom=q+"px",A+=H+q,k===x.length-1&&(E.duration=1/0,w.style.paddingBottom=Math.max(40,T-f-H)+"px")}),b()}let v;return u(),typeof ResizeObserver<"u"&&(v=new ResizeObserver(u),v.observe(w,{box:"border-box"}),x.forEach(({card:B})=>v.observe(B,{box:"border-box"}))),window.addEventListener("resize",u),m.addEventListener("scroll",b,{passive:!0}),{goTo(B){let T=x[Math.max(0,Math.min(x.length-1,Math.round(B)))];if(!T)return;let A=h?window.scrollY+T.start-y():T.start;m.scrollTo({top:A,behavior:a.reducedMotion?"instant":"smooth"})},destroy(){v?.disconnect(),window.removeEventListener("resize",u),cancelAnimationFrame(d),m.removeEventListener("scroll",b),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",w.remove()}}}var $o=oe(()=>{});function Tt(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function oo(t,e,a,i,o,r){t.beginPath(),t.roundRect(e,a,i,o,Math.max(0,Math.min(r,i/2,o/2)))}function Ka(t,e,a){let i=[];for(let o of e.split(/\n/)){let r="";for(let s of o.split(/\s+/)){let c=r?r+" "+s:s;r&&t.measureText(c).width>a?(i.push(r),r=s):r=c}i.push(r)}return i}function Go(t,e,a){let i=Math.max(80,e.cardWidth),o=Math.min(e.cardPadding,i*.4),r=i-2*o,s=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,c=document.createElement("canvas").getContext("2d"),n=t.map(({item:h,image:m})=>{let w=[],x=(T,A,E,k,j,H,f=!1,M=a.bodyFamily)=>{if(!T)return;let q=E+" "+A+"px "+M;c.font=q;let W=Ka(c,T,Math.max(1,r-(f?16:0)));w.push({font:q,size:A,color:k,align:j,lines:W,height:W.length*A*1.25+(f?10:0),gap:H,isButton:f})},d=r*e.imageWidth/100,y=m?.naturalWidth/m?.naturalHeight||1,[C,b]=e.aspectRatio.split(":").map(Number),u=e.aspectRatio==="circle"?1:C&&b?C/b:y,v=m&&e.showImage?{image:m,width:d,height:d/u,gap:0}:null;return(e.textPlacement==="card"||!h.src||!e.showImage)&&(e.showTitles&&x(h.title,e.titleCustom&&e.titleSize?e.titleSize*s:a.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:a.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:a.ink,e.titleAlign,0,!1,a.family),e.showDescription&&x(h.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*s:a.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:a.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:a.ink,e.descriptionAlign,w.length?e.titleGap:0),e.showButton&&h.buttonLabel&&h.link&&x(h.buttonLabel,a.size,a.weight,a.buttonInk,"center",e.buttonGap,!0)),v&&(e.cardOrder==="content"?(v.gap=w.length?e.mediaGap:0,w.push(v)):(w.length&&(w[0].gap+=e.mediaGap),w.unshift(v))),{pieces:w,height:Math.max(1,2*o+w.reduce((T,A)=>T+A.gap+A.height,0))}}),g=Math.max(1,...n.map(h=>h.height));return n.map(({pieces:h,height:m})=>{let w=document.createElement("canvas"),x=Math.min(2,2048/Math.max(i,g));w.width=Math.max(1,Math.round(i*x)),w.height=Math.max(1,Math.round(g*x));let d=w.getContext("2d");d.scale(x,x);let y=e.cardSizing==="equal"?g:m,C=(g-y)/2;e.cardBackground&&(d.fillStyle=e.cardColor,oo(d,0,C,i,y,e.spiralRadius),d.fill());let b=C+o+(e.cardAlign==="bottom"?y-m:e.cardAlign==="middle"?(y-m)/2:0),u;for(let v of h){if(b+=v.gap,v.image){let B=v.image.naturalWidth/v.image.naturalHeight,T=e.fit==="contain"||e.fit==="fit",A=T?Math.min(v.width,v.height*B):v.width,E=T?A/B:v.height,k=o+(e.imageAlign==="left"?0:e.imageAlign==="right"?r-v.width:(r-v.width)/2)+(v.width-A)/2,j=b+(v.height-E)/2,H=e.aspectRatio==="circle"?v.width/2:e.imageRadius;if(e.shadowEnabled){d.save(),d.shadowColor=e.shadowColor,d.shadowBlur=e.shadowBlur*x;let W=e.shadowAngle*Math.PI/180;d.shadowOffsetX=Math.cos(W)*e.shadowDistance*x,d.shadowOffsetY=Math.sin(W)*e.shadowDistance*x;let _=e.shadowSpread;oo(d,k-_,j-_,A+2*_,E+2*_,H+_),d.fillStyle=e.shadowColor,d.fill(),d.restore()}d.save(),e.aspectRatio==="circle"&&(d.beginPath(),d.arc(k+A/2,j+E/2,v.width/2,0,Math.PI*2),d.clip()),oo(d,k,j,A,E,e.aspectRatio==="circle"?0:H),d.clip();let f=T?Math.min(A/v.image.naturalWidth,E/v.image.naturalHeight):Math.max(A/v.image.naturalWidth,E/v.image.naturalHeight),M=v.image.naturalWidth*f,q=v.image.naturalHeight*f;d.drawImage(v.image,k+(A-M)/2,j+(E-q)/2,M,q),e.overlayEnabled&&(d.fillStyle=e.imageTint,d.fillRect(k,j,A,E)),e.imageBorder&&(d.strokeStyle=e.imageBorderColor,d.lineWidth=2*e.imageBorderSize,d.stroke()),d.restore()}else{let B=v.align==="inherit"?"center":v.align;if(d.font=v.font,d.textBaseline="top",d.textAlign=B,d.fillStyle=v.color,v.isButton){let A=Math.min(r,Math.max(...v.lines.map(k=>d.measureText(k).width))+16),E=(i-A)/2;d.fillStyle=a.accent,d.fillRect(E,b,A,v.height),d.fillStyle=v.color,u={left:E/i,right:(E+A)/i,top:b/g,bottom:(b+v.height)/g}}let T=B==="left"?o:B==="right"?i-o:i/2;v.lines.forEach((A,E)=>d.fillText(A,T,b+(v.isButton?5:0)+E*v.size*1.25,r))}b+=v.height}return{canvas:w,buttonBounds:u,aspect:i/g}})}var Uo=oe(()=>{});function _o(t,e){let a="http://www.w3.org/2000/svg";function i(y,C,b){let u=document.createElementNS(a,y);for(let[v,B]of Object.entries(C))u.setAttribute(v,B);return b?.append(u),u}let o=i("svg",{width:0,height:0,"aria-hidden":"true"});o.style.position="absolute",t.append(o);let r=i("defs",{},o),s=i("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},r),c=i("feMorphology",{in:"SourceAlpha",operator:"dilate"},s),n=i("feGaussianBlur",{},s),g=i("feOffset",{result:"mask"},s),h=i("feFlood",{},s);i("feComposite",{in2:"mask",operator:"in"},s);let m=i("feMerge",{},s);i("feMergeNode",{},m),i("feMergeNode",{in:"SourceGraphic"},m);let w=i("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},r),x=i("feFlood",{},w);i("feComposite",{in2:"SourceGraphic",operator:"atop"},w);let d=s.cloneNode(!0);return d.id=e+"-card-shadow",r.append(d),y=>{let C=(y.cardShadowAngle??90)*Math.PI/180;d.querySelector("feMorphology").setAttribute("radius",y.cardShadowSpread||0),d.querySelector("feGaussianBlur").setAttribute("stdDeviation",(y.cardShadowBlur||0)/2);let b=d.querySelector("feOffset");b.setAttribute("dx",Math.cos(C)*(y.cardShadowDistance||0)),b.setAttribute("dy",Math.sin(C)*(y.cardShadowDistance||0)),d.querySelector("feFlood").setAttribute("flood-color",y.cardShadowColor||"#000");let u=[];y.shadowEnabled&&u.push("url(#"+s.id+")"),y.cardShadow&&u.push("url(#"+d.id+")");let v=y.shadowAngle*Math.PI/180;c.setAttribute("radius",y.shadowSpread),n.setAttribute("stdDeviation",y.shadowBlur/2),g.setAttribute("dx",Math.cos(v)*y.shadowDistance),g.setAttribute("dy",Math.sin(v)*y.shadowDistance),h.setAttribute("flood-color",y.shadowColor),x.setAttribute("flood-color",y.imageTint),t.style.setProperty("--gc-shadow-filter",u.join(" ")||"none"),t.style.setProperty("--gc-image-filter",y.imageTint.endsWith("00")&&y.imageTint.length===9?"none":"url(#"+w.id+")")}}var Xo=oe(()=>{});var Yo,qt,Vo=oe(()=>{Yo='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',qt=class{constructor(e,a,i){this.root=e,this.cards=a,this.projects=i;let o=a[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(o)?o:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let r=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",r),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${Yo}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${Yo}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${r}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",c=>{if(c.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(c.clientX<n.left||c.clientX>n.right||c.clientY<n.top||c.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",c=>{(c.key==="ArrowLeft"||c.key==="ArrowRight")&&(c.preventDefault(),this.showFrame(this.frame+(c.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",c=>{!c.isPrimary||c.target.closest("button")||(this.galleryPointer={id:c.pointerId,x:c.clientX,y:c.clientY},s.setPointerCapture(c.pointerId))}),s.addEventListener("pointerup",c=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==c.pointerId)return;s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId);let g=c.clientX-n.x,h=c.clientY-n.y;Math.abs(g)>35&&Math.abs(g)>Math.abs(h)*1.2&&this.showFrame(this.frame+(g<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let a=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!a,this.dialog.querySelector("[data-gallery-next]").hidden=!a,this.thumbnails.hidden=!a,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(o=>{let r=document.createElement("li");return r.textContent=o,r})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((o,r)=>{let s=document.createElement("button");s.type="button",s.className="project-thumbnail",s.setAttribute("aria-label",`Show ${o.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(o.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,s.append(c),s.addEventListener("click",()=>this.showFrame(r)),s})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let a=this.project.gallery[this.frame];this.image.src=new URL(a.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${a.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${a.label}`,[...this.thumbnails.children].forEach((i,o)=>i.setAttribute("aria-current",String(o===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Ye,bt,Rt=oe(()=>{Lt();Ye=Object.freeze({...Lo,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),bt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function Jo(t,e,{pauseOnHover:a=!0,interactionRestMs:i=6e3}={}){let o=t.querySelector("[data-orbit-toggle]"),r=new AbortController,s=(u,v,B)=>u.addEventListener(v,B,{signal:r.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let n=0,g=0,h=!1,m=u=>!!u&&t.contains(u)&&(u.matches(":focus-visible")||!!u.closest(".orbit-card")),w=()=>!h&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,x=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(n),e.autoFrame=0,n=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},d=u=>{if(e.autoFrame=0,!w()){x();return}let v=Math.min(.05,Math.max(0,(u-e.autoTime)/1e3));e.autoTime=u;let B=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(g+=v,g>=Number(t.dataset.interval||5)){g=0,e.autoTime=0,c.animateTo.call(e,Math.round(e.position)+B),n=setTimeout(y,100);return}}else e.position=(e.position+B*v*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(d)},y=()=>{if(!w()){x(),e.frame&&!h&&(n=setTimeout(y,100));return}let u=e.resumeAt-performance.now();if(u>0){x(),n=setTimeout(y,u);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(d))},C=(u=6e3)=>{x(),e.resumeAt=performance.now()+u};e.animateTo=function(...u){C(i),c.animateTo.apply(this,u),y()},e.settleImmediately=function(...u){c.settleImmediately.apply(this,u),y()},e.openProject=function(...u){C(),c.openProject.apply(this,u),y()},s(t,"pointerenter",u=>{u.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||a)&&(e.hovered=!0,y())}),s(t,"pointerleave",u=>{u.pointerType!=="touch"&&(e.hovered=!1,y())}),s(t,"focusin",u=>{e.keyboardFocused=m(u.target),y()}),s(t,"focusout",u=>{e.keyboardFocused=m(u.relatedTarget),y()}),s(t,"pointerup",()=>{C(i),y()}),s(t,"pointercancel",()=>{C(i),y()}),s(e.viewer.dialog,"close",()=>{C(),y()}),s(document,"visibilitychange",y),s(e.reducedMotion,"change",y),s(o,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,o.dataset.paused=String(e.manuallyPaused),o.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),y()});let b=new IntersectionObserver(u=>{e.inView=u.some(v=>v.isIntersecting&&v.intersectionRatio>=.15),y()},{threshold:.15});return b.observe(e.stage),e.stopAutoplay=x,e.syncAutoplay=y,()=>{h=!0,x(),r.abort(),b.disconnect(),Object.assign(e,c)}}var Ko=oe(()=>{});var Pe,Zo,io,Qo,ei,ti,oi,ii,ai,ri,ni,si,ci,li,Ft,di,yt,pi,ao=oe(async()=>{Pe=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),Zo=Pe.CanvasTexture,io=Pe.BufferGeometry,Qo=Pe.Float32BufferAttribute,ei=Pe.LineBasicMaterial,ti=Pe.LineLoop,oi=Pe.DoubleSide,ii=Pe.Mesh,ai=Pe.NoToneMapping,ri=Pe.PerspectiveCamera,ni=Pe.PlaneGeometry,si=Pe.Raycaster,ci=Pe.Scene,li=Pe.ShaderMaterial,Ft=Pe.SRGBColorSpace,di=Pe.TextureLoader,yt=Pe.Vector2,pi=Pe.WebGLRenderer});var Za,vt,gi=oe(async()=>{Za=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),vt=Za.default});var Qa,ro,ui=oe(async()=>{Qa=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),ro=Qa.CustomEase});function hi(t,e,a=64){let i=t/e,o=new ni(t,t*9/16,a,1),r=o.attributes.position,s=o.attributes.uv;for(let c=0;c<r.count;c++){let n=(s.getX(c)-.5)*e;r.setX(c,i*Math.sin(n)),r.setZ(c,i*(Math.cos(n)-1))}return o.computeVertexNormals(),o.computeBoundingSphere(),o}function mi(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var no=oe(async()=>{await ao()});function xt(t,e){let a=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*a,panelArc:t.radiansPerSlide*a,height:t.slotHeight*a}}function Bt(t,{radius:e,pitch:a,radiansPerSlide:i}){let o=t*i;return{x:Math.sin(o)*e,y:-t*a,z:(Math.cos(o)-1)*e,angle:o,taper:1,shade:(1-Math.cos(o))/2*.58}}function fi(t,e){let a=xt(t,e);return hi(a.cardWidth,a.panelArc)}function so(t,e=64){let a=[];for(let i=0;i<=e;i++){let o=(i/e-.5)*t.radiansPerSlide;a.push(t.radius*Math.sin(o),t.slotHeight/2,t.radius*(Math.cos(o)-1))}for(let i=e;i>=0;i--){let o=(i/e-.5)*t.radiansPerSlide;a.push(t.radius*Math.sin(o),-t.slotHeight/2,t.radius*(Math.cos(o)-1))}return a}var Dt=oe(async()=>{await no()});function co(t,e){let a=fi(t,e);return a.scale(1,1/t.aspect/(9/16),1),a.computeVertexNormals(),a.computeBoundingSphere(),a}function bi(t,e,a,i,o){let r=Math.min(t,e)*Math.min(40,Math.max(0,o))/100,s=t-2*r,c=e-2*r,n=s/c,g=i==="fit"?Math.max:Math.min,h=g(1,n/a),m=g(1,a/n);return{contentWidth:s,contentHeight:c,uvScaleX:h,uvScaleY:m,imageWidth:s/h,imageHeight:c/m,padding:r}}var yi=oe(async()=>{await Dt();await Dt()});function lo({stageWidth:t,stageHeight:e,spiralWidthPercent:a,cardWidth:i,aspect:o,rise:r,riseUnit:s}){let c=Math.max(1,t*a/200),n=Math.max(1,Math.min(i,c*Math.PI/3,e*.4*o)),g=Math.PI*2*c/n,h=s==="percent"?e*r/100:r*Math.min(1,t/640);return{radius:c,slotWidth:n,slotHeight:n/o,aspect:o,pitch:Math.max(n/o*1.25/g,h),radiansPerSlide:n/c,cardsPerTurn:Math.PI*2*c/n}}var vi=oe(()=>{});function wi(t,e,a){let i=e.radius*2.4,o=i/(i+2*e.radius),r=Math.ceil((a/(2*o)+e.slotHeight/2)/e.pitch)+2,s=Math.floor(t);return{first:s-r,last:s+r,count:r*2+1}}function ki(t,e,a){let i=t*e.radiansPerSlide,o=i-a.panelArc/2,r=i+a.panelArc/2,s=Math.PI*2,c=C=>Math.ceil((o-C)/s)<=Math.floor((r-C)/s),n=c(0)?1:Math.max(Math.cos(o),Math.cos(r)),g=c(Math.PI)?-1:Math.min(Math.cos(o),Math.cos(r)),h=e.radius*2.4,m=h/(h+e.radius*(1-n)),w=h/(h+e.radius*(1-g)),x=-t*e.pitch,d=x+a.height/2,y=x-a.height/2;return{minY:Math.min(y*m,y*w),maxY:Math.max(d*m,d*w)}}function Si(t,e){let a=Math.min(80,e*.08),i=r=>Math.max(0,Math.min(1,r)),o=Math.min(i((e/2-t.minY)/a),i((t.maxY+e/2)/a));return o*o*(3-2*o)}function Ci(t,e,a,i){let o=a-e;return Math.abs(o)>i/2&&(o-=Math.round(o/i)*i),t+o}var xi,Mi=oe(async()=>{await Dt();vi();xi=(t,e)=>(t%e+e)%e});var Ei,Ai=oe(()=>{Ei=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function Pi(t,{textureSource:e=a=>a.querySelector("img").src}={}){let{root:a,stage:i}=t,o;try{o=new pi({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return a.dataset.renderer="css-fallback",()=>{delete a.dataset.renderer}}o.outputColorSpace=Ft,o.toneMapping=ai,o.setClearColor(0,0);let r=o.domElement;r.style.removeProperty("display"),r.className="orbit-webgl",r.setAttribute("aria-hidden","true"),i.append(r);let s=new ci,c=new ri,n=new si,g=new yt,h=new AbortController,m=(I,Y,U)=>I.addEventListener(Y,U,{signal:h.signal}),w=t.render,x=t.pointerDown,d=new Map,y=new Map;function C(){for(let I of t.cards){let Y=y.get(I);if(Y?.image!==I.artwork&&(Y?.dispose(),y.delete(I),I.artwork)){let U=new Zo(I.artwork);U.colorSpace=Ft,y.set(I,U)}}}let b=[],u,v,B=t.position,T=t.position,A="",E=!1,k=!1,j=null,H=null,f=!1,M=!1;a.dataset.renderer="loading-webgl";let q=()=>lo({stageWidth:i.clientWidth,stageHeight:i.clientHeight,spiralWidthPercent:Number(a.dataset.spiralWidth),cardWidth:Number(a.dataset.cardWidth),aspect:Number(a.dataset.cardAspect),rise:Number(a.dataset.rise),riseUnit:a.dataset.riseUnit}),W=()=>{let I=t.cards[0],Y=new li({uniforms:{screenshot:{value:d.get(e(I))},dimensions:{value:new yt},contentDimensions:{value:new yt(1,1)},imageScale:{value:new yt(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:tr,fragmentShader:or,transparent:!0,side:oi,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),U=new ii(u,Y),K=new ti(v,new ei({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),re={card:I,mesh:U,guide:K,material:Y,surface:{scale:0,target:0}};U.userData.panel=re,b.push(re),s.add(U,K)},_=I=>{let Y=wi(B,I,i.clientHeight);for(;b.length<Y.count;)W();for(;b.length>Y.count;){let U=b.pop();s.remove(U.mesh,U.guide),U.material.dispose(),U.guide.material.dispose()}b.forEach((U,K)=>{U.offset=Y.first+K-B,U.card=t.cards[xi(Y.first+K,t.count)],U.material.uniforms.screenshot.value=y.get(U.card)||d.get(e(U.card))})},Z=()=>{let I=i.clientWidth,Y=i.clientHeight,U=q(),K=Number(a.dataset.slotGap||3);_(U);let re=xt(U,K),{cardWidth:D,panelArc:X}=re,{radius:ne}=U;a.dataset.slotMetrics=JSON.stringify({...U,cardArc:X,cardWidth:D,cardHeight:re.height,gap:K,imageFit:a.dataset.imageFit,imagePadding:Number(a.dataset.imagePadding||0)}),b.forEach(de=>{de.material.uniforms.dimensions.value.set(D,re.height);let be=de.material.uniforms;be.cornerRadius.value=Math.min(Number(a.dataset.cornerRadius)||0,D/2,re.height/2),be.borderWidth.value=Number(a.dataset.borderWidth)||0,be.solidBack.value=a.dataset.backFace==="solid",be.showImage.value=!!de.card.artwork||a.dataset.showImage!=="false";for(let ee of["backColor","borderColor","imageTint","mirrorColor"]){let fe=be[ee],ie=ee==="imageTint"&&de.card.artwork?"#00000000":a.dataset[ee]||"#00000000";if(fe.hex!==ie){fe.hex=ie;let Ae=ie.length===7?ie+"ff":ie;fe.value=[1,3,5,7].map(pe=>parseInt(Ae.slice(pe,pe+2),16)/255)}}let xe=de.material.uniforms.screenshot.value.image;if(!xe)return;let we=bi(D,re.height,(xe.naturalWidth||xe.width)/(xe.naturalHeight||xe.height),de.card.artwork?"fit":a.dataset.imageFit,de.card.artwork?0:Number(a.dataset.imagePadding||0));de.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),de.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let J=Math.min(window.devicePixelRatio||1,2),ce=`${I}:${Y}:${D}:${X}:${re.height}:${ne}:${J}`;if(ce===A||!I||!Y)return;A=ce,o.setPixelRatio(J),o.setSize(I,Y,!1),c.position.set(0,0,ne*2.4),c.fov=mi(Y,c.position.z),c.aspect=I/Y,c.near=.1,c.far=ne*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let ue=u;u=co(U,K);let se=v;v=new io,v.setAttribute("position",new Qo(so(U),3)),b.forEach(de=>{de.mesh.geometry=u,de.guide.geometry=v,de.material.uniforms.dimensions.value.set(D,re.height)}),ue?.dispose(),se?.dispose()},V=()=>{if(!E||k||f||M||!t.geometry)return;M=!0,B=Ci(B,T,t.position,t.count),T=t.position,Z();let I=q(),Y=xt(I,Number(a.dataset.slotGap||3)),U=a.dataset.focusMode==="keyboard"&&a.contains(document.activeElement),K=0;b.forEach(D=>{let{card:X,mesh:ne,material:J}=D,ce=Bt(D.offset,I),ue=ki(D.offset,I,Y),se=Si(ue,i.clientHeight),de=a.dataset.edgeMode==="preset"?se:+(se>0),be=U&&X===t.cards[t.active]&&Math.abs(D.offset)<.5;J.polygonOffsetUnits=Math.abs(D.offset)*8,ne.position.set(ce.x,ce.y,ce.z),ne.rotation.y=ce.angle;let xe=D===j&&!t.pointer&&!t.reducedMotion.matches,we=Number(a.dataset.hoverAmount)||0,ee=xe?1:0;D.surface.target!==ee&&(D.surface.target=ee,vt.to(D.surface,{scale:ee,duration:(Number(a.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:V})),ne.scale.setScalar(a.dataset.hoverEffect==="zoom"?1+D.surface.scale*we/100:1),a.dataset.hoverEffect==="lift"&&(ne.position.y+=D.surface.scale*we),ne.visible=de>.001&&!!J.uniforms.screenshot.value.image,ne.visible&&K++,D.guide.position.copy(ne.position),D.guide.rotation.copy(ne.rotation),D.guide.visible=a.dataset.showSlots==="true"&&ne.visible,D.guide.material.opacity=de*.42,J.uniforms.fade.value=de,J.uniforms.shade.value=ce.shade,J.uniforms.focused.value=be?1:0});let re=JSON.stringify({cardsPerTurn:I.cardsPerTurn,visibleCount:K,poolCount:b.length,stageWidth:i.clientWidth,stageHeight:i.clientHeight,cardWidth:Y.cardWidth,cardHeight:Y.height,pitch:I.pitch,radius:I.radius,uniqueCount:t.count});a.dataset.responsiveMetrics!==re&&(a.dataset.responsiveMetrics=re),H&&!t.pointer&&(j=$(H)),s.updateMatrixWorld(!0),o.render(s,c),M=!1},$=I=>{if(!E||f)return null;let Y=r.getBoundingClientRect();g.set((I.clientX-Y.left)/Y.width*2-1,-(I.clientY-Y.top)/Y.height*2+1),n.setFromCamera(g,c);for(let U of n.intersectObjects(b.map(K=>K.mesh))){let K=U.object.userData.panel;if(!U.object.visible||K.material.uniforms.fade.value<=.25)continue;let{x:re,y:D}=K.material.uniforms.dimensions.value,X=K.material.uniforms.cornerRadius.value,ne=Math.abs((U.uv.x-.5)*re)-re/2+X,J=Math.abs((U.uv.y-.5)*D)-D/2+X;if(!(Math.hypot(Math.max(ne,0),Math.max(J,0))+Math.min(Math.max(ne,J),0)>X))return K.hitUv=U.uv,K}return null};t.render=function(){w.call(this),V()},t.pointerDown=function(I){if(x.call(this,I),E&&!f&&this.pointer?.id===I.pointerId){let Y=$(I);this.pointer.card=Y?.card||null;let U=Y?.card.buttonBounds,K=Y?.hitUv;U&&K.x>=U.left&&K.x<=U.right&&1-K.y>=U.top&&1-K.y<=U.bottom&&(this.pointer.buttonLink=Y.card.dataset.buttonLink)}H=null,j=null},m(i,"pointermove",I=>{H=I.pointerType==="mouse"?{clientX:I.clientX,clientY:I.clientY}:null,j=I.pointerType==="mouse"&&!t.pointer?$(I):null,r.style.cursor=t.pointer?.dragging?"grabbing":j?"pointer":"grab",V()}),m(i,"pointerleave",()=>{H=null,j=null,V()}),m(i,"pointerup",()=>{j=null,V()}),m(a,"focusin",V),m(a,"focusout",()=>queueMicrotask(V)),m(document,"keydown",()=>queueMicrotask(V)),m(document,"pointerdown",()=>queueMicrotask(V)),m(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&b.forEach(({surface:I})=>{vt.killTweensOf(I),I.scale=I.target}),V()}),m(a,"playground-change",()=>{C(),V()}),m(a,"artwork-change",()=>{C(),V()}),m(a,"slot-guides-change",V),m(r,"webglcontextlost",I=>{I.preventDefault(),f=!0,a.classList.remove("has-webgl-carousel"),a.dataset.renderer="css-fallback"}),m(r,"webglcontextrestored",()=>{f=!1,E&&(a.classList.add("has-webgl-carousel"),a.dataset.renderer="webgl",V())});let P=new ResizeObserver(()=>V());P.observe(i);let G=new di,R=!1,N=()=>{k||(R=!0,E=!1,a.classList.remove("has-webgl-carousel"),a.dataset.renderer="css-fallback")};for(let I of t.cards){let Y=e(I);if(d.has(Y))continue;let U=G.load(Y,V,void 0,N);U.colorSpace=Ft,U.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),d.set(Y,U)}return R||(u=co(q(),Number(a.dataset.slotGap||3)),v=new io,E=!0,a.classList.add("has-webgl-carousel"),a.dataset.renderer="webgl",V()),()=>{k=!0,h.abort(),P.disconnect(),t.render=w,t.pointerDown=x,a.classList.remove("has-webgl-carousel"),delete a.dataset.renderer,b.forEach(({material:I,surface:Y,guide:U})=>{vt.killTweensOf(Y),I.dispose(),U.material.dispose()}),y.forEach(I=>I.dispose()),u?.dispose(),v?.dispose(),d.forEach(I=>I.dispose()),o.dispose(),o.forceContextLoss(),r.remove()}}var vn,tr,or,Li=oe(async()=>{await ao();await gi();await ui();await no();await yi();await Mi();vt.registerPlugin(ro);vn=ro.create("portfolio-surface",".2,.75,.25,1"),tr=`
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
`});var zi=oe(()=>{(()=>{"use strict";let t=Math.PI*2,e=(r,s)=>(r%s+s)%s,a=(r,s,c)=>Math.min(c,Math.max(s,r));class i{constructor(s){this.root=s,this.stage=s.querySelector(".orbit-stage"),this.cards=[...s.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,n)=>{c.dataset.slideIndex=n;let g=c.cloneNode(!0);g.dataset.repeat="true",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),g.removeAttribute("aria-pressed"),c.parentElement.append(g),this.visualCards.push(g)}),!(!this.count||!this.stage)&&(this.title=s.querySelector(".orbit-title"),this.description=s.querySelector(".orbit-description"),this.status=s.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(s,this.cards),this.pagination=s.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((s,c)=>{let n=document.createElement("button");return n.type="button",n.className="orbit-dot",n.setAttribute("aria-label",`Show ${s.dataset.title||`screenshot ${c+1}`}`),n.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(n),n}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(s=>{s.disabled=!0})}bindEvents(){let s=(c,n,g,h={})=>c.addEventListener(n,g,{...this.options,...h});s(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),s(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),s(this.stage,"keydown",c=>{let n={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in n?(c.preventDefault(),this.step(n[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),s(this.stage,"pointerdown",c=>this.pointerDown(c)),s(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),s(this.stage,"pointerup",c=>this.pointerUp(c)),s(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),s(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),s(this.stage,"dragstart",c=>c.preventDefault()),s(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),s(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let n=c.target.closest(".orbit-card");n&&this.openProject(Number(n.dataset.slideIndex))}),s(this.stage,"focusin",c=>{let n=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&n>=0&&n!==this.active&&this.goTo(n)}),s(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),s(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(s=>{let c=s.querySelector(".orbit-surface"),n=c.querySelector("img"),g=Array.from({length:this.segmentCount},(h,m)=>{let w=document.createElement("span");return w.className="orbit-strip",w.setAttribute("aria-hidden","true"),w.dataset.stripIndex=m,w.style.backgroundImage=`url("${n.src}")`,c.append(w),w});return s.classList.add("is-curved"),{card:s,strips:g}})}measure(){let s=this.stage.clientWidth,c=this.stage.clientHeight,n=s<=700;this.cards[0].style.removeProperty("width");let g=this.cards[0].offsetWidth,h=t/8,m=h*.88,w=g/m;this.geometry={radius:w,panelArc:m,cardWidth:g,pitch:a(c/13,36,52),halfWindow:6.5,radiansPerSlide:h,dragUnitX:Math.max(85,s*(n?.32:.18)),dragUnitY:a(c*.13,65,105)},this.stage.style.perspective=`${(w*2.4).toFixed(3)}px`;let x=m/this.segmentCount,d=2*w*Math.sin(x/2),y=g*9/16;this.panels.forEach(({card:C,strips:b})=>{C.style.width=`${g}px`,b.forEach((u,v)=>{let B=-m/2+(v+.5)*x,T=w*Math.sin(B),A=w*(Math.cos(B)-1);u.style.width=`${(d+.6).toFixed(4)}px`,u.style.backgroundSize=`${g}px ${y}px`,u.style.backgroundPosition=`${(-v*g/this.segmentCount).toFixed(4)}px 0px`,u.style.transform=`translateX(-50%) translate3d(${T.toFixed(4)}px, 0px, ${A.toFixed(4)}px) rotateY(${(B*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:s,pitch:c,halfWindow:n,radiansPerSlide:g}=this.geometry;this.visualCards.forEach(m=>{let w=Number(m.dataset.slideIndex),x=e(w-this.position+this.count/2,this.count)-this.count/2;m.dataset.repeat&&(x+=x<0?this.count:-this.count);let d=x*g,y=Math.cos(d),C=Math.sin(d),b=(1-y)/2,u=1-x/n*.11,v=C*s*u,B=x*c,T=y*s*u-s,A=d*180/Math.PI,E=a((n-Math.abs(x))/.65,0,1);m.style.transform=`translate(-50%, -50%) translate3d(${v.toFixed(3)}px, ${B.toFixed(3)}px, ${T.toFixed(3)}px) rotateY(${A.toFixed(3)}deg) scale(${u.toFixed(4)})`,m.style.zIndex="auto",m.style.setProperty("--orbit-shade",String(b*.58)),m.style.setProperty("--orbit-fade",String(E)),m.style.opacity="1",m.style.visibility=E>0?"visible":"hidden",m.style.pointerEvents=E>.25?"auto":"none",m.toggleAttribute("data-gc-back-facing",y<0),m.dataset.offset=x.toFixed(5)});let h=e(Math.round(this.position),this.count);h!==this.active&&this.updateActive(h)}updateActive(s){let c=this.visualCards.includes(document.activeElement);this.active=s,this.cards.forEach((n,g)=>{let h=g===s;n.classList.toggle("is-centered",h),n.tabIndex=h?0:-1,n.setAttribute("aria-pressed",String(h)),this.dots[g].setAttribute("aria-current",String(h))}),this.title&&(this.title.textContent=this.cards[s].dataset.title||""),this.description&&(this.description.textContent=this.cards[s].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[s].dataset.title}, project ${s+1} of ${this.count}`),c&&!this.pointer&&this.cards[s].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(s)}goTo(s){let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(s){this.animateTo(Math.round(this.target)+s)}animateTo(s,c=0){if(this.target=Math.round(s),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(s){this.frame=0;let c=Math.min((s-this.lastTime)/1e3,.032);this.lastTime=s;let n=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=n*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(s){if(this.viewer.dialog.open||!Number.isInteger(s)||!this.cards[s])return;let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(s)}pointerDown(s){if(!s.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}s.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:s.pointerId,x:s.clientX,y:s.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:s.target.closest(".orbit-card")},this.stage.setPointerCapture(s.pointerId))}pointerMove(s){let c=this.pointer;if(!c||c.id!==s.pointerId)return;let n=s.clientX-c.x,g=s.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(n),Math.abs(g))<6)return;if(s.pointerType==="touch"&&Math.abs(n)<=Math.abs(g)){c.card=null;return}c.axis=Math.abs(g)>Math.abs(n)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}s.preventDefault();let h=c.axis==="x"?s.clientX:s.clientY,m=c.axis==="x"?n:g,w=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,x=s.pointerType==="touch"?a(w*.38,32,48):w,d=performance.now(),y=Math.max(8,d-c.lastTime),C=-(h-c.lastCoordinate)/x/y*1e3;c.speed=c.speed*.35+C*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=h,c.travel=m,this.position=c.startPosition-m/x,this.render()}pointerUp(s,c=!1){let n=this.pointer;if(!n||n.id!==s.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(n.id)&&this.stage.releasePointerCapture(n.id),!n.dragging){if(this.animateTo(Math.round(this.position)),!c&&n.buttonLink){location.assign(n.buttonLink);return}!c&&n.card&&this.openProject(Number(n.card.dataset.slideIndex));return}let g=c||performance.now()-n.lastMovement>90?0:a(n.speed,-10,10),h=Math.round(this.position+(this.reducedMotion.matches?0:g*(s.pointerType==="touch"?.32:.2))),m=this.position-n.startPosition;!c&&Math.abs(n.travel)>18&&Math.abs(m)>.12&&h===Math.round(n.startPosition)&&(h+=Math.sign(m)),this.animateTo(h,g)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:s,strips:c})=>{c.forEach(n=>n.remove()),s.classList.remove("is-curved"),s.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(s=>s.dataset.repeat).forEach(s=>s.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function o(r=document){r.querySelectorAll("[data-spiral-carousel]").forEach(s=>{s.spiralCarousel||(s.spiralCarousel=new i(s))})}window.SpiralCarousel={init:o},o()})()});var Ii,ji=oe(()=>{Ii=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var qi,Ti=oe(()=>{qi=`.project-dialog {
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
`});var Fi,Ri=oe(()=>{Fi=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var Di={};ko(Di,{mountSpiral:()=>lr,spiralControls:()=>bt,spiralDefaults:()=>Ye});function po(t,e,a){for(let i of Bi)t.removeAttribute(i);for(let[i,o]of Object.entries(e.imageAttrs||{}))Bi.has(i)&&o!=null&&t.setAttribute(i,String(o));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&a?.(t)}function go(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function lr(t){let{host:e,onChange:a=()=>{},loadImage:i}=t,o=t.items.filter(P=>P.src||P.title||P.description||P.link),r={...Ye,...t.options},s=!1;if(!o.length){let P=document.createElement("p");return P.className="gc-spiral-empty",P.textContent="Add content to this source to preview the spiral.",e.append(P),{destroy(){P.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let n=document.createElement("div");n.className="orbit-carousel spiral-carousel slot-carousel",n.dataset.spiralCarousel="",n.id=`gc-spiral-${++sr}`,n.setAttribute("role","region"),n.setAttribute("aria-label","Spiral gallery"),n.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let g=n.querySelector(".orbit-stage"),h=n.querySelector(".orbit-ring"),m=n.querySelector("[data-orbit-toggle]");Xe(n.querySelector("[data-orbit-prev]"),"previous"),Xe(n.querySelector("[data-orbit-next]"),"next"),Xe(m,"playback");let w=n.querySelector(".gc-spiral-caption"),x=document.createElement("div");x.className="gc-spiral-caption-space",w.before(x),x.append(w);let d=o.some(P=>!!P.title);for(let P of new Set(o.map(G=>G.title).filter(Boolean))){let G=w.cloneNode(!1);G.setAttribute("aria-hidden","true"),G.classList.add("gc-spiral-caption-measure"),G.textContent=P,x.append(G)}let y=document.createElement("div");y.className="gc-item-details",x.after(y);let C=o.map(P=>{let G=document.createElement("div");G.className="gc-item-detail";let R=document.createElement("p");R.className="gc-item-description",R.textContent=Ht(P.description);let N=document.createElement("a"),I=go(P.link);return I&&(N.href=I),N.textContent=P.buttonLabel||"Open link",G.append(R,N),y.append(G),{group:G,body:R,link:N,href:I}}),b="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),u=[];o.forEach((P,G)=>{let R=document.createElement("button");R.className="orbit-card",R.type="button",R.dataset.title=P.title||"",R.dataset.imageSource=P.src||b,R.setAttribute("aria-label",P.title?`View ${P.title}`:`View image ${G+1}`);let N=document.createElement("span");N.className="orbit-surface";let I=document.createElement("img");P.src?po(I,P):I.src=b,u.push(R),R.dataset.buttonLink=go(P.link)||"",N.append(I),R.append(N),h.append(R)}),c.append(n),e.append(c);let v=new Map,B=0,T="";async function A(){let P=JSON.stringify(r);if(T===P)return;T=P;let G=++B,R=o.some(X=>Tt(X,r));if(n.dataset.composite=String(R),!R){for(let[X,ne]of u.entries())if(ne.artwork=null,ne.buttonBounds=null,ne.hasAttribute("data-artwork")){for(let J of h.querySelectorAll('[data-slide-index="'+X+'"] img'))J.src=o[X].src||b;ne.removeAttribute("data-artwork")}return}let N=X=>!X||!r.showImage?null:(v.has(X)||v.set(X,new Promise(ne=>{let J=new Image;J.crossOrigin="anonymous",J.onload=()=>ne(J),J.onerror=()=>ne(null),J.src=X})),v.get(X));if(await new Promise(requestAnimationFrame),s||G!==B)return;let I=await Promise.all(o.map(async X=>({item:{...X,plain:Ht(X.description)},image:await N(X.src)})));if(s||G!==B)return;let Y=r.typeSource==="native"?e.closest(".user-items-list-section"):null,U=getComputedStyle(Y?.querySelector(".list-item-content__title")||w),K=getComputedStyle(Y?.querySelector(".list-item-content__description p")||C[0].body),re=getComputedStyle(e).color,D=Go(I,r,{family:U.fontFamily,bodyFamily:K.fontFamily,ink:re,titleSize:parseFloat(U.fontSize)||16,titleWeight:U.fontWeight,size:parseFloat(K.fontSize)||16,weight:K.fontWeight,accent:getComputedStyle(m).color,buttonInk:getComputedStyle(m).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(m).backgroundColor});D.forEach(({canvas:X,buttonBounds:ne},J)=>{if(u[J].artwork=X,u[J].buttonBounds=ne,u[J].setAttribute("data-artwork",""),n.dataset.renderer!=="webgl"){let ce=X.toDataURL();for(let ue of n.querySelectorAll('.orbit-card[data-slide-index="'+J+'"] img'))ue.src=ce}}),h.querySelectorAll("[data-repeat]").forEach(X=>{let ne=u[Number(X.dataset.slideIndex)];X.buttonBounds=ne?.buttonBounds}),n.dataset.cardAspect=String(D[0].aspect),n.style.setProperty("--gc-art-aspect",D[0].aspect),n.dispatchEvent(new Event("artwork-change"))}let E=_o(c,n.id),k=()=>{let P=r.textPlacement==="card",G=o.some(R=>Tt(R,r));E({...r,shadowEnabled:r.shadowEnabled&&!G,imageTint:r.overlayEnabled&&!G?r.imageTint:"#00000000"}),r.titleCustom?e.dataset.gcTitlePalette=r.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),x.style.textAlign=r.titleAlign,c.style.setProperty("--gc-card-inset",r.carouselPadding+"px"),n.style.padding=r.carouselPadding+"px",n.style.overflow=r.surfaceRadius?"hidden":"",n.style.borderRadius=r.surfaceRadius+"px",n.style.backgroundColor=r.surfaceEnabled?r.surfaceColor:"",n.style.setProperty("--gc-hover-time",r.hoverDuration+"ms"),n.dataset.hoverDuration=r.hoverDuration,n.dataset.mirrorColor=r.mirrorOverlay?r.mirrorColor:"#00000000",n.dataset.playbackMode=r.playbackMode,n.dataset.rate=r.cardsPerMinute,n.dataset.interval=r.duration,n.dataset.direction=r.direction,n.dataset.pauseOnHover=String(r.pauseOnHover),n.dataset.customControlSize=String(!!(r.controlPadding||r.controlIconSize)),n.dataset.hideControlBackground=String(!r.controlBackground),n.style.setProperty("--gc-icon-size",r.controlIconSize?r.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),n.style.setProperty("--gc-button-padding",r.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let R of x.children)R.style.textAlign=r.titleCustom?r.titleAlign:"",R.style.marginBottom=r.titleGap?r.titleGap+"px":"";for(let{body:R,link:N}of C)R.style.textAlign=r.bodyCustom?r.descriptionAlign:"",R.style.fontWeight=r.bodyCustom?r.descriptionWeight:"",R.style.color=r.bodyCustom&&r.descriptionCustom?r.descriptionColor:"inherit",R.style.fontSize=r.bodyCustom&&r.descriptionSize?r.descriptionSize+"rem":"",N.style.marginTop=r.buttonGap+"px";n.dataset.showImage=String(r.showImage!==!1),n.dataset.imageTint=r.overlayEnabled?r.imageTint:"#00000000",n.dataset.hoverEffect=r.reducedMotion?"none":r.hoverEffect,n.dataset.hoverAmount=r.hoverAmount;for(let[R,{body:N,link:I,href:Y}]of C.entries())N.hidden=!r.showDescription||!N.textContent,I.hidden=!r.showButton||!Y||!o[R].buttonLabel;y.hidden=P||C.every(({body:R,link:N})=>R.hidden&&N.hidden),n.dataset.edgeMode=r.edgeMode,n.dataset.backFace=r.backFace,n.dataset.cornerRadius=r.spiralRadius,n.dataset.borderWidth=r.cardBorderEnabled?r.borderWidth:0,n.dataset.borderColor=r.spiralRim,n.dataset.backColor=r.backColor,n.style.setProperty("--orbit-card-radius",r.spiralRadius+"px"),n.style.setProperty("--orbit-rim",r.spiralRim),c.style.width=`${Ke(r.containerWidth,100,20,100)}%`,g.style.height=r.heightMode==="viewport"?Ke(r.viewportHeight,65,15,100)+"vh":r.heightMode==="auto"?"clamp(160px,calc("+r.cardWidth+"px + "+r.spiralRise*4+"px),90svh)":Ke(r.stageHeight,680,120,1600)+"px",n.style.setProperty("--orbit-card-width",`${Ke(r.cardWidth,280,80,720)}px`),n.dataset.spiralWidth=String(Ke(r.spiralWidth,87,20,100)),n.dataset.cardWidth=String(Ke(r.cardWidth,280,80,720)),n.dataset.rise=String(Ke(r.spiralRise,52,r.spiralRiseUnit==="percent"?1:8,r.spiralRiseUnit==="percent"?50:500)),n.dataset.riseUnit=r.spiralRiseUnit==="percent"?"percent":"px",(!u[0].artwork||!o.some(R=>Tt(R,r)))&&(n.dataset.cardAspect=String(cr(r.aspectRatio))),n.dataset.imageFit=r.fit==="contain"||r.fit==="fit"?"fit":"fill",n.dataset.imagePadding=String(Ke(r.imagePadding,0,0,20)),n.dataset.slotGap=String(Ke(r.spiralGap,3,0,16)),n.dataset.showSlots=String(!!r.showSlots),x.hidden=P||!r.showTitles||!d,A(),n.classList.toggle("gc-spiral-reduced",!!r.reducedMotion)};k();let j=o.map(P=>({title:P.title||"",category:"",description:Ht(P.description),services:[],notes:[],gallery:[{file:P.src||b,label:"Image"}]}));class H extends qt{constructor(G,R){super(G,R,j),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(G){let R=o[G];if(!R||r.clickAction==="none"||r.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let N=go(R.link);if(r.clickAction==="link"||r.clickAction==="source"){N&&location.assign(N);return}if(R.postUrl){t.openPost(R,G);return}super.open(G);let I=this.dialog.querySelector(".project-title");I.hidden=!R.title||!r.popupTitle,I.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",I.id),this.dialog.querySelector(".project-summary").hidden=!r.popupDescription||!Ht(R.description),this.dialog.querySelector(".project-gallery").hidden=!r.popupImage||!R.src,this.dialog.querySelector(".project-frame-label").hidden=!r.popupTitle,this.dialog.querySelector(".project-info").hidden=I.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(N&&r.popupButton),this.sourceLink.hidden=!N||!r.popupButton,N?(this.sourceLink.href=N,this.sourceLink.textContent=R.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!r.reducedMotion)}showFrame(G){super.showFrame(G);let R=j.indexOf(this.project),N=o[R];N?.src&&(po(this.image,N,i),this.dialog.querySelectorAll(".project-thumbnail img").forEach(I=>po(I,N,i)),this.dialog.querySelector(".project-frame-label").textContent=N.title||"")}}let f=window.ProjectViewer;window.ProjectViewer=H;try{nr.init(c)}finally{f===void 0?delete window.ProjectViewer:window.ProjectViewer=f}let M=n.spiralCarousel;n.querySelectorAll("img").forEach(P=>i?.(P));let q=()=>{for(let[P,G]of u.entries()){if(!G.artwork)continue;let R=G.artwork.toDataURL();for(let N of h.querySelectorAll('[data-slide-index="'+P+'"] img'))N.src=R}};g.addEventListener("webglcontextlost",q,!0);let W=M.updateActive;M.updateActive=function(P){W.call(this,P),C.forEach(({group:G},R)=>{G.inert=R!==P,G.style.visibility=R===P?"visible":"hidden"}),this.status.textContent=`${o[P]?.title?`${o[P].title}, `:""}image ${P+1} of ${o.length}`,a(P)},M.updateActive(M.active);let _=M.animateTo;M.animateTo=function(P,G=0){r.reducedMotion?(this.target=Math.round(P),this.settleImmediately()):_.call(this,P,G)};let Z=Pi(M,{textureSource:P=>P.dataset.imageSource}),V=Jo(n,M,{pauseOnHover:!1,interactionRestMs:0});function $(P){r.autoplay=!!P,M.manuallyPaused=!P||!!r.reducedMotion,M.resumeAt=0,m.disabled=!!r.reducedMotion||M.reducedMotion.matches||o.length<2,m.dataset.paused=String(M.manuallyPaused),m.setAttribute("aria-label",M.manuallyPaused?"Resume carousel":"Pause carousel"),M.syncAutoplay()}return $(!!r.autoplay),{update(P){let G=r;r={...r,...P},k(),M.measure(),n.dispatchEvent(new Event("playground-change")),n.dispatchEvent(new Event("slot-guides-change")),M.updateActive(M.active),(G.autoplay!==r.autoplay||G.reducedMotion!==r.reducedMotion)&&$(!!r.autoplay)},goTo(P){s||M.goTo(P)},setPlaying:$,getMetrics(){try{return JSON.parse(n.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return n.dataset.renderer||"loading"},destroy(){s||(s=!0,g.removeEventListener("webglcontextlost",q,!0),V(),Z(),M.destroy(),c.remove())}}}var nr,sr,Ke,cr,Ht,Bi,Hi=oe(async()=>{Uo();Xo();Vo();It();Rt();Rt();Ko();await Li();zi();nr=window.SpiralCarousel,sr=0,Ke=(t,e,a,i)=>Number.isFinite(Number(t))?Math.max(a,Math.min(i,Number(t))):e,cr=t=>{if(typeof t=="number"&&t>0)return t;let[e,a]=String(t||"16:9").split(":").map(Number);return e>0&&a>0?e/a:16/9},Ht=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Bi=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Wi(t){let{host:e}=t,a={...t.options},i=null,o=null,r=!1,s="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),Hi().then(()=>Di).then(n=>{r||(c.remove(),o=n.mountSpiral({...t,options:a}),i!==null&&o.goTo?.(i))}).catch(n=>{r||(s="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",n))}),{update(n){a={...a,...n},o?.update?.(a)},goTo(n){i=n,o?.goTo?.(n)},setPlaying(n){a.autoplay=n,o?.setPlaying?.(n)},getStatus(){return o?.getStatus?.()??s},getMetrics(){return o?.getMetrics?.()??null},destroy(){r=!0,c.remove(),o?.destroy()}}}var Ni=oe(()=>{});function dt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let a=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(a.protocol)?a.href:""}catch{return""}}function Nt(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(a=>a.remove()),e.content.querySelectorAll("*").forEach(a=>{for(let i of[...a.attributes])(/^on/i.test(i.name)||i.name==="style"||i.name==="id")&&a.removeAttribute(i.name);if(a.hasAttribute("href")){let i=dt(a.getAttribute("href"));i?a.setAttribute("href",i):a.removeAttribute("href")}}),e.innerHTML}function Oi(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let a of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(a)&&(e[a]=t.getAttribute(a));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function wt(t,e){let a=Wt[e];if(!t||!a)return null;let i=t.closest(a);if(!i){let n=t.querySelectorAll(a);if(n.length!==1)return null;i=n[0]}let o=e==="list"?i:i.querySelector(":scope > .sqs-block-content");if(!o)return null;let r=n=>Array.from(o.querySelectorAll(n)).filter(g=>g.closest(a)===i&&(!g.closest(".gc-embed")||g.hasAttribute("data-gc-native-track")));if(e==="summary"){let n=r(".summary-block-wrapper");if(n.length!==1)return null;let g=r(".summary-item").filter(h=>n[0].contains(h)&&!h.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:i,originals:n,rows:g}}let s=e==="list"?".list-item":".slide",c=r(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=r(".sqs-gallery")),c.length===1){let n=Array.from(c[0].querySelectorAll(s)).filter(g=>g.closest(a)===i&&!g.hasAttribute("data-gc-repeat"));return{source:i,originals:c,rows:n}}if(e==="gallery"&&!c.length){let n=r(s);if(n.length&&n.every(g=>g.parentElement===n[0].parentElement))return{source:i,originals:n,rows:n}}return null}function pt(t,e,a=location.href){return(wt(t,e)?.rows||[]).map(o=>{let r=o.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let g=o.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),h=dt(g?.getAttribute("href"),a);return{...Oi(r),title:o.querySelector(".summary-title")?.textContent.trim()||r?.alt||"",description:Nt(o.querySelector(".summary-excerpt")?.innerHTML),link:h,postUrl:h,buttonLabel:"Read post"}}let s=o.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=Nt(o.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),n=o.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Oi(r),title:s,description:c,link:dt(n?.getAttribute("href"),a),buttonLabel:e==="list"&&n?.textContent.trim()||""}}).filter(o=>e==="summary"?!!o.link:e==="list"||!!(o.src||o.title||o.link))}function dr(t,e){let a=e==="list"?t.getAttribute("data-section-id"):t.id;if(!a?.trim())return"";let i=e==="list"?'section[data-section-id="'+CSS.escape(a)+'"]':"#"+CSS.escape(a);return t.ownerDocument.querySelectorAll(i).length===1?i:""}function $i(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Wt).join(","))).filter(a=>!a.closest(".gc-embed")).flatMap(a=>{let i=a.matches(Wt.list)?"list":a.matches(Wt.summary)?"summary":"gallery",o=dr(a,i);if(!o||!wt(a,i))return[];let r=++e[i];return{name:(i==="list"?"List Section":i==="summary"?"Summary Block":"Gallery Block")+(r>1?" "+r:""),type:i,selector:o,root:a,items:pt(a,i)}})}function Ot(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let a=t.ownerDocument.defaultView?.ImageLoader;if(a&&typeof a.load=="function")try{a.load(t,{load:!0})}catch(i){console.warn("Gallery Studio: native image loader",i)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Gi(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Gi(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function uo(t){let e=document.createElement("img");for(let[a,i]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(a)&&e.setAttribute(a,i);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Gi(t.imageAttrs?.["data-image-focal-point"]),e}var Wt,ho=oe(()=>{Wt={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function Ui(t,e,a){let i=new WeakMap,o=new WeakMap,r=Array.from(e.childNodes),s=a.map(C=>Array.from(C.childNodes)),c=[];function n(C,b){C&&c.push([C,b.map(u=>[u,C.getAttribute(u)])])}let g=new Set,h=!1;function m(){n(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let C of a)n(C,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),h=!0}function w(C,b,u,v,B){let T=a[b],A=g.has(b),E=A?T.cloneNode(!1):T,k=document.createElement("div");if(k.className="gc-card gc-native-card",k.tabIndex=0,k.setAttribute("role","group"),C.imageAttrs?.["data-image-focal-point"]){let[_,Z]=C.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(_)&&Number.isFinite(Z)&&k.style.setProperty("--gc-native-focus",_*100+"% "+Z*100+"%")}let j=C.title||C.alt||`Item ${b+1}`;if(k.setAttribute("aria-label",j),A){E.removeAttribute("id"),E.setAttribute("data-gc-repeat","");for(let _ of s[b])k.append(_.cloneNode(!0));k.querySelectorAll("[id]").forEach(_=>_.removeAttribute("id"))}else g.add(b),k.append(...s[b]);E.replaceChildren(k),i.set(k,E);let H=k.querySelector(".list-item-media"),f=k.querySelector(".list-item-content"),M=k.querySelector(".list-item-content__title"),q=k.querySelector(".list-item-content__description");if(!A){for(let _ of[H,f])n(_,["class"]);for(let _ of[M,q])n(_,["class","hidden"])}if(H?.classList.add("gc-card-media"),f?.classList.add("gc-card-copy"),v.typeSource!=="native"&&(M?.classList.add("gc-card-title"),q?.classList.add("gc-card-description")),M&&(!v.showTitles||u.caption===!1)&&(M.hidden=!0),q&&!u.description&&(q.hidden=!0),u.thumbnail){let _=k.querySelector(".list-item-content__button-wrapper")||k.querySelector(".list-item-content__button");_&&(A||n(_,["hidden"]),_.hidden=!0),f&&(!C.title||u.caption===!1)&&(A||n(f,["hidden"]),f.hidden=!0)}let W=Array.from(k.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!A)for(let _ of W)n(_,["tabindex"]);if(o.set(k,W.map(_=>[_,_.getAttribute("tabindex")])),v.clickAction!=="none"&&(v.clickAction!=="link"||C.link)){let _=document.createElement("button");_.type="button",_.className="gc-native-action",_.tabIndex=-1,_.setAttribute("aria-label",(v.clickAction==="link"?"Open link for ":"Open ")+j),_.addEventListener("click",()=>B(C,b)),k.append(_),k.setAttribute("aria-keyshortcuts","Enter Space"),k.addEventListener("click",Z=>{Z.defaultPrevented||Z.target.closest("a,button,input,select,textarea,label")||B(C,b)}),k.addEventListener("keydown",Z=>{Z.target!==k||!["Enter"," "].includes(Z.key)||(Z.preventDefault(),_.click())})}return k}function x(C){let b=C.tabIndex===0&&C.getAttribute("aria-hidden")!=="true";for(let[u,v]of o.get(C)||[]){let B=b?v:"-1";u.getAttribute("tabindex")!==B&&(B===null?u.removeAttribute("tabindex"):u.setAttribute("tabindex",B))}}function d(C){if(!h)return;let b=C!=="native";e.querySelectorAll(".list-item-content__title").forEach(u=>u.classList.toggle("gc-card-title",b)),e.querySelectorAll(".list-item-content__description").forEach(u=>u.classList.toggle("gc-card-description",b))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!h){a.forEach((C,b)=>C.replaceChildren(...s[b])),e.replaceChildren(...r);for(let[C,b]of c)for(let[u,v]of b)C.getAttribute(u)!==v&&(v===null?C.removeAttribute(u):C.setAttribute(u,v));t.after(e),c.length=0,g.clear(),h=!1}}return{track:e,begin:m,makeCard:w,slot:C=>i.get(C),syncFocus:x,setType:d,restore:y}}var _i=oe(()=>{});function Xi(t,e,a){if(!a.closest(".fluid-engine > .fe-block"))return()=>{};a.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let o=0,r=!1,s=new WeakSet,c=w=>{w&&!s.has(w)&&(s.add(w),g.observe(w))},n=()=>{!o&&!r&&(o=requestAnimationFrame(m))},g=new ResizeObserver(n),h=new MutationObserver(n);function m(){if(o=0,r||!e.isConnected)return;let w=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!w)return;let x=w.classList.contains("gc-carousel-stage"),d=w.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(w);let y=0;for(let b of d.children){if(b===w||b.contains(w))continue;c(b);let u=getComputedStyle(b);u.display==="none"||["absolute","fixed"].includes(u.position)||(y+=b.offsetHeight+(parseFloat(u.marginTop)||0)+(parseFloat(u.marginBottom)||0))}let C=Math.max(1,t.clientHeight-y);if(x){let b=w.parentElement;b.classList.contains("gc-block-stage-window")||(b=document.createElement("div"),b.className="gc-block-stage-window",w.before(b),b.append(w));let u=Math.min(1,C/Math.max(1,w.offsetHeight));b.style.height=C+"px",w.style.setProperty("--gc-block-scale",String(u)),w.style.setProperty("--gc-block-top",Math.max(0,(C-w.offsetHeight*u)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",C+"px")}return c(t),h.observe(e,{childList:!0,subtree:!0}),n(),()=>{r=!0,cancelAnimationFrame(o),g.disconnect(),h.disconnect(),a.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let w=e.querySelector(".gc-block-stage-window");if(w){let x=w.firstElementChild;x.style.removeProperty("--gc-block-scale"),x.style.removeProperty("--gc-block-top"),w.replaceWith(x)}}}var Yi=oe(()=>{});function Vi(t,e,a,i){let o=a.ownerDocument,r=o.defaultView,s=i!=="list"?a.closest(".fluid-engine > .fe-block"):null;s?.classList.add("gc-viewport-cell");let c=[],n=s||a;for(let m=t.parentElement;m&&(["hidden","clip","auto","scroll"].includes(r.getComputedStyle(m).overflowX)&&c.push(m),m!==n);m=m.parentElement);function g(){let m=o.documentElement.clientWidth;if(!m||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let y=d.getBoundingClientRect().left+r.scrollX+d.clientLeft,C=y>.5||y+d.clientWidth<m-.5;d.classList.toggle("gc-viewport-unclip",C)}let w=-(t.getBoundingClientRect().left+r.scrollX),x=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};x("--gc-viewport-width",m+"px"),x("--gc-viewport-offset",w+"px")}g();let h=r.ResizeObserver?new r.ResizeObserver(g):null;return h?.observe(t),h?.observe(o.documentElement),r.addEventListener("resize",g),()=>{h?.disconnect(),r.removeEventListener("resize",g);for(let m of c)m.classList.remove("gc-viewport-unclip");s?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var Ji=oe(()=>{});var Zi,Ki=oe(()=>{Zi=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function Qi(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let i=document.createElement("style");i.id="gc-finish-css",i.textContent=Zi,document.head.append(i)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let a={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[i,o]of Object.entries(a))t.style.setProperty(i,o);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var mo,ea=oe(()=>{Ki();mo={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function ta(t,e){let a=t.classList.contains("gc-embed"),i=a&&e.colorSource==="section";i?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,a&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let o=t.style;o.setProperty("--gc-custom-background",e.background),o.setProperty("--gc-custom-ink",e.ink),o.setProperty("--gc-custom-accent",e.accent),o.setProperty("--gc-background",i?"var(--gc-section-surface)":e.background),o.setProperty("--gc-ink",i?"var(--gc-section-body)":e.ink),o.setProperty("--gc-accent",i?"var(--gc-section-action)":e.accent),o.setProperty("--gc-muted",i?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),o.setProperty("--gc-spatial-surface","var(--gc-background)"),o.setProperty("--gc-spatial-ink","var(--gc-ink)"),i&&(o.setProperty("--gc-line-color","var(--gc-section-line)"),o.setProperty("--gc-tint","var(--gc-section-body)")),o.background=i?"transparent":e.background,o.color=i?"var(--gc-section-body)":e.ink;for(let r of t.querySelectorAll(":scope > dialog"))oa(t,r)}function oa(t,e){for(let a of["gcColorSource","gcTypeSource"])t.dataset[a]?e.dataset[a]=t.dataset[a]:delete e.dataset[a]}function fo(t,e){let a=t.classList.contains("gc-embed")?t:t.ownerDocument.body;oa(t,e),e.parentElement!==a&&a.append(e)}var ia=oe(()=>{});var ra,aa=oe(()=>{ra=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var sa,na=oe(()=>{sa=`:root:has(.gc-post-dialog[open]) { overflow: hidden; }

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

.gc-post-pending {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-block-size: min(28rem, 65dvh);
  padding: 62px var(--post-gutter) 32px;
  text-align: center;
}
.gc-post-dialog[data-desktop-layout="drawer"] .gc-post-pending { min-block-size: min(36rem, 100dvh); }
.gc-post-status { margin: 0; color: var(--post-muted); font-size: 14px; }
.gc-post-spinner {
  inline-size: 28px;
  block-size: 28px;
  border: 2px solid var(--post-line);
  border-block-start-color: var(--post-accent);
  border-radius: 50%;
}
.gc-post-pending:not([data-loading]) .gc-post-spinner { display: none; }

@media (prefers-reduced-motion: no-preference) {
  .gc-post-dialog[data-reduced-motion="false"] .gc-post-spinner { animation: gc-post-spin .8s linear infinite; }
}
@keyframes gc-post-spin { to { transform: rotate(1turn); } }

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
`});var la,ca=oe(()=>{la=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var pa,da=oe(()=>{pa=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var ua,ga=oe(()=>{ua=`.gc-carousel {
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
`});var ma,ha=oe(()=>{ma=`.gc-spatial {
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
`});function tt(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function $t(t,e){let a=tt(e.preset??t.preset),i=a===tt(t.preset)?t.stageHeight:a?0:590;return{...e.preset==="spiral"?Ye:{},...t,...e,stageHeight:e.stageHeight??i}}function fa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function ba(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[ra,la,pa,sa].join(`
`),document.head.append(e));let a=fa(t);if(a==="common")return()=>{};let i=`gc-runtime-${a}-css`,o=document.getElementById(i);o||(o=document.createElement("style"),o.id=i,a==="carousel"?o.textContent=ua:a==="spatial"?o.textContent=ma:o.textContent=[Ii,Ei,qi,Fi].join(`
`),e.after(o)),o.dataset.gcOwners=String(Number(o.dataset.gcOwners||0)+1);let r=!1;return()=>{if(r)return;r=!0;let s=Number(o.dataset.gcOwners)-1;s>0?o.dataset.gcOwners=String(s):o.remove()}}function yr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function ya(t,e,a={},i=null){let o=$t(nt,a),r=null,s=null,c=null,n=null,g=0,h=0,m,w;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function x(){s&&(c?.destroy(),c=null,s.close(),s.remove(),s=null,r?.setSuspended?.(!1),n?.focus({preventScroll:!0}))}function d(k,j){if(o.clickAction==="none")return;if(o.clickAction==="link"){let Z=dt(k.link);Z&&window.open(Z,"_blank","noopener,noreferrer");return}let H=document.activeElement;if(s&&x(),n=H,k.postUrl){c=Fo(k.postUrl,v(),x),s=c.dialog,y(),c.load();return}s=document.createElement("dialog"),s.className="gc-dialog"+(o.preset==="showcase"?" gc-dialog-drawer":""),s.setAttribute("aria-label",k.title||"Image preview");let f=document.createElement("button");f.className="gc-dialog-close",f.type="button",f.textContent="Close \xD7",f.addEventListener("click",x);let M=document.createElement("div");M.className="gc-dialog-content";let q=document.createElement("div");q.className="gc-dialog-media",k.src&&o.popupImage!==!1&&(q.append(uo(k)),M.append(q));let W=document.createElement("div");if(W.className="gc-dialog-copy",k.title&&o.popupTitle!==!1){let Z=document.createElement("h2");Z.textContent=k.title,W.append(Z)}if(k.description&&o.popupDescription!==!1){let Z=document.createElement("div");Z.innerHTML=Nt(k.description),W.append(Z)}if(k.link&&o.popupButton!==!1){let Z=document.createElement("a");Z.href=dt(k.link),Z.textContent=k.buttonLabel||"Open link",Z.target="_blank",Z.rel="noopener noreferrer",W.append(Z)}let _=document.createElement("p");_.className="gc-dialog-count",_.textContent=`${j+1} / ${e.length}`,W.append(_),M.append(W),s.append(f,M),y(),Ot(q.querySelector("img")),f.focus()}function y(){fo(t,s),s.showModal(),r?.setSuspended?.(!0),s.addEventListener("cancel",k=>{k.preventDefault(),x()}),s.addEventListener("click",k=>{if(k.target===s){let j=s.getBoundingClientRect();(k.clientX<j.left||k.clientX>j.right||k.clientY<j.top||k.clientY>j.bottom)&&x()}})}function C(k,j,H={}){if(i)return i.makeCard(k,j,H,o,d);let f=document.createElement("button");f.type="button",f.className="gc-card",f.setAttribute("aria-label",k.title||`Image ${j+1}`);let M=document.createElement("span");M.className="gc-card-media",k.src&&o.popupImage!==!1&&(M.append(uo(k)),f.append(M));let q=document.createElement("span");if(q.className="gc-card-copy",H.caption!==!1&&o.showTitles&&k.title){let W=document.createElement("span");W.className="gc-card-title",W.textContent=k.title,q.append(W)}if(H.description&&k.description){let W=document.createElement("span");W.className="gc-card-description",W.textContent=yr(k.description),q.append(W)}return q.childNodes.length&&f.append(q),f.addEventListener("click",()=>d(k,j)),f}let b=matchMedia("(prefers-reduced-motion: reduce)"),u=matchMedia("(max-width: 660px)");function v(){let k={...Jt(t,o),reducedMotion:o.reducedMotion||b.matches};if(u.matches&&(o.preset!=="spiral"||o.mobileSizing)){if(o.preset==="spiral"){for(let[j,H]of[["spiralWidth","mobileSpiralWidth"],["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])o[H]!=null&&(k[j]=o[H]);o.mobileHeightMode&&o.mobileHeightMode!=="inherit"&&(k.heightMode=o.mobileHeightMode,k.stageHeight=o.mobileStageHeight??k.stageHeight,k.viewportHeight=o.mobileViewportHeight)}o.mobileCardWidth!=null&&(k.cardWidth=o.mobileCardWidth),o.mobileGap!=null&&(k[o.preset==="spiral"?"spiralGap":"gap"]=o.mobileGap)}return k.phoneWidthOverride=u.matches&&o.mobileCardWidth!=null,o.preset==="stack"&&(k.stackCardWidth=u.matches&&o.mobileCardWidth!=null?o.mobileCardWidth:Math.max(360,o.cardWidth*2.2)),k}function B(){t.classList.toggle("gc-hide-controls",o.showControls===!1);let k=Jt(t,o);Qi(t,k),t.style.setProperty("--gc-fit",o.fit),t.style.setProperty("--gc-card-radius",o.radius+"px"),ta(t,k)}function T(k=0){x(),r?.destroy(),r=null,i?.restore(),cancelAnimationFrame(h),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let j=fa(o.preset);j!==m&&(w?.(),w=ba(o.preset),m=j),B(),t.setAttribute("aria-label",o.previewScroll===!1?"Gallery":"Gallery preview");let H=i&&o.preset!=="spiral"?i:null;H?H.begin():i&&i.track.classList.add("gc-native-items-hidden");let f={host:t,items:e,openPost:d,initialIndex:k,nativeList:H,attachDialog:M=>fo(t,M),options:v(),makeCard:C,loadImage:Ot,onChange(M){g=M,o.onChange?.(M)}};if(!e.length){let M=document.createElement("p");M.className="gc-empty",M.textContent="Add images to your source to start exploring.",t.append(M);return}o.preset==="spiral"?r=Wi(f):o.preset==="stack"?r=Oo(f):["wall","ring","angled"].includes(o.preset)?(r=Wo(f),k&&r.goTo(k)):r=Do(f),o.preset!=="spiral"&&(h=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(M=>{Ot(M,{nativeCard:!!H})})))}let A=()=>T(g);function E(){o.preset!=="spiral"&&o.mobileCardWidth==null&&o.mobileGap==null||(r?.setGeometry?r.setGeometry(v()):o.preset==="spiral"?r?.update(v()):T(g))}try{T()}catch(k){throw w?.(),i?.restore(),k}return b.addEventListener("change",A),u.addEventListener("change",E),{update(k){let j=o.preset,H=v();o=$t(o,k);let f=v(),M=Object.keys(f).filter(W=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(W)&&f[W]!==H[W]);if(!M.length)return;if(r?.setGeometry&&M.every(W=>["cardWidth","gap","phoneWidthOverride"].includes(W))){r.setGeometry(f);return}let q=W=>["colorSource","typeSource","background","ink","accent"].includes(W);if(M.every(W=>q(W)||j!=="spiral"&&(W==="radius"||Object.hasOwn(mo,W)))){B(),M.includes("typeSource")&&i?.setType(o.typeSource);return}j==="spiral"&&o.preset==="spiral"&&r?.update?(B(),r.update(f)):T(j===o.preset?g:0)},goTo(k){r?.goTo?.(k)},setPlaying(k){o.autoplay=k,r?.setPlaying?.(k)},getOptions(){return{...o}},getActive(){return g},destroy(){x(),cancelAnimationFrame(h),r?.destroy(),i?.restore(),b.removeEventListener("change",A),u.removeEventListener("change",E),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),w?.()}}}function vr(t,e){let a=e.closest("section")||e,i=[];for(let o=t.parentElement;o;o=o.parentElement){let r=Le.scrollBoundaries.get(o)||0;if((r||["hidden","auto","scroll","overlay"].includes(getComputedStyle(o).overflowY))&&(Le.scrollBoundaries.set(o,r+1),o.classList.add("gc-stack-page-scroll"),i.push(o)),o===a)break}return()=>{for(let o of i){let r=Le.scrollBoundaries.get(o)-1;r?Le.scrollBoundaries.set(o,r):(Le.scrollBoundaries.delete(o),o.classList.remove("gc-stack-page-scroll"))}}}function gt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function bo(t){if(!Le.editListeners?.size){Le.editListeners=new Set;let e=gt();Le.editObserver=new MutationObserver(()=>{let a=gt();if(a!==e){e=a;for(let i of Le.editListeners)try{i(a)}catch(o){console.warn("Gallery Studio: could not resume a list layout.",o)}}});for(let a of[document.body,document.documentElement])Le.editObserver.observe(a,{attributes:!0,attributeFilter:["class"]})}return Le.editListeners.add(t),()=>{Le.editListeners.delete(t),Le.editListeners.size||Le.editObserver.disconnect()}}function yo({selector:t,type:e="gallery",options:a={}}={}){let i=t;if(typeof t=="string")try{let q=document.querySelectorAll(t);if(q.length!==1)return null;i=q[0]}catch{return null}if(!i?.isConnected||typeof i.closest!="function")return null;let o=wt(i,e);if(!o)return null;let{source:r}=o,s=Le.mounts.get(r);if(s)return s.instance.update(a),s;if(!pt(r,e).length)return null;let c=document.createElement("div"),n=document.createElement("div");c.dataset.sourceType=e,c.className="gc-embed",n.className="gc-viewport-slot",n.append(c);let g={...$t(nt,a),previewScroll:!1},h=null,m=null,w=null,x=null,d=null,y=!1,C=[],b=null,u=!1,v=null;function B(){g.galleryWidth==="source"?(w?.(),w=null,b&&(n.classList.add("user-items-list-simple"),n.dataset.layoutWidth=b.mode,n.style.maxWidth=b.maximum)):w||(n.classList.remove("user-items-list-simple"),delete n.dataset.layoutWidth,n.style.removeProperty("max-width"),w=Vi(n,c,r,e))}function T(){return e!=="list"&&g.preset!=="stack"&&g.galleryHeight!=="custom"&&!!r.closest(".fluid-engine > .fe-block")}function A(){T()?x||(x=Xi(n,c,r)):(x?.(),x=null)}function E(q){q==="stack"?m||(m=vr(c,r)):m&&(m(),m=null)}function k(){try{h?.destroy()}finally{h=null,x?.(),x=null,E(null),w?.(),w=null,C.forEach(q=>q.classList.remove("gc-native-items-hidden")),C=[],v?.remove(),v=null,n.remove(),n.replaceChildren(c),c.inert=!1}}function j(){if(y||h||!r.isConnected)return;let q=wt(r,e),W=pt(r,e);if(!q||!W.length)return;q.originals[0].before(n),ba();let _=q.originals[0];b=e==="list"?{mode:_.dataset.layoutWidth||"full",maximum:_.style.maxWidth}:null,B();let Z=null;if(e==="list"){let V=u?_.cloneNode(!0):_;u&&(v=V,V.removeAttribute("id"),V.querySelectorAll("[id]").forEach($=>$.removeAttribute("id")),n.append(V)),Z=Ui(n,V,u?[...V.querySelectorAll(".list-item")]:q.rows)}(!Z||u)&&(C=q.originals,C.forEach(V=>V.classList.add("gc-native-items-hidden"))),A(),E(g.preset),h=ya(c,W,g,Z),c.inert=u}function H(){if(!y){y=!0,r.classList.remove("gc-edit-preview");try{k()}finally{d?.(),Le.mounts.delete(r)}}}let M={instance:{update(q={}){if(y)return;let W=g.galleryWidth;g={...$t(g,q),previewScroll:!1},h&&(g.galleryWidth!==W&&B(),A(),E(g.preset),h.update(g))},setEditPreview(q){if(!(y||!gt()||q===u)){if(u=q,r.classList.toggle("gc-edit-preview",q),!q){k();return}try{j()}catch(W){throw this.setEditPreview(!1),W}}},goTo(q){h?.goTo(q)},setPlaying(q){g.autoplay=q,h?.setPlaying(q)},getOptions(){return{...g}},getActive(){return h?.getActive()??0},destroy:H},host:c,source:r,destroy:H};try{d=bo(q=>{if((u||q)&&k(),u=!1,r.classList.remove("gc-edit-preview"),!q)try{j()}catch(W){throw k(),W}}),gt()||j(),Le.mounts.set(r,M)}catch(q){throw H(),q}return M}var kt,nt,Le,vo=oe(()=>{Xt();Kt();Bo();Ho();No();$o();Ni();Rt();ho();_i();Yi();Ji();ea();ia();aa();na();ca();da();ga();ha();Ri();ji();Ti();Ai();kt=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],nt={...zt,...mo,popupDesktopLayout:"split",colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};Le=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:ya,embed:yo,presets:kt,loadPostData:Pt}});var xa,va=oe(()=>{xa=`:host {
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
`});function ae(t,e,a){let i=document.createElement(t);return e&&(i.className=e),a!==void 0&&(i.textContent=a),i}function ze(t,e,a){let i=ae("button",t,e);return i.type="button",a&&i.setAttribute("aria-label",a),i}function wa(t){let e=ae("span","select-box");return e.append(t),e}function je(t,e,a,i,o,r=""){return{key:t,label:e,type:"range",min:a,max:i,step:o,unit:r}}function Ge(t,e,a){return{key:t,label:e,type:"select",choices:Object.entries(a).map(([i,o])=>({value:i,label:o}))}}function st(t,e,a){return{key:t,label:e,type:"color",when:a,independent:!0}}function xo(t,e){let a=t.preset,i=tt(a),o=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,a==="timed"?960:a==="spiral"?720:560,1,"px"),je("stageHeight",i?"Minimum gallery height":"Gallery height",i?0:300,1200,1,"px")];if(e!=="list"&&(o.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&o.splice(o.findIndex(n=>n.key==="stageHeight"),1)),a==="spiral")o.push(...bt);else if(o.push(je("gap","Spacing",0,100,1,"px")),a!=="infinite"&&a!=="timed"){let n={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[a]||"Depth";o.push(je("depth",n,0,100,1))}let r=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":a==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(a==="arc-tabs"||a==="timed")&&r.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),a!=="stack"&&(r.push({key:"showControls",label:"Show controls",type:"checkbox"}),r.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),a!=="spiral"&&r.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),r.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let s=Yt.has(a),c=[{title:"Size & spacing",fields:o},{title:"Mobile overrides",fields:[{...o.find(n=>n.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...o.find(n=>n.key===(a==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:a==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:r},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:wr},...a==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),st("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(a)?[Ge("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),st("backColor","Back color",["backFace","solid"])]:[],...a==="stack"?[]:[Ge("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...s?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...a==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ge("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ge("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ge("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),st("controlFill","Button background",["controlPalette","custom"]),st("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...s?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(n=>({value:n,label:n+" rem"}))]}],Ge("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ge("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),st("titleColor","Custom title color",["titlePalette","custom"])]},...s?Io({range:je,select:Ge,swatch:st}):[]];if(s){c=jo(t,e,{range:je,select:Ge,swatch:st},c);for(let n of c)if(n.title==="Mobile")for(let g of n.fields.slice(1))g.condition=h=>h.mobileSizing,g.mobileRange=!!g.inherits}if(e==="summary"){let n={...Ge("popupDesktopLayout","Desktop layout",{split:"Split panel",drawer:"Slide-in drawer"}),when:["clickAction","preview"]},g=c.find(h=>h.title==="Popup");g?g.fields.unshift(n):c.push({title:"Popup",fields:[n]})}if(s){for(let n of c)if(n.fields=n.fields.flatMap(g=>{if(g.type!=="color"||!jt.includes(g.key))return[g];let h=g.when||(g.independent?void 0:["colorSource","custom"]);return[{...Ge(g.key+"Swatch",g.label+" palette",{custom:"Custom",...Vt}),type:"palette",when:h,condition:g.condition},{...g,when:h,condition:g.condition,customFor:g.key+"Swatch"},{...je(g.key+"Opacity",g.label+" opacity",0,100,1,"%"),when:h}]}),n.typography)for(let g of n.fields)g.typography=n.typography}return c}function ka(t){return{...nt,stageHeight:tt(t.preset??nt.preset)?0:590,...t.preset==="spiral"?Ye:{},colorSource:"section",typeSource:"native",...t}}function kr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",a=t.name?.trim()||e,i=t.items?.length||0;return`${a.toLowerCase().includes(e.toLowerCase())?a:`${a} \xB7 ${e}`} \xB7 ${i} ${i===1?"item":"items"}`}function Sr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let a=e.ownerDocument,i=a.defaultView,o=0;function r(){o=0;let g=e.getBoundingClientRect();if(!g.width||!g.height||!e.offsetHeight)return;let h=g.height/e.offsetHeight,m=t.getBoundingClientRect(),w=g.width/e.offsetWidth,x=Math.min(g.bottom,i.innerHeight),d=x;for(let y of[.1,.5,.9]){let C=g.left+(m.left+m.width*y)*w,b=a.elementFromPoint(C,x-2);if(!(!b||b===e))for(;b&&!b.contains(e);){let u=b.getBoundingClientRect();u.bottom>=x-2&&u.height>0&&u.height<g.height/2&&(d=Math.min(d,u.top)),b=b.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((g.bottom-d)/h))+"px")}function s(){o||(o=requestAnimationFrame(r))}let c=new ResizeObserver(s);c.observe(e),c.observe(a.documentElement);let n=new MutationObserver(s);return n.observe(a.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),i.addEventListener("resize",s),i.addEventListener("transitionend",s),r(),()=>{c.disconnect(),n.disconnect(),i.removeEventListener("resize",s),i.removeEventListener("transitionend",s),cancelAnimationFrame(o)}}function Sa({source:t,options:e,onPreset:a,onOption:i,onClose:o,onRestore:r,onSave:s,getSaveState:c,getCode:n,getStyle:g,applyStyle:h}){let m=document.activeElement,w=t,x=ka(e),d=!1,y=!1,C=0,b=new Map,u=[],v=new Map;function B(){for(let[l,p]of v)l.hidden=!x[p]}let T=new Map,A=ae("div");A.setAttribute("data-gc-author-panel",""),A.setAttribute("data-lenis-prevent",""),A.addEventListener("wheel",l=>l.stopPropagation(),{passive:!0}),A.addEventListener("touchmove",l=>l.stopPropagation(),{passive:!0});let E=A.attachShadow({mode:"open"}),k=ae("style");k.textContent=xa;let j=ae("aside","panel");j.setAttribute("aria-labelledby","gc-author-heading");let H=ae("header","header"),f=ae("div","heading"),M=ae("h2","","Gallery settings");M.id="gc-author-heading";let q=ae("p","target"),W=ae("p","save-state");W.setAttribute("role","status"),f.append(M,q,W);function _(l=c()){W.textContent!==l&&(W.textContent=l,W.dataset.saved=String(l==="Saved to page"))}let Z=ae("div","header-actions"),V=ze("icon-button","\u2212","Minimize settings");V.setAttribute("aria-controls","gc-author-controls"),V.setAttribute("aria-expanded","true");let $=ze("icon-button","\xD7","Close settings");Z.append(V,$),H.append(f,Z);let P=ae("div","controls");P.id="gc-author-controls";let G=ae("div","scroll");G.tabIndex=0,G.setAttribute("aria-label","Layout settings");let R=ae("label","preset-row"),N=ae("select","preset-select");N.setAttribute("aria-label","Layout");for(let l of kt.filter(p=>t.type==="list"||p.id!=="stack")){let p=ae("option","",l.name);p.value=l.id,N.append(p)}R.append(ae("span","field-label","Layout"),wa(N));let I=ae("div","groups"),Y=ae("div","style-actions"),U=ze("text-button","Copy style"),K=ze("text-button","Paste style");Y.append(U,K);let re=ae("div","style-transfer");re.hidden=!0;let D=ae("textarea");D.setAttribute("aria-label","Gallery style"),D.spellcheck=!1;let X=ze("secondary","Apply style"),ne=ze("text-button","Close","Close style transfer"),J=ae("p","field-error","Paste a gallery style created with Copy style.");J.id="gc-style-error",J.hidden=!0,J.setAttribute("role","alert");function ce(){J.hidden=!0,D.removeAttribute("aria-invalid"),D.removeAttribute("aria-describedby")}D.addEventListener("input",ce),re.append(D,J,X,ne),G.append(R,Y,re,I);let ue=ae("footer","footer"),se=ae("div","export-actions"),de=ze("primary","Save to page"),be=ze("secondary","Copy code"),xe=ze("text-button","Download header backup");xe.hidden=!0;let we=null,ee=ze("secondary","View code");ee.setAttribute("aria-expanded","false"),ee.setAttribute("aria-controls","gc-author-code"),se.append(de,be);let fe=ae("div","code-view");fe.id="gc-author-code",fe.hidden=!0;let ie=ae("label","code-label","Page Header Code Injection"),Ae=ae("textarea");Ae.readOnly=!0,Ae.spellcheck=!1,Ae.setAttribute("aria-label","Page header code"),ie.append(Ae),fe.append(ie);let pe=ae("div","footer-line"),ke=ae("span","status");ke.setAttribute("role","status");let Ce=ze("text-button","Reset preview");pe.append(ke,Ce);let Ee=ae("div","backup-actions"),ye=ze("text-button","Remove layout");ye.hidden=c()==="Not saved yet",Ee.append(ee,xe,ye);let Re=ae("div","removal");Re.hidden=!0,Re.append(ae("p","","Restore the native "+w.name+" and remove its saved layout from this page?"));let Oe=ze("secondary","Keep layout"),De=ze("secondary","Remove saved layout");Re.append(Oe,De),ue.append(se,Ee,fe,Re,pe),P.append(G,ue),j.append(H,P),E.append(k,j),document.body.append(A);let ct=Sr(A);function Fe(l){let{definition:p,input:S,output:L,row:O}=l,F=x[p.key];if(p.when&&(O.hidden=x[p.when[0]]!==p.when[1]),p.condition&&(O.hidden=p.when&&x[p.when[0]]!==p.when[1]||!p.condition(x)),p.type==="palette"){l.refresh?.();for(let z of S.children)z.setAttribute("aria-pressed",String(z.value===F));return}if(p.customFor&&x[p.customFor]!=="custom"){O.hidden=!0;return}if(p.type==="checkbox"){S.checked=!!F;return}if(p.type==="range"){let z=p.key==="spiralRise"&&x.spiralRiseUnit==="percent"?{...p,...p.percent}:p;S.min=String(z.min),S.max=String(z.max),S.step=String(z.step);let Q=p.inherits&&F==null;l.enable&&(l.enable.checked=!Q,S.disabled=!!Q),S.value=String(Q?x[p.inherits]:F);let te=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(z.key)&&z.min===0&&Number(S.value)===0?"Auto":`${S.value}${z.unit||""}`;L.textContent=Q?`Inherit \xB7 ${te}`:te,S.setAttribute("aria-valuetext",te);return}S.value=String(F),p.type==="color"&&(p.independent||(O.hidden=x.colorSource==="section"),L.textContent=S.value.toUpperCase())}function ot(){_(),C+=1,ke.textContent="",fe.hidden||(Ae.value=n())}function He(l,p){let S=x.spiralRiseUnit,L=b.get(l)?.definition.typography;if(L&&!x[L]&&(x[L]=!0,i(L,!0)),x={...x,[l]:p},l==="spiralRiseUnit"&&S!==p){let z=Math.max(1,x.stageHeight),Q=p==="percent"?Math.max(1,Math.min(30,Math.round(x.spiralRise/z*1e3)/10)):Math.max(8,Math.min(280,Math.round(x.spiralRise*z/100)));x.spiralRise=Q,i(l,p),i("spiralRise",Q),Fe(b.get("spiralRise"))}else i(l,p);let O=l.replace(/Swatch$|Opacity$/,""),F=O==="titleColor"?"titlePalette":O==="descriptionColor"?"descriptionCustom":null;if(F){let z=F==="titlePalette"?"custom":!0;x[F]=z,i(F,z)}l==="galleryHeight"&&(Ie(),b.get(l).input.focus({preventScroll:!0})),l==="colorSource"?b.forEach(Fe):Fe(b.get(l));for(let z of b.values())(z.definition.inherits===l||z.definition.when?.[0]===l||z.definition.customFor===l)&&Fe(z);b.forEach(Fe),B(),ot()}function Ne(l){let{key:p,label:S,type:L}=l,O=ae(l.inherits||L==="palette"?"div":"label",`field field-${L}`);l.when&&O.setAttribute("data-subsetting","");let F=ae("span","field-label",S);if(L==="palette"){let te=ae("div","palette-chips"),ge=getComputedStyle(w.root);te.setAttribute("role","group"),te.setAttribute("aria-label",S);for(let ve of l.choices){let he=ze("palette-chip",ve.value==="custom"?"+":"",ve.label);he.value=ve.value,he.title=ve.label;let Se=ge.getPropertyValue("--"+ve.value+"-hsl").trim();Se?he.style.backgroundColor="hsl("+Se+")":ve.value!=="custom"&&(he.textContent=ve.label),he.addEventListener("click",()=>He(p,ve.value)),te.append(he)}O.append(F,te);let me={definition:l,row:O,input:te};return b.set(p,me),Fe(me),O}let z=ae(L==="select"?"select":"input");if(z.setAttribute("aria-label",S),z.dataset.option=p,L==="select")for(let te of l.choices){let ge=ae("option","",te.label);ge.value=te.value,z.append(ge)}else z.type=L;let Q;(L==="range"||L==="color")&&(Q=ae("output","value"),Q.setAttribute("aria-hidden","true")),O.append(F),Q&&O.append(Q),O.append(L==="select"?wa(z):z);let le={definition:l,input:z,output:Q,row:O};if(l.inherits&&!l.mobileRange){let te=ae("input");te.type="checkbox",te.setAttribute("aria-label","Customize "+S.toLowerCase());let ge=ae("label","override-toggle");ge.append(te,F),O.prepend(ge),le.enable=te,te.addEventListener("change",()=>He(p,te.checked?x[l.inherits]:null))}return b.set(p,le),Fe(le),z.addEventListener(L==="range"||L==="color"?"input":"change",()=>{let te=L==="range"||l.numeric?Number(z.value):L==="checkbox"?z.checked:z.value;He(p,te)}),O}function Ie(){let l=new Map([...T].map(([p,S])=>[p,S.open]));u.splice(0).forEach(p=>p()),v.clear(),b.clear(),T.clear(),I.replaceChildren();for(let p of xo(x,w.type)){let S=ae("details","group");S.open=l.get(p.title)??["Elements","Size & spacing"].includes(p.title);let L=ae("summary","",p.title),O=ae("div","group-body"),F={Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[p.title];F&&v.set(S,F);let z;for(let Q of p.fields){let le=Ne(Q);if(Q.type==="palette"){let te=Q.key.slice(0,-6),ge=ae("div","paint-row"),me=ze("paint-trigger","",Q.label.replace(/ palette$/,"")),ve=ae("span","field-label",Q.label.replace(/ palette$/,""));z=ae("div","paint-popup"),z.popover="auto",me.popoverTargetElement=z,ge.append(ve,me,z),O.append(ge),z.append(le);let he=()=>{ge.hidden=le.hidden;let Ct=x[Q.key],Mt=getComputedStyle(w.root).getPropertyValue("--"+Ct+"-hsl");if(me.style.setProperty("--chip",Mt?"hsl("+Mt+")":x[te]),me.style.setProperty("--alpha",x[te+"Opacity"]/100),!Se.matches(":popover-open"))return;let Qe=me.getBoundingClientRect(),At=Se.offsetWidth,_t=Se.offsetHeight;Se.style.left=Math.max(8,Math.min(innerWidth-At-8,Qe.right-At))+"px",Se.style.top=Math.max(8,Math.min(innerHeight-_t-8,Qe.bottom+_t+8<=innerHeight?Qe.bottom+4:Qe.top-_t-4))+"px"},Se=z,ht=new ResizeObserver(he),St=()=>{ht.disconnect(),window.removeEventListener("scroll",he,!0),window.removeEventListener("resize",he)};u.push(St),z.addEventListener("toggle",()=>{Se.matches(":popover-open")?(ht.observe(Se),window.addEventListener("scroll",he,!0),window.addEventListener("resize",he),he()):St()}),b.get(Q.key).refresh=he,he()}else z&&(Q.customFor||Q.key.endsWith("Opacity"))?(z.append(le),Q.customFor||(z=null)):(z=null,O.append(le))}S.append(L,O),I.append(S),T.set(p.title,S)}B()}function Ve(l){if(y)return;let p=x.preset;w=l.source??w,l.options&&(x=ka(l.options)),q.textContent=kr(w),q.title=w.selector||q.textContent,N.value=x.preset,!b.size||p!==x.preset?Ie():(b.forEach(Fe),B()),ot()}function Te(l){fe.hidden=!l,ee.textContent=l?"Hide code":"View code",ee.setAttribute("aria-expanded",String(l)),l&&(Ae.value=n(),Ae.focus({preventScroll:!0}),Ae.select())}function Ze(){if(y)return;y=!0,C+=1;let l=document.activeElement===A;document.removeEventListener("keydown",Me),u.splice(0).forEach(p=>p()),ct(),A.remove(),l&&m?.isConnected&&m.focus({preventScroll:!0})}function Ue(l){if(!y)try{l()}finally{Ze()}}function Me(l){if(!(l.key!=="Escape"||l.defaultPrevented||l.isComposing)&&!E.querySelector(".paint-popup:popover-open")){if(!Re.hidden){l.preventDefault(),$e(!1);return}document.querySelector("dialog[open]")||l.composedPath().some(p=>p?.getAttribute?.("aria-modal")==="true")||(l.preventDefault(),!re.hidden&&(re.contains(E.activeElement)||fe.hidden)?(re.hidden=!0,(D.readOnly?U:K).focus()):fe.hidden?Ue(o):(Te(!1),ee.focus()))}}V.addEventListener("click",()=>{d=!d,P.hidden=d,A.toggleAttribute("data-minimized",d),V.textContent=d?"+":"\u2212",V.setAttribute("aria-expanded",String(!d)),V.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),$.addEventListener("click",()=>Ue(o)),Ce.addEventListener("click",()=>Ue(r)),N.addEventListener("change",()=>a(N.value)),ee.addEventListener("click",()=>Te(fe.hidden));function _e(l,p){ce(),re.hidden=!1,X.hidden=l,D.readOnly=l,D.value=p,D.placeholder=l?"":"Paste the copied gallery style",D.focus(),l&&D.select()}U.addEventListener("click",async()=>{let l=g();try{await navigator.clipboard.writeText(l),y||(re.hidden=!0,ke.textContent="Style copied")}catch{if(y)return;_e(!0,l),ke.textContent="Style selected. Choose Copy."}}),K.addEventListener("click",()=>{ke.textContent="",_e(!1,"")}),ne.addEventListener("click",()=>{re.hidden=!0,(D.readOnly?U:K).focus()}),X.addEventListener("click",()=>{if(!h(D.value)){J.hidden=!1,D.setAttribute("aria-invalid","true"),D.setAttribute("aria-describedby",J.id),D.focus();return}re.hidden=!0,ke.textContent="Style applied to this preview",K.focus()}),xe.addEventListener("click",()=>{if(!we)return;let l=URL.createObjectURL(new Blob([we.header],{type:"text/plain"})),p=document.createElement("a");p.href=l,p.download="gallery-header-backup-"+we.collectionId+".txt",p.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)});async function Be(l=!1){if(l&&$e(!1),!de.disabled){de.disabled=Ce.disabled=ye.disabled=!0,G.inert=!0,de.textContent="Saving\u2026",_(l?"Removing\u2026":"Saving\u2026"),ke.textContent=l?"Removing layout\u2026":"Saving to page header\u2026";try{await s(p=>{we=p,y||(xe.hidden=!1)},l),y||(ke.textContent="Saved to page header")}catch(p){y||(ke.textContent=p.message||"Save failed. Copy code is still available.")}finally{y||(de.disabled=Ce.disabled=ye.disabled=!1,ye.hidden=c()==="Not saved yet",G.inert=!1,de.textContent="Save to page",_())}}}de.addEventListener("click",()=>Be());function $e(l){Re.hidden=!l,G.inert=l,se.hidden=Ee.hidden=pe.hidden=l,l?(Te(!1),Oe.focus()):ye.focus()}return ye.addEventListener("click",()=>$e(!0)),Oe.addEventListener("click",()=>$e(!1)),De.addEventListener("click",()=>Be(!0)),be.addEventListener("click",async()=>{let l=++C,p=n();try{await navigator.clipboard.writeText(p),!y&&l===C&&(ke.textContent="Page code copied")}catch{if(y||l!==C)return;Te(!0),ke.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Me),Ve({source:t,options:e}),N.focus({preventScroll:!0}),{element:A,update:Ve,destroy:Ze}}var wr,Ca=oe(()=>{Lt();Kt();vo();va();wr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var Aa,Ma=oe(()=>{Aa=`.gc-config-position{position:relative!important}
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
`});var za={};ko(za,{startInline:()=>wo});function ut(t,e={}){let a=Ut.get(t),i={...nt,...t==="spiral"?Ye:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:a.width,stageHeight:tt(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[o,r]of Object.entries(e))o.startsWith("mobile")&&i[o]===null?Number.isFinite(r)&&r>=0&&(i[o]=r):o!=="preset"&&Object.hasOwn(i,o)&&typeof r==typeof i[o]&&(i[o]=r);return i.popupDesktopLayout!=="drawer"&&(i.popupDesktopLayout="split"),t==="spiral"&&("mobileSizing"in e||(i.mobileSizing=i.mobileGap!=null||i.mobileCardWidth!=null),"titleCustom"in e||(i.titleCustom=!!(i.titleSize||i.titlePalette==="custom"||i.titleWeight!=="inherit")),"bodyCustom"in e||(i.bodyCustom=!!(i.descriptionCustom||i.descriptionSize)),"overlayEnabled"in e||(i.overlayEnabled=i.imageTintOpacity>0),"cardBorderEnabled"in e||(i.cardBorderEnabled=i.borderWidth>0)),i}function La(t){return xo(t).flatMap(e=>e.typography?[...e.fields,{key:e.typography,type:"checkbox"}]:e.fields).filter(e=>!Pa.has(e.key))}function Mr(t){let e=Object.fromEntries(La(t).map(({key:a})=>[a,t[a]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Ar(t,e){let a;try{a=JSON.parse(t)}catch{return null}if(a?.format!=="gallery-studio-style"||a.version!==1||!Ut.has(a.preset)||!a.values||typeof a.values!="object"||Array.isArray(a.values))return null;let i=ut(a.preset);for(let o of Pa)i[o]=e[o];for(let o of La(i)){let r=a.values[o.key];if(r!==void 0){if(o.type==="range"){if(o.inherits&&r===null)continue;let s=o.percent&&a.values.spiralRiseUnit==="percent"?o.percent:o;if(!Number.isFinite(r)||r<s.min||r>s.max)return null}else{if(o.type==="checkbox"&&typeof r!="boolean")return null;if(["select","palette"].includes(o.type)&&!o.choices.some(s=>s.value===r))return null}if(o.type==="color"&&!/^#[0-9a-f]{6}$/i.test(r))return null;i[o.key]=r}}return i}function Er(t){return ut(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function Gt(t,e){let a=ut(e.preset),i={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};if(e.preset==="spiral")for(let r of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])i[r]=e[r];tt(e.preset)&&(i.stageHeight=e.stageHeight);for(let r of Object.keys(a))e.colorSource==="section"&&Ea.has(r)||e[r]!==a[r]&&(i[r]=e[r]);let o={v:1,selector:t.selector,type:t.type,options:i};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(o,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function wo(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let a=$i(),i=new Map(a.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),o=null,r=null,s=null,c=!1,n=[];function g(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=yo({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function h(d=!0){if(!r)return;let y=r;r=null,o?.destroy(),o=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function m(d){h(),d.presets.clear(),d.installed?g(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function w(d){if(r===d){h();return}h(!1);let{source:y}=d;if(d.mounted||(y.items=pt(y.root,y.type)),!y.items.length){let u="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=u,d.button.setAttribute("aria-label",u);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+y.name+" layout");let C=d.options||d.installed||ut("arc-tabs",y.type!=="list"?{galleryWidth:"source"}:{});if(y.type!=="list"&&C.preset==="stack"&&(C=ut("arc-tabs",{galleryWidth:"source"}),g(d,C)),!d.mounted&&!g(d,C)){d.button.textContent="No supported layout here";return}r=d;let b=u=>{g(d,u),d.presets.set(u.preset,{...u})};o=Sa({source:y,options:{...d.options},onClose:()=>h(),onRestore:()=>m(d),onPreset:u=>{!Ut.has(u)||y.type!=="list"&&u==="stack"||(d.presets.set(d.options.preset,{...d.options}),b({...d.presets.get(u)||ut(u),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),o.update({source:y,options:{...d.options}}))},onOption:(u,v)=>{if(!Object.hasOwn(d.options,u)||u==="preset")return;let B={...d.options,[u]:v};b(B)},getSaveState:()=>d.installed?Gt(y,d.options)===Gt(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Gt(y,d.options),onSave:async(u,v=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let B={...d.options},T=Mo();c=!0;try{await Ao({snippet:Gt(y,B),context:T,onBackup:u,remove:v}),v?(d.installed=null,r===d?m(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=B}finally{c=!1}},getStyle:()=>Mr(d.options),applyStyle:u=>{let v=Ar(u,d.options);return!v||y.type!=="list"&&v.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),b(v),o.update({source:y,options:d.options}),!0)}}),o.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),C=document.querySelectorAll(y.selector),b=C.length===1&&i.get(C[0]);if(!b||y.v!==1||y.type!==b.source.type||!Ut.has(y.options?.preset))continue;b.installed=Er(y.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of i.values())d.installed&&g(d,d.installed);if(t&&i.size){let y=function(u=!1){d.setAttribute("aria-pressed",String(u)),d.querySelector("span").textContent=u?"Edit native content":"Preview galleries",d.hidden=!gt()||![...i.values()].some(v=>v.mounted)},C=function(u){if(!u.mounted||u.source.root.isConnected)return;let v=u.source.root,B=document.querySelectorAll(u.source.selector);if(B.length!==1)return;let T=B[0];u.mounted.destroy(),u.mounted=null,u.source.root=T,i.delete(v),i.set(T,u),g(u,u.options);let A=T.querySelector(u.source.type==="list"?".user-items-list":".sqs-block-content")||T;u.button&&(getComputedStyle(A).position==="static"&&A.classList.add("gc-config-position"),A.append(u.button))};s=document.createElement("style"),s.textContent=Aa,document.head.append(s);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let u=d.getAttribute("aria-pressed")!=="true";for(let v of[...i.values()])C(v),v.mounted?.instance.setEditPreview(u);y(u)},document.body.append(d),y();let b=bo(u=>{u||requestAnimationFrame(()=>{if(d.isConnected)for(let v of[...i.values()])C(v)}),y()});n.push(()=>{b(),d.remove()});for(let u of i.values()){let{source:v}=u;if(!v.selector)continue;let B=v.root.querySelector(v.type==="list"?".user-items-list":".sqs-block-content")||v.root,T=getComputedStyle(B).position==="static";T&&B.classList.add("gc-config-position");let A=document.createElement("button");A.type="button",A.className="gc-config-launch",A.setAttribute("aria-expanded","false"),A.setAttribute("aria-label","Configure "+v.name+" layout"),A.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',A.addEventListener("click",()=>w(u)),B.append(A),u.button=A,n.push(()=>{A.remove(),T&&B.classList.remove("gc-config-position")})}}let x={version:1,destroy(){h(!1);for(let d of i.values())d.mounted?.destroy();for(let d of n)d();s?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=x,x}var Ut,Ea,Pa,ja=oe(()=>{Eo();vo();ho();Ca();Ma();Ut=new Map(kt.map(t=>[t.id,t])),Ea=new Set(["background","ink","accent","borderColor","overlayColor"]);Pa=new Set([...Ea,"colorSource","typeSource","clickAction","popupDesktopLayout"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",wo,{once:!0}):wo()});var Pr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(Pr=(await Promise.resolve().then(()=>(ja(),za))).startInline);export{Pr as startInline};

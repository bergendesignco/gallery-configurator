var Wo=Object.defineProperty;var ee=(t,e)=>()=>(t&&(e=t(t=0)),e);var Ei=(t,e)=>{for(var a in e)Wo(t,a,{get:e[a],enumerable:!0})};function Li(t,e){if(t===void 0)return null;let a=new Map([...t.matchAll(Oo)].map(i=>[i[1].toLowerCase(),i[2]??i[3]??i[4]??""]));if(!a.has("data-gallery-layout"))return null;if(a.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let o;try{o=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(o?.v!==1||typeof o.selector!="string"||!["list","gallery","summary"].includes(o.type)||!o.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return o}function No(t,e,a=!1){let o=[...e.matchAll(zi)];if(o.length!==1||o[0][0]!==e.trim())throw Error("Invalid gallery settings.");let i=Li(o[0][1],o[0][2]);if(!i)throw Error("Missing gallery settings.");let r=!1,s=t.replace(zi,(c,n,u)=>{let f=Li(n,u);return!f||f.selector!==i.selector?c:a||r?"":(r=!0,e)});return a||r?s:s+(s&&!s.endsWith(`
`)?`
`:"")+e+`
`}function ji(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,a=e?.collection?.id,o=e?.website?.id,i=t.document.cookie.split(";").map(r=>r.trim()).find(r=>r.startsWith("crumb="))?.slice(6);if(!Et.test(a||"")||!Et.test(o||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!i)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:a,websiteId:o,crumb:decodeURIComponent(i)}}async function Ii({snippet:t,context:e,remove:a=!1,fetchImpl:o=fetch,onBackup:i=()=>{}}){let{collectionId:r,websiteId:s,crumb:c}=e;if(!Et.test(r||"")||!Et.test(s||"")||!c)throw Error("A signed-in Squarespace page is required.");async function n(){let y=await o("/api/commondata/GetCollectionSettings?collectionId="+r,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let S=await y.json(),v=S.collectionData??S;if(v?.id!==r||v.websiteId!==s||v.deleted===!0||v.folder===!0||v.dropdown===!0)throw Error("Page settings do not match this page.");if(v.headerInjectCode!=null&&typeof v.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:v,memberAreaData:S.memberAreaData??{}}}let u=await n();if(u.model.passwordProtected&&typeof u.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let f=u.model.headerInjectCode??"",m=No(f,t,a);if(m===f)return{unchanged:!0};i({collectionId:r,header:f,savedAt:new Date().toISOString()});let w=await n();if(JSON.stringify(w)!==JSON.stringify(u))throw Error("Page settings changed while saving. Review the page and save again.");let x;try{x=await o("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...w.model,collectionId:r,headerInjectCode:m},memberAreaData:w.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!x.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await n()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==m.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var Et,zi,Oo,Ti=ee(()=>{Et=/^[a-f0-9]{24}$/i,zi=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Oo=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function zt(t,e){let a="http://www.w3.org/2000/svg";function o(y,S,v){let h=document.createElementNS(a,y);for(let[b,D]of Object.entries(S))h.setAttribute(b,D);return v?.append(h),h}let i=o("svg",{width:0,height:0,"aria-hidden":"true"});i.style.position="absolute",t.append(i);let r=o("defs",{},i),s=o("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},r),c=o("feMorphology",{in:"SourceAlpha",operator:"dilate"},s),n=o("feGaussianBlur",{},s),u=o("feOffset",{result:"mask"},s),f=o("feFlood",{},s);o("feComposite",{in2:"mask",operator:"in"},s);let m=o("feMerge",{},s);o("feMergeNode",{},m),o("feMergeNode",{in:"SourceGraphic"},m);let w=o("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},r),x=o("feFlood",{},w);o("feComposite",{in2:"SourceGraphic",operator:"atop"},w);let d=s.cloneNode(!0);return d.id=e+"-card-shadow",r.append(d),y=>{let S=(y.cardShadowAngle??90)*Math.PI/180;d.querySelector("feMorphology").setAttribute("radius",y.cardShadowSpread||0),d.querySelector("feGaussianBlur").setAttribute("stdDeviation",(y.cardShadowBlur||0)/2);let v=d.querySelector("feOffset");v.setAttribute("dx",Math.cos(S)*(y.cardShadowDistance||0)),v.setAttribute("dy",Math.sin(S)*(y.cardShadowDistance||0)),d.querySelector("feFlood").setAttribute("flood-color",y.cardShadowColor||"#000");let h=[];y.shadowEnabled&&h.push("url(#"+s.id+")"),y.cardShadow&&h.push("url(#"+d.id+")");let b=y.shadowAngle*Math.PI/180;c.setAttribute("radius",y.shadowSpread),n.setAttribute("stdDeviation",y.shadowBlur/2),u.setAttribute("dx",Math.cos(b)*y.shadowDistance),u.setAttribute("dy",Math.sin(b)*y.shadowDistance),f.setAttribute("flood-color",y.shadowColor),x.setAttribute("flood-color",y.imageTint),t.style.setProperty("--gc-shadow-filter",h.join(" ")||"none"),t.style.setProperty("--gc-image-filter",y.imageTint.endsWith("00")&&y.imageTint.length===9?"none":"url(#"+w.id+")")}}var Qt=ee(()=>{});function qi(t,e){let a=(s,c)=>t.toggleAttribute("data-finish-"+s,!!c),o=(s,c)=>t.style.setProperty("--finish-"+s,c);function i(s,c){let n=e[s+"Angle"]*Math.PI/180,u=e[s+"Distance"];return[Math.cos(n)*u,Math.sin(n)*u,e[s+"Blur"],e[s+"Spread"]].map(f=>f+"px").join(" ")+" "+c}for(let s of["surfaceEnabled","cardBackground","cardShadow","imageBorder","shadowEnabled","bodyCustom","overlayEnabled"])a(s.toLowerCase(),e[s]);a("padding",e.carouselPadding),a("card-padding",e.cardPadding),a("image-size",e.imageWidth!==100||e.imageAlign!=="center"),a("original",e.aspectRatio==="original"),a("crop",e.aspectRatio&&e.aspectRatio!=="layout"),a("circle",e.aspectRatio==="circle"),a("order",e.cardOrder&&e.cardOrder!=="layout"),a("align",e.cardAlign&&e.cardAlign!=="layout"),a("equal",e.cardSizing==="equal"),a("icon",e.controlIconSize),a("button-padding",e.controlPadding),a("clear-button",e.controlBackground===!1),a("title-align",e.titleAlign!=="inherit"),a("media-gap",e.mediaGap),a("title-gap",e.titleGap),a("button-gap",e.buttonGap),a("mirror",e.mirrorOverlay&&e.backFace==="mirror"),o("mirror",e.mirrorColor),a("caption",e.showDescription||e.showButton),a("image-padding",e.imagePadding);let r={surface:e.surfaceColor,"surface-radius":e.surfaceRadius+"px","carousel-padding":e.carouselPadding+"px",card:e.cardColor,"card-padding":e.cardPadding+"px","card-shadow":i("cardShadow",e.cardShadowColor),"image-border":e.imageBorderSize+"px solid "+e.imageBorderColor,"image-radius":e.imageRadius+"px","image-width":e.imageWidth+"%","image-padding":e.imagePadding+"%",left:e.imageAlign==="left"?"0":"auto",right:e.imageAlign==="right"?"0":"auto",ratio:e.aspectRatio==="circle"?"1":e.aspectRatio==="original"?"auto":e.aspectRatio?.replace(":"," / "),order:e.cardOrder==="content"?-1:1,align:{top:"start",middle:"center",bottom:"end"}[e.cardAlign]||"normal","title-align":e.titleAlign,"description-align":e.descriptionAlign,"description-weight":e.descriptionWeight,"media-gap":e.mediaGap+"px","title-gap":e.titleGap+"px","button-gap":e.buttonGap+"px",icon:e.controlIconSize+"px","button-padding":e.controlPadding+"px",duration:e.hoverDuration+"ms"};for(let[s,c]of Object.entries(r))o(s,c);e.cardBorderEnabled&&t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-line-size",(e.cardBorderEnabled?e.borderWidth:0)+"px"),t.style.setProperty("--gc-tint",e.imageTint),t.style.setProperty("--gc-tint-opacity","0")}var Ri=ee(()=>{});function Bi(t){let e=document.createElement("template");return e.innerHTML=t,e.content}function ft(t,e){return t&&URL.canParse(t,e)?new URL(t,e).href:null}function $o(t,e){let a=t.querySelector(".sqs-gallery-container"),o=Array.from(t.querySelectorAll(".slide"),i=>{let r=i.querySelector("img[data-src], img[data-image], img[src]"),s=i.querySelector(".image-slide-anchor, a[href]");return{type:i.dataset.type||null,imageUrl:ft(r?.dataset.src||r?.dataset.image||r?.getAttribute("src"),e),imageId:r?.dataset.imageId??null,dimensions:r?.dataset.imageDimensions??null,focalPoint:r?.dataset.imageFocalPoint??null,alt:r?.getAttribute("alt")??null,title:s?.dataset.title??i.querySelector(".meta-title")?.textContent??null,descriptionHtml:s?.dataset.description??i.querySelector(".meta-description")?.innerHTML??null,href:ft(s?.getAttribute("href"),e),lightbox:!!s?.classList.contains("js-gallery-lightbox-opener"),html:i.outerHTML}});return{layout:a?.dataset.design??null,settings:{...a?.dataset},slides:o}}function Go(t,e){return Array.from(Bi(t).querySelectorAll(".sqs-block"),a=>{let o=a.dataset.sqspBlock||[...a.classList].find(r=>r.startsWith("sqs-block-")&&r!=="sqs-block-website-component")?.slice(10),i={id:a.id||null,type:o||null,typeId:a.dataset.blockType??null,html:a.outerHTML};return(o==="gallery"||a.matches(".gallery-block, .sqs-block-gallery"))&&(i.gallery=$o(a,e)),i})}async function Uo(t,e){let a=await fetch(t,{mode:"same-origin",signal:e});if(!a.ok)return null;let o=await a.text(),i=Bi(o.split(/<\/head\s*>/i,1)[0]),r=Array.from(i.querySelectorAll("meta[content]"),s=>({name:s.getAttribute("property")||s.getAttribute("name")||s.getAttribute("itemprop"),content:s.getAttribute("content")})).filter(s=>s.name);return{title:i.querySelector("title")?.textContent??null,description:r.find(s=>s.name.toLowerCase()==="description")?.content??null,canonicalUrl:ft(i.querySelector('link[rel~="canonical"]')?.getAttribute("href"),a.url),meta:r}}async function Lt(t,{signal:e,includeSeo:a=!0}={}){if(!t)throw new Error("A linked post URL is required.");let o=new URL(t,location.href);if(o.origin!==location.origin)throw new Error("The linked post must be on this site.");o.hash="",o.searchParams.delete("format");let i=new URL(o);i.searchParams.set("format","json");let r=await fetch(i,{mode:"same-origin",signal:e});if(!r.ok)throw new Error("Could not load post JSON ("+r.status+").");let{item:s}=await r.json();if(!s?.id||typeof s.body!="string")throw new Error("This URL did not return a post body.");let c=ft(s.fullUrl,r.url)||o.href,n=null;try{a&&(n=await Uo(o,e))}catch(u){if(e?.aborted)throw u}return{id:s.id,url:c,title:s.title??null,excerptHtml:s.excerpt??null,publishedAt:s.publishOn??null,createdAt:s.addedOn??null,updatedAt:s.updatedOn??null,author:s.author??null,authorId:s.authorId??null,location:s.location??null,tags:s.tags??[],categories:s.categories??[],featuredImageUrl:ft(s.assetUrl,c),seo:{item:s.seoData??null,page:n},bodyHtml:s.body,blocks:Go(s.body,c),rawItem:s}}var ei=ee(()=>{});function Di(t,e,{range:a,select:o,swatch:i},r){let s=(p,A)=>({key:p,label:A,type:"checkbox"}),c=(p,A,N,F,X="px",W=1)=>a(p,A,N,F,W,X),n=(p,A,N)=>N.map(F=>({...F,when:[p,A]})),u=(p,...A)=>({title:p,fields:A.flat()}),f=p=>r.flatMap(A=>A.fields).find(A=>A.key===p),m=t.preset==="spiral",w=t.preset==="stack",x=["wall","ring","angled"].includes(t.preset),d=x||t.preset==="timed",y=m?"spiralGap":"gap",S=e!=="gallery",v={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(p,A)=>[100*(A+1),String(100*(A+1))]))},h={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function b(p,A,N,F,X,W){return{...u(p,c(N,"Size",0,4,"rem",.05),o(F,"Weight",v),i(X,"Color"),o(W,"Alignment",h)),typography:A}}function D(p,A,N,F){return[s(p,A),...n(p,!0,[c(N+"Angle","Angle",0,360,"\xB0"),c(N+"Distance","Distance",0,48),c(N+"Blur","Blur",0,40),c(N+"Spread","Spread",0,16),i(F,"Color")])]}let z=(p,A)=>({...f(A),key:p,label:"Mobile "+f(A).label.toLowerCase(),inherits:A}),M=[u("Elements",s("showImage","Show image"),s("showTitles","Show title"),...S?[s("showDescription","Show description"),s("showButton","Show button")]:[],s("showControls","Show controls")),u("Main carousel",...S?[o("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...n("heightMode","pixels",[c("stageHeight","Height",120,1600)]),...n("heightMode","viewport",[c("viewportHeight","Window height",15,100,"%")])]:[],c("carouselPadding","Carousel padding",0,64),f("spiralWidth"),s("surfaceEnabled","Background"),...n("surfaceEnabled",!0,[i("surfaceColor","Color"),c("surfaceRadius","Corner radius",0,64)]),o("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),f("edgeFade"),f("spiralGap"),s("autoplay","Autoplay"),...n("autoplay",!0,[o("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),o("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...c("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:p=>p.playbackMode==="continuous"},{...c("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:p=>p.playbackMode==="step"}),u("Spiral",f("spiralRiseUnit"),{...f("spiralRise"),label:"Rise"},o("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),f("showSlots")),u("Image",o("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(p=>[p,p==="original"?"Original":p==="circle"?"Circle":p]))),o("fit","Image sizing",{cover:"Fill",contain:"Fit"}),c("imageWidth","Image width",20,100,"%"),o("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),c("imagePadding","Image padding",0,20,"%"),s("imageBorder","Image border"),...n("imageBorder",!0,[i("imageBorderColor","Color"),c("imageBorderSize","Thickness",0,12),c("imageRadius","Corner radius",0,64)]),D("shadowEnabled","Image shadow","shadow","shadowColor"),s("overlayEnabled","Overlay"),...n("overlayEnabled",!0,[i("imageTint","Color")])),b("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...S?[b("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],u("Card",f("cardWidth"),o("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),o("cardOrder","Element order",{media:"Media first",content:"Content first"}),c("cardPadding","Card padding",0,80),c("mediaGap","Space between image and text",0,80),c("titleGap","Space below title",0,80),...S?[c("buttonGap","Space above button",0,80)]:[],o("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),s("cardBackground","Background"),...n("cardBackground",!0,[i("cardColor","Color")]),s("cardBorderEnabled","Card border"),...n("cardBorderEnabled",!0,[i(m?"spiralRim":"borderColor","Color"),f("borderWidth")]),f(m?"spiralRadius":"radius"),D("cardShadow","Card shadow","cardShadow","cardShadowColor"),f("backFace"),f("backColor"),...n("backFace","mirror",[s("mirrorOverlay","Mirrored image overlay")]),{...i("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:p=>p.backFace==="mirror"}),u("Interaction",s("pauseOnHover","Pause on hover"),f("hoverEffect"),f("hoverAmount"),c("hoverDuration","Hover duration",0,1e3,"ms",10),o("clickAction","Card click",{source:e==="summary"?"Post button only":S?"Button only":"Image link only",link:e==="summary"?"Follow post link":S?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),f("reducedMotion")),u("Control styling",f("controlSize"),c("controlIconSize","Icon size",0,60),c("controlPadding","Button padding",0,32),f("controlShape"),f("arrowStyle"),s("controlBackground","Button background"),f("controlPalette"),f("controlInk"),f("controlFill")),u("Mobile",s("mobileSizing","Customize mobile sizing"),z("mobileCardWidth","cardWidth"),z("mobileGap",y),{...c("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...c("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},...m?[z("mobileSpiralWidth","spiralWidth")]:[],...S?[o("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...c("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),u("Theme",o("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...n("colorSource","custom",[i("background","Background"),i("ink","Text"),i("accent","Accent")]),o("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),r.find(p=>p.title==="Popup")];if(m)return M;e==="summary"&&(M.find(p=>p.title==="Popup").fields=[]);let C=M.find(p=>p.title==="Main carousel"),q=f("stageHeight");C.fields=[f("galleryWidth"),f("galleryHeight"),...q?[o("heightMode",q.label,{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...q,when:["heightMode","pixels"]},{...c("viewportHeight","Window height",15,100,"%"),when:["heightMode","viewport"]}]:[],...C.fields.filter(p=>["carouselPadding","surfaceEnabled","surfaceColor","surfaceRadius"].includes(p?.key)),f("gap"),f("edgeMode"),f("edgeFade"),f("autoplay"),f("duration")];for(let p of["aspectRatio","cardOrder","cardAlign"])M.flatMap(N=>N?.fields||[]).find(N=>N?.key===p).choices.unshift({value:"layout",label:"Layout default"});let U=M.find(p=>p.title==="Spiral");U.title="Layout",U.fields=[f("depth"),f("navigation")];let _=new Set;if(t.preset!=="ring")for(let p of["backFace","backColor","mirrorOverlay","mirrorColor"])_.add(p);if(w)for(let p of["showControls","pauseOnHover"])_.add(p);if(d)for(let p of["cardOrder","cardSizing","mediaGap"])_.add(p);x&&_.add("cardAlign");let I=M.find(p=>p.title==="Mobile");I.fields=I.fields.filter(p=>!["mobileHeightMode","mobileViewportHeight","mobileStageHeight"].includes(p.key)),q&&I.fields.push(o("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...q,key:"mobileStageHeight",label:"Mobile height",inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]});for(let p of M)p.fields=p.fields.filter(A=>A?.key&&!_.has(A.key));return M.filter(p=>p.fields.length&&!(w&&p.title==="Control styling"))}var jt,Fi,It=ee(()=>{jt={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},Fi=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function Hi({range:t,swatch:e,select:a}){let o=(i,r)=>({key:i,label:r,type:"checkbox"});return[{title:"Card content",fields:[o("showImage","Show image"),o("showTitles","Show title"),o("showDescription","Show description"),o("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),o("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),o("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(i=>({...i,when:["shadowEnabled",!0]})),a("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[o("popupImage","Show popup image"),o("popupTitle","Show popup title"),o("popupDescription","Show popup description"),o("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),o("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Wi(t,e){if(!ti.has(e.preset))return e;let a={...e},o=getComputedStyle(t),i;for(let r of qt){let s=e[r+"Swatch"],c=e[r];if(Object.hasOwn(ii,s)){let u=o.getPropertyValue("--"+s+"-hsl").trim();u&&(i??=document.createElement("canvas").getContext("2d"),i&&(i.fillStyle=c,i.fillStyle="hsl("+u+")",c=i.fillStyle))}let n=Math.round((e[r+"Opacity"]??100)*2.55);a[r]=n===255?c:c+n.toString(16).padStart(2,"0")}return a}function mt(t,e={}){if(t==="spiral")return{};let a=["wall","ring","angled"].includes(t);return{...jt,aspectRatio:"layout",imagePadding:0,cardAlign:"layout",cardOrder:"layout",showDescription:["stack","arc-tabs","timed"].includes(t),showButton:!a,pauseOnHover:!0,mobileSizing:e.mobileCardWidth!=null||e.mobileGap!=null,cardBorderEnabled:e.borderWidth>0,overlayEnabled:e.overlayOpacity>0,imageTint:e.overlayColor||"#142036",imageTintOpacity:e.overlayOpacity||0}}var ti,ii,qt,Tt,Rt=ee(()=>{It();ti=new Set(["spiral","stack","infinite","arc","arc-tabs","timed","showcase","wall","ring","angled"]),ii={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},qt=[...Fi,"borderColor","titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],Tt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of qt)Tt[t+"Swatch"]="custom",Tt[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function ai(t){let e=document.createElement("template");return e.innerHTML=t??"",e.content}function bt(t,e){if(e||=location.href,!t||!URL.canParse(t,e))return null;let a=new URL(t,e);return["http:","https:"].includes(a.protocol)?a.href:null}function $i(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let a=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches(Vo))return a;let o=t.localName==="h1"?"h2":t.localName,i;if(o==="img"){if(i=bt(t.dataset.src||t.dataset.image||t.getAttribute("src"),e),!i)return a}else o==="a"&&(i=bt(t.getAttribute("href"),e));let r=_o.has(o)&&(o!=="a"||i)?document.createElement(o):a;o==="a"&&i?(r.href=i,r.rel="noopener noreferrer"):o==="img"&&(r.src=i,r.alt=t.alt,r.loading="lazy");for(let s of t.childNodes)r.append($i(s,e));return r}function Oi(t,e){let a=document.createDocumentFragment();for(let o of t.childNodes)a.append($i(o,e));return a}function oi(t){return t.textContent.replace(/\s+/g," ").trim()}function Zo(t,e){let a=oi(e);if(!a&&!e.querySelector("img")||a&&oi(t)===a)return;let o=document.createElement("div");o.append(e),t.append(o)}function Ni(t,e){let a=Array.isArray(e)?[...new Set(e.filter(o=>typeof o=="string").map(o=>o.trim()).filter(Boolean))]:[];t.replaceChildren(...a.map(o=>{let i=document.createElement("li");return i.textContent=o,i})),t.hidden=!a.length}function Qo(t,e){return(t.blocks??[]).flatMap(a=>a.gallery?.slides??[]).flatMap(a=>{let o=bt(a.imageUrl,e);return o?[{src:o,alt:a.alt?.trim()||a.title?.trim()||"",caption:a.title?.trim()||"",description:a.descriptionHtml||""}]:[]})}function Gi(t,e,a){let o=document.createElement("dialog");o.className="gc-post-dialog",o.setAttribute("aria-label","Project details"),o.dataset.desktopLayout=e.popupDesktopLayout==="drawer"?"drawer":"split",o.dataset.reducedMotion=String(!!e.reducedMotion),e.popupPadding>0&&o.style.setProperty("--post-padding",e.popupPadding+"px"),e.popupRadius!=null&&o.style.setProperty("--post-radius",e.popupRadius+"px"),e.popupCustom&&e.popupColor&&e.popupInk&&(o.style.setProperty("--post-surface",e.popupColor),o.style.setProperty("--post-ink",e.popupInk),o.style.setProperty("--post-body",e.popupInk)),o.innerHTML=`
    <div class="gc-post-toolbar"><button type="button" class="gc-post-icon gc-post-close" aria-label="Close project" autofocus>${Ko}</button></div>
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
            <button type="button" class="gc-post-icon" data-post-prev aria-label="Previous image">${Yo}</button>
            <button type="button" class="gc-post-icon" data-post-next aria-label="Next image">${Jo}</button>
          </div>
        </div>
        <div class="gc-post-thumbs" role="group" aria-label="Select a project image" hidden></div>
      </section>
    </div>`;let i=j=>o.querySelector(j),r=i(".gc-post-close"),s=i(".gc-post-title"),c=i(".gc-post-reading"),n=i(".gc-post-categories"),u=i(".gc-post-tags"),f=i(".gc-post-pending"),m=i(".gc-post-status"),w=i(".gc-post-error-link"),x=i(".gc-post-link"),d=i(".gc-post-gallery"),y=i(".gc-post-layout"),S=i(".gc-post-image-well"),v=i(".gc-post-image"),h=i(".gc-post-image-description"),b=i(".gc-post-photo-nav"),D=i(".gc-post-image-label"),z=i(".gc-post-counter"),M=i(".gc-post-thumbs"),C=new AbortController,q=matchMedia("(max-width: 680px)"),U=[],_=0,I=null,p=bt(t,location.href);function A(){q.matches?y.prepend(d):y.append(d)}A(),q.addEventListener("change",A);function N(j){if(!U.length)return;_=(j+U.length)%U.length;let P=U[_];v.src=P.src,v.alt=P.alt,D.textContent=P.caption,D.hidden=!P.caption,z.textContent=_+1+" / "+U.length,h.replaceChildren(Oi(ai(P.description),p)),h.hidden=!oi(h);for(let[E,$]of Array.from(M.children).entries())E===_?$.setAttribute("aria-current","true"):$.removeAttribute("aria-current");let R=M.children[_];if(R&&M.clientWidth){let{left:E,right:$}=R.getBoundingClientRect(),B=M.getBoundingClientRect();E<B.left&&(M.scrollLeft+=E-B.left),$>B.right&&(M.scrollLeft+=$-B.right)}}function F(j){U=e.popupImage===!1?[]:j,d.hidden=!U.length,b.hidden=U.length<2,M.hidden=U.length<2,M.replaceChildren(...U.length>1?U.map((P,R)=>{let E=document.createElement("button"),$=document.createElement("img");return E.type="button",E.setAttribute("aria-label","Show image "+(R+1)+(P.caption?" \u2013 "+P.caption:"")),$.src=P.src,$.alt="",$.loading="lazy",E.append($),E.addEventListener("click",()=>N(R)),E}):[]),o.toggleAttribute("data-without-gallery",!U.length),N(0)}function X(j,P){s.textContent=j||"",s.hidden=e.popupTitle===!1||!j,o.setAttribute("aria-label",j||"Project details"),x.hidden=e.popupButton===!1||!P,P&&(x.href=P)}function W(j){p=bt(j.url,p)||p;let P=j.title?.replace(/&(?:#(?:[0-9]+|x[0-9a-f]+)|[a-z][a-z0-9]+);/gi,R=>ai(R).textContent);if(X(P,p),e.popupDescription!==!1)for(let R of j.blocks??[]){if(!Xo.has(R.type))continue;let E=ai(R.html),$=E.querySelector(".sqs-html-content,.sqs-block-content")||E;Zo(c,Oi($,p))}Ni(n,j.categories),Ni(u,j.tags),F(Qo(j,p))}return r.addEventListener("click",a),i("[data-post-prev]").addEventListener("click",()=>N(_-1)),i("[data-post-next]").addEventListener("click",()=>N(_+1)),o.addEventListener("keydown",j=>{U.length<2||j.altKey||j.metaKey||j.ctrlKey||["ArrowLeft","ArrowRight"].includes(j.key)&&(j.preventDefault(),N(_+(j.key==="ArrowLeft"?-1:1)))}),S.addEventListener("pointerdown",j=>{U.length<2||!j.isPrimary||j.pointerType==="mouse"||(I={id:j.pointerId,x:j.clientX,y:j.clientY},S.setPointerCapture(j.pointerId))}),S.addEventListener("pointercancel",()=>{I=null}),S.addEventListener("pointerup",j=>{if(I?.id!==j.pointerId)return;let P=j.clientX-I.x,R=j.clientY-I.y;I=null,Math.abs(P)>35&&Math.abs(P)>Math.abs(R)*1.2&&N(_+(P<0?1:-1))}),{dialog:o,async load(){try{let j=await Lt(p,{signal:C.signal,includeSeo:!1});if(C.signal.aborted||(W(j),U.length&&await v.decode().catch(()=>{}),C.signal.aborted))return;f.hidden=!0,y.hidden=!1}catch{if(C.signal.aborted)return;f.removeAttribute("data-loading"),m.textContent="The project details couldn\u2019t load.",p&&e.popupButton!==!1&&(w.href=p,w.hidden=!1)}},destroy(){C.abort(),q.removeEventListener("change",A)}}}var _o,Xo,Vo,Yo,Jo,Ko,Ui=ee(()=>{ei();_o=new Set("p h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" ")),Xo=new Set(["html","text","markdown","image"]),Vo="script,style,template,noscript,iframe,form,svg,object,embed,video,audio,button",Yo='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-14 0 6 6m-6-6 6-6"/></svg>',Jo='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',Ko='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'});function ri(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],a=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${er[t]}${a}</svg>`}function Xe(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?ri("play")+ri("pause"):ri(e),t}var er,Bt=ee(()=>{er={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function qe(t,e,a){let o=document.createElement(t);return o.className=e,a!==void 0&&(o.textContent=a),o}function pt(t,e,a){let o=qe("button",t,a);return o.type="button",o.setAttribute("aria-label",e),o}function ir(t,e,a,o,i,r){let s=a/2,c=o/2,n=.26,u=e/2+48,f=(a*Math.cos(n)+r)/(2*Math.sin(n)),m=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-i)*.7),a*(3.8-i*2.1),c+Math.max(f,u/Math.sin(Math.PI/3))),w=m-c,x=Math.atan2(s,w),d=Math.hypot(s,w),y=2*(x+Math.asin(r/(2*d))),S=x+Math.asin(u/d),v=m+c,h=Math.hypot(v,s)-v,b=w-Math.sqrt((w-u)*(w+u));return{radius:m,step:y,reach:S/y,above:h,below:b}}function ar(t,e,a){let o=e/2,i=10+a*9,r=0,s=0;for(let c=0;c<4.1;c+=.5){let n=Math.min(4.1,c+.5),u=Math.max(.48,1-c*(.09+a*.035)),f=(n*(4+a*7)+(c===0?4:0))*Math.PI/180,m=u*(o+t/2*Math.sin(f))-o;r=Math.max(r,m-Math.min(c,4)*i),s=Math.max(s,m+Math.min(n,4)*i)}return{above:r,below:s}}function _i({host:t,items:e=[],initialIndex:a=0,options:o={},makeCard:i,onChange:r,nativeList:s,loadImage:c}){let n=tr.has(o.preset)?o.preset:"infinite",u=n==="arc"||n==="arc-tabs",f=u||n==="showcase",m=e.length,w=!!o.reducedMotion,x=We(rt(o.depth,55),0,100)/100,d,y,S;function v(l){d=We(rt(l.gap,24),0,180),y=We(rt(l.cardWidth,n==="timed"?760:380),80,1800),S=l.phoneWidthOverride}v(o);let h=We(rt(o.duration,5),1,60)*1e3,b=qe("section",`gc-carousel gc-preset-${n}`);b.setAttribute("aria-roledescription","carousel"),b.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[n]),b.style.setProperty("--gc-card-radius",`${We(rt(o.radius,14),0,120)}px`),b.style.setProperty("--gc-stage-height",`${We(rt(o.stageHeight,0),0,1400)}px`),w&&b.classList.add("gc-reduced-motion");let D=[],z=(l,g,k,L)=>{l.addEventListener(g,k,L),D.push(()=>l.removeEventListener(g,k,L))},M=[],C=[],q=o.navigation==="dots"||o.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),U=n==="arc-tabs"||n==="timed"&&!q,_=qe("nav","gc-carousel-tabs");q&&_.classList.add("gc-choice-dots"),_.setAttribute("aria-label","Choose a slide"),U&&(e.forEach((l,g)=>{let L=(typeof l.title=="string"?l.title.trim():"")||`Slide ${g+1}`,G=q?pt("gc-choice-dot",L):pt("gc-carousel-tab",L,L);z(G,"click",()=>Te(g)),z(G,"keydown",H=>{let T;H.key==="ArrowRight"&&(T=ot(g+1,m)),H.key==="ArrowLeft"&&(T=ot(g-1,m)),H.key==="Home"&&(T=0),H.key==="End"&&(T=m-1),T!==void 0&&(H.preventDefault(),Te(T),M[T]?.focus({preventScroll:!0}))}),_.append(G),M.push(G)}),b.append(_));let I=qe("div","gc-carousel-stage");I.tabIndex=m?0:-1,I.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let p=s?.track??qe("div","gc-carousel-track");p.classList.add("gc-carousel-track"),I.append(p),b.append(I);function A(l){let g=i(e[l],l,{caption:o.showTitles!==!1,description:n==="arc-tabs"||n==="timed"});g.classList.add("gc-carousel-card"),g.dataset.gcItemIndex=String(l),g.style.width="var(--gc-carousel-slot-width)",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),s||g.querySelectorAll("img").forEach(L=>{L.draggable=!1,L.style.objectFit=o.fit==="contain"?"contain":"cover"});let k=s?.slot(g)??g;return p.append(k),{card:g,node:k,index:l,logical:l,active:!1}}let N=e.map((l,g)=>A(g)),F=new Map,X=!1,W=qe("div","gc-carousel-controls"),j=qe("div","gc-carousel-counter");j.setAttribute("aria-hidden","true");let P=qe("span","gc-carousel-current",m?"01":"00");j.append(P,qe("span","gc-carousel-divider","/"),qe("span","gc-carousel-total",String(m).padStart(2,"0")));let R=qe("div","gc-carousel-arrows"),E=Xe(pt("gc-carousel-arrow","Previous slide"),"previous"),$=Xe(pt("gc-carousel-arrow","Next slide"),"next");E.disabled=$.disabled=m<2,R.append(E,$);let B=Xe(pt("gc-carousel-playback","Play slideshow"),"playback");B.hidden=m<2||w;let J=qe("div","gc-carousel-pagination");J.setAttribute("aria-label","Slide pagination"),n==="timed"&&e.forEach((l,g)=>{let k=pt("gc-carousel-dot",l.title?.trim()||`Go to slide ${g+1}`),L=qe("span","gc-carousel-dot-fill");L.setAttribute("aria-hidden","true"),k.append(L),z(k,"click",()=>Te(g)),J.append(k),C.push({dot:k,fill:L})}),W.append(j,R),n==="timed"&&W.append(J),W.append(B),b.append(W);let V=qe("p","gc-carousel-sr");V.setAttribute("aria-atomic","true"),b.append(V);let Z=qe("span","gc-carousel-cursor","Drag");Z.setAttribute("aria-hidden","true"),(n==="arc-tabs"||n==="showcase"||n==="arc")&&I.append(Z),t.append(b);let re=!1,O=a,Y=a,ne=-1,K=0,ce=0,ue=0,se=!!o.autoplay&&!w&&m>1,pe=!1,ye=!1,we=!1,ke=!1,te=null,be=0,ae=0,Ae=0,ge=0,Se=()=>Math.max(12,ge*(.36-x*.12)+d-28),Ce=-1,Pe,ve=1,Re=0,Ne=0,De=()=>ke||o.pauseOnHover&&pe||ye||we||document.hidden||!!te,dt=l=>{let g=ot(Math.round(O),m),k=ot(l-g,m);return k>m/2&&(k-=m),Math.round(O)+k};function Be(){let l=M[ne];if(!l)return;let g=l.offsetLeft,k=g+l.offsetWidth;g<_.scrollLeft?_.scrollLeft=Math.max(0,g-14):k>_.scrollLeft+_.clientWidth&&(_.scrollLeft=k-_.clientWidth+14)}function at(){let l=m?ot(Math.round(O),m):-1;if(l===ne)return;ne=l,P.textContent=m?String(l+1).padStart(2,"0"):"00",M.forEach((k,L)=>{k.classList.toggle("is-active",L===l),k.setAttribute("aria-pressed",String(L===l))}),Be(),C.forEach(({dot:k},L)=>{k.classList.toggle("is-active",L===l),L===l?k.setAttribute("aria-current","true"):k.removeAttribute("aria-current")});let g=e[l]?.title;V.textContent=m?`${l+1} of ${m}${g?`: ${g}`:""}`:"No gallery items",l>=0&&r?.(l)}function He(){if(re||!ae)return;at();let l=Math.abs(Y-O)>.002;b.classList.toggle("is-moving",l||!!te);let g=[...N];for(let k of N)k.logical=k.index+Math.round((O-k.index)/m)*m;if(m>1){let k=ge+d,L=n==="infinite"&&ae>660?ae*.61:ae/2,G=(L+ge/2+40)/k,H=(ae-L+ge/2+40)/k;u?G=H=Pe.reach:n==="showcase"&&(G=H=Math.min(4.1,(ae/2+ge)/Se()));let T=Math.ceil(O-G),Q=Math.floor(O+H);for(let[le,ie]of F)(le<T||le>Q||N[ie.index].logical===le)&&(ie.node.remove(),F.delete(le));for(let le=T;le<=Q;le++){let ie=ot(le,m);if(N[ie].logical===le)continue;let de=F.get(le);de||(de=A(ie),de.logical=le,F.set(le,de),X&&c&&de.card.querySelectorAll("img").forEach(fe=>c(fe,{nativeCard:!!s}))),g.push(de)}}g.forEach(k=>{let L=m===1?0:k.logical-O,G=Math.abs(L),H=k.logical===Math.round(O),T=ae/2,Q=0,le=0,ie=1,de=1,fe=!0,xe=0,he=0;if(n==="infinite")T=(ae>660?ae*.61:ae/2)+L*(ge+d),de=1-Math.min(1,G)*.68,fe=T+ge/2>-40&&T-ge/2<ae+40;else if(n==="timed")T+=L*(ge+d),ie=1-Math.min(G,1)*.035,fe=T+ge/2>-40&&T-ge/2<ae+40;else if(n==="showcase")T+=L*Se(),Q+=Math.min(G,4)*(10+x*9),ie=Math.max(.48,1-G*(.09+x*.035)),le=L*(4+x*7),he=-L*(3+x*4),de=We(1-G*.19,0,1),fe=G<4.1,H&&!w&&(xe=Ne,he+=Re,le+=We(Y-O,-1,1)*-3);else{let me=L*Pe.step;T+=Pe.radius*Math.sin(me),Q=Pe.radius*(1-Math.cos(me)),le=me*180/Math.PI,fe=G<=Pe.reach,de=n==="arc-tabs"?1-Math.min(G,1)*.16:1}if(k.card.style.transform=`translate3d(${T}px,${Q}px,0) translateX(-50%) rotate(${le}deg) rotateX(${xe}deg) rotateY(${he}deg) scale(${ie})`,k.card.style.zIndex=String(1e3-Math.round(G*100)),k.card.style.opacity=String(de),k.card.style.visibility=fe?"visible":"hidden",k.card.style.pointerEvents=fe&&de>.08?"auto":"none",k.active!==H&&(k.active=H,k.card.classList.toggle("is-active",H)),k.card.tabIndex=H?0:-1,k.card.setAttribute("aria-hidden",String(!H)),s)s.syncFocus(k.card);else{let me=k.card.querySelector(".gc-card-button");me&&(me.tabIndex=H?0:-1)}}),C.forEach(({fill:k},L)=>{k.style.transform=`scaleX(${L===ne?We(ue/h,0,1):0})`})}function Oe(){let l=ae;ae=I.clientWidth;let g=S?1:n==="timed"?.86:n==="infinite"&&ae>660?.48:.76,k=Math.max(80,Math.min(y,ae*g));if(k!==ge&&(ge=k,p.style.setProperty("--gc-carousel-slot-width",`${ge}px`)),f){let L=p.offsetHeight;if(ae!==l||L!==Ce){Ce=L,u&&(Pe=ir(n,ae,ge,Ce,x,d));let G=Pe??ar(ge,Ce,x);m>1&&(I.style.setProperty("--gc-sweep-above",Math.ceil(G.above)+"px"),I.style.setProperty("--gc-sweep-below",Math.ceil(G.below)+"px"))}}Ae=I.clientHeight,ve=u?Pe.radius*Pe.step:n==="showcase"?ge*.54:ge+d,He()}function Ie(){!re&&!K&&(K=requestAnimationFrame(Ye))}function Ye(l){if(K=0,re)return;let g=ce?We(l-ce,0,64):0;ce=l,te||(w?O=Y:O+=(Y-O)*(1-Math.exp(-g/85)),Math.abs(Y-O)<5e-4&&(O=Y));let k=Math.abs(Y-O)<.002&&!te;se&&!De()&&k&&(ue+=g,ue>=h&&(ue=0,Y=Math.round(O)+1)),He(),Math.abs(Y-O)>5e-4||se&&!De()?Ie():ce=0}function Te(l){re||m<2||(Y=dt(ot(Math.round(rt(l,0)),m)),ue=0,w&&(O=Y),He(),Ie())}function et(l){m<2||(Y=Math.round(Y)+l,ue=0,w&&(O=Y),He(),Ie())}function Ue(l){se=!!l&&!w&&m>1,B.dataset.paused=String(!se),B.setAttribute("aria-label",se?"Pause slideshow":"Play slideshow"),B.setAttribute("aria-pressed",String(se)),V.setAttribute("aria-live",se?"off":"polite"),b.classList.toggle("is-playing",se),ce=0,Ie()}function Me(l){ke=!!l,ce=0,Ie()}z(E,"click",()=>et(-1)),z($,"click",()=>et(1)),z(B,"click",()=>Ue(!se)),z(I,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),I.focus({preventScroll:!0}),et(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),I.focus({preventScroll:!0}),Te(l.key==="Home"?0:m-1))}),z(I,"pointerdown",l=>{m<2||l.button!==0||!l.isPrimary||(te={id:l.pointerId,x:l.clientX,y:l.clientY,start:O,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},Y=O,ue=0)}),z(I,"pointermove",l=>{let g=I.getBoundingClientRect(),k=g.width/Math.max(1,I.clientWidth)||1,L=(l.clientX-g.left)/k,G=(l.clientY-g.top)/k;if(Z.style.left=`${L}px`,Z.style.top=`${G}px`,l.pointerType==="mouse"&&I.classList.add("has-pointer"),!te){n==="showcase"&&!w&&(Re=We((L-ae/2)/ge,-1,1)*4,Ne=We((G-Ae/2)/Ae,-.5,.5)*-5,He());return}if(l.pointerId!==te.id)return;let H=l.clientX-te.x,T=l.clientY-te.y;if(!te.axis&&Math.hypot(H,T)>6&&(te.axis=Math.abs(H)>Math.abs(T)?"horizontal":"vertical",te.axis==="horizontal"&&(I.setPointerCapture(l.pointerId),I.classList.add("is-dragging"))),te.axis!=="horizontal")return;l.preventDefault(),te.moved=!0;let Q=performance.now(),le=Math.max(8,Q-te.lastTime),ie=-(l.clientX-te.lastX)/k/ve/le;te.velocity=te.velocity*.45+ie*.55,te.lastX=l.clientX,te.lastTime=Q,O=te.start-H/k/ve,Y=O,He()},{passive:!1});function _e(l){if(!te||l.pointerId!==te.id)return;let g=te;if(te=null,I.hasPointerCapture(l.pointerId)&&I.releasePointerCapture(l.pointerId),I.classList.remove("is-dragging"),g.moved){be=performance.now()+400;let k=performance.now()-g.lastTime,L=w||l.type==="pointercancel"||k>120?0:We(g.velocity*210,-4,4);Y=Math.round(O+L)}else Y=Math.round(O);w&&(O=Y),Ie()}z(I,"pointerup",_e),z(I,"pointercancel",_e),z(window,"pointerup",_e),z(I,"lostpointercapture",l=>{te?.id===l.pointerId&&_e(l)}),z(I,"dragstart",l=>l.preventDefault()),z(I,"click",l=>{if(performance.now()<be){l.preventDefault(),l.stopImmediatePropagation();return}let g=l.target.closest(".gc-carousel-card");!g||!I.contains(g)||g.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Te(Number(g.dataset.gcItemIndex)))},!0),z(I,"pointerleave",()=>{I.classList.remove("has-pointer"),Re=Ne=0,te||He()}),z(b,"pointerenter",l=>{l.pointerType==="mouse"&&(pe=!0)}),z(b,"pointerleave",()=>{pe=!1,ce=0,Ie()}),z(b,"focusin",()=>{ye=!0}),z(b,"focusout",()=>{queueMicrotask(()=>{re||(ye=b.contains(document.activeElement),ce=0,Ie())})}),z(document,"visibilitychange",()=>{ce=0,Ie()});let Fe;typeof ResizeObserver<"u"?(Fe=new ResizeObserver(l=>{l.some(({target:g})=>g===I||g===p)&&Oe(),U&&l.some(({target:g})=>g!==I&&g!==p)&&Be()}),Fe.observe(I),f&&Fe.observe(p),U&&(Fe.observe(_),M.forEach(l=>Fe.observe(l,{box:"border-box"})))):z(window,"resize",()=>{Oe(),Be()});let $e;return typeof IntersectionObserver<"u"&&($e=new IntersectionObserver(l=>{we=!l[0]?.isIntersecting,ce=0,Ie()}),$e.observe(b)),Oe(),X=!0,Ue(se),{goTo:Te,setGeometry(l){v(l),Ce=-1,Oe()},setPlaying:Ue,setSuspended:Me,destroy(){re=!0,cancelAnimationFrame(K),Fe?.disconnect(),$e?.disconnect(),D.forEach(l=>l()),b.remove()}}}var tr,We,ot,rt,Xi=ee(()=>{Bt();tr=new Set(["infinite","arc","arc-tabs","showcase","timed"]),We=(t,e,a)=>Math.min(a,Math.max(e,t)),ot=(t,e)=>(t%e+e)%e,rt=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Vi(t){let{host:e,makeCard:a,nativeList:o}=t,i=Array.isArray(t.items)?t.items:[],r=t.options||{},s=["wall","ring","angled"].includes(r.preset)?r.preset:"wall",c=!!r.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=i.length,u=s==="ring"?16:s==="wall"?12:n,f=!c&&n>1&&n<12&&s!=="angled"?Math.ceil(u/n)*n:n,m=Array.from({length:n},(l,g)=>g),w=Je(it(r.depth,55),0,100),x=Je(it(r.cardWidth,280),80,900),d=Je(it(r.gap,24),0,160),y=Math.max(1,it(r.duration,5)),S=new AbortController,v=(l,g,k,L={})=>l.addEventListener(g,k,{...L,signal:S.signal}),h={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},b=`gc-spatial-help-${++or}`,D=["gc-spatial",`gc-${s}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...D);let z=new Map,M=(l,g)=>{z.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,g)};M("--gc-spatial-height",`${Je(it(r.stageHeight,620),300,1400)}px`),M("--gc-spatial-radius",`${Je(it(r.radius,18),0,100)}px`),M("--gc-spatial-fit",r.fit==="contain"?"contain":"cover"),M("--gc-spatial-card-width",`${x}px`),M("--gc-spatial-gap",`${d}px`);let C=o?.track??document.createElement("div");C.classList.add("gc-spatial-canvas"),o&&C.classList.add("gc-spatial-native-track"),C.setAttribute("role",o?"list":"group"),C.setAttribute("aria-label",h[s]),C.setAttribute("aria-describedby",b);let q=document.createElement("p");q.id=b,q.className="gc-spatial-sr",q.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let U=document.createElement("span");U.className="gc-spatial-sr",U.setAttribute("aria-live","polite"),U.setAttribute("aria-atomic","true"),e.append(q,C,U);let _=r.showTitles!==!1&&(s!=="ring"||c||n===1),I=Array.from({length:f},(l,g)=>{let k=g%n,L=i[k],G=a(L,k,{caption:_,description:!1,thumbnail:!0}),H=o?.slot(G)??document.createElement("div");return H.classList.add("gc-spatial-position"),G.classList.add("gc-spatial-card"),G.dataset.spatialIndex=String(g),G.dataset.spatialSourceIndex=String(k),G.tabIndex=g===0?0:-1,g>=n&&G.setAttribute("aria-hidden","true"),!G.getAttribute("aria-label")&&!G.textContent.trim()&&G.setAttribute("aria-label",`View item ${k+1}`),H.contains(G)||H.append(G),H.parentNode!==C&&C.append(H),{position:H,card:G,sourceIndex:k,x:0,y:0,flip:0,tilt:0,lift:0}}),p=document.createElement("div");p.className="gc-spatial-nav";let A=(l,g)=>{let k=document.createElement("button");return k.type="button",k.className="gc-spatial-control",k.setAttribute("aria-label",g),Xe(k,l)},N=A("previous","Previous item"),F=A("next","Next item"),X=document.createElement("span");X.className="gc-spatial-count",X.setAttribute("aria-hidden","true"),p.append(N,X,F);let W=r.autoplay&&!c?A("playback","Pause gallery motion"):null;W&&(W.disabled=n<2,W.dataset.paused=String(n<2),W.disabled&&W.setAttribute("aria-label","Play gallery motion"),p.append(W)),e.append(p),N.disabled=F.disabled=n<2;let j,P;if(s==="ring"&&n>1&&!c){j=document.createElement("div"),j.className="gc-ring-center",j.setAttribute("aria-hidden","true"),r.showTitles!==!1&&(P=document.createElement("span"),P.className="gc-ring-label",j.append(P));let l=document.createElement("span");l.textContent="Drag to explore",j.append(l),C.after(j)}let R;n||(R=document.createElement(o?"li":"p"),R.className="gc-spatial-empty",R.textContent="No items available.",C.append(R));let E=!1,$=0,B=-1,J=1,V=1,Z=1,re=1,O=1,Y=1,ne=0,K=1,ce=1,ue=0,se=0,pe=1,ye=!!r.autoplay&&!c&&n>1,we=!1,ke=!1,te=!1,be=!0,ae=null,Ae=0,ge=0,Se=0,Ce=-1,Pe=!1,ve={x:-1e4,y:-1e4,inside:!1};function Re(l=$){if(!P)return;let g=typeof i[l]?.title=="string"?i[l].title.trim():"";P.textContent===g&&P.hidden===!g||(P.textContent=g,P.hidden=!g,Ne())}function Ne(){!j||E||(j.classList.remove("is-below"),j.offsetHeight>ne&&j.classList.add("is-below"))}function De(l,g=!1,k=null){if(!n){X.textContent="00 / 00";return}let L=nt(l,n),G=k!==null&&I[k]?.sourceIndex===L,H=G&&m[L]!==k;if(G){let T=I[m[L]].card;m[L]=k,H&&(I[k].card.removeAttribute("aria-hidden"),o?.syncFocus(I[k].card),document.activeElement===T&&(Pe=!0,I[k].card.focus({preventScroll:!0}),Pe=!1))}if(B===L&&!H){g&&(U.textContent=`Item ${L+1} of ${n}${i[L].title?`: ${i[L].title}`:""}`);return}$=L,Re(),X.textContent=`${String($+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`,I.forEach(({card:T,sourceIndex:Q},le)=>{let ie=m[Q]===le;if(T.tabIndex=ie&&Q===$?0:-1,T.classList.toggle("is-selected",ie&&Q===$),ie?T.removeAttribute("aria-hidden"):T.setAttribute("aria-hidden","true"),o)o.syncFocus(T);else{let de=T.querySelector(".gc-card-button");de&&(de.tabIndex=T.tabIndex)}}),g&&(U.textContent=`Item ${$+1} of ${n}${i[$].title?`: ${i[$].title}`:""}`),B!==$&&(B=$,t.onChange?.($))}function dt(l){ye=!!l&&!c&&n>1,W&&(W.dataset.paused=String(!ye),W.setAttribute("aria-label",ye?"Pause gallery motion":"Play gallery motion")),Me()}function Be(l){we=!!l,we||Me()}function at(l,g,k){return g+Math.round((l-g)/k)*k}function He(l){let g={index:m[l],target:l,distance:1/0};return I.forEach((k,L)=>{if(k.sourceIndex!==l)return;let G=L;if(s==="ring")G=at(ue,L,f);else if(s==="wall"){let T=Math.floor(L/K);G=ce>2?at(ue,T,ce):T}let H=Math.abs(G-ue);H<g.distance&&(g={index:L,target:G,distance:H})}),g}function Oe(l){let g=l.getBoundingClientRect();return g.left+g.width/2}function Ie(){if(n<2)return;let l=Oe(I[0].position),g=Oe(I[1].position)-l;if(Math.abs(g)<1)return;let k=Je(Math.round((Oe(C)-l)/g),0,n-1);De(k,!1,k)}function Ye(l,g=!1){if(!n)return;let k=nt(Math.round(it(l,0)),n),L=c?{index:k,target:k}:He(k);if(De(k,!0,L.index),c){let G=I[k].position;C.scrollTo({left:C.scrollLeft+Oe(G)-Oe(C),behavior:"auto"})}else se=L.target;g&&I[L.index].card.focus({preventScroll:!0}),Me()}function Te(){if(!E){if(J=Math.max(1,C.clientWidth),V=Math.max(1,C.clientHeight),s==="ring"){let l=Math.max(80,Math.min(J-32,V-42)),g=Je(it(r.ringDiameter,l),80,l);Y=Math.max(0,g*.38);let k=ni*Y/Math.max(1,f),L=Math.min(g*.17,k*.8),G=1.15-Je(d,0,100)/160;if(Z=n<=1?Math.min(x,J*.65,V*.58):Math.max(18,Math.min(Math.min(x*.22,L)*G,k*.94)),re=Z*1.28,j){let H=Math.max(0,Y-Math.max(32,re)/2-10);ne=Math.floor(H*Math.SQRT2),j.style.setProperty("--gc-ring-label-width",`${ne}px`),j.style.setProperty("--gc-ring-label-y",`${C.offsetTop+V/2}px`),Ne()}O=Math.max(24,ni*Math.max(1,Y)/Math.max(1,f))}else s==="wall"?(K=f>=10?3:f>=4?2:1,ce=Math.max(1,Math.ceil(f/K)),re=Math.min((V-56-(K-1)*d)/K,x*.62,230),Z=Math.max(60,Math.min(re*1.5,x,J*.43)),re=Z/1.5,O=Z+Math.min(d,70)):(Z=Math.min(x,J*.68,(V-70)*.76),re=Z/.76,O=Z*(.72+(100-w)*.001)+d);I.forEach(({position:l})=>{l.style.width=`${Math.max(24,Z)}px`,l.style.height=`${Math.max(32,re)}px`}),c&&I.forEach(({position:l})=>{l.style.width=`${Math.min(x,J*.72)}px`,l.style.height=`${Math.min(V-40,x*1.15)}px`}),Me()}}function et(l){if(c||!n||we)return!1;let g=ye&&!(r.pauseOnHover&&ke)&&!te&&!ae&&be&&!document.hidden;if(g){let H=l/y;s==="angled"?(se+=H*pe,se>=n-1&&(se=n-1,pe=-1),se<=0&&(se=0,pe=1)):se+=H}let k=ae?.moved?1:1-Math.exp(-l*11);ue+=(se-ue)*k,Math.abs(se-ue)<1e-4&&(ue=se);let L=Math.abs(se-ue)>1e-4||g;if(g||ae?.moved){let H=ae?.moved?ue:se,T=s==="wall"?Math.round(H)*K+m[$]%K:Math.round(H),Q=s==="wall"?Math.min(nt(T,ce*K),f-1):nt(T,f);De(I[Q].sourceIndex,!1,Q)}let G=1-Math.exp(-l*13);return I.forEach((H,T)=>{let{position:Q,card:le}=H;if(s==="ring"){let ie=-Math.PI/2+(T-ue)*ni/f;H.x=n===1?0:Math.cos(ie)*Y,H.y=n===1?0:Math.sin(ie)*Y;let de=Math.hypot(ve.x-(J/2+H.x),ve.y-(V/2+H.y)),fe=Math.max(65,Z*2.6),xe=ve.inside&&!ae?.moved?Math.max(0,1-de/fe):0,he=xe*xe*(50+w*1.3);H.flip+=(he-H.flip)*G,Math.abs(H.flip-he)>.05&&(L=!0),le.toggleAttribute("data-gc-back-facing",H.flip>90);let me=n===1?0:ie*180/Math.PI+90;Q.style.transform=`translate3d(${H.x}px,${H.y}px,0) rotate(${me}deg)`,le.style.transform=`perspective(700px) rotateY(${H.flip}deg) translateZ(${xe*12}px)`,Q.style.zIndex=String(T===Ce?f+2:1)}else if(s==="wall"){let ie=T%K,fe=Math.floor(T/K)-ue;if(ce>2){let Pt=ce%2===0?.5:0;fe=nt(fe-Pt+ce/2,ce)-ce/2}let xe=Math.min(.68,2.6/Math.max(3,ce)),he=fe*xe,me=Math.max(O/xe,J*.4),ht=w/100,Ct=Math.sin(he)*me,Mt=(1-Math.cos(he))*me*ht*.65,At=(ie-(K-1)/2)*(re+Math.min(d,50)),tt=T===Ce||te&&T===m[$]?1:0;H.lift+=(tt-H.lift)*G,Math.abs(tt-H.lift)>.002&&(L=!0),Q.style.transform=`translate3d(${Ct}px,${At}px,${Mt+H.lift*20}px) rotateY(${-he*180/Math.PI*ht}deg)`,Q.style.zIndex=String(Math.round(Mt)+(tt?1e3:1)),le.style.transform=`scale(${1+H.lift*.035})`,Q.style.opacity=Math.abs(he)>1.6?"0":"1",Q.style.visibility=Math.abs(he)>1.6?"hidden":"visible"}else{let ie=T-ue,de=T===Ce||te&&T===m[$]?1:0;H.lift+=(de-H.lift)*G,Math.abs(de-H.lift)>.002&&(L=!0);let fe=-(25+w*.28)*(1-H.lift);Q.style.transform=`translate3d(${ie*O}px,${-H.lift*14}px,${H.lift*110}px) rotateY(${fe}deg)`,Q.style.zIndex=String(de?n+2:n-T),le.style.transform="none"}}),L}function Ue(l){if(ge=0,E)return;let g=Math.min(.05,Math.max(.001,(l-(Se||l-16.7))/1e3));Se=l,et(g)&&be&&!document.hidden?ge=requestAnimationFrame(Ue):Se=0}function Me(){!E&&!ge&&!c&&(ge=requestAnimationFrame(Ue))}c&&v(C,"scroll",Ie,{passive:!0}),v(N,"click",()=>Ye($-1)),v(F,"click",()=>Ye($+1)),W&&v(W,"click",()=>dt(!ye)),v(C,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let g=l.key==="Home"?0:l.key==="End"?n-1:$+(l.key==="ArrowRight"?1:-1);Ye(g,!0)}),v(C,"focusin",l=>{te=!0;let g=l.target.closest?.("[data-spatial-index]");g&&!Pe&&De(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),Me()}),v(C,"focusout",()=>{queueMicrotask(()=>{E||(te=C.contains(document.activeElement),Me())})}),v(C,"pointerenter",l=>{l.pointerType!=="touch"&&(ke=!0,ve.inside=!0,Me())}),v(C,"pointerleave",()=>{ke=!1,ve.inside=!1,Ce=-1,Re(),Me()}),v(C,"pointermove",l=>{if(l.pointerType==="touch")return;let g=C.getBoundingClientRect();ve.x=l.clientX-g.left,ve.y=l.clientY-g.top,ve.inside=!0;let k=l.target.closest?.("[data-spatial-index]");Ce=k?Number(k.dataset.spatialIndex):-1,Re(Ce>=0?I[Ce].sourceIndex:$),Me()}),v(C,"pointerdown",l=>{let g=l.target.closest?.("[data-spatial-index]");g&&De(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),!(c||n<2||l.pointerType==="mouse"&&l.button!==0)&&(ae={id:l.pointerId,x:l.clientX,y:l.clientY,start:se,moved:!1})}),v(window,"pointermove",l=>{if(!ae||l.pointerId!==ae.id)return;let g=l.clientX-ae.x,k=l.clientY-ae.y;if(!ae.moved){if(Math.abs(k)>12&&Math.abs(k)>Math.abs(g)*1.2){ae=null;return}if(Math.abs(g)<7)return;ae.moved=!0,C.classList.add("is-dragging"),C.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),se=ae.start-g/O,(s==="angled"||s==="wall"&&ce<=2)&&(se=Je(se,0,s==="wall"?ce-1:n-1)),Me()},{passive:!1});let _e=l=>{if(!ae||l.pointerId!==ae.id)return;let g=ae.moved;if(ae=null,C.classList.remove("is-dragging"),C.hasPointerCapture?.(l.pointerId)&&C.releasePointerCapture(l.pointerId),g){Ae=performance.now()+350,se=Math.round(se);let k=s==="wall"?Math.round(se)*K+m[$]%K:Math.round(se),L=s==="wall"?Math.min(nt(k,ce*K),f-1):nt(k,f);De(I[L].sourceIndex,!0,L)}Me()};v(window,"pointerup",_e),v(window,"pointercancel",_e),v(C,"click",l=>{performance.now()<Ae&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),v(C,"dragstart",l=>l.preventDefault()),v(document,"visibilitychange",Me);let Fe=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(g=>g.target===C)?Te():Ne()}):null;Fe?.observe(C),j&&Fe?.observe(j),Fe||v(window,"resize",Te);let $e=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{be=l[0]?.isIntersecting??!0,be&&Me()},{rootMargin:"100px"}):null;return $e?.observe(e),Te(),De(0),{goTo:Ye,setPlaying:dt,setSuspended:Be,destroy(){E||(E=!0,cancelAnimationFrame(ge),Fe?.disconnect(),$e?.disconnect(),S.abort(),q.remove(),U.remove(),p.remove(),j?.remove(),o?R?.remove():C.remove(),e.classList.remove(...D),z.forEach((l,g)=>l?e.style.setProperty(g,l):e.style.removeProperty(g)))}}}var or,Je,nt,it,ni,Yi=ee(()=>{Bt();or=0,Je=(t,e,a)=>Math.max(e,Math.min(a,t)),nt=(t,e)=>(t%e+e)%e,it=(t,e)=>Number.isFinite(Number(t))?Number(t):e,ni=Math.PI*2});function Ji({host:t,items:e,options:a,makeCard:o,onChange:i,nativeList:r}){let s=Number(a.stageHeight)||680,c=Math.max(300,s-120),n=Math.max(0,Number(a.gap)||0),u=Number.isFinite(Number(a.depth))?Number(a.depth):45,f=a.previewScroll===!1,m=f?window:t;t.classList.add("gc-stack"),t.style.height=f?"auto":s+"px",t.style.overflowY=f?"visible":"auto",t.style.overscrollBehavior=f?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let w=r?.track??document.createElement("div");w.classList.add("gc-stack-track"),t.append(w);let x=e.map((D,z)=>{let M=o(D,z,{caption:a.showTitles,description:!0}),C=r?.slot(M)??document.createElement("div");C.classList.add("gc-stack-slot"),M.parentElement!==C&&C.append(M),w.append(C),C.style.zIndex=z+1,M.style.width=`min(${a.stackCardWidth}px,calc(100% - 48px))`,M.style.minHeight=c+"px";let q=M.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),U=!Array.from(q).some(_=>!_.closest("[hidden]")&&_.textContent.trim());return M.classList.toggle("gc-stack-image-only",U),{card:M,wrap:C,imageOnly:U,start:0,duration:1/0}}),d=0;function y(){return f?-w.getBoundingClientRect().top:t.scrollTop}function S(){d=0;let D=y(),z=0;x.forEach(({card:M,start:C,duration:q},U)=>{let _=Math.max(0,Math.min(1,(D-C)/q));M.style.transform=a.reducedMotion?"none":`perspective(1300px) translateY(${_*-32}px) scale(${1-_*.14}) rotateX(${_*u*.25}deg)`,M.style.filter=`brightness(${1-_*.23})`,_>=.5&&(z=Math.min(U+1,x.length-1))}),x.length&&i?.(z)}function v(){d||(d=requestAnimationFrame(S))}function h(){if(a.cardSizing==="equal"&&x.length){for(let{card:q}of x)q.style.minHeight=c+"px";let C=Math.max(...x.map(({card:q})=>q.offsetHeight));for(let{card:q}of x)q.style.minHeight=C+"px"}let D=x.map(({card:C,wrap:q})=>({height:C.offsetHeight,rowHeight:q.offsetHeight})),z=f?window.innerHeight:t.clientHeight,M=w.clientTop+(parseFloat(getComputedStyle(w).paddingTop)||0);x.forEach((C,q)=>{let{height:U,rowHeight:_}=D[q],I=Math.min(40,z-24-U);C.wrap.style.top=I+"px",C.start=M-I,q&&(x[q-1].duration=Math.max(1,C.start-x[q-1].start));let p=C.imageOnly&&U<=z-64?U*.24:0,A=q<x.length-1?n-p:0;C.wrap.style.marginBottom=A+"px",M+=_+A,q===x.length-1&&(C.duration=1/0,w.style.paddingBottom=Math.max(40,z-I-_)+"px")}),v()}let b;return h(),typeof ResizeObserver<"u"&&(b=new ResizeObserver(h),b.observe(w,{box:"border-box"}),x.forEach(({card:D})=>b.observe(D,{box:"border-box"}))),window.addEventListener("resize",h),m.addEventListener("scroll",v,{passive:!0}),{goTo(D){let z=x[Math.max(0,Math.min(x.length-1,Math.round(D)))];if(!z)return;let M=f?window.scrollY+z.start-y():z.start;m.scrollTo({top:M,behavior:a.reducedMotion?"instant":"smooth"})},destroy(){b?.disconnect(),window.removeEventListener("resize",h),cancelAnimationFrame(d),m.removeEventListener("scroll",v),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",w.remove()}}}var Ki=ee(()=>{});function Ft(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function si(t,e,a,o,i,r){t.beginPath(),t.roundRect(e,a,o,i,Math.max(0,Math.min(r,o/2,i/2)))}function rr(t,e,a){let o=[];for(let i of e.split(/\n/)){let r="";for(let s of i.split(/\s+/)){let c=r?r+" "+s:s;r&&t.measureText(c).width>a?(o.push(r),r=s):r=c}o.push(r)}return o}function Zi(t,e,a){let o=Math.max(80,e.cardWidth),i=Math.min(e.cardPadding,o*.4),r=o-2*i,s=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,c=document.createElement("canvas").getContext("2d"),n=t.map(({item:f,image:m})=>{let w=[],x=(z,M,C,q,U,_,I=!1,p=a.bodyFamily)=>{if(!z)return;let A=C+" "+M+"px "+p;c.font=A;let N=rr(c,z,Math.max(1,r-(I?16:0)));w.push({font:A,size:M,color:q,align:U,lines:N,height:N.length*M*1.25+(I?10:0),gap:_,isButton:I})},d=r*e.imageWidth/100,y=m?.naturalWidth/m?.naturalHeight||1,[S,v]=e.aspectRatio.split(":").map(Number),h=e.aspectRatio==="circle"?1:S&&v?S/v:y,b=m&&e.showImage?{image:m,width:d,height:d/h,gap:0}:null;return(e.textPlacement==="card"||!f.src||!e.showImage)&&(e.showTitles&&x(f.title,e.titleCustom&&e.titleSize?e.titleSize*s:a.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:a.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:a.ink,e.titleAlign,0,!1,a.family),e.showDescription&&x(f.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*s:a.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:a.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:a.ink,e.descriptionAlign,w.length?e.titleGap:0),e.showButton&&f.buttonLabel&&f.link&&x(f.buttonLabel,a.size,a.weight,a.buttonInk,"center",e.buttonGap,!0)),b&&(e.cardOrder==="content"?(b.gap=w.length?e.mediaGap:0,w.push(b)):(w.length&&(w[0].gap+=e.mediaGap),w.unshift(b))),{pieces:w,height:Math.max(1,2*i+w.reduce((z,M)=>z+M.gap+M.height,0))}}),u=Math.max(1,...n.map(f=>f.height));return n.map(({pieces:f,height:m})=>{let w=document.createElement("canvas"),x=Math.min(2,2048/Math.max(o,u));w.width=Math.max(1,Math.round(o*x)),w.height=Math.max(1,Math.round(u*x));let d=w.getContext("2d");d.scale(x,x);let y=e.cardSizing==="equal"?u:m,S=(u-y)/2;e.cardBackground&&(d.fillStyle=e.cardColor,si(d,0,S,o,y,e.spiralRadius),d.fill());let v=S+i+(e.cardAlign==="bottom"?y-m:e.cardAlign==="middle"?(y-m)/2:0),h;for(let b of f){if(v+=b.gap,b.image){let D=b.image.naturalWidth/b.image.naturalHeight,z=e.fit==="contain"||e.fit==="fit",M=z?Math.min(b.width,b.height*D):b.width,C=z?M/D:b.height,q=i+(e.imageAlign==="left"?0:e.imageAlign==="right"?r-b.width:(r-b.width)/2)+(b.width-M)/2,U=v+(b.height-C)/2,_=e.aspectRatio==="circle"?b.width/2:e.imageRadius;if(e.shadowEnabled){d.save(),d.shadowColor=e.shadowColor,d.shadowBlur=e.shadowBlur*x;let N=e.shadowAngle*Math.PI/180;d.shadowOffsetX=Math.cos(N)*e.shadowDistance*x,d.shadowOffsetY=Math.sin(N)*e.shadowDistance*x;let F=e.shadowSpread;si(d,q-F,U-F,M+2*F,C+2*F,_+F),d.fillStyle=e.shadowColor,d.fill(),d.restore()}d.save(),e.aspectRatio==="circle"&&(d.beginPath(),d.arc(q+M/2,U+C/2,b.width/2,0,Math.PI*2),d.clip()),si(d,q,U,M,C,e.aspectRatio==="circle"?0:_),d.clip();let I=z?Math.min(M/b.image.naturalWidth,C/b.image.naturalHeight):Math.max(M/b.image.naturalWidth,C/b.image.naturalHeight),p=b.image.naturalWidth*I,A=b.image.naturalHeight*I;d.drawImage(b.image,q+(M-p)/2,U+(C-A)/2,p,A),e.overlayEnabled&&(d.fillStyle=e.imageTint,d.fillRect(q,U,M,C)),e.imageBorder&&(d.strokeStyle=e.imageBorderColor,d.lineWidth=2*e.imageBorderSize,d.stroke()),d.restore()}else{let D=b.align==="inherit"?"center":b.align;if(d.font=b.font,d.textBaseline="top",d.textAlign=D,d.fillStyle=b.color,b.isButton){let M=Math.min(r,Math.max(...b.lines.map(q=>d.measureText(q).width))+16),C=(o-M)/2;d.fillStyle=a.accent,d.fillRect(C,v,M,b.height),d.fillStyle=b.color,h={left:C/o,right:(C+M)/o,top:v/u,bottom:(v+b.height)/u}}let z=D==="left"?i:D==="right"?o-i:o/2;b.lines.forEach((M,C)=>d.fillText(M,z,v+(b.isButton?5:0)+C*b.size*1.25,r))}v+=b.height}return{canvas:w,buttonBounds:h,aspect:o/u}})}var Qi=ee(()=>{});var ea,Dt,ta=ee(()=>{ea='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',Dt=class{constructor(e,a,o){this.root=e,this.cards=a,this.projects=o;let i=a[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(i)?i:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let r=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",r),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${ea}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${ea}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${r}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",c=>{if(c.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(c.clientX<n.left||c.clientX>n.right||c.clientY<n.top||c.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",c=>{(c.key==="ArrowLeft"||c.key==="ArrowRight")&&(c.preventDefault(),this.showFrame(this.frame+(c.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",c=>{!c.isPrimary||c.target.closest("button")||(this.galleryPointer={id:c.pointerId,x:c.clientX,y:c.clientY},s.setPointerCapture(c.pointerId))}),s.addEventListener("pointerup",c=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==c.pointerId)return;s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId);let u=c.clientX-n.x,f=c.clientY-n.y;Math.abs(u)>35&&Math.abs(u)>Math.abs(f)*1.2&&this.showFrame(this.frame+(u<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let a=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!a,this.dialog.querySelector("[data-gallery-next]").hidden=!a,this.thumbnails.hidden=!a,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(i=>{let r=document.createElement("li");return r.textContent=i,r})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((i,r)=>{let s=document.createElement("button");s.type="button",s.className="project-thumbnail",s.setAttribute("aria-label",`Show ${i.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(i.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,s.append(c),s.addEventListener("click",()=>this.showFrame(r)),s})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let a=this.project.gallery[this.frame];this.image.src=new URL(a.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${a.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${a.label}`,[...this.thumbnails.children].forEach((o,i)=>o.setAttribute("aria-current",String(i===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Ve,yt,Ht=ee(()=>{It();Ve=Object.freeze({...jt,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),yt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function ia(t,e,{pauseOnHover:a=!0,interactionRestMs:o=6e3}={}){let i=t.querySelector("[data-orbit-toggle]"),r=new AbortController,s=(h,b,D)=>h.addEventListener(b,D,{signal:r.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let n=0,u=0,f=!1,m=h=>!!h&&t.contains(h)&&(h.matches(":focus-visible")||!!h.closest(".orbit-card")),w=()=>!f&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,x=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(n),e.autoFrame=0,n=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},d=h=>{if(e.autoFrame=0,!w()){x();return}let b=Math.min(.05,Math.max(0,(h-e.autoTime)/1e3));e.autoTime=h;let D=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(u+=b,u>=Number(t.dataset.interval||5)){u=0,e.autoTime=0,c.animateTo.call(e,Math.round(e.position)+D),n=setTimeout(y,100);return}}else e.position=(e.position+D*b*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(d)},y=()=>{if(!w()){x(),e.frame&&!f&&(n=setTimeout(y,100));return}let h=e.resumeAt-performance.now();if(h>0){x(),n=setTimeout(y,h);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(d))},S=(h=6e3)=>{x(),e.resumeAt=performance.now()+h};e.animateTo=function(...h){S(o),c.animateTo.apply(this,h),y()},e.settleImmediately=function(...h){c.settleImmediately.apply(this,h),y()},e.openProject=function(...h){S(),c.openProject.apply(this,h),y()},s(t,"pointerenter",h=>{h.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||a)&&(e.hovered=!0,y())}),s(t,"pointerleave",h=>{h.pointerType!=="touch"&&(e.hovered=!1,y())}),s(t,"focusin",h=>{e.keyboardFocused=m(h.target),y()}),s(t,"focusout",h=>{e.keyboardFocused=m(h.relatedTarget),y()}),s(t,"pointerup",()=>{S(o),y()}),s(t,"pointercancel",()=>{S(o),y()}),s(e.viewer.dialog,"close",()=>{S(),y()}),s(document,"visibilitychange",y),s(e.reducedMotion,"change",y),s(i,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,i.dataset.paused=String(e.manuallyPaused),i.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),y()});let v=new IntersectionObserver(h=>{e.inView=h.some(b=>b.isIntersecting&&b.intersectionRatio>=.15),y()},{threshold:.15});return v.observe(e.stage),e.stopAutoplay=x,e.syncAutoplay=y,()=>{f=!0,x(),r.abort(),v.disconnect(),Object.assign(e,c)}}var aa=ee(()=>{});var Ee,oa,ci,ra,na,sa,ca,la,da,pa,ga,ua,ha,fa,Wt,ma,vt,ba,li=ee(async()=>{Ee=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),oa=Ee.CanvasTexture,ci=Ee.BufferGeometry,ra=Ee.Float32BufferAttribute,na=Ee.LineBasicMaterial,sa=Ee.LineLoop,ca=Ee.DoubleSide,la=Ee.Mesh,da=Ee.NoToneMapping,pa=Ee.PerspectiveCamera,ga=Ee.PlaneGeometry,ua=Ee.Raycaster,ha=Ee.Scene,fa=Ee.ShaderMaterial,Wt=Ee.SRGBColorSpace,ma=Ee.TextureLoader,vt=Ee.Vector2,ba=Ee.WebGLRenderer});var nr,xt,ya=ee(async()=>{nr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),xt=nr.default});var sr,di,va=ee(async()=>{sr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),di=sr.CustomEase});function xa(t,e,a=64){let o=t/e,i=new ga(t,t*9/16,a,1),r=i.attributes.position,s=i.attributes.uv;for(let c=0;c<r.count;c++){let n=(s.getX(c)-.5)*e;r.setX(c,o*Math.sin(n)),r.setZ(c,o*(Math.cos(n)-1))}return i.computeVertexNormals(),i.computeBoundingSphere(),i}function wa(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var pi=ee(async()=>{await li()});function wt(t,e){let a=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*a,panelArc:t.radiansPerSlide*a,height:t.slotHeight*a}}function Ot(t,{radius:e,pitch:a,radiansPerSlide:o}){let i=t*o;return{x:Math.sin(i)*e,y:-t*a,z:(Math.cos(i)-1)*e,angle:i,taper:1,shade:(1-Math.cos(i))/2*.58}}function ka(t,e){let a=wt(t,e);return xa(a.cardWidth,a.panelArc)}function gi(t,e=64){let a=[];for(let o=0;o<=e;o++){let i=(o/e-.5)*t.radiansPerSlide;a.push(t.radius*Math.sin(i),t.slotHeight/2,t.radius*(Math.cos(i)-1))}for(let o=e;o>=0;o--){let i=(o/e-.5)*t.radiansPerSlide;a.push(t.radius*Math.sin(i),-t.slotHeight/2,t.radius*(Math.cos(i)-1))}return a}var Nt=ee(async()=>{await pi()});function ui(t,e){let a=ka(t,e);return a.scale(1,1/t.aspect/(9/16),1),a.computeVertexNormals(),a.computeBoundingSphere(),a}function Sa(t,e,a,o,i){let r=Math.min(t,e)*Math.min(40,Math.max(0,i))/100,s=t-2*r,c=e-2*r,n=s/c,u=o==="fit"?Math.max:Math.min,f=u(1,n/a),m=u(1,a/n);return{contentWidth:s,contentHeight:c,uvScaleX:f,uvScaleY:m,imageWidth:s/f,imageHeight:c/m,padding:r}}var Ca=ee(async()=>{await Nt();await Nt()});function hi({stageWidth:t,stageHeight:e,spiralWidthPercent:a,cardWidth:o,aspect:i,rise:r,riseUnit:s}){let c=Math.max(1,t*a/200),n=Math.max(1,Math.min(o,c*Math.PI/3,e*.4*i)),u=Math.PI*2*c/n,f=s==="percent"?e*r/100:r*Math.min(1,t/640);return{radius:c,slotWidth:n,slotHeight:n/i,aspect:i,pitch:Math.max(n/i*1.25/u,f),radiansPerSlide:n/c,cardsPerTurn:Math.PI*2*c/n}}var Ma=ee(()=>{});function Pa(t,e,a){let o=e.radius*2.4,i=o/(o+2*e.radius),r=Math.ceil((a/(2*i)+e.slotHeight/2)/e.pitch)+2,s=Math.floor(t);return{first:s-r,last:s+r,count:r*2+1}}function Ea(t,e,a){let o=t*e.radiansPerSlide,i=o-a.panelArc/2,r=o+a.panelArc/2,s=Math.PI*2,c=S=>Math.ceil((i-S)/s)<=Math.floor((r-S)/s),n=c(0)?1:Math.max(Math.cos(i),Math.cos(r)),u=c(Math.PI)?-1:Math.min(Math.cos(i),Math.cos(r)),f=e.radius*2.4,m=f/(f+e.radius*(1-n)),w=f/(f+e.radius*(1-u)),x=-t*e.pitch,d=x+a.height/2,y=x-a.height/2;return{minY:Math.min(y*m,y*w),maxY:Math.max(d*m,d*w)}}function za(t,e){let a=Math.min(80,e*.08),o=r=>Math.max(0,Math.min(1,r)),i=Math.min(o((e/2-t.minY)/a),o((t.maxY+e/2)/a));return i*i*(3-2*i)}function La(t,e,a,o){let i=a-e;return Math.abs(i)>o/2&&(i-=Math.round(i/o)*o),t+i}var Aa,ja=ee(async()=>{await Nt();Ma();Aa=(t,e)=>(t%e+e)%e});var Ta,Ia=ee(()=>{Ta=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function qa(t,{textureSource:e=a=>a.querySelector("img").src}={}){let{root:a,stage:o}=t,i;try{i=new ba({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return a.dataset.renderer="css-fallback",()=>{delete a.dataset.renderer}}i.outputColorSpace=Wt,i.toneMapping=da,i.setClearColor(0,0);let r=i.domElement;r.style.removeProperty("display"),r.className="orbit-webgl",r.setAttribute("aria-hidden","true"),o.append(r);let s=new ha,c=new pa,n=new ua,u=new vt,f=new AbortController,m=(B,J,V)=>B.addEventListener(J,V,{signal:f.signal}),w=t.render,x=t.pointerDown,d=new Map,y=new Map;function S(){for(let B of t.cards){let J=y.get(B);if(J?.image!==B.artwork&&(J?.dispose(),y.delete(B),B.artwork)){let V=new oa(B.artwork);V.colorSpace=Wt,y.set(B,V)}}}let v=[],h,b,D=t.position,z=t.position,M="",C=!1,q=!1,U=null,_=null,I=!1,p=!1;a.dataset.renderer="loading-webgl";let A=()=>hi({stageWidth:o.clientWidth,stageHeight:o.clientHeight,spiralWidthPercent:Number(a.dataset.spiralWidth),cardWidth:Number(a.dataset.cardWidth),aspect:Number(a.dataset.cardAspect),rise:Number(a.dataset.rise),riseUnit:a.dataset.riseUnit}),N=()=>{let B=t.cards[0],J=new fa({uniforms:{screenshot:{value:d.get(e(B))},dimensions:{value:new vt},contentDimensions:{value:new vt(1,1)},imageScale:{value:new vt(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:lr,fragmentShader:dr,transparent:!0,side:ca,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),V=new la(h,J),Z=new sa(b,new na({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),re={card:B,mesh:V,guide:Z,material:J,surface:{scale:0,target:0}};V.userData.panel=re,v.push(re),s.add(V,Z)},F=B=>{let J=Pa(D,B,o.clientHeight);for(;v.length<J.count;)N();for(;v.length>J.count;){let V=v.pop();s.remove(V.mesh,V.guide),V.material.dispose(),V.guide.material.dispose()}v.forEach((V,Z)=>{V.offset=J.first+Z-D,V.card=t.cards[Aa(J.first+Z,t.count)],V.material.uniforms.screenshot.value=y.get(V.card)||d.get(e(V.card))})},X=()=>{let B=o.clientWidth,J=o.clientHeight,V=A(),Z=Number(a.dataset.slotGap||3);F(V);let re=wt(V,Z),{cardWidth:O,panelArc:Y}=re,{radius:ne}=V;a.dataset.slotMetrics=JSON.stringify({...V,cardArc:Y,cardWidth:O,cardHeight:re.height,gap:Z,imageFit:a.dataset.imageFit,imagePadding:Number(a.dataset.imagePadding||0)}),v.forEach(pe=>{pe.material.uniforms.dimensions.value.set(O,re.height);let ye=pe.material.uniforms;ye.cornerRadius.value=Math.min(Number(a.dataset.cornerRadius)||0,O/2,re.height/2),ye.borderWidth.value=Number(a.dataset.borderWidth)||0,ye.solidBack.value=a.dataset.backFace==="solid",ye.showImage.value=!!pe.card.artwork||a.dataset.showImage!=="false";for(let te of["backColor","borderColor","imageTint","mirrorColor"]){let be=ye[te],ae=te==="imageTint"&&pe.card.artwork?"#00000000":a.dataset[te]||"#00000000";if(be.hex!==ae){be.hex=ae;let Ae=ae.length===7?ae+"ff":ae;be.value=[1,3,5,7].map(ge=>parseInt(Ae.slice(ge,ge+2),16)/255)}}let we=pe.material.uniforms.screenshot.value.image;if(!we)return;let ke=Sa(O,re.height,(we.naturalWidth||we.width)/(we.naturalHeight||we.height),pe.card.artwork?"fit":a.dataset.imageFit,pe.card.artwork?0:Number(a.dataset.imagePadding||0));pe.material.uniforms.contentDimensions.value.set(ke.contentWidth,ke.contentHeight),pe.material.uniforms.imageScale.value.set(ke.uvScaleX,ke.uvScaleY)});let K=Math.min(window.devicePixelRatio||1,2),ce=`${B}:${J}:${O}:${Y}:${re.height}:${ne}:${K}`;if(ce===M||!B||!J)return;M=ce,i.setPixelRatio(K),i.setSize(B,J,!1),c.position.set(0,0,ne*2.4),c.fov=wa(J,c.position.z),c.aspect=B/J,c.near=.1,c.far=ne*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let ue=h;h=ui(V,Z);let se=b;b=new ci,b.setAttribute("position",new ra(gi(V),3)),v.forEach(pe=>{pe.mesh.geometry=h,pe.guide.geometry=b,pe.material.uniforms.dimensions.value.set(O,re.height)}),ue?.dispose(),se?.dispose()},W=()=>{if(!C||q||I||p||!t.geometry)return;p=!0,D=La(D,z,t.position,t.count),z=t.position,X();let B=A(),J=wt(B,Number(a.dataset.slotGap||3)),V=a.dataset.focusMode==="keyboard"&&a.contains(document.activeElement),Z=0;v.forEach(O=>{let{card:Y,mesh:ne,material:K}=O,ce=Ot(O.offset,B),ue=Ea(O.offset,B,J),se=za(ue,o.clientHeight),pe=a.dataset.edgeMode==="preset"?se:+(se>0),ye=V&&Y===t.cards[t.active]&&Math.abs(O.offset)<.5;K.polygonOffsetUnits=Math.abs(O.offset)*8,ne.position.set(ce.x,ce.y,ce.z),ne.rotation.y=ce.angle;let we=O===U&&!t.pointer&&!t.reducedMotion.matches,ke=Number(a.dataset.hoverAmount)||0,te=we?1:0;O.surface.target!==te&&(O.surface.target=te,xt.to(O.surface,{scale:te,duration:(Number(a.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:W})),ne.scale.setScalar(a.dataset.hoverEffect==="zoom"?1+O.surface.scale*ke/100:1),a.dataset.hoverEffect==="lift"&&(ne.position.y+=O.surface.scale*ke),ne.visible=pe>.001&&!!K.uniforms.screenshot.value.image,ne.visible&&Z++,O.guide.position.copy(ne.position),O.guide.rotation.copy(ne.rotation),O.guide.visible=a.dataset.showSlots==="true"&&ne.visible,O.guide.material.opacity=pe*.42,K.uniforms.fade.value=pe,K.uniforms.shade.value=ce.shade,K.uniforms.focused.value=ye?1:0});let re=JSON.stringify({cardsPerTurn:B.cardsPerTurn,visibleCount:Z,poolCount:v.length,stageWidth:o.clientWidth,stageHeight:o.clientHeight,cardWidth:J.cardWidth,cardHeight:J.height,pitch:B.pitch,radius:B.radius,uniqueCount:t.count});a.dataset.responsiveMetrics!==re&&(a.dataset.responsiveMetrics=re),_&&!t.pointer&&(U=j(_)),s.updateMatrixWorld(!0),i.render(s,c),p=!1},j=B=>{if(!C||I)return null;let J=r.getBoundingClientRect();u.set((B.clientX-J.left)/J.width*2-1,-(B.clientY-J.top)/J.height*2+1),n.setFromCamera(u,c);for(let V of n.intersectObjects(v.map(Z=>Z.mesh))){let Z=V.object.userData.panel;if(!V.object.visible||Z.material.uniforms.fade.value<=.25)continue;let{x:re,y:O}=Z.material.uniforms.dimensions.value,Y=Z.material.uniforms.cornerRadius.value,ne=Math.abs((V.uv.x-.5)*re)-re/2+Y,K=Math.abs((V.uv.y-.5)*O)-O/2+Y;if(!(Math.hypot(Math.max(ne,0),Math.max(K,0))+Math.min(Math.max(ne,K),0)>Y))return Z.hitUv=V.uv,Z}return null};t.render=function(){w.call(this),W()},t.pointerDown=function(B){if(x.call(this,B),C&&!I&&this.pointer?.id===B.pointerId){let J=j(B);this.pointer.card=J?.card||null;let V=J?.card.buttonBounds,Z=J?.hitUv;V&&Z.x>=V.left&&Z.x<=V.right&&1-Z.y>=V.top&&1-Z.y<=V.bottom&&(this.pointer.buttonLink=J.card.dataset.buttonLink)}_=null,U=null},m(o,"pointermove",B=>{_=B.pointerType==="mouse"?{clientX:B.clientX,clientY:B.clientY}:null,U=B.pointerType==="mouse"&&!t.pointer?j(B):null,r.style.cursor=t.pointer?.dragging?"grabbing":U?"pointer":"grab",W()}),m(o,"pointerleave",()=>{_=null,U=null,W()}),m(o,"pointerup",()=>{U=null,W()}),m(a,"focusin",W),m(a,"focusout",()=>queueMicrotask(W)),m(document,"keydown",()=>queueMicrotask(W)),m(document,"pointerdown",()=>queueMicrotask(W)),m(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&v.forEach(({surface:B})=>{xt.killTweensOf(B),B.scale=B.target}),W()}),m(a,"playground-change",()=>{S(),W()}),m(a,"artwork-change",()=>{S(),W()}),m(a,"slot-guides-change",W),m(r,"webglcontextlost",B=>{B.preventDefault(),I=!0,a.classList.remove("has-webgl-carousel"),a.dataset.renderer="css-fallback"}),m(r,"webglcontextrestored",()=>{I=!1,C&&(a.classList.add("has-webgl-carousel"),a.dataset.renderer="webgl",W())});let P=new ResizeObserver(()=>W());P.observe(o);let R=new ma,E=!1,$=()=>{q||(E=!0,C=!1,a.classList.remove("has-webgl-carousel"),a.dataset.renderer="css-fallback")};for(let B of t.cards){let J=e(B);if(d.has(J))continue;let V=R.load(J,W,void 0,$);V.colorSpace=Wt,V.anisotropy=Math.min(8,i.capabilities.getMaxAnisotropy()),d.set(J,V)}return E||(h=ui(A(),Number(a.dataset.slotGap||3)),b=new ci,C=!0,a.classList.add("has-webgl-carousel"),a.dataset.renderer="webgl",W()),()=>{q=!0,f.abort(),P.disconnect(),t.render=w,t.pointerDown=x,a.classList.remove("has-webgl-carousel"),delete a.dataset.renderer,v.forEach(({material:B,surface:J,guide:V})=>{xt.killTweensOf(J),B.dispose(),V.material.dispose()}),y.forEach(B=>B.dispose()),h?.dispose(),b?.dispose(),d.forEach(B=>B.dispose()),i.dispose(),i.forceContextLoss(),r.remove()}}var En,lr,dr,Ra=ee(async()=>{await li();await ya();await va();await pi();await Ca();await ja();xt.registerPlugin(di);En=di.create("portfolio-surface",".2,.75,.25,1"),lr=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,dr=`
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
`});var Ba=ee(()=>{(()=>{"use strict";let t=Math.PI*2,e=(r,s)=>(r%s+s)%s,a=(r,s,c)=>Math.min(c,Math.max(s,r));class o{constructor(s){this.root=s,this.stage=s.querySelector(".orbit-stage"),this.cards=[...s.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,n)=>{c.dataset.slideIndex=n;let u=c.cloneNode(!0);u.dataset.repeat="true",u.tabIndex=-1,u.setAttribute("aria-hidden","true"),u.removeAttribute("aria-pressed"),c.parentElement.append(u),this.visualCards.push(u)}),!(!this.count||!this.stage)&&(this.title=s.querySelector(".orbit-title"),this.description=s.querySelector(".orbit-description"),this.status=s.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(s,this.cards),this.pagination=s.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((s,c)=>{let n=document.createElement("button");return n.type="button",n.className="orbit-dot",n.setAttribute("aria-label",`Show ${s.dataset.title||`screenshot ${c+1}`}`),n.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(n),n}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(s=>{s.disabled=!0})}bindEvents(){let s=(c,n,u,f={})=>c.addEventListener(n,u,{...this.options,...f});s(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),s(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),s(this.stage,"keydown",c=>{let n={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in n?(c.preventDefault(),this.step(n[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),s(this.stage,"pointerdown",c=>this.pointerDown(c)),s(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),s(this.stage,"pointerup",c=>this.pointerUp(c)),s(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),s(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),s(this.stage,"dragstart",c=>c.preventDefault()),s(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),s(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let n=c.target.closest(".orbit-card");n&&this.openProject(Number(n.dataset.slideIndex))}),s(this.stage,"focusin",c=>{let n=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&n>=0&&n!==this.active&&this.goTo(n)}),s(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),s(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(s=>{let c=s.querySelector(".orbit-surface"),n=c.querySelector("img"),u=Array.from({length:this.segmentCount},(f,m)=>{let w=document.createElement("span");return w.className="orbit-strip",w.setAttribute("aria-hidden","true"),w.dataset.stripIndex=m,w.style.backgroundImage=`url("${n.src}")`,c.append(w),w});return s.classList.add("is-curved"),{card:s,strips:u}})}measure(){let s=this.stage.clientWidth,c=this.stage.clientHeight,n=s<=700;this.cards[0].style.removeProperty("width");let u=this.cards[0].offsetWidth,f=t/8,m=f*.88,w=u/m;this.geometry={radius:w,panelArc:m,cardWidth:u,pitch:a(c/13,36,52),halfWindow:6.5,radiansPerSlide:f,dragUnitX:Math.max(85,s*(n?.32:.18)),dragUnitY:a(c*.13,65,105)},this.stage.style.perspective=`${(w*2.4).toFixed(3)}px`;let x=m/this.segmentCount,d=2*w*Math.sin(x/2),y=u*9/16;this.panels.forEach(({card:S,strips:v})=>{S.style.width=`${u}px`,v.forEach((h,b)=>{let D=-m/2+(b+.5)*x,z=w*Math.sin(D),M=w*(Math.cos(D)-1);h.style.width=`${(d+.6).toFixed(4)}px`,h.style.backgroundSize=`${u}px ${y}px`,h.style.backgroundPosition=`${(-b*u/this.segmentCount).toFixed(4)}px 0px`,h.style.transform=`translateX(-50%) translate3d(${z.toFixed(4)}px, 0px, ${M.toFixed(4)}px) rotateY(${(D*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:s,pitch:c,halfWindow:n,radiansPerSlide:u}=this.geometry;this.visualCards.forEach(m=>{let w=Number(m.dataset.slideIndex),x=e(w-this.position+this.count/2,this.count)-this.count/2;m.dataset.repeat&&(x+=x<0?this.count:-this.count);let d=x*u,y=Math.cos(d),S=Math.sin(d),v=(1-y)/2,h=1-x/n*.11,b=S*s*h,D=x*c,z=y*s*h-s,M=d*180/Math.PI,C=a((n-Math.abs(x))/.65,0,1);m.style.transform=`translate(-50%, -50%) translate3d(${b.toFixed(3)}px, ${D.toFixed(3)}px, ${z.toFixed(3)}px) rotateY(${M.toFixed(3)}deg) scale(${h.toFixed(4)})`,m.style.zIndex="auto",m.style.setProperty("--orbit-shade",String(v*.58)),m.style.setProperty("--orbit-fade",String(C)),m.style.opacity="1",m.style.visibility=C>0?"visible":"hidden",m.style.pointerEvents=C>.25?"auto":"none",m.toggleAttribute("data-gc-back-facing",y<0),m.dataset.offset=x.toFixed(5)});let f=e(Math.round(this.position),this.count);f!==this.active&&this.updateActive(f)}updateActive(s){let c=this.visualCards.includes(document.activeElement);this.active=s,this.cards.forEach((n,u)=>{let f=u===s;n.classList.toggle("is-centered",f),n.tabIndex=f?0:-1,n.setAttribute("aria-pressed",String(f)),this.dots[u].setAttribute("aria-current",String(f))}),this.title&&(this.title.textContent=this.cards[s].dataset.title||""),this.description&&(this.description.textContent=this.cards[s].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[s].dataset.title}, project ${s+1} of ${this.count}`),c&&!this.pointer&&this.cards[s].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(s)}goTo(s){let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(s){this.animateTo(Math.round(this.target)+s)}animateTo(s,c=0){if(this.target=Math.round(s),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(s){this.frame=0;let c=Math.min((s-this.lastTime)/1e3,.032);this.lastTime=s;let n=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=n*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(s){if(this.viewer.dialog.open||!Number.isInteger(s)||!this.cards[s])return;let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(s)}pointerDown(s){if(!s.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}s.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:s.pointerId,x:s.clientX,y:s.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:s.target.closest(".orbit-card")},this.stage.setPointerCapture(s.pointerId))}pointerMove(s){let c=this.pointer;if(!c||c.id!==s.pointerId)return;let n=s.clientX-c.x,u=s.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(n),Math.abs(u))<6)return;if(s.pointerType==="touch"&&Math.abs(n)<=Math.abs(u)){c.card=null;return}c.axis=Math.abs(u)>Math.abs(n)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}s.preventDefault();let f=c.axis==="x"?s.clientX:s.clientY,m=c.axis==="x"?n:u,w=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,x=s.pointerType==="touch"?a(w*.38,32,48):w,d=performance.now(),y=Math.max(8,d-c.lastTime),S=-(f-c.lastCoordinate)/x/y*1e3;c.speed=c.speed*.35+S*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=f,c.travel=m,this.position=c.startPosition-m/x,this.render()}pointerUp(s,c=!1){let n=this.pointer;if(!n||n.id!==s.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(n.id)&&this.stage.releasePointerCapture(n.id),!n.dragging){if(this.animateTo(Math.round(this.position)),!c&&n.buttonLink){location.assign(n.buttonLink);return}!c&&n.card&&this.openProject(Number(n.card.dataset.slideIndex));return}let u=c||performance.now()-n.lastMovement>90?0:a(n.speed,-10,10),f=Math.round(this.position+(this.reducedMotion.matches?0:u*(s.pointerType==="touch"?.32:.2))),m=this.position-n.startPosition;!c&&Math.abs(n.travel)>18&&Math.abs(m)>.12&&f===Math.round(n.startPosition)&&(f+=Math.sign(m)),this.animateTo(f,u)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:s,strips:c})=>{c.forEach(n=>n.remove()),s.classList.remove("is-curved"),s.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(s=>s.dataset.repeat).forEach(s=>s.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function i(r=document){r.querySelectorAll("[data-spiral-carousel]").forEach(s=>{s.spiralCarousel||(s.spiralCarousel=new o(s))})}window.SpiralCarousel={init:i},i()})()});var Da,Fa=ee(()=>{Da=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Wa,Ha=ee(()=>{Wa=`.project-dialog {
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
`});var Na,Oa=ee(()=>{Na=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var Ga={};Ei(Ga,{mountSpiral:()=>br,spiralControls:()=>yt,spiralDefaults:()=>Ve});function fi(t,e,a){for(let o of $a)t.removeAttribute(o);for(let[o,i]of Object.entries(e.imageAttrs||{}))$a.has(o)&&i!=null&&t.setAttribute(o,String(i));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&a?.(t)}function mi(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function br(t){let{host:e,onChange:a=()=>{},loadImage:o}=t,i=t.items.filter(P=>P.src||P.title||P.description||P.link),r={...Ve,...t.options},s=!1;if(!i.length){let P=document.createElement("p");return P.className="gc-spiral-empty",P.textContent="Add content to this source to preview the spiral.",e.append(P),{destroy(){P.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let n=document.createElement("div");n.className="orbit-carousel spiral-carousel slot-carousel",n.dataset.spiralCarousel="",n.id=`gc-spiral-${++fr}`,n.setAttribute("role","region"),n.setAttribute("aria-label","Spiral gallery"),n.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let u=n.querySelector(".orbit-stage"),f=n.querySelector(".orbit-ring"),m=n.querySelector("[data-orbit-toggle]");Xe(n.querySelector("[data-orbit-prev]"),"previous"),Xe(n.querySelector("[data-orbit-next]"),"next"),Xe(m,"playback");let w=n.querySelector(".gc-spiral-caption"),x=document.createElement("div");x.className="gc-spiral-caption-space",w.before(x),x.append(w);let d=i.some(P=>!!P.title);for(let P of new Set(i.map(R=>R.title).filter(Boolean))){let R=w.cloneNode(!1);R.setAttribute("aria-hidden","true"),R.classList.add("gc-spiral-caption-measure"),R.textContent=P,x.append(R)}let y=document.createElement("div");y.className="gc-item-details",x.after(y);let S=i.map(P=>{let R=document.createElement("div");R.className="gc-item-detail";let E=document.createElement("p");E.className="gc-item-description",E.textContent=$t(P.description);let $=document.createElement("a"),B=mi(P.link);return B&&($.href=B),$.textContent=P.buttonLabel||"Open link",R.append(E,$),y.append(R),{group:R,body:E,link:$,href:B}}),v="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),h=[];i.forEach((P,R)=>{let E=document.createElement("button");E.className="orbit-card",E.type="button",E.dataset.title=P.title||"",E.dataset.imageSource=P.src||v,E.setAttribute("aria-label",P.title?`View ${P.title}`:`View image ${R+1}`);let $=document.createElement("span");$.className="orbit-surface";let B=document.createElement("img");P.src?fi(B,P):B.src=v,h.push(E),E.dataset.buttonLink=mi(P.link)||"",$.append(B),E.append($),f.append(E)}),c.append(n),e.append(c);let b=new Map,D=0,z="";async function M(){let P=JSON.stringify(r);if(z===P)return;z=P;let R=++D,E=i.some(Y=>Ft(Y,r));if(n.dataset.composite=String(E),!E){for(let[Y,ne]of h.entries())if(ne.artwork=null,ne.buttonBounds=null,ne.hasAttribute("data-artwork")){for(let K of f.querySelectorAll('[data-slide-index="'+Y+'"] img'))K.src=i[Y].src||v;ne.removeAttribute("data-artwork")}return}let $=Y=>!Y||!r.showImage?null:(b.has(Y)||b.set(Y,new Promise(ne=>{let K=new Image;K.crossOrigin="anonymous",K.onload=()=>ne(K),K.onerror=()=>ne(null),K.src=Y})),b.get(Y));if(await new Promise(requestAnimationFrame),s||R!==D)return;let B=await Promise.all(i.map(async Y=>({item:{...Y,plain:$t(Y.description)},image:await $(Y.src)})));if(s||R!==D)return;let J=r.typeSource==="native"?e.closest(".user-items-list-section"):null,V=getComputedStyle(J?.querySelector(".list-item-content__title")||w),Z=getComputedStyle(J?.querySelector(".list-item-content__description p")||S[0].body),re=getComputedStyle(e).color,O=Zi(B,r,{family:V.fontFamily,bodyFamily:Z.fontFamily,ink:re,titleSize:parseFloat(V.fontSize)||16,titleWeight:V.fontWeight,size:parseFloat(Z.fontSize)||16,weight:Z.fontWeight,accent:getComputedStyle(m).color,buttonInk:getComputedStyle(m).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(m).backgroundColor});O.forEach(({canvas:Y,buttonBounds:ne},K)=>{if(h[K].artwork=Y,h[K].buttonBounds=ne,h[K].setAttribute("data-artwork",""),n.dataset.renderer!=="webgl"){let ce=Y.toDataURL();for(let ue of n.querySelectorAll('.orbit-card[data-slide-index="'+K+'"] img'))ue.src=ce}}),f.querySelectorAll("[data-repeat]").forEach(Y=>{let ne=h[Number(Y.dataset.slideIndex)];Y.buttonBounds=ne?.buttonBounds}),n.dataset.cardAspect=String(O[0].aspect),n.style.setProperty("--gc-art-aspect",O[0].aspect),n.dispatchEvent(new Event("artwork-change"))}let C=zt(c,n.id),q=()=>{let P=r.textPlacement==="card",R=i.some(E=>Ft(E,r));C({...r,shadowEnabled:r.shadowEnabled&&!R,imageTint:r.overlayEnabled&&!R?r.imageTint:"#00000000"}),r.titleCustom?e.dataset.gcTitlePalette=r.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),x.style.textAlign=r.titleAlign,c.style.setProperty("--gc-card-inset",r.carouselPadding+"px"),n.style.padding=r.carouselPadding+"px",n.style.overflow=r.surfaceRadius?"hidden":"",n.style.borderRadius=r.surfaceRadius+"px",n.style.backgroundColor=r.surfaceEnabled?r.surfaceColor:"",n.style.setProperty("--gc-hover-time",r.hoverDuration+"ms"),n.dataset.hoverDuration=r.hoverDuration,n.dataset.mirrorColor=r.mirrorOverlay?r.mirrorColor:"#00000000",n.dataset.playbackMode=r.playbackMode,n.dataset.rate=r.cardsPerMinute,n.dataset.interval=r.duration,n.dataset.direction=r.direction,n.dataset.pauseOnHover=String(r.pauseOnHover),n.dataset.customControlSize=String(!!(r.controlPadding||r.controlIconSize)),n.dataset.hideControlBackground=String(!r.controlBackground),n.style.setProperty("--gc-icon-size",r.controlIconSize?r.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),n.style.setProperty("--gc-button-padding",r.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let E of x.children)E.style.textAlign=r.titleCustom?r.titleAlign:"",E.style.marginBottom=r.titleGap?r.titleGap+"px":"";for(let{body:E,link:$}of S)E.style.textAlign=r.bodyCustom?r.descriptionAlign:"",E.style.fontWeight=r.bodyCustom?r.descriptionWeight:"",E.style.color=r.bodyCustom&&r.descriptionCustom?r.descriptionColor:"inherit",E.style.fontSize=r.bodyCustom&&r.descriptionSize?r.descriptionSize+"rem":"",$.style.marginTop=r.buttonGap+"px";n.dataset.showImage=String(r.showImage!==!1),n.dataset.imageTint=r.overlayEnabled?r.imageTint:"#00000000",n.dataset.hoverEffect=r.reducedMotion?"none":r.hoverEffect,n.dataset.hoverAmount=r.hoverAmount;for(let[E,{body:$,link:B,href:J}]of S.entries())$.hidden=!r.showDescription||!$.textContent,B.hidden=!r.showButton||!J||!i[E].buttonLabel;y.hidden=P||S.every(({body:E,link:$})=>E.hidden&&$.hidden),n.dataset.edgeMode=r.edgeMode,n.dataset.backFace=r.backFace,n.dataset.cornerRadius=r.spiralRadius,n.dataset.borderWidth=r.cardBorderEnabled?r.borderWidth:0,n.dataset.borderColor=r.spiralRim,n.dataset.backColor=r.backColor,n.style.setProperty("--orbit-card-radius",r.spiralRadius+"px"),n.style.setProperty("--orbit-rim",r.spiralRim),c.style.width=`${Ke(r.containerWidth,100,20,100)}%`,u.style.height=r.heightMode==="viewport"?Ke(r.viewportHeight,65,15,100)+"vh":r.heightMode==="auto"?"clamp(160px,calc("+r.cardWidth+"px + "+r.spiralRise*4+"px),90svh)":Ke(r.stageHeight,680,120,1600)+"px",n.style.setProperty("--orbit-card-width",`${Ke(r.cardWidth,280,80,720)}px`),n.dataset.spiralWidth=String(Ke(r.spiralWidth,87,20,100)),n.dataset.cardWidth=String(Ke(r.cardWidth,280,80,720)),n.dataset.rise=String(Ke(r.spiralRise,52,r.spiralRiseUnit==="percent"?1:8,r.spiralRiseUnit==="percent"?50:500)),n.dataset.riseUnit=r.spiralRiseUnit==="percent"?"percent":"px",(!h[0].artwork||!i.some(E=>Ft(E,r)))&&(n.dataset.cardAspect=String(mr(r.aspectRatio))),n.dataset.imageFit=r.fit==="contain"||r.fit==="fit"?"fit":"fill",n.dataset.imagePadding=String(Ke(r.imagePadding,0,0,20)),n.dataset.slotGap=String(Ke(r.spiralGap,3,0,16)),n.dataset.showSlots=String(!!r.showSlots),x.hidden=P||!r.showTitles||!d,M(),n.classList.toggle("gc-spiral-reduced",!!r.reducedMotion)};q();let U=i.map(P=>({title:P.title||"",category:"",description:$t(P.description),services:[],notes:[],gallery:[{file:P.src||v,label:"Image"}]}));class _ extends Dt{constructor(R,E){super(R,E,U),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(R){let E=i[R];if(!E||r.clickAction==="none"||r.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let $=mi(E.link);if(r.clickAction==="link"||r.clickAction==="source"){$&&location.assign($);return}if(E.postUrl){t.openPost(E,R);return}super.open(R);let B=this.dialog.querySelector(".project-title");B.hidden=!E.title||!r.popupTitle,B.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",B.id),this.dialog.querySelector(".project-summary").hidden=!r.popupDescription||!$t(E.description),this.dialog.querySelector(".project-gallery").hidden=!r.popupImage||!E.src,this.dialog.querySelector(".project-frame-label").hidden=!r.popupTitle,this.dialog.querySelector(".project-info").hidden=B.hidden&&this.dialog.querySelector(".project-summary").hidden&&!($&&r.popupButton),this.sourceLink.hidden=!$||!r.popupButton,$?(this.sourceLink.href=$,this.sourceLink.textContent=E.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!r.reducedMotion)}showFrame(R){super.showFrame(R);let E=U.indexOf(this.project),$=i[E];$?.src&&(fi(this.image,$,o),this.dialog.querySelectorAll(".project-thumbnail img").forEach(B=>fi(B,$,o)),this.dialog.querySelector(".project-frame-label").textContent=$.title||"")}}let I=window.ProjectViewer;window.ProjectViewer=_;try{hr.init(c)}finally{I===void 0?delete window.ProjectViewer:window.ProjectViewer=I}let p=n.spiralCarousel;n.querySelectorAll("img").forEach(P=>o?.(P));let A=()=>{for(let[P,R]of h.entries()){if(!R.artwork)continue;let E=R.artwork.toDataURL();for(let $ of f.querySelectorAll('[data-slide-index="'+P+'"] img'))$.src=E}};u.addEventListener("webglcontextlost",A,!0);let N=p.updateActive;p.updateActive=function(P){N.call(this,P),S.forEach(({group:R},E)=>{R.inert=E!==P,R.style.visibility=E===P?"visible":"hidden"}),this.status.textContent=`${i[P]?.title?`${i[P].title}, `:""}image ${P+1} of ${i.length}`,a(P)},p.updateActive(p.active);let F=p.animateTo;p.animateTo=function(P,R=0){r.reducedMotion?(this.target=Math.round(P),this.settleImmediately()):F.call(this,P,R)};let X=qa(p,{textureSource:P=>P.dataset.imageSource}),W=ia(n,p,{pauseOnHover:!1,interactionRestMs:0});function j(P){r.autoplay=!!P,p.manuallyPaused=!P||!!r.reducedMotion,p.resumeAt=0,m.disabled=!!r.reducedMotion||p.reducedMotion.matches||i.length<2,m.dataset.paused=String(p.manuallyPaused),m.setAttribute("aria-label",p.manuallyPaused?"Resume carousel":"Pause carousel"),p.syncAutoplay()}return j(!!r.autoplay),{update(P){let R=r;r={...r,...P},q(),p.measure(),n.dispatchEvent(new Event("playground-change")),n.dispatchEvent(new Event("slot-guides-change")),p.updateActive(p.active),(R.autoplay!==r.autoplay||R.reducedMotion!==r.reducedMotion)&&j(!!r.autoplay)},goTo(P){s||p.goTo(P)},setPlaying:j,getMetrics(){try{return JSON.parse(n.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return n.dataset.renderer||"loading"},destroy(){s||(s=!0,u.removeEventListener("webglcontextlost",A,!0),W(),X(),p.destroy(),c.remove())}}}var hr,fr,Ke,mr,$t,$a,Ua=ee(async()=>{Qi();Qt();ta();Bt();Ht();Ht();aa();await Ra();Ba();hr=window.SpiralCarousel,fr=0,Ke=(t,e,a,o)=>Number.isFinite(Number(t))?Math.max(a,Math.min(o,Number(t))):e,mr=t=>{if(typeof t=="number"&&t>0)return t;let[e,a]=String(t||"16:9").split(":").map(Number);return e>0&&a>0?e/a:16/9},$t=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},$a=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function _a(t){let{host:e}=t,a={...t.options},o=null,i=null,r=!1,s="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),Ua().then(()=>Ga).then(n=>{r||(c.remove(),i=n.mountSpiral({...t,options:a}),o!==null&&i.goTo?.(o))}).catch(n=>{r||(s="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",n))}),{update(n){a={...a,...n},i?.update?.(a)},goTo(n){o=n,i?.goTo?.(n)},setPlaying(n){a.autoplay=n,i?.setPlaying?.(n)},getStatus(){return i?.getStatus?.()??s},getMetrics(){return i?.getMetrics?.()??null},destroy(){r=!0,c.remove(),i?.destroy()}}}var Xa=ee(()=>{});function st(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let a=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(a.protocol)?a.href:""}catch{return""}}function Ut(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(a=>a.remove()),e.content.querySelectorAll("*").forEach(a=>{for(let o of[...a.attributes])(/^on/i.test(o.name)||o.name==="style"||o.name==="id")&&a.removeAttribute(o.name);if(a.hasAttribute("href")){let o=st(a.getAttribute("href"));o?a.setAttribute("href",o):a.removeAttribute("href")}}),e.innerHTML}function Va(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let a of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(a)&&(e[a]=t.getAttribute(a));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function kt(t,e){let a=Gt[e];if(!t||!a)return null;let o=t.closest(a);if(!o){let n=t.querySelectorAll(a);if(n.length!==1)return null;o=n[0]}let i=e==="list"?o:o.querySelector(":scope > .sqs-block-content");if(!i)return null;let r=n=>Array.from(i.querySelectorAll(n)).filter(u=>u.closest(a)===o&&(!u.closest(".gc-embed")||u.hasAttribute("data-gc-native-track")));if(e==="summary"){let n=r(".summary-block-wrapper");if(n.length!==1)return null;let u=r(".summary-item").filter(f=>n[0].contains(f)&&!f.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:o,originals:n,rows:u}}let s=e==="list"?".list-item":".slide",c=r(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=r(".sqs-gallery")),c.length===1){let n=Array.from(c[0].querySelectorAll(s)).filter(u=>u.closest(a)===o&&!u.hasAttribute("data-gc-repeat"));return{source:o,originals:c,rows:n}}if(e==="gallery"&&!c.length){let n=r(s);if(n.length&&n.every(u=>u.parentElement===n[0].parentElement))return{source:o,originals:n,rows:n}}return null}function gt(t,e,a=location.href){return(kt(t,e)?.rows||[]).map(i=>{let r=i.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let u=i.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),f=st(u?.getAttribute("href"),a);return{...Va(r),title:i.querySelector(".summary-title")?.textContent.trim()||r?.alt||"",description:Ut(i.querySelector(".summary-excerpt")?.innerHTML),link:f,postUrl:f,buttonLabel:"Read post"}}let s=i.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=Ut(i.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),n=i.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Va(r),title:s,description:c,link:st(n?.getAttribute("href"),a),buttonLabel:e==="list"&&n?.textContent.trim()||""}}).filter(i=>e==="summary"?!!i.link:e==="list"||!!(i.src||i.title||i.link))}function yr(t,e){let a=e==="list"?t.getAttribute("data-section-id"):t.id;if(!a?.trim())return"";let o=e==="list"?'section[data-section-id="'+CSS.escape(a)+'"]':"#"+CSS.escape(a);return t.ownerDocument.querySelectorAll(o).length===1?o:""}function Ya(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Gt).join(","))).filter(a=>!a.closest(".gc-embed")).flatMap(a=>{let o=a.matches(Gt.list)?"list":a.matches(Gt.summary)?"summary":"gallery",i=yr(a,o);if(!i||!kt(a,o))return[];let r=++e[o];return{name:(o==="list"?"List Section":o==="summary"?"Summary Block":"Gallery Block")+(r>1?" "+r:""),type:o,selector:i,root:a,items:gt(a,o)}})}function _t(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let a=t.ownerDocument.defaultView?.ImageLoader;if(a&&typeof a.load=="function")try{a.load(t,{load:!0})}catch(o){console.warn("Gallery Studio: native image loader",o)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Ja(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Ja(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function bi(t){let e=document.createElement("img");for(let[a,o]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(a)&&e.setAttribute(a,o);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Ja(t.imageAttrs?.["data-image-focal-point"]),e}var Gt,yi=ee(()=>{Gt={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function Ka(t,e,a){let o=new WeakMap,i=new WeakMap,r=Array.from(e.childNodes),s=a.map(S=>Array.from(S.childNodes)),c=[];function n(S,v){S&&c.push([S,v.map(h=>[h,S.getAttribute(h)])])}let u=new Set,f=!1;function m(){n(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let S of a)n(S,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),f=!0}function w(S,v,h,b,D){let z=a[v],M=u.has(v),C=M?z.cloneNode(!1):z,q=document.createElement("div");if(q.className="gc-card gc-native-card",q.tabIndex=0,q.setAttribute("role","group"),S.imageAttrs?.["data-image-focal-point"]){let[F,X]=S.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(F)&&Number.isFinite(X)&&q.style.setProperty("--gc-native-focus",F*100+"% "+X*100+"%")}let U=S.title||S.alt||`Item ${v+1}`;if(q.setAttribute("aria-label",U),M){C.removeAttribute("id"),C.setAttribute("data-gc-repeat","");for(let F of s[v])q.append(F.cloneNode(!0));q.querySelectorAll("[id]").forEach(F=>F.removeAttribute("id"))}else u.add(v),q.append(...s[v]);C.replaceChildren(q),o.set(q,C);let _=q.querySelector(".list-item-media"),I=q.querySelector(".list-item-content"),p=q.querySelector(".list-item-content__title"),A=q.querySelector(".list-item-content__description");if(!M){for(let F of[_,I])n(F,["class"]);for(let F of[p,A])n(F,["class","hidden"])}if(_?.classList.add("gc-card-media"),I?.classList.add("gc-card-copy"),b.typeSource!=="native"&&(p?.classList.add("gc-card-title"),A?.classList.add("gc-card-description")),p&&(!b.showTitles||h.caption===!1)&&(p.hidden=!0),A&&!h.description&&(A.hidden=!0),_&&!b.showImage&&(M||n(_,["hidden"]),_.hidden=!0),!b.showButton){let F=q.querySelector(".list-item-content__button-wrapper")||q.querySelector(".list-item-content__button");F&&(M||n(F,["hidden"]),F.hidden=!0)}h.thumbnail&&I&&(!S.title||h.caption===!1)&&!b.showDescription&&!b.showButton&&(M||n(I,["hidden"]),I.hidden=!0);let N=Array.from(q.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!M)for(let F of N)n(F,["tabindex"]);if(i.set(q,N.map(F=>[F,F.getAttribute("tabindex")])),b.clickAction!=="none"&&b.clickAction!=="source"&&(b.clickAction!=="link"||S.link)){let F=document.createElement("button");F.type="button",F.className="gc-native-action",F.tabIndex=-1,F.setAttribute("aria-label",(b.clickAction==="link"?"Open link for ":"Open ")+U),F.addEventListener("click",()=>D(S,v)),q.append(F),q.setAttribute("aria-keyshortcuts","Enter Space"),q.addEventListener("click",X=>{X.defaultPrevented||X.target.closest("a,button,input,select,textarea,label")||D(S,v)}),q.addEventListener("keydown",X=>{X.target!==q||!["Enter"," "].includes(X.key)||(X.preventDefault(),F.click())})}return q}function x(S){let v=S.tabIndex===0&&S.getAttribute("aria-hidden")!=="true";for(let[h,b]of i.get(S)||[]){let D=v?b:"-1";h.getAttribute("tabindex")!==D&&(D===null?h.removeAttribute("tabindex"):h.setAttribute("tabindex",D))}}function d(S){if(!f)return;let v=S!=="native";e.querySelectorAll(".list-item-content__title").forEach(h=>h.classList.toggle("gc-card-title",v)),e.querySelectorAll(".list-item-content__description").forEach(h=>h.classList.toggle("gc-card-description",v))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!f){a.forEach((S,v)=>S.replaceChildren(...s[v])),e.replaceChildren(...r);for(let[S,v]of c)for(let[h,b]of v)S.getAttribute(h)!==b&&(b===null?S.removeAttribute(h):S.setAttribute(h,b));t.after(e),c.length=0,u.clear(),f=!1}}return{track:e,begin:m,makeCard:w,slot:S=>o.get(S),syncFocus:x,setType:d,restore:y}}var Za=ee(()=>{});function Qa(t,e,a){if(!a.closest(".fluid-engine > .fe-block"))return()=>{};a.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let i=0,r=!1,s=new WeakSet,c=w=>{w&&!s.has(w)&&(s.add(w),u.observe(w))},n=()=>{!i&&!r&&(i=requestAnimationFrame(m))},u=new ResizeObserver(n),f=new MutationObserver(n);function m(){if(i=0,r||!e.isConnected)return;let w=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!w)return;let x=w.classList.contains("gc-carousel-stage"),d=w.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(w);let y=0;for(let v of d.children){if(v===w||v.contains(w))continue;c(v);let h=getComputedStyle(v);h.display==="none"||["absolute","fixed"].includes(h.position)||(y+=v.offsetHeight+(parseFloat(h.marginTop)||0)+(parseFloat(h.marginBottom)||0))}let S=Math.max(1,t.clientHeight-y);if(x){let v=w.parentElement;v.classList.contains("gc-block-stage-window")||(v=document.createElement("div"),v.className="gc-block-stage-window",w.before(v),v.append(w));let h=Math.min(1,S/Math.max(1,w.offsetHeight));v.style.height=S+"px",w.style.setProperty("--gc-block-scale",String(h)),w.style.setProperty("--gc-block-top",Math.max(0,(S-w.offsetHeight*h)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",S+"px")}return c(t),f.observe(e,{childList:!0,subtree:!0}),n(),()=>{r=!0,cancelAnimationFrame(i),u.disconnect(),f.disconnect(),a.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let w=e.querySelector(".gc-block-stage-window");if(w){let x=w.firstElementChild;x.style.removeProperty("--gc-block-scale"),x.style.removeProperty("--gc-block-top"),w.replaceWith(x)}}}var eo=ee(()=>{});function to(t,e,a,o){let i=a.ownerDocument,r=i.defaultView,s=o!=="list"?a.closest(".fluid-engine > .fe-block"):null;s?.classList.add("gc-viewport-cell");let c=[],n=s||a;for(let m=t.parentElement;m&&(["hidden","clip","auto","scroll"].includes(r.getComputedStyle(m).overflowX)&&c.push(m),m!==n);m=m.parentElement);function u(){let m=i.documentElement.clientWidth;if(!m||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let y=d.getBoundingClientRect().left+r.scrollX+d.clientLeft,S=y>.5||y+d.clientWidth<m-.5;d.classList.toggle("gc-viewport-unclip",S)}let w=-(t.getBoundingClientRect().left+r.scrollX),x=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};x("--gc-viewport-width",m+"px"),x("--gc-viewport-offset",w+"px")}u();let f=r.ResizeObserver?new r.ResizeObserver(u):null;return f?.observe(t),f?.observe(i.documentElement),r.addEventListener("resize",u),()=>{f?.disconnect(),r.removeEventListener("resize",u);for(let m of c)m.classList.remove("gc-viewport-unclip");s?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var io=ee(()=>{});var oo,ao=ee(()=>{oo=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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

.gc-stage.gc-finish[data-finish-padding]{box-sizing:border-box;padding:var(--finish-carousel-padding)}
.gc-stage.gc-finish[data-finish-surfaceenabled]{background:var(--finish-surface)!important;border-radius:var(--finish-surface-radius)}
.gc-stage.gc-finish[data-finish-cardbackground] .gc-card{background:var(--finish-card)!important}
.gc-stage.gc-finish[data-finish-cardshadow] .gc-card{box-shadow:var(--finish-card-shadow)}
.gc-stage.gc-finish[data-finish-card-padding] .gc-card{box-sizing:border-box;padding:var(--finish-card-padding)}
.gc-stage.gc-finish[data-finish-image-size] .gc-card-media{width:var(--finish-image-width)!important;margin-left:var(--finish-left)!important;margin-right:var(--finish-right)!important}
.gc-stage.gc-finish[data-finish-image-padding] .gc-card-media{box-sizing:border-box;padding:var(--finish-image-padding)}
.gc-stage.gc-finish[data-finish-imageborder] .gc-card-media img{box-sizing:border-box;border:var(--finish-image-border);border-radius:var(--finish-image-radius)!important}
.gc-stage.gc-finish:is([data-finish-shadowenabled],[data-finish-overlayenabled]) .gc-card-media img{filter:var(--gc-image-filter,none)}
.gc-stage.gc-finish[data-finish-shadowenabled] .gc-card-media{filter:var(--gc-shadow-filter,none)}
.gc-spatial .gc-card-copy .gc-card-button{pointer-events:auto}
.gc-stage.gc-finish[data-finish-crop] .gc-card-media{aspect-ratio:var(--finish-ratio);height:auto;flex:none}
.gc-stage.gc-finish[data-finish-crop] .gc-card-media::before{display:none}
.gc-stage.gc-finish[data-finish-crop] .gc-card-media img{aspect-ratio:var(--finish-ratio)}
.gc-stage.gc-finish[data-finish-circle] .gc-card-media{border-radius:50%;overflow:hidden}
.gc-stage.gc-finish[data-finish-title-align] :is(.gc-card-title,.list-item-content__title,.gc-ring-label){display:block;text-align:var(--finish-title-align)}
.gc-stage.gc-finish[data-finish-bodycustom] :is(.gc-card-description,.list-item-content__description,.list-item-content__description p){font-size:var(--gc-detail-size)!important;font-weight:var(--finish-description-weight)!important;color:var(--gc-detail-color)!important;text-align:var(--finish-description-align)!important}
.gc-stage.gc-finish[data-finish-order] .gc-card,.gc-stage.gc-finish[data-finish-align]:not(:has(.gc-preset-timed)) .gc-card{display:flex;flex-direction:column}
.gc-stage.gc-finish[data-finish-order] .gc-card-copy{order:var(--finish-order)}
.gc-stage.gc-finish[data-finish-align] .gc-card{justify-content:var(--finish-align)}
.gc-stage.gc-finish[data-finish-align] .gc-preset-timed .gc-card-copy{align-self:var(--finish-align)}
.gc-stage.gc-finish[data-finish-equal] .gc-carousel-card{align-self:stretch}
.gc-stage.gc-finish[data-finish-title-gap] :is(.gc-card-title,.list-item-content__title){display:block;margin-bottom:var(--finish-title-gap)!important}
.gc-stage.gc-finish[data-finish-button-gap] :is(.gc-card-button,.list-item-content__button-wrapper){display:block;margin-top:var(--finish-button-gap)!important}
.gc-stage.gc-finish[data-finish-media-gap] .gc-card:has(.gc-card-copy){display:flex;flex-direction:column;gap:var(--finish-media-gap)}
.gc-stage.gc-finish[data-finish-caption].gc-spatial .gc-spatial-card .gc-card-copy{max-height:100%;opacity:1}
.gc-stage.gc-finish[data-finish-icon] button.gc-transport>svg{width:var(--finish-icon);height:var(--finish-icon)}
.gc-stage.gc-finish[data-finish-button-padding] button.gc-transport{width:auto;height:auto;flex-basis:auto;padding:var(--finish-button-padding)}
.gc-stage.gc-finish[data-finish-clear-button] button.gc-transport{background:transparent;border-color:transparent}
@media(hover:hover) and (prefers-reduced-motion:no-preference){
 .gc-finish[data-gc-hover=zoom]:not([data-gc-still]) .gc-card-media img,.gc-finish[data-gc-hover=lift]:not([data-gc-still]) .gc-card{transition-duration:var(--finish-duration)}
 .gc-finish[data-gc-hover=zoom]:not([data-gc-still]) .gc-card:is(:hover,:focus-visible) .gc-card-media img{scale:var(--gc-hover-scale)}
 .gc-finish[data-gc-hover=lift]:not([data-gc-still]) .gc-card:is(:hover,:focus-visible){translate:0 calc(-1 * var(--gc-hover-rise))}
}
.gc-ring.gc-finish[data-finish-mirror] .gc-card[data-gc-back-facing] .gc-card-media::after{background:var(--finish-mirror);opacity:1}
.gc-stage.gc-finish[data-finish-original] .gc-card-media{aspect-ratio:var(--gc-original-ratio,auto)}
`});function ro(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let o=document.createElement("style");o.id="gc-finish-css",o.textContent=oo,document.head.append(o)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let a={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[o,i]of Object.entries(a))t.style.setProperty(o,i);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var vi,no=ee(()=>{ao();vi={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function Xt(t){t.setAttribute("data-lenis-prevent","");for(let e of["wheel","touchmove"])t.addEventListener(e,a=>a.stopPropagation(),{passive:!0})}var xi=ee(()=>{});function so(t,e){let a=t.classList.contains("gc-embed"),o=a&&e.colorSource==="section";o?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,a&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let i=t.style;i.setProperty("--gc-custom-background",e.background),i.setProperty("--gc-custom-ink",e.ink),i.setProperty("--gc-custom-accent",e.accent),i.setProperty("--gc-background",o?"var(--gc-section-surface)":e.background),i.setProperty("--gc-ink",o?"var(--gc-section-body)":e.ink),i.setProperty("--gc-accent",o?"var(--gc-section-action)":e.accent),i.setProperty("--gc-muted",o?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),i.setProperty("--gc-spatial-surface","var(--gc-background)"),i.setProperty("--gc-spatial-ink","var(--gc-ink)"),o&&(i.setProperty("--gc-line-color","var(--gc-section-line)"),i.setProperty("--gc-tint","var(--gc-section-body)")),i.background=o?"transparent":e.background,i.color=o?"var(--gc-section-body)":e.ink;for(let r of t.querySelectorAll(":scope > dialog"))co(t,r)}function co(t,e){for(let a of["gcColorSource","gcTypeSource"])t.dataset[a]?e.dataset[a]=t.dataset[a]:delete e.dataset[a]}function wi(t,e){Xt(e);let a=t.classList.contains("gc-embed")?t:t.ownerDocument.body;co(t,e),e.parentElement!==a&&a.append(e)}var lo=ee(()=>{xi()});var go,po=ee(()=>{go=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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

/* Closing or removing the last gallery modal releases the page automatically. */
:root:has(dialog:is(.gc-post-dialog,.gc-dialog,.gc-spiral-dialog):modal),
body:has(dialog:is(.gc-post-dialog,.gc-dialog,.gc-spiral-dialog):modal) {
  overflow: hidden !important;
  overscroll-behavior: none;
}
dialog:is(.gc-post-dialog,.gc-dialog,.gc-spiral-dialog) { overscroll-behavior: contain; }
`});var ho,uo=ee(()=>{ho=`.gc-post-dialog {
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
`});var mo,fo=ee(()=>{mo=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var yo,bo=ee(()=>{yo=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var xo,vo=ee(()=>{xo=`.gc-carousel {
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
`});var ko,wo=ee(()=>{ko=`.gc-spatial {
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
`});function Qe(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Vt(t,e){let a=Qe(e.preset??t.preset),o=a===Qe(t.preset)?t.stageHeight:a?0:590;return{...e.preset==="spiral"?Ve:{},...t,...e,stageHeight:e.stageHeight??o}}function So(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function Co(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[go,mo,yo,ho].join(`
`),document.head.append(e));let a=So(t);if(a==="common")return()=>{};let o=`gc-runtime-${a}-css`,i=document.getElementById(o);i||(i=document.createElement("style"),i.id=o,a==="carousel"?i.textContent=xo:a==="spatial"?i.textContent=ko:i.textContent=[Da,Ta,Wa,Na].join(`
`),e.after(i)),i.dataset.gcOwners=String(Number(i.dataset.gcOwners||0)+1);let r=!1;return()=>{if(r)return;r=!0;let s=Number(i.dataset.gcOwners)-1;s>0?i.dataset.gcOwners=String(s):i.remove()}}function Ar(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function Mo(t,e,a={},o=null){let i=Vt({...Ze,...mt(a.preset??Ze.preset,a)},a),r=null,s=null,c=null,n=null,u=0,f=0,m,w,x;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function d(){s&&(c?.destroy(),c=null,s.close(),s.remove(),s=null,r?.setSuspended?.(!1),n?.focus({preventScroll:!0}))}function y(p,A){if(i.clickAction==="none"||i.clickAction==="source"&&!p.link)return;if(i.clickAction==="link"||i.clickAction==="source"){let R=st(p.link);R&&window.open(R,"_blank","noopener,noreferrer");return}let N=document.activeElement;if(s&&d(),n=N,p.postUrl){c=Gi(p.postUrl,z(),d),s=c.dialog,S(),c.load();return}s=document.createElement("dialog"),s.className="gc-dialog"+(i.preset==="showcase"?" gc-dialog-drawer":""),s.setAttribute("aria-label",p.title||"Image preview");let F=document.createElement("button");F.className="gc-dialog-close",F.type="button",F.textContent="Close \xD7",F.addEventListener("click",d);let X=document.createElement("div");X.className="gc-dialog-content";let W=document.createElement("div");W.className="gc-dialog-media",p.src&&i.popupImage!==!1&&(W.append(bi(p)),X.append(W));let j=document.createElement("div");if(j.className="gc-dialog-copy",p.title&&i.popupTitle!==!1){let R=document.createElement("h2");R.textContent=p.title,j.append(R)}if(p.description&&i.popupDescription!==!1){let R=document.createElement("div");R.innerHTML=Ut(p.description),j.append(R)}if(p.link&&i.popupButton!==!1){let R=document.createElement("a");R.href=st(p.link),R.textContent=p.buttonLabel||"Open link",R.target="_blank",R.rel="noopener noreferrer",j.append(R)}let P=document.createElement("p");P.className="gc-dialog-count",P.textContent=`${A+1} / ${e.length}`,j.append(P),X.append(j),s.append(F,X),S(),_t(W.querySelector("img")),F.focus()}function S(){wi(t,s),s.showModal(),r?.setSuspended?.(!0),s.addEventListener("cancel",p=>{p.preventDefault(),d()}),s.addEventListener("click",p=>{if(p.target===s){let A=s.getBoundingClientRect();(p.clientX<A.left||p.clientX>A.right||p.clientY<A.top||p.clientY>A.bottom)&&d()}})}function v(p,A,N={}){if(N={...N,description:i.showDescription},o)return o.makeCard(p,A,N,i,y);let F=i.showButton&&p.buttonLabel&&st(p.link),X=!!F,W=document.createElement(X?"div":"button");X?(W.tabIndex=0,W.setAttribute("role","group")):W.type="button",W.className="gc-card",W.setAttribute("aria-label",p.title||`Image ${A+1}`);let j=document.createElement("span");j.className="gc-card-media",p.src&&i.showImage!==!1&&(j.append(bi(p)),W.append(j));let P=document.createElement("span");if(P.className="gc-card-copy",N.caption!==!1&&i.showTitles&&p.title){let E=document.createElement("span");E.className="gc-card-title",E.textContent=p.title,P.append(E)}if(N.description&&p.description){let E=document.createElement("span");E.className="gc-card-description",E.textContent=Ar(p.description),P.append(E)}if(X){let E=document.createElement("a");E.className="gc-card-button",E.href=F,E.textContent=p.buttonLabel,P.append(E)}P.childNodes.length&&W.append(P);let R=()=>{(i.clickAction!=="source"||!p.buttonLabel)&&y(p,A)};return W.addEventListener("click",E=>{E.target.closest("a")||R()}),X&&W.addEventListener("keydown",E=>{E.target===W&&["Enter"," "].includes(E.key)&&(E.preventDefault(),R())}),W}function h(p,A,N){let F=v(p,A,N);if(i.aspectRatio==="original"){let X=F.querySelector(".gc-card-media img");if(X){let W=(P,R)=>{P>0&&R>0&&F.style.setProperty("--gc-original-ratio",P+" / "+R)},j=X.dataset.imageDimensions?.split("x").map(Number);j?.length===2?W(...j):X.naturalWidth?W(X.naturalWidth,X.naturalHeight):X.addEventListener("load",()=>W(X.naturalWidth,X.naturalHeight),{once:!0})}}return F}let b=matchMedia("(prefers-reduced-motion: reduce)"),D=matchMedia("(max-width: 660px)");function z(){let p={...Wi(t,i),reducedMotion:i.reducedMotion||b.matches};if(D.matches&&i.mobileSizing){for(let[A,N]of[["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])i[N]!=null&&(p[A]=i[N]);i.preset==="spiral"&&i.mobileSpiralWidth!=null&&(p.spiralWidth=i.mobileSpiralWidth),i.mobileHeightMode&&i.mobileHeightMode!=="inherit"&&(p.heightMode=i.mobileHeightMode,p.stageHeight=i.mobileStageHeight??p.stageHeight,p.viewportHeight=i.mobileViewportHeight),i.mobileCardWidth!=null&&(p.cardWidth=i.mobileCardWidth),i.mobileGap!=null&&(p[i.preset==="spiral"?"spiralGap":"gap"]=i.mobileGap)}return i.preset!=="spiral"&&(p.heightMode==="viewport"&&(p.stageHeight=innerHeight*p.viewportHeight/100),p.heightMode==="auto"&&(p.stageHeight=Qe(i.preset)?0:Math.min(innerHeight,i.preset==="stack"?680:590))),p.phoneWidthOverride=D.matches&&i.mobileSizing&&i.mobileCardWidth!=null,i.preset==="stack"&&(p.stackCardWidth=D.matches&&i.mobileSizing&&i.mobileCardWidth!=null?i.mobileCardWidth:Math.max(360,i.cardWidth*2.2)),p}function M(){t.classList.toggle("gc-hide-controls",i.showControls===!1);let p=z();ro(t,p),so(t,p),i.preset!=="spiral"&&(qi(t,p),(p.overlayEnabled||p.shadowEnabled||x)&&(x??=zt(t,"gc-image-"+crypto.randomUUID()),x({...p,cardShadow:!1,imageTint:p.overlayEnabled?p.imageTint:"#00000000"}))),t.style.setProperty("--gc-fit",i.fit),t.style.setProperty("--gc-card-radius",i.radius+"px")}function C(p=0){d(),r?.destroy(),r=null,o?.restore(),cancelAnimationFrame(f),t.replaceChildren(),x=null,t.classList.add("gc-stage"),t.style.height="";let A=So(i.preset);A!==m&&(w?.(),w=Co(i.preset),m=A),M(),t.setAttribute("aria-label",i.previewScroll===!1?"Gallery":"Gallery preview");let N=o&&i.preset!=="spiral"?o:null;N?N.begin():o&&o.track.classList.add("gc-native-items-hidden");let F={host:t,items:e,openPost:y,initialIndex:p,nativeList:N,attachDialog:X=>wi(t,X),options:z(),makeCard:h,loadImage:_t,onChange(X){u=X,i.onChange?.(X)}};if(!e.length){let X=document.createElement("p");X.className="gc-empty",X.textContent="Add images to your source to start exploring.",t.append(X);return}i.preset==="spiral"?r=_a(F):i.preset==="stack"?r=Ji(F):["wall","ring","angled"].includes(i.preset)?(r=Vi(F),p&&r.goTo(p)):r=_i(F),i.preset!=="spiral"&&(f=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(X=>{_t(X,{nativeCard:!!N})})))}let q=()=>C(u);function U(){if(i.preset!=="spiral"){i.mobileSizing&&C(u);return}r?.setGeometry?r.setGeometry(z()):i.preset==="spiral"?r?.update(z()):C(u)}try{C()}catch(p){throw w?.(),o?.restore(),p}let _=innerHeight;function I(){if(_===innerHeight)return;_=innerHeight;let p=z().heightMode;i.preset!=="spiral"&&["viewport","auto"].includes(p)&&C(u)}return window.addEventListener("resize",I),b.addEventListener("change",q),D.addEventListener("change",U),{update(p){let A=i.preset,N=z();i=Vt(i,p);let F=z(),X=Object.keys(F).filter(j=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(j)&&F[j]!==N[j]);if(!X.length)return;if(r?.setGeometry&&X.every(j=>["cardWidth","gap","phoneWidthOverride"].includes(j))){r.setGeometry(F);return}let W=j=>["colorSource","typeSource","background","ink","accent"].includes(j);if(X.every(j=>W(j)||A!=="spiral"&&(j==="radius"||Object.hasOwn(vi,j)))){M(),X.includes("typeSource")&&o?.setType(i.typeSource);return}A==="spiral"&&i.preset==="spiral"&&r?.update?(M(),r.update(F)):C(A===i.preset?u:0)},goTo(p){r?.goTo?.(p)},setPlaying(p){i.autoplay=p,r?.setPlaying?.(p)},getOptions(){return{...i}},getActive(){return u},destroy(){window.removeEventListener("resize",I),d(),cancelAnimationFrame(f),r?.destroy(),o?.restore(),b.removeEventListener("change",q),D.removeEventListener("change",U),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),w?.()}}}function Pr(t,e){let a=e.closest("section")||e,o=[];for(let i=t.parentElement;i;i=i.parentElement){let r=ze.scrollBoundaries.get(i)||0;if((r||["hidden","auto","scroll","overlay"].includes(getComputedStyle(i).overflowY))&&(ze.scrollBoundaries.set(i,r+1),i.classList.add("gc-stack-page-scroll"),o.push(i)),i===a)break}return()=>{for(let i of o){let r=ze.scrollBoundaries.get(i)-1;r?ze.scrollBoundaries.set(i,r):(ze.scrollBoundaries.delete(i),i.classList.remove("gc-stack-page-scroll"))}}}function ut(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function ki(t){if(!ze.editListeners?.size){ze.editListeners=new Set;let e=ut();ze.editObserver=new MutationObserver(()=>{let a=ut();if(a!==e){e=a;for(let o of ze.editListeners)try{o(a)}catch(i){console.warn("Gallery Studio: could not resume a list layout.",i)}}});for(let a of[document.body,document.documentElement])ze.editObserver.observe(a,{attributes:!0,attributeFilter:["class"]})}return ze.editListeners.add(t),()=>{ze.editListeners.delete(t),ze.editListeners.size||ze.editObserver.disconnect()}}function Si({selector:t,type:e="gallery",options:a={}}={}){let o=t;if(typeof t=="string")try{let A=document.querySelectorAll(t);if(A.length!==1)return null;o=A[0]}catch{return null}if(!o?.isConnected||typeof o.closest!="function")return null;let i=kt(o,e);if(!i)return null;let{source:r}=i,s=ze.mounts.get(r);if(s)return s.instance.update(a),s;if(!gt(r,e).length)return null;let c=document.createElement("div"),n=document.createElement("div");c.dataset.sourceType=e,c.className="gc-embed",n.className="gc-viewport-slot",n.append(c);let u={...Vt({...Ze,...mt(a.preset??Ze.preset,a),...e==="summary"?{showButton:!1}:{}},a),previewScroll:!1},f=null,m=null,w=null,x=null,d=null,y=!1,S=[],v=null,h=!1,b=null;function D(){u.galleryWidth==="source"?(w?.(),w=null,v&&(n.classList.add("user-items-list-simple"),n.dataset.layoutWidth=v.mode,n.style.maxWidth=v.maximum)):w||(n.classList.remove("user-items-list-simple"),delete n.dataset.layoutWidth,n.style.removeProperty("max-width"),w=to(n,c,r,e))}function z(){return e!=="list"&&u.preset!=="stack"&&u.galleryHeight!=="custom"&&!!r.closest(".fluid-engine > .fe-block")}function M(){z()?x||(x=Qa(n,c,r)):(x?.(),x=null)}function C(A){A==="stack"?m||(m=Pr(c,r)):m&&(m(),m=null)}function q(){try{f?.destroy()}finally{f=null,x?.(),x=null,C(null),w?.(),w=null,S.forEach(A=>A.classList.remove("gc-native-items-hidden")),S=[],b?.remove(),b=null,n.remove(),n.replaceChildren(c),c.inert=!1}}function U(){if(y||f||!r.isConnected)return;let A=kt(r,e),N=gt(r,e);if(!A||!N.length)return;A.originals[0].before(n),Co();let F=A.originals[0];v=e==="list"?{mode:F.dataset.layoutWidth||"full",maximum:F.style.maxWidth}:null,D();let X=null;if(e==="list"){let W=h?F.cloneNode(!0):F;h&&(b=W,W.removeAttribute("id"),W.querySelectorAll("[id]").forEach(j=>j.removeAttribute("id")),n.append(W)),X=Ka(n,W,h?[...W.querySelectorAll(".list-item")]:A.rows)}(!X||h)&&(S=A.originals,S.forEach(W=>W.classList.add("gc-native-items-hidden"))),M(),C(u.preset),f=Mo(c,N,u,X),c.inert=h}function _(){if(!y){y=!0,r.classList.remove("gc-edit-preview");try{q()}finally{d?.(),ze.mounts.delete(r)}}}let p={instance:{update(A={}){if(y)return;let N=u.galleryWidth;u={...Vt(u,A),previewScroll:!1},f&&(u.galleryWidth!==N&&D(),M(),C(u.preset),f.update(u))},setEditPreview(A){if(!(y||!ut()||A===h)){if(h=A,r.classList.toggle("gc-edit-preview",A),!A){q();return}try{U()}catch(N){throw this.setEditPreview(!1),N}}},goTo(A){f?.goTo(A)},setPlaying(A){u.autoplay=A,f?.setPlaying(A)},getOptions(){return{...u}},getActive(){return f?.getActive()??0},destroy:_},host:c,source:r,destroy:_};try{d=ki(A=>{if((h||A)&&q(),h=!1,r.classList.remove("gc-edit-preview"),!A)try{U()}catch(N){throw q(),N}}),ut()||U(),ze.mounts.set(r,p)}catch(A){throw _(),A}return p}var St,Ze,ze,Ci=ee(()=>{Qt();Ri();ei();Rt();Ui();Xi();Yi();Ki();Xa();Ht();yi();Za();eo();io();no();lo();po();uo();fo();bo();vo();wo();Oa();Fa();Ha();Ia();St=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],Ze={...Tt,...vi,popupDesktopLayout:"split",colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};ze=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:Mo,embed:Si,presets:St,loadPostData:Lt}});var Po,Ao=ee(()=>{Po=`:host {
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
  overflow: auto;
  overscroll-behavior: contain;
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
.paint-popup{overscroll-behavior:contain;position:fixed;inset:auto;margin:0;width:min(260px,calc(100vw - 16px));max-height:calc(100dvh - 16px);overflow:auto;border:1px solid var(--gc-panel-border);border-radius:12px;padding:12px;background:#fafaf7;color:#20231e;box-shadow:0 5px 20px #17261d25}
.paint-popup .field-palette>.field-label{display:none}
.paint-popup .field-palette{display:block}
.group-body .field[data-subsetting],.group-body .paint-row{margin-inline-start:10px}
`});function oe(t,e,a){let o=document.createElement(t);return e&&(o.className=e),a!==void 0&&(o.textContent=a),o}function Le(t,e,a){let o=oe("button",t,e);return o.type="button",a&&o.setAttribute("aria-label",a),o}function Eo(t){let e=oe("span","select-box");return e.append(t),e}function je(t,e,a,o,i,r=""){return{key:t,label:e,type:"range",min:a,max:o,step:i,unit:r}}function Ge(t,e,a){return{key:t,label:e,type:"select",choices:Object.entries(a).map(([o,i])=>({value:o,label:i}))}}function ct(t,e,a){return{key:t,label:e,type:"color",when:a,independent:!0}}function Yt(t,e){let a=t.preset,o=Qe(a),i=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,a==="timed"?960:a==="spiral"?720:560,1,"px"),je("stageHeight",o?"Minimum gallery height":"Gallery height",o?0:300,1200,1,"px")];if(e!=="list"&&(i.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&i.splice(i.findIndex(n=>n.key==="stageHeight"),1)),a==="spiral")i.push(...yt);else if(i.push(je("gap","Spacing",0,100,1,"px")),a!=="infinite"&&a!=="timed"){let n={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[a]||"Depth";i.push(je("depth",n,0,100,1))}let r=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":a==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(a==="arc-tabs"||a==="timed")&&r.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),a!=="stack"&&(r.push({key:"showControls",label:"Show controls",type:"checkbox"}),r.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),a!=="spiral"&&r.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),r.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let s=ti.has(a),c=[{title:"Size & spacing",fields:i},{title:"Mobile overrides",fields:[{...i.find(n=>n.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...i.find(n=>n.key===(a==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:a==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:r},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:zr},...a==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),ct("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(a)?[Ge("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),ct("backColor","Back color",["backFace","solid"])]:[],...a==="stack"?[]:[Ge("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...s?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...a==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ge("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ge("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ge("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),ct("controlFill","Button background",["controlPalette","custom"]),ct("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...s?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(n=>({value:n,label:n+" rem"}))]}],Ge("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ge("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),ct("titleColor","Custom title color",["titlePalette","custom"])]},...s?Hi({range:je,select:Ge,swatch:ct}):[]];if(s){c=Di(t,e,{range:je,select:Ge,swatch:ct},c);for(let n of c)if(n.title==="Mobile")for(let u of n.fields.slice(1))u.condition=f=>f.mobileSizing,u.mobileRange=!!u.inherits}if(e==="summary"){let n={...Ge("popupDesktopLayout","Desktop layout",{split:"Split panel",drawer:"Slide-in drawer"}),when:["clickAction","preview"]},u=c.find(f=>f.title==="Popup");u?u.fields.unshift(n):c.push({title:"Popup",fields:[n]})}if(s){for(let n of c)if(n.fields=n.fields.flatMap(u=>{if(u.type!=="color"||!qt.includes(u.key))return[u];let f=u.when||(u.independent?void 0:["colorSource","custom"]);return[{...Ge(u.key+"Swatch",u.label+" palette",{custom:"Custom",...ii}),type:"palette",when:f,condition:u.condition},{...u,when:f,condition:u.condition,customFor:u.key+"Swatch"},{...je(u.key+"Opacity",u.label+" opacity",0,100,1,"%"),when:f}]}),n.typography)for(let u of n.fields)u.typography=n.typography}return c}function zo(t){return{...Ze,stageHeight:Qe(t.preset??Ze.preset)?0:590,...t.preset==="spiral"?Ve:{},colorSource:"section",typeSource:"native",...t}}function Lr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",a=t.name?.trim()||e,o=t.items?.length||0;return`${a.toLowerCase().includes(e.toLowerCase())?a:`${a} \xB7 ${e}`} \xB7 ${o} ${o===1?"item":"items"}`}function jr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let a=e.ownerDocument,o=a.defaultView,i=0;function r(){i=0;let u=e.getBoundingClientRect();if(!u.width||!u.height||!e.offsetHeight)return;let f=u.height/e.offsetHeight,m=t.getBoundingClientRect(),w=u.width/e.offsetWidth,x=Math.min(u.bottom,o.innerHeight),d=x;for(let y of[.1,.5,.9]){let S=u.left+(m.left+m.width*y)*w,v=a.elementFromPoint(S,x-2);if(!(!v||v===e))for(;v&&!v.contains(e);){let h=v.getBoundingClientRect();h.bottom>=x-2&&h.height>0&&h.height<u.height/2&&(d=Math.min(d,h.top)),v=v.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((u.bottom-d)/f))+"px")}function s(){i||(i=requestAnimationFrame(r))}let c=new ResizeObserver(s);c.observe(e),c.observe(a.documentElement);let n=new MutationObserver(s);return n.observe(a.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),o.addEventListener("resize",s),o.addEventListener("transitionend",s),r(),()=>{c.disconnect(),n.disconnect(),o.removeEventListener("resize",s),o.removeEventListener("transitionend",s),cancelAnimationFrame(i)}}function Lo({source:t,options:e,onPreset:a,onOption:o,onClose:i,onRestore:r,onSave:s,getSaveState:c,getCode:n,getStyle:u,applyStyle:f}){let m=document.activeElement,w=t,x=zo(e),d=!1,y=!1,S=0,v=new Map,h=[],b=new Map;function D(){for(let[l,g]of b)l.hidden=!x[g]}let z=new Map,M=oe("div");M.setAttribute("data-gc-author-panel",""),Xt(M);let C=M.attachShadow({mode:"open"}),q=oe("style");q.textContent=Po;let U=oe("aside","panel");U.setAttribute("aria-labelledby","gc-author-heading");let _=oe("header","header"),I=oe("div","heading"),p=oe("h2","","Gallery settings");p.id="gc-author-heading";let A=oe("p","target"),N=oe("p","save-state");N.setAttribute("role","status"),I.append(p,A,N);function F(l=c()){N.textContent!==l&&(N.textContent=l,N.dataset.saved=String(l==="Saved to page"))}let X=oe("div","header-actions"),W=Le("icon-button","\u2212","Minimize settings");W.setAttribute("aria-controls","gc-author-controls"),W.setAttribute("aria-expanded","true");let j=Le("icon-button","\xD7","Close settings");X.append(W,j),_.append(I,X);let P=oe("div","controls");P.id="gc-author-controls";let R=oe("div","scroll");R.tabIndex=0,R.setAttribute("aria-label","Layout settings");let E=oe("label","preset-row"),$=oe("select","preset-select");$.setAttribute("aria-label","Layout");for(let l of St.filter(g=>t.type==="list"||g.id!=="stack")){let g=oe("option","",l.name);g.value=l.id,$.append(g)}E.append(oe("span","field-label","Layout"),Eo($));let B=oe("div","groups"),J=oe("div","style-actions"),V=Le("text-button","Copy style"),Z=Le("text-button","Paste style");J.append(V,Z);let re=oe("div","style-transfer");re.hidden=!0;let O=oe("textarea");O.setAttribute("aria-label","Gallery style"),O.spellcheck=!1;let Y=Le("secondary","Apply style"),ne=Le("text-button","Close","Close style transfer"),K=oe("p","field-error","Paste a gallery style created with Copy style.");K.id="gc-style-error",K.hidden=!0,K.setAttribute("role","alert");function ce(){K.hidden=!0,O.removeAttribute("aria-invalid"),O.removeAttribute("aria-describedby")}O.addEventListener("input",ce),re.append(O,K,Y,ne),R.append(E,J,re,B);let ue=oe("footer","footer"),se=oe("div","export-actions"),pe=Le("primary","Save to page"),ye=Le("secondary","Copy code"),we=Le("text-button","Download header backup");we.hidden=!0;let ke=null,te=Le("secondary","View code");te.setAttribute("aria-expanded","false"),te.setAttribute("aria-controls","gc-author-code"),se.append(pe,ye);let be=oe("div","code-view");be.id="gc-author-code",be.hidden=!0;let ae=oe("label","code-label","Page Header Code Injection"),Ae=oe("textarea");Ae.readOnly=!0,Ae.spellcheck=!1,Ae.setAttribute("aria-label","Page header code"),ae.append(Ae),be.append(ae);let ge=oe("div","footer-line"),Se=oe("span","status");Se.setAttribute("role","status");let Ce=Le("text-button","Reset preview");ge.append(Se,Ce);let Pe=oe("div","backup-actions"),ve=Le("text-button","Remove layout");ve.hidden=c()==="Not saved yet",Pe.append(te,we,ve);let Re=oe("div","removal");Re.hidden=!0,Re.append(oe("p","","Restore the native "+w.name+" and remove its saved layout from this page?"));let Ne=Le("secondary","Keep layout"),De=Le("secondary","Remove saved layout");Re.append(Ne,De),ue.append(se,Pe,be,Re,ge),P.append(R,ue),U.append(_,P),C.append(q,U),document.body.append(M);let dt=jr(M);function Be(l){let{definition:g,input:k,output:L,row:G}=l,H=x[g.key];if(g.when&&(G.hidden=x[g.when[0]]!==g.when[1]),g.condition&&(G.hidden=g.when&&x[g.when[0]]!==g.when[1]||!g.condition(x)),g.type==="palette"){l.refresh?.();for(let T of k.children)T.setAttribute("aria-pressed",String(T.value===H));return}if(g.customFor&&x[g.customFor]!=="custom"){G.hidden=!0;return}if(g.type==="checkbox"){k.checked=!!H;return}if(g.type==="range"){let T=g.key==="spiralRise"&&x.spiralRiseUnit==="percent"?{...g,...g.percent}:g;k.min=String(T.min),k.max=String(T.max),k.step=String(T.step);let Q=g.inherits&&H==null;l.enable&&(l.enable.checked=!Q,k.disabled=!!Q),k.value=String(Q?x[g.inherits]:H);let ie=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(T.key)&&T.min===0&&Number(k.value)===0?"Auto":`${k.value}${T.unit||""}`;L.textContent=Q?`Inherit \xB7 ${ie}`:ie,k.setAttribute("aria-valuetext",ie);return}k.value=String(H),g.type==="color"&&(g.independent||(G.hidden=x.colorSource==="section"),L.textContent=k.value.toUpperCase())}function at(){F(),S+=1,Se.textContent="",be.hidden||(Ae.value=n())}function He(l,g){let k=x.spiralRiseUnit,L=v.get(l)?.definition.typography;if(L&&!x[L]&&(x[L]=!0,o(L,!0)),x={...x,[l]:g},l==="spiralRiseUnit"&&k!==g){let T=Math.max(1,x.stageHeight),Q=g==="percent"?Math.max(1,Math.min(30,Math.round(x.spiralRise/T*1e3)/10)):Math.max(8,Math.min(280,Math.round(x.spiralRise*T/100)));x.spiralRise=Q,o(l,g),o("spiralRise",Q),Be(v.get("spiralRise"))}else o(l,g);let G=l.replace(/Swatch$|Opacity$/,""),H=G==="titleColor"?"titlePalette":G==="descriptionColor"?"descriptionCustom":null;if(H){let T=H==="titlePalette"?"custom":!0;x[H]=T,o(H,T)}l==="galleryHeight"&&(Ie(),v.get(l)?.input.focus({preventScroll:!0})),l==="colorSource"?v.forEach(Be):Be(v.get(l));for(let T of v.values())(T.definition.inherits===l||T.definition.when?.[0]===l||T.definition.customFor===l)&&Be(T);v.forEach(Be),D(),at()}function Oe(l){let{key:g,label:k,type:L}=l,G=oe(l.inherits||L==="palette"?"div":"label",`field field-${L}`);l.when&&G.setAttribute("data-subsetting","");let H=oe("span","field-label",k);if(L==="palette"){let ie=oe("div","palette-chips"),de=getComputedStyle(w.root);ie.setAttribute("role","group"),ie.setAttribute("aria-label",k);for(let xe of l.choices){let he=Le("palette-chip",xe.value==="custom"?"+":"",xe.label);he.value=xe.value,he.title=xe.label;let me=de.getPropertyValue("--"+xe.value+"-hsl").trim();me?he.style.backgroundColor="hsl("+me+")":xe.value!=="custom"&&(he.textContent=xe.label),he.addEventListener("click",()=>He(g,xe.value)),ie.append(he)}G.append(H,ie);let fe={definition:l,row:G,input:ie};return v.set(g,fe),Be(fe),G}let T=oe(L==="select"?"select":"input");if(T.setAttribute("aria-label",k),T.dataset.option=g,L==="select")for(let ie of l.choices){let de=oe("option","",ie.label);de.value=ie.value,T.append(de)}else T.type=L;let Q;(L==="range"||L==="color")&&(Q=oe("output","value"),Q.setAttribute("aria-hidden","true")),G.append(H),Q&&G.append(Q),G.append(L==="select"?Eo(T):T);let le={definition:l,input:T,output:Q,row:G};if(l.inherits&&!l.mobileRange){let ie=oe("input");ie.type="checkbox",ie.setAttribute("aria-label","Customize "+k.toLowerCase());let de=oe("label","override-toggle");de.append(ie,H),G.prepend(de),le.enable=ie,ie.addEventListener("change",()=>He(g,ie.checked?x[l.inherits]:null))}return v.set(g,le),Be(le),T.addEventListener(L==="range"||L==="color"?"input":"change",()=>{let ie=L==="range"||l.numeric?Number(T.value):L==="checkbox"?T.checked:T.value;He(g,ie)}),G}function Ie(){let l=new Map([...z].map(([g,k])=>[g,k.open]));h.splice(0).forEach(g=>g()),b.clear(),v.clear(),z.clear(),B.replaceChildren();for(let g of Yt(x,w.type)){let k=oe("details","group");k.open=l.get(g.title)??["Elements","Size & spacing"].includes(g.title);let L=oe("summary","",g.title),G=oe("div","group-body"),H={Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[g.title];H&&b.set(k,H);let T;for(let Q of g.fields){let le=Oe(Q);if(Q.type==="palette"){let ie=Q.key.slice(0,-6),de=oe("div","paint-row"),fe=Le("paint-trigger","",Q.label.replace(/ palette$/,"")),xe=oe("span","field-label",Q.label.replace(/ palette$/,""));T=oe("div","paint-popup"),T.popover="auto",fe.popoverTargetElement=T,de.append(xe,fe,T),G.append(de),T.append(le);let he=()=>{de.hidden=le.hidden;let Mt=x[Q.key],At=getComputedStyle(w.root).getPropertyValue("--"+Mt+"-hsl");if(fe.style.setProperty("--chip",At?"hsl("+At+")":x[ie]),fe.style.setProperty("--alpha",x[ie+"Opacity"]/100),!me.matches(":popover-open"))return;let tt=fe.getBoundingClientRect(),Pt=me.offsetWidth,Zt=me.offsetHeight;me.style.left=Math.max(8,Math.min(innerWidth-Pt-8,tt.right-Pt))+"px",me.style.top=Math.max(8,Math.min(innerHeight-Zt-8,tt.bottom+Zt+8<=innerHeight?tt.bottom+4:tt.top-Zt-4))+"px"},me=T,ht=new ResizeObserver(he),Ct=()=>{ht.disconnect(),window.removeEventListener("scroll",he,!0),window.removeEventListener("resize",he)};h.push(Ct),T.addEventListener("toggle",()=>{me.matches(":popover-open")?(ht.observe(me),window.addEventListener("scroll",he,!0),window.addEventListener("resize",he),he()):Ct()}),v.get(Q.key).refresh=he,he()}else T&&(Q.customFor||Q.key.endsWith("Opacity"))?(T.append(le),Q.customFor||(T=null)):(T=null,G.append(le))}k.append(L,G),B.append(k),z.set(g.title,k)}D()}function Ye(l){if(y)return;let g=x.preset;w=l.source??w,l.options&&(x=zo(l.options)),A.textContent=Lr(w),A.title=w.selector||A.textContent,$.value=x.preset,!v.size||g!==x.preset?Ie():(v.forEach(Be),D()),at()}function Te(l){be.hidden=!l,te.textContent=l?"Hide code":"View code",te.setAttribute("aria-expanded",String(l)),l&&(Ae.value=n(),Ae.focus({preventScroll:!0}),Ae.select())}function et(){if(y)return;y=!0,S+=1;let l=document.activeElement===M;document.removeEventListener("keydown",Me),h.splice(0).forEach(g=>g()),dt(),M.remove(),l&&m?.isConnected&&m.focus({preventScroll:!0})}function Ue(l){if(!y)try{l()}finally{et()}}function Me(l){if(!(l.key!=="Escape"||l.defaultPrevented||l.isComposing)&&!C.querySelector(".paint-popup:popover-open")){if(!Re.hidden){l.preventDefault(),$e(!1);return}document.querySelector("dialog[open]")||l.composedPath().some(g=>g?.getAttribute?.("aria-modal")==="true")||(l.preventDefault(),!re.hidden&&(re.contains(C.activeElement)||be.hidden)?(re.hidden=!0,(O.readOnly?V:Z).focus()):be.hidden?Ue(i):(Te(!1),te.focus()))}}W.addEventListener("click",()=>{d=!d,P.hidden=d,M.toggleAttribute("data-minimized",d),W.textContent=d?"+":"\u2212",W.setAttribute("aria-expanded",String(!d)),W.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),j.addEventListener("click",()=>Ue(i)),Ce.addEventListener("click",()=>Ue(r)),$.addEventListener("change",()=>a($.value)),te.addEventListener("click",()=>Te(be.hidden));function _e(l,g){ce(),re.hidden=!1,Y.hidden=l,O.readOnly=l,O.value=g,O.placeholder=l?"":"Paste the copied gallery style",O.focus(),l&&O.select()}V.addEventListener("click",async()=>{let l=u();try{await navigator.clipboard.writeText(l),y||(re.hidden=!0,Se.textContent="Style copied")}catch{if(y)return;_e(!0,l),Se.textContent="Style selected. Choose Copy."}}),Z.addEventListener("click",()=>{Se.textContent="",_e(!1,"")}),ne.addEventListener("click",()=>{re.hidden=!0,(O.readOnly?V:Z).focus()}),Y.addEventListener("click",()=>{if(!f(O.value)){K.hidden=!1,O.setAttribute("aria-invalid","true"),O.setAttribute("aria-describedby",K.id),O.focus();return}re.hidden=!0,Se.textContent="Style applied to this preview",Z.focus()}),we.addEventListener("click",()=>{if(!ke)return;let l=URL.createObjectURL(new Blob([ke.header],{type:"text/plain"})),g=document.createElement("a");g.href=l,g.download="gallery-header-backup-"+ke.collectionId+".txt",g.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)});async function Fe(l=!1){if(l&&$e(!1),!pe.disabled){pe.disabled=Ce.disabled=ve.disabled=!0,R.inert=!0,pe.textContent="Saving\u2026",F(l?"Removing\u2026":"Saving\u2026"),Se.textContent=l?"Removing layout\u2026":"Saving to page header\u2026";try{await s(g=>{ke=g,y||(we.hidden=!1)},l),y||(Se.textContent="Saved to page header")}catch(g){y||(Se.textContent=g.message||"Save failed. Copy code is still available.")}finally{y||(pe.disabled=Ce.disabled=ve.disabled=!1,ve.hidden=c()==="Not saved yet",R.inert=!1,pe.textContent="Save to page",F())}}}pe.addEventListener("click",()=>Fe());function $e(l){Re.hidden=!l,R.inert=l,se.hidden=Pe.hidden=ge.hidden=l,l?(Te(!1),Ne.focus()):ve.focus()}return ve.addEventListener("click",()=>$e(!0)),Ne.addEventListener("click",()=>$e(!1)),De.addEventListener("click",()=>Fe(!0)),ye.addEventListener("click",async()=>{let l=++S,g=n();try{await navigator.clipboard.writeText(g),!y&&l===S&&(Se.textContent="Page code copied")}catch{if(y||l!==S)return;Te(!0),Se.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Me),Ye({source:t,options:e}),$.focus({preventScroll:!0}),{element:M,update:Ye,destroy:et}}var zr,jo=ee(()=>{xi();It();Rt();Ci();Ao();zr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var To,Io=ee(()=>{To=`.gc-config-position{position:relative!important}
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
`});var Do={};Ei(Do,{startInline:()=>Pi});function lt(t,e={},a){let o=Kt.get(t),i={...Ze,...t==="spiral"?Ve:mt(t,e),preset:t,colorSource:"section",typeSource:"native",...a==="summary"?{showButton:!1}:{},cardWidth:o.width,stageHeight:Qe(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[r,s]of Object.entries(e))r.startsWith("mobile")&&i[r]===null?Number.isFinite(s)&&s>=0&&(i[r]=s):r!=="preset"&&Object.hasOwn(i,r)&&typeof s==typeof i[r]&&(i[r]=s);return i.popupDesktopLayout!=="drawer"&&(i.popupDesktopLayout="split"),t==="spiral"&&("mobileSizing"in e||(i.mobileSizing=i.mobileGap!=null||i.mobileCardWidth!=null),"titleCustom"in e||(i.titleCustom=!!(i.titleSize||i.titlePalette==="custom"||i.titleWeight!=="inherit")),"bodyCustom"in e||(i.bodyCustom=!!(i.descriptionCustom||i.descriptionSize)),"overlayEnabled"in e||(i.overlayEnabled=i.imageTintOpacity>0),"cardBorderEnabled"in e||(i.cardBorderEnabled=i.borderWidth>0)),i}function Bo(t){return Yt(t).flatMap(e=>e.typography?[...e.fields,{key:e.typography,type:"checkbox"}]:e.fields).filter(e=>!Ro.has(e.key))}function Tr(t){let e=Object.fromEntries(Bo(t).map(({key:a})=>[a,t[a]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function qr(t,e){let a;try{a=JSON.parse(t)}catch{return null}if(a?.format!=="gallery-studio-style"||a.version!==1||!Kt.has(a.preset)||!a.values||typeof a.values!="object"||Array.isArray(a.values))return null;let o=lt(a.preset);for(let i of Ro)o[i]=e[i];for(let i of Bo(o)){let r=a.values[i.key];if(r!==void 0){if(i.type==="range"){if(i.inherits&&r===null)continue;let s=i.percent&&a.values.spiralRiseUnit==="percent"?i.percent:i;if(!Number.isFinite(r)||r<s.min||r>s.max)return null}else{if(i.type==="checkbox"&&typeof r!="boolean")return null;if(["select","palette"].includes(i.type)&&!i.choices.some(s=>s.value===r))return null}if(i.type==="color"&&!/^#[0-9a-f]{6}$/i.test(r))return null;o[i.key]=r}}return o}function Fo(t){return t.replace(/^spiralRim/,"borderColor").replace(/^spiralRadius$/,"radius")}function Ai(t,e){let a=new Map;for(let o of Yt(t,e))if(["Elements","Image","Title","Description","Card","Control styling","Theme"].includes(o.title)){for(let i of o.fields)i.key!=="cardWidth"&&a.set(Fo(i.key),i);o.typography&&a.set(o.typography,{key:o.typography})}for(let o of["titlePalette","descriptionCustom"])a.set(o,{key:o});return a}function Mi(t,e){let a=lt(e.preset,{},t.source.type);for(let[o,i]of Ai(e,t.source.type))e[i.key]!==a[i.key]&&t.shared.set(o,e[i.key])}function Rr(t,e){return lt(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"},e)}function Jt(t,e){let a=lt(e.preset,{},t.type),o={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};for(let r of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])o[r]=e[r];Qe(e.preset)&&(o.stageHeight=e.stageHeight);for(let r of Object.keys(a))e.colorSource==="section"&&qo.has(r)||e[r]!==a[r]&&(o[r]=e[r]);let i={v:1,selector:t.selector,type:t.type,options:o};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(i,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Pi(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let a=Ya(),o=new Map(a.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map,shared:new Map}])),i=null,r=null,s=null,c=!1,n=[];function u(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=Si({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function f(d=!0){if(!r)return;let y=r;r=null,i?.destroy(),i=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function m(d){f(),d.presets.clear(),d.shared.clear(),d.installed?(u(d,d.installed),Mi(d,d.installed)):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function w(d){if(r===d){f();return}f(!1);let{source:y}=d;if(d.mounted||(y.items=gt(y.root,y.type)),!y.items.length){let h="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=h,d.button.setAttribute("aria-label",h);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+y.name+" layout");let S=d.options||d.installed||lt("arc-tabs",y.type!=="list"?{galleryWidth:"source"}:{},y.type);if(y.type!=="list"&&S.preset==="stack"&&(S=lt("arc-tabs",{galleryWidth:"source"}),u(d,S)),!d.mounted&&!u(d,S)){d.button.textContent="No supported layout here";return}r=d;let v=h=>{u(d,h),d.presets.set(h.preset,{...h})};i=Lo({source:y,options:{...d.options},onClose:()=>f(),onRestore:()=>m(d),onPreset:h=>{if(!Kt.has(h)||y.type!=="list"&&h==="stack")return;d.presets.set(d.options.preset,{...d.options});let b={...d.presets.get(h)||lt(h,{},y.type),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight},D=Ai(b,y.type);for(let[z,M]of d.shared){let C=D.get(z);C&&(!C.choices||C.choices.some(q=>q.value===M))&&(b[C.key]=M)}v(b),i.update({source:y,options:{...d.options}})},onOption:(h,b)=>{if(!Object.hasOwn(d.options,h)||h==="preset")return;let D={...d.options,[h]:b},z=Fo(h);Ai(d.options,y.type).has(z)&&d.shared.set(z,b),v(D)},getSaveState:()=>d.installed?Jt(y,d.options)===Jt(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Jt(y,d.options),onSave:async(h,b=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let D={...d.options},z=ji();c=!0;try{await Ii({snippet:Jt(y,D),context:z,onBackup:h,remove:b}),b?(d.installed=null,r===d?m(d):(d.presets.clear(),d.shared.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=D}finally{c=!1}},getStyle:()=>Tr(d.options),applyStyle:h=>{let b=qr(h,d.options);return!b||y.type!=="list"&&b.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),d.shared.clear(),Mi(d,b),v(b),i.update({source:y,options:d.options}),!0)}}),i.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),S=document.querySelectorAll(y.selector),v=S.length===1&&o.get(S[0]);if(!v||y.v!==1||y.type!==v.source.type||!Kt.has(y.options?.preset))continue;v.installed=Rr(y.options,y.type),Mi(v,v.installed)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of o.values())d.installed&&u(d,d.installed);if(t&&o.size){let y=function(h=!1){d.setAttribute("aria-pressed",String(h)),d.querySelector("span").textContent=h?"Edit native content":"Preview galleries",d.hidden=!ut()||![...o.values()].some(b=>b.mounted)},S=function(h){if(!h.mounted||h.source.root.isConnected)return;let b=h.source.root,D=document.querySelectorAll(h.source.selector);if(D.length!==1)return;let z=D[0];h.mounted.destroy(),h.mounted=null,h.source.root=z,o.delete(b),o.set(z,h),u(h,h.options);let M=z.querySelector(h.source.type==="list"?".user-items-list":".sqs-block-content")||z;h.button&&(getComputedStyle(M).position==="static"&&M.classList.add("gc-config-position"),M.append(h.button))};s=document.createElement("style"),s.textContent=To,document.head.append(s);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let h=d.getAttribute("aria-pressed")!=="true";for(let b of[...o.values()])S(b),b.mounted?.instance.setEditPreview(h);y(h)},document.body.append(d),y();let v=ki(h=>{h||requestAnimationFrame(()=>{if(d.isConnected)for(let b of[...o.values()])S(b)}),y()});n.push(()=>{v(),d.remove()});for(let h of o.values()){let{source:b}=h;if(!b.selector)continue;let D=b.root.querySelector(b.type==="list"?".user-items-list":".sqs-block-content")||b.root,z=getComputedStyle(D).position==="static";z&&D.classList.add("gc-config-position");let M=document.createElement("button");M.type="button",M.className="gc-config-launch",M.setAttribute("aria-expanded","false"),M.setAttribute("aria-label","Configure "+b.name+" layout"),M.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',M.addEventListener("click",()=>w(h)),D.append(M),h.button=M,n.push(()=>{M.remove(),z&&D.classList.remove("gc-config-position")})}}let x={version:1,destroy(){f(!1);for(let d of o.values())d.mounted?.destroy();for(let d of n)d();s?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=x,x}var Kt,qo,Ro,Ho=ee(()=>{Ti();Ci();yi();jo();Io();Rt();Kt=new Map(St.map(t=>[t.id,t])),qo=new Set(["background","ink","accent"]);Ro=new Set([...qo,"colorSource","typeSource","clickAction","popupDesktopLayout"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Pi,{once:!0}):Pi()});var Br;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(Br=(await Promise.resolve().then(()=>(Ho(),Do))).startInline);export{Br as startInline};

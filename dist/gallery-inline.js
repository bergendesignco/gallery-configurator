var Xa=Object.defineProperty;var Q=(t,e)=>()=>(t&&(e=t(t=0)),e);var Ii=(t,e)=>{for(var o in e)Xa(t,o,{get:e[o],enumerable:!0})};function qi(t,e){if(t===void 0)return null;let o=new Map([...t.matchAll(Va)].map(i=>[i[1].toLowerCase(),i[2]??i[3]??i[4]??""]));if(!o.has("data-gallery-layout"))return null;if(o.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let r;try{r=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(r?.v!==1||typeof r.selector!="string"||!["list","gallery","summary"].includes(r.type)||!r.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return r}function Ya(t,e,o=!1){let r=[...e.matchAll(Ti)];if(r.length!==1||r[0][0]!==e.trim())throw Error("Invalid gallery settings.");let i=qi(r[0][1],r[0][2]);if(!i)throw Error("Missing gallery settings.");let a=!1,s=t.replace(Ti,(c,n,g)=>{let u=qi(n,g);return!u||u.selector!==i.selector?c:o||a?"":(a=!0,e)});return o||a?s:s+(s&&!s.endsWith(`
`)?`
`:"")+e+`
`}function Bi(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,o=e?.collection?.id,r=e?.website?.id,i=t.document.cookie.split(";").map(a=>a.trim()).find(a=>a.startsWith("crumb="))?.slice(6);if(!Lt.test(o||"")||!Lt.test(r||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!i)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:o,websiteId:r,crumb:decodeURIComponent(i)}}async function Fi({snippet:t,context:e,remove:o=!1,fetchImpl:r=fetch,onBackup:i=()=>{}}){let{collectionId:a,websiteId:s,crumb:c}=e;if(!Lt.test(a||"")||!Lt.test(s||"")||!c)throw Error("A signed-in Squarespace page is required.");async function n(){let E=await r("/api/commondata/GetCollectionSettings?collectionId="+a,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!E.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let M=await E.json(),l=M.collectionData??M;if(l?.id!==a||l.websiteId!==s||l.deleted===!0||l.folder===!0||l.dropdown===!0)throw Error("Page settings do not match this page.");if(l.headerInjectCode!=null&&typeof l.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:l,memberAreaData:M.memberAreaData??{}}}let g=await n();if(g.model.passwordProtected&&typeof g.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let u=g.model.headerInjectCode??"",f=Ya(u,t,o);if(f===u)return{unchanged:!0};i({collectionId:a,header:u,savedAt:new Date().toISOString()});let v=await n();if(JSON.stringify(v)!==JSON.stringify(g))throw Error("Page settings changed while saving. Review the page and save again.");let S;try{S=await r("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...v.model,collectionId:a,headerInjectCode:f},memberAreaData:v.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!S.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let m;try{m=await n()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((m.model.headerInjectCode??"").trim()!==f.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var Lt,Ti,Va,Ri=Q(()=>{Lt=/^[a-f0-9]{24}$/i,Ti=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Va=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function zt(t,e){let o="http://www.w3.org/2000/svg";function r(E,M,l){let h=document.createElementNS(o,E);for(let[b,R]of Object.entries(M))h.setAttribute(b,R);return l?.append(h),h}let i=r("svg",{width:0,height:0,"aria-hidden":"true"});i.style.position="absolute",t.append(i);let a=r("defs",{},i),s=r("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},a),c=r("feMorphology",{in:"SourceAlpha",operator:"dilate"},s),n=r("feGaussianBlur",{},s),g=r("feOffset",{result:"mask"},s),u=r("feFlood",{},s);r("feComposite",{in2:"mask",operator:"in"},s);let f=r("feMerge",{},s);r("feMergeNode",{},f),r("feMergeNode",{in:"SourceGraphic"},f);let v=r("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},a),S=r("feFlood",{},v);r("feComposite",{in2:"SourceGraphic",operator:"atop"},v);let m=s.cloneNode(!0);return m.id=e+"-card-shadow",a.append(m),E=>{let M=(E.cardShadowAngle??90)*Math.PI/180;m.querySelector("feMorphology").setAttribute("radius",E.cardShadowSpread||0),m.querySelector("feGaussianBlur").setAttribute("stdDeviation",(E.cardShadowBlur||0)/2);let l=m.querySelector("feOffset");l.setAttribute("dx",Math.cos(M)*(E.cardShadowDistance||0)),l.setAttribute("dy",Math.sin(M)*(E.cardShadowDistance||0)),m.querySelector("feFlood").setAttribute("flood-color",E.cardShadowColor||"#000");let h=[];E.shadowEnabled&&h.push("url(#"+s.id+")"),E.cardShadow&&h.push("url(#"+m.id+")");let b=E.shadowAngle*Math.PI/180;c.setAttribute("radius",E.shadowSpread),n.setAttribute("stdDeviation",E.shadowBlur/2),g.setAttribute("dx",Math.cos(b)*E.shadowDistance),g.setAttribute("dy",Math.sin(b)*E.shadowDistance),u.setAttribute("flood-color",E.shadowColor),S.setAttribute("flood-color",E.imageTint),t.style.setProperty("--gc-shadow-filter",h.join(" ")||"none"),t.style.setProperty("--gc-image-filter",E.imageTint.endsWith("00")&&E.imageTint.length===9?"none":"url(#"+v.id+")")}}var ei=Q(()=>{});function Di(t,e){let o=(s,c)=>t.toggleAttribute("data-finish-"+s,!!c),r=(s,c)=>t.style.setProperty("--finish-"+s,c);function i(s,c){let n=e[s+"Angle"]*Math.PI/180,g=e[s+"Distance"];return[Math.cos(n)*g,Math.sin(n)*g,e[s+"Blur"],e[s+"Spread"]].map(u=>u+"px").join(" ")+" "+c}for(let s of["surfaceEnabled","cardBackground","cardShadow","imageBorder","shadowEnabled","bodyCustom","overlayEnabled"])o(s.toLowerCase(),e[s]);o("padding",e.carouselPadding),o("card-padding",e.cardPadding),o("image-size",e.imageWidth!==100||e.imageAlign!=="center"),o("original",e.aspectRatio==="original"),o("crop",e.aspectRatio&&e.aspectRatio!=="layout"),o("circle",e.aspectRatio==="circle"),o("order",e.cardOrder&&e.cardOrder!=="layout"),o("align",e.cardAlign&&e.cardAlign!=="layout"),o("equal",e.cardSizing==="equal"),o("icon",e.controlIconSize),o("button-padding",e.controlPadding),o("clear-button",e.controlBackground===!1),o("title-align",e.titleAlign!=="inherit"),o("media-gap",e.mediaGap),o("title-gap",e.titleGap),o("button-gap",e.buttonGap),o("mirror",e.mirrorOverlay&&e.backFace==="mirror"),r("mirror",e.mirrorColor),o("caption",e.showDescription||e.showButton),o("image-padding",e.imagePadding);let a={surface:e.surfaceColor,"surface-radius":e.surfaceRadius+"px","carousel-padding":e.carouselPadding+"px",card:e.cardColor,"card-padding":e.cardPadding+"px","card-shadow":i("cardShadow",e.cardShadowColor),"image-border":e.imageBorderSize+"px solid "+e.imageBorderColor,"image-radius":e.imageRadius+"px","image-width":e.imageWidth+"%","image-padding":e.imagePadding+"%",left:e.imageAlign==="left"?"0":"auto",right:e.imageAlign==="right"?"0":"auto",ratio:e.aspectRatio==="circle"?"1":e.aspectRatio==="original"?"auto":e.aspectRatio?.replace(":"," / "),order:e.cardOrder==="content"?-1:1,align:{top:"start",middle:"center",bottom:"end"}[e.cardAlign]||"normal","title-align":e.titleAlign,"description-align":e.descriptionAlign,"description-weight":e.descriptionWeight,"media-gap":e.mediaGap+"px","title-gap":e.titleGap+"px","button-gap":e.buttonGap+"px",icon:e.controlIconSize+"px","button-padding":e.controlPadding+"px",duration:e.hoverDuration+"ms"};for(let[s,c]of Object.entries(a))r(s,c);e.cardBorderEnabled&&t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-line-size",(e.cardBorderEnabled?e.borderWidth:0)+"px"),t.style.setProperty("--gc-tint",e.imageTint),t.style.setProperty("--gc-tint-opacity","0")}var Hi=Q(()=>{});function Wi(t){let e=document.createElement("template");return e.innerHTML=t,e.content}function yt(t,e){return t&&URL.canParse(t,e)?new URL(t,e).href:null}function Ja(t,e){let o=t.querySelector(".sqs-gallery-container"),r=Array.from(t.querySelectorAll(".slide"),i=>{let a=i.querySelector("img[data-src], img[data-image], img[src]"),s=i.querySelector(".image-slide-anchor, a[href]");return{type:i.dataset.type||null,imageUrl:yt(a?.dataset.src||a?.dataset.image||a?.getAttribute("src"),e),imageId:a?.dataset.imageId??null,dimensions:a?.dataset.imageDimensions??null,focalPoint:a?.dataset.imageFocalPoint??null,alt:a?.getAttribute("alt")??null,title:s?.dataset.title??i.querySelector(".meta-title")?.textContent??null,descriptionHtml:s?.dataset.description??i.querySelector(".meta-description")?.innerHTML??null,href:yt(s?.getAttribute("href"),e),lightbox:!!s?.classList.contains("js-gallery-lightbox-opener"),html:i.outerHTML}});return{layout:o?.dataset.design??null,settings:{...o?.dataset},slides:r}}function Ka(t,e){return Array.from(Wi(t).querySelectorAll(".sqs-block"),o=>{let r=o.dataset.sqspBlock||[...o.classList].find(a=>a.startsWith("sqs-block-")&&a!=="sqs-block-website-component")?.slice(10),i={id:o.id||null,type:r||null,typeId:o.dataset.blockType??null,html:o.outerHTML};return(r==="gallery"||o.matches(".gallery-block, .sqs-block-gallery"))&&(i.gallery=Ja(o,e)),i})}async function Za(t,e){let o=await fetch(t,{mode:"same-origin",signal:e});if(!o.ok)return null;let r=await o.text(),i=Wi(r.split(/<\/head\s*>/i,1)[0]),a=Array.from(i.querySelectorAll("meta[content]"),s=>({name:s.getAttribute("property")||s.getAttribute("name")||s.getAttribute("itemprop"),content:s.getAttribute("content")})).filter(s=>s.name);return{title:i.querySelector("title")?.textContent??null,description:a.find(s=>s.name.toLowerCase()==="description")?.content??null,canonicalUrl:yt(i.querySelector('link[rel~="canonical"]')?.getAttribute("href"),o.url),meta:a}}async function jt(t,{signal:e,includeSeo:o=!0}={}){if(!t)throw new Error("A linked post URL is required.");let r=new URL(t,location.href);if(r.origin!==location.origin)throw new Error("The linked post must be on this site.");r.hash="",r.searchParams.delete("format");let i=new URL(r);i.searchParams.set("format","json");let a=await fetch(i,{mode:"same-origin",signal:e});if(!a.ok)throw new Error("Could not load post JSON ("+a.status+").");let{item:s}=await a.json();if(!s?.id||typeof s.body!="string")throw new Error("This URL did not return a post body.");let c=yt(s.fullUrl,a.url)||r.href,n=null;try{o&&(n=await Za(r,e))}catch(g){if(e?.aborted)throw g}return{id:s.id,url:c,title:s.title??null,excerptHtml:s.excerpt??null,publishedAt:s.publishOn??null,createdAt:s.addedOn??null,updatedAt:s.updatedOn??null,author:s.author??null,authorId:s.authorId??null,location:s.location??null,tags:s.tags??[],categories:s.categories??[],featuredImageUrl:yt(s.assetUrl,c),seo:{item:s.seoData??null,page:n},bodyHtml:s.body,blocks:Ka(s.body,c),rawItem:s}}var ti=Q(()=>{});function Ni(t,e,{range:o,select:r,swatch:i},a){let s=(d,L)=>({key:d,label:L,type:"checkbox"}),c=(d,L,$,H,V="px",G=1)=>o(d,L,$,H,G,V),n=(d,L,$)=>$.map(H=>({...H,when:[d,L]})),g=(d,...L)=>({title:d,fields:L.flat()}),u=d=>a.flatMap(L=>L.fields).find(L=>L.key===d),f=t.preset==="spiral",v=t.preset==="stack",S=["wall","ring","angled"].includes(t.preset),m=S||t.preset==="timed",E=f?"spiralGap":"gap",M=e!=="gallery",l={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(d,L)=>[100*(L+1),String(100*(L+1))]))},h={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function b(d,L,$,H,V,G){return{...g(d,c($,"Size",0,4,"rem",.05),r(H,"Weight",l),i(V,"Color"),r(G,"Alignment",h)),typography:L}}function R(d,L,$,H){return[s(d,L),...n(d,!0,[c($+"Angle","Angle",0,360,"\xB0"),c($+"Distance","Distance",0,48),c($+"Blur","Blur",0,40),c($+"Spread","Spread",0,16),i(H,"Color")])]}let F=(d,L)=>({...u(L),key:d,label:"Mobile "+u(L).label.toLowerCase(),inherits:L}),P=[g("Elements",s("showImage","Show image"),s("showTitles","Show title"),...M?[s("showDescription","Show description"),s("showButton","Show button")]:[],s("showControls","Show controls")),g("Main carousel",...M?[r("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...n("heightMode","pixels",[c("stageHeight","Height",120,1600)]),...n("heightMode","viewport",[c("viewportHeight","Window height",15,100,"%")])]:[],c("carouselPadding","Carousel padding",0,64),u("spiralWidth"),s("surfaceEnabled","Background"),...n("surfaceEnabled",!0,[i("surfaceColor","Color"),c("surfaceRadius","Corner radius",0,64)]),r("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),u("edgeFade"),u("spiralGap"),s("autoplay","Autoplay"),...n("autoplay",!0,[r("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),r("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...c("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:d=>d.playbackMode==="continuous"},{...c("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:d=>d.playbackMode==="step"}),g("Spiral",u("spiralRiseUnit"),{...u("spiralRise"),label:"Rise"},r("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),u("showSlots")),g("Image",r("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(d=>[d,d==="original"?"Original":d==="circle"?"Circle":d]))),r("fit","Image sizing",{cover:"Fill",contain:"Fit"}),c("imageWidth","Image width",20,100,"%"),r("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),c("imagePadding","Image padding",0,20,"%"),s("imageBorder","Image border"),...n("imageBorder",!0,[i("imageBorderColor","Color"),c("imageBorderSize","Thickness",0,12),c("imageRadius","Corner radius",0,64)]),R("shadowEnabled","Image shadow","shadow","shadowColor"),s("overlayEnabled","Overlay"),...n("overlayEnabled",!0,[i("imageTint","Color")])),b("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...M?[b("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],g("Card",u("cardWidth"),r("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),r("cardOrder","Element order",{media:"Media first",content:"Content first"}),c("cardPadding","Card padding",0,80),c("mediaGap","Space between image and text",0,80),c("titleGap","Space below title",0,80),...M?[c("buttonGap","Space above button",0,80)]:[],r("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),s("cardBackground","Background"),...n("cardBackground",!0,[i("cardColor","Color")]),s("cardBorderEnabled","Card border"),...n("cardBorderEnabled",!0,[i(f?"spiralRim":"borderColor","Color"),u("borderWidth")]),u(f?"spiralRadius":"radius"),R("cardShadow","Card shadow","cardShadow","cardShadowColor"),u("backFace"),u("backColor"),...n("backFace","mirror",[s("mirrorOverlay","Mirrored image overlay")]),{...i("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:d=>d.backFace==="mirror"}),g("Interaction",s("pauseOnHover","Pause on hover"),u("hoverEffect"),u("hoverAmount"),c("hoverDuration","Hover duration",0,1e3,"ms",10),r("clickAction","Card click",{source:e==="summary"?"Post button only":M?"Button only":"Image link only",link:e==="summary"?"Follow post link":M?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),u("reducedMotion")),g("Control styling",u("controlSize"),c("controlIconSize","Icon size",0,60),c("controlPadding","Button padding",0,32),u("controlShape"),u("arrowStyle"),s("controlBackground","Button background"),u("controlPalette"),u("controlInk"),u("controlFill")),g("Mobile",s("mobileSizing","Customize mobile sizing"),F("mobileCardWidth","cardWidth"),F("mobileGap",E),{...c("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...c("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},...f?[F("mobileSpiralWidth","spiralWidth")]:[],...M?[r("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...c("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),g("Theme",r("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...n("colorSource","custom",[i("background","Background"),i("ink","Text"),i("accent","Accent")]),r("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),a.find(d=>d.title==="Popup")];if(f)return P;e==="summary"&&(P.find(d=>d.title==="Popup").fields=[]);let y=P.find(d=>d.title==="Main carousel"),x=u("stageHeight");y.fields=[u("galleryWidth"),u("galleryHeight"),...x?[r("heightMode",x.label,{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...x,when:["heightMode","pixels"]},{...c("viewportHeight","Window height",15,100,"%"),when:["heightMode","viewport"]}]:[],...y.fields.filter(d=>["carouselPadding","surfaceEnabled","surfaceColor","surfaceRadius"].includes(d?.key)),u("gap"),u("edgeMode"),u("edgeFade"),u("autoplay"),u("duration")];for(let d of["aspectRatio","cardOrder","cardAlign"])P.flatMap($=>$?.fields||[]).find($=>$?.key===d).choices.unshift({value:"layout",label:"Layout default"});let A=P.find(d=>d.title==="Spiral");A.title="Layout",A.fields=[u("depth"),u("navigation")];let D=new Set;if(t.preset!=="ring")for(let d of["backFace","backColor","mirrorOverlay","mirrorColor"])D.add(d);if(v)for(let d of["showControls","pauseOnHover"])D.add(d);if(m)for(let d of["cardOrder","cardSizing","mediaGap"])D.add(d);S&&D.add("cardAlign");let j=P.find(d=>d.title==="Mobile");j.fields=j.fields.filter(d=>!["mobileHeightMode","mobileViewportHeight","mobileStageHeight"].includes(d.key)),x&&j.fields.push(r("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...x,key:"mobileStageHeight",label:"Mobile height",inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]});for(let d of P)d.fields=d.fields.filter(L=>L?.key&&!D.has(L.key));return P.filter(d=>d.fields.length&&!(v&&d.title==="Control styling"))}var It,Oi,Tt=Q(()=>{It={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},Oi=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function $i({range:t,swatch:e,select:o}){let r=(i,a)=>({key:i,label:a,type:"checkbox"});return[{title:"Card content",fields:[r("showImage","Show image"),r("showTitles","Show title"),r("showDescription","Show description"),r("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),r("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),r("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(i=>({...i,when:["shadowEnabled",!0]})),o("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[r("popupImage","Show popup image"),r("popupTitle","Show popup title"),r("popupDescription","Show popup description"),r("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),r("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Gi(t,e){if(!ii.has(e.preset))return e;let o={...e},r=getComputedStyle(t),i;for(let a of Bt){let s=e[a+"Swatch"],c=e[a];if(Object.hasOwn(oi,s)){let g=r.getPropertyValue("--"+s+"-hsl").trim();g&&(i??=document.createElement("canvas").getContext("2d"),i&&(i.fillStyle=c,i.fillStyle="hsl("+g+")",c=i.fillStyle))}let n=Math.round((e[a+"Opacity"]??100)*2.55);o[a]=n===255?c:c+n.toString(16).padStart(2,"0")}return o}function vt(t,e={}){if(t==="spiral")return{};let o=["wall","ring","angled"].includes(t);return{...It,aspectRatio:"layout",imagePadding:0,cardAlign:"layout",cardOrder:"layout",showDescription:["stack","arc-tabs","timed"].includes(t),showButton:!o,pauseOnHover:!0,mobileSizing:e.mobileCardWidth!=null||e.mobileGap!=null,cardBorderEnabled:e.borderWidth>0,overlayEnabled:e.overlayOpacity>0,imageTint:e.overlayColor||"#142036",imageTintOpacity:e.overlayOpacity||0}}var ii,oi,Bt,qt,Ft=Q(()=>{Tt();ii=new Set(["spiral","stack","infinite","arc","arc-tabs","timed","showcase","wall","ring","angled"]),oi={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},Bt=[...Oi,"borderColor","titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],qt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of Bt)qt[t+"Swatch"]="custom",qt[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function ai(t){let e=document.createElement("template");return e.innerHTML=t??"",e.content}function xt(t,e){if(e||=location.href,!t||!URL.canParse(t,e))return null;let o=new URL(t,e);return["http:","https:"].includes(o.protocol)?o.href:null}function Xi(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let o=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches(tr))return o;let r=t.localName==="h1"?"h2":t.localName,i;if(r==="img"){if(i=xt(t.dataset.src||t.dataset.image||t.getAttribute("src"),e),!i)return o}else r==="a"&&(i=xt(t.getAttribute("href"),e));let a=Qa.has(r)&&(r!=="a"||i)?document.createElement(r):o;r==="a"&&i?(a.href=i,a.rel="noopener noreferrer"):r==="img"&&(a.src=i,a.alt=t.alt,a.loading="lazy");for(let s of t.childNodes)a.append(Xi(s,e));return a}function Ui(t,e){let o=document.createDocumentFragment();for(let r of t.childNodes)o.append(Xi(r,e));return o}function ri(t){return t.textContent.replace(/\s+/g," ").trim()}function rr(t,e){let o=ri(e);if(!o&&!e.querySelector("img")||o&&ri(t)===o)return;let r=document.createElement("div");r.append(e),t.append(r)}function _i(t,e){let o=Array.isArray(e)?[...new Set(e.filter(r=>typeof r=="string").map(r=>r.trim()).filter(Boolean))]:[];t.replaceChildren(...o.map(r=>{let i=document.createElement("li");return i.textContent=r,i})),t.hidden=!o.length}function nr(t,e){return(t.blocks??[]).flatMap(o=>o.gallery?.slides??[]).flatMap(o=>{let r=xt(o.imageUrl,e);return r?[{src:r,alt:o.alt?.trim()||o.title?.trim()||"",caption:o.title?.trim()||"",description:o.descriptionHtml||""}]:[]})}function Vi(t,e,o){let r=document.createElement("dialog");r.className="gc-post-dialog",r.setAttribute("aria-label","Project details"),r.dataset.desktopLayout=e.popupDesktopLayout==="drawer"?"drawer":"split",r.dataset.reducedMotion=String(!!e.reducedMotion),e.popupPadding>0&&r.style.setProperty("--post-padding",e.popupPadding+"px"),e.popupRadius!=null&&r.style.setProperty("--post-radius",e.popupRadius+"px"),e.popupCustom&&e.popupColor&&e.popupInk&&(r.style.setProperty("--post-surface",e.popupColor),r.style.setProperty("--post-ink",e.popupInk),r.style.setProperty("--post-body",e.popupInk)),r.innerHTML=`
    <div class="gc-post-toolbar"><button type="button" class="gc-post-icon gc-post-close" aria-label="Close project" autofocus>${ar}</button></div>
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
            <button type="button" class="gc-post-icon" data-post-prev aria-label="Previous image">${ir}</button>
            <button type="button" class="gc-post-icon" data-post-next aria-label="Next image">${or}</button>
          </div>
        </div>
        <div class="gc-post-thumbs" role="group" aria-label="Select a project image" hidden></div>
      </section>
    </div>`;let i=q=>r.querySelector(q),a=i(".gc-post-close"),s=i(".gc-post-title"),c=i(".gc-post-reading"),n=i(".gc-post-categories"),g=i(".gc-post-tags"),u=i(".gc-post-pending"),f=i(".gc-post-status"),v=i(".gc-post-error-link"),S=i(".gc-post-link"),m=i(".gc-post-gallery"),E=i(".gc-post-layout"),M=i(".gc-post-image-well"),l=i(".gc-post-image"),h=i(".gc-post-image-description"),b=i(".gc-post-photo-nav"),R=i(".gc-post-image-label"),F=i(".gc-post-counter"),P=i(".gc-post-thumbs"),y=new AbortController,x=matchMedia("(max-width: 680px)"),A=[],D=0,j=null,d=xt(t,location.href);function L(){x.matches?E.prepend(m):E.append(m)}L(),x.addEventListener("change",L);function $(q){if(!A.length)return;D=(q+A.length)%A.length;let I=A[D];l.src=I.src,l.alt=I.alt,R.textContent=I.caption,R.hidden=!I.caption,F.textContent=D+1+" / "+A.length,h.replaceChildren(Ui(ai(I.description),d)),h.hidden=!ri(h);for(let[T,X]of Array.from(P.children).entries())T===D?X.setAttribute("aria-current","true"):X.removeAttribute("aria-current");let W=P.children[D];if(W&&P.clientWidth){let{left:T,right:X}=W.getBoundingClientRect(),B=P.getBoundingClientRect();T<B.left&&(P.scrollLeft+=T-B.left),X>B.right&&(P.scrollLeft+=X-B.right)}}function H(q){A=e.popupImage===!1?[]:q,m.hidden=!A.length,b.hidden=A.length<2,P.hidden=A.length<2,P.replaceChildren(...A.length>1?A.map((I,W)=>{let T=document.createElement("button"),X=document.createElement("img");return T.type="button",T.setAttribute("aria-label","Show image "+(W+1)+(I.caption?" \u2013 "+I.caption:"")),X.src=I.src,X.alt="",X.loading="lazy",T.append(X),T.addEventListener("click",()=>$(W)),T}):[]),r.toggleAttribute("data-without-gallery",!A.length),$(0)}function V(q,I){s.textContent=q||"",s.hidden=e.popupTitle===!1||!q,r.setAttribute("aria-label",q||"Project details"),S.hidden=e.popupButton===!1||!I,I&&(S.href=I)}function G(q){d=xt(q.url,d)||d;let I=q.title?.replace(/&(?:#(?:[0-9]+|x[0-9a-f]+)|[a-z][a-z0-9]+);/gi,W=>ai(W).textContent);if(V(I,d),e.popupDescription!==!1)for(let W of q.blocks??[]){if(!er.has(W.type))continue;let T=ai(W.html),X=T.querySelector(".sqs-html-content,.sqs-block-content")||T;rr(c,Ui(X,d))}_i(n,q.categories),_i(g,q.tags),H(nr(q,d))}return a.addEventListener("click",o),i("[data-post-prev]").addEventListener("click",()=>$(D-1)),i("[data-post-next]").addEventListener("click",()=>$(D+1)),r.addEventListener("keydown",q=>{A.length<2||q.altKey||q.metaKey||q.ctrlKey||["ArrowLeft","ArrowRight"].includes(q.key)&&(q.preventDefault(),$(D+(q.key==="ArrowLeft"?-1:1)))}),M.addEventListener("pointerdown",q=>{A.length<2||!q.isPrimary||q.pointerType==="mouse"||(j={id:q.pointerId,x:q.clientX,y:q.clientY},M.setPointerCapture(q.pointerId))}),M.addEventListener("pointercancel",()=>{j=null}),M.addEventListener("pointerup",q=>{if(j?.id!==q.pointerId)return;let I=q.clientX-j.x,W=q.clientY-j.y;j=null,Math.abs(I)>35&&Math.abs(I)>Math.abs(W)*1.2&&$(D+(I<0?1:-1))}),{dialog:r,async load(){try{let q=await jt(d,{signal:y.signal,includeSeo:!1});if(y.signal.aborted||(G(q),A.length&&await l.decode().catch(()=>{}),y.signal.aborted))return;u.hidden=!0,E.hidden=!1}catch{if(y.signal.aborted)return;u.removeAttribute("data-loading"),f.textContent="The project details couldn\u2019t load.",d&&e.popupButton!==!1&&(v.href=d,v.hidden=!1)}},destroy(){y.abort(),x.removeEventListener("change",L)}}}var Qa,er,tr,ir,or,ar,Yi=Q(()=>{ti();Qa=new Set("p h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" ")),er=new Set(["html","text","markdown","image"]),tr="script,style,template,noscript,iframe,form,svg,object,embed,video,audio,button",ir='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-14 0 6 6m-6-6 6-6"/></svg>',or='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',ar='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'});function ni(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],o=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${sr[t]}${o}</svg>`}function Ze(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?ni("play")+ni("pause"):ni(e),t}var sr,Rt=Q(()=>{sr={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Ie(t,e,o){let r=document.createElement(t);return r.className=e,o!==void 0&&(r.textContent=o),r}function mt(t,e,o){let r=Ie("button",t,o);return r.type="button",r.setAttribute("aria-label",e),r}function lr(t,e,o,r,i,a){let s=o/2,c=r/2,n=.26,g=e/2+48,u=(o*Math.cos(n)+a)/(2*Math.sin(n)),f=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-i)*.7),o*(3.8-i*2.1),c+Math.max(u,g/Math.sin(Math.PI/3))),v=f-c,S=Math.atan2(s,v),m=Math.hypot(s,v),E=2*(S+Math.asin(a/(2*m))),M=S+Math.asin(g/m),l=f+c,h=Math.hypot(l,s)-l,b=v-Math.sqrt((v-g)*(v+g));return{radius:f,step:E,reach:M/E,above:h,below:b}}function dr(t,e,o){let r=e/2,i=10+o*9,a=0,s=0;for(let c=0;c<4.1;c+=.5){let n=Math.min(4.1,c+.5),g=Math.max(.48,1-c*(.09+o*.035)),u=(n*(4+o*7)+(c===0?4:0))*Math.PI/180,f=g*(r+t/2*Math.sin(u))-r;a=Math.max(a,f-Math.min(c,4)*i),s=Math.max(s,f+Math.min(n,4)*i)}return{above:a,below:s}}function Ji({host:t,items:e=[],initialIndex:o=0,options:r={},makeCard:i,onChange:a,nativeList:s,loadImage:c}){let n=cr.has(r.preset)?r.preset:"infinite",g=n==="arc"||n==="arc-tabs",u=g||n==="showcase",f=e.length,v=!!r.reducedMotion,S=We(pt(r.depth,55),0,100)/100,m,E,M;function l(p){m=We(pt(p.gap,24),0,180),E=We(pt(p.cardWidth,n==="timed"?760:380),80,1800),M=p.phoneWidthOverride}l(r);let h=We(pt(r.duration,5),1,60)*1e3,b=Ie("section",`gc-carousel gc-preset-${n}`);b.setAttribute("aria-roledescription","carousel"),b.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[n]),b.style.setProperty("--gc-card-radius",`${We(pt(r.radius,14),0,120)}px`),b.style.setProperty("--gc-stage-height",`${We(pt(r.stageHeight,0),0,1400)}px`),v&&b.classList.add("gc-reduced-motion");let R=[],F=(p,C,z,N)=>{p.addEventListener(C,z,N),R.push(()=>p.removeEventListener(C,z,N))},P=[],y=[],x=r.navigation==="dots"||r.navigation!=="tabs"&&e.some(p=>!p.title?.trim()),A=n==="arc-tabs"||n==="timed"&&!x,D=Ie("nav","gc-carousel-tabs");x&&D.classList.add("gc-choice-dots"),D.setAttribute("aria-label","Choose a slide"),A&&(e.forEach((p,C)=>{let N=(typeof p.title=="string"?p.title.trim():"")||`Slide ${C+1}`,w=x?mt("gc-choice-dot",N):mt("gc-carousel-tab",N,N);F(w,"click",()=>He(C)),F(w,"keydown",k=>{let O;k.key==="ArrowRight"&&(O=dt(C+1,f)),k.key==="ArrowLeft"&&(O=dt(C-1,f)),k.key==="Home"&&(O=0),k.key==="End"&&(O=f-1),O!==void 0&&(k.preventDefault(),He(O),P[O]?.focus({preventScroll:!0}))}),D.append(w),P.push(w)}),b.append(D));let j=Ie("div","gc-carousel-stage");j.tabIndex=f?0:-1,j.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let d=s?.track??Ie("div","gc-carousel-track");d.classList.add("gc-carousel-track"),j.append(d),b.append(j);function L(p){let C=i(e[p],p,{caption:r.showTitles!==!1,description:n==="arc-tabs"||n==="timed"});C.classList.add("gc-carousel-card"),C.dataset.gcItemIndex=String(p),C.style.width="var(--gc-carousel-slot-width)",C.tabIndex=-1,C.setAttribute("aria-hidden","true"),s||C.querySelectorAll("img").forEach(N=>{N.draggable=!1,N.style.objectFit=r.fit==="contain"?"contain":"cover"});let z=s?.slot(C)??C;return d.append(z),{card:C,node:z,index:p,logical:p,active:!1}}let $=e.map((p,C)=>L(C)),H=new Map,V=!1,G=Ie("div","gc-carousel-controls"),q=Ie("div","gc-carousel-counter");q.setAttribute("aria-hidden","true");let I=Ie("span","gc-carousel-current",f?"01":"00");q.append(I,Ie("span","gc-carousel-divider","/"),Ie("span","gc-carousel-total",String(f).padStart(2,"0")));let W=Ie("div","gc-carousel-arrows"),T=Ze(mt("gc-carousel-arrow","Previous slide"),"previous"),X=Ze(mt("gc-carousel-arrow","Next slide"),"next");T.disabled=X.disabled=f<2,W.append(T,X);let B=Ze(mt("gc-carousel-playback","Play slideshow"),"playback");B.hidden=f<2||v;let K=Ie("div","gc-carousel-pagination");K.setAttribute("aria-label","Slide pagination"),n==="timed"&&e.forEach((p,C)=>{let z=mt("gc-carousel-dot",p.title?.trim()||`Go to slide ${C+1}`),N=Ie("span","gc-carousel-dot-fill");N.setAttribute("aria-hidden","true"),z.append(N),F(z,"click",()=>He(C)),K.append(z),y.push({dot:z,fill:N})}),G.append(q,W),n==="timed"&&G.append(K),G.append(B),b.append(G);let Y=Ie("p","gc-carousel-sr");Y.setAttribute("aria-atomic","true"),b.append(Y);let ee=Ie("span","gc-carousel-cursor","Drag");ee.setAttribute("aria-hidden","true"),(n==="arc-tabs"||n==="showcase"||n==="arc")&&j.append(ee),t.append(b);let de=!1,U=o,_=o,se=-1,oe=0,ne=0,he=0,pe=!!r.autoplay&&!v&&f>1,fe=!1,be=!1,Me=!1,ve=!1,ae=null,xe=0,Z=0,Ge=0,ge=0,Ve=()=>Math.max(12,ge*(.36-S*.12)+m-28),me=-1,ke,Pe=1,je=0,Te=0,qe=()=>ve||r.pauseOnHover&&fe||be||Me||document.hidden||!!ae,ct=p=>{let C=dt(Math.round(U),f),z=dt(p-C,f);return z>f/2&&(z-=f),Math.round(U)+z};function lt(){let p=P[se];if(!p)return;let C=p.offsetLeft,z=C+p.offsetWidth;C<D.scrollLeft?D.scrollLeft=Math.max(0,C-14):z>D.scrollLeft+D.clientWidth&&(D.scrollLeft=z-D.clientWidth+14)}function De(){let p=f?dt(Math.round(U),f):-1;if(p===se)return;se=p,I.textContent=f?String(p+1).padStart(2,"0"):"00",P.forEach((z,N)=>{z.classList.toggle("is-active",N===p),z.setAttribute("aria-pressed",String(N===p))}),lt(),y.forEach(({dot:z},N)=>{z.classList.toggle("is-active",N===p),N===p?z.setAttribute("aria-current","true"):z.removeAttribute("aria-current")});let C=e[p]?.title;Y.textContent=f?`${p+1} of ${f}${C?`: ${C}`:""}`:"No gallery items",p>=0&&a?.(p)}function Oe(){if(de||!Z)return;De();let p=Math.abs(_-U)>.002;b.classList.toggle("is-moving",p||!!ae);let C=[...$];for(let z of $)z.logical=z.index+Math.round((U-z.index)/f)*f;if(f>1){let z=ge+m,N=n==="infinite"&&Z>660?Z*.61:Z/2,w=(N+ge/2+40)/z,k=(Z-N+ge/2+40)/z;g?w=k=ke.reach:n==="showcase"&&(w=k=Math.min(4.1,(Z/2+ge)/Ve()));let O=Math.ceil(U-w),te=Math.floor(U+k);for(let[ie,ce]of H)(ie<O||ie>te||$[ce.index].logical===ie)&&(ce.node.remove(),H.delete(ie));for(let ie=O;ie<=te;ie++){let ce=dt(ie,f);if($[ce].logical===ie)continue;let J=H.get(ie);J||(J=L(ce),J.logical=ie,H.set(ie,J),V&&c&&J.card.querySelectorAll("img").forEach(le=>c(le,{nativeCard:!!s}))),C.push(J)}}C.forEach(z=>{let N=f===1?0:z.logical-U,w=Math.abs(N),k=z.logical===Math.round(U),O=Z/2,te=0,ie=0,ce=1,J=1,le=!0,we=0,ue=0;if(n==="infinite")O=(Z>660?Z*.61:Z/2)+N*(ge+m),J=1-Math.min(1,w)*.68,le=O+ge/2>-40&&O-ge/2<Z+40;else if(n==="timed")O+=N*(ge+m),ce=1-Math.min(w,1)*.035,le=O+ge/2>-40&&O-ge/2<Z+40;else if(n==="showcase")O+=N*Ve(),te+=Math.min(w,4)*(10+S*9),ce=Math.max(.48,1-w*(.09+S*.035)),ie=N*(4+S*7),ue=-N*(3+S*4),J=We(1-w*.19,0,1),le=w<4.1,k&&!v&&(we=Te,ue+=je,ie+=We(_-U,-1,1)*-3);else{let ye=N*ke.step;O+=ke.radius*Math.sin(ye),te=ke.radius*(1-Math.cos(ye)),ie=ye*180/Math.PI,le=w<=ke.reach,J=n==="arc-tabs"?1-Math.min(w,1)*.16:1}if(z.card.style.transform=`translate3d(${O}px,${te}px,0) translateX(-50%) rotate(${ie}deg) rotateX(${we}deg) rotateY(${ue}deg) scale(${ce})`,z.card.style.zIndex=String(1e3-Math.round(w*100)),z.card.style.opacity=String(J),z.card.style.visibility=le?"visible":"hidden",z.card.style.pointerEvents=le&&J>.08?"auto":"none",z.active!==k&&(z.active=k,z.card.classList.toggle("is-active",k)),z.card.tabIndex=k?0:-1,z.card.setAttribute("aria-hidden",String(!k)),s)s.syncFocus(z.card);else{let ye=z.card.querySelector(".gc-card-button");ye&&(ye.tabIndex=k?0:-1)}}),y.forEach(({fill:z},N)=>{z.style.transform=`scaleX(${N===se?We(he/h,0,1):0})`})}function Be(){let p=Z;Z=j.clientWidth;let C=M?1:n==="timed"?.86:n==="infinite"&&Z>660?.48:.76,z=Math.max(80,Math.min(E,Z*C));if(z!==ge&&(ge=z,d.style.setProperty("--gc-carousel-slot-width",`${ge}px`)),u){let N=d.offsetHeight;if(Z!==p||N!==me){me=N,g&&(ke=lr(n,Z,ge,me,S,m));let w=ke??dr(ge,me,S);f>1&&(j.style.setProperty("--gc-sweep-above",Math.ceil(w.above)+"px"),j.style.setProperty("--gc-sweep-below",Math.ceil(w.below)+"px"))}}Ge=j.clientHeight,Pe=g?ke.radius*ke.step:n==="showcase"?ge*.54:ge+m,Oe()}function Fe(){!de&&!oe&&(oe=requestAnimationFrame(et))}function et(p){if(oe=0,de)return;let C=ne?We(p-ne,0,64):0;ne=p,ae||(v?U=_:U+=(_-U)*(1-Math.exp(-C/85)),Math.abs(_-U)<5e-4&&(U=_));let z=Math.abs(_-U)<.002&&!ae;pe&&!qe()&&z&&(he+=C,he>=h&&(he=0,_=Math.round(U)+1)),Oe(),Math.abs(_-U)>5e-4||pe&&!qe()?Fe():ne=0}function He(p){de||f<2||(_=ct(dt(Math.round(pt(p,0)),f)),he=0,v&&(U=_),Oe(),Fe())}function Ye(p){f<2||(_=Math.round(_)+p,he=0,v&&(U=_),Oe(),Fe())}function Je(p){pe=!!p&&!v&&f>1,B.dataset.paused=String(!pe),B.setAttribute("aria-label",pe?"Pause slideshow":"Play slideshow"),B.setAttribute("aria-pressed",String(pe)),Y.setAttribute("aria-live",pe?"off":"polite"),b.classList.toggle("is-playing",pe),ne=0,Fe()}function Se(p){ve=!!p,ne=0,Fe()}F(T,"click",()=>Ye(-1)),F(X,"click",()=>Ye(1)),F(B,"click",()=>Je(!pe)),F(j,"keydown",p=>{p.key==="ArrowLeft"||p.key==="ArrowRight"?(p.preventDefault(),j.focus({preventScroll:!0}),Ye(p.key==="ArrowLeft"?-1:1)):(p.key==="Home"||p.key==="End")&&(p.preventDefault(),j.focus({preventScroll:!0}),He(p.key==="Home"?0:f-1))}),F(j,"pointerdown",p=>{f<2||p.button!==0||!p.isPrimary||(ae={id:p.pointerId,x:p.clientX,y:p.clientY,start:U,lastX:p.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},_=U,he=0)}),F(j,"pointermove",p=>{let C=j.getBoundingClientRect(),z=C.width/Math.max(1,j.clientWidth)||1,N=(p.clientX-C.left)/z,w=(p.clientY-C.top)/z;if(ee.style.left=`${N}px`,ee.style.top=`${w}px`,p.pointerType==="mouse"&&j.classList.add("has-pointer"),!ae){n==="showcase"&&!v&&(je=We((N-Z/2)/ge,-1,1)*4,Te=We((w-Ge/2)/Ge,-.5,.5)*-5,Oe());return}if(p.pointerId!==ae.id)return;let k=p.clientX-ae.x,O=p.clientY-ae.y;if(!ae.axis&&Math.hypot(k,O)>6&&(ae.axis=Math.abs(k)>Math.abs(O)?"horizontal":"vertical",ae.axis==="horizontal"&&(j.setPointerCapture(p.pointerId),j.classList.add("is-dragging"))),ae.axis!=="horizontal")return;p.preventDefault(),ae.moved=!0;let te=performance.now(),ie=Math.max(8,te-ae.lastTime),ce=-(p.clientX-ae.lastX)/z/Pe/ie;ae.velocity=ae.velocity*.45+ce*.55,ae.lastX=p.clientX,ae.lastTime=te,U=ae.start-k/z/Pe,_=U,Oe()},{passive:!1});function Ue(p){if(!ae||p.pointerId!==ae.id)return;let C=ae;if(ae=null,j.hasPointerCapture(p.pointerId)&&j.releasePointerCapture(p.pointerId),j.classList.remove("is-dragging"),C.moved){xe=performance.now()+400;let z=performance.now()-C.lastTime,N=v||p.type==="pointercancel"||z>120?0:We(C.velocity*210,-4,4);_=Math.round(U+N)}else _=Math.round(U);v&&(U=_),Fe()}F(j,"pointerup",Ue),F(j,"pointercancel",Ue),F(window,"pointerup",Ue),F(j,"lostpointercapture",p=>{ae?.id===p.pointerId&&Ue(p)}),F(j,"dragstart",p=>p.preventDefault()),F(j,"click",p=>{if(performance.now()<xe){p.preventDefault(),p.stopImmediatePropagation();return}let C=p.target.closest(".gc-carousel-card");!C||!j.contains(C)||C.classList.contains("is-active")||(p.preventDefault(),p.stopImmediatePropagation(),He(Number(C.dataset.gcItemIndex)))},!0),F(j,"pointerleave",()=>{j.classList.remove("has-pointer"),je=Te=0,ae||Oe()}),F(b,"pointerenter",p=>{p.pointerType==="mouse"&&(fe=!0)}),F(b,"pointerleave",()=>{fe=!1,ne=0,Fe()}),F(b,"focusin",()=>{be=!0}),F(b,"focusout",()=>{queueMicrotask(()=>{de||(be=b.contains(document.activeElement),ne=0,Fe())})}),F(document,"visibilitychange",()=>{ne=0,Fe()});let Re;typeof ResizeObserver<"u"?(Re=new ResizeObserver(p=>{p.some(({target:C})=>C===j||C===d)&&Be(),A&&p.some(({target:C})=>C!==j&&C!==d)&&lt()}),Re.observe(j),u&&Re.observe(d),A&&(Re.observe(D),P.forEach(p=>Re.observe(p,{box:"border-box"})))):F(window,"resize",()=>{Be(),lt()});let Ke;return typeof IntersectionObserver<"u"&&(Ke=new IntersectionObserver(p=>{Me=!p[0]?.isIntersecting,ne=0,Fe()}),Ke.observe(b)),Be(),V=!0,Je(pe),{goTo:He,setGeometry(p){l(p),me=-1,Be()},setPlaying:Je,setSuspended:Se,destroy(){de=!0,cancelAnimationFrame(oe),Re?.disconnect(),Ke?.disconnect(),R.forEach(p=>p()),b.remove()}}}var cr,We,dt,pt,Ki=Q(()=>{Rt();cr=new Set(["infinite","arc","arc-tabs","showcase","timed"]),We=(t,e,o)=>Math.min(o,Math.max(e,t)),dt=(t,e)=>(t%e+e)%e,pt=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Zi(t){let{host:e,makeCard:o,nativeList:r}=t,i=Array.isArray(t.items)?t.items:[],a=t.options||{},s=["wall","ring","angled"].includes(a.preset)?a.preset:"wall",c=!!a.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=i.length,g=s==="ring"?16:s==="wall"?12:n,u=!c&&n>1&&n<12&&s!=="angled"?Math.ceil(g/n)*n:n,f=Array.from({length:n},(p,C)=>C),v=tt(rt(a.depth,55),0,100),S=tt(rt(a.cardWidth,280),80,900),m=tt(rt(a.gap,24),0,160),E=Math.max(1,rt(a.duration,5)),M=new AbortController,l=(p,C,z,N={})=>p.addEventListener(C,z,{...N,signal:M.signal}),h={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},b=`gc-spatial-help-${++pr}`,R=["gc-spatial",`gc-${s}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...R);let F=new Map,P=(p,C)=>{F.set(p,e.style.getPropertyValue(p)),e.style.setProperty(p,C)};P("--gc-spatial-height",`${tt(rt(a.stageHeight,620),300,1400)}px`),P("--gc-spatial-radius",`${tt(rt(a.radius,18),0,100)}px`),P("--gc-spatial-fit",a.fit==="contain"?"contain":"cover"),P("--gc-spatial-card-width",`${S}px`),P("--gc-spatial-gap",`${m}px`);let y=r?.track??document.createElement("div");y.classList.add("gc-spatial-canvas"),r&&y.classList.add("gc-spatial-native-track"),y.setAttribute("role",r?"list":"group"),y.setAttribute("aria-label",h[s]),y.setAttribute("aria-describedby",b);let x=document.createElement("p");x.id=b,x.className="gc-spatial-sr",x.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let A=document.createElement("span");A.className="gc-spatial-sr",A.setAttribute("aria-live","polite"),A.setAttribute("aria-atomic","true"),e.append(x,y,A);let D=a.showTitles!==!1&&(s!=="ring"||c||n===1),j=Array.from({length:u},(p,C)=>{let z=C%n,N=i[z],w=o(N,z,{caption:D,description:!1,thumbnail:!0}),k=r?.slot(w)??document.createElement("div");return k.classList.add("gc-spatial-position"),w.classList.add("gc-spatial-card"),w.dataset.spatialIndex=String(C),w.dataset.spatialSourceIndex=String(z),w.tabIndex=C===0?0:-1,C>=n&&w.setAttribute("aria-hidden","true"),!w.getAttribute("aria-label")&&!w.textContent.trim()&&w.setAttribute("aria-label",`View item ${z+1}`),k.contains(w)||k.append(w),k.parentNode!==y&&y.append(k),{position:k,card:w,sourceIndex:z,x:0,y:0,flip:0,tilt:0,lift:0}}),d=document.createElement("div");d.className="gc-spatial-nav";let L=(p,C)=>{let z=document.createElement("button");return z.type="button",z.className="gc-spatial-control",z.setAttribute("aria-label",C),Ze(z,p)},$=L("previous","Previous item"),H=L("next","Next item"),V=document.createElement("span");V.className="gc-spatial-count",V.setAttribute("aria-hidden","true"),d.append($,V,H);let G=a.autoplay&&!c?L("playback","Pause gallery motion"):null;G&&(G.disabled=n<2,G.dataset.paused=String(n<2),G.disabled&&G.setAttribute("aria-label","Play gallery motion"),d.append(G)),e.append(d),$.disabled=H.disabled=n<2;let q,I;if(s==="ring"&&n>1&&!c){q=document.createElement("div"),q.className="gc-ring-center",q.setAttribute("aria-hidden","true"),a.showTitles!==!1&&(I=document.createElement("span"),I.className="gc-ring-label",q.append(I));let p=document.createElement("span");p.textContent="Drag to explore",q.append(p),y.after(q)}let W;n||(W=document.createElement(r?"li":"p"),W.className="gc-spatial-empty",W.textContent="No items available.",y.append(W));let T=!1,X=0,B=-1,K=1,Y=1,ee=1,de=1,U=1,_=1,se=0,oe=1,ne=1,he=0,pe=0,fe=1,be=!!a.autoplay&&!c&&n>1,Me=!1,ve=!1,ae=!1,xe=!0,Z=null,Ge=0,ge=0,Ve=0,me=-1,ke=!1,Pe={x:-1e4,y:-1e4,inside:!1};function je(p=X){if(!I)return;let C=typeof i[p]?.title=="string"?i[p].title.trim():"";I.textContent===C&&I.hidden===!C||(I.textContent=C,I.hidden=!C,Te())}function Te(){!q||T||(q.classList.remove("is-below"),q.offsetHeight>se&&q.classList.add("is-below"))}function qe(p,C=!1,z=null){if(!n){V.textContent="00 / 00";return}let N=gt(p,n),w=z!==null&&j[z]?.sourceIndex===N,k=w&&f[N]!==z;if(w){let O=j[f[N]].card;f[N]=z,k&&(j[z].card.removeAttribute("aria-hidden"),r?.syncFocus(j[z].card),document.activeElement===O&&(ke=!0,j[z].card.focus({preventScroll:!0}),ke=!1))}if(B===N&&!k){C&&(A.textContent=`Item ${N+1} of ${n}${i[N].title?`: ${i[N].title}`:""}`);return}X=N,je(),V.textContent=`${String(X+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`,j.forEach(({card:O,sourceIndex:te},ie)=>{let ce=f[te]===ie;if(O.tabIndex=ce&&te===X?0:-1,O.classList.toggle("is-selected",ce&&te===X),ce?O.removeAttribute("aria-hidden"):O.setAttribute("aria-hidden","true"),r)r.syncFocus(O);else{let J=O.querySelector(".gc-card-button");J&&(J.tabIndex=O.tabIndex)}}),C&&(A.textContent=`Item ${X+1} of ${n}${i[X].title?`: ${i[X].title}`:""}`),B!==X&&(B=X,t.onChange?.(X))}function ct(p){be=!!p&&!c&&n>1,G&&(G.dataset.paused=String(!be),G.setAttribute("aria-label",be?"Pause gallery motion":"Play gallery motion")),Se()}function lt(p){Me=!!p,Me||Se()}function De(p,C,z){return C+Math.round((p-C)/z)*z}function Oe(p){let C={index:f[p],target:p,distance:1/0};return j.forEach((z,N)=>{if(z.sourceIndex!==p)return;let w=N;if(s==="ring")w=De(he,N,u);else if(s==="wall"){let O=Math.floor(N/oe);w=ne>2?De(he,O,ne):O}let k=Math.abs(w-he);k<C.distance&&(C={index:N,target:w,distance:k})}),C}function Be(p){let C=p.getBoundingClientRect();return C.left+C.width/2}function Fe(){if(n<2)return;let p=Be(j[0].position),C=Be(j[1].position)-p;if(Math.abs(C)<1)return;let z=tt(Math.round((Be(y)-p)/C),0,n-1);qe(z,!1,z)}function et(p,C=!1){if(!n)return;let z=gt(Math.round(rt(p,0)),n),N=c?{index:z,target:z}:Oe(z);if(qe(z,!0,N.index),c){let w=j[z].position;y.scrollTo({left:y.scrollLeft+Be(w)-Be(y),behavior:"auto"})}else pe=N.target;C&&j[N.index].card.focus({preventScroll:!0}),Se()}function He(){if(!T){if(K=Math.max(1,y.clientWidth),Y=Math.max(1,y.clientHeight),s==="ring"){let p=Math.max(80,Math.min(K-32,Y-42)),C=tt(rt(a.ringDiameter,p),80,p);_=Math.max(0,C*.38);let z=si*_/Math.max(1,u),N=Math.min(C*.17,z*.8),w=1.15-tt(m,0,100)/160;if(ee=n<=1?Math.min(S,K*.65,Y*.58):Math.max(18,Math.min(Math.min(S*.22,N)*w,z*.94)),de=ee*1.28,q){let k=Math.max(0,_-Math.max(32,de)/2-10);se=Math.floor(k*Math.SQRT2),q.style.setProperty("--gc-ring-label-width",`${se}px`),q.style.setProperty("--gc-ring-label-y",`${y.offsetTop+Y/2}px`),Te()}U=Math.max(24,si*Math.max(1,_)/Math.max(1,u))}else s==="wall"?(oe=u>=10?3:u>=4?2:1,ne=Math.max(1,Math.ceil(u/oe)),de=Math.min((Y-56-(oe-1)*m)/oe,S*.62,230),ee=Math.max(60,Math.min(de*1.5,S,K*.43)),de=ee/1.5,U=ee+Math.min(m,70)):(ee=Math.min(S,K*.68,(Y-70)*.76),de=ee/.76,U=ee*(.72+(100-v)*.001)+m);j.forEach(({position:p})=>{p.style.width=`${Math.max(24,ee)}px`,p.style.height=`${Math.max(32,de)}px`}),c&&j.forEach(({position:p})=>{p.style.width=`${Math.min(S,K*.72)}px`,p.style.height=`${Math.min(Y-40,S*1.15)}px`}),Se()}}function Ye(p){if(c||!n||Me)return!1;let C=be&&!(a.pauseOnHover&&ve)&&!ae&&!Z&&xe&&!document.hidden;if(C){let k=p/E;s==="angled"?(pe+=k*fe,pe>=n-1&&(pe=n-1,fe=-1),pe<=0&&(pe=0,fe=1)):pe+=k}let z=Z?.moved?1:1-Math.exp(-p*11);he+=(pe-he)*z,Math.abs(pe-he)<1e-4&&(he=pe);let N=Math.abs(pe-he)>1e-4||C;if(C||Z?.moved){let k=Z?.moved?he:pe,O=s==="wall"?Math.round(k)*oe+f[X]%oe:Math.round(k),te=s==="wall"?Math.min(gt(O,ne*oe),u-1):gt(O,u);qe(j[te].sourceIndex,!1,te)}let w=1-Math.exp(-p*13);return j.forEach((k,O)=>{let{position:te,card:ie}=k;if(s==="ring"){let ce=-Math.PI/2+(O-he)*si/u;k.x=n===1?0:Math.cos(ce)*_,k.y=n===1?0:Math.sin(ce)*_;let J=Math.hypot(Pe.x-(K/2+k.x),Pe.y-(Y/2+k.y)),le=Math.max(65,ee*2.6),we=Pe.inside&&!Z?.moved?Math.max(0,1-J/le):0,ue=we*we*(50+v*1.3);k.flip+=(ue-k.flip)*w,Math.abs(k.flip-ue)>.05&&(N=!0),ie.toggleAttribute("data-gc-back-facing",k.flip>90);let ye=n===1?0:ce*180/Math.PI+90;te.style.transform=`translate3d(${k.x}px,${k.y}px,0) rotate(${ye}deg)`,ie.style.transform=`perspective(700px) rotateY(${k.flip}deg) translateZ(${we*12}px)`,te.style.zIndex=String(O===me?u+2:1)}else if(s==="wall"){let ce=O%oe,le=Math.floor(O/oe)-he;if(ne>2){let Et=ne%2===0?.5:0;le=gt(le-Et+ne/2,ne)-ne/2}let we=Math.min(.68,2.6/Math.max(3,ne)),ue=le*we,ye=Math.max(U/we,K*.4),_e=v/100,Ne=Math.sin(ue)*ye,Ce=(1-Math.cos(ue))*ye*_e*.65,$e=(ce-(oe-1)/2)*(de+Math.min(m,50)),ft=O===me||ae&&O===f[X]?1:0;k.lift+=(ft-k.lift)*w,Math.abs(ft-k.lift)>.002&&(N=!0),te.style.transform=`translate3d(${Ne}px,${$e}px,${Ce+k.lift*20}px) rotateY(${-ue*180/Math.PI*_e}deg)`,te.style.zIndex=String(Math.round(Ce)+(ft?1e3:1)),ie.style.transform=`scale(${1+k.lift*.035})`,te.style.opacity=Math.abs(ue)>1.6?"0":"1",te.style.visibility=Math.abs(ue)>1.6?"hidden":"visible"}else{let ce=O-he,J=O===me||ae&&O===f[X]?1:0;k.lift+=(J-k.lift)*w,Math.abs(J-k.lift)>.002&&(N=!0);let le=-(25+v*.28)*(1-k.lift);te.style.transform=`translate3d(${ce*U}px,${-k.lift*14}px,${k.lift*110}px) rotateY(${le}deg)`,te.style.zIndex=String(J?n+2:n-O),ie.style.transform="none"}}),N}function Je(p){if(ge=0,T)return;let C=Math.min(.05,Math.max(.001,(p-(Ve||p-16.7))/1e3));Ve=p,Ye(C)&&xe&&!document.hidden?ge=requestAnimationFrame(Je):Ve=0}function Se(){!T&&!ge&&!c&&(ge=requestAnimationFrame(Je))}c&&l(y,"scroll",Fe,{passive:!0}),l($,"click",()=>et(X-1)),l(H,"click",()=>et(X+1)),G&&l(G,"click",()=>ct(!be)),l(y,"keydown",p=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(p.key))return;p.preventDefault();let C=p.key==="Home"?0:p.key==="End"?n-1:X+(p.key==="ArrowRight"?1:-1);et(C,!0)}),l(y,"focusin",p=>{ae=!0;let C=p.target.closest?.("[data-spatial-index]");C&&!ke&&qe(Number(C.dataset.spatialSourceIndex),!1,Number(C.dataset.spatialIndex)),Se()}),l(y,"focusout",()=>{queueMicrotask(()=>{T||(ae=y.contains(document.activeElement),Se())})}),l(y,"pointerenter",p=>{p.pointerType!=="touch"&&(ve=!0,Pe.inside=!0,Se())}),l(y,"pointerleave",()=>{ve=!1,Pe.inside=!1,me=-1,je(),Se()}),l(y,"pointermove",p=>{if(p.pointerType==="touch")return;let C=y.getBoundingClientRect();Pe.x=p.clientX-C.left,Pe.y=p.clientY-C.top,Pe.inside=!0;let z=p.target.closest?.("[data-spatial-index]");me=z?Number(z.dataset.spatialIndex):-1,je(me>=0?j[me].sourceIndex:X),Se()}),l(y,"pointerdown",p=>{let C=p.target.closest?.("[data-spatial-index]");C&&qe(Number(C.dataset.spatialSourceIndex),!1,Number(C.dataset.spatialIndex)),!(c||n<2||p.pointerType==="mouse"&&p.button!==0)&&(Z={id:p.pointerId,x:p.clientX,y:p.clientY,start:pe,moved:!1})}),l(window,"pointermove",p=>{if(!Z||p.pointerId!==Z.id)return;let C=p.clientX-Z.x,z=p.clientY-Z.y;if(!Z.moved){if(Math.abs(z)>12&&Math.abs(z)>Math.abs(C)*1.2){Z=null;return}if(Math.abs(C)<7)return;Z.moved=!0,y.classList.add("is-dragging"),y.setPointerCapture?.(p.pointerId)}p.cancelable&&p.preventDefault(),pe=Z.start-C/U,(s==="angled"||s==="wall"&&ne<=2)&&(pe=tt(pe,0,s==="wall"?ne-1:n-1)),Se()},{passive:!1});let Ue=p=>{if(!Z||p.pointerId!==Z.id)return;let C=Z.moved;if(Z=null,y.classList.remove("is-dragging"),y.hasPointerCapture?.(p.pointerId)&&y.releasePointerCapture(p.pointerId),C){Ge=performance.now()+350,pe=Math.round(pe);let z=s==="wall"?Math.round(pe)*oe+f[X]%oe:Math.round(pe),N=s==="wall"?Math.min(gt(z,ne*oe),u-1):gt(z,u);qe(j[N].sourceIndex,!0,N)}Se()};l(window,"pointerup",Ue),l(window,"pointercancel",Ue),l(y,"click",p=>{performance.now()<Ge&&(p.preventDefault(),p.stopImmediatePropagation())},{capture:!0}),l(y,"dragstart",p=>p.preventDefault()),l(document,"visibilitychange",Se);let Re=typeof ResizeObserver=="function"?new ResizeObserver(p=>{p.some(C=>C.target===y)?He():Te()}):null;Re?.observe(y),q&&Re?.observe(q),Re||l(window,"resize",He);let Ke=typeof IntersectionObserver=="function"?new IntersectionObserver(p=>{xe=p[0]?.isIntersecting??!0,xe&&Se()},{rootMargin:"100px"}):null;return Ke?.observe(e),He(),qe(0),{goTo:et,setPlaying:ct,setSuspended:lt,destroy(){T||(T=!0,cancelAnimationFrame(ge),Re?.disconnect(),Ke?.disconnect(),M.abort(),x.remove(),A.remove(),d.remove(),q?.remove(),r?W?.remove():y.remove(),e.classList.remove(...R),F.forEach((p,C)=>p?e.style.setProperty(C,p):e.style.removeProperty(C)))}}}var pr,tt,gt,rt,si,Qi=Q(()=>{Rt();pr=0,tt=(t,e,o)=>Math.max(e,Math.min(o,t)),gt=(t,e)=>(t%e+e)%e,rt=(t,e)=>Number.isFinite(Number(t))?Number(t):e,si=Math.PI*2});function eo({host:t,items:e,options:o,makeCard:r,onChange:i,nativeList:a}){let s=Number(o.stageHeight)||680,c=Math.max(300,s-120),n=Math.max(0,Number(o.gap)||0),g=Number.isFinite(Number(o.depth))?Number(o.depth):45,u=o.previewScroll===!1,f=u?window:t;t.classList.add("gc-stack"),t.style.height=u?"auto":s+"px",t.style.overflowY=u?"visible":"auto",t.style.overscrollBehavior=u?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let v=a?.track??document.createElement("div");v.classList.add("gc-stack-track"),t.append(v);let S=e.map((R,F)=>{let P=r(R,F,{caption:o.showTitles,description:!0}),y=a?.slot(P)??document.createElement("div");y.classList.add("gc-stack-slot"),P.parentElement!==y&&y.append(P),v.append(y),y.style.zIndex=F+1,P.style.width=`min(${o.stackCardWidth}px,calc(100% - 48px))`,P.style.minHeight=c+"px";let x=P.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),A=!Array.from(x).some(D=>!D.closest("[hidden]")&&D.textContent.trim());return P.classList.toggle("gc-stack-image-only",A),{card:P,wrap:y,imageOnly:A,start:0,duration:1/0}}),m=0;function E(){return u?-v.getBoundingClientRect().top:t.scrollTop}function M(){m=0;let R=E(),F=0;S.forEach(({card:P,start:y,duration:x},A)=>{let D=Math.max(0,Math.min(1,(R-y)/x));P.style.transform=o.reducedMotion?"none":`perspective(1300px) translateY(${D*-32}px) scale(${1-D*.14}) rotateX(${D*g*.25}deg)`,P.style.filter=`brightness(${1-D*.23})`,D>=.5&&(F=Math.min(A+1,S.length-1))}),S.length&&i?.(F)}function l(){m||(m=requestAnimationFrame(M))}function h(){if(o.cardSizing==="equal"&&S.length){for(let{card:x}of S)x.style.minHeight=c+"px";let y=Math.max(...S.map(({card:x})=>x.offsetHeight));for(let{card:x}of S)x.style.minHeight=y+"px"}let R=S.map(({card:y,wrap:x})=>({height:y.offsetHeight,rowHeight:x.offsetHeight})),F=u?window.innerHeight:t.clientHeight,P=v.clientTop+(parseFloat(getComputedStyle(v).paddingTop)||0);S.forEach((y,x)=>{let{height:A,rowHeight:D}=R[x],j=Math.min(40,F-24-A);y.wrap.style.top=j+"px",y.start=P-j,x&&(S[x-1].duration=Math.max(1,y.start-S[x-1].start));let d=y.imageOnly&&A<=F-64?A*.24:0,L=x<S.length-1?n-d:0;y.wrap.style.marginBottom=L+"px",P+=D+L,x===S.length-1&&(y.duration=1/0,v.style.paddingBottom=Math.max(40,F-j-D)+"px")}),l()}let b;return h(),typeof ResizeObserver<"u"&&(b=new ResizeObserver(h),b.observe(v,{box:"border-box"}),S.forEach(({card:R})=>b.observe(R,{box:"border-box"}))),window.addEventListener("resize",h),f.addEventListener("scroll",l,{passive:!0}),{goTo(R){let F=S[Math.max(0,Math.min(S.length-1,Math.round(R)))];if(!F)return;let P=u?window.scrollY+F.start-E():F.start;f.scrollTo({top:P,behavior:o.reducedMotion?"instant":"smooth"})},destroy(){b?.disconnect(),window.removeEventListener("resize",h),cancelAnimationFrame(m),f.removeEventListener("scroll",l),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",v.remove()}}}var to=Q(()=>{});function Dt(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function ci(t,e,o,r,i,a){t.beginPath(),t.roundRect(e,o,r,i,Math.max(0,Math.min(a,r/2,i/2)))}function gr(t,e,o){let r=[];for(let i of e.split(/\n/)){let a="";for(let s of i.split(/\s+/)){let c=a?a+" "+s:s;a&&t.measureText(c).width>o?(r.push(a),a=s):a=c}r.push(a)}return r}function io(t,e,o){let r=Math.max(80,e.cardWidth),i=Math.min(e.cardPadding,r*.4),a=r-2*i,s=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,c=document.createElement("canvas").getContext("2d"),n=t.map(({item:u,image:f})=>{let v=[],S=(F,P,y,x,A,D,j=!1,d=o.bodyFamily)=>{if(!F)return;let L=y+" "+P+"px "+d;c.font=L;let $=gr(c,F,Math.max(1,a-(j?16:0)));v.push({font:L,size:P,color:x,align:A,lines:$,height:$.length*P*1.25+(j?10:0),gap:D,isButton:j})},m=a*e.imageWidth/100,E=f?.naturalWidth/f?.naturalHeight||1,[M,l]=e.aspectRatio.split(":").map(Number),h=e.aspectRatio==="circle"?1:M&&l?M/l:E,b=f&&e.showImage?{image:f,width:m,height:m/h,gap:0}:null;return(e.textPlacement==="card"||!u.src||!e.showImage)&&(e.showTitles&&S(u.title,e.titleCustom&&e.titleSize?e.titleSize*s:o.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:o.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:o.ink,e.titleAlign,0,!1,o.family),e.showDescription&&S(u.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*s:o.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:o.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:o.ink,e.descriptionAlign,v.length?e.titleGap:0),e.showButton&&u.buttonLabel&&u.link&&S(u.buttonLabel,o.size,o.weight,o.buttonInk,"center",e.buttonGap,!0)),b&&(e.cardOrder==="content"?(b.gap=v.length?e.mediaGap:0,v.push(b)):(v.length&&(v[0].gap+=e.mediaGap),v.unshift(b))),{pieces:v,height:Math.max(1,2*i+v.reduce((F,P)=>F+P.gap+P.height,0))}}),g=Math.max(1,...n.map(u=>u.height));return n.map(({pieces:u,height:f})=>{let v=document.createElement("canvas"),S=Math.min(2,2048/Math.max(r,g));v.width=Math.max(1,Math.round(r*S)),v.height=Math.max(1,Math.round(g*S));let m=v.getContext("2d");m.scale(S,S);let E=e.cardSizing==="equal"?g:f,M=(g-E)/2;e.cardBackground&&(m.fillStyle=e.cardColor,ci(m,0,M,r,E,e.spiralRadius),m.fill());let l=M+i+(e.cardAlign==="bottom"?E-f:e.cardAlign==="middle"?(E-f)/2:0),h;for(let b of u){if(l+=b.gap,b.image){let R=b.image.naturalWidth/b.image.naturalHeight,F=e.fit==="contain"||e.fit==="fit",P=F?Math.min(b.width,b.height*R):b.width,y=F?P/R:b.height,x=i+(e.imageAlign==="left"?0:e.imageAlign==="right"?a-b.width:(a-b.width)/2)+(b.width-P)/2,A=l+(b.height-y)/2,D=e.aspectRatio==="circle"?b.width/2:e.imageRadius;if(e.shadowEnabled){m.save(),m.shadowColor=e.shadowColor,m.shadowBlur=e.shadowBlur*S;let $=e.shadowAngle*Math.PI/180;m.shadowOffsetX=Math.cos($)*e.shadowDistance*S,m.shadowOffsetY=Math.sin($)*e.shadowDistance*S;let H=e.shadowSpread;ci(m,x-H,A-H,P+2*H,y+2*H,D+H),m.fillStyle=e.shadowColor,m.fill(),m.restore()}m.save(),e.aspectRatio==="circle"&&(m.beginPath(),m.arc(x+P/2,A+y/2,b.width/2,0,Math.PI*2),m.clip()),ci(m,x,A,P,y,e.aspectRatio==="circle"?0:D),m.clip();let j=F?Math.min(P/b.image.naturalWidth,y/b.image.naturalHeight):Math.max(P/b.image.naturalWidth,y/b.image.naturalHeight),d=b.image.naturalWidth*j,L=b.image.naturalHeight*j;m.drawImage(b.image,x+(P-d)/2,A+(y-L)/2,d,L),e.overlayEnabled&&(m.fillStyle=e.imageTint,m.fillRect(x,A,P,y)),e.imageBorder&&(m.strokeStyle=e.imageBorderColor,m.lineWidth=2*e.imageBorderSize,m.stroke()),m.restore()}else{let R=b.align==="inherit"?"center":b.align;if(m.font=b.font,m.textBaseline="top",m.textAlign=R,m.fillStyle=b.color,b.isButton){let P=Math.min(a,Math.max(...b.lines.map(x=>m.measureText(x).width))+16),y=(r-P)/2;m.fillStyle=o.accent,m.fillRect(y,l,P,b.height),m.fillStyle=b.color,h={left:y/r,right:(y+P)/r,top:l/g,bottom:(l+b.height)/g}}let F=R==="left"?i:R==="right"?r-i:r/2;b.lines.forEach((P,y)=>m.fillText(P,F,l+(b.isButton?5:0)+y*b.size*1.25,a))}l+=b.height}return{canvas:v,buttonBounds:h,aspect:r/g}})}var oo=Q(()=>{});var ao,Ht,ro=Q(()=>{ao='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',Ht=class{constructor(e,o,r){this.root=e,this.cards=o,this.projects=r;let i=o[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(i)?i:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${ao}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${ao}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",c=>{if(c.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(c.clientX<n.left||c.clientX>n.right||c.clientY<n.top||c.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",c=>{(c.key==="ArrowLeft"||c.key==="ArrowRight")&&(c.preventDefault(),this.showFrame(this.frame+(c.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",c=>{!c.isPrimary||c.target.closest("button")||(this.galleryPointer={id:c.pointerId,x:c.clientX,y:c.clientY},s.setPointerCapture(c.pointerId))}),s.addEventListener("pointerup",c=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==c.pointerId)return;s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId);let g=c.clientX-n.x,u=c.clientY-n.y;Math.abs(g)>35&&Math.abs(g)>Math.abs(u)*1.2&&this.showFrame(this.frame+(g<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let o=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!o,this.dialog.querySelector("[data-gallery-next]").hidden=!o,this.thumbnails.hidden=!o,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(i=>{let a=document.createElement("li");return a.textContent=i,a})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((i,a)=>{let s=document.createElement("button");s.type="button",s.className="project-thumbnail",s.setAttribute("aria-label",`Show ${i.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(i.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,s.append(c),s.addEventListener("click",()=>this.showFrame(a)),s})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let o=this.project.gallery[this.frame];this.image.src=new URL(o.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${o.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${o.label}`,[...this.thumbnails.children].forEach((r,i)=>r.setAttribute("aria-current",String(i===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Qe,wt,Wt=Q(()=>{Tt();Qe=Object.freeze({...It,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),wt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function no(t,e,{pauseOnHover:o=!0,interactionRestMs:r=6e3}={}){let i=t.querySelector("[data-orbit-toggle]"),a=new AbortController,s=(h,b,R)=>h.addEventListener(b,R,{signal:a.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let n=0,g=0,u=!1,f=h=>!!h&&t.contains(h)&&(h.matches(":focus-visible")||!!h.closest(".orbit-card")),v=()=>!u&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,S=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(n),e.autoFrame=0,n=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},m=h=>{if(e.autoFrame=0,!v()){S();return}let b=Math.min(.05,Math.max(0,(h-e.autoTime)/1e3));e.autoTime=h;let R=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(g+=b,g>=Number(t.dataset.interval||5)){g=0,e.autoTime=0,c.animateTo.call(e,Math.round(e.position)+R),n=setTimeout(E,100);return}}else e.position=(e.position+R*b*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(m)},E=()=>{if(!v()){S(),e.frame&&!u&&(n=setTimeout(E,100));return}let h=e.resumeAt-performance.now();if(h>0){S(),n=setTimeout(E,h);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(m))},M=(h=6e3)=>{S(),e.resumeAt=performance.now()+h};e.animateTo=function(...h){M(r),c.animateTo.apply(this,h),E()},e.settleImmediately=function(...h){c.settleImmediately.apply(this,h),E()},e.openProject=function(...h){M(),c.openProject.apply(this,h),E()},s(t,"pointerenter",h=>{h.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||o)&&(e.hovered=!0,E())}),s(t,"pointerleave",h=>{h.pointerType!=="touch"&&(e.hovered=!1,E())}),s(t,"focusin",h=>{e.keyboardFocused=f(h.target),E()}),s(t,"focusout",h=>{e.keyboardFocused=f(h.relatedTarget),E()}),s(t,"pointerup",()=>{M(r),E()}),s(t,"pointercancel",()=>{M(r),E()}),s(e.viewer.dialog,"close",()=>{M(),E()}),s(document,"visibilitychange",E),s(e.reducedMotion,"change",E),s(i,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,i.dataset.paused=String(e.manuallyPaused),i.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),E()});let l=new IntersectionObserver(h=>{e.inView=h.some(b=>b.isIntersecting&&b.intersectionRatio>=.15),E()},{threshold:.15});return l.observe(e.stage),e.stopAutoplay=S,e.syncAutoplay=E,()=>{u=!0,S(),a.abort(),l.disconnect(),Object.assign(e,c)}}var so=Q(()=>{});var Ae,co,li,lo,po,go,uo,ho,fo,mo,bo,yo,vo,xo,Ot,wo,kt,ko,di=Q(async()=>{Ae=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),co=Ae.CanvasTexture,li=Ae.BufferGeometry,lo=Ae.Float32BufferAttribute,po=Ae.LineBasicMaterial,go=Ae.LineLoop,uo=Ae.DoubleSide,ho=Ae.Mesh,fo=Ae.NoToneMapping,mo=Ae.PerspectiveCamera,bo=Ae.PlaneGeometry,yo=Ae.Raycaster,vo=Ae.Scene,xo=Ae.ShaderMaterial,Ot=Ae.SRGBColorSpace,wo=Ae.TextureLoader,kt=Ae.Vector2,ko=Ae.WebGLRenderer});var ur,St,So=Q(async()=>{ur=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),St=ur.default});var hr,pi,Co=Q(async()=>{hr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),pi=hr.CustomEase});function Mo(t,e,o=64){let r=t/e,i=new bo(t,t*9/16,o,1),a=i.attributes.position,s=i.attributes.uv;for(let c=0;c<a.count;c++){let n=(s.getX(c)-.5)*e;a.setX(c,r*Math.sin(n)),a.setZ(c,r*(Math.cos(n)-1))}return i.computeVertexNormals(),i.computeBoundingSphere(),i}function Ao(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var gi=Q(async()=>{await di()});function Ct(t,e){let o=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*o,panelArc:t.radiansPerSlide*o,height:t.slotHeight*o}}function Nt(t,{radius:e,pitch:o,radiansPerSlide:r}){let i=t*r;return{x:Math.sin(i)*e,y:-t*o,z:(Math.cos(i)-1)*e,angle:i,taper:1,shade:(1-Math.cos(i))/2*.58}}function Eo(t,e){let o=Ct(t,e);return Mo(o.cardWidth,o.panelArc)}function ui(t,e=64){let o=[];for(let r=0;r<=e;r++){let i=(r/e-.5)*t.radiansPerSlide;o.push(t.radius*Math.sin(i),t.slotHeight/2,t.radius*(Math.cos(i)-1))}for(let r=e;r>=0;r--){let i=(r/e-.5)*t.radiansPerSlide;o.push(t.radius*Math.sin(i),-t.slotHeight/2,t.radius*(Math.cos(i)-1))}return o}var $t=Q(async()=>{await gi()});function hi(t,e){let o=Eo(t,e);return o.scale(1,1/t.aspect/(9/16),1),o.computeVertexNormals(),o.computeBoundingSphere(),o}function Po(t,e,o,r,i){let a=Math.min(t,e)*Math.min(40,Math.max(0,i))/100,s=t-2*a,c=e-2*a,n=s/c,g=r==="fit"?Math.max:Math.min,u=g(1,n/o),f=g(1,o/n);return{contentWidth:s,contentHeight:c,uvScaleX:u,uvScaleY:f,imageWidth:s/u,imageHeight:c/f,padding:a}}var Lo=Q(async()=>{await $t();await $t()});function fi({stageWidth:t,stageHeight:e,spiralWidthPercent:o,cardWidth:r,aspect:i,rise:a,riseUnit:s}){let c=Math.max(1,t*o/200),n=Math.max(1,Math.min(r,c*Math.PI/3,e*.4*i)),g=Math.PI*2*c/n,u=s==="percent"?e*a/100:a*Math.min(1,t/640);return{radius:c,slotWidth:n,slotHeight:n/i,aspect:i,pitch:Math.max(n/i*1.25/g,u),radiansPerSlide:n/c,cardsPerTurn:Math.PI*2*c/n}}var zo=Q(()=>{});function Io(t,e,o){let r=e.radius*2.4,i=r/(r+2*e.radius),a=Math.ceil((o/(2*i)+e.slotHeight/2)/e.pitch)+2,s=Math.floor(t);return{first:s-a,last:s+a,count:a*2+1}}function To(t,e,o){let r=t*e.radiansPerSlide,i=r-o.panelArc/2,a=r+o.panelArc/2,s=Math.PI*2,c=M=>Math.ceil((i-M)/s)<=Math.floor((a-M)/s),n=c(0)?1:Math.max(Math.cos(i),Math.cos(a)),g=c(Math.PI)?-1:Math.min(Math.cos(i),Math.cos(a)),u=e.radius*2.4,f=u/(u+e.radius*(1-n)),v=u/(u+e.radius*(1-g)),S=-t*e.pitch,m=S+o.height/2,E=S-o.height/2;return{minY:Math.min(E*f,E*v),maxY:Math.max(m*f,m*v)}}function qo(t,e){let o=Math.min(80,e*.08),r=a=>Math.max(0,Math.min(1,a)),i=Math.min(r((e/2-t.minY)/o),r((t.maxY+e/2)/o));return i*i*(3-2*i)}function Bo(t,e,o,r){let i=o-e;return Math.abs(i)>r/2&&(i-=Math.round(i/r)*r),t+i}var jo,Fo=Q(async()=>{await $t();zo();jo=(t,e)=>(t%e+e)%e});var Do,Ro=Q(()=>{Do=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function Ho(t,{textureSource:e=o=>o.querySelector("img").src}={}){let{root:o,stage:r}=t,i;try{i=new ko({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return o.dataset.renderer="css-fallback",()=>{delete o.dataset.renderer}}i.outputColorSpace=Ot,i.toneMapping=fo,i.setClearColor(0,0);let a=i.domElement;a.style.removeProperty("display"),a.className="orbit-webgl",a.setAttribute("aria-hidden","true"),r.append(a);let s=new vo,c=new mo,n=new yo,g=new kt,u=new AbortController,f=(B,K,Y)=>B.addEventListener(K,Y,{signal:u.signal}),v=t.render,S=t.pointerDown,m=new Map,E=new Map;function M(){for(let B of t.cards){let K=E.get(B);if(K?.image!==B.artwork&&(K?.dispose(),E.delete(B),B.artwork)){let Y=new co(B.artwork);Y.colorSpace=Ot,E.set(B,Y)}}}let l=[],h,b,R=t.position,F=t.position,P="",y=!1,x=!1,A=null,D=null,j=!1,d=!1;o.dataset.renderer="loading-webgl";let L=()=>fi({stageWidth:r.clientWidth,stageHeight:r.clientHeight,spiralWidthPercent:Number(o.dataset.spiralWidth),cardWidth:Number(o.dataset.cardWidth),aspect:Number(o.dataset.cardAspect),rise:Number(o.dataset.rise),riseUnit:o.dataset.riseUnit}),$=()=>{let B=t.cards[0],K=new xo({uniforms:{screenshot:{value:m.get(e(B))},dimensions:{value:new kt},contentDimensions:{value:new kt(1,1)},imageScale:{value:new kt(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:mr,fragmentShader:br,transparent:!0,side:uo,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),Y=new ho(h,K),ee=new go(b,new po({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),de={card:B,mesh:Y,guide:ee,material:K,surface:{scale:0,target:0}};Y.userData.panel=de,l.push(de),s.add(Y,ee)},H=B=>{let K=Io(R,B,r.clientHeight);for(;l.length<K.count;)$();for(;l.length>K.count;){let Y=l.pop();s.remove(Y.mesh,Y.guide),Y.material.dispose(),Y.guide.material.dispose()}l.forEach((Y,ee)=>{Y.offset=K.first+ee-R,Y.card=t.cards[jo(K.first+ee,t.count)],Y.material.uniforms.screenshot.value=E.get(Y.card)||m.get(e(Y.card))})},V=()=>{let B=r.clientWidth,K=r.clientHeight,Y=L(),ee=Number(o.dataset.slotGap||3);H(Y);let de=Ct(Y,ee),{cardWidth:U,panelArc:_}=de,{radius:se}=Y;o.dataset.slotMetrics=JSON.stringify({...Y,cardArc:_,cardWidth:U,cardHeight:de.height,gap:ee,imageFit:o.dataset.imageFit,imagePadding:Number(o.dataset.imagePadding||0)}),l.forEach(fe=>{fe.material.uniforms.dimensions.value.set(U,de.height);let be=fe.material.uniforms;be.cornerRadius.value=Math.min(Number(o.dataset.cornerRadius)||0,U/2,de.height/2),be.borderWidth.value=Number(o.dataset.borderWidth)||0,be.solidBack.value=o.dataset.backFace==="solid",be.showImage.value=!!fe.card.artwork||o.dataset.showImage!=="false";for(let ae of["backColor","borderColor","imageTint","mirrorColor"]){let xe=be[ae],Z=ae==="imageTint"&&fe.card.artwork?"#00000000":o.dataset[ae]||"#00000000";if(xe.hex!==Z){xe.hex=Z;let Ge=Z.length===7?Z+"ff":Z;xe.value=[1,3,5,7].map(ge=>parseInt(Ge.slice(ge,ge+2),16)/255)}}let Me=fe.material.uniforms.screenshot.value.image;if(!Me)return;let ve=Po(U,de.height,(Me.naturalWidth||Me.width)/(Me.naturalHeight||Me.height),fe.card.artwork?"fit":o.dataset.imageFit,fe.card.artwork?0:Number(o.dataset.imagePadding||0));fe.material.uniforms.contentDimensions.value.set(ve.contentWidth,ve.contentHeight),fe.material.uniforms.imageScale.value.set(ve.uvScaleX,ve.uvScaleY)});let oe=Math.min(window.devicePixelRatio||1,2),ne=`${B}:${K}:${U}:${_}:${de.height}:${se}:${oe}`;if(ne===P||!B||!K)return;P=ne,i.setPixelRatio(oe),i.setSize(B,K,!1),c.position.set(0,0,se*2.4),c.fov=Ao(K,c.position.z),c.aspect=B/K,c.near=.1,c.far=se*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let he=h;h=hi(Y,ee);let pe=b;b=new li,b.setAttribute("position",new lo(ui(Y),3)),l.forEach(fe=>{fe.mesh.geometry=h,fe.guide.geometry=b,fe.material.uniforms.dimensions.value.set(U,de.height)}),he?.dispose(),pe?.dispose()},G=()=>{if(!y||x||j||d||!t.geometry)return;d=!0,R=Bo(R,F,t.position,t.count),F=t.position,V();let B=L(),K=Ct(B,Number(o.dataset.slotGap||3)),Y=o.dataset.focusMode==="keyboard"&&o.contains(document.activeElement),ee=0;l.forEach(U=>{let{card:_,mesh:se,material:oe}=U,ne=Nt(U.offset,B),he=To(U.offset,B,K),pe=qo(he,r.clientHeight),fe=o.dataset.edgeMode==="preset"?pe:+(pe>0),be=Y&&_===t.cards[t.active]&&Math.abs(U.offset)<.5;oe.polygonOffsetUnits=Math.abs(U.offset)*8,se.position.set(ne.x,ne.y,ne.z),se.rotation.y=ne.angle;let Me=U===A&&!t.pointer&&!t.reducedMotion.matches,ve=Number(o.dataset.hoverAmount)||0,ae=Me?1:0;U.surface.target!==ae&&(U.surface.target=ae,St.to(U.surface,{scale:ae,duration:(Number(o.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:G})),se.scale.setScalar(o.dataset.hoverEffect==="zoom"?1+U.surface.scale*ve/100:1),o.dataset.hoverEffect==="lift"&&(se.position.y+=U.surface.scale*ve),se.visible=fe>.001&&!!oe.uniforms.screenshot.value.image,se.visible&&ee++,U.guide.position.copy(se.position),U.guide.rotation.copy(se.rotation),U.guide.visible=o.dataset.showSlots==="true"&&se.visible,U.guide.material.opacity=fe*.42,oe.uniforms.fade.value=fe,oe.uniforms.shade.value=ne.shade,oe.uniforms.focused.value=be?1:0});let de=JSON.stringify({cardsPerTurn:B.cardsPerTurn,visibleCount:ee,poolCount:l.length,stageWidth:r.clientWidth,stageHeight:r.clientHeight,cardWidth:K.cardWidth,cardHeight:K.height,pitch:B.pitch,radius:B.radius,uniqueCount:t.count});o.dataset.responsiveMetrics!==de&&(o.dataset.responsiveMetrics=de),D&&!t.pointer&&(A=q(D)),s.updateMatrixWorld(!0),i.render(s,c),d=!1},q=B=>{if(!y||j)return null;let K=a.getBoundingClientRect();g.set((B.clientX-K.left)/K.width*2-1,-(B.clientY-K.top)/K.height*2+1),n.setFromCamera(g,c);for(let Y of n.intersectObjects(l.map(ee=>ee.mesh))){let ee=Y.object.userData.panel;if(!Y.object.visible||ee.material.uniforms.fade.value<=.25)continue;let{x:de,y:U}=ee.material.uniforms.dimensions.value,_=ee.material.uniforms.cornerRadius.value,se=Math.abs((Y.uv.x-.5)*de)-de/2+_,oe=Math.abs((Y.uv.y-.5)*U)-U/2+_;if(!(Math.hypot(Math.max(se,0),Math.max(oe,0))+Math.min(Math.max(se,oe),0)>_))return ee.hitUv=Y.uv,ee}return null};t.render=function(){v.call(this),G()},t.pointerDown=function(B){if(S.call(this,B),y&&!j&&this.pointer?.id===B.pointerId){let K=q(B);this.pointer.card=K?.card||null;let Y=K?.card.buttonBounds,ee=K?.hitUv;Y&&ee.x>=Y.left&&ee.x<=Y.right&&1-ee.y>=Y.top&&1-ee.y<=Y.bottom&&(this.pointer.buttonLink=K.card.dataset.buttonLink)}D=null,A=null},f(r,"pointermove",B=>{D=B.pointerType==="mouse"?{clientX:B.clientX,clientY:B.clientY}:null,A=B.pointerType==="mouse"&&!t.pointer?q(B):null,a.style.cursor=t.pointer?.dragging?"grabbing":A?"pointer":"grab",G()}),f(r,"pointerleave",()=>{D=null,A=null,G()}),f(r,"pointerup",()=>{A=null,G()}),f(o,"focusin",G),f(o,"focusout",()=>queueMicrotask(G)),f(document,"keydown",()=>queueMicrotask(G)),f(document,"pointerdown",()=>queueMicrotask(G)),f(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&l.forEach(({surface:B})=>{St.killTweensOf(B),B.scale=B.target}),G()}),f(o,"playground-change",()=>{M(),G()}),f(o,"artwork-change",()=>{M(),G()}),f(o,"slot-guides-change",G),f(a,"webglcontextlost",B=>{B.preventDefault(),j=!0,o.classList.remove("has-webgl-carousel"),o.dataset.renderer="css-fallback"}),f(a,"webglcontextrestored",()=>{j=!1,y&&(o.classList.add("has-webgl-carousel"),o.dataset.renderer="webgl",G())});let I=new ResizeObserver(()=>G());I.observe(r);let W=new wo,T=!1,X=()=>{x||(T=!0,y=!1,o.classList.remove("has-webgl-carousel"),o.dataset.renderer="css-fallback")};for(let B of t.cards){let K=e(B);if(m.has(K))continue;let Y=W.load(K,G,void 0,X);Y.colorSpace=Ot,Y.anisotropy=Math.min(8,i.capabilities.getMaxAnisotropy()),m.set(K,Y)}return T||(h=hi(L(),Number(o.dataset.slotGap||3)),b=new li,y=!0,o.classList.add("has-webgl-carousel"),o.dataset.renderer="webgl",G()),()=>{x=!0,u.abort(),I.disconnect(),t.render=v,t.pointerDown=S,o.classList.remove("has-webgl-carousel"),delete o.dataset.renderer,l.forEach(({material:B,surface:K,guide:Y})=>{St.killTweensOf(K),B.dispose(),Y.material.dispose()}),E.forEach(B=>B.dispose()),h?.dispose(),b?.dispose(),m.forEach(B=>B.dispose()),i.dispose(),i.forceContextLoss(),a.remove()}}var qn,mr,br,Wo=Q(async()=>{await di();await So();await Co();await gi();await Lo();await Fo();St.registerPlugin(pi);qn=pi.create("portfolio-surface",".2,.75,.25,1"),mr=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,br=`
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
`});var Oo=Q(()=>{(()=>{"use strict";let t=Math.PI*2,e=(a,s)=>(a%s+s)%s,o=(a,s,c)=>Math.min(c,Math.max(s,a));class r{constructor(s){this.root=s,this.stage=s.querySelector(".orbit-stage"),this.cards=[...s.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,n)=>{c.dataset.slideIndex=n;let g=c.cloneNode(!0);g.dataset.repeat="true",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),g.removeAttribute("aria-pressed"),c.parentElement.append(g),this.visualCards.push(g)}),!(!this.count||!this.stage)&&(this.title=s.querySelector(".orbit-title"),this.description=s.querySelector(".orbit-description"),this.status=s.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(s,this.cards),this.pagination=s.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((s,c)=>{let n=document.createElement("button");return n.type="button",n.className="orbit-dot",n.setAttribute("aria-label",`Show ${s.dataset.title||`screenshot ${c+1}`}`),n.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(n),n}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(s=>{s.disabled=!0})}bindEvents(){let s=(c,n,g,u={})=>c.addEventListener(n,g,{...this.options,...u});s(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),s(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),s(this.stage,"keydown",c=>{let n={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in n?(c.preventDefault(),this.step(n[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),s(this.stage,"pointerdown",c=>this.pointerDown(c)),s(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),s(this.stage,"pointerup",c=>this.pointerUp(c)),s(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),s(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),s(this.stage,"dragstart",c=>c.preventDefault()),s(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),s(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let n=c.target.closest(".orbit-card");n&&this.openProject(Number(n.dataset.slideIndex))}),s(this.stage,"focusin",c=>{let n=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&n>=0&&n!==this.active&&this.goTo(n)}),s(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),s(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(s=>{let c=s.querySelector(".orbit-surface"),n=c.querySelector("img"),g=Array.from({length:this.segmentCount},(u,f)=>{let v=document.createElement("span");return v.className="orbit-strip",v.setAttribute("aria-hidden","true"),v.dataset.stripIndex=f,v.style.backgroundImage=`url("${n.src}")`,c.append(v),v});return s.classList.add("is-curved"),{card:s,strips:g}})}measure(){let s=this.stage.clientWidth,c=this.stage.clientHeight,n=s<=700;this.cards[0].style.removeProperty("width");let g=this.cards[0].offsetWidth,u=t/8,f=u*.88,v=g/f;this.geometry={radius:v,panelArc:f,cardWidth:g,pitch:o(c/13,36,52),halfWindow:6.5,radiansPerSlide:u,dragUnitX:Math.max(85,s*(n?.32:.18)),dragUnitY:o(c*.13,65,105)},this.stage.style.perspective=`${(v*2.4).toFixed(3)}px`;let S=f/this.segmentCount,m=2*v*Math.sin(S/2),E=g*9/16;this.panels.forEach(({card:M,strips:l})=>{M.style.width=`${g}px`,l.forEach((h,b)=>{let R=-f/2+(b+.5)*S,F=v*Math.sin(R),P=v*(Math.cos(R)-1);h.style.width=`${(m+.6).toFixed(4)}px`,h.style.backgroundSize=`${g}px ${E}px`,h.style.backgroundPosition=`${(-b*g/this.segmentCount).toFixed(4)}px 0px`,h.style.transform=`translateX(-50%) translate3d(${F.toFixed(4)}px, 0px, ${P.toFixed(4)}px) rotateY(${(R*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:s,pitch:c,halfWindow:n,radiansPerSlide:g}=this.geometry;this.visualCards.forEach(f=>{let v=Number(f.dataset.slideIndex),S=e(v-this.position+this.count/2,this.count)-this.count/2;f.dataset.repeat&&(S+=S<0?this.count:-this.count);let m=S*g,E=Math.cos(m),M=Math.sin(m),l=(1-E)/2,h=1-S/n*.11,b=M*s*h,R=S*c,F=E*s*h-s,P=m*180/Math.PI,y=o((n-Math.abs(S))/.65,0,1);f.style.transform=`translate(-50%, -50%) translate3d(${b.toFixed(3)}px, ${R.toFixed(3)}px, ${F.toFixed(3)}px) rotateY(${P.toFixed(3)}deg) scale(${h.toFixed(4)})`,f.style.zIndex="auto",f.style.setProperty("--orbit-shade",String(l*.58)),f.style.setProperty("--orbit-fade",String(y)),f.style.opacity="1",f.style.visibility=y>0?"visible":"hidden",f.style.pointerEvents=y>.25?"auto":"none",f.toggleAttribute("data-gc-back-facing",E<0),f.dataset.offset=S.toFixed(5)});let u=e(Math.round(this.position),this.count);u!==this.active&&this.updateActive(u)}updateActive(s){let c=this.visualCards.includes(document.activeElement);this.active=s,this.cards.forEach((n,g)=>{let u=g===s;n.classList.toggle("is-centered",u),n.tabIndex=u?0:-1,n.setAttribute("aria-pressed",String(u)),this.dots[g].setAttribute("aria-current",String(u))}),this.title&&(this.title.textContent=this.cards[s].dataset.title||""),this.description&&(this.description.textContent=this.cards[s].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[s].dataset.title}, project ${s+1} of ${this.count}`),c&&!this.pointer&&this.cards[s].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(s)}goTo(s){let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(s){this.animateTo(Math.round(this.target)+s)}animateTo(s,c=0){if(this.target=Math.round(s),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(s){this.frame=0;let c=Math.min((s-this.lastTime)/1e3,.032);this.lastTime=s;let n=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=n*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(s){if(this.viewer.dialog.open||!Number.isInteger(s)||!this.cards[s])return;let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(s)}pointerDown(s){if(!s.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}s.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:s.pointerId,x:s.clientX,y:s.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:s.target.closest(".orbit-card")},this.stage.setPointerCapture(s.pointerId))}pointerMove(s){let c=this.pointer;if(!c||c.id!==s.pointerId)return;let n=s.clientX-c.x,g=s.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(n),Math.abs(g))<6)return;if(s.pointerType==="touch"&&Math.abs(n)<=Math.abs(g)){c.card=null;return}c.axis=Math.abs(g)>Math.abs(n)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}s.preventDefault();let u=c.axis==="x"?s.clientX:s.clientY,f=c.axis==="x"?n:g,v=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,S=s.pointerType==="touch"?o(v*.38,32,48):v,m=performance.now(),E=Math.max(8,m-c.lastTime),M=-(u-c.lastCoordinate)/S/E*1e3;c.speed=c.speed*.35+M*.65,c.lastMovement=m,c.lastTime=m,c.lastCoordinate=u,c.travel=f,this.position=c.startPosition-f/S,this.render()}pointerUp(s,c=!1){let n=this.pointer;if(!n||n.id!==s.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(n.id)&&this.stage.releasePointerCapture(n.id),!n.dragging){if(this.animateTo(Math.round(this.position)),!c&&n.buttonLink){location.assign(n.buttonLink);return}!c&&n.card&&this.openProject(Number(n.card.dataset.slideIndex));return}let g=c||performance.now()-n.lastMovement>90?0:o(n.speed,-10,10),u=Math.round(this.position+(this.reducedMotion.matches?0:g*(s.pointerType==="touch"?.32:.2))),f=this.position-n.startPosition;!c&&Math.abs(n.travel)>18&&Math.abs(f)>.12&&u===Math.round(n.startPosition)&&(u+=Math.sign(f)),this.animateTo(u,g)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:s,strips:c})=>{c.forEach(n=>n.remove()),s.classList.remove("is-curved"),s.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(s=>s.dataset.repeat).forEach(s=>s.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function i(a=document){a.querySelectorAll("[data-spiral-carousel]").forEach(s=>{s.spiralCarousel||(s.spiralCarousel=new r(s))})}window.SpiralCarousel={init:i},i()})()});var $o,No=Q(()=>{$o=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Uo,Go=Q(()=>{Uo=`.project-dialog {
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
`});var Xo,_o=Q(()=>{Xo=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var Yo={};Ii(Yo,{mountSpiral:()=>Cr,spiralControls:()=>wt,spiralDefaults:()=>Qe});function mi(t,e,o){for(let r of Vo)t.removeAttribute(r);for(let[r,i]of Object.entries(e.imageAttrs||{}))Vo.has(r)&&i!=null&&t.setAttribute(r,String(i));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&o?.(t)}function bi(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function Cr(t){let{host:e,onChange:o=()=>{},loadImage:r}=t,i=t.items.filter(I=>I.src||I.title||I.description||I.link),a={...Qe,...t.options},s=!1;if(!i.length){let I=document.createElement("p");return I.className="gc-spiral-empty",I.textContent="Add content to this source to preview the spiral.",e.append(I),{destroy(){I.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let n=document.createElement("div");n.className="orbit-carousel spiral-carousel slot-carousel",n.dataset.spiralCarousel="",n.id=`gc-spiral-${++kr}`,n.setAttribute("role","region"),n.setAttribute("aria-label","Spiral gallery"),n.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let g=n.querySelector(".orbit-stage"),u=n.querySelector(".orbit-ring"),f=n.querySelector("[data-orbit-toggle]");Ze(n.querySelector("[data-orbit-prev]"),"previous"),Ze(n.querySelector("[data-orbit-next]"),"next"),Ze(f,"playback");let v=n.querySelector(".gc-spiral-caption"),S=document.createElement("div");S.className="gc-spiral-caption-space",v.before(S),S.append(v);let m=i.some(I=>!!I.title);for(let I of new Set(i.map(W=>W.title).filter(Boolean))){let W=v.cloneNode(!1);W.setAttribute("aria-hidden","true"),W.classList.add("gc-spiral-caption-measure"),W.textContent=I,S.append(W)}let E=document.createElement("div");E.className="gc-item-details",S.after(E);let M=i.map(I=>{let W=document.createElement("div");W.className="gc-item-detail";let T=document.createElement("p");T.className="gc-item-description",T.textContent=Gt(I.description);let X=document.createElement("a"),B=bi(I.link);return B&&(X.href=B),X.textContent=I.buttonLabel||"Open link",W.append(T,X),E.append(W),{group:W,body:T,link:X,href:B}}),l="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),h=[];i.forEach((I,W)=>{let T=document.createElement("button");T.className="orbit-card",T.type="button",T.dataset.title=I.title||"",T.dataset.imageSource=I.src||l,T.setAttribute("aria-label",I.title?`View ${I.title}`:`View image ${W+1}`);let X=document.createElement("span");X.className="orbit-surface";let B=document.createElement("img");I.src?mi(B,I):B.src=l,h.push(T),T.dataset.buttonLink=bi(I.link)||"",X.append(B),T.append(X),u.append(T)}),c.append(n),e.append(c);let b=new Map,R=0,F="";async function P(){let I=JSON.stringify(a);if(F===I)return;F=I;let W=++R,T=i.some(_=>Dt(_,a));if(n.dataset.composite=String(T),!T){for(let[_,se]of h.entries())if(se.artwork=null,se.buttonBounds=null,se.hasAttribute("data-artwork")){for(let oe of u.querySelectorAll('[data-slide-index="'+_+'"] img'))oe.src=i[_].src||l;se.removeAttribute("data-artwork")}return}let X=_=>!_||!a.showImage?null:(b.has(_)||b.set(_,new Promise(se=>{let oe=new Image;oe.crossOrigin="anonymous",oe.onload=()=>se(oe),oe.onerror=()=>se(null),oe.src=_})),b.get(_));if(await new Promise(requestAnimationFrame),s||W!==R)return;let B=await Promise.all(i.map(async _=>({item:{..._,plain:Gt(_.description)},image:await X(_.src)})));if(s||W!==R)return;let K=a.typeSource==="native"?e.closest(".user-items-list-section"):null,Y=getComputedStyle(K?.querySelector(".list-item-content__title")||v),ee=getComputedStyle(K?.querySelector(".list-item-content__description p")||M[0].body),de=getComputedStyle(e).color,U=io(B,a,{family:Y.fontFamily,bodyFamily:ee.fontFamily,ink:de,titleSize:parseFloat(Y.fontSize)||16,titleWeight:Y.fontWeight,size:parseFloat(ee.fontSize)||16,weight:ee.fontWeight,accent:getComputedStyle(f).color,buttonInk:getComputedStyle(f).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(f).backgroundColor});U.forEach(({canvas:_,buttonBounds:se},oe)=>{if(h[oe].artwork=_,h[oe].buttonBounds=se,h[oe].setAttribute("data-artwork",""),n.dataset.renderer!=="webgl"){let ne=_.toDataURL();for(let he of n.querySelectorAll('.orbit-card[data-slide-index="'+oe+'"] img'))he.src=ne}}),u.querySelectorAll("[data-repeat]").forEach(_=>{let se=h[Number(_.dataset.slideIndex)];_.buttonBounds=se?.buttonBounds}),n.dataset.cardAspect=String(U[0].aspect),n.style.setProperty("--gc-art-aspect",U[0].aspect),n.dispatchEvent(new Event("artwork-change"))}let y=zt(c,n.id),x=()=>{let I=a.textPlacement==="card",W=i.some(T=>Dt(T,a));y({...a,shadowEnabled:a.shadowEnabled&&!W,imageTint:a.overlayEnabled&&!W?a.imageTint:"#00000000"}),a.titleCustom?e.dataset.gcTitlePalette=a.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),S.style.textAlign=a.titleAlign,c.style.setProperty("--gc-card-inset",a.carouselPadding+"px"),n.style.padding=a.carouselPadding+"px",n.style.overflow=a.surfaceRadius?"hidden":"",n.style.borderRadius=a.surfaceRadius+"px",n.style.backgroundColor=a.surfaceEnabled?a.surfaceColor:"",n.style.setProperty("--gc-hover-time",a.hoverDuration+"ms"),n.dataset.hoverDuration=a.hoverDuration,n.dataset.mirrorColor=a.mirrorOverlay?a.mirrorColor:"#00000000",n.dataset.playbackMode=a.playbackMode,n.dataset.rate=a.cardsPerMinute,n.dataset.interval=a.duration,n.dataset.direction=a.direction,n.dataset.pauseOnHover=String(a.pauseOnHover),n.dataset.customControlSize=String(!!(a.controlPadding||a.controlIconSize)),n.dataset.hideControlBackground=String(!a.controlBackground),n.style.setProperty("--gc-icon-size",a.controlIconSize?a.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),n.style.setProperty("--gc-button-padding",a.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let T of S.children)T.style.textAlign=a.titleCustom?a.titleAlign:"",T.style.marginBottom=a.titleGap?a.titleGap+"px":"";for(let{body:T,link:X}of M)T.style.textAlign=a.bodyCustom?a.descriptionAlign:"",T.style.fontWeight=a.bodyCustom?a.descriptionWeight:"",T.style.color=a.bodyCustom&&a.descriptionCustom?a.descriptionColor:"inherit",T.style.fontSize=a.bodyCustom&&a.descriptionSize?a.descriptionSize+"rem":"",X.style.marginTop=a.buttonGap+"px";n.dataset.showImage=String(a.showImage!==!1),n.dataset.imageTint=a.overlayEnabled?a.imageTint:"#00000000",n.dataset.hoverEffect=a.reducedMotion?"none":a.hoverEffect,n.dataset.hoverAmount=a.hoverAmount;for(let[T,{body:X,link:B,href:K}]of M.entries())X.hidden=!a.showDescription||!X.textContent,B.hidden=!a.showButton||!K||!i[T].buttonLabel;E.hidden=I||M.every(({body:T,link:X})=>T.hidden&&X.hidden),n.dataset.edgeMode=a.edgeMode,n.dataset.backFace=a.backFace,n.dataset.cornerRadius=a.spiralRadius,n.dataset.borderWidth=a.cardBorderEnabled?a.borderWidth:0,n.dataset.borderColor=a.spiralRim,n.dataset.backColor=a.backColor,n.style.setProperty("--orbit-card-radius",a.spiralRadius+"px"),n.style.setProperty("--orbit-rim",a.spiralRim),c.style.width=`${it(a.containerWidth,100,20,100)}%`,g.style.height=a.heightMode==="viewport"?it(a.viewportHeight,65,15,100)+"vh":a.heightMode==="auto"?"clamp(160px,calc("+a.cardWidth+"px + "+a.spiralRise*4+"px),90svh)":it(a.stageHeight,680,120,1600)+"px",n.style.setProperty("--orbit-card-width",`${it(a.cardWidth,280,80,720)}px`),n.dataset.spiralWidth=String(it(a.spiralWidth,87,20,100)),n.dataset.cardWidth=String(it(a.cardWidth,280,80,720)),n.dataset.rise=String(it(a.spiralRise,52,a.spiralRiseUnit==="percent"?1:8,a.spiralRiseUnit==="percent"?50:500)),n.dataset.riseUnit=a.spiralRiseUnit==="percent"?"percent":"px",(!h[0].artwork||!i.some(T=>Dt(T,a)))&&(n.dataset.cardAspect=String(Sr(a.aspectRatio))),n.dataset.imageFit=a.fit==="contain"||a.fit==="fit"?"fit":"fill",n.dataset.imagePadding=String(it(a.imagePadding,0,0,20)),n.dataset.slotGap=String(it(a.spiralGap,3,0,16)),n.dataset.showSlots=String(!!a.showSlots),S.hidden=I||!a.showTitles||!m,P(),n.classList.toggle("gc-spiral-reduced",!!a.reducedMotion)};x();let A=i.map(I=>({title:I.title||"",category:"",description:Gt(I.description),services:[],notes:[],gallery:[{file:I.src||l,label:"Image"}]}));class D extends Ht{constructor(W,T){super(W,T,A),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(W){let T=i[W];if(!T||a.clickAction==="none"||a.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let X=bi(T.link);if(a.clickAction==="link"||a.clickAction==="source"){X&&location.assign(X);return}if(T.postUrl){t.openPost(T,W);return}super.open(W);let B=this.dialog.querySelector(".project-title");B.hidden=!T.title||!a.popupTitle,B.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",B.id),this.dialog.querySelector(".project-summary").hidden=!a.popupDescription||!Gt(T.description),this.dialog.querySelector(".project-gallery").hidden=!a.popupImage||!T.src,this.dialog.querySelector(".project-frame-label").hidden=!a.popupTitle,this.dialog.querySelector(".project-info").hidden=B.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(X&&a.popupButton),this.sourceLink.hidden=!X||!a.popupButton,X?(this.sourceLink.href=X,this.sourceLink.textContent=T.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!a.reducedMotion)}showFrame(W){super.showFrame(W);let T=A.indexOf(this.project),X=i[T];X?.src&&(mi(this.image,X,r),this.dialog.querySelectorAll(".project-thumbnail img").forEach(B=>mi(B,X,r)),this.dialog.querySelector(".project-frame-label").textContent=X.title||"")}}let j=window.ProjectViewer;window.ProjectViewer=D;try{wr.init(c)}finally{j===void 0?delete window.ProjectViewer:window.ProjectViewer=j}let d=n.spiralCarousel;n.querySelectorAll("img").forEach(I=>r?.(I));let L=()=>{for(let[I,W]of h.entries()){if(!W.artwork)continue;let T=W.artwork.toDataURL();for(let X of u.querySelectorAll('[data-slide-index="'+I+'"] img'))X.src=T}};g.addEventListener("webglcontextlost",L,!0);let $=d.updateActive;d.updateActive=function(I){$.call(this,I),M.forEach(({group:W},T)=>{W.inert=T!==I,W.style.visibility=T===I?"visible":"hidden"}),this.status.textContent=`${i[I]?.title?`${i[I].title}, `:""}image ${I+1} of ${i.length}`,o(I)},d.updateActive(d.active);let H=d.animateTo;d.animateTo=function(I,W=0){a.reducedMotion?(this.target=Math.round(I),this.settleImmediately()):H.call(this,I,W)};let V=Ho(d,{textureSource:I=>I.dataset.imageSource}),G=no(n,d,{pauseOnHover:!1,interactionRestMs:0});function q(I){a.autoplay=!!I,d.manuallyPaused=!I||!!a.reducedMotion,d.resumeAt=0,f.disabled=!!a.reducedMotion||d.reducedMotion.matches||i.length<2,f.dataset.paused=String(d.manuallyPaused),f.setAttribute("aria-label",d.manuallyPaused?"Resume carousel":"Pause carousel"),d.syncAutoplay()}return q(!!a.autoplay),{update(I){let W=a;a={...a,...I},x(),d.measure(),n.dispatchEvent(new Event("playground-change")),n.dispatchEvent(new Event("slot-guides-change")),d.updateActive(d.active),(W.autoplay!==a.autoplay||W.reducedMotion!==a.reducedMotion)&&q(!!a.autoplay)},goTo(I){s||d.goTo(I)},setPlaying:q,getMetrics(){try{return JSON.parse(n.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return n.dataset.renderer||"loading"},destroy(){s||(s=!0,g.removeEventListener("webglcontextlost",L,!0),G(),V(),d.destroy(),c.remove())}}}var wr,kr,it,Sr,Gt,Vo,Jo=Q(async()=>{oo();ei();ro();Rt();Wt();Wt();so();await Wo();Oo();wr=window.SpiralCarousel,kr=0,it=(t,e,o,r)=>Number.isFinite(Number(t))?Math.max(o,Math.min(r,Number(t))):e,Sr=t=>{if(typeof t=="number"&&t>0)return t;let[e,o]=String(t||"16:9").split(":").map(Number);return e>0&&o>0?e/o:16/9},Gt=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Vo=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Ko(t){let{host:e}=t,o={...t.options},r=null,i=null,a=!1,s="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),Jo().then(()=>Yo).then(n=>{a||(c.remove(),i=n.mountSpiral({...t,options:o}),r!==null&&i.goTo?.(r))}).catch(n=>{a||(s="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",n))}),{update(n){o={...o,...n},i?.update?.(o)},goTo(n){r=n,i?.goTo?.(n)},setPlaying(n){o.autoplay=n,i?.setPlaying?.(n)},getStatus(){return i?.getStatus?.()??s},getMetrics(){return i?.getMetrics?.()??null},destroy(){a=!0,c.remove(),i?.destroy()}}}var Zo=Q(()=>{});function ut(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let o=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(o.protocol)?o.href:""}catch{return""}}function _t(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(o=>o.remove()),e.content.querySelectorAll("*").forEach(o=>{for(let r of[...o.attributes])(/^on/i.test(r.name)||r.name==="style"||r.name==="id")&&o.removeAttribute(r.name);if(o.hasAttribute("href")){let r=ut(o.getAttribute("href"));r?o.setAttribute("href",r):o.removeAttribute("href")}}),e.innerHTML}function Qo(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let o of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(o)&&(e[o]=t.getAttribute(o));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function Mt(t,e){let o=Ut[e];if(!t||!o)return null;let r=t.closest(o);if(!r){let n=t.querySelectorAll(o);if(n.length!==1)return null;r=n[0]}let i=e==="list"?r:r.querySelector(":scope > .sqs-block-content");if(!i)return null;let a=n=>Array.from(i.querySelectorAll(n)).filter(g=>g.closest(o)===r&&(!g.closest(".gc-embed")||g.hasAttribute("data-gc-native-track")));if(e==="summary"){let n=a(".summary-block-wrapper");if(n.length!==1)return null;let g=a(".summary-item").filter(u=>n[0].contains(u)&&!u.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:r,originals:n,rows:g}}let s=e==="list"?".list-item":".slide",c=a(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=a(".sqs-gallery")),c.length===1){let n=Array.from(c[0].querySelectorAll(s)).filter(g=>g.closest(o)===r&&!g.hasAttribute("data-gc-repeat"));return{source:r,originals:c,rows:n}}if(e==="gallery"&&!c.length){let n=a(s);if(n.length&&n.every(g=>g.parentElement===n[0].parentElement))return{source:r,originals:n,rows:n}}return null}function bt(t,e,o=location.href){return(Mt(t,e)?.rows||[]).map(i=>{let a=i.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let g=i.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),u=ut(g?.getAttribute("href"),o);return{...Qo(a),title:i.querySelector(".summary-title")?.textContent.trim()||a?.alt||"",description:_t(i.querySelector(".summary-excerpt")?.innerHTML),link:u,postUrl:u,buttonLabel:"Read post"}}let s=i.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=_t(i.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),n=i.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Qo(a),title:s,description:c,link:ut(n?.getAttribute("href"),o),buttonLabel:e==="list"&&n?.textContent.trim()||""}}).filter(i=>e==="summary"?!!i.link:e==="list"||!!(i.src||i.title||i.link))}function Mr(t,e){let o=e==="list"?t.getAttribute("data-section-id"):t.id;if(!o?.trim())return"";let r=e==="list"?'section[data-section-id="'+CSS.escape(o)+'"]':"#"+CSS.escape(o);return t.ownerDocument.querySelectorAll(r).length===1?r:""}function yi(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Ut).join(","))).filter(o=>!o.closest(".gc-embed")).flatMap(o=>{let r=o.matches(Ut.list)?"list":o.matches(Ut.summary)?"summary":"gallery",i=Mr(o,r);if(!i||!Mt(o,r))return[];let a=++e[r];return{name:(r==="list"?"List Section":r==="summary"?"Summary Block":"Gallery Block")+(a>1?" "+a:""),type:r,selector:i,root:o,items:bt(o,r)}})}function Xt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let o=t.ownerDocument.defaultView?.ImageLoader;if(o&&typeof o.load=="function")try{o.load(t,{load:!0})}catch(r){console.warn("Gallery Studio: native image loader",r)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+ea(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function ea(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function vi(t){let e=document.createElement("img");for(let[o,r]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(o)&&e.setAttribute(o,r);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=ea(t.imageAttrs?.["data-image-focal-point"]),e}var Ut,xi=Q(()=>{Ut={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function ta(t,e,o){let r=new WeakMap,i=new WeakMap,a=Array.from(e.childNodes),s=o.map(M=>Array.from(M.childNodes)),c=[];function n(M,l){M&&c.push([M,l.map(h=>[h,M.getAttribute(h)])])}let g=new Set,u=!1;function f(){n(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let M of o)n(M,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),u=!0}function v(M,l,h,b,R){let F=o[l],P=g.has(l),y=P?F.cloneNode(!1):F,x=document.createElement("div");if(x.className="gc-card gc-native-card",x.tabIndex=0,x.setAttribute("role","group"),M.imageAttrs?.["data-image-focal-point"]){let[H,V]=M.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(H)&&Number.isFinite(V)&&x.style.setProperty("--gc-native-focus",H*100+"% "+V*100+"%")}let A=M.title||M.alt||`Item ${l+1}`;if(x.setAttribute("aria-label",A),P){y.removeAttribute("id"),y.setAttribute("data-gc-repeat","");for(let H of s[l])x.append(H.cloneNode(!0));x.querySelectorAll("[id]").forEach(H=>H.removeAttribute("id"))}else g.add(l),x.append(...s[l]);y.replaceChildren(x),r.set(x,y);let D=x.querySelector(".list-item-media"),j=x.querySelector(".list-item-content"),d=x.querySelector(".list-item-content__title"),L=x.querySelector(".list-item-content__description");if(!P){for(let H of[D,j])n(H,["class"]);for(let H of[d,L])n(H,["class","hidden"])}if(D?.classList.add("gc-card-media"),j?.classList.add("gc-card-copy"),b.typeSource!=="native"&&(d?.classList.add("gc-card-title"),L?.classList.add("gc-card-description")),d&&(!b.showTitles||h.caption===!1)&&(d.hidden=!0),L&&!h.description&&(L.hidden=!0),D&&!b.showImage&&(P||n(D,["hidden"]),D.hidden=!0),!b.showButton){let H=x.querySelector(".list-item-content__button-wrapper")||x.querySelector(".list-item-content__button");H&&(P||n(H,["hidden"]),H.hidden=!0)}h.thumbnail&&j&&(!M.title||h.caption===!1)&&!b.showDescription&&!b.showButton&&(P||n(j,["hidden"]),j.hidden=!0);let $=Array.from(x.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!P)for(let H of $)n(H,["tabindex"]);if(i.set(x,$.map(H=>[H,H.getAttribute("tabindex")])),b.clickAction!=="none"&&b.clickAction!=="source"&&(b.clickAction!=="link"||M.link)){let H=document.createElement("button");H.type="button",H.className="gc-native-action",H.tabIndex=-1,H.setAttribute("aria-label",(b.clickAction==="link"?"Open link for ":"Open ")+A),H.addEventListener("click",()=>R(M,l)),x.append(H),x.setAttribute("aria-keyshortcuts","Enter Space"),x.addEventListener("click",V=>{V.defaultPrevented||V.target.closest("a,button,input,select,textarea,label")||R(M,l)}),x.addEventListener("keydown",V=>{V.target!==x||!["Enter"," "].includes(V.key)||(V.preventDefault(),H.click())})}return x}function S(M){let l=M.tabIndex===0&&M.getAttribute("aria-hidden")!=="true";for(let[h,b]of i.get(M)||[]){let R=l?b:"-1";h.getAttribute("tabindex")!==R&&(R===null?h.removeAttribute("tabindex"):h.setAttribute("tabindex",R))}}function m(M){if(!u)return;let l=M!=="native";e.querySelectorAll(".list-item-content__title").forEach(h=>h.classList.toggle("gc-card-title",l)),e.querySelectorAll(".list-item-content__description").forEach(h=>h.classList.toggle("gc-card-description",l))}function E(){if(e.classList.remove("gc-native-items-hidden"),!!u){o.forEach((M,l)=>M.replaceChildren(...s[l])),e.replaceChildren(...a);for(let[M,l]of c)for(let[h,b]of l)M.getAttribute(h)!==b&&(b===null?M.removeAttribute(h):M.setAttribute(h,b));t.after(e),c.length=0,g.clear(),u=!1}}return{track:e,begin:f,makeCard:v,slot:M=>r.get(M),syncFocus:S,setType:m,restore:E}}var ia=Q(()=>{});function oa(t,e,o){if(!o.closest(".fluid-engine > .fe-block"))return()=>{};o.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let i=0,a=!1,s=new WeakSet,c=v=>{v&&!s.has(v)&&(s.add(v),g.observe(v))},n=()=>{!i&&!a&&(i=requestAnimationFrame(f))},g=new ResizeObserver(n),u=new MutationObserver(n);function f(){if(i=0,a||!e.isConnected)return;let v=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!v)return;let S=v.classList.contains("gc-carousel-stage"),m=v.parentElement;m.classList.contains("gc-block-stage-window")&&(m=m.parentElement),c(m),c(v);let E=0;for(let l of m.children){if(l===v||l.contains(v))continue;c(l);let h=getComputedStyle(l);h.display==="none"||["absolute","fixed"].includes(h.position)||(E+=l.offsetHeight+(parseFloat(h.marginTop)||0)+(parseFloat(h.marginBottom)||0))}let M=Math.max(1,t.clientHeight-E);if(S){let l=v.parentElement;l.classList.contains("gc-block-stage-window")||(l=document.createElement("div"),l.className="gc-block-stage-window",v.before(l),l.append(v));let h=Math.min(1,M/Math.max(1,v.offsetHeight));l.style.height=M+"px",v.style.setProperty("--gc-block-scale",String(h)),v.style.setProperty("--gc-block-top",Math.max(0,(M-v.offsetHeight*h)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",M+"px")}return c(t),u.observe(e,{childList:!0,subtree:!0}),n(),()=>{a=!0,cancelAnimationFrame(i),g.disconnect(),u.disconnect(),o.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let v=e.querySelector(".gc-block-stage-window");if(v){let S=v.firstElementChild;S.style.removeProperty("--gc-block-scale"),S.style.removeProperty("--gc-block-top"),v.replaceWith(S)}}}var aa=Q(()=>{});function ra(t,e,o,r){let i=o.ownerDocument,a=i.defaultView,s=r!=="list"?o.closest(".fluid-engine > .fe-block"):null;s?.classList.add("gc-viewport-cell");let c=[],n=s||o;for(let f=t.parentElement;f&&(["hidden","clip","auto","scroll"].includes(a.getComputedStyle(f).overflowX)&&c.push(f),f!==n);f=f.parentElement);function g(){let f=i.documentElement.clientWidth;if(!f||!t.isConnected||!t.getClientRects().length)return;for(let m of c){let E=m.getBoundingClientRect().left+a.scrollX+m.clientLeft,M=E>.5||E+m.clientWidth<f-.5;m.classList.toggle("gc-viewport-unclip",M)}let v=-(t.getBoundingClientRect().left+a.scrollX),S=(m,E)=>{e.style.getPropertyValue(m)!==E&&e.style.setProperty(m,E)};S("--gc-viewport-width",f+"px"),S("--gc-viewport-offset",v+"px")}g();let u=a.ResizeObserver?new a.ResizeObserver(g):null;return u?.observe(t),u?.observe(i.documentElement),a.addEventListener("resize",g),()=>{u?.disconnect(),a.removeEventListener("resize",g);for(let f of c)f.classList.remove("gc-viewport-unclip");s?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var na=Q(()=>{});var ca,sa=Q(()=>{ca=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function la(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let r=document.createElement("style");r.id="gc-finish-css",r.textContent=ca,document.head.append(r)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let o={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[r,i]of Object.entries(o))t.style.setProperty(r,i);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var wi,da=Q(()=>{sa();wi={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function Vt(t){t.setAttribute("data-lenis-prevent","");for(let e of["wheel","touchmove"])t.addEventListener(e,o=>o.stopPropagation(),{passive:!0})}var ki=Q(()=>{});function pa(t,e){let o=t.classList.contains("gc-embed"),r=o&&e.colorSource==="section";r?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,o&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let i=t.style;i.setProperty("--gc-custom-background",e.background),i.setProperty("--gc-custom-ink",e.ink),i.setProperty("--gc-custom-accent",e.accent),i.setProperty("--gc-background",r?"var(--gc-section-surface)":e.background),i.setProperty("--gc-ink",r?"var(--gc-section-body)":e.ink),i.setProperty("--gc-accent",r?"var(--gc-section-action)":e.accent),i.setProperty("--gc-muted",r?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),i.setProperty("--gc-spatial-surface","var(--gc-background)"),i.setProperty("--gc-spatial-ink","var(--gc-ink)"),r&&(i.setProperty("--gc-line-color","var(--gc-section-line)"),i.setProperty("--gc-tint","var(--gc-section-body)")),i.background=r?"transparent":e.background,i.color=r?"var(--gc-section-body)":e.ink;for(let a of t.querySelectorAll(":scope > dialog"))ga(t,a)}function ga(t,e){for(let o of["gcColorSource","gcTypeSource"])t.dataset[o]?e.dataset[o]=t.dataset[o]:delete e.dataset[o]}function Si(t,e){Vt(e);let o=t.classList.contains("gc-embed")?t:t.ownerDocument.body;ga(t,e),e.parentElement!==o&&o.append(e)}var ua=Q(()=>{ki()});var fa,ha=Q(()=>{fa=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var ba,ma=Q(()=>{ba=`.gc-post-dialog {
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
`});var va,ya=Q(()=>{va=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var wa,xa=Q(()=>{wa=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var Sa,ka=Q(()=>{Sa=`.gc-carousel {
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
`});var Ma,Ca=Q(()=>{Ma=`.gc-spatial {
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
`});function at(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Yt(t,e){let o=at(e.preset??t.preset),r=o===at(t.preset)?t.stageHeight:o?0:590;return{...e.preset==="spiral"?Qe:{},...t,...e,stageHeight:e.stageHeight??r}}function Aa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function Ea(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[fa,va,wa,ba].join(`
`),document.head.append(e));let o=Aa(t);if(o==="common")return()=>{};let r=`gc-runtime-${o}-css`,i=document.getElementById(r);i||(i=document.createElement("style"),i.id=r,o==="carousel"?i.textContent=Sa:o==="spatial"?i.textContent=Ma:i.textContent=[$o,Do,Uo,Xo].join(`
`),e.after(i)),i.dataset.gcOwners=String(Number(i.dataset.gcOwners||0)+1);let a=!1;return()=>{if(a)return;a=!0;let s=Number(i.dataset.gcOwners)-1;s>0?i.dataset.gcOwners=String(s):i.remove()}}function Tr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function Pa(t,e,o={},r=null){let i=Yt({...ot,...vt(o.preset??ot.preset,o)},o),a=null,s=null,c=null,n=null,g=0,u=0,f,v,S;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function m(){s&&(c?.destroy(),c=null,s.close(),s.remove(),s=null,a?.setSuspended?.(!1),n?.focus({preventScroll:!0}))}function E(d,L){if(i.clickAction==="none"||i.clickAction==="source"&&!d.link)return;if(i.clickAction==="link"||i.clickAction==="source"){let W=ut(d.link);W&&window.open(W,"_blank","noopener,noreferrer");return}let $=document.activeElement;if(s&&m(),n=$,d.postUrl){c=Vi(d.postUrl,F(),m),s=c.dialog,M(),c.load();return}s=document.createElement("dialog"),s.className="gc-dialog"+(i.preset==="showcase"?" gc-dialog-drawer":""),s.setAttribute("aria-label",d.title||"Image preview");let H=document.createElement("button");H.className="gc-dialog-close",H.type="button",H.textContent="Close \xD7",H.addEventListener("click",m);let V=document.createElement("div");V.className="gc-dialog-content";let G=document.createElement("div");G.className="gc-dialog-media",d.src&&i.popupImage!==!1&&(G.append(vi(d)),V.append(G));let q=document.createElement("div");if(q.className="gc-dialog-copy",d.title&&i.popupTitle!==!1){let W=document.createElement("h2");W.textContent=d.title,q.append(W)}if(d.description&&i.popupDescription!==!1){let W=document.createElement("div");W.innerHTML=_t(d.description),q.append(W)}if(d.link&&i.popupButton!==!1){let W=document.createElement("a");W.href=ut(d.link),W.textContent=d.buttonLabel||"Open link",W.target="_blank",W.rel="noopener noreferrer",q.append(W)}let I=document.createElement("p");I.className="gc-dialog-count",I.textContent=`${L+1} / ${e.length}`,q.append(I),V.append(q),s.append(H,V),M(),Xt(G.querySelector("img")),H.focus()}function M(){Si(t,s),s.showModal(),a?.setSuspended?.(!0),s.addEventListener("cancel",d=>{d.preventDefault(),m()}),s.addEventListener("click",d=>{if(d.target===s){let L=s.getBoundingClientRect();(d.clientX<L.left||d.clientX>L.right||d.clientY<L.top||d.clientY>L.bottom)&&m()}})}function l(d,L,$={}){if($={...$,description:i.showDescription},r)return r.makeCard(d,L,$,i,E);let H=i.showButton&&d.buttonLabel&&ut(d.link),V=!!H,G=document.createElement(V?"div":"button");V?(G.tabIndex=0,G.setAttribute("role","group")):G.type="button",G.className="gc-card",G.setAttribute("aria-label",d.title||`Image ${L+1}`);let q=document.createElement("span");q.className="gc-card-media",d.src&&i.showImage!==!1&&(q.append(vi(d)),G.append(q));let I=document.createElement("span");if(I.className="gc-card-copy",$.caption!==!1&&i.showTitles&&d.title){let T=document.createElement("span");T.className="gc-card-title",T.textContent=d.title,I.append(T)}if($.description&&d.description){let T=document.createElement("span");T.className="gc-card-description",T.textContent=Tr(d.description),I.append(T)}if(V){let T=document.createElement("a");T.className="gc-card-button",T.href=H,T.textContent=d.buttonLabel,I.append(T)}I.childNodes.length&&G.append(I);let W=()=>{(i.clickAction!=="source"||!d.buttonLabel)&&E(d,L)};return G.addEventListener("click",T=>{T.target.closest("a")||W()}),V&&G.addEventListener("keydown",T=>{T.target===G&&["Enter"," "].includes(T.key)&&(T.preventDefault(),W())}),G}function h(d,L,$){let H=l(d,L,$);if(i.aspectRatio==="original"){let V=H.querySelector(".gc-card-media img");if(V){let G=(I,W)=>{I>0&&W>0&&H.style.setProperty("--gc-original-ratio",I+" / "+W)},q=V.dataset.imageDimensions?.split("x").map(Number);q?.length===2?G(...q):V.naturalWidth?G(V.naturalWidth,V.naturalHeight):V.addEventListener("load",()=>G(V.naturalWidth,V.naturalHeight),{once:!0})}}return H}let b=matchMedia("(prefers-reduced-motion: reduce)"),R=matchMedia("(max-width: 660px)");function F(){let d={...Gi(t,i),reducedMotion:i.reducedMotion||b.matches};if(R.matches&&i.mobileSizing){for(let[L,$]of[["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])i[$]!=null&&(d[L]=i[$]);i.preset==="spiral"&&i.mobileSpiralWidth!=null&&(d.spiralWidth=i.mobileSpiralWidth),i.mobileHeightMode&&i.mobileHeightMode!=="inherit"&&(d.heightMode=i.mobileHeightMode,d.stageHeight=i.mobileStageHeight??d.stageHeight,d.viewportHeight=i.mobileViewportHeight),i.mobileCardWidth!=null&&(d.cardWidth=i.mobileCardWidth),i.mobileGap!=null&&(d[i.preset==="spiral"?"spiralGap":"gap"]=i.mobileGap)}return i.preset!=="spiral"&&(d.heightMode==="viewport"&&(d.stageHeight=innerHeight*d.viewportHeight/100),d.heightMode==="auto"&&(d.stageHeight=at(i.preset)?0:Math.min(innerHeight,i.preset==="stack"?680:590))),d.phoneWidthOverride=R.matches&&i.mobileSizing&&i.mobileCardWidth!=null,i.preset==="stack"&&(d.stackCardWidth=R.matches&&i.mobileSizing&&i.mobileCardWidth!=null?i.mobileCardWidth:Math.max(360,i.cardWidth*2.2)),d}function P(){t.classList.toggle("gc-hide-controls",i.showControls===!1);let d=F();la(t,d),pa(t,d),i.preset!=="spiral"&&(Di(t,d),(d.overlayEnabled||d.shadowEnabled||S)&&(S??=zt(t,"gc-image-"+crypto.randomUUID()),S({...d,cardShadow:!1,imageTint:d.overlayEnabled?d.imageTint:"#00000000"}))),t.style.setProperty("--gc-fit",i.fit),t.style.setProperty("--gc-card-radius",i.radius+"px")}function y(d=0){m(),a?.destroy(),a=null,r?.restore(),cancelAnimationFrame(u),t.replaceChildren(),S=null,t.classList.add("gc-stage"),t.style.height="";let L=Aa(i.preset);L!==f&&(v?.(),v=Ea(i.preset),f=L),P(),t.setAttribute("aria-label",i.previewScroll===!1?"Gallery":"Gallery preview");let $=r&&i.preset!=="spiral"?r:null;$?$.begin():r&&r.track.classList.add("gc-native-items-hidden");let H={host:t,items:e,openPost:E,initialIndex:d,nativeList:$,attachDialog:V=>Si(t,V),options:F(),makeCard:h,loadImage:Xt,onChange(V){g=V,i.onChange?.(V)}};if(!e.length){let V=document.createElement("p");V.className="gc-empty",V.textContent="Add images to your source to start exploring.",t.append(V);return}i.preset==="spiral"?a=Ko(H):i.preset==="stack"?a=eo(H):["wall","ring","angled"].includes(i.preset)?(a=Zi(H),d&&a.goTo(d)):a=Ji(H),i.preset!=="spiral"&&(u=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(V=>{Xt(V,{nativeCard:!!$})})))}let x=()=>y(g);function A(){if(i.preset!=="spiral"){i.mobileSizing&&y(g);return}a?.setGeometry?a.setGeometry(F()):i.preset==="spiral"?a?.update(F()):y(g)}try{y()}catch(d){throw v?.(),r?.restore(),d}let D=innerHeight;function j(){if(D===innerHeight)return;D=innerHeight;let d=F().heightMode;i.preset!=="spiral"&&["viewport","auto"].includes(d)&&y(g)}return window.addEventListener("resize",j),b.addEventListener("change",x),R.addEventListener("change",A),{update(d){let L=i.preset,$=F();i=Yt(i,d);let H=F(),V=Object.keys(H).filter(q=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(q)&&H[q]!==$[q]);if(!V.length)return;if(a?.setGeometry&&V.every(q=>["cardWidth","gap","phoneWidthOverride"].includes(q))){a.setGeometry(H);return}let G=q=>["colorSource","typeSource","background","ink","accent"].includes(q);if(V.every(q=>G(q)||L!=="spiral"&&(q==="radius"||Object.hasOwn(wi,q)))){P(),V.includes("typeSource")&&r?.setType(i.typeSource);return}L==="spiral"&&i.preset==="spiral"&&a?.update?(P(),a.update(H)):y(L===i.preset?g:0)},goTo(d){a?.goTo?.(d)},setPlaying(d){i.autoplay=d,a?.setPlaying?.(d)},getOptions(){return{...i}},getActive(){return g},destroy(){window.removeEventListener("resize",j),m(),cancelAnimationFrame(u),a?.destroy(),r?.restore(),b.removeEventListener("change",x),R.removeEventListener("change",A),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),v?.()}}}function qr(t,e){let o=e.closest("section")||e,r=[];for(let i=t.parentElement;i;i=i.parentElement){let a=Ee.scrollBoundaries.get(i)||0;if((a||["hidden","auto","scroll","overlay"].includes(getComputedStyle(i).overflowY))&&(Ee.scrollBoundaries.set(i,a+1),i.classList.add("gc-stack-page-scroll"),r.push(i)),i===o)break}return()=>{for(let i of r){let a=Ee.scrollBoundaries.get(i)-1;a?Ee.scrollBoundaries.set(i,a):(Ee.scrollBoundaries.delete(i),i.classList.remove("gc-stack-page-scroll"))}}}function nt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function Ci(t){if(!Ee.editListeners?.size){Ee.editListeners=new Set;let e=nt();Ee.editObserver=new MutationObserver(()=>{let o=nt();if(o!==e){e=o;for(let r of Ee.editListeners)try{r(o)}catch(i){console.warn("Gallery Studio: could not resume a list layout.",i)}}});for(let o of[document.body,document.documentElement])Ee.editObserver.observe(o,{attributes:!0,attributeFilter:["class"]})}return Ee.editListeners.add(t),()=>{Ee.editListeners.delete(t),Ee.editListeners.size||Ee.editObserver.disconnect()}}function Mi({selector:t,type:e="gallery",options:o={}}={}){let r=t;if(typeof t=="string")try{let L=document.querySelectorAll(t);if(L.length!==1)return null;r=L[0]}catch{return null}if(!r?.isConnected||typeof r.closest!="function")return null;let i=Mt(r,e);if(!i)return null;let{source:a}=i,s=Ee.mounts.get(a);if(s)return s.instance.update(o),s;if(!bt(a,e).length)return null;let c=document.createElement("div"),n=document.createElement("div");c.dataset.sourceType=e,c.className="gc-embed",n.className="gc-viewport-slot",n.append(c);let g={...Yt({...ot,...vt(o.preset??ot.preset,o),...e==="summary"?{showButton:!1}:{}},o),previewScroll:!1},u=null,f=null,v=null,S=null,m=null,E=!1,M=[],l=null,h=!1,b=null;function R(){g.galleryWidth==="source"?(v?.(),v=null,l&&(n.classList.add("user-items-list-simple"),n.dataset.layoutWidth=l.mode,n.style.maxWidth=l.maximum)):v||(n.classList.remove("user-items-list-simple"),delete n.dataset.layoutWidth,n.style.removeProperty("max-width"),v=ra(n,c,a,e))}function F(){return e!=="list"&&g.preset!=="stack"&&g.galleryHeight!=="custom"&&!!a.closest(".fluid-engine > .fe-block")}function P(){F()?S||(S=oa(n,c,a)):(S?.(),S=null)}function y(L){L==="stack"?f||(f=qr(c,a)):f&&(f(),f=null)}function x(){try{u?.destroy()}finally{u=null,S?.(),S=null,y(null),v?.(),v=null,M.forEach(L=>L.classList.remove("gc-native-items-hidden")),M=[],b?.remove(),b=null,n.remove(),n.replaceChildren(c),c.inert=!1}}function A(){if(E||u||!a.isConnected)return;let L=Mt(a,e),$=bt(a,e);if(!L||!$.length)return;L.originals[0].before(n),Ea();let H=L.originals[0];l=e==="list"?{mode:H.dataset.layoutWidth||"full",maximum:H.style.maxWidth}:null,R();let V=null;if(e==="list"){let G=h?H.cloneNode(!0):H;h&&(b=G,G.removeAttribute("id"),G.querySelectorAll("[id]").forEach(q=>q.removeAttribute("id")),n.append(G)),V=ta(n,G,h?[...G.querySelectorAll(".list-item")]:L.rows)}(!V||h)&&(M=L.originals,M.forEach(G=>G.classList.add("gc-native-items-hidden"))),P(),y(g.preset),u=Pa(c,$,g,V),c.inert=h}function D(){if(!E){E=!0,a.classList.remove("gc-edit-preview");try{x()}finally{m?.(),Ee.mounts.delete(a)}}}let d={instance:{update(L={}){if(E)return;let $=g.galleryWidth;g={...Yt(g,L),previewScroll:!1},u&&(g.galleryWidth!==$&&R(),P(),y(g.preset),u.update(g))},setEditPreview(L){if(!(E||!nt()||L===h)){if(h=L,a.classList.toggle("gc-edit-preview",L),!L){x();return}try{A()}catch($){throw this.setEditPreview(!1),$}}},goTo(L){u?.goTo(L)},setPlaying(L){g.autoplay=L,u?.setPlaying(L)},getOptions(){return{...g}},getActive(){return u?.getActive()??0},destroy:D},host:c,source:a,destroy:D};try{m=Ci(L=>{if((h||L)&&x(),h=!1,a.classList.remove("gc-edit-preview"),!L)try{A()}catch($){throw x(),$}}),nt()||A(),Ee.mounts.set(a,d)}catch(L){throw D(),L}return d}var At,ot,Ee,Ai=Q(()=>{ei();Hi();ti();Ft();Yi();Ki();Qi();to();Zo();Wt();xi();ia();aa();na();da();ua();ha();ma();ya();xa();ka();Ca();_o();No();Go();Ro();At=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],ot={...qt,...wi,popupDesktopLayout:"split",colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};Ee=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:Pa,embed:Mi,presets:At,loadPostData:jt}});var za,La=Q(()=>{za=`:host {
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
`});function re(t,e,o){let r=document.createElement(t);return e&&(r.className=e),o!==void 0&&(r.textContent=o),r}function Le(t,e,o){let r=re("button",t,e);return r.type="button",o&&r.setAttribute("aria-label",o),r}function ja(t){let e=re("span","select-box");return e.append(t),e}function ze(t,e,o,r,i,a=""){return{key:t,label:e,type:"range",min:o,max:r,step:i,unit:a}}function Xe(t,e,o){return{key:t,label:e,type:"select",choices:Object.entries(o).map(([r,i])=>({value:r,label:i}))}}function ht(t,e,o){return{key:t,label:e,type:"color",when:o,independent:!0}}function Jt(t,e){let o=t.preset,r=at(o),i=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},ze("cardWidth","Card width",80,o==="timed"?960:o==="spiral"?720:560,1,"px"),ze("stageHeight",r?"Minimum gallery height":"Gallery height",r?0:300,1200,1,"px")];if(e!=="list"&&(i.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&i.splice(i.findIndex(n=>n.key==="stageHeight"),1)),o==="spiral")i.push(...wt);else if(i.push(ze("gap","Spacing",0,100,1,"px")),o!=="infinite"&&o!=="timed"){let n={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[o]||"Depth";i.push(ze("depth",n,0,100,1))}let a=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":o==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(o==="arc-tabs"||o==="timed")&&a.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),o!=="stack"&&(a.push({key:"showControls",label:"Show controls",type:"checkbox"}),a.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),o!=="spiral"&&a.push({...ze("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),a.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let s=ii.has(o),c=[{title:"Size & spacing",fields:i},{title:"Mobile overrides",fields:[{...i.find(n=>n.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...i.find(n=>n.key===(o==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:o==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:a},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:Fr},...o==="spiral"?[ze("spiralRadius","Corner radius",0,64,1,"px"),ze("borderWidth","Border width",0,12,1,"px"),ht("spiralRim","Border color")]:[ze("radius","Corner radius",0,64,1,"px"),ze("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},ze("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(o)?[Xe("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),ht("backColor","Back color",["backFace","solid"])]:[],...o==="stack"?[]:[Xe("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...ze("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...s?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...o==="stack"?[]:[{title:"Control styling",fields:[ze("controlSize","Button size",44,72,1,"px"),Xe("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Xe("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Xe("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),ht("controlFill","Button background",["controlPalette","custom"]),ht("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...s?[ze("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(n=>({value:n,label:n+" rem"}))]}],Xe("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Xe("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),ht("titleColor","Custom title color",["titlePalette","custom"])]},...s?$i({range:ze,select:Xe,swatch:ht}):[]];if(s){c=Ni(t,e,{range:ze,select:Xe,swatch:ht},c);for(let n of c)if(n.title==="Mobile")for(let g of n.fields.slice(1))g.condition=u=>u.mobileSizing,g.mobileRange=!!g.inherits}if(e==="summary"){let n={...Xe("popupDesktopLayout","Desktop layout",{split:"Split panel",drawer:"Slide-in drawer"}),when:["clickAction","preview"]},g=c.find(u=>u.title==="Popup");g?g.fields.unshift(n):c.push({title:"Popup",fields:[n]})}if(s){for(let n of c)if(n.fields=n.fields.flatMap(g=>{if(g.type!=="color"||!Bt.includes(g.key))return[g];let u=g.when||(g.independent?void 0:["colorSource","custom"]);return[{...Xe(g.key+"Swatch",g.label+" palette",{custom:"Custom",...oi}),type:"palette",when:u,condition:g.condition},{...g,when:u,condition:g.condition,customFor:g.key+"Swatch"},{...ze(g.key+"Opacity",g.label+" opacity",0,100,1,"%"),when:u}]}),n.typography)for(let g of n.fields)g.typography=n.typography}return c}function Ia(t){return{...ot,stageHeight:at(t.preset??ot.preset)?0:590,...t.preset==="spiral"?Qe:{},colorSource:"section",typeSource:"native",...t}}function Rr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",o=t.name?.trim()||e,r=t.items?.length||0;return`${o.toLowerCase().includes(e.toLowerCase())?o:`${o} \xB7 ${e}`} \xB7 ${r} ${r===1?"item":"items"}`}function Dr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let o=e.ownerDocument,r=o.defaultView,i=0;function a(){i=0;let g=e.getBoundingClientRect();if(!g.width||!g.height||!e.offsetHeight)return;let u=g.height/e.offsetHeight,f=t.getBoundingClientRect(),v=g.width/e.offsetWidth,S=Math.min(g.bottom,r.innerHeight),m=S;for(let E of[.1,.5,.9]){let M=g.left+(f.left+f.width*E)*v,l=o.elementFromPoint(M,S-2);if(!(!l||l===e))for(;l&&!l.contains(e);){let h=l.getBoundingClientRect();h.bottom>=S-2&&h.height>0&&h.height<g.height/2&&(m=Math.min(m,h.top)),l=l.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((g.bottom-m)/u))+"px")}function s(){i||(i=requestAnimationFrame(a))}let c=new ResizeObserver(s);c.observe(e),c.observe(o.documentElement);let n=new MutationObserver(s);return n.observe(o.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),r.addEventListener("resize",s),r.addEventListener("transitionend",s),a(),()=>{c.disconnect(),n.disconnect(),r.removeEventListener("resize",s),r.removeEventListener("transitionend",s),cancelAnimationFrame(i)}}function Ta({source:t,options:e,trigger:o,onPreset:r,onOption:i,onClose:a,onRestore:s,onSave:c,getSaveState:n,getCode:g,getStyle:u,applyStyle:f}){let v=document.activeElement,S=t,m=Ia(e),E=!1,M=!1,l=0,h=new Map,b=[],R=new Map;function F(){for(let[w,k]of R)w.hidden=!m[k]}let P=new Map,y=re("div");y.setAttribute("data-gc-author-panel",""),Vt(y);let x=y.attachShadow({mode:"open"}),A=re("style");A.textContent=za;let D=re("aside","panel");D.setAttribute("aria-labelledby","gc-author-heading");let j=re("header","header"),d=re("div","heading"),L=re("h2","","Gallery settings");L.id="gc-author-heading";let $=re("p","target"),H=re("p","save-state");H.setAttribute("role","status"),d.append(L,$,H);function V(w=n()){H.textContent!==w&&(H.textContent=w,H.dataset.saved=String(w==="Saved to page"))}let G=re("div","header-actions"),q=Le("icon-button","\u2212","Minimize settings");q.setAttribute("aria-controls","gc-author-controls"),q.setAttribute("aria-expanded","true");let I=Le("icon-button","\xD7","Close settings");G.append(q,I),j.append(d,G);let W=re("div","controls");W.id="gc-author-controls";let T=re("div","scroll");T.tabIndex=0,T.setAttribute("aria-label","Layout settings");let X=re("label","preset-row"),B=re("select","preset-select");B.setAttribute("aria-label","Layout");for(let w of At.filter(k=>t.type==="list"||k.id!=="stack")){let k=re("option","",w.name);k.value=w.id,B.append(k)}X.append(re("span","field-label","Layout"),ja(B));let K=re("div","groups"),Y=re("div","style-actions"),ee=Le("text-button","Copy style"),de=Le("text-button","Paste style");Y.append(ee,de);let U=re("div","style-transfer");U.hidden=!0;let _=re("textarea");_.setAttribute("aria-label","Gallery style"),_.spellcheck=!1;let se=Le("secondary","Apply style"),oe=Le("text-button","Close","Close style transfer"),ne=re("p","field-error","Paste a gallery style created with Copy style.");ne.id="gc-style-error",ne.hidden=!0,ne.setAttribute("role","alert");function he(){ne.hidden=!0,_.removeAttribute("aria-invalid"),_.removeAttribute("aria-describedby")}_.addEventListener("input",he),U.append(_,ne,se,oe),T.append(X,Y,U,K);let pe=re("footer","footer"),fe=re("div","export-actions"),be=Le("primary","Save to page"),Me=Le("secondary","Copy code"),ve=Le("text-button","Download header backup");ve.hidden=!0;let ae=null,xe=Le("secondary","View code");xe.setAttribute("aria-expanded","false"),xe.setAttribute("aria-controls","gc-author-code"),fe.append(be,Me);let Z=re("div","code-view");Z.id="gc-author-code",Z.hidden=!0;let Ge=re("label","code-label","Page Header Code Injection"),ge=re("textarea");ge.readOnly=!0,ge.spellcheck=!1,ge.setAttribute("aria-label","Page header code"),Ge.append(ge),Z.append(Ge);let Ve=re("div","footer-line"),me=re("span","status");me.setAttribute("role","status");let ke=Le("text-button","Reset preview");Ve.append(me,ke);let Pe=re("div","backup-actions"),je=Le("text-button","Remove layout");je.hidden=n()==="Not saved yet",Pe.append(xe,ve,je);let Te=re("div","removal");Te.hidden=!0,Te.append(re("p","","Restore the native "+S.name+" and remove its saved layout from this page?"));let qe=Le("secondary","Keep layout"),ct=Le("secondary","Remove saved layout");Te.append(qe,ct),pe.append(fe,Pe,Z,Te,Ve),W.append(T,pe),D.append(j,W),x.append(A,D),document.body.append(y);let lt=Dr(y);function De(w){let{definition:k,input:O,output:te,row:ie}=w,ce=m[k.key];if(k.when&&(ie.hidden=m[k.when[0]]!==k.when[1]),k.condition&&(ie.hidden=k.when&&m[k.when[0]]!==k.when[1]||!k.condition(m)),k.type==="palette"){w.refresh?.();for(let J of O.children)J.setAttribute("aria-pressed",String(J.value===ce));return}if(k.customFor&&m[k.customFor]!=="custom"){ie.hidden=!0;return}if(k.type==="checkbox"){O.checked=!!ce;return}if(k.type==="range"){let J=k.key==="spiralRise"&&m.spiralRiseUnit==="percent"?{...k,...k.percent}:k;O.min=String(J.min),O.max=String(J.max),O.step=String(J.step);let le=k.inherits&&ce==null;w.enable&&(w.enable.checked=!le,O.disabled=!!le),O.value=String(le?m[k.inherits]:ce);let ue=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(J.key)&&J.min===0&&Number(O.value)===0?"Auto":`${O.value}${J.unit||""}`;te.textContent=le?`Inherit \xB7 ${ue}`:ue,O.setAttribute("aria-valuetext",ue);return}O.value=String(ce),k.type==="color"&&(k.independent||(ie.hidden=m.colorSource==="section"),te.textContent=O.value.toUpperCase())}function Oe(){V(),l+=1,me.textContent="",Z.hidden||(ge.value=g())}function Be(w,k){let O=m.spiralRiseUnit,te=h.get(w)?.definition.typography;if(te&&!m[te]&&(m[te]=!0,i(te,!0)),m={...m,[w]:k},w==="spiralRiseUnit"&&O!==k){let J=Math.max(1,m.stageHeight),le=k==="percent"?Math.max(1,Math.min(30,Math.round(m.spiralRise/J*1e3)/10)):Math.max(8,Math.min(280,Math.round(m.spiralRise*J/100)));m.spiralRise=le,i(w,k),i("spiralRise",le),De(h.get("spiralRise"))}else i(w,k);let ie=w.replace(/Swatch$|Opacity$/,""),ce=ie==="titleColor"?"titlePalette":ie==="descriptionColor"?"descriptionCustom":null;if(ce){let J=ce==="titlePalette"?"custom":!0;m[ce]=J,i(ce,J)}w==="galleryHeight"&&(et(),h.get(w)?.input.focus({preventScroll:!0})),w==="colorSource"?h.forEach(De):De(h.get(w));for(let J of h.values())(J.definition.inherits===w||J.definition.when?.[0]===w||J.definition.customFor===w)&&De(J);h.forEach(De),F(),Oe()}function Fe(w){let{key:k,label:O,type:te}=w,ie=re(w.inherits||te==="palette"?"div":"label",`field field-${te}`);w.when&&ie.setAttribute("data-subsetting","");let ce=re("span","field-label",O);if(te==="palette"){let ue=re("div","palette-chips"),ye=getComputedStyle(S.root);ue.setAttribute("role","group"),ue.setAttribute("aria-label",O);for(let Ne of w.choices){let Ce=Le("palette-chip",Ne.value==="custom"?"+":"",Ne.label);Ce.value=Ne.value,Ce.title=Ne.label;let $e=ye.getPropertyValue("--"+Ne.value+"-hsl").trim();$e?Ce.style.backgroundColor="hsl("+$e+")":Ne.value!=="custom"&&(Ce.textContent=Ne.label),Ce.addEventListener("click",()=>Be(k,Ne.value)),ue.append(Ce)}ie.append(ce,ue);let _e={definition:w,row:ie,input:ue};return h.set(k,_e),De(_e),ie}let J=re(te==="select"?"select":"input");if(J.setAttribute("aria-label",O),J.dataset.option=k,te==="select")for(let ue of w.choices){let ye=re("option","",ue.label);ye.value=ue.value,J.append(ye)}else J.type=te;let le;(te==="range"||te==="color")&&(le=re("output","value"),le.setAttribute("aria-hidden","true")),ie.append(ce),le&&ie.append(le),ie.append(te==="select"?ja(J):J);let we={definition:w,input:J,output:le,row:ie};if(w.inherits&&!w.mobileRange){let ue=re("input");ue.type="checkbox",ue.setAttribute("aria-label","Customize "+O.toLowerCase());let ye=re("label","override-toggle");ye.append(ue,ce),ie.prepend(ye),we.enable=ue,ue.addEventListener("change",()=>Be(k,ue.checked?m[w.inherits]:null))}return h.set(k,we),De(we),J.addEventListener(te==="range"||te==="color"?"input":"change",()=>{let ue=te==="range"||w.numeric?Number(J.value):te==="checkbox"?J.checked:J.value;Be(k,ue)}),ie}function et(){let w=new Map([...P].map(([k,O])=>[k,O.open]));b.splice(0).forEach(k=>k()),R.clear(),h.clear(),P.clear(),K.replaceChildren();for(let k of Jt(m,S.type)){let O=re("details","group");O.open=w.get(k.title)??["Elements","Size & spacing"].includes(k.title);let te=re("summary","",k.title),ie=re("div","group-body"),ce={Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[k.title];ce&&R.set(O,ce);let J;for(let le of k.fields){let we=Fe(le);if(le.type==="palette"){let ue=le.key.slice(0,-6),ye=re("div","paint-row"),_e=Le("paint-trigger","",le.label.replace(/ palette$/,"")),Ne=re("span","field-label",le.label.replace(/ palette$/,""));J=re("div","paint-popup"),J.popover="auto",_e.popoverTargetElement=J,ye.append(Ne,_e,J),ie.append(ye),J.append(we);let Ce=()=>{ye.hidden=we.hidden;let _a=m[le.key],zi=getComputedStyle(S.root).getPropertyValue("--"+_a+"-hsl");if(_e.style.setProperty("--chip",zi?"hsl("+zi+")":m[ue]),_e.style.setProperty("--alpha",m[ue+"Opacity"]/100),!$e.matches(":popover-open"))return;let Pt=_e.getBoundingClientRect(),ji=$e.offsetWidth,Qt=$e.offsetHeight;$e.style.left=Math.max(8,Math.min(innerWidth-ji-8,Pt.right-ji))+"px",$e.style.top=Math.max(8,Math.min(innerHeight-Qt-8,Pt.bottom+Qt+8<=innerHeight?Pt.bottom+4:Pt.top-Qt-4))+"px"},$e=J,ft=new ResizeObserver(Ce),Et=()=>{ft.disconnect(),window.removeEventListener("scroll",Ce,!0),window.removeEventListener("resize",Ce)};b.push(Et),J.addEventListener("toggle",()=>{$e.matches(":popover-open")?(ft.observe($e),window.addEventListener("scroll",Ce,!0),window.addEventListener("resize",Ce),Ce()):Et()}),h.get(le.key).refresh=Ce,Ce()}else J&&(le.customFor||le.key.endsWith("Opacity"))?(J.append(we),le.customFor||(J=null)):(J=null,ie.append(we))}O.append(te,ie),K.append(O),P.set(k.title,O)}F()}function He(w){if(M)return;let k=m.preset;S=w.source??S,w.options&&(m=Ia(w.options)),$.textContent=Rr(S),$.title=S.selector||$.textContent,B.value=m.preset,!h.size||k!==m.preset?et():(h.forEach(De),F()),Oe()}function Ye(w){Z.hidden=!w,xe.textContent=w?"Hide code":"View code",xe.setAttribute("aria-expanded",String(w)),w&&(ge.value=g(),ge.focus({preventScroll:!0}),ge.select())}let Je=new Set([document,o?.ownerDocument]);window.frameElement?.id==="sqs-site-frame"&&Je.add(window.parent.document);function Se(w){let k=w.composedPath();!k.includes(y)&&!k.includes(o)&&a(!1)}function Ue(){for(let w of Je)w?.removeEventListener("click",Se,!0);window.removeEventListener("pagehide",Ue)}function Re(w=!0){if(M)return;M=!0,l+=1;let k=w&&document.activeElement===y;Ue(),document.removeEventListener("keydown",p),b.splice(0).forEach(O=>O()),lt(),y.remove(),k&&v?.isConnected&&v.focus({preventScroll:!0})}function Ke(w){if(!M)try{w()}finally{Re()}}function p(w){if(!(w.key!=="Escape"||w.defaultPrevented||w.isComposing)&&!x.querySelector(".paint-popup:popover-open")){if(!Te.hidden){w.preventDefault(),N(!1);return}document.querySelector("dialog[open]")||w.composedPath().some(k=>k?.getAttribute?.("aria-modal")==="true")||(w.preventDefault(),!U.hidden&&(U.contains(x.activeElement)||Z.hidden)?(U.hidden=!0,(_.readOnly?ee:de).focus()):Z.hidden?Ke(a):(Ye(!1),xe.focus()))}}q.addEventListener("click",()=>{E=!E,W.hidden=E,y.toggleAttribute("data-minimized",E),q.textContent=E?"+":"\u2212",q.setAttribute("aria-expanded",String(!E)),q.setAttribute("aria-label",E?"Expand settings":"Minimize settings")}),I.addEventListener("click",()=>Ke(a)),ke.addEventListener("click",()=>Ke(s)),B.addEventListener("change",()=>r(B.value)),xe.addEventListener("click",()=>Ye(Z.hidden));function C(w,k){he(),U.hidden=!1,se.hidden=w,_.readOnly=w,_.value=k,_.placeholder=w?"":"Paste the copied gallery style",_.focus(),w&&_.select()}ee.addEventListener("click",async()=>{let w=u();try{await navigator.clipboard.writeText(w),M||(U.hidden=!0,me.textContent="Style copied")}catch{if(M)return;C(!0,w),me.textContent="Style selected. Choose Copy."}}),de.addEventListener("click",()=>{me.textContent="",C(!1,"")}),oe.addEventListener("click",()=>{U.hidden=!0,(_.readOnly?ee:de).focus()}),se.addEventListener("click",()=>{if(!f(_.value)){ne.hidden=!1,_.setAttribute("aria-invalid","true"),_.setAttribute("aria-describedby",ne.id),_.focus();return}U.hidden=!0,me.textContent="Style applied to this preview",de.focus()}),ve.addEventListener("click",()=>{if(!ae)return;let w=URL.createObjectURL(new Blob([ae.header],{type:"text/plain"})),k=document.createElement("a");k.href=w,k.download="gallery-header-backup-"+ae.collectionId+".txt",k.click(),setTimeout(()=>URL.revokeObjectURL(w),1e3)});async function z(w=!1){if(w&&N(!1),!be.disabled){be.disabled=ke.disabled=je.disabled=!0,T.inert=!0,be.textContent="Saving\u2026",V(w?"Removing\u2026":"Saving\u2026"),me.textContent=w?"Removing layout\u2026":"Saving to page header\u2026";try{await c(k=>{ae=k,M||(ve.hidden=!1)},w),M||(me.textContent="Saved to page header")}catch(k){M||(me.textContent=k.message||"Save failed. Copy code is still available.")}finally{M||(be.disabled=ke.disabled=je.disabled=!1,je.hidden=n()==="Not saved yet",T.inert=!1,be.textContent="Save to page",V())}}}be.addEventListener("click",()=>z());function N(w){Te.hidden=!w,T.inert=w,fe.hidden=Pe.hidden=Ve.hidden=w,w?(Ye(!1),qe.focus()):je.focus()}je.addEventListener("click",()=>N(!0)),qe.addEventListener("click",()=>N(!1)),ct.addEventListener("click",()=>z(!0)),Me.addEventListener("click",async()=>{let w=++l,k=g();try{await navigator.clipboard.writeText(k),!M&&w===l&&(me.textContent="Page code copied")}catch{if(M||w!==l)return;Ye(!0),me.textContent="Code selected. Choose Copy."}});for(let w of Je)w?.addEventListener("click",Se,!0);return window.addEventListener("pagehide",Ue),document.addEventListener("keydown",p),He({source:t,options:e}),B.focus({preventScroll:!0}),{element:y,update:He,destroy:Re}}var Fr,qa=Q(()=>{ki();Tt();Ft();Ai();La();Fr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});function Ba({activate:t,configure:e,installed:o}){let r=window.parent.document,i="gc-editor-blocks:"+location.pathname,a=new Set;try{a=new Set(JSON.parse(sessionStorage.getItem(i)||"[]"))}catch{}let s=".sqs-block-summary-v2[id],.sqs-block-gallery[id]",c="[data-fluid-engine-block][data-block-id]",n=()=>document.querySelector(".sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active"),g=r.createElement("button");g.type="button",g.style.cssText="align-self:center;background:white;color:#222;border:0;border-left:1px solid #ddd;padding:8px 10px;font:500 13px system-ui;cursor:pointer;white-space:nowrap";let u=0;function f(){let l=document.querySelectorAll(c+'[data-is-selected="true"]');return l.length===1?l[0].querySelector(s):null}function v(){u=0;for(let R of document.querySelectorAll(s))a.has(R.id)||o(R)?(R.classList.add("gc-editor-bound"),t(R)):R.classList.remove("gc-editor-bound");let l=n()&&f(),h=l&&r.querySelector('[data-test="block-toolbar"]');if(!h){g.remove();return}let b=l.classList.contains("gc-editor-bound")?"Configure carousel":"Use as carousel";g.textContent!==b&&(g.textContent=b),g.parentElement!==h&&h.append(g)}function S(){u||(u=requestAnimationFrame(v))}function m(){try{sessionStorage.setItem(i,JSON.stringify([...a]))}catch{}}g.onpointerdown=l=>l.stopPropagation(),g.onclick=l=>{l.stopPropagation();let h=f();h&&(h.classList.contains("gc-editor-bound")?e(h,g):(a.add(h.id),m(),v()))};let E=new MutationObserver(S);E.observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["data-is-selected"]});let M=new MutationObserver(S);return M.observe(r.body,{childList:!0,subtree:!0}),S(),{forget(l){a.delete(l.id),m(),S()},destroy(){E.disconnect(),M.disconnect(),cancelAnimationFrame(u),g.remove(),document.querySelectorAll(".gc-editor-bound").forEach(l=>l.classList.remove("gc-editor-bound"))}}}var Fa=Q(()=>{});var Da,Ra=Q(()=>{Da=`.gc-config-position{position:relative!important}
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

/* The editor needs a real hit area up to each edge. Anchor its wrappers to
   the grid cell while keeping the native grid out of intrinsic sizing. */
.sqs-edit-mode-active [data-fluid-engine-block] .fluid-engine-block-contents:has(> .gc-editor-bound),
.sqs-edit-mode-active [data-fluid-engine-block] .gc-editor-bound {
  position:absolute!important;inset:0;height:auto!important;min-height:0!important;contain:size;
}
.sqs-edit-mode-active [data-fluid-engine-block] .gc-editor-bound > .sqs-block-content {
  display:contents!important;
}
.sqs-edit-mode-active [data-fluid-engine-block] .gc-editor-bound:not(.gc-edit-preview) > .sqs-block-content > :is(.summary-block-wrapper,.sqs-gallery-container,.sqs-gallery) {
  position:absolute!important;inset:0;overflow:hidden;
}
.sqs-edit-mode-active [data-gc-author-panel].gc-editor-panel {display:block!important}
`});var Ga={};Ii(Ga,{startInline:()=>Li});function st(t,e={},o){let r=Zt.get(t),i={...ot,...t==="spiral"?Qe:vt(t,e),preset:t,colorSource:"section",typeSource:"native",...o==="summary"?{showButton:!1}:{},cardWidth:r.width,stageHeight:at(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,s]of Object.entries(e))a.startsWith("mobile")&&i[a]===null?Number.isFinite(s)&&s>=0&&(i[a]=s):a!=="preset"&&Object.hasOwn(i,a)&&typeof s==typeof i[a]&&(i[a]=s);return i.popupDesktopLayout!=="drawer"&&(i.popupDesktopLayout="split"),t==="spiral"&&("mobileSizing"in e||(i.mobileSizing=i.mobileGap!=null||i.mobileCardWidth!=null),"titleCustom"in e||(i.titleCustom=!!(i.titleSize||i.titlePalette==="custom"||i.titleWeight!=="inherit")),"bodyCustom"in e||(i.bodyCustom=!!(i.descriptionCustom||i.descriptionSize)),"overlayEnabled"in e||(i.overlayEnabled=i.imageTintOpacity>0),"cardBorderEnabled"in e||(i.cardBorderEnabled=i.borderWidth>0)),i}function Na(t){return Jt(t).flatMap(e=>e.typography?[...e.fields,{key:e.typography,type:"checkbox"}]:e.fields).filter(e=>!Oa.has(e.key))}function Wr(t){let e=Object.fromEntries(Na(t).map(({key:o})=>[o,t[o]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Or(t,e){let o;try{o=JSON.parse(t)}catch{return null}if(o?.format!=="gallery-studio-style"||o.version!==1||!Zt.has(o.preset)||!o.values||typeof o.values!="object"||Array.isArray(o.values))return null;let r=st(o.preset);for(let i of Oa)r[i]=e[i];for(let i of Na(r)){let a=o.values[i.key];if(a!==void 0){if(i.type==="range"){if(i.inherits&&a===null)continue;let s=i.percent&&o.values.spiralRiseUnit==="percent"?i.percent:i;if(!Number.isFinite(a)||a<s.min||a>s.max)return null}else{if(i.type==="checkbox"&&typeof a!="boolean")return null;if(["select","palette"].includes(i.type)&&!i.choices.some(s=>s.value===a))return null}if(i.type==="color"&&!/^#[0-9a-f]{6}$/i.test(a))return null;r[i.key]=a}}return r}function $a(t){return t.replace(/^spiralRim/,"borderColor").replace(/^spiralRadius$/,"radius")}function Pi(t,e){let o=new Map;for(let r of Jt(t,e))if(["Elements","Image","Title","Description","Card","Control styling","Theme"].includes(r.title)){for(let i of r.fields)i.key!=="cardWidth"&&o.set($a(i.key),i);r.typography&&o.set(r.typography,{key:r.typography})}for(let r of["titlePalette","descriptionCustom"])o.set(r,{key:r});return o}function Ei(t,e){let o=st(e.preset,{},t.source.type);for(let[r,i]of Pi(e,t.source.type))e[i.key]!==o[i.key]&&t.shared.set(r,e[i.key])}function Ha(t,e){return st(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"},e)}function Kt(t,e){let o=st(e.preset,{},t.type),r={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};for(let a of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])r[a]=e[a];at(e.preset)&&(r.stageHeight=e.stageHeight);for(let a of Object.keys(o))e.colorSource==="section"&&Wa.has(a)||e[a]!==o[a]&&(r[a]=e[a]);t.editorBlockFit&&(r.editorBlockFit=!0);let i={v:1,selector:t.selector,type:t.type,options:r};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(i,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Li(){let t=window.GalleryStudioInline;if(t?.editorBlocks)return t;t&&t.destroy();let e=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure],script[type="application/json"][data-gallery-editor]'),o=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!e&&!o.length)return null;let r=yi(),i=new Map(r.map(l=>[l.root,{source:l,installed:null,options:null,mounted:null,presets:new Map,shared:new Map}])),a=null,s=null,c=null,n=!1,g=null,u=[];function f(l,h){return l.mounted?l.mounted.instance.update({...h,previewScroll:!1}):l.mounted=Mi({selector:l.source.selector,type:l.source.type,options:h}),l.mounted&&(l.options={...h}),!!l.mounted}function v(l=!0){if(!s)return;let h=s;s=null,a?.destroy(l),a=null,h.button?.setAttribute("aria-expanded","false"),l&&h.button?.focus({preventScroll:!0})}function S(l){v(),l.installed||(l.source.editorBlockFit=!1,g?.forget(l.source.root)),l.presets.clear(),l.shared.clear(),l.installed?(f(l,l.installed),Ei(l,l.installed)):(l.mounted?.destroy(),l.mounted=null,l.options=null)}function m(l,h=l.button){if(s===l){v();return}v(!1);let{source:b}=l;if(l.mounted||(b.items=bt(b.root,b.type)),!b.items.length){let P="Add items in Squarespace, then try again";l.button.querySelector("span").textContent=P,l.button.setAttribute("aria-label",P);return}l.button.querySelector("span").textContent="Configure layout",l.button.setAttribute("aria-label","Configure "+b.name+" layout");let R=l.options||l.installed||st("arc-tabs",b.type!=="list"?{galleryWidth:"source"}:{},b.type);if(b.type!=="list"&&R.preset==="stack"&&(R=st("arc-tabs",{galleryWidth:"source"}),f(l,R)),!l.mounted&&!f(l,R)){l.button.textContent="No supported layout here";return}s=l;let F=P=>{f(l,P),l.presets.set(P.preset,{...P})};a=Ta({source:b,trigger:h,options:{...l.options},onClose:v,onRestore:()=>S(l),onPreset:P=>{if(!Zt.has(P)||b.type!=="list"&&P==="stack")return;l.presets.set(l.options.preset,{...l.options});let y={...l.presets.get(P)||st(P,{},b.type),galleryWidth:l.options.galleryWidth,galleryHeight:l.options.galleryHeight},x=Pi(y,b.type);for(let[A,D]of l.shared){let j=x.get(A);j&&(!j.choices||j.choices.some(d=>d.value===D))&&(y[j.key]=D)}F(y),a.update({source:b,options:{...l.options}})},onOption:(P,y)=>{if(!Object.hasOwn(l.options,P)||P==="preset")return;let x={...l.options,[P]:y},A=$a(P);Pi(l.options,b.type).has(A)&&l.shared.set(A,y),F(x)},getSaveState:()=>l.installed?Kt(b,l.options)===Kt(b,l.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Kt(b,l.options),onSave:async(P,y=!1)=>{if(n)throw Error("Another gallery is still saving. Please wait.");let x={...l.options},A=Bi();n=!0;try{await Fi({snippet:Kt(b,x),context:A,onBackup:P,remove:y}),y?(E.delete(b.selector),b.editorBlockFit=!1,l.installed=null,s===l?S(l):(l.presets.clear(),l.shared.clear(),l.mounted?.destroy(),l.mounted=null,l.options=null)):l.installed=x,g?.forget(b.root)}finally{n=!1}},getStyle:()=>Wr(l.options),applyStyle:P=>{let y=Or(P,l.options);return!y||b.type!=="list"&&y.preset==="stack"?!1:(l.presets.set(l.options.preset,{...l.options}),l.shared.clear(),Ei(l,y),F(y),a.update({source:b,options:l.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),l.button.setAttribute("aria-expanded","true")}let E=new Map;for(let l of o)try{let h=JSON.parse(l.textContent),b=document.querySelectorAll(h.selector),R=b.length===1&&i.get(b[0]);if(h.v!==1||!Zt.has(h.options?.preset)||((h.type==="gallery"||h.type==="summary")&&E.set(h.selector,h),!R||h.type!==R.source.type))continue;R.source.editorBlockFit=h.options.editorBlockFit===!0,R.installed=Ha(h.options,h.type),Ei(R,R.installed)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let l of i.values())l.installed&&f(l,l.installed);if(e){let h=function(x=!1){l.setAttribute("aria-pressed",String(x)),l.querySelector("span").textContent=x?"Edit native content":"Preview galleries",l.hidden=!nt()||![...i.values()].some(A=>A.mounted)},b=function(x){if(!x.mounted||x.source.root.isConnected)return;let A=x.source.root,D=document.querySelectorAll(x.source.selector);if(D.length!==1)return;let j=D[0];x.mounted.destroy(),x.mounted=null,x.source.root=j,i.delete(A),i.set(j,x),f(x,x.options);let d=j.querySelector(x.source.type==="list"?".user-items-list":".sqs-block-content")||j;x.button&&(getComputedStyle(d).position==="static"&&d.classList.add("gc-config-position"),d.append(x.button))},F=function(x){let{source:A}=x;if(!A.selector)return;let D=A.root.querySelector(A.type==="list"?".user-items-list":".sqs-block-content")||A.root,j=getComputedStyle(D).position==="static";j&&D.classList.add("gc-config-position");let d=document.createElement("button");d.type="button",d.className="gc-config-launch",d.setAttribute("aria-expanded","false"),d.setAttribute("aria-label","Configure "+A.name+" layout"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',d.addEventListener("click",()=>m(x)),D.append(d),x.button=d,u.push(()=>{d.remove(),j&&D.classList.remove("gc-config-position")})},P=function(x){if(i.has(x))return i.get(x);let A=[...i.values()].find(L=>L.source.root.id===x.id&&!L.source.root.isConnected);if(A){let L=A.options;return A.mounted?.destroy(),A.mounted=null,i.delete(A.source.root),A.source.root=x,i.set(x,A),F(A),L&&f(A,L),A}let D=yi().find(L=>L.root===x);if(!D)return null;let j={source:D,installed:null,options:null,mounted:null,presets:new Map,shared:new Map},d=E.get(D.selector);return d&&d.type===D.type&&(j.installed=Ha(d.options,D.type)),i.set(x,j),F(j),j};c=document.createElement("style"),c.textContent=Da,document.head.append(c);let l=document.createElement("button");l.type="button",l.className="gc-edit-eye",l.setAttribute("aria-label","Preview gallery layouts"),l.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',l.onclick=()=>{let x=l.getAttribute("aria-pressed")!=="true";for(let A of[...i.values()])b(A),A.mounted?.instance.setEditPreview(x);h(x)},document.body.append(l),h();let R=Ci(x=>{x||requestAnimationFrame(()=>{if(l.isConnected)for(let A of[...i.values()])b(A)}),h()});u.push(()=>{R(),l.remove()});for(let x of i.values())F(x);let y=new WeakSet;g=Ba({installed(x){let A=i.get(x)?.installed||E.get("#"+CSS.escape(x.id))?.options;return!!(A&&A.galleryHeight!=="custom"&&(i.get(x)?.source.editorBlockFit||E.get("#"+CSS.escape(x.id))?.options.editorBlockFit))},activate(x){let A=P(x);A&&(A.source.editorBlockFit=!0,A.button?.isConnected||F(A),A.mounted&&y.has(A.mounted)&&x.classList.contains("gc-edit-preview")&&!A.mounted.host.isConnected&&(A.mounted.destroy(),A.mounted=null),!(!A.mounted&&!f(A,A.options||A.installed||st("arc-tabs",{galleryWidth:"source"},A.source.type)))&&(nt()&&!y.has(A.mounted)?(A.mounted.instance.setEditPreview(!0),y.add(A.mounted),h(!0)):nt()||y.delete(A.mounted)))},configure(x,A){let D=P(x);D&&(m(D,A),a?.element.classList.add("gc-editor-panel"))}}),u.push(()=>g.destroy()),window.addEventListener("pagehide",()=>g.destroy(),{once:!0})}let M={version:1,editorBlocks:!0,destroy(){v(!1);for(let l of i.values())l.mounted?.destroy();for(let l of u)l();c?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=M,M}var Zt,Wa,Oa,Ua=Q(()=>{Ri();Ai();xi();qa();Fa();Ra();Ft();Zt=new Map(At.map(t=>[t.id,t])),Wa=new Set(["background","ink","accent"]);Oa=new Set([...Wa,"colorSource","typeSource","clickAction","popupDesktopLayout"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Li,{once:!0}):Li()});var Nr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout], script[type="application/json"][data-gallery-editor]')&&(Nr=(await Promise.resolve().then(()=>(Ua(),Ga))).startInline);export{Nr as startInline};

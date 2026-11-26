var $a=Object.defineProperty;var Q=(t,e)=>()=>(t&&(e=t(t=0)),e);var Li=(t,e)=>{for(var o in e)$a(t,o,{get:e[o],enumerable:!0})};function ji(t,e){if(t===void 0)return null;let o=new Map([...t.matchAll(Ga)].map(i=>[i[1].toLowerCase(),i[2]??i[3]??i[4]??""]));if(!o.has("data-gallery-layout"))return null;if(o.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let r;try{r=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(r?.v!==1||typeof r.selector!="string"||!["list","gallery","summary"].includes(r.type)||!r.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return r}function Ua(t,e,o=!1){let r=[...e.matchAll(zi)];if(r.length!==1||r[0][0]!==e.trim())throw Error("Invalid gallery settings.");let i=ji(r[0][1],r[0][2]);if(!i)throw Error("Missing gallery settings.");let a=!1,s=t.replace(zi,(c,n,g)=>{let f=ji(n,g);return!f||f.selector!==i.selector?c:o||a?"":(a=!0,e)});return o||a?s:s+(s&&!s.endsWith(`
`)?`
`:"")+e+`
`}function Ii(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,o=e?.collection?.id,r=e?.website?.id,i=t.document.cookie.split(";").map(a=>a.trim()).find(a=>a.startsWith("crumb="))?.slice(6);if(!Pt.test(o||"")||!Pt.test(r||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!i)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:o,websiteId:r,crumb:decodeURIComponent(i)}}async function Ti({snippet:t,context:e,remove:o=!1,fetchImpl:r=fetch,onBackup:i=()=>{}}){let{collectionId:a,websiteId:s,crumb:c}=e;if(!Pt.test(a||"")||!Pt.test(s||"")||!c)throw Error("A signed-in Squarespace page is required.");async function n(){let S=await r("/api/commondata/GetCollectionSettings?collectionId="+a,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!S.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let E=await S.json(),d=E.collectionData??E;if(d?.id!==a||d.websiteId!==s||d.deleted===!0||d.folder===!0||d.dropdown===!0)throw Error("Page settings do not match this page.");if(d.headerInjectCode!=null&&typeof d.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:d,memberAreaData:E.memberAreaData??{}}}let g=await n();if(g.model.passwordProtected&&typeof g.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let f=g.model.headerInjectCode??"",m=Ua(f,t,o);if(m===f)return{unchanged:!0};i({collectionId:a,header:f,savedAt:new Date().toISOString()});let y=await n();if(JSON.stringify(y)!==JSON.stringify(g))throw Error("Page settings changed while saving. Review the page and save again.");let b;try{b=await r("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...y.model,collectionId:a,headerInjectCode:m},memberAreaData:y.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!b.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let v;try{v=await n()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((v.model.headerInjectCode??"").trim()!==m.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var Pt,zi,Ga,qi=Q(()=>{Pt=/^[a-f0-9]{24}$/i,zi=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Ga=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function Lt(t,e){let o="http://www.w3.org/2000/svg";function r(S,E,d){let h=document.createElementNS(o,S);for(let[x,D]of Object.entries(E))h.setAttribute(x,D);return d?.append(h),h}let i=r("svg",{width:0,height:0,"aria-hidden":"true"});i.style.position="absolute",t.append(i);let a=r("defs",{},i),s=r("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},a),c=r("feMorphology",{in:"SourceAlpha",operator:"dilate"},s),n=r("feGaussianBlur",{},s),g=r("feOffset",{result:"mask"},s),f=r("feFlood",{},s);r("feComposite",{in2:"mask",operator:"in"},s);let m=r("feMerge",{},s);r("feMergeNode",{},m),r("feMergeNode",{in:"SourceGraphic"},m);let y=r("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},a),b=r("feFlood",{},y);r("feComposite",{in2:"SourceGraphic",operator:"atop"},y);let v=s.cloneNode(!0);return v.id=e+"-card-shadow",a.append(v),S=>{let E=(S.cardShadowAngle??90)*Math.PI/180;v.querySelector("feMorphology").setAttribute("radius",S.cardShadowSpread||0),v.querySelector("feGaussianBlur").setAttribute("stdDeviation",(S.cardShadowBlur||0)/2);let d=v.querySelector("feOffset");d.setAttribute("dx",Math.cos(E)*(S.cardShadowDistance||0)),d.setAttribute("dy",Math.sin(E)*(S.cardShadowDistance||0)),v.querySelector("feFlood").setAttribute("flood-color",S.cardShadowColor||"#000");let h=[];S.shadowEnabled&&h.push("url(#"+s.id+")"),S.cardShadow&&h.push("url(#"+v.id+")");let x=S.shadowAngle*Math.PI/180;c.setAttribute("radius",S.shadowSpread),n.setAttribute("stdDeviation",S.shadowBlur/2),g.setAttribute("dx",Math.cos(x)*S.shadowDistance),g.setAttribute("dy",Math.sin(x)*S.shadowDistance),f.setAttribute("flood-color",S.shadowColor),b.setAttribute("flood-color",S.imageTint),t.style.setProperty("--gc-shadow-filter",h.join(" ")||"none"),t.style.setProperty("--gc-image-filter",S.imageTint.endsWith("00")&&S.imageTint.length===9?"none":"url(#"+y.id+")")}}var Qt=Q(()=>{});function Bi(t,e){let o=(s,c)=>t.toggleAttribute("data-finish-"+s,!!c),r=(s,c)=>t.style.setProperty("--finish-"+s,c);function i(s,c){let n=e[s+"Angle"]*Math.PI/180,g=e[s+"Distance"];return[Math.cos(n)*g,Math.sin(n)*g,e[s+"Blur"],e[s+"Spread"]].map(f=>f+"px").join(" ")+" "+c}for(let s of["surfaceEnabled","cardBackground","cardShadow","imageBorder","shadowEnabled","bodyCustom","overlayEnabled"])o(s.toLowerCase(),e[s]);o("padding",e.carouselPadding),o("card-padding",e.cardPadding),o("image-size",e.imageWidth!==100||e.imageAlign!=="center"),o("original",e.aspectRatio==="original"),o("crop",e.aspectRatio&&e.aspectRatio!=="layout"),o("circle",e.aspectRatio==="circle"),o("order",e.cardOrder&&e.cardOrder!=="layout"),o("align",e.cardAlign&&e.cardAlign!=="layout"),o("equal",e.cardSizing==="equal"),o("icon",e.controlIconSize),o("button-padding",e.controlPadding),o("clear-button",e.controlBackground===!1),o("title-align",e.titleAlign!=="inherit"),o("media-gap",e.mediaGap),o("title-gap",e.titleGap),o("button-gap",e.buttonGap),o("mirror",e.mirrorOverlay&&e.backFace==="mirror"),r("mirror",e.mirrorColor),o("caption",e.showDescription||e.showButton),o("image-padding",e.imagePadding);let a={surface:e.surfaceColor,"surface-radius":e.surfaceRadius+"px","carousel-padding":e.carouselPadding+"px",card:e.cardColor,"card-padding":e.cardPadding+"px","card-shadow":i("cardShadow",e.cardShadowColor),"image-border":e.imageBorderSize+"px solid "+e.imageBorderColor,"image-radius":e.imageRadius+"px","image-width":e.imageWidth+"%","image-padding":e.imagePadding+"%",left:e.imageAlign==="left"?"0":"auto",right:e.imageAlign==="right"?"0":"auto",ratio:e.aspectRatio==="circle"?"1":e.aspectRatio==="original"?"auto":e.aspectRatio?.replace(":"," / "),order:e.cardOrder==="content"?-1:1,align:{top:"start",middle:"center",bottom:"end"}[e.cardAlign]||"normal","title-align":e.titleAlign,"description-align":e.descriptionAlign,"description-weight":e.descriptionWeight,"media-gap":e.mediaGap+"px","title-gap":e.titleGap+"px","button-gap":e.buttonGap+"px",icon:e.controlIconSize+"px","button-padding":e.controlPadding+"px",duration:e.hoverDuration+"ms"};for(let[s,c]of Object.entries(a))r(s,c);e.cardBorderEnabled&&t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-line-size",(e.cardBorderEnabled?e.borderWidth:0)+"px"),t.style.setProperty("--gc-tint",e.imageTint),t.style.setProperty("--gc-tint-opacity","0")}var Fi=Q(()=>{});function Ri(t){let e=document.createElement("template");return e.innerHTML=t,e.content}function ft(t,e){return t&&URL.canParse(t,e)?new URL(t,e).href:null}function _a(t,e){let o=t.querySelector(".sqs-gallery-container"),r=Array.from(t.querySelectorAll(".slide"),i=>{let a=i.querySelector("img[data-src], img[data-image], img[src]"),s=i.querySelector(".image-slide-anchor, a[href]");return{type:i.dataset.type||null,imageUrl:ft(a?.dataset.src||a?.dataset.image||a?.getAttribute("src"),e),imageId:a?.dataset.imageId??null,dimensions:a?.dataset.imageDimensions??null,focalPoint:a?.dataset.imageFocalPoint??null,alt:a?.getAttribute("alt")??null,title:s?.dataset.title??i.querySelector(".meta-title")?.textContent??null,descriptionHtml:s?.dataset.description??i.querySelector(".meta-description")?.innerHTML??null,href:ft(s?.getAttribute("href"),e),lightbox:!!s?.classList.contains("js-gallery-lightbox-opener"),html:i.outerHTML}});return{layout:o?.dataset.design??null,settings:{...o?.dataset},slides:r}}function Xa(t,e){return Array.from(Ri(t).querySelectorAll(".sqs-block"),o=>{let r=o.dataset.sqspBlock||[...o.classList].find(a=>a.startsWith("sqs-block-")&&a!=="sqs-block-website-component")?.slice(10),i={id:o.id||null,type:r||null,typeId:o.dataset.blockType??null,html:o.outerHTML};return(r==="gallery"||o.matches(".gallery-block, .sqs-block-gallery"))&&(i.gallery=_a(o,e)),i})}async function Va(t,e){let o=await fetch(t,{mode:"same-origin",signal:e});if(!o.ok)return null;let r=await o.text(),i=Ri(r.split(/<\/head\s*>/i,1)[0]),a=Array.from(i.querySelectorAll("meta[content]"),s=>({name:s.getAttribute("property")||s.getAttribute("name")||s.getAttribute("itemprop"),content:s.getAttribute("content")})).filter(s=>s.name);return{title:i.querySelector("title")?.textContent??null,description:a.find(s=>s.name.toLowerCase()==="description")?.content??null,canonicalUrl:ft(i.querySelector('link[rel~="canonical"]')?.getAttribute("href"),o.url),meta:a}}async function zt(t,{signal:e,includeSeo:o=!0}={}){if(!t)throw new Error("A linked post URL is required.");let r=new URL(t,location.href);if(r.origin!==location.origin)throw new Error("The linked post must be on this site.");r.hash="",r.searchParams.delete("format");let i=new URL(r);i.searchParams.set("format","json");let a=await fetch(i,{mode:"same-origin",signal:e});if(!a.ok)throw new Error("Could not load post JSON ("+a.status+").");let{item:s}=await a.json();if(!s?.id||typeof s.body!="string")throw new Error("This URL did not return a post body.");let c=ft(s.fullUrl,a.url)||r.href,n=null;try{o&&(n=await Va(r,e))}catch(g){if(e?.aborted)throw g}return{id:s.id,url:c,title:s.title??null,excerptHtml:s.excerpt??null,publishedAt:s.publishOn??null,createdAt:s.addedOn??null,updatedAt:s.updatedOn??null,author:s.author??null,authorId:s.authorId??null,location:s.location??null,tags:s.tags??[],categories:s.categories??[],featuredImageUrl:ft(s.assetUrl,c),seo:{item:s.seoData??null,page:n},bodyHtml:s.body,blocks:Xa(s.body,c),rawItem:s}}var ei=Q(()=>{});function Hi(t,e,{range:o,select:r,swatch:i},a){let s=(p,A)=>({key:p,label:A,type:"checkbox"}),c=(p,A,G,W,X="px",N=1)=>o(p,A,G,W,N,X),n=(p,A,G)=>G.map(W=>({...W,when:[p,A]})),g=(p,...A)=>({title:p,fields:A.flat()}),f=p=>a.flatMap(A=>A.fields).find(A=>A.key===p),m=t.preset==="spiral",y=t.preset==="stack",b=["wall","ring","angled"].includes(t.preset),v=b||t.preset==="timed",S=m?"spiralGap":"gap",E=e!=="gallery",d={inherit:"Inherit",...Object.fromEntries(Array.from({length:9},(p,A)=>[100*(A+1),String(100*(A+1))]))},h={inherit:"Inherit",left:"Left",center:"Center",right:"Right"};function x(p,A,G,W,X,N){return{...g(p,c(G,"Size",0,4,"rem",.05),r(W,"Weight",d),i(X,"Color"),r(N,"Alignment",h)),typography:A}}function D(p,A,G,W){return[s(p,A),...n(p,!0,[c(G+"Angle","Angle",0,360,"\xB0"),c(G+"Distance","Distance",0,48),c(G+"Blur","Blur",0,40),c(G+"Spread","Spread",0,16),i(W,"Color")])]}let z=(p,A)=>({...f(A),key:p,label:"Mobile "+f(A).label.toLowerCase(),inherits:A}),P=[g("Elements",s("showImage","Show image"),s("showTitles","Show title"),...E?[s("showDescription","Show description"),s("showButton","Show button")]:[],s("showControls","Show controls")),g("Main carousel",...E?[r("heightMode","Height",{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),...n("heightMode","pixels",[c("stageHeight","Height",120,1600)]),...n("heightMode","viewport",[c("viewportHeight","Window height",15,100,"%")])]:[],c("carouselPadding","Carousel padding",0,64),f("spiralWidth"),s("surfaceEnabled","Background"),...n("surfaceEnabled",!0,[i("surfaceColor","Color"),c("surfaceRadius","Corner radius",0,64)]),r("edgeMode","Edges",{preset:"Layout default",hard:"Hard edge",gradient:"Fade at edges"}),f("edgeFade"),f("spiralGap"),s("autoplay","Autoplay"),...n("autoplay",!0,[r("playbackMode","Movement",{continuous:"Continuous",step:"One card at a time"}),r("direction","Direction",{forward:"Forward",reverse:"Reverse"})]),{...c("cardsPerMinute","Cards per minute",1,60,"",.5),when:["autoplay",!0],condition:p=>p.playbackMode==="continuous"},{...c("duration","Time per card",1,15,"s",.5),when:["autoplay",!0],condition:p=>p.playbackMode==="step"}),g("Spiral",f("spiralRiseUnit"),{...f("spiralRise"),label:"Rise"},r("textPlacement","Text placement",{below:"Below the spiral",card:"On each card"}),f("showSlots")),g("Image",r("aspectRatio","Image crop",Object.fromEntries(["original","1:1","3:2","2:3","4:3","3:4","16:9","2.4:1","circle","4:5","9:16"].map(p=>[p,p==="original"?"Original":p==="circle"?"Circle":p]))),r("fit","Image sizing",{cover:"Fill",contain:"Fit"}),c("imageWidth","Image width",20,100,"%"),r("imageAlign","Alignment",{left:"Left",center:"Center",right:"Right"}),c("imagePadding","Image padding",0,20,"%"),s("imageBorder","Image border"),...n("imageBorder",!0,[i("imageBorderColor","Color"),c("imageBorderSize","Thickness",0,12),c("imageRadius","Corner radius",0,64)]),D("shadowEnabled","Image shadow","shadow","shadowColor"),s("overlayEnabled","Overlay"),...n("overlayEnabled",!0,[i("imageTint","Color")])),x("Title","titleCustom","titleSize","titleWeight","titleColor","titleAlign"),...E?[x("Description","bodyCustom","descriptionSize","descriptionWeight","descriptionColor","descriptionAlign")]:[],g("Card",f("cardWidth"),r("cardSizing","Height",{content:"Fit to content",equal:"Equal height"}),r("cardOrder","Element order",{media:"Media first",content:"Content first"}),c("cardPadding","Card padding",0,80),c("mediaGap","Space between image and text",0,80),c("titleGap","Space below title",0,80),...E?[c("buttonGap","Space above button",0,80)]:[],r("cardAlign","Vertical alignment",{middle:"Middle",top:"Top",bottom:"Bottom"}),s("cardBackground","Background"),...n("cardBackground",!0,[i("cardColor","Color")]),s("cardBorderEnabled","Card border"),...n("cardBorderEnabled",!0,[i(m?"spiralRim":"borderColor","Color"),f("borderWidth")]),f(m?"spiralRadius":"radius"),D("cardShadow","Card shadow","cardShadow","cardShadowColor"),f("backFace"),f("backColor"),...n("backFace","mirror",[s("mirrorOverlay","Mirrored image overlay")]),{...i("mirrorColor","Color"),when:["mirrorOverlay",!0],condition:p=>p.backFace==="mirror"}),g("Interaction",s("pauseOnHover","Pause on hover"),f("hoverEffect"),f("hoverAmount"),c("hoverDuration","Hover duration",0,1e3,"ms",10),r("clickAction","Card click",{source:e==="summary"?"Post button only":E?"Button only":"Image link only",link:e==="summary"?"Follow post link":E?"Follow button link":"Follow image link",preview:e==="summary"?"Open blog post":"Open preview",none:"Do nothing"}),f("reducedMotion")),g("Control styling",f("controlSize"),c("controlIconSize","Icon size",0,60),c("controlPadding","Button padding",0,32),f("controlShape"),f("arrowStyle"),s("controlBackground","Button background"),f("controlPalette"),f("controlInk"),f("controlFill")),g("Mobile",s("mobileSizing","Customize mobile sizing"),z("mobileCardWidth","cardWidth"),z("mobileGap",S),{...c("mobileCardPadding","Mobile card padding",0,80),inherits:"cardPadding"},{...c("mobileCarouselPadding","Mobile carousel padding",0,64),inherits:"carouselPadding"},...m?[z("mobileSpiralWidth","spiralWidth")]:[],...E?[r("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...c("mobileStageHeight","Mobile height",120,1600),inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]}]:[]),g("Theme",r("colorSource","Colors",{section:"Section theme",custom:"Custom"}),...n("colorSource","custom",[i("background","Background"),i("ink","Text"),i("accent","Accent")]),r("typeSource","Typography",{native:"Site typography",preset:"Layout default"})),a.find(p=>p.title==="Popup")];if(m)return P;e==="summary"&&(P.find(p=>p.title==="Popup").fields=[]);let C=P.find(p=>p.title==="Main carousel"),w=f("stageHeight");C.fields=[f("galleryWidth"),f("galleryHeight"),...w?[r("heightMode",w.label,{auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...w,when:["heightMode","pixels"]},{...c("viewportHeight","Window height",15,100,"%"),when:["heightMode","viewport"]}]:[],...C.fields.filter(p=>["carouselPadding","surfaceEnabled","surfaceColor","surfaceRadius"].includes(p?.key)),f("gap"),f("edgeMode"),f("edgeFade"),f("autoplay"),f("duration")];for(let p of["aspectRatio","cardOrder","cardAlign"])P.flatMap(G=>G?.fields||[]).find(G=>G?.key===p).choices.unshift({value:"layout",label:"Layout default"});let M=P.find(p=>p.title==="Spiral");M.title="Layout",M.fields=[f("depth"),f("navigation")];let H=new Set;if(t.preset!=="ring")for(let p of["backFace","backColor","mirrorOverlay","mirrorColor"])H.add(p);if(y)for(let p of["showControls","pauseOnHover"])H.add(p);if(v)for(let p of["cardOrder","cardSizing","mediaGap"])H.add(p);b&&H.add("cardAlign");let j=P.find(p=>p.title==="Mobile");j.fields=j.fields.filter(p=>!["mobileHeightMode","mobileViewportHeight","mobileStageHeight"].includes(p.key)),w&&j.fields.push(r("mobileHeightMode","Mobile height",{inherit:"Use main height",auto:"Auto",pixels:"Pixels",viewport:"Viewport"}),{...w,key:"mobileStageHeight",label:"Mobile height",inherits:"stageHeight",when:["mobileHeightMode","pixels"]},{...c("mobileViewportHeight","Window height",15,100,"%"),when:["mobileHeightMode","viewport"]});for(let p of P)p.fields=p.fields.filter(A=>A?.key&&!H.has(A.key));return P.filter(p=>p.fields.length&&!(y&&p.title==="Control styling"))}var jt,Di,It=Q(()=>{jt={mobileSizing:!1,carouselPadding:0,surfaceEnabled:!1,surfaceColor:"#ffffff",surfaceRadius:0,heightMode:"pixels",viewportHeight:65,mobileHeightMode:"inherit",mobileViewportHeight:65,mobileStageHeight:null,mobileCarouselPadding:null,mobileSpiralWidth:null,mobileCardPadding:null,textPlacement:"below",cardOrder:"media",cardAlign:"middle",cardSizing:"content",titleAlign:"inherit",descriptionAlign:"inherit",descriptionWeight:"inherit",titleGap:0,buttonGap:0,mediaGap:0,cardBackground:!1,cardColor:"#ffffff",imageWidth:100,imageAlign:"center",imageBorder:!1,imageBorderSize:1,imageBorderColor:"#263448",imageRadius:0,mirrorOverlay:!1,mirrorColor:"#000000",hoverDuration:250,playbackMode:"continuous",cardsPerMinute:7.5,direction:"forward",pauseOnHover:!1,controlIconSize:0,controlPadding:0,controlBackground:!0,titleCustom:!1,bodyCustom:!1,cardBorderEnabled:!1,overlayEnabled:!1,cardShadow:!1,cardShadowColor:"#000000",cardShadowAngle:90,cardShadowDistance:4,cardShadowBlur:8,cardShadowSpread:0},Di=["surfaceColor","cardColor","imageBorderColor","mirrorColor","cardShadowColor"]});function Wi({range:t,swatch:e,select:o}){let r=(i,a)=>({key:i,label:a,type:"checkbox"});return[{title:"Card content",fields:[r("showImage","Show image"),r("showTitles","Show title"),r("showDescription","Show description"),r("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),r("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),r("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(i=>({...i,when:["shadowEnabled",!0]})),o("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[r("popupImage","Show popup image"),r("popupTitle","Show popup title"),r("popupDescription","Show popup description"),r("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),r("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Oi(t,e){if(!ti.has(e.preset))return e;let o={...e},r=getComputedStyle(t),i;for(let a of qt){let s=e[a+"Swatch"],c=e[a];if(Object.hasOwn(ii,s)){let g=r.getPropertyValue("--"+s+"-hsl").trim();g&&(i??=document.createElement("canvas").getContext("2d"),i&&(i.fillStyle=c,i.fillStyle="hsl("+g+")",c=i.fillStyle))}let n=Math.round((e[a+"Opacity"]??100)*2.55);o[a]=n===255?c:c+n.toString(16).padStart(2,"0")}return o}function mt(t,e={}){if(t==="spiral")return{};let o=["wall","ring","angled"].includes(t);return{...jt,aspectRatio:"layout",imagePadding:0,cardAlign:"layout",cardOrder:"layout",showDescription:["stack","arc-tabs","timed"].includes(t),showButton:!o,pauseOnHover:!0,mobileSizing:e.mobileCardWidth!=null||e.mobileGap!=null,cardBorderEnabled:e.borderWidth>0,overlayEnabled:e.overlayOpacity>0,imageTint:e.overlayColor||"#142036",imageTintOpacity:e.overlayOpacity||0}}var ti,ii,qt,Tt,Bt=Q(()=>{It();ti=new Set(["spiral","stack","infinite","arc","arc-tabs","timed","showcase","wall","ring","angled"]),ii={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},qt=[...Di,"borderColor","titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],Tt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of qt)Tt[t+"Swatch"]="custom",Tt[t+"Opacity"]=t==="imageTint"?0:["shadowColor","cardShadowColor","mirrorColor"].includes(t)?25:100});function oi(t){let e=document.createElement("template");return e.innerHTML=t??"",e.content}function bt(t,e){if(e||=location.href,!t||!URL.canParse(t,e))return null;let o=new URL(t,e);return["http:","https:"].includes(o.protocol)?o.href:null}function Gi(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let o=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches(Ka))return o;let r=t.localName==="h1"?"h2":t.localName,i;if(r==="img"){if(i=bt(t.dataset.src||t.dataset.image||t.getAttribute("src"),e),!i)return o}else r==="a"&&(i=bt(t.getAttribute("href"),e));let a=Ya.has(r)&&(r!=="a"||i)?document.createElement(r):o;r==="a"&&i?(a.href=i,a.rel="noopener noreferrer"):r==="img"&&(a.src=i,a.alt=t.alt,a.loading="lazy");for(let s of t.childNodes)a.append(Gi(s,e));return a}function Ni(t,e){let o=document.createDocumentFragment();for(let r of t.childNodes)o.append(Gi(r,e));return o}function ai(t){return t.textContent.replace(/\s+/g," ").trim()}function tr(t,e){let o=ai(e);if(!o&&!e.querySelector("img")||o&&ai(t)===o)return;let r=document.createElement("div");r.append(e),t.append(r)}function $i(t,e){let o=Array.isArray(e)?[...new Set(e.filter(r=>typeof r=="string").map(r=>r.trim()).filter(Boolean))]:[];t.replaceChildren(...o.map(r=>{let i=document.createElement("li");return i.textContent=r,i})),t.hidden=!o.length}function ir(t,e){return(t.blocks??[]).flatMap(o=>o.gallery?.slides??[]).flatMap(o=>{let r=bt(o.imageUrl,e);return r?[{src:r,alt:o.alt?.trim()||o.title?.trim()||"",caption:o.title?.trim()||"",description:o.descriptionHtml||""}]:[]})}function Ui(t,e,o){let r=document.createElement("dialog");r.className="gc-post-dialog",r.setAttribute("aria-label","Project details"),r.dataset.desktopLayout=e.popupDesktopLayout==="drawer"?"drawer":"split",r.dataset.reducedMotion=String(!!e.reducedMotion),e.popupPadding>0&&r.style.setProperty("--post-padding",e.popupPadding+"px"),e.popupRadius!=null&&r.style.setProperty("--post-radius",e.popupRadius+"px"),e.popupCustom&&e.popupColor&&e.popupInk&&(r.style.setProperty("--post-surface",e.popupColor),r.style.setProperty("--post-ink",e.popupInk),r.style.setProperty("--post-body",e.popupInk)),r.innerHTML=`
    <div class="gc-post-toolbar"><button type="button" class="gc-post-icon gc-post-close" aria-label="Close project" autofocus>${er}</button></div>
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
            <button type="button" class="gc-post-icon" data-post-prev aria-label="Previous image">${Za}</button>
            <button type="button" class="gc-post-icon" data-post-next aria-label="Next image">${Qa}</button>
          </div>
        </div>
        <div class="gc-post-thumbs" role="group" aria-label="Select a project image" hidden></div>
      </section>
    </div>`;let i=q=>r.querySelector(q),a=i(".gc-post-close"),s=i(".gc-post-title"),c=i(".gc-post-reading"),n=i(".gc-post-categories"),g=i(".gc-post-tags"),f=i(".gc-post-pending"),m=i(".gc-post-status"),y=i(".gc-post-error-link"),b=i(".gc-post-link"),v=i(".gc-post-gallery"),S=i(".gc-post-layout"),E=i(".gc-post-image-well"),d=i(".gc-post-image"),h=i(".gc-post-image-description"),x=i(".gc-post-photo-nav"),D=i(".gc-post-image-label"),z=i(".gc-post-counter"),P=i(".gc-post-thumbs"),C=new AbortController,w=matchMedia("(max-width: 680px)"),M=[],H=0,j=null,p=bt(t,location.href);function A(){w.matches?S.prepend(v):S.append(v)}A(),w.addEventListener("change",A);function G(q){if(!M.length)return;H=(q+M.length)%M.length;let L=M[H];d.src=L.src,d.alt=L.alt,D.textContent=L.caption,D.hidden=!L.caption,z.textContent=H+1+" / "+M.length,h.replaceChildren(Ni(oi(L.description),p)),h.hidden=!ai(h);for(let[I,U]of Array.from(P.children).entries())I===H?U.setAttribute("aria-current","true"):U.removeAttribute("aria-current");let F=P.children[H];if(F&&P.clientWidth){let{left:I,right:U}=F.getBoundingClientRect(),R=P.getBoundingClientRect();I<R.left&&(P.scrollLeft+=I-R.left),U>R.right&&(P.scrollLeft+=U-R.right)}}function W(q){M=e.popupImage===!1?[]:q,v.hidden=!M.length,x.hidden=M.length<2,P.hidden=M.length<2,P.replaceChildren(...M.length>1?M.map((L,F)=>{let I=document.createElement("button"),U=document.createElement("img");return I.type="button",I.setAttribute("aria-label","Show image "+(F+1)+(L.caption?" \u2013 "+L.caption:"")),U.src=L.src,U.alt="",U.loading="lazy",I.append(U),I.addEventListener("click",()=>G(F)),I}):[]),r.toggleAttribute("data-without-gallery",!M.length),G(0)}function X(q,L){s.textContent=q||"",s.hidden=e.popupTitle===!1||!q,r.setAttribute("aria-label",q||"Project details"),b.hidden=e.popupButton===!1||!L,L&&(b.href=L)}function N(q){p=bt(q.url,p)||p;let L=q.title?.replace(/&(?:#(?:[0-9]+|x[0-9a-f]+)|[a-z][a-z0-9]+);/gi,F=>oi(F).textContent);if(X(L,p),e.popupDescription!==!1)for(let F of q.blocks??[]){if(!Ja.has(F.type))continue;let I=oi(F.html),U=I.querySelector(".sqs-html-content,.sqs-block-content")||I;tr(c,Ni(U,p))}$i(n,q.categories),$i(g,q.tags),W(ir(q,p))}return a.addEventListener("click",o),i("[data-post-prev]").addEventListener("click",()=>G(H-1)),i("[data-post-next]").addEventListener("click",()=>G(H+1)),r.addEventListener("keydown",q=>{M.length<2||q.altKey||q.metaKey||q.ctrlKey||["ArrowLeft","ArrowRight"].includes(q.key)&&(q.preventDefault(),G(H+(q.key==="ArrowLeft"?-1:1)))}),E.addEventListener("pointerdown",q=>{M.length<2||!q.isPrimary||q.pointerType==="mouse"||(j={id:q.pointerId,x:q.clientX,y:q.clientY},E.setPointerCapture(q.pointerId))}),E.addEventListener("pointercancel",()=>{j=null}),E.addEventListener("pointerup",q=>{if(j?.id!==q.pointerId)return;let L=q.clientX-j.x,F=q.clientY-j.y;j=null,Math.abs(L)>35&&Math.abs(L)>Math.abs(F)*1.2&&G(H+(L<0?1:-1))}),{dialog:r,async load(){try{let q=await zt(p,{signal:C.signal,includeSeo:!1});if(C.signal.aborted||(N(q),M.length&&await d.decode().catch(()=>{}),C.signal.aborted))return;f.hidden=!0,S.hidden=!1}catch{if(C.signal.aborted)return;f.removeAttribute("data-loading"),m.textContent="The project details couldn\u2019t load.",p&&e.popupButton!==!1&&(y.href=p,y.hidden=!1)}},destroy(){C.abort(),w.removeEventListener("change",A)}}}var Ya,Ja,Ka,Za,Qa,er,_i=Q(()=>{ei();Ya=new Set("p h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" ")),Ja=new Set(["html","text","markdown","image"]),Ka="script,style,template,noscript,iframe,form,svg,object,embed,video,audio,button",Za='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-14 0 6 6m-6-6 6-6"/></svg>',Qa='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',er='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'});function ri(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],o=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${or[t]}${o}</svg>`}function Xe(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?ri("play")+ri("pause"):ri(e),t}var or,Ft=Q(()=>{or={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function qe(t,e,o){let r=document.createElement(t);return r.className=e,o!==void 0&&(r.textContent=o),r}function gt(t,e,o){let r=qe("button",t,o);return r.type="button",r.setAttribute("aria-label",e),r}function rr(t,e,o,r,i,a){let s=o/2,c=r/2,n=.26,g=e/2+48,f=(o*Math.cos(n)+a)/(2*Math.sin(n)),m=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-i)*.7),o*(3.8-i*2.1),c+Math.max(f,g/Math.sin(Math.PI/3))),y=m-c,b=Math.atan2(s,y),v=Math.hypot(s,y),S=2*(b+Math.asin(a/(2*v))),E=b+Math.asin(g/v),d=m+c,h=Math.hypot(d,s)-d,x=y-Math.sqrt((y-g)*(y+g));return{radius:m,step:S,reach:E/S,above:h,below:x}}function nr(t,e,o){let r=e/2,i=10+o*9,a=0,s=0;for(let c=0;c<4.1;c+=.5){let n=Math.min(4.1,c+.5),g=Math.max(.48,1-c*(.09+o*.035)),f=(n*(4+o*7)+(c===0?4:0))*Math.PI/180,m=g*(r+t/2*Math.sin(f))-r;a=Math.max(a,m-Math.min(c,4)*i),s=Math.max(s,m+Math.min(n,4)*i)}return{above:a,below:s}}function Xi({host:t,items:e=[],initialIndex:o=0,options:r={},makeCard:i,onChange:a,nativeList:s,loadImage:c}){let n=ar.has(r.preset)?r.preset:"infinite",g=n==="arc"||n==="arc-tabs",f=g||n==="showcase",m=e.length,y=!!r.reducedMotion,b=We(st(r.depth,55),0,100)/100,v,S,E;function d(l){v=We(st(l.gap,24),0,180),S=We(st(l.cardWidth,n==="timed"?760:380),80,1800),E=l.phoneWidthOverride}d(r);let h=We(st(r.duration,5),1,60)*1e3,x=qe("section",`gc-carousel gc-preset-${n}`);x.setAttribute("aria-roledescription","carousel"),x.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[n]),x.style.setProperty("--gc-card-radius",`${We(st(r.radius,14),0,120)}px`),x.style.setProperty("--gc-stage-height",`${We(st(r.stageHeight,0),0,1400)}px`),y&&x.classList.add("gc-reduced-motion");let D=[],z=(l,u,k,T)=>{l.addEventListener(u,k,T),D.push(()=>l.removeEventListener(u,k,T))},P=[],C=[],w=r.navigation==="dots"||r.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),M=n==="arc-tabs"||n==="timed"&&!w,H=qe("nav","gc-carousel-tabs");w&&H.classList.add("gc-choice-dots"),H.setAttribute("aria-label","Choose a slide"),M&&(e.forEach((l,u)=>{let T=(typeof l.title=="string"?l.title.trim():"")||`Slide ${u+1}`,_=w?gt("gc-choice-dot",T):gt("gc-carousel-tab",T,T);z(_,"click",()=>Te(u)),z(_,"keydown",O=>{let B;O.key==="ArrowRight"&&(B=nt(u+1,m)),O.key==="ArrowLeft"&&(B=nt(u-1,m)),O.key==="Home"&&(B=0),O.key==="End"&&(B=m-1),B!==void 0&&(O.preventDefault(),Te(B),P[B]?.focus({preventScroll:!0}))}),H.append(_),P.push(_)}),x.append(H));let j=qe("div","gc-carousel-stage");j.tabIndex=m?0:-1,j.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let p=s?.track??qe("div","gc-carousel-track");p.classList.add("gc-carousel-track"),j.append(p),x.append(j);function A(l){let u=i(e[l],l,{caption:r.showTitles!==!1,description:n==="arc-tabs"||n==="timed"});u.classList.add("gc-carousel-card"),u.dataset.gcItemIndex=String(l),u.style.width="var(--gc-carousel-slot-width)",u.tabIndex=-1,u.setAttribute("aria-hidden","true"),s||u.querySelectorAll("img").forEach(T=>{T.draggable=!1,T.style.objectFit=r.fit==="contain"?"contain":"cover"});let k=s?.slot(u)??u;return p.append(k),{card:u,node:k,index:l,logical:l,active:!1}}let G=e.map((l,u)=>A(u)),W=new Map,X=!1,N=qe("div","gc-carousel-controls"),q=qe("div","gc-carousel-counter");q.setAttribute("aria-hidden","true");let L=qe("span","gc-carousel-current",m?"01":"00");q.append(L,qe("span","gc-carousel-divider","/"),qe("span","gc-carousel-total",String(m).padStart(2,"0")));let F=qe("div","gc-carousel-arrows"),I=Xe(gt("gc-carousel-arrow","Previous slide"),"previous"),U=Xe(gt("gc-carousel-arrow","Next slide"),"next");I.disabled=U.disabled=m<2,F.append(I,U);let R=Xe(gt("gc-carousel-playback","Play slideshow"),"playback");R.hidden=m<2||y;let J=qe("div","gc-carousel-pagination");J.setAttribute("aria-label","Slide pagination"),n==="timed"&&e.forEach((l,u)=>{let k=gt("gc-carousel-dot",l.title?.trim()||`Go to slide ${u+1}`),T=qe("span","gc-carousel-dot-fill");T.setAttribute("aria-hidden","true"),k.append(T),z(k,"click",()=>Te(u)),J.append(k),C.push({dot:k,fill:T})}),N.append(q,F),n==="timed"&&N.append(J),N.append(R),x.append(N);let V=qe("p","gc-carousel-sr");V.setAttribute("aria-atomic","true"),x.append(V);let Z=qe("span","gc-carousel-cursor","Drag");Z.setAttribute("aria-hidden","true"),(n==="arc-tabs"||n==="showcase"||n==="arc")&&j.append(Z),t.append(x);let re=!1,$=o,Y=o,ne=-1,K=0,ce=0,ue=0,se=!!r.autoplay&&!y&&m>1,pe=!1,ye=!1,we=!1,ke=!1,te=null,be=0,oe=0,Ae=0,ge=0,Se=()=>Math.max(12,ge*(.36-b*.12)+v-28),Ce=-1,Ee,ve=1,Be=0,Ne=0,De=()=>ke||r.pauseOnHover&&pe||ye||we||document.hidden||!!te,pt=l=>{let u=nt(Math.round($),m),k=nt(l-u,m);return k>m/2&&(k-=m),Math.round($)+k};function Fe(){let l=P[ne];if(!l)return;let u=l.offsetLeft,k=u+l.offsetWidth;u<H.scrollLeft?H.scrollLeft=Math.max(0,u-14):k>H.scrollLeft+H.clientWidth&&(H.scrollLeft=k-H.clientWidth+14)}function rt(){let l=m?nt(Math.round($),m):-1;if(l===ne)return;ne=l,L.textContent=m?String(l+1).padStart(2,"0"):"00",P.forEach((k,T)=>{k.classList.toggle("is-active",T===l),k.setAttribute("aria-pressed",String(T===l))}),Fe(),C.forEach(({dot:k},T)=>{k.classList.toggle("is-active",T===l),T===l?k.setAttribute("aria-current","true"):k.removeAttribute("aria-current")});let u=e[l]?.title;V.textContent=m?`${l+1} of ${m}${u?`: ${u}`:""}`:"No gallery items",l>=0&&a?.(l)}function He(){if(re||!oe)return;rt();let l=Math.abs(Y-$)>.002;x.classList.toggle("is-moving",l||!!te);let u=[...G];for(let k of G)k.logical=k.index+Math.round(($-k.index)/m)*m;if(m>1){let k=ge+v,T=n==="infinite"&&oe>660?oe*.61:oe/2,_=(T+ge/2+40)/k,O=(oe-T+ge/2+40)/k;g?_=O=Ee.reach:n==="showcase"&&(_=O=Math.min(4.1,(oe/2+ge)/Se()));let B=Math.ceil($-_),ee=Math.floor($+O);for(let[le,ie]of W)(le<B||le>ee||G[ie.index].logical===le)&&(ie.node.remove(),W.delete(le));for(let le=B;le<=ee;le++){let ie=nt(le,m);if(G[ie].logical===le)continue;let de=W.get(le);de||(de=A(ie),de.logical=le,W.set(le,de),X&&c&&de.card.querySelectorAll("img").forEach(fe=>c(fe,{nativeCard:!!s}))),u.push(de)}}u.forEach(k=>{let T=m===1?0:k.logical-$,_=Math.abs(T),O=k.logical===Math.round($),B=oe/2,ee=0,le=0,ie=1,de=1,fe=!0,xe=0,he=0;if(n==="infinite")B=(oe>660?oe*.61:oe/2)+T*(ge+v),de=1-Math.min(1,_)*.68,fe=B+ge/2>-40&&B-ge/2<oe+40;else if(n==="timed")B+=T*(ge+v),ie=1-Math.min(_,1)*.035,fe=B+ge/2>-40&&B-ge/2<oe+40;else if(n==="showcase")B+=T*Se(),ee+=Math.min(_,4)*(10+b*9),ie=Math.max(.48,1-_*(.09+b*.035)),le=T*(4+b*7),he=-T*(3+b*4),de=We(1-_*.19,0,1),fe=_<4.1,O&&!y&&(xe=Ne,he+=Be,le+=We(Y-$,-1,1)*-3);else{let me=T*Ee.step;B+=Ee.radius*Math.sin(me),ee=Ee.radius*(1-Math.cos(me)),le=me*180/Math.PI,fe=_<=Ee.reach,de=n==="arc-tabs"?1-Math.min(_,1)*.16:1}if(k.card.style.transform=`translate3d(${B}px,${ee}px,0) translateX(-50%) rotate(${le}deg) rotateX(${xe}deg) rotateY(${he}deg) scale(${ie})`,k.card.style.zIndex=String(1e3-Math.round(_*100)),k.card.style.opacity=String(de),k.card.style.visibility=fe?"visible":"hidden",k.card.style.pointerEvents=fe&&de>.08?"auto":"none",k.active!==O&&(k.active=O,k.card.classList.toggle("is-active",O)),k.card.tabIndex=O?0:-1,k.card.setAttribute("aria-hidden",String(!O)),s)s.syncFocus(k.card);else{let me=k.card.querySelector(".gc-card-button");me&&(me.tabIndex=O?0:-1)}}),C.forEach(({fill:k},T)=>{k.style.transform=`scaleX(${T===ne?We(ue/h,0,1):0})`})}function Oe(){let l=oe;oe=j.clientWidth;let u=E?1:n==="timed"?.86:n==="infinite"&&oe>660?.48:.76,k=Math.max(80,Math.min(S,oe*u));if(k!==ge&&(ge=k,p.style.setProperty("--gc-carousel-slot-width",`${ge}px`)),f){let T=p.offsetHeight;if(oe!==l||T!==Ce){Ce=T,g&&(Ee=rr(n,oe,ge,Ce,b,v));let _=Ee??nr(ge,Ce,b);m>1&&(j.style.setProperty("--gc-sweep-above",Math.ceil(_.above)+"px"),j.style.setProperty("--gc-sweep-below",Math.ceil(_.below)+"px"))}}Ae=j.clientHeight,ve=g?Ee.radius*Ee.step:n==="showcase"?ge*.54:ge+v,He()}function Ie(){!re&&!K&&(K=requestAnimationFrame(Ye))}function Ye(l){if(K=0,re)return;let u=ce?We(l-ce,0,64):0;ce=l,te||(y?$=Y:$+=(Y-$)*(1-Math.exp(-u/85)),Math.abs(Y-$)<5e-4&&($=Y));let k=Math.abs(Y-$)<.002&&!te;se&&!De()&&k&&(ue+=u,ue>=h&&(ue=0,Y=Math.round($)+1)),He(),Math.abs(Y-$)>5e-4||se&&!De()?Ie():ce=0}function Te(l){re||m<2||(Y=pt(nt(Math.round(st(l,0)),m)),ue=0,y&&($=Y),He(),Ie())}function et(l){m<2||(Y=Math.round(Y)+l,ue=0,y&&($=Y),He(),Ie())}function Ue(l){se=!!l&&!y&&m>1,R.dataset.paused=String(!se),R.setAttribute("aria-label",se?"Pause slideshow":"Play slideshow"),R.setAttribute("aria-pressed",String(se)),V.setAttribute("aria-live",se?"off":"polite"),x.classList.toggle("is-playing",se),ce=0,Ie()}function Me(l){ke=!!l,ce=0,Ie()}z(I,"click",()=>et(-1)),z(U,"click",()=>et(1)),z(R,"click",()=>Ue(!se)),z(j,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),j.focus({preventScroll:!0}),et(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),j.focus({preventScroll:!0}),Te(l.key==="Home"?0:m-1))}),z(j,"pointerdown",l=>{m<2||l.button!==0||!l.isPrimary||(te={id:l.pointerId,x:l.clientX,y:l.clientY,start:$,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},Y=$,ue=0)}),z(j,"pointermove",l=>{let u=j.getBoundingClientRect(),k=u.width/Math.max(1,j.clientWidth)||1,T=(l.clientX-u.left)/k,_=(l.clientY-u.top)/k;if(Z.style.left=`${T}px`,Z.style.top=`${_}px`,l.pointerType==="mouse"&&j.classList.add("has-pointer"),!te){n==="showcase"&&!y&&(Be=We((T-oe/2)/ge,-1,1)*4,Ne=We((_-Ae/2)/Ae,-.5,.5)*-5,He());return}if(l.pointerId!==te.id)return;let O=l.clientX-te.x,B=l.clientY-te.y;if(!te.axis&&Math.hypot(O,B)>6&&(te.axis=Math.abs(O)>Math.abs(B)?"horizontal":"vertical",te.axis==="horizontal"&&(j.setPointerCapture(l.pointerId),j.classList.add("is-dragging"))),te.axis!=="horizontal")return;l.preventDefault(),te.moved=!0;let ee=performance.now(),le=Math.max(8,ee-te.lastTime),ie=-(l.clientX-te.lastX)/k/ve/le;te.velocity=te.velocity*.45+ie*.55,te.lastX=l.clientX,te.lastTime=ee,$=te.start-O/k/ve,Y=$,He()},{passive:!1});function _e(l){if(!te||l.pointerId!==te.id)return;let u=te;if(te=null,j.hasPointerCapture(l.pointerId)&&j.releasePointerCapture(l.pointerId),j.classList.remove("is-dragging"),u.moved){be=performance.now()+400;let k=performance.now()-u.lastTime,T=y||l.type==="pointercancel"||k>120?0:We(u.velocity*210,-4,4);Y=Math.round($+T)}else Y=Math.round($);y&&($=Y),Ie()}z(j,"pointerup",_e),z(j,"pointercancel",_e),z(window,"pointerup",_e),z(j,"lostpointercapture",l=>{te?.id===l.pointerId&&_e(l)}),z(j,"dragstart",l=>l.preventDefault()),z(j,"click",l=>{if(performance.now()<be){l.preventDefault(),l.stopImmediatePropagation();return}let u=l.target.closest(".gc-carousel-card");!u||!j.contains(u)||u.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Te(Number(u.dataset.gcItemIndex)))},!0),z(j,"pointerleave",()=>{j.classList.remove("has-pointer"),Be=Ne=0,te||He()}),z(x,"pointerenter",l=>{l.pointerType==="mouse"&&(pe=!0)}),z(x,"pointerleave",()=>{pe=!1,ce=0,Ie()}),z(x,"focusin",()=>{ye=!0}),z(x,"focusout",()=>{queueMicrotask(()=>{re||(ye=x.contains(document.activeElement),ce=0,Ie())})}),z(document,"visibilitychange",()=>{ce=0,Ie()});let Re;typeof ResizeObserver<"u"?(Re=new ResizeObserver(l=>{l.some(({target:u})=>u===j||u===p)&&Oe(),M&&l.some(({target:u})=>u!==j&&u!==p)&&Fe()}),Re.observe(j),f&&Re.observe(p),M&&(Re.observe(H),P.forEach(l=>Re.observe(l,{box:"border-box"})))):z(window,"resize",()=>{Oe(),Fe()});let $e;return typeof IntersectionObserver<"u"&&($e=new IntersectionObserver(l=>{we=!l[0]?.isIntersecting,ce=0,Ie()}),$e.observe(x)),Oe(),X=!0,Ue(se),{goTo:Te,setGeometry(l){d(l),Ce=-1,Oe()},setPlaying:Ue,setSuspended:Me,destroy(){re=!0,cancelAnimationFrame(K),Re?.disconnect(),$e?.disconnect(),D.forEach(l=>l()),x.remove()}}}var ar,We,nt,st,Vi=Q(()=>{Ft();ar=new Set(["infinite","arc","arc-tabs","showcase","timed"]),We=(t,e,o)=>Math.min(o,Math.max(e,t)),nt=(t,e)=>(t%e+e)%e,st=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Yi(t){let{host:e,makeCard:o,nativeList:r}=t,i=Array.isArray(t.items)?t.items:[],a=t.options||{},s=["wall","ring","angled"].includes(a.preset)?a.preset:"wall",c=!!a.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=i.length,g=s==="ring"?16:s==="wall"?12:n,f=!c&&n>1&&n<12&&s!=="angled"?Math.ceil(g/n)*n:n,m=Array.from({length:n},(l,u)=>u),y=Je(it(a.depth,55),0,100),b=Je(it(a.cardWidth,280),80,900),v=Je(it(a.gap,24),0,160),S=Math.max(1,it(a.duration,5)),E=new AbortController,d=(l,u,k,T={})=>l.addEventListener(u,k,{...T,signal:E.signal}),h={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},x=`gc-spatial-help-${++sr}`,D=["gc-spatial",`gc-${s}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...D);let z=new Map,P=(l,u)=>{z.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,u)};P("--gc-spatial-height",`${Je(it(a.stageHeight,620),300,1400)}px`),P("--gc-spatial-radius",`${Je(it(a.radius,18),0,100)}px`),P("--gc-spatial-fit",a.fit==="contain"?"contain":"cover"),P("--gc-spatial-card-width",`${b}px`),P("--gc-spatial-gap",`${v}px`);let C=r?.track??document.createElement("div");C.classList.add("gc-spatial-canvas"),r&&C.classList.add("gc-spatial-native-track"),C.setAttribute("role",r?"list":"group"),C.setAttribute("aria-label",h[s]),C.setAttribute("aria-describedby",x);let w=document.createElement("p");w.id=x,w.className="gc-spatial-sr",w.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let M=document.createElement("span");M.className="gc-spatial-sr",M.setAttribute("aria-live","polite"),M.setAttribute("aria-atomic","true"),e.append(w,C,M);let H=a.showTitles!==!1&&(s!=="ring"||c||n===1),j=Array.from({length:f},(l,u)=>{let k=u%n,T=i[k],_=o(T,k,{caption:H,description:!1,thumbnail:!0}),O=r?.slot(_)??document.createElement("div");return O.classList.add("gc-spatial-position"),_.classList.add("gc-spatial-card"),_.dataset.spatialIndex=String(u),_.dataset.spatialSourceIndex=String(k),_.tabIndex=u===0?0:-1,u>=n&&_.setAttribute("aria-hidden","true"),!_.getAttribute("aria-label")&&!_.textContent.trim()&&_.setAttribute("aria-label",`View item ${k+1}`),O.contains(_)||O.append(_),O.parentNode!==C&&C.append(O),{position:O,card:_,sourceIndex:k,x:0,y:0,flip:0,tilt:0,lift:0}}),p=document.createElement("div");p.className="gc-spatial-nav";let A=(l,u)=>{let k=document.createElement("button");return k.type="button",k.className="gc-spatial-control",k.setAttribute("aria-label",u),Xe(k,l)},G=A("previous","Previous item"),W=A("next","Next item"),X=document.createElement("span");X.className="gc-spatial-count",X.setAttribute("aria-hidden","true"),p.append(G,X,W);let N=a.autoplay&&!c?A("playback","Pause gallery motion"):null;N&&(N.disabled=n<2,N.dataset.paused=String(n<2),N.disabled&&N.setAttribute("aria-label","Play gallery motion"),p.append(N)),e.append(p),G.disabled=W.disabled=n<2;let q,L;if(s==="ring"&&n>1&&!c){q=document.createElement("div"),q.className="gc-ring-center",q.setAttribute("aria-hidden","true"),a.showTitles!==!1&&(L=document.createElement("span"),L.className="gc-ring-label",q.append(L));let l=document.createElement("span");l.textContent="Drag to explore",q.append(l),C.after(q)}let F;n||(F=document.createElement(r?"li":"p"),F.className="gc-spatial-empty",F.textContent="No items available.",C.append(F));let I=!1,U=0,R=-1,J=1,V=1,Z=1,re=1,$=1,Y=1,ne=0,K=1,ce=1,ue=0,se=0,pe=1,ye=!!a.autoplay&&!c&&n>1,we=!1,ke=!1,te=!1,be=!0,oe=null,Ae=0,ge=0,Se=0,Ce=-1,Ee=!1,ve={x:-1e4,y:-1e4,inside:!1};function Be(l=U){if(!L)return;let u=typeof i[l]?.title=="string"?i[l].title.trim():"";L.textContent===u&&L.hidden===!u||(L.textContent=u,L.hidden=!u,Ne())}function Ne(){!q||I||(q.classList.remove("is-below"),q.offsetHeight>ne&&q.classList.add("is-below"))}function De(l,u=!1,k=null){if(!n){X.textContent="00 / 00";return}let T=ct(l,n),_=k!==null&&j[k]?.sourceIndex===T,O=_&&m[T]!==k;if(_){let B=j[m[T]].card;m[T]=k,O&&(j[k].card.removeAttribute("aria-hidden"),r?.syncFocus(j[k].card),document.activeElement===B&&(Ee=!0,j[k].card.focus({preventScroll:!0}),Ee=!1))}if(R===T&&!O){u&&(M.textContent=`Item ${T+1} of ${n}${i[T].title?`: ${i[T].title}`:""}`);return}U=T,Be(),X.textContent=`${String(U+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`,j.forEach(({card:B,sourceIndex:ee},le)=>{let ie=m[ee]===le;if(B.tabIndex=ie&&ee===U?0:-1,B.classList.toggle("is-selected",ie&&ee===U),ie?B.removeAttribute("aria-hidden"):B.setAttribute("aria-hidden","true"),r)r.syncFocus(B);else{let de=B.querySelector(".gc-card-button");de&&(de.tabIndex=B.tabIndex)}}),u&&(M.textContent=`Item ${U+1} of ${n}${i[U].title?`: ${i[U].title}`:""}`),R!==U&&(R=U,t.onChange?.(U))}function pt(l){ye=!!l&&!c&&n>1,N&&(N.dataset.paused=String(!ye),N.setAttribute("aria-label",ye?"Pause gallery motion":"Play gallery motion")),Me()}function Fe(l){we=!!l,we||Me()}function rt(l,u,k){return u+Math.round((l-u)/k)*k}function He(l){let u={index:m[l],target:l,distance:1/0};return j.forEach((k,T)=>{if(k.sourceIndex!==l)return;let _=T;if(s==="ring")_=rt(ue,T,f);else if(s==="wall"){let B=Math.floor(T/K);_=ce>2?rt(ue,B,ce):B}let O=Math.abs(_-ue);O<u.distance&&(u={index:T,target:_,distance:O})}),u}function Oe(l){let u=l.getBoundingClientRect();return u.left+u.width/2}function Ie(){if(n<2)return;let l=Oe(j[0].position),u=Oe(j[1].position)-l;if(Math.abs(u)<1)return;let k=Je(Math.round((Oe(C)-l)/u),0,n-1);De(k,!1,k)}function Ye(l,u=!1){if(!n)return;let k=ct(Math.round(it(l,0)),n),T=c?{index:k,target:k}:He(k);if(De(k,!0,T.index),c){let _=j[k].position;C.scrollTo({left:C.scrollLeft+Oe(_)-Oe(C),behavior:"auto"})}else se=T.target;u&&j[T.index].card.focus({preventScroll:!0}),Me()}function Te(){if(!I){if(J=Math.max(1,C.clientWidth),V=Math.max(1,C.clientHeight),s==="ring"){let l=Math.max(80,Math.min(J-32,V-42)),u=Je(it(a.ringDiameter,l),80,l);Y=Math.max(0,u*.38);let k=ni*Y/Math.max(1,f),T=Math.min(u*.17,k*.8),_=1.15-Je(v,0,100)/160;if(Z=n<=1?Math.min(b,J*.65,V*.58):Math.max(18,Math.min(Math.min(b*.22,T)*_,k*.94)),re=Z*1.28,q){let O=Math.max(0,Y-Math.max(32,re)/2-10);ne=Math.floor(O*Math.SQRT2),q.style.setProperty("--gc-ring-label-width",`${ne}px`),q.style.setProperty("--gc-ring-label-y",`${C.offsetTop+V/2}px`),Ne()}$=Math.max(24,ni*Math.max(1,Y)/Math.max(1,f))}else s==="wall"?(K=f>=10?3:f>=4?2:1,ce=Math.max(1,Math.ceil(f/K)),re=Math.min((V-56-(K-1)*v)/K,b*.62,230),Z=Math.max(60,Math.min(re*1.5,b,J*.43)),re=Z/1.5,$=Z+Math.min(v,70)):(Z=Math.min(b,J*.68,(V-70)*.76),re=Z/.76,$=Z*(.72+(100-y)*.001)+v);j.forEach(({position:l})=>{l.style.width=`${Math.max(24,Z)}px`,l.style.height=`${Math.max(32,re)}px`}),c&&j.forEach(({position:l})=>{l.style.width=`${Math.min(b,J*.72)}px`,l.style.height=`${Math.min(V-40,b*1.15)}px`}),Me()}}function et(l){if(c||!n||we)return!1;let u=ye&&!(a.pauseOnHover&&ke)&&!te&&!oe&&be&&!document.hidden;if(u){let O=l/S;s==="angled"?(se+=O*pe,se>=n-1&&(se=n-1,pe=-1),se<=0&&(se=0,pe=1)):se+=O}let k=oe?.moved?1:1-Math.exp(-l*11);ue+=(se-ue)*k,Math.abs(se-ue)<1e-4&&(ue=se);let T=Math.abs(se-ue)>1e-4||u;if(u||oe?.moved){let O=oe?.moved?ue:se,B=s==="wall"?Math.round(O)*K+m[U]%K:Math.round(O),ee=s==="wall"?Math.min(ct(B,ce*K),f-1):ct(B,f);De(j[ee].sourceIndex,!1,ee)}let _=1-Math.exp(-l*13);return j.forEach((O,B)=>{let{position:ee,card:le}=O;if(s==="ring"){let ie=-Math.PI/2+(B-ue)*ni/f;O.x=n===1?0:Math.cos(ie)*Y,O.y=n===1?0:Math.sin(ie)*Y;let de=Math.hypot(ve.x-(J/2+O.x),ve.y-(V/2+O.y)),fe=Math.max(65,Z*2.6),xe=ve.inside&&!oe?.moved?Math.max(0,1-de/fe):0,he=xe*xe*(50+y*1.3);O.flip+=(he-O.flip)*_,Math.abs(O.flip-he)>.05&&(T=!0),le.toggleAttribute("data-gc-back-facing",O.flip>90);let me=n===1?0:ie*180/Math.PI+90;ee.style.transform=`translate3d(${O.x}px,${O.y}px,0) rotate(${me}deg)`,le.style.transform=`perspective(700px) rotateY(${O.flip}deg) translateZ(${xe*12}px)`,ee.style.zIndex=String(B===Ce?f+2:1)}else if(s==="wall"){let ie=B%K,fe=Math.floor(B/K)-ue;if(ce>2){let Et=ce%2===0?.5:0;fe=ct(fe-Et+ce/2,ce)-ce/2}let xe=Math.min(.68,2.6/Math.max(3,ce)),he=fe*xe,me=Math.max($/xe,J*.4),ht=y/100,Ct=Math.sin(he)*me,Mt=(1-Math.cos(he))*me*ht*.65,At=(ie-(K-1)/2)*(re+Math.min(v,50)),tt=B===Ce||te&&B===m[U]?1:0;O.lift+=(tt-O.lift)*_,Math.abs(tt-O.lift)>.002&&(T=!0),ee.style.transform=`translate3d(${Ct}px,${At}px,${Mt+O.lift*20}px) rotateY(${-he*180/Math.PI*ht}deg)`,ee.style.zIndex=String(Math.round(Mt)+(tt?1e3:1)),le.style.transform=`scale(${1+O.lift*.035})`,ee.style.opacity=Math.abs(he)>1.6?"0":"1",ee.style.visibility=Math.abs(he)>1.6?"hidden":"visible"}else{let ie=B-ue,de=B===Ce||te&&B===m[U]?1:0;O.lift+=(de-O.lift)*_,Math.abs(de-O.lift)>.002&&(T=!0);let fe=-(25+y*.28)*(1-O.lift);ee.style.transform=`translate3d(${ie*$}px,${-O.lift*14}px,${O.lift*110}px) rotateY(${fe}deg)`,ee.style.zIndex=String(de?n+2:n-B),le.style.transform="none"}}),T}function Ue(l){if(ge=0,I)return;let u=Math.min(.05,Math.max(.001,(l-(Se||l-16.7))/1e3));Se=l,et(u)&&be&&!document.hidden?ge=requestAnimationFrame(Ue):Se=0}function Me(){!I&&!ge&&!c&&(ge=requestAnimationFrame(Ue))}c&&d(C,"scroll",Ie,{passive:!0}),d(G,"click",()=>Ye(U-1)),d(W,"click",()=>Ye(U+1)),N&&d(N,"click",()=>pt(!ye)),d(C,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let u=l.key==="Home"?0:l.key==="End"?n-1:U+(l.key==="ArrowRight"?1:-1);Ye(u,!0)}),d(C,"focusin",l=>{te=!0;let u=l.target.closest?.("[data-spatial-index]");u&&!Ee&&De(Number(u.dataset.spatialSourceIndex),!1,Number(u.dataset.spatialIndex)),Me()}),d(C,"focusout",()=>{queueMicrotask(()=>{I||(te=C.contains(document.activeElement),Me())})}),d(C,"pointerenter",l=>{l.pointerType!=="touch"&&(ke=!0,ve.inside=!0,Me())}),d(C,"pointerleave",()=>{ke=!1,ve.inside=!1,Ce=-1,Be(),Me()}),d(C,"pointermove",l=>{if(l.pointerType==="touch")return;let u=C.getBoundingClientRect();ve.x=l.clientX-u.left,ve.y=l.clientY-u.top,ve.inside=!0;let k=l.target.closest?.("[data-spatial-index]");Ce=k?Number(k.dataset.spatialIndex):-1,Be(Ce>=0?j[Ce].sourceIndex:U),Me()}),d(C,"pointerdown",l=>{let u=l.target.closest?.("[data-spatial-index]");u&&De(Number(u.dataset.spatialSourceIndex),!1,Number(u.dataset.spatialIndex)),!(c||n<2||l.pointerType==="mouse"&&l.button!==0)&&(oe={id:l.pointerId,x:l.clientX,y:l.clientY,start:se,moved:!1})}),d(window,"pointermove",l=>{if(!oe||l.pointerId!==oe.id)return;let u=l.clientX-oe.x,k=l.clientY-oe.y;if(!oe.moved){if(Math.abs(k)>12&&Math.abs(k)>Math.abs(u)*1.2){oe=null;return}if(Math.abs(u)<7)return;oe.moved=!0,C.classList.add("is-dragging"),C.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),se=oe.start-u/$,(s==="angled"||s==="wall"&&ce<=2)&&(se=Je(se,0,s==="wall"?ce-1:n-1)),Me()},{passive:!1});let _e=l=>{if(!oe||l.pointerId!==oe.id)return;let u=oe.moved;if(oe=null,C.classList.remove("is-dragging"),C.hasPointerCapture?.(l.pointerId)&&C.releasePointerCapture(l.pointerId),u){Ae=performance.now()+350,se=Math.round(se);let k=s==="wall"?Math.round(se)*K+m[U]%K:Math.round(se),T=s==="wall"?Math.min(ct(k,ce*K),f-1):ct(k,f);De(j[T].sourceIndex,!0,T)}Me()};d(window,"pointerup",_e),d(window,"pointercancel",_e),d(C,"click",l=>{performance.now()<Ae&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),d(C,"dragstart",l=>l.preventDefault()),d(document,"visibilitychange",Me);let Re=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(u=>u.target===C)?Te():Ne()}):null;Re?.observe(C),q&&Re?.observe(q),Re||d(window,"resize",Te);let $e=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{be=l[0]?.isIntersecting??!0,be&&Me()},{rootMargin:"100px"}):null;return $e?.observe(e),Te(),De(0),{goTo:Ye,setPlaying:pt,setSuspended:Fe,destroy(){I||(I=!0,cancelAnimationFrame(ge),Re?.disconnect(),$e?.disconnect(),E.abort(),w.remove(),M.remove(),p.remove(),q?.remove(),r?F?.remove():C.remove(),e.classList.remove(...D),z.forEach((l,u)=>l?e.style.setProperty(u,l):e.style.removeProperty(u)))}}}var sr,Je,ct,it,ni,Ji=Q(()=>{Ft();sr=0,Je=(t,e,o)=>Math.max(e,Math.min(o,t)),ct=(t,e)=>(t%e+e)%e,it=(t,e)=>Number.isFinite(Number(t))?Number(t):e,ni=Math.PI*2});function Ki({host:t,items:e,options:o,makeCard:r,onChange:i,nativeList:a}){let s=Number(o.stageHeight)||680,c=Math.max(300,s-120),n=Math.max(0,Number(o.gap)||0),g=Number.isFinite(Number(o.depth))?Number(o.depth):45,f=o.previewScroll===!1,m=f?window:t;t.classList.add("gc-stack"),t.style.height=f?"auto":s+"px",t.style.overflowY=f?"visible":"auto",t.style.overscrollBehavior=f?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let y=a?.track??document.createElement("div");y.classList.add("gc-stack-track"),t.append(y);let b=e.map((D,z)=>{let P=r(D,z,{caption:o.showTitles,description:!0}),C=a?.slot(P)??document.createElement("div");C.classList.add("gc-stack-slot"),P.parentElement!==C&&C.append(P),y.append(C),C.style.zIndex=z+1,P.style.width=`min(${o.stackCardWidth}px,calc(100% - 48px))`,P.style.minHeight=c+"px";let w=P.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),M=!Array.from(w).some(H=>!H.closest("[hidden]")&&H.textContent.trim());return P.classList.toggle("gc-stack-image-only",M),{card:P,wrap:C,imageOnly:M,start:0,duration:1/0}}),v=0;function S(){return f?-y.getBoundingClientRect().top:t.scrollTop}function E(){v=0;let D=S(),z=0;b.forEach(({card:P,start:C,duration:w},M)=>{let H=Math.max(0,Math.min(1,(D-C)/w));P.style.transform=o.reducedMotion?"none":`perspective(1300px) translateY(${H*-32}px) scale(${1-H*.14}) rotateX(${H*g*.25}deg)`,P.style.filter=`brightness(${1-H*.23})`,H>=.5&&(z=Math.min(M+1,b.length-1))}),b.length&&i?.(z)}function d(){v||(v=requestAnimationFrame(E))}function h(){if(o.cardSizing==="equal"&&b.length){for(let{card:w}of b)w.style.minHeight=c+"px";let C=Math.max(...b.map(({card:w})=>w.offsetHeight));for(let{card:w}of b)w.style.minHeight=C+"px"}let D=b.map(({card:C,wrap:w})=>({height:C.offsetHeight,rowHeight:w.offsetHeight})),z=f?window.innerHeight:t.clientHeight,P=y.clientTop+(parseFloat(getComputedStyle(y).paddingTop)||0);b.forEach((C,w)=>{let{height:M,rowHeight:H}=D[w],j=Math.min(40,z-24-M);C.wrap.style.top=j+"px",C.start=P-j,w&&(b[w-1].duration=Math.max(1,C.start-b[w-1].start));let p=C.imageOnly&&M<=z-64?M*.24:0,A=w<b.length-1?n-p:0;C.wrap.style.marginBottom=A+"px",P+=H+A,w===b.length-1&&(C.duration=1/0,y.style.paddingBottom=Math.max(40,z-j-H)+"px")}),d()}let x;return h(),typeof ResizeObserver<"u"&&(x=new ResizeObserver(h),x.observe(y,{box:"border-box"}),b.forEach(({card:D})=>x.observe(D,{box:"border-box"}))),window.addEventListener("resize",h),m.addEventListener("scroll",d,{passive:!0}),{goTo(D){let z=b[Math.max(0,Math.min(b.length-1,Math.round(D)))];if(!z)return;let P=f?window.scrollY+z.start-S():z.start;m.scrollTo({top:P,behavior:o.reducedMotion?"instant":"smooth"})},destroy(){x?.disconnect(),window.removeEventListener("resize",h),cancelAnimationFrame(v),m.removeEventListener("scroll",d),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",y.remove()}}}var Zi=Q(()=>{});function Rt(t,e){return!t.src||e.showImage===!1||e.textPlacement==="card"||e.cardBackground||e.cardPadding>0||e.imageBorder||e.imageWidth!==100||e.imageAlign!=="center"||["original","circle"].includes(e.aspectRatio)}function si(t,e,o,r,i,a){t.beginPath(),t.roundRect(e,o,r,i,Math.max(0,Math.min(a,r/2,i/2)))}function cr(t,e,o){let r=[];for(let i of e.split(/\n/)){let a="";for(let s of i.split(/\s+/)){let c=a?a+" "+s:s;a&&t.measureText(c).width>o?(r.push(a),a=s):a=c}r.push(a)}return r}function Qi(t,e,o){let r=Math.max(80,e.cardWidth),i=Math.min(e.cardPadding,r*.4),a=r-2*i,s=parseFloat(getComputedStyle(document.documentElement).fontSize)||16,c=document.createElement("canvas").getContext("2d"),n=t.map(({item:f,image:m})=>{let y=[],b=(z,P,C,w,M,H,j=!1,p=o.bodyFamily)=>{if(!z)return;let A=C+" "+P+"px "+p;c.font=A;let G=cr(c,z,Math.max(1,a-(j?16:0)));y.push({font:A,size:P,color:w,align:M,lines:G,height:G.length*P*1.25+(j?10:0),gap:H,isButton:j})},v=a*e.imageWidth/100,S=m?.naturalWidth/m?.naturalHeight||1,[E,d]=e.aspectRatio.split(":").map(Number),h=e.aspectRatio==="circle"?1:E&&d?E/d:S,x=m&&e.showImage?{image:m,width:v,height:v/h,gap:0}:null;return(e.textPlacement==="card"||!f.src||!e.showImage)&&(e.showTitles&&b(f.title,e.titleCustom&&e.titleSize?e.titleSize*s:o.titleSize,e.titleCustom&&e.titleWeight!=="inherit"?e.titleWeight:o.titleWeight,e.titleCustom&&e.titlePalette==="custom"?e.titleColor:o.ink,e.titleAlign,0,!1,o.family),e.showDescription&&b(f.plain,e.bodyCustom&&e.descriptionSize?e.descriptionSize*s:o.size,e.bodyCustom&&e.descriptionWeight!=="inherit"?e.descriptionWeight:o.weight,e.bodyCustom&&e.descriptionCustom?e.descriptionColor:o.ink,e.descriptionAlign,y.length?e.titleGap:0),e.showButton&&f.buttonLabel&&f.link&&b(f.buttonLabel,o.size,o.weight,o.buttonInk,"center",e.buttonGap,!0)),x&&(e.cardOrder==="content"?(x.gap=y.length?e.mediaGap:0,y.push(x)):(y.length&&(y[0].gap+=e.mediaGap),y.unshift(x))),{pieces:y,height:Math.max(1,2*i+y.reduce((z,P)=>z+P.gap+P.height,0))}}),g=Math.max(1,...n.map(f=>f.height));return n.map(({pieces:f,height:m})=>{let y=document.createElement("canvas"),b=Math.min(2,2048/Math.max(r,g));y.width=Math.max(1,Math.round(r*b)),y.height=Math.max(1,Math.round(g*b));let v=y.getContext("2d");v.scale(b,b);let S=e.cardSizing==="equal"?g:m,E=(g-S)/2;e.cardBackground&&(v.fillStyle=e.cardColor,si(v,0,E,r,S,e.spiralRadius),v.fill());let d=E+i+(e.cardAlign==="bottom"?S-m:e.cardAlign==="middle"?(S-m)/2:0),h;for(let x of f){if(d+=x.gap,x.image){let D=x.image.naturalWidth/x.image.naturalHeight,z=e.fit==="contain"||e.fit==="fit",P=z?Math.min(x.width,x.height*D):x.width,C=z?P/D:x.height,w=i+(e.imageAlign==="left"?0:e.imageAlign==="right"?a-x.width:(a-x.width)/2)+(x.width-P)/2,M=d+(x.height-C)/2,H=e.aspectRatio==="circle"?x.width/2:e.imageRadius;if(e.shadowEnabled){v.save(),v.shadowColor=e.shadowColor,v.shadowBlur=e.shadowBlur*b;let G=e.shadowAngle*Math.PI/180;v.shadowOffsetX=Math.cos(G)*e.shadowDistance*b,v.shadowOffsetY=Math.sin(G)*e.shadowDistance*b;let W=e.shadowSpread;si(v,w-W,M-W,P+2*W,C+2*W,H+W),v.fillStyle=e.shadowColor,v.fill(),v.restore()}v.save(),e.aspectRatio==="circle"&&(v.beginPath(),v.arc(w+P/2,M+C/2,x.width/2,0,Math.PI*2),v.clip()),si(v,w,M,P,C,e.aspectRatio==="circle"?0:H),v.clip();let j=z?Math.min(P/x.image.naturalWidth,C/x.image.naturalHeight):Math.max(P/x.image.naturalWidth,C/x.image.naturalHeight),p=x.image.naturalWidth*j,A=x.image.naturalHeight*j;v.drawImage(x.image,w+(P-p)/2,M+(C-A)/2,p,A),e.overlayEnabled&&(v.fillStyle=e.imageTint,v.fillRect(w,M,P,C)),e.imageBorder&&(v.strokeStyle=e.imageBorderColor,v.lineWidth=2*e.imageBorderSize,v.stroke()),v.restore()}else{let D=x.align==="inherit"?"center":x.align;if(v.font=x.font,v.textBaseline="top",v.textAlign=D,v.fillStyle=x.color,x.isButton){let P=Math.min(a,Math.max(...x.lines.map(w=>v.measureText(w).width))+16),C=(r-P)/2;v.fillStyle=o.accent,v.fillRect(C,d,P,x.height),v.fillStyle=x.color,h={left:C/r,right:(C+P)/r,top:d/g,bottom:(d+x.height)/g}}let z=D==="left"?i:D==="right"?r-i:r/2;x.lines.forEach((P,C)=>v.fillText(P,z,d+(x.isButton?5:0)+C*x.size*1.25,a))}d+=x.height}return{canvas:y,buttonBounds:h,aspect:r/g}})}var eo=Q(()=>{});var to,Dt,io=Q(()=>{to='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',Dt=class{constructor(e,o,r){this.root=e,this.cards=o,this.projects=r;let i=o[0].querySelector("img").src;this.assetDirectory=new URL(".",/^(https?:|file:)/.test(i)?i:document.baseURI),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${to}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${to}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",c=>{if(c.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(c.clientX<n.left||c.clientX>n.right||c.clientY<n.top||c.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",c=>{(c.key==="ArrowLeft"||c.key==="ArrowRight")&&(c.preventDefault(),this.showFrame(this.frame+(c.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",c=>{!c.isPrimary||c.target.closest("button")||(this.galleryPointer={id:c.pointerId,x:c.clientX,y:c.clientY},s.setPointerCapture(c.pointerId))}),s.addEventListener("pointerup",c=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==c.pointerId)return;s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId);let g=c.clientX-n.x,f=c.clientY-n.y;Math.abs(g)>35&&Math.abs(g)>Math.abs(f)*1.2&&this.showFrame(this.frame+(g<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let o=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!o,this.dialog.querySelector("[data-gallery-next]").hidden=!o,this.thumbnails.hidden=!o,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(i=>{let a=document.createElement("li");return a.textContent=i,a})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((i,a)=>{let s=document.createElement("button");s.type="button",s.className="project-thumbnail",s.setAttribute("aria-label",`Show ${i.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(i.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,s.append(c),s.addEventListener("click",()=>this.showFrame(a)),s})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let o=this.project.gallery[this.frame];this.image.src=new URL(o.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${o.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${o.label}`,[...this.thumbnails.children].forEach((r,i)=>r.setAttribute("aria-current",String(i===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Ve,yt,Ht=Q(()=>{It();Ve=Object.freeze({...jt,containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),yt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function oo(t,e,{pauseOnHover:o=!0,interactionRestMs:r=6e3}={}){let i=t.querySelector("[data-orbit-toggle]"),a=new AbortController,s=(h,x,D)=>h.addEventListener(x,D,{signal:a.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let n=0,g=0,f=!1,m=h=>!!h&&t.contains(h)&&(h.matches(":focus-visible")||!!h.closest(".orbit-card")),y=()=>!f&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,b=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(n),e.autoFrame=0,n=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},v=h=>{if(e.autoFrame=0,!y()){b();return}let x=Math.min(.05,Math.max(0,(h-e.autoTime)/1e3));e.autoTime=h;let D=t.dataset.direction==="reverse"?-1:1;if(t.dataset.playbackMode==="step"){if(g+=x,g>=Number(t.dataset.interval||5)){g=0,e.autoTime=0,c.animateTo.call(e,Math.round(e.position)+D),n=setTimeout(S,100);return}}else e.position=(e.position+D*x*Number(t.dataset.rate||7.5)/60+e.count)%e.count;e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(v)},S=()=>{if(!y()){b(),e.frame&&!f&&(n=setTimeout(S,100));return}let h=e.resumeAt-performance.now();if(h>0){b(),n=setTimeout(S,h);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(v))},E=(h=6e3)=>{b(),e.resumeAt=performance.now()+h};e.animateTo=function(...h){E(r),c.animateTo.apply(this,h),S()},e.settleImmediately=function(...h){c.settleImmediately.apply(this,h),S()},e.openProject=function(...h){E(),c.openProject.apply(this,h),S()},s(t,"pointerenter",h=>{h.pointerType!=="touch"&&(t.dataset.pauseOnHover==="true"||o)&&(e.hovered=!0,S())}),s(t,"pointerleave",h=>{h.pointerType!=="touch"&&(e.hovered=!1,S())}),s(t,"focusin",h=>{e.keyboardFocused=m(h.target),S()}),s(t,"focusout",h=>{e.keyboardFocused=m(h.relatedTarget),S()}),s(t,"pointerup",()=>{E(r),S()}),s(t,"pointercancel",()=>{E(r),S()}),s(e.viewer.dialog,"close",()=>{E(),S()}),s(document,"visibilitychange",S),s(e.reducedMotion,"change",S),s(i,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,i.dataset.paused=String(e.manuallyPaused),i.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),S()});let d=new IntersectionObserver(h=>{e.inView=h.some(x=>x.isIntersecting&&x.intersectionRatio>=.15),S()},{threshold:.15});return d.observe(e.stage),e.stopAutoplay=b,e.syncAutoplay=S,()=>{f=!0,b(),a.abort(),d.disconnect(),Object.assign(e,c)}}var ao=Q(()=>{});var Pe,ro,ci,no,so,co,lo,po,go,uo,ho,fo,mo,bo,Wt,yo,vt,vo,li=Q(async()=>{Pe=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),ro=Pe.CanvasTexture,ci=Pe.BufferGeometry,no=Pe.Float32BufferAttribute,so=Pe.LineBasicMaterial,co=Pe.LineLoop,lo=Pe.DoubleSide,po=Pe.Mesh,go=Pe.NoToneMapping,uo=Pe.PerspectiveCamera,ho=Pe.PlaneGeometry,fo=Pe.Raycaster,mo=Pe.Scene,bo=Pe.ShaderMaterial,Wt=Pe.SRGBColorSpace,yo=Pe.TextureLoader,vt=Pe.Vector2,vo=Pe.WebGLRenderer});var lr,xt,xo=Q(async()=>{lr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),xt=lr.default});var dr,di,wo=Q(async()=>{dr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),di=dr.CustomEase});function ko(t,e,o=64){let r=t/e,i=new ho(t,t*9/16,o,1),a=i.attributes.position,s=i.attributes.uv;for(let c=0;c<a.count;c++){let n=(s.getX(c)-.5)*e;a.setX(c,r*Math.sin(n)),a.setZ(c,r*(Math.cos(n)-1))}return i.computeVertexNormals(),i.computeBoundingSphere(),i}function So(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var pi=Q(async()=>{await li()});function wt(t,e){let o=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*o,panelArc:t.radiansPerSlide*o,height:t.slotHeight*o}}function Ot(t,{radius:e,pitch:o,radiansPerSlide:r}){let i=t*r;return{x:Math.sin(i)*e,y:-t*o,z:(Math.cos(i)-1)*e,angle:i,taper:1,shade:(1-Math.cos(i))/2*.58}}function Co(t,e){let o=wt(t,e);return ko(o.cardWidth,o.panelArc)}function gi(t,e=64){let o=[];for(let r=0;r<=e;r++){let i=(r/e-.5)*t.radiansPerSlide;o.push(t.radius*Math.sin(i),t.slotHeight/2,t.radius*(Math.cos(i)-1))}for(let r=e;r>=0;r--){let i=(r/e-.5)*t.radiansPerSlide;o.push(t.radius*Math.sin(i),-t.slotHeight/2,t.radius*(Math.cos(i)-1))}return o}var Nt=Q(async()=>{await pi()});function ui(t,e){let o=Co(t,e);return o.scale(1,1/t.aspect/(9/16),1),o.computeVertexNormals(),o.computeBoundingSphere(),o}function Mo(t,e,o,r,i){let a=Math.min(t,e)*Math.min(40,Math.max(0,i))/100,s=t-2*a,c=e-2*a,n=s/c,g=r==="fit"?Math.max:Math.min,f=g(1,n/o),m=g(1,o/n);return{contentWidth:s,contentHeight:c,uvScaleX:f,uvScaleY:m,imageWidth:s/f,imageHeight:c/m,padding:a}}var Ao=Q(async()=>{await Nt();await Nt()});function hi({stageWidth:t,stageHeight:e,spiralWidthPercent:o,cardWidth:r,aspect:i,rise:a,riseUnit:s}){let c=Math.max(1,t*o/200),n=Math.max(1,Math.min(r,c*Math.PI/3,e*.4*i)),g=Math.PI*2*c/n,f=s==="percent"?e*a/100:a*Math.min(1,t/640);return{radius:c,slotWidth:n,slotHeight:n/i,aspect:i,pitch:Math.max(n/i*1.25/g,f),radiansPerSlide:n/c,cardsPerTurn:Math.PI*2*c/n}}var Eo=Q(()=>{});function Lo(t,e,o){let r=e.radius*2.4,i=r/(r+2*e.radius),a=Math.ceil((o/(2*i)+e.slotHeight/2)/e.pitch)+2,s=Math.floor(t);return{first:s-a,last:s+a,count:a*2+1}}function zo(t,e,o){let r=t*e.radiansPerSlide,i=r-o.panelArc/2,a=r+o.panelArc/2,s=Math.PI*2,c=E=>Math.ceil((i-E)/s)<=Math.floor((a-E)/s),n=c(0)?1:Math.max(Math.cos(i),Math.cos(a)),g=c(Math.PI)?-1:Math.min(Math.cos(i),Math.cos(a)),f=e.radius*2.4,m=f/(f+e.radius*(1-n)),y=f/(f+e.radius*(1-g)),b=-t*e.pitch,v=b+o.height/2,S=b-o.height/2;return{minY:Math.min(S*m,S*y),maxY:Math.max(v*m,v*y)}}function jo(t,e){let o=Math.min(80,e*.08),r=a=>Math.max(0,Math.min(1,a)),i=Math.min(r((e/2-t.minY)/o),r((t.maxY+e/2)/o));return i*i*(3-2*i)}function Io(t,e,o,r){let i=o-e;return Math.abs(i)>r/2&&(i-=Math.round(i/r)*r),t+i}var Po,To=Q(async()=>{await Nt();Eo();Po=(t,e)=>(t%e+e)%e});var Bo,qo=Q(()=>{Bo=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function Fo(t,{textureSource:e=o=>o.querySelector("img").src}={}){let{root:o,stage:r}=t,i;try{i=new vo({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return o.dataset.renderer="css-fallback",()=>{delete o.dataset.renderer}}i.outputColorSpace=Wt,i.toneMapping=go,i.setClearColor(0,0);let a=i.domElement;a.style.removeProperty("display"),a.className="orbit-webgl",a.setAttribute("aria-hidden","true"),r.append(a);let s=new mo,c=new uo,n=new fo,g=new vt,f=new AbortController,m=(R,J,V)=>R.addEventListener(J,V,{signal:f.signal}),y=t.render,b=t.pointerDown,v=new Map,S=new Map;function E(){for(let R of t.cards){let J=S.get(R);if(J?.image!==R.artwork&&(J?.dispose(),S.delete(R),R.artwork)){let V=new ro(R.artwork);V.colorSpace=Wt,S.set(R,V)}}}let d=[],h,x,D=t.position,z=t.position,P="",C=!1,w=!1,M=null,H=null,j=!1,p=!1;o.dataset.renderer="loading-webgl";let A=()=>hi({stageWidth:r.clientWidth,stageHeight:r.clientHeight,spiralWidthPercent:Number(o.dataset.spiralWidth),cardWidth:Number(o.dataset.cardWidth),aspect:Number(o.dataset.cardAspect),rise:Number(o.dataset.rise),riseUnit:o.dataset.riseUnit}),G=()=>{let R=t.cards[0],J=new bo({uniforms:{screenshot:{value:v.get(e(R))},dimensions:{value:new vt},contentDimensions:{value:new vt(1,1)},imageScale:{value:new vt(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},mirrorColor:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:gr,fragmentShader:ur,transparent:!0,side:lo,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),V=new po(h,J),Z=new co(x,new so({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),re={card:R,mesh:V,guide:Z,material:J,surface:{scale:0,target:0}};V.userData.panel=re,d.push(re),s.add(V,Z)},W=R=>{let J=Lo(D,R,r.clientHeight);for(;d.length<J.count;)G();for(;d.length>J.count;){let V=d.pop();s.remove(V.mesh,V.guide),V.material.dispose(),V.guide.material.dispose()}d.forEach((V,Z)=>{V.offset=J.first+Z-D,V.card=t.cards[Po(J.first+Z,t.count)],V.material.uniforms.screenshot.value=S.get(V.card)||v.get(e(V.card))})},X=()=>{let R=r.clientWidth,J=r.clientHeight,V=A(),Z=Number(o.dataset.slotGap||3);W(V);let re=wt(V,Z),{cardWidth:$,panelArc:Y}=re,{radius:ne}=V;o.dataset.slotMetrics=JSON.stringify({...V,cardArc:Y,cardWidth:$,cardHeight:re.height,gap:Z,imageFit:o.dataset.imageFit,imagePadding:Number(o.dataset.imagePadding||0)}),d.forEach(pe=>{pe.material.uniforms.dimensions.value.set($,re.height);let ye=pe.material.uniforms;ye.cornerRadius.value=Math.min(Number(o.dataset.cornerRadius)||0,$/2,re.height/2),ye.borderWidth.value=Number(o.dataset.borderWidth)||0,ye.solidBack.value=o.dataset.backFace==="solid",ye.showImage.value=!!pe.card.artwork||o.dataset.showImage!=="false";for(let te of["backColor","borderColor","imageTint","mirrorColor"]){let be=ye[te],oe=te==="imageTint"&&pe.card.artwork?"#00000000":o.dataset[te]||"#00000000";if(be.hex!==oe){be.hex=oe;let Ae=oe.length===7?oe+"ff":oe;be.value=[1,3,5,7].map(ge=>parseInt(Ae.slice(ge,ge+2),16)/255)}}let we=pe.material.uniforms.screenshot.value.image;if(!we)return;let ke=Mo($,re.height,(we.naturalWidth||we.width)/(we.naturalHeight||we.height),pe.card.artwork?"fit":o.dataset.imageFit,pe.card.artwork?0:Number(o.dataset.imagePadding||0));pe.material.uniforms.contentDimensions.value.set(ke.contentWidth,ke.contentHeight),pe.material.uniforms.imageScale.value.set(ke.uvScaleX,ke.uvScaleY)});let K=Math.min(window.devicePixelRatio||1,2),ce=`${R}:${J}:${$}:${Y}:${re.height}:${ne}:${K}`;if(ce===P||!R||!J)return;P=ce,i.setPixelRatio(K),i.setSize(R,J,!1),c.position.set(0,0,ne*2.4),c.fov=So(J,c.position.z),c.aspect=R/J,c.near=.1,c.far=ne*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let ue=h;h=ui(V,Z);let se=x;x=new ci,x.setAttribute("position",new no(gi(V),3)),d.forEach(pe=>{pe.mesh.geometry=h,pe.guide.geometry=x,pe.material.uniforms.dimensions.value.set($,re.height)}),ue?.dispose(),se?.dispose()},N=()=>{if(!C||w||j||p||!t.geometry)return;p=!0,D=Io(D,z,t.position,t.count),z=t.position,X();let R=A(),J=wt(R,Number(o.dataset.slotGap||3)),V=o.dataset.focusMode==="keyboard"&&o.contains(document.activeElement),Z=0;d.forEach($=>{let{card:Y,mesh:ne,material:K}=$,ce=Ot($.offset,R),ue=zo($.offset,R,J),se=jo(ue,r.clientHeight),pe=o.dataset.edgeMode==="preset"?se:+(se>0),ye=V&&Y===t.cards[t.active]&&Math.abs($.offset)<.5;K.polygonOffsetUnits=Math.abs($.offset)*8,ne.position.set(ce.x,ce.y,ce.z),ne.rotation.y=ce.angle;let we=$===M&&!t.pointer&&!t.reducedMotion.matches,ke=Number(o.dataset.hoverAmount)||0,te=we?1:0;$.surface.target!==te&&($.surface.target=te,xt.to($.surface,{scale:te,duration:(Number(o.dataset.hoverDuration)||0)/1e3,ease:"power2.out",overwrite:!0,onUpdate:N})),ne.scale.setScalar(o.dataset.hoverEffect==="zoom"?1+$.surface.scale*ke/100:1),o.dataset.hoverEffect==="lift"&&(ne.position.y+=$.surface.scale*ke),ne.visible=pe>.001&&!!K.uniforms.screenshot.value.image,ne.visible&&Z++,$.guide.position.copy(ne.position),$.guide.rotation.copy(ne.rotation),$.guide.visible=o.dataset.showSlots==="true"&&ne.visible,$.guide.material.opacity=pe*.42,K.uniforms.fade.value=pe,K.uniforms.shade.value=ce.shade,K.uniforms.focused.value=ye?1:0});let re=JSON.stringify({cardsPerTurn:R.cardsPerTurn,visibleCount:Z,poolCount:d.length,stageWidth:r.clientWidth,stageHeight:r.clientHeight,cardWidth:J.cardWidth,cardHeight:J.height,pitch:R.pitch,radius:R.radius,uniqueCount:t.count});o.dataset.responsiveMetrics!==re&&(o.dataset.responsiveMetrics=re),H&&!t.pointer&&(M=q(H)),s.updateMatrixWorld(!0),i.render(s,c),p=!1},q=R=>{if(!C||j)return null;let J=a.getBoundingClientRect();g.set((R.clientX-J.left)/J.width*2-1,-(R.clientY-J.top)/J.height*2+1),n.setFromCamera(g,c);for(let V of n.intersectObjects(d.map(Z=>Z.mesh))){let Z=V.object.userData.panel;if(!V.object.visible||Z.material.uniforms.fade.value<=.25)continue;let{x:re,y:$}=Z.material.uniforms.dimensions.value,Y=Z.material.uniforms.cornerRadius.value,ne=Math.abs((V.uv.x-.5)*re)-re/2+Y,K=Math.abs((V.uv.y-.5)*$)-$/2+Y;if(!(Math.hypot(Math.max(ne,0),Math.max(K,0))+Math.min(Math.max(ne,K),0)>Y))return Z.hitUv=V.uv,Z}return null};t.render=function(){y.call(this),N()},t.pointerDown=function(R){if(b.call(this,R),C&&!j&&this.pointer?.id===R.pointerId){let J=q(R);this.pointer.card=J?.card||null;let V=J?.card.buttonBounds,Z=J?.hitUv;V&&Z.x>=V.left&&Z.x<=V.right&&1-Z.y>=V.top&&1-Z.y<=V.bottom&&(this.pointer.buttonLink=J.card.dataset.buttonLink)}H=null,M=null},m(r,"pointermove",R=>{H=R.pointerType==="mouse"?{clientX:R.clientX,clientY:R.clientY}:null,M=R.pointerType==="mouse"&&!t.pointer?q(R):null,a.style.cursor=t.pointer?.dragging?"grabbing":M?"pointer":"grab",N()}),m(r,"pointerleave",()=>{H=null,M=null,N()}),m(r,"pointerup",()=>{M=null,N()}),m(o,"focusin",N),m(o,"focusout",()=>queueMicrotask(N)),m(document,"keydown",()=>queueMicrotask(N)),m(document,"pointerdown",()=>queueMicrotask(N)),m(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&d.forEach(({surface:R})=>{xt.killTweensOf(R),R.scale=R.target}),N()}),m(o,"playground-change",()=>{E(),N()}),m(o,"artwork-change",()=>{E(),N()}),m(o,"slot-guides-change",N),m(a,"webglcontextlost",R=>{R.preventDefault(),j=!0,o.classList.remove("has-webgl-carousel"),o.dataset.renderer="css-fallback"}),m(a,"webglcontextrestored",()=>{j=!1,C&&(o.classList.add("has-webgl-carousel"),o.dataset.renderer="webgl",N())});let L=new ResizeObserver(()=>N());L.observe(r);let F=new yo,I=!1,U=()=>{w||(I=!0,C=!1,o.classList.remove("has-webgl-carousel"),o.dataset.renderer="css-fallback")};for(let R of t.cards){let J=e(R);if(v.has(J))continue;let V=F.load(J,N,void 0,U);V.colorSpace=Wt,V.anisotropy=Math.min(8,i.capabilities.getMaxAnisotropy()),v.set(J,V)}return I||(h=ui(A(),Number(o.dataset.slotGap||3)),x=new ci,C=!0,o.classList.add("has-webgl-carousel"),o.dataset.renderer="webgl",N()),()=>{w=!0,f.abort(),L.disconnect(),t.render=y,t.pointerDown=b,o.classList.remove("has-webgl-carousel"),delete o.dataset.renderer,d.forEach(({material:R,surface:J,guide:V})=>{xt.killTweensOf(J),R.dispose(),V.material.dispose()}),S.forEach(R=>R.dispose()),h?.dispose(),x?.dispose(),v.forEach(R=>R.dispose()),i.dispose(),i.forceContextLoss(),a.remove()}}var zn,gr,ur,Ro=Q(async()=>{await li();await xo();await wo();await pi();await Ao();await To();xt.registerPlugin(di);zn=di.create("portfolio-surface",".2,.75,.25,1"),gr=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ur=`
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
`});var Do=Q(()=>{(()=>{"use strict";let t=Math.PI*2,e=(a,s)=>(a%s+s)%s,o=(a,s,c)=>Math.min(c,Math.max(s,a));class r{constructor(s){this.root=s,this.stage=s.querySelector(".orbit-stage"),this.cards=[...s.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,n)=>{c.dataset.slideIndex=n;let g=c.cloneNode(!0);g.dataset.repeat="true",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),g.removeAttribute("aria-pressed"),c.parentElement.append(g),this.visualCards.push(g)}),!(!this.count||!this.stage)&&(this.title=s.querySelector(".orbit-title"),this.description=s.querySelector(".orbit-description"),this.status=s.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(s,this.cards),this.pagination=s.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((s,c)=>{let n=document.createElement("button");return n.type="button",n.className="orbit-dot",n.setAttribute("aria-label",`Show ${s.dataset.title||`screenshot ${c+1}`}`),n.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(n),n}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(s=>{s.disabled=!0})}bindEvents(){let s=(c,n,g,f={})=>c.addEventListener(n,g,{...this.options,...f});s(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),s(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),s(this.stage,"keydown",c=>{let n={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in n?(c.preventDefault(),this.step(n[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),s(this.stage,"pointerdown",c=>this.pointerDown(c)),s(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),s(this.stage,"pointerup",c=>this.pointerUp(c)),s(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),s(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),s(this.stage,"dragstart",c=>c.preventDefault()),s(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),s(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let n=c.target.closest(".orbit-card");n&&this.openProject(Number(n.dataset.slideIndex))}),s(this.stage,"focusin",c=>{let n=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&n>=0&&n!==this.active&&this.goTo(n)}),s(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),s(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(s=>{let c=s.querySelector(".orbit-surface"),n=c.querySelector("img"),g=Array.from({length:this.segmentCount},(f,m)=>{let y=document.createElement("span");return y.className="orbit-strip",y.setAttribute("aria-hidden","true"),y.dataset.stripIndex=m,y.style.backgroundImage=`url("${n.src}")`,c.append(y),y});return s.classList.add("is-curved"),{card:s,strips:g}})}measure(){let s=this.stage.clientWidth,c=this.stage.clientHeight,n=s<=700;this.cards[0].style.removeProperty("width");let g=this.cards[0].offsetWidth,f=t/8,m=f*.88,y=g/m;this.geometry={radius:y,panelArc:m,cardWidth:g,pitch:o(c/13,36,52),halfWindow:6.5,radiansPerSlide:f,dragUnitX:Math.max(85,s*(n?.32:.18)),dragUnitY:o(c*.13,65,105)},this.stage.style.perspective=`${(y*2.4).toFixed(3)}px`;let b=m/this.segmentCount,v=2*y*Math.sin(b/2),S=g*9/16;this.panels.forEach(({card:E,strips:d})=>{E.style.width=`${g}px`,d.forEach((h,x)=>{let D=-m/2+(x+.5)*b,z=y*Math.sin(D),P=y*(Math.cos(D)-1);h.style.width=`${(v+.6).toFixed(4)}px`,h.style.backgroundSize=`${g}px ${S}px`,h.style.backgroundPosition=`${(-x*g/this.segmentCount).toFixed(4)}px 0px`,h.style.transform=`translateX(-50%) translate3d(${z.toFixed(4)}px, 0px, ${P.toFixed(4)}px) rotateY(${(D*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:s,pitch:c,halfWindow:n,radiansPerSlide:g}=this.geometry;this.visualCards.forEach(m=>{let y=Number(m.dataset.slideIndex),b=e(y-this.position+this.count/2,this.count)-this.count/2;m.dataset.repeat&&(b+=b<0?this.count:-this.count);let v=b*g,S=Math.cos(v),E=Math.sin(v),d=(1-S)/2,h=1-b/n*.11,x=E*s*h,D=b*c,z=S*s*h-s,P=v*180/Math.PI,C=o((n-Math.abs(b))/.65,0,1);m.style.transform=`translate(-50%, -50%) translate3d(${x.toFixed(3)}px, ${D.toFixed(3)}px, ${z.toFixed(3)}px) rotateY(${P.toFixed(3)}deg) scale(${h.toFixed(4)})`,m.style.zIndex="auto",m.style.setProperty("--orbit-shade",String(d*.58)),m.style.setProperty("--orbit-fade",String(C)),m.style.opacity="1",m.style.visibility=C>0?"visible":"hidden",m.style.pointerEvents=C>.25?"auto":"none",m.toggleAttribute("data-gc-back-facing",S<0),m.dataset.offset=b.toFixed(5)});let f=e(Math.round(this.position),this.count);f!==this.active&&this.updateActive(f)}updateActive(s){let c=this.visualCards.includes(document.activeElement);this.active=s,this.cards.forEach((n,g)=>{let f=g===s;n.classList.toggle("is-centered",f),n.tabIndex=f?0:-1,n.setAttribute("aria-pressed",String(f)),this.dots[g].setAttribute("aria-current",String(f))}),this.title&&(this.title.textContent=this.cards[s].dataset.title||""),this.description&&(this.description.textContent=this.cards[s].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[s].dataset.title}, project ${s+1} of ${this.count}`),c&&!this.pointer&&this.cards[s].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(s)}goTo(s){let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(s){this.animateTo(Math.round(this.target)+s)}animateTo(s,c=0){if(this.target=Math.round(s),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(s){this.frame=0;let c=Math.min((s-this.lastTime)/1e3,.032);this.lastTime=s;let n=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=n*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(s){if(this.viewer.dialog.open||!Number.isInteger(s)||!this.cards[s])return;let c=e(s-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(s)}pointerDown(s){if(!s.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}s.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:s.pointerId,x:s.clientX,y:s.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:s.target.closest(".orbit-card")},this.stage.setPointerCapture(s.pointerId))}pointerMove(s){let c=this.pointer;if(!c||c.id!==s.pointerId)return;let n=s.clientX-c.x,g=s.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(n),Math.abs(g))<6)return;if(s.pointerType==="touch"&&Math.abs(n)<=Math.abs(g)){c.card=null;return}c.axis=Math.abs(g)>Math.abs(n)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}s.preventDefault();let f=c.axis==="x"?s.clientX:s.clientY,m=c.axis==="x"?n:g,y=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,b=s.pointerType==="touch"?o(y*.38,32,48):y,v=performance.now(),S=Math.max(8,v-c.lastTime),E=-(f-c.lastCoordinate)/b/S*1e3;c.speed=c.speed*.35+E*.65,c.lastMovement=v,c.lastTime=v,c.lastCoordinate=f,c.travel=m,this.position=c.startPosition-m/b,this.render()}pointerUp(s,c=!1){let n=this.pointer;if(!n||n.id!==s.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(n.id)&&this.stage.releasePointerCapture(n.id),!n.dragging){if(this.animateTo(Math.round(this.position)),!c&&n.buttonLink){location.assign(n.buttonLink);return}!c&&n.card&&this.openProject(Number(n.card.dataset.slideIndex));return}let g=c||performance.now()-n.lastMovement>90?0:o(n.speed,-10,10),f=Math.round(this.position+(this.reducedMotion.matches?0:g*(s.pointerType==="touch"?.32:.2))),m=this.position-n.startPosition;!c&&Math.abs(n.travel)>18&&Math.abs(m)>.12&&f===Math.round(n.startPosition)&&(f+=Math.sign(m)),this.animateTo(f,g)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:s,strips:c})=>{c.forEach(n=>n.remove()),s.classList.remove("is-curved"),s.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(s=>s.dataset.repeat).forEach(s=>s.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function i(a=document){a.querySelectorAll("[data-spiral-carousel]").forEach(s=>{s.spiralCarousel||(s.spiralCarousel=new r(s))})}window.SpiralCarousel={init:i},i()})()});var Wo,Ho=Q(()=>{Wo=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var No,Oo=Q(()=>{No=`.project-dialog {
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
`});var Go,$o=Q(()=>{Go=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var _o={};Li(_o,{mountSpiral:()=>xr,spiralControls:()=>yt,spiralDefaults:()=>Ve});function fi(t,e,o){for(let r of Uo)t.removeAttribute(r);for(let[r,i]of Object.entries(e.imageAttrs||{}))Uo.has(r)&&i!=null&&t.setAttribute(r,String(i));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&o?.(t)}function mi(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function xr(t){let{host:e,onChange:o=()=>{},loadImage:r}=t,i=t.items.filter(L=>L.src||L.title||L.description||L.link),a={...Ve,...t.options},s=!1;if(!i.length){let L=document.createElement("p");return L.className="gc-spiral-empty",L.textContent="Add content to this source to preview the spiral.",e.append(L),{destroy(){L.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let n=document.createElement("div");n.className="orbit-carousel spiral-carousel slot-carousel",n.dataset.spiralCarousel="",n.id=`gc-spiral-${++yr}`,n.setAttribute("role","region"),n.setAttribute("aria-label","Spiral gallery"),n.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let g=n.querySelector(".orbit-stage"),f=n.querySelector(".orbit-ring"),m=n.querySelector("[data-orbit-toggle]");Xe(n.querySelector("[data-orbit-prev]"),"previous"),Xe(n.querySelector("[data-orbit-next]"),"next"),Xe(m,"playback");let y=n.querySelector(".gc-spiral-caption"),b=document.createElement("div");b.className="gc-spiral-caption-space",y.before(b),b.append(y);let v=i.some(L=>!!L.title);for(let L of new Set(i.map(F=>F.title).filter(Boolean))){let F=y.cloneNode(!1);F.setAttribute("aria-hidden","true"),F.classList.add("gc-spiral-caption-measure"),F.textContent=L,b.append(F)}let S=document.createElement("div");S.className="gc-item-details",b.after(S);let E=i.map(L=>{let F=document.createElement("div");F.className="gc-item-detail";let I=document.createElement("p");I.className="gc-item-description",I.textContent=$t(L.description);let U=document.createElement("a"),R=mi(L.link);return R&&(U.href=R),U.textContent=L.buttonLabel||"Open link",F.append(I,U),S.append(F),{group:F,body:I,link:U,href:R}}),d="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>'),h=[];i.forEach((L,F)=>{let I=document.createElement("button");I.className="orbit-card",I.type="button",I.dataset.title=L.title||"",I.dataset.imageSource=L.src||d,I.setAttribute("aria-label",L.title?`View ${L.title}`:`View image ${F+1}`);let U=document.createElement("span");U.className="orbit-surface";let R=document.createElement("img");L.src?fi(R,L):R.src=d,h.push(I),I.dataset.buttonLink=mi(L.link)||"",U.append(R),I.append(U),f.append(I)}),c.append(n),e.append(c);let x=new Map,D=0,z="";async function P(){let L=JSON.stringify(a);if(z===L)return;z=L;let F=++D,I=i.some(Y=>Rt(Y,a));if(n.dataset.composite=String(I),!I){for(let[Y,ne]of h.entries())if(ne.artwork=null,ne.buttonBounds=null,ne.hasAttribute("data-artwork")){for(let K of f.querySelectorAll('[data-slide-index="'+Y+'"] img'))K.src=i[Y].src||d;ne.removeAttribute("data-artwork")}return}let U=Y=>!Y||!a.showImage?null:(x.has(Y)||x.set(Y,new Promise(ne=>{let K=new Image;K.crossOrigin="anonymous",K.onload=()=>ne(K),K.onerror=()=>ne(null),K.src=Y})),x.get(Y));if(await new Promise(requestAnimationFrame),s||F!==D)return;let R=await Promise.all(i.map(async Y=>({item:{...Y,plain:$t(Y.description)},image:await U(Y.src)})));if(s||F!==D)return;let J=a.typeSource==="native"?e.closest(".user-items-list-section"):null,V=getComputedStyle(J?.querySelector(".list-item-content__title")||y),Z=getComputedStyle(J?.querySelector(".list-item-content__description p")||E[0].body),re=getComputedStyle(e).color,$=Qi(R,a,{family:V.fontFamily,bodyFamily:Z.fontFamily,ink:re,titleSize:parseFloat(V.fontSize)||16,titleWeight:V.fontWeight,size:parseFloat(Z.fontSize)||16,weight:Z.fontWeight,accent:getComputedStyle(m).color,buttonInk:getComputedStyle(m).backgroundColor==="rgba(0, 0, 0, 0)"?"white":getComputedStyle(m).backgroundColor});$.forEach(({canvas:Y,buttonBounds:ne},K)=>{if(h[K].artwork=Y,h[K].buttonBounds=ne,h[K].setAttribute("data-artwork",""),n.dataset.renderer!=="webgl"){let ce=Y.toDataURL();for(let ue of n.querySelectorAll('.orbit-card[data-slide-index="'+K+'"] img'))ue.src=ce}}),f.querySelectorAll("[data-repeat]").forEach(Y=>{let ne=h[Number(Y.dataset.slideIndex)];Y.buttonBounds=ne?.buttonBounds}),n.dataset.cardAspect=String($[0].aspect),n.style.setProperty("--gc-art-aspect",$[0].aspect),n.dispatchEvent(new Event("artwork-change"))}let C=Lt(c,n.id),w=()=>{let L=a.textPlacement==="card",F=i.some(I=>Rt(I,a));C({...a,shadowEnabled:a.shadowEnabled&&!F,imageTint:a.overlayEnabled&&!F?a.imageTint:"#00000000"}),a.titleCustom?e.dataset.gcTitlePalette=a.titlePalette:(e.removeAttribute("data-gc-title-size"),e.removeAttribute("data-gc-title-weight"),e.dataset.gcTitlePalette="theme"),b.style.textAlign=a.titleAlign,c.style.setProperty("--gc-card-inset",a.carouselPadding+"px"),n.style.padding=a.carouselPadding+"px",n.style.overflow=a.surfaceRadius?"hidden":"",n.style.borderRadius=a.surfaceRadius+"px",n.style.backgroundColor=a.surfaceEnabled?a.surfaceColor:"",n.style.setProperty("--gc-hover-time",a.hoverDuration+"ms"),n.dataset.hoverDuration=a.hoverDuration,n.dataset.mirrorColor=a.mirrorOverlay?a.mirrorColor:"#00000000",n.dataset.playbackMode=a.playbackMode,n.dataset.rate=a.cardsPerMinute,n.dataset.interval=a.duration,n.dataset.direction=a.direction,n.dataset.pauseOnHover=String(a.pauseOnHover),n.dataset.customControlSize=String(!!(a.controlPadding||a.controlIconSize)),n.dataset.hideControlBackground=String(!a.controlBackground),n.style.setProperty("--gc-icon-size",a.controlIconSize?a.controlIconSize+"px":"calc(var(--gc-control-size) * .455)"),n.style.setProperty("--gc-button-padding",a.controlPadding+"px"),e.style.setProperty("--gc-detail-padding","0px");for(let I of b.children)I.style.textAlign=a.titleCustom?a.titleAlign:"",I.style.marginBottom=a.titleGap?a.titleGap+"px":"";for(let{body:I,link:U}of E)I.style.textAlign=a.bodyCustom?a.descriptionAlign:"",I.style.fontWeight=a.bodyCustom?a.descriptionWeight:"",I.style.color=a.bodyCustom&&a.descriptionCustom?a.descriptionColor:"inherit",I.style.fontSize=a.bodyCustom&&a.descriptionSize?a.descriptionSize+"rem":"",U.style.marginTop=a.buttonGap+"px";n.dataset.showImage=String(a.showImage!==!1),n.dataset.imageTint=a.overlayEnabled?a.imageTint:"#00000000",n.dataset.hoverEffect=a.reducedMotion?"none":a.hoverEffect,n.dataset.hoverAmount=a.hoverAmount;for(let[I,{body:U,link:R,href:J}]of E.entries())U.hidden=!a.showDescription||!U.textContent,R.hidden=!a.showButton||!J||!i[I].buttonLabel;S.hidden=L||E.every(({body:I,link:U})=>I.hidden&&U.hidden),n.dataset.edgeMode=a.edgeMode,n.dataset.backFace=a.backFace,n.dataset.cornerRadius=a.spiralRadius,n.dataset.borderWidth=a.cardBorderEnabled?a.borderWidth:0,n.dataset.borderColor=a.spiralRim,n.dataset.backColor=a.backColor,n.style.setProperty("--orbit-card-radius",a.spiralRadius+"px"),n.style.setProperty("--orbit-rim",a.spiralRim),c.style.width=`${Ke(a.containerWidth,100,20,100)}%`,g.style.height=a.heightMode==="viewport"?Ke(a.viewportHeight,65,15,100)+"vh":a.heightMode==="auto"?"clamp(160px,calc("+a.cardWidth+"px + "+a.spiralRise*4+"px),90svh)":Ke(a.stageHeight,680,120,1600)+"px",n.style.setProperty("--orbit-card-width",`${Ke(a.cardWidth,280,80,720)}px`),n.dataset.spiralWidth=String(Ke(a.spiralWidth,87,20,100)),n.dataset.cardWidth=String(Ke(a.cardWidth,280,80,720)),n.dataset.rise=String(Ke(a.spiralRise,52,a.spiralRiseUnit==="percent"?1:8,a.spiralRiseUnit==="percent"?50:500)),n.dataset.riseUnit=a.spiralRiseUnit==="percent"?"percent":"px",(!h[0].artwork||!i.some(I=>Rt(I,a)))&&(n.dataset.cardAspect=String(vr(a.aspectRatio))),n.dataset.imageFit=a.fit==="contain"||a.fit==="fit"?"fit":"fill",n.dataset.imagePadding=String(Ke(a.imagePadding,0,0,20)),n.dataset.slotGap=String(Ke(a.spiralGap,3,0,16)),n.dataset.showSlots=String(!!a.showSlots),b.hidden=L||!a.showTitles||!v,P(),n.classList.toggle("gc-spiral-reduced",!!a.reducedMotion)};w();let M=i.map(L=>({title:L.title||"",category:"",description:$t(L.description),services:[],notes:[],gallery:[{file:L.src||d,label:"Image"}]}));class H extends Dt{constructor(F,I){super(F,I,M),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(F){let I=i[F];if(!I||a.clickAction==="none"||a.clickAction==="source"&&e.dataset.sourceType!=="gallery")return;let U=mi(I.link);if(a.clickAction==="link"||a.clickAction==="source"){U&&location.assign(U);return}if(I.postUrl){t.openPost(I,F);return}super.open(F);let R=this.dialog.querySelector(".project-title");R.hidden=!I.title||!a.popupTitle,R.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",R.id),this.dialog.querySelector(".project-summary").hidden=!a.popupDescription||!$t(I.description),this.dialog.querySelector(".project-gallery").hidden=!a.popupImage||!I.src,this.dialog.querySelector(".project-frame-label").hidden=!a.popupTitle,this.dialog.querySelector(".project-info").hidden=R.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(U&&a.popupButton),this.sourceLink.hidden=!U||!a.popupButton,U?(this.sourceLink.href=U,this.sourceLink.textContent=I.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!a.reducedMotion)}showFrame(F){super.showFrame(F);let I=M.indexOf(this.project),U=i[I];U?.src&&(fi(this.image,U,r),this.dialog.querySelectorAll(".project-thumbnail img").forEach(R=>fi(R,U,r)),this.dialog.querySelector(".project-frame-label").textContent=U.title||"")}}let j=window.ProjectViewer;window.ProjectViewer=H;try{br.init(c)}finally{j===void 0?delete window.ProjectViewer:window.ProjectViewer=j}let p=n.spiralCarousel;n.querySelectorAll("img").forEach(L=>r?.(L));let A=()=>{for(let[L,F]of h.entries()){if(!F.artwork)continue;let I=F.artwork.toDataURL();for(let U of f.querySelectorAll('[data-slide-index="'+L+'"] img'))U.src=I}};g.addEventListener("webglcontextlost",A,!0);let G=p.updateActive;p.updateActive=function(L){G.call(this,L),E.forEach(({group:F},I)=>{F.inert=I!==L,F.style.visibility=I===L?"visible":"hidden"}),this.status.textContent=`${i[L]?.title?`${i[L].title}, `:""}image ${L+1} of ${i.length}`,o(L)},p.updateActive(p.active);let W=p.animateTo;p.animateTo=function(L,F=0){a.reducedMotion?(this.target=Math.round(L),this.settleImmediately()):W.call(this,L,F)};let X=Fo(p,{textureSource:L=>L.dataset.imageSource}),N=oo(n,p,{pauseOnHover:!1,interactionRestMs:0});function q(L){a.autoplay=!!L,p.manuallyPaused=!L||!!a.reducedMotion,p.resumeAt=0,m.disabled=!!a.reducedMotion||p.reducedMotion.matches||i.length<2,m.dataset.paused=String(p.manuallyPaused),m.setAttribute("aria-label",p.manuallyPaused?"Resume carousel":"Pause carousel"),p.syncAutoplay()}return q(!!a.autoplay),{update(L){let F=a;a={...a,...L},w(),p.measure(),n.dispatchEvent(new Event("playground-change")),n.dispatchEvent(new Event("slot-guides-change")),p.updateActive(p.active),(F.autoplay!==a.autoplay||F.reducedMotion!==a.reducedMotion)&&q(!!a.autoplay)},goTo(L){s||p.goTo(L)},setPlaying:q,getMetrics(){try{return JSON.parse(n.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return n.dataset.renderer||"loading"},destroy(){s||(s=!0,g.removeEventListener("webglcontextlost",A,!0),N(),X(),p.destroy(),c.remove())}}}var br,yr,Ke,vr,$t,Uo,Xo=Q(async()=>{eo();Qt();io();Ft();Ht();Ht();ao();await Ro();Do();br=window.SpiralCarousel,yr=0,Ke=(t,e,o,r)=>Number.isFinite(Number(t))?Math.max(o,Math.min(r,Number(t))):e,vr=t=>{if(typeof t=="number"&&t>0)return t;let[e,o]=String(t||"16:9").split(":").map(Number);return e>0&&o>0?e/o:16/9},$t=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Uo=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Vo(t){let{host:e}=t,o={...t.options},r=null,i=null,a=!1,s="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),Xo().then(()=>_o).then(n=>{a||(c.remove(),i=n.mountSpiral({...t,options:o}),r!==null&&i.goTo?.(r))}).catch(n=>{a||(s="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",n))}),{update(n){o={...o,...n},i?.update?.(o)},goTo(n){r=n,i?.goTo?.(n)},setPlaying(n){o.autoplay=n,i?.setPlaying?.(n)},getStatus(){return i?.getStatus?.()??s},getMetrics(){return i?.getMetrics?.()??null},destroy(){a=!0,c.remove(),i?.destroy()}}}var Yo=Q(()=>{});function lt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let o=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(o.protocol)?o.href:""}catch{return""}}function Ut(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(o=>o.remove()),e.content.querySelectorAll("*").forEach(o=>{for(let r of[...o.attributes])(/^on/i.test(r.name)||r.name==="style"||r.name==="id")&&o.removeAttribute(r.name);if(o.hasAttribute("href")){let r=lt(o.getAttribute("href"));r?o.setAttribute("href",r):o.removeAttribute("href")}}),e.innerHTML}function Jo(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let o of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(o)&&(e[o]=t.getAttribute(o));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function kt(t,e){let o=Gt[e];if(!t||!o)return null;let r=t.closest(o);if(!r){let n=t.querySelectorAll(o);if(n.length!==1)return null;r=n[0]}let i=e==="list"?r:r.querySelector(":scope > .sqs-block-content");if(!i)return null;let a=n=>Array.from(i.querySelectorAll(n)).filter(g=>g.closest(o)===r&&(!g.closest(".gc-embed")||g.hasAttribute("data-gc-native-track")));if(e==="summary"){let n=a(".summary-block-wrapper");if(n.length!==1)return null;let g=a(".summary-item").filter(f=>n[0].contains(f)&&!f.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:r,originals:n,rows:g}}let s=e==="list"?".list-item":".slide",c=a(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=a(".sqs-gallery")),c.length===1){let n=Array.from(c[0].querySelectorAll(s)).filter(g=>g.closest(o)===r&&!g.hasAttribute("data-gc-repeat"));return{source:r,originals:c,rows:n}}if(e==="gallery"&&!c.length){let n=a(s);if(n.length&&n.every(g=>g.parentElement===n[0].parentElement))return{source:r,originals:n,rows:n}}return null}function ut(t,e,o=location.href){return(kt(t,e)?.rows||[]).map(i=>{let a=i.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let g=i.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),f=lt(g?.getAttribute("href"),o);return{...Jo(a),title:i.querySelector(".summary-title")?.textContent.trim()||a?.alt||"",description:Ut(i.querySelector(".summary-excerpt")?.innerHTML),link:f,postUrl:f,buttonLabel:"Read post"}}let s=i.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=Ut(i.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),n=i.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...Jo(a),title:s,description:c,link:lt(n?.getAttribute("href"),o),buttonLabel:e==="list"&&n?.textContent.trim()||""}}).filter(i=>e==="summary"?!!i.link:e==="list"||!!(i.src||i.title||i.link))}function wr(t,e){let o=e==="list"?t.getAttribute("data-section-id"):t.id;if(!o?.trim())return"";let r=e==="list"?'section[data-section-id="'+CSS.escape(o)+'"]':"#"+CSS.escape(o);return t.ownerDocument.querySelectorAll(r).length===1?r:""}function bi(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Gt).join(","))).filter(o=>!o.closest(".gc-embed")).flatMap(o=>{let r=o.matches(Gt.list)?"list":o.matches(Gt.summary)?"summary":"gallery",i=wr(o,r);if(!i||!kt(o,r))return[];let a=++e[r];return{name:(r==="list"?"List Section":r==="summary"?"Summary Block":"Gallery Block")+(a>1?" "+a:""),type:r,selector:i,root:o,items:ut(o,r)}})}function _t(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let o=t.ownerDocument.defaultView?.ImageLoader;if(o&&typeof o.load=="function")try{o.load(t,{load:!0})}catch(r){console.warn("Gallery Studio: native image loader",r)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Ko(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Ko(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function yi(t){let e=document.createElement("img");for(let[o,r]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(o)&&e.setAttribute(o,r);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Ko(t.imageAttrs?.["data-image-focal-point"]),e}var Gt,vi=Q(()=>{Gt={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function Zo(t,e,o){let r=new WeakMap,i=new WeakMap,a=Array.from(e.childNodes),s=o.map(E=>Array.from(E.childNodes)),c=[];function n(E,d){E&&c.push([E,d.map(h=>[h,E.getAttribute(h)])])}let g=new Set,f=!1;function m(){n(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let E of o)n(E,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),f=!0}function y(E,d,h,x,D){let z=o[d],P=g.has(d),C=P?z.cloneNode(!1):z,w=document.createElement("div");if(w.className="gc-card gc-native-card",w.tabIndex=0,w.setAttribute("role","group"),E.imageAttrs?.["data-image-focal-point"]){let[W,X]=E.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(W)&&Number.isFinite(X)&&w.style.setProperty("--gc-native-focus",W*100+"% "+X*100+"%")}let M=E.title||E.alt||`Item ${d+1}`;if(w.setAttribute("aria-label",M),P){C.removeAttribute("id"),C.setAttribute("data-gc-repeat","");for(let W of s[d])w.append(W.cloneNode(!0));w.querySelectorAll("[id]").forEach(W=>W.removeAttribute("id"))}else g.add(d),w.append(...s[d]);C.replaceChildren(w),r.set(w,C);let H=w.querySelector(".list-item-media"),j=w.querySelector(".list-item-content"),p=w.querySelector(".list-item-content__title"),A=w.querySelector(".list-item-content__description");if(!P){for(let W of[H,j])n(W,["class"]);for(let W of[p,A])n(W,["class","hidden"])}if(H?.classList.add("gc-card-media"),j?.classList.add("gc-card-copy"),x.typeSource!=="native"&&(p?.classList.add("gc-card-title"),A?.classList.add("gc-card-description")),p&&(!x.showTitles||h.caption===!1)&&(p.hidden=!0),A&&!h.description&&(A.hidden=!0),H&&!x.showImage&&(P||n(H,["hidden"]),H.hidden=!0),!x.showButton){let W=w.querySelector(".list-item-content__button-wrapper")||w.querySelector(".list-item-content__button");W&&(P||n(W,["hidden"]),W.hidden=!0)}h.thumbnail&&j&&(!E.title||h.caption===!1)&&!x.showDescription&&!x.showButton&&(P||n(j,["hidden"]),j.hidden=!0);let G=Array.from(w.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!P)for(let W of G)n(W,["tabindex"]);if(i.set(w,G.map(W=>[W,W.getAttribute("tabindex")])),x.clickAction!=="none"&&x.clickAction!=="source"&&(x.clickAction!=="link"||E.link)){let W=document.createElement("button");W.type="button",W.className="gc-native-action",W.tabIndex=-1,W.setAttribute("aria-label",(x.clickAction==="link"?"Open link for ":"Open ")+M),W.addEventListener("click",()=>D(E,d)),w.append(W),w.setAttribute("aria-keyshortcuts","Enter Space"),w.addEventListener("click",X=>{X.defaultPrevented||X.target.closest("a,button,input,select,textarea,label")||D(E,d)}),w.addEventListener("keydown",X=>{X.target!==w||!["Enter"," "].includes(X.key)||(X.preventDefault(),W.click())})}return w}function b(E){let d=E.tabIndex===0&&E.getAttribute("aria-hidden")!=="true";for(let[h,x]of i.get(E)||[]){let D=d?x:"-1";h.getAttribute("tabindex")!==D&&(D===null?h.removeAttribute("tabindex"):h.setAttribute("tabindex",D))}}function v(E){if(!f)return;let d=E!=="native";e.querySelectorAll(".list-item-content__title").forEach(h=>h.classList.toggle("gc-card-title",d)),e.querySelectorAll(".list-item-content__description").forEach(h=>h.classList.toggle("gc-card-description",d))}function S(){if(e.classList.remove("gc-native-items-hidden"),!!f){o.forEach((E,d)=>E.replaceChildren(...s[d])),e.replaceChildren(...a);for(let[E,d]of c)for(let[h,x]of d)E.getAttribute(h)!==x&&(x===null?E.removeAttribute(h):E.setAttribute(h,x));t.after(e),c.length=0,g.clear(),f=!1}}return{track:e,begin:m,makeCard:y,slot:E=>r.get(E),syncFocus:b,setType:v,restore:S}}var Qo=Q(()=>{});function ea(t,e,o){if(!o.closest(".fluid-engine > .fe-block"))return()=>{};o.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let i=0,a=!1,s=new WeakSet,c=y=>{y&&!s.has(y)&&(s.add(y),g.observe(y))},n=()=>{!i&&!a&&(i=requestAnimationFrame(m))},g=new ResizeObserver(n),f=new MutationObserver(n);function m(){if(i=0,a||!e.isConnected)return;let y=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!y)return;let b=y.classList.contains("gc-carousel-stage"),v=y.parentElement;v.classList.contains("gc-block-stage-window")&&(v=v.parentElement),c(v),c(y);let S=0;for(let d of v.children){if(d===y||d.contains(y))continue;c(d);let h=getComputedStyle(d);h.display==="none"||["absolute","fixed"].includes(h.position)||(S+=d.offsetHeight+(parseFloat(h.marginTop)||0)+(parseFloat(h.marginBottom)||0))}let E=Math.max(1,t.clientHeight-S);if(b){let d=y.parentElement;d.classList.contains("gc-block-stage-window")||(d=document.createElement("div"),d.className="gc-block-stage-window",y.before(d),d.append(y));let h=Math.min(1,E/Math.max(1,y.offsetHeight));d.style.height=E+"px",y.style.setProperty("--gc-block-scale",String(h)),y.style.setProperty("--gc-block-top",Math.max(0,(E-y.offsetHeight*h)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",E+"px")}return c(t),f.observe(e,{childList:!0,subtree:!0}),n(),()=>{a=!0,cancelAnimationFrame(i),g.disconnect(),f.disconnect(),o.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let y=e.querySelector(".gc-block-stage-window");if(y){let b=y.firstElementChild;b.style.removeProperty("--gc-block-scale"),b.style.removeProperty("--gc-block-top"),y.replaceWith(b)}}}var ta=Q(()=>{});function ia(t,e,o,r){let i=o.ownerDocument,a=i.defaultView,s=r!=="list"?o.closest(".fluid-engine > .fe-block"):null;s?.classList.add("gc-viewport-cell");let c=[],n=s||o;for(let m=t.parentElement;m&&(["hidden","clip","auto","scroll"].includes(a.getComputedStyle(m).overflowX)&&c.push(m),m!==n);m=m.parentElement);function g(){let m=i.documentElement.clientWidth;if(!m||!t.isConnected||!t.getClientRects().length)return;for(let v of c){let S=v.getBoundingClientRect().left+a.scrollX+v.clientLeft,E=S>.5||S+v.clientWidth<m-.5;v.classList.toggle("gc-viewport-unclip",E)}let y=-(t.getBoundingClientRect().left+a.scrollX),b=(v,S)=>{e.style.getPropertyValue(v)!==S&&e.style.setProperty(v,S)};b("--gc-viewport-width",m+"px"),b("--gc-viewport-offset",y+"px")}g();let f=a.ResizeObserver?new a.ResizeObserver(g):null;return f?.observe(t),f?.observe(i.documentElement),a.addEventListener("resize",g),()=>{f?.disconnect(),a.removeEventListener("resize",g);for(let m of c)m.classList.remove("gc-viewport-unclip");s?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var oa=Q(()=>{});var ra,aa=Q(()=>{ra=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function na(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let r=document.createElement("style");r.id="gc-finish-css",r.textContent=ra,document.head.append(r)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let o={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[r,i]of Object.entries(o))t.style.setProperty(r,i);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var xi,sa=Q(()=>{aa();xi={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function Xt(t){t.setAttribute("data-lenis-prevent","");for(let e of["wheel","touchmove"])t.addEventListener(e,o=>o.stopPropagation(),{passive:!0})}var wi=Q(()=>{});function ca(t,e){let o=t.classList.contains("gc-embed"),r=o&&e.colorSource==="section";r?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,o&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let i=t.style;i.setProperty("--gc-custom-background",e.background),i.setProperty("--gc-custom-ink",e.ink),i.setProperty("--gc-custom-accent",e.accent),i.setProperty("--gc-background",r?"var(--gc-section-surface)":e.background),i.setProperty("--gc-ink",r?"var(--gc-section-body)":e.ink),i.setProperty("--gc-accent",r?"var(--gc-section-action)":e.accent),i.setProperty("--gc-muted",r?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),i.setProperty("--gc-spatial-surface","var(--gc-background)"),i.setProperty("--gc-spatial-ink","var(--gc-ink)"),r&&(i.setProperty("--gc-line-color","var(--gc-section-line)"),i.setProperty("--gc-tint","var(--gc-section-body)")),i.background=r?"transparent":e.background,i.color=r?"var(--gc-section-body)":e.ink;for(let a of t.querySelectorAll(":scope > dialog"))la(t,a)}function la(t,e){for(let o of["gcColorSource","gcTypeSource"])t.dataset[o]?e.dataset[o]=t.dataset[o]:delete e.dataset[o]}function ki(t,e){Xt(e);let o=t.classList.contains("gc-embed")?t:t.ownerDocument.body;la(t,e),e.parentElement!==o&&o.append(e)}var da=Q(()=>{wi()});var ga,pa=Q(()=>{ga=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var ha,ua=Q(()=>{ha=`.gc-post-dialog {
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
`});var ma,fa=Q(()=>{ma=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var ya,ba=Q(()=>{ya=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var xa,va=Q(()=>{xa=`.gc-carousel {
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
`});var ka,wa=Q(()=>{ka=`.gc-spatial {
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
`});function Qe(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Vt(t,e){let o=Qe(e.preset??t.preset),r=o===Qe(t.preset)?t.stageHeight:o?0:590;return{...e.preset==="spiral"?Ve:{},...t,...e,stageHeight:e.stageHeight??r}}function Sa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function Ca(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[ga,ma,ya,ha].join(`
`),document.head.append(e));let o=Sa(t);if(o==="common")return()=>{};let r=`gc-runtime-${o}-css`,i=document.getElementById(r);i||(i=document.createElement("style"),i.id=r,o==="carousel"?i.textContent=xa:o==="spatial"?i.textContent=ka:i.textContent=[Wo,Bo,No,Go].join(`
`),e.after(i)),i.dataset.gcOwners=String(Number(i.dataset.gcOwners||0)+1);let a=!1;return()=>{if(a)return;a=!0;let s=Number(i.dataset.gcOwners)-1;s>0?i.dataset.gcOwners=String(s):i.remove()}}function Lr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function Ma(t,e,o={},r=null){let i=Vt({...Ze,...mt(o.preset??Ze.preset,o)},o),a=null,s=null,c=null,n=null,g=0,f=0,m,y,b;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function v(){s&&(c?.destroy(),c=null,s.close(),s.remove(),s=null,a?.setSuspended?.(!1),n?.focus({preventScroll:!0}))}function S(p,A){if(i.clickAction==="none"||i.clickAction==="source"&&!p.link)return;if(i.clickAction==="link"||i.clickAction==="source"){let F=lt(p.link);F&&window.open(F,"_blank","noopener,noreferrer");return}let G=document.activeElement;if(s&&v(),n=G,p.postUrl){c=Ui(p.postUrl,z(),v),s=c.dialog,E(),c.load();return}s=document.createElement("dialog"),s.className="gc-dialog"+(i.preset==="showcase"?" gc-dialog-drawer":""),s.setAttribute("aria-label",p.title||"Image preview");let W=document.createElement("button");W.className="gc-dialog-close",W.type="button",W.textContent="Close \xD7",W.addEventListener("click",v);let X=document.createElement("div");X.className="gc-dialog-content";let N=document.createElement("div");N.className="gc-dialog-media",p.src&&i.popupImage!==!1&&(N.append(yi(p)),X.append(N));let q=document.createElement("div");if(q.className="gc-dialog-copy",p.title&&i.popupTitle!==!1){let F=document.createElement("h2");F.textContent=p.title,q.append(F)}if(p.description&&i.popupDescription!==!1){let F=document.createElement("div");F.innerHTML=Ut(p.description),q.append(F)}if(p.link&&i.popupButton!==!1){let F=document.createElement("a");F.href=lt(p.link),F.textContent=p.buttonLabel||"Open link",F.target="_blank",F.rel="noopener noreferrer",q.append(F)}let L=document.createElement("p");L.className="gc-dialog-count",L.textContent=`${A+1} / ${e.length}`,q.append(L),X.append(q),s.append(W,X),E(),_t(N.querySelector("img")),W.focus()}function E(){ki(t,s),s.showModal(),a?.setSuspended?.(!0),s.addEventListener("cancel",p=>{p.preventDefault(),v()}),s.addEventListener("click",p=>{if(p.target===s){let A=s.getBoundingClientRect();(p.clientX<A.left||p.clientX>A.right||p.clientY<A.top||p.clientY>A.bottom)&&v()}})}function d(p,A,G={}){if(G={...G,description:i.showDescription},r)return r.makeCard(p,A,G,i,S);let W=i.showButton&&p.buttonLabel&&lt(p.link),X=!!W,N=document.createElement(X?"div":"button");X?(N.tabIndex=0,N.setAttribute("role","group")):N.type="button",N.className="gc-card",N.setAttribute("aria-label",p.title||`Image ${A+1}`);let q=document.createElement("span");q.className="gc-card-media",p.src&&i.showImage!==!1&&(q.append(yi(p)),N.append(q));let L=document.createElement("span");if(L.className="gc-card-copy",G.caption!==!1&&i.showTitles&&p.title){let I=document.createElement("span");I.className="gc-card-title",I.textContent=p.title,L.append(I)}if(G.description&&p.description){let I=document.createElement("span");I.className="gc-card-description",I.textContent=Lr(p.description),L.append(I)}if(X){let I=document.createElement("a");I.className="gc-card-button",I.href=W,I.textContent=p.buttonLabel,L.append(I)}L.childNodes.length&&N.append(L);let F=()=>{(i.clickAction!=="source"||!p.buttonLabel)&&S(p,A)};return N.addEventListener("click",I=>{I.target.closest("a")||F()}),X&&N.addEventListener("keydown",I=>{I.target===N&&["Enter"," "].includes(I.key)&&(I.preventDefault(),F())}),N}function h(p,A,G){let W=d(p,A,G);if(i.aspectRatio==="original"){let X=W.querySelector(".gc-card-media img");if(X){let N=(L,F)=>{L>0&&F>0&&W.style.setProperty("--gc-original-ratio",L+" / "+F)},q=X.dataset.imageDimensions?.split("x").map(Number);q?.length===2?N(...q):X.naturalWidth?N(X.naturalWidth,X.naturalHeight):X.addEventListener("load",()=>N(X.naturalWidth,X.naturalHeight),{once:!0})}}return W}let x=matchMedia("(prefers-reduced-motion: reduce)"),D=matchMedia("(max-width: 660px)");function z(){let p={...Oi(t,i),reducedMotion:i.reducedMotion||x.matches};if(D.matches&&i.mobileSizing){for(let[A,G]of[["carouselPadding","mobileCarouselPadding"],["cardPadding","mobileCardPadding"]])i[G]!=null&&(p[A]=i[G]);i.preset==="spiral"&&i.mobileSpiralWidth!=null&&(p.spiralWidth=i.mobileSpiralWidth),i.mobileHeightMode&&i.mobileHeightMode!=="inherit"&&(p.heightMode=i.mobileHeightMode,p.stageHeight=i.mobileStageHeight??p.stageHeight,p.viewportHeight=i.mobileViewportHeight),i.mobileCardWidth!=null&&(p.cardWidth=i.mobileCardWidth),i.mobileGap!=null&&(p[i.preset==="spiral"?"spiralGap":"gap"]=i.mobileGap)}return i.preset!=="spiral"&&(p.heightMode==="viewport"&&(p.stageHeight=innerHeight*p.viewportHeight/100),p.heightMode==="auto"&&(p.stageHeight=Qe(i.preset)?0:Math.min(innerHeight,i.preset==="stack"?680:590))),p.phoneWidthOverride=D.matches&&i.mobileSizing&&i.mobileCardWidth!=null,i.preset==="stack"&&(p.stackCardWidth=D.matches&&i.mobileSizing&&i.mobileCardWidth!=null?i.mobileCardWidth:Math.max(360,i.cardWidth*2.2)),p}function P(){t.classList.toggle("gc-hide-controls",i.showControls===!1);let p=z();na(t,p),ca(t,p),i.preset!=="spiral"&&(Bi(t,p),(p.overlayEnabled||p.shadowEnabled||b)&&(b??=Lt(t,"gc-image-"+crypto.randomUUID()),b({...p,cardShadow:!1,imageTint:p.overlayEnabled?p.imageTint:"#00000000"}))),t.style.setProperty("--gc-fit",i.fit),t.style.setProperty("--gc-card-radius",i.radius+"px")}function C(p=0){v(),a?.destroy(),a=null,r?.restore(),cancelAnimationFrame(f),t.replaceChildren(),b=null,t.classList.add("gc-stage"),t.style.height="";let A=Sa(i.preset);A!==m&&(y?.(),y=Ca(i.preset),m=A),P(),t.setAttribute("aria-label",i.previewScroll===!1?"Gallery":"Gallery preview");let G=r&&i.preset!=="spiral"?r:null;G?G.begin():r&&r.track.classList.add("gc-native-items-hidden");let W={host:t,items:e,openPost:S,initialIndex:p,nativeList:G,attachDialog:X=>ki(t,X),options:z(),makeCard:h,loadImage:_t,onChange(X){g=X,i.onChange?.(X)}};if(!e.length){let X=document.createElement("p");X.className="gc-empty",X.textContent="Add images to your source to start exploring.",t.append(X);return}i.preset==="spiral"?a=Vo(W):i.preset==="stack"?a=Ki(W):["wall","ring","angled"].includes(i.preset)?(a=Yi(W),p&&a.goTo(p)):a=Xi(W),i.preset!=="spiral"&&(f=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(X=>{_t(X,{nativeCard:!!G})})))}let w=()=>C(g);function M(){if(i.preset!=="spiral"){i.mobileSizing&&C(g);return}a?.setGeometry?a.setGeometry(z()):i.preset==="spiral"?a?.update(z()):C(g)}try{C()}catch(p){throw y?.(),r?.restore(),p}let H=innerHeight;function j(){if(H===innerHeight)return;H=innerHeight;let p=z().heightMode;i.preset!=="spiral"&&["viewport","auto"].includes(p)&&C(g)}return window.addEventListener("resize",j),x.addEventListener("change",w),D.addEventListener("change",M),{update(p){let A=i.preset,G=z();i=Vt(i,p);let W=z(),X=Object.keys(W).filter(q=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(q)&&W[q]!==G[q]);if(!X.length)return;if(a?.setGeometry&&X.every(q=>["cardWidth","gap","phoneWidthOverride"].includes(q))){a.setGeometry(W);return}let N=q=>["colorSource","typeSource","background","ink","accent"].includes(q);if(X.every(q=>N(q)||A!=="spiral"&&(q==="radius"||Object.hasOwn(xi,q)))){P(),X.includes("typeSource")&&r?.setType(i.typeSource);return}A==="spiral"&&i.preset==="spiral"&&a?.update?(P(),a.update(W)):C(A===i.preset?g:0)},goTo(p){a?.goTo?.(p)},setPlaying(p){i.autoplay=p,a?.setPlaying?.(p)},getOptions(){return{...i}},getActive(){return g},destroy(){window.removeEventListener("resize",j),v(),cancelAnimationFrame(f),a?.destroy(),r?.restore(),x.removeEventListener("change",w),D.removeEventListener("change",M),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),y?.()}}}function zr(t,e){let o=e.closest("section")||e,r=[];for(let i=t.parentElement;i;i=i.parentElement){let a=Le.scrollBoundaries.get(i)||0;if((a||["hidden","auto","scroll","overlay"].includes(getComputedStyle(i).overflowY))&&(Le.scrollBoundaries.set(i,a+1),i.classList.add("gc-stack-page-scroll"),r.push(i)),i===o)break}return()=>{for(let i of r){let a=Le.scrollBoundaries.get(i)-1;a?Le.scrollBoundaries.set(i,a):(Le.scrollBoundaries.delete(i),i.classList.remove("gc-stack-page-scroll"))}}}function ot(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function Si(t){if(!Le.editListeners?.size){Le.editListeners=new Set;let e=ot();Le.editObserver=new MutationObserver(()=>{let o=ot();if(o!==e){e=o;for(let r of Le.editListeners)try{r(o)}catch(i){console.warn("Gallery Studio: could not resume a list layout.",i)}}});for(let o of[document.body,document.documentElement])Le.editObserver.observe(o,{attributes:!0,attributeFilter:["class"]})}return Le.editListeners.add(t),()=>{Le.editListeners.delete(t),Le.editListeners.size||Le.editObserver.disconnect()}}function Ci({selector:t,type:e="gallery",options:o={}}={}){let r=t;if(typeof t=="string")try{let A=document.querySelectorAll(t);if(A.length!==1)return null;r=A[0]}catch{return null}if(!r?.isConnected||typeof r.closest!="function")return null;let i=kt(r,e);if(!i)return null;let{source:a}=i,s=Le.mounts.get(a);if(s)return s.instance.update(o),s;if(!ut(a,e).length)return null;let c=document.createElement("div"),n=document.createElement("div");c.dataset.sourceType=e,c.className="gc-embed",n.className="gc-viewport-slot",n.append(c);let g={...Vt({...Ze,...mt(o.preset??Ze.preset,o),...e==="summary"?{showButton:!1}:{}},o),previewScroll:!1},f=null,m=null,y=null,b=null,v=null,S=!1,E=[],d=null,h=!1,x=null;function D(){g.galleryWidth==="source"?(y?.(),y=null,d&&(n.classList.add("user-items-list-simple"),n.dataset.layoutWidth=d.mode,n.style.maxWidth=d.maximum)):y||(n.classList.remove("user-items-list-simple"),delete n.dataset.layoutWidth,n.style.removeProperty("max-width"),y=ia(n,c,a,e))}function z(){return e!=="list"&&g.preset!=="stack"&&g.galleryHeight!=="custom"&&!!a.closest(".fluid-engine > .fe-block")}function P(){z()?b||(b=ea(n,c,a)):(b?.(),b=null)}function C(A){A==="stack"?m||(m=zr(c,a)):m&&(m(),m=null)}function w(){try{f?.destroy()}finally{f=null,b?.(),b=null,C(null),y?.(),y=null,E.forEach(A=>A.classList.remove("gc-native-items-hidden")),E=[],x?.remove(),x=null,n.remove(),n.replaceChildren(c),c.inert=!1}}function M(){if(S||f||!a.isConnected)return;let A=kt(a,e),G=ut(a,e);if(!A||!G.length)return;A.originals[0].before(n),Ca();let W=A.originals[0];d=e==="list"?{mode:W.dataset.layoutWidth||"full",maximum:W.style.maxWidth}:null,D();let X=null;if(e==="list"){let N=h?W.cloneNode(!0):W;h&&(x=N,N.removeAttribute("id"),N.querySelectorAll("[id]").forEach(q=>q.removeAttribute("id")),n.append(N)),X=Zo(n,N,h?[...N.querySelectorAll(".list-item")]:A.rows)}(!X||h)&&(E=A.originals,E.forEach(N=>N.classList.add("gc-native-items-hidden"))),P(),C(g.preset),f=Ma(c,G,g,X),c.inert=h}function H(){if(!S){S=!0,a.classList.remove("gc-edit-preview");try{w()}finally{v?.(),Le.mounts.delete(a)}}}let p={instance:{update(A={}){if(S)return;let G=g.galleryWidth;g={...Vt(g,A),previewScroll:!1},f&&(g.galleryWidth!==G&&D(),P(),C(g.preset),f.update(g))},setEditPreview(A){if(!(S||!ot()||A===h)){if(h=A,a.classList.toggle("gc-edit-preview",A),!A){w();return}try{M()}catch(G){throw this.setEditPreview(!1),G}}},goTo(A){f?.goTo(A)},setPlaying(A){g.autoplay=A,f?.setPlaying(A)},getOptions(){return{...g}},getActive(){return f?.getActive()??0},destroy:H},host:c,source:a,destroy:H};try{v=Si(A=>{if((h||A)&&w(),h=!1,a.classList.remove("gc-edit-preview"),!A)try{M()}catch(G){throw w(),G}}),ot()||M(),Le.mounts.set(a,p)}catch(A){throw H(),A}return p}var St,Ze,Le,Mi=Q(()=>{Qt();Fi();ei();Bt();_i();Vi();Ji();Zi();Yo();Ht();vi();Qo();ta();oa();sa();da();pa();ua();fa();ba();va();wa();$o();Ho();Oo();qo();St=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],Ze={...Tt,...xi,popupDesktopLayout:"split",colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};Le=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:Ma,embed:Ci,presets:St,loadPostData:zt}});var Ea,Aa=Q(()=>{Ea=`:host {
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
`});function ae(t,e,o){let r=document.createElement(t);return e&&(r.className=e),o!==void 0&&(r.textContent=o),r}function ze(t,e,o){let r=ae("button",t,e);return r.type="button",o&&r.setAttribute("aria-label",o),r}function Pa(t){let e=ae("span","select-box");return e.append(t),e}function je(t,e,o,r,i,a=""){return{key:t,label:e,type:"range",min:o,max:r,step:i,unit:a}}function Ge(t,e,o){return{key:t,label:e,type:"select",choices:Object.entries(o).map(([r,i])=>({value:r,label:i}))}}function dt(t,e,o){return{key:t,label:e,type:"color",when:o,independent:!0}}function Yt(t,e){let o=t.preset,r=Qe(o),i=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,o==="timed"?960:o==="spiral"?720:560,1,"px"),je("stageHeight",r?"Minimum gallery height":"Gallery height",r?0:300,1200,1,"px")];if(e!=="list"&&(i.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&i.splice(i.findIndex(n=>n.key==="stageHeight"),1)),o==="spiral")i.push(...yt);else if(i.push(je("gap","Spacing",0,100,1,"px")),o!=="infinite"&&o!=="timed"){let n={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[o]||"Depth";i.push(je("depth",n,0,100,1))}let a=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":o==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(o==="arc-tabs"||o==="timed")&&a.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),o!=="stack"&&(a.push({key:"showControls",label:"Show controls",type:"checkbox"}),a.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),o!=="spiral"&&a.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),a.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let s=ti.has(o),c=[{title:"Size & spacing",fields:i},{title:"Mobile overrides",fields:[{...i.find(n=>n.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...i.find(n=>n.key===(o==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:o==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:a},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:Ir},...o==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),dt("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(o)?[Ge("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),dt("backColor","Back color",["backFace","solid"])]:[],...o==="stack"?[]:[Ge("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...s?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...o==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ge("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ge("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ge("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),dt("controlFill","Button background",["controlPalette","custom"]),dt("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...s?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(n=>({value:n,label:n+" rem"}))]}],Ge("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ge("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),dt("titleColor","Custom title color",["titlePalette","custom"])]},...s?Wi({range:je,select:Ge,swatch:dt}):[]];if(s){c=Hi(t,e,{range:je,select:Ge,swatch:dt},c);for(let n of c)if(n.title==="Mobile")for(let g of n.fields.slice(1))g.condition=f=>f.mobileSizing,g.mobileRange=!!g.inherits}if(e==="summary"){let n={...Ge("popupDesktopLayout","Desktop layout",{split:"Split panel",drawer:"Slide-in drawer"}),when:["clickAction","preview"]},g=c.find(f=>f.title==="Popup");g?g.fields.unshift(n):c.push({title:"Popup",fields:[n]})}if(s){for(let n of c)if(n.fields=n.fields.flatMap(g=>{if(g.type!=="color"||!qt.includes(g.key))return[g];let f=g.when||(g.independent?void 0:["colorSource","custom"]);return[{...Ge(g.key+"Swatch",g.label+" palette",{custom:"Custom",...ii}),type:"palette",when:f,condition:g.condition},{...g,when:f,condition:g.condition,customFor:g.key+"Swatch"},{...je(g.key+"Opacity",g.label+" opacity",0,100,1,"%"),when:f}]}),n.typography)for(let g of n.fields)g.typography=n.typography}return c}function La(t){return{...Ze,stageHeight:Qe(t.preset??Ze.preset)?0:590,...t.preset==="spiral"?Ve:{},colorSource:"section",typeSource:"native",...t}}function Tr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",o=t.name?.trim()||e,r=t.items?.length||0;return`${o.toLowerCase().includes(e.toLowerCase())?o:`${o} \xB7 ${e}`} \xB7 ${r} ${r===1?"item":"items"}`}function qr(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let o=e.ownerDocument,r=o.defaultView,i=0;function a(){i=0;let g=e.getBoundingClientRect();if(!g.width||!g.height||!e.offsetHeight)return;let f=g.height/e.offsetHeight,m=t.getBoundingClientRect(),y=g.width/e.offsetWidth,b=Math.min(g.bottom,r.innerHeight),v=b;for(let S of[.1,.5,.9]){let E=g.left+(m.left+m.width*S)*y,d=o.elementFromPoint(E,b-2);if(!(!d||d===e))for(;d&&!d.contains(e);){let h=d.getBoundingClientRect();h.bottom>=b-2&&h.height>0&&h.height<g.height/2&&(v=Math.min(v,h.top)),d=d.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((g.bottom-v)/f))+"px")}function s(){i||(i=requestAnimationFrame(a))}let c=new ResizeObserver(s);c.observe(e),c.observe(o.documentElement);let n=new MutationObserver(s);return n.observe(o.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),r.addEventListener("resize",s),r.addEventListener("transitionend",s),a(),()=>{c.disconnect(),n.disconnect(),r.removeEventListener("resize",s),r.removeEventListener("transitionend",s),cancelAnimationFrame(i)}}function za({source:t,options:e,onPreset:o,onOption:r,onClose:i,onRestore:a,onSave:s,getSaveState:c,getCode:n,getStyle:g,applyStyle:f}){let m=document.activeElement,y=t,b=La(e),v=!1,S=!1,E=0,d=new Map,h=[],x=new Map;function D(){for(let[l,u]of x)l.hidden=!b[u]}let z=new Map,P=ae("div");P.setAttribute("data-gc-author-panel",""),Xt(P);let C=P.attachShadow({mode:"open"}),w=ae("style");w.textContent=Ea;let M=ae("aside","panel");M.setAttribute("aria-labelledby","gc-author-heading");let H=ae("header","header"),j=ae("div","heading"),p=ae("h2","","Gallery settings");p.id="gc-author-heading";let A=ae("p","target"),G=ae("p","save-state");G.setAttribute("role","status"),j.append(p,A,G);function W(l=c()){G.textContent!==l&&(G.textContent=l,G.dataset.saved=String(l==="Saved to page"))}let X=ae("div","header-actions"),N=ze("icon-button","\u2212","Minimize settings");N.setAttribute("aria-controls","gc-author-controls"),N.setAttribute("aria-expanded","true");let q=ze("icon-button","\xD7","Close settings");X.append(N,q),H.append(j,X);let L=ae("div","controls");L.id="gc-author-controls";let F=ae("div","scroll");F.tabIndex=0,F.setAttribute("aria-label","Layout settings");let I=ae("label","preset-row"),U=ae("select","preset-select");U.setAttribute("aria-label","Layout");for(let l of St.filter(u=>t.type==="list"||u.id!=="stack")){let u=ae("option","",l.name);u.value=l.id,U.append(u)}I.append(ae("span","field-label","Layout"),Pa(U));let R=ae("div","groups"),J=ae("div","style-actions"),V=ze("text-button","Copy style"),Z=ze("text-button","Paste style");J.append(V,Z);let re=ae("div","style-transfer");re.hidden=!0;let $=ae("textarea");$.setAttribute("aria-label","Gallery style"),$.spellcheck=!1;let Y=ze("secondary","Apply style"),ne=ze("text-button","Close","Close style transfer"),K=ae("p","field-error","Paste a gallery style created with Copy style.");K.id="gc-style-error",K.hidden=!0,K.setAttribute("role","alert");function ce(){K.hidden=!0,$.removeAttribute("aria-invalid"),$.removeAttribute("aria-describedby")}$.addEventListener("input",ce),re.append($,K,Y,ne),F.append(I,J,re,R);let ue=ae("footer","footer"),se=ae("div","export-actions"),pe=ze("primary","Save to page"),ye=ze("secondary","Copy code"),we=ze("text-button","Download header backup");we.hidden=!0;let ke=null,te=ze("secondary","View code");te.setAttribute("aria-expanded","false"),te.setAttribute("aria-controls","gc-author-code"),se.append(pe,ye);let be=ae("div","code-view");be.id="gc-author-code",be.hidden=!0;let oe=ae("label","code-label","Page Header Code Injection"),Ae=ae("textarea");Ae.readOnly=!0,Ae.spellcheck=!1,Ae.setAttribute("aria-label","Page header code"),oe.append(Ae),be.append(oe);let ge=ae("div","footer-line"),Se=ae("span","status");Se.setAttribute("role","status");let Ce=ze("text-button","Reset preview");ge.append(Se,Ce);let Ee=ae("div","backup-actions"),ve=ze("text-button","Remove layout");ve.hidden=c()==="Not saved yet",Ee.append(te,we,ve);let Be=ae("div","removal");Be.hidden=!0,Be.append(ae("p","","Restore the native "+y.name+" and remove its saved layout from this page?"));let Ne=ze("secondary","Keep layout"),De=ze("secondary","Remove saved layout");Be.append(Ne,De),ue.append(se,Ee,be,Be,ge),L.append(F,ue),M.append(H,L),C.append(w,M),document.body.append(P);let pt=qr(P);function Fe(l){let{definition:u,input:k,output:T,row:_}=l,O=b[u.key];if(u.when&&(_.hidden=b[u.when[0]]!==u.when[1]),u.condition&&(_.hidden=u.when&&b[u.when[0]]!==u.when[1]||!u.condition(b)),u.type==="palette"){l.refresh?.();for(let B of k.children)B.setAttribute("aria-pressed",String(B.value===O));return}if(u.customFor&&b[u.customFor]!=="custom"){_.hidden=!0;return}if(u.type==="checkbox"){k.checked=!!O;return}if(u.type==="range"){let B=u.key==="spiralRise"&&b.spiralRiseUnit==="percent"?{...u,...u.percent}:u;k.min=String(B.min),k.max=String(B.max),k.step=String(B.step);let ee=u.inherits&&O==null;l.enable&&(l.enable.checked=!ee,k.disabled=!!ee),k.value=String(ee?b[u.inherits]:O);let ie=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(B.key)&&B.min===0&&Number(k.value)===0?"Auto":`${k.value}${B.unit||""}`;T.textContent=ee?`Inherit \xB7 ${ie}`:ie,k.setAttribute("aria-valuetext",ie);return}k.value=String(O),u.type==="color"&&(u.independent||(_.hidden=b.colorSource==="section"),T.textContent=k.value.toUpperCase())}function rt(){W(),E+=1,Se.textContent="",be.hidden||(Ae.value=n())}function He(l,u){let k=b.spiralRiseUnit,T=d.get(l)?.definition.typography;if(T&&!b[T]&&(b[T]=!0,r(T,!0)),b={...b,[l]:u},l==="spiralRiseUnit"&&k!==u){let B=Math.max(1,b.stageHeight),ee=u==="percent"?Math.max(1,Math.min(30,Math.round(b.spiralRise/B*1e3)/10)):Math.max(8,Math.min(280,Math.round(b.spiralRise*B/100)));b.spiralRise=ee,r(l,u),r("spiralRise",ee),Fe(d.get("spiralRise"))}else r(l,u);let _=l.replace(/Swatch$|Opacity$/,""),O=_==="titleColor"?"titlePalette":_==="descriptionColor"?"descriptionCustom":null;if(O){let B=O==="titlePalette"?"custom":!0;b[O]=B,r(O,B)}l==="galleryHeight"&&(Ie(),d.get(l)?.input.focus({preventScroll:!0})),l==="colorSource"?d.forEach(Fe):Fe(d.get(l));for(let B of d.values())(B.definition.inherits===l||B.definition.when?.[0]===l||B.definition.customFor===l)&&Fe(B);d.forEach(Fe),D(),rt()}function Oe(l){let{key:u,label:k,type:T}=l,_=ae(l.inherits||T==="palette"?"div":"label",`field field-${T}`);l.when&&_.setAttribute("data-subsetting","");let O=ae("span","field-label",k);if(T==="palette"){let ie=ae("div","palette-chips"),de=getComputedStyle(y.root);ie.setAttribute("role","group"),ie.setAttribute("aria-label",k);for(let xe of l.choices){let he=ze("palette-chip",xe.value==="custom"?"+":"",xe.label);he.value=xe.value,he.title=xe.label;let me=de.getPropertyValue("--"+xe.value+"-hsl").trim();me?he.style.backgroundColor="hsl("+me+")":xe.value!=="custom"&&(he.textContent=xe.label),he.addEventListener("click",()=>He(u,xe.value)),ie.append(he)}_.append(O,ie);let fe={definition:l,row:_,input:ie};return d.set(u,fe),Fe(fe),_}let B=ae(T==="select"?"select":"input");if(B.setAttribute("aria-label",k),B.dataset.option=u,T==="select")for(let ie of l.choices){let de=ae("option","",ie.label);de.value=ie.value,B.append(de)}else B.type=T;let ee;(T==="range"||T==="color")&&(ee=ae("output","value"),ee.setAttribute("aria-hidden","true")),_.append(O),ee&&_.append(ee),_.append(T==="select"?Pa(B):B);let le={definition:l,input:B,output:ee,row:_};if(l.inherits&&!l.mobileRange){let ie=ae("input");ie.type="checkbox",ie.setAttribute("aria-label","Customize "+k.toLowerCase());let de=ae("label","override-toggle");de.append(ie,O),_.prepend(de),le.enable=ie,ie.addEventListener("change",()=>He(u,ie.checked?b[l.inherits]:null))}return d.set(u,le),Fe(le),B.addEventListener(T==="range"||T==="color"?"input":"change",()=>{let ie=T==="range"||l.numeric?Number(B.value):T==="checkbox"?B.checked:B.value;He(u,ie)}),_}function Ie(){let l=new Map([...z].map(([u,k])=>[u,k.open]));h.splice(0).forEach(u=>u()),x.clear(),d.clear(),z.clear(),R.replaceChildren();for(let u of Yt(b,y.type)){let k=ae("details","group");k.open=l.get(u.title)??["Elements","Size & spacing"].includes(u.title);let T=ae("summary","",u.title),_=ae("div","group-body"),O={Image:"showImage",Title:"showTitles",Description:"showDescription","Control styling":"showControls"}[u.title];O&&x.set(k,O);let B;for(let ee of u.fields){let le=Oe(ee);if(ee.type==="palette"){let ie=ee.key.slice(0,-6),de=ae("div","paint-row"),fe=ze("paint-trigger","",ee.label.replace(/ palette$/,"")),xe=ae("span","field-label",ee.label.replace(/ palette$/,""));B=ae("div","paint-popup"),B.popover="auto",fe.popoverTargetElement=B,de.append(xe,fe,B),_.append(de),B.append(le);let he=()=>{de.hidden=le.hidden;let Mt=b[ee.key],At=getComputedStyle(y.root).getPropertyValue("--"+Mt+"-hsl");if(fe.style.setProperty("--chip",At?"hsl("+At+")":b[ie]),fe.style.setProperty("--alpha",b[ie+"Opacity"]/100),!me.matches(":popover-open"))return;let tt=fe.getBoundingClientRect(),Et=me.offsetWidth,Zt=me.offsetHeight;me.style.left=Math.max(8,Math.min(innerWidth-Et-8,tt.right-Et))+"px",me.style.top=Math.max(8,Math.min(innerHeight-Zt-8,tt.bottom+Zt+8<=innerHeight?tt.bottom+4:tt.top-Zt-4))+"px"},me=B,ht=new ResizeObserver(he),Ct=()=>{ht.disconnect(),window.removeEventListener("scroll",he,!0),window.removeEventListener("resize",he)};h.push(Ct),B.addEventListener("toggle",()=>{me.matches(":popover-open")?(ht.observe(me),window.addEventListener("scroll",he,!0),window.addEventListener("resize",he),he()):Ct()}),d.get(ee.key).refresh=he,he()}else B&&(ee.customFor||ee.key.endsWith("Opacity"))?(B.append(le),ee.customFor||(B=null)):(B=null,_.append(le))}k.append(T,_),R.append(k),z.set(u.title,k)}D()}function Ye(l){if(S)return;let u=b.preset;y=l.source??y,l.options&&(b=La(l.options)),A.textContent=Tr(y),A.title=y.selector||A.textContent,U.value=b.preset,!d.size||u!==b.preset?Ie():(d.forEach(Fe),D()),rt()}function Te(l){be.hidden=!l,te.textContent=l?"Hide code":"View code",te.setAttribute("aria-expanded",String(l)),l&&(Ae.value=n(),Ae.focus({preventScroll:!0}),Ae.select())}function et(){if(S)return;S=!0,E+=1;let l=document.activeElement===P;document.removeEventListener("keydown",Me),h.splice(0).forEach(u=>u()),pt(),P.remove(),l&&m?.isConnected&&m.focus({preventScroll:!0})}function Ue(l){if(!S)try{l()}finally{et()}}function Me(l){if(!(l.key!=="Escape"||l.defaultPrevented||l.isComposing)&&!C.querySelector(".paint-popup:popover-open")){if(!Be.hidden){l.preventDefault(),$e(!1);return}document.querySelector("dialog[open]")||l.composedPath().some(u=>u?.getAttribute?.("aria-modal")==="true")||(l.preventDefault(),!re.hidden&&(re.contains(C.activeElement)||be.hidden)?(re.hidden=!0,($.readOnly?V:Z).focus()):be.hidden?Ue(i):(Te(!1),te.focus()))}}N.addEventListener("click",()=>{v=!v,L.hidden=v,P.toggleAttribute("data-minimized",v),N.textContent=v?"+":"\u2212",N.setAttribute("aria-expanded",String(!v)),N.setAttribute("aria-label",v?"Expand settings":"Minimize settings")}),q.addEventListener("click",()=>Ue(i)),Ce.addEventListener("click",()=>Ue(a)),U.addEventListener("change",()=>o(U.value)),te.addEventListener("click",()=>Te(be.hidden));function _e(l,u){ce(),re.hidden=!1,Y.hidden=l,$.readOnly=l,$.value=u,$.placeholder=l?"":"Paste the copied gallery style",$.focus(),l&&$.select()}V.addEventListener("click",async()=>{let l=g();try{await navigator.clipboard.writeText(l),S||(re.hidden=!0,Se.textContent="Style copied")}catch{if(S)return;_e(!0,l),Se.textContent="Style selected. Choose Copy."}}),Z.addEventListener("click",()=>{Se.textContent="",_e(!1,"")}),ne.addEventListener("click",()=>{re.hidden=!0,($.readOnly?V:Z).focus()}),Y.addEventListener("click",()=>{if(!f($.value)){K.hidden=!1,$.setAttribute("aria-invalid","true"),$.setAttribute("aria-describedby",K.id),$.focus();return}re.hidden=!0,Se.textContent="Style applied to this preview",Z.focus()}),we.addEventListener("click",()=>{if(!ke)return;let l=URL.createObjectURL(new Blob([ke.header],{type:"text/plain"})),u=document.createElement("a");u.href=l,u.download="gallery-header-backup-"+ke.collectionId+".txt",u.click(),setTimeout(()=>URL.revokeObjectURL(l),1e3)});async function Re(l=!1){if(l&&$e(!1),!pe.disabled){pe.disabled=Ce.disabled=ve.disabled=!0,F.inert=!0,pe.textContent="Saving\u2026",W(l?"Removing\u2026":"Saving\u2026"),Se.textContent=l?"Removing layout\u2026":"Saving to page header\u2026";try{await s(u=>{ke=u,S||(we.hidden=!1)},l),S||(Se.textContent="Saved to page header")}catch(u){S||(Se.textContent=u.message||"Save failed. Copy code is still available.")}finally{S||(pe.disabled=Ce.disabled=ve.disabled=!1,ve.hidden=c()==="Not saved yet",F.inert=!1,pe.textContent="Save to page",W())}}}pe.addEventListener("click",()=>Re());function $e(l){Be.hidden=!l,F.inert=l,se.hidden=Ee.hidden=ge.hidden=l,l?(Te(!1),Ne.focus()):ve.focus()}return ve.addEventListener("click",()=>$e(!0)),Ne.addEventListener("click",()=>$e(!1)),De.addEventListener("click",()=>Re(!0)),ye.addEventListener("click",async()=>{let l=++E,u=n();try{await navigator.clipboard.writeText(u),!S&&l===E&&(Se.textContent="Page code copied")}catch{if(S||l!==E)return;Te(!0),Se.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Me),Ye({source:t,options:e}),U.focus({preventScroll:!0}),{element:P,update:Ye,destroy:et}}var Ir,ja=Q(()=>{wi();It();Bt();Mi();Aa();Ir=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});function Ia({activate:t,configure:e,installed:o}){let r=window.parent.document,i="gc-editor-blocks:"+location.pathname,a=new Set;try{a=new Set(JSON.parse(sessionStorage.getItem(i)||"[]"))}catch{}let s=".sqs-block-summary-v2[id],.sqs-block-gallery[id]",c="[data-fluid-engine-block][data-block-id]",n=()=>document.querySelector(".sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active"),g=r.createElement("button");g.type="button",g.style.cssText="align-self:center;background:white;color:#222;border:0;border-left:1px solid #ddd;padding:8px 10px;font:500 13px system-ui;cursor:pointer;white-space:nowrap";let f=0;function m(){let d=document.querySelectorAll(c+'[data-is-selected="true"]');return d.length===1?d[0].querySelector(s):null}function y(){f=0;for(let D of document.querySelectorAll(s))a.has(D.id)||o(D)?(D.classList.add("gc-editor-bound"),t(D)):D.classList.remove("gc-editor-bound");let d=n()&&m(),h=d&&r.querySelector('[data-test="block-toolbar"]');if(!h){g.remove();return}let x=d.classList.contains("gc-editor-bound")?"Configure carousel":"Use as carousel";g.textContent!==x&&(g.textContent=x),g.parentElement!==h&&h.append(g)}function b(){f||(f=requestAnimationFrame(y))}function v(){try{sessionStorage.setItem(i,JSON.stringify([...a]))}catch{}}g.onpointerdown=d=>d.stopPropagation(),g.onclick=d=>{d.stopPropagation();let h=m();h&&(h.classList.contains("gc-editor-bound")?e(h):(a.add(h.id),v(),y()))};let S=new MutationObserver(b);S.observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["data-is-selected"]});let E=new MutationObserver(b);return E.observe(r.body,{childList:!0,subtree:!0}),b(),{forget(d){a.delete(d.id),v(),b()},destroy(){S.disconnect(),E.disconnect(),cancelAnimationFrame(f),g.remove(),document.querySelectorAll(".gc-editor-bound").forEach(d=>d.classList.remove("gc-editor-bound"))}}}var Ta=Q(()=>{});var Ba,qa=Q(()=>{Ba=`.gc-config-position{position:relative!important}
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
`});var Oa={};Li(Oa,{startInline:()=>Pi});function at(t,e={},o){let r=Kt.get(t),i={...Ze,...t==="spiral"?Ve:mt(t,e),preset:t,colorSource:"section",typeSource:"native",...o==="summary"?{showButton:!1}:{},cardWidth:r.width,stageHeight:Qe(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,s]of Object.entries(e))a.startsWith("mobile")&&i[a]===null?Number.isFinite(s)&&s>=0&&(i[a]=s):a!=="preset"&&Object.hasOwn(i,a)&&typeof s==typeof i[a]&&(i[a]=s);return i.popupDesktopLayout!=="drawer"&&(i.popupDesktopLayout="split"),t==="spiral"&&("mobileSizing"in e||(i.mobileSizing=i.mobileGap!=null||i.mobileCardWidth!=null),"titleCustom"in e||(i.titleCustom=!!(i.titleSize||i.titlePalette==="custom"||i.titleWeight!=="inherit")),"bodyCustom"in e||(i.bodyCustom=!!(i.descriptionCustom||i.descriptionSize)),"overlayEnabled"in e||(i.overlayEnabled=i.imageTintOpacity>0),"cardBorderEnabled"in e||(i.cardBorderEnabled=i.borderWidth>0)),i}function Ha(t){return Yt(t).flatMap(e=>e.typography?[...e.fields,{key:e.typography,type:"checkbox"}]:e.fields).filter(e=>!Da.has(e.key))}function Fr(t){let e=Object.fromEntries(Ha(t).map(({key:o})=>[o,t[o]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Rr(t,e){let o;try{o=JSON.parse(t)}catch{return null}if(o?.format!=="gallery-studio-style"||o.version!==1||!Kt.has(o.preset)||!o.values||typeof o.values!="object"||Array.isArray(o.values))return null;let r=at(o.preset);for(let i of Da)r[i]=e[i];for(let i of Ha(r)){let a=o.values[i.key];if(a!==void 0){if(i.type==="range"){if(i.inherits&&a===null)continue;let s=i.percent&&o.values.spiralRiseUnit==="percent"?i.percent:i;if(!Number.isFinite(a)||a<s.min||a>s.max)return null}else{if(i.type==="checkbox"&&typeof a!="boolean")return null;if(["select","palette"].includes(i.type)&&!i.choices.some(s=>s.value===a))return null}if(i.type==="color"&&!/^#[0-9a-f]{6}$/i.test(a))return null;r[i.key]=a}}return r}function Wa(t){return t.replace(/^spiralRim/,"borderColor").replace(/^spiralRadius$/,"radius")}function Ei(t,e){let o=new Map;for(let r of Yt(t,e))if(["Elements","Image","Title","Description","Card","Control styling","Theme"].includes(r.title)){for(let i of r.fields)i.key!=="cardWidth"&&o.set(Wa(i.key),i);r.typography&&o.set(r.typography,{key:r.typography})}for(let r of["titlePalette","descriptionCustom"])o.set(r,{key:r});return o}function Ai(t,e){let o=at(e.preset,{},t.source.type);for(let[r,i]of Ei(e,t.source.type))e[i.key]!==o[i.key]&&t.shared.set(r,e[i.key])}function Fa(t,e){return at(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"},e)}function Jt(t,e){let o=at(e.preset,{},t.type),r={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};for(let a of["mobileSizing","titleCustom","bodyCustom","overlayEnabled","cardBorderEnabled"])r[a]=e[a];Qe(e.preset)&&(r.stageHeight=e.stageHeight);for(let a of Object.keys(o))e.colorSource==="section"&&Ra.has(a)||e[a]!==o[a]&&(r[a]=e[a]);t.editorBlockFit&&(r.editorBlockFit=!0);let i={v:1,selector:t.selector,type:t.type,options:r};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(i,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Pi(){let t=window.GalleryStudioInline;if(t?.editorBlocks)return t;t&&t.destroy();let e=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure],script[type="application/json"][data-gallery-editor]'),o=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!e&&!o.length)return null;let r=bi(),i=new Map(r.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map,shared:new Map}])),a=null,s=null,c=null,n=!1,g=null,f=[];function m(d,h){return d.mounted?d.mounted.instance.update({...h,previewScroll:!1}):d.mounted=Ci({selector:d.source.selector,type:d.source.type,options:h}),d.mounted&&(d.options={...h}),!!d.mounted}function y(d=!0){if(!s)return;let h=s;s=null,a?.destroy(),a=null,h.button?.setAttribute("aria-expanded","false"),d&&h.button?.focus({preventScroll:!0})}function b(d){y(),d.installed||(d.source.editorBlockFit=!1,g?.forget(d.source.root)),d.presets.clear(),d.shared.clear(),d.installed?(m(d,d.installed),Ai(d,d.installed)):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function v(d){if(s===d){y();return}y(!1);let{source:h}=d;if(d.mounted||(h.items=ut(h.root,h.type)),!h.items.length){let z="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=z,d.button.setAttribute("aria-label",z);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+h.name+" layout");let x=d.options||d.installed||at("arc-tabs",h.type!=="list"?{galleryWidth:"source"}:{},h.type);if(h.type!=="list"&&x.preset==="stack"&&(x=at("arc-tabs",{galleryWidth:"source"}),m(d,x)),!d.mounted&&!m(d,x)){d.button.textContent="No supported layout here";return}s=d;let D=z=>{m(d,z),d.presets.set(z.preset,{...z})};a=za({source:h,options:{...d.options},onClose:()=>y(),onRestore:()=>b(d),onPreset:z=>{if(!Kt.has(z)||h.type!=="list"&&z==="stack")return;d.presets.set(d.options.preset,{...d.options});let P={...d.presets.get(z)||at(z,{},h.type),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight},C=Ei(P,h.type);for(let[w,M]of d.shared){let H=C.get(w);H&&(!H.choices||H.choices.some(j=>j.value===M))&&(P[H.key]=M)}D(P),a.update({source:h,options:{...d.options}})},onOption:(z,P)=>{if(!Object.hasOwn(d.options,z)||z==="preset")return;let C={...d.options,[z]:P},w=Wa(z);Ei(d.options,h.type).has(w)&&d.shared.set(w,P),D(C)},getSaveState:()=>d.installed?Jt(h,d.options)===Jt(h,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Jt(h,d.options),onSave:async(z,P=!1)=>{if(n)throw Error("Another gallery is still saving. Please wait.");let C={...d.options},w=Ii();n=!0;try{await Ti({snippet:Jt(h,C),context:w,onBackup:z,remove:P}),P?(S.delete(h.selector),h.editorBlockFit=!1,d.installed=null,s===d?b(d):(d.presets.clear(),d.shared.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=C,g?.forget(h.root)}finally{n=!1}},getStyle:()=>Fr(d.options),applyStyle:z=>{let P=Rr(z,d.options);return!P||h.type!=="list"&&P.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),d.shared.clear(),Ai(d,P),D(P),a.update({source:h,options:d.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}let S=new Map;for(let d of o)try{let h=JSON.parse(d.textContent),x=document.querySelectorAll(h.selector),D=x.length===1&&i.get(x[0]);if(h.v!==1||!Kt.has(h.options?.preset)||((h.type==="gallery"||h.type==="summary")&&S.set(h.selector,h),!D||h.type!==D.source.type))continue;D.source.editorBlockFit=h.options.editorBlockFit===!0,D.installed=Fa(h.options,h.type),Ai(D,D.installed)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of i.values())d.installed&&m(d,d.installed);if(e){let h=function(w=!1){d.setAttribute("aria-pressed",String(w)),d.querySelector("span").textContent=w?"Edit native content":"Preview galleries",d.hidden=!ot()||![...i.values()].some(M=>M.mounted)},x=function(w){if(!w.mounted||w.source.root.isConnected)return;let M=w.source.root,H=document.querySelectorAll(w.source.selector);if(H.length!==1)return;let j=H[0];w.mounted.destroy(),w.mounted=null,w.source.root=j,i.delete(M),i.set(j,w),m(w,w.options);let p=j.querySelector(w.source.type==="list"?".user-items-list":".sqs-block-content")||j;w.button&&(getComputedStyle(p).position==="static"&&p.classList.add("gc-config-position"),p.append(w.button))},z=function(w){let{source:M}=w;if(!M.selector)return;let H=M.root.querySelector(M.type==="list"?".user-items-list":".sqs-block-content")||M.root,j=getComputedStyle(H).position==="static";j&&H.classList.add("gc-config-position");let p=document.createElement("button");p.type="button",p.className="gc-config-launch",p.setAttribute("aria-expanded","false"),p.setAttribute("aria-label","Configure "+M.name+" layout"),p.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',p.addEventListener("click",()=>v(w)),H.append(p),w.button=p,f.push(()=>{p.remove(),j&&H.classList.remove("gc-config-position")})},P=function(w){if(i.has(w))return i.get(w);let M=[...i.values()].find(A=>A.source.root.id===w.id&&!A.source.root.isConnected);if(M){let A=M.options;return M.mounted?.destroy(),M.mounted=null,i.delete(M.source.root),M.source.root=w,i.set(w,M),z(M),A&&m(M,A),M}let H=bi().find(A=>A.root===w);if(!H)return null;let j={source:H,installed:null,options:null,mounted:null,presets:new Map,shared:new Map},p=S.get(H.selector);return p&&p.type===H.type&&(j.installed=Fa(p.options,H.type)),i.set(w,j),z(j),j};c=document.createElement("style"),c.textContent=Ba,document.head.append(c);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let w=d.getAttribute("aria-pressed")!=="true";for(let M of[...i.values()])x(M),M.mounted?.instance.setEditPreview(w);h(w)},document.body.append(d),h();let D=Si(w=>{w||requestAnimationFrame(()=>{if(d.isConnected)for(let M of[...i.values()])x(M)}),h()});f.push(()=>{D(),d.remove()});for(let w of i.values())z(w);let C=new WeakSet;g=Ia({installed(w){let M=i.get(w)?.installed||S.get("#"+CSS.escape(w.id))?.options;return!!(M&&M.galleryHeight!=="custom"&&(i.get(w)?.source.editorBlockFit||S.get("#"+CSS.escape(w.id))?.options.editorBlockFit))},activate(w){let M=P(w);M&&(M.source.editorBlockFit=!0,M.button?.isConnected||z(M),M.mounted&&C.has(M.mounted)&&w.classList.contains("gc-edit-preview")&&!M.mounted.host.isConnected&&(M.mounted.destroy(),M.mounted=null),!(!M.mounted&&!m(M,M.options||M.installed||at("arc-tabs",{galleryWidth:"source"},M.source.type)))&&(ot()&&!C.has(M.mounted)?(M.mounted.instance.setEditPreview(!0),C.add(M.mounted),h(!0)):ot()||C.delete(M.mounted)))},configure(w){let M=P(w);M&&(v(M),a?.element.classList.add("gc-editor-panel"))}}),f.push(()=>g.destroy()),window.addEventListener("pagehide",()=>g.destroy(),{once:!0})}let E={version:1,editorBlocks:!0,destroy(){y(!1);for(let d of i.values())d.mounted?.destroy();for(let d of f)d();c?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=E,E}var Kt,Ra,Da,Na=Q(()=>{qi();Mi();vi();ja();Ta();qa();Bt();Kt=new Map(St.map(t=>[t.id,t])),Ra=new Set(["background","ink","accent"]);Da=new Set([...Ra,"colorSource","typeSource","clickAction","popupDesktopLayout"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Pi,{once:!0}):Pi()});var Dr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout], script[type="application/json"][data-gallery-editor]')&&(Dr=(await Promise.resolve().then(()=>(Na(),Oa))).startInline);export{Dr as startInline};

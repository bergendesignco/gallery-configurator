var po=Object.defineProperty;var J=(t,e)=>()=>(t&&(e=t(t=0)),e);var si=(t,e)=>{for(var i in e)po(t,i,{get:e[i],enumerable:!0})};function li(t,e){if(t===void 0)return null;let i=new Map([...t.matchAll(go)].map(a=>[a[1].toLowerCase(),a[2]??a[3]??a[4]??""]));if(!i.has("data-gallery-layout"))return null;if(i.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let r;try{r=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(r?.v!==1||typeof r.selector!="string"||!["list","gallery","summary"].includes(r.type)||!r.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return r}function uo(t,e,i=!1){let r=[...e.matchAll(ci)];if(r.length!==1||r[0][0]!==e.trim())throw Error("Invalid gallery settings.");let a=li(r[0][1],r[0][2]);if(!a)throw Error("Missing gallery settings.");let s=!1,n=t.replace(ci,(c,o,g)=>{let x=li(o,g);return!x||x.selector!==a.selector?c:i||s?"":(s=!0,e)});return i||s?n:n+(n&&!n.endsWith(`
`)?`
`:"")+e+`
`}function di(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,i=e?.collection?.id,r=e?.website?.id,a=t.document.cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("crumb="))?.slice(6);if(!yt.test(i||"")||!yt.test(r||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!a)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:i,websiteId:r,crumb:decodeURIComponent(a)}}async function pi({snippet:t,context:e,remove:i=!1,fetchImpl:r=fetch,onBackup:a=()=>{}}){let{collectionId:s,websiteId:n,crumb:c}=e;if(!yt.test(s||"")||!yt.test(n||"")||!c)throw Error("A signed-in Squarespace page is required.");async function o(){let y=await r("/api/commondata/GetCollectionSettings?collectionId="+s,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let C=await y.json(),p=C.collectionData??C;if(p?.id!==s||p.websiteId!==n||p.deleted===!0||p.folder===!0||p.dropdown===!0)throw Error("Page settings do not match this page.");if(p.headerInjectCode!=null&&typeof p.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:p,memberAreaData:C.memberAreaData??{}}}let g=await o();if(g.model.passwordProtected&&typeof g.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let x=g.model.headerInjectCode??"",u=uo(x,t,i);if(u===x)return{unchanged:!0};a({collectionId:s,header:x,savedAt:new Date().toISOString()});let b=await o();if(JSON.stringify(b)!==JSON.stringify(g))throw Error("Page settings changed while saving. Review the page and save again.");let w;try{w=await r("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...b.model,collectionId:s,headerInjectCode:u},memberAreaData:b.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!w.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await o()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==u.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var yt,ci,go,gi=J(()=>{yt=/^[a-f0-9]{24}$/i,ci=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,go=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function ui({range:t,swatch:e,select:i}){let r=(a,s)=>({key:a,label:s,type:"checkbox"});return[{title:"Card content",fields:[r("showImage","Show image"),r("showTitles","Show title"),r("showDescription","Show description"),r("showButton","Show item link"),t("cardPadding","Content padding",0,80,1,"px"),t("descriptionSize","Description size",0,4,.05,"rem"),r("descriptionCustom","Customize description color"),e("descriptionColor","Description color",["descriptionCustom",!0])]},{title:"Image effects",fields:[e("imageTint","Image overlay"),r("shadowEnabled","Drop shadow"),...[t("shadowAngle","Shadow angle",0,360,1,"\xB0"),t("shadowDistance","Shadow distance",0,48,1,"px"),t("shadowBlur","Shadow blur",0,40,1,"px"),t("shadowSpread","Shadow spread",0,16,1,"px"),e("shadowColor","Shadow color")].map(a=>({...a,when:["shadowEnabled",!0]})),i("hoverEffect","Hover effect",{preset:"None",zoom:"Zoom",lift:"Lift"}),t("hoverAmount","Hover amount",0,30,1,"")]},{title:"Popup",fields:[r("popupImage","Show popup image"),r("popupTitle","Show popup title"),r("popupDescription","Show popup description"),r("popupButton","Show popup link"),t("popupPadding","Popup content padding",0,80,1,"px"),t("popupRadius","Popup corners",0,64,1,"px"),r("popupCustom","Customize popup colors"),e("popupColor","Popup background",["popupCustom",!0]),e("popupInk","Popup text",["popupCustom",!0])]}]}function Nt(t,e){if(!qt.has(e.preset))return e;let i={...e},r=getComputedStyle(t),a;for(let s of xt){let n=e[s+"Swatch"],c=e[s];if(Object.hasOwn(Ft,n)){let g=r.getPropertyValue("--"+n+"-hsl").trim();g&&(a??=document.createElement("canvas").getContext("2d"),a&&(a.fillStyle=c,a.fillStyle="hsl("+g+")",c=a.fillStyle))}let o=Math.round((e[s+"Opacity"]??100)*2.55);i[s]=o===255?c:c+o.toString(16).padStart(2,"0")}return i}var qt,Ft,xt,vt,Rt=J(()=>{qt=new Set(["spiral"]),Ft={white:"Lightest",lightAccent:"Light",accent:"Accent",darkAccent:"Dark",black:"Darkest"},xt=["titleColor","descriptionColor","popupColor","popupInk","shadowColor","imageTint","controlFill","controlInk","backColor","spiralRim","background","ink","accent"],vt={showImage:!0,showDescription:!1,showButton:!1,cardPadding:0,popupImage:!0,popupTitle:!0,popupDescription:!0,popupButton:!0,popupPadding:0,popupRadius:12,popupCustom:!1,popupColor:"#ffffff",popupInk:"#202020",descriptionSize:0,descriptionCustom:!1,descriptionColor:"#202020",imageTint:"#000000",shadowEnabled:!1,shadowColor:"#000000",shadowAngle:90,shadowDistance:4,shadowBlur:8,shadowSpread:0,hoverAmount:8};for(let t of xt)vt[t+"Swatch"]="custom",vt[t+"Opacity"]=t==="imageTint"?0:t==="shadowColor"?25:100});function hi(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let i=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches("script,style,template,noscript,iframe,form,svg"))return i;let r=t.localName,a=ho.has(r)?document.createElement(r):i;if(r==="a"||r==="img"){let s=r==="img"?"src":"href",n=r==="img"?t.dataset.src||t.getAttribute("src"):t.getAttribute("href"),c=n&&URL.canParse(n,e)?new URL(n,e):null;c&&["https:","http:"].includes(c.protocol)&&a.setAttribute(s,c.href),r==="img"&&(a.alt=t.alt,a.loading="lazy")}for(let s of t.childNodes)a.append(hi(s,e));return a}async function fi(t,e){t.textContent="Loading post\u2026";try{let i=new URL(e.postUrl);if(i.origin!==location.origin)throw Error();let r=await fetch(i,{mode:"same-origin"});if(!r.ok)throw Error();let s=new DOMParser().parseFromString(await r.text(),"text/html").querySelector(".blog-item-content,article .entry-content,article .body");if(!s)throw Error();t.replaceChildren(hi(s,r.url))}catch{t.textContent="Open the full post using the link below."}}var ho,mi=J(()=>{ho=new Set("p h1 h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" "))});function Dt(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],i=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${fo[t]}${i}</svg>`}function Be(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Dt("play")+Dt("pause"):Dt(e),t}var fo,wt=J(()=>{fo={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Pe(t,e,i){let r=document.createElement(t);return r.className=e,i!==void 0&&(r.textContent=i),r}function st(t,e,i){let r=Pe("button",t,i);return r.type="button",r.setAttribute("aria-label",e),r}function bo(t,e,i,r,a,s){let n=i/2,c=r/2,o=.26,g=e/2+48,x=(i*Math.cos(o)+s)/(2*Math.sin(o)),u=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-a)*.7),i*(3.8-a*2.1),c+Math.max(x,g/Math.sin(Math.PI/3))),b=u-c,w=Math.atan2(n,b),d=Math.hypot(n,b),y=2*(w+Math.asin(s/(2*d))),C=w+Math.asin(g/d),p=u+c,f=Math.hypot(p,n)-p,M=b-Math.sqrt((b-g)*(b+g));return{radius:u,step:y,reach:C/y,above:f,below:M}}function yo(t,e,i){let r=e/2,a=10+i*9,s=0,n=0;for(let c=0;c<4.1;c+=.5){let o=Math.min(4.1,c+.5),g=Math.max(.48,1-c*(.09+i*.035)),x=(o*(4+i*7)+(c===0?4:0))*Math.PI/180,u=g*(r+t/2*Math.sin(x))-r;s=Math.max(s,u-Math.min(c,4)*a),n=Math.max(n,u+Math.min(o,4)*a)}return{above:s,below:n}}function bi({host:t,items:e=[],initialIndex:i=0,options:r={},makeCard:a,onChange:s,nativeList:n,loadImage:c}){let o=mo.has(r.preset)?r.preset:"infinite",g=o==="arc"||o==="arc-tabs",x=g||o==="showcase",u=e.length,b=!!r.reducedMotion,w=Re(ot(r.depth,55),0,100)/100,d,y,C;function p(l){d=Re(ot(l.gap,24),0,180),y=Re(ot(l.cardWidth,o==="timed"?760:380),80,1800),C=l.phoneWidthOverride}p(r);let f=Re(ot(r.duration,5),1,60)*1e3,M=Pe("section",`gc-carousel gc-preset-${o}`);M.setAttribute("aria-roledescription","carousel"),M.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[o]),M.style.setProperty("--gc-card-radius",`${Re(ot(r.radius,14),0,120)}px`),M.style.setProperty("--gc-stage-height",`${Re(ot(r.stageHeight,0),0,1400)}px`),b&&M.classList.add("gc-reduced-motion");let H=[],I=(l,h,v,E)=>{l.addEventListener(h,v,E),H.push(()=>l.removeEventListener(h,v,E))},m=[],A=[],j=r.navigation==="dots"||r.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),$=o==="arc-tabs"||o==="timed"&&!j,N=Pe("nav","gc-carousel-tabs");j&&N.classList.add("gc-choice-dots"),N.setAttribute("aria-label","Choose a slide"),$&&(e.forEach((l,h)=>{let E=(typeof l.title=="string"?l.title.trim():"")||`Slide ${h+1}`,D=j?st("gc-choice-dot",E):st("gc-carousel-tab",E,E);I(D,"click",()=>Ne(h)),I(D,"keydown",q=>{let F;q.key==="ArrowRight"&&(F=at(h+1,u)),q.key==="ArrowLeft"&&(F=at(h-1,u)),q.key==="Home"&&(F=0),q.key==="End"&&(F=u-1),F!==void 0&&(q.preventDefault(),Ne(F),m[F]?.focus({preventScroll:!0}))}),N.append(D),m.push(D)}),M.append(N));let P=Pe("div","gc-carousel-stage");P.tabIndex=u?0:-1,P.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let S=n?.track??Pe("div","gc-carousel-track");S.classList.add("gc-carousel-track"),P.append(S),M.append(P);function k(l){let h=a(e[l],l,{caption:r.showTitles!==!1,description:o==="arc-tabs"||o==="timed"});h.classList.add("gc-carousel-card"),h.dataset.gcItemIndex=String(l),h.style.width="var(--gc-carousel-slot-width)",h.tabIndex=-1,h.setAttribute("aria-hidden","true"),n||h.querySelectorAll("img").forEach(E=>{E.draggable=!1,E.style.objectFit=r.fit==="contain"?"contain":"cover"});let v=n?.slot(h)??h;return S.append(v),{card:h,node:v,index:l,logical:l,active:!1}}let R=e.map((l,h)=>k(h)),z=new Map,Y=!1,ae=Pe("div","gc-carousel-controls"),le=Pe("div","gc-carousel-counter");le.setAttribute("aria-hidden","true");let he=Pe("span","gc-carousel-current",u?"01":"00");le.append(he,Pe("span","gc-carousel-divider","/"),Pe("span","gc-carousel-total",String(u).padStart(2,"0")));let ze=Pe("div","gc-carousel-arrows"),B=Be(st("gc-carousel-arrow","Previous slide"),"previous"),W=Be(st("gc-carousel-arrow","Next slide"),"next");B.disabled=W.disabled=u<2,ze.append(B,W);let U=Be(st("gc-carousel-playback","Play slideshow"),"playback");U.hidden=u<2||b;let K=Pe("div","gc-carousel-pagination");K.setAttribute("aria-label","Slide pagination"),o==="timed"&&e.forEach((l,h)=>{let v=st("gc-carousel-dot",l.title?.trim()||`Go to slide ${h+1}`),E=Pe("span","gc-carousel-dot-fill");E.setAttribute("aria-hidden","true"),v.append(E),I(v,"click",()=>Ne(h)),K.append(v),A.push({dot:v,fill:E})}),ae.append(le,ze),o==="timed"&&ae.append(K),ae.append(U),M.append(ae);let _=Pe("p","gc-carousel-sr");_.setAttribute("aria-atomic","true"),M.append(_);let ee=Pe("span","gc-carousel-cursor","Drag");ee.setAttribute("aria-hidden","true"),(o==="arc-tabs"||o==="showcase"||o==="arc")&&P.append(ee),t.append(M);let de=!1,O=i,Q=i,me=-1,pe=0,te=0,ie=0,V=!!r.autoplay&&!b&&u>1,fe=!1,ue=!1,ve=!1,Te=!1,X=null,qe=0,G=0,We=0,se=0,Ie=()=>Math.max(12,se*(.36-w*.12)+d-28),be=-1,we,Ce=1,He=0,Me=0,Fe=()=>Te||fe||ue||ve||document.hidden||!!X,Ve=l=>{let h=at(Math.round(O),u),v=at(l-h,u);return v>u/2&&(v-=u),Math.round(O)+v};function tt(){let l=m[me];if(!l)return;let h=l.offsetLeft,v=h+l.offsetWidth;h<N.scrollLeft?N.scrollLeft=Math.max(0,h-14):v>N.scrollLeft+N.clientWidth&&(N.scrollLeft=v-N.clientWidth+14)}function it(){let l=u?at(Math.round(O),u):-1;if(l===me)return;me=l,he.textContent=u?String(l+1).padStart(2,"0"):"00",m.forEach((v,E)=>{v.classList.toggle("is-active",E===l),v.setAttribute("aria-pressed",String(E===l))}),tt(),A.forEach(({dot:v},E)=>{v.classList.toggle("is-active",E===l),E===l?v.setAttribute("aria-current","true"):v.removeAttribute("aria-current")});let h=e[l]?.title;_.textContent=u?`${l+1} of ${u}${h?`: ${h}`:""}`:"No gallery items",l>=0&&s?.(l)}function De(){if(de||!G)return;it();let l=Math.abs(Q-O)>.002;M.classList.toggle("is-moving",l||!!X);let h=[...R];for(let v of R)v.logical=v.index+Math.round((O-v.index)/u)*u;if(u>1){let v=se+d,E=o==="infinite"&&G>660?G*.61:G/2,D=(E+se/2+40)/v,q=(G-E+se/2+40)/v;g?D=q=we.reach:o==="showcase"&&(D=q=Math.min(4.1,(G/2+se)/Ie()));let F=Math.ceil(O-D),re=Math.floor(O+q);for(let[ce,ne]of z)(ce<F||ce>re||R[ne.index].logical===ce)&&(ne.node.remove(),z.delete(ce));for(let ce=F;ce<=re;ce++){let ne=at(ce,u);if(R[ne].logical===ce)continue;let ge=z.get(ce);ge||(ge=k(ne),ge.logical=ce,z.set(ce,ge),Y&&c&&ge.card.querySelectorAll("img").forEach(xe=>c(xe,{nativeCard:!!n}))),h.push(ge)}}h.forEach(v=>{let E=u===1?0:v.logical-O,D=Math.abs(E),q=v.logical===Math.round(O),F=G/2,re=0,ce=0,ne=1,ge=1,xe=!0,Ue=0,$e=0;if(o==="infinite")F=(G>660?G*.61:G/2)+E*(se+d),ge=1-Math.min(1,D)*.68,xe=F+se/2>-40&&F-se/2<G+40;else if(o==="timed")F+=E*(se+d),ne=1-Math.min(D,1)*.035,xe=F+se/2>-40&&F-se/2<G+40;else if(o==="showcase")F+=E*Ie(),re+=Math.min(D,4)*(10+w*9),ne=Math.max(.48,1-D*(.09+w*.035)),ce=E*(4+w*7),$e=-E*(3+w*4),ge=Re(1-D*.19,0,1),xe=D<4.1,q&&!b&&(Ue=Me,$e+=He,ce+=Re(Q-O,-1,1)*-3);else{let Ke=E*we.step;F+=we.radius*Math.sin(Ke),re=we.radius*(1-Math.cos(Ke)),ce=Ke*180/Math.PI,xe=D<=we.reach,ge=o==="arc-tabs"?1-Math.min(D,1)*.16:1}v.card.style.transform=`translate3d(${F}px,${re}px,0) translateX(-50%) rotate(${ce}deg) rotateX(${Ue}deg) rotateY(${$e}deg) scale(${ne})`,v.card.style.zIndex=String(1e3-Math.round(D*100)),v.card.style.opacity=String(ge),v.card.style.visibility=xe?"visible":"hidden",v.card.style.pointerEvents=xe&&ge>.08?"auto":"none",v.active!==q&&(v.active=q,v.card.classList.toggle("is-active",q)),v.card.tabIndex=q?0:-1,v.card.setAttribute("aria-hidden",String(!q)),n?.syncFocus(v.card)}),A.forEach(({fill:v},E)=>{v.style.transform=`scaleX(${E===me?Re(ie/f,0,1):0})`})}function Ae(){let l=G;G=P.clientWidth;let h=C?1:o==="timed"?.86:o==="infinite"&&G>660?.48:.76,v=Math.max(80,Math.min(y,G*h));if(v!==se&&(se=v,S.style.setProperty("--gc-carousel-slot-width",`${se}px`)),x){let E=S.offsetHeight;if(G!==l||E!==be){be=E,g&&(we=bo(o,G,se,be,w,d));let D=we??yo(se,be,w);u>1&&(P.style.setProperty("--gc-sweep-above",Math.ceil(D.above)+"px"),P.style.setProperty("--gc-sweep-below",Math.ceil(D.below)+"px"))}}We=P.clientHeight,Ce=g?we.radius*we.step:o==="showcase"?se*.54:se+d,De()}function Ee(){!de&&!pe&&(pe=requestAnimationFrame(Oe))}function Oe(l){if(pe=0,de)return;let h=te?Re(l-te,0,64):0;te=l,X||(b?O=Q:O+=(Q-O)*(1-Math.exp(-h/85)),Math.abs(Q-O)<5e-4&&(O=Q));let v=Math.abs(Q-O)<.002&&!X;V&&!Fe()&&v&&(ie+=h,ie>=f&&(ie=0,Q=Math.round(O)+1)),De(),Math.abs(Q-O)>5e-4||V&&!Fe()?Ee():te=0}function Ne(l){de||u<2||(Q=Ve(at(Math.round(ot(l,0)),u)),ie=0,b&&(O=Q),De(),Ee())}function Je(l){u<2||(Q=Math.round(Q)+l,ie=0,b&&(O=Q),De(),Ee())}function Ge(l){V=!!l&&!b&&u>1,U.dataset.paused=String(!V),U.setAttribute("aria-label",V?"Pause slideshow":"Play slideshow"),U.setAttribute("aria-pressed",String(V)),_.setAttribute("aria-live",V?"off":"polite"),M.classList.toggle("is-playing",V),te=0,Ee()}function ye(l){Te=!!l,te=0,Ee()}I(B,"click",()=>Je(-1)),I(W,"click",()=>Je(1)),I(U,"click",()=>Ge(!V)),I(P,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),P.focus({preventScroll:!0}),Je(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),P.focus({preventScroll:!0}),Ne(l.key==="Home"?0:u-1))}),I(P,"pointerdown",l=>{u<2||l.button!==0||!l.isPrimary||(X={id:l.pointerId,x:l.clientX,y:l.clientY,start:O,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},Q=O,ie=0)}),I(P,"pointermove",l=>{let h=P.getBoundingClientRect(),v=h.width/Math.max(1,P.clientWidth)||1,E=(l.clientX-h.left)/v,D=(l.clientY-h.top)/v;if(ee.style.left=`${E}px`,ee.style.top=`${D}px`,l.pointerType==="mouse"&&P.classList.add("has-pointer"),!X){o==="showcase"&&!b&&(He=Re((E-G/2)/se,-1,1)*4,Me=Re((D-We/2)/We,-.5,.5)*-5,De());return}if(l.pointerId!==X.id)return;let q=l.clientX-X.x,F=l.clientY-X.y;if(!X.axis&&Math.hypot(q,F)>6&&(X.axis=Math.abs(q)>Math.abs(F)?"horizontal":"vertical",X.axis==="horizontal"&&(P.setPointerCapture(l.pointerId),P.classList.add("is-dragging"))),X.axis!=="horizontal")return;l.preventDefault(),X.moved=!0;let re=performance.now(),ce=Math.max(8,re-X.lastTime),ne=-(l.clientX-X.lastX)/v/Ce/ce;X.velocity=X.velocity*.45+ne*.55,X.lastX=l.clientX,X.lastTime=re,O=X.start-q/v/Ce,Q=O,De()},{passive:!1});function L(l){if(!X||l.pointerId!==X.id)return;let h=X;if(X=null,P.hasPointerCapture(l.pointerId)&&P.releasePointerCapture(l.pointerId),P.classList.remove("is-dragging"),h.moved){qe=performance.now()+400;let v=performance.now()-h.lastTime,E=b||l.type==="pointercancel"||v>120?0:Re(h.velocity*210,-4,4);Q=Math.round(O+E)}else Q=Math.round(O);b&&(O=Q),Ee()}I(P,"pointerup",L),I(P,"pointercancel",L),I(window,"pointerup",L),I(P,"lostpointercapture",l=>{X?.id===l.pointerId&&L(l)}),I(P,"dragstart",l=>l.preventDefault()),I(P,"click",l=>{if(performance.now()<qe){l.preventDefault(),l.stopImmediatePropagation();return}let h=l.target.closest(".gc-carousel-card");!h||!P.contains(h)||h.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Ne(Number(h.dataset.gcItemIndex)))},!0),I(P,"pointerleave",()=>{P.classList.remove("has-pointer"),He=Me=0,X||De()}),I(M,"pointerenter",l=>{l.pointerType==="mouse"&&(fe=!0)}),I(M,"pointerleave",()=>{fe=!1,te=0,Ee()}),I(M,"focusin",()=>{ue=!0}),I(M,"focusout",()=>{queueMicrotask(()=>{de||(ue=M.contains(document.activeElement),te=0,Ee())})}),I(document,"visibilitychange",()=>{te=0,Ee()});let T;typeof ResizeObserver<"u"?(T=new ResizeObserver(l=>{l.some(({target:h})=>h===P||h===S)&&Ae(),$&&l.some(({target:h})=>h!==P&&h!==S)&&tt()}),T.observe(P),x&&T.observe(S),$&&(T.observe(N),m.forEach(l=>T.observe(l,{box:"border-box"})))):I(window,"resize",()=>{Ae(),tt()});let oe;return typeof IntersectionObserver<"u"&&(oe=new IntersectionObserver(l=>{ve=!l[0]?.isIntersecting,te=0,Ee()}),oe.observe(M)),Ae(),Y=!0,Ge(V),{goTo:Ne,setGeometry(l){p(l),be=-1,Ae()},setPlaying:Ge,setSuspended:ye,destroy(){de=!0,cancelAnimationFrame(pe),T?.disconnect(),oe?.disconnect(),H.forEach(l=>l()),M.remove()}}}var mo,Re,at,ot,yi=J(()=>{wt();mo=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Re=(t,e,i)=>Math.min(i,Math.max(e,t)),at=(t,e)=>(t%e+e)%e,ot=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function vi(t){let{host:e,makeCard:i,nativeList:r}=t,a=Array.isArray(t.items)?t.items:[],s=t.options||{},n=["wall","ring","angled"].includes(s.preset)?s.preset:"wall",c=!!s.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=a.length,g=n==="ring"?16:n==="wall"?12:o,x=!c&&o>1&&o<12&&n!=="angled"?Math.ceil(g/o)*o:o,u=Array.from({length:o},(l,h)=>h),b=_e(Ze(s.depth,55),0,100),w=_e(Ze(s.cardWidth,280),80,900),d=_e(Ze(s.gap,24),0,160),y=Math.max(1,Ze(s.duration,5)),C=new AbortController,p=(l,h,v,E={})=>l.addEventListener(h,v,{...E,signal:C.signal}),f={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},M=`gc-spatial-help-${++vo}`,H=["gc-spatial",`gc-${n}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...H);let I=new Map,m=(l,h)=>{I.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,h)};m("--gc-spatial-height",`${_e(Ze(s.stageHeight,620),300,1400)}px`),m("--gc-spatial-radius",`${_e(Ze(s.radius,18),0,100)}px`),m("--gc-spatial-fit",s.fit==="contain"?"contain":"cover"),m("--gc-spatial-card-width",`${w}px`),m("--gc-spatial-gap",`${d}px`);let A=r?.track??document.createElement("div");A.classList.add("gc-spatial-canvas"),r&&A.classList.add("gc-spatial-native-track"),A.setAttribute("role",r?"list":"group"),A.setAttribute("aria-label",f[n]),A.setAttribute("aria-describedby",M);let j=document.createElement("p");j.id=M,j.className="gc-spatial-sr",j.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let $=document.createElement("span");$.className="gc-spatial-sr",$.setAttribute("aria-live","polite"),$.setAttribute("aria-atomic","true"),e.append(j,A,$);let N=s.showTitles!==!1&&(n!=="ring"||c||o===1),P=Array.from({length:x},(l,h)=>{let v=h%o,E=a[v],D=i(E,v,{caption:N,description:!1,thumbnail:!0}),q=r?.slot(D)??document.createElement("div");return q.classList.add("gc-spatial-position"),D.classList.add("gc-spatial-card"),D.dataset.spatialIndex=String(h),D.dataset.spatialSourceIndex=String(v),D.tabIndex=h===0?0:-1,h>=o&&D.setAttribute("aria-hidden","true"),!D.getAttribute("aria-label")&&!D.textContent.trim()&&D.setAttribute("aria-label",`View item ${v+1}`),q.contains(D)||q.append(D),q.parentNode!==A&&A.append(q),{position:q,card:D,sourceIndex:v,x:0,y:0,flip:0,tilt:0,lift:0}}),S=document.createElement("div");S.className="gc-spatial-nav";let k=(l,h)=>{let v=document.createElement("button");return v.type="button",v.className="gc-spatial-control",v.setAttribute("aria-label",h),Be(v,l)},R=k("previous","Previous item"),z=k("next","Next item"),Y=document.createElement("span");Y.className="gc-spatial-count",Y.setAttribute("aria-hidden","true"),S.append(R,Y,z);let ae=s.autoplay&&!c?k("playback","Pause gallery motion"):null;ae&&(ae.disabled=o<2,ae.dataset.paused=String(o<2),ae.disabled&&ae.setAttribute("aria-label","Play gallery motion"),S.append(ae)),e.append(S),R.disabled=z.disabled=o<2;let le,he;if(n==="ring"&&o>1&&!c){le=document.createElement("div"),le.className="gc-ring-center",le.setAttribute("aria-hidden","true"),s.showTitles!==!1&&(he=document.createElement("span"),he.className="gc-ring-label",le.append(he));let l=document.createElement("span");l.textContent="Drag to explore",le.append(l),A.after(le)}let ze;o||(ze=document.createElement(r?"li":"p"),ze.className="gc-spatial-empty",ze.textContent="No items available.",A.append(ze));let B=!1,W=0,U=-1,K=1,_=1,ee=1,de=1,O=1,Q=1,me=0,pe=1,te=1,ie=0,V=0,fe=1,ue=!!s.autoplay&&!c&&o>1,ve=!1,Te=!1,X=!1,qe=!0,G=null,We=0,se=0,Ie=0,be=-1,we=!1,Ce={x:-1e4,y:-1e4,inside:!1};function He(l=W){if(!he)return;let h=typeof a[l]?.title=="string"?a[l].title.trim():"";he.textContent===h&&he.hidden===!h||(he.textContent=h,he.hidden=!h,Me())}function Me(){!le||B||(le.classList.remove("is-below"),le.offsetHeight>me&&le.classList.add("is-below"))}function Fe(l,h=!1,v=null){if(!o){Y.textContent="00 / 00";return}let E=rt(l,o),D=v!==null&&P[v]?.sourceIndex===E,q=D&&u[E]!==v;if(D){let F=P[u[E]].card;u[E]=v,q&&(P[v].card.removeAttribute("aria-hidden"),r?.syncFocus(P[v].card),document.activeElement===F&&(we=!0,P[v].card.focus({preventScroll:!0}),we=!1))}if(U===E&&!q){h&&($.textContent=`Item ${E+1} of ${o}${a[E].title?`: ${a[E].title}`:""}`);return}W=E,He(),Y.textContent=`${String(W+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`,P.forEach(({card:F,sourceIndex:re},ce)=>{let ne=u[re]===ce;F.tabIndex=ne&&re===W?0:-1,F.classList.toggle("is-selected",ne&&re===W),ne?F.removeAttribute("aria-hidden"):F.setAttribute("aria-hidden","true"),r?.syncFocus(F)}),h&&($.textContent=`Item ${W+1} of ${o}${a[W].title?`: ${a[W].title}`:""}`),U!==W&&(U=W,t.onChange?.(W))}function Ve(l){ue=!!l&&!c&&o>1,ae&&(ae.dataset.paused=String(!ue),ae.setAttribute("aria-label",ue?"Pause gallery motion":"Play gallery motion")),ye()}function tt(l){ve=!!l,ve||ye()}function it(l,h,v){return h+Math.round((l-h)/v)*v}function De(l){let h={index:u[l],target:l,distance:1/0};return P.forEach((v,E)=>{if(v.sourceIndex!==l)return;let D=E;if(n==="ring")D=it(ie,E,x);else if(n==="wall"){let F=Math.floor(E/pe);D=te>2?it(ie,F,te):F}let q=Math.abs(D-ie);q<h.distance&&(h={index:E,target:D,distance:q})}),h}function Ae(l){let h=l.getBoundingClientRect();return h.left+h.width/2}function Ee(){if(o<2)return;let l=Ae(P[0].position),h=Ae(P[1].position)-l;if(Math.abs(h)<1)return;let v=_e(Math.round((Ae(A)-l)/h),0,o-1);Fe(v,!1,v)}function Oe(l,h=!1){if(!o)return;let v=rt(Math.round(Ze(l,0)),o),E=c?{index:v,target:v}:De(v);if(Fe(v,!0,E.index),c){let D=P[v].position;A.scrollTo({left:A.scrollLeft+Ae(D)-Ae(A),behavior:"auto"})}else V=E.target;h&&P[E.index].card.focus({preventScroll:!0}),ye()}function Ne(){if(!B){if(K=Math.max(1,A.clientWidth),_=Math.max(1,A.clientHeight),n==="ring"){let l=Math.max(80,Math.min(K-32,_-42)),h=_e(Ze(s.ringDiameter,l),80,l);Q=Math.max(0,h*.38);let v=$t*Q/Math.max(1,x),E=Math.min(h*.17,v*.8),D=1.15-_e(d,0,100)/160;if(ee=o<=1?Math.min(w,K*.65,_*.58):Math.max(18,Math.min(Math.min(w*.22,E)*D,v*.94)),de=ee*1.28,le){let q=Math.max(0,Q-Math.max(32,de)/2-10);me=Math.floor(q*Math.SQRT2),le.style.setProperty("--gc-ring-label-width",`${me}px`),le.style.setProperty("--gc-ring-label-y",`${A.offsetTop+_/2}px`),Me()}O=Math.max(24,$t*Math.max(1,Q)/Math.max(1,x))}else n==="wall"?(pe=x>=10?3:x>=4?2:1,te=Math.max(1,Math.ceil(x/pe)),de=Math.min((_-56-(pe-1)*d)/pe,w*.62,230),ee=Math.max(60,Math.min(de*1.5,w,K*.43)),de=ee/1.5,O=ee+Math.min(d,70)):(ee=Math.min(w,K*.68,(_-70)*.76),de=ee/.76,O=ee*(.72+(100-b)*.001)+d);P.forEach(({position:l})=>{l.style.width=`${Math.max(24,ee)}px`,l.style.height=`${Math.max(32,de)}px`}),c&&P.forEach(({position:l})=>{l.style.width=`${Math.min(w,K*.72)}px`,l.style.height=`${Math.min(_-40,w*1.15)}px`}),ye()}}function Je(l){if(c||!o||ve)return!1;let h=ue&&!Te&&!X&&!G&&qe&&!document.hidden;if(h){let q=l/y;n==="angled"?(V+=q*fe,V>=o-1&&(V=o-1,fe=-1),V<=0&&(V=0,fe=1)):V+=q}let v=G?.moved?1:1-Math.exp(-l*11);ie+=(V-ie)*v,Math.abs(V-ie)<1e-4&&(ie=V);let E=Math.abs(V-ie)>1e-4||h;if(h||G?.moved){let q=G?.moved?ie:V,F=n==="wall"?Math.round(q)*pe+u[W]%pe:Math.round(q),re=n==="wall"?Math.min(rt(F,te*pe),x-1):rt(F,x);Fe(P[re].sourceIndex,!1,re)}let D=1-Math.exp(-l*13);return P.forEach((q,F)=>{let{position:re,card:ce}=q;if(n==="ring"){let ne=-Math.PI/2+(F-ie)*$t/x;q.x=o===1?0:Math.cos(ne)*Q,q.y=o===1?0:Math.sin(ne)*Q;let ge=Math.hypot(Ce.x-(K/2+q.x),Ce.y-(_/2+q.y)),xe=Math.max(65,ee*2.6),Ue=Ce.inside&&!G?.moved?Math.max(0,1-ge/xe):0,$e=Ue*Ue*(50+b*1.3);q.flip+=($e-q.flip)*D,Math.abs(q.flip-$e)>.05&&(E=!0),ce.toggleAttribute("data-gc-back-facing",q.flip>90);let Ke=o===1?0:ne*180/Math.PI+90;re.style.transform=`translate3d(${q.x}px,${q.y}px,0) rotate(${Ke}deg)`,ce.style.transform=`perspective(700px) rotateY(${q.flip}deg) translateZ(${Ue*12}px)`,re.style.zIndex=String(F===be?x+2:1)}else if(n==="wall"){let ne=F%pe,xe=Math.floor(F/pe)-ie;if(te>2){let lo=te%2===0?.5:0;xe=rt(xe-lo+te/2,te)-te/2}let Ue=Math.min(.68,2.6/Math.max(3,te)),$e=xe*Ue,Ke=Math.max(O/Ue,K*.4),ri=b/100,so=Math.sin($e)*Ke,ni=(1-Math.cos($e))*Ke*ri*.65,co=(ne-(pe-1)/2)*(de+Math.min(d,50)),Tt=F===be||X&&F===u[W]?1:0;q.lift+=(Tt-q.lift)*D,Math.abs(Tt-q.lift)>.002&&(E=!0),re.style.transform=`translate3d(${so}px,${co}px,${ni+q.lift*20}px) rotateY(${-$e*180/Math.PI*ri}deg)`,re.style.zIndex=String(Math.round(ni)+(Tt?1e3:1)),ce.style.transform=`scale(${1+q.lift*.035})`,re.style.opacity=Math.abs($e)>1.6?"0":"1",re.style.visibility=Math.abs($e)>1.6?"hidden":"visible"}else{let ne=F-ie,ge=F===be||X&&F===u[W]?1:0;q.lift+=(ge-q.lift)*D,Math.abs(ge-q.lift)>.002&&(E=!0);let xe=-(25+b*.28)*(1-q.lift);re.style.transform=`translate3d(${ne*O}px,${-q.lift*14}px,${q.lift*110}px) rotateY(${xe}deg)`,re.style.zIndex=String(ge?o+2:o-F),ce.style.transform="none"}}),E}function Ge(l){if(se=0,B)return;let h=Math.min(.05,Math.max(.001,(l-(Ie||l-16.7))/1e3));Ie=l,Je(h)&&qe&&!document.hidden?se=requestAnimationFrame(Ge):Ie=0}function ye(){!B&&!se&&!c&&(se=requestAnimationFrame(Ge))}c&&p(A,"scroll",Ee,{passive:!0}),p(R,"click",()=>Oe(W-1)),p(z,"click",()=>Oe(W+1)),ae&&p(ae,"click",()=>Ve(!ue)),p(A,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let h=l.key==="Home"?0:l.key==="End"?o-1:W+(l.key==="ArrowRight"?1:-1);Oe(h,!0)}),p(A,"focusin",l=>{X=!0;let h=l.target.closest?.("[data-spatial-index]");h&&!we&&Fe(Number(h.dataset.spatialSourceIndex),!1,Number(h.dataset.spatialIndex)),ye()}),p(A,"focusout",()=>{queueMicrotask(()=>{B||(X=A.contains(document.activeElement),ye())})}),p(A,"pointerenter",l=>{l.pointerType!=="touch"&&(Te=!0,Ce.inside=!0,ye())}),p(A,"pointerleave",()=>{Te=!1,Ce.inside=!1,be=-1,He(),ye()}),p(A,"pointermove",l=>{if(l.pointerType==="touch")return;let h=A.getBoundingClientRect();Ce.x=l.clientX-h.left,Ce.y=l.clientY-h.top,Ce.inside=!0;let v=l.target.closest?.("[data-spatial-index]");be=v?Number(v.dataset.spatialIndex):-1,He(be>=0?P[be].sourceIndex:W),ye()}),p(A,"pointerdown",l=>{let h=l.target.closest?.("[data-spatial-index]");h&&Fe(Number(h.dataset.spatialSourceIndex),!1,Number(h.dataset.spatialIndex)),!(c||o<2||l.pointerType==="mouse"&&l.button!==0)&&(G={id:l.pointerId,x:l.clientX,y:l.clientY,start:V,moved:!1})}),p(window,"pointermove",l=>{if(!G||l.pointerId!==G.id)return;let h=l.clientX-G.x,v=l.clientY-G.y;if(!G.moved){if(Math.abs(v)>12&&Math.abs(v)>Math.abs(h)*1.2){G=null;return}if(Math.abs(h)<7)return;G.moved=!0,A.classList.add("is-dragging"),A.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),V=G.start-h/O,(n==="angled"||n==="wall"&&te<=2)&&(V=_e(V,0,n==="wall"?te-1:o-1)),ye()},{passive:!1});let L=l=>{if(!G||l.pointerId!==G.id)return;let h=G.moved;if(G=null,A.classList.remove("is-dragging"),A.hasPointerCapture?.(l.pointerId)&&A.releasePointerCapture(l.pointerId),h){We=performance.now()+350,V=Math.round(V);let v=n==="wall"?Math.round(V)*pe+u[W]%pe:Math.round(V),E=n==="wall"?Math.min(rt(v,te*pe),x-1):rt(v,x);Fe(P[E].sourceIndex,!0,E)}ye()};p(window,"pointerup",L),p(window,"pointercancel",L),p(A,"click",l=>{performance.now()<We&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),p(A,"dragstart",l=>l.preventDefault()),p(document,"visibilitychange",ye);let T=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(h=>h.target===A)?Ne():Me()}):null;T?.observe(A),le&&T?.observe(le),T||p(window,"resize",Ne);let oe=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{qe=l[0]?.isIntersecting??!0,qe&&ye()},{rootMargin:"100px"}):null;return oe?.observe(e),Ne(),Fe(0),{goTo:Oe,setPlaying:Ve,setSuspended:tt,destroy(){B||(B=!0,cancelAnimationFrame(se),T?.disconnect(),oe?.disconnect(),C.abort(),j.remove(),$.remove(),S.remove(),le?.remove(),r?ze?.remove():A.remove(),e.classList.remove(...H),I.forEach((l,h)=>l?e.style.setProperty(h,l):e.style.removeProperty(h)))}}}var vo,_e,rt,Ze,$t,xi=J(()=>{wt();vo=0,_e=(t,e,i)=>Math.max(e,Math.min(i,t)),rt=(t,e)=>(t%e+e)%e,Ze=(t,e)=>Number.isFinite(Number(t))?Number(t):e,$t=Math.PI*2});function wi({host:t,items:e,options:i,makeCard:r,onChange:a,nativeList:s}){let n=Number(i.stageHeight)||680,c=Math.max(300,n-120),o=Math.max(0,Number(i.gap)||0),g=Number.isFinite(Number(i.depth))?Number(i.depth):45,x=i.previewScroll===!1,u=x?window:t;t.classList.add("gc-stack"),t.style.height=x?"auto":n+"px",t.style.overflowY=x?"visible":"auto",t.style.overscrollBehavior=x?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let b=s?.track??document.createElement("div");b.classList.add("gc-stack-track"),t.append(b);let w=e.map((H,I)=>{let m=r(H,I,{caption:i.showTitles,description:!0}),A=s?.slot(m)??document.createElement("div");A.classList.add("gc-stack-slot"),m.parentElement!==A&&A.append(m),b.append(A),A.style.zIndex=I+1,m.style.width=`min(${i.stackCardWidth}px,calc(100% - 48px))`,m.style.minHeight=c+"px";let j=m.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),$=!Array.from(j).some(N=>!N.closest("[hidden]")&&N.textContent.trim());return m.classList.toggle("gc-stack-image-only",$),{card:m,wrap:A,imageOnly:$,start:0,duration:1/0}}),d=0;function y(){return x?-b.getBoundingClientRect().top:t.scrollTop}function C(){d=0;let H=y(),I=0;w.forEach(({card:m,start:A,duration:j},$)=>{let N=Math.max(0,Math.min(1,(H-A)/j));m.style.transform=i.reducedMotion?"none":`perspective(1300px) translateY(${N*-32}px) scale(${1-N*.14}) rotateX(${N*g*.25}deg)`,m.style.filter=`brightness(${1-N*.23})`,N>=.5&&(I=Math.min($+1,w.length-1))}),w.length&&a?.(I)}function p(){d||(d=requestAnimationFrame(C))}function f(){let H=w.map(({card:A,wrap:j})=>({height:A.offsetHeight,rowHeight:j.offsetHeight})),I=x?window.innerHeight:t.clientHeight,m=b.clientTop+(parseFloat(getComputedStyle(b).paddingTop)||0);w.forEach((A,j)=>{let{height:$,rowHeight:N}=H[j],P=Math.min(40,I-24-$);A.wrap.style.top=P+"px",A.start=m-P,j&&(w[j-1].duration=Math.max(1,A.start-w[j-1].start));let S=A.imageOnly&&$<=I-64?$*.24:0,k=j<w.length-1?o-S:0;A.wrap.style.marginBottom=k+"px",m+=N+k,j===w.length-1&&(A.duration=1/0,b.style.paddingBottom=Math.max(40,I-P-N)+"px")}),p()}let M;return f(),typeof ResizeObserver<"u"&&(M=new ResizeObserver(f),M.observe(b,{box:"border-box"}),w.forEach(({card:H})=>M.observe(H,{box:"border-box"}))),window.addEventListener("resize",f),u.addEventListener("scroll",p,{passive:!0}),{goTo(H){let I=w[Math.max(0,Math.min(w.length-1,Math.round(H)))];if(!I)return;let m=x?window.scrollY+I.start-y():I.start;u.scrollTo({top:m,behavior:i.reducedMotion?"instant":"smooth"})},destroy(){M?.disconnect(),window.removeEventListener("resize",f),cancelAnimationFrame(d),u.removeEventListener("scroll",p),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",b.remove()}}}var ki=J(()=>{});function Si(t,e){let i="http://www.w3.org/2000/svg";function r(d,y,C){let p=document.createElementNS(i,d);for(let[f,M]of Object.entries(y))p.setAttribute(f,M);return C?.append(p),p}let a=r("svg",{width:0,height:0,"aria-hidden":"true"});a.style.position="absolute",t.append(a);let s=r("defs",{},a),n=r("filter",{id:e+"-shadow",x:"-100%",y:"-100%",width:"300%",height:"300%","color-interpolation-filters":"sRGB"},s),c=r("feMorphology",{in:"SourceAlpha",operator:"dilate"},n),o=r("feGaussianBlur",{},n),g=r("feOffset",{result:"mask"},n),x=r("feFlood",{},n);r("feComposite",{in2:"mask",operator:"in"},n);let u=r("feMerge",{},n);r("feMergeNode",{},u),r("feMergeNode",{in:"SourceGraphic"},u);let b=r("filter",{id:e+"-tint","color-interpolation-filters":"sRGB"},s),w=r("feFlood",{},b);return r("feComposite",{in2:"SourceGraphic",operator:"atop"},b),d=>{let y=d.shadowAngle*Math.PI/180;c.setAttribute("radius",d.shadowSpread),o.setAttribute("stdDeviation",d.shadowBlur/2),g.setAttribute("dx",Math.cos(y)*d.shadowDistance),g.setAttribute("dy",Math.sin(y)*d.shadowDistance),x.setAttribute("flood-color",d.shadowColor),w.setAttribute("flood-color",d.imageTint),t.style.setProperty("--gc-shadow-filter",d.shadowEnabled?"url(#"+n.id+")":"none"),t.style.setProperty("--gc-image-filter",d.imageTint.endsWith("00")&&d.imageTint.length===9?"none":"url(#"+b.id+")")}}var Ci=J(()=>{});var Mi,kt,Ai=J(()=>{Mi='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',kt=class{constructor(e,i,r){this.root=e,this.cards=i,this.projects=r,this.assetDirectory=new URL(".",i[0].querySelector("img").src),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${Mi}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${Mi}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",n=>{if(n.target!==this.dialog)return;let c=this.dialog.getBoundingClientRect();(n.clientX<c.left||n.clientX>c.right||n.clientY<c.top||n.clientY>c.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",n=>{(n.key==="ArrowLeft"||n.key==="ArrowRight")&&(n.preventDefault(),this.showFrame(this.frame+(n.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",n=>{!n.isPrimary||n.target.closest("button")||(this.galleryPointer={id:n.pointerId,x:n.clientX,y:n.clientY},s.setPointerCapture(n.pointerId))}),s.addEventListener("pointerup",n=>{let c=this.galleryPointer;if(this.galleryPointer=null,!c||c.id!==n.pointerId)return;s.hasPointerCapture(n.pointerId)&&s.releasePointerCapture(n.pointerId);let o=n.clientX-c.x,g=n.clientY-c.y;Math.abs(o)>35&&Math.abs(o)>Math.abs(g)*1.2&&this.showFrame(this.frame+(o<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let i=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!i,this.dialog.querySelector("[data-gallery-next]").hidden=!i,this.thumbnails.hidden=!i,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(a=>{let s=document.createElement("li");return s.textContent=a,s})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((a,s)=>{let n=document.createElement("button");n.type="button",n.className="project-thumbnail",n.setAttribute("aria-label",`Show ${a.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(a.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,n.append(c),n.addEventListener("click",()=>this.showFrame(s)),n})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let i=this.project.gallery[this.frame];this.image.src=new URL(i.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${i.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${i.label}`,[...this.thumbnails.children].forEach((r,a)=>r.setAttribute("aria-current",String(a===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Xe,ut,St=J(()=>{Xe=Object.freeze({containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),ut=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function Ei(t,e,{pauseOnHover:i=!0,interactionRestMs:r=6e3}={}){let a=t.querySelector("[data-orbit-toggle]"),s=new AbortController,n=(p,f,M)=>p.addEventListener(f,M,{signal:s.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let o=0,g=!1,x=p=>!!p&&t.contains(p)&&(p.matches(":focus-visible")||!!p.closest(".orbit-card")),u=()=>!g&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,b=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(o),e.autoFrame=0,o=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},w=p=>{if(e.autoFrame=0,!u()){b();return}let f=Math.min(.05,Math.max(0,(p-e.autoTime)/1e3));e.autoTime=p,e.position=(e.position+f/8)%e.count,e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(w)},d=()=>{if(!u()){b();return}let p=e.resumeAt-performance.now();if(p>0){b(),o=setTimeout(d,p);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(w))},y=(p=6e3)=>{b(),e.resumeAt=performance.now()+p};e.animateTo=function(...p){y(r),c.animateTo.apply(this,p),d()},e.settleImmediately=function(...p){c.settleImmediately.apply(this,p),d()},e.openProject=function(...p){y(),c.openProject.apply(this,p),d()},i&&(n(t,"pointerenter",p=>{p.pointerType!=="touch"&&(e.hovered=!0,d())}),n(t,"pointerleave",p=>{p.pointerType!=="touch"&&(e.hovered=!1,d())})),n(t,"focusin",p=>{e.keyboardFocused=x(p.target),d()}),n(t,"focusout",p=>{e.keyboardFocused=x(p.relatedTarget),d()}),n(t,"pointerup",()=>{y(r),d()}),n(t,"pointercancel",()=>{y(r),d()}),n(e.viewer.dialog,"close",()=>{y(),d()}),n(document,"visibilitychange",d),n(e.reducedMotion,"change",d),n(a,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,a.dataset.paused=String(e.manuallyPaused),a.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),d()});let C=new IntersectionObserver(p=>{e.inView=p.some(f=>f.isIntersecting&&f.intersectionRatio>=.15),d()},{threshold:.15});return C.observe(e.stage),e.stopAutoplay=b,e.syncAutoplay=d,()=>{g=!0,b(),s.abort(),C.disconnect(),Object.assign(e,c)}}var Pi=J(()=>{});var Se,Wt,Li,ji,zi,Ii,Ti,qi,Fi,Ni,Ri,Di,$i,Ot,Wi,ht,Oi,Bt=J(async()=>{Se=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),Wt=Se.BufferGeometry,Li=Se.Float32BufferAttribute,ji=Se.LineBasicMaterial,zi=Se.LineLoop,Ii=Se.DoubleSide,Ti=Se.Mesh,qi=Se.NoToneMapping,Fi=Se.PerspectiveCamera,Ni=Se.PlaneGeometry,Ri=Se.Raycaster,Di=Se.Scene,$i=Se.ShaderMaterial,Ot=Se.SRGBColorSpace,Wi=Se.TextureLoader,ht=Se.Vector2,Oi=Se.WebGLRenderer});var xo,Ct,Bi=J(async()=>{xo=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),Ct=xo.default});var wo,Ht,Hi=J(async()=>{wo=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),Ht=wo.CustomEase});function Gi(t,e,i=64){let r=t/e,a=new Ni(t,t*9/16,i,1),s=a.attributes.position,n=a.attributes.uv;for(let c=0;c<s.count;c++){let o=(n.getX(c)-.5)*e;s.setX(c,r*Math.sin(o)),s.setZ(c,r*(Math.cos(o)-1))}return a.computeVertexNormals(),a.computeBoundingSphere(),a}function Ui(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var Gt=J(async()=>{await Bt()});function ft(t,e){let i=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*i,panelArc:t.radiansPerSlide*i,height:t.slotHeight*i}}function Mt(t,{radius:e,pitch:i,radiansPerSlide:r}){let a=t*r;return{x:Math.sin(a)*e,y:-t*i,z:(Math.cos(a)-1)*e,angle:a,taper:1,shade:(1-Math.cos(a))/2*.58}}function _i(t,e){let i=ft(t,e);return Gi(i.cardWidth,i.panelArc)}function Ut(t,e=64){let i=[];for(let r=0;r<=e;r++){let a=(r/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),t.slotHeight/2,t.radius*(Math.cos(a)-1))}for(let r=e;r>=0;r--){let a=(r/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),-t.slotHeight/2,t.radius*(Math.cos(a)-1))}return i}var At=J(async()=>{await Gt()});function _t(t,e){let i=_i(t,e);return i.scale(1,1/t.aspect/(9/16),1),i.computeVertexNormals(),i.computeBoundingSphere(),i}function Xi(t,e,i,r,a){let s=Math.min(t,e)*Math.min(40,Math.max(0,a))/100,n=t-2*s,c=e-2*s,o=n/c,g=r==="fit"?Math.max:Math.min,x=g(1,o/i),u=g(1,i/o);return{contentWidth:n,contentHeight:c,uvScaleX:x,uvScaleY:u,imageWidth:n/x,imageHeight:c/u,padding:s}}var Yi=J(async()=>{await At();await At()});function Xt({stageWidth:t,stageHeight:e,spiralWidthPercent:i,cardWidth:r,aspect:a,rise:s,riseUnit:n}){let c=Math.max(1,t*i/200),o=Math.max(1,Math.min(r,c*Math.PI/3,e*.4*a)),g=Math.PI*2*c/o,x=n==="percent"?e*s/100:s*Math.min(1,t/640);return{radius:c,slotWidth:o,slotHeight:o/a,aspect:a,pitch:Math.max(o/a*1.25/g,x),radiansPerSlide:o/c,cardsPerTurn:Math.PI*2*c/o}}var Vi=J(()=>{});function Ki(t,e,i){let r=e.radius*2.4,a=r/(r+2*e.radius),s=Math.ceil((i/(2*a)+e.slotHeight/2)/e.pitch)+2,n=Math.floor(t);return{first:n-s,last:n+s,count:s*2+1}}function Zi(t,e,i){let r=t*e.radiansPerSlide,a=r-i.panelArc/2,s=r+i.panelArc/2,n=Math.PI*2,c=C=>Math.ceil((a-C)/n)<=Math.floor((s-C)/n),o=c(0)?1:Math.max(Math.cos(a),Math.cos(s)),g=c(Math.PI)?-1:Math.min(Math.cos(a),Math.cos(s)),x=e.radius*2.4,u=x/(x+e.radius*(1-o)),b=x/(x+e.radius*(1-g)),w=-t*e.pitch,d=w+i.height/2,y=w-i.height/2;return{minY:Math.min(y*u,y*b),maxY:Math.max(d*u,d*b)}}function Qi(t,e){let i=Math.min(80,e*.08),r=s=>Math.max(0,Math.min(1,s)),a=Math.min(r((e/2-t.minY)/i),r((t.maxY+e/2)/i));return a*a*(3-2*a)}function ea(t,e,i,r){let a=i-e;return Math.abs(a)>r/2&&(a-=Math.round(a/r)*r),t+a}var Ji,ta=J(async()=>{await At();Vi();Ji=(t,e)=>(t%e+e)%e});var aa,ia=J(()=>{aa=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function oa(t,{textureSource:e=i=>i.querySelector("img").src}={}){let{root:i,stage:r}=t,a;try{a=new Oi({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return i.dataset.renderer="css-fallback",()=>{delete i.dataset.renderer}}a.outputColorSpace=Ot,a.toneMapping=qi,a.setClearColor(0,0);let s=a.domElement;s.style.removeProperty("display"),s.className="orbit-webgl",s.setAttribute("aria-hidden","true"),r.append(s);let n=new Di,c=new Fi,o=new Ri,g=new ht,x=new AbortController,u=(B,W,U)=>B.addEventListener(W,U,{signal:x.signal}),b=t.render,w=t.pointerDown,d=new Map,y=[],C,p,f=t.position,M=t.position,H="",I=!1,m=!1,A=null,j=null,$=!1,N=!1;i.dataset.renderer="loading-webgl";let P=()=>Xt({stageWidth:r.clientWidth,stageHeight:r.clientHeight,spiralWidthPercent:Number(i.dataset.spiralWidth),cardWidth:Number(i.dataset.cardWidth),aspect:Number(i.dataset.cardAspect),rise:Number(i.dataset.rise),riseUnit:i.dataset.riseUnit}),S=()=>{let B=t.cards[0],W=new $i({uniforms:{screenshot:{value:d.get(e(B))},dimensions:{value:new ht},contentDimensions:{value:new ht(1,1)},imageScale:{value:new ht(1,1)},borderColor:{value:[0,0,0,1]},backColor:{value:[0,0,0,1]},imageTint:{value:[0,0,0,0]},showImage:{value:!0},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:So,fragmentShader:Co,transparent:!0,side:Ii,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),U=new Ti(C,W),K=new zi(p,new ji({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),_={card:B,mesh:U,guide:K,material:W,surface:{scale:1,target:1}};U.userData.panel=_,y.push(_),n.add(U,K)},k=B=>{let W=Ki(f,B,r.clientHeight);for(;y.length<W.count;)S();for(;y.length>W.count;){let U=y.pop();n.remove(U.mesh,U.guide),U.material.dispose(),U.guide.material.dispose()}y.forEach((U,K)=>{U.offset=W.first+K-f,U.card=t.cards[Ji(W.first+K,t.count)],U.material.uniforms.screenshot.value=d.get(e(U.card))})},R=()=>{let B=r.clientWidth,W=r.clientHeight,U=P(),K=Number(i.dataset.slotGap||3);k(U);let _=ft(U,K),{cardWidth:ee,panelArc:de}=_,{radius:O}=U;i.dataset.slotMetrics=JSON.stringify({...U,cardArc:de,cardWidth:ee,cardHeight:_.height,gap:K,imageFit:i.dataset.imageFit,imagePadding:Number(i.dataset.imagePadding||0)}),y.forEach(ie=>{ie.material.uniforms.dimensions.value.set(ee,_.height);let V=ie.material.uniforms;V.cornerRadius.value=Math.min(Number(i.dataset.cornerRadius)||0,ee/2,_.height/2),V.borderWidth.value=Number(i.dataset.borderWidth)||0,V.solidBack.value=i.dataset.backFace==="solid",V.showImage.value=i.dataset.showImage!=="false";for(let ve of["backColor","borderColor","imageTint"]){let Te=V[ve],X=i.dataset[ve]||"#00000000";if(Te.hex!==X){Te.hex=X;let qe=X.length===7?X+"ff":X;Te.value=[1,3,5,7].map(G=>parseInt(qe.slice(G,G+2),16)/255)}}let fe=ie.material.uniforms.screenshot.value.image;if(!fe)return;let ue=Xi(ee,_.height,(fe.naturalWidth||fe.width)/(fe.naturalHeight||fe.height),i.dataset.imageFit,Number(i.dataset.imagePadding||0));ie.material.uniforms.contentDimensions.value.set(ue.contentWidth,ue.contentHeight),ie.material.uniforms.imageScale.value.set(ue.uvScaleX,ue.uvScaleY)});let Q=Math.min(window.devicePixelRatio||1,2),me=`${B}:${W}:${ee}:${de}:${_.height}:${O}:${Q}`;if(me===H||!B||!W)return;H=me,a.setPixelRatio(Q),a.setSize(B,W,!1),c.position.set(0,0,O*2.4),c.fov=Ui(W,c.position.z),c.aspect=B/W,c.near=.1,c.far=O*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let pe=C;C=_t(U,K);let te=p;p=new Wt,p.setAttribute("position",new Li(Ut(U),3)),y.forEach(ie=>{ie.mesh.geometry=C,ie.guide.geometry=p,ie.material.uniforms.dimensions.value.set(ee,_.height)}),pe?.dispose(),te?.dispose()},z=()=>{if(!I||m||$||N||!t.geometry)return;N=!0,f=ea(f,M,t.position,t.count),M=t.position,R();let B=P(),W=ft(B,Number(i.dataset.slotGap||3)),U=i.dataset.focusMode==="keyboard"&&i.contains(document.activeElement),K=0;y.forEach(ee=>{let{card:de,mesh:O,material:Q}=ee,me=Mt(ee.offset,B),pe=Zi(ee.offset,B,W),te=Qi(pe,r.clientHeight),ie=i.dataset.edgeMode==="preset"?te:+(te>0),V=U&&de===t.cards[t.active]&&Math.abs(ee.offset)<.5;Q.polygonOffsetUnits=Math.abs(ee.offset)*8,O.position.set(me.x,me.y,me.z),O.rotation.y=me.angle;let fe=ee===A&&!t.pointer&&!t.reducedMotion.matches,ue=Number(i.dataset.hoverAmount)||0;O.scale.setScalar(fe&&i.dataset.hoverEffect==="zoom"?1+ue/100:1),fe&&i.dataset.hoverEffect==="lift"&&(O.position.y+=ue),O.visible=ie>.001&&!!Q.uniforms.screenshot.value.image,O.visible&&K++,ee.guide.position.copy(O.position),ee.guide.rotation.copy(O.rotation),ee.guide.visible=i.dataset.showSlots==="true"&&O.visible,ee.guide.material.opacity=ie*.42,Q.uniforms.fade.value=ie,Q.uniforms.shade.value=me.shade,Q.uniforms.focused.value=V?1:0});let _=JSON.stringify({cardsPerTurn:B.cardsPerTurn,visibleCount:K,poolCount:y.length,stageWidth:r.clientWidth,stageHeight:r.clientHeight,cardWidth:W.cardWidth,cardHeight:W.height,pitch:B.pitch,radius:B.radius,uniqueCount:t.count});i.dataset.responsiveMetrics!==_&&(i.dataset.responsiveMetrics=_),j&&!t.pointer&&(A=Y(j)),n.updateMatrixWorld(!0),a.render(n,c),N=!1},Y=B=>{if(!I||$)return null;let W=s.getBoundingClientRect();g.set((B.clientX-W.left)/W.width*2-1,-(B.clientY-W.top)/W.height*2+1),o.setFromCamera(g,c);for(let U of o.intersectObjects(y.map(K=>K.mesh))){let K=U.object.userData.panel;if(!U.object.visible||K.material.uniforms.fade.value<=.25)continue;let{x:_,y:ee}=K.material.uniforms.dimensions.value,de=K.material.uniforms.cornerRadius.value,O=Math.abs((U.uv.x-.5)*_)-_/2+de,Q=Math.abs((U.uv.y-.5)*ee)-ee/2+de;if(!(Math.hypot(Math.max(O,0),Math.max(Q,0))+Math.min(Math.max(O,Q),0)>de))return K}return null};t.render=function(){b.call(this),z()},t.pointerDown=function(B){w.call(this,B),I&&!$&&this.pointer?.id===B.pointerId&&(this.pointer.card=Y(B)?.card||null),j=null,A=null},u(r,"pointermove",B=>{j=B.pointerType==="mouse"?{clientX:B.clientX,clientY:B.clientY}:null,A=B.pointerType==="mouse"&&!t.pointer?Y(B):null,s.style.cursor=t.pointer?.dragging?"grabbing":A?"pointer":"grab",z()}),u(r,"pointerleave",()=>{j=null,A=null,z()}),u(r,"pointerup",()=>{A=null,z()}),u(i,"focusin",z),u(i,"focusout",()=>queueMicrotask(z)),u(document,"keydown",()=>queueMicrotask(z)),u(document,"pointerdown",()=>queueMicrotask(z)),u(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&y.forEach(({surface:B})=>{Ct.killTweensOf(B),B.scale=B.target}),z()}),u(i,"playground-change",z),u(i,"slot-guides-change",z),u(s,"webglcontextlost",B=>{B.preventDefault(),$=!0,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback"}),u(s,"webglcontextrestored",()=>{$=!1,I&&(i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",z())});let ae=new ResizeObserver(()=>z());ae.observe(r);let le=new Wi,he=!1,ze=()=>{m||(he=!0,I=!1,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback")};for(let B of t.cards){let W=e(B);if(d.has(W))continue;let U=le.load(W,z,void 0,ze);U.colorSpace=Ot,U.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),d.set(W,U)}return he||(C=_t(P(),Number(i.dataset.slotGap||3)),p=new Wt,I=!0,i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",z()),()=>{m=!0,x.abort(),ae.disconnect(),t.render=b,t.pointerDown=w,i.classList.remove("has-webgl-carousel"),delete i.dataset.renderer,y.forEach(({material:B,surface:W,guide:U})=>{Ct.killTweensOf(W),B.dispose(),U.material.dispose()}),C?.dispose(),p?.dispose(),d.forEach(B=>B.dispose()),a.dispose(),a.forceContextLoss(),s.remove()}}var Tr,So,Co,ra=J(async()=>{await Bt();await Bi();await Hi();await Gt();await Yi();await ta();Ct.registerPlugin(Ht);Tr=Ht.create("portfolio-surface",".2,.75,.25,1"),So=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Co=`
  uniform sampler2D screenshot;
  uniform vec2 dimensions;
  uniform float cornerRadius;
  uniform float borderWidth;
  uniform vec4 borderColor;
  uniform vec4 imageTint;
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
`});var na=J(()=>{(()=>{"use strict";let t=Math.PI*2,e=(s,n)=>(s%n+n)%n,i=(s,n,c)=>Math.min(c,Math.max(n,s));class r{constructor(n){this.root=n,this.stage=n.querySelector(".orbit-stage"),this.cards=[...n.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,o)=>{c.dataset.slideIndex=o;let g=c.cloneNode(!0);g.dataset.repeat="true",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),g.removeAttribute("aria-pressed"),c.parentElement.append(g),this.visualCards.push(g)}),!(!this.count||!this.stage)&&(this.title=n.querySelector(".orbit-title"),this.description=n.querySelector(".orbit-description"),this.status=n.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(n,this.cards),this.pagination=n.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((n,c)=>{let o=document.createElement("button");return o.type="button",o.className="orbit-dot",o.setAttribute("aria-label",`Show ${n.dataset.title||`screenshot ${c+1}`}`),o.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(o),o}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(n=>{n.disabled=!0})}bindEvents(){let n=(c,o,g,x={})=>c.addEventListener(o,g,{...this.options,...x});n(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),n(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),n(this.stage,"keydown",c=>{let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in o?(c.preventDefault(),this.step(o[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),n(this.stage,"pointerdown",c=>this.pointerDown(c)),n(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),n(this.stage,"pointerup",c=>this.pointerUp(c)),n(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),n(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),n(this.stage,"dragstart",c=>c.preventDefault()),n(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),n(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let o=c.target.closest(".orbit-card");o&&this.openProject(Number(o.dataset.slideIndex))}),n(this.stage,"focusin",c=>{let o=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&o>=0&&o!==this.active&&this.goTo(o)}),n(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),n(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(n=>{let c=n.querySelector(".orbit-surface"),o=c.querySelector("img"),g=Array.from({length:this.segmentCount},(x,u)=>{let b=document.createElement("span");return b.className="orbit-strip",b.setAttribute("aria-hidden","true"),b.dataset.stripIndex=u,b.style.backgroundImage=`url("${o.src}")`,c.append(b),b});return n.classList.add("is-curved"),{card:n,strips:g}})}measure(){let n=this.stage.clientWidth,c=this.stage.clientHeight,o=n<=700;this.cards[0].style.removeProperty("width");let g=this.cards[0].offsetWidth,x=t/8,u=x*.88,b=g/u;this.geometry={radius:b,panelArc:u,cardWidth:g,pitch:i(c/13,36,52),halfWindow:6.5,radiansPerSlide:x,dragUnitX:Math.max(85,n*(o?.32:.18)),dragUnitY:i(c*.13,65,105)},this.stage.style.perspective=`${(b*2.4).toFixed(3)}px`;let w=u/this.segmentCount,d=2*b*Math.sin(w/2),y=g*9/16;this.panels.forEach(({card:C,strips:p})=>{C.style.width=`${g}px`,p.forEach((f,M)=>{let H=-u/2+(M+.5)*w,I=b*Math.sin(H),m=b*(Math.cos(H)-1);f.style.width=`${(d+.6).toFixed(4)}px`,f.style.backgroundSize=`${g}px ${y}px`,f.style.backgroundPosition=`${(-M*g/this.segmentCount).toFixed(4)}px 0px`,f.style.transform=`translateX(-50%) translate3d(${I.toFixed(4)}px, 0px, ${m.toFixed(4)}px) rotateY(${(H*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:n,pitch:c,halfWindow:o,radiansPerSlide:g}=this.geometry;this.visualCards.forEach(u=>{let b=Number(u.dataset.slideIndex),w=e(b-this.position+this.count/2,this.count)-this.count/2;u.dataset.repeat&&(w+=w<0?this.count:-this.count);let d=w*g,y=Math.cos(d),C=Math.sin(d),p=(1-y)/2,f=1-w/o*.11,M=C*n*f,H=w*c,I=y*n*f-n,m=d*180/Math.PI,A=i((o-Math.abs(w))/.65,0,1);u.style.transform=`translate(-50%, -50%) translate3d(${M.toFixed(3)}px, ${H.toFixed(3)}px, ${I.toFixed(3)}px) rotateY(${m.toFixed(3)}deg) scale(${f.toFixed(4)})`,u.style.zIndex="auto",u.style.setProperty("--orbit-shade",String(p*.58)),u.style.setProperty("--orbit-fade",String(A)),u.style.opacity="1",u.style.visibility=A>0?"visible":"hidden",u.style.pointerEvents=A>.25?"auto":"none",u.toggleAttribute("data-gc-back-facing",y<0),u.dataset.offset=w.toFixed(5)});let x=e(Math.round(this.position),this.count);x!==this.active&&this.updateActive(x)}updateActive(n){let c=this.visualCards.includes(document.activeElement);this.active=n,this.cards.forEach((o,g)=>{let x=g===n;o.classList.toggle("is-centered",x),o.tabIndex=x?0:-1,o.setAttribute("aria-pressed",String(x)),this.dots[g].setAttribute("aria-current",String(x))}),this.title&&(this.title.textContent=this.cards[n].dataset.title||""),this.description&&(this.description.textContent=this.cards[n].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[n].dataset.title}, project ${n+1} of ${this.count}`),c&&!this.pointer&&this.cards[n].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(n)}goTo(n){let c=e(n-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(n){this.animateTo(Math.round(this.target)+n)}animateTo(n,c=0){if(this.target=Math.round(n),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(n){this.frame=0;let c=Math.min((n-this.lastTime)/1e3,.032);this.lastTime=n;let o=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=o*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(n){if(this.viewer.dialog.open||!Number.isInteger(n)||!this.cards[n])return;let c=e(n-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(n)}pointerDown(n){if(!n.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}n.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:n.pointerId,x:n.clientX,y:n.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:n.target.closest(".orbit-card")},this.stage.setPointerCapture(n.pointerId))}pointerMove(n){let c=this.pointer;if(!c||c.id!==n.pointerId)return;let o=n.clientX-c.x,g=n.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(o),Math.abs(g))<6)return;if(n.pointerType==="touch"&&Math.abs(o)<=Math.abs(g)){c.card=null;return}c.axis=Math.abs(g)>Math.abs(o)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}n.preventDefault();let x=c.axis==="x"?n.clientX:n.clientY,u=c.axis==="x"?o:g,b=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,w=n.pointerType==="touch"?i(b*.38,32,48):b,d=performance.now(),y=Math.max(8,d-c.lastTime),C=-(x-c.lastCoordinate)/w/y*1e3;c.speed=c.speed*.35+C*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=x,c.travel=u,this.position=c.startPosition-u/w,this.render()}pointerUp(n,c=!1){let o=this.pointer;if(!o||o.id!==n.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(o.id)&&this.stage.releasePointerCapture(o.id),!o.dragging){this.animateTo(Math.round(this.position)),!c&&o.card&&this.openProject(Number(o.card.dataset.slideIndex));return}let g=c||performance.now()-o.lastMovement>90?0:i(o.speed,-10,10),x=Math.round(this.position+(this.reducedMotion.matches?0:g*(n.pointerType==="touch"?.32:.2))),u=this.position-o.startPosition;!c&&Math.abs(o.travel)>18&&Math.abs(u)>.12&&x===Math.round(o.startPosition)&&(x+=Math.sign(u)),this.animateTo(x,g)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:n,strips:c})=>{c.forEach(o=>o.remove()),n.classList.remove("is-curved"),n.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(n=>n.dataset.repeat).forEach(n=>n.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function a(s=document){s.querySelectorAll("[data-spiral-carousel]").forEach(n=>{n.spiralCarousel||(n.spiralCarousel=new r(n))})}window.SpiralCarousel={init:a},a()})()});var ca,sa=J(()=>{ca=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var da,la=J(()=>{da=`.project-dialog {
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
`});var ga,pa=J(()=>{ga=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var fa={};si(fa,{mountSpiral:()=>zo,spiralControls:()=>ut,spiralDefaults:()=>Xe});function Vt(t,e,i){for(let r of ua)t.removeAttribute(r);for(let[r,a]of Object.entries(e.imageAttrs||{}))ua.has(r)&&a!=null&&t.setAttribute(r,String(a));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&i?.(t)}function ha(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function zo(t){let{host:e,onChange:i=()=>{},loadImage:r}=t,a=t.items.filter(S=>S.src),s={...Xe,...t.options},n=!1;if(!a.length){let S=document.createElement("p");return S.className="gc-spiral-empty",S.textContent="Add images to this source to preview the spiral.",e.append(S),{destroy(){S.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let o=document.createElement("div");o.className="orbit-carousel spiral-carousel slot-carousel",o.dataset.spiralCarousel="",o.id=`gc-spiral-${++Lo}`,o.setAttribute("role","region"),o.setAttribute("aria-label","Spiral gallery"),o.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let g=o.querySelector(".orbit-stage"),x=o.querySelector(".orbit-ring"),u=o.querySelector("[data-orbit-toggle]");Be(o.querySelector("[data-orbit-prev]"),"previous"),Be(o.querySelector("[data-orbit-next]"),"next"),Be(u,"playback");let b=o.querySelector(".gc-spiral-caption"),w=document.createElement("div");w.className="gc-spiral-caption-space",b.before(w),w.append(b);let d=a.some(S=>!!S.title);for(let S of new Set(a.map(k=>k.title).filter(Boolean))){let k=b.cloneNode(!1);k.setAttribute("aria-hidden","true"),k.classList.add("gc-spiral-caption-measure"),k.textContent=S,w.append(k)}let y=document.createElement("div");y.className="gc-item-details",w.after(y);let C=a.map(S=>{let k=document.createElement("div");k.className="gc-item-detail";let R=document.createElement("p");R.className="gc-item-description",R.textContent=Yt(S.description);let z=document.createElement("a"),Y=ha(S.link);return Y&&(z.href=Y),z.textContent=S.buttonLabel||"Open link",k.append(R,z),y.append(k),{group:k,body:R,link:z,href:Y}});a.forEach((S,k)=>{let R=document.createElement("button");R.className="orbit-card",R.type="button",R.dataset.title=S.title||"",R.dataset.imageSource=S.src,R.setAttribute("aria-label",S.title?`View ${S.title}`:`View image ${k+1}`);let z=document.createElement("span");z.className="orbit-surface";let Y=document.createElement("img");Vt(Y,S),z.append(Y),R.append(z),x.append(R)}),c.append(o),e.append(c);let p=Si(c,o.id),f=()=>{p(s),o.dataset.showImage=String(s.showImage!==!1),o.dataset.imageTint=s.imageTint,o.dataset.hoverEffect=s.reducedMotion?"none":s.hoverEffect,o.dataset.hoverAmount=s.hoverAmount;for(let{body:S,link:k,href:R}of C)S.hidden=!s.showDescription||!S.textContent,k.hidden=!s.showButton||!R;y.hidden=C.every(({body:S,link:k})=>S.hidden&&k.hidden),o.dataset.edgeMode=s.edgeMode,o.dataset.backFace=s.backFace,o.dataset.cornerRadius=s.spiralRadius,o.dataset.borderWidth=s.borderWidth,o.dataset.borderColor=s.spiralRim,o.dataset.backColor=s.backColor,o.style.setProperty("--orbit-card-radius",s.spiralRadius+"px"),o.style.setProperty("--orbit-rim",s.spiralRim),c.style.width=`${Qe(s.containerWidth,100,20,100)}%`,g.style.height=`${Qe(s.stageHeight,680,280,1600)}px`,o.style.setProperty("--orbit-card-width",`${Qe(s.cardWidth,280,80,720)}px`),o.dataset.spiralWidth=String(Qe(s.spiralWidth,87,20,100)),o.dataset.cardWidth=String(Qe(s.cardWidth,280,80,720)),o.dataset.rise=String(Qe(s.spiralRise,52,s.spiralRiseUnit==="percent"?1:8,s.spiralRiseUnit==="percent"?50:500)),o.dataset.riseUnit=s.spiralRiseUnit==="percent"?"percent":"px",o.dataset.cardAspect=String(jo(s.aspectRatio)),o.dataset.imageFit=s.fit==="contain"||s.fit==="fit"?"fit":"fill",o.dataset.imagePadding=String(Qe(s.imagePadding,0,0,20)),o.dataset.slotGap=String(Qe(s.spiralGap,3,0,16)),o.dataset.showSlots=String(!!s.showSlots),w.hidden=!s.showTitles||!d,o.classList.toggle("gc-spiral-reduced",!!s.reducedMotion)};f();let M=a.map(S=>({title:S.title||"",category:"",description:Yt(S.description),services:[],notes:[],gallery:[{file:S.src,label:"Image"}]}));class H extends kt{constructor(k,R){super(k,R,M),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(k){let R=a[k];if(!R||s.clickAction==="none")return;let z=ha(R.link);if(s.clickAction==="link"){z&&location.assign(z);return}if(R.postUrl){t.openPost(R,k);return}super.open(k);let Y=this.dialog.querySelector(".project-title");Y.hidden=!R.title||!s.popupTitle,Y.hidden?this.dialog.removeAttribute("aria-labelledby"):this.dialog.setAttribute("aria-labelledby",Y.id),this.dialog.querySelector(".project-summary").hidden=!s.popupDescription||!Yt(R.description),this.dialog.querySelector(".project-gallery").hidden=!s.popupImage,this.dialog.querySelector(".project-frame-label").hidden=!s.popupTitle,this.dialog.querySelector(".project-info").hidden=Y.hidden&&this.dialog.querySelector(".project-summary").hidden&&!(z&&s.popupButton),this.sourceLink.hidden=!z||!s.popupButton,z?(this.sourceLink.href=z,this.sourceLink.textContent=R.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!s.reducedMotion)}showFrame(k){super.showFrame(k);let R=M.indexOf(this.project),z=a[R];z&&(Vt(this.image,z,r),this.dialog.querySelectorAll(".project-thumbnail img").forEach(Y=>Vt(Y,z,r)),this.dialog.querySelector(".project-frame-label").textContent=z.title||"")}}let I=window.ProjectViewer;window.ProjectViewer=H;try{Po.init(c)}finally{I===void 0?delete window.ProjectViewer:window.ProjectViewer=I}let m=o.spiralCarousel;o.querySelectorAll("img").forEach(S=>r?.(S));let A=m.updateActive;m.updateActive=function(S){A.call(this,S),C.forEach(({group:k},R)=>{k.inert=R!==S,k.style.visibility=R===S?"visible":"hidden"}),this.status.textContent=`${a[S]?.title?`${a[S].title}, `:""}image ${S+1} of ${a.length}`,i(S)},m.updateActive(m.active);let j=m.animateTo;m.animateTo=function(S,k=0){s.reducedMotion?(this.target=Math.round(S),this.settleImmediately()):j.call(this,S,k)};let $=oa(m,{textureSource:S=>S.dataset.imageSource}),N=Ei(o,m,{pauseOnHover:!1,interactionRestMs:0});function P(S){s.autoplay=!!S,m.manuallyPaused=!S||!!s.reducedMotion,m.resumeAt=0,u.disabled=!!s.reducedMotion||m.reducedMotion.matches||a.length<2,u.dataset.paused=String(m.manuallyPaused),u.setAttribute("aria-label",m.manuallyPaused?"Resume carousel":"Pause carousel"),m.syncAutoplay()}return P(!!s.autoplay),{update(S){let k=s;s={...s,...S},f(),m.measure(),o.dispatchEvent(new Event("playground-change")),o.dispatchEvent(new Event("slot-guides-change")),m.updateActive(m.active),(k.autoplay!==s.autoplay||k.reducedMotion!==s.reducedMotion)&&P(!!s.autoplay)},goTo(S){n||m.goTo(S)},setPlaying:P,getMetrics(){try{return JSON.parse(o.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return o.dataset.renderer||"loading"},destroy(){n||(n=!0,N(),$(),m.destroy(),c.remove())}}}var Po,Lo,Qe,jo,Yt,ua,ma=J(async()=>{Ci();Ai();wt();St();St();Pi();await ra();na();Po=window.SpiralCarousel,Lo=0,Qe=(t,e,i,r)=>Number.isFinite(Number(t))?Math.max(i,Math.min(r,Number(t))):e,jo=t=>{if(typeof t=="number"&&t>0)return t;let[e,i]=String(t||"16:9").split(":").map(Number);return e>0&&i>0?e/i:16/9},Yt=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},ua=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function ba(t){let{host:e}=t,i={...t.options},r=null,a=null,s=!1,n="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),ma().then(()=>fa).then(o=>{s||(c.remove(),a=o.mountSpiral({...t,options:i}),r!==null&&a.goTo?.(r))}).catch(o=>{s||(n="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",o))}),{update(o){i={...i,...o},a?.update?.(i)},goTo(o){r=o,a?.goTo?.(o)},setPlaying(o){i.autoplay=o,a?.setPlaying?.(o)},getStatus(){return a?.getStatus?.()??n},getMetrics(){return a?.getMetrics?.()??null},destroy(){s=!0,c.remove(),a?.destroy()}}}var ya=J(()=>{});function ct(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let i=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(i.protocol)?i.href:""}catch{return""}}function Pt(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(i=>i.remove()),e.content.querySelectorAll("*").forEach(i=>{for(let r of[...i.attributes])(/^on/i.test(r.name)||r.name==="style"||r.name==="id")&&i.removeAttribute(r.name);if(i.hasAttribute("href")){let r=ct(i.getAttribute("href"));r?i.setAttribute("href",r):i.removeAttribute("href")}}),e.innerHTML}function va(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let i of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(i)&&(e[i]=t.getAttribute(i));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function mt(t,e){let i=Et[e];if(!t||!i)return null;let r=t.closest(i);if(!r){let o=t.querySelectorAll(i);if(o.length!==1)return null;r=o[0]}let a=e==="list"?r:r.querySelector(":scope > .sqs-block-content");if(!a)return null;let s=o=>Array.from(a.querySelectorAll(o)).filter(g=>g.closest(i)===r&&(!g.closest(".gc-embed")||g.hasAttribute("data-gc-native-track")));if(e==="summary"){let o=s(".summary-block-wrapper");if(o.length!==1)return null;let g=s(".summary-item").filter(x=>o[0].contains(x)&&!x.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:r,originals:o,rows:g}}let n=e==="list"?".list-item":".slide",c=s(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=s(".sqs-gallery")),c.length===1){let o=Array.from(c[0].querySelectorAll(n)).filter(g=>g.closest(i)===r&&!g.hasAttribute("data-gc-repeat"));return{source:r,originals:c,rows:o}}if(e==="gallery"&&!c.length){let o=s(n);if(o.length&&o.every(g=>g.parentElement===o[0].parentElement))return{source:r,originals:o,rows:o}}return null}function lt(t,e,i=location.href){return(mt(t,e)?.rows||[]).map(a=>{let s=a.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let g=a.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),x=ct(g?.getAttribute("href"),i);return{...va(s),title:a.querySelector(".summary-title")?.textContent.trim()||s?.alt||"",description:Pt(a.querySelector(".summary-excerpt")?.innerHTML),link:x,postUrl:x,buttonLabel:"Read post"}}let n=a.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=Pt(a.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),o=a.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...va(s),title:n,description:c,link:ct(o?.getAttribute("href"),i),buttonLabel:e==="list"&&o?.textContent.trim()||""}}).filter(a=>e==="summary"?!!a.link:e==="list"||a.src)}function Io(t,e){let i=e==="list"?t.getAttribute("data-section-id"):t.id;if(!i?.trim())return"";let r=e==="list"?'section[data-section-id="'+CSS.escape(i)+'"]':"#"+CSS.escape(i);return t.ownerDocument.querySelectorAll(r).length===1?r:""}function xa(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Et).join(","))).filter(i=>!i.closest(".gc-embed")).flatMap(i=>{let r=i.matches(Et.list)?"list":i.matches(Et.summary)?"summary":"gallery",a=Io(i,r);if(!a||!mt(i,r))return[];let s=++e[r];return{name:(r==="list"?"List Section":r==="summary"?"Summary Block":"Gallery Block")+(s>1?" "+s:""),type:r,selector:a,root:i,items:lt(i,r)}})}function Lt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let i=t.ownerDocument.defaultView?.ImageLoader;if(i&&typeof i.load=="function")try{i.load(t,{load:!0})}catch(r){console.warn("Gallery Studio: native image loader",r)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+wa(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function wa(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function Jt(t){let e=document.createElement("img");for(let[i,r]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(i)&&e.setAttribute(i,r);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=wa(t.imageAttrs?.["data-image-focal-point"]),e}var Et,Kt=J(()=>{Et={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function ka(t,e,i){let r=new WeakMap,a=new WeakMap,s=Array.from(e.childNodes),n=i.map(C=>Array.from(C.childNodes)),c=[];function o(C,p){C&&c.push([C,p.map(f=>[f,C.getAttribute(f)])])}let g=new Set,x=!1;function u(){o(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let C of i)o(C,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),x=!0}function b(C,p,f,M,H){let I=i[p],m=g.has(p),A=m?I.cloneNode(!1):I,j=document.createElement("div");if(j.className="gc-card gc-native-card",j.tabIndex=0,j.setAttribute("role","group"),C.imageAttrs?.["data-image-focal-point"]){let[z,Y]=C.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(z)&&Number.isFinite(Y)&&j.style.setProperty("--gc-native-focus",z*100+"% "+Y*100+"%")}let $=C.title||C.alt||`Item ${p+1}`;if(j.setAttribute("aria-label",$),m){A.removeAttribute("id"),A.setAttribute("data-gc-repeat","");for(let z of n[p])j.append(z.cloneNode(!0));j.querySelectorAll("[id]").forEach(z=>z.removeAttribute("id"))}else g.add(p),j.append(...n[p]);A.replaceChildren(j),r.set(j,A);let N=j.querySelector(".list-item-media"),P=j.querySelector(".list-item-content"),S=j.querySelector(".list-item-content__title"),k=j.querySelector(".list-item-content__description");if(!m){for(let z of[N,P])o(z,["class"]);for(let z of[S,k])o(z,["class","hidden"])}if(N?.classList.add("gc-card-media"),P?.classList.add("gc-card-copy"),M.typeSource!=="native"&&(S?.classList.add("gc-card-title"),k?.classList.add("gc-card-description")),S&&(!M.showTitles||f.caption===!1)&&(S.hidden=!0),k&&!f.description&&(k.hidden=!0),f.thumbnail){let z=j.querySelector(".list-item-content__button-wrapper")||j.querySelector(".list-item-content__button");z&&(m||o(z,["hidden"]),z.hidden=!0),P&&(!C.title||f.caption===!1)&&(m||o(P,["hidden"]),P.hidden=!0)}let R=Array.from(j.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!m)for(let z of R)o(z,["tabindex"]);if(a.set(j,R.map(z=>[z,z.getAttribute("tabindex")])),M.clickAction!=="none"&&(M.clickAction!=="link"||C.link)){let z=document.createElement("button");z.type="button",z.className="gc-native-action",z.tabIndex=-1,z.setAttribute("aria-label",(M.clickAction==="link"?"Open link for ":"Open ")+$),z.addEventListener("click",()=>H(C,p)),j.append(z),j.setAttribute("aria-keyshortcuts","Enter Space"),j.addEventListener("click",Y=>{Y.defaultPrevented||Y.target.closest("a,button,input,select,textarea,label")||H(C,p)}),j.addEventListener("keydown",Y=>{Y.target!==j||!["Enter"," "].includes(Y.key)||(Y.preventDefault(),z.click())})}return j}function w(C){let p=C.tabIndex===0&&C.getAttribute("aria-hidden")!=="true";for(let[f,M]of a.get(C)||[]){let H=p?M:"-1";f.getAttribute("tabindex")!==H&&(H===null?f.removeAttribute("tabindex"):f.setAttribute("tabindex",H))}}function d(C){if(!x)return;let p=C!=="native";e.querySelectorAll(".list-item-content__title").forEach(f=>f.classList.toggle("gc-card-title",p)),e.querySelectorAll(".list-item-content__description").forEach(f=>f.classList.toggle("gc-card-description",p))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!x){i.forEach((C,p)=>C.replaceChildren(...n[p])),e.replaceChildren(...s);for(let[C,p]of c)for(let[f,M]of p)C.getAttribute(f)!==M&&(M===null?C.removeAttribute(f):C.setAttribute(f,M));t.after(e),c.length=0,g.clear(),x=!1}}return{track:e,begin:u,makeCard:b,slot:C=>r.get(C),syncFocus:w,setType:d,restore:y}}var Sa=J(()=>{});function Ca(t,e,i){if(!i.closest(".fluid-engine > .fe-block"))return()=>{};i.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let a=0,s=!1,n=new WeakSet,c=b=>{b&&!n.has(b)&&(n.add(b),g.observe(b))},o=()=>{!a&&!s&&(a=requestAnimationFrame(u))},g=new ResizeObserver(o),x=new MutationObserver(o);function u(){if(a=0,s||!e.isConnected)return;let b=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!b)return;let w=b.classList.contains("gc-carousel-stage"),d=b.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(b);let y=0;for(let p of d.children){if(p===b||p.contains(b))continue;c(p);let f=getComputedStyle(p);f.display==="none"||["absolute","fixed"].includes(f.position)||(y+=p.offsetHeight+(parseFloat(f.marginTop)||0)+(parseFloat(f.marginBottom)||0))}let C=Math.max(1,t.clientHeight-y);if(w){let p=b.parentElement;p.classList.contains("gc-block-stage-window")||(p=document.createElement("div"),p.className="gc-block-stage-window",b.before(p),p.append(b));let f=Math.min(1,C/Math.max(1,b.offsetHeight));p.style.height=C+"px",b.style.setProperty("--gc-block-scale",String(f)),b.style.setProperty("--gc-block-top",Math.max(0,(C-b.offsetHeight*f)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",C+"px")}return c(t),x.observe(e,{childList:!0,subtree:!0}),o(),()=>{s=!0,cancelAnimationFrame(a),g.disconnect(),x.disconnect(),i.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let b=e.querySelector(".gc-block-stage-window");if(b){let w=b.firstElementChild;w.style.removeProperty("--gc-block-scale"),w.style.removeProperty("--gc-block-top"),b.replaceWith(w)}}}var Ma=J(()=>{});function Aa(t,e,i,r){let a=i.ownerDocument,s=a.defaultView,n=r!=="list"?i.closest(".fluid-engine > .fe-block"):null;n?.classList.add("gc-viewport-cell");let c=[],o=n||i;for(let u=t.parentElement;u&&(["hidden","clip","auto","scroll"].includes(s.getComputedStyle(u).overflowX)&&c.push(u),u!==o);u=u.parentElement);function g(){let u=a.documentElement.clientWidth;if(!u||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let y=d.getBoundingClientRect().left+s.scrollX+d.clientLeft,C=y>.5||y+d.clientWidth<u-.5;d.classList.toggle("gc-viewport-unclip",C)}let b=-(t.getBoundingClientRect().left+s.scrollX),w=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};w("--gc-viewport-width",u+"px"),w("--gc-viewport-offset",b+"px")}g();let x=s.ResizeObserver?new s.ResizeObserver(g):null;return x?.observe(t),x?.observe(a.documentElement),s.addEventListener("resize",g),()=>{x?.disconnect(),s.removeEventListener("resize",g);for(let u of c)u.classList.remove("gc-viewport-unclip");n?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var Ea=J(()=>{});var La,Pa=J(()=>{La=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function ja(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let r=document.createElement("style");r.id="gc-finish-css",r.textContent=La,document.head.append(r)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit"),t.toggleAttribute("data-gc-popup-colors",!!e.popupCustom),t.toggleAttribute("data-gc-popup-padding",e.popupPadding>0);let i={"--gc-detail-padding":e.cardPadding+"px","--gc-detail-size":e.descriptionSize>0?e.descriptionSize+"rem":"inherit","--gc-detail-color":e.descriptionCustom?e.descriptionColor:"inherit","--gc-popup-padding":e.popupPadding+"px","--gc-popup-radius":e.popupRadius+"px","--gc-popup-color":e.popupColor,"--gc-popup-ink":e.popupInk,"--gc-hover-scale":1+e.hoverAmount/100,"--gc-hover-rise":-e.hoverAmount+"px","--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[r,a]of Object.entries(i))t.style.setProperty(r,a);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var Zt,za=J(()=>{Pa();Zt={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function Ia(t,e){let i=t.classList.contains("gc-embed"),r=i&&e.colorSource==="section";r?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,i&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let a=t.style;a.setProperty("--gc-custom-background",e.background),a.setProperty("--gc-custom-ink",e.ink),a.setProperty("--gc-custom-accent",e.accent),a.setProperty("--gc-background",r?"var(--gc-section-surface)":e.background),a.setProperty("--gc-ink",r?"var(--gc-section-body)":e.ink),a.setProperty("--gc-accent",r?"var(--gc-section-action)":e.accent),a.setProperty("--gc-muted",r?"var(--gc-section-body)":"color-mix(in srgb,"+e.ink+" 67%, transparent)"),a.setProperty("--gc-spatial-surface","var(--gc-background)"),a.setProperty("--gc-spatial-ink","var(--gc-ink)"),r&&(a.setProperty("--gc-line-color","var(--gc-section-line)"),a.setProperty("--gc-tint","var(--gc-section-body)")),a.background=r?"transparent":e.background,a.color=r?"var(--gc-section-body)":e.ink;for(let s of t.querySelectorAll(":scope > dialog"))Ta(t,s)}function Ta(t,e){for(let i of["gcColorSource","gcTypeSource"])t.dataset[i]?e.dataset[i]=t.dataset[i]:delete e.dataset[i]}function Qt(t,e){let i=t.classList.contains("gc-embed")?t:t.ownerDocument.body;Ta(t,e),e.parentElement!==i&&i.append(e)}var qa=J(()=>{});var Na,Fa=J(()=>{Na=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var Da,Ra=J(()=>{Da=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var Wa,$a=J(()=>{Wa=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var Ba,Oa=J(()=>{Ba=`.gc-carousel {
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
`});var Ga,Ha=J(()=>{Ga=`.gc-spatial {
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
`});function et(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function jt(t,e){let i=et(e.preset??t.preset),r=i===et(t.preset)?t.stageHeight:i?0:590;return{...t,...e,stageHeight:e.stageHeight??r}}function Ua(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function _a(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[Na,Da,Wa].join(`
`),document.head.append(e));let i=Ua(t);if(i==="common")return()=>{};let r=`gc-runtime-${i}-css`,a=document.getElementById(r);a||(a=document.createElement("style"),a.id=r,i==="carousel"?a.textContent=Ba:i==="spatial"?a.textContent=Ga:a.textContent=[ca,aa,da,ga].join(`
`),e.after(a)),a.dataset.gcOwners=String(Number(a.dataset.gcOwners||0)+1);let s=!1;return()=>{if(s)return;s=!0;let n=Number(a.dataset.gcOwners)-1;n>0?a.dataset.gcOwners=String(n):a.remove()}}function $o(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function Xa(t,e,i={},r=null){let a=jt(nt,i),s=null,n=null,c=null,o=0,g=0,x,u;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function b(){n&&(n.close(),n.remove(),n=null,s?.setSuspended?.(!1),c?.focus({preventScroll:!0}))}function w(m,A){if(a.clickAction==="none")return;if(a.clickAction==="link"){let k=ct(m.link);k&&window.open(k,"_blank","noopener,noreferrer");return}c=document.activeElement,n&&b(),n=document.createElement("dialog"),n.className="gc-dialog"+(a.preset==="showcase"?" gc-dialog-drawer":""),n.setAttribute("aria-label",m.title||"Image preview");let j=document.createElement("button");j.className="gc-dialog-close",j.type="button",j.textContent="Close \xD7",j.addEventListener("click",b);let $=document.createElement("div");$.className="gc-dialog-content";let N=document.createElement("div");N.className="gc-dialog-media",m.src&&a.popupImage!==!1&&(N.append(Jt(m)),$.append(N));let P=document.createElement("div");if(P.className="gc-dialog-copy",m.title&&a.popupTitle!==!1){let k=document.createElement("h2");k.textContent=m.title,P.append(k)}if(m.postUrl&&a.popupDescription!==!1){let k=document.createElement("article");P.append(k),fi(k,m)}else if(m.description&&a.popupDescription!==!1){let k=document.createElement("div");k.innerHTML=Pt(m.description),P.append(k)}if(m.link&&a.popupButton!==!1){let k=document.createElement("a");k.href=ct(m.link),k.textContent=m.buttonLabel||"Open link",k.target="_blank",k.rel="noopener noreferrer",P.append(k)}let S=document.createElement("p");S.className="gc-dialog-count",S.textContent=`${A+1} / ${e.length}`,P.append(S),$.append(P),n.append(j,$),Qt(t,n),n.showModal(),s?.setSuspended?.(!0),Lt(N.querySelector("img")),j.focus(),n.addEventListener("cancel",k=>{k.preventDefault(),b()}),n.addEventListener("click",k=>{if(k.target===n){let R=n.getBoundingClientRect();(k.clientX<R.left||k.clientX>R.right||k.clientY<R.top||k.clientY>R.bottom)&&b()}})}function d(m,A,j={}){if(r)return r.makeCard(m,A,j,a,w);let $=document.createElement("button");$.type="button",$.className="gc-card",$.setAttribute("aria-label",m.title||`Image ${A+1}`);let N=document.createElement("span");N.className="gc-card-media",m.src&&a.popupImage!==!1&&(N.append(Jt(m)),$.append(N));let P=document.createElement("span");if(P.className="gc-card-copy",j.caption!==!1&&a.showTitles&&m.title){let S=document.createElement("span");S.className="gc-card-title",S.textContent=m.title,P.append(S)}if(j.description&&m.description){let S=document.createElement("span");S.className="gc-card-description",S.textContent=$o(m.description),P.append(S)}return P.childNodes.length&&$.append(P),$.addEventListener("click",()=>w(m,A)),$}let y=matchMedia("(prefers-reduced-motion: reduce)"),C=matchMedia("(max-width: 660px)");function p(){let m={...Nt(t,a),reducedMotion:a.reducedMotion||y.matches};return C.matches&&(a.mobileCardWidth!=null&&(m.cardWidth=a.mobileCardWidth),a.mobileGap!=null&&(m[a.preset==="spiral"?"spiralGap":"gap"]=a.mobileGap)),m.phoneWidthOverride=C.matches&&a.mobileCardWidth!=null,a.preset==="stack"&&(m.stackCardWidth=C.matches&&a.mobileCardWidth!=null?a.mobileCardWidth:Math.max(360,a.cardWidth*2.2)),m}function f(){t.classList.toggle("gc-hide-controls",a.showControls===!1);let m=Nt(t,a);ja(t,m),t.style.setProperty("--gc-fit",a.fit),t.style.setProperty("--gc-card-radius",a.radius+"px"),Ia(t,m)}function M(m=0){b(),s?.destroy(),s=null,r?.restore(),cancelAnimationFrame(g),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let A=Ua(a.preset);A!==x&&(u?.(),u=_a(a.preset),x=A),f(),t.setAttribute("aria-label",a.previewScroll===!1?"Gallery":"Gallery preview");let j=r&&a.preset!=="spiral"?r:null;j?j.begin():r&&r.track.classList.add("gc-native-items-hidden");let $={host:t,items:e,openPost:w,initialIndex:m,nativeList:j,attachDialog:N=>Qt(t,N),options:p(),makeCard:d,loadImage:Lt,onChange(N){o=N,a.onChange?.(N)}};if(!e.length){let N=document.createElement("p");N.className="gc-empty",N.textContent="Add images to your source to start exploring.",t.append(N);return}a.preset==="spiral"?s=ba($):a.preset==="stack"?s=wi($):["wall","ring","angled"].includes(a.preset)?(s=vi($),m&&s.goTo(m)):s=bi($),a.preset!=="spiral"&&(g=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(N=>{Lt(N,{nativeCard:!!j})})))}let H=()=>M(o);function I(){a.mobileCardWidth==null&&a.mobileGap==null||(s?.setGeometry?s.setGeometry(p()):a.preset==="spiral"?s?.update(p()):M(o))}try{M()}catch(m){throw u?.(),r?.restore(),m}return y.addEventListener("change",H),C.addEventListener("change",I),{update(m){let A=a.preset,j=p();a=jt(a,m);let $=p(),N=Object.keys($).filter(S=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(S)&&$[S]!==j[S]);if(!N.length)return;if(s?.setGeometry&&N.every(S=>["cardWidth","gap","phoneWidthOverride"].includes(S))){s.setGeometry($);return}let P=S=>["colorSource","typeSource","background","ink","accent"].includes(S);if(N.every(S=>P(S)||A!=="spiral"&&(S==="radius"||Object.hasOwn(Zt,S)))){f(),N.includes("typeSource")&&r?.setType(a.typeSource);return}A==="spiral"&&a.preset==="spiral"&&s?.update?(f(),s.update($)):M(A===a.preset?o:0)},goTo(m){s?.goTo?.(m)},setPlaying(m){a.autoplay=m,s?.setPlaying?.(m)},getOptions(){return{...a}},getActive(){return o},destroy(){b(),cancelAnimationFrame(g),s?.destroy(),r?.restore(),y.removeEventListener("change",H),C.removeEventListener("change",I),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),u?.()}}}function Wo(t,e){let i=e.closest("section")||e,r=[];for(let a=t.parentElement;a;a=a.parentElement){let s=ke.scrollBoundaries.get(a)||0;if((s||["hidden","auto","scroll","overlay"].includes(getComputedStyle(a).overflowY))&&(ke.scrollBoundaries.set(a,s+1),a.classList.add("gc-stack-page-scroll"),r.push(a)),a===i)break}return()=>{for(let a of r){let s=ke.scrollBoundaries.get(a)-1;s?ke.scrollBoundaries.set(a,s):(ke.scrollBoundaries.delete(a),a.classList.remove("gc-stack-page-scroll"))}}}function dt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function ei(t){if(!ke.editListeners?.size){ke.editListeners=new Set;let e=dt();ke.editObserver=new MutationObserver(()=>{let i=dt();if(i!==e){e=i;for(let r of ke.editListeners)try{r(i)}catch(a){console.warn("Gallery Studio: could not resume a list layout.",a)}}});for(let i of[document.body,document.documentElement])ke.editObserver.observe(i,{attributes:!0,attributeFilter:["class"]})}return ke.editListeners.add(t),()=>{ke.editListeners.delete(t),ke.editListeners.size||ke.editObserver.disconnect()}}function ti({selector:t,type:e="gallery",options:i={}}={}){let r=t;if(typeof t=="string")try{let k=document.querySelectorAll(t);if(k.length!==1)return null;r=k[0]}catch{return null}if(!r?.isConnected||typeof r.closest!="function")return null;let a=mt(r,e);if(!a)return null;let{source:s}=a,n=ke.mounts.get(s);if(n)return n.instance.update(i),n;if(!lt(s,e).length)return null;let c=document.createElement("div"),o=document.createElement("div");c.className="gc-embed",o.className="gc-viewport-slot",o.append(c);let g={...jt(nt,i),previewScroll:!1},x=null,u=null,b=null,w=null,d=null,y=!1,C=[],p=null,f=!1,M=null;function H(){g.galleryWidth==="source"?(b?.(),b=null,p&&(o.classList.add("user-items-list-simple"),o.dataset.layoutWidth=p.mode,o.style.maxWidth=p.maximum)):b||(o.classList.remove("user-items-list-simple"),delete o.dataset.layoutWidth,o.style.removeProperty("max-width"),b=Aa(o,c,s,e))}function I(){return e!=="list"&&g.preset!=="stack"&&g.galleryHeight!=="custom"&&!!s.closest(".fluid-engine > .fe-block")}function m(){I()?w||(w=Ca(o,c,s)):(w?.(),w=null)}function A(k){k==="stack"?u||(u=Wo(c,s)):u&&(u(),u=null)}function j(){try{x?.destroy()}finally{x=null,w?.(),w=null,A(null),b?.(),b=null,C.forEach(k=>k.classList.remove("gc-native-items-hidden")),C=[],M?.remove(),M=null,o.remove(),o.replaceChildren(c),c.inert=!1}}function $(){if(y||x||!s.isConnected)return;let k=mt(s,e),R=lt(s,e);if(!k||!R.length)return;k.originals[0].before(o),_a();let z=k.originals[0];p=e==="list"?{mode:z.dataset.layoutWidth||"full",maximum:z.style.maxWidth}:null,H();let Y=null;if(e==="list"){let ae=f?z.cloneNode(!0):z;f&&(M=ae,ae.removeAttribute("id"),ae.querySelectorAll("[id]").forEach(le=>le.removeAttribute("id")),o.append(ae)),Y=ka(o,ae,f?[...ae.querySelectorAll(".list-item")]:k.rows)}(!Y||f)&&(C=k.originals,C.forEach(ae=>ae.classList.add("gc-native-items-hidden"))),m(),A(g.preset),x=Xa(c,R,g,Y),c.inert=f}function N(){if(!y){y=!0,s.classList.remove("gc-edit-preview");try{j()}finally{d?.(),ke.mounts.delete(s)}}}let S={instance:{update(k={}){if(y)return;let R=g.galleryWidth;g={...jt(g,k),previewScroll:!1},x&&(g.galleryWidth!==R&&H(),m(),A(g.preset),x.update(g))},setEditPreview(k){if(!(y||!dt()||k===f)){if(f=k,s.classList.toggle("gc-edit-preview",k),!k){j();return}try{$()}catch(R){throw this.setEditPreview(!1),R}}},goTo(k){x?.goTo(k)},setPlaying(k){g.autoplay=k,x?.setPlaying(k)},getOptions(){return{...g}},getActive(){return x?.getActive()??0},destroy:N},host:c,source:s,destroy:N};try{d=ei(k=>{if((f||k)&&j(),f=!1,s.classList.remove("gc-edit-preview"),!k)try{$()}catch(R){throw j(),R}}),dt()||$(),ke.mounts.set(s,S)}catch(k){throw N(),k}return S}var bt,nt,ke,ii=J(()=>{Rt();mi();yi();xi();ki();ya();St();Kt();Sa();Ma();Ea();za();qa();Fa();Ra();$a();Oa();Ha();pa();sa();la();ia();bt=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],nt={...vt,...Zt,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};ke=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:Xa,embed:ti,presets:bt}});var Va,Ya=J(()=>{Va=`:host {
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
`});function Z(t,e,i){let r=document.createElement(t);return e&&(r.className=e),i!==void 0&&(r.textContent=i),r}function Le(t,e,i){let r=Z("button",t,e);return r.type="button",i&&r.setAttribute("aria-label",i),r}function Ja(t){let e=Z("span","select-box");return e.append(t),e}function je(t,e,i,r,a,s=""){return{key:t,label:e,type:"range",min:i,max:r,step:a,unit:s}}function Ye(t,e,i){return{key:t,label:e,type:"select",choices:Object.entries(i).map(([r,a])=>({value:r,label:a}))}}function pt(t,e,i){return{key:t,label:e,type:"color",when:i,independent:!0}}function ai(t,e){let i=t.preset,r=et(i),a=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},je("cardWidth","Card width",80,i==="timed"?960:i==="spiral"?720:560,1,"px"),je("stageHeight",r?"Minimum gallery height":"Gallery height",r?0:300,1200,1,"px")];if(e!=="list"&&(a.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&a.splice(a.findIndex(o=>o.key==="stageHeight"),1)),i==="spiral")a.push(...ut);else if(a.push(je("gap","Spacing",0,100,1,"px")),i!=="infinite"&&i!=="timed"){let o={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[i]||"Depth";a.push(je("depth",o,0,100,1))}let s=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":i==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];(i==="arc-tabs"||i==="timed")&&s.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),i!=="stack"&&(s.push({key:"showControls",label:"Show controls",type:"checkbox"}),s.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),i!=="spiral"&&s.push({...je("duration","Time per image",2,15,.5,"s"),when:["autoplay",!0]})),s.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"});let n=qt.has(i),c=[{title:"Size & spacing",fields:a},{title:"Mobile overrides",fields:[{...a.find(o=>o.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...a.find(o=>o.key===(i==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:i==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:s},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:Bo},...i==="spiral"?[je("spiralRadius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),pt("spiralRim","Border color")]:[je("radius","Corner radius",0,64,1,"px"),je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(i)?[Ye("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),pt("backColor","Back color",["backFace","solid"])]:[],...i==="stack"?[]:[Ye("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...je("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],...n?[]:[{key:"showTitles",label:"Show titles",type:"checkbox"}],{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...i==="stack"?[]:[{title:"Control styling",fields:[je("controlSize","Button size",44,72,1,"px"),Ye("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),Ye("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),Ye("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),pt("controlFill","Button background",["controlPalette","custom"]),pt("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[...n?[je("titleSize","Title size",0,4,.05,"rem")]:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(o=>({value:o,label:o+" rem"}))]}],Ye("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),Ye("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),pt("titleColor","Custom title color",["titlePalette","custom"])]},...n?ui({range:je,select:Ye,swatch:pt}):[]];if(n)for(let o of c)o.fields=o.fields.flatMap(g=>{if(g.type!=="color"||!xt.includes(g.key))return[g];let x=g.when||(g.independent?void 0:["colorSource","custom"]);return[{...Ye(g.key+"Swatch",g.label+" palette",{custom:"Custom",...Ft}),type:"palette",when:x},{...g,when:x,customFor:g.key+"Swatch"},{...je(g.key+"Opacity",g.label+" opacity",0,100,1,"%"),when:x}]});return c}function Ka(t){return{...nt,stageHeight:et(t.preset??nt.preset)?0:590,...t.preset==="spiral"?Xe:{},colorSource:"section",typeSource:"native",...t}}function Ho(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",i=t.name?.trim()||e,r=t.items?.length||0;return`${i.toLowerCase().includes(e.toLowerCase())?i:`${i} \xB7 ${e}`} \xB7 ${r} ${r===1?"item":"items"}`}function Go(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let i=e.ownerDocument,r=i.defaultView,a=0;function s(){a=0;let g=e.getBoundingClientRect();if(!g.width||!g.height||!e.offsetHeight)return;let x=g.height/e.offsetHeight,u=t.getBoundingClientRect(),b=g.width/e.offsetWidth,w=Math.min(g.bottom,r.innerHeight),d=w;for(let y of[.1,.5,.9]){let C=g.left+(u.left+u.width*y)*b,p=i.elementFromPoint(C,w-2);if(!(!p||p===e))for(;p&&!p.contains(e);){let f=p.getBoundingClientRect();f.bottom>=w-2&&f.height>0&&f.height<g.height/2&&(d=Math.min(d,f.top)),p=p.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((g.bottom-d)/x))+"px")}function n(){a||(a=requestAnimationFrame(s))}let c=new ResizeObserver(n);c.observe(e),c.observe(i.documentElement);let o=new MutationObserver(n);return o.observe(i.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),r.addEventListener("resize",n),r.addEventListener("transitionend",n),s(),()=>{c.disconnect(),o.disconnect(),r.removeEventListener("resize",n),r.removeEventListener("transitionend",n),cancelAnimationFrame(a)}}function Za({source:t,options:e,onPreset:i,onOption:r,onClose:a,onRestore:s,onSave:n,getSaveState:c,getCode:o,getStyle:g,applyStyle:x}){let u=document.activeElement,b=t,w=Ka(e),d=!1,y=!1,C=0,p=new Map,f=new Map,M=Z("div");M.setAttribute("data-gc-author-panel",""),M.setAttribute("data-lenis-prevent",""),M.addEventListener("wheel",L=>L.stopPropagation(),{passive:!0}),M.addEventListener("touchmove",L=>L.stopPropagation(),{passive:!0});let H=M.attachShadow({mode:"open"}),I=Z("style");I.textContent=Va;let m=Z("aside","panel");m.setAttribute("aria-labelledby","gc-author-heading");let A=Z("header","header"),j=Z("div","heading"),$=Z("h2","","Gallery settings");$.id="gc-author-heading";let N=Z("p","target"),P=Z("p","save-state");P.setAttribute("role","status"),j.append($,N,P);function S(L=c()){P.textContent!==L&&(P.textContent=L,P.dataset.saved=String(L==="Saved to page"))}let k=Z("div","header-actions"),R=Le("icon-button","\u2212","Minimize settings");R.setAttribute("aria-controls","gc-author-controls"),R.setAttribute("aria-expanded","true");let z=Le("icon-button","\xD7","Close settings");k.append(R,z),A.append(j,k);let Y=Z("div","controls");Y.id="gc-author-controls";let ae=Z("div","scroll");ae.tabIndex=0,ae.setAttribute("aria-label","Layout settings");let le=Z("label","preset-row"),he=Z("select","preset-select");he.setAttribute("aria-label","Layout");for(let L of bt.filter(T=>t.type==="list"||T.id!=="stack")){let T=Z("option","",L.name);T.value=L.id,he.append(T)}le.append(Z("span","field-label","Layout"),Ja(he));let ze=Z("div","groups"),B=Z("div","style-actions"),W=Le("text-button","Copy style"),U=Le("text-button","Paste style");B.append(W,U);let K=Z("div","style-transfer");K.hidden=!0;let _=Z("textarea");_.setAttribute("aria-label","Gallery style"),_.spellcheck=!1;let ee=Le("secondary","Apply style"),de=Le("text-button","Close","Close style transfer"),O=Z("p","field-error","Paste a gallery style created with Copy style.");O.id="gc-style-error",O.hidden=!0,O.setAttribute("role","alert");function Q(){O.hidden=!0,_.removeAttribute("aria-invalid"),_.removeAttribute("aria-describedby")}_.addEventListener("input",Q),K.append(_,O,ee,de),ae.append(le,B,K,ze);let me=Z("footer","footer"),pe=Z("div","export-actions"),te=Le("primary","Save to page"),ie=Le("secondary","Copy code"),V=Le("text-button","Download header backup");V.hidden=!0;let fe=null,ue=Le("secondary","View code");ue.setAttribute("aria-expanded","false"),ue.setAttribute("aria-controls","gc-author-code"),pe.append(te,ie);let ve=Z("div","code-view");ve.id="gc-author-code",ve.hidden=!0;let Te=Z("label","code-label","Page Header Code Injection"),X=Z("textarea");X.readOnly=!0,X.spellcheck=!1,X.setAttribute("aria-label","Page header code"),Te.append(X),ve.append(Te);let qe=Z("div","footer-line"),G=Z("span","status");G.setAttribute("role","status");let We=Le("text-button","Reset preview");qe.append(G,We);let se=Z("div","backup-actions"),Ie=Le("text-button","Remove layout");Ie.hidden=c()==="Not saved yet",se.append(ue,V,Ie);let be=Z("div","removal");be.hidden=!0,be.append(Z("p","","Restore the native "+b.name+" and remove its saved layout from this page?"));let we=Le("secondary","Keep layout"),Ce=Le("secondary","Remove saved layout");be.append(we,Ce),me.append(pe,se,ve,be,qe),Y.append(ae,me),m.append(A,Y),H.append(I,m),document.body.append(M);let He=Go(M);function Me(L){let{definition:T,input:oe,output:l,row:h}=L,v=w[T.key];if(T.when&&(h.hidden=w[T.when[0]]!==T.when[1]),T.type==="palette"){for(let E of oe.children)E.setAttribute("aria-pressed",String(E.value===v));return}if(T.customFor&&w[T.customFor]!=="custom"){h.hidden=!0;return}if(T.type==="checkbox"){oe.checked=!!v;return}if(T.type==="range"){let E=T.key==="spiralRise"&&w.spiralRiseUnit==="percent"?{...T,...T.percent}:T;oe.min=String(E.min),oe.max=String(E.max),oe.step=String(E.step);let D=T.inherits&&v==null;L.enable&&(L.enable.checked=!D,oe.disabled=!!D),oe.value=String(D?w[T.inherits]:v);let F=["descriptionSize","popupPadding","titleSize","stageHeight"].includes(E.key)&&E.min===0&&Number(oe.value)===0?"Auto":`${oe.value}${E.unit||""}`;l.textContent=D?`Inherit \xB7 ${F}`:F,oe.setAttribute("aria-valuetext",F);return}oe.value=String(v),T.type==="color"&&(T.independent||(h.hidden=w.colorSource==="section"),l.textContent=oe.value.toUpperCase())}function Fe(){S(),C+=1,G.textContent="",ve.hidden||(X.value=o())}function Ve(L,T){let oe=w.spiralRiseUnit;if(w={...w,[L]:T},L==="spiralRiseUnit"&&oe!==T){let l=Math.max(1,w.stageHeight),h=T==="percent"?Math.max(1,Math.min(30,Math.round(w.spiralRise/l*1e3)/10)):Math.max(8,Math.min(280,Math.round(w.spiralRise*l/100)));w.spiralRise=h,r(L,T),r("spiralRise",h),Me(p.get("spiralRise"))}else r(L,T);L==="galleryHeight"&&(it(),p.get(L).input.focus({preventScroll:!0})),L==="colorSource"?p.forEach(Me):Me(p.get(L));for(let l of p.values())(l.definition.inherits===L||l.definition.when?.[0]===L||l.definition.customFor===L)&&Me(l);Fe()}function tt(L){let{key:T,label:oe,type:l}=L,h=Z(L.inherits||l==="palette"?"div":"label",`field field-${l}`),v=Z("span","field-label",oe);if(l==="palette"){let F=Z("div","palette-chips"),re=getComputedStyle(b.root);F.setAttribute("role","group"),F.setAttribute("aria-label",oe);for(let ne of L.choices){let ge=Le("palette-chip",ne.value==="custom"?"+":"",ne.label);ge.value=ne.value,ge.title=ne.label;let xe=re.getPropertyValue("--"+ne.value+"-hsl").trim();xe?ge.style.backgroundColor="hsl("+xe+")":ne.value!=="custom"&&(ge.textContent=ne.label),ge.addEventListener("click",()=>Ve(T,ne.value)),F.append(ge)}h.append(v,F);let ce={definition:L,row:h,input:F};return p.set(T,ce),Me(ce),h}let E=Z(l==="select"?"select":"input");if(E.setAttribute("aria-label",oe),E.dataset.option=T,l==="select")for(let F of L.choices){let re=Z("option","",F.label);re.value=F.value,E.append(re)}else E.type=l;let D;(l==="range"||l==="color")&&(D=Z("output","value"),D.setAttribute("aria-hidden","true")),h.append(v),D&&h.append(D),h.append(l==="select"?Ja(E):E);let q={definition:L,input:E,output:D,row:h};if(L.inherits){let F=Z("input");F.type="checkbox",F.setAttribute("aria-label","Customize "+oe.toLowerCase());let re=Z("label","override-toggle");re.append(F,v),h.prepend(re),q.enable=F,F.addEventListener("change",()=>Ve(T,F.checked?w[L.inherits]:null))}return p.set(T,q),Me(q),E.addEventListener(l==="range"||l==="color"?"input":"change",()=>{let F=l==="range"||L.numeric?Number(E.value):l==="checkbox"?E.checked:E.value;Ve(T,F)}),h}function it(){let L=new Map([...f].map(([T,oe])=>[T,oe.open]));p.clear(),f.clear(),ze.replaceChildren();for(let T of ai(w,b.type)){let oe=Z("details","group");oe.open=L.get(T.title)??T.title==="Size & spacing";let l=Z("summary","",T.title),h=Z("div","group-body");for(let v of T.fields)h.append(tt(v));oe.append(l,h),ze.append(oe),f.set(T.title,oe)}}function De(L){if(y)return;let T=w.preset;b=L.source??b,L.options&&(w=Ka(L.options)),N.textContent=Ho(b),N.title=b.selector||N.textContent,he.value=w.preset,!p.size||T!==w.preset?it():p.forEach(Me),Fe()}function Ae(L){ve.hidden=!L,ue.textContent=L?"Hide code":"View code",ue.setAttribute("aria-expanded",String(L)),L&&(X.value=o(),X.focus({preventScroll:!0}),X.select())}function Ee(){if(y)return;y=!0,C+=1;let L=document.activeElement===M;document.removeEventListener("keydown",Ne),He(),M.remove(),L&&u?.isConnected&&u.focus({preventScroll:!0})}function Oe(L){if(!y)try{L()}finally{Ee()}}function Ne(L){if(!(L.key!=="Escape"||L.defaultPrevented||L.isComposing)){if(!be.hidden){L.preventDefault(),ye(!1);return}document.querySelector("dialog[open]")||L.composedPath().some(T=>T?.getAttribute?.("aria-modal")==="true")||(L.preventDefault(),!K.hidden&&(K.contains(H.activeElement)||ve.hidden)?(K.hidden=!0,(_.readOnly?W:U).focus()):ve.hidden?Oe(a):(Ae(!1),ue.focus()))}}R.addEventListener("click",()=>{d=!d,Y.hidden=d,M.toggleAttribute("data-minimized",d),R.textContent=d?"+":"\u2212",R.setAttribute("aria-expanded",String(!d)),R.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),z.addEventListener("click",()=>Oe(a)),We.addEventListener("click",()=>Oe(s)),he.addEventListener("change",()=>i(he.value)),ue.addEventListener("click",()=>Ae(ve.hidden));function Je(L,T){Q(),K.hidden=!1,ee.hidden=L,_.readOnly=L,_.value=T,_.placeholder=L?"":"Paste the copied gallery style",_.focus(),L&&_.select()}W.addEventListener("click",async()=>{let L=g();try{await navigator.clipboard.writeText(L),y||(K.hidden=!0,G.textContent="Style copied")}catch{if(y)return;Je(!0,L),G.textContent="Style selected. Choose Copy."}}),U.addEventListener("click",()=>{G.textContent="",Je(!1,"")}),de.addEventListener("click",()=>{K.hidden=!0,(_.readOnly?W:U).focus()}),ee.addEventListener("click",()=>{if(!x(_.value)){O.hidden=!1,_.setAttribute("aria-invalid","true"),_.setAttribute("aria-describedby",O.id),_.focus();return}K.hidden=!0,G.textContent="Style applied to this preview",U.focus()}),V.addEventListener("click",()=>{if(!fe)return;let L=URL.createObjectURL(new Blob([fe.header],{type:"text/plain"})),T=document.createElement("a");T.href=L,T.download="gallery-header-backup-"+fe.collectionId+".txt",T.click(),setTimeout(()=>URL.revokeObjectURL(L),1e3)});async function Ge(L=!1){if(L&&ye(!1),!te.disabled){te.disabled=We.disabled=Ie.disabled=!0,ae.inert=!0,te.textContent="Saving\u2026",S(L?"Removing\u2026":"Saving\u2026"),G.textContent=L?"Removing layout\u2026":"Saving to page header\u2026";try{await n(T=>{fe=T,y||(V.hidden=!1)},L),y||(G.textContent="Saved to page header")}catch(T){y||(G.textContent=T.message||"Save failed. Copy code is still available.")}finally{y||(te.disabled=We.disabled=Ie.disabled=!1,Ie.hidden=c()==="Not saved yet",ae.inert=!1,te.textContent="Save to page",S())}}}te.addEventListener("click",()=>Ge());function ye(L){be.hidden=!L,ae.inert=L,pe.hidden=se.hidden=qe.hidden=L,L?(Ae(!1),we.focus()):Ie.focus()}return Ie.addEventListener("click",()=>ye(!0)),we.addEventListener("click",()=>ye(!1)),Ce.addEventListener("click",()=>Ge(!0)),ie.addEventListener("click",async()=>{let L=++C,T=o();try{await navigator.clipboard.writeText(T),!y&&L===C&&(G.textContent="Page code copied")}catch{if(y||L!==C)return;Ae(!0),G.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Ne),De({source:t,options:e}),he.focus({preventScroll:!0}),{element:M,update:De,destroy:Ee}}var Bo,Qa=J(()=>{Rt();ii();Ya();Bo=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var to,eo=J(()=>{to=`.gc-config-position{position:relative!important}
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
`});var ro={};si(ro,{startInline:()=>oi});function gt(t,e={}){let i=It.get(t),r={...nt,...t==="spiral"?Xe:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:i.width,stageHeight:et(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,s]of Object.entries(e))a==="mobileCardWidth"||a==="mobileGap"?Number.isFinite(s)&&s>=0&&(r[a]=s):a!=="preset"&&Object.hasOwn(r,a)&&typeof s==typeof r[a]&&(r[a]=s);return r}function oo(t){return ai(t).flatMap(e=>e.fields).filter(e=>!ao.has(e.key))}function _o(t){let e=Object.fromEntries(oo(t).map(({key:i})=>[i,t[i]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Xo(t,e){let i;try{i=JSON.parse(t)}catch{return null}if(i?.format!=="gallery-studio-style"||i.version!==1||!It.has(i.preset)||!i.values||typeof i.values!="object"||Array.isArray(i.values))return null;let r=gt(i.preset);for(let a of ao)r[a]=e[a];for(let a of oo(r)){let s=i.values[a.key];if(s!==void 0){if(a.type==="range"){if(a.inherits&&s===null)continue;let n=a.percent&&i.values.spiralRiseUnit==="percent"?a.percent:a;if(!Number.isFinite(s)||s<n.min||s>n.max)return null}else{if(a.type==="checkbox"&&typeof s!="boolean")return null;if(["select","palette"].includes(a.type)&&!a.choices.some(n=>n.value===s))return null}if(a.type==="color"&&!/^#[0-9a-f]{6}$/i.test(s))return null;r[a.key]=s}}return r}function Yo(t){return gt(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function zt(t,e){let i=gt(e.preset),r={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};et(e.preset)&&(r.stageHeight=e.stageHeight);for(let s of Object.keys(i))e.colorSource==="section"&&io.has(s)||e[s]!==i[s]&&(r[s]=e[s]);let a={v:1,selector:t.selector,type:t.type,options:r};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(a,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function oi(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let i=xa(),r=new Map(i.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),a=null,s=null,n=null,c=!1,o=[];function g(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=ti({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function x(d=!0){if(!s)return;let y=s;s=null,a?.destroy(),a=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function u(d){x(),d.presets.clear(),d.installed?g(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function b(d){if(s===d){x();return}x(!1);let{source:y}=d;if(d.mounted||(y.items=lt(y.root,y.type)),!y.items.length){let f="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=f,d.button.setAttribute("aria-label",f);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+y.name+" layout");let C=d.options||d.installed||gt("arc-tabs",y.type!=="list"?{galleryWidth:"source"}:{});if(y.type!=="list"&&C.preset==="stack"&&(C=gt("arc-tabs",{galleryWidth:"source"}),g(d,C)),!d.mounted&&!g(d,C)){d.button.textContent="No supported layout here";return}s=d;let p=f=>{g(d,f),d.presets.set(f.preset,{...f})};a=Za({source:y,options:{...d.options},onClose:()=>x(),onRestore:()=>u(d),onPreset:f=>{!It.has(f)||y.type!=="list"&&f==="stack"||(d.presets.set(d.options.preset,{...d.options}),p({...d.presets.get(f)||gt(f),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),a.update({source:y,options:{...d.options}}))},onOption:(f,M)=>{if(!Object.hasOwn(d.options,f)||f==="preset")return;let H={...d.options,[f]:M};p(H)},getSaveState:()=>d.installed?zt(y,d.options)===zt(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>zt(y,d.options),onSave:async(f,M=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let H={...d.options},I=di();c=!0;try{await pi({snippet:zt(y,H),context:I,onBackup:f,remove:M}),M?(d.installed=null,s===d?u(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=H}finally{c=!1}},getStyle:()=>_o(d.options),applyStyle:f=>{let M=Xo(f,d.options);return!M||y.type!=="list"&&M.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),p(M),a.update({source:y,options:d.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),C=document.querySelectorAll(y.selector),p=C.length===1&&r.get(C[0]);if(!p||y.v!==1||y.type!==p.source.type||!It.has(y.options?.preset))continue;p.installed=Yo(y.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of r.values())d.installed&&g(d,d.installed);if(t&&r.size){let y=function(f=!1){d.setAttribute("aria-pressed",String(f)),d.querySelector("span").textContent=f?"Edit native content":"Preview galleries",d.hidden=!dt()||![...r.values()].some(M=>M.mounted)},C=function(f){if(!f.mounted||f.source.root.isConnected)return;let M=f.source.root,H=document.querySelectorAll(f.source.selector);if(H.length!==1)return;let I=H[0];f.mounted.destroy(),f.mounted=null,f.source.root=I,r.delete(M),r.set(I,f),g(f,f.options);let m=I.querySelector(f.source.type==="list"?".user-items-list":".sqs-block-content")||I;f.button&&(getComputedStyle(m).position==="static"&&m.classList.add("gc-config-position"),m.append(f.button))};n=document.createElement("style"),n.textContent=to,document.head.append(n);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let f=d.getAttribute("aria-pressed")!=="true";for(let M of[...r.values()])C(M),M.mounted?.instance.setEditPreview(f);y(f)},document.body.append(d),y();let p=ei(f=>{f||requestAnimationFrame(()=>{if(d.isConnected)for(let M of[...r.values()])C(M)}),y()});o.push(()=>{p(),d.remove()});for(let f of r.values()){let{source:M}=f;if(!M.selector)continue;let H=M.root.querySelector(M.type==="list"?".user-items-list":".sqs-block-content")||M.root,I=getComputedStyle(H).position==="static";I&&H.classList.add("gc-config-position");let m=document.createElement("button");m.type="button",m.className="gc-config-launch",m.setAttribute("aria-expanded","false"),m.setAttribute("aria-label","Configure "+M.name+" layout"),m.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',m.addEventListener("click",()=>b(f)),H.append(m),f.button=m,o.push(()=>{m.remove(),I&&H.classList.remove("gc-config-position")})}}let w={version:1,destroy(){x(!1);for(let d of r.values())d.mounted?.destroy();for(let d of o)d();n?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=w,w}var It,io,ao,no=J(()=>{gi();ii();Kt();Qa();eo();It=new Map(bt.map(t=>[t.id,t])),io=new Set(["background","ink","accent","borderColor","overlayColor"]);ao=new Set([...io,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",oi,{once:!0}):oi()});var Vo;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(Vo=(await Promise.resolve().then(()=>(no(),ro))).startInline);export{Vo as startInline};

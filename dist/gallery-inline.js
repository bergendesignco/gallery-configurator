var Qa=Object.defineProperty;var Y=(t,e)=>()=>(t&&(e=t(t=0)),e);var ei=(t,e)=>{for(var i in e)Qa(t,i,{get:e[i],enumerable:!0})};function ii(t,e){if(t===void 0)return null;let i=new Map([...t.matchAll(er)].map(a=>[a[1].toLowerCase(),a[2]??a[3]??a[4]??""]));if(!i.has("data-gallery-layout"))return null;if(i.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let n;try{n=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(n?.v!==1||typeof n.selector!="string"||!["list","gallery","summary"].includes(n.type)||!n.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return n}function tr(t,e,i=!1){let n=[...e.matchAll(ti)];if(n.length!==1||n[0][0]!==e.trim())throw Error("Invalid gallery settings.");let a=ii(n[0][1],n[0][2]);if(!a)throw Error("Missing gallery settings.");let s=!1,r=t.replace(ti,(c,o,f)=>{let x=ii(o,f);return!x||x.selector!==a.selector?c:i||s?"":(s=!0,e)});return i||s?r:r+(r&&!r.endsWith(`
`)?`
`:"")+e+`
`}function ai(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,i=e?.collection?.id,n=e?.website?.id,a=t.document.cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("crumb="))?.slice(6);if(!yt.test(i||"")||!yt.test(n||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!a)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:i,websiteId:n,crumb:decodeURIComponent(a)}}async function ri({snippet:t,context:e,remove:i=!1,fetchImpl:n=fetch,onBackup:a=()=>{}}){let{collectionId:s,websiteId:r,crumb:c}=e;if(!yt.test(s||"")||!yt.test(r||"")||!c)throw Error("A signed-in Squarespace page is required.");async function o(){let y=await n("/api/commondata/GetCollectionSettings?collectionId="+s,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let M=await y.json(),p=M.collectionData??M;if(p?.id!==s||p.websiteId!==r||p.deleted===!0||p.folder===!0||p.dropdown===!0)throw Error("Page settings do not match this page.");if(p.headerInjectCode!=null&&typeof p.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:p,memberAreaData:M.memberAreaData??{}}}let f=await o();if(f.model.passwordProtected&&typeof f.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let x=f.model.headerInjectCode??"",u=tr(x,t,i);if(u===x)return{unchanged:!0};a({collectionId:s,header:x,savedAt:new Date().toISOString()});let m=await o();if(JSON.stringify(m)!==JSON.stringify(f))throw Error("Page settings changed while saving. Review the page and save again.");let w;try{w=await n("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...m.model,collectionId:s,headerInjectCode:u},memberAreaData:m.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!w.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await o()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==u.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var yt,ti,er,oi=Y(()=>{yt=/^[a-f0-9]{24}$/i,ti=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,er=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function ni(t,e){if(t.nodeType===Node.TEXT_NODE)return document.createTextNode(t.data);let i=document.createDocumentFragment();if(t.nodeType!==Node.ELEMENT_NODE||t.matches("script,style,template,noscript,iframe,form,svg"))return i;let n=t.localName,a=ir.has(n)?document.createElement(n):i;if(n==="a"||n==="img"){let s=n==="img"?"src":"href",r=n==="img"?t.dataset.src||t.getAttribute("src"):t.getAttribute("href"),c=r&&URL.canParse(r,e)?new URL(r,e):null;c&&["https:","http:"].includes(c.protocol)&&a.setAttribute(s,c.href),n==="img"&&(a.alt=t.alt,a.loading="lazy")}for(let s of t.childNodes)a.append(ni(s,e));return a}async function si(t,e){t.textContent="Loading post\u2026";try{let i=new URL(e.postUrl);if(i.origin!==location.origin)throw Error();let n=await fetch(i,{mode:"same-origin"});if(!n.ok)throw Error();let s=new DOMParser().parseFromString(await n.text(),"text/html").querySelector(".blog-item-content,article .entry-content,article .body");if(!s)throw Error();t.replaceChildren(ni(s,n.url))}catch{t.textContent="Open the full post using the link below."}}var ir,ci=Y(()=>{ir=new Set("p h1 h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td".split(" "))});function Tt(t){let e={previous:"m12.5 4-6 6 6 6",next:"m7.5 4 6 6-6 6"}[t],i=e?`<path class="gc-chevron" display="none" d="${e}"/>`:"";return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ar[t]}${i}</svg>`}function Ue(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Tt("play")+Tt("pause"):Tt(e),t}var ar,vt=Y(()=>{ar={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Pe(t,e,i){let n=document.createElement(t);return n.className=e,i!==void 0&&(n.textContent=i),n}function st(t,e,i){let n=Pe("button",t,i);return n.type="button",n.setAttribute("aria-label",e),n}function or(t,e,i,n,a,s){let r=i/2,c=n/2,o=.26,f=e/2+48,x=(i*Math.cos(o)+s)/(2*Math.sin(o)),u=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-a)*.7),i*(3.8-a*2.1),c+Math.max(x,f/Math.sin(Math.PI/3))),m=u-c,w=Math.atan2(r,m),d=Math.hypot(r,m),y=2*(w+Math.asin(s/(2*d))),M=w+Math.asin(f/d),p=u+c,h=Math.hypot(p,r)-p,v=m-Math.sqrt((m-f)*(m+f));return{radius:u,step:y,reach:M/y,above:h,below:v}}function nr(t,e,i){let n=e/2,a=10+i*9,s=0,r=0;for(let c=0;c<4.1;c+=.5){let o=Math.min(4.1,c+.5),f=Math.max(.48,1-c*(.09+i*.035)),x=(o*(4+i*7)+(c===0?4:0))*Math.PI/180,u=f*(n+t/2*Math.sin(x))-n;s=Math.max(s,u-Math.min(c,4)*a),r=Math.max(r,u+Math.min(o,4)*a)}return{above:s,below:r}}function li({host:t,items:e=[],initialIndex:i=0,options:n={},makeCard:a,onChange:s,nativeList:r,loadImage:c}){let o=rr.has(n.preset)?n.preset:"infinite",f=o==="arc"||o==="arc-tabs",x=f||o==="showcase",u=e.length,m=!!n.reducedMotion,w=Fe(at(n.depth,55),0,100)/100,d,y,M;function p(l){d=Fe(at(l.gap,24),0,180),y=Fe(at(l.cardWidth,o==="timed"?760:380),80,1800),M=l.phoneWidthOverride}p(n);let h=Fe(at(n.duration,5),1,60)*1e3,v=Pe("section",`gc-carousel gc-preset-${o}`);v.setAttribute("aria-roledescription","carousel"),v.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[o]),v.style.setProperty("--gc-card-radius",`${Fe(at(n.radius,14),0,120)}px`),v.style.setProperty("--gc-stage-height",`${Fe(at(n.stageHeight,0),0,1400)}px`),m&&v.classList.add("gc-reduced-motion");let O=[],T=(l,g,b,z)=>{l.addEventListener(g,b,z),O.push(()=>l.removeEventListener(g,b,z))},k=[],A=[],L=n.navigation==="dots"||n.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),C=o==="arc-tabs"||o==="timed"&&!L,E=Pe("nav","gc-carousel-tabs");L&&E.classList.add("gc-choice-dots"),E.setAttribute("aria-label","Choose a slide"),C&&(e.forEach((l,g)=>{let z=(typeof l.title=="string"?l.title.trim():"")||`Slide ${g+1}`,N=L?st("gc-choice-dot",z):st("gc-carousel-tab",z,z);T(N,"click",()=>qe(g)),T(N,"keydown",I=>{let U;I.key==="ArrowRight"&&(U=it(g+1,u)),I.key==="ArrowLeft"&&(U=it(g-1,u)),I.key==="Home"&&(U=0),I.key==="End"&&(U=u-1),U!==void 0&&(I.preventDefault(),qe(U),k[U]?.focus({preventScroll:!0}))}),E.append(N),k.push(N)}),v.append(E));let S=Pe("div","gc-carousel-stage");S.tabIndex=u?0:-1,S.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let F=r?.track??Pe("div","gc-carousel-track");F.classList.add("gc-carousel-track"),S.append(F),v.append(S);function j(l){let g=a(e[l],l,{caption:n.showTitles!==!1,description:o==="arc-tabs"||o==="timed"});g.classList.add("gc-carousel-card"),g.dataset.gcItemIndex=String(l),g.style.width="var(--gc-carousel-slot-width)",g.tabIndex=-1,g.setAttribute("aria-hidden","true"),r||g.querySelectorAll("img").forEach(z=>{z.draggable=!1,z.style.objectFit=n.fit==="contain"?"contain":"cover"});let b=r?.slot(g)??g;return F.append(b),{card:g,node:b,index:l,logical:l,active:!1}}let te=e.map((l,g)=>j(g)),R=new Map,ne=!1,ee=Pe("div","gc-carousel-controls"),se=Pe("div","gc-carousel-counter");se.setAttribute("aria-hidden","true");let he=Pe("span","gc-carousel-current",u?"01":"00");se.append(he,Pe("span","gc-carousel-divider","/"),Pe("span","gc-carousel-total",String(u).padStart(2,"0")));let Le=Pe("div","gc-carousel-arrows"),$=Ue(st("gc-carousel-arrow","Previous slide"),"previous"),W=Ue(st("gc-carousel-arrow","Next slide"),"next");$.disabled=W.disabled=u<2,Le.append($,W);let B=Ue(st("gc-carousel-playback","Play slideshow"),"playback");B.hidden=u<2||m;let J=Pe("div","gc-carousel-pagination");J.setAttribute("aria-label","Slide pagination"),o==="timed"&&e.forEach((l,g)=>{let b=st("gc-carousel-dot",l.title?.trim()||`Go to slide ${g+1}`),z=Pe("span","gc-carousel-dot-fill");z.setAttribute("aria-hidden","true"),b.append(z),T(b,"click",()=>qe(g)),J.append(b),A.push({dot:b,fill:z})}),ee.append(se,Le),o==="timed"&&ee.append(J),ee.append(B),v.append(ee);let V=Pe("p","gc-carousel-sr");V.setAttribute("aria-atomic","true"),v.append(V);let Z=Pe("span","gc-carousel-cursor","Drag");Z.setAttribute("aria-hidden","true"),(o==="arc-tabs"||o==="showcase"||o==="arc")&&S.append(Z),t.append(v);let ce=!1,H=i,X=i,pe=-1,le=0,ie=0,Q=0,G=!!n.autoplay&&!m&&u>1,me=!1,xe=!1,ve=!1,je=!1,D=null,ke=0,_=0,ze=0,re=0,Oe=()=>Math.max(12,re*(.36-w*.12)+d-28),Se=-1,Ae,be=1,He=0,Be=0,Ne=()=>je||me||xe||ve||document.hidden||!!D,tt=l=>{let g=it(Math.round(H),u),b=it(l-g,u);return b>u/2&&(b-=u),Math.round(H)+b};function Ve(){let l=k[pe];if(!l)return;let g=l.offsetLeft,b=g+l.offsetWidth;g<E.scrollLeft?E.scrollLeft=Math.max(0,g-14):b>E.scrollLeft+E.clientWidth&&(E.scrollLeft=b-E.clientWidth+14)}function Je(){let l=u?it(Math.round(H),u):-1;if(l===pe)return;pe=l,he.textContent=u?String(l+1).padStart(2,"0"):"00",k.forEach((b,z)=>{b.classList.toggle("is-active",z===l),b.setAttribute("aria-pressed",String(z===l))}),Ve(),A.forEach(({dot:b},z)=>{b.classList.toggle("is-active",z===l),z===l?b.setAttribute("aria-current","true"):b.removeAttribute("aria-current")});let g=e[l]?.title;V.textContent=u?`${l+1} of ${u}${g?`: ${g}`:""}`:"No gallery items",l>=0&&s?.(l)}function Re(){if(ce||!_)return;Je();let l=Math.abs(X-H)>.002;v.classList.toggle("is-moving",l||!!D);let g=[...te];for(let b of te)b.logical=b.index+Math.round((H-b.index)/u)*u;if(u>1){let b=re+d,z=o==="infinite"&&_>660?_*.61:_/2,N=(z+re/2+40)/b,I=(_-z+re/2+40)/b;f?N=I=Ae.reach:o==="showcase"&&(N=I=Math.min(4.1,(_/2+re)/Oe()));let U=Math.ceil(H-N),ge=Math.floor(H+I);for(let[de,ue]of R)(de<U||de>ge||te[ue.index].logical===de)&&(ue.node.remove(),R.delete(de));for(let de=U;de<=ge;de++){let ue=it(de,u);if(te[ue].logical===de)continue;let ye=R.get(de);ye||(ye=j(ue),ye.logical=de,R.set(de,ye),ne&&c&&ye.card.querySelectorAll("img").forEach(Me=>c(Me,{nativeCard:!!r}))),g.push(ye)}}g.forEach(b=>{let z=u===1?0:b.logical-H,N=Math.abs(z),I=b.logical===Math.round(H),U=_/2,ge=0,de=0,ue=1,ye=1,Me=!0,_e=0,$e=0;if(o==="infinite")U=(_>660?_*.61:_/2)+z*(re+d),ye=1-Math.min(1,N)*.68,Me=U+re/2>-40&&U-re/2<_+40;else if(o==="timed")U+=z*(re+d),ue=1-Math.min(N,1)*.035,Me=U+re/2>-40&&U-re/2<_+40;else if(o==="showcase")U+=z*Oe(),ge+=Math.min(N,4)*(10+w*9),ue=Math.max(.48,1-N*(.09+w*.035)),de=z*(4+w*7),$e=-z*(3+w*4),ye=Fe(1-N*.19,0,1),Me=N<4.1,I&&!m&&(_e=Be,$e+=He,de+=Fe(X-H,-1,1)*-3);else{let Ke=z*Ae.step;U+=Ae.radius*Math.sin(Ke),ge=Ae.radius*(1-Math.cos(Ke)),de=Ke*180/Math.PI,Me=N<=Ae.reach,ye=o==="arc-tabs"?1-Math.min(N,1)*.16:1}b.card.style.transform=`translate3d(${U}px,${ge}px,0) translateX(-50%) rotate(${de}deg) rotateX(${_e}deg) rotateY(${$e}deg) scale(${ue})`,b.card.style.zIndex=String(1e3-Math.round(N*100)),b.card.style.opacity=String(ye),b.card.style.visibility=Me?"visible":"hidden",b.card.style.pointerEvents=Me&&ye>.08?"auto":"none",b.active!==I&&(b.active=I,b.card.classList.toggle("is-active",I)),b.card.tabIndex=I?0:-1,b.card.setAttribute("aria-hidden",String(!I)),r?.syncFocus(b.card)}),A.forEach(({fill:b},z)=>{b.style.transform=`scaleX(${z===pe?Fe(Q/h,0,1):0})`})}function Te(){let l=_;_=S.clientWidth;let g=M?1:o==="timed"?.86:o==="infinite"&&_>660?.48:.76,b=Math.max(80,Math.min(y,_*g));if(b!==re&&(re=b,F.style.setProperty("--gc-carousel-slot-width",`${re}px`)),x){let z=F.offsetHeight;if(_!==l||z!==Se){Se=z,f&&(Ae=or(o,_,re,Se,w,d));let N=Ae??nr(re,Se,w);u>1&&(S.style.setProperty("--gc-sweep-above",Math.ceil(N.above)+"px"),S.style.setProperty("--gc-sweep-below",Math.ceil(N.below)+"px"))}}ze=S.clientHeight,be=f?Ae.radius*Ae.step:o==="showcase"?re*.54:re+d,Re()}function Ee(){!ce&&!le&&(le=requestAnimationFrame(Ge))}function Ge(l){if(le=0,ce)return;let g=ie?Fe(l-ie,0,64):0;ie=l,D||(m?H=X:H+=(X-H)*(1-Math.exp(-g/85)),Math.abs(X-H)<5e-4&&(H=X));let b=Math.abs(X-H)<.002&&!D;G&&!Ne()&&b&&(Q+=g,Q>=h&&(Q=0,X=Math.round(H)+1)),Re(),Math.abs(X-H)>5e-4||G&&!Ne()?Ee():ie=0}function qe(l){ce||u<2||(X=tt(it(Math.round(at(l,0)),u)),Q=0,m&&(H=X),Re(),Ee())}function De(l){u<2||(X=Math.round(X)+l,Q=0,m&&(H=X),Re(),Ee())}function P(l){G=!!l&&!m&&u>1,B.dataset.paused=String(!G),B.setAttribute("aria-label",G?"Pause slideshow":"Play slideshow"),B.setAttribute("aria-pressed",String(G)),V.setAttribute("aria-live",G?"off":"polite"),v.classList.toggle("is-playing",G),ie=0,Ee()}function q(l){je=!!l,ie=0,Ee()}T($,"click",()=>De(-1)),T(W,"click",()=>De(1)),T(B,"click",()=>P(!G)),T(S,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),S.focus({preventScroll:!0}),De(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),S.focus({preventScroll:!0}),qe(l.key==="Home"?0:u-1))}),T(S,"pointerdown",l=>{u<2||l.button!==0||!l.isPrimary||(D={id:l.pointerId,x:l.clientX,y:l.clientY,start:H,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},X=H,Q=0)}),T(S,"pointermove",l=>{let g=S.getBoundingClientRect(),b=g.width/Math.max(1,S.clientWidth)||1,z=(l.clientX-g.left)/b,N=(l.clientY-g.top)/b;if(Z.style.left=`${z}px`,Z.style.top=`${N}px`,l.pointerType==="mouse"&&S.classList.add("has-pointer"),!D){o==="showcase"&&!m&&(He=Fe((z-_/2)/re,-1,1)*4,Be=Fe((N-ze/2)/ze,-.5,.5)*-5,Re());return}if(l.pointerId!==D.id)return;let I=l.clientX-D.x,U=l.clientY-D.y;if(!D.axis&&Math.hypot(I,U)>6&&(D.axis=Math.abs(I)>Math.abs(U)?"horizontal":"vertical",D.axis==="horizontal"&&(S.setPointerCapture(l.pointerId),S.classList.add("is-dragging"))),D.axis!=="horizontal")return;l.preventDefault(),D.moved=!0;let ge=performance.now(),de=Math.max(8,ge-D.lastTime),ue=-(l.clientX-D.lastX)/b/be/de;D.velocity=D.velocity*.45+ue*.55,D.lastX=l.clientX,D.lastTime=ge,H=D.start-I/b/be,X=H,Re()},{passive:!1});function oe(l){if(!D||l.pointerId!==D.id)return;let g=D;if(D=null,S.hasPointerCapture(l.pointerId)&&S.releasePointerCapture(l.pointerId),S.classList.remove("is-dragging"),g.moved){ke=performance.now()+400;let b=performance.now()-g.lastTime,z=m||l.type==="pointercancel"||b>120?0:Fe(g.velocity*210,-4,4);X=Math.round(H+z)}else X=Math.round(H);m&&(H=X),Ee()}T(S,"pointerup",oe),T(S,"pointercancel",oe),T(window,"pointerup",oe),T(S,"lostpointercapture",l=>{D?.id===l.pointerId&&oe(l)}),T(S,"dragstart",l=>l.preventDefault()),T(S,"click",l=>{if(performance.now()<ke){l.preventDefault(),l.stopImmediatePropagation();return}let g=l.target.closest(".gc-carousel-card");!g||!S.contains(g)||g.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),qe(Number(g.dataset.gcItemIndex)))},!0),T(S,"pointerleave",()=>{S.classList.remove("has-pointer"),He=Be=0,D||Re()}),T(v,"pointerenter",l=>{l.pointerType==="mouse"&&(me=!0)}),T(v,"pointerleave",()=>{me=!1,ie=0,Ee()}),T(v,"focusin",()=>{xe=!0}),T(v,"focusout",()=>{queueMicrotask(()=>{ce||(xe=v.contains(document.activeElement),ie=0,Ee())})}),T(document,"visibilitychange",()=>{ie=0,Ee()});let ae;typeof ResizeObserver<"u"?(ae=new ResizeObserver(l=>{l.some(({target:g})=>g===S||g===F)&&Te(),C&&l.some(({target:g})=>g!==S&&g!==F)&&Ve()}),ae.observe(S),x&&ae.observe(F),C&&(ae.observe(E),k.forEach(l=>ae.observe(l,{box:"border-box"})))):T(window,"resize",()=>{Te(),Ve()});let fe;return typeof IntersectionObserver<"u"&&(fe=new IntersectionObserver(l=>{ve=!l[0]?.isIntersecting,ie=0,Ee()}),fe.observe(v)),Te(),ne=!0,P(G),{goTo:qe,setGeometry(l){p(l),Se=-1,Te()},setPlaying:P,setSuspended:q,destroy(){ce=!0,cancelAnimationFrame(le),ae?.disconnect(),fe?.disconnect(),O.forEach(l=>l()),v.remove()}}}var rr,Fe,it,at,di=Y(()=>{vt();rr=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Fe=(t,e,i)=>Math.min(i,Math.max(e,t)),it=(t,e)=>(t%e+e)%e,at=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function pi(t){let{host:e,makeCard:i,nativeList:n}=t,a=Array.isArray(t.items)?t.items:[],s=t.options||{},r=["wall","ring","angled"].includes(s.preset)?s.preset:"wall",c=!!s.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=a.length,f=r==="ring"?16:r==="wall"?12:o,x=!c&&o>1&&o<12&&r!=="angled"?Math.ceil(f/o)*o:o,u=Array.from({length:o},(l,g)=>g),m=Xe(Ze(s.depth,55),0,100),w=Xe(Ze(s.cardWidth,280),80,900),d=Xe(Ze(s.gap,24),0,160),y=Math.max(1,Ze(s.duration,5)),M=new AbortController,p=(l,g,b,z={})=>l.addEventListener(g,b,{...z,signal:M.signal}),h={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},v=`gc-spatial-help-${++sr}`,O=["gc-spatial",`gc-${r}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...O);let T=new Map,k=(l,g)=>{T.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,g)};k("--gc-spatial-height",`${Xe(Ze(s.stageHeight,620),300,1400)}px`),k("--gc-spatial-radius",`${Xe(Ze(s.radius,18),0,100)}px`),k("--gc-spatial-fit",s.fit==="contain"?"contain":"cover"),k("--gc-spatial-card-width",`${w}px`),k("--gc-spatial-gap",`${d}px`);let A=n?.track??document.createElement("div");A.classList.add("gc-spatial-canvas"),n&&A.classList.add("gc-spatial-native-track"),A.setAttribute("role",n?"list":"group"),A.setAttribute("aria-label",h[r]),A.setAttribute("aria-describedby",v);let L=document.createElement("p");L.id=v,L.className="gc-spatial-sr",L.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let C=document.createElement("span");C.className="gc-spatial-sr",C.setAttribute("aria-live","polite"),C.setAttribute("aria-atomic","true"),e.append(L,A,C);let E=s.showTitles!==!1&&(r!=="ring"||c||o===1),S=Array.from({length:x},(l,g)=>{let b=g%o,z=a[b],N=i(z,b,{caption:E,description:!1,thumbnail:!0}),I=n?.slot(N)??document.createElement("div");return I.classList.add("gc-spatial-position"),N.classList.add("gc-spatial-card"),N.dataset.spatialIndex=String(g),N.dataset.spatialSourceIndex=String(b),N.tabIndex=g===0?0:-1,g>=o&&N.setAttribute("aria-hidden","true"),!N.getAttribute("aria-label")&&!N.textContent.trim()&&N.setAttribute("aria-label",`View item ${b+1}`),I.contains(N)||I.append(N),I.parentNode!==A&&A.append(I),{position:I,card:N,sourceIndex:b,x:0,y:0,flip:0,tilt:0,lift:0}}),F=document.createElement("div");F.className="gc-spatial-nav";let j=(l,g)=>{let b=document.createElement("button");return b.type="button",b.className="gc-spatial-control",b.setAttribute("aria-label",g),Ue(b,l)},te=j("previous","Previous item"),R=j("next","Next item"),ne=document.createElement("span");ne.className="gc-spatial-count",ne.setAttribute("aria-hidden","true"),F.append(te,ne,R);let ee=s.autoplay&&!c?j("playback","Pause gallery motion"):null;ee&&(ee.disabled=o<2,ee.dataset.paused=String(o<2),ee.disabled&&ee.setAttribute("aria-label","Play gallery motion"),F.append(ee)),e.append(F),te.disabled=R.disabled=o<2;let se,he;if(r==="ring"&&o>1&&!c){se=document.createElement("div"),se.className="gc-ring-center",se.setAttribute("aria-hidden","true"),s.showTitles!==!1&&(he=document.createElement("span"),he.className="gc-ring-label",se.append(he));let l=document.createElement("span");l.textContent="Drag to explore",se.append(l),A.after(se)}let Le;o||(Le=document.createElement(n?"li":"p"),Le.className="gc-spatial-empty",Le.textContent="No items available.",A.append(Le));let $=!1,W=0,B=-1,J=1,V=1,Z=1,ce=1,H=1,X=1,pe=0,le=1,ie=1,Q=0,G=0,me=1,xe=!!s.autoplay&&!c&&o>1,ve=!1,je=!1,D=!1,ke=!0,_=null,ze=0,re=0,Oe=0,Se=-1,Ae=!1,be={x:-1e4,y:-1e4,inside:!1};function He(l=W){if(!he)return;let g=typeof a[l]?.title=="string"?a[l].title.trim():"";he.textContent===g&&he.hidden===!g||(he.textContent=g,he.hidden=!g,Be())}function Be(){!se||$||(se.classList.remove("is-below"),se.offsetHeight>pe&&se.classList.add("is-below"))}function Ne(l,g=!1,b=null){if(!o){ne.textContent="00 / 00";return}let z=rt(l,o),N=b!==null&&S[b]?.sourceIndex===z,I=N&&u[z]!==b;if(N){let U=S[u[z]].card;u[z]=b,I&&(S[b].card.removeAttribute("aria-hidden"),n?.syncFocus(S[b].card),document.activeElement===U&&(Ae=!0,S[b].card.focus({preventScroll:!0}),Ae=!1))}if(B===z&&!I){g&&(C.textContent=`Item ${z+1} of ${o}${a[z].title?`: ${a[z].title}`:""}`);return}W=z,He(),ne.textContent=`${String(W+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`,S.forEach(({card:U,sourceIndex:ge},de)=>{let ue=u[ge]===de;U.tabIndex=ue&&ge===W?0:-1,U.classList.toggle("is-selected",ue&&ge===W),ue?U.removeAttribute("aria-hidden"):U.setAttribute("aria-hidden","true"),n?.syncFocus(U)}),g&&(C.textContent=`Item ${W+1} of ${o}${a[W].title?`: ${a[W].title}`:""}`),B!==W&&(B=W,t.onChange?.(W))}function tt(l){xe=!!l&&!c&&o>1,ee&&(ee.dataset.paused=String(!xe),ee.setAttribute("aria-label",xe?"Pause gallery motion":"Play gallery motion")),q()}function Ve(l){ve=!!l,ve||q()}function Je(l,g,b){return g+Math.round((l-g)/b)*b}function Re(l){let g={index:u[l],target:l,distance:1/0};return S.forEach((b,z)=>{if(b.sourceIndex!==l)return;let N=z;if(r==="ring")N=Je(Q,z,x);else if(r==="wall"){let U=Math.floor(z/le);N=ie>2?Je(Q,U,ie):U}let I=Math.abs(N-Q);I<g.distance&&(g={index:z,target:N,distance:I})}),g}function Te(l){let g=l.getBoundingClientRect();return g.left+g.width/2}function Ee(){if(o<2)return;let l=Te(S[0].position),g=Te(S[1].position)-l;if(Math.abs(g)<1)return;let b=Xe(Math.round((Te(A)-l)/g),0,o-1);Ne(b,!1,b)}function Ge(l,g=!1){if(!o)return;let b=rt(Math.round(Ze(l,0)),o),z=c?{index:b,target:b}:Re(b);if(Ne(b,!0,z.index),c){let N=S[b].position;A.scrollTo({left:A.scrollLeft+Te(N)-Te(A),behavior:"auto"})}else G=z.target;g&&S[z.index].card.focus({preventScroll:!0}),q()}function qe(){if(!$){if(J=Math.max(1,A.clientWidth),V=Math.max(1,A.clientHeight),r==="ring"){let l=Math.max(80,Math.min(J-32,V-42)),g=Xe(Ze(s.ringDiameter,l),80,l);X=Math.max(0,g*.38);let b=It*X/Math.max(1,x),z=Math.min(g*.17,b*.8),N=1.15-Xe(d,0,100)/160;if(Z=o<=1?Math.min(w,J*.65,V*.58):Math.max(18,Math.min(Math.min(w*.22,z)*N,b*.94)),ce=Z*1.28,se){let I=Math.max(0,X-Math.max(32,ce)/2-10);pe=Math.floor(I*Math.SQRT2),se.style.setProperty("--gc-ring-label-width",`${pe}px`),se.style.setProperty("--gc-ring-label-y",`${A.offsetTop+V/2}px`),Be()}H=Math.max(24,It*Math.max(1,X)/Math.max(1,x))}else r==="wall"?(le=x>=10?3:x>=4?2:1,ie=Math.max(1,Math.ceil(x/le)),ce=Math.min((V-56-(le-1)*d)/le,w*.62,230),Z=Math.max(60,Math.min(ce*1.5,w,J*.43)),ce=Z/1.5,H=Z+Math.min(d,70)):(Z=Math.min(w,J*.68,(V-70)*.76),ce=Z/.76,H=Z*(.72+(100-m)*.001)+d);S.forEach(({position:l})=>{l.style.width=`${Math.max(24,Z)}px`,l.style.height=`${Math.max(32,ce)}px`}),c&&S.forEach(({position:l})=>{l.style.width=`${Math.min(w,J*.72)}px`,l.style.height=`${Math.min(V-40,w*1.15)}px`}),q()}}function De(l){if(c||!o||ve)return!1;let g=xe&&!je&&!D&&!_&&ke&&!document.hidden;if(g){let I=l/y;r==="angled"?(G+=I*me,G>=o-1&&(G=o-1,me=-1),G<=0&&(G=0,me=1)):G+=I}let b=_?.moved?1:1-Math.exp(-l*11);Q+=(G-Q)*b,Math.abs(G-Q)<1e-4&&(Q=G);let z=Math.abs(G-Q)>1e-4||g;if(g||_?.moved){let I=_?.moved?Q:G,U=r==="wall"?Math.round(I)*le+u[W]%le:Math.round(I),ge=r==="wall"?Math.min(rt(U,ie*le),x-1):rt(U,x);Ne(S[ge].sourceIndex,!1,ge)}let N=1-Math.exp(-l*13);return S.forEach((I,U)=>{let{position:ge,card:de}=I;if(r==="ring"){let ue=-Math.PI/2+(U-Q)*It/x;I.x=o===1?0:Math.cos(ue)*X,I.y=o===1?0:Math.sin(ue)*X;let ye=Math.hypot(be.x-(J/2+I.x),be.y-(V/2+I.y)),Me=Math.max(65,Z*2.6),_e=be.inside&&!_?.moved?Math.max(0,1-ye/Me):0,$e=_e*_e*(50+m*1.3);I.flip+=($e-I.flip)*N,Math.abs(I.flip-$e)>.05&&(z=!0),de.toggleAttribute("data-gc-back-facing",I.flip>90);let Ke=o===1?0:ue*180/Math.PI+90;ge.style.transform=`translate3d(${I.x}px,${I.y}px,0) rotate(${Ke}deg)`,de.style.transform=`perspective(700px) rotateY(${I.flip}deg) translateZ(${_e*12}px)`,ge.style.zIndex=String(U===Se?x+2:1)}else if(r==="wall"){let ue=U%le,Me=Math.floor(U/le)-Q;if(ie>2){let Za=ie%2===0?.5:0;Me=rt(Me-Za+ie/2,ie)-ie/2}let _e=Math.min(.68,2.6/Math.max(3,ie)),$e=Me*_e,Ke=Math.max(H/_e,J*.4),Zt=m/100,Ja=Math.sin($e)*Ke,Qt=(1-Math.cos($e))*Ke*Zt*.65,Ka=(ue-(le-1)/2)*(ce+Math.min(d,50)),zt=U===Se||D&&U===u[W]?1:0;I.lift+=(zt-I.lift)*N,Math.abs(zt-I.lift)>.002&&(z=!0),ge.style.transform=`translate3d(${Ja}px,${Ka}px,${Qt+I.lift*20}px) rotateY(${-$e*180/Math.PI*Zt}deg)`,ge.style.zIndex=String(Math.round(Qt)+(zt?1e3:1)),de.style.transform=`scale(${1+I.lift*.035})`,ge.style.opacity=Math.abs($e)>1.6?"0":"1",ge.style.visibility=Math.abs($e)>1.6?"hidden":"visible"}else{let ue=U-Q,ye=U===Se||D&&U===u[W]?1:0;I.lift+=(ye-I.lift)*N,Math.abs(ye-I.lift)>.002&&(z=!0);let Me=-(25+m*.28)*(1-I.lift);ge.style.transform=`translate3d(${ue*H}px,${-I.lift*14}px,${I.lift*110}px) rotateY(${Me}deg)`,ge.style.zIndex=String(ye?o+2:o-U),de.style.transform="none"}}),z}function P(l){if(re=0,$)return;let g=Math.min(.05,Math.max(.001,(l-(Oe||l-16.7))/1e3));Oe=l,De(g)&&ke&&!document.hidden?re=requestAnimationFrame(P):Oe=0}function q(){!$&&!re&&!c&&(re=requestAnimationFrame(P))}c&&p(A,"scroll",Ee,{passive:!0}),p(te,"click",()=>Ge(W-1)),p(R,"click",()=>Ge(W+1)),ee&&p(ee,"click",()=>tt(!xe)),p(A,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let g=l.key==="Home"?0:l.key==="End"?o-1:W+(l.key==="ArrowRight"?1:-1);Ge(g,!0)}),p(A,"focusin",l=>{D=!0;let g=l.target.closest?.("[data-spatial-index]");g&&!Ae&&Ne(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),q()}),p(A,"focusout",()=>{queueMicrotask(()=>{$||(D=A.contains(document.activeElement),q())})}),p(A,"pointerenter",l=>{l.pointerType!=="touch"&&(je=!0,be.inside=!0,q())}),p(A,"pointerleave",()=>{je=!1,be.inside=!1,Se=-1,He(),q()}),p(A,"pointermove",l=>{if(l.pointerType==="touch")return;let g=A.getBoundingClientRect();be.x=l.clientX-g.left,be.y=l.clientY-g.top,be.inside=!0;let b=l.target.closest?.("[data-spatial-index]");Se=b?Number(b.dataset.spatialIndex):-1,He(Se>=0?S[Se].sourceIndex:W),q()}),p(A,"pointerdown",l=>{let g=l.target.closest?.("[data-spatial-index]");g&&Ne(Number(g.dataset.spatialSourceIndex),!1,Number(g.dataset.spatialIndex)),!(c||o<2||l.pointerType==="mouse"&&l.button!==0)&&(_={id:l.pointerId,x:l.clientX,y:l.clientY,start:G,moved:!1})}),p(window,"pointermove",l=>{if(!_||l.pointerId!==_.id)return;let g=l.clientX-_.x,b=l.clientY-_.y;if(!_.moved){if(Math.abs(b)>12&&Math.abs(b)>Math.abs(g)*1.2){_=null;return}if(Math.abs(g)<7)return;_.moved=!0,A.classList.add("is-dragging"),A.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),G=_.start-g/H,(r==="angled"||r==="wall"&&ie<=2)&&(G=Xe(G,0,r==="wall"?ie-1:o-1)),q()},{passive:!1});let oe=l=>{if(!_||l.pointerId!==_.id)return;let g=_.moved;if(_=null,A.classList.remove("is-dragging"),A.hasPointerCapture?.(l.pointerId)&&A.releasePointerCapture(l.pointerId),g){ze=performance.now()+350,G=Math.round(G);let b=r==="wall"?Math.round(G)*le+u[W]%le:Math.round(G),z=r==="wall"?Math.min(rt(b,ie*le),x-1):rt(b,x);Ne(S[z].sourceIndex,!0,z)}q()};p(window,"pointerup",oe),p(window,"pointercancel",oe),p(A,"click",l=>{performance.now()<ze&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),p(A,"dragstart",l=>l.preventDefault()),p(document,"visibilitychange",q);let ae=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(g=>g.target===A)?qe():Be()}):null;ae?.observe(A),se&&ae?.observe(se),ae||p(window,"resize",qe);let fe=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{ke=l[0]?.isIntersecting??!0,ke&&q()},{rootMargin:"100px"}):null;return fe?.observe(e),qe(),Ne(0),{goTo:Ge,setPlaying:tt,setSuspended:Ve,destroy(){$||($=!0,cancelAnimationFrame(re),ae?.disconnect(),fe?.disconnect(),M.abort(),L.remove(),C.remove(),F.remove(),se?.remove(),n?Le?.remove():A.remove(),e.classList.remove(...O),T.forEach((l,g)=>l?e.style.setProperty(g,l):e.style.removeProperty(g)))}}}var sr,Xe,rt,Ze,It,gi=Y(()=>{vt();sr=0,Xe=(t,e,i)=>Math.max(e,Math.min(i,t)),rt=(t,e)=>(t%e+e)%e,Ze=(t,e)=>Number.isFinite(Number(t))?Number(t):e,It=Math.PI*2});function ui({host:t,items:e,options:i,makeCard:n,onChange:a,nativeList:s}){let r=Number(i.stageHeight)||680,c=Math.max(300,r-120),o=Math.max(0,Number(i.gap)||0),f=Number.isFinite(Number(i.depth))?Number(i.depth):45,x=i.previewScroll===!1,u=x?window:t;t.classList.add("gc-stack"),t.style.height=x?"auto":r+"px",t.style.overflowY=x?"visible":"auto",t.style.overscrollBehavior=x?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let m=s?.track??document.createElement("div");m.classList.add("gc-stack-track"),t.append(m);let w=e.map((O,T)=>{let k=n(O,T,{caption:i.showTitles,description:!0}),A=s?.slot(k)??document.createElement("div");A.classList.add("gc-stack-slot"),k.parentElement!==A&&A.append(k),m.append(A),A.style.zIndex=T+1,k.style.width=`min(${i.stackCardWidth}px,calc(100% - 48px))`,k.style.minHeight=c+"px";let L=k.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),C=!Array.from(L).some(E=>!E.closest("[hidden]")&&E.textContent.trim());return k.classList.toggle("gc-stack-image-only",C),{card:k,wrap:A,imageOnly:C,start:0,duration:1/0}}),d=0;function y(){return x?-m.getBoundingClientRect().top:t.scrollTop}function M(){d=0;let O=y(),T=0;w.forEach(({card:k,start:A,duration:L},C)=>{let E=Math.max(0,Math.min(1,(O-A)/L));k.style.transform=i.reducedMotion?"none":`perspective(1300px) translateY(${E*-32}px) scale(${1-E*.14}) rotateX(${E*f*.25}deg)`,k.style.filter=`brightness(${1-E*.23})`,E>=.5&&(T=Math.min(C+1,w.length-1))}),w.length&&a?.(T)}function p(){d||(d=requestAnimationFrame(M))}function h(){let O=w.map(({card:A,wrap:L})=>({height:A.offsetHeight,rowHeight:L.offsetHeight})),T=x?window.innerHeight:t.clientHeight,k=m.clientTop+(parseFloat(getComputedStyle(m).paddingTop)||0);w.forEach((A,L)=>{let{height:C,rowHeight:E}=O[L],S=Math.min(40,T-24-C);A.wrap.style.top=S+"px",A.start=k-S,L&&(w[L-1].duration=Math.max(1,A.start-w[L-1].start));let F=A.imageOnly&&C<=T-64?C*.24:0,j=L<w.length-1?o-F:0;A.wrap.style.marginBottom=j+"px",k+=E+j,L===w.length-1&&(A.duration=1/0,m.style.paddingBottom=Math.max(40,T-S-E)+"px")}),p()}let v;return h(),typeof ResizeObserver<"u"&&(v=new ResizeObserver(h),v.observe(m,{box:"border-box"}),w.forEach(({card:O})=>v.observe(O,{box:"border-box"}))),window.addEventListener("resize",h),u.addEventListener("scroll",p,{passive:!0}),{goTo(O){let T=w[Math.max(0,Math.min(w.length-1,Math.round(O)))];if(!T)return;let k=x?window.scrollY+T.start-y():T.start;u.scrollTo({top:k,behavior:i.reducedMotion?"instant":"smooth"})},destroy(){v?.disconnect(),window.removeEventListener("resize",h),cancelAnimationFrame(d),u.removeEventListener("scroll",p),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",m.remove()}}}var hi=Y(()=>{});var fi,xt,mi=Y(()=>{fi='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',xt=class{constructor(e,i,n){this.root=e,this.cards=i,this.projects=n,this.assetDirectory=new URL(".",i[0].querySelector("img").src),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${fi}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${fi}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",r=>{if(r.target!==this.dialog)return;let c=this.dialog.getBoundingClientRect();(r.clientX<c.left||r.clientX>c.right||r.clientY<c.top||r.clientY>c.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",r=>{(r.key==="ArrowLeft"||r.key==="ArrowRight")&&(r.preventDefault(),this.showFrame(this.frame+(r.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",r=>{!r.isPrimary||r.target.closest("button")||(this.galleryPointer={id:r.pointerId,x:r.clientX,y:r.clientY},s.setPointerCapture(r.pointerId))}),s.addEventListener("pointerup",r=>{let c=this.galleryPointer;if(this.galleryPointer=null,!c||c.id!==r.pointerId)return;s.hasPointerCapture(r.pointerId)&&s.releasePointerCapture(r.pointerId);let o=r.clientX-c.x,f=r.clientY-c.y;Math.abs(o)>35&&Math.abs(o)>Math.abs(f)*1.2&&this.showFrame(this.frame+(o<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let i=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!i,this.dialog.querySelector("[data-gallery-next]").hidden=!i,this.thumbnails.hidden=!i,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(a=>{let s=document.createElement("li");return s.textContent=a,s})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((a,s)=>{let r=document.createElement("button");r.type="button",r.className="project-thumbnail",r.setAttribute("aria-label",`Show ${a.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(a.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,r.append(c),r.addEventListener("click",()=>this.showFrame(s)),r})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let i=this.project.gallery[this.frame];this.image.src=new URL(i.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${i.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${i.label}`,[...this.thumbnails.children].forEach((n,a)=>n.setAttribute("aria-current",String(a===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Ye,gt,wt=Y(()=>{Ye=Object.freeze({containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),gt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function bi(t,e,{pauseOnHover:i=!0,interactionRestMs:n=6e3}={}){let a=t.querySelector("[data-orbit-toggle]"),s=new AbortController,r=(p,h,v)=>p.addEventListener(h,v,{signal:s.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let o=0,f=!1,x=p=>!!p&&t.contains(p)&&(p.matches(":focus-visible")||!!p.closest(".orbit-card")),u=()=>!f&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,m=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(o),e.autoFrame=0,o=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},w=p=>{if(e.autoFrame=0,!u()){m();return}let h=Math.min(.05,Math.max(0,(p-e.autoTime)/1e3));e.autoTime=p,e.position=(e.position+h/8)%e.count,e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(w)},d=()=>{if(!u()){m();return}let p=e.resumeAt-performance.now();if(p>0){m(),o=setTimeout(d,p);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(w))},y=(p=6e3)=>{m(),e.resumeAt=performance.now()+p};e.animateTo=function(...p){y(n),c.animateTo.apply(this,p),d()},e.settleImmediately=function(...p){c.settleImmediately.apply(this,p),d()},e.openProject=function(...p){y(),c.openProject.apply(this,p),d()},i&&(r(t,"pointerenter",p=>{p.pointerType!=="touch"&&(e.hovered=!0,d())}),r(t,"pointerleave",p=>{p.pointerType!=="touch"&&(e.hovered=!1,d())})),r(t,"focusin",p=>{e.keyboardFocused=x(p.target),d()}),r(t,"focusout",p=>{e.keyboardFocused=x(p.relatedTarget),d()}),r(t,"pointerup",()=>{y(n),d()}),r(t,"pointercancel",()=>{y(n),d()}),r(e.viewer.dialog,"close",()=>{y(),d()}),r(document,"visibilitychange",d),r(e.reducedMotion,"change",d),r(a,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,a.dataset.paused=String(e.manuallyPaused),a.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),d()});let M=new IntersectionObserver(p=>{e.inView=p.some(h=>h.isIntersecting&&h.intersectionRatio>=.15),d()},{threshold:.15});return M.observe(e.stage),e.stopAutoplay=m,e.syncAutoplay=d,()=>{f=!0,m(),s.abort(),M.disconnect(),Object.assign(e,c)}}var yi=Y(()=>{});var Ce,qt,vi,xi,wi,ki,Si,Mi,Ci,Ai,Ei,Pi,Li,Ft,ji,ut,zi,Nt=Y(async()=>{Ce=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),qt=Ce.BufferGeometry,vi=Ce.Float32BufferAttribute,xi=Ce.LineBasicMaterial,wi=Ce.LineLoop,ki=Ce.DoubleSide,Si=Ce.Mesh,Mi=Ce.NoToneMapping,Ci=Ce.PerspectiveCamera,Ai=Ce.PlaneGeometry,Ei=Ce.Raycaster,Pi=Ce.Scene,Li=Ce.ShaderMaterial,Ft=Ce.SRGBColorSpace,ji=Ce.TextureLoader,ut=Ce.Vector2,zi=Ce.WebGLRenderer});var cr,kt,Ti=Y(async()=>{cr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),kt=cr.default});var lr,Rt,Ii=Y(async()=>{lr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),Rt=lr.CustomEase});function qi(t,e,i=64){let n=t/e,a=new Ai(t,t*9/16,i,1),s=a.attributes.position,r=a.attributes.uv;for(let c=0;c<s.count;c++){let o=(r.getX(c)-.5)*e;s.setX(c,n*Math.sin(o)),s.setZ(c,n*(Math.cos(o)-1))}return a.computeVertexNormals(),a.computeBoundingSphere(),a}function Fi(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var $t=Y(async()=>{await Nt()});function ht(t,e){let i=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*i,panelArc:t.radiansPerSlide*i,height:t.slotHeight*i}}function St(t,{radius:e,pitch:i,radiansPerSlide:n}){let a=t*n;return{x:Math.sin(a)*e,y:-t*i,z:(Math.cos(a)-1)*e,angle:a,taper:1,shade:(1-Math.cos(a))/2*.58}}function Ni(t,e){let i=ht(t,e);return qi(i.cardWidth,i.panelArc)}function Wt(t,e=64){let i=[];for(let n=0;n<=e;n++){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),t.slotHeight/2,t.radius*(Math.cos(a)-1))}for(let n=e;n>=0;n--){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),-t.slotHeight/2,t.radius*(Math.cos(a)-1))}return i}var Mt=Y(async()=>{await $t()});function Ot(t,e){let i=Ni(t,e);return i.scale(1,1/t.aspect/(9/16),1),i.computeVertexNormals(),i.computeBoundingSphere(),i}function Ri(t,e,i,n,a){let s=Math.min(t,e)*Math.min(40,Math.max(0,a))/100,r=t-2*s,c=e-2*s,o=r/c,f=n==="fit"?Math.max:Math.min,x=f(1,o/i),u=f(1,i/o);return{contentWidth:r,contentHeight:c,uvScaleX:x,uvScaleY:u,imageWidth:r/x,imageHeight:c/u,padding:s}}var $i=Y(async()=>{await Mt();await Mt()});function Ht({stageWidth:t,stageHeight:e,spiralWidthPercent:i,cardWidth:n,aspect:a,rise:s,riseUnit:r}){let c=Math.max(1,t*i/200),o=Math.max(1,Math.min(n,c*Math.PI/3,e*.4*a)),f=Math.PI*2*c/o,x=r==="percent"?e*s/100:s*Math.min(1,t/640);return{radius:c,slotWidth:o,slotHeight:o/a,aspect:a,pitch:Math.max(o/a*1.25/f,x),radiansPerSlide:o/c,cardsPerTurn:Math.PI*2*c/o}}var Wi=Y(()=>{});function Hi(t,e,i){let n=e.radius*2.4,a=n/(n+2*e.radius),s=Math.ceil((i/(2*a)+e.slotHeight/2)/e.pitch)+2,r=Math.floor(t);return{first:r-s,last:r+s,count:s*2+1}}function Bi(t,e,i){let n=t*e.radiansPerSlide,a=n-i.panelArc/2,s=n+i.panelArc/2,r=Math.PI*2,c=M=>Math.ceil((a-M)/r)<=Math.floor((s-M)/r),o=c(0)?1:Math.max(Math.cos(a),Math.cos(s)),f=c(Math.PI)?-1:Math.min(Math.cos(a),Math.cos(s)),x=e.radius*2.4,u=x/(x+e.radius*(1-o)),m=x/(x+e.radius*(1-f)),w=-t*e.pitch,d=w+i.height/2,y=w-i.height/2;return{minY:Math.min(y*u,y*m),maxY:Math.max(d*u,d*m)}}function Di(t,e){let i=Math.min(80,e*.08),n=s=>Math.max(0,Math.min(1,s)),a=Math.min(n((e/2-t.minY)/i),n((t.maxY+e/2)/i));return a*a*(3-2*a)}function Ui(t,e,i,n){let a=i-e;return Math.abs(a)>n/2&&(a-=Math.round(a/n)*n),t+a}var Oi,Gi=Y(async()=>{await Mt();Wi();Oi=(t,e)=>(t%e+e)%e});var Xi,_i=Y(()=>{Xi=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function Yi(t,{textureSource:e=i=>i.querySelector("img").src}={}){let{root:i,stage:n}=t,a;try{a=new zi({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return i.dataset.renderer="css-fallback",()=>{delete i.dataset.renderer}}a.outputColorSpace=Ft,a.toneMapping=Mi,a.setClearColor(0,0);let s=a.domElement;s.style.removeProperty("display"),s.className="orbit-webgl",s.setAttribute("aria-hidden","true"),n.append(s);let r=new Pi,c=new Ci,o=new Ei,f=new ut,x=new AbortController,u=($,W,B)=>$.addEventListener(W,B,{signal:x.signal}),m=t.render,w=t.pointerDown,d=new Map,y=[],M,p,h=t.position,v=t.position,O="",T=!1,k=!1,A=null,L=null,C=!1,E=!1;i.dataset.renderer="loading-webgl";let S=()=>Ht({stageWidth:n.clientWidth,stageHeight:n.clientHeight,spiralWidthPercent:Number(i.dataset.spiralWidth),cardWidth:Number(i.dataset.cardWidth),aspect:Number(i.dataset.cardAspect),rise:Number(i.dataset.rise),riseUnit:i.dataset.riseUnit}),F=()=>{let $=t.cards[0],W=new Li({uniforms:{screenshot:{value:d.get(e($))},dimensions:{value:new ut},contentDimensions:{value:new ut(1,1)},imageScale:{value:new ut(1,1)},borderColor:{value:[0,0,0]},backColor:{value:[0,0,0]},solidBack:{value:!1},borderWidth:{value:0},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:pr,fragmentShader:gr,transparent:!0,side:ki,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),B=new Si(M,W),J=new wi(p,new xi({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),V={card:$,mesh:B,guide:J,material:W,surface:{scale:1,target:1}};B.userData.panel=V,y.push(V),r.add(B,J)},j=$=>{let W=Hi(h,$,n.clientHeight);for(;y.length<W.count;)F();for(;y.length>W.count;){let B=y.pop();r.remove(B.mesh,B.guide),B.material.dispose(),B.guide.material.dispose()}y.forEach((B,J)=>{B.offset=W.first+J-h,B.card=t.cards[Oi(W.first+J,t.count)],B.material.uniforms.screenshot.value=d.get(e(B.card))})},te=()=>{let $=n.clientWidth,W=n.clientHeight,B=S(),J=Number(i.dataset.slotGap||3);j(B);let V=ht(B,J),{cardWidth:Z,panelArc:ce}=V,{radius:H}=B;i.dataset.slotMetrics=JSON.stringify({...B,cardArc:ce,cardWidth:Z,cardHeight:V.height,gap:J,imageFit:i.dataset.imageFit,imagePadding:Number(i.dataset.imagePadding||0)}),y.forEach(Q=>{Q.material.uniforms.dimensions.value.set(Z,V.height);let G=Q.material.uniforms;G.cornerRadius.value=Math.min(Number(i.dataset.cornerRadius)||0,Z/2,V.height/2),G.borderWidth.value=Number(i.dataset.borderWidth)||0,G.solidBack.value=i.dataset.backFace==="solid";for(let ve of["backColor","borderColor"]){let je=G[ve],D=i.dataset[ve];if(je.hex!==D){je.hex=D;let ke=parseInt(D.slice(1),16);je.value=[ke>>16,ke>>8&255,ke&255].map(_=>_/255)}}let me=Q.material.uniforms.screenshot.value.image;if(!me)return;let xe=Ri(Z,V.height,(me.naturalWidth||me.width)/(me.naturalHeight||me.height),i.dataset.imageFit,Number(i.dataset.imagePadding||0));Q.material.uniforms.contentDimensions.value.set(xe.contentWidth,xe.contentHeight),Q.material.uniforms.imageScale.value.set(xe.uvScaleX,xe.uvScaleY)});let X=Math.min(window.devicePixelRatio||1,2),pe=`${$}:${W}:${Z}:${ce}:${V.height}:${H}:${X}`;if(pe===O||!$||!W)return;O=pe,a.setPixelRatio(X),a.setSize($,W,!1),c.position.set(0,0,H*2.4),c.fov=Fi(W,c.position.z),c.aspect=$/W,c.near=.1,c.far=H*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let le=M;M=Ot(B,J);let ie=p;p=new qt,p.setAttribute("position",new vi(Wt(B),3)),y.forEach(Q=>{Q.mesh.geometry=M,Q.guide.geometry=p,Q.material.uniforms.dimensions.value.set(Z,V.height)}),le?.dispose(),ie?.dispose()},R=()=>{if(!T||k||C||E||!t.geometry)return;E=!0,h=Ui(h,v,t.position,t.count),v=t.position,te();let $=S(),W=ht($,Number(i.dataset.slotGap||3)),B=i.dataset.focusMode==="keyboard"&&i.contains(document.activeElement),J=0;y.forEach(Z=>{let{card:ce,mesh:H,material:X}=Z,pe=St(Z.offset,$),le=Bi(Z.offset,$,W),ie=Di(le,n.clientHeight),Q=i.dataset.edgeMode==="preset"?ie:+(ie>0),G=B&&ce===t.cards[t.active]&&Math.abs(Z.offset)<.5;X.polygonOffsetUnits=Math.abs(Z.offset)*8,H.position.set(pe.x,pe.y,pe.z),H.rotation.y=pe.angle,H.visible=Q>.001&&!!X.uniforms.screenshot.value.image,H.visible&&J++,Z.guide.position.copy(H.position),Z.guide.rotation.copy(H.rotation),Z.guide.visible=i.dataset.showSlots==="true"&&H.visible,Z.guide.material.opacity=Q*.42,X.uniforms.fade.value=Q,X.uniforms.shade.value=pe.shade,X.uniforms.focused.value=G?1:0});let V=JSON.stringify({cardsPerTurn:$.cardsPerTurn,visibleCount:J,poolCount:y.length,stageWidth:n.clientWidth,stageHeight:n.clientHeight,cardWidth:W.cardWidth,cardHeight:W.height,pitch:$.pitch,radius:$.radius,uniqueCount:t.count});i.dataset.responsiveMetrics!==V&&(i.dataset.responsiveMetrics=V),L&&!t.pointer&&(A=ne(L)),r.updateMatrixWorld(!0),a.render(r,c),E=!1},ne=$=>{if(!T||C)return null;let W=s.getBoundingClientRect();f.set(($.clientX-W.left)/W.width*2-1,-($.clientY-W.top)/W.height*2+1),o.setFromCamera(f,c);for(let B of o.intersectObjects(y.map(J=>J.mesh))){let J=B.object.userData.panel;if(!B.object.visible||J.material.uniforms.fade.value<=.25)continue;let{x:V,y:Z}=J.material.uniforms.dimensions.value,ce=J.material.uniforms.cornerRadius.value,H=Math.abs((B.uv.x-.5)*V)-V/2+ce,X=Math.abs((B.uv.y-.5)*Z)-Z/2+ce;if(!(Math.hypot(Math.max(H,0),Math.max(X,0))+Math.min(Math.max(H,X),0)>ce))return J}return null};t.render=function(){m.call(this),R()},t.pointerDown=function($){w.call(this,$),T&&!C&&this.pointer?.id===$.pointerId&&(this.pointer.card=ne($)?.card||null),L=null,A=null},u(n,"pointermove",$=>{L=$.pointerType==="mouse"?{clientX:$.clientX,clientY:$.clientY}:null,A=$.pointerType==="mouse"&&!t.pointer?ne($):null,s.style.cursor=t.pointer?.dragging?"grabbing":A?"pointer":"grab",R()}),u(n,"pointerleave",()=>{L=null,A=null,R()}),u(n,"pointerup",()=>{A=null,R()}),u(i,"focusin",R),u(i,"focusout",()=>queueMicrotask(R)),u(document,"keydown",()=>queueMicrotask(R)),u(document,"pointerdown",()=>queueMicrotask(R)),u(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&y.forEach(({surface:$})=>{kt.killTweensOf($),$.scale=$.target}),R()}),u(i,"playground-change",R),u(i,"slot-guides-change",R),u(s,"webglcontextlost",$=>{$.preventDefault(),C=!0,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback"}),u(s,"webglcontextrestored",()=>{C=!1,T&&(i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",R())});let ee=new ResizeObserver(()=>R());ee.observe(n);let se=new ji,he=!1,Le=()=>{k||(he=!0,T=!1,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback")};for(let $ of t.cards){let W=e($);if(d.has(W))continue;let B=se.load(W,R,void 0,Le);B.colorSpace=Ft,B.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),d.set(W,B)}return he||(M=Ot(S(),Number(i.dataset.slotGap||3)),p=new qt,T=!0,i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",R()),()=>{k=!0,x.abort(),ee.disconnect(),t.render=m,t.pointerDown=w,i.classList.remove("has-webgl-carousel"),delete i.dataset.renderer,y.forEach(({material:$,surface:W,guide:B})=>{kt.killTweensOf(W),$.dispose(),B.material.dispose()}),M?.dispose(),p?.dispose(),d.forEach($=>$.dispose()),a.dispose(),a.forceContextLoss(),s.remove()}}var wo,pr,gr,Vi=Y(async()=>{await Nt();await Ti();await Ii();await $t();await $i();await Gi();kt.registerPlugin(Rt);wo=Rt.create("portfolio-surface",".2,.75,.25,1"),pr=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,gr=`
  uniform sampler2D screenshot;
  uniform vec2 dimensions;
  uniform float cornerRadius;
  uniform float borderWidth;
  uniform vec3 borderColor;
  uniform vec3 backColor;
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
    if (solidBack && !gl_FrontFacing) gl_FragColor = vec4(backColor,1.0);
    if (borderWidth > 0.0) {
      float rim = smoothstep(-borderWidth-aa,-borderWidth+aa,edge);
      gl_FragColor = mix(gl_FragColor,vec4(borderColor,1.0),rim);
    }
    if (gl_FragColor.a < .001) discard;
    // Match the old sRGB darkening, without a second coplanar overlay.
    gl_FragColor.rgb *= 1.0 - shade;
    float topBottom = smoothstep(dimensions.y * .5 - 1.0, dimensions.y * .5, abs(p.y));
    float focusBorder = smoothstep(-2.0 - aa, -2.0 + aa, edge) * focused;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), max(topBottom * .086, focusBorder));
    gl_FragColor.a *= coverage * fade;
  }
`});var Ji=Y(()=>{(()=>{"use strict";let t=Math.PI*2,e=(s,r)=>(s%r+r)%r,i=(s,r,c)=>Math.min(c,Math.max(r,s));class n{constructor(r){this.root=r,this.stage=r.querySelector(".orbit-stage"),this.cards=[...r.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,o)=>{c.dataset.slideIndex=o;let f=c.cloneNode(!0);f.dataset.repeat="true",f.tabIndex=-1,f.setAttribute("aria-hidden","true"),f.removeAttribute("aria-pressed"),c.parentElement.append(f),this.visualCards.push(f)}),!(!this.count||!this.stage)&&(this.title=r.querySelector(".orbit-title"),this.description=r.querySelector(".orbit-description"),this.status=r.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(r,this.cards),this.pagination=r.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((r,c)=>{let o=document.createElement("button");return o.type="button",o.className="orbit-dot",o.setAttribute("aria-label",`Show ${r.dataset.title||`screenshot ${c+1}`}`),o.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(o),o}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(r=>{r.disabled=!0})}bindEvents(){let r=(c,o,f,x={})=>c.addEventListener(o,f,{...this.options,...x});r(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),r(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),r(this.stage,"keydown",c=>{let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in o?(c.preventDefault(),this.step(o[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),r(this.stage,"pointerdown",c=>this.pointerDown(c)),r(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),r(this.stage,"pointerup",c=>this.pointerUp(c)),r(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),r(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),r(this.stage,"dragstart",c=>c.preventDefault()),r(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),r(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let o=c.target.closest(".orbit-card");o&&this.openProject(Number(o.dataset.slideIndex))}),r(this.stage,"focusin",c=>{let o=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&o>=0&&o!==this.active&&this.goTo(o)}),r(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),r(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(r=>{let c=r.querySelector(".orbit-surface"),o=c.querySelector("img"),f=Array.from({length:this.segmentCount},(x,u)=>{let m=document.createElement("span");return m.className="orbit-strip",m.setAttribute("aria-hidden","true"),m.dataset.stripIndex=u,m.style.backgroundImage=`url("${o.src}")`,c.append(m),m});return r.classList.add("is-curved"),{card:r,strips:f}})}measure(){let r=this.stage.clientWidth,c=this.stage.clientHeight,o=r<=700;this.cards[0].style.removeProperty("width");let f=this.cards[0].offsetWidth,x=t/8,u=x*.88,m=f/u;this.geometry={radius:m,panelArc:u,cardWidth:f,pitch:i(c/13,36,52),halfWindow:6.5,radiansPerSlide:x,dragUnitX:Math.max(85,r*(o?.32:.18)),dragUnitY:i(c*.13,65,105)},this.stage.style.perspective=`${(m*2.4).toFixed(3)}px`;let w=u/this.segmentCount,d=2*m*Math.sin(w/2),y=f*9/16;this.panels.forEach(({card:M,strips:p})=>{M.style.width=`${f}px`,p.forEach((h,v)=>{let O=-u/2+(v+.5)*w,T=m*Math.sin(O),k=m*(Math.cos(O)-1);h.style.width=`${(d+.6).toFixed(4)}px`,h.style.backgroundSize=`${f}px ${y}px`,h.style.backgroundPosition=`${(-v*f/this.segmentCount).toFixed(4)}px 0px`,h.style.transform=`translateX(-50%) translate3d(${T.toFixed(4)}px, 0px, ${k.toFixed(4)}px) rotateY(${(O*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:r,pitch:c,halfWindow:o,radiansPerSlide:f}=this.geometry;this.visualCards.forEach(u=>{let m=Number(u.dataset.slideIndex),w=e(m-this.position+this.count/2,this.count)-this.count/2;u.dataset.repeat&&(w+=w<0?this.count:-this.count);let d=w*f,y=Math.cos(d),M=Math.sin(d),p=(1-y)/2,h=1-w/o*.11,v=M*r*h,O=w*c,T=y*r*h-r,k=d*180/Math.PI,A=i((o-Math.abs(w))/.65,0,1);u.style.transform=`translate(-50%, -50%) translate3d(${v.toFixed(3)}px, ${O.toFixed(3)}px, ${T.toFixed(3)}px) rotateY(${k.toFixed(3)}deg) scale(${h.toFixed(4)})`,u.style.zIndex="auto",u.style.setProperty("--orbit-shade",String(p*.58)),u.style.setProperty("--orbit-fade",String(A)),u.style.opacity="1",u.style.visibility=A>0?"visible":"hidden",u.style.pointerEvents=A>.25?"auto":"none",u.toggleAttribute("data-gc-back-facing",y<0),u.dataset.offset=w.toFixed(5)});let x=e(Math.round(this.position),this.count);x!==this.active&&this.updateActive(x)}updateActive(r){let c=this.visualCards.includes(document.activeElement);this.active=r,this.cards.forEach((o,f)=>{let x=f===r;o.classList.toggle("is-centered",x),o.tabIndex=x?0:-1,o.setAttribute("aria-pressed",String(x)),this.dots[f].setAttribute("aria-current",String(x))}),this.title&&(this.title.textContent=this.cards[r].dataset.title||""),this.description&&(this.description.textContent=this.cards[r].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[r].dataset.title}, project ${r+1} of ${this.count}`),c&&!this.pointer&&this.cards[r].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(r)}goTo(r){let c=e(r-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(r){this.animateTo(Math.round(this.target)+r)}animateTo(r,c=0){if(this.target=Math.round(r),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(r){this.frame=0;let c=Math.min((r-this.lastTime)/1e3,.032);this.lastTime=r;let o=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=o*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(r){if(this.viewer.dialog.open||!Number.isInteger(r)||!this.cards[r])return;let c=e(r-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(r)}pointerDown(r){if(!r.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}r.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:r.pointerId,x:r.clientX,y:r.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:r.target.closest(".orbit-card")},this.stage.setPointerCapture(r.pointerId))}pointerMove(r){let c=this.pointer;if(!c||c.id!==r.pointerId)return;let o=r.clientX-c.x,f=r.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(o),Math.abs(f))<6)return;if(r.pointerType==="touch"&&Math.abs(o)<=Math.abs(f)){c.card=null;return}c.axis=Math.abs(f)>Math.abs(o)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}r.preventDefault();let x=c.axis==="x"?r.clientX:r.clientY,u=c.axis==="x"?o:f,m=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,w=r.pointerType==="touch"?i(m*.38,32,48):m,d=performance.now(),y=Math.max(8,d-c.lastTime),M=-(x-c.lastCoordinate)/w/y*1e3;c.speed=c.speed*.35+M*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=x,c.travel=u,this.position=c.startPosition-u/w,this.render()}pointerUp(r,c=!1){let o=this.pointer;if(!o||o.id!==r.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(o.id)&&this.stage.releasePointerCapture(o.id),!o.dragging){this.animateTo(Math.round(this.position)),!c&&o.card&&this.openProject(Number(o.card.dataset.slideIndex));return}let f=c||performance.now()-o.lastMovement>90?0:i(o.speed,-10,10),x=Math.round(this.position+(this.reducedMotion.matches?0:f*(r.pointerType==="touch"?.32:.2))),u=this.position-o.startPosition;!c&&Math.abs(o.travel)>18&&Math.abs(u)>.12&&x===Math.round(o.startPosition)&&(x+=Math.sign(u)),this.animateTo(x,f)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:r,strips:c})=>{c.forEach(o=>o.remove()),r.classList.remove("is-curved"),r.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(r=>r.dataset.repeat).forEach(r=>r.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function a(s=document){s.querySelectorAll("[data-spiral-carousel]").forEach(r=>{r.spiralCarousel||(r.spiralCarousel=new n(r))})}window.SpiralCarousel={init:a},a()})()});var Zi,Ki=Y(()=>{Zi=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var ea,Qi=Y(()=>{ea=`.project-dialog {
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
`});var ia,ta=Y(()=>{ia=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var oa={};ei(oa,{mountSpiral:()=>xr,spiralControls:()=>gt,spiralDefaults:()=>Ye});function Bt(t,e,i){for(let n of ra)t.removeAttribute(n);for(let[n,a]of Object.entries(e.imageAttrs||{}))ra.has(n)&&a!=null&&t.setAttribute(n,String(a));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&i?.(t)}function vr(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function xr(t){let{host:e,onChange:i=()=>{},loadImage:n}=t,a=t.items.filter(C=>C.src),s={...Ye,...t.options},r=!1;if(!a.length){let C=document.createElement("p");return C.className="gc-spiral-empty",C.textContent="Add images to this source to preview the spiral.",e.append(C),{destroy(){C.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let o=document.createElement("div");o.className="orbit-carousel spiral-carousel slot-carousel",o.dataset.spiralCarousel="",o.id=`gc-spiral-${++br}`,o.setAttribute("role","region"),o.setAttribute("aria-label","Spiral gallery"),o.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let f=o.querySelector(".orbit-stage"),x=o.querySelector(".orbit-ring"),u=o.querySelector("[data-orbit-toggle]");Ue(o.querySelector("[data-orbit-prev]"),"previous"),Ue(o.querySelector("[data-orbit-next]"),"next"),Ue(u,"playback");let m=o.querySelector(".gc-spiral-caption"),w=document.createElement("div");w.className="gc-spiral-caption-space",m.before(w),w.append(m);let d=a.some(C=>!!C.title);for(let C of new Set(a.map(E=>E.title).filter(Boolean))){let E=m.cloneNode(!1);E.setAttribute("aria-hidden","true"),E.classList.add("gc-spiral-caption-measure"),E.textContent=C,w.append(E)}a.forEach((C,E)=>{let S=document.createElement("button");S.className="orbit-card",S.type="button",S.dataset.title=C.title||"",S.dataset.imageSource=C.src,S.setAttribute("aria-label",C.title?`View ${C.title}`:`View image ${E+1}`);let F=document.createElement("span");F.className="orbit-surface";let j=document.createElement("img");Bt(j,C),F.append(j),S.append(F),x.append(S)}),c.append(o),e.append(c);let y=()=>{o.dataset.edgeMode=s.edgeMode,o.dataset.backFace=s.backFace,o.dataset.cornerRadius=s.spiralRadius,o.dataset.borderWidth=s.borderWidth,o.dataset.borderColor=s.spiralRim,o.dataset.backColor=s.backColor,o.style.setProperty("--orbit-card-radius",s.spiralRadius+"px"),o.style.setProperty("--orbit-rim",s.spiralRim),c.style.width=`${Qe(s.containerWidth,100,20,100)}%`,f.style.height=`${Qe(s.stageHeight,680,280,1600)}px`,o.style.setProperty("--orbit-card-width",`${Qe(s.cardWidth,280,80,720)}px`),o.dataset.spiralWidth=String(Qe(s.spiralWidth,87,20,100)),o.dataset.cardWidth=String(Qe(s.cardWidth,280,80,720)),o.dataset.rise=String(Qe(s.spiralRise,52,s.spiralRiseUnit==="percent"?1:8,s.spiralRiseUnit==="percent"?50:500)),o.dataset.riseUnit=s.spiralRiseUnit==="percent"?"percent":"px",o.dataset.cardAspect=String(yr(s.aspectRatio)),o.dataset.imageFit=s.fit==="contain"||s.fit==="fit"?"fit":"fill",o.dataset.imagePadding=String(Qe(s.imagePadding,0,0,20)),o.dataset.slotGap=String(Qe(s.spiralGap,3,0,16)),o.dataset.showSlots=String(!!s.showSlots),w.hidden=!s.showTitles||!d,o.classList.toggle("gc-spiral-reduced",!!s.reducedMotion)};y();let M=a.map(C=>({title:C.title||"",category:"",description:aa(C.description),services:[],notes:[],gallery:[{file:C.src,label:"Image"}]}));class p extends xt{constructor(E,S){super(E,S,M),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(E){let S=a[E];if(!S||s.clickAction==="none")return;let F=vr(S.link);if(s.clickAction==="link"){F&&location.assign(F);return}if(S.postUrl){t.openPost(S,E);return}super.open(E);let j=this.dialog.querySelector(".project-title");j.hidden=!S.title,S.title?this.dialog.setAttribute("aria-labelledby",j.id):this.dialog.removeAttribute("aria-labelledby"),this.dialog.querySelector(".project-summary").hidden=!aa(S.description),this.sourceLink.hidden=!F,F?(this.sourceLink.href=F,this.sourceLink.textContent=S.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!s.reducedMotion)}showFrame(E){super.showFrame(E);let S=M.indexOf(this.project),F=a[S];F&&(Bt(this.image,F,n),this.dialog.querySelectorAll(".project-thumbnail img").forEach(j=>Bt(j,F,n)),this.dialog.querySelector(".project-frame-label").textContent=F.title||"")}}let h=window.ProjectViewer;window.ProjectViewer=p;try{mr.init(c)}finally{h===void 0?delete window.ProjectViewer:window.ProjectViewer=h}let v=o.spiralCarousel;o.querySelectorAll("img").forEach(C=>n?.(C));let O=v.updateActive;v.updateActive=function(C){O.call(this,C),this.status.textContent=`${a[C]?.title?`${a[C].title}, `:""}image ${C+1} of ${a.length}`,i(C)},v.updateActive(v.active);let T=v.animateTo;v.animateTo=function(C,E=0){s.reducedMotion?(this.target=Math.round(C),this.settleImmediately()):T.call(this,C,E)};let k=Yi(v,{textureSource:C=>C.dataset.imageSource}),A=bi(o,v,{pauseOnHover:!1,interactionRestMs:0});function L(C){s.autoplay=!!C,v.manuallyPaused=!C||!!s.reducedMotion,v.resumeAt=0,u.disabled=!!s.reducedMotion||v.reducedMotion.matches||a.length<2,u.dataset.paused=String(v.manuallyPaused),u.setAttribute("aria-label",v.manuallyPaused?"Resume carousel":"Pause carousel"),v.syncAutoplay()}return L(!!s.autoplay),{update(C){let E=s;s={...s,...C},y(),v.measure(),o.dispatchEvent(new Event("playground-change")),o.dispatchEvent(new Event("slot-guides-change")),v.updateActive(v.active),(E.autoplay!==s.autoplay||E.reducedMotion!==s.reducedMotion)&&L(!!s.autoplay)},goTo(C){r||v.goTo(C)},setPlaying:L,getMetrics(){try{return JSON.parse(o.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return o.dataset.renderer||"loading"},destroy(){r||(r=!0,A(),k(),v.destroy(),c.remove())}}}var mr,br,Qe,yr,aa,ra,na=Y(async()=>{mi();vt();wt();wt();yi();await Vi();Ji();mr=window.SpiralCarousel,br=0,Qe=(t,e,i,n)=>Number.isFinite(Number(t))?Math.max(i,Math.min(n,Number(t))):e,yr=t=>{if(typeof t=="number"&&t>0)return t;let[e,i]=String(t||"16:9").split(":").map(Number);return e>0&&i>0?e/i:16/9},aa=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},ra=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function sa(t){let{host:e}=t,i={...t.options},n=null,a=null,s=!1,r="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),na().then(()=>oa).then(o=>{s||(c.remove(),a=o.mountSpiral({...t,options:i}),n!==null&&a.goTo?.(n))}).catch(o=>{s||(r="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",o))}),{update(o){i={...i,...o},a?.update?.(i)},goTo(o){n=o,a?.goTo?.(o)},setPlaying(o){i.autoplay=o,a?.setPlaying?.(o)},getStatus(){return a?.getStatus?.()??r},getMetrics(){return a?.getMetrics?.()??null},destroy(){s=!0,c.remove(),a?.destroy()}}}var ca=Y(()=>{});function ct(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let i=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(i.protocol)?i.href:""}catch{return""}}function At(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(i=>i.remove()),e.content.querySelectorAll("*").forEach(i=>{for(let n of[...i.attributes])(/^on/i.test(n.name)||n.name==="style"||n.name==="id")&&i.removeAttribute(n.name);if(i.hasAttribute("href")){let n=ct(i.getAttribute("href"));n?i.setAttribute("href",n):i.removeAttribute("href")}}),e.innerHTML}function la(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let i of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(i)&&(e[i]=t.getAttribute(i));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function ft(t,e){let i=Ct[e];if(!t||!i)return null;let n=t.closest(i);if(!n){let o=t.querySelectorAll(i);if(o.length!==1)return null;n=o[0]}let a=e==="list"?n:n.querySelector(":scope > .sqs-block-content");if(!a)return null;let s=o=>Array.from(a.querySelectorAll(o)).filter(f=>f.closest(i)===n&&(!f.closest(".gc-embed")||f.hasAttribute("data-gc-native-track")));if(e==="summary"){let o=s(".summary-block-wrapper");if(o.length!==1)return null;let f=s(".summary-item").filter(x=>o[0].contains(x)&&!x.closest(".sqs-gallery-design-carousel-slide-clone,.slick-cloned"));return{source:n,originals:o,rows:f}}let r=e==="list"?".list-item":".slide",c=s(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=s(".sqs-gallery")),c.length===1){let o=Array.from(c[0].querySelectorAll(r)).filter(f=>f.closest(i)===n&&!f.hasAttribute("data-gc-repeat"));return{source:n,originals:c,rows:o}}if(e==="gallery"&&!c.length){let o=s(r);if(o.length&&o.every(f=>f.parentElement===o[0].parentElement))return{source:n,originals:o,rows:o}}return null}function lt(t,e,i=location.href){return(ft(t,e)?.rows||[]).map(a=>{let s=a.querySelector("img[data-src],img[data-image],img");if(e==="summary"){let f=a.querySelector(".summary-title-link,.summary-thumbnail-container,.summary-read-more-link"),x=ct(f?.getAttribute("href"),i);return{...la(s),title:a.querySelector(".summary-title")?.textContent.trim()||s?.alt||"",description:At(a.querySelector(".summary-excerpt")?.innerHTML),link:x,postUrl:x,buttonLabel:"Read post"}}let r=a.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=At(a.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),o=a.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...la(s),title:r,description:c,link:ct(o?.getAttribute("href"),i),buttonLabel:e==="list"&&o?.textContent.trim()||""}}).filter(a=>e==="summary"?!!a.link:e==="list"||a.src)}function wr(t,e){let i=e==="list"?t.getAttribute("data-section-id"):t.id;if(!i?.trim())return"";let n=e==="list"?'section[data-section-id="'+CSS.escape(i)+'"]':"#"+CSS.escape(i);return t.ownerDocument.querySelectorAll(n).length===1?n:""}function da(t=document){let e={list:0,gallery:0,summary:0};return Array.from(t.querySelectorAll(Object.values(Ct).join(","))).filter(i=>!i.closest(".gc-embed")).flatMap(i=>{let n=i.matches(Ct.list)?"list":i.matches(Ct.summary)?"summary":"gallery",a=wr(i,n);if(!a||!ft(i,n))return[];let s=++e[n];return{name:(n==="list"?"List Section":n==="summary"?"Summary Block":"Gallery Block")+(s>1?" "+s:""),type:n,selector:a,root:i,items:lt(i,n)}})}function Et(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let i=t.ownerDocument.defaultView?.ImageLoader;if(i&&typeof i.load=="function")try{i.load(t,{load:!0})}catch(n){console.warn("Gallery Studio: native image loader",n)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+pa(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function pa(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function Dt(t){let e=document.createElement("img");for(let[i,n]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(i)&&e.setAttribute(i,n);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=pa(t.imageAttrs?.["data-image-focal-point"]),e}var Ct,Ut=Y(()=>{Ct={list:"section.user-items-list-section",gallery:".sqs-block-gallery",summary:".sqs-block-summary-v2"}});function ga(t,e,i){let n=new WeakMap,a=new WeakMap,s=Array.from(e.childNodes),r=i.map(M=>Array.from(M.childNodes)),c=[];function o(M,p){M&&c.push([M,p.map(h=>[h,M.getAttribute(h)])])}let f=new Set,x=!1;function u(){o(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let M of i)o(M,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),x=!0}function m(M,p,h,v,O){let T=i[p],k=f.has(p),A=k?T.cloneNode(!1):T,L=document.createElement("div");if(L.className="gc-card gc-native-card",L.tabIndex=0,L.setAttribute("role","group"),M.imageAttrs?.["data-image-focal-point"]){let[R,ne]=M.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(R)&&Number.isFinite(ne)&&L.style.setProperty("--gc-native-focus",R*100+"% "+ne*100+"%")}let C=M.title||M.alt||`Item ${p+1}`;if(L.setAttribute("aria-label",C),k){A.removeAttribute("id"),A.setAttribute("data-gc-repeat","");for(let R of r[p])L.append(R.cloneNode(!0));L.querySelectorAll("[id]").forEach(R=>R.removeAttribute("id"))}else f.add(p),L.append(...r[p]);A.replaceChildren(L),n.set(L,A);let E=L.querySelector(".list-item-media"),S=L.querySelector(".list-item-content"),F=L.querySelector(".list-item-content__title"),j=L.querySelector(".list-item-content__description");if(!k){for(let R of[E,S])o(R,["class"]);for(let R of[F,j])o(R,["class","hidden"])}if(E?.classList.add("gc-card-media"),S?.classList.add("gc-card-copy"),v.typeSource!=="native"&&(F?.classList.add("gc-card-title"),j?.classList.add("gc-card-description")),F&&(!v.showTitles||h.caption===!1)&&(F.hidden=!0),j&&!h.description&&(j.hidden=!0),h.thumbnail){let R=L.querySelector(".list-item-content__button-wrapper")||L.querySelector(".list-item-content__button");R&&(k||o(R,["hidden"]),R.hidden=!0),S&&(!M.title||h.caption===!1)&&(k||o(S,["hidden"]),S.hidden=!0)}let te=Array.from(L.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!k)for(let R of te)o(R,["tabindex"]);if(a.set(L,te.map(R=>[R,R.getAttribute("tabindex")])),v.clickAction!=="none"&&(v.clickAction!=="link"||M.link)){let R=document.createElement("button");R.type="button",R.className="gc-native-action",R.tabIndex=-1,R.setAttribute("aria-label",(v.clickAction==="link"?"Open link for ":"Open ")+C),R.addEventListener("click",()=>O(M,p)),L.append(R),L.setAttribute("aria-keyshortcuts","Enter Space"),L.addEventListener("click",ne=>{ne.defaultPrevented||ne.target.closest("a,button,input,select,textarea,label")||O(M,p)}),L.addEventListener("keydown",ne=>{ne.target!==L||!["Enter"," "].includes(ne.key)||(ne.preventDefault(),R.click())})}return L}function w(M){let p=M.tabIndex===0&&M.getAttribute("aria-hidden")!=="true";for(let[h,v]of a.get(M)||[]){let O=p?v:"-1";h.getAttribute("tabindex")!==O&&(O===null?h.removeAttribute("tabindex"):h.setAttribute("tabindex",O))}}function d(M){if(!x)return;let p=M!=="native";e.querySelectorAll(".list-item-content__title").forEach(h=>h.classList.toggle("gc-card-title",p)),e.querySelectorAll(".list-item-content__description").forEach(h=>h.classList.toggle("gc-card-description",p))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!x){i.forEach((M,p)=>M.replaceChildren(...r[p])),e.replaceChildren(...s);for(let[M,p]of c)for(let[h,v]of p)M.getAttribute(h)!==v&&(v===null?M.removeAttribute(h):M.setAttribute(h,v));t.after(e),c.length=0,f.clear(),x=!1}}return{track:e,begin:u,makeCard:m,slot:M=>n.get(M),syncFocus:w,setType:d,restore:y}}var ua=Y(()=>{});function ha(t,e,i){if(!i.closest(".fluid-engine > .fe-block"))return()=>{};i.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let a=0,s=!1,r=new WeakSet,c=m=>{m&&!r.has(m)&&(r.add(m),f.observe(m))},o=()=>{!a&&!s&&(a=requestAnimationFrame(u))},f=new ResizeObserver(o),x=new MutationObserver(o);function u(){if(a=0,s||!e.isConnected)return;let m=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!m)return;let w=m.classList.contains("gc-carousel-stage"),d=m.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(m);let y=0;for(let p of d.children){if(p===m||p.contains(m))continue;c(p);let h=getComputedStyle(p);h.display==="none"||["absolute","fixed"].includes(h.position)||(y+=p.offsetHeight+(parseFloat(h.marginTop)||0)+(parseFloat(h.marginBottom)||0))}let M=Math.max(1,t.clientHeight-y);if(w){let p=m.parentElement;p.classList.contains("gc-block-stage-window")||(p=document.createElement("div"),p.className="gc-block-stage-window",m.before(p),p.append(m));let h=Math.min(1,M/Math.max(1,m.offsetHeight));p.style.height=M+"px",m.style.setProperty("--gc-block-scale",String(h)),m.style.setProperty("--gc-block-top",Math.max(0,(M-m.offsetHeight*h)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",M+"px")}return c(t),x.observe(e,{childList:!0,subtree:!0}),o(),()=>{s=!0,cancelAnimationFrame(a),f.disconnect(),x.disconnect(),i.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let m=e.querySelector(".gc-block-stage-window");if(m){let w=m.firstElementChild;w.style.removeProperty("--gc-block-scale"),w.style.removeProperty("--gc-block-top"),m.replaceWith(w)}}}var fa=Y(()=>{});function ma(t,e,i,n){let a=i.ownerDocument,s=a.defaultView,r=n!=="list"?i.closest(".fluid-engine > .fe-block"):null;r?.classList.add("gc-viewport-cell");let c=[],o=r||i;for(let u=t.parentElement;u&&(["hidden","clip","auto","scroll"].includes(s.getComputedStyle(u).overflowX)&&c.push(u),u!==o);u=u.parentElement);function f(){let u=a.documentElement.clientWidth;if(!u||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let y=d.getBoundingClientRect().left+s.scrollX+d.clientLeft,M=y>.5||y+d.clientWidth<u-.5;d.classList.toggle("gc-viewport-unclip",M)}let m=-(t.getBoundingClientRect().left+s.scrollX),w=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};w("--gc-viewport-width",u+"px"),w("--gc-viewport-offset",m+"px")}f();let x=s.ResizeObserver?new s.ResizeObserver(f):null;return x?.observe(t),x?.observe(a.documentElement),s.addEventListener("resize",f),()=>{x?.disconnect(),s.removeEventListener("resize",f);for(let u of c)u.classList.remove("gc-viewport-unclip");r?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var ba=Y(()=>{});var va,ya=Y(()=>{va=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function xa(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),!document.getElementById("gc-finish-css")){let n=document.createElement("style");n.id="gc-finish-css",n.textContent=va,document.head.append(n)}t.dataset.gcEdges=e.edgeMode,t.dataset.gcBack=e.backFace,t.dataset.gcControlShape=e.controlShape,t.dataset.gcArrows=e.arrowStyle,t.dataset.gcControlPalette=e.controlPalette,t.dataset.gcTitlePalette=e.titlePalette,t.toggleAttribute("data-gc-title-size",e.titleSize>0),t.toggleAttribute("data-gc-title-weight",e.titleWeight!=="inherit");let i={"--gc-edge-direction":["wall","spiral"].includes(e.preset)?"to bottom":"to right","--gc-edge-fade":e.edgeFade+"%","--gc-back-color":e.backColor,"--gc-control-size":e.controlSize+"px","--gc-control-fill":e.controlFill,"--gc-control-ink":e.controlInk,"--gc-title-size":e.titleSize+"rem","--gc-title-weight":e.titleWeight,"--gc-title-color":e.titleColor};for(let[n,a]of Object.entries(i))t.style.setProperty(n,a);t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}var Gt,wa=Y(()=>{ya();Gt={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset",spiralRadius:0,spiralRim:"#263448",backFace:"mirror",backColor:"#263448",edgeMode:"preset",edgeFade:12,controlSize:44,controlShape:"circle",arrowStyle:"arrow",controlPalette:"theme",controlFill:"#263448",controlInk:"#ffffff",titleSize:0,titleWeight:"inherit",titlePalette:"theme",titleColor:"#263448"}});function ka(t,e){let i=t.classList.contains("gc-embed"),n=i&&e.colorSource==="section";n?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,i&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let a=t.style;a.setProperty("--gc-custom-background",e.background),a.setProperty("--gc-custom-ink",e.ink),a.setProperty("--gc-custom-accent",e.accent),a.setProperty("--gc-background",n?"var(--gc-section-surface)":e.background),a.setProperty("--gc-ink",n?"var(--gc-section-body)":e.ink),a.setProperty("--gc-accent",n?"var(--gc-section-action)":e.accent),a.setProperty("--gc-muted",n?"var(--gc-section-body)":e.ink+"aa"),a.setProperty("--gc-spatial-surface","var(--gc-background)"),a.setProperty("--gc-spatial-ink","var(--gc-ink)"),n&&(a.setProperty("--gc-line-color","var(--gc-section-line)"),a.setProperty("--gc-tint","var(--gc-section-body)")),a.background=n?"transparent":e.background,a.color=n?"var(--gc-section-body)":e.ink;for(let s of t.querySelectorAll(":scope > dialog"))Sa(t,s)}function Sa(t,e){for(let i of["gcColorSource","gcTypeSource"])t.dataset[i]?e.dataset[i]=t.dataset[i]:delete e.dataset[i]}function _t(t,e){let i=t.classList.contains("gc-embed")?t:t.ownerDocument.body;Sa(t,e),e.parentElement!==i&&i.append(e)}var Ma=Y(()=>{});var Aa,Ca=Y(()=>{Aa=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var Pa,Ea=Y(()=>{Pa=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var ja,La=Y(()=>{ja=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var Ta,za=Y(()=>{Ta=`.gc-carousel {
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
`});var qa,Ia=Y(()=>{qa=`.gc-spatial {
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
`});function et(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Pt(t,e){let i=et(e.preset??t.preset),n=i===et(t.preset)?t.stageHeight:i?0:590;return{...t,...e,stageHeight:e.stageHeight??n}}function Fa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function Na(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[Aa,Pa,ja].join(`
`),document.head.append(e));let i=Fa(t);if(i==="common")return()=>{};let n=`gc-runtime-${i}-css`,a=document.getElementById(n);a||(a=document.createElement("style"),a.id=n,i==="carousel"?a.textContent=Ta:i==="spatial"?a.textContent=qa:a.textContent=[Zi,Xi,ea,ia].join(`
`),e.after(a)),a.dataset.gcOwners=String(Number(a.dataset.gcOwners||0)+1);let s=!1;return()=>{if(s)return;s=!0;let r=Number(a.dataset.gcOwners)-1;r>0?a.dataset.gcOwners=String(r):a.remove()}}function Pr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function Ra(t,e,i={},n=null){let a=Pt(ot,i),s=null,r=null,c=null,o=0,f=0,x,u;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function m(){r&&(r.close(),r.remove(),r=null,s?.setSuspended?.(!1),c?.focus({preventScroll:!0}))}function w(k,A){if(a.clickAction==="none")return;if(a.clickAction==="link"){let j=ct(k.link);j&&window.open(j,"_blank","noopener,noreferrer");return}c=document.activeElement,r&&m(),r=document.createElement("dialog"),r.className="gc-dialog"+(a.preset==="showcase"?" gc-dialog-drawer":""),r.setAttribute("aria-label",k.title||"Image preview");let L=document.createElement("button");L.className="gc-dialog-close",L.type="button",L.textContent="Close \xD7",L.addEventListener("click",m);let C=document.createElement("div");C.className="gc-dialog-content";let E=document.createElement("div");E.className="gc-dialog-media",k.src&&(E.append(Dt(k)),C.append(E));let S=document.createElement("div");if(S.className="gc-dialog-copy",k.title){let j=document.createElement("h2");j.textContent=k.title,S.append(j)}if(k.postUrl){let j=document.createElement("article");S.append(j),si(j,k)}else if(k.description){let j=document.createElement("div");j.innerHTML=At(k.description),S.append(j)}if(k.link){let j=document.createElement("a");j.href=ct(k.link),j.textContent=k.buttonLabel||"Open link",j.target="_blank",j.rel="noopener noreferrer",S.append(j)}let F=document.createElement("p");F.className="gc-dialog-count",F.textContent=`${A+1} / ${e.length}`,S.append(F),C.append(S),r.append(L,C),_t(t,r),r.showModal(),s?.setSuspended?.(!0),Et(E.querySelector("img")),L.focus(),r.addEventListener("cancel",j=>{j.preventDefault(),m()}),r.addEventListener("click",j=>{if(j.target===r){let te=r.getBoundingClientRect();(j.clientX<te.left||j.clientX>te.right||j.clientY<te.top||j.clientY>te.bottom)&&m()}})}function d(k,A,L={}){if(n)return n.makeCard(k,A,L,a,w);let C=document.createElement("button");C.type="button",C.className="gc-card",C.setAttribute("aria-label",k.title||`Image ${A+1}`);let E=document.createElement("span");E.className="gc-card-media",k.src&&(E.append(Dt(k)),C.append(E));let S=document.createElement("span");if(S.className="gc-card-copy",L.caption!==!1&&a.showTitles&&k.title){let F=document.createElement("span");F.className="gc-card-title",F.textContent=k.title,S.append(F)}if(L.description&&k.description){let F=document.createElement("span");F.className="gc-card-description",F.textContent=Pr(k.description),S.append(F)}return S.childNodes.length&&C.append(S),C.addEventListener("click",()=>w(k,A)),C}let y=matchMedia("(prefers-reduced-motion: reduce)"),M=matchMedia("(max-width: 660px)");function p(){let k={...a,reducedMotion:a.reducedMotion||y.matches};return M.matches&&(a.mobileCardWidth!=null&&(k.cardWidth=a.mobileCardWidth),a.mobileGap!=null&&(k[a.preset==="spiral"?"spiralGap":"gap"]=a.mobileGap)),k.phoneWidthOverride=M.matches&&a.mobileCardWidth!=null,a.preset==="stack"&&(k.stackCardWidth=M.matches&&a.mobileCardWidth!=null?a.mobileCardWidth:Math.max(360,a.cardWidth*2.2)),k}function h(){t.classList.toggle("gc-hide-controls",a.showControls===!1),xa(t,a),t.style.setProperty("--gc-fit",a.fit),t.style.setProperty("--gc-card-radius",a.radius+"px"),ka(t,a)}function v(k=0){m(),s?.destroy(),s=null,n?.restore(),cancelAnimationFrame(f),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let A=Fa(a.preset);A!==x&&(u?.(),u=Na(a.preset),x=A),h(),t.setAttribute("aria-label",a.previewScroll===!1?"Gallery":"Gallery preview");let L=n&&a.preset!=="spiral"?n:null;L?L.begin():n&&n.track.classList.add("gc-native-items-hidden");let C={host:t,items:e,openPost:w,initialIndex:k,nativeList:L,attachDialog:E=>_t(t,E),options:p(),makeCard:d,loadImage:Et,onChange(E){o=E,a.onChange?.(E)}};if(!e.length){let E=document.createElement("p");E.className="gc-empty",E.textContent="Add images to your source to start exploring.",t.append(E);return}a.preset==="spiral"?s=sa(C):a.preset==="stack"?s=ui(C):["wall","ring","angled"].includes(a.preset)?(s=pi(C),k&&s.goTo(k)):s=li(C),a.preset!=="spiral"&&(f=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(E=>{Et(E,{nativeCard:!!L})})))}let O=()=>v(o);function T(){a.mobileCardWidth==null&&a.mobileGap==null||(s?.setGeometry?s.setGeometry(p()):a.preset==="spiral"?s?.update(p()):v(o))}try{v()}catch(k){throw u?.(),n?.restore(),k}return y.addEventListener("change",O),M.addEventListener("change",T),{update(k){let A=a.preset,L=p();a=Pt(a,k);let C=p(),E=Object.keys(C).filter(F=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(F)&&C[F]!==L[F]);if(!E.length)return;if(s?.setGeometry&&E.every(F=>["cardWidth","gap","phoneWidthOverride"].includes(F))){s.setGeometry(C);return}let S=F=>["colorSource","typeSource","background","ink","accent"].includes(F);if(E.every(F=>S(F)||A!=="spiral"&&(F==="radius"||Object.hasOwn(Gt,F)))){h(),E.includes("typeSource")&&n?.setType(a.typeSource);return}A==="spiral"&&a.preset==="spiral"&&s?.update?(h(),s.update(C)):v(A===a.preset?o:0)},goTo(k){s?.goTo?.(k)},setPlaying(k){a.autoplay=k,s?.setPlaying?.(k)},getOptions(){return{...a}},getActive(){return o},destroy(){m(),cancelAnimationFrame(f),s?.destroy(),n?.restore(),y.removeEventListener("change",O),M.removeEventListener("change",T),t.replaceChildren(),t.classList.remove("gc-stage","gc-hide-controls"),u?.()}}}function Lr(t,e){let i=e.closest("section")||e,n=[];for(let a=t.parentElement;a;a=a.parentElement){let s=we.scrollBoundaries.get(a)||0;if((s||["hidden","auto","scroll","overlay"].includes(getComputedStyle(a).overflowY))&&(we.scrollBoundaries.set(a,s+1),a.classList.add("gc-stack-page-scroll"),n.push(a)),a===i)break}return()=>{for(let a of n){let s=we.scrollBoundaries.get(a)-1;s?we.scrollBoundaries.set(a,s):(we.scrollBoundaries.delete(a),a.classList.remove("gc-stack-page-scroll"))}}}function dt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function Xt(t){if(!we.editListeners?.size){we.editListeners=new Set;let e=dt();we.editObserver=new MutationObserver(()=>{let i=dt();if(i!==e){e=i;for(let n of we.editListeners)try{n(i)}catch(a){console.warn("Gallery Studio: could not resume a list layout.",a)}}});for(let i of[document.body,document.documentElement])we.editObserver.observe(i,{attributes:!0,attributeFilter:["class"]})}return we.editListeners.add(t),()=>{we.editListeners.delete(t),we.editListeners.size||we.editObserver.disconnect()}}function Yt({selector:t,type:e="gallery",options:i={}}={}){let n=t;if(typeof t=="string")try{let j=document.querySelectorAll(t);if(j.length!==1)return null;n=j[0]}catch{return null}if(!n?.isConnected||typeof n.closest!="function")return null;let a=ft(n,e);if(!a)return null;let{source:s}=a,r=we.mounts.get(s);if(r)return r.instance.update(i),r;if(!lt(s,e).length)return null;let c=document.createElement("div"),o=document.createElement("div");c.className="gc-embed",o.className="gc-viewport-slot",o.append(c);let f={...Pt(ot,i),previewScroll:!1},x=null,u=null,m=null,w=null,d=null,y=!1,M=[],p=null,h=!1,v=null;function O(){f.galleryWidth==="source"?(m?.(),m=null,p&&(o.classList.add("user-items-list-simple"),o.dataset.layoutWidth=p.mode,o.style.maxWidth=p.maximum)):m||(o.classList.remove("user-items-list-simple"),delete o.dataset.layoutWidth,o.style.removeProperty("max-width"),m=ma(o,c,s,e))}function T(){return e!=="list"&&f.preset!=="stack"&&f.galleryHeight!=="custom"&&!!s.closest(".fluid-engine > .fe-block")}function k(){T()?w||(w=ha(o,c,s)):(w?.(),w=null)}function A(j){j==="stack"?u||(u=Lr(c,s)):u&&(u(),u=null)}function L(){try{x?.destroy()}finally{x=null,w?.(),w=null,A(null),m?.(),m=null,M.forEach(j=>j.classList.remove("gc-native-items-hidden")),M=[],v?.remove(),v=null,o.remove(),o.replaceChildren(c),c.inert=!1}}function C(){if(y||x||!s.isConnected)return;let j=ft(s,e),te=lt(s,e);if(!j||!te.length)return;j.originals[0].before(o),Na();let R=j.originals[0];p=e==="list"?{mode:R.dataset.layoutWidth||"full",maximum:R.style.maxWidth}:null,O();let ne=null;if(e==="list"){let ee=h?R.cloneNode(!0):R;h&&(v=ee,ee.removeAttribute("id"),ee.querySelectorAll("[id]").forEach(se=>se.removeAttribute("id")),o.append(ee)),ne=ga(o,ee,h?[...ee.querySelectorAll(".list-item")]:j.rows)}(!ne||h)&&(M=j.originals,M.forEach(ee=>ee.classList.add("gc-native-items-hidden"))),k(),A(f.preset),x=Ra(c,te,f,ne),c.inert=h}function E(){if(!y){y=!0,s.classList.remove("gc-edit-preview");try{L()}finally{d?.(),we.mounts.delete(s)}}}let F={instance:{update(j={}){if(y)return;let te=f.galleryWidth;f={...Pt(f,j),previewScroll:!1},x&&(f.galleryWidth!==te&&O(),k(),A(f.preset),x.update(f))},setEditPreview(j){if(!(y||!dt()||j===h)){if(h=j,s.classList.toggle("gc-edit-preview",j),!j){L();return}try{C()}catch(te){throw this.setEditPreview(!1),te}}},goTo(j){x?.goTo(j)},setPlaying(j){f.autoplay=j,x?.setPlaying(j)},getOptions(){return{...f}},getActive(){return x?.getActive()??0},destroy:E},host:c,source:s,destroy:E};try{d=Xt(j=>{if((h||j)&&L(),h=!1,s.classList.remove("gc-edit-preview"),!j)try{C()}catch(te){throw L(),te}}),dt()||C(),we.mounts.set(s,F)}catch(j){throw E(),j}return F}var mt,ot,we,Vt=Y(()=>{ci();di();gi();hi();ca();wt();Ut();ua();fa();ba();wa();Ma();Ca();Ea();La();za();Ia();ta();Ki();Qi();_i();mt=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],ot={...Gt,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",showControls:!0,cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};we=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:Ra,embed:Yt,presets:mt}});var Wa,$a=Y(()=>{Wa=`:host {
  all: initial;
  position: fixed;
  z-index: 2147483000;
  inset: auto max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) auto;
  display: block;
  width: min(350px, calc(100vw - 32px));
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
select { min-width: 0; max-width: 100%; min-height: 34px; padding: 4px 7px; border: 1px solid #cdd1c5; border-radius: 7px; background: #fff; }
.preset-select { width: 100%; min-height: 39px; padding-inline: 10px; font-weight: 600; }
.style-actions { display: flex; gap: 8px; padding: 0 13px 8px; margin-top: -6px; }
.style-transfer { padding: 0 18px 12px; }
.style-transfer textarea { margin-bottom: 6px; }
.override-toggle { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.field-range .override-toggle input { width: 16px; height: 16px; }
.field-range input[type=range]:disabled { cursor: default; opacity: .55; }
.group { border-top: 1px solid #dfe1d8; }
.group summary { display: flex; justify-content: space-between; align-items: center; min-height: 43px; padding: 10px 18px; cursor: pointer; list-style: none; font-size: 13px; font-weight: 600; }
.group summary::-webkit-details-marker { display: none; }
.group summary::after { content: ''; width: 7px; height: 7px; margin-right: 4px; border-right: 1.5px solid #555b50; border-bottom: 1.5px solid #555b50; transform: translateY(-2px) rotate(45deg); }
.group[open] summary::after { transform: translateY(2px) rotate(225deg); }
.group summary:hover { background: #f0f1ea; }
.group-body { display: grid; gap: 12px; padding: 4px 18px 16px; }
.field { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 5px 9px; min-width: 0; }
.field .field-label { font-weight: 450; }
.field-select select { width: 145px; font-size: 12px; }
.value { font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: #60665a; font-variant-numeric: tabular-nums; }
.field-range input { grid-column: 1 / -1; display: block; width: 100%; height: 20px; margin: 0; accent-color: #354b9c; cursor: pointer; }
.field-checkbox input { width: 17px; height: 17px; margin: 0; accent-color: #354b9c; }
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
`});function K(t,e,i){let n=document.createElement(t);return e&&(n.className=e),i!==void 0&&(n.textContent=i),n}function Ie(t,e,i){let n=K("button",t,e);return n.type="button",i&&n.setAttribute("aria-label",i),n}function We(t,e,i,n,a,s=""){return{key:t,label:e,type:"range",min:i,max:n,step:a,unit:s}}function nt(t,e,i){return{key:t,label:e,type:"select",choices:Object.entries(i).map(([n,a])=>({value:n,label:a}))}}function bt(t,e,i){return{key:t,label:e,type:"color",when:i,independent:!0}}function Jt(t,e){let i=t.preset,n=et(i),a=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},We("cardWidth","Card width",80,i==="timed"?960:i==="spiral"?720:560,1,"px"),We("stageHeight",n?"Minimum gallery height":"Gallery height",n?0:300,1200,1,"px")];if(e!=="list"&&(a.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&a.splice(a.findIndex(r=>r.key==="stageHeight"),1)),i==="spiral")a.push(...gt);else if(a.push(We("gap","Spacing",0,100,1,"px")),i!=="infinite"&&i!=="timed"){let r={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[i]||"Depth";a.push(We("depth",r,0,100,1))}let s=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="summary"?"Open blog post":i==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];return(i==="arc-tabs"||i==="timed")&&s.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),i!=="stack"&&(s.push({key:"showControls",label:"Show controls",type:"checkbox"}),s.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),i!=="spiral"&&s.push(We("duration","Time per image",2,15,.5,"s"))),s.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"}),[{title:"Size & spacing",fields:a},{title:"Mobile overrides",fields:[{...a.find(r=>r.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...a.find(r=>r.key===(i==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:i==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:s},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:zr},...i==="spiral"?[We("spiralRadius","Corner radius",0,64,1,"px"),We("borderWidth","Border width",0,12,1,"px"),bt("spiralRim","Border color")]:[We("radius","Corner radius",0,64,1,"px"),We("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},We("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],...["spiral","ring"].includes(i)?[nt("backFace","Card back",{mirror:"Reversed image",solid:"Solid color"}),bt("backColor","Back color",["backFace","solid"])]:[],...i==="stack"?[]:[nt("edgeMode","Stage edges",{preset:"Layout default",hard:"Hard edge",gradient:"Gradient fade"}),{...We("edgeFade","Fade width at each edge",1,40,1,"%"),when:["edgeMode","gradient"]}],{key:"showTitles",label:"Show titles",type:"checkbox"},{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]},...i==="stack"?[]:[{title:"Control styling",fields:[We("controlSize","Button size",44,72,1,"px"),nt("controlShape","Button shape",{circle:"Circle",rounded:"Rounded square",square:"Square"}),nt("arrowStyle","Arrow style",{arrow:"Arrow",chevron:"Chevron"}),nt("controlPalette","Button colors",{theme:"Use layout colors",custom:"Custom"}),bt("controlFill","Button background",["controlPalette","custom"]),bt("controlInk","Button icon",["controlPalette","custom"])]}],{title:"Title styling",fields:[{key:"titleSize",label:"Title size",type:"select",numeric:!0,choices:[{value:0,label:"Use layout size"},...[.875,1,1.25,1.5,2,2.5,3,4].map(r=>({value:r,label:r+" rem"}))]},nt("titleWeight","Title weight",{inherit:"Use layout weight",400:"Regular",500:"Medium",600:"Semibold",700:"Bold"}),nt("titlePalette","Title color",{theme:"Use layout color",custom:"Custom"}),bt("titleColor","Custom title color",["titlePalette","custom"])]}]}function Oa(t){return{...ot,stageHeight:et(t.preset??ot.preset)?0:590,...t.preset==="spiral"?Ye:{},colorSource:"section",typeSource:"native",...t}}function Tr(t){let e=t.type==="list"?"List Section":t.type==="summary"?"Summary Block":"Gallery Block",i=t.name?.trim()||e,n=t.items?.length||0;return`${i.toLowerCase().includes(e.toLowerCase())?i:`${i} \xB7 ${e}`} \xB7 ${n} ${n===1?"item":"items"}`}function Ir(t){let e=window.frameElement;if(!e||e.id!=="sqs-site-frame")return()=>{};let i=e.ownerDocument,n=i.defaultView,a=0;function s(){a=0;let f=e.getBoundingClientRect();if(!f.width||!f.height||!e.offsetHeight)return;let x=f.height/e.offsetHeight,u=t.getBoundingClientRect(),m=f.width/e.offsetWidth,w=Math.min(f.bottom,n.innerHeight),d=w;for(let y of[.1,.5,.9]){let M=f.left+(u.left+u.width*y)*m,p=i.elementFromPoint(M,w-2);if(!(!p||p===e))for(;p&&!p.contains(e);){let h=p.getBoundingClientRect();h.bottom>=w-2&&h.height>0&&h.height<f.height/2&&(d=Math.min(d,h.top)),p=p.parentElement}}t.style.setProperty("--gc-editor-bottom",Math.max(0,Math.ceil((f.bottom-d)/x))+"px")}function r(){a||(a=requestAnimationFrame(s))}let c=new ResizeObserver(r);c.observe(e),c.observe(i.documentElement);let o=new MutationObserver(r);return o.observe(i.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["hidden","class","style"]}),n.addEventListener("resize",r),n.addEventListener("transitionend",r),s(),()=>{c.disconnect(),o.disconnect(),n.removeEventListener("resize",r),n.removeEventListener("transitionend",r),cancelAnimationFrame(a)}}function Ha({source:t,options:e,onPreset:i,onOption:n,onClose:a,onRestore:s,onSave:r,getSaveState:c,getCode:o,getStyle:f,applyStyle:x}){let u=document.activeElement,m=t,w=Oa(e),d=!1,y=!1,M=0,p=new Map,h=new Map,v=K("div");v.setAttribute("data-gc-author-panel",""),v.setAttribute("data-lenis-prevent",""),v.addEventListener("wheel",P=>P.stopPropagation(),{passive:!0}),v.addEventListener("touchmove",P=>P.stopPropagation(),{passive:!0});let O=v.attachShadow({mode:"open"}),T=K("style");T.textContent=Wa;let k=K("aside","panel");k.setAttribute("aria-labelledby","gc-author-heading");let A=K("header","header"),L=K("div","heading"),C=K("h2","","Gallery settings");C.id="gc-author-heading";let E=K("p","target"),S=K("p","save-state");S.setAttribute("role","status"),L.append(C,E,S);function F(P=c()){S.textContent!==P&&(S.textContent=P,S.dataset.saved=String(P==="Saved to page"))}let j=K("div","header-actions"),te=Ie("icon-button","\u2212","Minimize settings");te.setAttribute("aria-controls","gc-author-controls"),te.setAttribute("aria-expanded","true");let R=Ie("icon-button","\xD7","Close settings");j.append(te,R),A.append(L,j);let ne=K("div","controls");ne.id="gc-author-controls";let ee=K("div","scroll");ee.tabIndex=0,ee.setAttribute("aria-label","Layout settings");let se=K("label","preset-row"),he=K("select","preset-select");he.setAttribute("aria-label","Layout");for(let P of mt.filter(q=>t.type==="list"||q.id!=="stack")){let q=K("option","",P.name);q.value=P.id,he.append(q)}se.append(K("span","field-label","Layout"),he);let Le=K("div","groups"),$=K("div","style-actions"),W=Ie("text-button","Copy style"),B=Ie("text-button","Paste style");$.append(W,B);let J=K("div","style-transfer");J.hidden=!0;let V=K("textarea");V.setAttribute("aria-label","Gallery style"),V.spellcheck=!1;let Z=Ie("secondary","Apply style"),ce=Ie("text-button","Close","Close style transfer");J.append(V,Z,ce),ee.append(se,$,J,Le);let H=K("footer","footer"),X=K("div","export-actions"),pe=Ie("primary","Save to page"),le=Ie("secondary","Copy code"),ie=Ie("text-button","Download header backup");ie.hidden=!0;let Q=null,G=Ie("secondary","View code");G.setAttribute("aria-expanded","false"),G.setAttribute("aria-controls","gc-author-code"),X.append(pe,le);let me=K("div","code-view");me.id="gc-author-code",me.hidden=!0;let xe=K("label","code-label","Page Header Code Injection"),ve=K("textarea");ve.readOnly=!0,ve.spellcheck=!1,ve.setAttribute("aria-label","Page header code"),xe.append(ve),me.append(xe);let je=K("div","footer-line"),D=K("span","status");D.setAttribute("role","status");let ke=Ie("text-button","Reset preview");je.append(D,ke);let _=K("div","backup-actions"),ze=Ie("text-button","Remove layout");ze.hidden=c()==="Not saved yet",_.append(G,ie,ze);let re=K("div","removal");re.hidden=!0,re.append(K("p","","Restore the native "+m.name+" and remove its saved layout from this page?"));let Oe=Ie("secondary","Keep layout"),Se=Ie("secondary","Remove saved layout");re.append(Oe,Se),H.append(X,_,me,re,je),ne.append(ee,H),k.append(A,ne),O.append(T,k),document.body.append(v);let Ae=Ir(v);function be(P){let{definition:q,input:oe,output:ae,row:fe}=P,l=w[q.key];if(q.when&&(fe.hidden=w[q.when[0]]!==q.when[1]),q.type==="checkbox"){oe.checked=!!l;return}if(q.type==="range"){let g=q.key==="spiralRise"&&w.spiralRiseUnit==="percent"?{...q,...q.percent}:q;oe.min=String(g.min),oe.max=String(g.max),oe.step=String(g.step);let b=q.inherits&&l==null;P.enable&&(P.enable.checked=!b,oe.disabled=!!b),oe.value=String(b?w[q.inherits]:l);let N=["titleSize","stageHeight"].includes(g.key)&&g.min===0&&Number(oe.value)===0?"Auto":`${oe.value}${g.unit||""}`;ae.textContent=b?`Inherit \xB7 ${N}`:N,oe.setAttribute("aria-valuetext",N);return}oe.value=String(l),q.type==="color"&&(q.independent||(fe.hidden=w.colorSource==="section"),ae.textContent=oe.value.toUpperCase())}function He(){F(),M+=1,D.textContent="",me.hidden||(ve.value=o())}function Be(P,q){let oe=w.spiralRiseUnit;if(w={...w,[P]:q},P==="spiralRiseUnit"&&oe!==q){let ae=Math.max(1,w.stageHeight),fe=q==="percent"?Math.max(1,Math.min(30,Math.round(w.spiralRise/ae*1e3)/10)):Math.max(8,Math.min(280,Math.round(w.spiralRise*ae/100)));w.spiralRise=fe,n(P,q),n("spiralRise",fe),be(p.get("spiralRise"))}else n(P,q);P==="galleryHeight"&&tt(),P==="colorSource"?p.forEach(be):be(p.get(P));for(let ae of p.values())(ae.definition.inherits===P||ae.definition.when?.[0]===P)&&be(ae);He()}function Ne(P){let{key:q,label:oe,type:ae}=P,fe=K(P.inherits?"div":"label",`field field-${ae}`),l=K("span","field-label",oe),g=K(ae==="select"?"select":"input");if(g.setAttribute("aria-label",oe),g.dataset.option=q,ae==="select")for(let N of P.choices){let I=K("option","",N.label);I.value=N.value,g.append(I)}else g.type=ae;let b;(ae==="range"||ae==="color")&&(b=K("output","value"),b.setAttribute("aria-hidden","true")),fe.append(l),b&&fe.append(b),fe.append(g);let z={definition:P,input:g,output:b,row:fe};if(P.inherits){let N=K("input");N.type="checkbox",N.setAttribute("aria-label","Customize "+oe.toLowerCase());let I=K("label","override-toggle");I.append(N,l),fe.prepend(I),z.enable=N,N.addEventListener("change",()=>Be(q,N.checked?w[P.inherits]:null))}return p.set(q,z),be(z),g.addEventListener(ae==="range"||ae==="color"?"input":"change",()=>{let N=ae==="range"||P.numeric?Number(g.value):ae==="checkbox"?g.checked:g.value;Be(q,N)}),fe}function tt(){let P=new Map([...h].map(([q,oe])=>[q,oe.open]));p.clear(),h.clear(),Le.replaceChildren();for(let q of Jt(w,m.type)){let oe=K("details","group");oe.open=P.get(q.title)??q.title==="Size & spacing";let ae=K("summary","",q.title),fe=K("div","group-body");for(let l of q.fields)fe.append(Ne(l));oe.append(ae,fe),Le.append(oe),h.set(q.title,oe)}}function Ve(P){if(y)return;let q=w.preset;m=P.source??m,P.options&&(w=Oa(P.options)),E.textContent=Tr(m),E.title=m.selector||E.textContent,he.value=w.preset,!p.size||q!==w.preset?tt():p.forEach(be),He()}function Je(P){me.hidden=!P,G.textContent=P?"Hide code":"View code",G.setAttribute("aria-expanded",String(P)),P&&(ve.value=o(),ve.focus({preventScroll:!0}),ve.select())}function Re(){if(y)return;y=!0,M+=1;let P=document.activeElement===v;document.removeEventListener("keydown",Ee),Ae(),v.remove(),P&&u?.isConnected&&u.focus({preventScroll:!0})}function Te(P){if(!y)try{P()}finally{Re()}}function Ee(P){if(!(P.key!=="Escape"||P.defaultPrevented||P.isComposing)){if(!re.hidden){P.preventDefault(),De(!1);return}document.querySelector("dialog[open]")||P.composedPath().some(q=>q?.getAttribute?.("aria-modal")==="true")||(P.preventDefault(),Te(a))}}te.addEventListener("click",()=>{d=!d,ne.hidden=d,v.toggleAttribute("data-minimized",d),te.textContent=d?"+":"\u2212",te.setAttribute("aria-expanded",String(!d)),te.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),R.addEventListener("click",()=>Te(a)),ke.addEventListener("click",()=>Te(s)),he.addEventListener("change",()=>i(he.value)),G.addEventListener("click",()=>Je(me.hidden));function Ge(P,q){J.hidden=!1,Z.hidden=P,V.readOnly=P,V.value=q,V.placeholder=P?"":"Paste the copied gallery style",V.focus(),P&&V.select()}W.addEventListener("click",async()=>{let P=f();try{await navigator.clipboard.writeText(P),y||(J.hidden=!0,D.textContent="Style copied")}catch{if(y)return;Ge(!0,P),D.textContent="Style selected. Choose Copy."}}),B.addEventListener("click",()=>{D.textContent="",Ge(!1,"")}),ce.addEventListener("click",()=>{J.hidden=!0,B.focus()}),Z.addEventListener("click",()=>{if(!x(V.value)){D.textContent="Paste a style from Copy style.",V.focus();return}J.hidden=!0,D.textContent="Style applied to this preview",B.focus()}),ie.addEventListener("click",()=>{if(!Q)return;let P=URL.createObjectURL(new Blob([Q.header],{type:"text/plain"})),q=document.createElement("a");q.href=P,q.download="gallery-header-backup-"+Q.collectionId+".txt",q.click(),setTimeout(()=>URL.revokeObjectURL(P),1e3)});async function qe(P=!1){if(P&&De(!1),!pe.disabled){pe.disabled=ke.disabled=ze.disabled=!0,ee.inert=!0,pe.textContent="Saving\u2026",F(P?"Removing\u2026":"Saving\u2026"),D.textContent=P?"Removing layout\u2026":"Saving to page header\u2026";try{await r(q=>{Q=q,y||(ie.hidden=!1)},P),y||(D.textContent="Saved to page header")}catch(q){y||(D.textContent=q.message||"Save failed. Copy code is still available.")}finally{y||(pe.disabled=ke.disabled=ze.disabled=!1,ze.hidden=c()==="Not saved yet",ee.inert=!1,pe.textContent="Save to page",F())}}}pe.addEventListener("click",()=>qe());function De(P){re.hidden=!P,ee.inert=P,X.hidden=_.hidden=je.hidden=P,P?(Je(!1),Oe.focus()):ze.focus()}return ze.addEventListener("click",()=>De(!0)),Oe.addEventListener("click",()=>De(!1)),Se.addEventListener("click",()=>qe(!0)),le.addEventListener("click",async()=>{let P=++M,q=o();try{await navigator.clipboard.writeText(q),!y&&P===M&&(D.textContent="Page code copied")}catch{if(y||P!==M)return;Je(!0),D.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Ee),Ve({source:t,options:e}),he.focus({preventScroll:!0}),{element:v,update:Ve,destroy:Re}}var zr,Ba=Y(()=>{Vt();$a();zr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var Ua,Da=Y(()=>{Ua=`.gc-config-position{position:relative!important}
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
`});var Ya={};ei(Ya,{startInline:()=>Kt});function pt(t,e={}){let i=jt.get(t),n={...ot,...t==="spiral"?Ye:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:i.width,stageHeight:et(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,s]of Object.entries(e))a==="mobileCardWidth"||a==="mobileGap"?Number.isFinite(s)&&s>=0&&(n[a]=s):a!=="preset"&&Object.hasOwn(n,a)&&typeof s==typeof n[a]&&(n[a]=s);return n}function Xa(t){return Jt(t).flatMap(e=>e.fields).filter(e=>!_a.has(e.key))}function Fr(t){let e=Object.fromEntries(Xa(t).map(({key:i})=>[i,t[i]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Nr(t,e){let i;try{i=JSON.parse(t)}catch{return null}if(i?.format!=="gallery-studio-style"||i.version!==1||!jt.has(i.preset)||!i.values||typeof i.values!="object"||Array.isArray(i.values))return null;let n=pt(i.preset);for(let a of _a)n[a]=e[a];for(let a of Xa(n)){let s=i.values[a.key];if(s!==void 0){if(a.type==="range"){if(a.inherits&&s===null)continue;let r=a.percent&&i.values.spiralRiseUnit==="percent"?a.percent:a;if(!Number.isFinite(s)||s<r.min||s>r.max)return null}else{if(a.type==="checkbox"&&typeof s!="boolean")return null;if(a.type==="select"&&!a.choices.some(r=>r.value===s))return null}if(a.type==="color"&&!/^#[0-9a-f]{6}$/i.test(s))return null;n[a.key]=s}}return n}function Rr(t){return pt(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function Lt(t,e){let i=pt(e.preset),n={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};et(e.preset)&&(n.stageHeight=e.stageHeight);for(let s of Object.keys(i))e.colorSource==="section"&&Ga.has(s)||e[s]!==i[s]&&(n[s]=e[s]);let a={v:1,selector:t.selector,type:t.type,options:n};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(a,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Kt(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let i=da(),n=new Map(i.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),a=null,s=null,r=null,c=!1,o=[];function f(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=Yt({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function x(d=!0){if(!s)return;let y=s;s=null,a?.destroy(),a=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function u(d){x(),d.presets.clear(),d.installed?f(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function m(d){if(s===d){x();return}x(!1);let{source:y}=d;if(d.mounted||(y.items=lt(y.root,y.type)),!y.items.length){let h="Add items in Squarespace, then try again";d.button.querySelector("span").textContent=h,d.button.setAttribute("aria-label",h);return}d.button.querySelector("span").textContent="Configure layout",d.button.setAttribute("aria-label","Configure "+y.name+" layout");let M=d.options||d.installed||pt("arc-tabs",y.type!=="list"?{galleryWidth:"source"}:{});if(y.type!=="list"&&M.preset==="stack"&&(M=pt("arc-tabs",{galleryWidth:"source"}),f(d,M)),!d.mounted&&!f(d,M)){d.button.textContent="No supported layout here";return}s=d;let p=h=>{f(d,h),d.presets.set(h.preset,{...h})};a=Ha({source:y,options:{...d.options},onClose:()=>x(),onRestore:()=>u(d),onPreset:h=>{!jt.has(h)||y.type!=="list"&&h==="stack"||(d.presets.set(d.options.preset,{...d.options}),p({...d.presets.get(h)||pt(h),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),a.update({source:y,options:{...d.options}}))},onOption:(h,v)=>{if(!Object.hasOwn(d.options,h)||h==="preset")return;let O={...d.options,[h]:v};p(O)},getSaveState:()=>d.installed?Lt(y,d.options)===Lt(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Lt(y,d.options),onSave:async(h,v=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let O={...d.options},T=ai();c=!0;try{await ri({snippet:Lt(y,O),context:T,onBackup:h,remove:v}),v?(d.installed=null,s===d?u(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=O}finally{c=!1}},getStyle:()=>Fr(d.options),applyStyle:h=>{let v=Nr(h,d.options);return!v||y.type!=="list"&&v.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),p(v),a.update({source:y,options:d.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),M=document.querySelectorAll(y.selector),p=M.length===1&&n.get(M[0]);if(!p||y.v!==1||y.type!==p.source.type||!jt.has(y.options?.preset))continue;p.installed=Rr(y.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of n.values())d.installed&&f(d,d.installed);if(t&&n.size){let y=function(h=!1){d.setAttribute("aria-pressed",String(h)),d.querySelector("span").textContent=h?"Edit native content":"Preview galleries",d.hidden=!dt()||![...n.values()].some(v=>v.mounted)},M=function(h){if(!h.mounted||h.source.root.isConnected)return;let v=h.source.root,O=document.querySelectorAll(h.source.selector);if(O.length!==1)return;let T=O[0];h.mounted.destroy(),h.mounted=null,h.source.root=T,n.delete(v),n.set(T,h),f(h,h.options);let k=T.querySelector(h.source.type==="list"?".user-items-list":".sqs-block-content")||T;h.button&&(getComputedStyle(k).position==="static"&&k.classList.add("gc-config-position"),k.append(h.button))};r=document.createElement("style"),r.textContent=Ua,document.head.append(r);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let h=d.getAttribute("aria-pressed")!=="true";for(let v of[...n.values()])M(v),v.mounted?.instance.setEditPreview(h);y(h)},document.body.append(d),y();let p=Xt(h=>{h||requestAnimationFrame(()=>{if(d.isConnected)for(let v of[...n.values()])M(v)}),y()});o.push(()=>{p(),d.remove()});for(let h of n.values()){let{source:v}=h;if(!v.selector)continue;let O=v.root.querySelector(v.type==="list"?".user-items-list":".sqs-block-content")||v.root,T=getComputedStyle(O).position==="static";T&&O.classList.add("gc-config-position");let k=document.createElement("button");k.type="button",k.className="gc-config-launch",k.setAttribute("aria-expanded","false"),k.setAttribute("aria-label","Configure "+v.name+" layout"),k.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',k.addEventListener("click",()=>m(h)),O.append(k),h.button=k,o.push(()=>{k.remove(),T&&O.classList.remove("gc-config-position")})}}let w={version:1,destroy(){x(!1);for(let d of n.values())d.mounted?.destroy();for(let d of o)d();r?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=w,w}var jt,Ga,_a,Va=Y(()=>{oi();Vt();Ut();Ba();Da();jt=new Map(mt.map(t=>[t.id,t])),Ga=new Set(["background","ink","accent","borderColor","overlayColor"]);_a=new Set([...Ga,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Kt,{once:!0}):Kt()});var $r;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&($r=(await Promise.resolve().then(()=>(Va(),Ya))).startInline);export{$r as startInline};

var Xa=Object.defineProperty;var Y=(t,e)=>()=>(t&&(e=t(t=0)),e);var Zt=(t,e)=>{for(var i in e)Xa(t,i,{get:e[i],enumerable:!0})};function ei(t,e){if(t===void 0)return null;let i=new Map([...t.matchAll(Ya)].map(a=>[a[1].toLowerCase(),a[2]??a[3]??a[4]??""]));if(!i.has("data-gallery-layout"))return null;if(i.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let n;try{n=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(n?.v!==1||typeof n.selector!="string"||!["list","gallery"].includes(n.type)||!n.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return n}function Va(t,e,i=!1){let n=[...e.matchAll(Qt)];if(n.length!==1||n[0][0]!==e.trim())throw Error("Invalid gallery settings.");let a=ei(n[0][1],n[0][2]);if(!a)throw Error("Missing gallery settings.");let s=!1,r=t.replace(Qt,(c,o,m)=>{let w=ei(o,m);return!w||w.selector!==a.selector?c:i||s?"":(s=!0,e)});return i||s?r:r+(r&&!r.endsWith(`
`)?`
`:"")+e+`
`}function ti(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,i=e?.collection?.id,n=e?.website?.id,a=t.document.cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("crumb="))?.slice(6);if(!mt.test(i||"")||!mt.test(n||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!a)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:i,websiteId:n,crumb:decodeURIComponent(a)}}async function ii({snippet:t,context:e,remove:i=!1,fetchImpl:n=fetch,onBackup:a=()=>{}}){let{collectionId:s,websiteId:r,crumb:c}=e;if(!mt.test(s||"")||!mt.test(r||"")||!c)throw Error("A signed-in Squarespace page is required.");async function o(){let y=await n("/api/commondata/GetCollectionSettings?collectionId="+s,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!y.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let M=await y.json(),p=M.collectionData??M;if(p?.id!==s||p.websiteId!==r||p.deleted===!0||p.folder===!0||p.dropdown===!0)throw Error("Page settings do not match this page.");if(p.headerInjectCode!=null&&typeof p.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:p,memberAreaData:M.memberAreaData??{}}}let m=await o();if(m.model.passwordProtected&&typeof m.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let w=m.model.headerInjectCode??"",g=Va(w,t,i);if(g===w)return{unchanged:!0};a({collectionId:s,header:w,savedAt:new Date().toISOString()});let f=await o();if(JSON.stringify(f)!==JSON.stringify(m))throw Error("Page settings changed while saving. Review the page and save again.");let k;try{k=await n("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":c},body:JSON.stringify({collectionData:{...f.model,collectionId:s,headerInjectCode:g},memberAreaData:f.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!k.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let d;try{d=await o()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((d.model.headerInjectCode??"").trim()!==g.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var mt,Qt,Ya,ai=Y(()=>{mt=/^[a-f0-9]{24}$/i,Qt=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Ya=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function Pt(t){return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Ja[t]}</svg>`}function De(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Pt("play")+Pt("pause"):Pt(e),t}var Ja,bt=Y(()=>{Ja={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function ze(t,e,i){let n=document.createElement(t);return n.className=e,i!==void 0&&(n.textContent=i),n}function nt(t,e,i){let n=ze("button",t,i);return n.type="button",n.setAttribute("aria-label",e),n}function Za(t,e,i,n,a,s){let r=i/2,c=n/2,o=.26,m=e/2+48,w=(i*Math.cos(o)+s)/(2*Math.sin(o)),g=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-a)*.7),i*(3.8-a*2.1),c+Math.max(w,m/Math.sin(Math.PI/3))),f=g-c,k=Math.atan2(r,f),d=Math.hypot(r,f),y=2*(k+Math.asin(s/(2*d))),M=k+Math.asin(m/d),p=g+c,h=Math.hypot(p,r)-p,b=f-Math.sqrt((f-m)*(f+m));return{radius:g,step:y,reach:M/y,above:h,below:b}}function Qa(t,e,i){let n=e/2,a=10+i*9,s=0,r=0;for(let c=0;c<4.1;c+=.5){let o=Math.min(4.1,c+.5),m=Math.max(.48,1-c*(.09+i*.035)),w=(o*(4+i*7)+(c===0?4:0))*Math.PI/180,g=m*(n+t/2*Math.sin(w))-n;s=Math.max(s,g-Math.min(c,4)*a),r=Math.max(r,g+Math.min(o,4)*a)}return{above:s,below:r}}function ri({host:t,items:e=[],initialIndex:i=0,options:n={},makeCard:a,onChange:s,nativeList:r,loadImage:c}){let o=Ka.has(n.preset)?n.preset:"infinite",m=o==="arc"||o==="arc-tabs",w=m||o==="showcase",g=e.length,f=!!n.reducedMotion,k=Ne(at(n.depth,55),0,100)/100,d,y,M;function p(l){d=Ne(at(l.gap,24),0,180),y=Ne(at(l.cardWidth,o==="timed"?760:380),80,1800),M=l.phoneWidthOverride}p(n);let h=Ne(at(n.duration,5),1,60)*1e3,b=ze("section",`gc-carousel gc-preset-${o}`);b.setAttribute("aria-roledescription","carousel"),b.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[o]),b.style.setProperty("--gc-card-radius",`${Ne(at(n.radius,14),0,120)}px`),b.style.setProperty("--gc-stage-height",`${Ne(at(n.stageHeight,0),0,1400)}px`),f&&b.classList.add("gc-reduced-motion");let W=[],z=(l,u,x,I)=>{l.addEventListener(u,x,I),W.push(()=>l.removeEventListener(u,x,I))},v=[],A=[],P=n.navigation==="dots"||n.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),C=o==="arc-tabs"||o==="timed"&&!P,E=ze("nav","gc-carousel-tabs");P&&E.classList.add("gc-choice-dots"),E.setAttribute("aria-label","Choose a slide"),C&&(e.forEach((l,u)=>{let I=(typeof l.title=="string"?l.title.trim():"")||`Slide ${u+1}`,H=P?nt("gc-choice-dot",I):nt("gc-carousel-tab",I,I);z(H,"click",()=>re(u)),z(H,"keydown",q=>{let G;q.key==="ArrowRight"&&(G=it(u+1,g)),q.key==="ArrowLeft"&&(G=it(u-1,g)),q.key==="Home"&&(G=0),q.key==="End"&&(G=g-1),G!==void 0&&(q.preventDefault(),re(G),v[G]?.focus({preventScroll:!0}))}),E.append(H),v.push(H)}),b.append(E));let S=ze("div","gc-carousel-stage");S.tabIndex=g?0:-1,S.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let T=r?.track??ze("div","gc-carousel-track");T.classList.add("gc-carousel-track"),S.append(T),b.append(S);function j(l){let u=a(e[l],l,{caption:n.showTitles!==!1,description:o==="arc-tabs"||o==="timed"});u.classList.add("gc-carousel-card"),u.dataset.gcItemIndex=String(l),u.style.width="var(--gc-carousel-slot-width)",u.tabIndex=-1,u.setAttribute("aria-hidden","true"),r||u.querySelectorAll("img").forEach(I=>{I.draggable=!1,I.style.objectFit=n.fit==="contain"?"contain":"cover"});let x=r?.slot(u)??u;return T.append(x),{card:u,node:x,index:l,logical:l,active:!1}}let Q=e.map((l,u)=>j(u)),F=new Map,oe=!1,ee=ze("div","gc-carousel-controls"),ce=ze("div","gc-carousel-counter");ce.setAttribute("aria-hidden","true");let fe=ze("span","gc-carousel-current",g?"01":"00");ce.append(fe,ze("span","gc-carousel-divider","/"),ze("span","gc-carousel-total",String(g).padStart(2,"0")));let Ie=ze("div","gc-carousel-arrows"),$=De(nt("gc-carousel-arrow","Previous slide"),"previous"),R=De(nt("gc-carousel-arrow","Next slide"),"next");$.disabled=R.disabled=g<2,Ie.append($,R);let D=De(nt("gc-carousel-playback","Play slideshow"),"playback");D.hidden=g<2||f;let V=ze("div","gc-carousel-pagination");V.setAttribute("aria-label","Slide pagination"),o==="timed"&&e.forEach((l,u)=>{let x=nt("gc-carousel-dot",l.title?.trim()||`Go to slide ${u+1}`),I=ze("span","gc-carousel-dot-fill");I.setAttribute("aria-hidden","true"),x.append(I),z(x,"click",()=>re(u)),V.append(x),A.push({dot:x,fill:I})}),ee.append(ce,Ie),o==="timed"&&ee.append(V),ee.append(D),b.append(ee);let J=ze("p","gc-carousel-sr");J.setAttribute("aria-atomic","true"),b.append(J);let K=ze("span","gc-carousel-cursor","Drag");K.setAttribute("aria-hidden","true"),(o==="arc-tabs"||o==="showcase"||o==="arc")&&S.append(K),t.append(b);let le=!1,O=i,_=i,pe=-1,de=0,te=0,se=0,B=!!n.autoplay&&!f&&g>1,be=!1,we=!1,Pe=!1,Be=!1,U=null,Fe=0,X=0,Te=0,ae=0,Ge=()=>Math.max(12,ae*(.36-k*.12)+d-28),Se=-1,Le,je=1,He=0,Oe=0,qe=()=>Be||be||we||Pe||document.hidden||!!U,Ye=l=>{let u=it(Math.round(O),g),x=it(l-u,g);return x>g/2&&(x-=g),Math.round(O)+x};function Ve(){let l=v[pe];if(!l)return;let u=l.offsetLeft,x=u+l.offsetWidth;u<E.scrollLeft?E.scrollLeft=Math.max(0,u-14):x>E.scrollLeft+E.clientWidth&&(E.scrollLeft=x-E.clientWidth+14)}function tt(){let l=g?it(Math.round(O),g):-1;if(l===pe)return;pe=l,fe.textContent=g?String(l+1).padStart(2,"0"):"00",v.forEach((x,I)=>{x.classList.toggle("is-active",I===l),x.setAttribute("aria-pressed",String(I===l))}),Ve(),A.forEach(({dot:x},I)=>{x.classList.toggle("is-active",I===l),I===l?x.setAttribute("aria-current","true"):x.removeAttribute("aria-current")});let u=e[l]?.title;J.textContent=g?`${l+1} of ${g}${u?`: ${u}`:""}`:"No gallery items",l>=0&&s?.(l)}function $e(){if(le||!X)return;tt();let l=Math.abs(_-O)>.002;b.classList.toggle("is-moving",l||!!U);let u=[...Q];for(let x of Q)x.logical=x.index+Math.round((O-x.index)/g)*g;if(g>1){let x=ae+d,I=o==="infinite"&&X>660?X*.61:X/2,H=(I+ae/2+40)/x,q=(X-I+ae/2+40)/x;m?H=q=Le.reach:o==="showcase"&&(H=q=Math.min(4.1,(X/2+ae)/Ge()));let G=Math.ceil(O-H),ge=Math.floor(O+q);for(let[ue,he]of F)(ue<G||ue>ge||Q[he.index].logical===ue)&&(he.node.remove(),F.delete(ue));for(let ue=G;ue<=ge;ue++){let he=it(ue,g);if(Q[he].logical===ue)continue;let xe=F.get(ue);xe||(xe=j(he),xe.logical=ue,F.set(ue,xe),oe&&c&&xe.card.querySelectorAll("img").forEach(Ae=>c(Ae,{nativeCard:!!r}))),u.push(xe)}}u.forEach(x=>{let I=g===1?0:x.logical-O,H=Math.abs(I),q=x.logical===Math.round(O),G=X/2,ge=0,ue=0,he=1,xe=1,Ae=!0,Ue=0,Re=0;if(o==="infinite")G=(X>660?X*.61:X/2)+I*(ae+d),xe=1-Math.min(1,H)*.68,Ae=G+ae/2>-40&&G-ae/2<X+40;else if(o==="timed")G+=I*(ae+d),he=1-Math.min(H,1)*.035,Ae=G+ae/2>-40&&G-ae/2<X+40;else if(o==="showcase")G+=I*Ge(),ge+=Math.min(H,4)*(10+k*9),he=Math.max(.48,1-H*(.09+k*.035)),ue=I*(4+k*7),Re=-I*(3+k*4),xe=Ne(1-H*.19,0,1),Ae=H<4.1,q&&!f&&(Ue=Oe,Re+=He,ue+=Ne(_-O,-1,1)*-3);else{let Je=I*Le.step;G+=Le.radius*Math.sin(Je),ge=Le.radius*(1-Math.cos(Je)),ue=Je*180/Math.PI,Ae=H<=Le.reach,xe=o==="arc-tabs"?1-Math.min(H,1)*.16:1}x.card.style.transform=`translate3d(${G}px,${ge}px,0) translateX(-50%) rotate(${ue}deg) rotateX(${Ue}deg) rotateY(${Re}deg) scale(${he})`,x.card.style.zIndex=String(1e3-Math.round(H*100)),x.card.style.opacity=String(xe),x.card.style.visibility=Ae?"visible":"hidden",x.card.style.pointerEvents=Ae&&xe>.08?"auto":"none",x.active!==q&&(x.active=q,x.card.classList.toggle("is-active",q)),x.card.tabIndex=q?0:-1,x.card.setAttribute("aria-hidden",String(!q)),r?.syncFocus(x.card)}),A.forEach(({fill:x},I)=>{x.style.transform=`scaleX(${I===pe?Ne(se/h,0,1):0})`})}function L(){let l=X;X=S.clientWidth;let u=M?1:o==="timed"?.86:o==="infinite"&&X>660?.48:.76,x=Math.max(80,Math.min(y,X*u));if(x!==ae&&(ae=x,T.style.setProperty("--gc-carousel-slot-width",`${ae}px`)),w){let I=T.offsetHeight;if(X!==l||I!==Se){Se=I,m&&(Le=Za(o,X,ae,Se,k,d));let H=Le??Qa(ae,Se,k);g>1&&(S.style.setProperty("--gc-sweep-above",Math.ceil(H.above)+"px"),S.style.setProperty("--gc-sweep-below",Math.ceil(H.below)+"px"))}}Te=S.clientHeight,je=m?Le.radius*Le.step:o==="showcase"?ae*.54:ae+d,$e()}function N(){!le&&!de&&(de=requestAnimationFrame(ne))}function ne(l){if(de=0,le)return;let u=te?Ne(l-te,0,64):0;te=l,U||(f?O=_:O+=(_-O)*(1-Math.exp(-u/85)),Math.abs(_-O)<5e-4&&(O=_));let x=Math.abs(_-O)<.002&&!U;B&&!qe()&&x&&(se+=u,se>=h&&(se=0,_=Math.round(O)+1)),$e(),Math.abs(_-O)>5e-4||B&&!qe()?N():te=0}function re(l){le||g<2||(_=Ye(it(Math.round(at(l,0)),g)),se=0,f&&(O=_),$e(),N())}function ye(l){g<2||(_=Math.round(_)+l,se=0,f&&(O=_),$e(),N())}function Me(l){B=!!l&&!f&&g>1,D.dataset.paused=String(!B),D.setAttribute("aria-label",B?"Pause slideshow":"Play slideshow"),D.setAttribute("aria-pressed",String(B)),J.setAttribute("aria-live",B?"off":"polite"),b.classList.toggle("is-playing",B),te=0,N()}function ie(l){Be=!!l,te=0,N()}z($,"click",()=>ye(-1)),z(R,"click",()=>ye(1)),z(D,"click",()=>Me(!B)),z(S,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),S.focus({preventScroll:!0}),ye(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),S.focus({preventScroll:!0}),re(l.key==="Home"?0:g-1))}),z(S,"pointerdown",l=>{g<2||l.button!==0||!l.isPrimary||(U={id:l.pointerId,x:l.clientX,y:l.clientY,start:O,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},_=O,se=0)}),z(S,"pointermove",l=>{let u=S.getBoundingClientRect(),x=u.width/Math.max(1,S.clientWidth)||1,I=(l.clientX-u.left)/x,H=(l.clientY-u.top)/x;if(K.style.left=`${I}px`,K.style.top=`${H}px`,l.pointerType==="mouse"&&S.classList.add("has-pointer"),!U){o==="showcase"&&!f&&(He=Ne((I-X/2)/ae,-1,1)*4,Oe=Ne((H-Te/2)/Te,-.5,.5)*-5,$e());return}if(l.pointerId!==U.id)return;let q=l.clientX-U.x,G=l.clientY-U.y;if(!U.axis&&Math.hypot(q,G)>6&&(U.axis=Math.abs(q)>Math.abs(G)?"horizontal":"vertical",U.axis==="horizontal"&&(S.setPointerCapture(l.pointerId),S.classList.add("is-dragging"))),U.axis!=="horizontal")return;l.preventDefault(),U.moved=!0;let ge=performance.now(),ue=Math.max(8,ge-U.lastTime),he=-(l.clientX-U.lastX)/x/je/ue;U.velocity=U.velocity*.45+he*.55,U.lastX=l.clientX,U.lastTime=ge,O=U.start-q/x/je,_=O,$e()},{passive:!1});function ve(l){if(!U||l.pointerId!==U.id)return;let u=U;if(U=null,S.hasPointerCapture(l.pointerId)&&S.releasePointerCapture(l.pointerId),S.classList.remove("is-dragging"),u.moved){Fe=performance.now()+400;let x=performance.now()-u.lastTime,I=f||l.type==="pointercancel"||x>120?0:Ne(u.velocity*210,-4,4);_=Math.round(O+I)}else _=Math.round(O);f&&(O=_),N()}z(S,"pointerup",ve),z(S,"pointercancel",ve),z(window,"pointerup",ve),z(S,"lostpointercapture",l=>{U?.id===l.pointerId&&ve(l)}),z(S,"dragstart",l=>l.preventDefault()),z(S,"click",l=>{if(performance.now()<Fe){l.preventDefault(),l.stopImmediatePropagation();return}let u=l.target.closest(".gc-carousel-card");!u||!S.contains(u)||u.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),re(Number(u.dataset.gcItemIndex)))},!0),z(S,"pointerleave",()=>{S.classList.remove("has-pointer"),He=Oe=0,U||$e()}),z(b,"pointerenter",l=>{l.pointerType==="mouse"&&(be=!0)}),z(b,"pointerleave",()=>{be=!1,te=0,N()}),z(b,"focusin",()=>{we=!0}),z(b,"focusout",()=>{queueMicrotask(()=>{le||(we=b.contains(document.activeElement),te=0,N())})}),z(document,"visibilitychange",()=>{te=0,N()});let Ce;typeof ResizeObserver<"u"?(Ce=new ResizeObserver(l=>{l.some(({target:u})=>u===S||u===T)&&L(),C&&l.some(({target:u})=>u!==S&&u!==T)&&Ve()}),Ce.observe(S),w&&Ce.observe(T),C&&(Ce.observe(E),v.forEach(l=>Ce.observe(l,{box:"border-box"})))):z(window,"resize",()=>{L(),Ve()});let me;return typeof IntersectionObserver<"u"&&(me=new IntersectionObserver(l=>{Pe=!l[0]?.isIntersecting,te=0,N()}),me.observe(b)),L(),oe=!0,Me(B),{goTo:re,setGeometry(l){p(l),Se=-1,L()},setPlaying:Me,setSuspended:ie,destroy(){le=!0,cancelAnimationFrame(de),Ce?.disconnect(),me?.disconnect(),W.forEach(l=>l()),b.remove()}}}var Ka,Ne,it,at,oi=Y(()=>{bt();Ka=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Ne=(t,e,i)=>Math.min(i,Math.max(e,t)),it=(t,e)=>(t%e+e)%e,at=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function ni(t){let{host:e,makeCard:i,nativeList:n}=t,a=Array.isArray(t.items)?t.items:[],s=t.options||{},r=["wall","ring","angled"].includes(s.preset)?s.preset:"wall",c=!!s.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=a.length,m=r==="ring"?16:r==="wall"?12:o,w=!c&&o>1&&o<12&&r!=="angled"?Math.ceil(m/o)*o:o,g=Array.from({length:o},(l,u)=>u),f=_e(Ke(s.depth,55),0,100),k=_e(Ke(s.cardWidth,280),80,900),d=_e(Ke(s.gap,24),0,160),y=Math.max(1,Ke(s.duration,5)),M=new AbortController,p=(l,u,x,I={})=>l.addEventListener(u,x,{...I,signal:M.signal}),h={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},b=`gc-spatial-help-${++er}`,W=["gc-spatial",`gc-${r}`,...c?["gc-spatial-reduced"]:[]];e.classList.add(...W);let z=new Map,v=(l,u)=>{z.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,u)};v("--gc-spatial-height",`${_e(Ke(s.stageHeight,620),300,1400)}px`),v("--gc-spatial-radius",`${_e(Ke(s.radius,18),0,100)}px`),v("--gc-spatial-fit",s.fit==="contain"?"contain":"cover"),v("--gc-spatial-card-width",`${k}px`),v("--gc-spatial-gap",`${d}px`);let A=n?.track??document.createElement("div");A.classList.add("gc-spatial-canvas"),n&&A.classList.add("gc-spatial-native-track"),A.setAttribute("role",n?"list":"group"),A.setAttribute("aria-label",h[r]),A.setAttribute("aria-describedby",b);let P=document.createElement("p");P.id=b,P.className="gc-spatial-sr",P.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let C=document.createElement("span");C.className="gc-spatial-sr",C.setAttribute("aria-live","polite"),C.setAttribute("aria-atomic","true"),e.append(P,A,C);let E=s.showTitles!==!1&&(r!=="ring"||c||o===1),S=Array.from({length:w},(l,u)=>{let x=u%o,I=a[x],H=i(I,x,{caption:E,description:!1,thumbnail:!0}),q=n?.slot(H)??document.createElement("div");return q.classList.add("gc-spatial-position"),H.classList.add("gc-spatial-card"),H.dataset.spatialIndex=String(u),H.dataset.spatialSourceIndex=String(x),H.tabIndex=u===0?0:-1,u>=o&&H.setAttribute("aria-hidden","true"),!H.getAttribute("aria-label")&&!H.textContent.trim()&&H.setAttribute("aria-label",`View item ${x+1}`),q.contains(H)||q.append(H),q.parentNode!==A&&A.append(q),{position:q,card:H,sourceIndex:x,x:0,y:0,flip:0,tilt:0,lift:0}}),T=document.createElement("div");T.className="gc-spatial-nav";let j=(l,u)=>{let x=document.createElement("button");return x.type="button",x.className="gc-spatial-control",x.setAttribute("aria-label",u),De(x,l)},Q=j("previous","Previous item"),F=j("next","Next item"),oe=document.createElement("span");oe.className="gc-spatial-count",oe.setAttribute("aria-hidden","true"),T.append(Q,oe,F);let ee=s.autoplay&&!c?j("playback","Pause gallery motion"):null;ee&&(ee.disabled=o<2,ee.dataset.paused=String(o<2),ee.disabled&&ee.setAttribute("aria-label","Play gallery motion"),T.append(ee)),e.append(T),Q.disabled=F.disabled=o<2;let ce,fe;if(r==="ring"&&o>1&&!c){ce=document.createElement("div"),ce.className="gc-ring-center",ce.setAttribute("aria-hidden","true"),s.showTitles!==!1&&(fe=document.createElement("span"),fe.className="gc-ring-label",ce.append(fe));let l=document.createElement("span");l.textContent="Drag to explore",ce.append(l),A.after(ce)}let Ie;o||(Ie=document.createElement(n?"li":"p"),Ie.className="gc-spatial-empty",Ie.textContent="No items available.",A.append(Ie));let $=!1,R=0,D=-1,V=1,J=1,K=1,le=1,O=1,_=1,pe=0,de=1,te=1,se=0,B=0,be=1,we=!!s.autoplay&&!c&&o>1,Pe=!1,Be=!1,U=!1,Fe=!0,X=null,Te=0,ae=0,Ge=0,Se=-1,Le=!1,je={x:-1e4,y:-1e4,inside:!1};function He(l=R){if(!fe)return;let u=typeof a[l]?.title=="string"?a[l].title.trim():"";fe.textContent===u&&fe.hidden===!u||(fe.textContent=u,fe.hidden=!u,Oe())}function Oe(){!ce||$||(ce.classList.remove("is-below"),ce.offsetHeight>pe&&ce.classList.add("is-below"))}function qe(l,u=!1,x=null){if(!o){oe.textContent="00 / 00";return}let I=rt(l,o),H=x!==null&&S[x]?.sourceIndex===I,q=H&&g[I]!==x;if(H){let G=S[g[I]].card;g[I]=x,q&&(S[x].card.removeAttribute("aria-hidden"),n?.syncFocus(S[x].card),document.activeElement===G&&(Le=!0,S[x].card.focus({preventScroll:!0}),Le=!1))}if(D===I&&!q){u&&(C.textContent=`Item ${I+1} of ${o}${a[I].title?`: ${a[I].title}`:""}`);return}R=I,He(),oe.textContent=`${String(R+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`,S.forEach(({card:G,sourceIndex:ge},ue)=>{let he=g[ge]===ue;G.tabIndex=he&&ge===R?0:-1,G.classList.toggle("is-selected",he&&ge===R),he?G.removeAttribute("aria-hidden"):G.setAttribute("aria-hidden","true"),n?.syncFocus(G)}),u&&(C.textContent=`Item ${R+1} of ${o}${a[R].title?`: ${a[R].title}`:""}`),D!==R&&(D=R,t.onChange?.(R))}function Ye(l){we=!!l&&!c&&o>1,ee&&(ee.dataset.paused=String(!we),ee.setAttribute("aria-label",we?"Pause gallery motion":"Play gallery motion")),ie()}function Ve(l){Pe=!!l,Pe||ie()}function tt(l,u,x){return u+Math.round((l-u)/x)*x}function $e(l){let u={index:g[l],target:l,distance:1/0};return S.forEach((x,I)=>{if(x.sourceIndex!==l)return;let H=I;if(r==="ring")H=tt(se,I,w);else if(r==="wall"){let G=Math.floor(I/de);H=te>2?tt(se,G,te):G}let q=Math.abs(H-se);q<u.distance&&(u={index:I,target:H,distance:q})}),u}function L(l){let u=l.getBoundingClientRect();return u.left+u.width/2}function N(){if(o<2)return;let l=L(S[0].position),u=L(S[1].position)-l;if(Math.abs(u)<1)return;let x=_e(Math.round((L(A)-l)/u),0,o-1);qe(x,!1,x)}function ne(l,u=!1){if(!o)return;let x=rt(Math.round(Ke(l,0)),o),I=c?{index:x,target:x}:$e(x);if(qe(x,!0,I.index),c){let H=S[x].position;A.scrollTo({left:A.scrollLeft+L(H)-L(A),behavior:"auto"})}else B=I.target;u&&S[I.index].card.focus({preventScroll:!0}),ie()}function re(){if(!$){if(V=Math.max(1,A.clientWidth),J=Math.max(1,A.clientHeight),r==="ring"){let l=Math.max(80,Math.min(V-32,J-42)),u=_e(Ke(s.ringDiameter,l),80,l);_=Math.max(0,u*.38);let x=Lt*_/Math.max(1,w),I=Math.min(u*.17,x*.8),H=1.15-_e(d,0,100)/160;if(K=o<=1?Math.min(k,V*.65,J*.58):Math.max(18,Math.min(Math.min(k*.22,I)*H,x*.94)),le=K*1.28,ce){let q=Math.max(0,_-Math.max(32,le)/2-10);pe=Math.floor(q*Math.SQRT2),ce.style.setProperty("--gc-ring-label-width",`${pe}px`),ce.style.setProperty("--gc-ring-label-y",`${A.offsetTop+J/2}px`),Oe()}O=Math.max(24,Lt*Math.max(1,_)/Math.max(1,w))}else r==="wall"?(de=w>=10?3:w>=4?2:1,te=Math.max(1,Math.ceil(w/de)),le=Math.min((J-56-(de-1)*d)/de,k*.62,230),K=Math.max(60,Math.min(le*1.5,k,V*.43)),le=K/1.5,O=K+Math.min(d,70)):(K=Math.min(k,V*.68,(J-70)*.76),le=K/.76,O=K*(.72+(100-f)*.001)+d);S.forEach(({position:l})=>{l.style.width=`${Math.max(24,K)}px`,l.style.height=`${Math.max(32,le)}px`}),c&&S.forEach(({position:l})=>{l.style.width=`${Math.min(k,V*.72)}px`,l.style.height=`${Math.min(J-40,k*1.15)}px`}),ie()}}function ye(l){if(c||!o||Pe)return!1;let u=we&&!Be&&!U&&!X&&Fe&&!document.hidden;if(u){let q=l/y;r==="angled"?(B+=q*be,B>=o-1&&(B=o-1,be=-1),B<=0&&(B=0,be=1)):B+=q}let x=X?.moved?1:1-Math.exp(-l*11);se+=(B-se)*x,Math.abs(B-se)<1e-4&&(se=B);let I=Math.abs(B-se)>1e-4||u;if(u||X?.moved){let q=X?.moved?se:B,G=r==="wall"?Math.round(q)*de+g[R]%de:Math.round(q),ge=r==="wall"?Math.min(rt(G,te*de),w-1):rt(G,w);qe(S[ge].sourceIndex,!1,ge)}let H=1-Math.exp(-l*13);return S.forEach((q,G)=>{let{position:ge,card:ue}=q;if(r==="ring"){let he=-Math.PI/2+(G-se)*Lt/w;q.x=o===1?0:Math.cos(he)*_,q.y=o===1?0:Math.sin(he)*_;let xe=Math.hypot(je.x-(V/2+q.x),je.y-(J/2+q.y)),Ae=Math.max(65,K*2.6),Ue=je.inside&&!X?.moved?Math.max(0,1-xe/Ae):0,Re=Ue*Ue*(50+f*1.3);q.flip+=(Re-q.flip)*H,Math.abs(q.flip-Re)>.05&&(I=!0);let Je=o===1?0:he*180/Math.PI+90;ge.style.transform=`translate3d(${q.x}px,${q.y}px,0) rotate(${Je}deg)`,ue.style.transform=`perspective(700px) rotateY(${q.flip}deg) translateZ(${Ue*12}px)`,ge.style.zIndex=String(G===Se?w+2:1)}else if(r==="wall"){let he=G%de,Ae=Math.floor(G/de)-se;if(te>2){let _a=te%2===0?.5:0;Ae=rt(Ae-_a+te/2,te)-te/2}let Ue=Math.min(.68,2.6/Math.max(3,te)),Re=Ae*Ue,Je=Math.max(O/Ue,V*.4),Jt=f/100,Ga=Math.sin(Re)*Je,Kt=(1-Math.cos(Re))*Je*Jt*.65,Ua=(he-(de-1)/2)*(le+Math.min(d,50)),Et=G===Se||U&&G===g[R]?1:0;q.lift+=(Et-q.lift)*H,Math.abs(Et-q.lift)>.002&&(I=!0),ge.style.transform=`translate3d(${Ga}px,${Ua}px,${Kt+q.lift*20}px) rotateY(${-Re*180/Math.PI*Jt}deg)`,ge.style.zIndex=String(Math.round(Kt)+(Et?1e3:1)),ue.style.transform=`scale(${1+q.lift*.035})`,ge.style.opacity=Math.abs(Re)>1.6?"0":"1",ge.style.visibility=Math.abs(Re)>1.6?"hidden":"visible"}else{let he=G-se,xe=G===Se||U&&G===g[R]?1:0;q.lift+=(xe-q.lift)*H,Math.abs(xe-q.lift)>.002&&(I=!0);let Ae=-(25+f*.28)*(1-q.lift);ge.style.transform=`translate3d(${he*O}px,${-q.lift*14}px,${q.lift*110}px) rotateY(${Ae}deg)`,ge.style.zIndex=String(xe?o+2:o-G),ue.style.transform="none"}}),I}function Me(l){if(ae=0,$)return;let u=Math.min(.05,Math.max(.001,(l-(Ge||l-16.7))/1e3));Ge=l,ye(u)&&Fe&&!document.hidden?ae=requestAnimationFrame(Me):Ge=0}function ie(){!$&&!ae&&!c&&(ae=requestAnimationFrame(Me))}c&&p(A,"scroll",N,{passive:!0}),p(Q,"click",()=>ne(R-1)),p(F,"click",()=>ne(R+1)),ee&&p(ee,"click",()=>Ye(!we)),p(A,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let u=l.key==="Home"?0:l.key==="End"?o-1:R+(l.key==="ArrowRight"?1:-1);ne(u,!0)}),p(A,"focusin",l=>{U=!0;let u=l.target.closest?.("[data-spatial-index]");u&&!Le&&qe(Number(u.dataset.spatialSourceIndex),!1,Number(u.dataset.spatialIndex)),ie()}),p(A,"focusout",()=>{queueMicrotask(()=>{$||(U=A.contains(document.activeElement),ie())})}),p(A,"pointerenter",l=>{l.pointerType!=="touch"&&(Be=!0,je.inside=!0,ie())}),p(A,"pointerleave",()=>{Be=!1,je.inside=!1,Se=-1,He(),ie()}),p(A,"pointermove",l=>{if(l.pointerType==="touch")return;let u=A.getBoundingClientRect();je.x=l.clientX-u.left,je.y=l.clientY-u.top,je.inside=!0;let x=l.target.closest?.("[data-spatial-index]");Se=x?Number(x.dataset.spatialIndex):-1,He(Se>=0?S[Se].sourceIndex:R),ie()}),p(A,"pointerdown",l=>{let u=l.target.closest?.("[data-spatial-index]");u&&qe(Number(u.dataset.spatialSourceIndex),!1,Number(u.dataset.spatialIndex)),!(c||o<2||l.pointerType==="mouse"&&l.button!==0)&&(X={id:l.pointerId,x:l.clientX,y:l.clientY,start:B,moved:!1})}),p(window,"pointermove",l=>{if(!X||l.pointerId!==X.id)return;let u=l.clientX-X.x,x=l.clientY-X.y;if(!X.moved){if(Math.abs(x)>12&&Math.abs(x)>Math.abs(u)*1.2){X=null;return}if(Math.abs(u)<7)return;X.moved=!0,A.classList.add("is-dragging"),A.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),B=X.start-u/O,(r==="angled"||r==="wall"&&te<=2)&&(B=_e(B,0,r==="wall"?te-1:o-1)),ie()},{passive:!1});let ve=l=>{if(!X||l.pointerId!==X.id)return;let u=X.moved;if(X=null,A.classList.remove("is-dragging"),A.hasPointerCapture?.(l.pointerId)&&A.releasePointerCapture(l.pointerId),u){Te=performance.now()+350,B=Math.round(B);let x=r==="wall"?Math.round(B)*de+g[R]%de:Math.round(B),I=r==="wall"?Math.min(rt(x,te*de),w-1):rt(x,w);qe(S[I].sourceIndex,!0,I)}ie()};p(window,"pointerup",ve),p(window,"pointercancel",ve),p(A,"click",l=>{performance.now()<Te&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),p(A,"dragstart",l=>l.preventDefault()),p(document,"visibilitychange",ie);let Ce=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(u=>u.target===A)?re():Oe()}):null;Ce?.observe(A),ce&&Ce?.observe(ce),Ce||p(window,"resize",re);let me=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{Fe=l[0]?.isIntersecting??!0,Fe&&ie()},{rootMargin:"100px"}):null;return me?.observe(e),re(),qe(0),{goTo:ne,setPlaying:Ye,setSuspended:Ve,destroy(){$||($=!0,cancelAnimationFrame(ae),Ce?.disconnect(),me?.disconnect(),M.abort(),P.remove(),C.remove(),T.remove(),ce?.remove(),n?Ie?.remove():A.remove(),e.classList.remove(...W),z.forEach((l,u)=>l?e.style.setProperty(u,l):e.style.removeProperty(u)))}}}var er,_e,rt,Ke,Lt,si=Y(()=>{bt();er=0,_e=(t,e,i)=>Math.max(e,Math.min(i,t)),rt=(t,e)=>(t%e+e)%e,Ke=(t,e)=>Number.isFinite(Number(t))?Number(t):e,Lt=Math.PI*2});function ci({host:t,items:e,options:i,makeCard:n,onChange:a,nativeList:s}){let r=Number(i.stageHeight)||680,c=Math.max(300,r-120),o=Math.max(0,Number(i.gap)||0),m=Number.isFinite(Number(i.depth))?Number(i.depth):45,w=i.previewScroll===!1,g=w?window:t;t.classList.add("gc-stack"),t.style.height=w?"auto":r+"px",t.style.overflowY=w?"visible":"auto",t.style.overscrollBehavior=w?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let f=s?.track??document.createElement("div");f.classList.add("gc-stack-track"),t.append(f);let k=e.map((W,z)=>{let v=n(W,z,{caption:i.showTitles,description:!0}),A=s?.slot(v)??document.createElement("div");A.classList.add("gc-stack-slot"),v.parentElement!==A&&A.append(v),f.append(A),A.style.zIndex=z+1,v.style.width=`min(${i.stackCardWidth}px,calc(100% - 48px))`,v.style.minHeight=c+"px";let P=v.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),C=!Array.from(P).some(E=>!E.closest("[hidden]")&&E.textContent.trim());return v.classList.toggle("gc-stack-image-only",C),{card:v,wrap:A,imageOnly:C,start:0,duration:1/0}}),d=0;function y(){return w?-f.getBoundingClientRect().top:t.scrollTop}function M(){d=0;let W=y(),z=0;k.forEach(({card:v,start:A,duration:P},C)=>{let E=Math.max(0,Math.min(1,(W-A)/P));v.style.transform=i.reducedMotion?"none":`perspective(1300px) translateY(${E*-32}px) scale(${1-E*.14}) rotateX(${E*m*.25}deg)`,v.style.filter=`brightness(${1-E*.23})`,E>=.5&&(z=Math.min(C+1,k.length-1))}),k.length&&a?.(z)}function p(){d||(d=requestAnimationFrame(M))}function h(){let W=k.map(({card:A,wrap:P})=>({height:A.offsetHeight,rowHeight:P.offsetHeight})),z=w?window.innerHeight:t.clientHeight,v=f.clientTop+(parseFloat(getComputedStyle(f).paddingTop)||0);k.forEach((A,P)=>{let{height:C,rowHeight:E}=W[P],S=Math.min(40,z-24-C);A.wrap.style.top=S+"px",A.start=v-S,P&&(k[P-1].duration=Math.max(1,A.start-k[P-1].start));let T=A.imageOnly&&C<=z-64?C*.24:0,j=P<k.length-1?o-T:0;A.wrap.style.marginBottom=j+"px",v+=E+j,P===k.length-1&&(A.duration=1/0,f.style.paddingBottom=Math.max(40,z-S-E)+"px")}),p()}let b;return h(),typeof ResizeObserver<"u"&&(b=new ResizeObserver(h),b.observe(f,{box:"border-box"}),k.forEach(({card:W})=>b.observe(W,{box:"border-box"}))),window.addEventListener("resize",h),g.addEventListener("scroll",p,{passive:!0}),{goTo(W){let z=k[Math.max(0,Math.min(k.length-1,Math.round(W)))];if(!z)return;let v=w?window.scrollY+z.start-y():z.start;g.scrollTo({top:v,behavior:i.reducedMotion?"instant":"smooth"})},destroy(){b?.disconnect(),window.removeEventListener("resize",h),cancelAnimationFrame(d),g.removeEventListener("scroll",p),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",f.remove()}}}var li=Y(()=>{});var di,yt,pi=Y(()=>{di='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',yt=class{constructor(e,i,n){this.root=e,this.cards=i,this.projects=n,this.assetDirectory=new URL(".",i[0].querySelector("img").src),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${di}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${di}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",r=>{if(r.target!==this.dialog)return;let c=this.dialog.getBoundingClientRect();(r.clientX<c.left||r.clientX>c.right||r.clientY<c.top||r.clientY>c.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",r=>{(r.key==="ArrowLeft"||r.key==="ArrowRight")&&(r.preventDefault(),this.showFrame(this.frame+(r.key==="ArrowRight"?1:-1)))});let s=this.dialog.querySelector(".project-image-stage");s.addEventListener("pointerdown",r=>{!r.isPrimary||r.target.closest("button")||(this.galleryPointer={id:r.pointerId,x:r.clientX,y:r.clientY},s.setPointerCapture(r.pointerId))}),s.addEventListener("pointerup",r=>{let c=this.galleryPointer;if(this.galleryPointer=null,!c||c.id!==r.pointerId)return;s.hasPointerCapture(r.pointerId)&&s.releasePointerCapture(r.pointerId);let o=r.clientX-c.x,m=r.clientY-c.y;Math.abs(o)>35&&Math.abs(o)>Math.abs(m)*1.2&&this.showFrame(this.frame+(o<0?1:-1))}),s.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let i=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!i,this.dialog.querySelector("[data-gallery-next]").hidden=!i,this.thumbnails.hidden=!i,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(a=>{let s=document.createElement("li");return s.textContent=a,s})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((a,s)=>{let r=document.createElement("button");r.type="button",r.className="project-thumbnail",r.setAttribute("aria-label",`Show ${a.label.toLowerCase()}`);let c=document.createElement("img");return c.src=new URL(a.file,this.assetDirectory).href,c.alt="",c.width=1600,c.height=900,r.append(c),r.addEventListener("click",()=>this.showFrame(s)),r})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let i=this.project.gallery[this.frame];this.image.src=new URL(i.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${i.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${i.label}`,[...this.thumbnails.children].forEach((n,a)=>n.setAttribute("aria-current",String(a===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Xe,dt,xt=Y(()=>{Xe=Object.freeze({containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),dt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function gi(t,e,{pauseOnHover:i=!0,interactionRestMs:n=6e3}={}){let a=t.querySelector("[data-orbit-toggle]"),s=new AbortController,r=(p,h,b)=>p.addEventListener(h,b,{signal:s.signal}),c={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let o=0,m=!1,w=p=>!!p&&t.contains(p)&&(p.matches(":focus-visible")||!!p.closest(".orbit-card")),g=()=>!m&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,f=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(o),e.autoFrame=0,o=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},k=p=>{if(e.autoFrame=0,!g()){f();return}let h=Math.min(.05,Math.max(0,(p-e.autoTime)/1e3));e.autoTime=p,e.position=(e.position+h/8)%e.count,e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(k)},d=()=>{if(!g()){f();return}let p=e.resumeAt-performance.now();if(p>0){f(),o=setTimeout(d,p);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(k))},y=(p=6e3)=>{f(),e.resumeAt=performance.now()+p};e.animateTo=function(...p){y(n),c.animateTo.apply(this,p),d()},e.settleImmediately=function(...p){c.settleImmediately.apply(this,p),d()},e.openProject=function(...p){y(),c.openProject.apply(this,p),d()},i&&(r(t,"pointerenter",p=>{p.pointerType!=="touch"&&(e.hovered=!0,d())}),r(t,"pointerleave",p=>{p.pointerType!=="touch"&&(e.hovered=!1,d())})),r(t,"focusin",p=>{e.keyboardFocused=w(p.target),d()}),r(t,"focusout",p=>{e.keyboardFocused=w(p.relatedTarget),d()}),r(t,"pointerup",()=>{y(n),d()}),r(t,"pointercancel",()=>{y(n),d()}),r(e.viewer.dialog,"close",()=>{y(),d()}),r(document,"visibilitychange",d),r(e.reducedMotion,"change",d),r(a,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,a.dataset.paused=String(e.manuallyPaused),a.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),d()});let M=new IntersectionObserver(p=>{e.inView=p.some(h=>h.isIntersecting&&h.intersectionRatio>=.15),d()},{threshold:.15});return M.observe(e.stage),e.stopAutoplay=f,e.syncAutoplay=d,()=>{m=!0,f(),s.abort(),M.disconnect(),Object.assign(e,c)}}var ui=Y(()=>{});var Ee,jt,hi,fi,mi,bi,yi,xi,vi,wi,ki,Si,Mi,zt,Ci,pt,Ai,It=Y(async()=>{Ee=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),jt=Ee.BufferGeometry,hi=Ee.Float32BufferAttribute,fi=Ee.LineBasicMaterial,mi=Ee.LineLoop,bi=Ee.DoubleSide,yi=Ee.Mesh,xi=Ee.NoToneMapping,vi=Ee.PerspectiveCamera,wi=Ee.PlaneGeometry,ki=Ee.Raycaster,Si=Ee.Scene,Mi=Ee.ShaderMaterial,zt=Ee.SRGBColorSpace,Ci=Ee.TextureLoader,pt=Ee.Vector2,Ai=Ee.WebGLRenderer});var tr,vt,Ei=Y(async()=>{tr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),vt=tr.default});var ir,Tt,Pi=Y(async()=>{ir=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),Tt=ir.CustomEase});function Li(t,e,i=64){let n=t/e,a=new wi(t,t*9/16,i,1),s=a.attributes.position,r=a.attributes.uv;for(let c=0;c<s.count;c++){let o=(r.getX(c)-.5)*e;s.setX(c,n*Math.sin(o)),s.setZ(c,n*(Math.cos(o)-1))}return a.computeVertexNormals(),a.computeBoundingSphere(),a}function ji(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var qt=Y(async()=>{await It()});function gt(t,e){let i=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*i,panelArc:t.radiansPerSlide*i,height:t.slotHeight*i}}function wt(t,{radius:e,pitch:i,radiansPerSlide:n}){let a=t*n;return{x:Math.sin(a)*e,y:-t*i,z:(Math.cos(a)-1)*e,angle:a,taper:1,shade:(1-Math.cos(a))/2*.58}}function zi(t,e){let i=gt(t,e);return Li(i.cardWidth,i.panelArc)}function Nt(t,e=64){let i=[];for(let n=0;n<=e;n++){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),t.slotHeight/2,t.radius*(Math.cos(a)-1))}for(let n=e;n>=0;n--){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),-t.slotHeight/2,t.radius*(Math.cos(a)-1))}return i}var kt=Y(async()=>{await qt()});function Ft(t,e){let i=zi(t,e);return i.scale(1,1/t.aspect/(9/16),1),i.computeVertexNormals(),i.computeBoundingSphere(),i}function Ii(t,e,i,n,a){let s=Math.min(t,e)*Math.min(40,Math.max(0,a))/100,r=t-2*s,c=e-2*s,o=r/c,m=n==="fit"?Math.max:Math.min,w=m(1,o/i),g=m(1,i/o);return{contentWidth:r,contentHeight:c,uvScaleX:w,uvScaleY:g,imageWidth:r/w,imageHeight:c/g,padding:s}}var Ti=Y(async()=>{await kt();await kt()});function $t({stageWidth:t,stageHeight:e,spiralWidthPercent:i,cardWidth:n,aspect:a,rise:s,riseUnit:r}){let c=Math.max(1,t*i/200),o=Math.max(1,Math.min(n,c*Math.PI/3,e*.4*a)),m=Math.PI*2*c/o,w=r==="percent"?e*s/100:s*Math.min(1,t/640);return{radius:c,slotWidth:o,slotHeight:o/a,aspect:a,pitch:Math.max(o/a*1.25/m,w),radiansPerSlide:o/c,cardsPerTurn:Math.PI*2*c/o}}var qi=Y(()=>{});function Fi(t,e,i){let n=e.radius*2.4,a=n/(n+2*e.radius),s=Math.ceil((i/(2*a)+e.slotHeight/2)/e.pitch)+2,r=Math.floor(t);return{first:r-s,last:r+s,count:s*2+1}}function $i(t,e,i){let n=t*e.radiansPerSlide,a=n-i.panelArc/2,s=n+i.panelArc/2,r=Math.PI*2,c=M=>Math.ceil((a-M)/r)<=Math.floor((s-M)/r),o=c(0)?1:Math.max(Math.cos(a),Math.cos(s)),m=c(Math.PI)?-1:Math.min(Math.cos(a),Math.cos(s)),w=e.radius*2.4,g=w/(w+e.radius*(1-o)),f=w/(w+e.radius*(1-m)),k=-t*e.pitch,d=k+i.height/2,y=k-i.height/2;return{minY:Math.min(y*g,y*f),maxY:Math.max(d*g,d*f)}}function Ri(t,e){let i=Math.min(80,e*.08),n=s=>Math.max(0,Math.min(1,s)),a=Math.min(n((e/2-t.minY)/i),n((t.maxY+e/2)/i));return a*a*(3-2*a)}function Wi(t,e,i,n){let a=i-e;return Math.abs(a)>n/2&&(a-=Math.round(a/n)*n),t+a}var Ni,Hi=Y(async()=>{await kt();qi();Ni=(t,e)=>(t%e+e)%e});var Di,Oi=Y(()=>{Di=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pan-y pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function Bi(t,{textureSource:e=i=>i.querySelector("img").src}={}){let{root:i,stage:n}=t,a;try{a=new Ai({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return i.dataset.renderer="css-fallback",()=>{delete i.dataset.renderer}}a.outputColorSpace=zt,a.toneMapping=xi,a.setClearColor(0,0);let s=a.domElement;s.style.removeProperty("display"),s.className="orbit-webgl",s.setAttribute("aria-hidden","true"),n.append(s);let r=new Si,c=new vi,o=new ki,m=new pt,w=new AbortController,g=($,R,D)=>$.addEventListener(R,D,{signal:w.signal}),f=t.render,k=t.pointerDown,d=new Map,y=[],M,p,h=t.position,b=t.position,W="",z=!1,v=!1,A=null,P=null,C=!1,E=!1;i.dataset.renderer="loading-webgl";let S=()=>$t({stageWidth:n.clientWidth,stageHeight:n.clientHeight,spiralWidthPercent:Number(i.dataset.spiralWidth),cardWidth:Number(i.dataset.cardWidth),aspect:Number(i.dataset.cardAspect),rise:Number(i.dataset.rise),riseUnit:i.dataset.riseUnit}),T=()=>{let $=t.cards[0],R=new Mi({uniforms:{screenshot:{value:d.get(e($))},dimensions:{value:new pt},contentDimensions:{value:new pt(1,1)},imageScale:{value:new pt(1,1)},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:rr,fragmentShader:or,transparent:!0,side:bi,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),D=new yi(M,R),V=new mi(p,new fi({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),J={card:$,mesh:D,guide:V,material:R,surface:{scale:1,target:1}};D.userData.panel=J,y.push(J),r.add(D,V)},j=$=>{let R=Fi(h,$,n.clientHeight);for(;y.length<R.count;)T();for(;y.length>R.count;){let D=y.pop();r.remove(D.mesh,D.guide),D.material.dispose(),D.guide.material.dispose()}y.forEach((D,V)=>{D.offset=R.first+V-h,D.card=t.cards[Ni(R.first+V,t.count)],D.material.uniforms.screenshot.value=d.get(e(D.card))})},Q=()=>{let $=n.clientWidth,R=n.clientHeight,D=S(),V=Number(i.dataset.slotGap||3);j(D);let J=gt(D,V),{cardWidth:K,panelArc:le}=J,{radius:O}=D;i.dataset.slotMetrics=JSON.stringify({...D,cardArc:le,cardWidth:K,cardHeight:J.height,gap:V,imageFit:i.dataset.imageFit,imagePadding:Number(i.dataset.imagePadding||0)}),y.forEach(B=>{B.material.uniforms.dimensions.value.set(K,J.height);let be=B.material.uniforms.screenshot.value.image;if(!be)return;let we=Ii(K,J.height,(be.naturalWidth||be.width)/(be.naturalHeight||be.height),i.dataset.imageFit,Number(i.dataset.imagePadding||0));B.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),B.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let _=Math.min(window.devicePixelRatio||1,2),pe=`${$}:${R}:${K}:${le}:${J.height}:${O}:${_}`;if(pe===W||!$||!R)return;W=pe,a.setPixelRatio(_),a.setSize($,R,!1),c.position.set(0,0,O*2.4),c.fov=ji(R,c.position.z),c.aspect=$/R,c.near=.1,c.far=O*12,c.updateProjectionMatrix(),c.updateMatrixWorld();let de=M;M=Ft(D,V);let te=p;p=new jt,p.setAttribute("position",new hi(Nt(D),3));let se=0;y.forEach(B=>{B.mesh.geometry=M,B.guide.geometry=p,B.material.uniforms.dimensions.value.set(K,J.height),B.material.uniforms.cornerRadius.value=se}),de?.dispose(),te?.dispose()},F=()=>{if(!z||v||C||E||!t.geometry)return;E=!0,h=Wi(h,b,t.position,t.count),b=t.position,Q();let $=S(),R=gt($,Number(i.dataset.slotGap||3)),D=i.dataset.focusMode==="keyboard"&&i.contains(document.activeElement),V=0;y.forEach(K=>{let{card:le,mesh:O,material:_}=K,pe=wt(K.offset,$),de=$i(K.offset,$,R),te=Ri(de,n.clientHeight),se=D&&le===t.cards[t.active]&&Math.abs(K.offset)<.5;_.polygonOffsetUnits=Math.abs(K.offset)*8,O.position.set(pe.x,pe.y,pe.z),O.rotation.y=pe.angle,O.visible=te>.001&&!!_.uniforms.screenshot.value.image,O.visible&&V++,K.guide.position.copy(O.position),K.guide.rotation.copy(O.rotation),K.guide.visible=i.dataset.showSlots==="true"&&O.visible,K.guide.material.opacity=te*.42,_.uniforms.fade.value=te,_.uniforms.shade.value=pe.shade,_.uniforms.focused.value=se?1:0});let J=JSON.stringify({cardsPerTurn:$.cardsPerTurn,visibleCount:V,poolCount:y.length,stageWidth:n.clientWidth,stageHeight:n.clientHeight,cardWidth:R.cardWidth,cardHeight:R.height,pitch:$.pitch,radius:$.radius,uniqueCount:t.count});i.dataset.responsiveMetrics!==J&&(i.dataset.responsiveMetrics=J),P&&!t.pointer&&(A=oe(P)),r.updateMatrixWorld(!0),a.render(r,c),E=!1},oe=$=>{if(!z||C)return null;let R=s.getBoundingClientRect();m.set(($.clientX-R.left)/R.width*2-1,-($.clientY-R.top)/R.height*2+1),o.setFromCamera(m,c);for(let D of o.intersectObjects(y.map(V=>V.mesh))){let V=D.object.userData.panel;if(!D.object.visible||V.material.uniforms.fade.value<=.25)continue;let{x:J,y:K}=V.material.uniforms.dimensions.value,le=V.material.uniforms.cornerRadius.value,O=Math.abs((D.uv.x-.5)*J)-J/2+le,_=Math.abs((D.uv.y-.5)*K)-K/2+le;if(!(Math.hypot(Math.max(O,0),Math.max(_,0))+Math.min(Math.max(O,_),0)>le))return V}return null};t.render=function(){f.call(this),F()},t.pointerDown=function($){k.call(this,$),z&&!C&&this.pointer?.id===$.pointerId&&(this.pointer.card=oe($)?.card||null),P=null,A=null},g(n,"pointermove",$=>{P=$.pointerType==="mouse"?{clientX:$.clientX,clientY:$.clientY}:null,A=$.pointerType==="mouse"&&!t.pointer?oe($):null,s.style.cursor=t.pointer?.dragging?"grabbing":A?"pointer":"grab",F()}),g(n,"pointerleave",()=>{P=null,A=null,F()}),g(n,"pointerup",()=>{A=null,F()}),g(i,"focusin",F),g(i,"focusout",()=>queueMicrotask(F)),g(document,"keydown",()=>queueMicrotask(F)),g(document,"pointerdown",()=>queueMicrotask(F)),g(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&y.forEach(({surface:$})=>{vt.killTweensOf($),$.scale=$.target}),F()}),g(i,"playground-change",F),g(i,"slot-guides-change",F),g(s,"webglcontextlost",$=>{$.preventDefault(),C=!0,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback"}),g(s,"webglcontextrestored",()=>{C=!1,z&&(i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",F())});let ee=new ResizeObserver(()=>F());ee.observe(n);let ce=new Ci,fe=!1,Ie=()=>{v||(fe=!0,z=!1,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback")};for(let $ of t.cards){let R=e($);if(d.has(R))continue;let D=ce.load(R,F,void 0,Ie);D.colorSpace=zt,D.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),d.set(R,D)}return fe||(M=Ft(S(),Number(i.dataset.slotGap||3)),p=new jt,z=!0,i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",F()),()=>{v=!0,w.abort(),ee.disconnect(),t.render=f,t.pointerDown=k,i.classList.remove("has-webgl-carousel"),delete i.dataset.renderer,y.forEach(({material:$,surface:R,guide:D})=>{vt.killTweensOf(R),$.dispose(),D.material.dispose()}),M?.dispose(),p?.dispose(),d.forEach($=>$.dispose()),a.dispose(),a.forceContextLoss(),s.remove()}}var uo,rr,or,Gi=Y(async()=>{await It();await Ei();await Pi();await qt();await Ti();await Hi();vt.registerPlugin(Tt);uo=Tt.create("portfolio-surface",".2,.75,.25,1"),rr=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,or=`
  uniform sampler2D screenshot;
  uniform vec2 dimensions;
  uniform float cornerRadius;
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
    if (gl_FragColor.a < .001) discard;
    // Match the old sRGB darkening, without a second coplanar overlay.
    gl_FragColor.rgb *= 1.0 - shade;
    float topBottom = smoothstep(dimensions.y * .5 - 1.0, dimensions.y * .5, abs(p.y));
    float focusBorder = smoothstep(-2.0 - aa, -2.0 + aa, edge) * focused;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), max(topBottom * .086, focusBorder));
    gl_FragColor.a *= coverage * fade;
  }
`});var Ui=Y(()=>{(()=>{"use strict";let t=Math.PI*2,e=(s,r)=>(s%r+r)%r,i=(s,r,c)=>Math.min(c,Math.max(r,s));class n{constructor(r){this.root=r,this.stage=r.querySelector(".orbit-stage"),this.cards=[...r.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((c,o)=>{c.dataset.slideIndex=o;let m=c.cloneNode(!0);m.dataset.repeat="true",m.tabIndex=-1,m.setAttribute("aria-hidden","true"),m.removeAttribute("aria-pressed"),c.parentElement.append(m),this.visualCards.push(m)}),!(!this.count||!this.stage)&&(this.title=r.querySelector(".orbit-title"),this.description=r.querySelector(".orbit-description"),this.status=r.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(r,this.cards),this.pagination=r.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((r,c)=>{let o=document.createElement("button");return o.type="button",o.className="orbit-dot",o.setAttribute("aria-label",`Show ${r.dataset.title||`screenshot ${c+1}`}`),o.addEventListener("click",()=>this.goTo(c),this.options),this.pagination?.append(o),o}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(r=>{r.disabled=!0})}bindEvents(){let r=(c,o,m,w={})=>c.addEventListener(o,m,{...this.options,...w});r(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),r(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),r(this.stage,"keydown",c=>{let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};c.key in o?(c.preventDefault(),this.step(o[c.key])):(c.key==="Home"||c.key==="End")&&(c.preventDefault(),this.goTo(c.key==="Home"?0:this.count-1))}),r(this.stage,"pointerdown",c=>this.pointerDown(c)),r(this.stage,"pointermove",c=>this.pointerMove(c),{passive:!1}),r(this.stage,"pointerup",c=>this.pointerUp(c)),r(this.stage,"pointercancel",c=>this.pointerUp(c,!0)),r(this.stage,"lostpointercapture",c=>this.pointerUp(c,!0)),r(this.stage,"dragstart",c=>c.preventDefault()),r(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),r(this.stage,"click",c=>{if(c.detail!==0&&performance.now()<this.ignoreClickUntil){c.preventDefault(),c.stopPropagation();return}let o=c.target.closest(".orbit-card");o&&this.openProject(Number(o.dataset.slideIndex))}),r(this.stage,"focusin",c=>{let o=this.cards.indexOf(c.target.closest(".orbit-card"));!this.pointer&&o>=0&&o!==this.active&&this.goTo(o)}),r(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),r(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(r=>{let c=r.querySelector(".orbit-surface"),o=c.querySelector("img"),m=Array.from({length:this.segmentCount},(w,g)=>{let f=document.createElement("span");return f.className="orbit-strip",f.setAttribute("aria-hidden","true"),f.dataset.stripIndex=g,f.style.backgroundImage=`url("${o.src}")`,c.append(f),f});return r.classList.add("is-curved"),{card:r,strips:m}})}measure(){let r=this.stage.clientWidth,c=this.stage.clientHeight,o=r<=700;this.cards[0].style.removeProperty("width");let m=this.cards[0].offsetWidth,w=t/8,g=w*.88,f=m/g;this.geometry={radius:f,panelArc:g,cardWidth:m,pitch:i(c/13,36,52),halfWindow:6.5,radiansPerSlide:w,dragUnitX:Math.max(85,r*(o?.32:.18)),dragUnitY:i(c*.13,65,105)},this.stage.style.perspective=`${(f*2.4).toFixed(3)}px`;let k=g/this.segmentCount,d=2*f*Math.sin(k/2),y=m*9/16;this.panels.forEach(({card:M,strips:p})=>{M.style.width=`${m}px`,p.forEach((h,b)=>{let W=-g/2+(b+.5)*k,z=f*Math.sin(W),v=f*(Math.cos(W)-1);h.style.width=`${(d+.6).toFixed(4)}px`,h.style.backgroundSize=`${m}px ${y}px`,h.style.backgroundPosition=`${(-b*m/this.segmentCount).toFixed(4)}px 0px`,h.style.transform=`translateX(-50%) translate3d(${z.toFixed(4)}px, 0px, ${v.toFixed(4)}px) rotateY(${(W*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:r,pitch:c,halfWindow:o,radiansPerSlide:m}=this.geometry;this.visualCards.forEach(g=>{let f=Number(g.dataset.slideIndex),k=e(f-this.position+this.count/2,this.count)-this.count/2;g.dataset.repeat&&(k+=k<0?this.count:-this.count);let d=k*m,y=Math.cos(d),M=Math.sin(d),p=(1-y)/2,h=1-k/o*.11,b=M*r*h,W=k*c,z=y*r*h-r,v=d*180/Math.PI,A=i((o-Math.abs(k))/.65,0,1);g.style.transform=`translate(-50%, -50%) translate3d(${b.toFixed(3)}px, ${W.toFixed(3)}px, ${z.toFixed(3)}px) rotateY(${v.toFixed(3)}deg) scale(${h.toFixed(4)})`,g.style.zIndex="auto",g.style.setProperty("--orbit-shade",String(p*.58)),g.style.setProperty("--orbit-fade",String(A)),g.style.opacity="1",g.style.visibility=A>0?"visible":"hidden",g.style.pointerEvents=A>.25?"auto":"none",g.dataset.offset=k.toFixed(5)});let w=e(Math.round(this.position),this.count);w!==this.active&&this.updateActive(w)}updateActive(r){let c=this.visualCards.includes(document.activeElement);this.active=r,this.cards.forEach((o,m)=>{let w=m===r;o.classList.toggle("is-centered",w),o.tabIndex=w?0:-1,o.setAttribute("aria-pressed",String(w)),this.dots[m].setAttribute("aria-current",String(w))}),this.title&&(this.title.textContent=this.cards[r].dataset.title||""),this.description&&(this.description.textContent=this.cards[r].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[r].dataset.title}, project ${r+1} of ${this.count}`),c&&!this.pointer&&this.cards[r].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(r)}goTo(r){let c=e(r-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+c)}step(r){this.animateTo(Math.round(this.target)+r)}animateTo(r,c=0){if(this.target=Math.round(r),this.velocity=c,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(r){this.frame=0;let c=Math.min((r-this.lastTime)/1e3,.032);this.lastTime=r;let o=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=o*c,this.position+=this.velocity*c,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(r){if(this.viewer.dialog.open||!Number.isInteger(r)||!this.cards[r])return;let c=e(r-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+c),this.settleImmediately(),this.viewer.open(r)}pointerDown(r){if(!r.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}r.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:r.pointerId,x:r.clientX,y:r.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:r.target.closest(".orbit-card")},this.stage.setPointerCapture(r.pointerId))}pointerMove(r){let c=this.pointer;if(!c||c.id!==r.pointerId)return;let o=r.clientX-c.x,m=r.clientY-c.y;if(!c.dragging){if(Math.max(Math.abs(o),Math.abs(m))<6)return;if(r.pointerType==="touch"&&Math.abs(o)<=Math.abs(m)){c.card=null;return}c.axis=Math.abs(m)>Math.abs(o)?"y":"x",c.lastCoordinate=c.axis==="x"?c.x:c.y,c.dragging=!0,this.root.classList.add("is-dragging")}r.preventDefault();let w=c.axis==="x"?r.clientX:r.clientY,g=c.axis==="x"?o:m,f=c.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,k=r.pointerType==="touch"?i(f*.38,32,48):f,d=performance.now(),y=Math.max(8,d-c.lastTime),M=-(w-c.lastCoordinate)/k/y*1e3;c.speed=c.speed*.35+M*.65,c.lastMovement=d,c.lastTime=d,c.lastCoordinate=w,c.travel=g,this.position=c.startPosition-g/k,this.render()}pointerUp(r,c=!1){let o=this.pointer;if(!o||o.id!==r.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(o.id)&&this.stage.releasePointerCapture(o.id),!o.dragging){this.animateTo(Math.round(this.position)),!c&&o.card&&this.openProject(Number(o.card.dataset.slideIndex));return}let m=c||performance.now()-o.lastMovement>90?0:i(o.speed,-10,10),w=Math.round(this.position+(this.reducedMotion.matches?0:m*(r.pointerType==="touch"?.32:.2))),g=this.position-o.startPosition;!c&&Math.abs(o.travel)>18&&Math.abs(g)>.12&&w===Math.round(o.startPosition)&&(w+=Math.sign(g)),this.animateTo(w,m)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:r,strips:c})=>{c.forEach(o=>o.remove()),r.classList.remove("is-curved"),r.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(r=>r.dataset.repeat).forEach(r=>r.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function a(s=document){s.querySelectorAll("[data-spiral-carousel]").forEach(r=>{r.spiralCarousel||(r.spiralCarousel=new n(r))})}window.SpiralCarousel={init:a},a()})()});var Xi,_i=Y(()=>{Xi=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Vi,Yi=Y(()=>{Vi=`.project-dialog {
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
`});var Ki,Ji=Y(()=>{Ki=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var ea={};Zt(ea,{mountSpiral:()=>ur,spiralControls:()=>dt,spiralDefaults:()=>Xe});function Rt(t,e,i){for(let n of Qi)t.removeAttribute(n);for(let[n,a]of Object.entries(e.imageAttrs||{}))Qi.has(n)&&a!=null&&t.setAttribute(n,String(a));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&i?.(t)}function gr(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function ur(t){let{host:e,onChange:i=()=>{},loadImage:n}=t,a=t.items.filter(C=>C.src),s={...Xe,...t.options},r=!1;if(!a.length){let C=document.createElement("p");return C.className="gc-spiral-empty",C.textContent="Add images to this source to preview the spiral.",e.append(C),{destroy(){C.remove()}}}let c=document.createElement("div");c.className="gc-spiral-root reference-carousel-shell";let o=document.createElement("div");o.className="orbit-carousel spiral-carousel slot-carousel",o.dataset.spiralCarousel="",o.id=`gc-spiral-${++dr}`,o.setAttribute("role","region"),o.setAttribute("aria-label","Spiral gallery"),o.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let m=o.querySelector(".orbit-stage"),w=o.querySelector(".orbit-ring"),g=o.querySelector("[data-orbit-toggle]");De(o.querySelector("[data-orbit-prev]"),"previous"),De(o.querySelector("[data-orbit-next]"),"next"),De(g,"playback");let f=o.querySelector(".gc-spiral-caption"),k=document.createElement("div");k.className="gc-spiral-caption-space",f.before(k),k.append(f);let d=a.some(C=>!!C.title);for(let C of new Set(a.map(E=>E.title).filter(Boolean))){let E=f.cloneNode(!1);E.setAttribute("aria-hidden","true"),E.classList.add("gc-spiral-caption-measure"),E.textContent=C,k.append(E)}a.forEach((C,E)=>{let S=document.createElement("button");S.className="orbit-card",S.type="button",S.dataset.title=C.title||"",S.dataset.imageSource=C.src,S.setAttribute("aria-label",C.title?`View ${C.title}`:`View image ${E+1}`);let T=document.createElement("span");T.className="orbit-surface";let j=document.createElement("img");Rt(j,C),T.append(j),S.append(T),w.append(S)}),c.append(o),e.append(c);let y=()=>{c.style.width=`${Ze(s.containerWidth,100,20,100)}%`,m.style.height=`${Ze(s.stageHeight,680,280,1600)}px`,o.style.setProperty("--orbit-card-width",`${Ze(s.cardWidth,280,80,720)}px`),o.dataset.spiralWidth=String(Ze(s.spiralWidth,87,20,100)),o.dataset.cardWidth=String(Ze(s.cardWidth,280,80,720)),o.dataset.rise=String(Ze(s.spiralRise,52,s.spiralRiseUnit==="percent"?1:8,s.spiralRiseUnit==="percent"?50:500)),o.dataset.riseUnit=s.spiralRiseUnit==="percent"?"percent":"px",o.dataset.cardAspect=String(pr(s.aspectRatio)),o.dataset.imageFit=s.fit==="contain"||s.fit==="fit"?"fit":"fill",o.dataset.imagePadding=String(Ze(s.imagePadding,0,0,20)),o.dataset.slotGap=String(Ze(s.spiralGap,3,0,16)),o.dataset.showSlots=String(!!s.showSlots),k.hidden=!s.showTitles||!d,o.classList.toggle("gc-spiral-reduced",!!s.reducedMotion)};y();let M=a.map(C=>({title:C.title||"",category:"",description:Zi(C.description),services:[],notes:[],gallery:[{file:C.src,label:"Image"}]}));class p extends yt{constructor(E,S){super(E,S,M),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(E){let S=a[E];if(!S||s.clickAction==="none")return;let T=gr(S.link);if(s.clickAction==="link"){T&&location.assign(T);return}super.open(E);let j=this.dialog.querySelector(".project-title");j.hidden=!S.title,S.title?this.dialog.setAttribute("aria-labelledby",j.id):this.dialog.removeAttribute("aria-labelledby"),this.dialog.querySelector(".project-summary").hidden=!Zi(S.description),this.sourceLink.hidden=!T,T?(this.sourceLink.href=T,this.sourceLink.textContent=S.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!s.reducedMotion)}showFrame(E){super.showFrame(E);let S=M.indexOf(this.project),T=a[S];T&&(Rt(this.image,T,n),this.dialog.querySelectorAll(".project-thumbnail img").forEach(j=>Rt(j,T,n)),this.dialog.querySelector(".project-frame-label").textContent=T.title||"")}}let h=window.ProjectViewer;window.ProjectViewer=p;try{lr.init(c)}finally{h===void 0?delete window.ProjectViewer:window.ProjectViewer=h}let b=o.spiralCarousel;o.querySelectorAll("img").forEach(C=>n?.(C));let W=b.updateActive;b.updateActive=function(C){W.call(this,C),this.status.textContent=`${a[C]?.title?`${a[C].title}, `:""}image ${C+1} of ${a.length}`,i(C)},b.updateActive(b.active);let z=b.animateTo;b.animateTo=function(C,E=0){s.reducedMotion?(this.target=Math.round(C),this.settleImmediately()):z.call(this,C,E)};let v=Bi(b,{textureSource:C=>C.dataset.imageSource}),A=gi(o,b,{pauseOnHover:!1,interactionRestMs:0});function P(C){s.autoplay=!!C,b.manuallyPaused=!C||!!s.reducedMotion,b.resumeAt=0,g.disabled=!!s.reducedMotion||b.reducedMotion.matches||a.length<2,g.dataset.paused=String(b.manuallyPaused),g.setAttribute("aria-label",b.manuallyPaused?"Resume carousel":"Pause carousel"),b.syncAutoplay()}return P(!!s.autoplay),{update(C){s={...s,...C},y(),b.measure(),o.dispatchEvent(new Event("playground-change")),o.dispatchEvent(new Event("slot-guides-change")),b.updateActive(b.active),P(!!s.autoplay)},goTo(C){r||b.goTo(C)},setPlaying:P,getMetrics(){try{return JSON.parse(o.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return o.dataset.renderer||"loading"},destroy(){r||(r=!0,A(),v(),b.destroy(),c.remove())}}}var lr,dr,Ze,pr,Zi,Qi,ta=Y(async()=>{pi();bt();xt();xt();ui();await Gi();Ui();lr=window.SpiralCarousel,dr=0,Ze=(t,e,i,n)=>Number.isFinite(Number(t))?Math.max(i,Math.min(n,Number(t))):e,pr=t=>{if(typeof t=="number"&&t>0)return t;let[e,i]=String(t||"16:9").split(":").map(Number);return e>0&&i>0?e/i:16/9},Zi=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Qi=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function ia(t){let{host:e}=t,i={...t.options},n=null,a=null,s=!1,r="loading",c=document.createElement("p");return c.className="gc-empty",c.setAttribute("role","status"),c.textContent="Loading spiral\u2026",e.append(c),ta().then(()=>ea).then(o=>{s||(c.remove(),a=o.mountSpiral({...t,options:i}),n!==null&&a.goTo?.(n))}).catch(o=>{s||(r="error",c.textContent="The spiral could not load.",e.replaceChildren(c),console.warn("Gallery Studio: spiral unavailable",o))}),{update(o){i={...i,...o},a?.update?.(i)},goTo(o){n=o,a?.goTo?.(o)},setPlaying(o){i.autoplay=o,a?.setPlaying?.(o)},getStatus(){return a?.getStatus?.()??r},getMetrics(){return a?.getMetrics?.()??null},destroy(){s=!0,c.remove(),a?.destroy()}}}var aa=Y(()=>{});function ut(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let i=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(i.protocol)?i.href:""}catch{return""}}function Ht(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(i=>i.remove()),e.content.querySelectorAll("*").forEach(i=>{for(let n of[...i.attributes])(/^on/i.test(n.name)||n.name==="style"||n.name==="id")&&i.removeAttribute(n.name);if(i.hasAttribute("href")){let n=ut(i.getAttribute("href"));n?i.setAttribute("href",n):i.removeAttribute("href")}}),e.innerHTML}function hr(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let i of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(i)&&(e[i]=t.getAttribute(i));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function ht(t,e){let i=Wt[e];if(!t||!i)return null;let n=t.closest(i);if(!n){let o=t.querySelectorAll(i);if(o.length!==1)return null;n=o[0]}let a=e==="list"?n:n.querySelector(":scope > .sqs-block-content");if(!a)return null;let s=o=>Array.from(a.querySelectorAll(o)).filter(m=>m.closest(i)===n&&(!m.closest(".gc-embed")||m.hasAttribute("data-gc-native-track"))),r=e==="list"?".list-item":".slide",c=s(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!c.length&&(c=s(".sqs-gallery")),c.length===1){let o=Array.from(c[0].querySelectorAll(r)).filter(m=>m.closest(i)===n&&!m.hasAttribute("data-gc-repeat"));return{source:n,originals:c,rows:o}}if(e==="gallery"&&!c.length){let o=s(r);if(o.length&&o.every(m=>m.parentElement===o[0].parentElement))return{source:n,originals:o,rows:o}}return null}function st(t,e,i=location.href){return(ht(t,e)?.rows||[]).map(a=>{let s=a.querySelector("img[data-src],img[data-image],img"),r=a.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",c=Ht(a.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),o=a.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...hr(s),title:r,description:c,link:ut(o?.getAttribute("href"),i),buttonLabel:e==="list"&&o?.textContent.trim()||""}}).filter(a=>e==="list"||a.src)}function fr(t,e){let i=e==="list"?t.getAttribute("data-section-id"):t.id;if(!i?.trim())return"";let n=e==="list"?'section[data-section-id="'+CSS.escape(i)+'"]':"#"+CSS.escape(i);return t.ownerDocument.querySelectorAll(n).length===1?n:""}function ra(t=document){let e={list:0,gallery:0};return Array.from(t.querySelectorAll(Object.values(Wt).join(","))).filter(i=>!i.closest(".gc-embed")).flatMap(i=>{let n=i.matches(Wt.list)?"list":"gallery",a=fr(i,n);if(!a||!ht(i,n))return[];let s=++e[n];return{name:(n==="list"?"List Section":"Gallery Block")+(s>1?" "+s:""),type:n,selector:a,root:i,items:st(i,n)}})}function St(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let i=t.ownerDocument.defaultView?.ImageLoader;if(i&&typeof i.load=="function")try{i.load(t,{load:!0})}catch(n){console.warn("Gallery Studio: native image loader",n)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+oa(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function oa(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function Ot(t){let e=document.createElement("img");for(let[i,n]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(i)&&e.setAttribute(i,n);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=oa(t.imageAttrs?.["data-image-focal-point"]),e}var Wt,Dt=Y(()=>{Wt={list:"section.user-items-list-section",gallery:".sqs-block-gallery"}});function na(t,e,i){let n=new WeakMap,a=new WeakMap,s=Array.from(e.childNodes),r=i.map(M=>Array.from(M.childNodes)),c=[];function o(M,p){M&&c.push([M,p.map(h=>[h,M.getAttribute(h)])])}let m=new Set,w=!1;function g(){o(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let M of i)o(M,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),w=!0}function f(M,p,h,b,W){let z=i[p],v=m.has(p),A=v?z.cloneNode(!1):z,P=document.createElement("div");if(P.className="gc-card gc-native-card",P.tabIndex=0,P.setAttribute("role","group"),M.imageAttrs?.["data-image-focal-point"]){let[F,oe]=M.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(F)&&Number.isFinite(oe)&&P.style.setProperty("--gc-native-focus",F*100+"% "+oe*100+"%")}let C=M.title||M.alt||`Item ${p+1}`;if(P.setAttribute("aria-label",C),v){A.removeAttribute("id"),A.setAttribute("data-gc-repeat","");for(let F of r[p])P.append(F.cloneNode(!0));P.querySelectorAll("[id]").forEach(F=>F.removeAttribute("id"))}else m.add(p),P.append(...r[p]);A.replaceChildren(P),n.set(P,A);let E=P.querySelector(".list-item-media"),S=P.querySelector(".list-item-content"),T=P.querySelector(".list-item-content__title"),j=P.querySelector(".list-item-content__description");if(!v){for(let F of[E,S])o(F,["class"]);for(let F of[T,j])o(F,["class","hidden"])}if(E?.classList.add("gc-card-media"),S?.classList.add("gc-card-copy"),b.typeSource!=="native"&&(T?.classList.add("gc-card-title"),j?.classList.add("gc-card-description")),T&&(!b.showTitles||h.caption===!1)&&(T.hidden=!0),j&&!h.description&&(j.hidden=!0),h.thumbnail){let F=P.querySelector(".list-item-content__button-wrapper")||P.querySelector(".list-item-content__button");F&&(v||o(F,["hidden"]),F.hidden=!0),S&&(!M.title||h.caption===!1)&&(v||o(S,["hidden"]),S.hidden=!0)}let Q=Array.from(P.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!v)for(let F of Q)o(F,["tabindex"]);if(a.set(P,Q.map(F=>[F,F.getAttribute("tabindex")])),b.clickAction!=="none"&&(b.clickAction!=="link"||M.link)){let F=document.createElement("button");F.type="button",F.className="gc-native-action",F.tabIndex=-1,F.setAttribute("aria-label",(b.clickAction==="link"?"Open link for ":"Open ")+C),F.addEventListener("click",()=>W(M,p)),P.append(F),P.setAttribute("aria-keyshortcuts","Enter Space"),P.addEventListener("click",oe=>{oe.defaultPrevented||oe.target.closest("a,button,input,select,textarea,label")||W(M,p)}),P.addEventListener("keydown",oe=>{oe.target!==P||!["Enter"," "].includes(oe.key)||(oe.preventDefault(),F.click())})}return P}function k(M){let p=M.tabIndex===0&&M.getAttribute("aria-hidden")!=="true";for(let[h,b]of a.get(M)||[]){let W=p?b:"-1";h.getAttribute("tabindex")!==W&&(W===null?h.removeAttribute("tabindex"):h.setAttribute("tabindex",W))}}function d(M){if(!w)return;let p=M!=="native";e.querySelectorAll(".list-item-content__title").forEach(h=>h.classList.toggle("gc-card-title",p)),e.querySelectorAll(".list-item-content__description").forEach(h=>h.classList.toggle("gc-card-description",p))}function y(){if(e.classList.remove("gc-native-items-hidden"),!!w){i.forEach((M,p)=>M.replaceChildren(...r[p])),e.replaceChildren(...s);for(let[M,p]of c)for(let[h,b]of p)M.getAttribute(h)!==b&&(b===null?M.removeAttribute(h):M.setAttribute(h,b));t.after(e),c.length=0,m.clear(),w=!1}}return{track:e,begin:g,makeCard:f,slot:M=>n.get(M),syncFocus:k,setType:d,restore:y}}var sa=Y(()=>{});function ca(t,e,i){if(!i.closest(".fluid-engine > .fe-block"))return()=>{};i.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let a=0,s=!1,r=new WeakSet,c=f=>{f&&!r.has(f)&&(r.add(f),m.observe(f))},o=()=>{!a&&!s&&(a=requestAnimationFrame(g))},m=new ResizeObserver(o),w=new MutationObserver(o);function g(){if(a=0,s||!e.isConnected)return;let f=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!f)return;let k=f.classList.contains("gc-carousel-stage"),d=f.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),c(d),c(f);let y=0;for(let p of d.children){if(p===f||p.contains(f))continue;let h=getComputedStyle(p);h.display==="none"||["absolute","fixed"].includes(h.position)||(y+=p.offsetHeight+(parseFloat(h.marginTop)||0)+(parseFloat(h.marginBottom)||0),c(p))}let M=Math.max(1,t.clientHeight-y);if(k){let p=f.parentElement;p.classList.contains("gc-block-stage-window")||(p=document.createElement("div"),p.className="gc-block-stage-window",f.before(p),p.append(f));let h=Math.min(1,M/Math.max(1,f.offsetHeight));p.style.height=M+"px",f.style.setProperty("--gc-block-scale",String(h)),f.style.setProperty("--gc-block-top",Math.max(0,(M-f.offsetHeight*h)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",M+"px")}return c(t),w.observe(e,{childList:!0,subtree:!0}),o(),()=>{s=!0,cancelAnimationFrame(a),m.disconnect(),w.disconnect(),i.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let f=e.querySelector(".gc-block-stage-window");if(f){let k=f.firstElementChild;k.style.removeProperty("--gc-block-scale"),k.style.removeProperty("--gc-block-top"),f.replaceWith(k)}}}var la=Y(()=>{});function da(t,e,i,n){let a=i.ownerDocument,s=a.defaultView,r=n==="gallery"?i.closest(".fluid-engine > .fe-block"):null;r?.classList.add("gc-viewport-cell");let c=[],o=r||i;for(let g=t.parentElement;g&&(["hidden","clip","auto","scroll"].includes(s.getComputedStyle(g).overflowX)&&c.push(g),g!==o);g=g.parentElement);function m(){let g=a.documentElement.clientWidth;if(!g||!t.isConnected||!t.getClientRects().length)return;for(let d of c){let y=d.getBoundingClientRect().left+s.scrollX+d.clientLeft,M=y>.5||y+d.clientWidth<g-.5;d.classList.toggle("gc-viewport-unclip",M)}let f=-(t.getBoundingClientRect().left+s.scrollX),k=(d,y)=>{e.style.getPropertyValue(d)!==y&&e.style.setProperty(d,y)};k("--gc-viewport-width",g+"px"),k("--gc-viewport-offset",f+"px")}m();let w=s.ResizeObserver?new s.ResizeObserver(m):null;return w?.observe(t),w?.observe(a.documentElement),s.addEventListener("resize",m),()=>{w?.disconnect(),s.removeEventListener("resize",m);for(let g of c)g.classList.remove("gc-viewport-unclip");r?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var pa=Y(()=>{});var ua,ga=Y(()=>{ua=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function ha(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),e.preset!=="spiral"){if(!document.getElementById("gc-finish-css")){let i=document.createElement("style");i.id="gc-finish-css",i.textContent=ua,document.head.append(i)}t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}}var Bt,fa=Y(()=>{ga();Bt={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset"}});function ma(t,e){let i=t.classList.contains("gc-embed"),n=i&&e.colorSource==="section";n?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,i&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let a=t.style;a.setProperty("--gc-custom-background",e.background),a.setProperty("--gc-custom-ink",e.ink),a.setProperty("--gc-custom-accent",e.accent),a.setProperty("--gc-background",n?"var(--gc-section-surface)":e.background),a.setProperty("--gc-ink",n?"var(--gc-section-body)":e.ink),a.setProperty("--gc-accent",n?"var(--gc-section-action)":e.accent),a.setProperty("--gc-muted",n?"var(--gc-section-body)":e.ink+"aa"),a.setProperty("--gc-spatial-surface","var(--gc-background)"),a.setProperty("--gc-spatial-ink","var(--gc-ink)"),n&&(a.setProperty("--gc-line-color","var(--gc-section-line)"),a.setProperty("--gc-tint","var(--gc-section-body)")),a.background=n?"transparent":e.background,a.color=n?"var(--gc-section-body)":e.ink;for(let s of t.querySelectorAll(":scope > dialog"))ba(t,s)}function ba(t,e){for(let i of["gcColorSource","gcTypeSource"])t.dataset[i]?e.dataset[i]=t.dataset[i]:delete e.dataset[i]}function Gt(t,e){let i=t.classList.contains("gc-embed")?t:t.ownerDocument.body;ba(t,e),e.parentElement!==i&&i.append(e)}var ya=Y(()=>{});var va,xa=Y(()=>{va=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var ka,wa=Y(()=>{ka=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var Ma,Sa=Y(()=>{Ma=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var Aa,Ca=Y(()=>{Aa=`.gc-carousel {
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
.gc-preset-infinite .gc-carousel-playback { position: absolute; bottom: 19%; left: 132px; pointer-events: auto; }
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
`});var Pa,Ea=Y(()=>{Pa=`.gc-spatial {
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
`});function Qe(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Mt(t,e){let i=Qe(e.preset??t.preset),n=i===Qe(t.preset)?t.stageHeight:i?0:590;return{...t,...e,stageHeight:e.stageHeight??n}}function La(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function ja(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[va,ka,Ma].join(`
`),document.head.append(e));let i=La(t);if(i==="common")return()=>{};let n=`gc-runtime-${i}-css`,a=document.getElementById(n);a||(a=document.createElement("style"),a.id=n,i==="carousel"?a.textContent=Aa:i==="spatial"?a.textContent=Pa:a.textContent=[Xi,Di,Vi,Ki].join(`
`),e.after(a)),a.dataset.gcOwners=String(Number(a.dataset.gcOwners||0)+1);let s=!1;return()=>{if(s)return;s=!0;let r=Number(a.dataset.gcOwners)-1;r>0?a.dataset.gcOwners=String(r):a.remove()}}function kr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function za(t,e,i={},n=null){let a=Mt(ot,i),s=null,r=null,c=null,o=0,m=0,w,g;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function f(){r&&(r.close(),r.remove(),r=null,s?.setSuspended?.(!1),c?.focus({preventScroll:!0}))}function k(v,A){if(a.clickAction==="none")return;if(a.clickAction==="link"){let j=ut(v.link);j&&window.open(j,"_blank","noopener,noreferrer");return}c=document.activeElement,r&&f(),r=document.createElement("dialog"),r.className="gc-dialog"+(a.preset==="showcase"?" gc-dialog-drawer":""),r.setAttribute("aria-label",v.title||"Image preview");let P=document.createElement("button");P.className="gc-dialog-close",P.type="button",P.textContent="Close \xD7",P.addEventListener("click",f);let C=document.createElement("div");C.className="gc-dialog-content";let E=document.createElement("div");E.className="gc-dialog-media",v.src&&(E.append(Ot(v)),C.append(E));let S=document.createElement("div");if(S.className="gc-dialog-copy",v.title){let j=document.createElement("h2");j.textContent=v.title,S.append(j)}if(v.description){let j=document.createElement("div");j.innerHTML=Ht(v.description),S.append(j)}if(v.link){let j=document.createElement("a");j.href=ut(v.link),j.textContent=v.buttonLabel||"Open link",j.target="_blank",j.rel="noopener noreferrer",S.append(j)}let T=document.createElement("p");T.className="gc-dialog-count",T.textContent=`${A+1} / ${e.length}`,S.append(T),C.append(S),r.append(P,C),Gt(t,r),r.showModal(),s?.setSuspended?.(!0),St(E.querySelector("img")),P.focus(),r.addEventListener("cancel",j=>{j.preventDefault(),f()}),r.addEventListener("click",j=>{if(j.target===r){let Q=r.getBoundingClientRect();(j.clientX<Q.left||j.clientX>Q.right||j.clientY<Q.top||j.clientY>Q.bottom)&&f()}})}function d(v,A,P={}){if(n)return n.makeCard(v,A,P,a,k);let C=document.createElement("button");C.type="button",C.className="gc-card",C.setAttribute("aria-label",v.title||`Image ${A+1}`);let E=document.createElement("span");E.className="gc-card-media",v.src&&(E.append(Ot(v)),C.append(E));let S=document.createElement("span");if(S.className="gc-card-copy",P.caption!==!1&&a.showTitles&&v.title){let T=document.createElement("span");T.className="gc-card-title",T.textContent=v.title,S.append(T)}if(P.description&&v.description){let T=document.createElement("span");T.className="gc-card-description",T.textContent=kr(v.description),S.append(T)}return S.childNodes.length&&C.append(S),C.addEventListener("click",()=>k(v,A)),C}let y=matchMedia("(prefers-reduced-motion: reduce)"),M=matchMedia("(max-width: 660px)");function p(){let v={...a,reducedMotion:a.reducedMotion||y.matches};return M.matches&&(a.mobileCardWidth!=null&&(v.cardWidth=a.mobileCardWidth),a.mobileGap!=null&&(v[a.preset==="spiral"?"spiralGap":"gap"]=a.mobileGap)),v.phoneWidthOverride=M.matches&&a.mobileCardWidth!=null,a.preset==="stack"&&(v.stackCardWidth=M.matches&&a.mobileCardWidth!=null?a.mobileCardWidth:Math.max(360,a.cardWidth*2.2)),v}function h(){ha(t,a),t.style.setProperty("--gc-fit",a.fit),t.style.setProperty("--gc-card-radius",a.radius+"px"),ma(t,a)}function b(v=0){f(),s?.destroy(),s=null,n?.restore(),cancelAnimationFrame(m),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let A=La(a.preset);A!==w&&(g?.(),g=ja(a.preset),w=A),h(),t.setAttribute("aria-label",a.previewScroll===!1?"Gallery":"Gallery preview");let P=n&&a.preset!=="spiral"?n:null;P?P.begin():n&&n.track.classList.add("gc-native-items-hidden");let C={host:t,items:e,initialIndex:v,nativeList:P,attachDialog:E=>Gt(t,E),options:p(),makeCard:d,loadImage:St,onChange(E){o=E,a.onChange?.(E)}};if(!e.length){let E=document.createElement("p");E.className="gc-empty",E.textContent="Add images to your source to start exploring.",t.append(E);return}a.preset==="spiral"?s=ia(C):a.preset==="stack"?s=ci(C):["wall","ring","angled"].includes(a.preset)?(s=ni(C),v&&s.goTo(v)):s=ri(C),a.preset!=="spiral"&&(m=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(E=>{St(E,{nativeCard:!!P})})))}let W=()=>b(o);function z(){a.mobileCardWidth==null&&a.mobileGap==null||(s?.setGeometry?s.setGeometry(p()):a.preset==="spiral"?s?.update(p()):b(o))}try{b()}catch(v){throw g?.(),n?.restore(),v}return y.addEventListener("change",W),M.addEventListener("change",z),{update(v){let A=a.preset,P=p();a=Mt(a,v);let C=p(),E=Object.keys(C).filter(T=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(T)&&C[T]!==P[T]);if(!E.length)return;if(s?.setGeometry&&E.every(T=>["cardWidth","gap","phoneWidthOverride"].includes(T))){s.setGeometry(C);return}let S=T=>["colorSource","typeSource","background","ink","accent"].includes(T);if(E.every(T=>S(T)||A!=="spiral"&&(T==="radius"||Object.hasOwn(Bt,T)))){h(),E.includes("typeSource")&&n?.setType(a.typeSource);return}A==="spiral"&&a.preset==="spiral"&&s?.update?(h(),s.update(C)):b(A===a.preset?o:0)},goTo(v){s?.goTo?.(v)},setPlaying(v){a.autoplay=v,s?.setPlaying?.(v)},getOptions(){return{...a}},getActive(){return o},destroy(){f(),cancelAnimationFrame(m),s?.destroy(),n?.restore(),y.removeEventListener("change",W),M.removeEventListener("change",z),t.replaceChildren(),t.classList.remove("gc-stage"),g?.()}}}function Sr(t,e){let i=e.closest("section")||e,n=[];for(let a=t.parentElement;a;a=a.parentElement){let s=ke.scrollBoundaries.get(a)||0;if((s||["hidden","auto","scroll","overlay"].includes(getComputedStyle(a).overflowY))&&(ke.scrollBoundaries.set(a,s+1),a.classList.add("gc-stack-page-scroll"),n.push(a)),a===i)break}return()=>{for(let a of n){let s=ke.scrollBoundaries.get(a)-1;s?ke.scrollBoundaries.set(a,s):(ke.scrollBoundaries.delete(a),a.classList.remove("gc-stack-page-scroll"))}}}function ct(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function Ut(t){if(!ke.editListeners?.size){ke.editListeners=new Set;let e=ct();ke.editObserver=new MutationObserver(()=>{let i=ct();if(i!==e){e=i;for(let n of ke.editListeners)try{n(i)}catch(a){console.warn("Gallery Studio: could not resume a list layout.",a)}}});for(let i of[document.body,document.documentElement])ke.editObserver.observe(i,{attributes:!0,attributeFilter:["class"]})}return ke.editListeners.add(t),()=>{ke.editListeners.delete(t),ke.editListeners.size||ke.editObserver.disconnect()}}function _t({selector:t,type:e="gallery",options:i={}}={}){let n=t;if(typeof t=="string")try{let j=document.querySelectorAll(t);if(j.length!==1)return null;n=j[0]}catch{return null}if(!n?.isConnected||typeof n.closest!="function")return null;let a=ht(n,e);if(!a)return null;let{source:s}=a,r=ke.mounts.get(s);if(r)return r.instance.update(i),r;if(!st(s,e).length)return null;let c=document.createElement("div"),o=document.createElement("div");c.className="gc-embed",o.className="gc-viewport-slot",o.append(c);let m={...Mt(ot,i),previewScroll:!1},w=null,g=null,f=null,k=null,d=null,y=!1,M=[],p=null,h=!1,b=null;function W(){m.galleryWidth==="source"?(f?.(),f=null,p&&(o.classList.add("user-items-list-simple"),o.dataset.layoutWidth=p.mode,o.style.maxWidth=p.maximum)):f||(o.classList.remove("user-items-list-simple"),delete o.dataset.layoutWidth,o.style.removeProperty("max-width"),f=da(o,c,s,e))}function z(){return e==="gallery"&&m.preset!=="stack"&&m.galleryHeight!=="custom"&&!!s.closest(".fluid-engine > .fe-block")}function v(){z()?k||(k=ca(o,c,s)):(k?.(),k=null)}function A(j){j==="stack"?g||(g=Sr(c,s)):g&&(g(),g=null)}function P(){try{w?.destroy()}finally{w=null,k?.(),k=null,A(null),f?.(),f=null,M.forEach(j=>j.classList.remove("gc-native-items-hidden")),M=[],b?.remove(),b=null,o.remove(),o.replaceChildren(c),c.inert=!1}}function C(){if(y||w||!s.isConnected)return;let j=ht(s,e),Q=st(s,e);if(!j||!Q.length)return;j.originals[0].before(o),ja();let F=j.originals[0];p=e==="list"?{mode:F.dataset.layoutWidth||"full",maximum:F.style.maxWidth}:null,W();let oe=null;if(e==="list"){let ee=h?F.cloneNode(!0):F;h&&(b=ee,ee.removeAttribute("id"),ee.querySelectorAll("[id]").forEach(ce=>ce.removeAttribute("id")),o.append(ee)),oe=na(o,ee,h?[...ee.querySelectorAll(".list-item")]:j.rows)}(!oe||h)&&(M=j.originals,M.forEach(ee=>ee.classList.add("gc-native-items-hidden"))),v(),A(m.preset),w=za(c,Q,m,oe),c.inert=h}function E(){if(!y){y=!0,s.classList.remove("gc-edit-preview");try{P()}finally{d?.(),ke.mounts.delete(s)}}}let T={instance:{update(j={}){if(y)return;let Q=m.galleryWidth;m={...Mt(m,j),previewScroll:!1},w&&(m.galleryWidth!==Q&&W(),v(),A(m.preset),w.update(m))},setEditPreview(j){if(!(y||!ct()||j===h)){if(h=j,s.classList.toggle("gc-edit-preview",j),!j){P();return}try{C()}catch(Q){throw this.setEditPreview(!1),Q}}},goTo(j){w?.goTo(j)},setPlaying(j){m.autoplay=j,w?.setPlaying(j)},getOptions(){return{...m}},getActive(){return w?.getActive()??0},destroy:E},host:c,source:s,destroy:E};try{d=Ut(j=>{if((h||j)&&P(),h=!1,s.classList.remove("gc-edit-preview"),!j)try{C()}catch(Q){throw P(),Q}}),ct()||C(),ke.mounts.set(s,T)}catch(j){throw E(),j}return T}var ft,ot,ke,Xt=Y(()=>{oi();si();li();aa();xt();Dt();sa();la();pa();fa();ya();xa();wa();Sa();Ca();Ea();Ji();_i();Yi();Oi();ft=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],ot={...Bt,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};ke=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:za,embed:_t,presets:ft}});var Ta,Ia=Y(()=>{Ta=`:host {
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
`});function Z(t,e,i){let n=document.createElement(t);return e&&(n.className=e),i!==void 0&&(n.textContent=i),n}function We(t,e,i){let n=Z("button",t,e);return n.type="button",i&&n.setAttribute("aria-label",i),n}function et(t,e,i,n,a,s=""){return{key:t,label:e,type:"range",min:i,max:n,step:a,unit:s}}function Yt(t,e){let i=t.preset,n=Qe(i),a=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},et("cardWidth","Card width",80,i==="timed"?960:i==="spiral"?720:560,1,"px"),et("stageHeight",n?"Minimum gallery height":"Gallery height",n?0:300,1200,1,"px")];if(e==="gallery"&&(a.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&a.splice(a.findIndex(r=>r.key==="stageHeight"),1)),i==="spiral")a.push(...dt);else if(a.push(et("gap","Spacing",0,100,1,"px")),i!=="infinite"&&i!=="timed"){let r={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[i]||"Depth";a.push(et("depth",r,0,100,1))}let s=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:i==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];return(i==="arc-tabs"||i==="timed")&&s.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),i!=="stack"&&(s.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),i!=="spiral"&&s.push(et("duration","Time per image",2,15,.5,"s"))),s.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"}),[{title:"Size & spacing",fields:a},{title:"Mobile overrides",fields:[{...a.find(r=>r.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...a.find(r=>r.key===(i==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:i==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:s},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:Cr},...i==="spiral"?[]:[et("radius","Corner radius",0,64,1,"px"),et("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},et("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],{key:"showTitles",label:"Show titles",type:"checkbox"},{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]}]}function qa(t){return{...ot,stageHeight:Qe(t.preset??ot.preset)?0:590,...t.preset==="spiral"?Xe:{},colorSource:"section",typeSource:"native",...t}}function Ar(t){let e=t.type==="list"?"List Section":"Gallery Block",i=t.name?.trim()||e,n=t.items?.length||0;return`${i.toLowerCase().includes(e.toLowerCase())?i:`${i} \xB7 ${e}`} \xB7 ${n} ${n===1?"item":"items"}`}function Na({source:t,options:e,onPreset:i,onOption:n,onClose:a,onRestore:s,onSave:r,getSaveState:c,getCode:o,getStyle:m,applyStyle:w}){let g=document.activeElement,f=t,k=qa(e),d=!1,y=!1,M=0,p=new Map,h=new Map,b=Z("div");b.setAttribute("data-gc-author-panel",""),b.setAttribute("data-lenis-prevent",""),b.addEventListener("wheel",L=>L.stopPropagation(),{passive:!0}),b.addEventListener("touchmove",L=>L.stopPropagation(),{passive:!0});let W=b.attachShadow({mode:"open"}),z=Z("style");z.textContent=Ta;let v=Z("aside","panel");v.setAttribute("aria-labelledby","gc-author-heading");let A=Z("header","header"),P=Z("div","heading"),C=Z("h2","","Gallery settings");C.id="gc-author-heading";let E=Z("p","target"),S=Z("p","save-state");S.setAttribute("role","status"),P.append(C,E,S);function T(L=c()){S.textContent!==L&&(S.textContent=L,S.dataset.saved=String(L==="Saved to page"))}let j=Z("div","header-actions"),Q=We("icon-button","\u2212","Minimize settings");Q.setAttribute("aria-controls","gc-author-controls"),Q.setAttribute("aria-expanded","true");let F=We("icon-button","\xD7","Close settings");j.append(Q,F),A.append(P,j);let oe=Z("div","controls");oe.id="gc-author-controls";let ee=Z("div","scroll");ee.tabIndex=0,ee.setAttribute("aria-label","Layout settings");let ce=Z("label","preset-row"),fe=Z("select","preset-select");fe.setAttribute("aria-label","Layout");for(let L of ft.filter(N=>t.type!=="gallery"||N.id!=="stack")){let N=Z("option","",L.name);N.value=L.id,fe.append(N)}ce.append(Z("span","field-label","Layout"),fe);let Ie=Z("div","groups"),$=Z("div","style-actions"),R=We("text-button","Copy style"),D=We("text-button","Paste style");$.append(R,D);let V=Z("div","style-transfer");V.hidden=!0;let J=Z("textarea");J.setAttribute("aria-label","Gallery style"),J.spellcheck=!1;let K=We("secondary","Apply style"),le=We("text-button","Close","Close style transfer");V.append(J,K,le),ee.append(ce,$,V,Ie);let O=Z("footer","footer"),_=Z("div","export-actions"),pe=We("primary","Save to page"),de=We("secondary","Copy code"),te=We("text-button","Download header backup");te.hidden=!0;let se=null,B=We("secondary","View code");B.setAttribute("aria-expanded","false"),B.setAttribute("aria-controls","gc-author-code"),_.append(pe,de);let be=Z("div","code-view");be.id="gc-author-code",be.hidden=!0;let we=Z("label","code-label","Page Header Code Injection"),Pe=Z("textarea");Pe.readOnly=!0,Pe.spellcheck=!1,Pe.setAttribute("aria-label","Page header code"),we.append(Pe),be.append(we);let Be=Z("div","footer-line"),U=Z("span","status");U.setAttribute("role","status");let Fe=We("text-button","Reset preview");Be.append(U,Fe);let X=Z("div","backup-actions"),Te=We("text-button","Remove layout");Te.hidden=c()==="Not saved yet",X.append(B,te,Te),O.append(_,X,be,Be),oe.append(ee,O),v.append(A,oe),W.append(z,v),document.body.append(b);function ae(L){let{definition:N,input:ne,output:re,row:ye}=L,Me=k[N.key];if(N.type==="checkbox"){ne.checked=!!Me;return}if(N.type==="range"){let ie=N.key==="spiralRise"&&k.spiralRiseUnit==="percent"?{...N,...N.percent}:N;ne.min=String(ie.min),ne.max=String(ie.max),ne.step=String(ie.step);let ve=N.inherits&&Me==null;L.enable&&(L.enable.checked=!ve,ne.disabled=!!ve),ne.value=String(ve?k[N.inherits]:Me);let me=ie.key==="stageHeight"&&ie.min===0&&Number(ne.value)===0?"Auto":`${ne.value}${ie.unit||""}`;re.textContent=ve?`Inherit \xB7 ${me}`:me,ne.setAttribute("aria-valuetext",me);return}ne.value=String(Me),N.type==="color"&&(ye.hidden=k.colorSource==="section",re.textContent=ne.value.toUpperCase())}function Ge(){T(),M+=1,U.textContent="",be.hidden||(Pe.value=o())}function Se(L,N){let ne=k.spiralRiseUnit;if(k={...k,[L]:N},L==="spiralRiseUnit"&&ne!==N){let re=Math.max(1,k.stageHeight),ye=N==="percent"?Math.max(1,Math.min(30,Math.round(k.spiralRise/re*1e3)/10)):Math.max(8,Math.min(280,Math.round(k.spiralRise*re/100)));k.spiralRise=ye,n(L,N),n("spiralRise",ye),ae(p.get("spiralRise"))}else n(L,N);L==="galleryHeight"&&je(),L==="colorSource"?p.forEach(ae):ae(p.get(L));for(let re of p.values())re.definition.inherits===L&&ae(re);Ge()}function Le(L){let{key:N,label:ne,type:re}=L,ye=Z(L.inherits?"div":"label",`field field-${re}`),Me=Z("span","field-label",ne),ie=Z(re==="select"?"select":"input");if(ie.setAttribute("aria-label",ne),ie.dataset.option=N,re==="select")for(let me of L.choices){let l=Z("option","",me.label);l.value=me.value,ie.append(l)}else ie.type=re;let ve;(re==="range"||re==="color")&&(ve=Z("output","value"),ve.setAttribute("aria-hidden","true")),ye.append(Me),ve&&ye.append(ve),ye.append(ie);let Ce={definition:L,input:ie,output:ve,row:ye};if(L.inherits){let me=Z("input");me.type="checkbox",me.setAttribute("aria-label","Customize "+ne.toLowerCase());let l=Z("label","override-toggle");l.append(me,Me),ye.prepend(l),Ce.enable=me,me.addEventListener("change",()=>Se(N,me.checked?k[L.inherits]:null))}return p.set(N,Ce),ae(Ce),ie.addEventListener(re==="range"||re==="color"?"input":"change",()=>{let me=re==="range"?Number(ie.value):re==="checkbox"?ie.checked:ie.value;Se(N,me)}),ye}function je(){let L=new Map([...h].map(([N,ne])=>[N,ne.open]));p.clear(),h.clear(),Ie.replaceChildren();for(let N of Yt(k,f.type)){let ne=Z("details","group");ne.open=L.get(N.title)??N.title==="Size & spacing";let re=Z("summary","",N.title),ye=Z("div","group-body");for(let Me of N.fields)ye.append(Le(Me));ne.append(re,ye),Ie.append(ne),h.set(N.title,ne)}}function He(L){if(y)return;let N=k.preset;f=L.source??f,L.options&&(k=qa(L.options)),E.textContent=Ar(f),E.title=f.selector||E.textContent,fe.value=k.preset,!p.size||N!==k.preset?je():p.forEach(ae),Ge()}function Oe(L){be.hidden=!L,B.textContent=L?"Hide code":"View code",B.setAttribute("aria-expanded",String(L)),L&&(Pe.value=o(),Pe.focus({preventScroll:!0}),Pe.select())}function qe(){if(y)return;y=!0,M+=1;let L=document.activeElement===b;document.removeEventListener("keydown",Ve),b.remove(),L&&g?.isConnected&&g.focus({preventScroll:!0})}function Ye(L){if(!y)try{L()}finally{qe()}}function Ve(L){L.key!=="Escape"||L.defaultPrevented||L.isComposing||document.querySelector("dialog[open]")||L.composedPath().some(N=>N?.getAttribute?.("aria-modal")==="true")||(L.preventDefault(),Ye(a))}Q.addEventListener("click",()=>{d=!d,oe.hidden=d,b.toggleAttribute("data-minimized",d),Q.textContent=d?"+":"\u2212",Q.setAttribute("aria-expanded",String(!d)),Q.setAttribute("aria-label",d?"Expand settings":"Minimize settings")}),F.addEventListener("click",()=>Ye(a)),Fe.addEventListener("click",()=>Ye(s)),fe.addEventListener("change",()=>i(fe.value)),B.addEventListener("click",()=>Oe(be.hidden));function tt(L,N){V.hidden=!1,K.hidden=L,J.readOnly=L,J.value=N,J.placeholder=L?"":"Paste the copied gallery style",J.focus(),L&&J.select()}R.addEventListener("click",async()=>{let L=m();try{await navigator.clipboard.writeText(L),y||(V.hidden=!0,U.textContent="Style copied")}catch{if(y)return;tt(!0,L),U.textContent="Style selected. Choose Copy."}}),D.addEventListener("click",()=>{U.textContent="",tt(!1,"")}),le.addEventListener("click",()=>{V.hidden=!0,D.focus()}),K.addEventListener("click",()=>{if(!w(J.value)){U.textContent="Paste a style from Copy style.",J.focus();return}V.hidden=!0,U.textContent="Style applied to this preview",D.focus()}),te.addEventListener("click",()=>{if(!se)return;let L=URL.createObjectURL(new Blob([se.header],{type:"text/plain"})),N=document.createElement("a");N.href=L,N.download="gallery-header-backup-"+se.collectionId+".txt",N.click(),setTimeout(()=>URL.revokeObjectURL(L),1e3)});async function $e(L=!1){if(!(L&&!window.confirm("Remove the saved layout from this "+f.name+" and restore its native appearance?"))&&!pe.disabled){pe.disabled=Fe.disabled=Te.disabled=!0,ee.inert=!0,pe.textContent="Saving\u2026",T(L?"Removing\u2026":"Saving\u2026"),U.textContent=L?"Removing layout\u2026":"Saving to page header\u2026";try{await r(N=>{se=N,y||(te.hidden=!1)},L),y||(U.textContent="Saved to page header")}catch(N){y||(U.textContent=N.message||"Save failed. Copy code is still available.")}finally{y||(pe.disabled=Fe.disabled=Te.disabled=!1,Te.hidden=c()==="Not saved yet",ee.inert=!1,pe.textContent="Save to page",T())}}}return pe.addEventListener("click",()=>$e()),Te.addEventListener("click",()=>$e(!0)),de.addEventListener("click",async()=>{let L=++M,N=o();try{await navigator.clipboard.writeText(N),!y&&L===M&&(U.textContent="Page code copied")}catch{if(y||L!==M)return;Oe(!0),U.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",Ve),He({source:t,options:e}),fe.focus({preventScroll:!0}),{element:b,update:He,destroy:qe}}var Cr,Fa=Y(()=>{Xt();Ia();Cr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var Ra,$a=Y(()=>{Ra=`.gc-config-position{position:relative!important}
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
`});var Da={};Zt(Da,{startInline:()=>Vt});function lt(t,e={}){let i=At.get(t),n={...ot,...t==="spiral"?Xe:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:i.width,stageHeight:Qe(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,s]of Object.entries(e))a==="mobileCardWidth"||a==="mobileGap"?Number.isFinite(s)&&s>=0&&(n[a]=s):a!=="preset"&&Object.hasOwn(n,a)&&typeof s==typeof n[a]&&(n[a]=s);return n}function Oa(t){return Yt(t).flatMap(e=>e.fields).filter(e=>!Ha.has(e.key))}function Pr(t){let e=Object.fromEntries(Oa(t).map(({key:i})=>[i,t[i]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Lr(t,e){let i;try{i=JSON.parse(t)}catch{return null}if(i?.format!=="gallery-studio-style"||i.version!==1||!At.has(i.preset)||!i.values||typeof i.values!="object"||Array.isArray(i.values))return null;let n=lt(i.preset);for(let a of Ha)n[a]=e[a];for(let a of Oa(n)){let s=i.values[a.key];if(s!==void 0){if(a.type==="range"){if(a.inherits&&s===null)continue;let r=a.percent&&i.values.spiralRiseUnit==="percent"?a.percent:a;if(!Number.isFinite(s)||s<r.min||s>r.max)return null}else{if(a.type==="checkbox"&&typeof s!="boolean")return null;if(a.type==="select"&&!a.choices.some(r=>r.value===s))return null}n[a.key]=s}}return n}function jr(t){return lt(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function Ct(t,e){let i=lt(e.preset),n={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};Qe(e.preset)&&(n.stageHeight=e.stageHeight);for(let s of Object.keys(i))e.colorSource==="section"&&Wa.has(s)||e[s]!==i[s]&&(n[s]=e[s]);let a={v:1,selector:t.selector,type:t.type,options:n};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(a,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Vt(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let i=ra(),n=new Map(i.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),a=null,s=null,r=null,c=!1,o=[];function m(d,y){return d.mounted?d.mounted.instance.update({...y,previewScroll:!1}):d.mounted=_t({selector:d.source.selector,type:d.source.type,options:y}),d.mounted&&(d.options={...y}),!!d.mounted}function w(d=!0){if(!s)return;let y=s;s=null,a?.destroy(),a=null,y.button?.setAttribute("aria-expanded","false"),d&&y.button?.focus({preventScroll:!0})}function g(d){w(),d.presets.clear(),d.installed?m(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function f(d){if(s===d){w();return}w(!1);let{source:y}=d;if(d.mounted||(y.items=st(y.root,y.type)),!y.items.length)return;let M=d.options||d.installed||lt("arc-tabs",y.type==="gallery"?{galleryWidth:"source"}:{});if(y.type==="gallery"&&M.preset==="stack"&&(M=lt("arc-tabs",{galleryWidth:"source"}),m(d,M)),!d.mounted&&!m(d,M)){d.button.textContent="No supported layout here";return}s=d;let p=h=>{m(d,h),d.presets.set(h.preset,{...h})};a=Na({source:y,options:{...d.options},onClose:()=>w(),onRestore:()=>g(d),onPreset:h=>{!At.has(h)||y.type==="gallery"&&h==="stack"||(d.presets.set(d.options.preset,{...d.options}),p({...d.presets.get(h)||lt(h),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),a.update({source:y,options:{...d.options}}))},onOption:(h,b)=>{if(!Object.hasOwn(d.options,h)||h==="preset")return;let W={...d.options,[h]:b};p(W)},getSaveState:()=>d.installed?Ct(y,d.options)===Ct(y,d.installed)?"Saved to page":"Unsaved changes":"Not saved yet",getCode:()=>Ct(y,d.options),onSave:async(h,b=!1)=>{if(c)throw Error("Another gallery is still saving. Please wait.");let W={...d.options},z=ti();c=!0;try{await ii({snippet:Ct(y,W),context:z,onBackup:h,remove:b}),b?(d.installed=null,s===d?g(d):(d.presets.clear(),d.mounted?.destroy(),d.mounted=null,d.options=null)):d.installed=W}finally{c=!1}},getStyle:()=>Pr(d.options),applyStyle:h=>{let b=Lr(h,d.options);return!b||y.type==="gallery"&&b.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),p(b),a.update({source:y,options:d.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let y=JSON.parse(d.textContent),M=document.querySelectorAll(y.selector),p=M.length===1&&n.get(M[0]);if(!p||y.v!==1||y.type!==p.source.type||!At.has(y.options?.preset))continue;p.installed=jr(y.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of n.values())d.installed&&m(d,d.installed);if(t&&n.size){let y=function(h=!1){d.setAttribute("aria-pressed",String(h)),d.querySelector("span").textContent=h?"Edit native content":"Preview galleries",d.hidden=!ct()||![...n.values()].some(b=>b.mounted)},M=function(h){if(!h.mounted||h.source.root.isConnected)return;let b=h.source.root,W=document.querySelectorAll(h.source.selector);if(W.length!==1)return;let z=W[0];h.mounted.destroy(),h.mounted=null,h.source.root=z,n.delete(b),n.set(z,h),m(h,h.options);let v=z.querySelector(h.source.type==="list"?".user-items-list":".sqs-block-content")||z;h.button&&(getComputedStyle(v).position==="static"&&v.classList.add("gc-config-position"),v.append(h.button))};r=document.createElement("style"),r.textContent=Ra,document.head.append(r);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let h=d.getAttribute("aria-pressed")!=="true";for(let b of[...n.values()])M(b),b.mounted?.instance.setEditPreview(h);y(h)},document.body.append(d),y();let p=Ut(h=>{h||requestAnimationFrame(()=>{if(d.isConnected)for(let b of[...n.values()])M(b)}),y()});o.push(()=>{p(),d.remove()});for(let h of n.values()){let{source:b}=h;if(!b.selector)continue;let W=b.root.querySelector(b.type==="list"?".user-items-list":".sqs-block-content")||b.root,z=getComputedStyle(W).position==="static";z&&W.classList.add("gc-config-position");let v=document.createElement("button");v.type="button",v.className="gc-config-launch",v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","Configure "+b.name+" layout"),v.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',b.items.length||(v.disabled=!0,v.title="Add images in Squarespace to configure this source."),v.addEventListener("click",()=>f(h)),W.append(v),h.button=v,o.push(()=>{v.remove(),z&&W.classList.remove("gc-config-position")})}}let k={version:1,destroy(){w(!1);for(let d of n.values())d.mounted?.destroy();for(let d of o)d();r?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=k,k}var At,Wa,Ha,Ba=Y(()=>{ai();Xt();Dt();Fa();$a();At=new Map(ft.map(t=>[t.id,t])),Wa=new Set(["background","ink","accent","borderColor","overlayColor"]);Ha=new Set([...Wa,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Vt,{once:!0}):Vt()});var zr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(zr=(await Promise.resolve().then(()=>(Ba(),Da))).startInline);export{zr as startInline};

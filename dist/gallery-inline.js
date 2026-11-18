var Xa=Object.defineProperty;var X=(t,e)=>()=>(t&&(e=t(t=0)),e);var Kt=(t,e)=>{for(var i in e)Xa(t,i,{get:e[i],enumerable:!0})};function Qt(t,e){if(t===void 0)return null;let i=new Map([...t.matchAll(Ya)].map(a=>[a[1].toLowerCase(),a[2]??a[3]??a[4]??""]));if(!i.has("data-gallery-layout"))return null;if(i.get("type")!=="application/json")throw Error("An existing gallery setting is not JSON. Check the page header before saving.");let n;try{n=JSON.parse(e)}catch{throw Error("An existing gallery setting contains invalid JSON. Check the page header before saving.")}if(n?.v!==1||typeof n.selector!="string"||!["list","gallery"].includes(n.type)||!n.options)throw Error("An existing gallery setting has an unsupported format. Check the page header before saving.");return n}function Va(t,e){let i=[...e.matchAll(Zt)];if(i.length!==1||i[0][0]!==e.trim())throw Error("Invalid gallery settings.");let n=Qt(i[0][1],i[0][2]);if(!n)throw Error("Missing gallery settings.");let a=!1,c=t.replace(Zt,(r,s,o)=>{let m=Qt(s,o);return!m||m.selector!==n.selector?r:a?"":(a=!0,e)});return a?c:c+(c&&!c.endsWith(`
`)?`
`:"")+e+`
`}function ei(t=window){let e=t.Static?.SQUARESPACE_CONTEXT,i=e?.collection?.id,n=e?.website?.id,a=t.document.cookie.split(";").map(c=>c.trim()).find(c=>c.startsWith("crumb="))?.slice(6);if(!mt.test(i||"")||!mt.test(n||""))throw Error("Open this page on Squarespace to save. Copy code is available for local previews.");if(!a)throw Error("Sign in to this Squarespace site, then reload the page to save.");return{collectionId:i,websiteId:n,crumb:decodeURIComponent(a)}}async function ti({snippet:t,context:e,fetchImpl:i=fetch,onBackup:n=()=>{}}){let{collectionId:a,websiteId:c,crumb:r}=e;if(!mt.test(a||"")||!mt.test(c||"")||!r)throw Error("A signed-in Squarespace page is required.");async function s(){let d=await i("/api/commondata/GetCollectionSettings?collectionId="+a,{credentials:"same-origin",cache:"no-store",redirect:"error",headers:{Accept:"application/json"},signal:AbortSignal.timeout(2e4)});if(!d.ok)throw Error("Cannot read page settings. Sign in and check your page-editing permissions.");let S=await d.json(),v=S.collectionData??S;if(v?.id!==a||v.websiteId!==c||v.deleted===!0||v.folder===!0||v.dropdown===!0)throw Error("Page settings do not match this page.");if(v.headerInjectCode!=null&&typeof v.headerInjectCode!="string")throw Error("Unexpected page header format.");return{model:v,memberAreaData:S.memberAreaData??{}}}let o=await s();if(o.model.passwordProtected&&typeof o.model.password!="string")throw Error("This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.");let m=o.model.headerInjectCode??"",k=Va(m,t);if(k===m)return{unchanged:!0};n({collectionId:a,header:m,savedAt:new Date().toISOString()});let p=await s();if(JSON.stringify(p)!==JSON.stringify(o))throw Error("Page settings changed while saving. Review the page and save again.");let g;try{g=await i("/api/commondata/SaveCollectionSettings",{method:"POST",credentials:"same-origin",redirect:"error",headers:{"Content-Type":"application/json; charset=UTF-8","X-CSRF-Token":r},body:JSON.stringify({collectionData:{...p.model,collectionId:a,headerInjectCode:k},memberAreaData:p.memberAreaData}),signal:AbortSignal.timeout(2e4)})}catch{throw Error("Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.")}if(!g.ok)throw Error("Squarespace rejected the save. Check your sign-in and page-editing permissions.");let C;try{C=await s()}catch{throw Error("Save was sent but could not be verified. Reload and check the page before trying again.")}if((C.model.headerInjectCode??"").trim()!==k.trim())throw Error("Squarespace did not return the expected header. Reload and check before trying again.");return{unchanged:!1}}var mt,Zt,Ya,ii=X(()=>{mt=/^[a-f0-9]{24}$/i,Zt=/<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi,Ya=/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g});function Et(t){return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Ja[t]}</svg>`}function De(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Et("play")+Et("pause"):Et(e),t}var Ja,bt=X(()=>{Ja={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Ie(t,e,i){let n=document.createElement(t);return n.className=e,i!==void 0&&(n.textContent=i),n}function nt(t,e,i){let n=Ie("button",t,i);return n.type="button",n.setAttribute("aria-label",e),n}function Za(t,e,i,n,a,c){let r=i/2,s=n/2,o=.26,m=e/2+48,k=(i*Math.cos(o)+c)/(2*Math.sin(o)),p=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-a)*.7),i*(3.8-a*2.1),s+Math.max(k,m/Math.sin(Math.PI/3))),g=p-s,C=Math.atan2(r,g),d=Math.hypot(r,g),S=2*(C+Math.asin(c/(2*d))),v=C+Math.asin(m/d),u=p+s,h=Math.hypot(u,r)-u,w=g-Math.sqrt((g-m)*(g+m));return{radius:p,step:S,reach:v/S,above:h,below:w}}function Qa(t,e,i){let n=e/2,a=10+i*9,c=0,r=0;for(let s=0;s<4.1;s+=.5){let o=Math.min(4.1,s+.5),m=Math.max(.48,1-s*(.09+i*.035)),k=(o*(4+i*7)+(s===0?4:0))*Math.PI/180,p=m*(n+t/2*Math.sin(k))-n;c=Math.max(c,p-Math.min(s,4)*a),r=Math.max(r,p+Math.min(o,4)*a)}return{above:c,below:r}}function ai({host:t,items:e=[],initialIndex:i=0,options:n={},makeCard:a,onChange:c,nativeList:r,loadImage:s}){let o=Ka.has(n.preset)?n.preset:"infinite",m=o==="arc"||o==="arc-tabs",k=m||o==="showcase",p=e.length,g=!!n.reducedMotion,C=Te(it(n.depth,55),0,100)/100,d,S,v;function u(l){d=Te(it(l.gap,24),0,180),S=Te(it(l.cardWidth,o==="timed"?760:380),80,1800),v=l.phoneWidthOverride}u(n);let h=Te(it(n.duration,5),1,60)*1e3,w=Ie("section",`gc-carousel gc-preset-${o}`);w.setAttribute("aria-roledescription","carousel"),w.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[o]),w.style.setProperty("--gc-card-radius",`${Te(it(n.radius,14),0,120)}px`),w.style.setProperty("--gc-stage-height",`${Te(it(n.stageHeight,0),0,1400)}px`),g&&w.classList.add("gc-reduced-motion");let R=[],I=(l,f,b,z)=>{l.addEventListener(f,b,z),R.push(()=>l.removeEventListener(f,b,z))},y=[],A=[],E=n.navigation==="dots"||n.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),M=o==="arc-tabs"||o==="timed"&&!E,P=Ie("nav","gc-carousel-tabs");E&&P.classList.add("gc-choice-dots"),P.setAttribute("aria-label","Choose a slide"),M&&(e.forEach((l,f)=>{let z=(typeof l.title=="string"?l.title.trim():"")||`Slide ${f+1}`,W=E?nt("gc-choice-dot",z):nt("gc-carousel-tab",z,z);I(W,"click",()=>je(f)),I(W,"keydown",q=>{let G;q.key==="ArrowRight"&&(G=tt(f+1,p)),q.key==="ArrowLeft"&&(G=tt(f-1,p)),q.key==="Home"&&(G=0),q.key==="End"&&(G=p-1),G!==void 0&&(q.preventDefault(),je(G),y[G]?.focus({preventScroll:!0}))}),P.append(W),y.push(W)}),w.append(P));let x=Ie("div","gc-carousel-stage");x.tabIndex=p?0:-1,x.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let T=r?.track??Ie("div","gc-carousel-track");T.classList.add("gc-carousel-track"),x.append(T),w.append(x);function L(l){let f=a(e[l],l,{caption:n.showTitles!==!1,description:o==="arc-tabs"||o==="timed"});f.classList.add("gc-carousel-card"),f.dataset.gcItemIndex=String(l),f.style.width="var(--gc-carousel-slot-width)",f.tabIndex=-1,f.setAttribute("aria-hidden","true"),r||f.querySelectorAll("img").forEach(z=>{z.draggable=!1,z.style.objectFit=n.fit==="contain"?"contain":"cover"});let b=r?.slot(f)??f;return T.append(b),{card:f,node:b,index:l,logical:l,active:!1}}let ee=e.map((l,f)=>L(f)),$=new Map,te=!1,ie=Ie("div","gc-carousel-controls"),le=Ie("div","gc-carousel-counter");le.setAttribute("aria-hidden","true");let ke=Ie("span","gc-carousel-current",p?"01":"00");le.append(ke,Ie("span","gc-carousel-divider","/"),Ie("span","gc-carousel-total",String(p).padStart(2,"0")));let Pe=Ie("div","gc-carousel-arrows"),N=De(nt("gc-carousel-arrow","Previous slide"),"previous"),F=De(nt("gc-carousel-arrow","Next slide"),"next");N.disabled=F.disabled=p<2,Pe.append(N,F);let B=De(nt("gc-carousel-playback","Play slideshow"),"playback");B.hidden=p<2||g;let V=Ie("div","gc-carousel-pagination");V.setAttribute("aria-label","Slide pagination"),o==="timed"&&e.forEach((l,f)=>{let b=nt("gc-carousel-dot",l.title?.trim()||`Go to slide ${f+1}`),z=Ie("span","gc-carousel-dot-fill");z.setAttribute("aria-hidden","true"),b.append(z),I(b,"click",()=>je(f)),V.append(b),A.push({dot:b,fill:z})}),ie.append(le,Pe),o==="timed"&&ie.append(V),ie.append(B),w.append(ie);let Q=Ie("p","gc-carousel-sr");Q.setAttribute("aria-atomic","true"),w.append(Q);let K=Ie("span","gc-carousel-cursor","Drag");K.setAttribute("aria-hidden","true"),(o==="arc-tabs"||o==="showcase"||o==="arc")&&x.append(K),t.append(w);let ae=!1,H=i,U=i,me=-1,re=0,J=0,de=0,D=!!n.autoplay&&!g&&p>1,Le=!1,se=!1,Fe=!1,Be=!1,Y=null,We=0,_=0,Ye=0,ce=0,Ge=()=>Math.max(12,ce*(.36-C*.12)+d-28),Se=-1,Me,Ce=1,He=0,Oe=0,j=()=>Be||Le||se||Fe||document.hidden||!!Y,O=l=>{let f=tt(Math.round(H),p),b=tt(l-f,p);return b>p/2&&(b-=p),Math.round(H)+b};function oe(){let l=y[me];if(!l)return;let f=l.offsetLeft,b=f+l.offsetWidth;f<P.scrollLeft?P.scrollLeft=Math.max(0,f-14):b>P.scrollLeft+P.clientWidth&&(P.scrollLeft=b-P.clientWidth+14)}function pe(){let l=p?tt(Math.round(H),p):-1;if(l===me)return;me=l,ke.textContent=p?String(l+1).padStart(2,"0"):"00",y.forEach((b,z)=>{b.classList.toggle("is-active",z===l),b.setAttribute("aria-pressed",String(z===l))}),oe(),A.forEach(({dot:b},z)=>{b.classList.toggle("is-active",z===l),z===l?b.setAttribute("aria-current","true"):b.removeAttribute("aria-current")});let f=e[l]?.title;Q.textContent=p?`${l+1} of ${p}${f?`: ${f}`:""}`:"No gallery items",l>=0&&c?.(l)}function he(){if(ae||!_)return;pe();let l=Math.abs(U-H)>.002;w.classList.toggle("is-moving",l||!!Y);let f=[...ee];for(let b of ee)b.logical=b.index+Math.round((H-b.index)/p)*p;if(p>1){let b=ce+d,z=o==="infinite"&&_>660?_*.61:_/2,W=(z+ce/2+40)/b,q=(_-z+ce/2+40)/b;m?W=q=Me.reach:o==="showcase"&&(W=q=Math.min(4.1,(_/2+ce)/Ge()));let G=Math.ceil(H-W),ge=Math.floor(H+q);for(let[ue,fe]of $)(ue<G||ue>ge||ee[fe.index].logical===ue)&&(fe.node.remove(),$.delete(ue));for(let ue=G;ue<=ge;ue++){let fe=tt(ue,p);if(ee[fe].logical===ue)continue;let xe=$.get(ue);xe||(xe=L(fe),xe.logical=ue,$.set(ue,xe),te&&s&&xe.card.querySelectorAll("img").forEach(Ae=>s(Ae,{nativeCard:!!r}))),f.push(xe)}}f.forEach(b=>{let z=p===1?0:b.logical-H,W=Math.abs(z),q=b.logical===Math.round(H),G=_/2,ge=0,ue=0,fe=1,xe=1,Ae=!0,Ue=0,Ne=0;if(o==="infinite")G=(_>660?_*.61:_/2)+z*(ce+d),xe=1-Math.min(1,W)*.68,Ae=G+ce/2>-40&&G-ce/2<_+40;else if(o==="timed")G+=z*(ce+d),fe=1-Math.min(W,1)*.035,Ae=G+ce/2>-40&&G-ce/2<_+40;else if(o==="showcase")G+=z*Ge(),ge+=Math.min(W,4)*(10+C*9),fe=Math.max(.48,1-W*(.09+C*.035)),ue=z*(4+C*7),Ne=-z*(3+C*4),xe=Te(1-W*.19,0,1),Ae=W<4.1,q&&!g&&(Ue=Oe,Ne+=He,ue+=Te(U-H,-1,1)*-3);else{let Ve=z*Me.step;G+=Me.radius*Math.sin(Ve),ge=Me.radius*(1-Math.cos(Ve)),ue=Ve*180/Math.PI,Ae=W<=Me.reach,xe=o==="arc-tabs"?1-Math.min(W,1)*.16:1}b.card.style.transform=`translate3d(${G}px,${ge}px,0) translateX(-50%) rotate(${ue}deg) rotateX(${Ue}deg) rotateY(${Ne}deg) scale(${fe})`,b.card.style.zIndex=String(1e3-Math.round(W*100)),b.card.style.opacity=String(xe),b.card.style.visibility=Ae?"visible":"hidden",b.card.style.pointerEvents=Ae&&xe>.08?"auto":"none",b.active!==q&&(b.active=q,b.card.classList.toggle("is-active",q)),b.card.tabIndex=q?0:-1,b.card.setAttribute("aria-hidden",String(!q)),r?.syncFocus(b.card)}),A.forEach(({fill:b},z)=>{b.style.transform=`scaleX(${z===me?Te(de/h,0,1):0})`})}function ye(){let l=_;_=x.clientWidth;let f=v?1:o==="timed"?.86:o==="infinite"&&_>660?.48:.76,b=Math.max(80,Math.min(S,_*f));if(b!==ce&&(ce=b,T.style.setProperty("--gc-carousel-slot-width",`${ce}px`)),k){let z=T.offsetHeight;if(_!==l||z!==Se){Se=z,m&&(Me=Za(o,_,ce,Se,C,d));let W=Me??Qa(ce,Se,C);p>1&&(x.style.setProperty("--gc-sweep-above",Math.ceil(W.above)+"px"),x.style.setProperty("--gc-sweep-below",Math.ceil(W.below)+"px"))}}Ye=x.clientHeight,Ce=m?Me.radius*Me.step:o==="showcase"?ce*.54:ce+d,he()}function ne(){!ae&&!re&&(re=requestAnimationFrame(ve))}function ve(l){if(re=0,ae)return;let f=J?Te(l-J,0,64):0;J=l,Y||(g?H=U:H+=(U-H)*(1-Math.exp(-f/85)),Math.abs(U-H)<5e-4&&(H=U));let b=Math.abs(U-H)<.002&&!Y;D&&!j()&&b&&(de+=f,de>=h&&(de=0,U=Math.round(H)+1)),he(),Math.abs(U-H)>5e-4||D&&!j()?ne():J=0}function je(l){ae||p<2||(U=O(tt(Math.round(it(l,0)),p)),de=0,g&&(H=U),he(),ne())}function be(l){p<2||(U=Math.round(U)+l,de=0,g&&(H=U),he(),ne())}function qe(l){D=!!l&&!g&&p>1,B.dataset.paused=String(!D),B.setAttribute("aria-label",D?"Pause slideshow":"Play slideshow"),B.setAttribute("aria-pressed",String(D)),Q.setAttribute("aria-live",D?"off":"polite"),w.classList.toggle("is-playing",D),J=0,ne()}function ze(l){Be=!!l,J=0,ne()}I(N,"click",()=>be(-1)),I(F,"click",()=>be(1)),I(B,"click",()=>qe(!D)),I(x,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),x.focus({preventScroll:!0}),be(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),x.focus({preventScroll:!0}),je(l.key==="Home"?0:p-1))}),I(x,"pointerdown",l=>{p<2||l.button!==0||!l.isPrimary||(Y={id:l.pointerId,x:l.clientX,y:l.clientY,start:H,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},U=H,de=0)}),I(x,"pointermove",l=>{let f=x.getBoundingClientRect(),b=f.width/Math.max(1,x.clientWidth)||1,z=(l.clientX-f.left)/b,W=(l.clientY-f.top)/b;if(K.style.left=`${z}px`,K.style.top=`${W}px`,l.pointerType==="mouse"&&x.classList.add("has-pointer"),!Y){o==="showcase"&&!g&&(He=Te((z-_/2)/ce,-1,1)*4,Oe=Te((W-Ye/2)/Ye,-.5,.5)*-5,he());return}if(l.pointerId!==Y.id)return;let q=l.clientX-Y.x,G=l.clientY-Y.y;if(!Y.axis&&Math.hypot(q,G)>6&&(Y.axis=Math.abs(q)>Math.abs(G)?"horizontal":"vertical",Y.axis==="horizontal"&&(x.setPointerCapture(l.pointerId),x.classList.add("is-dragging"))),Y.axis!=="horizontal")return;l.preventDefault(),Y.moved=!0;let ge=performance.now(),ue=Math.max(8,ge-Y.lastTime),fe=-(l.clientX-Y.lastX)/b/Ce/ue;Y.velocity=Y.velocity*.45+fe*.55,Y.lastX=l.clientX,Y.lastTime=ge,H=Y.start-q/b/Ce,U=H,he()},{passive:!1});function et(l){if(!Y||l.pointerId!==Y.id)return;let f=Y;if(Y=null,x.hasPointerCapture(l.pointerId)&&x.releasePointerCapture(l.pointerId),x.classList.remove("is-dragging"),f.moved){We=performance.now()+400;let b=performance.now()-f.lastTime,z=g||l.type==="pointercancel"||b>120?0:Te(f.velocity*210,-4,4);U=Math.round(H+z)}else U=Math.round(H);g&&(H=U),ne()}I(x,"pointerup",et),I(x,"pointercancel",et),I(window,"pointerup",et),I(x,"lostpointercapture",l=>{Y?.id===l.pointerId&&et(l)}),I(x,"dragstart",l=>l.preventDefault()),I(x,"click",l=>{if(performance.now()<We){l.preventDefault(),l.stopImmediatePropagation();return}let f=l.target.closest(".gc-carousel-card");!f||!x.contains(f)||f.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),je(Number(f.dataset.gcItemIndex)))},!0),I(x,"pointerleave",()=>{x.classList.remove("has-pointer"),He=Oe=0,Y||he()}),I(w,"pointerenter",l=>{l.pointerType==="mouse"&&(Le=!0)}),I(w,"pointerleave",()=>{Le=!1,J=0,ne()}),I(w,"focusin",()=>{se=!0}),I(w,"focusout",()=>{queueMicrotask(()=>{ae||(se=w.contains(document.activeElement),J=0,ne())})}),I(document,"visibilitychange",()=>{J=0,ne()});let $e;typeof ResizeObserver<"u"?($e=new ResizeObserver(l=>{l.some(({target:f})=>f===x||f===T)&&ye(),M&&l.some(({target:f})=>f!==x&&f!==T)&&oe()}),$e.observe(x),k&&$e.observe(T),M&&($e.observe(P),y.forEach(l=>$e.observe(l,{box:"border-box"})))):I(window,"resize",()=>{ye(),oe()});let ot;return typeof IntersectionObserver<"u"&&(ot=new IntersectionObserver(l=>{Fe=!l[0]?.isIntersecting,J=0,ne()}),ot.observe(w)),ye(),te=!0,qe(D),{goTo:je,setGeometry(l){u(l),Se=-1,ye()},setPlaying:qe,setSuspended:ze,destroy(){ae=!0,cancelAnimationFrame(re),$e?.disconnect(),ot?.disconnect(),R.forEach(l=>l()),w.remove()}}}var Ka,Te,tt,it,ri=X(()=>{bt();Ka=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Te=(t,e,i)=>Math.min(i,Math.max(e,t)),tt=(t,e)=>(t%e+e)%e,it=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function oi(t){let{host:e,makeCard:i,nativeList:n}=t,a=Array.isArray(t.items)?t.items:[],c=t.options||{},r=["wall","ring","angled"].includes(c.preset)?c.preset:"wall",s=!!c.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=a.length,m=r==="ring"?16:r==="wall"?12:o,k=!s&&o>1&&o<12&&r!=="angled"?Math.ceil(m/o)*o:o,p=Array.from({length:o},(l,f)=>f),g=_e(Je(c.depth,55),0,100),C=_e(Je(c.cardWidth,280),80,900),d=_e(Je(c.gap,24),0,160),S=Math.max(1,Je(c.duration,5)),v=new AbortController,u=(l,f,b,z={})=>l.addEventListener(f,b,{...z,signal:v.signal}),h={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},w=`gc-spatial-help-${++er}`,R=["gc-spatial",`gc-${r}`,...s?["gc-spatial-reduced"]:[]];e.classList.add(...R);let I=new Map,y=(l,f)=>{I.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,f)};y("--gc-spatial-height",`${_e(Je(c.stageHeight,620),300,1400)}px`),y("--gc-spatial-radius",`${_e(Je(c.radius,18),0,100)}px`),y("--gc-spatial-fit",c.fit==="contain"?"contain":"cover"),y("--gc-spatial-card-width",`${C}px`),y("--gc-spatial-gap",`${d}px`);let A=n?.track??document.createElement("div");A.classList.add("gc-spatial-canvas"),n&&A.classList.add("gc-spatial-native-track"),A.setAttribute("role",n?"list":"group"),A.setAttribute("aria-label",h[r]),A.setAttribute("aria-describedby",w);let E=document.createElement("p");E.id=w,E.className="gc-spatial-sr",E.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let M=document.createElement("span");M.className="gc-spatial-sr",M.setAttribute("aria-live","polite"),M.setAttribute("aria-atomic","true"),e.append(E,A,M);let P=c.showTitles!==!1&&(r!=="ring"||s||o===1),x=Array.from({length:k},(l,f)=>{let b=f%o,z=a[b],W=i(z,b,{caption:P,description:!1,thumbnail:!0}),q=n?.slot(W)??document.createElement("div");return q.classList.add("gc-spatial-position"),W.classList.add("gc-spatial-card"),W.dataset.spatialIndex=String(f),W.dataset.spatialSourceIndex=String(b),W.tabIndex=f===0?0:-1,f>=o&&W.setAttribute("aria-hidden","true"),!W.getAttribute("aria-label")&&!W.textContent.trim()&&W.setAttribute("aria-label",`View item ${b+1}`),q.contains(W)||q.append(W),q.parentNode!==A&&A.append(q),{position:q,card:W,sourceIndex:b,x:0,y:0,flip:0,tilt:0,lift:0}}),T=document.createElement("div");T.className="gc-spatial-nav";let L=(l,f)=>{let b=document.createElement("button");return b.type="button",b.className="gc-spatial-control",b.setAttribute("aria-label",f),De(b,l)},ee=L("previous","Previous item"),$=L("next","Next item"),te=document.createElement("span");te.className="gc-spatial-count",te.setAttribute("aria-hidden","true"),T.append(ee,te,$);let ie=c.autoplay&&!s?L("playback","Pause gallery motion"):null;ie&&(ie.disabled=o<2,ie.dataset.paused=String(o<2),ie.disabled&&ie.setAttribute("aria-label","Play gallery motion"),T.append(ie)),e.append(T),ee.disabled=$.disabled=o<2;let le,ke;if(r==="ring"&&o>1&&!s){le=document.createElement("div"),le.className="gc-ring-center",le.setAttribute("aria-hidden","true"),c.showTitles!==!1&&(ke=document.createElement("span"),ke.className="gc-ring-label",le.append(ke));let l=document.createElement("span");l.textContent="Drag to explore",le.append(l),A.after(le)}let Pe;o||(Pe=document.createElement(n?"li":"p"),Pe.className="gc-spatial-empty",Pe.textContent="No items available.",A.append(Pe));let N=!1,F=0,B=-1,V=1,Q=1,K=1,ae=1,H=1,U=1,me=0,re=1,J=1,de=0,D=0,Le=1,se=!!c.autoplay&&!s&&o>1,Fe=!1,Be=!1,Y=!1,We=!0,_=null,Ye=0,ce=0,Ge=0,Se=-1,Me=!1,Ce={x:-1e4,y:-1e4,inside:!1};function He(l=F){if(!ke)return;let f=typeof a[l]?.title=="string"?a[l].title.trim():"";ke.textContent===f&&ke.hidden===!f||(ke.textContent=f,ke.hidden=!f,Oe())}function Oe(){!le||N||(le.classList.remove("is-below"),le.offsetHeight>me&&le.classList.add("is-below"))}function j(l,f=!1,b=null){if(!o){te.textContent="00 / 00";return}let z=at(l,o),W=b!==null&&x[b]?.sourceIndex===z,q=W&&p[z]!==b;if(W){let G=x[p[z]].card;p[z]=b,q&&(x[b].card.removeAttribute("aria-hidden"),n?.syncFocus(x[b].card),document.activeElement===G&&(Me=!0,x[b].card.focus({preventScroll:!0}),Me=!1))}if(B===z&&!q){f&&(M.textContent=`Item ${z+1} of ${o}${a[z].title?`: ${a[z].title}`:""}`);return}F=z,He(),te.textContent=`${String(F+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`,x.forEach(({card:G,sourceIndex:ge},ue)=>{let fe=p[ge]===ue;G.tabIndex=fe&&ge===F?0:-1,G.classList.toggle("is-selected",fe&&ge===F),fe?G.removeAttribute("aria-hidden"):G.setAttribute("aria-hidden","true"),n?.syncFocus(G)}),f&&(M.textContent=`Item ${F+1} of ${o}${a[F].title?`: ${a[F].title}`:""}`),B!==F&&(B=F,t.onChange?.(F))}function O(l){se=!!l&&!s&&o>1,ie&&(ie.dataset.paused=String(!se),ie.setAttribute("aria-label",se?"Pause gallery motion":"Play gallery motion")),ze()}function oe(l){Fe=!!l,Fe||ze()}function pe(l,f,b){return f+Math.round((l-f)/b)*b}function he(l){let f={index:p[l],target:l,distance:1/0};return x.forEach((b,z)=>{if(b.sourceIndex!==l)return;let W=z;if(r==="ring")W=pe(de,z,k);else if(r==="wall"){let G=Math.floor(z/re);W=J>2?pe(de,G,J):G}let q=Math.abs(W-de);q<f.distance&&(f={index:z,target:W,distance:q})}),f}function ye(l){let f=l.getBoundingClientRect();return f.left+f.width/2}function ne(){if(o<2)return;let l=ye(x[0].position),f=ye(x[1].position)-l;if(Math.abs(f)<1)return;let b=_e(Math.round((ye(A)-l)/f),0,o-1);j(b,!1,b)}function ve(l,f=!1){if(!o)return;let b=at(Math.round(Je(l,0)),o),z=s?{index:b,target:b}:he(b);if(j(b,!0,z.index),s){let W=x[b].position;A.scrollTo({left:A.scrollLeft+ye(W)-ye(A),behavior:"auto"})}else D=z.target;f&&x[z.index].card.focus({preventScroll:!0}),ze()}function je(){if(!N){if(V=Math.max(1,A.clientWidth),Q=Math.max(1,A.clientHeight),r==="ring"){let l=Math.max(80,Math.min(V-32,Q-42)),f=_e(Je(c.ringDiameter,l),80,l);U=Math.max(0,f*.38);let b=Pt*U/Math.max(1,k),z=Math.min(f*.17,b*.8),W=1.15-_e(d,0,100)/160;if(K=o<=1?Math.min(C,V*.65,Q*.58):Math.max(18,Math.min(Math.min(C*.22,z)*W,b*.94)),ae=K*1.28,le){let q=Math.max(0,U-Math.max(32,ae)/2-10);me=Math.floor(q*Math.SQRT2),le.style.setProperty("--gc-ring-label-width",`${me}px`),le.style.setProperty("--gc-ring-label-y",`${A.offsetTop+Q/2}px`),Oe()}H=Math.max(24,Pt*Math.max(1,U)/Math.max(1,k))}else r==="wall"?(re=k>=10?3:k>=4?2:1,J=Math.max(1,Math.ceil(k/re)),ae=Math.min((Q-56-(re-1)*d)/re,C*.62,230),K=Math.max(60,Math.min(ae*1.5,C,V*.43)),ae=K/1.5,H=K+Math.min(d,70)):(K=Math.min(C,V*.68,(Q-70)*.76),ae=K/.76,H=K*(.72+(100-g)*.001)+d);x.forEach(({position:l})=>{l.style.width=`${Math.max(24,K)}px`,l.style.height=`${Math.max(32,ae)}px`}),s&&x.forEach(({position:l})=>{l.style.width=`${Math.min(C,V*.72)}px`,l.style.height=`${Math.min(Q-40,C*1.15)}px`}),ze()}}function be(l){if(s||!o||Fe)return!1;let f=se&&!Be&&!Y&&!_&&We&&!document.hidden;if(f){let q=l/S;r==="angled"?(D+=q*Le,D>=o-1&&(D=o-1,Le=-1),D<=0&&(D=0,Le=1)):D+=q}let b=_?.moved?1:1-Math.exp(-l*11);de+=(D-de)*b,Math.abs(D-de)<1e-4&&(de=D);let z=Math.abs(D-de)>1e-4||f;if(f||_?.moved){let q=_?.moved?de:D,G=r==="wall"?Math.round(q)*re+p[F]%re:Math.round(q),ge=r==="wall"?Math.min(at(G,J*re),k-1):at(G,k);j(x[ge].sourceIndex,!1,ge)}let W=1-Math.exp(-l*13);return x.forEach((q,G)=>{let{position:ge,card:ue}=q;if(r==="ring"){let fe=-Math.PI/2+(G-de)*Pt/k;q.x=o===1?0:Math.cos(fe)*U,q.y=o===1?0:Math.sin(fe)*U;let xe=Math.hypot(Ce.x-(V/2+q.x),Ce.y-(Q/2+q.y)),Ae=Math.max(65,K*2.6),Ue=Ce.inside&&!_?.moved?Math.max(0,1-xe/Ae):0,Ne=Ue*Ue*(50+g*1.3);q.flip+=(Ne-q.flip)*W,Math.abs(q.flip-Ne)>.05&&(z=!0);let Ve=o===1?0:fe*180/Math.PI+90;ge.style.transform=`translate3d(${q.x}px,${q.y}px,0) rotate(${Ve}deg)`,ue.style.transform=`perspective(700px) rotateY(${q.flip}deg) translateZ(${Ue*12}px)`,ge.style.zIndex=String(G===Se?k+2:1)}else if(r==="wall"){let fe=G%re,Ae=Math.floor(G/re)-de;if(J>2){let _a=J%2===0?.5:0;Ae=at(Ae-_a+J/2,J)-J/2}let Ue=Math.min(.68,2.6/Math.max(3,J)),Ne=Ae*Ue,Ve=Math.max(H/Ue,V*.4),Vt=g/100,Ga=Math.sin(Ne)*Ve,Jt=(1-Math.cos(Ne))*Ve*Vt*.65,Ua=(fe-(re-1)/2)*(ae+Math.min(d,50)),At=G===Se||Y&&G===p[F]?1:0;q.lift+=(At-q.lift)*W,Math.abs(At-q.lift)>.002&&(z=!0),ge.style.transform=`translate3d(${Ga}px,${Ua}px,${Jt+q.lift*20}px) rotateY(${-Ne*180/Math.PI*Vt}deg)`,ge.style.zIndex=String(Math.round(Jt)+(At?1e3:1)),ue.style.transform=`scale(${1+q.lift*.035})`,ge.style.opacity=Math.abs(Ne)>1.6?"0":"1",ge.style.visibility=Math.abs(Ne)>1.6?"hidden":"visible"}else{let fe=G-de,xe=G===Se||Y&&G===p[F]?1:0;q.lift+=(xe-q.lift)*W,Math.abs(xe-q.lift)>.002&&(z=!0);let Ae=-(25+g*.28)*(1-q.lift);ge.style.transform=`translate3d(${fe*H}px,${-q.lift*14}px,${q.lift*110}px) rotateY(${Ae}deg)`,ge.style.zIndex=String(xe?o+2:o-G),ue.style.transform="none"}}),z}function qe(l){if(ce=0,N)return;let f=Math.min(.05,Math.max(.001,(l-(Ge||l-16.7))/1e3));Ge=l,be(f)&&We&&!document.hidden?ce=requestAnimationFrame(qe):Ge=0}function ze(){!N&&!ce&&!s&&(ce=requestAnimationFrame(qe))}s&&u(A,"scroll",ne,{passive:!0}),u(ee,"click",()=>ve(F-1)),u($,"click",()=>ve(F+1)),ie&&u(ie,"click",()=>O(!se)),u(A,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let f=l.key==="Home"?0:l.key==="End"?o-1:F+(l.key==="ArrowRight"?1:-1);ve(f,!0)}),u(A,"focusin",l=>{Y=!0;let f=l.target.closest?.("[data-spatial-index]");f&&!Me&&j(Number(f.dataset.spatialSourceIndex),!1,Number(f.dataset.spatialIndex)),ze()}),u(A,"focusout",()=>{queueMicrotask(()=>{N||(Y=A.contains(document.activeElement),ze())})}),u(A,"pointerenter",l=>{l.pointerType!=="touch"&&(Be=!0,Ce.inside=!0,ze())}),u(A,"pointerleave",()=>{Be=!1,Ce.inside=!1,Se=-1,He(),ze()}),u(A,"pointermove",l=>{if(l.pointerType==="touch")return;let f=A.getBoundingClientRect();Ce.x=l.clientX-f.left,Ce.y=l.clientY-f.top,Ce.inside=!0;let b=l.target.closest?.("[data-spatial-index]");Se=b?Number(b.dataset.spatialIndex):-1,He(Se>=0?x[Se].sourceIndex:F),ze()}),u(A,"pointerdown",l=>{let f=l.target.closest?.("[data-spatial-index]");f&&j(Number(f.dataset.spatialSourceIndex),!1,Number(f.dataset.spatialIndex)),!(s||o<2||l.pointerType==="mouse"&&l.button!==0)&&(_={id:l.pointerId,x:l.clientX,y:l.clientY,start:D,moved:!1})}),u(window,"pointermove",l=>{if(!_||l.pointerId!==_.id)return;let f=l.clientX-_.x,b=l.clientY-_.y;if(!_.moved){if(Math.abs(b)>12&&Math.abs(b)>Math.abs(f)*1.2){_=null;return}if(Math.abs(f)<7)return;_.moved=!0,A.classList.add("is-dragging"),A.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),D=_.start-f/H,(r==="angled"||r==="wall"&&J<=2)&&(D=_e(D,0,r==="wall"?J-1:o-1)),ze()},{passive:!1});let et=l=>{if(!_||l.pointerId!==_.id)return;let f=_.moved;if(_=null,A.classList.remove("is-dragging"),A.hasPointerCapture?.(l.pointerId)&&A.releasePointerCapture(l.pointerId),f){Ye=performance.now()+350,D=Math.round(D);let b=r==="wall"?Math.round(D)*re+p[F]%re:Math.round(D),z=r==="wall"?Math.min(at(b,J*re),k-1):at(b,k);j(x[z].sourceIndex,!0,z)}ze()};u(window,"pointerup",et),u(window,"pointercancel",et),u(A,"click",l=>{performance.now()<Ye&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),u(A,"dragstart",l=>l.preventDefault()),u(document,"visibilitychange",ze);let $e=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(f=>f.target===A)?je():Oe()}):null;$e?.observe(A),le&&$e?.observe(le),$e||u(window,"resize",je);let ot=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{We=l[0]?.isIntersecting??!0,We&&ze()},{rootMargin:"100px"}):null;return ot?.observe(e),je(),j(0),{goTo:ve,setPlaying:O,setSuspended:oe,destroy(){N||(N=!0,cancelAnimationFrame(ce),$e?.disconnect(),ot?.disconnect(),v.abort(),E.remove(),M.remove(),T.remove(),le?.remove(),n?Pe?.remove():A.remove(),e.classList.remove(...R),I.forEach((l,f)=>l?e.style.setProperty(f,l):e.style.removeProperty(f)))}}}var er,_e,at,Je,Pt,ni=X(()=>{bt();er=0,_e=(t,e,i)=>Math.max(e,Math.min(i,t)),at=(t,e)=>(t%e+e)%e,Je=(t,e)=>Number.isFinite(Number(t))?Number(t):e,Pt=Math.PI*2});function si({host:t,items:e,options:i,makeCard:n,onChange:a,nativeList:c}){let r=Number(i.stageHeight)||680,s=Math.max(300,r-120),o=Math.max(0,Number(i.gap)||0),m=Number.isFinite(Number(i.depth))?Number(i.depth):45,k=i.previewScroll===!1,p=k?window:t;t.classList.add("gc-stack"),t.style.height=k?"auto":r+"px",t.style.overflowY=k?"visible":"auto",t.style.overscrollBehavior=k?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let g=c?.track??document.createElement("div");g.classList.add("gc-stack-track"),t.append(g);let C=e.map((R,I)=>{let y=n(R,I,{caption:i.showTitles,description:!0}),A=c?.slot(y)??document.createElement("div");A.classList.add("gc-stack-slot"),y.parentElement!==A&&A.append(y),g.append(A),A.style.zIndex=I+1,y.style.width=`min(${i.stackCardWidth}px,calc(100% - 48px))`,y.style.minHeight=s+"px";let E=y.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),M=!Array.from(E).some(P=>!P.closest("[hidden]")&&P.textContent.trim());return y.classList.toggle("gc-stack-image-only",M),{card:y,wrap:A,imageOnly:M,start:0,duration:1/0}}),d=0;function S(){return k?-g.getBoundingClientRect().top:t.scrollTop}function v(){d=0;let R=S(),I=0;C.forEach(({card:y,start:A,duration:E},M)=>{let P=Math.max(0,Math.min(1,(R-A)/E));y.style.transform=i.reducedMotion?"none":`perspective(1300px) translateY(${P*-32}px) scale(${1-P*.14}) rotateX(${P*m*.25}deg)`,y.style.filter=`brightness(${1-P*.23})`,P>=.5&&(I=Math.min(M+1,C.length-1))}),C.length&&a?.(I)}function u(){d||(d=requestAnimationFrame(v))}function h(){let R=C.map(({card:A,wrap:E})=>({height:A.offsetHeight,rowHeight:E.offsetHeight})),I=k?window.innerHeight:t.clientHeight,y=g.clientTop+(parseFloat(getComputedStyle(g).paddingTop)||0);C.forEach((A,E)=>{let{height:M,rowHeight:P}=R[E],x=Math.min(40,I-24-M);A.wrap.style.top=x+"px",A.start=y-x,E&&(C[E-1].duration=Math.max(1,A.start-C[E-1].start));let T=A.imageOnly&&M<=I-64?M*.24:0,L=E<C.length-1?o-T:0;A.wrap.style.marginBottom=L+"px",y+=P+L,E===C.length-1&&(A.duration=1/0,g.style.paddingBottom=Math.max(40,I-x-P)+"px")}),u()}let w;return h(),typeof ResizeObserver<"u"&&(w=new ResizeObserver(h),w.observe(g,{box:"border-box"}),C.forEach(({card:R})=>w.observe(R,{box:"border-box"}))),window.addEventListener("resize",h),p.addEventListener("scroll",u,{passive:!0}),{goTo(R){let I=C[Math.max(0,Math.min(C.length-1,Math.round(R)))];if(!I)return;let y=k?window.scrollY+I.start-S():I.start;p.scrollTo({top:y,behavior:i.reducedMotion?"instant":"smooth"})},destroy(){w?.disconnect(),window.removeEventListener("resize",h),cancelAnimationFrame(d),p.removeEventListener("scroll",u),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",g.remove()}}}var ci=X(()=>{});var li,yt,di=X(()=>{li='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',yt=class{constructor(e,i,n){this.root=e,this.cards=i,this.projects=n,this.assetDirectory=new URL(".",i[0].querySelector("img").src),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${li}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${li}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",r=>{if(r.target!==this.dialog)return;let s=this.dialog.getBoundingClientRect();(r.clientX<s.left||r.clientX>s.right||r.clientY<s.top||r.clientY>s.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",r=>{(r.key==="ArrowLeft"||r.key==="ArrowRight")&&(r.preventDefault(),this.showFrame(this.frame+(r.key==="ArrowRight"?1:-1)))});let c=this.dialog.querySelector(".project-image-stage");c.addEventListener("pointerdown",r=>{!r.isPrimary||r.target.closest("button")||(this.galleryPointer={id:r.pointerId,x:r.clientX,y:r.clientY},c.setPointerCapture(r.pointerId))}),c.addEventListener("pointerup",r=>{let s=this.galleryPointer;if(this.galleryPointer=null,!s||s.id!==r.pointerId)return;c.hasPointerCapture(r.pointerId)&&c.releasePointerCapture(r.pointerId);let o=r.clientX-s.x,m=r.clientY-s.y;Math.abs(o)>35&&Math.abs(o)>Math.abs(m)*1.2&&this.showFrame(this.frame+(o<0?1:-1))}),c.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let i=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!i,this.dialog.querySelector("[data-gallery-next]").hidden=!i,this.thumbnails.hidden=!i,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(a=>{let c=document.createElement("li");return c.textContent=a,c})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((a,c)=>{let r=document.createElement("button");r.type="button",r.className="project-thumbnail",r.setAttribute("aria-label",`Show ${a.label.toLowerCase()}`);let s=document.createElement("img");return s.src=new URL(a.file,this.assetDirectory).href,s.alt="",s.width=1600,s.height=900,r.append(s),r.addEventListener("click",()=>this.showFrame(c)),r})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let i=this.project.gallery[this.frame];this.image.src=new URL(i.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${i.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${i.label}`,[...this.thumbnails.children].forEach((n,a)=>n.setAttribute("aria-current",String(a===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Xe,dt,xt=X(()=>{Xe=Object.freeze({containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),dt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function pi(t,e,{pauseOnHover:i=!0,interactionRestMs:n=6e3}={}){let a=t.querySelector("[data-orbit-toggle]"),c=new AbortController,r=(u,h,w)=>u.addEventListener(h,w,{signal:c.signal}),s={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let o=0,m=!1,k=u=>!!u&&t.contains(u)&&(u.matches(":focus-visible")||!!u.closest(".orbit-card")),p=()=>!m&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,g=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(o),e.autoFrame=0,o=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},C=u=>{if(e.autoFrame=0,!p()){g();return}let h=Math.min(.05,Math.max(0,(u-e.autoTime)/1e3));e.autoTime=u,e.position=(e.position+h/8)%e.count,e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(C)},d=()=>{if(!p()){g();return}let u=e.resumeAt-performance.now();if(u>0){g(),o=setTimeout(d,u);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(C))},S=(u=6e3)=>{g(),e.resumeAt=performance.now()+u};e.animateTo=function(...u){S(n),s.animateTo.apply(this,u),d()},e.settleImmediately=function(...u){s.settleImmediately.apply(this,u),d()},e.openProject=function(...u){S(),s.openProject.apply(this,u),d()},i&&(r(t,"pointerenter",u=>{u.pointerType!=="touch"&&(e.hovered=!0,d())}),r(t,"pointerleave",u=>{u.pointerType!=="touch"&&(e.hovered=!1,d())})),r(t,"focusin",u=>{e.keyboardFocused=k(u.target),d()}),r(t,"focusout",u=>{e.keyboardFocused=k(u.relatedTarget),d()}),r(t,"pointerup",()=>{S(n),d()}),r(t,"pointercancel",()=>{S(n),d()}),r(e.viewer.dialog,"close",()=>{S(),d()}),r(document,"visibilitychange",d),r(e.reducedMotion,"change",d),r(a,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,a.dataset.paused=String(e.manuallyPaused),a.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),d()});let v=new IntersectionObserver(u=>{e.inView=u.some(h=>h.isIntersecting&&h.intersectionRatio>=.15),d()},{threshold:.15});return v.observe(e.stage),e.stopAutoplay=g,e.syncAutoplay=d,()=>{m=!0,g(),c.abort(),v.disconnect(),Object.assign(e,s)}}var gi=X(()=>{});var Ee,Lt,ui,hi,fi,mi,bi,yi,xi,vi,wi,ki,Si,jt,Mi,pt,Ci,zt=X(async()=>{Ee=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),Lt=Ee.BufferGeometry,ui=Ee.Float32BufferAttribute,hi=Ee.LineBasicMaterial,fi=Ee.LineLoop,mi=Ee.DoubleSide,bi=Ee.Mesh,yi=Ee.NoToneMapping,xi=Ee.PerspectiveCamera,vi=Ee.PlaneGeometry,wi=Ee.Raycaster,ki=Ee.Scene,Si=Ee.ShaderMaterial,jt=Ee.SRGBColorSpace,Mi=Ee.TextureLoader,pt=Ee.Vector2,Ci=Ee.WebGLRenderer});var tr,vt,Ai=X(async()=>{tr=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),vt=tr.default});var ir,It,Ei=X(async()=>{ir=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),It=ir.CustomEase});function Pi(t,e,i=64){let n=t/e,a=new vi(t,t*9/16,i,1),c=a.attributes.position,r=a.attributes.uv;for(let s=0;s<c.count;s++){let o=(r.getX(s)-.5)*e;c.setX(s,n*Math.sin(o)),c.setZ(s,n*(Math.cos(o)-1))}return a.computeVertexNormals(),a.computeBoundingSphere(),a}function Li(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var Tt=X(async()=>{await zt()});function gt(t,e){let i=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*i,panelArc:t.radiansPerSlide*i,height:t.slotHeight*i}}function wt(t,{radius:e,pitch:i,radiansPerSlide:n}){let a=t*n;return{x:Math.sin(a)*e,y:-t*i,z:(Math.cos(a)-1)*e,angle:a,taper:1,shade:(1-Math.cos(a))/2*.58}}function ji(t,e){let i=gt(t,e);return Pi(i.cardWidth,i.panelArc)}function qt(t,e=64){let i=[];for(let n=0;n<=e;n++){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),t.slotHeight/2,t.radius*(Math.cos(a)-1))}for(let n=e;n>=0;n--){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),-t.slotHeight/2,t.radius*(Math.cos(a)-1))}return i}var kt=X(async()=>{await Tt()});function Nt(t,e){let i=ji(t,e);return i.scale(1,1/t.aspect/(9/16),1),i.computeVertexNormals(),i.computeBoundingSphere(),i}function zi(t,e,i,n,a){let c=Math.min(t,e)*Math.min(40,Math.max(0,a))/100,r=t-2*c,s=e-2*c,o=r/s,m=n==="fit"?Math.max:Math.min,k=m(1,o/i),p=m(1,i/o);return{contentWidth:r,contentHeight:s,uvScaleX:k,uvScaleY:p,imageWidth:r/k,imageHeight:s/p,padding:c}}var Ii=X(async()=>{await kt();await kt()});function Ft({stageWidth:t,stageHeight:e,spiralWidthPercent:i,cardWidth:n,aspect:a,rise:c,riseUnit:r}){let s=Math.max(1,t*i/200),o=Math.max(1,Math.min(n,s*Math.PI/3,e*.4*a)),m=Math.PI*2*s/o,k=r==="percent"?e*c/100:c*Math.min(1,t/640);return{radius:s,slotWidth:o,slotHeight:o/a,aspect:a,pitch:Math.max(o/a*1.25/m,k),radiansPerSlide:o/s,cardsPerTurn:Math.PI*2*s/o}}var Ti=X(()=>{});function Ni(t,e,i){let n=e.radius*2.4,a=n/(n+2*e.radius),c=Math.ceil((i/(2*a)+e.slotHeight/2)/e.pitch)+2,r=Math.floor(t);return{first:r-c,last:r+c,count:c*2+1}}function Fi(t,e,i){let n=t*e.radiansPerSlide,a=n-i.panelArc/2,c=n+i.panelArc/2,r=Math.PI*2,s=v=>Math.ceil((a-v)/r)<=Math.floor((c-v)/r),o=s(0)?1:Math.max(Math.cos(a),Math.cos(c)),m=s(Math.PI)?-1:Math.min(Math.cos(a),Math.cos(c)),k=e.radius*2.4,p=k/(k+e.radius*(1-o)),g=k/(k+e.radius*(1-m)),C=-t*e.pitch,d=C+i.height/2,S=C-i.height/2;return{minY:Math.min(S*p,S*g),maxY:Math.max(d*p,d*g)}}function $i(t,e){let i=Math.min(80,e*.08),n=c=>Math.max(0,Math.min(1,c)),a=Math.min(n((e/2-t.minY)/i),n((t.maxY+e/2)/i));return a*a*(3-2*a)}function Ri(t,e,i,n){let a=i-e;return Math.abs(a)>n/2&&(a-=Math.round(a/n)*n),t+a}var qi,Wi=X(async()=>{await kt();Ti();qi=(t,e)=>(t%e+e)%e});var Oi,Hi=X(()=>{Oi=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function Di(t,{textureSource:e=i=>i.querySelector("img").src}={}){let{root:i,stage:n}=t,a;try{a=new Ci({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return i.dataset.renderer="css-fallback",()=>{delete i.dataset.renderer}}a.outputColorSpace=jt,a.toneMapping=yi,a.setClearColor(0,0);let c=a.domElement;c.style.removeProperty("display"),c.className="orbit-webgl",c.setAttribute("aria-hidden","true"),n.append(c);let r=new ki,s=new xi,o=new wi,m=new pt,k=new AbortController,p=(N,F,B)=>N.addEventListener(F,B,{signal:k.signal}),g=t.render,C=t.pointerDown,d=new Map,S=[],v,u,h=t.position,w=t.position,R="",I=!1,y=!1,A=null,E=null,M=!1,P=!1;i.dataset.renderer="loading-webgl";let x=()=>Ft({stageWidth:n.clientWidth,stageHeight:n.clientHeight,spiralWidthPercent:Number(i.dataset.spiralWidth),cardWidth:Number(i.dataset.cardWidth),aspect:Number(i.dataset.cardAspect),rise:Number(i.dataset.rise),riseUnit:i.dataset.riseUnit}),T=()=>{let N=t.cards[0],F=new Si({uniforms:{screenshot:{value:d.get(e(N))},dimensions:{value:new pt},contentDimensions:{value:new pt(1,1)},imageScale:{value:new pt(1,1)},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:rr,fragmentShader:or,transparent:!0,side:mi,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),B=new bi(v,F),V=new fi(u,new hi({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),Q={card:N,mesh:B,guide:V,material:F,surface:{scale:1,target:1}};B.userData.panel=Q,S.push(Q),r.add(B,V)},L=N=>{let F=Ni(h,N,n.clientHeight);for(;S.length<F.count;)T();for(;S.length>F.count;){let B=S.pop();r.remove(B.mesh,B.guide),B.material.dispose(),B.guide.material.dispose()}S.forEach((B,V)=>{B.offset=F.first+V-h,B.card=t.cards[qi(F.first+V,t.count)],B.material.uniforms.screenshot.value=d.get(e(B.card))})},ee=()=>{let N=n.clientWidth,F=n.clientHeight,B=x(),V=Number(i.dataset.slotGap||3);L(B);let Q=gt(B,V),{cardWidth:K,panelArc:ae}=Q,{radius:H}=B;i.dataset.slotMetrics=JSON.stringify({...B,cardArc:ae,cardWidth:K,cardHeight:Q.height,gap:V,imageFit:i.dataset.imageFit,imagePadding:Number(i.dataset.imagePadding||0)}),S.forEach(D=>{D.material.uniforms.dimensions.value.set(K,Q.height);let Le=D.material.uniforms.screenshot.value.image,se=zi(K,Q.height,(Le.naturalWidth||Le.width)/(Le.naturalHeight||Le.height),i.dataset.imageFit,Number(i.dataset.imagePadding||0));D.material.uniforms.contentDimensions.value.set(se.contentWidth,se.contentHeight),D.material.uniforms.imageScale.value.set(se.uvScaleX,se.uvScaleY)});let U=Math.min(window.devicePixelRatio||1,2),me=`${N}:${F}:${K}:${ae}:${Q.height}:${H}:${U}`;if(me===R||!N||!F)return;R=me,a.setPixelRatio(U),a.setSize(N,F,!1),s.position.set(0,0,H*2.4),s.fov=Li(F,s.position.z),s.aspect=N/F,s.near=.1,s.far=H*12,s.updateProjectionMatrix(),s.updateMatrixWorld();let re=v;v=Nt(B,V);let J=u;u=new Lt,u.setAttribute("position",new ui(qt(B),3));let de=0;S.forEach(D=>{D.mesh.geometry=v,D.guide.geometry=u,D.material.uniforms.dimensions.value.set(K,Q.height),D.material.uniforms.cornerRadius.value=de}),re?.dispose(),J?.dispose()},$=()=>{if(!I||y||M||P||!t.geometry)return;P=!0,h=Ri(h,w,t.position,t.count),w=t.position,ee();let N=x(),F=gt(N,Number(i.dataset.slotGap||3)),B=i.dataset.focusMode==="keyboard"&&i.contains(document.activeElement),V=0;S.forEach(K=>{let{card:ae,mesh:H,material:U}=K,me=wt(K.offset,N),re=Fi(K.offset,N,F),J=$i(re,n.clientHeight),de=B&&ae===t.cards[t.active]&&Math.abs(K.offset)<.5;U.polygonOffsetUnits=Math.abs(K.offset)*8,H.position.set(me.x,me.y,me.z),H.rotation.y=me.angle,H.visible=J>.001,H.visible&&V++,K.guide.position.copy(H.position),K.guide.rotation.copy(H.rotation),K.guide.visible=i.dataset.showSlots==="true"&&H.visible,K.guide.material.opacity=J*.42,U.uniforms.fade.value=J,U.uniforms.shade.value=me.shade,U.uniforms.focused.value=de?1:0});let Q=JSON.stringify({cardsPerTurn:N.cardsPerTurn,visibleCount:V,poolCount:S.length,stageWidth:n.clientWidth,stageHeight:n.clientHeight,cardWidth:F.cardWidth,cardHeight:F.height,pitch:N.pitch,radius:N.radius,uniqueCount:t.count});i.dataset.responsiveMetrics!==Q&&(i.dataset.responsiveMetrics=Q),E&&!t.pointer&&(A=te(E)),r.updateMatrixWorld(!0),a.render(r,s),P=!1},te=N=>{if(!I||M)return null;let F=c.getBoundingClientRect();m.set((N.clientX-F.left)/F.width*2-1,-(N.clientY-F.top)/F.height*2+1),o.setFromCamera(m,s);for(let B of o.intersectObjects(S.map(V=>V.mesh))){let V=B.object.userData.panel;if(!B.object.visible||V.material.uniforms.fade.value<=.25)continue;let{x:Q,y:K}=V.material.uniforms.dimensions.value,ae=V.material.uniforms.cornerRadius.value,H=Math.abs((B.uv.x-.5)*Q)-Q/2+ae,U=Math.abs((B.uv.y-.5)*K)-K/2+ae;if(!(Math.hypot(Math.max(H,0),Math.max(U,0))+Math.min(Math.max(H,U),0)>ae))return V}return null};t.render=function(){g.call(this),$()},t.pointerDown=function(N){C.call(this,N),I&&!M&&this.pointer?.id===N.pointerId&&(this.pointer.card=te(N)?.card||null),E=null,A=null},p(n,"pointermove",N=>{E=N.pointerType==="mouse"?{clientX:N.clientX,clientY:N.clientY}:null,A=N.pointerType==="mouse"&&!t.pointer?te(N):null,c.style.cursor=t.pointer?.dragging?"grabbing":A?"pointer":"grab",$()}),p(n,"pointerleave",()=>{E=null,A=null,$()}),p(n,"pointerup",()=>{A=null,$()}),p(i,"focusin",$),p(i,"focusout",()=>queueMicrotask($)),p(document,"keydown",()=>queueMicrotask($)),p(document,"pointerdown",()=>queueMicrotask($)),p(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&S.forEach(({surface:N})=>{vt.killTweensOf(N),N.scale=N.target}),$()}),p(i,"playground-change",$),p(i,"slot-guides-change",$),p(c,"webglcontextlost",N=>{N.preventDefault(),M=!0,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback"}),p(c,"webglcontextrestored",()=>{M=!1,I&&(i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",$())});let ie=new ResizeObserver(()=>$());ie.observe(n);let le=new Mi,ke=t.cards.map(N=>new Promise((F,B)=>{let V=e(N),Q=le.load(V,F,void 0,B);Q.colorSpace=jt,Q.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),d.set(V,Q)})),Pe=()=>{y||(v=Nt(x(),Number(i.dataset.slotGap||3)),u=new Lt,I=!0,$(),i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl")};return Promise.all(ke).then(Pe).catch(()=>{y||(i.dataset.renderer="css-fallback")}),()=>{y=!0,k.abort(),ie.disconnect(),t.render=g,t.pointerDown=C,i.classList.remove("has-webgl-carousel"),delete i.dataset.renderer,S.forEach(({material:N,surface:F,guide:B})=>{vt.killTweensOf(F),N.dispose(),B.material.dispose()}),v?.dispose(),u?.dispose(),d.forEach(N=>N.dispose()),a.dispose(),a.forceContextLoss(),c.remove()}}var uo,rr,or,Bi=X(async()=>{await zt();await Ai();await Ei();await Tt();await Ii();await Wi();vt.registerPlugin(It);uo=It.create("portfolio-surface",".2,.75,.25,1"),rr=`
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
`});var Gi=X(()=>{(()=>{"use strict";let t=Math.PI*2,e=(c,r)=>(c%r+r)%r,i=(c,r,s)=>Math.min(s,Math.max(r,c));class n{constructor(r){this.root=r,this.stage=r.querySelector(".orbit-stage"),this.cards=[...r.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((s,o)=>{s.dataset.slideIndex=o;let m=s.cloneNode(!0);m.dataset.repeat="true",m.tabIndex=-1,m.setAttribute("aria-hidden","true"),m.removeAttribute("aria-pressed"),s.parentElement.append(m),this.visualCards.push(m)}),!(!this.count||!this.stage)&&(this.title=r.querySelector(".orbit-title"),this.description=r.querySelector(".orbit-description"),this.status=r.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(r,this.cards),this.pagination=r.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((r,s)=>{let o=document.createElement("button");return o.type="button",o.className="orbit-dot",o.setAttribute("aria-label",`Show ${r.dataset.title||`screenshot ${s+1}`}`),o.addEventListener("click",()=>this.goTo(s),this.options),this.pagination?.append(o),o}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(r=>{r.disabled=!0})}bindEvents(){let r=(s,o,m,k={})=>s.addEventListener(o,m,{...this.options,...k});r(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),r(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),r(this.stage,"keydown",s=>{let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};s.key in o?(s.preventDefault(),this.step(o[s.key])):(s.key==="Home"||s.key==="End")&&(s.preventDefault(),this.goTo(s.key==="Home"?0:this.count-1))}),r(this.stage,"pointerdown",s=>this.pointerDown(s)),r(this.stage,"pointermove",s=>this.pointerMove(s),{passive:!1}),r(this.stage,"pointerup",s=>this.pointerUp(s)),r(this.stage,"pointercancel",s=>this.pointerUp(s,!0)),r(this.stage,"lostpointercapture",s=>this.pointerUp(s,!0)),r(this.stage,"dragstart",s=>s.preventDefault()),r(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),r(this.stage,"click",s=>{if(s.detail!==0&&performance.now()<this.ignoreClickUntil){s.preventDefault(),s.stopPropagation();return}let o=s.target.closest(".orbit-card");o&&this.openProject(Number(o.dataset.slideIndex))}),r(this.stage,"focusin",s=>{let o=this.cards.indexOf(s.target.closest(".orbit-card"));!this.pointer&&o>=0&&o!==this.active&&this.goTo(o)}),r(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),r(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(r=>{let s=r.querySelector(".orbit-surface"),o=s.querySelector("img"),m=Array.from({length:this.segmentCount},(k,p)=>{let g=document.createElement("span");return g.className="orbit-strip",g.setAttribute("aria-hidden","true"),g.dataset.stripIndex=p,g.style.backgroundImage=`url("${o.src}")`,s.append(g),g});return r.classList.add("is-curved"),{card:r,strips:m}})}measure(){let r=this.stage.clientWidth,s=this.stage.clientHeight,o=r<=700;this.cards[0].style.removeProperty("width");let m=this.cards[0].offsetWidth,k=t/8,p=k*.88,g=m/p;this.geometry={radius:g,panelArc:p,cardWidth:m,pitch:i(s/13,36,52),halfWindow:6.5,radiansPerSlide:k,dragUnitX:Math.max(85,r*(o?.32:.18)),dragUnitY:i(s*.13,65,105)},this.stage.style.perspective=`${(g*2.4).toFixed(3)}px`;let C=p/this.segmentCount,d=2*g*Math.sin(C/2),S=m*9/16;this.panels.forEach(({card:v,strips:u})=>{v.style.width=`${m}px`,u.forEach((h,w)=>{let R=-p/2+(w+.5)*C,I=g*Math.sin(R),y=g*(Math.cos(R)-1);h.style.width=`${(d+.6).toFixed(4)}px`,h.style.backgroundSize=`${m}px ${S}px`,h.style.backgroundPosition=`${(-w*m/this.segmentCount).toFixed(4)}px 0px`,h.style.transform=`translateX(-50%) translate3d(${I.toFixed(4)}px, 0px, ${y.toFixed(4)}px) rotateY(${(R*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:r,pitch:s,halfWindow:o,radiansPerSlide:m}=this.geometry;this.visualCards.forEach(p=>{let g=Number(p.dataset.slideIndex),C=e(g-this.position+this.count/2,this.count)-this.count/2;p.dataset.repeat&&(C+=C<0?this.count:-this.count);let d=C*m,S=Math.cos(d),v=Math.sin(d),u=(1-S)/2,h=1-C/o*.11,w=v*r*h,R=C*s,I=S*r*h-r,y=d*180/Math.PI,A=i((o-Math.abs(C))/.65,0,1);p.style.transform=`translate(-50%, -50%) translate3d(${w.toFixed(3)}px, ${R.toFixed(3)}px, ${I.toFixed(3)}px) rotateY(${y.toFixed(3)}deg) scale(${h.toFixed(4)})`,p.style.zIndex="auto",p.style.setProperty("--orbit-shade",String(u*.58)),p.style.setProperty("--orbit-fade",String(A)),p.style.opacity="1",p.style.visibility=A>0?"visible":"hidden",p.style.pointerEvents=A>.25?"auto":"none",p.dataset.offset=C.toFixed(5)});let k=e(Math.round(this.position),this.count);k!==this.active&&this.updateActive(k)}updateActive(r){let s=this.visualCards.includes(document.activeElement);this.active=r,this.cards.forEach((o,m)=>{let k=m===r;o.classList.toggle("is-centered",k),o.tabIndex=k?0:-1,o.setAttribute("aria-pressed",String(k)),this.dots[m].setAttribute("aria-current",String(k))}),this.title&&(this.title.textContent=this.cards[r].dataset.title||""),this.description&&(this.description.textContent=this.cards[r].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[r].dataset.title}, project ${r+1} of ${this.count}`),s&&!this.pointer&&this.cards[r].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(r)}goTo(r){let s=e(r-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+s)}step(r){this.animateTo(Math.round(this.target)+r)}animateTo(r,s=0){if(this.target=Math.round(r),this.velocity=s,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(r){this.frame=0;let s=Math.min((r-this.lastTime)/1e3,.032);this.lastTime=r;let o=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=o*s,this.position+=this.velocity*s,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(r){if(this.viewer.dialog.open||!Number.isInteger(r)||!this.cards[r])return;let s=e(r-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+s),this.settleImmediately(),this.viewer.open(r)}pointerDown(r){if(!r.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}r.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:r.pointerId,x:r.clientX,y:r.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:r.target.closest(".orbit-card")},this.stage.setPointerCapture(r.pointerId))}pointerMove(r){let s=this.pointer;if(!s||s.id!==r.pointerId)return;let o=r.clientX-s.x,m=r.clientY-s.y;if(!s.dragging){if(Math.max(Math.abs(o),Math.abs(m))<6)return;s.axis=Math.abs(m)>Math.abs(o)?"y":"x",s.lastCoordinate=s.axis==="x"?s.x:s.y,s.dragging=!0,this.root.classList.add("is-dragging")}r.preventDefault();let k=s.axis==="x"?r.clientX:r.clientY,p=s.axis==="x"?o:m,g=s.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,C=performance.now(),d=Math.max(8,C-s.lastTime),S=-(k-s.lastCoordinate)/g/d*1e3;s.speed=s.speed*.35+S*.65,s.lastMovement=C,s.lastTime=C,s.lastCoordinate=k,s.travel=p,this.position=s.startPosition-p/g,this.render()}pointerUp(r,s=!1){let o=this.pointer;if(!o||o.id!==r.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(o.id)&&this.stage.releasePointerCapture(o.id),!o.dragging){this.animateTo(Math.round(this.position)),!s&&o.card&&this.openProject(Number(o.card.dataset.slideIndex));return}let m=s||performance.now()-o.lastMovement>90?0:i(o.speed,-10,10),k=Math.round(this.position+(this.reducedMotion.matches?0:m*.2)),p=this.position-o.startPosition;!s&&Math.abs(o.travel)>18&&Math.abs(p)>.12&&k===Math.round(o.startPosition)&&(k+=Math.sign(p)),this.animateTo(k,m)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:r,strips:s})=>{s.forEach(o=>o.remove()),r.classList.remove("is-curved"),r.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(r=>r.dataset.repeat).forEach(r=>r.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function a(c=document){c.querySelectorAll("[data-spiral-carousel]").forEach(r=>{r.spiralCarousel||(r.spiralCarousel=new n(r))})}window.SpiralCarousel={init:a},a()})()});var _i,Ui=X(()=>{_i=`/* Generated selector scope; source geometry declarations are unchanged. */
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

/* The spiral owns one-finger swipes in both directions; pinch zoom stays native. */
.reference-carousel-shell .spiral-carousel .orbit-stage { touch-action: pinch-zoom; -webkit-touch-callout: none; }
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

`});var Yi,Xi=X(()=>{Yi=`.project-dialog {
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
`});var Ji,Vi=X(()=>{Ji=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var Qi={};Kt(Qi,{mountSpiral:()=>ur,spiralControls:()=>dt,spiralDefaults:()=>Xe});function $t(t,e,i){for(let n of Zi)t.removeAttribute(n);for(let[n,a]of Object.entries(e.imageAttrs||{}))Zi.has(n)&&a!=null&&t.setAttribute(n,String(a));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&i?.(t)}function gr(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function ur(t){let{host:e,onChange:i=()=>{},loadImage:n}=t,a=t.items.filter(M=>M.src),c={...Xe,...t.options},r=!1;if(!a.length){let M=document.createElement("p");return M.className="gc-spiral-empty",M.textContent="Add images to this source to preview the spiral.",e.append(M),{destroy(){M.remove()}}}let s=document.createElement("div");s.className="gc-spiral-root reference-carousel-shell";let o=document.createElement("div");o.className="orbit-carousel spiral-carousel slot-carousel",o.dataset.spiralCarousel="",o.id=`gc-spiral-${++dr}`,o.setAttribute("role","region"),o.setAttribute("aria-label","Spiral gallery"),o.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let m=o.querySelector(".orbit-stage"),k=o.querySelector(".orbit-ring"),p=o.querySelector("[data-orbit-toggle]");De(o.querySelector("[data-orbit-prev]"),"previous"),De(o.querySelector("[data-orbit-next]"),"next"),De(p,"playback");let g=o.querySelector(".gc-spiral-caption"),C=document.createElement("div");C.className="gc-spiral-caption-space",g.before(C),C.append(g);let d=a.some(M=>!!M.title);for(let M of new Set(a.map(P=>P.title).filter(Boolean))){let P=g.cloneNode(!1);P.setAttribute("aria-hidden","true"),P.classList.add("gc-spiral-caption-measure"),P.textContent=M,C.append(P)}a.forEach((M,P)=>{let x=document.createElement("button");x.className="orbit-card",x.type="button",x.dataset.title=M.title||"",x.dataset.imageSource=M.src,x.setAttribute("aria-label",M.title?`View ${M.title}`:`View image ${P+1}`);let T=document.createElement("span");T.className="orbit-surface";let L=document.createElement("img");$t(L,M),T.append(L),x.append(T),k.append(x)}),s.append(o),e.append(s);let S=()=>{s.style.width=`${Ke(c.containerWidth,100,20,100)}%`,m.style.height=`${Ke(c.stageHeight,680,280,1600)}px`,o.style.setProperty("--orbit-card-width",`${Ke(c.cardWidth,280,80,720)}px`),o.dataset.spiralWidth=String(Ke(c.spiralWidth,87,20,100)),o.dataset.cardWidth=String(Ke(c.cardWidth,280,80,720)),o.dataset.rise=String(Ke(c.spiralRise,52,c.spiralRiseUnit==="percent"?1:8,c.spiralRiseUnit==="percent"?50:500)),o.dataset.riseUnit=c.spiralRiseUnit==="percent"?"percent":"px",o.dataset.cardAspect=String(pr(c.aspectRatio)),o.dataset.imageFit=c.fit==="contain"||c.fit==="fit"?"fit":"fill",o.dataset.imagePadding=String(Ke(c.imagePadding,0,0,20)),o.dataset.slotGap=String(Ke(c.spiralGap,3,0,16)),o.dataset.showSlots=String(!!c.showSlots),C.hidden=!c.showTitles||!d,o.classList.toggle("gc-spiral-reduced",!!c.reducedMotion)};S();let v=a.map(M=>({title:M.title||"",category:"",description:Ki(M.description),services:[],notes:[],gallery:[{file:M.src,label:"Image"}]}));class u extends yt{constructor(P,x){super(P,x,v),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(P){let x=a[P];if(!x||c.clickAction==="none")return;let T=gr(x.link);if(c.clickAction==="link"){T&&location.assign(T);return}super.open(P);let L=this.dialog.querySelector(".project-title");L.hidden=!x.title,x.title?this.dialog.setAttribute("aria-labelledby",L.id):this.dialog.removeAttribute("aria-labelledby"),this.dialog.querySelector(".project-summary").hidden=!Ki(x.description),this.sourceLink.hidden=!T,T?(this.sourceLink.href=T,this.sourceLink.textContent=x.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!c.reducedMotion)}showFrame(P){super.showFrame(P);let x=v.indexOf(this.project),T=a[x];T&&($t(this.image,T,n),this.dialog.querySelectorAll(".project-thumbnail img").forEach(L=>$t(L,T,n)),this.dialog.querySelector(".project-frame-label").textContent=T.title||"")}}let h=window.ProjectViewer;window.ProjectViewer=u;try{lr.init(s)}finally{h===void 0?delete window.ProjectViewer:window.ProjectViewer=h}let w=o.spiralCarousel;o.querySelectorAll("img").forEach(M=>n?.(M));let R=w.updateActive;w.updateActive=function(M){R.call(this,M),this.status.textContent=`${a[M]?.title?`${a[M].title}, `:""}image ${M+1} of ${a.length}`,i(M)},w.updateActive(w.active);let I=w.animateTo;w.animateTo=function(M,P=0){c.reducedMotion?(this.target=Math.round(M),this.settleImmediately()):I.call(this,M,P)};let y=Di(w,{textureSource:M=>M.dataset.imageSource}),A=pi(o,w,{pauseOnHover:!1,interactionRestMs:0});function E(M){c.autoplay=!!M,w.manuallyPaused=!M||!!c.reducedMotion,w.resumeAt=0,p.disabled=!!c.reducedMotion||w.reducedMotion.matches||a.length<2,p.dataset.paused=String(w.manuallyPaused),p.setAttribute("aria-label",w.manuallyPaused?"Resume carousel":"Pause carousel"),w.syncAutoplay()}return E(!!c.autoplay),{update(M){c={...c,...M},S(),w.measure(),o.dispatchEvent(new Event("playground-change")),o.dispatchEvent(new Event("slot-guides-change")),w.updateActive(w.active),E(!!c.autoplay)},goTo(M){r||w.goTo(M)},setPlaying:E,getMetrics(){try{return JSON.parse(o.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return o.dataset.renderer||"loading"},destroy(){r||(r=!0,A(),y(),w.destroy(),s.remove())}}}var lr,dr,Ke,pr,Ki,Zi,ea=X(async()=>{di();bt();xt();xt();gi();await Bi();Gi();lr=window.SpiralCarousel,dr=0,Ke=(t,e,i,n)=>Number.isFinite(Number(t))?Math.max(i,Math.min(n,Number(t))):e,pr=t=>{if(typeof t=="number"&&t>0)return t;let[e,i]=String(t||"16:9").split(":").map(Number);return e>0&&i>0?e/i:16/9},Ki=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Zi=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function ta(t){let{host:e}=t,i={...t.options},n=null,a=null,c=!1,r="loading",s=document.createElement("p");return s.className="gc-empty",s.setAttribute("role","status"),s.textContent="Loading spiral\u2026",e.append(s),ea().then(()=>Qi).then(o=>{c||(s.remove(),a=o.mountSpiral({...t,options:i}),n!==null&&a.goTo?.(n))}).catch(o=>{c||(r="error",s.textContent="The spiral could not load.",e.replaceChildren(s),console.warn("Gallery Studio: spiral unavailable",o))}),{update(o){i={...i,...o},a?.update?.(i)},goTo(o){n=o,a?.goTo?.(o)},setPlaying(o){i.autoplay=o,a?.setPlaying?.(o)},getStatus(){return a?.getStatus?.()??r},getMetrics(){return a?.getMetrics?.()??null},destroy(){c=!0,s.remove(),a?.destroy()}}}var ia=X(()=>{});function ut(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let i=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(i.protocol)?i.href:""}catch{return""}}function Wt(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(i=>i.remove()),e.content.querySelectorAll("*").forEach(i=>{for(let n of[...i.attributes])(/^on/i.test(n.name)||n.name==="style"||n.name==="id")&&i.removeAttribute(n.name);if(i.hasAttribute("href")){let n=ut(i.getAttribute("href"));n?i.setAttribute("href",n):i.removeAttribute("href")}}),e.innerHTML}function hr(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let i of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(i)&&(e[i]=t.getAttribute(i));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function ht(t,e){let i=Rt[e];if(!t||!i)return null;let n=t.closest(i);if(!n){let o=t.querySelectorAll(i);if(o.length!==1)return null;n=o[0]}let a=e==="list"?n:n.querySelector(":scope > .sqs-block-content");if(!a)return null;let c=o=>Array.from(a.querySelectorAll(o)).filter(m=>m.closest(i)===n&&(!m.closest(".gc-embed")||m.hasAttribute("data-gc-native-track"))),r=e==="list"?".list-item":".slide",s=c(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!s.length&&(s=c(".sqs-gallery")),s.length===1){let o=Array.from(s[0].querySelectorAll(r)).filter(m=>m.closest(i)===n&&!m.hasAttribute("data-gc-repeat"));return{source:n,originals:s,rows:o}}if(e==="gallery"&&!s.length){let o=c(r);if(o.length&&o.every(m=>m.parentElement===o[0].parentElement))return{source:n,originals:o,rows:o}}return null}function st(t,e,i=location.href){return(ht(t,e)?.rows||[]).map(a=>{let c=a.querySelector("img[data-src],img[data-image],img"),r=a.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",s=Wt(a.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),o=a.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...hr(c),title:r,description:s,link:ut(o?.getAttribute("href"),i),buttonLabel:e==="list"&&o?.textContent.trim()||""}}).filter(a=>e==="list"||a.src)}function fr(t,e){let i=e==="list"?t.getAttribute("data-section-id"):t.id;if(!i?.trim())return"";let n=e==="list"?'section[data-section-id="'+CSS.escape(i)+'"]':"#"+CSS.escape(i);return t.ownerDocument.querySelectorAll(n).length===1?n:""}function aa(t=document){let e={list:0,gallery:0};return Array.from(t.querySelectorAll(Object.values(Rt).join(","))).filter(i=>!i.closest(".gc-embed")).flatMap(i=>{let n=i.matches(Rt.list)?"list":"gallery",a=fr(i,n);if(!a||!ht(i,n))return[];let c=++e[n];return{name:(n==="list"?"List Section":"Gallery Block")+(c>1?" "+c:""),type:n,selector:a,root:i,items:st(i,n)}})}function St(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let i=t.ownerDocument.defaultView?.ImageLoader;if(i&&typeof i.load=="function")try{i.load(t,{load:!0})}catch(n){console.warn("Gallery Studio: native image loader",n)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+ra(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function ra(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function Ht(t){let e=document.createElement("img");for(let[i,n]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(i)&&e.setAttribute(i,n);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=ra(t.imageAttrs?.["data-image-focal-point"]),e}var Rt,Ot=X(()=>{Rt={list:"section.user-items-list-section",gallery:".sqs-block-gallery"}});function oa(t,e,i){let n=new WeakMap,a=new WeakMap,c=Array.from(e.childNodes),r=i.map(v=>Array.from(v.childNodes)),s=[];function o(v,u){v&&s.push([v,u.map(h=>[h,v.getAttribute(h)])])}let m=new Set,k=!1;function p(){o(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let v of i)o(v,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),k=!0}function g(v,u,h,w,R){let I=i[u],y=m.has(u),A=y?I.cloneNode(!1):I,E=document.createElement("div");if(E.className="gc-card gc-native-card",E.tabIndex=0,E.setAttribute("role","group"),v.imageAttrs?.["data-image-focal-point"]){let[$,te]=v.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite($)&&Number.isFinite(te)&&E.style.setProperty("--gc-native-focus",$*100+"% "+te*100+"%")}let M=v.title||v.alt||`Item ${u+1}`;if(E.setAttribute("aria-label",M),y){A.removeAttribute("id"),A.setAttribute("data-gc-repeat","");for(let $ of r[u])E.append($.cloneNode(!0));E.querySelectorAll("[id]").forEach($=>$.removeAttribute("id"))}else m.add(u),E.append(...r[u]);A.replaceChildren(E),n.set(E,A);let P=E.querySelector(".list-item-media"),x=E.querySelector(".list-item-content"),T=E.querySelector(".list-item-content__title"),L=E.querySelector(".list-item-content__description");if(!y){for(let $ of[P,x])o($,["class"]);for(let $ of[T,L])o($,["class","hidden"])}if(P?.classList.add("gc-card-media"),x?.classList.add("gc-card-copy"),w.typeSource!=="native"&&(T?.classList.add("gc-card-title"),L?.classList.add("gc-card-description")),T&&(!w.showTitles||h.caption===!1)&&(T.hidden=!0),L&&!h.description&&(L.hidden=!0),h.thumbnail){let $=E.querySelector(".list-item-content__button-wrapper")||E.querySelector(".list-item-content__button");$&&(y||o($,["hidden"]),$.hidden=!0),x&&(!v.title||h.caption===!1)&&(y||o(x,["hidden"]),x.hidden=!0)}let ee=Array.from(E.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!y)for(let $ of ee)o($,["tabindex"]);if(a.set(E,ee.map($=>[$,$.getAttribute("tabindex")])),w.clickAction!=="none"&&(w.clickAction!=="link"||v.link)){let $=document.createElement("button");$.type="button",$.className="gc-native-action",$.tabIndex=-1,$.setAttribute("aria-label",(w.clickAction==="link"?"Open link for ":"Open ")+M),$.addEventListener("click",()=>R(v,u)),E.append($),E.setAttribute("aria-keyshortcuts","Enter Space"),E.addEventListener("click",te=>{te.defaultPrevented||te.target.closest("a,button,input,select,textarea,label")||R(v,u)}),E.addEventListener("keydown",te=>{te.target!==E||!["Enter"," "].includes(te.key)||(te.preventDefault(),$.click())})}return E}function C(v){let u=v.tabIndex===0&&v.getAttribute("aria-hidden")!=="true";for(let[h,w]of a.get(v)||[]){let R=u?w:"-1";h.getAttribute("tabindex")!==R&&(R===null?h.removeAttribute("tabindex"):h.setAttribute("tabindex",R))}}function d(v){if(!k)return;let u=v!=="native";e.querySelectorAll(".list-item-content__title").forEach(h=>h.classList.toggle("gc-card-title",u)),e.querySelectorAll(".list-item-content__description").forEach(h=>h.classList.toggle("gc-card-description",u))}function S(){if(e.classList.remove("gc-native-items-hidden"),!!k){i.forEach((v,u)=>v.replaceChildren(...r[u])),e.replaceChildren(...c);for(let[v,u]of s)for(let[h,w]of u)v.getAttribute(h)!==w&&(w===null?v.removeAttribute(h):v.setAttribute(h,w));t.after(e),s.length=0,m.clear(),k=!1}}return{track:e,begin:p,makeCard:g,slot:v=>n.get(v),syncFocus:C,setType:d,restore:S}}var na=X(()=>{});function sa(t,e,i){if(!i.closest(".fluid-engine > .fe-block"))return()=>{};i.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let a=0,c=!1,r=new WeakSet,s=g=>{g&&!r.has(g)&&(r.add(g),m.observe(g))},o=()=>{!a&&!c&&(a=requestAnimationFrame(p))},m=new ResizeObserver(o),k=new MutationObserver(o);function p(){if(a=0,c||!e.isConnected)return;let g=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!g)return;let C=g.classList.contains("gc-carousel-stage"),d=g.parentElement;d.classList.contains("gc-block-stage-window")&&(d=d.parentElement),s(d),s(g);let S=0;for(let u of d.children){if(u===g||u.contains(g))continue;let h=getComputedStyle(u);h.display==="none"||["absolute","fixed"].includes(h.position)||(S+=u.offsetHeight+(parseFloat(h.marginTop)||0)+(parseFloat(h.marginBottom)||0),s(u))}let v=Math.max(1,t.clientHeight-S);if(C){let u=g.parentElement;u.classList.contains("gc-block-stage-window")||(u=document.createElement("div"),u.className="gc-block-stage-window",g.before(u),u.append(g));let h=Math.min(1,v/Math.max(1,g.offsetHeight));u.style.height=v+"px",g.style.setProperty("--gc-block-scale",String(h)),g.style.setProperty("--gc-block-top",Math.max(0,(v-g.offsetHeight*h)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",v+"px")}return s(t),k.observe(e,{childList:!0,subtree:!0}),o(),()=>{c=!0,cancelAnimationFrame(a),m.disconnect(),k.disconnect(),i.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let g=e.querySelector(".gc-block-stage-window");if(g){let C=g.firstElementChild;C.style.removeProperty("--gc-block-scale"),C.style.removeProperty("--gc-block-top"),g.replaceWith(C)}}}var ca=X(()=>{});function la(t,e,i,n){let a=i.ownerDocument,c=a.defaultView,r=n==="gallery"?i.closest(".fluid-engine > .fe-block"):null;r?.classList.add("gc-viewport-cell");let s=[],o=r||i;for(let p=t.parentElement;p&&(["hidden","clip","auto","scroll"].includes(c.getComputedStyle(p).overflowX)&&s.push(p),p!==o);p=p.parentElement);function m(){let p=a.documentElement.clientWidth;if(!p||!t.isConnected||!t.getClientRects().length)return;for(let d of s){let S=d.getBoundingClientRect().left+c.scrollX+d.clientLeft,v=S>.5||S+d.clientWidth<p-.5;d.classList.toggle("gc-viewport-unclip",v)}let g=-(t.getBoundingClientRect().left+c.scrollX),C=(d,S)=>{e.style.getPropertyValue(d)!==S&&e.style.setProperty(d,S)};C("--gc-viewport-width",p+"px"),C("--gc-viewport-offset",g+"px")}m();let k=c.ResizeObserver?new c.ResizeObserver(m):null;return k?.observe(t),k?.observe(a.documentElement),c.addEventListener("resize",m),()=>{k?.disconnect(),c.removeEventListener("resize",m);for(let p of s)p.classList.remove("gc-viewport-unclip");r?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var da=X(()=>{});var ga,pa=X(()=>{ga=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function ua(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),e.preset!=="spiral"){if(!document.getElementById("gc-finish-css")){let i=document.createElement("style");i.id="gc-finish-css",i.textContent=ga,document.head.append(i)}t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}}var Dt,ha=X(()=>{pa();Dt={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset"}});function fa(t,e){let i=t.classList.contains("gc-embed"),n=i&&e.colorSource==="section";n?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,i&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let a=t.style;a.setProperty("--gc-custom-background",e.background),a.setProperty("--gc-custom-ink",e.ink),a.setProperty("--gc-custom-accent",e.accent),a.setProperty("--gc-background",n?"var(--gc-section-surface)":e.background),a.setProperty("--gc-ink",n?"var(--gc-section-body)":e.ink),a.setProperty("--gc-accent",n?"var(--gc-section-action)":e.accent),a.setProperty("--gc-muted",n?"var(--gc-section-body)":e.ink+"aa"),a.setProperty("--gc-spatial-surface","var(--gc-background)"),a.setProperty("--gc-spatial-ink","var(--gc-ink)"),n&&(a.setProperty("--gc-line-color","var(--gc-section-line)"),a.setProperty("--gc-tint","var(--gc-section-body)")),a.background=n?"transparent":e.background,a.color=n?"var(--gc-section-body)":e.ink;for(let c of t.querySelectorAll(":scope > dialog"))ma(t,c)}function ma(t,e){for(let i of["gcColorSource","gcTypeSource"])t.dataset[i]?e.dataset[i]=t.dataset[i]:delete e.dataset[i]}function Bt(t,e){let i=t.classList.contains("gc-embed")?t:t.ownerDocument.body;ma(t,e),e.parentElement!==i&&i.append(e)}var ba=X(()=>{});var xa,ya=X(()=>{xa=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
.gc-block-slot>.gc-block-fit{height:100%!important;min-height:0;overflow:auto;overscroll-behavior:contain}
.gc-block-fit .orbit-stage{height:var(--gc-block-stage-height,100%)!important;min-height:0!important}
.gc-block-fit .gc-spatial-canvas{height:var(--gc-block-stage-height,100%)!important;min-height:0!important}
.gc-block-stage-window{position:relative;overflow:clip}
.gc-block-stage-window>.gc-carousel-stage{position:absolute;left:50%;top:var(--gc-block-top,0px);transform:translateX(-50%) scale(var(--gc-block-scale,1));transform-origin:top center}

.sqs-edit-mode-active .gc-edit-preview .gc-embed{display:block!important}
.sqs-edit-mode-active .gc-edit-preview .gc-native-items-hidden{display:none!important}
`});var wa,va=X(()=>{wa=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var Sa,ka=X(()=>{Sa=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var Ca,Ma=X(()=>{Ca=`.gc-carousel {
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
`});var Ea,Aa=X(()=>{Ea=`.gc-spatial {
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
`});function Ze(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function Mt(t,e){let i=Ze(e.preset??t.preset),n=i===Ze(t.preset)?t.stageHeight:i?0:590;return{...t,...e,stageHeight:e.stageHeight??n}}function Pa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function La(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[xa,wa,Sa].join(`
`),document.head.append(e));let i=Pa(t);if(i==="common")return()=>{};let n=`gc-runtime-${i}-css`,a=document.getElementById(n);a||(a=document.createElement("style"),a.id=n,i==="carousel"?a.textContent=Ca:i==="spatial"?a.textContent=Ea:a.textContent=[_i,Oi,Yi,Ji].join(`
`),e.after(a)),a.dataset.gcOwners=String(Number(a.dataset.gcOwners||0)+1);let c=!1;return()=>{if(c)return;c=!0;let r=Number(a.dataset.gcOwners)-1;r>0?a.dataset.gcOwners=String(r):a.remove()}}function kr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function ja(t,e,i={},n=null){let a=Mt(rt,i),c=null,r=null,s=null,o=0,m=0,k,p;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function g(){r&&(r.close(),r.remove(),r=null,c?.setSuspended?.(!1),s?.focus({preventScroll:!0}))}function C(y,A){if(a.clickAction==="none")return;if(a.clickAction==="link"){let L=ut(y.link);L&&window.open(L,"_blank","noopener,noreferrer");return}s=document.activeElement,r&&g(),r=document.createElement("dialog"),r.className="gc-dialog"+(a.preset==="showcase"?" gc-dialog-drawer":""),r.setAttribute("aria-label",y.title||"Image preview");let E=document.createElement("button");E.className="gc-dialog-close",E.type="button",E.textContent="Close \xD7",E.addEventListener("click",g);let M=document.createElement("div");M.className="gc-dialog-content";let P=document.createElement("div");P.className="gc-dialog-media",y.src&&(P.append(Ht(y)),M.append(P));let x=document.createElement("div");if(x.className="gc-dialog-copy",y.title){let L=document.createElement("h2");L.textContent=y.title,x.append(L)}if(y.description){let L=document.createElement("div");L.innerHTML=Wt(y.description),x.append(L)}if(y.link){let L=document.createElement("a");L.href=ut(y.link),L.textContent=y.buttonLabel||"Open link",L.target="_blank",L.rel="noopener noreferrer",x.append(L)}let T=document.createElement("p");T.className="gc-dialog-count",T.textContent=`${A+1} / ${e.length}`,x.append(T),M.append(x),r.append(E,M),Bt(t,r),r.showModal(),c?.setSuspended?.(!0),St(P.querySelector("img")),E.focus(),r.addEventListener("cancel",L=>{L.preventDefault(),g()}),r.addEventListener("click",L=>{if(L.target===r){let ee=r.getBoundingClientRect();(L.clientX<ee.left||L.clientX>ee.right||L.clientY<ee.top||L.clientY>ee.bottom)&&g()}})}function d(y,A,E={}){if(n)return n.makeCard(y,A,E,a,C);let M=document.createElement("button");M.type="button",M.className="gc-card",M.setAttribute("aria-label",y.title||`Image ${A+1}`);let P=document.createElement("span");P.className="gc-card-media",y.src&&(P.append(Ht(y)),M.append(P));let x=document.createElement("span");if(x.className="gc-card-copy",E.caption!==!1&&a.showTitles&&y.title){let T=document.createElement("span");T.className="gc-card-title",T.textContent=y.title,x.append(T)}if(E.description&&y.description){let T=document.createElement("span");T.className="gc-card-description",T.textContent=kr(y.description),x.append(T)}return x.childNodes.length&&M.append(x),M.addEventListener("click",()=>C(y,A)),M}let S=matchMedia("(prefers-reduced-motion: reduce)"),v=matchMedia("(max-width: 660px)");function u(){let y={...a,reducedMotion:a.reducedMotion||S.matches};return v.matches&&(a.mobileCardWidth!=null&&(y.cardWidth=a.mobileCardWidth),a.mobileGap!=null&&(y[a.preset==="spiral"?"spiralGap":"gap"]=a.mobileGap)),y.phoneWidthOverride=v.matches&&a.mobileCardWidth!=null,a.preset==="stack"&&(y.stackCardWidth=v.matches&&a.mobileCardWidth!=null?a.mobileCardWidth:Math.max(360,a.cardWidth*2.2)),y}function h(){ua(t,a),t.style.setProperty("--gc-fit",a.fit),t.style.setProperty("--gc-card-radius",a.radius+"px"),fa(t,a)}function w(y=0){g(),c?.destroy(),c=null,n?.restore(),cancelAnimationFrame(m),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let A=Pa(a.preset);A!==k&&(p?.(),p=La(a.preset),k=A),h(),t.setAttribute("aria-label",a.previewScroll===!1?"Gallery":"Gallery preview");let E=n&&a.preset!=="spiral"?n:null;E?E.begin():n&&n.track.classList.add("gc-native-items-hidden");let M={host:t,items:e,initialIndex:y,nativeList:E,attachDialog:P=>Bt(t,P),options:u(),makeCard:d,loadImage:St,onChange(P){o=P,a.onChange?.(P)}};if(!e.length){let P=document.createElement("p");P.className="gc-empty",P.textContent="Add images to your source to start exploring.",t.append(P);return}a.preset==="spiral"?c=ta(M):a.preset==="stack"?c=si(M):["wall","ring","angled"].includes(a.preset)?(c=oi(M),y&&c.goTo(y)):c=ai(M),a.preset!=="spiral"&&(m=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(P=>{St(P,{nativeCard:!!E})})))}let R=()=>w(o);function I(){a.mobileCardWidth==null&&a.mobileGap==null||(c?.setGeometry?c.setGeometry(u()):a.preset==="spiral"?c?.update(u()):w(o))}try{w()}catch(y){throw p?.(),n?.restore(),y}return S.addEventListener("change",R),v.addEventListener("change",I),{update(y){let A=a.preset,E=u();a=Mt(a,y);let M=u(),P=Object.keys(M).filter(T=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(T)&&M[T]!==E[T]);if(!P.length)return;if(c?.setGeometry&&P.every(T=>["cardWidth","gap","phoneWidthOverride"].includes(T))){c.setGeometry(M);return}let x=T=>["colorSource","typeSource","background","ink","accent"].includes(T);if(P.every(T=>x(T)||A!=="spiral"&&(T==="radius"||Object.hasOwn(Dt,T)))){h(),P.includes("typeSource")&&n?.setType(a.typeSource);return}A==="spiral"&&a.preset==="spiral"&&c?.update?(h(),c.update(M)):w(A===a.preset?o:0)},goTo(y){c?.goTo?.(y)},setPlaying(y){a.autoplay=y,c?.setPlaying?.(y)},getOptions(){return{...a}},getActive(){return o},destroy(){g(),cancelAnimationFrame(m),c?.destroy(),n?.restore(),S.removeEventListener("change",R),v.removeEventListener("change",I),t.replaceChildren(),t.classList.remove("gc-stage"),p?.()}}}function Sr(t,e){let i=e.closest("section")||e,n=[];for(let a=t.parentElement;a;a=a.parentElement){let c=we.scrollBoundaries.get(a)||0;if((c||["hidden","auto","scroll","overlay"].includes(getComputedStyle(a).overflowY))&&(we.scrollBoundaries.set(a,c+1),a.classList.add("gc-stack-page-scroll"),n.push(a)),a===i)break}return()=>{for(let a of n){let c=we.scrollBoundaries.get(a)-1;c?we.scrollBoundaries.set(a,c):(we.scrollBoundaries.delete(a),a.classList.remove("gc-stack-page-scroll"))}}}function ct(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function Gt(t){if(!we.editListeners?.size){we.editListeners=new Set;let e=ct();we.editObserver=new MutationObserver(()=>{let i=ct();if(i!==e){e=i;for(let n of we.editListeners)try{n(i)}catch(a){console.warn("Gallery Studio: could not resume a list layout.",a)}}});for(let i of[document.body,document.documentElement])we.editObserver.observe(i,{attributes:!0,attributeFilter:["class"]})}return we.editListeners.add(t),()=>{we.editListeners.delete(t),we.editListeners.size||we.editObserver.disconnect()}}function Ut({selector:t,type:e="gallery",options:i={}}={}){let n=t;if(typeof t=="string")try{let L=document.querySelectorAll(t);if(L.length!==1)return null;n=L[0]}catch{return null}if(!n?.isConnected||typeof n.closest!="function")return null;let a=ht(n,e);if(!a)return null;let{source:c}=a,r=we.mounts.get(c);if(r)return r.instance.update(i),r;if(!st(c,e).length)return null;let s=document.createElement("div"),o=document.createElement("div");s.className="gc-embed",o.className="gc-viewport-slot",o.append(s);let m={...Mt(rt,i),previewScroll:!1},k=null,p=null,g=null,C=null,d=null,S=!1,v=[],u=null,h=!1,w=null;function R(){m.galleryWidth==="source"?(g?.(),g=null,u&&(o.classList.add("user-items-list-simple"),o.dataset.layoutWidth=u.mode,o.style.maxWidth=u.maximum)):g||(o.classList.remove("user-items-list-simple"),delete o.dataset.layoutWidth,o.style.removeProperty("max-width"),g=la(o,s,c,e))}function I(){return e==="gallery"&&m.preset!=="stack"&&m.galleryHeight!=="custom"&&!!c.closest(".fluid-engine > .fe-block")}function y(){I()?C||(C=sa(o,s,c)):(C?.(),C=null)}function A(L){L==="stack"?p||(p=Sr(s,c)):p&&(p(),p=null)}function E(){try{k?.destroy()}finally{k=null,C?.(),C=null,A(null),g?.(),g=null,v.forEach(L=>L.classList.remove("gc-native-items-hidden")),v=[],w?.remove(),w=null,o.remove(),o.replaceChildren(s),s.inert=!1}}function M(){if(S||k||!c.isConnected)return;let L=ht(c,e),ee=st(c,e);if(!L||!ee.length)return;L.originals[0].before(o),La();let $=L.originals[0];u=e==="list"?{mode:$.dataset.layoutWidth||"full",maximum:$.style.maxWidth}:null,R();let te=null;if(e==="list"){let ie=h?$.cloneNode(!0):$;h&&(w=ie,ie.removeAttribute("id"),ie.querySelectorAll("[id]").forEach(le=>le.removeAttribute("id")),o.append(ie)),te=oa(o,ie,h?[...ie.querySelectorAll(".list-item")]:L.rows)}(!te||h)&&(v=L.originals,v.forEach(ie=>ie.classList.add("gc-native-items-hidden"))),y(),A(m.preset),k=ja(s,ee,m,te),s.inert=h}function P(){if(!S){S=!0,c.classList.remove("gc-edit-preview");try{E()}finally{d?.(),we.mounts.delete(c)}}}let T={instance:{update(L={}){if(S)return;let ee=m.galleryWidth;m={...Mt(m,L),previewScroll:!1},k&&(m.galleryWidth!==ee&&R(),y(),A(m.preset),k.update(m))},setEditPreview(L){if(!(S||!ct()||L===h)){if(h=L,c.classList.toggle("gc-edit-preview",L),!L){E();return}try{M()}catch(ee){throw this.setEditPreview(!1),ee}}},goTo(L){k?.goTo(L)},setPlaying(L){m.autoplay=L,k?.setPlaying(L)},getOptions(){return{...m}},getActive(){return k?.getActive()??0},destroy:P},host:s,source:c,destroy:P};try{d=Gt(L=>{if((h||L)&&E(),h=!1,c.classList.remove("gc-edit-preview"),!L)try{M()}catch(ee){throw E(),ee}}),ct()||M(),we.mounts.set(c,T)}catch(L){throw P(),L}return T}var ft,rt,we,_t=X(()=>{ri();ni();ci();ia();xt();Ot();na();ca();da();ha();ba();ya();va();ka();Ma();Aa();Vi();Ui();Xi();Hi();ft=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],rt={...Dt,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};we=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:ja,embed:Ut,presets:ft}});var Ia,za=X(()=>{Ia=`:host {
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
`});function Z(t,e,i){let n=document.createElement(t);return e&&(n.className=e),i!==void 0&&(n.textContent=i),n}function Re(t,e,i){let n=Z("button",t,e);return n.type="button",i&&n.setAttribute("aria-label",i),n}function Qe(t,e,i,n,a,c=""){return{key:t,label:e,type:"range",min:i,max:n,step:a,unit:c}}function Xt(t,e){let i=t.preset,n=Ze(i),a=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},Qe("cardWidth","Card width",80,i==="timed"?960:i==="spiral"?720:560,1,"px"),Qe("stageHeight",n?"Minimum gallery height":"Gallery height",n?0:300,1200,1,"px")];if(e==="gallery"&&(a.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&a.splice(a.findIndex(r=>r.key==="stageHeight"),1)),i==="spiral")a.push(...dt);else if(a.push(Qe("gap","Spacing",0,100,1,"px")),i!=="infinite"&&i!=="timed"){let r={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[i]||"Depth";a.push(Qe("depth",r,0,100,1))}let c=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:i==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];return(i==="arc-tabs"||i==="timed")&&c.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),i!=="stack"&&(c.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),i!=="spiral"&&c.push(Qe("duration","Time per image",2,15,.5,"s"))),c.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"}),[{title:"Size & spacing",fields:a},{title:"Mobile overrides",fields:[{...a.find(r=>r.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...a.find(r=>r.key===(i==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:i==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:c},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:Cr},...i==="spiral"?[]:[Qe("radius","Corner radius",0,64,1,"px"),Qe("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},Qe("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],{key:"showTitles",label:"Show titles",type:"checkbox"},{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]}]}function Ta(t){return{...rt,stageHeight:Ze(t.preset??rt.preset)?0:590,...t.preset==="spiral"?Xe:{},colorSource:"section",typeSource:"native",...t}}function Ar(t){let e=t.type==="list"?"List Section":"Gallery Block",i=t.name?.trim()||e,n=t.items?.length||0;return`${i.toLowerCase().includes(e.toLowerCase())?i:`${i} \xB7 ${e}`} \xB7 ${n} ${n===1?"item":"items"}`}function qa({source:t,options:e,onPreset:i,onOption:n,onClose:a,onRestore:c,onSave:r,getCode:s,getStyle:o,applyStyle:m}){let k=document.activeElement,p=t,g=Ta(e),C=!1,d=!1,S=0,v=new Map,u=new Map,h=Z("div");h.setAttribute("data-gc-author-panel",""),h.setAttribute("data-lenis-prevent",""),h.addEventListener("wheel",j=>j.stopPropagation(),{passive:!0}),h.addEventListener("touchmove",j=>j.stopPropagation(),{passive:!0});let w=h.attachShadow({mode:"open"}),R=Z("style");R.textContent=Ia;let I=Z("aside","panel");I.setAttribute("aria-labelledby","gc-author-heading");let y=Z("header","header"),A=Z("div","heading"),E=Z("h2","","Gallery settings");E.id="gc-author-heading";let M=Z("p","target");A.append(E,M);let P=Z("div","header-actions"),x=Re("icon-button","\u2212","Minimize settings");x.setAttribute("aria-controls","gc-author-controls"),x.setAttribute("aria-expanded","true");let T=Re("icon-button","\xD7","Close settings");P.append(x,T),y.append(A,P);let L=Z("div","controls");L.id="gc-author-controls";let ee=Z("div","scroll");ee.tabIndex=0,ee.setAttribute("aria-label","Layout settings");let $=Z("label","preset-row"),te=Z("select","preset-select");te.setAttribute("aria-label","Layout");for(let j of ft.filter(O=>t.type!=="gallery"||O.id!=="stack")){let O=Z("option","",j.name);O.value=j.id,te.append(O)}$.append(Z("span","field-label","Layout"),te);let ie=Z("div","groups"),le=Z("div","style-actions"),ke=Re("text-button","Copy style"),Pe=Re("text-button","Paste style");le.append(ke,Pe);let N=Z("div","style-transfer");N.hidden=!0;let F=Z("textarea");F.setAttribute("aria-label","Gallery style"),F.spellcheck=!1;let B=Re("secondary","Apply style"),V=Re("text-button","Close","Close style transfer");N.append(F,B,V),ee.append($,le,N,ie);let Q=Z("footer","footer"),K=Z("div","export-actions"),ae=Re("primary","Save to page"),H=Re("secondary","Copy code"),U=Re("text-button","Download header backup");U.hidden=!0;let me=null,re=Re("secondary","View code");re.setAttribute("aria-expanded","false"),re.setAttribute("aria-controls","gc-author-code"),K.append(ae,H);let J=Z("div","code-view");J.id="gc-author-code",J.hidden=!0;let de=Z("label","code-label","Page Header Code Injection"),D=Z("textarea");D.readOnly=!0,D.spellcheck=!1,D.setAttribute("aria-label","Page header code"),de.append(D),J.append(de);let Le=Z("div","footer-line"),se=Z("span","status");se.setAttribute("role","status");let Fe=Re("text-button","Reset preview");Le.append(se,Fe);let Be=Z("div","backup-actions");Be.append(re,U),Q.append(K,Be,J,Le),L.append(ee,Q),I.append(y,L),w.append(R,I),document.body.append(h);function Y(j){let{definition:O,input:oe,output:pe,row:he}=j,ye=g[O.key];if(O.type==="checkbox"){oe.checked=!!ye;return}if(O.type==="range"){let ne=O.key==="spiralRise"&&g.spiralRiseUnit==="percent"?{...O,...O.percent}:O;oe.min=String(ne.min),oe.max=String(ne.max),oe.step=String(ne.step);let ve=O.inherits&&ye==null;j.enable&&(j.enable.checked=!ve,oe.disabled=!!ve),oe.value=String(ve?g[O.inherits]:ye);let be=ne.key==="stageHeight"&&ne.min===0&&Number(oe.value)===0?"Auto":`${oe.value}${ne.unit||""}`;pe.textContent=ve?`Inherit \xB7 ${be}`:be,oe.setAttribute("aria-valuetext",be);return}oe.value=String(ye),O.type==="color"&&(he.hidden=g.colorSource==="section",pe.textContent=oe.value.toUpperCase())}function We(){S+=1,se.textContent="",J.hidden||(D.value=s())}function _(j,O){let oe=g.spiralRiseUnit;if(g={...g,[j]:O},j==="spiralRiseUnit"&&oe!==O){let pe=Math.max(1,g.stageHeight),he=O==="percent"?Math.max(1,Math.min(30,Math.round(g.spiralRise/pe*1e3)/10)):Math.max(8,Math.min(280,Math.round(g.spiralRise*pe/100)));g.spiralRise=he,n(j,O),n("spiralRise",he),Y(v.get("spiralRise"))}else n(j,O);j==="galleryHeight"&&ce(),j==="colorSource"?v.forEach(Y):Y(v.get(j));for(let pe of v.values())pe.definition.inherits===j&&Y(pe);We()}function Ye(j){let{key:O,label:oe,type:pe}=j,he=Z(j.inherits?"div":"label",`field field-${pe}`),ye=Z("span","field-label",oe),ne=Z(pe==="select"?"select":"input");if(ne.setAttribute("aria-label",oe),ne.dataset.option=O,pe==="select")for(let be of j.choices){let qe=Z("option","",be.label);qe.value=be.value,ne.append(qe)}else ne.type=pe;let ve;(pe==="range"||pe==="color")&&(ve=Z("output","value"),ve.setAttribute("aria-hidden","true")),he.append(ye),ve&&he.append(ve),he.append(ne);let je={definition:j,input:ne,output:ve,row:he};if(j.inherits){let be=Z("input");be.type="checkbox",be.setAttribute("aria-label","Customize "+oe.toLowerCase());let qe=Z("label","override-toggle");qe.append(be,ye),he.prepend(qe),je.enable=be,be.addEventListener("change",()=>_(O,be.checked?g[j.inherits]:null))}return v.set(O,je),Y(je),ne.addEventListener(pe==="range"||pe==="color"?"input":"change",()=>{let be=pe==="range"?Number(ne.value):pe==="checkbox"?ne.checked:ne.value;_(O,be)}),he}function ce(){let j=new Map([...u].map(([O,oe])=>[O,oe.open]));v.clear(),u.clear(),ie.replaceChildren();for(let O of Xt(g,p.type)){let oe=Z("details","group");oe.open=j.get(O.title)??O.title==="Size & spacing";let pe=Z("summary","",O.title),he=Z("div","group-body");for(let ye of O.fields)he.append(Ye(ye));oe.append(pe,he),ie.append(oe),u.set(O.title,oe)}}function Ge(j){if(d)return;let O=g.preset;p=j.source??p,j.options&&(g=Ta(j.options)),M.textContent=Ar(p),M.title=p.selector||M.textContent,te.value=g.preset,!v.size||O!==g.preset?ce():v.forEach(Y),We()}function Se(j){J.hidden=!j,re.textContent=j?"Hide code":"View code",re.setAttribute("aria-expanded",String(j)),j&&(D.value=s(),D.focus({preventScroll:!0}),D.select())}function Me(){if(d)return;d=!0,S+=1;let j=document.activeElement===h;document.removeEventListener("keydown",He),h.remove(),j&&k?.isConnected&&k.focus({preventScroll:!0})}function Ce(j){if(!d)try{j()}finally{Me()}}function He(j){j.key!=="Escape"||j.defaultPrevented||j.isComposing||document.querySelector("dialog[open]")||j.composedPath().some(O=>O?.getAttribute?.("aria-modal")==="true")||(j.preventDefault(),Ce(a))}x.addEventListener("click",()=>{C=!C,L.hidden=C,h.toggleAttribute("data-minimized",C),x.textContent=C?"+":"\u2212",x.setAttribute("aria-expanded",String(!C)),x.setAttribute("aria-label",C?"Expand settings":"Minimize settings")}),T.addEventListener("click",()=>Ce(a)),Fe.addEventListener("click",()=>Ce(c)),te.addEventListener("change",()=>i(te.value)),re.addEventListener("click",()=>Se(J.hidden));function Oe(j,O){N.hidden=!1,B.hidden=j,F.readOnly=j,F.value=O,F.placeholder=j?"":"Paste the copied gallery style",F.focus(),j&&F.select()}return ke.addEventListener("click",async()=>{let j=o();try{await navigator.clipboard.writeText(j),d||(N.hidden=!0,se.textContent="Style copied")}catch{if(d)return;Oe(!0,j),se.textContent="Style selected. Choose Copy."}}),Pe.addEventListener("click",()=>{se.textContent="",Oe(!1,"")}),V.addEventListener("click",()=>{N.hidden=!0,Pe.focus()}),B.addEventListener("click",()=>{if(!m(F.value)){se.textContent="Paste a style from Copy style.",F.focus();return}N.hidden=!0,se.textContent="Style applied to this preview",Pe.focus()}),U.addEventListener("click",()=>{if(!me)return;let j=URL.createObjectURL(new Blob([me.header],{type:"text/plain"})),O=document.createElement("a");O.href=j,O.download="gallery-header-backup-"+me.collectionId+".txt",O.click(),setTimeout(()=>URL.revokeObjectURL(j),1e3)}),ae.addEventListener("click",async()=>{if(!ae.disabled){ae.disabled=Fe.disabled=!0,ee.inert=!0,ae.textContent="Saving\u2026",se.textContent="Saving to page header\u2026";try{await r(j=>{me=j,d||(U.hidden=!1)}),d||(se.textContent="Saved to page header")}catch(j){d||(se.textContent=j.message||"Save failed. Copy code is still available.")}finally{d||(ae.disabled=Fe.disabled=!1,ee.inert=!1,ae.textContent="Save to page")}}}),H.addEventListener("click",async()=>{let j=++S,O=s();try{await navigator.clipboard.writeText(O),!d&&j===S&&(se.textContent="Page code copied")}catch{if(d||j!==S)return;Se(!0),se.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",He),Ge({source:t,options:e}),te.focus({preventScroll:!0}),{element:h,update:Ge,destroy:Me}}var Cr,Na=X(()=>{_t();za();Cr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var $a,Fa=X(()=>{$a=`.gc-config-position{position:relative!important}
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
`});var Da={};Kt(Da,{startInline:()=>Yt});function lt(t,e={}){let i=Ct.get(t),n={...rt,...t==="spiral"?Xe:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:i.width,stageHeight:Ze(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,c]of Object.entries(e))a==="mobileCardWidth"||a==="mobileGap"?Number.isFinite(c)&&c>=0&&(n[a]=c):a!=="preset"&&Object.hasOwn(n,a)&&typeof c==typeof n[a]&&(n[a]=c);return n}function Oa(t){return Xt(t).flatMap(e=>e.fields).filter(e=>!Ha.has(e.key))}function Pr(t){let e=Object.fromEntries(Oa(t).map(({key:i})=>[i,t[i]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function Lr(t,e){let i;try{i=JSON.parse(t)}catch{return null}if(i?.format!=="gallery-studio-style"||i.version!==1||!Ct.has(i.preset)||!i.values||typeof i.values!="object"||Array.isArray(i.values))return null;let n=lt(i.preset);for(let a of Ha)n[a]=e[a];for(let a of Oa(n)){let c=i.values[a.key];if(c!==void 0){if(a.type==="range"){if(a.inherits&&c===null)continue;let r=a.percent&&i.values.spiralRiseUnit==="percent"?a.percent:a;if(!Number.isFinite(c)||c<r.min||c>r.max)return null}else{if(a.type==="checkbox"&&typeof c!="boolean")return null;if(a.type==="select"&&!a.choices.some(r=>r.value===c))return null}n[a.key]=c}}return n}function jr(t){return lt(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function Ra(t,e){let i=lt(e.preset),n={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};Ze(e.preset)&&(n.stageHeight=e.stageHeight);for(let c of Object.keys(i))e.colorSource==="section"&&Wa.has(c)||e[c]!==i[c]&&(n[c]=e[c]);let a={v:1,selector:t.selector,type:t.type,options:n};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(a,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Yt(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=window.self!==window.top&&window.frameElement?.id==="sqs-site-frame"&&!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let i=aa(),n=new Map(i.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),a=null,c=null,r=null,s=!1,o=[];function m(d,S){return d.mounted?d.mounted.instance.update({...S,previewScroll:!1}):d.mounted=Ut({selector:d.source.selector,type:d.source.type,options:S}),d.mounted&&(d.options={...S}),!!d.mounted}function k(d=!0){if(!c)return;let S=c;c=null,a?.destroy(),a=null,S.button?.setAttribute("aria-expanded","false"),d&&S.button?.focus({preventScroll:!0})}function p(d){k(),d.presets.clear(),d.installed?m(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function g(d){if(c===d){k();return}k(!1);let{source:S}=d;if(d.mounted||(S.items=st(S.root,S.type)),!S.items.length)return;let v=d.options||d.installed||lt("arc-tabs",S.type==="gallery"?{galleryWidth:"source"}:{});if(S.type==="gallery"&&v.preset==="stack"&&(v=lt("arc-tabs",{galleryWidth:"source"}),m(d,v)),!d.mounted&&!m(d,v)){d.button.textContent="No supported layout here";return}c=d;let u=h=>{m(d,h),d.presets.set(h.preset,{...h})};a=qa({source:S,options:{...d.options},onClose:()=>k(),onRestore:()=>p(d),onPreset:h=>{!Ct.has(h)||S.type==="gallery"&&h==="stack"||(d.presets.set(d.options.preset,{...d.options}),u({...d.presets.get(h)||lt(h),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),a.update({source:S,options:{...d.options}}))},onOption:(h,w)=>{if(!Object.hasOwn(d.options,h)||h==="preset")return;let R={...d.options,[h]:w};u(R)},getCode:()=>Ra(S,d.options),onSave:async h=>{if(s)throw Error("Another gallery is still saving. Please wait.");let w={...d.options},R=ei();s=!0;try{await ti({snippet:Ra(S,w),context:R,onBackup:h}),d.installed=w}finally{s=!1}},getStyle:()=>Pr(d.options),applyStyle:h=>{let w=Lr(h,d.options);return!w||S.type==="gallery"&&w.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),u(w),a.update({source:S,options:d.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let S=JSON.parse(d.textContent),v=document.querySelectorAll(S.selector),u=v.length===1&&n.get(v[0]);if(!u||S.v!==1||S.type!==u.source.type||!Ct.has(S.options?.preset))continue;u.installed=jr(S.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of n.values())d.installed&&m(d,d.installed);if(t&&n.size){let S=function(h=!1){d.setAttribute("aria-pressed",String(h)),d.querySelector("span").textContent=h?"Edit native content":"Preview galleries",d.hidden=!ct()||![...n.values()].some(w=>w.mounted)},v=function(h){if(!h.mounted||h.source.root.isConnected)return;let w=h.source.root,R=document.querySelectorAll(h.source.selector);if(R.length!==1)return;let I=R[0];h.mounted.destroy(),h.mounted=null,h.source.root=I,n.delete(w),n.set(I,h),m(h,h.options);let y=I.querySelector(h.source.type==="list"?".user-items-list":".sqs-block-content")||I;h.button&&(getComputedStyle(y).position==="static"&&y.classList.add("gc-config-position"),y.append(h.button))};r=document.createElement("style"),r.textContent=$a,document.head.append(r);let d=document.createElement("button");d.type="button",d.className="gc-edit-eye",d.setAttribute("aria-label","Preview gallery layouts"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>',d.onclick=()=>{let h=d.getAttribute("aria-pressed")!=="true";for(let w of[...n.values()])v(w),w.mounted?.instance.setEditPreview(h);S(h)},document.body.append(d),S();let u=Gt(h=>{h||requestAnimationFrame(()=>{if(d.isConnected)for(let w of[...n.values()])v(w)}),S()});o.push(()=>{u(),d.remove()});for(let h of n.values()){let{source:w}=h;if(!w.selector)continue;let R=w.root.querySelector(w.type==="list"?".user-items-list":".sqs-block-content")||w.root,I=getComputedStyle(R).position==="static";I&&R.classList.add("gc-config-position");let y=document.createElement("button");y.type="button",y.className="gc-config-launch",y.setAttribute("aria-expanded","false"),y.setAttribute("aria-label","Configure "+w.name+" layout"),y.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',w.items.length||(y.disabled=!0,y.title="Add images in Squarespace to configure this source."),y.addEventListener("click",()=>g(h)),R.append(y),h.button=y,o.push(()=>{y.remove(),I&&R.classList.remove("gc-config-position")})}}let C={version:1,destroy(){k(!1);for(let d of n.values())d.mounted?.destroy();for(let d of o)d();r?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=C,C}var Ct,Wa,Ha,Ba=X(()=>{ii();_t();Ot();Na();Fa();Ct=new Map(ft.map(t=>[t.id,t])),Wa=new Set(["background","ink","accent","borderColor","overlayColor"]);Ha=new Set([...Wa,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Yt,{once:!0}):Yt()});var zr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(zr=(await Promise.resolve().then(()=>(Ba(),Da))).startInline);export{zr as startInline};

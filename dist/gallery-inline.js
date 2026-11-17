var Ra=Object.defineProperty;var Y=(t,e)=>()=>(t&&(e=t(t=0)),e);var Vt=(t,e)=>{for(var i in e)Ra(t,i,{get:e[i],enumerable:!0})};function Ct(t){return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Ha[t]}</svg>`}function Ne(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Ct("play")+Ct("pause"):Ct(e),t}var Ha,ft=Y(()=>{Ha={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Ee(t,e,i){let s=document.createElement(t);return s.className=e,i!==void 0&&(s.textContent=i),s}function ot(t,e,i){let s=Ee("button",t,i);return s.type="button",s.setAttribute("aria-label",e),s}function Da(t,e,i,s,a,c){let r=i/2,n=s/2,o=.26,b=e/2+48,y=(i*Math.cos(o)+c)/(2*Math.sin(o)),g=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-a)*.7),i*(3.8-a*2.1),n+Math.max(y,b/Math.sin(Math.PI/3))),f=g-n,d=Math.atan2(r,f),m=Math.hypot(r,f),C=2*(d+Math.asin(c/(2*m))),S=d+Math.asin(b/m),p=g+n,L=Math.hypot(p,r)-p,P=f-Math.sqrt((f-b)*(f+b));return{radius:g,step:C,reach:S/C,above:L,below:P}}function Ba(t,e,i){let s=e/2,a=10+i*9,c=0,r=0;for(let n=0;n<4.1;n+=.5){let o=Math.min(4.1,n+.5),b=Math.max(.48,1-n*(.09+i*.035)),y=(o*(4+i*7)+(n===0?4:0))*Math.PI/180,g=b*(s+t/2*Math.sin(y))-s;c=Math.max(c,g-Math.min(n,4)*a),r=Math.max(r,g+Math.min(o,4)*a)}return{above:c,below:r}}function Jt({host:t,items:e=[],initialIndex:i=0,options:s={},makeCard:a,onChange:c,nativeList:r,loadImage:n}){let o=Oa.has(s.preset)?s.preset:"infinite",b=o==="arc"||o==="arc-tabs",y=b||o==="showcase",g=e.length,f=!!s.reducedMotion,d=je(Qe(s.depth,55),0,100)/100,m,C,S;function p(l){m=je(Qe(l.gap,24),0,180),C=je(Qe(l.cardWidth,o==="timed"?760:380),80,1800),S=l.phoneWidthOverride}p(s);let L=je(Qe(s.duration,5),1,60)*1e3,P=Ee("section",`gc-carousel gc-preset-${o}`);P.setAttribute("aria-roledescription","carousel"),P.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[o]),P.style.setProperty("--gc-card-radius",`${je(Qe(s.radius,14),0,120)}px`),P.style.setProperty("--gc-stage-height",`${je(Qe(s.stageHeight,0),0,1400)}px`),f&&P.classList.add("gc-reduced-motion");let G=[],T=(l,h,x,j)=>{l.addEventListener(h,x,j),G.push(()=>l.removeEventListener(h,x,j))},k=[],w=[],A=s.navigation==="dots"||s.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),v=o==="arc-tabs"||o==="timed"&&!A,M=Ee("nav","gc-carousel-tabs");A&&M.classList.add("gc-choice-dots"),M.setAttribute("aria-label","Choose a slide"),v&&(e.forEach((l,h)=>{let j=(typeof l.title=="string"?l.title.trim():"")||`Slide ${h+1}`,H=A?ot("gc-choice-dot",j):ot("gc-carousel-tab",j,j);T(H,"click",()=>Fe(h)),T(H,"keydown",q=>{let D;q.key==="ArrowRight"&&(D=Ze(h+1,g)),q.key==="ArrowLeft"&&(D=Ze(h-1,g)),q.key==="Home"&&(D=0),q.key==="End"&&(D=g-1),D!==void 0&&(q.preventDefault(),Fe(D),k[D]?.focus({preventScroll:!0}))}),M.append(H),k.push(H)}),P.append(M));let u=Ee("div","gc-carousel-stage");u.tabIndex=g?0:-1,u.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let E=r?.track??Ee("div","gc-carousel-track");E.classList.add("gc-carousel-track"),u.append(E),P.append(u);function R(l){let h=a(e[l],l,{caption:s.showTitles!==!1,description:o==="arc-tabs"||o==="timed"});h.classList.add("gc-carousel-card"),h.dataset.gcItemIndex=String(l),h.style.width="var(--gc-carousel-slot-width)",h.tabIndex=-1,h.setAttribute("aria-hidden","true"),r||h.querySelectorAll("img").forEach(j=>{j.draggable=!1,j.style.objectFit=s.fit==="contain"?"contain":"cover"});let x=r?.slot(h)??h;return E.append(x),{card:h,node:x,index:l,logical:l,active:!1}}let ge=e.map((l,h)=>R(h)),$=new Map,oe=!1,he=Ee("div","gc-carousel-controls"),ce=Ee("div","gc-carousel-counter");ce.setAttribute("aria-hidden","true");let ye=Ee("span","gc-carousel-current",g?"01":"00");ce.append(ye,Ee("span","gc-carousel-divider","/"),Ee("span","gc-carousel-total",String(g).padStart(2,"0")));let ve=Ee("div","gc-carousel-arrows"),I=Ne(ot("gc-carousel-arrow","Previous slide"),"previous"),N=Ne(ot("gc-carousel-arrow","Next slide"),"next");I.disabled=N.disabled=g<2,ve.append(I,N);let B=Ne(ot("gc-carousel-playback","Play slideshow"),"playback");B.hidden=g<2||f;let V=Ee("div","gc-carousel-pagination");V.setAttribute("aria-label","Slide pagination"),o==="timed"&&e.forEach((l,h)=>{let x=ot("gc-carousel-dot",l.title?.trim()||`Go to slide ${h+1}`),j=Ee("span","gc-carousel-dot-fill");j.setAttribute("aria-hidden","true"),x.append(j),T(x,"click",()=>Fe(h)),V.append(x),w.push({dot:x,fill:j})}),he.append(ce,ve),o==="timed"&&he.append(V),he.append(B),P.append(he);let Z=Ee("p","gc-carousel-sr");Z.setAttribute("aria-atomic","true"),P.append(Z);let J=Ee("span","gc-carousel-cursor","Drag");J.setAttribute("aria-hidden","true"),(o==="arc-tabs"||o==="showcase"||o==="arc")&&u.append(J),t.append(P);let te=!1,F=i,X=i,ne=-1,se=0,U=0,re=0,O=!!s.autoplay&&!f&&g>1,Pe=!1,we=!1,Ue=!1,We=!1,Q=null,qe=0,_=0,$e=0,ae=0,Re=()=>Math.max(12,ae*(.36-d*.12)+m-28),z=-1,W,K=1,ie=0,fe=0,be=()=>We||Pe||we||Ue||document.hidden||!!Q,me=l=>{let h=Ze(Math.round(F),g),x=Ze(l-h,g);return x>g/2&&(x-=g),Math.round(F)+x};function Se(){let l=k[ne];if(!l)return;let h=l.offsetLeft,x=h+l.offsetWidth;h<M.scrollLeft?M.scrollLeft=Math.max(0,h-14):x>M.scrollLeft+M.clientWidth&&(M.scrollLeft=x-M.clientWidth+14)}function He(){let l=g?Ze(Math.round(F),g):-1;if(l===ne)return;ne=l,ye.textContent=g?String(l+1).padStart(2,"0"):"00",k.forEach((x,j)=>{x.classList.toggle("is-active",j===l),x.setAttribute("aria-pressed",String(j===l))}),Se(),w.forEach(({dot:x},j)=>{x.classList.toggle("is-active",j===l),j===l?x.setAttribute("aria-current","true"):x.removeAttribute("aria-current")});let h=e[l]?.title;Z.textContent=g?`${l+1} of ${g}${h?`: ${h}`:""}`:"No gallery items",l>=0&&c?.(l)}function le(){if(te||!_)return;He();let l=Math.abs(X-F)>.002;P.classList.toggle("is-moving",l||!!Q);let h=[...ge];for(let x of ge)x.logical=x.index+Math.round((F-x.index)/g)*g;if(g>1){let x=ae+m,j=o==="infinite"&&_>660?_*.61:_/2,H=(j+ae/2+40)/x,q=(_-j+ae/2+40)/x;b?H=q=W.reach:o==="showcase"&&(H=q=Math.min(4.1,(_/2+ae)/Re()));let D=Math.ceil(F-H),de=Math.floor(F+q);for(let[pe,ue]of $)(pe<D||pe>de||ge[ue.index].logical===pe)&&(ue.node.remove(),$.delete(pe));for(let pe=D;pe<=de;pe++){let ue=Ze(pe,g);if(ge[ue].logical===pe)continue;let xe=$.get(pe);xe||(xe=R(ue),xe.logical=pe,$.set(pe,xe),oe&&n&&xe.card.querySelectorAll("img").forEach(Ce=>n(Ce,{nativeCard:!!r}))),h.push(xe)}}h.forEach(x=>{let j=g===1?0:x.logical-F,H=Math.abs(j),q=x.logical===Math.round(F),D=_/2,de=0,pe=0,ue=1,xe=1,Ce=!0,Oe=0,Ie=0;if(o==="infinite")D=(_>660?_*.61:_/2)+j*(ae+m),xe=1-Math.min(1,H)*.68,Ce=D+ae/2>-40&&D-ae/2<_+40;else if(o==="timed")D+=j*(ae+m),ue=1-Math.min(H,1)*.035,Ce=D+ae/2>-40&&D-ae/2<_+40;else if(o==="showcase")D+=j*Re(),de+=Math.min(H,4)*(10+d*9),ue=Math.max(.48,1-H*(.09+d*.035)),pe=j*(4+d*7),Ie=-j*(3+d*4),xe=je(1-H*.19,0,1),Ce=H<4.1,q&&!f&&(Oe=fe,Ie+=ie,pe+=je(X-F,-1,1)*-3);else{let _e=j*W.step;D+=W.radius*Math.sin(_e),de=W.radius*(1-Math.cos(_e)),pe=_e*180/Math.PI,Ce=H<=W.reach,xe=o==="arc-tabs"?1-Math.min(H,1)*.16:1}x.card.style.transform=`translate3d(${D}px,${de}px,0) translateX(-50%) rotate(${pe}deg) rotateX(${Oe}deg) rotateY(${Ie}deg) scale(${ue})`,x.card.style.zIndex=String(1e3-Math.round(H*100)),x.card.style.opacity=String(xe),x.card.style.visibility=Ce?"visible":"hidden",x.card.style.pointerEvents=Ce&&xe>.08?"auto":"none",x.active!==q&&(x.active=q,x.card.classList.toggle("is-active",q)),x.card.tabIndex=q?0:-1,x.card.setAttribute("aria-hidden",String(!q)),r?.syncFocus(x.card)}),w.forEach(({fill:x},j)=>{x.style.transform=`scaleX(${j===ne?je(re/L,0,1):0})`})}function Me(){let l=_;_=u.clientWidth;let h=S?1:o==="timed"?.86:o==="infinite"&&_>660?.48:.76,x=Math.max(80,Math.min(C,_*h));if(x!==ae&&(ae=x,E.style.setProperty("--gc-carousel-slot-width",`${ae}px`)),y){let j=E.offsetHeight;if(_!==l||j!==z){z=j,b&&(W=Da(o,_,ae,z,d,m));let H=W??Ba(ae,z,d);g>1&&(u.style.setProperty("--gc-sweep-above",Math.ceil(H.above)+"px"),u.style.setProperty("--gc-sweep-below",Math.ceil(H.below)+"px"))}}$e=u.clientHeight,K=b?W.radius*W.step:o==="showcase"?ae*.54:ae+m,le()}function ze(){!te&&!se&&(se=requestAnimationFrame(it))}function it(l){if(se=0,te)return;let h=U?je(l-U,0,64):0;U=l,Q||(f?F=X:F+=(X-F)*(1-Math.exp(-h/85)),Math.abs(X-F)<5e-4&&(F=X));let x=Math.abs(X-F)<.002&&!Q;O&&!be()&&x&&(re+=h,re>=L&&(re=0,X=Math.round(F)+1)),le(),Math.abs(X-F)>5e-4||O&&!be()?ze():U=0}function Fe(l){te||g<2||(X=me(Ze(Math.round(Qe(l,0)),g)),re=0,f&&(F=X),le(),ze())}function ct(l){g<2||(X=Math.round(X)+l,re=0,f&&(F=X),le(),ze())}function at(l){O=!!l&&!f&&g>1,B.dataset.paused=String(!O),B.setAttribute("aria-label",O?"Pause slideshow":"Play slideshow"),B.setAttribute("aria-pressed",String(O)),Z.setAttribute("aria-live",O?"off":"polite"),P.classList.toggle("is-playing",O),U=0,ze()}function Le(l){We=!!l,U=0,ze()}T(I,"click",()=>ct(-1)),T(N,"click",()=>ct(1)),T(B,"click",()=>at(!O)),T(u,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),u.focus({preventScroll:!0}),ct(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),u.focus({preventScroll:!0}),Fe(l.key==="Home"?0:g-1))}),T(u,"pointerdown",l=>{g<2||l.button!==0||!l.isPrimary||(Q={id:l.pointerId,x:l.clientX,y:l.clientY,start:F,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},X=F,re=0)}),T(u,"pointermove",l=>{let h=u.getBoundingClientRect(),x=h.width/Math.max(1,u.clientWidth)||1,j=(l.clientX-h.left)/x,H=(l.clientY-h.top)/x;if(J.style.left=`${j}px`,J.style.top=`${H}px`,l.pointerType==="mouse"&&u.classList.add("has-pointer"),!Q){o==="showcase"&&!f&&(ie=je((j-_/2)/ae,-1,1)*4,fe=je((H-$e/2)/$e,-.5,.5)*-5,le());return}if(l.pointerId!==Q.id)return;let q=l.clientX-Q.x,D=l.clientY-Q.y;if(!Q.axis&&Math.hypot(q,D)>6&&(Q.axis=Math.abs(q)>Math.abs(D)?"horizontal":"vertical",Q.axis==="horizontal"&&(u.setPointerCapture(l.pointerId),u.classList.add("is-dragging"))),Q.axis!=="horizontal")return;l.preventDefault(),Q.moved=!0;let de=performance.now(),pe=Math.max(8,de-Q.lastTime),ue=-(l.clientX-Q.lastX)/x/K/pe;Q.velocity=Q.velocity*.45+ue*.55,Q.lastX=l.clientX,Q.lastTime=de,F=Q.start-q/x/K,X=F,le()},{passive:!1});function Ke(l){if(!Q||l.pointerId!==Q.id)return;let h=Q;if(Q=null,u.hasPointerCapture(l.pointerId)&&u.releasePointerCapture(l.pointerId),u.classList.remove("is-dragging"),h.moved){qe=performance.now()+400;let x=performance.now()-h.lastTime,j=f||l.type==="pointercancel"||x>120?0:je(h.velocity*210,-4,4);X=Math.round(F+j)}else X=Math.round(F);f&&(F=X),ze()}T(u,"pointerup",Ke),T(u,"pointercancel",Ke),T(window,"pointerup",Ke),T(u,"lostpointercapture",l=>{Q?.id===l.pointerId&&Ke(l)}),T(u,"dragstart",l=>l.preventDefault()),T(u,"click",l=>{if(performance.now()<qe){l.preventDefault(),l.stopImmediatePropagation();return}let h=l.target.closest(".gc-carousel-card");!h||!u.contains(h)||h.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Fe(Number(h.dataset.gcItemIndex)))},!0),T(u,"pointerleave",()=>{u.classList.remove("has-pointer"),ie=fe=0,Q||le()}),T(P,"pointerenter",l=>{l.pointerType==="mouse"&&(Pe=!0)}),T(P,"pointerleave",()=>{Pe=!1,U=0,ze()}),T(P,"focusin",()=>{we=!0}),T(P,"focusout",()=>{queueMicrotask(()=>{te||(we=P.contains(document.activeElement),U=0,ze())})}),T(document,"visibilitychange",()=>{U=0,ze()});let Te;typeof ResizeObserver<"u"?(Te=new ResizeObserver(l=>{l.some(({target:h})=>h===u||h===E)&&Me(),v&&l.some(({target:h})=>h!==u&&h!==E)&&Se()}),Te.observe(u),y&&Te.observe(E),v&&(Te.observe(M),k.forEach(l=>Te.observe(l,{box:"border-box"})))):T(window,"resize",()=>{Me(),Se()});let rt;return typeof IntersectionObserver<"u"&&(rt=new IntersectionObserver(l=>{Ue=!l[0]?.isIntersecting,U=0,ze()}),rt.observe(P)),Me(),oe=!0,at(O),{goTo:Fe,setGeometry(l){p(l),z=-1,Me()},setPlaying:at,setSuspended:Le,destroy(){te=!0,cancelAnimationFrame(se),Te?.disconnect(),rt?.disconnect(),G.forEach(l=>l()),P.remove()}}}var Oa,je,Ze,Qe,Kt=Y(()=>{ft();Oa=new Set(["infinite","arc","arc-tabs","showcase","timed"]),je=(t,e,i)=>Math.min(i,Math.max(e,t)),Ze=(t,e)=>(t%e+e)%e,Qe=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Zt(t){let{host:e,makeCard:i,nativeList:s}=t,a=Array.isArray(t.items)?t.items:[],c=t.options||{},r=["wall","ring","angled"].includes(c.preset)?c.preset:"wall",n=!!c.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=a.length,b=r==="ring"?16:r==="wall"?12:o,y=!n&&o>1&&o<12&&r!=="angled"?Math.ceil(b/o)*o:o,g=Array.from({length:o},(l,h)=>h),f=De(Xe(c.depth,55),0,100),d=De(Xe(c.cardWidth,280),80,900),m=De(Xe(c.gap,24),0,160),C=Math.max(1,Xe(c.duration,5)),S=new AbortController,p=(l,h,x,j={})=>l.addEventListener(h,x,{...j,signal:S.signal}),L={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},P=`gc-spatial-help-${++Ga}`,G=["gc-spatial",`gc-${r}`,...n?["gc-spatial-reduced"]:[]];e.classList.add(...G);let T=new Map,k=(l,h)=>{T.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,h)};k("--gc-spatial-height",`${De(Xe(c.stageHeight,620),300,1400)}px`),k("--gc-spatial-radius",`${De(Xe(c.radius,18),0,100)}px`),k("--gc-spatial-fit",c.fit==="contain"?"contain":"cover"),k("--gc-spatial-card-width",`${d}px`),k("--gc-spatial-gap",`${m}px`);let w=s?.track??document.createElement("div");w.classList.add("gc-spatial-canvas"),s&&w.classList.add("gc-spatial-native-track"),w.setAttribute("role",s?"list":"group"),w.setAttribute("aria-label",L[r]),w.setAttribute("aria-describedby",P);let A=document.createElement("p");A.id=P,A.className="gc-spatial-sr",A.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let v=document.createElement("span");v.className="gc-spatial-sr",v.setAttribute("aria-live","polite"),v.setAttribute("aria-atomic","true"),e.append(A,w,v);let M=c.showTitles!==!1&&(r!=="ring"||n||o===1),u=Array.from({length:y},(l,h)=>{let x=h%o,j=a[x],H=i(j,x,{caption:M,description:!1,thumbnail:!0}),q=s?.slot(H)??document.createElement("div");return q.classList.add("gc-spatial-position"),H.classList.add("gc-spatial-card"),H.dataset.spatialIndex=String(h),H.dataset.spatialSourceIndex=String(x),H.tabIndex=h===0?0:-1,h>=o&&H.setAttribute("aria-hidden","true"),!H.getAttribute("aria-label")&&!H.textContent.trim()&&H.setAttribute("aria-label",`View item ${x+1}`),q.contains(H)||q.append(H),q.parentNode!==w&&w.append(q),{position:q,card:H,sourceIndex:x,x:0,y:0,flip:0,tilt:0,lift:0}}),E=document.createElement("div");E.className="gc-spatial-nav";let R=(l,h)=>{let x=document.createElement("button");return x.type="button",x.className="gc-spatial-control",x.setAttribute("aria-label",h),Ne(x,l)},ge=R("previous","Previous item"),$=R("next","Next item"),oe=document.createElement("span");oe.className="gc-spatial-count",oe.setAttribute("aria-hidden","true"),E.append(ge,oe,$);let he=c.autoplay&&!n?R("playback","Pause gallery motion"):null;he&&(he.disabled=o<2,he.dataset.paused=String(o<2),he.disabled&&he.setAttribute("aria-label","Play gallery motion"),E.append(he)),e.append(E),ge.disabled=$.disabled=o<2;let ce,ye;if(r==="ring"&&o>1&&!n){ce=document.createElement("div"),ce.className="gc-ring-center",ce.setAttribute("aria-hidden","true"),c.showTitles!==!1&&(ye=document.createElement("span"),ye.className="gc-ring-label",ce.append(ye));let l=document.createElement("span");l.textContent="Drag to explore",ce.append(l),w.after(ce)}let ve;o||(ve=document.createElement(s?"li":"p"),ve.className="gc-spatial-empty",ve.textContent="No items available.",w.append(ve));let I=!1,N=0,B=-1,V=1,Z=1,J=1,te=1,F=1,X=1,ne=0,se=1,U=1,re=0,O=0,Pe=1,we=!!c.autoplay&&!n&&o>1,Ue=!1,We=!1,Q=!1,qe=!0,_=null,$e=0,ae=0,Re=0,z=-1,W=!1,K={x:-1e4,y:-1e4,inside:!1};function ie(l=N){if(!ye)return;let h=typeof a[l]?.title=="string"?a[l].title.trim():"";ye.textContent===h&&ye.hidden===!h||(ye.textContent=h,ye.hidden=!h,fe())}function fe(){!ce||I||(ce.classList.remove("is-below"),ce.offsetHeight>ne&&ce.classList.add("is-below"))}function be(l,h=!1,x=null){if(!o){oe.textContent="00 / 00";return}let j=et(l,o),H=x!==null&&u[x]?.sourceIndex===j,q=H&&g[j]!==x;if(H){let D=u[g[j]].card;g[j]=x,q&&(u[x].card.removeAttribute("aria-hidden"),s?.syncFocus(u[x].card),document.activeElement===D&&(W=!0,u[x].card.focus({preventScroll:!0}),W=!1))}if(B===j&&!q){h&&(v.textContent=`Item ${j+1} of ${o}${a[j].title?`: ${a[j].title}`:""}`);return}N=j,ie(),oe.textContent=`${String(N+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`,u.forEach(({card:D,sourceIndex:de},pe)=>{let ue=g[de]===pe;D.tabIndex=ue&&de===N?0:-1,D.classList.toggle("is-selected",ue&&de===N),ue?D.removeAttribute("aria-hidden"):D.setAttribute("aria-hidden","true"),s?.syncFocus(D)}),h&&(v.textContent=`Item ${N+1} of ${o}${a[N].title?`: ${a[N].title}`:""}`),B!==N&&(B=N,t.onChange?.(N))}function me(l){we=!!l&&!n&&o>1,he&&(he.dataset.paused=String(!we),he.setAttribute("aria-label",we?"Pause gallery motion":"Play gallery motion")),Le()}function Se(l){Ue=!!l,Ue||Le()}function He(l,h,x){return h+Math.round((l-h)/x)*x}function le(l){let h={index:g[l],target:l,distance:1/0};return u.forEach((x,j)=>{if(x.sourceIndex!==l)return;let H=j;if(r==="ring")H=He(re,j,y);else if(r==="wall"){let D=Math.floor(j/se);H=U>2?He(re,D,U):D}let q=Math.abs(H-re);q<h.distance&&(h={index:j,target:H,distance:q})}),h}function Me(l){let h=l.getBoundingClientRect();return h.left+h.width/2}function ze(){if(o<2)return;let l=Me(u[0].position),h=Me(u[1].position)-l;if(Math.abs(h)<1)return;let x=De(Math.round((Me(w)-l)/h),0,o-1);be(x,!1,x)}function it(l,h=!1){if(!o)return;let x=et(Math.round(Xe(l,0)),o),j=n?{index:x,target:x}:le(x);if(be(x,!0,j.index),n){let H=u[x].position;w.scrollTo({left:w.scrollLeft+Me(H)-Me(w),behavior:"auto"})}else O=j.target;h&&u[j.index].card.focus({preventScroll:!0}),Le()}function Fe(){if(!I){if(V=Math.max(1,w.clientWidth),Z=Math.max(1,w.clientHeight),r==="ring"){let l=Math.max(80,Math.min(V-32,Z-42)),h=De(Xe(c.ringDiameter,l),80,l);X=Math.max(0,h*.38);let x=At*X/Math.max(1,y),j=Math.min(h*.17,x*.8),H=1.15-De(m,0,100)/160;if(J=o<=1?Math.min(d,V*.65,Z*.58):Math.max(18,Math.min(Math.min(d*.22,j)*H,x*.94)),te=J*1.28,ce){let q=Math.max(0,X-Math.max(32,te)/2-10);ne=Math.floor(q*Math.SQRT2),ce.style.setProperty("--gc-ring-label-width",`${ne}px`),ce.style.setProperty("--gc-ring-label-y",`${w.offsetTop+Z/2}px`),fe()}F=Math.max(24,At*Math.max(1,X)/Math.max(1,y))}else r==="wall"?(se=y>=10?3:y>=4?2:1,U=Math.max(1,Math.ceil(y/se)),te=Math.min((Z-56-(se-1)*m)/se,d*.62,230),J=Math.max(60,Math.min(te*1.5,d,V*.43)),te=J/1.5,F=J+Math.min(m,70)):(J=Math.min(d,V*.68,(Z-70)*.76),te=J/.76,F=J*(.72+(100-f)*.001)+m);u.forEach(({position:l})=>{l.style.width=`${Math.max(24,J)}px`,l.style.height=`${Math.max(32,te)}px`}),n&&u.forEach(({position:l})=>{l.style.width=`${Math.min(d,V*.72)}px`,l.style.height=`${Math.min(Z-40,d*1.15)}px`}),Le()}}function ct(l){if(n||!o||Ue)return!1;let h=we&&!We&&!Q&&!_&&qe&&!document.hidden;if(h){let q=l/C;r==="angled"?(O+=q*Pe,O>=o-1&&(O=o-1,Pe=-1),O<=0&&(O=0,Pe=1)):O+=q}let x=_?.moved?1:1-Math.exp(-l*11);re+=(O-re)*x,Math.abs(O-re)<1e-4&&(re=O);let j=Math.abs(O-re)>1e-4||h;if(h||_?.moved){let q=_?.moved?re:O,D=r==="wall"?Math.round(q)*se+g[N]%se:Math.round(q),de=r==="wall"?Math.min(et(D,U*se),y-1):et(D,y);be(u[de].sourceIndex,!1,de)}let H=1-Math.exp(-l*13);return u.forEach((q,D)=>{let{position:de,card:pe}=q;if(r==="ring"){let ue=-Math.PI/2+(D-re)*At/y;q.x=o===1?0:Math.cos(ue)*X,q.y=o===1?0:Math.sin(ue)*X;let xe=Math.hypot(K.x-(V/2+q.x),K.y-(Z/2+q.y)),Ce=Math.max(65,J*2.6),Oe=K.inside&&!_?.moved?Math.max(0,1-xe/Ce):0,Ie=Oe*Oe*(50+f*1.3);q.flip+=(Ie-q.flip)*H,Math.abs(q.flip-Ie)>.05&&(j=!0);let _e=o===1?0:ue*180/Math.PI+90;de.style.transform=`translate3d(${q.x}px,${q.y}px,0) rotate(${_e}deg)`,pe.style.transform=`perspective(700px) rotateY(${q.flip}deg) translateZ(${Oe*12}px)`,de.style.zIndex=String(D===z?y+2:1)}else if(r==="wall"){let ue=D%se,Ce=Math.floor(D/se)-re;if(U>2){let Wa=U%2===0?.5:0;Ce=et(Ce-Wa+U/2,U)-U/2}let Oe=Math.min(.68,2.6/Math.max(3,U)),Ie=Ce*Oe,_e=Math.max(F/Oe,V*.4),Xt=f/100,Fa=Math.sin(Ie)*_e,Yt=(1-Math.cos(Ie))*_e*Xt*.65,Na=(ue-(se-1)/2)*(te+Math.min(m,50)),Mt=D===z||Q&&D===g[N]?1:0;q.lift+=(Mt-q.lift)*H,Math.abs(Mt-q.lift)>.002&&(j=!0),de.style.transform=`translate3d(${Fa}px,${Na}px,${Yt+q.lift*20}px) rotateY(${-Ie*180/Math.PI*Xt}deg)`,de.style.zIndex=String(Math.round(Yt)+(Mt?1e3:1)),pe.style.transform=`scale(${1+q.lift*.035})`,de.style.opacity=Math.abs(Ie)>1.6?"0":"1",de.style.visibility=Math.abs(Ie)>1.6?"hidden":"visible"}else{let ue=D-re,xe=D===z||Q&&D===g[N]?1:0;q.lift+=(xe-q.lift)*H,Math.abs(xe-q.lift)>.002&&(j=!0);let Ce=-(25+f*.28)*(1-q.lift);de.style.transform=`translate3d(${ue*F}px,${-q.lift*14}px,${q.lift*110}px) rotateY(${Ce}deg)`,de.style.zIndex=String(xe?o+2:o-D),pe.style.transform="none"}}),j}function at(l){if(ae=0,I)return;let h=Math.min(.05,Math.max(.001,(l-(Re||l-16.7))/1e3));Re=l,ct(h)&&qe&&!document.hidden?ae=requestAnimationFrame(at):Re=0}function Le(){!I&&!ae&&!n&&(ae=requestAnimationFrame(at))}n&&p(w,"scroll",ze,{passive:!0}),p(ge,"click",()=>it(N-1)),p($,"click",()=>it(N+1)),he&&p(he,"click",()=>me(!we)),p(w,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let h=l.key==="Home"?0:l.key==="End"?o-1:N+(l.key==="ArrowRight"?1:-1);it(h,!0)}),p(w,"focusin",l=>{Q=!0;let h=l.target.closest?.("[data-spatial-index]");h&&!W&&be(Number(h.dataset.spatialSourceIndex),!1,Number(h.dataset.spatialIndex)),Le()}),p(w,"focusout",()=>{queueMicrotask(()=>{I||(Q=w.contains(document.activeElement),Le())})}),p(w,"pointerenter",l=>{l.pointerType!=="touch"&&(We=!0,K.inside=!0,Le())}),p(w,"pointerleave",()=>{We=!1,K.inside=!1,z=-1,ie(),Le()}),p(w,"pointermove",l=>{if(l.pointerType==="touch")return;let h=w.getBoundingClientRect();K.x=l.clientX-h.left,K.y=l.clientY-h.top,K.inside=!0;let x=l.target.closest?.("[data-spatial-index]");z=x?Number(x.dataset.spatialIndex):-1,ie(z>=0?u[z].sourceIndex:N),Le()}),p(w,"pointerdown",l=>{let h=l.target.closest?.("[data-spatial-index]");h&&be(Number(h.dataset.spatialSourceIndex),!1,Number(h.dataset.spatialIndex)),!(n||o<2||l.pointerType==="mouse"&&l.button!==0)&&(_={id:l.pointerId,x:l.clientX,y:l.clientY,start:O,moved:!1})}),p(window,"pointermove",l=>{if(!_||l.pointerId!==_.id)return;let h=l.clientX-_.x,x=l.clientY-_.y;if(!_.moved){if(Math.abs(x)>12&&Math.abs(x)>Math.abs(h)*1.2){_=null;return}if(Math.abs(h)<7)return;_.moved=!0,w.classList.add("is-dragging"),w.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),O=_.start-h/F,(r==="angled"||r==="wall"&&U<=2)&&(O=De(O,0,r==="wall"?U-1:o-1)),Le()},{passive:!1});let Ke=l=>{if(!_||l.pointerId!==_.id)return;let h=_.moved;if(_=null,w.classList.remove("is-dragging"),w.hasPointerCapture?.(l.pointerId)&&w.releasePointerCapture(l.pointerId),h){$e=performance.now()+350,O=Math.round(O);let x=r==="wall"?Math.round(O)*se+g[N]%se:Math.round(O),j=r==="wall"?Math.min(et(x,U*se),y-1):et(x,y);be(u[j].sourceIndex,!0,j)}Le()};p(window,"pointerup",Ke),p(window,"pointercancel",Ke),p(w,"click",l=>{performance.now()<$e&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),p(w,"dragstart",l=>l.preventDefault()),p(document,"visibilitychange",Le);let Te=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(h=>h.target===w)?Fe():fe()}):null;Te?.observe(w),ce&&Te?.observe(ce),Te||p(window,"resize",Fe);let rt=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{qe=l[0]?.isIntersecting??!0,qe&&Le()},{rootMargin:"100px"}):null;return rt?.observe(e),Fe(),be(0),{goTo:it,setPlaying:me,setSuspended:Se,destroy(){I||(I=!0,cancelAnimationFrame(ae),Te?.disconnect(),rt?.disconnect(),S.abort(),A.remove(),v.remove(),E.remove(),ce?.remove(),s?ve?.remove():w.remove(),e.classList.remove(...G),T.forEach((l,h)=>l?e.style.setProperty(h,l):e.style.removeProperty(h)))}}}var Ga,De,et,Xe,At,Qt=Y(()=>{ft();Ga=0,De=(t,e,i)=>Math.max(e,Math.min(i,t)),et=(t,e)=>(t%e+e)%e,Xe=(t,e)=>Number.isFinite(Number(t))?Number(t):e,At=Math.PI*2});function ei({host:t,items:e,options:i,makeCard:s,onChange:a,nativeList:c}){let r=Number(i.stageHeight)||680,n=Math.max(300,r-120),o=Math.max(0,Number(i.gap)||0),b=Number.isFinite(Number(i.depth))?Number(i.depth):45,y=i.previewScroll===!1,g=y?window:t;t.classList.add("gc-stack"),t.style.height=y?"auto":r+"px",t.style.overflowY=y?"visible":"auto",t.style.overscrollBehavior=y?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let f=c?.track??document.createElement("div");f.classList.add("gc-stack-track"),t.append(f);let d=e.map((G,T)=>{let k=s(G,T,{caption:i.showTitles,description:!0}),w=c?.slot(k)??document.createElement("div");w.classList.add("gc-stack-slot"),k.parentElement!==w&&w.append(k),f.append(w),w.style.zIndex=T+1,k.style.width=`min(${i.stackCardWidth}px,calc(100% - 48px))`,k.style.minHeight=n+"px";let A=k.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),v=!Array.from(A).some(M=>!M.closest("[hidden]")&&M.textContent.trim());return k.classList.toggle("gc-stack-image-only",v),{card:k,wrap:w,imageOnly:v,start:0,duration:1/0}}),m=0;function C(){return y?-f.getBoundingClientRect().top:t.scrollTop}function S(){m=0;let G=C(),T=0;d.forEach(({card:k,start:w,duration:A},v)=>{let M=Math.max(0,Math.min(1,(G-w)/A));k.style.transform=i.reducedMotion?"none":`perspective(1300px) translateY(${M*-32}px) scale(${1-M*.14}) rotateX(${M*b*.25}deg)`,k.style.filter=`brightness(${1-M*.23})`,M>=.5&&(T=Math.min(v+1,d.length-1))}),d.length&&a?.(T)}function p(){m||(m=requestAnimationFrame(S))}function L(){let G=d.map(({card:w,wrap:A})=>({height:w.offsetHeight,rowHeight:A.offsetHeight})),T=y?window.innerHeight:t.clientHeight,k=f.clientTop+(parseFloat(getComputedStyle(f).paddingTop)||0);d.forEach((w,A)=>{let{height:v,rowHeight:M}=G[A],u=Math.min(40,T-24-v);w.wrap.style.top=u+"px",w.start=k-u,A&&(d[A-1].duration=Math.max(1,w.start-d[A-1].start));let E=w.imageOnly&&v<=T-64?v*.24:0,R=A<d.length-1?o-E:0;w.wrap.style.marginBottom=R+"px",k+=M+R,A===d.length-1&&(w.duration=1/0,f.style.paddingBottom=Math.max(40,T-u-M)+"px")}),p()}let P;return L(),typeof ResizeObserver<"u"&&(P=new ResizeObserver(L),P.observe(f,{box:"border-box"}),d.forEach(({card:G})=>P.observe(G,{box:"border-box"}))),window.addEventListener("resize",L),g.addEventListener("scroll",p,{passive:!0}),{goTo(G){let T=d[Math.max(0,Math.min(d.length-1,Math.round(G)))];if(!T)return;let k=y?window.scrollY+T.start-C():T.start;g.scrollTo({top:k,behavior:i.reducedMotion?"instant":"smooth"})},destroy(){P?.disconnect(),window.removeEventListener("resize",L),cancelAnimationFrame(m),g.removeEventListener("scroll",p),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",f.remove()}}}var ti=Y(()=>{});var ii,mt,ai=Y(()=>{ii='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',mt=class{constructor(e,i,s){this.root=e,this.cards=i,this.projects=s,this.assetDirectory=new URL(".",i[0].querySelector("img").src),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${ii}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${ii}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",r=>{if(r.target!==this.dialog)return;let n=this.dialog.getBoundingClientRect();(r.clientX<n.left||r.clientX>n.right||r.clientY<n.top||r.clientY>n.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",r=>{(r.key==="ArrowLeft"||r.key==="ArrowRight")&&(r.preventDefault(),this.showFrame(this.frame+(r.key==="ArrowRight"?1:-1)))});let c=this.dialog.querySelector(".project-image-stage");c.addEventListener("pointerdown",r=>{!r.isPrimary||r.target.closest("button")||(this.galleryPointer={id:r.pointerId,x:r.clientX,y:r.clientY},c.setPointerCapture(r.pointerId))}),c.addEventListener("pointerup",r=>{let n=this.galleryPointer;if(this.galleryPointer=null,!n||n.id!==r.pointerId)return;c.hasPointerCapture(r.pointerId)&&c.releasePointerCapture(r.pointerId);let o=r.clientX-n.x,b=r.clientY-n.y;Math.abs(o)>35&&Math.abs(o)>Math.abs(b)*1.2&&this.showFrame(this.frame+(o<0?1:-1))}),c.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let i=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!i,this.dialog.querySelector("[data-gallery-next]").hidden=!i,this.thumbnails.hidden=!i,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(a=>{let c=document.createElement("li");return c.textContent=a,c})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((a,c)=>{let r=document.createElement("button");r.type="button",r.className="project-thumbnail",r.setAttribute("aria-label",`Show ${a.label.toLowerCase()}`);let n=document.createElement("img");return n.src=new URL(a.file,this.assetDirectory).href,n.alt="",n.width=1600,n.height=900,r.append(n),r.addEventListener("click",()=>this.showFrame(c)),r})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let i=this.project.gallery[this.frame];this.image.src=new URL(i.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${i.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${i.label}`,[...this.thumbnails.children].forEach((s,a)=>s.setAttribute("aria-current",String(a===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Be,lt,bt=Y(()=>{Be=Object.freeze({containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),lt=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function ri(t,e,{pauseOnHover:i=!0,interactionRestMs:s=6e3}={}){let a=t.querySelector("[data-orbit-toggle]"),c=new AbortController,r=(p,L,P)=>p.addEventListener(L,P,{signal:c.signal}),n={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let o=0,b=!1,y=p=>!!p&&t.contains(p)&&(p.matches(":focus-visible")||!!p.closest(".orbit-card")),g=()=>!b&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,f=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(o),e.autoFrame=0,o=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},d=p=>{if(e.autoFrame=0,!g()){f();return}let L=Math.min(.05,Math.max(0,(p-e.autoTime)/1e3));e.autoTime=p,e.position=(e.position+L/8)%e.count,e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(d)},m=()=>{if(!g()){f();return}let p=e.resumeAt-performance.now();if(p>0){f(),o=setTimeout(m,p);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(d))},C=(p=6e3)=>{f(),e.resumeAt=performance.now()+p};e.animateTo=function(...p){C(s),n.animateTo.apply(this,p),m()},e.settleImmediately=function(...p){n.settleImmediately.apply(this,p),m()},e.openProject=function(...p){C(),n.openProject.apply(this,p),m()},i&&(r(t,"pointerenter",p=>{p.pointerType!=="touch"&&(e.hovered=!0,m())}),r(t,"pointerleave",p=>{p.pointerType!=="touch"&&(e.hovered=!1,m())})),r(t,"focusin",p=>{e.keyboardFocused=y(p.target),m()}),r(t,"focusout",p=>{e.keyboardFocused=y(p.relatedTarget),m()}),r(t,"pointerup",()=>{C(s),m()}),r(t,"pointercancel",()=>{C(s),m()}),r(e.viewer.dialog,"close",()=>{C(),m()}),r(document,"visibilitychange",m),r(e.reducedMotion,"change",m),r(a,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,a.dataset.paused=String(e.manuallyPaused),a.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),m()});let S=new IntersectionObserver(p=>{e.inView=p.some(L=>L.isIntersecting&&L.intersectionRatio>=.15),m()},{threshold:.15});return S.observe(e.stage),e.stopAutoplay=f,e.syncAutoplay=m,()=>{b=!0,f(),c.abort(),S.disconnect(),Object.assign(e,n)}}var oi=Y(()=>{});var Ae,Pt,ni,si,ci,li,di,pi,gi,ui,hi,fi,mi,Lt,bi,dt,xi,Et=Y(async()=>{Ae=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),Pt=Ae.BufferGeometry,ni=Ae.Float32BufferAttribute,si=Ae.LineBasicMaterial,ci=Ae.LineLoop,li=Ae.DoubleSide,di=Ae.Mesh,pi=Ae.NoToneMapping,gi=Ae.PerspectiveCamera,ui=Ae.PlaneGeometry,hi=Ae.Raycaster,fi=Ae.Scene,mi=Ae.ShaderMaterial,Lt=Ae.SRGBColorSpace,bi=Ae.TextureLoader,dt=Ae.Vector2,xi=Ae.WebGLRenderer});var Ua,xt,yi=Y(async()=>{Ua=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),xt=Ua.default});var _a,jt,vi=Y(async()=>{_a=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),jt=_a.CustomEase});function wi(t,e,i=64){let s=t/e,a=new ui(t,t*9/16,i,1),c=a.attributes.position,r=a.attributes.uv;for(let n=0;n<c.count;n++){let o=(r.getX(n)-.5)*e;c.setX(n,s*Math.sin(o)),c.setZ(n,s*(Math.cos(o)-1))}return a.computeVertexNormals(),a.computeBoundingSphere(),a}function ki(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var zt=Y(async()=>{await Et()});function pt(t,e){let i=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*i,panelArc:t.radiansPerSlide*i,height:t.slotHeight*i}}function yt(t,{radius:e,pitch:i,radiansPerSlide:s}){let a=t*s;return{x:Math.sin(a)*e,y:-t*i,z:(Math.cos(a)-1)*e,angle:a,taper:1,shade:(1-Math.cos(a))/2*.58}}function Si(t,e){let i=pt(t,e);return wi(i.cardWidth,i.panelArc)}function It(t,e=64){let i=[];for(let s=0;s<=e;s++){let a=(s/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),t.slotHeight/2,t.radius*(Math.cos(a)-1))}for(let s=e;s>=0;s--){let a=(s/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),-t.slotHeight/2,t.radius*(Math.cos(a)-1))}return i}var vt=Y(async()=>{await zt()});function Tt(t,e){let i=Si(t,e);return i.scale(1,1/t.aspect/(9/16),1),i.computeVertexNormals(),i.computeBoundingSphere(),i}function Mi(t,e,i,s,a){let c=Math.min(t,e)*Math.min(40,Math.max(0,a))/100,r=t-2*c,n=e-2*c,o=r/n,b=s==="fit"?Math.max:Math.min,y=b(1,o/i),g=b(1,i/o);return{contentWidth:r,contentHeight:n,uvScaleX:y,uvScaleY:g,imageWidth:r/y,imageHeight:n/g,padding:c}}var Ci=Y(async()=>{await vt();await vt()});function qt({stageWidth:t,stageHeight:e,spiralWidthPercent:i,cardWidth:s,aspect:a,rise:c,riseUnit:r}){let n=Math.max(1,t*i/200),o=Math.max(1,Math.min(s,n*Math.PI/3,e*.4*a)),b=Math.PI*2*n/o,y=r==="percent"?e*c/100:c*Math.min(1,t/640);return{radius:n,slotWidth:o,slotHeight:o/a,aspect:a,pitch:Math.max(o/a*1.25/b,y),radiansPerSlide:o/n,cardsPerTurn:Math.PI*2*n/o}}var Ai=Y(()=>{});function Li(t,e,i){let s=e.radius*2.4,a=s/(s+2*e.radius),c=Math.ceil((i/(2*a)+e.slotHeight/2)/e.pitch)+2,r=Math.floor(t);return{first:r-c,last:r+c,count:c*2+1}}function Ei(t,e,i){let s=t*e.radiansPerSlide,a=s-i.panelArc/2,c=s+i.panelArc/2,r=Math.PI*2,n=S=>Math.ceil((a-S)/r)<=Math.floor((c-S)/r),o=n(0)?1:Math.max(Math.cos(a),Math.cos(c)),b=n(Math.PI)?-1:Math.min(Math.cos(a),Math.cos(c)),y=e.radius*2.4,g=y/(y+e.radius*(1-o)),f=y/(y+e.radius*(1-b)),d=-t*e.pitch,m=d+i.height/2,C=d-i.height/2;return{minY:Math.min(C*g,C*f),maxY:Math.max(m*g,m*f)}}function ji(t,e){let i=Math.min(80,e*.08),s=c=>Math.max(0,Math.min(1,c)),a=Math.min(s((e/2-t.minY)/i),s((t.maxY+e/2)/i));return a*a*(3-2*a)}function zi(t,e,i,s){let a=i-e;return Math.abs(a)>s/2&&(a-=Math.round(a/s)*s),t+a}var Pi,Ii=Y(async()=>{await vt();Ai();Pi=(t,e)=>(t%e+e)%e});var qi,Ti=Y(()=>{qi=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function $i(t,{textureSource:e=i=>i.querySelector("img").src}={}){let{root:i,stage:s}=t,a;try{a=new xi({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return i.dataset.renderer="css-fallback",()=>{delete i.dataset.renderer}}a.outputColorSpace=Lt,a.toneMapping=pi,a.setClearColor(0,0);let c=a.domElement;c.style.removeProperty("display"),c.className="orbit-webgl",c.setAttribute("aria-hidden","true"),s.append(c);let r=new fi,n=new gi,o=new hi,b=new dt,y=new AbortController,g=(I,N,B)=>I.addEventListener(N,B,{signal:y.signal}),f=t.render,d=t.pointerDown,m=new Map,C=[],S,p,L=t.position,P=t.position,G="",T=!1,k=!1,w=null,A=null,v=!1,M=!1;i.dataset.renderer="loading-webgl";let u=()=>qt({stageWidth:s.clientWidth,stageHeight:s.clientHeight,spiralWidthPercent:Number(i.dataset.spiralWidth),cardWidth:Number(i.dataset.cardWidth),aspect:Number(i.dataset.cardAspect),rise:Number(i.dataset.rise),riseUnit:i.dataset.riseUnit}),E=()=>{let I=t.cards[0],N=new mi({uniforms:{screenshot:{value:m.get(e(I))},dimensions:{value:new dt},contentDimensions:{value:new dt(1,1)},imageScale:{value:new dt(1,1)},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:Ya,fragmentShader:Va,transparent:!0,side:li,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),B=new di(S,N),V=new ci(p,new si({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),Z={card:I,mesh:B,guide:V,material:N,surface:{scale:1,target:1}};B.userData.panel=Z,C.push(Z),r.add(B,V)},R=I=>{let N=Li(L,I,s.clientHeight);for(;C.length<N.count;)E();for(;C.length>N.count;){let B=C.pop();r.remove(B.mesh,B.guide),B.material.dispose(),B.guide.material.dispose()}C.forEach((B,V)=>{B.offset=N.first+V-L,B.card=t.cards[Pi(N.first+V,t.count)],B.material.uniforms.screenshot.value=m.get(e(B.card))})},ge=()=>{let I=s.clientWidth,N=s.clientHeight,B=u(),V=Number(i.dataset.slotGap||3);R(B);let Z=pt(B,V),{cardWidth:J,panelArc:te}=Z,{radius:F}=B;i.dataset.slotMetrics=JSON.stringify({...B,cardArc:te,cardWidth:J,cardHeight:Z.height,gap:V,imageFit:i.dataset.imageFit,imagePadding:Number(i.dataset.imagePadding||0)}),C.forEach(O=>{O.material.uniforms.dimensions.value.set(J,Z.height);let Pe=O.material.uniforms.screenshot.value.image,we=Mi(J,Z.height,(Pe.naturalWidth||Pe.width)/(Pe.naturalHeight||Pe.height),i.dataset.imageFit,Number(i.dataset.imagePadding||0));O.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),O.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let X=Math.min(window.devicePixelRatio||1,2),ne=`${I}:${N}:${J}:${te}:${Z.height}:${F}:${X}`;if(ne===G||!I||!N)return;G=ne,a.setPixelRatio(X),a.setSize(I,N,!1),n.position.set(0,0,F*2.4),n.fov=ki(N,n.position.z),n.aspect=I/N,n.near=.1,n.far=F*12,n.updateProjectionMatrix(),n.updateMatrixWorld();let se=S;S=Tt(B,V);let U=p;p=new Pt,p.setAttribute("position",new ni(It(B),3));let re=0;C.forEach(O=>{O.mesh.geometry=S,O.guide.geometry=p,O.material.uniforms.dimensions.value.set(J,Z.height),O.material.uniforms.cornerRadius.value=re}),se?.dispose(),U?.dispose()},$=()=>{if(!T||k||v||M||!t.geometry)return;M=!0,L=zi(L,P,t.position,t.count),P=t.position,ge();let I=u(),N=pt(I,Number(i.dataset.slotGap||3)),B=i.dataset.focusMode==="keyboard"&&i.contains(document.activeElement),V=0;C.forEach(J=>{let{card:te,mesh:F,material:X}=J,ne=yt(J.offset,I),se=Ei(J.offset,I,N),U=ji(se,s.clientHeight),re=B&&te===t.cards[t.active]&&Math.abs(J.offset)<.5;X.polygonOffsetUnits=Math.abs(J.offset)*8,F.position.set(ne.x,ne.y,ne.z),F.rotation.y=ne.angle,F.visible=U>.001,F.visible&&V++,J.guide.position.copy(F.position),J.guide.rotation.copy(F.rotation),J.guide.visible=i.dataset.showSlots==="true"&&F.visible,J.guide.material.opacity=U*.42,X.uniforms.fade.value=U,X.uniforms.shade.value=ne.shade,X.uniforms.focused.value=re?1:0});let Z=JSON.stringify({cardsPerTurn:I.cardsPerTurn,visibleCount:V,poolCount:C.length,stageWidth:s.clientWidth,stageHeight:s.clientHeight,cardWidth:N.cardWidth,cardHeight:N.height,pitch:I.pitch,radius:I.radius,uniqueCount:t.count});i.dataset.responsiveMetrics!==Z&&(i.dataset.responsiveMetrics=Z),A&&!t.pointer&&(w=oe(A)),r.updateMatrixWorld(!0),a.render(r,n),M=!1},oe=I=>{if(!T||v)return null;let N=c.getBoundingClientRect();b.set((I.clientX-N.left)/N.width*2-1,-(I.clientY-N.top)/N.height*2+1),o.setFromCamera(b,n);for(let B of o.intersectObjects(C.map(V=>V.mesh))){let V=B.object.userData.panel;if(!B.object.visible||V.material.uniforms.fade.value<=.25)continue;let{x:Z,y:J}=V.material.uniforms.dimensions.value,te=V.material.uniforms.cornerRadius.value,F=Math.abs((B.uv.x-.5)*Z)-Z/2+te,X=Math.abs((B.uv.y-.5)*J)-J/2+te;if(!(Math.hypot(Math.max(F,0),Math.max(X,0))+Math.min(Math.max(F,X),0)>te))return V}return null};t.render=function(){f.call(this),$()},t.pointerDown=function(I){d.call(this,I),T&&!v&&this.pointer?.id===I.pointerId&&(this.pointer.card=oe(I)?.card||null),A=null,w=null},g(s,"pointermove",I=>{A=I.pointerType==="mouse"?{clientX:I.clientX,clientY:I.clientY}:null,w=I.pointerType==="mouse"&&!t.pointer?oe(I):null,c.style.cursor=t.pointer?.dragging?"grabbing":w?"pointer":"grab",$()}),g(s,"pointerleave",()=>{A=null,w=null,$()}),g(s,"pointerup",()=>{w=null,$()}),g(i,"focusin",$),g(i,"focusout",()=>queueMicrotask($)),g(document,"keydown",()=>queueMicrotask($)),g(document,"pointerdown",()=>queueMicrotask($)),g(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&C.forEach(({surface:I})=>{xt.killTweensOf(I),I.scale=I.target}),$()}),g(i,"playground-change",$),g(i,"slot-guides-change",$),g(c,"webglcontextlost",I=>{I.preventDefault(),v=!0,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback"}),g(c,"webglcontextrestored",()=>{v=!1,T&&(i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",$())});let he=new ResizeObserver(()=>$());he.observe(s);let ce=new bi,ye=t.cards.map(I=>new Promise((N,B)=>{let V=e(I),Z=ce.load(V,N,void 0,B);Z.colorSpace=Lt,Z.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),m.set(V,Z)})),ve=()=>{k||(S=Tt(u(),Number(i.dataset.slotGap||3)),p=new Pt,T=!0,$(),i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl")};return Promise.all(ye).then(ve).catch(()=>{k||(i.dataset.renderer="css-fallback")}),()=>{k=!0,y.abort(),he.disconnect(),t.render=f,t.pointerDown=d,i.classList.remove("has-webgl-carousel"),delete i.dataset.renderer,C.forEach(({material:I,surface:N,guide:B})=>{xt.killTweensOf(N),I.dispose(),B.material.dispose()}),S?.dispose(),p?.dispose(),m.forEach(I=>I.dispose()),a.dispose(),a.forceContextLoss(),c.remove()}}var ao,Ya,Va,Fi=Y(async()=>{await Et();await yi();await vi();await zt();await Ci();await Ii();xt.registerPlugin(jt);ao=jt.create("portfolio-surface",".2,.75,.25,1"),Ya=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Va=`
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
`});var Ni=Y(()=>{(()=>{"use strict";let t=Math.PI*2,e=(c,r)=>(c%r+r)%r,i=(c,r,n)=>Math.min(n,Math.max(r,c));class s{constructor(r){this.root=r,this.stage=r.querySelector(".orbit-stage"),this.cards=[...r.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((n,o)=>{n.dataset.slideIndex=o;let b=n.cloneNode(!0);b.dataset.repeat="true",b.tabIndex=-1,b.setAttribute("aria-hidden","true"),b.removeAttribute("aria-pressed"),n.parentElement.append(b),this.visualCards.push(b)}),!(!this.count||!this.stage)&&(this.title=r.querySelector(".orbit-title"),this.description=r.querySelector(".orbit-description"),this.status=r.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(r,this.cards),this.pagination=r.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((r,n)=>{let o=document.createElement("button");return o.type="button",o.className="orbit-dot",o.setAttribute("aria-label",`Show ${r.dataset.title||`screenshot ${n+1}`}`),o.addEventListener("click",()=>this.goTo(n),this.options),this.pagination?.append(o),o}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(r=>{r.disabled=!0})}bindEvents(){let r=(n,o,b,y={})=>n.addEventListener(o,b,{...this.options,...y});r(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),r(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),r(this.stage,"keydown",n=>{let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};n.key in o?(n.preventDefault(),this.step(o[n.key])):(n.key==="Home"||n.key==="End")&&(n.preventDefault(),this.goTo(n.key==="Home"?0:this.count-1))}),r(this.stage,"pointerdown",n=>this.pointerDown(n)),r(this.stage,"pointermove",n=>this.pointerMove(n),{passive:!1}),r(this.stage,"pointerup",n=>this.pointerUp(n)),r(this.stage,"pointercancel",n=>this.pointerUp(n,!0)),r(this.stage,"lostpointercapture",n=>this.pointerUp(n,!0)),r(this.stage,"dragstart",n=>n.preventDefault()),r(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),r(this.stage,"click",n=>{if(n.detail!==0&&performance.now()<this.ignoreClickUntil){n.preventDefault(),n.stopPropagation();return}let o=n.target.closest(".orbit-card");o&&this.openProject(Number(o.dataset.slideIndex))}),r(this.stage,"focusin",n=>{let o=this.cards.indexOf(n.target.closest(".orbit-card"));!this.pointer&&o>=0&&o!==this.active&&this.goTo(o)}),r(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),r(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(r=>{let n=r.querySelector(".orbit-surface"),o=n.querySelector("img"),b=Array.from({length:this.segmentCount},(y,g)=>{let f=document.createElement("span");return f.className="orbit-strip",f.setAttribute("aria-hidden","true"),f.dataset.stripIndex=g,f.style.backgroundImage=`url("${o.src}")`,n.append(f),f});return r.classList.add("is-curved"),{card:r,strips:b}})}measure(){let r=this.stage.clientWidth,n=this.stage.clientHeight,o=r<=700;this.cards[0].style.removeProperty("width");let b=this.cards[0].offsetWidth,y=t/8,g=y*.88,f=b/g;this.geometry={radius:f,panelArc:g,cardWidth:b,pitch:i(n/13,36,52),halfWindow:6.5,radiansPerSlide:y,dragUnitX:Math.max(85,r*(o?.32:.18)),dragUnitY:i(n*.13,65,105)},this.stage.style.perspective=`${(f*2.4).toFixed(3)}px`;let d=g/this.segmentCount,m=2*f*Math.sin(d/2),C=b*9/16;this.panels.forEach(({card:S,strips:p})=>{S.style.width=`${b}px`,p.forEach((L,P)=>{let G=-g/2+(P+.5)*d,T=f*Math.sin(G),k=f*(Math.cos(G)-1);L.style.width=`${(m+.6).toFixed(4)}px`,L.style.backgroundSize=`${b}px ${C}px`,L.style.backgroundPosition=`${(-P*b/this.segmentCount).toFixed(4)}px 0px`,L.style.transform=`translateX(-50%) translate3d(${T.toFixed(4)}px, 0px, ${k.toFixed(4)}px) rotateY(${(G*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:r,pitch:n,halfWindow:o,radiansPerSlide:b}=this.geometry;this.visualCards.forEach(g=>{let f=Number(g.dataset.slideIndex),d=e(f-this.position+this.count/2,this.count)-this.count/2;g.dataset.repeat&&(d+=d<0?this.count:-this.count);let m=d*b,C=Math.cos(m),S=Math.sin(m),p=(1-C)/2,L=1-d/o*.11,P=S*r*L,G=d*n,T=C*r*L-r,k=m*180/Math.PI,w=i((o-Math.abs(d))/.65,0,1);g.style.transform=`translate(-50%, -50%) translate3d(${P.toFixed(3)}px, ${G.toFixed(3)}px, ${T.toFixed(3)}px) rotateY(${k.toFixed(3)}deg) scale(${L.toFixed(4)})`,g.style.zIndex="auto",g.style.setProperty("--orbit-shade",String(p*.58)),g.style.setProperty("--orbit-fade",String(w)),g.style.opacity="1",g.style.visibility=w>0?"visible":"hidden",g.style.pointerEvents=w>.25?"auto":"none",g.dataset.offset=d.toFixed(5)});let y=e(Math.round(this.position),this.count);y!==this.active&&this.updateActive(y)}updateActive(r){let n=this.visualCards.includes(document.activeElement);this.active=r,this.cards.forEach((o,b)=>{let y=b===r;o.classList.toggle("is-centered",y),o.tabIndex=y?0:-1,o.setAttribute("aria-pressed",String(y)),this.dots[b].setAttribute("aria-current",String(y))}),this.title&&(this.title.textContent=this.cards[r].dataset.title||""),this.description&&(this.description.textContent=this.cards[r].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[r].dataset.title}, project ${r+1} of ${this.count}`),n&&!this.pointer&&this.cards[r].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(r)}goTo(r){let n=e(r-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+n)}step(r){this.animateTo(Math.round(this.target)+r)}animateTo(r,n=0){if(this.target=Math.round(r),this.velocity=n,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(r){this.frame=0;let n=Math.min((r-this.lastTime)/1e3,.032);this.lastTime=r;let o=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=o*n,this.position+=this.velocity*n,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(r){if(this.viewer.dialog.open||!Number.isInteger(r)||!this.cards[r])return;let n=e(r-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+n),this.settleImmediately(),this.viewer.open(r)}pointerDown(r){if(!r.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}r.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:r.pointerId,x:r.clientX,y:r.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:r.target.closest(".orbit-card")},this.stage.setPointerCapture(r.pointerId))}pointerMove(r){let n=this.pointer;if(!n||n.id!==r.pointerId)return;let o=r.clientX-n.x,b=r.clientY-n.y;if(!n.dragging){if(Math.max(Math.abs(o),Math.abs(b))<6)return;n.axis=Math.abs(b)>Math.abs(o)?"y":"x",n.lastCoordinate=n.axis==="x"?n.x:n.y,n.dragging=!0,this.root.classList.add("is-dragging")}r.preventDefault();let y=n.axis==="x"?r.clientX:r.clientY,g=n.axis==="x"?o:b,f=n.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,d=performance.now(),m=Math.max(8,d-n.lastTime),C=-(y-n.lastCoordinate)/f/m*1e3;n.speed=n.speed*.35+C*.65,n.lastMovement=d,n.lastTime=d,n.lastCoordinate=y,n.travel=g,this.position=n.startPosition-g/f,this.render()}pointerUp(r,n=!1){let o=this.pointer;if(!o||o.id!==r.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(o.id)&&this.stage.releasePointerCapture(o.id),!o.dragging){this.animateTo(Math.round(this.position)),!n&&o.card&&this.openProject(Number(o.card.dataset.slideIndex));return}let b=n||performance.now()-o.lastMovement>90?0:i(o.speed,-10,10),y=Math.round(this.position+(this.reducedMotion.matches?0:b*.2)),g=this.position-o.startPosition;!n&&Math.abs(o.travel)>18&&Math.abs(g)>.12&&y===Math.round(o.startPosition)&&(y+=Math.sign(g)),this.animateTo(y,b)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:r,strips:n})=>{n.forEach(o=>o.remove()),r.classList.remove("is-curved"),r.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(r=>r.dataset.repeat).forEach(r=>r.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function a(c=document){c.querySelectorAll("[data-spiral-carousel]").forEach(r=>{r.spiralCarousel||(r.spiralCarousel=new s(r))})}window.SpiralCarousel={init:a},a()})()});var Ri,Wi=Y(()=>{Ri=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Oi,Hi=Y(()=>{Oi=`.project-dialog {
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
`});var Bi,Di=Y(()=>{Bi=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
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
`});var _i={};Vt(_i,{mountSpiral:()=>ar,spiralControls:()=>lt,spiralDefaults:()=>Be});function $t(t,e,i){for(let s of Ui)t.removeAttribute(s);for(let[s,a]of Object.entries(e.imageAttrs||{}))Ui.has(s)&&a!=null&&t.setAttribute(s,String(a));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&i?.(t)}function ir(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function ar(t){let{host:e,onChange:i=()=>{},loadImage:s}=t,a=t.items.filter(v=>v.src),c={...Be,...t.options},r=!1;if(!a.length){let v=document.createElement("p");return v.className="gc-spiral-empty",v.textContent="Add images to this source to preview the spiral.",e.append(v),{destroy(){v.remove()}}}let n=document.createElement("div");n.className="gc-spiral-root reference-carousel-shell";let o=document.createElement("div");o.className="orbit-carousel spiral-carousel slot-carousel",o.dataset.spiralCarousel="",o.id=`gc-spiral-${++er}`,o.setAttribute("role","region"),o.setAttribute("aria-label","Spiral gallery"),o.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let b=o.querySelector(".orbit-stage"),y=o.querySelector(".orbit-ring"),g=o.querySelector("[data-orbit-toggle]");Ne(o.querySelector("[data-orbit-prev]"),"previous"),Ne(o.querySelector("[data-orbit-next]"),"next"),Ne(g,"playback");let f=o.querySelector(".gc-spiral-caption"),d=document.createElement("div");d.className="gc-spiral-caption-space",f.before(d),d.append(f);let m=a.some(v=>!!v.title);for(let v of new Set(a.map(M=>M.title).filter(Boolean))){let M=f.cloneNode(!1);M.setAttribute("aria-hidden","true"),M.classList.add("gc-spiral-caption-measure"),M.textContent=v,d.append(M)}a.forEach((v,M)=>{let u=document.createElement("button");u.className="orbit-card",u.type="button",u.dataset.title=v.title||"",u.dataset.imageSource=v.src,u.setAttribute("aria-label",v.title?`View ${v.title}`:`View image ${M+1}`);let E=document.createElement("span");E.className="orbit-surface";let R=document.createElement("img");$t(R,v),E.append(R),u.append(E),y.append(u)}),n.append(o),e.append(n);let C=()=>{n.style.width=`${Ye(c.containerWidth,100,20,100)}%`,b.style.height=`${Ye(c.stageHeight,680,280,1600)}px`,o.style.setProperty("--orbit-card-width",`${Ye(c.cardWidth,280,80,720)}px`),o.dataset.spiralWidth=String(Ye(c.spiralWidth,87,20,100)),o.dataset.cardWidth=String(Ye(c.cardWidth,280,80,720)),o.dataset.rise=String(Ye(c.spiralRise,52,c.spiralRiseUnit==="percent"?1:8,c.spiralRiseUnit==="percent"?50:500)),o.dataset.riseUnit=c.spiralRiseUnit==="percent"?"percent":"px",o.dataset.cardAspect=String(tr(c.aspectRatio)),o.dataset.imageFit=c.fit==="contain"||c.fit==="fit"?"fit":"fill",o.dataset.imagePadding=String(Ye(c.imagePadding,0,0,20)),o.dataset.slotGap=String(Ye(c.spiralGap,3,0,16)),o.dataset.showSlots=String(!!c.showSlots),d.hidden=!c.showTitles||!m,o.classList.toggle("gc-spiral-reduced",!!c.reducedMotion)};C();let S=a.map(v=>({title:v.title||"",category:"",description:Gi(v.description),services:[],notes:[],gallery:[{file:v.src,label:"Image"}]}));class p extends mt{constructor(M,u){super(M,u,S),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(M){let u=a[M];if(!u||c.clickAction==="none")return;let E=ir(u.link);if(c.clickAction==="link"){E&&location.assign(E);return}super.open(M);let R=this.dialog.querySelector(".project-title");R.hidden=!u.title,u.title?this.dialog.setAttribute("aria-labelledby",R.id):this.dialog.removeAttribute("aria-labelledby"),this.dialog.querySelector(".project-summary").hidden=!Gi(u.description),this.sourceLink.hidden=!E,E?(this.sourceLink.href=E,this.sourceLink.textContent=u.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!c.reducedMotion)}showFrame(M){super.showFrame(M);let u=S.indexOf(this.project),E=a[u];E&&($t(this.image,E,s),this.dialog.querySelectorAll(".project-thumbnail img").forEach(R=>$t(R,E,s)),this.dialog.querySelector(".project-frame-label").textContent=E.title||"")}}let L=window.ProjectViewer;window.ProjectViewer=p;try{Qa.init(n)}finally{L===void 0?delete window.ProjectViewer:window.ProjectViewer=L}let P=o.spiralCarousel;o.querySelectorAll("img").forEach(v=>s?.(v));let G=P.updateActive;P.updateActive=function(v){G.call(this,v),this.status.textContent=`${a[v]?.title?`${a[v].title}, `:""}image ${v+1} of ${a.length}`,i(v)},P.updateActive(P.active);let T=P.animateTo;P.animateTo=function(v,M=0){c.reducedMotion?(this.target=Math.round(v),this.settleImmediately()):T.call(this,v,M)};let k=$i(P,{textureSource:v=>v.dataset.imageSource}),w=ri(o,P,{pauseOnHover:!1,interactionRestMs:0});function A(v){c.autoplay=!!v,P.manuallyPaused=!v||!!c.reducedMotion,P.resumeAt=0,g.disabled=!!c.reducedMotion||P.reducedMotion.matches||a.length<2,g.dataset.paused=String(P.manuallyPaused),g.setAttribute("aria-label",P.manuallyPaused?"Resume carousel":"Pause carousel"),P.syncAutoplay()}return A(!!c.autoplay),{update(v){c={...c,...v},C(),P.measure(),o.dispatchEvent(new Event("playground-change")),o.dispatchEvent(new Event("slot-guides-change")),P.updateActive(P.active),A(!!c.autoplay)},goTo(v){r||P.goTo(v)},setPlaying:A,getMetrics(){try{return JSON.parse(o.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return o.dataset.renderer||"loading"},destroy(){r||(r=!0,w(),k(),P.destroy(),n.remove())}}}var Qa,er,Ye,tr,Gi,Ui,Xi=Y(async()=>{ai();ft();bt();bt();oi();await Fi();Ni();Qa=window.SpiralCarousel,er=0,Ye=(t,e,i,s)=>Number.isFinite(Number(t))?Math.max(i,Math.min(s,Number(t))):e,tr=t=>{if(typeof t=="number"&&t>0)return t;let[e,i]=String(t||"16:9").split(":").map(Number);return e>0&&i>0?e/i:16/9},Gi=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Ui=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Yi(t){let{host:e}=t,i={...t.options},s=null,a=null,c=!1,r="loading",n=document.createElement("p");return n.className="gc-empty",n.setAttribute("role","status"),n.textContent="Loading spiral\u2026",e.append(n),Xi().then(()=>_i).then(o=>{c||(n.remove(),a=o.mountSpiral({...t,options:i}),s!==null&&a.goTo?.(s))}).catch(o=>{c||(r="error",n.textContent="The spiral could not load.",e.replaceChildren(n),console.warn("Gallery Studio: spiral unavailable",o))}),{update(o){i={...i,...o},a?.update?.(i)},goTo(o){s=o,a?.goTo?.(o)},setPlaying(o){i.autoplay=o,a?.setPlaying?.(o)},getStatus(){return a?.getStatus?.()??r},getMetrics(){return a?.getMetrics?.()??null},destroy(){c=!0,n.remove(),a?.destroy()}}}var Vi=Y(()=>{});function gt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let i=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(i.protocol)?i.href:""}catch{return""}}function Nt(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(i=>i.remove()),e.content.querySelectorAll("*").forEach(i=>{for(let s of[...i.attributes])(/^on/i.test(s.name)||s.name==="style"||s.name==="id")&&i.removeAttribute(s.name);if(i.hasAttribute("href")){let s=gt(i.getAttribute("href"));s?i.setAttribute("href",s):i.removeAttribute("href")}}),e.innerHTML}function rr(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let i of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(i)&&(e[i]=t.getAttribute(i));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function ut(t,e){let i=Ft[e];if(!t||!i)return null;let s=t.closest(i);if(!s){let o=t.querySelectorAll(i);if(o.length!==1)return null;s=o[0]}let a=e==="list"?s:s.querySelector(":scope > .sqs-block-content");if(!a)return null;let c=o=>Array.from(a.querySelectorAll(o)).filter(b=>b.closest(i)===s&&(!b.closest(".gc-embed")||b.hasAttribute("data-gc-native-track"))),r=e==="list"?".list-item":".slide",n=c(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!n.length&&(n=c(".sqs-gallery")),n.length===1){let o=Array.from(n[0].querySelectorAll(r)).filter(b=>b.closest(i)===s&&!b.hasAttribute("data-gc-repeat"));return{source:s,originals:n,rows:o}}if(e==="gallery"&&!n.length){let o=c(r);if(o.length&&o.every(b=>b.parentElement===o[0].parentElement))return{source:s,originals:o,rows:o}}return null}function nt(t,e,i=location.href){return(ut(t,e)?.rows||[]).map(a=>{let c=a.querySelector("img[data-src],img[data-image],img"),r=a.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",n=Nt(a.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),o=a.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...rr(c),title:r,description:n,link:gt(o?.getAttribute("href"),i),buttonLabel:e==="list"&&o?.textContent.trim()||""}}).filter(a=>e==="list"||a.src)}function or(t,e){let i=e==="list"?t.getAttribute("data-section-id"):t.id;if(!i?.trim())return"";let s=e==="list"?'section[data-section-id="'+CSS.escape(i)+'"]':"#"+CSS.escape(i);return t.ownerDocument.querySelectorAll(s).length===1?s:""}function Ji(t=document){let e={list:0,gallery:0};return Array.from(t.querySelectorAll(Object.values(Ft).join(","))).filter(i=>!i.closest(".gc-embed")).flatMap(i=>{let s=i.matches(Ft.list)?"list":"gallery",a=or(i,s);if(!a||!ut(i,s))return[];let c=++e[s];return{name:(s==="list"?"List Section":"Gallery Block")+(c>1?" "+c:""),type:s,selector:a,root:i,items:nt(i,s)}})}function wt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let i=t.ownerDocument.defaultView?.ImageLoader;if(i&&typeof i.load=="function")try{i.load(t,{load:!0})}catch(s){console.warn("Gallery Studio: native image loader",s)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Ki(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Ki(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function Wt(t){let e=document.createElement("img");for(let[i,s]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(i)&&e.setAttribute(i,s);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Ki(t.imageAttrs?.["data-image-focal-point"]),e}var Ft,Rt=Y(()=>{Ft={list:"section.user-items-list-section",gallery:".sqs-block-gallery"}});function Zi(t,e,i){let s=new WeakMap,a=new WeakMap,c=Array.from(e.childNodes),r=i.map(S=>Array.from(S.childNodes)),n=[];function o(S,p){S&&n.push([S,p.map(L=>[L,S.getAttribute(L)])])}let b=new Set,y=!1;function g(){o(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let S of i)o(S,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),y=!0}function f(S,p,L,P,G){let T=i[p],k=b.has(p),w=k?T.cloneNode(!1):T,A=document.createElement("div");if(A.className="gc-card gc-native-card",A.tabIndex=0,A.setAttribute("role","group"),S.imageAttrs?.["data-image-focal-point"]){let[$,oe]=S.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite($)&&Number.isFinite(oe)&&A.style.setProperty("--gc-native-focus",$*100+"% "+oe*100+"%")}let v=S.title||S.alt||`Item ${p+1}`;if(A.setAttribute("aria-label",v),k){w.removeAttribute("id"),w.setAttribute("data-gc-repeat","");for(let $ of r[p])A.append($.cloneNode(!0));A.querySelectorAll("[id]").forEach($=>$.removeAttribute("id"))}else b.add(p),A.append(...r[p]);w.replaceChildren(A),s.set(A,w);let M=A.querySelector(".list-item-media"),u=A.querySelector(".list-item-content"),E=A.querySelector(".list-item-content__title"),R=A.querySelector(".list-item-content__description");if(!k){for(let $ of[M,u])o($,["class"]);for(let $ of[E,R])o($,["class","hidden"])}if(M?.classList.add("gc-card-media"),u?.classList.add("gc-card-copy"),P.typeSource!=="native"&&(E?.classList.add("gc-card-title"),R?.classList.add("gc-card-description")),E&&(!P.showTitles||L.caption===!1)&&(E.hidden=!0),R&&!L.description&&(R.hidden=!0),L.thumbnail){let $=A.querySelector(".list-item-content__button-wrapper")||A.querySelector(".list-item-content__button");$&&(k||o($,["hidden"]),$.hidden=!0),u&&(!S.title||L.caption===!1)&&(k||o(u,["hidden"]),u.hidden=!0)}let ge=Array.from(A.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!k)for(let $ of ge)o($,["tabindex"]);if(a.set(A,ge.map($=>[$,$.getAttribute("tabindex")])),P.clickAction!=="none"&&(P.clickAction!=="link"||S.link)){let $=document.createElement("button");$.type="button",$.className="gc-native-action",$.tabIndex=-1,$.setAttribute("aria-label",(P.clickAction==="link"?"Open link for ":"Open ")+v),$.addEventListener("click",()=>G(S,p)),A.append($),A.setAttribute("aria-keyshortcuts","Enter Space"),A.addEventListener("click",oe=>{oe.defaultPrevented||oe.target.closest("a,button,input,select,textarea,label")||G(S,p)}),A.addEventListener("keydown",oe=>{oe.target!==A||!["Enter"," "].includes(oe.key)||(oe.preventDefault(),$.click())})}return A}function d(S){let p=S.tabIndex===0&&S.getAttribute("aria-hidden")!=="true";for(let[L,P]of a.get(S)||[]){let G=p?P:"-1";L.getAttribute("tabindex")!==G&&(G===null?L.removeAttribute("tabindex"):L.setAttribute("tabindex",G))}}function m(S){if(!y)return;let p=S!=="native";e.querySelectorAll(".list-item-content__title").forEach(L=>L.classList.toggle("gc-card-title",p)),e.querySelectorAll(".list-item-content__description").forEach(L=>L.classList.toggle("gc-card-description",p))}function C(){if(e.classList.remove("gc-native-items-hidden"),!!y){i.forEach((S,p)=>S.replaceChildren(...r[p])),e.replaceChildren(...c);for(let[S,p]of n)for(let[L,P]of p)S.getAttribute(L)!==P&&(P===null?S.removeAttribute(L):S.setAttribute(L,P));t.after(e),n.length=0,b.clear(),y=!1}}return{track:e,begin:g,makeCard:f,slot:S=>s.get(S),syncFocus:d,setType:m,restore:C}}var Qi=Y(()=>{});function ea(t,e,i){if(!i.closest(".fluid-engine > .fe-block"))return()=>{};i.classList.add("gc-block-bound"),t.classList.add("gc-block-slot"),e.classList.add("gc-block-fit");let a=0,c=!1,r=new WeakSet,n=f=>{f&&!r.has(f)&&(r.add(f),b.observe(f))},o=()=>{!a&&!c&&(a=requestAnimationFrame(g))},b=new ResizeObserver(o),y=new MutationObserver(o);function g(){if(a=0,c||!e.isConnected)return;let f=e.querySelector(".orbit-stage,.gc-carousel-stage,.gc-spatial-canvas");if(!f)return;let d=f.classList.contains("gc-carousel-stage"),m=f.parentElement;m.classList.contains("gc-block-stage-window")&&(m=m.parentElement),n(m),n(f);let C=0;for(let p of m.children){if(p===f||p.contains(f))continue;let L=getComputedStyle(p);L.display==="none"||["absolute","fixed"].includes(L.position)||(C+=p.offsetHeight+(parseFloat(L.marginTop)||0)+(parseFloat(L.marginBottom)||0),n(p))}let S=Math.max(1,t.clientHeight-C);if(d){let p=f.parentElement;p.classList.contains("gc-block-stage-window")||(p=document.createElement("div"),p.className="gc-block-stage-window",f.before(p),p.append(f));let L=Math.min(1,S/Math.max(1,f.offsetHeight));p.style.height=S+"px",f.style.setProperty("--gc-block-scale",String(L)),f.style.setProperty("--gc-block-top",Math.max(0,(S-f.offsetHeight*L)/2)+"px")}else e.style.setProperty("--gc-block-stage-height",S+"px")}return n(t),y.observe(e,{childList:!0,subtree:!0}),o(),()=>{c=!0,cancelAnimationFrame(a),b.disconnect(),y.disconnect(),i.classList.remove("gc-block-bound"),t.classList.remove("gc-block-slot"),e.classList.remove("gc-block-fit"),e.style.removeProperty("--gc-block-stage-height");let f=e.querySelector(".gc-block-stage-window");if(f){let d=f.firstElementChild;d.style.removeProperty("--gc-block-scale"),d.style.removeProperty("--gc-block-top"),f.replaceWith(d)}}}var ta=Y(()=>{});function ia(t,e,i,s){let a=i.ownerDocument,c=a.defaultView,r=s==="gallery"?i.closest(".fluid-engine > .fe-block"):null;r?.classList.add("gc-viewport-cell");let n=[],o=r||i;for(let g=t.parentElement;g&&(["hidden","clip","auto","scroll"].includes(c.getComputedStyle(g).overflowX)&&n.push(g),g!==o);g=g.parentElement);function b(){let g=a.documentElement.clientWidth;if(!g||!t.isConnected||!t.getClientRects().length)return;for(let m of n){let C=m.getBoundingClientRect().left+c.scrollX+m.clientLeft,S=C>.5||C+m.clientWidth<g-.5;m.classList.toggle("gc-viewport-unclip",S)}let f=-(t.getBoundingClientRect().left+c.scrollX),d=(m,C)=>{e.style.getPropertyValue(m)!==C&&e.style.setProperty(m,C)};d("--gc-viewport-width",g+"px"),d("--gc-viewport-offset",f+"px")}b();let y=c.ResizeObserver?new c.ResizeObserver(b):null;return y?.observe(t),y?.observe(a.documentElement),c.addEventListener("resize",b),()=>{y?.disconnect(),c.removeEventListener("resize",b);for(let g of n)g.classList.remove("gc-viewport-unclip");r?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var aa=Y(()=>{});var oa,ra=Y(()=>{oa=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function na(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),e.preset!=="spiral"){if(!document.getElementById("gc-finish-css")){let i=document.createElement("style");i.id="gc-finish-css",i.textContent=oa,document.head.append(i)}t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}}var Ht,sa=Y(()=>{ra();Ht={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset"}});function ca(t,e){let i=t.classList.contains("gc-embed"),s=i&&e.colorSource==="section";s?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,i&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let a=t.style;a.setProperty("--gc-custom-background",e.background),a.setProperty("--gc-custom-ink",e.ink),a.setProperty("--gc-custom-accent",e.accent),a.setProperty("--gc-background",s?"var(--gc-section-surface)":e.background),a.setProperty("--gc-ink",s?"var(--gc-section-body)":e.ink),a.setProperty("--gc-accent",s?"var(--gc-section-action)":e.accent),a.setProperty("--gc-muted",s?"var(--gc-section-body)":e.ink+"aa"),a.setProperty("--gc-spatial-surface","var(--gc-background)"),a.setProperty("--gc-spatial-ink","var(--gc-ink)"),s&&(a.setProperty("--gc-line-color","var(--gc-section-line)"),a.setProperty("--gc-tint","var(--gc-section-body)")),a.background=s?"transparent":e.background,a.color=s?"var(--gc-section-body)":e.ink;for(let c of t.querySelectorAll(":scope > dialog"))la(t,c)}function la(t,e){for(let i of["gcColorSource","gcTypeSource"])t.dataset[i]?e.dataset[i]=t.dataset[i]:delete e.dataset[i]}function Ot(t,e){let i=t.classList.contains("gc-embed")?t:t.ownerDocument.body;la(t,e),e.parentElement!==i&&i.append(e)}var da=Y(()=>{});var ga,pa=Y(()=>{ga=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var ha,ua=Y(()=>{ha=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var ma,fa=Y(()=>{ma=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var xa,ba=Y(()=>{xa=`.gc-carousel {
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
`});var va,ya=Y(()=>{va=`.gc-spatial {
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
`});function Ve(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function kt(t,e){let i=Ve(e.preset??t.preset),s=i===Ve(t.preset)?t.stageHeight:i?0:590;return{...t,...e,stageHeight:e.stageHeight??s}}function wa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function ka(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[ga,ha,ma].join(`
`),document.head.append(e));let i=wa(t);if(i==="common")return()=>{};let s=`gc-runtime-${i}-css`,a=document.getElementById(s);a||(a=document.createElement("style"),a.id=s,i==="carousel"?a.textContent=xa:i==="spatial"?a.textContent=va:a.textContent=[Ri,qi,Oi,Bi].join(`
`),e.after(a)),a.dataset.gcOwners=String(Number(a.dataset.gcOwners||0)+1);let c=!1;return()=>{if(c)return;c=!0;let r=Number(a.dataset.gcOwners)-1;r>0?a.dataset.gcOwners=String(r):a.remove()}}function gr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function Sa(t,e,i={},s=null){let a=kt(tt,i),c=null,r=null,n=null,o=0,b=0,y,g;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function f(){r&&(r.close(),r.remove(),r=null,c?.setSuspended?.(!1),n?.focus({preventScroll:!0}))}function d(k,w){if(a.clickAction==="none")return;if(a.clickAction==="link"){let R=gt(k.link);R&&window.open(R,"_blank","noopener,noreferrer");return}n=document.activeElement,r&&f(),r=document.createElement("dialog"),r.className="gc-dialog"+(a.preset==="showcase"?" gc-dialog-drawer":""),r.setAttribute("aria-label",k.title||"Image preview");let A=document.createElement("button");A.className="gc-dialog-close",A.type="button",A.textContent="Close \xD7",A.addEventListener("click",f);let v=document.createElement("div");v.className="gc-dialog-content";let M=document.createElement("div");M.className="gc-dialog-media",k.src&&(M.append(Wt(k)),v.append(M));let u=document.createElement("div");if(u.className="gc-dialog-copy",k.title){let R=document.createElement("h2");R.textContent=k.title,u.append(R)}if(k.description){let R=document.createElement("div");R.innerHTML=Nt(k.description),u.append(R)}if(k.link){let R=document.createElement("a");R.href=gt(k.link),R.textContent=k.buttonLabel||"Open link",R.target="_blank",R.rel="noopener noreferrer",u.append(R)}let E=document.createElement("p");E.className="gc-dialog-count",E.textContent=`${w+1} / ${e.length}`,u.append(E),v.append(u),r.append(A,v),Ot(t,r),r.showModal(),c?.setSuspended?.(!0),wt(M.querySelector("img")),A.focus(),r.addEventListener("cancel",R=>{R.preventDefault(),f()}),r.addEventListener("click",R=>{if(R.target===r){let ge=r.getBoundingClientRect();(R.clientX<ge.left||R.clientX>ge.right||R.clientY<ge.top||R.clientY>ge.bottom)&&f()}})}function m(k,w,A={}){if(s)return s.makeCard(k,w,A,a,d);let v=document.createElement("button");v.type="button",v.className="gc-card",v.setAttribute("aria-label",k.title||`Image ${w+1}`);let M=document.createElement("span");M.className="gc-card-media",k.src&&(M.append(Wt(k)),v.append(M));let u=document.createElement("span");if(u.className="gc-card-copy",A.caption!==!1&&a.showTitles&&k.title){let E=document.createElement("span");E.className="gc-card-title",E.textContent=k.title,u.append(E)}if(A.description&&k.description){let E=document.createElement("span");E.className="gc-card-description",E.textContent=gr(k.description),u.append(E)}return u.childNodes.length&&v.append(u),v.addEventListener("click",()=>d(k,w)),v}let C=matchMedia("(prefers-reduced-motion: reduce)"),S=matchMedia("(max-width: 660px)");function p(){let k={...a,reducedMotion:a.reducedMotion||C.matches};return S.matches&&(a.mobileCardWidth!=null&&(k.cardWidth=a.mobileCardWidth),a.mobileGap!=null&&(k[a.preset==="spiral"?"spiralGap":"gap"]=a.mobileGap)),k.phoneWidthOverride=S.matches&&a.mobileCardWidth!=null,a.preset==="stack"&&(k.stackCardWidth=S.matches&&a.mobileCardWidth!=null?a.mobileCardWidth:Math.max(360,a.cardWidth*2.2)),k}function L(){na(t,a),t.style.setProperty("--gc-fit",a.fit),t.style.setProperty("--gc-card-radius",a.radius+"px"),ca(t,a)}function P(k=0){f(),c?.destroy(),c=null,s?.restore(),cancelAnimationFrame(b),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let w=wa(a.preset);w!==y&&(g?.(),g=ka(a.preset),y=w),L(),t.setAttribute("aria-label",a.previewScroll===!1?"Gallery":"Gallery preview");let A=s&&a.preset!=="spiral"?s:null;A?A.begin():s&&s.track.classList.add("gc-native-items-hidden");let v={host:t,items:e,initialIndex:k,nativeList:A,attachDialog:M=>Ot(t,M),options:p(),makeCard:m,loadImage:wt,onChange(M){o=M,a.onChange?.(M)}};if(!e.length){let M=document.createElement("p");M.className="gc-empty",M.textContent="Add images to your source to start exploring.",t.append(M);return}a.preset==="spiral"?c=Yi(v):a.preset==="stack"?c=ei(v):["wall","ring","angled"].includes(a.preset)?(c=Zt(v),k&&c.goTo(k)):c=Jt(v),a.preset!=="spiral"&&(b=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(M=>{wt(M,{nativeCard:!!A})})))}let G=()=>P(o);function T(){a.mobileCardWidth==null&&a.mobileGap==null||(c?.setGeometry?c.setGeometry(p()):a.preset==="spiral"?c?.update(p()):P(o))}try{P()}catch(k){throw g?.(),s?.restore(),k}return C.addEventListener("change",G),S.addEventListener("change",T),{update(k){let w=a.preset,A=p();a=kt(a,k);let v=p(),M=Object.keys(v).filter(E=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(E)&&v[E]!==A[E]);if(!M.length)return;if(c?.setGeometry&&M.every(E=>["cardWidth","gap","phoneWidthOverride"].includes(E))){c.setGeometry(v);return}let u=E=>["colorSource","typeSource","background","ink","accent"].includes(E);if(M.every(E=>u(E)||w!=="spiral"&&(E==="radius"||Object.hasOwn(Ht,E)))){L(),M.includes("typeSource")&&s?.setType(a.typeSource);return}w==="spiral"&&a.preset==="spiral"&&c?.update?(L(),c.update(v)):P(w===a.preset?o:0)},goTo(k){c?.goTo?.(k)},setPlaying(k){a.autoplay=k,c?.setPlaying?.(k)},getOptions(){return{...a}},getActive(){return o},destroy(){f(),cancelAnimationFrame(b),c?.destroy(),s?.restore(),C.removeEventListener("change",G),S.removeEventListener("change",T),t.replaceChildren(),t.classList.remove("gc-stage"),g?.()}}}function ur(t,e){let i=e.closest("section")||e,s=[];for(let a=t.parentElement;a;a=a.parentElement){let c=ke.scrollBoundaries.get(a)||0;if((c||["hidden","auto","scroll","overlay"].includes(getComputedStyle(a).overflowY))&&(ke.scrollBoundaries.set(a,c+1),a.classList.add("gc-stack-page-scroll"),s.push(a)),a===i)break}return()=>{for(let a of s){let c=ke.scrollBoundaries.get(a)-1;c?ke.scrollBoundaries.set(a,c):(ke.scrollBoundaries.delete(a),a.classList.remove("gc-stack-page-scroll"))}}}function Dt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function hr(t){if(!ke.editListeners?.size){ke.editListeners=new Set;let e=Dt();ke.editObserver=new MutationObserver(()=>{let i=Dt();if(i!==e){e=i;for(let s of ke.editListeners)try{s(i)}catch(a){console.warn("Gallery Studio: could not resume a list layout.",a)}}});for(let i of[document.body,document.documentElement])ke.editObserver.observe(i,{attributes:!0,attributeFilter:["class"]})}return ke.editListeners.add(t),()=>{ke.editListeners.delete(t),ke.editListeners.size||ke.editObserver.disconnect()}}function Bt({selector:t,type:e="gallery",options:i={}}={}){let s=t;if(typeof t=="string")try{let u=document.querySelectorAll(t);if(u.length!==1)return null;s=u[0]}catch{return null}if(!s?.isConnected||typeof s.closest!="function")return null;let a=ut(s,e);if(!a)return null;let{source:c}=a,r=ke.mounts.get(c);if(r)return r.instance.update(i),r;if(!nt(c,e).length)return null;let n=document.createElement("div"),o=document.createElement("div");n.className="gc-embed",o.className="gc-viewport-slot",o.append(n);let b={...kt(tt,i),previewScroll:!1},y=null,g=null,f=null,d=null,m=null,C=!1,S=[],p=null;function L(){b.galleryWidth==="source"?(f?.(),f=null,p&&(o.classList.add("user-items-list-simple"),o.dataset.layoutWidth=p.mode,o.style.maxWidth=p.maximum)):f||(o.classList.remove("user-items-list-simple"),delete o.dataset.layoutWidth,o.style.removeProperty("max-width"),f=ia(o,n,c,e))}function P(){return e==="gallery"&&b.preset!=="stack"&&b.galleryHeight!=="custom"&&!!c.closest(".fluid-engine > .fe-block")}function G(){P()?d||(d=ea(o,n,c)):(d?.(),d=null)}function T(u){u==="stack"?g||(g=ur(n,c)):g&&(g(),g=null)}function k(){try{y?.destroy()}finally{y=null,d?.(),d=null,T(null),f?.(),f=null,S.forEach(u=>u.classList.remove("gc-native-items-hidden")),S=[],o.remove()}}function w(){if(C||!c.isConnected)return;let u=ut(c,e),E=nt(c,e);if(!u||!E.length)return;u.originals[0].before(o),ka();let R=u.originals[0];p=e==="list"?{mode:R.dataset.layoutWidth||"full",maximum:R.style.maxWidth}:null,L();let ge=e==="list"?Zi(o,u.originals[0],u.rows):null;ge||(S=u.originals,S.forEach($=>$.classList.add("gc-native-items-hidden"))),G(),T(b.preset),y=Sa(n,E,b,ge)}function A(){if(!C){C=!0;try{k()}finally{m?.(),ke.mounts.delete(c)}}}let M={instance:{update(u={}){if(C)return;let E=b.galleryWidth;b={...kt(b,u),previewScroll:!1},y&&(b.galleryWidth!==E&&L(),G(),T(b.preset),y.update(b))},goTo(u){y?.goTo(u)},setPlaying(u){b.autoplay=u,y?.setPlaying(u)},getOptions(){return{...b}},getActive(){return y?.getActive()??0},destroy:A},host:n,source:c,destroy:A};try{m=hr(u=>{if(u){k();return}try{w()}catch(E){throw k(),E}}),Dt()||w(),ke.mounts.set(c,M)}catch(u){throw A(),u}return M}var ht,tt,ke,Gt=Y(()=>{Kt();Qt();ti();Vi();bt();Rt();Qi();ta();aa();sa();da();pa();ua();fa();ba();ya();Di();Wi();Hi();Ti();ht=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],tt={...Ht,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",galleryHeight:"source",navigation:"auto",cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};ke=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:Sa,embed:Bt,presets:ht}});var Ca,Ma=Y(()=>{Ca=`:host {
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
`});function ee(t,e,i){let s=document.createElement(t);return e&&(s.className=e),i!==void 0&&(s.textContent=i),s}function Ge(t,e,i){let s=ee("button",t,e);return s.type="button",i&&s.setAttribute("aria-label",i),s}function Je(t,e,i,s,a,c=""){return{key:t,label:e,type:"range",min:i,max:s,step:a,unit:c}}function Ut(t,e){let i=t.preset,s=Ve(i),a=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},Je("cardWidth","Card width",80,i==="timed"?960:i==="spiral"?720:560,1,"px"),Je("stageHeight",s?"Minimum gallery height":"Gallery height",s?0:300,1200,1,"px")];if(e==="gallery"&&(a.splice(1,0,{key:"galleryHeight",label:"Height sizing",type:"select",choices:[{value:"source",label:"Follow block"},{value:"custom",label:"Custom height"}]}),t.galleryHeight!=="custom"&&a.splice(a.findIndex(r=>r.key==="stageHeight"),1)),i==="spiral")a.push(...lt);else if(a.push(Je("gap","Spacing",0,100,1,"px")),i!=="infinite"&&i!=="timed"){let r={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[i]||"Depth";a.push(Je("depth",r,0,100,1))}let c=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:i==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];return(i==="arc-tabs"||i==="timed")&&c.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),i!=="stack"&&(c.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),i!=="spiral"&&c.push(Je("duration","Time per image",2,15,.5,"s"))),c.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"}),[{title:"Size & spacing",fields:a},{title:"Mobile overrides",fields:[{...a.find(r=>r.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...a.find(r=>r.key===(i==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:i==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:c},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:mr},...i==="spiral"?[]:[Je("radius","Corner radius",0,64,1,"px"),Je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},Je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],{key:"showTitles",label:"Show titles",type:"checkbox"},{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]}]}function Aa(t){return{...tt,stageHeight:Ve(t.preset??tt.preset)?0:590,...t.preset==="spiral"?Be:{},colorSource:"section",typeSource:"native",...t}}function br(t){let e=t.type==="list"?"List Section":"Gallery Block",i=t.name?.trim()||e,s=t.items?.length||0;return`${i.toLowerCase().includes(e.toLowerCase())?i:`${i} \xB7 ${e}`} \xB7 ${s} ${s===1?"item":"items"}`}function Pa({source:t,options:e,onPreset:i,onOption:s,onClose:a,onRestore:c,getCode:r,getStyle:n,applyStyle:o}){let b=document.activeElement,y=t,g=Aa(e),f=!1,d=!1,m=0,C=new Map,S=new Map,p=ee("div");p.setAttribute("data-gc-author-panel",""),p.setAttribute("data-lenis-prevent",""),p.addEventListener("wheel",z=>z.stopPropagation(),{passive:!0}),p.addEventListener("touchmove",z=>z.stopPropagation(),{passive:!0});let L=p.attachShadow({mode:"open"}),P=ee("style");P.textContent=Ca;let G=ee("aside","panel");G.setAttribute("aria-labelledby","gc-author-heading");let T=ee("header","header"),k=ee("div","heading"),w=ee("h2","","Gallery settings");w.id="gc-author-heading";let A=ee("p","target");k.append(w,A);let v=ee("div","header-actions"),M=Ge("icon-button","\u2212","Minimize settings");M.setAttribute("aria-controls","gc-author-controls"),M.setAttribute("aria-expanded","true");let u=Ge("icon-button","\xD7","Close settings");v.append(M,u),T.append(k,v);let E=ee("div","controls");E.id="gc-author-controls";let R=ee("div","scroll");R.tabIndex=0,R.setAttribute("aria-label","Layout settings");let ge=ee("label","preset-row"),$=ee("select","preset-select");$.setAttribute("aria-label","Layout");for(let z of ht.filter(W=>t.type!=="gallery"||W.id!=="stack")){let W=ee("option","",z.name);W.value=z.id,$.append(W)}ge.append(ee("span","field-label","Layout"),$);let oe=ee("div","groups"),he=ee("div","style-actions"),ce=Ge("text-button","Copy style"),ye=Ge("text-button","Paste style");he.append(ce,ye);let ve=ee("div","style-transfer");ve.hidden=!0;let I=ee("textarea");I.setAttribute("aria-label","Gallery style"),I.spellcheck=!1;let N=Ge("secondary","Apply style"),B=Ge("text-button","Close","Close style transfer");ve.append(I,N,B),R.append(ge,he,ve,oe);let V=ee("footer","footer"),Z=ee("div","export-actions"),J=Ge("primary","Copy page code"),te=Ge("secondary","View code");te.setAttribute("aria-expanded","false"),te.setAttribute("aria-controls","gc-author-code"),Z.append(J,te);let F=ee("div","code-view");F.id="gc-author-code",F.hidden=!0;let X=ee("label","code-label","Page Header Code Injection"),ne=ee("textarea");ne.readOnly=!0,ne.spellcheck=!1,ne.setAttribute("aria-label","Page header code"),X.append(ne),F.append(X);let se=ee("div","footer-line"),U=ee("span","status");U.setAttribute("role","status");let re=Ge("text-button","Reset preview");se.append(U,re),V.append(Z,F,se),E.append(R,V),G.append(T,E),L.append(P,G),document.body.append(p);function O(z){let{definition:W,input:K,output:ie,row:fe}=z,be=g[W.key];if(W.type==="checkbox"){K.checked=!!be;return}if(W.type==="range"){let me=W.key==="spiralRise"&&g.spiralRiseUnit==="percent"?{...W,...W.percent}:W;K.min=String(me.min),K.max=String(me.max),K.step=String(me.step);let Se=W.inherits&&be==null;z.enable&&(z.enable.checked=!Se,K.disabled=!!Se),K.value=String(Se?g[W.inherits]:be);let le=me.key==="stageHeight"&&me.min===0&&Number(K.value)===0?"Auto":`${K.value}${me.unit||""}`;ie.textContent=Se?`Inherit \xB7 ${le}`:le,K.setAttribute("aria-valuetext",le);return}K.value=String(be),W.type==="color"&&(fe.hidden=g.colorSource==="section",ie.textContent=K.value.toUpperCase())}function Pe(){m+=1,U.textContent="",F.hidden||(ne.value=r())}function we(z,W){let K=g.spiralRiseUnit;if(g={...g,[z]:W},z==="spiralRiseUnit"&&K!==W){let ie=Math.max(1,g.stageHeight),fe=W==="percent"?Math.max(1,Math.min(30,Math.round(g.spiralRise/ie*1e3)/10)):Math.max(8,Math.min(280,Math.round(g.spiralRise*ie/100)));g.spiralRise=fe,s(z,W),s("spiralRise",fe),O(C.get("spiralRise"))}else s(z,W);z==="galleryHeight"&&We(),z==="colorSource"?C.forEach(O):O(C.get(z));for(let ie of C.values())ie.definition.inherits===z&&O(ie);Pe()}function Ue(z){let{key:W,label:K,type:ie}=z,fe=ee(z.inherits?"div":"label",`field field-${ie}`),be=ee("span","field-label",K),me=ee(ie==="select"?"select":"input");if(me.setAttribute("aria-label",K),me.dataset.option=W,ie==="select")for(let le of z.choices){let Me=ee("option","",le.label);Me.value=le.value,me.append(Me)}else me.type=ie;let Se;(ie==="range"||ie==="color")&&(Se=ee("output","value"),Se.setAttribute("aria-hidden","true")),fe.append(be),Se&&fe.append(Se),fe.append(me);let He={definition:z,input:me,output:Se,row:fe};if(z.inherits){let le=ee("input");le.type="checkbox",le.setAttribute("aria-label","Customize "+K.toLowerCase());let Me=ee("label","override-toggle");Me.append(le,be),fe.prepend(Me),He.enable=le,le.addEventListener("change",()=>we(W,le.checked?g[z.inherits]:null))}return C.set(W,He),O(He),me.addEventListener(ie==="range"||ie==="color"?"input":"change",()=>{let le=ie==="range"?Number(me.value):ie==="checkbox"?me.checked:me.value;we(W,le)}),fe}function We(){let z=new Map([...S].map(([W,K])=>[W,K.open]));C.clear(),S.clear(),oe.replaceChildren();for(let W of Ut(g,y.type)){let K=ee("details","group");K.open=z.get(W.title)??W.title==="Size & spacing";let ie=ee("summary","",W.title),fe=ee("div","group-body");for(let be of W.fields)fe.append(Ue(be));K.append(ie,fe),oe.append(K),S.set(W.title,K)}}function Q(z){if(d)return;let W=g.preset;y=z.source??y,z.options&&(g=Aa(z.options)),A.textContent=br(y),A.title=y.selector||A.textContent,$.value=g.preset,!C.size||W!==g.preset?We():C.forEach(O),Pe()}function qe(z){F.hidden=!z,te.textContent=z?"Hide code":"View code",te.setAttribute("aria-expanded",String(z)),z&&(ne.value=r(),ne.focus({preventScroll:!0}),ne.select())}function _(){if(d)return;d=!0,m+=1;let z=document.activeElement===p;document.removeEventListener("keydown",ae),p.remove(),z&&b?.isConnected&&b.focus({preventScroll:!0})}function $e(z){if(!d)try{z()}finally{_()}}function ae(z){z.key!=="Escape"||z.defaultPrevented||z.isComposing||document.querySelector("dialog[open]")||z.composedPath().some(W=>W?.getAttribute?.("aria-modal")==="true")||(z.preventDefault(),$e(a))}M.addEventListener("click",()=>{f=!f,E.hidden=f,p.toggleAttribute("data-minimized",f),M.textContent=f?"+":"\u2212",M.setAttribute("aria-expanded",String(!f)),M.setAttribute("aria-label",f?"Expand settings":"Minimize settings")}),u.addEventListener("click",()=>$e(a)),re.addEventListener("click",()=>$e(c)),$.addEventListener("change",()=>i($.value)),te.addEventListener("click",()=>qe(F.hidden));function Re(z,W){ve.hidden=!1,N.hidden=z,I.readOnly=z,I.value=W,I.placeholder=z?"":"Paste the copied gallery style",I.focus(),z&&I.select()}return ce.addEventListener("click",async()=>{let z=n();try{await navigator.clipboard.writeText(z),d||(ve.hidden=!0,U.textContent="Style copied")}catch{if(d)return;Re(!0,z),U.textContent="Style selected. Choose Copy."}}),ye.addEventListener("click",()=>{U.textContent="",Re(!1,"")}),B.addEventListener("click",()=>{ve.hidden=!0,ye.focus()}),N.addEventListener("click",()=>{if(!o(I.value)){U.textContent="Paste a style from Copy style.",I.focus();return}ve.hidden=!0,U.textContent="Style applied to this preview",ye.focus()}),J.addEventListener("click",async()=>{let z=++m,W=r();try{await navigator.clipboard.writeText(W),!d&&z===m&&(U.textContent="Page code copied")}catch{if(d||z!==m)return;qe(!0),U.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",ae),Q({source:t,options:e}),$.focus({preventScroll:!0}),{element:p,update:Q,destroy:_}}var mr,La=Y(()=>{Gt();Ma();mr=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var ja,Ea=Y(()=>{ja=`.gc-config-position{position:relative!important}
button.gc-config-launch{all:unset;box-sizing:border-box;position:absolute;inset:12px 12px auto auto;z-index:12;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:35px;padding:0 13px;border:1px solid #ffffff4a;border-radius:999px;background:#172331;color:white;box-shadow:0 2px 9px #12203233;font:550 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.01em;cursor:pointer;touch-action:manipulation}
.gc-config-launch svg{height:16px;width:16px}
button.gc-config-launch:hover,button.gc-config-launch[aria-expanded=true]{background:#2547b3}
button.gc-config-launch:focus-visible{outline:3px solid #6281ff;outline-offset:3px}
button.gc-config-launch:disabled{opacity:.65;cursor:default}
.sqs-edit-mode-active .gc-config-launch,.sqs-edit-mode-active [data-gc-author-panel]{display:none!important}
@media(max-width:700px){button.gc-config-launch{min-height:40px;inset:8px 8px auto auto}}
`});var qa={};Vt(qa,{startInline:()=>_t});function st(t,e={}){let i=St.get(t),s={...tt,...t==="spiral"?Be:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:i.width,stageHeight:Ve(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,c]of Object.entries(e))a==="mobileCardWidth"||a==="mobileGap"?Number.isFinite(c)&&c>=0&&(s[a]=c):a!=="preset"&&Object.hasOwn(s,a)&&typeof c==typeof s[a]&&(s[a]=c);return s}function Ta(t){return Ut(t).flatMap(e=>e.fields).filter(e=>!Ia.has(e.key))}function yr(t){let e=Object.fromEntries(Ta(t).map(({key:i})=>[i,t[i]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function vr(t,e){let i;try{i=JSON.parse(t)}catch{return null}if(i?.format!=="gallery-studio-style"||i.version!==1||!St.has(i.preset)||!i.values||typeof i.values!="object"||Array.isArray(i.values))return null;let s=st(i.preset);for(let a of Ia)s[a]=e[a];for(let a of Ta(s)){let c=i.values[a.key];if(c!==void 0){if(a.type==="range"){if(a.inherits&&c===null)continue;let r=a.percent&&i.values.spiralRiseUnit==="percent"?a.percent:a;if(!Number.isFinite(c)||c<r.min||c>r.max)return null}else{if(a.type==="checkbox"&&typeof c!="boolean")return null;if(a.type==="select"&&!a.choices.some(r=>r.value===c))return null}s[a.key]=c}}return s}function wr(t){return st(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function kr(t,e){let i=st(e.preset),s={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};Ve(e.preset)&&(s.stageHeight=e.stageHeight);for(let c of Object.keys(i))e.colorSource==="section"&&za.has(c)||e[c]!==i[c]&&(s[c]=e[c]);let a={v:1,selector:t.selector,type:t.type,options:s};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(a,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function _t(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let i=Ji(),s=new Map(i.map(d=>[d.root,{source:d,installed:null,options:null,mounted:null,presets:new Map}])),a=null,c=null,r=null,n=[];function o(d,m){return d.mounted?d.mounted.instance.update({...m,previewScroll:!1}):d.mounted=Bt({selector:d.source.selector,type:d.source.type,options:m}),d.mounted&&(d.options={...m}),!!d.mounted}function b(d=!0){if(!c)return;let m=c;c=null,a?.destroy(),a=null,m.button?.setAttribute("aria-expanded","false"),d&&m.button?.focus({preventScroll:!0})}function y(d){b(),d.presets.clear(),d.installed?o(d,d.installed):(d.mounted?.destroy(),d.mounted=null,d.options=null)}function g(d){if(c===d){b();return}b(!1);let{source:m}=d;if(d.mounted||(m.items=nt(m.root,m.type)),!m.items.length)return;let C=d.options||d.installed||st("arc-tabs",m.type==="gallery"?{galleryWidth:"source"}:{});if(m.type==="gallery"&&C.preset==="stack"&&(C=st("arc-tabs",{galleryWidth:"source"}),o(d,C)),!d.mounted&&!o(d,C)){d.button.textContent="No supported layout here";return}c=d;let S=p=>{o(d,p),d.presets.set(p.preset,{...p})};a=Pa({source:m,options:{...d.options},onClose:()=>b(),onRestore:()=>y(d),onPreset:p=>{!St.has(p)||m.type==="gallery"&&p==="stack"||(d.presets.set(d.options.preset,{...d.options}),S({...d.presets.get(p)||st(p),galleryWidth:d.options.galleryWidth,galleryHeight:d.options.galleryHeight}),a.update({source:m,options:{...d.options}}))},onOption:(p,L)=>{if(!Object.hasOwn(d.options,p)||p==="preset")return;let P={...d.options,[p]:L};S(P)},getCode:()=>kr(m,d.options),getStyle:()=>yr(d.options),applyStyle:p=>{let L=vr(p,d.options);return!L||m.type==="gallery"&&L.preset==="stack"?!1:(d.presets.set(d.options.preset,{...d.options}),S(L),a.update({source:m,options:d.options}),!0)}}),a.element.setAttribute("data-gc-author-panel",""),d.button.setAttribute("aria-expanded","true")}for(let d of e)try{let m=JSON.parse(d.textContent),C=document.querySelectorAll(m.selector),S=C.length===1&&s.get(C[0]);if(!S||m.v!==1||m.type!==S.source.type||!St.has(m.options?.preset))continue;S.installed=wr(m.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let d of s.values())d.installed&&o(d,d.installed);if(t&&s.size){r=document.createElement("style"),r.textContent=ja,document.head.append(r);for(let d of s.values()){let{source:m}=d;if(!m.selector)continue;let C=m.root.querySelector(m.type==="list"?".user-items-list":".sqs-block-content")||m.root,S=getComputedStyle(C).position==="static";S&&C.classList.add("gc-config-position");let p=document.createElement("button");p.type="button",p.className="gc-config-launch",p.setAttribute("aria-expanded","false"),p.setAttribute("aria-label","Configure "+m.name+" layout"),p.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',m.items.length||(p.disabled=!0,p.title="Add images in Squarespace to configure this source."),p.addEventListener("click",()=>g(d)),C.append(p),d.button=p,n.push(()=>{p.remove(),S&&C.classList.remove("gc-config-position")})}}let f={version:1,destroy(){b(!1);for(let d of s.values())d.mounted?.destroy();for(let d of n)d();r?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=f,f}var St,za,Ia,$a=Y(()=>{Gt();Rt();La();Ea();St=new Map(ht.map(t=>[t.id,t])),za=new Set(["background","ink","accent","borderColor","overlayColor"]);Ia=new Set([...za,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_t,{once:!0}):_t()});var Sr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(Sr=(await Promise.resolve().then(()=>($a(),qa))).startInline);export{Sr as startInline};

var Fa=Object.defineProperty;var V=(t,e)=>()=>(t&&(e=t(t=0)),e);var Yt=(t,e)=>{for(var i in e)Fa(t,i,{get:e[i],enumerable:!0})};function Ct(t){return`<svg class="gc-transport-icon gc-icon-${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${Na[t]}</svg>`}function Ne(t,e){return t.classList.add("gc-transport"),t.innerHTML=e==="playback"?Ct("play")+Ct("pause"):Ct(e),t}var Na,ft=V(()=>{Na={previous:'<path d="M17 10H3m6-6-6 6 6 6"/>',next:'<path d="M3 10h14m-6-6 6 6-6 6"/>',play:'<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',pause:'<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>'}});function Ee(t,e,i){let n=document.createElement(t);return n.className=e,i!==void 0&&(n.textContent=i),n}function ot(t,e,i){let n=Ee("button",t,i);return n.type="button",n.setAttribute("aria-label",e),n}function Wa(t,e,i,n,a,c){let r=i/2,s=n/2,o=.26,x=e/2+48,v=(i*Math.cos(o)+c)/(2*Math.sin(o)),p=Math.max(e*((t==="arc-tabs"?.8:.65)+(1-a)*.7),i*(3.8-a*2.1),s+Math.max(v,x/Math.sin(Math.PI/3))),y=p-s,g=Math.atan2(r,y),m=Math.hypot(r,y),A=2*(g+Math.asin(c/(2*m))),S=g+Math.asin(x/m),d=p+s,P=Math.hypot(d,r)-d,E=y-Math.sqrt((y-x)*(y+x));return{radius:p,step:A,reach:S/A,above:P,below:E}}function Ha(t,e,i){let n=e/2,a=10+i*9,c=0,r=0;for(let s=0;s<4.1;s+=.5){let o=Math.min(4.1,s+.5),x=Math.max(.48,1-s*(.09+i*.035)),v=(o*(4+i*7)+(s===0?4:0))*Math.PI/180,p=x*(n+t/2*Math.sin(v))-n;c=Math.max(c,p-Math.min(s,4)*a),r=Math.max(r,p+Math.min(o,4)*a)}return{above:c,below:r}}function Vt({host:t,items:e=[],initialIndex:i=0,options:n={},makeCard:a,onChange:c,nativeList:r,loadImage:s}){let o=Ra.has(n.preset)?n.preset:"infinite",x=o==="arc"||o==="arc-tabs",v=x||o==="showcase",p=e.length,y=!!n.reducedMotion,g=Le(Qe(n.depth,55),0,100)/100,m,A,S;function d(l){m=Le(Qe(l.gap,24),0,180),A=Le(Qe(l.cardWidth,o==="timed"?760:380),80,1800),S=l.phoneWidthOverride}d(n);let P=Le(Qe(n.duration,5),1,60)*1e3,E=Ee("section",`gc-carousel gc-preset-${o}`);E.setAttribute("aria-roledescription","carousel"),E.setAttribute("aria-label",{infinite:"Infinite gallery",arc:"Arc gallery","arc-tabs":"Arc carousel",showcase:"Stacked showcase",timed:"Timed feature carousel"}[o]),E.style.setProperty("--gc-card-radius",`${Le(Qe(n.radius,14),0,120)}px`),E.style.setProperty("--gc-stage-height",`${Le(Qe(n.stageHeight,0),0,1400)}px`),y&&E.classList.add("gc-reduced-motion");let G=[],I=(l,h,b,j)=>{l.addEventListener(h,b,j),G.push(()=>l.removeEventListener(h,b,j))},w=[],u=[],f=n.navigation==="dots"||n.navigation!=="tabs"&&e.some(l=>!l.title?.trim()),C=o==="arc-tabs"||o==="timed"&&!f,M=Ee("nav","gc-carousel-tabs");f&&M.classList.add("gc-choice-dots"),M.setAttribute("aria-label","Choose a slide"),C&&(e.forEach((l,h)=>{let j=(typeof l.title=="string"?l.title.trim():"")||`Slide ${h+1}`,W=f?ot("gc-choice-dot",j):ot("gc-carousel-tab",j,j);I(W,"click",()=>Fe(h)),I(W,"keydown",T=>{let O;T.key==="ArrowRight"&&(O=Ze(h+1,p)),T.key==="ArrowLeft"&&(O=Ze(h-1,p)),T.key==="Home"&&(O=0),T.key==="End"&&(O=p-1),O!==void 0&&(T.preventDefault(),Fe(O),w[O]?.focus({preventScroll:!0}))}),M.append(W),w.push(W)}),E.append(M));let k=Ee("div","gc-carousel-stage");k.tabIndex=p?0:-1,k.setAttribute("aria-label","Gallery. Drag to browse, or use the left and right arrow keys.");let N=r?.track??Ee("div","gc-carousel-track");N.classList.add("gc-carousel-track"),k.append(N),E.append(k);function B(l){let h=a(e[l],l,{caption:n.showTitles!==!1,description:o==="arc-tabs"||o==="timed"});h.classList.add("gc-carousel-card"),h.dataset.gcItemIndex=String(l),h.style.width="var(--gc-carousel-slot-width)",h.tabIndex=-1,h.setAttribute("aria-hidden","true"),r||h.querySelectorAll("img").forEach(j=>{j.draggable=!1,j.style.objectFit=n.fit==="contain"?"contain":"cover"});let b=r?.slot(h)??h;return N.append(b),{card:h,node:b,index:l,logical:l,active:!1}}let fe=e.map((l,h)=>B(h)),q=new Map,oe=!1,pe=Ee("div","gc-carousel-controls"),ce=Ee("div","gc-carousel-counter");ce.setAttribute("aria-hidden","true");let ye=Ee("span","gc-carousel-current",p?"01":"00");ce.append(ye,Ee("span","gc-carousel-divider","/"),Ee("span","gc-carousel-total",String(p).padStart(2,"0")));let ve=Ee("div","gc-carousel-arrows"),z=Ne(ot("gc-carousel-arrow","Previous slide"),"previous"),F=Ne(ot("gc-carousel-arrow","Next slide"),"next");z.disabled=F.disabled=p<2,ve.append(z,F);let D=Ne(ot("gc-carousel-playback","Play slideshow"),"playback");D.hidden=p<2||y;let Y=Ee("div","gc-carousel-pagination");Y.setAttribute("aria-label","Slide pagination"),o==="timed"&&e.forEach((l,h)=>{let b=ot("gc-carousel-dot",l.title?.trim()||`Go to slide ${h+1}`),j=Ee("span","gc-carousel-dot-fill");j.setAttribute("aria-hidden","true"),b.append(j),I(b,"click",()=>Fe(h)),Y.append(b),u.push({dot:b,fill:j})}),pe.append(ce,ve),o==="timed"&&pe.append(Y),pe.append(D),E.append(pe);let Z=Ee("p","gc-carousel-sr");Z.setAttribute("aria-atomic","true"),E.append(Z);let J=Ee("span","gc-carousel-cursor","Drag");J.setAttribute("aria-hidden","true"),(o==="arc-tabs"||o==="showcase"||o==="arc")&&k.append(J),t.append(E);let te=!1,$=i,X=i,ne=-1,se=0,U=0,re=0,H=!!n.autoplay&&!y&&p>1,je=!1,we=!1,Be=!1,Ue=!1,Q=null,qe=0,_=0,$e=0,ae=0,Re=()=>Math.max(12,ae*(.36-g*.12)+m-28),L=-1,R,K=1,ie=0,ge=0,be=()=>Ue||je||we||Be||document.hidden||!!Q,ue=l=>{let h=Ze(Math.round($),p),b=Ze(l-h,p);return b>p/2&&(b-=p),Math.round($)+b};function Se(){let l=w[ne];if(!l)return;let h=l.offsetLeft,b=h+l.offsetWidth;h<M.scrollLeft?M.scrollLeft=Math.max(0,h-14):b>M.scrollLeft+M.clientWidth&&(M.scrollLeft=b-M.clientWidth+14)}function We(){let l=p?Ze(Math.round($),p):-1;if(l===ne)return;ne=l,ye.textContent=p?String(l+1).padStart(2,"0"):"00",w.forEach((b,j)=>{b.classList.toggle("is-active",j===l),b.setAttribute("aria-pressed",String(j===l))}),Se(),u.forEach(({dot:b},j)=>{b.classList.toggle("is-active",j===l),j===l?b.setAttribute("aria-current","true"):b.removeAttribute("aria-current")});let h=e[l]?.title;Z.textContent=p?`${l+1} of ${p}${h?`: ${h}`:""}`:"No gallery items",l>=0&&c?.(l)}function le(){if(te||!_)return;We();let l=Math.abs(X-$)>.002;E.classList.toggle("is-moving",l||!!Q);let h=[...fe];for(let b of fe)b.logical=b.index+Math.round(($-b.index)/p)*p;if(p>1){let b=ae+m,j=o==="infinite"&&_>660?_*.61:_/2,W=(j+ae/2+40)/b,T=(_-j+ae/2+40)/b;x?W=T=R.reach:o==="showcase"&&(W=T=Math.min(4.1,(_/2+ae)/Re()));let O=Math.ceil($-W),he=Math.floor($+T);for(let[de,me]of q)(de<O||de>he||fe[me.index].logical===de)&&(me.node.remove(),q.delete(de));for(let de=O;de<=he;de++){let me=Ze(de,p);if(fe[me].logical===de)continue;let xe=q.get(de);xe||(xe=B(me),xe.logical=de,q.set(de,xe),oe&&s&&xe.card.querySelectorAll("img").forEach(Ce=>s(Ce,{nativeCard:!!r}))),h.push(xe)}}h.forEach(b=>{let j=p===1?0:b.logical-$,W=Math.abs(j),T=b.logical===Math.round($),O=_/2,he=0,de=0,me=1,xe=1,Ce=!0,He=0,Ie=0;if(o==="infinite")O=(_>660?_*.61:_/2)+j*(ae+m),xe=1-Math.min(1,W)*.68,Ce=O+ae/2>-40&&O-ae/2<_+40;else if(o==="timed")O+=j*(ae+m),me=1-Math.min(W,1)*.035,Ce=O+ae/2>-40&&O-ae/2<_+40;else if(o==="showcase")O+=j*Re(),he+=Math.min(W,4)*(10+g*9),me=Math.max(.48,1-W*(.09+g*.035)),de=j*(4+g*7),Ie=-j*(3+g*4),xe=Le(1-W*.19,0,1),Ce=W<4.1,T&&!y&&(He=ge,Ie+=ie,de+=Le(X-$,-1,1)*-3);else{let _e=j*R.step;O+=R.radius*Math.sin(_e),he=R.radius*(1-Math.cos(_e)),de=_e*180/Math.PI,Ce=W<=R.reach,xe=o==="arc-tabs"?1-Math.min(W,1)*.16:1}b.card.style.transform=`translate3d(${O}px,${he}px,0) translateX(-50%) rotate(${de}deg) rotateX(${He}deg) rotateY(${Ie}deg) scale(${me})`,b.card.style.zIndex=String(1e3-Math.round(W*100)),b.card.style.opacity=String(xe),b.card.style.visibility=Ce?"visible":"hidden",b.card.style.pointerEvents=Ce&&xe>.08?"auto":"none",b.active!==T&&(b.active=T,b.card.classList.toggle("is-active",T)),b.card.tabIndex=T?0:-1,b.card.setAttribute("aria-hidden",String(!T)),r?.syncFocus(b.card)}),u.forEach(({fill:b},j)=>{b.style.transform=`scaleX(${j===ne?Le(re/P,0,1):0})`})}function Me(){let l=_;_=k.clientWidth;let h=S?1:o==="timed"?.86:o==="infinite"&&_>660?.48:.76,b=Math.max(80,Math.min(A,_*h));if(b!==ae&&(ae=b,N.style.setProperty("--gc-carousel-slot-width",`${ae}px`)),v){let j=N.offsetHeight;if(_!==l||j!==L){L=j,x&&(R=Wa(o,_,ae,L,g,m));let W=R??Ha(ae,L,g);p>1&&(k.style.setProperty("--gc-sweep-above",Math.ceil(W.above)+"px"),k.style.setProperty("--gc-sweep-below",Math.ceil(W.below)+"px"))}}$e=k.clientHeight,K=x?R.radius*R.step:o==="showcase"?ae*.54:ae+m,le()}function ze(){!te&&!se&&(se=requestAnimationFrame(it))}function it(l){if(se=0,te)return;let h=U?Le(l-U,0,64):0;U=l,Q||(y?$=X:$+=(X-$)*(1-Math.exp(-h/85)),Math.abs(X-$)<5e-4&&($=X));let b=Math.abs(X-$)<.002&&!Q;H&&!be()&&b&&(re+=h,re>=P&&(re=0,X=Math.round($)+1)),le(),Math.abs(X-$)>5e-4||H&&!be()?ze():U=0}function Fe(l){te||p<2||(X=ue(Ze(Math.round(Qe(l,0)),p)),re=0,y&&($=X),le(),ze())}function st(l){p<2||(X=Math.round(X)+l,re=0,y&&($=X),le(),ze())}function at(l){H=!!l&&!y&&p>1,D.dataset.paused=String(!H),D.setAttribute("aria-label",H?"Pause slideshow":"Play slideshow"),D.setAttribute("aria-pressed",String(H)),Z.setAttribute("aria-live",H?"off":"polite"),E.classList.toggle("is-playing",H),U=0,ze()}function Pe(l){Ue=!!l,U=0,ze()}I(z,"click",()=>st(-1)),I(F,"click",()=>st(1)),I(D,"click",()=>at(!H)),I(k,"keydown",l=>{l.key==="ArrowLeft"||l.key==="ArrowRight"?(l.preventDefault(),k.focus({preventScroll:!0}),st(l.key==="ArrowLeft"?-1:1)):(l.key==="Home"||l.key==="End")&&(l.preventDefault(),k.focus({preventScroll:!0}),Fe(l.key==="Home"?0:p-1))}),I(k,"pointerdown",l=>{p<2||l.button!==0||!l.isPrimary||(Q={id:l.pointerId,x:l.clientX,y:l.clientY,start:$,lastX:l.clientX,lastTime:performance.now(),velocity:0,moved:!1,axis:null},X=$,re=0)}),I(k,"pointermove",l=>{let h=k.getBoundingClientRect();if(J.style.left=`${l.clientX-h.left}px`,J.style.top=`${l.clientY-h.top}px`,l.pointerType==="mouse"&&k.classList.add("has-pointer"),!Q){o==="showcase"&&!y&&(ie=Le((l.clientX-h.left-_/2)/ae,-1,1)*4,ge=Le((l.clientY-h.top-$e/2)/$e,-.5,.5)*-5,le());return}if(l.pointerId!==Q.id)return;let b=l.clientX-Q.x,j=l.clientY-Q.y;if(!Q.axis&&Math.hypot(b,j)>6&&(Q.axis=Math.abs(b)>Math.abs(j)?"horizontal":"vertical",Q.axis==="horizontal"&&(k.setPointerCapture(l.pointerId),k.classList.add("is-dragging"))),Q.axis!=="horizontal")return;l.preventDefault(),Q.moved=!0;let W=performance.now(),T=Math.max(8,W-Q.lastTime),O=-(l.clientX-Q.lastX)/K/T;Q.velocity=Q.velocity*.45+O*.55,Q.lastX=l.clientX,Q.lastTime=W,$=Q.start-b/K,X=$,le()},{passive:!1});function Ke(l){if(!Q||l.pointerId!==Q.id)return;let h=Q;if(Q=null,k.hasPointerCapture(l.pointerId)&&k.releasePointerCapture(l.pointerId),k.classList.remove("is-dragging"),h.moved){qe=performance.now()+400;let b=performance.now()-h.lastTime,j=y||l.type==="pointercancel"||b>120?0:Le(h.velocity*210,-4,4);X=Math.round($+j)}else X=Math.round($);y&&($=X),ze()}I(k,"pointerup",Ke),I(k,"pointercancel",Ke),I(window,"pointerup",Ke),I(k,"lostpointercapture",l=>{Q?.id===l.pointerId&&Ke(l)}),I(k,"dragstart",l=>l.preventDefault()),I(k,"click",l=>{if(performance.now()<qe){l.preventDefault(),l.stopImmediatePropagation();return}let h=l.target.closest(".gc-carousel-card");!h||!k.contains(h)||h.classList.contains("is-active")||(l.preventDefault(),l.stopImmediatePropagation(),Fe(Number(h.dataset.gcItemIndex)))},!0),I(k,"pointerleave",()=>{k.classList.remove("has-pointer"),ie=ge=0,Q||le()}),I(E,"pointerenter",l=>{l.pointerType==="mouse"&&(je=!0)}),I(E,"pointerleave",()=>{je=!1,U=0,ze()}),I(E,"focusin",()=>{we=!0}),I(E,"focusout",()=>{queueMicrotask(()=>{te||(we=E.contains(document.activeElement),U=0,ze())})}),I(document,"visibilitychange",()=>{U=0,ze()});let Te;typeof ResizeObserver<"u"?(Te=new ResizeObserver(l=>{l.some(({target:h})=>h===k||h===N)&&Me(),C&&l.some(({target:h})=>h!==k&&h!==N)&&Se()}),Te.observe(k),v&&Te.observe(N),C&&(Te.observe(M),w.forEach(l=>Te.observe(l,{box:"border-box"})))):I(window,"resize",()=>{Me(),Se()});let rt;return typeof IntersectionObserver<"u"&&(rt=new IntersectionObserver(l=>{Be=!l[0]?.isIntersecting,U=0,ze()}),rt.observe(E)),Me(),oe=!0,at(H),{goTo:Fe,setGeometry(l){d(l),L=-1,Me()},setPlaying:at,setSuspended:Pe,destroy(){te=!0,cancelAnimationFrame(se),Te?.disconnect(),rt?.disconnect(),G.forEach(l=>l()),E.remove()}}}var Ra,Le,Ze,Qe,Jt=V(()=>{ft();Ra=new Set(["infinite","arc","arc-tabs","showcase","timed"]),Le=(t,e,i)=>Math.min(i,Math.max(e,t)),Ze=(t,e)=>(t%e+e)%e,Qe=(t,e)=>Number.isFinite(Number(t))?Number(t):e});function Kt(t){let{host:e,makeCard:i,nativeList:n}=t,a=Array.isArray(t.items)?t.items:[],c=t.options||{},r=["wall","ring","angled"].includes(c.preset)?c.preset:"wall",s=!!c.reducedMotion||window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=a.length,x=r==="ring"?16:r==="wall"?12:o,v=!s&&o>1&&o<12&&r!=="angled"?Math.ceil(x/o)*o:o,p=Array.from({length:o},(l,h)=>h),y=De(Xe(c.depth,55),0,100),g=De(Xe(c.cardWidth,280),80,900),m=De(Xe(c.gap,24),0,160),A=Math.max(1,Xe(c.duration,5)),S=new AbortController,d=(l,h,b,j={})=>l.addEventListener(h,b,{...j,signal:S.signal}),P={wall:"Curved image gallery",ring:"Circular image gallery",angled:"Angled image gallery"},E=`gc-spatial-help-${++Da}`,G=["gc-spatial",`gc-${r}`,...s?["gc-spatial-reduced"]:[]];e.classList.add(...G);let I=new Map,w=(l,h)=>{I.set(l,e.style.getPropertyValue(l)),e.style.setProperty(l,h)};w("--gc-spatial-height",`${De(Xe(c.stageHeight,620),300,1400)}px`),w("--gc-spatial-radius",`${De(Xe(c.radius,18),0,100)}px`),w("--gc-spatial-fit",c.fit==="contain"?"contain":"cover"),w("--gc-spatial-card-width",`${g}px`),w("--gc-spatial-gap",`${m}px`);let u=n?.track??document.createElement("div");u.classList.add("gc-spatial-canvas"),n&&u.classList.add("gc-spatial-native-track"),u.setAttribute("role",n?"list":"group"),u.setAttribute("aria-label",P[r]),u.setAttribute("aria-describedby",E);let f=document.createElement("p");f.id=E,f.className="gc-spatial-sr",f.textContent="Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.";let C=document.createElement("span");C.className="gc-spatial-sr",C.setAttribute("aria-live","polite"),C.setAttribute("aria-atomic","true"),e.append(f,u,C);let M=c.showTitles!==!1&&(r!=="ring"||s||o===1),k=Array.from({length:v},(l,h)=>{let b=h%o,j=a[b],W=i(j,b,{caption:M,description:!1,thumbnail:!0}),T=n?.slot(W)??document.createElement("div");return T.classList.add("gc-spatial-position"),W.classList.add("gc-spatial-card"),W.dataset.spatialIndex=String(h),W.dataset.spatialSourceIndex=String(b),W.tabIndex=h===0?0:-1,h>=o&&W.setAttribute("aria-hidden","true"),!W.getAttribute("aria-label")&&!W.textContent.trim()&&W.setAttribute("aria-label",`View item ${b+1}`),T.contains(W)||T.append(W),T.parentNode!==u&&u.append(T),{position:T,card:W,sourceIndex:b,x:0,y:0,flip:0,tilt:0,lift:0}}),N=document.createElement("div");N.className="gc-spatial-nav";let B=(l,h)=>{let b=document.createElement("button");return b.type="button",b.className="gc-spatial-control",b.setAttribute("aria-label",h),Ne(b,l)},fe=B("previous","Previous item"),q=B("next","Next item"),oe=document.createElement("span");oe.className="gc-spatial-count",oe.setAttribute("aria-hidden","true"),N.append(fe,oe,q);let pe=c.autoplay&&!s?B("playback","Pause gallery motion"):null;pe&&(pe.disabled=o<2,pe.dataset.paused=String(o<2),pe.disabled&&pe.setAttribute("aria-label","Play gallery motion"),N.append(pe)),e.append(N),fe.disabled=q.disabled=o<2;let ce,ye;if(r==="ring"&&o>1&&!s){ce=document.createElement("div"),ce.className="gc-ring-center",ce.setAttribute("aria-hidden","true"),c.showTitles!==!1&&(ye=document.createElement("span"),ye.className="gc-ring-label",ce.append(ye));let l=document.createElement("span");l.textContent="Drag to explore",ce.append(l),u.after(ce)}let ve;o||(ve=document.createElement(n?"li":"p"),ve.className="gc-spatial-empty",ve.textContent="No items available.",u.append(ve));let z=!1,F=0,D=-1,Y=1,Z=1,J=1,te=1,$=1,X=1,ne=0,se=1,U=1,re=0,H=0,je=1,we=!!c.autoplay&&!s&&o>1,Be=!1,Ue=!1,Q=!1,qe=!0,_=null,$e=0,ae=0,Re=0,L=-1,R=!1,K={x:-1e4,y:-1e4,inside:!1};function ie(l=F){if(!ye)return;let h=typeof a[l]?.title=="string"?a[l].title.trim():"";ye.textContent===h&&ye.hidden===!h||(ye.textContent=h,ye.hidden=!h,ge())}function ge(){!ce||z||(ce.classList.remove("is-below"),ce.offsetHeight>ne&&ce.classList.add("is-below"))}function be(l,h=!1,b=null){if(!o){oe.textContent="00 / 00";return}let j=et(l,o),W=b!==null&&k[b]?.sourceIndex===j,T=W&&p[j]!==b;if(W){let O=k[p[j]].card;p[j]=b,T&&(k[b].card.removeAttribute("aria-hidden"),n?.syncFocus(k[b].card),document.activeElement===O&&(R=!0,k[b].card.focus({preventScroll:!0}),R=!1))}if(D===j&&!T){h&&(C.textContent=`Item ${j+1} of ${o}${a[j].title?`: ${a[j].title}`:""}`);return}F=j,ie(),oe.textContent=`${String(F+1).padStart(2,"0")} / ${String(o).padStart(2,"0")}`,k.forEach(({card:O,sourceIndex:he},de)=>{let me=p[he]===de;O.tabIndex=me&&he===F?0:-1,O.classList.toggle("is-selected",me&&he===F),me?O.removeAttribute("aria-hidden"):O.setAttribute("aria-hidden","true"),n?.syncFocus(O)}),h&&(C.textContent=`Item ${F+1} of ${o}${a[F].title?`: ${a[F].title}`:""}`),D!==F&&(D=F,t.onChange?.(F))}function ue(l){we=!!l&&!s&&o>1,pe&&(pe.dataset.paused=String(!we),pe.setAttribute("aria-label",we?"Pause gallery motion":"Play gallery motion")),Pe()}function Se(l){Be=!!l,Be||Pe()}function We(l,h,b){return h+Math.round((l-h)/b)*b}function le(l){let h={index:p[l],target:l,distance:1/0};return k.forEach((b,j)=>{if(b.sourceIndex!==l)return;let W=j;if(r==="ring")W=We(re,j,v);else if(r==="wall"){let O=Math.floor(j/se);W=U>2?We(re,O,U):O}let T=Math.abs(W-re);T<h.distance&&(h={index:j,target:W,distance:T})}),h}function Me(l){let h=l.getBoundingClientRect();return h.left+h.width/2}function ze(){if(o<2)return;let l=Me(k[0].position),h=Me(k[1].position)-l;if(Math.abs(h)<1)return;let b=De(Math.round((Me(u)-l)/h),0,o-1);be(b,!1,b)}function it(l,h=!1){if(!o)return;let b=et(Math.round(Xe(l,0)),o),j=s?{index:b,target:b}:le(b);if(be(b,!0,j.index),s){let W=k[b].position;u.scrollTo({left:u.scrollLeft+Me(W)-Me(u),behavior:"auto"})}else H=j.target;h&&k[j.index].card.focus({preventScroll:!0}),Pe()}function Fe(){if(!z){if(Y=Math.max(1,u.clientWidth),Z=Math.max(1,u.clientHeight),r==="ring"){let l=Math.max(80,Math.min(Y-32,Z-42)),h=De(Xe(c.ringDiameter,l),80,l);X=Math.max(0,h*.38);let b=At*X/Math.max(1,v),j=Math.min(h*.17,b*.8),W=1.15-De(m,0,100)/160;if(J=o<=1?Math.min(g,Y*.65,Z*.58):Math.max(18,Math.min(Math.min(g*.22,j)*W,b*.94)),te=J*1.28,ce){let T=Math.max(0,X-Math.max(32,te)/2-10);ne=Math.floor(T*Math.SQRT2),ce.style.setProperty("--gc-ring-label-width",`${ne}px`),ce.style.setProperty("--gc-ring-label-y",`${u.offsetTop+Z/2}px`),ge()}$=Math.max(24,At*Math.max(1,X)/Math.max(1,v))}else r==="wall"?(se=v>=10?3:v>=4?2:1,U=Math.max(1,Math.ceil(v/se)),te=Math.min((Z-56-(se-1)*m)/se,g*.62,230),J=Math.max(60,Math.min(te*1.5,g,Y*.43)),te=J/1.5,$=J+Math.min(m,70)):(J=Math.min(g,Y*.68,(Z-70)*.76),te=J/.76,$=J*(.72+(100-y)*.001)+m);k.forEach(({position:l})=>{l.style.width=`${Math.max(24,J)}px`,l.style.height=`${Math.max(32,te)}px`}),s&&k.forEach(({position:l})=>{l.style.width=`${Math.min(g,Y*.72)}px`,l.style.height=`${Math.min(Z-40,g*1.15)}px`}),Pe()}}function st(l){if(s||!o||Be)return!1;let h=we&&!Ue&&!Q&&!_&&qe&&!document.hidden;if(h){let T=l/A;r==="angled"?(H+=T*je,H>=o-1&&(H=o-1,je=-1),H<=0&&(H=0,je=1)):H+=T}let b=_?.moved?1:1-Math.exp(-l*11);re+=(H-re)*b,Math.abs(H-re)<1e-4&&(re=H);let j=Math.abs(H-re)>1e-4||h;if(h||_?.moved){let T=_?.moved?re:H,O=r==="wall"?Math.round(T)*se+p[F]%se:Math.round(T),he=r==="wall"?Math.min(et(O,U*se),v-1):et(O,v);be(k[he].sourceIndex,!1,he)}let W=1-Math.exp(-l*13);return k.forEach((T,O)=>{let{position:he,card:de}=T;if(r==="ring"){let me=-Math.PI/2+(O-re)*At/v;T.x=o===1?0:Math.cos(me)*X,T.y=o===1?0:Math.sin(me)*X;let xe=Math.hypot(K.x-(Y/2+T.x),K.y-(Z/2+T.y)),Ce=Math.max(65,J*2.6),He=K.inside&&!_?.moved?Math.max(0,1-xe/Ce):0,Ie=He*He*(50+y*1.3);T.flip+=(Ie-T.flip)*W,Math.abs(T.flip-Ie)>.05&&(j=!0);let _e=o===1?0:me*180/Math.PI+90;he.style.transform=`translate3d(${T.x}px,${T.y}px,0) rotate(${_e}deg)`,de.style.transform=`perspective(700px) rotateY(${T.flip}deg) translateZ(${He*12}px)`,he.style.zIndex=String(O===L?v+2:1)}else if(r==="wall"){let me=O%se,Ce=Math.floor(O/se)-re;if(U>2){let $a=U%2===0?.5:0;Ce=et(Ce-$a+U/2,U)-U/2}let He=Math.min(.68,2.6/Math.max(3,U)),Ie=Ce*He,_e=Math.max($/He,Y*.4),_t=y/100,Ta=Math.sin(Ie)*_e,Xt=(1-Math.cos(Ie))*_e*_t*.65,qa=(me-(se-1)/2)*(te+Math.min(m,50)),Mt=O===L||Q&&O===p[F]?1:0;T.lift+=(Mt-T.lift)*W,Math.abs(Mt-T.lift)>.002&&(j=!0),he.style.transform=`translate3d(${Ta}px,${qa}px,${Xt+T.lift*20}px) rotateY(${-Ie*180/Math.PI*_t}deg)`,he.style.zIndex=String(Math.round(Xt)+(Mt?1e3:1)),de.style.transform=`scale(${1+T.lift*.035})`,he.style.opacity=Math.abs(Ie)>1.6?"0":"1",he.style.visibility=Math.abs(Ie)>1.6?"hidden":"visible"}else{let me=O-re,xe=O===L||Q&&O===p[F]?1:0;T.lift+=(xe-T.lift)*W,Math.abs(xe-T.lift)>.002&&(j=!0);let Ce=-(25+y*.28)*(1-T.lift);he.style.transform=`translate3d(${me*$}px,${-T.lift*14}px,${T.lift*110}px) rotateY(${Ce}deg)`,he.style.zIndex=String(xe?o+2:o-O),de.style.transform="none"}}),j}function at(l){if(ae=0,z)return;let h=Math.min(.05,Math.max(.001,(l-(Re||l-16.7))/1e3));Re=l,st(h)&&qe&&!document.hidden?ae=requestAnimationFrame(at):Re=0}function Pe(){!z&&!ae&&!s&&(ae=requestAnimationFrame(at))}s&&d(u,"scroll",ze,{passive:!0}),d(fe,"click",()=>it(F-1)),d(q,"click",()=>it(F+1)),pe&&d(pe,"click",()=>ue(!we)),d(u,"keydown",l=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(l.key))return;l.preventDefault();let h=l.key==="Home"?0:l.key==="End"?o-1:F+(l.key==="ArrowRight"?1:-1);it(h,!0)}),d(u,"focusin",l=>{Q=!0;let h=l.target.closest?.("[data-spatial-index]");h&&!R&&be(Number(h.dataset.spatialSourceIndex),!1,Number(h.dataset.spatialIndex)),Pe()}),d(u,"focusout",()=>{queueMicrotask(()=>{z||(Q=u.contains(document.activeElement),Pe())})}),d(u,"pointerenter",l=>{l.pointerType!=="touch"&&(Ue=!0,K.inside=!0,Pe())}),d(u,"pointerleave",()=>{Ue=!1,K.inside=!1,L=-1,ie(),Pe()}),d(u,"pointermove",l=>{if(l.pointerType==="touch")return;let h=u.getBoundingClientRect();K.x=l.clientX-h.left,K.y=l.clientY-h.top,K.inside=!0;let b=l.target.closest?.("[data-spatial-index]");L=b?Number(b.dataset.spatialIndex):-1,ie(L>=0?k[L].sourceIndex:F),Pe()}),d(u,"pointerdown",l=>{let h=l.target.closest?.("[data-spatial-index]");h&&be(Number(h.dataset.spatialSourceIndex),!1,Number(h.dataset.spatialIndex)),!(s||o<2||l.pointerType==="mouse"&&l.button!==0)&&(_={id:l.pointerId,x:l.clientX,y:l.clientY,start:H,moved:!1})}),d(window,"pointermove",l=>{if(!_||l.pointerId!==_.id)return;let h=l.clientX-_.x,b=l.clientY-_.y;if(!_.moved){if(Math.abs(b)>12&&Math.abs(b)>Math.abs(h)*1.2){_=null;return}if(Math.abs(h)<7)return;_.moved=!0,u.classList.add("is-dragging"),u.setPointerCapture?.(l.pointerId)}l.cancelable&&l.preventDefault(),H=_.start-h/$,(r==="angled"||r==="wall"&&U<=2)&&(H=De(H,0,r==="wall"?U-1:o-1)),Pe()},{passive:!1});let Ke=l=>{if(!_||l.pointerId!==_.id)return;let h=_.moved;if(_=null,u.classList.remove("is-dragging"),u.hasPointerCapture?.(l.pointerId)&&u.releasePointerCapture(l.pointerId),h){$e=performance.now()+350,H=Math.round(H);let b=r==="wall"?Math.round(H)*se+p[F]%se:Math.round(H),j=r==="wall"?Math.min(et(b,U*se),v-1):et(b,v);be(k[j].sourceIndex,!0,j)}Pe()};d(window,"pointerup",Ke),d(window,"pointercancel",Ke),d(u,"click",l=>{performance.now()<$e&&(l.preventDefault(),l.stopImmediatePropagation())},{capture:!0}),d(u,"dragstart",l=>l.preventDefault()),d(document,"visibilitychange",Pe);let Te=typeof ResizeObserver=="function"?new ResizeObserver(l=>{l.some(h=>h.target===u)?Fe():ge()}):null;Te?.observe(u),ce&&Te?.observe(ce),Te||d(window,"resize",Fe);let rt=typeof IntersectionObserver=="function"?new IntersectionObserver(l=>{qe=l[0]?.isIntersecting??!0,qe&&Pe()},{rootMargin:"100px"}):null;return rt?.observe(e),Fe(),be(0),{goTo:it,setPlaying:ue,setSuspended:Se,destroy(){z||(z=!0,cancelAnimationFrame(ae),Te?.disconnect(),rt?.disconnect(),S.abort(),f.remove(),C.remove(),N.remove(),ce?.remove(),n?ve?.remove():u.remove(),e.classList.remove(...G),I.forEach((l,h)=>l?e.style.setProperty(h,l):e.style.removeProperty(h)))}}}var Da,De,et,Xe,At,Zt=V(()=>{ft();Da=0,De=(t,e,i)=>Math.max(e,Math.min(i,t)),et=(t,e)=>(t%e+e)%e,Xe=(t,e)=>Number.isFinite(Number(t))?Number(t):e,At=Math.PI*2});function Qt({host:t,items:e,options:i,makeCard:n,onChange:a,nativeList:c}){let r=Number(i.stageHeight)||680,s=Math.max(300,r-120),o=Math.max(0,Number(i.gap)||0),x=Number.isFinite(Number(i.depth))?Number(i.depth):45,v=i.previewScroll===!1,p=v?window:t;t.classList.add("gc-stack"),t.style.height=v?"auto":r+"px",t.style.overflowY=v?"visible":"auto",t.style.overscrollBehavior=v?"":"contain",t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Stacked cards. Scroll to explore.");let y=c?.track??document.createElement("div");y.classList.add("gc-stack-track"),t.append(y);let g=e.map((G,I)=>{let w=n(G,I,{caption:i.showTitles,description:!0}),u=c?.slot(w)??document.createElement("div");u.classList.add("gc-stack-slot"),w.parentElement!==u&&u.append(w),y.append(u),u.style.zIndex=I+1,w.style.width=`min(${i.stackCardWidth}px,calc(100% - 48px))`,w.style.minHeight=s+"px";let f=w.querySelectorAll(".gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button"),C=!Array.from(f).some(M=>!M.closest("[hidden]")&&M.textContent.trim());return w.classList.toggle("gc-stack-image-only",C),{card:w,wrap:u,imageOnly:C,start:0,duration:1/0}}),m=0;function A(){return v?-y.getBoundingClientRect().top:t.scrollTop}function S(){m=0;let G=A(),I=0;g.forEach(({card:w,start:u,duration:f},C)=>{let M=Math.max(0,Math.min(1,(G-u)/f));w.style.transform=i.reducedMotion?"none":`perspective(1300px) translateY(${M*-32}px) scale(${1-M*.14}) rotateX(${M*x*.25}deg)`,w.style.filter=`brightness(${1-M*.23})`,M>=.5&&(I=Math.min(C+1,g.length-1))}),g.length&&a?.(I)}function d(){m||(m=requestAnimationFrame(S))}function P(){let G=g.map(({card:u,wrap:f})=>({height:u.offsetHeight,rowHeight:f.offsetHeight})),I=v?window.innerHeight:t.clientHeight,w=y.clientTop+(parseFloat(getComputedStyle(y).paddingTop)||0);g.forEach((u,f)=>{let{height:C,rowHeight:M}=G[f],k=Math.min(40,I-24-C);u.wrap.style.top=k+"px",u.start=w-k,f&&(g[f-1].duration=Math.max(1,u.start-g[f-1].start));let N=u.imageOnly&&C<=I-64?C*.24:0,B=f<g.length-1?o-N:0;u.wrap.style.marginBottom=B+"px",w+=M+B,f===g.length-1&&(u.duration=1/0,y.style.paddingBottom=Math.max(40,I-k-M)+"px")}),d()}let E;return P(),typeof ResizeObserver<"u"&&(E=new ResizeObserver(P),E.observe(y,{box:"border-box"}),g.forEach(({card:G})=>E.observe(G,{box:"border-box"}))),window.addEventListener("resize",P),p.addEventListener("scroll",d,{passive:!0}),{goTo(G){let I=g[Math.max(0,Math.min(g.length-1,Math.round(G)))];if(!I)return;let w=v?window.scrollY+I.start-A():I.start;p.scrollTo({top:w,behavior:i.reducedMotion?"instant":"smooth"})},destroy(){E?.disconnect(),window.removeEventListener("resize",P),cancelAnimationFrame(m),p.removeEventListener("scroll",d),t.classList.remove("gc-stack"),t.removeAttribute("tabindex"),t.removeAttribute("aria-label"),t.style.overflowY="",t.style.overscrollBehavior="",y.remove()}}}var ei=V(()=>{});var ti,mt,ii=V(()=>{ti='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',mt=class{constructor(e,i,n){this.root=e,this.cards=i,this.projects=n,this.assetDirectory=new URL(".",i[0].querySelector("img").src),this.dialog=document.createElement("dialog"),this.dialog.className="project-dialog portfolio-project-dialog";let a=`${e.id}-project-title`;this.dialog.setAttribute("aria-labelledby",a),this.dialog.innerHTML=`<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${ti}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${ti}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${a}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview \xB7 Project copy to come</p></aside></div>`,document.body.append(this.dialog),this.image=this.dialog.querySelector(".project-image"),this.thumbnails=this.dialog.querySelector(".project-thumbnails"),this.dialog.querySelector("[data-project-close]").addEventListener("click",()=>this.dialog.close()),this.dialog.querySelector("[data-gallery-prev]").addEventListener("click",()=>this.showFrame(this.frame-1)),this.dialog.querySelector("[data-gallery-next]").addEventListener("click",()=>this.showFrame(this.frame+1)),this.dialog.addEventListener("close",()=>{document.documentElement.style.overflow=this.previousOverflow,this.returnFocus?.focus({preventScroll:!0})}),this.dialog.addEventListener("click",r=>{if(r.target!==this.dialog)return;let s=this.dialog.getBoundingClientRect();(r.clientX<s.left||r.clientX>s.right||r.clientY<s.top||r.clientY>s.bottom)&&this.dialog.close()}),this.dialog.addEventListener("keydown",r=>{(r.key==="ArrowLeft"||r.key==="ArrowRight")&&(r.preventDefault(),this.showFrame(this.frame+(r.key==="ArrowRight"?1:-1)))});let c=this.dialog.querySelector(".project-image-stage");c.addEventListener("pointerdown",r=>{!r.isPrimary||r.target.closest("button")||(this.galleryPointer={id:r.pointerId,x:r.clientX,y:r.clientY},c.setPointerCapture(r.pointerId))}),c.addEventListener("pointerup",r=>{let s=this.galleryPointer;if(this.galleryPointer=null,!s||s.id!==r.pointerId)return;c.hasPointerCapture(r.pointerId)&&c.releasePointerCapture(r.pointerId);let o=r.clientX-s.x,x=r.clientY-s.y;Math.abs(o)>35&&Math.abs(o)>Math.abs(x)*1.2&&this.showFrame(this.frame+(o<0?1:-1))}),c.addEventListener("pointercancel",()=>{this.galleryPointer=null})}open(e){if(this.project=this.projects[e],!this.project)return;this.returnFocus=this.cards[e],this.dialog.querySelector(".project-category").textContent=this.project.category,this.dialog.querySelector(".project-title").textContent=this.project.title,this.dialog.querySelector(".project-summary").textContent=this.project.description,this.dialog.querySelector(".project-services p").textContent=this.project.services.join(" / "),this.dialog.querySelector(".project-services").hidden=!this.project.services.length,this.dialog.querySelector(".project-notes").hidden=!this.project.notes.length;let i=this.project.gallery.length>1;this.dialog.querySelector("[data-gallery-prev]").hidden=!i,this.dialog.querySelector("[data-gallery-next]").hidden=!i,this.thumbnails.hidden=!i,this.dialog.querySelector(".project-notes ul").replaceChildren(...this.project.notes.map(a=>{let c=document.createElement("li");return c.textContent=a,c})),this.dialog.querySelector("details").open=!1,this.thumbnails.replaceChildren(...this.project.gallery.map((a,c)=>{let r=document.createElement("button");r.type="button",r.className="project-thumbnail",r.setAttribute("aria-label",`Show ${a.label.toLowerCase()}`);let s=document.createElement("img");return s.src=new URL(a.file,this.assetDirectory).href,s.alt="",s.width=1600,s.height=900,r.append(s),r.addEventListener("click",()=>this.showFrame(c)),r})),this.showFrame(0),this.previousOverflow=document.documentElement.style.overflow,document.documentElement.style.overflow="hidden",this.dialog.showModal(),this.dialog.scrollTop=0}showFrame(e){this.frame=(e+this.project.gallery.length)%this.project.gallery.length;let i=this.project.gallery[this.frame];this.image.src=new URL(i.file,this.assetDirectory).href,this.image.alt=`${this.project.title} \u2014 ${i.label.toLowerCase()}`,this.dialog.querySelector(".project-frame-label").textContent=`${this.frame+1} / ${this.project.gallery.length} \u2014 ${i.label}`,[...this.thumbnails.children].forEach((n,a)=>n.setAttribute("aria-current",String(a===this.frame)))}destroy(){this.dialog.open&&(document.documentElement.style.overflow=this.previousOverflow,this.dialog.close()),this.dialog.remove()}}});var Oe,ct,bt=V(()=>{Oe=Object.freeze({containerWidth:100,stageHeight:680,spiralWidth:87,cardWidth:280,spiralRise:52,spiralRiseUnit:"px",aspectRatio:"16:9",spiralGap:3,fit:"cover",imagePadding:0,showSlots:!1}),ct=Object.freeze([{key:"containerWidth",label:"Container width",type:"range",min:50,max:100,step:1,unit:"%"},{key:"spiralWidth",label:"Spiral width",type:"range",min:60,max:100,step:1,unit:"%"},{key:"spiralRiseUnit",label:"Rise measured in",type:"select",choices:[{value:"px",label:"Pixels"},{value:"percent",label:"% of height"}]},{key:"spiralRise",label:"Rise per slot",type:"range",min:8,max:280,step:1,unit:"px",percent:{min:1,max:30,step:.1,unit:"%"}},{key:"aspectRatio",label:"Aspect ratio",type:"select",choices:["16:9","3:2","4:3","1:1","4:5","9:16"].map(t=>({value:t,label:t}))},{key:"spiralGap",label:"Gap between cards",type:"range",min:0,max:16,step:1,unit:"%"},{key:"imagePadding",label:"Image padding",type:"range",min:0,max:20,step:1,unit:"%"},{key:"showSlots",label:"Show slot outlines",type:"checkbox"}])});function ai(t,e,{pauseOnHover:i=!0,interactionRestMs:n=6e3}={}){let a=t.querySelector("[data-orbit-toggle]"),c=new AbortController,r=(d,P,E)=>d.addEventListener(P,E,{signal:c.signal}),s={animateTo:e.animateTo,settleImmediately:e.settleImmediately,openProject:e.openProject};Object.assign(e,{manuallyPaused:!1,hovered:!1,keyboardFocused:!1,inView:!1,autoFrame:0,autoTime:0,resumeAt:0});let o=0,x=!1,v=d=>!!d&&t.contains(d)&&(d.matches(":focus-visible")||!!d.closest(".orbit-card")),p=()=>!x&&e.count>1&&e.inView&&!e.hovered&&!e.keyboardFocused&&!e.manuallyPaused&&!e.pointer&&!e.frame&&!e.viewer.dialog.open&&!document.hidden&&!e.reducedMotion.matches,y=()=>{cancelAnimationFrame(e.autoFrame),clearTimeout(o),e.autoFrame=0,o=0,e.autoTime=0,t.classList.remove("is-autoplaying"),e.status?.setAttribute("aria-live","polite")},g=d=>{if(e.autoFrame=0,!p()){y();return}let P=Math.min(.05,Math.max(0,(d-e.autoTime)/1e3));e.autoTime=d,e.position=(e.position+P/8)%e.count,e.target=e.position,e.velocity=0,e.render(),e.autoFrame=requestAnimationFrame(g)},m=()=>{if(!p()){y();return}let d=e.resumeAt-performance.now();if(d>0){y(),o=setTimeout(m,d);return}e.autoFrame||(e.autoTime=performance.now(),t.classList.add("is-autoplaying"),e.status?.setAttribute("aria-live","off"),e.autoFrame=requestAnimationFrame(g))},A=(d=6e3)=>{y(),e.resumeAt=performance.now()+d};e.animateTo=function(...d){A(n),s.animateTo.apply(this,d),m()},e.settleImmediately=function(...d){s.settleImmediately.apply(this,d),m()},e.openProject=function(...d){A(),s.openProject.apply(this,d),m()},i&&(r(t,"pointerenter",d=>{d.pointerType!=="touch"&&(e.hovered=!0,m())}),r(t,"pointerleave",d=>{d.pointerType!=="touch"&&(e.hovered=!1,m())})),r(t,"focusin",d=>{e.keyboardFocused=v(d.target),m()}),r(t,"focusout",d=>{e.keyboardFocused=v(d.relatedTarget),m()}),r(t,"pointerup",()=>{A(n),m()}),r(t,"pointercancel",()=>{A(n),m()}),r(e.viewer.dialog,"close",()=>{A(),m()}),r(document,"visibilitychange",m),r(e.reducedMotion,"change",m),r(a,"click",()=>{e.manuallyPaused=!e.manuallyPaused,e.resumeAt=0,a.dataset.paused=String(e.manuallyPaused),a.setAttribute("aria-label",e.manuallyPaused?"Resume carousel":"Pause carousel"),m()});let S=new IntersectionObserver(d=>{e.inView=d.some(P=>P.isIntersecting&&P.intersectionRatio>=.15),m()},{threshold:.15});return S.observe(e.stage),e.stopAutoplay=y,e.syncAutoplay=m,()=>{x=!0,y(),c.abort(),S.disconnect(),Object.assign(e,s)}}var ri=V(()=>{});var Ae,jt,oi,ni,si,ci,li,di,pi,gi,ui,hi,fi,Pt,mi,lt,bi,Et=V(async()=>{Ae=await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"),jt=Ae.BufferGeometry,oi=Ae.Float32BufferAttribute,ni=Ae.LineBasicMaterial,si=Ae.LineLoop,ci=Ae.DoubleSide,li=Ae.Mesh,di=Ae.NoToneMapping,pi=Ae.PerspectiveCamera,gi=Ae.PlaneGeometry,ui=Ae.Raycaster,hi=Ae.Scene,fi=Ae.ShaderMaterial,Pt=Ae.SRGBColorSpace,mi=Ae.TextureLoader,lt=Ae.Vector2,bi=Ae.WebGLRenderer});var Oa,xt,xi=V(async()=>{Oa=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js"),xt=Oa.default});var Ga,Lt,yi=V(async()=>{Ga=await import("https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js"),Lt=Ga.CustomEase});function vi(t,e,i=64){let n=t/e,a=new gi(t,t*9/16,i,1),c=a.attributes.position,r=a.attributes.uv;for(let s=0;s<c.count;s++){let o=(r.getX(s)-.5)*e;c.setX(s,n*Math.sin(o)),c.setZ(s,n*(Math.cos(o)-1))}return a.computeVertexNormals(),a.computeBoundingSphere(),a}function wi(t,e){return 2*Math.atan(t/(2*e))*180/Math.PI}var zt=V(async()=>{await Et()});function dt(t,e){let i=1-Math.max(0,Math.min(20,e))/100;return{cardWidth:t.slotWidth*i,panelArc:t.radiansPerSlide*i,height:t.slotHeight*i}}function yt(t,{radius:e,pitch:i,radiansPerSlide:n}){let a=t*n;return{x:Math.sin(a)*e,y:-t*i,z:(Math.cos(a)-1)*e,angle:a,taper:1,shade:(1-Math.cos(a))/2*.58}}function ki(t,e){let i=dt(t,e);return vi(i.cardWidth,i.panelArc)}function It(t,e=64){let i=[];for(let n=0;n<=e;n++){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),t.slotHeight/2,t.radius*(Math.cos(a)-1))}for(let n=e;n>=0;n--){let a=(n/e-.5)*t.radiansPerSlide;i.push(t.radius*Math.sin(a),-t.slotHeight/2,t.radius*(Math.cos(a)-1))}return i}var vt=V(async()=>{await zt()});function Tt(t,e){let i=ki(t,e);return i.scale(1,1/t.aspect/(9/16),1),i.computeVertexNormals(),i.computeBoundingSphere(),i}function Si(t,e,i,n,a){let c=Math.min(t,e)*Math.min(40,Math.max(0,a))/100,r=t-2*c,s=e-2*c,o=r/s,x=n==="fit"?Math.max:Math.min,v=x(1,o/i),p=x(1,i/o);return{contentWidth:r,contentHeight:s,uvScaleX:v,uvScaleY:p,imageWidth:r/v,imageHeight:s/p,padding:c}}var Mi=V(async()=>{await vt();await vt()});function Ai({stageWidth:t,stageHeight:e,spiralWidthPercent:i,cardWidth:n,aspect:a,rise:c,riseUnit:r}){let s=Math.max(1,t*i/200),o=n;return{radius:s,slotWidth:o,slotHeight:o/a,aspect:a,pitch:r==="percent"?e*c/100:c,radiansPerSlide:o/s,cardsPerTurn:Math.PI*2*s/o}}function ji(t,e,i){let n=e.radius*2.4,a=n/(n+2*e.radius),c=Math.ceil((i/(2*a)+e.slotHeight/2)/e.pitch)+2,r=Math.floor(t);return{first:r-c,last:r+c,count:c*2+1}}function Pi(t,e,i){let n=t*e.radiansPerSlide,a=n-i.panelArc/2,c=n+i.panelArc/2,r=Math.PI*2,s=S=>Math.ceil((a-S)/r)<=Math.floor((c-S)/r),o=s(0)?1:Math.max(Math.cos(a),Math.cos(c)),x=s(Math.PI)?-1:Math.min(Math.cos(a),Math.cos(c)),v=e.radius*2.4,p=v/(v+e.radius*(1-o)),y=v/(v+e.radius*(1-x)),g=-t*e.pitch,m=g+i.height/2,A=g-i.height/2;return{minY:Math.min(A*p,A*y),maxY:Math.max(m*p,m*y)}}function Ei(t,e){let i=Math.min(80,e*.08),n=c=>Math.max(0,Math.min(1,c)),a=Math.min(n((e/2-t.minY)/i),n((t.maxY+e/2)/i));return a*a*(3-2*a)}function Li(t,e,i,n){let a=i-e;return Math.abs(a)>n/2&&(a-=Math.round(a/n)*n),t+a}var Ci,zi=V(async()=>{await vt();Ci=(t,e)=>(t%e+e)%e});var Ti,Ii=V(()=>{Ti=`.reference-carousel-shell .orbit-webgl{position:absolute;inset:0;display:none;width:100%;height:100%;touch-action:pinch-zoom}
.reference-carousel-shell .has-webgl-carousel .orbit-webgl{display:block}
/* Keep the original buttons in the accessibility tree and the sizing engine.
   Pointer hit-testing follows the actual curved mesh, not a flat DOM rectangle. */
.reference-carousel-shell .has-webgl-carousel .orbit-ring{opacity:0;pointer-events:none}
.reference-carousel-shell .has-webgl-carousel .orbit-card{pointer-events:none!important}
/* Match the current no-hover-growth behavior while CSS is loading or recovering.
   Saved CSS comparison routes do not have data-renderer and remain unchanged. */
.reference-carousel-shell .reference-carousel[data-renderer]:not(.is-moving):not(.is-dragging) .orbit-card.is-centered:hover .orbit-surface{transform:scale(1)}
`});function qi(t,{textureSource:e=i=>i.querySelector("img").src}={}){let{root:i,stage:n}=t,a;try{a=new bi({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return i.dataset.renderer="css-fallback",()=>{delete i.dataset.renderer}}a.outputColorSpace=Pt,a.toneMapping=di,a.setClearColor(0,0);let c=a.domElement;c.style.removeProperty("display"),c.className="orbit-webgl",c.setAttribute("aria-hidden","true"),n.append(c);let r=new hi,s=new pi,o=new ui,x=new lt,v=new AbortController,p=(z,F,D)=>z.addEventListener(F,D,{signal:v.signal}),y=t.render,g=t.pointerDown,m=new Map,A=[],S,d,P=t.position,E=t.position,G="",I=!1,w=!1,u=null,f=null,C=!1,M=!1;i.dataset.renderer="loading-webgl";let k=()=>Ai({stageWidth:n.clientWidth,stageHeight:n.clientHeight,spiralWidthPercent:Number(i.dataset.spiralWidth),cardWidth:Number(i.dataset.cardWidth),aspect:Number(i.dataset.cardAspect),rise:Number(i.dataset.rise),riseUnit:i.dataset.riseUnit}),N=()=>{let z=t.cards[0],F=new fi({uniforms:{screenshot:{value:m.get(e(z))},dimensions:{value:new lt},contentDimensions:{value:new lt(1,1)},imageScale:{value:new lt(1,1)},cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},vertexShader:Ua,fragmentShader:_a,transparent:!0,side:ci,depthTest:!0,depthWrite:!0,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:0}),D=new li(S,F),Y=new si(d,new ni({color:7438474,transparent:!0,opacity:.42,depthWrite:!1})),Z={card:z,mesh:D,guide:Y,material:F,surface:{scale:1,target:1}};D.userData.panel=Z,A.push(Z),r.add(D,Y)},B=z=>{let F=ji(P,z,n.clientHeight);for(;A.length<F.count;)N();for(;A.length>F.count;){let D=A.pop();r.remove(D.mesh,D.guide),D.material.dispose(),D.guide.material.dispose()}A.forEach((D,Y)=>{D.offset=F.first+Y-P,D.card=t.cards[Ci(F.first+Y,t.count)],D.material.uniforms.screenshot.value=m.get(e(D.card))})},fe=()=>{let z=n.clientWidth,F=n.clientHeight,D=k(),Y=Number(i.dataset.slotGap||3);B(D);let Z=dt(D,Y),{cardWidth:J,panelArc:te}=Z,{radius:$}=D;i.dataset.slotMetrics=JSON.stringify({...D,cardArc:te,cardWidth:J,cardHeight:Z.height,gap:Y,imageFit:i.dataset.imageFit,imagePadding:Number(i.dataset.imagePadding||0)}),A.forEach(H=>{H.material.uniforms.dimensions.value.set(J,Z.height);let je=H.material.uniforms.screenshot.value.image,we=Si(J,Z.height,(je.naturalWidth||je.width)/(je.naturalHeight||je.height),i.dataset.imageFit,Number(i.dataset.imagePadding||0));H.material.uniforms.contentDimensions.value.set(we.contentWidth,we.contentHeight),H.material.uniforms.imageScale.value.set(we.uvScaleX,we.uvScaleY)});let X=Math.min(window.devicePixelRatio||1,2),ne=`${z}:${F}:${J}:${te}:${Z.height}:${$}:${X}`;if(ne===G||!z||!F)return;G=ne,a.setPixelRatio(X),a.setSize(z,F,!1),s.position.set(0,0,$*2.4),s.fov=wi(F,s.position.z),s.aspect=z/F,s.near=.1,s.far=$*12,s.updateProjectionMatrix(),s.updateMatrixWorld();let se=S;S=Tt(D,Y);let U=d;d=new jt,d.setAttribute("position",new oi(It(D),3));let re=0;A.forEach(H=>{H.mesh.geometry=S,H.guide.geometry=d,H.material.uniforms.dimensions.value.set(J,Z.height),H.material.uniforms.cornerRadius.value=re}),se?.dispose(),U?.dispose()},q=()=>{if(!I||w||C||M||!t.geometry)return;M=!0,P=Li(P,E,t.position,t.count),E=t.position,fe();let z=k(),F=dt(z,Number(i.dataset.slotGap||3)),D=i.dataset.focusMode==="keyboard"&&i.contains(document.activeElement),Y=0;A.forEach(J=>{let{card:te,mesh:$,material:X}=J,ne=yt(J.offset,z),se=Pi(J.offset,z,F),U=Ei(se,n.clientHeight),re=D&&te===t.cards[t.active]&&Math.abs(J.offset)<.5;X.polygonOffsetUnits=Math.abs(J.offset)*8,$.position.set(ne.x,ne.y,ne.z),$.rotation.y=ne.angle,$.visible=U>.001,$.visible&&Y++,J.guide.position.copy($.position),J.guide.rotation.copy($.rotation),J.guide.visible=i.dataset.showSlots==="true"&&$.visible,J.guide.material.opacity=U*.42,X.uniforms.fade.value=U,X.uniforms.shade.value=ne.shade,X.uniforms.focused.value=re?1:0});let Z=JSON.stringify({cardsPerTurn:z.cardsPerTurn,visibleCount:Y,poolCount:A.length,stageWidth:n.clientWidth,stageHeight:n.clientHeight,cardWidth:F.cardWidth,cardHeight:F.height,pitch:z.pitch,radius:z.radius,uniqueCount:t.count});i.dataset.responsiveMetrics!==Z&&(i.dataset.responsiveMetrics=Z),f&&!t.pointer&&(u=oe(f)),r.updateMatrixWorld(!0),a.render(r,s),M=!1},oe=z=>{if(!I||C)return null;let F=c.getBoundingClientRect();x.set((z.clientX-F.left)/F.width*2-1,-(z.clientY-F.top)/F.height*2+1),o.setFromCamera(x,s);for(let D of o.intersectObjects(A.map(Y=>Y.mesh))){let Y=D.object.userData.panel;if(!D.object.visible||Y.material.uniforms.fade.value<=.25)continue;let{x:Z,y:J}=Y.material.uniforms.dimensions.value,te=Y.material.uniforms.cornerRadius.value,$=Math.abs((D.uv.x-.5)*Z)-Z/2+te,X=Math.abs((D.uv.y-.5)*J)-J/2+te;if(!(Math.hypot(Math.max($,0),Math.max(X,0))+Math.min(Math.max($,X),0)>te))return Y}return null};t.render=function(){y.call(this),q()},t.pointerDown=function(z){g.call(this,z),I&&!C&&this.pointer?.id===z.pointerId&&(this.pointer.card=oe(z)?.card||null),f=null,u=null},p(n,"pointermove",z=>{f=z.pointerType==="mouse"?{clientX:z.clientX,clientY:z.clientY}:null,u=z.pointerType==="mouse"&&!t.pointer?oe(z):null,c.style.cursor=t.pointer?.dragging?"grabbing":u?"pointer":"grab",q()}),p(n,"pointerleave",()=>{f=null,u=null,q()}),p(n,"pointerup",()=>{u=null,q()}),p(i,"focusin",q),p(i,"focusout",()=>queueMicrotask(q)),p(document,"keydown",()=>queueMicrotask(q)),p(document,"pointerdown",()=>queueMicrotask(q)),p(t.reducedMotion,"change",()=>{t.reducedMotion.matches&&A.forEach(({surface:z})=>{xt.killTweensOf(z),z.scale=z.target}),q()}),p(i,"playground-change",q),p(i,"slot-guides-change",q),p(c,"webglcontextlost",z=>{z.preventDefault(),C=!0,i.classList.remove("has-webgl-carousel"),i.dataset.renderer="css-fallback"}),p(c,"webglcontextrestored",()=>{C=!1,I&&(i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl",q())});let pe=new ResizeObserver(()=>q());pe.observe(n);let ce=new mi,ye=t.cards.map(z=>new Promise((F,D)=>{let Y=e(z),Z=ce.load(Y,F,void 0,D);Z.colorSpace=Pt,Z.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy()),m.set(Y,Z)})),ve=()=>{w||(S=Tt(k(),Number(i.dataset.slotGap||3)),d=new jt,I=!0,q(),i.classList.add("has-webgl-carousel"),i.dataset.renderer="webgl")};return Promise.all(ye).then(ve).catch(()=>{w||(i.dataset.renderer="css-fallback")}),()=>{w=!0,v.abort(),pe.disconnect(),t.render=y,t.pointerDown=g,i.classList.remove("has-webgl-carousel"),delete i.dataset.renderer,A.forEach(({material:z,surface:F,guide:D})=>{xt.killTweensOf(F),z.dispose(),D.material.dispose()}),S?.dispose(),d?.dispose(),m.forEach(z=>z.dispose()),a.dispose(),a.forceContextLoss(),c.remove()}}var Zr,Ua,_a,$i=V(async()=>{await Et();await xi();await yi();await zt();await Mi();await zi();xt.registerPlugin(Lt);Zr=Lt.create("portfolio-surface",".2,.75,.25,1"),Ua=`
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,_a=`
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
`});var Fi=V(()=>{(()=>{"use strict";let t=Math.PI*2,e=(c,r)=>(c%r+r)%r,i=(c,r,s)=>Math.min(s,Math.max(r,c));class n{constructor(r){this.root=r,this.stage=r.querySelector(".orbit-stage"),this.cards=[...r.querySelectorAll(".orbit-card")],this.count=this.cards.length,this.visualCards=[...this.cards],this.cards.forEach((s,o)=>{s.dataset.slideIndex=o;let x=s.cloneNode(!0);x.dataset.repeat="true",x.tabIndex=-1,x.setAttribute("aria-hidden","true"),x.removeAttribute("aria-pressed"),s.parentElement.append(x),this.visualCards.push(x)}),!(!this.count||!this.stage)&&(this.title=r.querySelector(".orbit-title"),this.description=r.querySelector(".orbit-description"),this.status=r.querySelector(".orbit-status"),this.viewer=new window.ProjectViewer(r,this.cards),this.pagination=r.querySelector(".orbit-pagination"),this.position=0,this.target=0,this.velocity=0,this.active=-1,this.frame=0,this.lastTime=0,this.pointer=null,this.ignoreClickUntil=0,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)"),this.events=new AbortController,this.options={signal:this.events.signal},this.tick=this.tick.bind(this),this.createCurvedPanels(),this.createPagination(),this.bindEvents(),this.resizeObserver=new ResizeObserver(()=>this.measure()),this.resizeObserver.observe(this.stage),this.measure())}createPagination(){this.dots=this.cards.map((r,s)=>{let o=document.createElement("button");return o.type="button",o.className="orbit-dot",o.setAttribute("aria-label",`Show ${r.dataset.title||`screenshot ${s+1}`}`),o.addEventListener("click",()=>this.goTo(s),this.options),this.pagination?.append(o),o}),this.count===1&&this.root.querySelectorAll(".orbit-arrow").forEach(r=>{r.disabled=!0})}bindEvents(){let r=(s,o,x,v={})=>s.addEventListener(o,x,{...this.options,...v});r(this.root.querySelector("[data-orbit-prev]"),"click",()=>this.step(-1)),r(this.root.querySelector("[data-orbit-next]"),"click",()=>this.step(1)),r(this.stage,"keydown",s=>{let o={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1};s.key in o?(s.preventDefault(),this.step(o[s.key])):(s.key==="Home"||s.key==="End")&&(s.preventDefault(),this.goTo(s.key==="Home"?0:this.count-1))}),r(this.stage,"pointerdown",s=>this.pointerDown(s)),r(this.stage,"pointermove",s=>this.pointerMove(s),{passive:!1}),r(this.stage,"pointerup",s=>this.pointerUp(s)),r(this.stage,"pointercancel",s=>this.pointerUp(s,!0)),r(this.stage,"lostpointercapture",s=>this.pointerUp(s,!0)),r(this.stage,"dragstart",s=>s.preventDefault()),r(window,"blur",()=>{this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0)}),r(this.stage,"click",s=>{if(s.detail!==0&&performance.now()<this.ignoreClickUntil){s.preventDefault(),s.stopPropagation();return}let o=s.target.closest(".orbit-card");o&&this.openProject(Number(o.dataset.slideIndex))}),r(this.stage,"focusin",s=>{let o=this.cards.indexOf(s.target.closest(".orbit-card"));!this.pointer&&o>=0&&o!==this.active&&this.goTo(o)}),r(this.reducedMotion,"change",()=>{this.reducedMotion.matches&&this.settleImmediately()}),r(document,"visibilitychange",()=>{document.hidden&&(this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0),this.settleImmediately())})}createCurvedPanels(){this.segmentCount=20,this.panels=this.visualCards.map(r=>{let s=r.querySelector(".orbit-surface"),o=s.querySelector("img"),x=Array.from({length:this.segmentCount},(v,p)=>{let y=document.createElement("span");return y.className="orbit-strip",y.setAttribute("aria-hidden","true"),y.dataset.stripIndex=p,y.style.backgroundImage=`url("${o.src}")`,s.append(y),y});return r.classList.add("is-curved"),{card:r,strips:x}})}measure(){let r=this.stage.clientWidth,s=this.stage.clientHeight,o=r<=700;this.cards[0].style.removeProperty("width");let x=this.cards[0].offsetWidth,v=t/8,p=v*.88,y=x/p;this.geometry={radius:y,panelArc:p,cardWidth:x,pitch:i(s/13,36,52),halfWindow:6.5,radiansPerSlide:v,dragUnitX:Math.max(85,r*(o?.32:.18)),dragUnitY:i(s*.13,65,105)},this.stage.style.perspective=`${(y*2.4).toFixed(3)}px`;let g=p/this.segmentCount,m=2*y*Math.sin(g/2),A=x*9/16;this.panels.forEach(({card:S,strips:d})=>{S.style.width=`${x}px`,d.forEach((P,E)=>{let G=-p/2+(E+.5)*g,I=y*Math.sin(G),w=y*(Math.cos(G)-1);P.style.width=`${(m+.6).toFixed(4)}px`,P.style.backgroundSize=`${x}px ${A}px`,P.style.backgroundPosition=`${(-E*x/this.segmentCount).toFixed(4)}px 0px`,P.style.transform=`translateX(-50%) translate3d(${I.toFixed(4)}px, 0px, ${w.toFixed(4)}px) rotateY(${(G*180/Math.PI).toFixed(4)}deg)`})}),this.render()}render(){if(!this.geometry)return;let{radius:r,pitch:s,halfWindow:o,radiansPerSlide:x}=this.geometry;this.visualCards.forEach(p=>{let y=Number(p.dataset.slideIndex),g=e(y-this.position+this.count/2,this.count)-this.count/2;p.dataset.repeat&&(g+=g<0?this.count:-this.count);let m=g*x,A=Math.cos(m),S=Math.sin(m),d=(1-A)/2,P=1-g/o*.11,E=S*r*P,G=g*s,I=A*r*P-r,w=m*180/Math.PI,u=i((o-Math.abs(g))/.65,0,1);p.style.transform=`translate(-50%, -50%) translate3d(${E.toFixed(3)}px, ${G.toFixed(3)}px, ${I.toFixed(3)}px) rotateY(${w.toFixed(3)}deg) scale(${P.toFixed(4)})`,p.style.zIndex="auto",p.style.setProperty("--orbit-shade",String(d*.58)),p.style.setProperty("--orbit-fade",String(u)),p.style.opacity="1",p.style.visibility=u>0?"visible":"hidden",p.style.pointerEvents=u>.25?"auto":"none",p.dataset.offset=g.toFixed(5)});let v=e(Math.round(this.position),this.count);v!==this.active&&this.updateActive(v)}updateActive(r){let s=this.visualCards.includes(document.activeElement);this.active=r,this.cards.forEach((o,x)=>{let v=x===r;o.classList.toggle("is-centered",v),o.tabIndex=v?0:-1,o.setAttribute("aria-pressed",String(v)),this.dots[x].setAttribute("aria-current",String(v))}),this.title&&(this.title.textContent=this.cards[r].dataset.title||""),this.description&&(this.description.textContent=this.cards[r].dataset.caption||""),this.status&&(this.status.textContent=`${this.cards[r].dataset.title}, project ${r+1} of ${this.count}`),s&&!this.pointer&&this.cards[r].focus({preventScroll:!0}),this.root.dataset.activeIndex=String(r)}goTo(r){let s=e(r-this.position+this.count/2,this.count)-this.count/2;this.animateTo(this.position+s)}step(r){this.animateTo(Math.round(this.target)+r)}animateTo(r,s=0){if(this.target=Math.round(r),this.velocity=s,this.reducedMotion.matches||this.count<2){this.settleImmediately();return}this.root.classList.add("is-moving"),this.frame||(this.lastTime=performance.now(),this.frame=requestAnimationFrame(this.tick))}tick(r){this.frame=0;let s=Math.min((r-this.lastTime)/1e3,.032);this.lastTime=r;let o=(this.target-this.position)*95-this.velocity*20;if(this.velocity+=o*s,this.position+=this.velocity*s,Math.abs(this.target-this.position)<5e-4&&Math.abs(this.velocity)<.005){this.settleImmediately();return}this.render(),this.frame=requestAnimationFrame(this.tick)}settleImmediately(){cancelAnimationFrame(this.frame),this.frame=0,this.position=e(Math.round(this.target),this.count),this.target=this.position,this.velocity=0,this.root.classList.remove("is-moving"),this.render()}openProject(r){if(this.viewer.dialog.open||!Number.isInteger(r)||!this.cards[r])return;let s=e(r-this.position+this.count/2,this.count)-this.count/2;this.target=Math.round(this.position+s),this.settleImmediately(),this.viewer.open(r)}pointerDown(r){if(!r.isPrimary){this.pointer&&this.pointerUp({pointerId:this.pointer.id},!0);return}r.button!==0||this.count<2||this.pointer||this.viewer.dialog.open||(cancelAnimationFrame(this.frame),this.frame=0,this.root.classList.remove("is-moving"),this.pointer={id:r.pointerId,x:r.clientX,y:r.clientY,startPosition:this.position,lastTime:performance.now(),lastMovement:performance.now(),speed:0,dragging:!1,axis:null,lastCoordinate:0,travel:0,card:r.target.closest(".orbit-card")},this.stage.setPointerCapture(r.pointerId))}pointerMove(r){let s=this.pointer;if(!s||s.id!==r.pointerId)return;let o=r.clientX-s.x,x=r.clientY-s.y;if(!s.dragging){if(Math.max(Math.abs(o),Math.abs(x))<6)return;s.axis=Math.abs(x)>Math.abs(o)?"y":"x",s.lastCoordinate=s.axis==="x"?s.x:s.y,s.dragging=!0,this.root.classList.add("is-dragging")}r.preventDefault();let v=s.axis==="x"?r.clientX:r.clientY,p=s.axis==="x"?o:x,y=s.axis==="x"?this.geometry.dragUnitX:this.geometry.dragUnitY,g=performance.now(),m=Math.max(8,g-s.lastTime),A=-(v-s.lastCoordinate)/y/m*1e3;s.speed=s.speed*.35+A*.65,s.lastMovement=g,s.lastTime=g,s.lastCoordinate=v,s.travel=p,this.position=s.startPosition-p/y,this.render()}pointerUp(r,s=!1){let o=this.pointer;if(!o||o.id!==r.pointerId)return;if(this.pointer=null,this.root.classList.remove("is-dragging"),this.ignoreClickUntil=performance.now()+500,this.stage.hasPointerCapture(o.id)&&this.stage.releasePointerCapture(o.id),!o.dragging){this.animateTo(Math.round(this.position)),!s&&o.card&&this.openProject(Number(o.card.dataset.slideIndex));return}let x=s||performance.now()-o.lastMovement>90?0:i(o.speed,-10,10),v=Math.round(this.position+(this.reducedMotion.matches?0:x*.2)),p=this.position-o.startPosition;!s&&Math.abs(o.travel)>18&&Math.abs(p)>.12&&v===Math.round(o.startPosition)&&(v+=Math.sign(p)),this.animateTo(v,x)}destroy(){cancelAnimationFrame(this.frame),this.events.abort(),this.viewer.destroy(),this.panels.forEach(({card:r,strips:s})=>{s.forEach(o=>o.remove()),r.classList.remove("is-curved"),r.style.removeProperty("width")}),this.stage.style.removeProperty("perspective"),this.resizeObserver.disconnect(),this.pagination?.replaceChildren(),this.visualCards.filter(r=>r.dataset.repeat).forEach(r=>r.remove()),this.root.classList.remove("is-moving","is-dragging"),delete this.root.spiralCarousel}}function a(c=document){c.querySelectorAll("[data-spiral-carousel]").forEach(r=>{r.spiralCarousel||(r.spiralCarousel=new n(r))})}window.SpiralCarousel={init:a},a()})()});var Ri,Ni=V(()=>{Ri=`/* Generated selector scope; source geometry declarations are unchanged. */
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

`});var Hi,Wi=V(()=>{Hi=`.project-dialog {
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
`});var Oi,Di=V(()=>{Oi=`.gc-spiral-root{margin-inline:auto;max-width:100%;min-width:0;isolation:isolate}
.gc-spiral-root .slot-carousel{--orbit-ink:var(--gc-ink,#20252d);--orbit-muted:var(--gc-muted,#65717c);--orbit-line:var(--gc-line,#bfc9d1);--orbit-accent:var(--gc-accent,#476dc2);--orbit-card-radius:0px;--orbit-hover-scale:1}
.gc-spiral-root .slot-carousel .orbit-stage{min-height:0;max-height:none;height:680px;mask-image:linear-gradient(transparent,#000 5%,#000 95%,transparent)}
.gc-spiral-root .orbit-controls{justify-content:center;padding:12px 0 0;margin:0;gap:12px}
.gc-spiral-root .orbit-pagination[hidden]{display:none!important}
.gc-spiral-root .gc-spiral-caption{margin:12px 16px 4px;text-align:center;font-family:inherit;font-size:14px;font-weight:500;line-height:1.4;min-height:20px}
.gc-spiral-root .gc-spiral-caption[hidden]{display:none}
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
`});var Ui={};Yt(Ui,{mountSpiral:()=>er,spiralControls:()=>ct,spiralDefaults:()=>Oe});function qt(t,e,i){for(let n of Bi)t.removeAttribute(n);for(let[n,a]of Object.entries(e.imageAttrs||{}))Bi.has(n)&&a!=null&&t.setAttribute(n,String(a));t.src=e.src,t.alt=e.alt||"",t.draggable=!1,t.decoding="async",t.setAttribute("data-gc-spiral-source",e.src),t.isConnected&&i?.(t)}function Qa(t){if(!t||t==="#")return null;try{let e=new URL(t,location.href);return["http:","https:","mailto:","tel:"].includes(e.protocol)?e.href:null}catch{return null}}function er(t){let{host:e,onChange:i=()=>{},loadImage:n}=t,a=t.items.filter(u=>u.src),c={...Oe,...t.options},r=!1;if(!a.length){let u=document.createElement("p");return u.className="gc-spiral-empty",u.textContent="Add images to this source to preview the spiral.",e.append(u),{destroy(){u.remove()}}}let s=document.createElement("div");s.className="gc-spiral-root reference-carousel-shell";let o=document.createElement("div");o.className="orbit-carousel spiral-carousel slot-carousel",o.dataset.spiralCarousel="",o.id=`gc-spiral-${++Ka}`,o.setAttribute("role","region"),o.setAttribute("aria-label","Spiral gallery"),o.innerHTML='<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';let x=o.querySelector(".orbit-stage"),v=o.querySelector(".orbit-ring"),p=o.querySelector("[data-orbit-toggle]");Ne(o.querySelector("[data-orbit-prev]"),"previous"),Ne(o.querySelector("[data-orbit-next]"),"next"),Ne(p,"playback");let y=o.querySelector(".gc-spiral-caption");a.forEach((u,f)=>{let C=document.createElement("button");C.className="orbit-card",C.type="button",C.dataset.title=u.title||"",C.dataset.imageSource=u.src,C.setAttribute("aria-label",u.title?`View ${u.title}`:`View image ${f+1}`);let M=document.createElement("span");M.className="orbit-surface";let k=document.createElement("img");qt(k,u),M.append(k),C.append(M),v.append(C)}),s.append(o),e.append(s);let g=()=>{s.style.width=`${Ye(c.containerWidth,100,20,100)}%`,x.style.height=`${Ye(c.stageHeight,680,280,1600)}px`,o.style.setProperty("--orbit-card-width",`${Ye(c.cardWidth,280,80,720)}px`),o.dataset.spiralWidth=String(Ye(c.spiralWidth,87,20,100)),o.dataset.cardWidth=String(Ye(c.cardWidth,280,80,720)),o.dataset.rise=String(Ye(c.spiralRise,52,c.spiralRiseUnit==="percent"?1:8,c.spiralRiseUnit==="percent"?50:500)),o.dataset.riseUnit=c.spiralRiseUnit==="percent"?"percent":"px",o.dataset.cardAspect=String(Za(c.aspectRatio)),o.dataset.imageFit=c.fit==="contain"||c.fit==="fit"?"fit":"fill",o.dataset.imagePadding=String(Ye(c.imagePadding,0,0,20)),o.dataset.slotGap=String(Ye(c.spiralGap,3,0,16)),o.dataset.showSlots=String(!!c.showSlots),y.hidden=!c.showTitles,o.classList.toggle("gc-spiral-reduced",!!c.reducedMotion)};g();let m=a.map(u=>({title:u.title||"",category:"",description:Gi(u.description),services:[],notes:[],gallery:[{file:u.src,label:"Image"}]}));class A extends mt{constructor(f,C){super(f,C,m),this.dialog.classList.add("gc-spiral-dialog"),t.attachDialog?.(this.dialog),this.dialog.querySelector(".project-demo-note").remove(),this.dialog.querySelector(".project-category").hidden=!0,this.dialog.setAttribute("aria-label","Image details"),this.sourceLink=document.createElement("a"),this.sourceLink.className="gc-spiral-source-link",this.sourceLink.hidden=!0,this.dialog.querySelector(".project-info").append(this.sourceLink)}open(f){let C=a[f];if(!C||c.clickAction==="none")return;let M=Qa(C.link);if(c.clickAction==="link"){M&&location.assign(M);return}super.open(f);let k=this.dialog.querySelector(".project-title");k.hidden=!C.title,C.title?this.dialog.setAttribute("aria-labelledby",k.id):this.dialog.removeAttribute("aria-labelledby"),this.dialog.querySelector(".project-summary").hidden=!Gi(C.description),this.sourceLink.hidden=!M,M?(this.sourceLink.href=M,this.sourceLink.textContent=C.buttonLabel||"Open link"):this.sourceLink.removeAttribute("href"),this.dialog.classList.toggle("gc-spiral-reduced",!!c.reducedMotion)}showFrame(f){super.showFrame(f);let C=m.indexOf(this.project),M=a[C];M&&(qt(this.image,M,n),this.dialog.querySelectorAll(".project-thumbnail img").forEach(k=>qt(k,M,n)),this.dialog.querySelector(".project-frame-label").textContent=M.title||"")}}let S=window.ProjectViewer;window.ProjectViewer=A;try{Ja.init(s)}finally{S===void 0?delete window.ProjectViewer:window.ProjectViewer=S}let d=o.spiralCarousel;o.querySelectorAll("img").forEach(u=>n?.(u));let P=d.updateActive;d.updateActive=function(u){P.call(this,u),y.hidden=!c.showTitles||!a[u]?.title,this.status.textContent=`${a[u]?.title?`${a[u].title}, `:""}image ${u+1} of ${a.length}`,i(u)},d.updateActive(d.active);let E=d.animateTo;d.animateTo=function(u,f=0){c.reducedMotion?(this.target=Math.round(u),this.settleImmediately()):E.call(this,u,f)};let G=qi(d,{textureSource:u=>u.dataset.imageSource}),I=ai(o,d,{pauseOnHover:!1,interactionRestMs:0});function w(u){c.autoplay=!!u,d.manuallyPaused=!u||!!c.reducedMotion,d.resumeAt=0,p.disabled=!!c.reducedMotion||d.reducedMotion.matches||a.length<2,p.dataset.paused=String(d.manuallyPaused),p.setAttribute("aria-label",d.manuallyPaused?"Resume carousel":"Pause carousel"),d.syncAutoplay()}return w(!!c.autoplay),{update(u){c={...c,...u},g(),d.measure(),o.dispatchEvent(new Event("playground-change")),o.dispatchEvent(new Event("slot-guides-change")),d.updateActive(d.active),w(!!c.autoplay)},goTo(u){r||d.goTo(u)},setPlaying:w,getMetrics(){try{return JSON.parse(o.dataset.responsiveMetrics||"null")}catch{return null}},getStatus(){return o.dataset.renderer||"loading"},destroy(){r||(r=!0,I(),G(),d.destroy(),s.remove())}}}var Ja,Ka,Ye,Za,Gi,Bi,_i=V(async()=>{ii();ft();bt();bt();ri();await $i();Fi();Ja=window.SpiralCarousel,Ka=0,Ye=(t,e,i,n)=>Number.isFinite(Number(t))?Math.max(i,Math.min(n,Number(t))):e,Za=t=>{if(typeof t=="number"&&t>0)return t;let[e,i]=String(t||"16:9").split(":").map(Number);return e>0&&i>0?e/i:16/9},Gi=t=>{let e=document.createElement("template");return e.innerHTML=String(t||""),e.content.textContent.trim()},Bi=new Set(["alt","width","height","srcset","sizes","data-src","data-image","data-image-dimensions","data-image-focal-point","data-load","data-loader"])});function Xi(t){let{host:e}=t,i={...t.options},n=null,a=null,c=!1,r="loading",s=document.createElement("p");return s.className="gc-empty",s.setAttribute("role","status"),s.textContent="Loading spiral\u2026",e.append(s),_i().then(()=>Ui).then(o=>{c||(s.remove(),a=o.mountSpiral({...t,options:i}),n!==null&&a.goTo?.(n))}).catch(o=>{c||(r="error",s.textContent="The spiral could not load.",e.replaceChildren(s),console.warn("Gallery Studio: spiral unavailable",o))}),{update(o){i={...i,...o},a?.update?.(i)},goTo(o){n=o,a?.goTo?.(o)},setPlaying(o){i.autoplay=o,a?.setPlaying?.(o)},getStatus(){return a?.getStatus?.()??r},getMetrics(){return a?.getMetrics?.()??null},destroy(){c=!0,s.remove(),a?.destroy()}}}var Yi=V(()=>{});function pt(t,e=location.href){if(!t||!t.trim()||t.trim()==="#")return"";try{let i=new URL(t,e);return/^(https?:|mailto:|tel:)$/.test(i.protocol)?i.href:""}catch{return""}}function Ft(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.querySelectorAll("script,style,iframe,object,embed,form,input,button,link,meta").forEach(i=>i.remove()),e.content.querySelectorAll("*").forEach(i=>{for(let n of[...i.attributes])(/^on/i.test(n.name)||n.name==="style"||n.name==="id")&&i.removeAttribute(n.name);if(i.hasAttribute("href")){let n=pt(i.getAttribute("href"));n?i.setAttribute("href",n):i.removeAttribute("href")}}),e.innerHTML}function tr(t){if(!t)return{src:"",alt:"",imageAttrs:{}};let e={};for(let i of["data-src","data-image","data-image-dimensions","data-image-focal-point","width","height","srcset","sizes"])t.hasAttribute(i)&&(e[i]=t.getAttribute(i));return{src:t.getAttribute("data-src")||t.getAttribute("data-image")||t.getAttribute("src")||"",alt:t.getAttribute("alt")||"",imageAttrs:e}}function gt(t,e){let i=$t[e];if(!t||!i)return null;let n=t.closest(i);if(!n){let o=t.querySelectorAll(i);if(o.length!==1)return null;n=o[0]}let a=e==="list"?n:n.querySelector(":scope > .sqs-block-content");if(!a)return null;let c=o=>Array.from(a.querySelectorAll(o)).filter(x=>x.closest(i)===n&&(!x.closest(".gc-embed")||x.hasAttribute("data-gc-native-track"))),r=e==="list"?".list-item":".slide",s=c(e==="list"?"ul.user-items-list-item-container.user-items-list-simple":".sqs-gallery-container");if(e==="gallery"&&!s.length&&(s=c(".sqs-gallery")),s.length===1){let o=Array.from(s[0].querySelectorAll(r)).filter(x=>x.closest(i)===n&&!x.hasAttribute("data-gc-repeat"));return{source:n,originals:s,rows:o}}if(e==="gallery"&&!s.length){let o=c(r);if(o.length&&o.every(x=>x.parentElement===o[0].parentElement))return{source:n,originals:o,rows:o}}return null}function nt(t,e,i=location.href){return(gt(t,e)?.rows||[]).map(a=>{let c=a.querySelector("img[data-src],img[data-image],img"),r=a.querySelector(e==="list"?".list-item-content__title":".image-slide-title")?.textContent.trim()||"",s=Ft(a.querySelector(e==="list"?".list-item-content__description":".image-slide-description")?.innerHTML||""),o=a.querySelector(e==="list"?".list-item-content__button":".image-slide-anchor");return{...tr(c),title:r,description:s,link:pt(o?.getAttribute("href"),i),buttonLabel:e==="list"&&o?.textContent.trim()||""}}).filter(a=>e==="list"||a.src)}function ir(t,e){let i=e==="list"?t.getAttribute("data-section-id"):t.id;if(!i?.trim())return"";let n=e==="list"?'section[data-section-id="'+CSS.escape(i)+'"]':"#"+CSS.escape(i);return t.ownerDocument.querySelectorAll(n).length===1?n:""}function Vi(t=document){let e={list:0,gallery:0};return Array.from(t.querySelectorAll(Object.values($t).join(","))).filter(i=>!i.closest(".gc-embed")).flatMap(i=>{let n=i.matches($t.list)?"list":"gallery",a=ir(i,n);if(!a||!gt(i,n))return[];let c=++e[n];return{name:(n==="list"?"List Section":"Gallery Block")+(c>1?" "+c:""),type:n,selector:a,root:i,items:nt(i,n)}})}function wt(t,{nativeCard:e=!1}={}){if(!t?.isConnected)return;let i=t.ownerDocument.defaultView?.ImageLoader;if(i&&typeof i.load=="function")try{i.load(t,{load:!0})}catch(n){console.warn("Gallery Studio: native image loader",n)}e||(t.style.cssText="width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:"+Ji(t.getAttribute("data-image-focal-point"))+";",t.classList.contains("project-image")&&(t.style.objectFit="contain"))}function Ji(t){let e=(t||".5,.5").split(",").map(Number);return`${(Number.isFinite(e[0])?e[0]:.5)*100}% ${(Number.isFinite(e[1])?e[1]:.5)*100}%`}function Nt(t){let e=document.createElement("img");for(let[i,n]of Object.entries(t.imageAttrs||{}))/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(i)&&e.setAttribute(i,n);return e.src=t.src,e.alt=t.alt||"",e.decoding="async",e.loading="eager",e.draggable=!1,e.style.objectPosition=Ji(t.imageAttrs?.["data-image-focal-point"]),e}var $t,Rt=V(()=>{$t={list:"section.user-items-list-section",gallery:".sqs-block-gallery"}});function Ki(t,e,i){let n=new WeakMap,a=new WeakMap,c=Array.from(e.childNodes),r=i.map(S=>Array.from(S.childNodes)),s=[];function o(S,d){S&&s.push([S,d.map(P=>[P,S.getAttribute(P)])])}let x=new Set,v=!1;function p(){o(e,["class","style","role","aria-label","aria-describedby","data-gc-native-track"]);for(let S of i)o(S,["class","style"]);e.setAttribute("data-gc-native-track",""),e.replaceChildren(),v=!0}function y(S,d,P,E,G){let I=i[d],w=x.has(d),u=w?I.cloneNode(!1):I,f=document.createElement("div");if(f.className="gc-card gc-native-card",f.tabIndex=0,f.setAttribute("role","group"),S.imageAttrs?.["data-image-focal-point"]){let[q,oe]=S.imageAttrs["data-image-focal-point"].split(",").map(Number);Number.isFinite(q)&&Number.isFinite(oe)&&f.style.setProperty("--gc-native-focus",q*100+"% "+oe*100+"%")}let C=S.title||S.alt||`Item ${d+1}`;if(f.setAttribute("aria-label",C),w){u.removeAttribute("id"),u.setAttribute("data-gc-repeat","");for(let q of r[d])f.append(q.cloneNode(!0));f.querySelectorAll("[id]").forEach(q=>q.removeAttribute("id"))}else x.add(d),f.append(...r[d]);u.replaceChildren(f),n.set(f,u);let M=f.querySelector(".list-item-media"),k=f.querySelector(".list-item-content"),N=f.querySelector(".list-item-content__title"),B=f.querySelector(".list-item-content__description");if(!w){for(let q of[M,k])o(q,["class"]);for(let q of[N,B])o(q,["class","hidden"])}if(M?.classList.add("gc-card-media"),k?.classList.add("gc-card-copy"),E.typeSource!=="native"&&(N?.classList.add("gc-card-title"),B?.classList.add("gc-card-description")),N&&(!E.showTitles||P.caption===!1)&&(N.hidden=!0),B&&!P.description&&(B.hidden=!0),P.thumbnail){let q=f.querySelector(".list-item-content__button-wrapper")||f.querySelector(".list-item-content__button");q&&(w||o(q,["hidden"]),q.hidden=!0),k&&(!S.title||P.caption===!1)&&(w||o(k,["hidden"]),k.hidden=!0)}let fe=Array.from(f.querySelectorAll("a[href],button,input,select,textarea,[tabindex]"));if(!w)for(let q of fe)o(q,["tabindex"]);if(a.set(f,fe.map(q=>[q,q.getAttribute("tabindex")])),E.clickAction!=="none"&&(E.clickAction!=="link"||S.link)){let q=document.createElement("button");q.type="button",q.className="gc-native-action",q.tabIndex=-1,q.setAttribute("aria-label",(E.clickAction==="link"?"Open link for ":"Open ")+C),q.addEventListener("click",()=>G(S,d)),f.append(q),f.setAttribute("aria-keyshortcuts","Enter Space"),f.addEventListener("click",oe=>{oe.defaultPrevented||oe.target.closest("a,button,input,select,textarea,label")||G(S,d)}),f.addEventListener("keydown",oe=>{oe.target!==f||!["Enter"," "].includes(oe.key)||(oe.preventDefault(),q.click())})}return f}function g(S){let d=S.tabIndex===0&&S.getAttribute("aria-hidden")!=="true";for(let[P,E]of a.get(S)||[]){let G=d?E:"-1";P.getAttribute("tabindex")!==G&&(G===null?P.removeAttribute("tabindex"):P.setAttribute("tabindex",G))}}function m(S){if(!v)return;let d=S!=="native";e.querySelectorAll(".list-item-content__title").forEach(P=>P.classList.toggle("gc-card-title",d)),e.querySelectorAll(".list-item-content__description").forEach(P=>P.classList.toggle("gc-card-description",d))}function A(){if(e.classList.remove("gc-native-items-hidden"),!!v){i.forEach((S,d)=>S.replaceChildren(...r[d])),e.replaceChildren(...c);for(let[S,d]of s)for(let[P,E]of d)S.getAttribute(P)!==E&&(E===null?S.removeAttribute(P):S.setAttribute(P,E));t.after(e),s.length=0,x.clear(),v=!1}}return{track:e,begin:p,makeCard:y,slot:S=>n.get(S),syncFocus:g,setType:m,restore:A}}var Zi=V(()=>{});function Qi(t,e,i,n){let a=i.ownerDocument,c=a.defaultView,r=n==="gallery"?i.closest(".fluid-engine > .fe-block"):null;r?.classList.add("gc-viewport-cell");let s=[],o=r||i;for(let p=t.parentElement;p&&(["hidden","clip","auto","scroll"].includes(c.getComputedStyle(p).overflowX)&&s.push(p),p!==o);p=p.parentElement);function x(){let p=a.documentElement.clientWidth;if(!p||!t.isConnected||!t.getClientRects().length)return;for(let m of s){let A=m.getBoundingClientRect().left+c.scrollX+m.clientLeft,S=A>.5||A+m.clientWidth<p-.5;m.classList.toggle("gc-viewport-unclip",S)}let y=-(t.getBoundingClientRect().left+c.scrollX),g=(m,A)=>{e.style.getPropertyValue(m)!==A&&e.style.setProperty(m,A)};g("--gc-viewport-width",p+"px"),g("--gc-viewport-offset",y+"px")}x();let v=c.ResizeObserver?new c.ResizeObserver(x):null;return v?.observe(t),v?.observe(a.documentElement),c.addEventListener("resize",x),()=>{v?.disconnect(),c.removeEventListener("resize",x);for(let p of s)p.classList.remove("gc-viewport-unclip");r?.classList.remove("gc-viewport-cell"),e.style.removeProperty("--gc-viewport-width"),e.style.removeProperty("--gc-viewport-offset")}}var ea=V(()=>{});var ia,ta=V(()=>{ia=`.gc-stage.gc-finish .gc-card{border-radius:var(--gc-finish-radius)}
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
`});function aa(t,e){if(t.classList.toggle("gc-finish",e.preset!=="spiral"),e.preset!=="spiral"){if(!document.getElementById("gc-finish-css")){let i=document.createElement("style");i.id="gc-finish-css",i.textContent=ia,document.head.append(i)}t.dataset.gcShadow=e.shadow,t.dataset.gcHover=e.hoverEffect,t.toggleAttribute("data-gc-still",!!e.reducedMotion),t.style.setProperty("--gc-finish-radius",e.radius+"px"),t.style.setProperty("--gc-line-size",e.borderWidth+"px"),t.style.setProperty("--gc-line-color",e.borderColor),t.style.setProperty("--gc-tint",e.overlayColor),t.style.setProperty("--gc-tint-opacity",Number(e.overlayOpacity)/100)}}var Wt,ra=V(()=>{ta();Wt={borderWidth:0,borderColor:"#263448",shadow:"preset",overlayColor:"#142036",overlayOpacity:0,hoverEffect:"preset"}});function oa(t,e){let i=t.classList.contains("gc-embed"),n=i&&e.colorSource==="section";n?t.dataset.gcColorSource="section":delete t.dataset.gcColorSource,i&&e.typeSource==="native"?t.dataset.gcTypeSource="native":delete t.dataset.gcTypeSource;let a=t.style;a.setProperty("--gc-custom-background",e.background),a.setProperty("--gc-custom-ink",e.ink),a.setProperty("--gc-custom-accent",e.accent),a.setProperty("--gc-background",n?"var(--gc-section-surface)":e.background),a.setProperty("--gc-ink",n?"var(--gc-section-body)":e.ink),a.setProperty("--gc-accent",n?"var(--gc-section-action)":e.accent),a.setProperty("--gc-muted",n?"var(--gc-section-body)":e.ink+"aa"),a.setProperty("--gc-spatial-surface","var(--gc-background)"),a.setProperty("--gc-spatial-ink","var(--gc-ink)"),n&&(a.setProperty("--gc-line-color","var(--gc-section-line)"),a.setProperty("--gc-tint","var(--gc-section-body)")),a.background=n?"transparent":e.background,a.color=n?"var(--gc-section-body)":e.ink;for(let c of t.querySelectorAll(":scope > dialog"))na(t,c)}function na(t,e){for(let i of["gcColorSource","gcTypeSource"])t.dataset[i]?e.dataset[i]=t.dataset[i]:delete e.dataset[i]}function Ht(t,e){let i=t.classList.contains("gc-embed")?t:t.ownerDocument.body;na(t,e),e.parentElement!==i&&i.append(e)}var sa=V(()=>{});var la,ca=V(()=>{la=`.gc-stage{position:relative;width:100%;min-width:0;font-family:Arial,Helvetica,sans-serif;isolation:isolate;--gc-fit:cover;--gc-ink:#1b2838;--gc-accent:#345bf2;color:var(--gc-ink)}
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
`});var pa,da=V(()=>{pa=`/* Squarespace assigns complete color values to these inheritable section roles. */
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
`});var ua,ga=V(()=>{ua=`/* Simple List headings, descriptions and CTAs keep their original Squarespace
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
`});var fa,ha=V(()=>{fa=`.gc-carousel {
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
`});var ba,ma=V(()=>{ba=`.gc-spatial {
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
`});function Ve(t){return["infinite","arc","arc-tabs","showcase","timed"].includes(t)}function kt(t,e){let i=Ve(e.preset??t.preset),n=i===Ve(t.preset)?t.stageHeight:i?0:590;return{...t,...e,stageHeight:e.stageHeight??n}}function xa(t){return!t||t==="stack"?"common":t==="spiral"?"spiral":["wall","ring","angled"].includes(t)?"spatial":"carousel"}function ya(t){let e=document.getElementById("gc-runtime-css");e||(e=document.createElement("style"),e.id="gc-runtime-css",e.textContent=[la,pa,ua].join(`
`),document.head.append(e));let i=xa(t);if(i==="common")return()=>{};let n=`gc-runtime-${i}-css`,a=document.getElementById(n);a||(a=document.createElement("style"),a.id=n,i==="carousel"?a.textContent=fa:i==="spatial"?a.textContent=ba:a.textContent=[Ri,Ti,Hi,Oi].join(`
`),e.after(a)),a.dataset.gcOwners=String(Number(a.dataset.gcOwners||0)+1);let c=!1;return()=>{if(c)return;c=!0;let r=Number(a.dataset.gcOwners)-1;r>0?a.dataset.gcOwners=String(r):a.remove()}}function lr(t){let e=document.createElement("template");return e.innerHTML=t||"",e.content.textContent||""}function va(t,e,i={},n=null){let a=kt(tt,i),c=null,r=null,s=null,o=0,x=0,v,p;t.classList.add("gc-stage"),t.setAttribute("role","region"),t.setAttribute("aria-label","Gallery preview");function y(){r&&(r.close(),r.remove(),r=null,c?.setSuspended?.(!1),s?.focus({preventScroll:!0}))}function g(w,u){if(a.clickAction==="none")return;if(a.clickAction==="link"){let B=pt(w.link);B&&window.open(B,"_blank","noopener,noreferrer");return}s=document.activeElement,r&&y(),r=document.createElement("dialog"),r.className="gc-dialog"+(a.preset==="showcase"?" gc-dialog-drawer":""),r.setAttribute("aria-label",w.title||"Image preview");let f=document.createElement("button");f.className="gc-dialog-close",f.type="button",f.textContent="Close \xD7",f.addEventListener("click",y);let C=document.createElement("div");C.className="gc-dialog-content";let M=document.createElement("div");M.className="gc-dialog-media",w.src&&(M.append(Nt(w)),C.append(M));let k=document.createElement("div");if(k.className="gc-dialog-copy",w.title){let B=document.createElement("h2");B.textContent=w.title,k.append(B)}if(w.description){let B=document.createElement("div");B.innerHTML=Ft(w.description),k.append(B)}if(w.link){let B=document.createElement("a");B.href=pt(w.link),B.textContent=w.buttonLabel||"Open link",B.target="_blank",B.rel="noopener noreferrer",k.append(B)}let N=document.createElement("p");N.className="gc-dialog-count",N.textContent=`${u+1} / ${e.length}`,k.append(N),C.append(k),r.append(f,C),Ht(t,r),r.showModal(),c?.setSuspended?.(!0),wt(M.querySelector("img")),f.focus(),r.addEventListener("cancel",B=>{B.preventDefault(),y()}),r.addEventListener("click",B=>{if(B.target===r){let fe=r.getBoundingClientRect();(B.clientX<fe.left||B.clientX>fe.right||B.clientY<fe.top||B.clientY>fe.bottom)&&y()}})}function m(w,u,f={}){if(n)return n.makeCard(w,u,f,a,g);let C=document.createElement("button");C.type="button",C.className="gc-card",C.setAttribute("aria-label",w.title||`Image ${u+1}`);let M=document.createElement("span");M.className="gc-card-media",w.src&&(M.append(Nt(w)),C.append(M));let k=document.createElement("span");if(k.className="gc-card-copy",f.caption!==!1&&a.showTitles&&w.title){let N=document.createElement("span");N.className="gc-card-title",N.textContent=w.title,k.append(N)}if(f.description&&w.description){let N=document.createElement("span");N.className="gc-card-description",N.textContent=lr(w.description),k.append(N)}return k.childNodes.length&&C.append(k),C.addEventListener("click",()=>g(w,u)),C}let A=matchMedia("(prefers-reduced-motion: reduce)"),S=matchMedia("(max-width: 660px)");function d(){let w={...a,reducedMotion:a.reducedMotion||A.matches};return S.matches&&(a.mobileCardWidth!=null&&(w.cardWidth=a.mobileCardWidth),a.mobileGap!=null&&(w[a.preset==="spiral"?"spiralGap":"gap"]=a.mobileGap)),w.phoneWidthOverride=S.matches&&a.mobileCardWidth!=null,a.preset==="stack"&&(w.stackCardWidth=S.matches&&a.mobileCardWidth!=null?a.mobileCardWidth:Math.max(360,a.cardWidth*2.2)),w}function P(){aa(t,a),t.style.setProperty("--gc-fit",a.fit),t.style.setProperty("--gc-card-radius",a.radius+"px"),oa(t,a)}function E(w=0){y(),c?.destroy(),c=null,n?.restore(),cancelAnimationFrame(x),t.replaceChildren(),t.classList.add("gc-stage"),t.style.height="";let u=xa(a.preset);u!==v&&(p?.(),p=ya(a.preset),v=u),P(),t.setAttribute("aria-label",a.previewScroll===!1?"Gallery":"Gallery preview");let f=n&&a.preset!=="spiral"?n:null;f?f.begin():n&&n.track.classList.add("gc-native-items-hidden");let C={host:t,items:e,initialIndex:w,nativeList:f,attachDialog:M=>Ht(t,M),options:d(),makeCard:m,loadImage:wt,onChange(M){o=M,a.onChange?.(M)}};if(!e.length){let M=document.createElement("p");M.className="gc-empty",M.textContent="Add images to your source to start exploring.",t.append(M);return}a.preset==="spiral"?c=Xi(C):a.preset==="stack"?c=Qt(C):["wall","ring","angled"].includes(a.preset)?(c=Kt(C),w&&c.goTo(w)):c=Vt(C),a.preset!=="spiral"&&(x=requestAnimationFrame(()=>t.querySelectorAll("img").forEach(M=>{wt(M,{nativeCard:!!f})})))}let G=()=>E(o);function I(){a.mobileCardWidth==null&&a.mobileGap==null||(c?.setGeometry?c.setGeometry(d()):a.preset==="spiral"?c?.update(d()):E(o))}try{E()}catch(w){throw p?.(),n?.restore(),w}return A.addEventListener("change",G),S.addEventListener("change",I),{update(w){let u=a.preset,f=d();a=kt(a,w);let C=d(),M=Object.keys(C).filter(N=>!["mobileCardWidth","mobileGap","galleryWidth"].includes(N)&&C[N]!==f[N]);if(!M.length)return;if(c?.setGeometry&&M.every(N=>["cardWidth","gap","phoneWidthOverride"].includes(N))){c.setGeometry(C);return}let k=N=>["colorSource","typeSource","background","ink","accent"].includes(N);if(M.every(N=>k(N)||u!=="spiral"&&(N==="radius"||Object.hasOwn(Wt,N)))){P(),M.includes("typeSource")&&n?.setType(a.typeSource);return}u==="spiral"&&a.preset==="spiral"&&c?.update?(P(),c.update(C)):E(u===a.preset?o:0)},goTo(w){c?.goTo?.(w)},setPlaying(w){a.autoplay=w,c?.setPlaying?.(w)},getOptions(){return{...a}},getActive(){return o},destroy(){y(),cancelAnimationFrame(x),c?.destroy(),n?.restore(),A.removeEventListener("change",G),S.removeEventListener("change",I),t.replaceChildren(),t.classList.remove("gc-stage"),p?.()}}}function dr(t,e){let i=e.closest("section")||e,n=[];for(let a=t.parentElement;a;a=a.parentElement){let c=ke.scrollBoundaries.get(a)||0;if((c||["hidden","auto","scroll","overlay"].includes(getComputedStyle(a).overflowY))&&(ke.scrollBoundaries.set(a,c+1),a.classList.add("gc-stack-page-scroll"),n.push(a)),a===i)break}return()=>{for(let a of n){let c=ke.scrollBoundaries.get(a)-1;c?ke.scrollBoundaries.set(a,c):(ke.scrollBoundaries.delete(a),a.classList.remove("gc-stack-page-scroll"))}}}function Dt(){return document.body.classList.contains("sqs-edit-mode-active")||document.documentElement.classList.contains("sqs-edit-mode-active")}function pr(t){if(!ke.editListeners?.size){ke.editListeners=new Set;let e=Dt();ke.editObserver=new MutationObserver(()=>{let i=Dt();if(i!==e){e=i;for(let n of ke.editListeners)try{n(i)}catch(a){console.warn("Gallery Studio: could not resume a list layout.",a)}}});for(let i of[document.body,document.documentElement])ke.editObserver.observe(i,{attributes:!0,attributeFilter:["class"]})}return ke.editListeners.add(t),()=>{ke.editListeners.delete(t),ke.editListeners.size||ke.editObserver.disconnect()}}function Ot({selector:t,type:e="gallery",options:i={}}={}){let n=t;if(typeof t=="string")try{let f=document.querySelectorAll(t);if(f.length!==1)return null;n=f[0]}catch{return null}if(!n?.isConnected||typeof n.closest!="function")return null;let a=gt(n,e);if(!a)return null;let{source:c}=a,r=ke.mounts.get(c);if(r)return r.instance.update(i),r;if(!nt(c,e).length)return null;let s=document.createElement("div"),o=document.createElement("div");s.className="gc-embed",o.className="gc-viewport-slot",o.append(s);let x={...kt(tt,i),previewScroll:!1},v=null,p=null,y=null,g=null,m=!1,A=[],S=null;function d(){x.galleryWidth==="source"?(y?.(),y=null,S&&(o.classList.add("user-items-list-simple"),o.dataset.layoutWidth=S.mode,o.style.maxWidth=S.maximum)):y||(o.classList.remove("user-items-list-simple"),delete o.dataset.layoutWidth,o.style.removeProperty("max-width"),y=Qi(o,s,c,e))}function P(f){f==="stack"?p||(p=dr(s,c)):p&&(p(),p=null)}function E(){try{v?.destroy()}finally{v=null,P(null),y?.(),y=null,A.forEach(f=>f.classList.remove("gc-native-items-hidden")),A=[],o.remove()}}function G(){if(m||!c.isConnected)return;let f=gt(c,e),C=nt(c,e);if(!f||!C.length)return;f.originals[0].before(o),ya();let M=f.originals[0];S=e==="list"?{mode:M.dataset.layoutWidth||"full",maximum:M.style.maxWidth}:null,d();let k=e==="list"?Ki(o,f.originals[0],f.rows):null;k||(A=f.originals,A.forEach(N=>N.classList.add("gc-native-items-hidden"))),P(x.preset),v=va(s,C,x,k)}function I(){if(!m){m=!0;try{E()}finally{g?.(),ke.mounts.delete(c)}}}let u={instance:{update(f={}){if(m)return;let C=x.galleryWidth;x={...kt(x,f),previewScroll:!1},v&&(x.galleryWidth!==C&&d(),P(x.preset),v.update(x))},goTo(f){v?.goTo(f)},setPlaying(f){x.autoplay=f,v?.setPlaying(f)},getOptions(){return{...x}},getActive(){return v?.getActive()??0},destroy:I},host:s,source:c,destroy:I};try{g=pr(f=>{if(f){E();return}try{G()}catch(C){throw E(),C}}),Dt()||G(),ke.mounts.set(c,u)}catch(f){throw I(),f}return u}var ut,tt,ke,Gt=V(()=>{Jt();Zt();ei();Yi();bt();Rt();Zi();ea();ra();sa();ca();da();ga();ha();ma();Di();Ni();Wi();Ii();ut=[{id:"stack",name:"Stacking cards",category:"Scroll",hint:"Scroll through the card stack",width:360},{id:"infinite",name:"Infinite slider",category:"Drag",hint:"Drag to explore \xB7 Click the active image to open",width:360},{id:"arc",name:"Arc gallery",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"arc-tabs",name:"Arc with tabs",category:"Rotate",hint:"Choose a title or drag to rotate",width:360},{id:"showcase",name:"Stacked showcase",category:"Depth",hint:"Drag to explore \xB7 Click the active card for details",width:430},{id:"timed",name:"Timed carousel",category:"Autoplay",hint:"Choose a slide or press play",width:700},{id:"wall",name:"3D gallery wall",category:"Immersive",hint:"Drag to look around \xB7 Click an image to open",width:230},{id:"spiral",name:"Spiral carousel",category:"Rotate",hint:"Drag to rotate \xB7 Click the active image to open",width:280},{id:"ring",name:"Interactive ring",category:"Hover",hint:"Move over the images \xB7 Drag to rotate",width:150},{id:"angled",name:"Angled gallery",category:"Perspective",hint:"Drag to explore \xB7 Hover to bring an image forward",width:240}],tt={...Wt,colorSource:"custom",typeSource:"preset",preset:"arc-tabs",galleryWidth:"full",navigation:"auto",cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:!1,showTitles:!0,fit:"cover",clickAction:"preview",background:"#edf0f4",ink:"#1b2838",accent:"#345bf2",reducedMotion:!1};ke=window[Symbol.for("gallery-studio.inline")]??={mounts:new WeakMap,scrollBoundaries:new WeakMap};window.GalleryStudioRuntime={mountGallery:va,embed:Ot,presets:ut}});var ka,wa=V(()=>{ka=`:host {
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
`});function ee(t,e,i){let n=document.createElement(t);return e&&(n.className=e),i!==void 0&&(n.textContent=i),n}function Ge(t,e,i){let n=ee("button",t,e);return n.type="button",i&&n.setAttribute("aria-label",i),n}function Je(t,e,i,n,a,c=""){return{key:t,label:e,type:"range",min:i,max:n,step:a,unit:c}}function Bt(t){let e=t.preset,i=Ve(e),n=[{key:"galleryWidth",label:"Gallery width",type:"select",choices:[{value:"full",label:"Full page"},{value:"source",label:"Follow section or block"}]},Je("cardWidth","Card width",80,e==="timed"?960:e==="spiral"?720:560,1,"px"),Je("stageHeight",i?"Minimum gallery height":"Gallery height",i?0:300,1200,1,"px")];if(e==="spiral")n.push(...ct);else if(n.push(Je("gap","Spacing",0,100,1,"px")),e!=="infinite"&&e!=="timed"){let c={ring:"Flip strength",angled:"Perspective",stack:"Tilt strength"}[e]||"Depth";n.push(Je("depth",c,0,100,1))}let a=[{key:"clickAction",label:"Click action",type:"select",choices:[{value:"preview",label:e==="showcase"?"Open details panel":"Open image preview"},{value:"link",label:"Follow item link"},{value:"none",label:"None"}]}];return(e==="arc-tabs"||e==="timed")&&a.unshift({key:"navigation",label:"Navigation",type:"select",choices:[{value:"auto",label:"Auto"},{value:"tabs",label:"Title tabs"},{value:"dots",label:"Dots"}]}),e!=="stack"&&(a.push({key:"autoplay",label:"Autoplay",type:"checkbox"}),e!=="spiral"&&a.push(Je("duration","Time per image",2,15,.5,"s"))),a.push({key:"reducedMotion",label:"Reduce motion",type:"checkbox"}),[{title:"Size & spacing",fields:n},{title:"Mobile overrides",fields:[{...n.find(c=>c.key==="cardWidth"),key:"mobileCardWidth",label:"Mobile card width",inherits:"cardWidth"},{...n.find(c=>c.key===(e==="spiral"?"spiralGap":"gap")),key:"mobileGap",label:"Mobile spacing",inherits:e==="spiral"?"spiralGap":"gap"}]},{title:"Interaction",fields:a},{title:"Appearance",fields:[{key:"colorSource",label:"Color source",type:"select",choices:[{value:"section",label:"Section theme"},{value:"custom",label:"Custom colors"}]},{key:"typeSource",label:"Type source",type:"select",choices:[{value:"native",label:"Native list / site type"},{value:"preset",label:"Layout preset"}]},{key:"fit",label:"Image fit",type:"select",choices:ur},...e==="spiral"?[]:[Je("radius","Corner radius",0,64,1,"px"),Je("borderWidth","Border width",0,12,1,"px"),{key:"borderColor",label:"Border color",type:"color"},{key:"shadow",label:"Drop shadow",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"none",label:"None"},{value:"soft",label:"Soft"},{value:"deep",label:"Deep"}]},{key:"overlayColor",label:"Image overlay",type:"color"},Je("overlayOpacity","Overlay opacity",0,100,1,"%"),{key:"hoverEffect",label:"Hover effect",type:"select",choices:[{value:"preset",label:"Layout default"},{value:"zoom",label:"Zoom image"},{value:"lift",label:"Lift card"}]}],{key:"showTitles",label:"Show titles",type:"checkbox"},{key:"background",label:"Background",type:"color"},{key:"ink",label:"Text color",type:"color"},{key:"accent",label:"Accent color",type:"color"}]}]}function Sa(t){return{...tt,stageHeight:Ve(t.preset??tt.preset)?0:590,...t.preset==="spiral"?Oe:{},colorSource:"section",typeSource:"native",...t}}function hr(t){let e=t.type==="list"?"List Section":"Gallery Block",i=t.name?.trim()||e,n=t.items?.length||0;return`${i.toLowerCase().includes(e.toLowerCase())?i:`${i} \xB7 ${e}`} \xB7 ${n} ${n===1?"item":"items"}`}function Ma({source:t,options:e,onPreset:i,onOption:n,onClose:a,onRestore:c,getCode:r,getStyle:s,applyStyle:o}){let x=document.activeElement,v=t,p=Sa(e),y=!1,g=!1,m=0,A=new Map,S=new Map,d=ee("div");d.setAttribute("data-gc-author-panel","");let P=d.attachShadow({mode:"open"}),E=ee("style");E.textContent=ka;let G=ee("aside","panel");G.setAttribute("aria-labelledby","gc-author-heading");let I=ee("header","header"),w=ee("div","heading"),u=ee("h2","","Gallery settings");u.id="gc-author-heading";let f=ee("p","target");w.append(u,f);let C=ee("div","header-actions"),M=Ge("icon-button","\u2212","Minimize settings");M.setAttribute("aria-controls","gc-author-controls"),M.setAttribute("aria-expanded","true");let k=Ge("icon-button","\xD7","Close settings");C.append(M,k),I.append(w,C);let N=ee("div","controls");N.id="gc-author-controls";let B=ee("div","scroll"),fe=ee("label","preset-row"),q=ee("select","preset-select");q.setAttribute("aria-label","Layout");for(let L of ut){let R=ee("option","",L.name);R.value=L.id,q.append(R)}fe.append(ee("span","field-label","Layout"),q);let oe=ee("div","groups"),pe=ee("div","style-actions"),ce=Ge("text-button","Copy style"),ye=Ge("text-button","Paste style");pe.append(ce,ye);let ve=ee("div","style-transfer");ve.hidden=!0;let z=ee("textarea");z.setAttribute("aria-label","Gallery style"),z.spellcheck=!1;let F=Ge("secondary","Apply style"),D=Ge("text-button","Close","Close style transfer");ve.append(z,F,D),B.append(fe,pe,ve,oe);let Y=ee("footer","footer"),Z=ee("div","export-actions"),J=Ge("primary","Copy page code"),te=Ge("secondary","View code");te.setAttribute("aria-expanded","false"),te.setAttribute("aria-controls","gc-author-code"),Z.append(J,te);let $=ee("div","code-view");$.id="gc-author-code",$.hidden=!0;let X=ee("label","code-label","Page Header Code Injection"),ne=ee("textarea");ne.readOnly=!0,ne.spellcheck=!1,ne.setAttribute("aria-label","Page header code"),X.append(ne),$.append(X);let se=ee("div","footer-line"),U=ee("span","status");U.setAttribute("role","status");let re=Ge("text-button","Reset preview");se.append(U,re),Y.append(Z,$,se),N.append(B,Y),G.append(I,N),P.append(E,G),document.body.append(d);function H(L){let{definition:R,input:K,output:ie,row:ge}=L,be=p[R.key];if(R.type==="checkbox"){K.checked=!!be;return}if(R.type==="range"){let ue=R.key==="spiralRise"&&p.spiralRiseUnit==="percent"?{...R,...R.percent}:R;K.min=String(ue.min),K.max=String(ue.max),K.step=String(ue.step);let Se=R.inherits&&be==null;L.enable&&(L.enable.checked=!Se,K.disabled=!!Se),K.value=String(Se?p[R.inherits]:be);let le=ue.key==="stageHeight"&&ue.min===0&&Number(K.value)===0?"Auto":`${K.value}${ue.unit||""}`;ie.textContent=Se?`Inherit \xB7 ${le}`:le,K.setAttribute("aria-valuetext",le);return}K.value=String(be),R.type==="color"&&(ge.hidden=p.colorSource==="section",ie.textContent=K.value.toUpperCase())}function je(){m+=1,U.textContent="",$.hidden||(ne.value=r())}function we(L,R){let K=p.spiralRiseUnit;if(p={...p,[L]:R},L==="spiralRiseUnit"&&K!==R){let ie=Math.max(1,p.stageHeight),ge=R==="percent"?Math.max(1,Math.min(30,Math.round(p.spiralRise/ie*1e3)/10)):Math.max(8,Math.min(280,Math.round(p.spiralRise*ie/100)));p.spiralRise=ge,n(L,R),n("spiralRise",ge),H(A.get("spiralRise"))}else n(L,R);L==="colorSource"?A.forEach(H):H(A.get(L));for(let ie of A.values())ie.definition.inherits===L&&H(ie);je()}function Be(L){let{key:R,label:K,type:ie}=L,ge=ee(L.inherits?"div":"label",`field field-${ie}`),be=ee("span","field-label",K),ue=ee(ie==="select"?"select":"input");if(ue.setAttribute("aria-label",K),ue.dataset.option=R,ie==="select")for(let le of L.choices){let Me=ee("option","",le.label);Me.value=le.value,ue.append(Me)}else ue.type=ie;let Se;(ie==="range"||ie==="color")&&(Se=ee("output","value"),Se.setAttribute("aria-hidden","true")),ge.append(be),Se&&ge.append(Se),ge.append(ue);let We={definition:L,input:ue,output:Se,row:ge};if(L.inherits){let le=ee("input");le.type="checkbox",le.setAttribute("aria-label","Customize "+K.toLowerCase());let Me=ee("label","override-toggle");Me.append(le,be),ge.prepend(Me),We.enable=le,le.addEventListener("change",()=>we(R,le.checked?p[L.inherits]:null))}return A.set(R,We),H(We),ue.addEventListener(ie==="range"||ie==="color"?"input":"change",()=>{let le=ie==="range"?Number(ue.value):ie==="checkbox"?ue.checked:ue.value;we(R,le)}),ge}function Ue(){let L=new Map([...S].map(([R,K])=>[R,K.open]));A.clear(),S.clear(),oe.replaceChildren();for(let R of Bt(p)){let K=ee("details","group");K.open=L.get(R.title)??R.title==="Size & spacing";let ie=ee("summary","",R.title),ge=ee("div","group-body");for(let be of R.fields)ge.append(Be(be));K.append(ie,ge),oe.append(K),S.set(R.title,K)}}function Q(L){if(g)return;let R=p.preset;v=L.source??v,L.options&&(p=Sa(L.options)),f.textContent=hr(v),f.title=v.selector||f.textContent,q.value=p.preset,!A.size||R!==p.preset?Ue():A.forEach(H),je()}function qe(L){$.hidden=!L,te.textContent=L?"Hide code":"View code",te.setAttribute("aria-expanded",String(L)),L&&(ne.value=r(),ne.focus({preventScroll:!0}),ne.select())}function _(){if(g)return;g=!0,m+=1;let L=document.activeElement===d;document.removeEventListener("keydown",ae),d.remove(),L&&x?.isConnected&&x.focus({preventScroll:!0})}function $e(L){if(!g)try{L()}finally{_()}}function ae(L){L.key!=="Escape"||L.defaultPrevented||L.isComposing||document.querySelector("dialog[open]")||L.composedPath().some(R=>R?.getAttribute?.("aria-modal")==="true")||(L.preventDefault(),$e(a))}M.addEventListener("click",()=>{y=!y,N.hidden=y,d.toggleAttribute("data-minimized",y),M.textContent=y?"+":"\u2212",M.setAttribute("aria-expanded",String(!y)),M.setAttribute("aria-label",y?"Expand settings":"Minimize settings")}),k.addEventListener("click",()=>$e(a)),re.addEventListener("click",()=>$e(c)),q.addEventListener("change",()=>i(q.value)),te.addEventListener("click",()=>qe($.hidden));function Re(L,R){ve.hidden=!1,F.hidden=L,z.readOnly=L,z.value=R,z.placeholder=L?"":"Paste the copied gallery style",z.focus(),L&&z.select()}return ce.addEventListener("click",async()=>{let L=s();try{await navigator.clipboard.writeText(L),g||(ve.hidden=!0,U.textContent="Style copied")}catch{if(g)return;Re(!0,L),U.textContent="Style selected. Choose Copy."}}),ye.addEventListener("click",()=>{U.textContent="",Re(!1,"")}),D.addEventListener("click",()=>{ve.hidden=!0,ye.focus()}),F.addEventListener("click",()=>{if(!o(z.value)){U.textContent="Paste a style from Copy style.",z.focus();return}ve.hidden=!0,U.textContent="Style applied to this preview",ye.focus()}),J.addEventListener("click",async()=>{let L=++m,R=r();try{await navigator.clipboard.writeText(R),!g&&L===m&&(U.textContent="Page code copied")}catch{if(g||L!==m)return;qe(!0),U.textContent="Code selected. Choose Copy."}}),document.addEventListener("keydown",ae),Q({source:t,options:e}),q.focus({preventScroll:!0}),{element:d,update:Q,destroy:_}}var ur,Ca=V(()=>{Gt();wa();ur=[{value:"cover",label:"Fill the card"},{value:"contain",label:"Fit the whole image"}]});var ja,Aa=V(()=>{ja=`.gc-config-position{position:relative!important}
button.gc-config-launch{all:unset;box-sizing:border-box;position:absolute;inset:12px 12px auto auto;z-index:12;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:35px;padding:0 13px;border:1px solid #ffffff4a;border-radius:999px;background:#172331;color:white;box-shadow:0 2px 9px #12203233;font:550 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.01em;cursor:pointer;touch-action:manipulation}
.gc-config-launch svg{height:16px;width:16px}
button.gc-config-launch:hover,button.gc-config-launch[aria-expanded=true]{background:#2547b3}
button.gc-config-launch:focus-visible{outline:3px solid #6281ff;outline-offset:3px}
button.gc-config-launch:disabled{opacity:.65;cursor:default}
.sqs-edit-mode-active .gc-config-launch,.sqs-edit-mode-active [data-gc-author-panel]{display:none!important}
@media(max-width:700px){button.gc-config-launch{min-height:40px;inset:8px 8px auto auto}}
`});var za={};Yt(za,{startInline:()=>Ut});function ht(t,e={}){let i=St.get(t),n={...tt,...t==="spiral"?Oe:{},preset:t,colorSource:"section",typeSource:"native",cardWidth:i.width,stageHeight:Ve(t)?0:t==="spiral"?680:t==="wall"?660:540,autoplay:t==="timed",...t==="wall"?{background:"#101720",ink:"#f2f5f8"}:{}};for(let[a,c]of Object.entries(e))a==="mobileCardWidth"||a==="mobileGap"?Number.isFinite(c)&&c>=0&&(n[a]=c):a!=="preset"&&Object.hasOwn(n,a)&&typeof c==typeof n[a]&&(n[a]=c);return n}function La(t){return Bt(t).flatMap(e=>e.fields).filter(e=>!Ea.has(e.key))}function mr(t){let e=Object.fromEntries(La(t).map(({key:i})=>[i,t[i]]));return JSON.stringify({format:"gallery-studio-style",version:1,preset:t.preset,values:e})}function br(t,e){let i;try{i=JSON.parse(t)}catch{return null}if(i?.format!=="gallery-studio-style"||i.version!==1||!St.has(i.preset)||!i.values||typeof i.values!="object"||Array.isArray(i.values))return null;let n=ht(i.preset);for(let a of Ea)n[a]=e[a];for(let a of La(n)){let c=i.values[a.key];if(c!==void 0){if(a.type==="range"){if(a.inherits&&c===null)continue;let r=a.percent&&i.values.spiralRiseUnit==="percent"?a.percent:a;if(!Number.isFinite(c)||c<r.min||c>r.max)return null}else{if(a.type==="checkbox"&&typeof c!="boolean")return null;if(a.type==="select"&&!a.choices.some(r=>r.value===c))return null}n[a.key]=c}}return n}function xr(t){return ht(t.preset,{...t,colorSource:t.colorSource==="section"?"section":"custom",typeSource:t.typeSource==="native"?"native":"preset"})}function yr(t,e){let i=ht(e.preset),n={preset:e.preset,colorSource:e.colorSource,typeSource:e.typeSource};Ve(e.preset)&&(n.stageHeight=e.stageHeight);for(let c of Object.keys(i))e.colorSource==="section"&&Pa.has(c)||e[c]!==i[c]&&(n[c]=e[c]);let a={v:1,selector:t.selector,type:t.type,options:n};return`<script type="application/json" data-gallery-layout>
`+JSON.stringify(a,null,2).replaceAll("<","\\u003c")+`
<\/script>`}function Ut(){if(window.GalleryStudioInline?.version===1)return window.GalleryStudioInline;let t=!!document.querySelector('script[type="application/json"][data-gallery-configure]'),e=document.querySelectorAll('script[type="application/json"][data-gallery-layout]');if(!t&&!e.length)return null;let i=Vi(),n=new Map(i.map(g=>[g.root,{source:g,installed:null,options:null,mounted:null,presets:new Map}])),a=null,c=null,r=null,s=[];function o(g,m){return g.mounted?g.mounted.instance.update({...m,previewScroll:!1}):g.mounted=Ot({selector:g.source.selector,type:g.source.type,options:m}),g.mounted&&(g.options={...m}),!!g.mounted}function x(g=!0){if(!c)return;let m=c;c=null,a?.destroy(),a=null,m.button?.setAttribute("aria-expanded","false"),g&&m.button?.focus({preventScroll:!0})}function v(g){x(),g.presets.clear(),g.installed?o(g,g.installed):(g.mounted?.destroy(),g.mounted=null,g.options=null)}function p(g){if(c===g){x();return}x(!1);let{source:m}=g;if(g.mounted||(m.items=nt(m.root,m.type)),!m.items.length)return;let A=g.options||g.installed||ht("arc-tabs");if(!g.mounted&&!o(g,A)){g.button.textContent="No supported layout here";return}c=g;let S=d=>{o(g,d),g.presets.set(d.preset,{...d})};a=Ma({source:m,options:{...g.options},onClose:()=>x(),onRestore:()=>v(g),onPreset:d=>{St.has(d)&&(g.presets.set(g.options.preset,{...g.options}),S(g.presets.get(d)||ht(d)),a.update({source:m,options:{...g.options}}))},onOption:(d,P)=>{if(!Object.hasOwn(g.options,d)||d==="preset")return;let E={...g.options,[d]:P};S(E)},getCode:()=>yr(m,g.options),getStyle:()=>mr(g.options),applyStyle:d=>{let P=br(d,g.options);return P?(g.presets.set(g.options.preset,{...g.options}),S(P),a.update({source:m,options:g.options}),!0):!1}}),a.element.setAttribute("data-gc-author-panel",""),g.button.setAttribute("aria-expanded","true")}for(let g of e)try{let m=JSON.parse(g.textContent),A=document.querySelectorAll(m.selector),S=A.length===1&&n.get(A[0]);if(!S||m.v!==1||m.type!==S.source.type||!St.has(m.options?.preset))continue;S.installed=xr(m.options)}catch{console.warn("Gallery Studio: skipped an invalid page layout.")}for(let g of n.values())g.installed&&o(g,g.installed);if(t&&n.size){r=document.createElement("style"),r.textContent=ja,document.head.append(r);for(let g of n.values()){let{source:m}=g;if(!m.selector)continue;let A=m.root.querySelector(m.type==="list"?".user-items-list":".sqs-block-content")||m.root,S=getComputedStyle(A).position==="static";S&&A.classList.add("gc-config-position");let d=document.createElement("button");d.type="button",d.className="gc-config-launch",d.setAttribute("aria-expanded","false"),d.setAttribute("aria-label","Configure "+m.name+" layout"),d.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>',m.items.length||(d.disabled=!0,d.title="Add images in Squarespace to configure this source."),d.addEventListener("click",()=>p(g)),A.append(d),g.button=d,s.push(()=>{d.remove(),S&&A.classList.remove("gc-config-position")})}}let y={version:1,destroy(){x(!1);for(let g of n.values())g.mounted?.destroy();for(let g of s)g();r?.remove(),delete window.GalleryStudioInline}};return window.GalleryStudioInline=y,y}var St,Pa,Ea,Ia=V(()=>{Gt();Rt();Ca();Aa();St=new Map(ut.map(t=>[t.id,t])),Pa=new Set(["background","ink","accent","borderColor","overlayColor"]);Ea=new Set([...Pa,"colorSource","typeSource","clickAction"]);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ut,{once:!0}):Ut()});var vr;document.querySelector('script[type="application/json"][data-gallery-configure], script[type="application/json"][data-gallery-layout]')&&(vr=(await Promise.resolve().then(()=>(Ia(),za))).startInline);export{vr as startInline};

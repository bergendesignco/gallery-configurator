import {
  BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineLoop, DoubleSide, Mesh, NoToneMapping, PerspectiveCamera, Raycaster, Scene,
  ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer,
} from 'three';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import {cameraFov} from './CurvedPanelGeometry.js';
import {insetCard,playgroundCardGeometry,slotPerimeter,imageFrame} from './CarouselPlaygroundGeometry.js';
import {responsiveSlots,responsiveRange,projectedCardBounds,projectedCardFade,projectIndex,advancePhase,fixedSlotPose} from './ResponsiveCarouselGeometry.js';
import './webgl-carousel.css';

gsap.registerPlugin(CustomEase);
const surfaceEase = CustomEase.create('portfolio-surface', '.2,.75,.25,1');

const vertexShader = `
  varying vec2 imageUv;
  void main() {
    imageUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
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
`;

// Standalone study renderer. Retains the controller for motion/input; uses a fixed
// cylindrical slot surface with variable card inset, independent of path radius.
export function attachResponsiveCarousel(carousel, {textureSource=card=>card.querySelector('img').src}={}) {
  const { root, stage } = carousel;
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    root.dataset.renderer = 'css-fallback';
    return () => { delete root.dataset.renderer; };
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  // Three sets display:block inline; CSS must control the loading/fallback state.
  canvas.style.removeProperty('display');
  canvas.className = 'orbit-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  stage.append(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera();
  const raycaster = new Raycaster();
  const point = new Vector2();
  const events = new AbortController();
  const on = (target, type, handler) => target.addEventListener(type, handler, { signal: events.signal });
  const originalRender = carousel.render;
  const originalPointerDown = carousel.pointerDown;
  const textures = new Map();
  const panels = [];
  let geometry,guideGeometry;
  let phase=carousel.position,previousPosition=carousel.position;
  let dimensionsKey = '';
  let ready = false;
  let disposed = false;
  let hovered = null;
  let pointerLocation = null;
  let contextLost = false;
  let drawing = false;
  root.dataset.renderer = 'loading-webgl';

  const readSlots=()=>responsiveSlots({stageWidth:stage.clientWidth,stageHeight:stage.clientHeight,
    spiralWidthPercent:Number(root.dataset.spiralWidth),cardWidth:Number(root.dataset.cardWidth),
    aspect:Number(root.dataset.cardAspect),rise:Number(root.dataset.rise),riseUnit:root.dataset.riseUnit});
  const addPanel=()=>{
    const card=carousel.cards[0];
    const material=new ShaderMaterial({uniforms:{
      screenshot:{value:textures.get(textureSource(card))},dimensions:{value:new Vector2()},
      contentDimensions:{value:new Vector2(1,1)},imageScale:{value:new Vector2(1,1)},
      borderColor:{value:[0,0,0]},backColor:{value:[0,0,0]},solidBack:{value:false},borderWidth:{value:0},
      cornerRadius:{value:0},fade:{value:1},shade:{value:0},focused:{value:0}},
      vertexShader,fragmentShader,transparent:true,side:DoubleSide,depthTest:true,depthWrite:true,
      forceSinglePass:true,polygonOffset:true,polygonOffsetFactor:0,polygonOffsetUnits:0});
    const mesh=new Mesh(geometry,material);
    const guide=new LineLoop(guideGeometry,new LineBasicMaterial({color:0x71808a,transparent:true,opacity:.42,depthWrite:false}));
    const panel={card,mesh,guide,material,surface:{scale:1,target:1}};
    mesh.userData.panel=panel;panels.push(panel);scene.add(mesh,guide);
  };
  const syncPool=(slots)=>{
    const range=responsiveRange(phase,slots,stage.clientHeight);
    while(panels.length<range.count)addPanel();
    while(panels.length>range.count){const panel=panels.pop();scene.remove(panel.mesh,panel.guide);panel.material.dispose();panel.guide.material.dispose();}
    panels.forEach((panel,i)=>{
      panel.offset=range.first+i-phase;
      panel.card=carousel.cards[projectIndex(range.first+i,carousel.count)];
      panel.material.uniforms.screenshot.value=textures.get(textureSource(panel.card));
    });
  };
  const resize = () => {
    const width = stage.clientWidth, height = stage.clientHeight;
    const slots=readSlots();
    const gap=Number(root.dataset.slotGap || 3);
    syncPool(slots);
    const card=insetCard(slots,gap);
    const {cardWidth,panelArc}=card;
    const {radius}=slots;
    root.dataset.slotMetrics=JSON.stringify({...slots,cardArc:panelArc,cardWidth,cardHeight:card.height,gap,imageFit:root.dataset.imageFit,imagePadding:Number(root.dataset.imagePadding||0)});
    panels.forEach(panel=>{
      panel.material.uniforms.dimensions.value.set(cardWidth,card.height);
      const uniforms=panel.material.uniforms;
      uniforms.cornerRadius.value=Math.min(Number(root.dataset.cornerRadius)||0,cardWidth/2,card.height/2);
      uniforms.borderWidth.value=Number(root.dataset.borderWidth)||0;
      uniforms.solidBack.value=root.dataset.backFace==='solid';
      for(const key of ['backColor','borderColor']){
        const uniform=uniforms[key], hex=root.dataset[key];
        if(uniform.hex!==hex){
          uniform.hex=hex;
          const rgb=parseInt(hex.slice(1),16);
          uniform.value=[rgb>>16,(rgb>>8)&255,rgb&255].map(channel=>channel/255);
        }
      }
      const image=panel.material.uniforms.screenshot.value.image;
      if (!image) return;
      const frame=imageFrame(cardWidth,card.height,(image.naturalWidth||image.width)/(image.naturalHeight||image.height),root.dataset.imageFit,Number(root.dataset.imagePadding||0));
      panel.material.uniforms.contentDimensions.value.set(frame.contentWidth,frame.contentHeight);
      panel.material.uniforms.imageScale.value.set(frame.uvScaleX,frame.uvScaleY);
    });
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const key = `${width}:${height}:${cardWidth}:${panelArc}:${card.height}:${radius}:${ratio}`;
    if (key === dimensionsKey || !width || !height) return;
    dimensionsKey = key;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    camera.position.set(0, 0, radius * 2.4);
    camera.fov = cameraFov(height, camera.position.z);
    camera.aspect = width / height;
    camera.near = .1;
    camera.far = radius * 12;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const previous = geometry;
    geometry = playgroundCardGeometry(slots,gap);
    const oldGuide=guideGeometry;
    guideGeometry=new BufferGeometry();
    guideGeometry.setAttribute('position',new Float32BufferAttribute(slotPerimeter(slots),3));
    panels.forEach(panel => {
      panel.mesh.geometry = geometry;
      panel.guide.geometry=guideGeometry;
      panel.material.uniforms.dimensions.value.set(cardWidth, card.height);
    });
    previous?.dispose();oldGuide?.dispose();
  };

  const draw = () => {
    if (!ready || disposed || contextLost || drawing || !carousel.geometry) return;
    drawing = true;
    phase=advancePhase(phase,previousPosition,carousel.position,carousel.count);
    previousPosition=carousel.position;
    resize();
    const slots=readSlots(),cardDimensions=insetCard(slots,Number(root.dataset.slotGap||3));
    const keyboard=root.dataset.focusMode==='keyboard'&&root.contains(document.activeElement);
    let visibleCount=0;
    panels.forEach(panel=>{
      const {card,mesh,material}=panel;
      const pose=fixedSlotPose(panel.offset,slots);
      const bounds=projectedCardBounds(panel.offset,slots,cardDimensions);
      const projectedFade=projectedCardFade(bounds,stage.clientHeight);
      const fade=root.dataset.edgeMode==='preset' ? projectedFade : Number(projectedFade>0);
      const focused=keyboard&&card===carousel.cards[carousel.active]&&Math.abs(panel.offset)<.5;
      material.polygonOffsetUnits=Math.abs(panel.offset)*8;
      mesh.position.set(pose.x,pose.y,pose.z);mesh.rotation.y=pose.angle;
      mesh.visible=fade>.001 && Boolean(material.uniforms.screenshot.value.image);
      if(mesh.visible)visibleCount++;
      panel.guide.position.copy(mesh.position);panel.guide.rotation.copy(mesh.rotation);
      panel.guide.visible=root.dataset.showSlots==='true'&&mesh.visible;
      panel.guide.material.opacity=fade*.42;
      material.uniforms.fade.value=fade;material.uniforms.shade.value=pose.shade;
      material.uniforms.focused.value=focused?1:0;
    });
    const report=JSON.stringify({cardsPerTurn:slots.cardsPerTurn,visibleCount,poolCount:panels.length,
      stageWidth:stage.clientWidth,stageHeight:stage.clientHeight,cardWidth:cardDimensions.cardWidth,
      cardHeight:cardDimensions.height,pitch:slots.pitch,radius:slots.radius,uniqueCount:carousel.count});
    if(root.dataset.responsiveMetrics!==report)root.dataset.responsiveMetrics=report;
    if(pointerLocation&&!carousel.pointer)hovered=pick(pointerLocation);
    scene.updateMatrixWorld(true);
    renderer.render(scene, camera);
    drawing = false;
  };

  const pick = event => {
    if (!ready || contextLost) return null;
    const rect = canvas.getBoundingClientRect();
    point.set((event.clientX - rect.left) / rect.width * 2 - 1,
      -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(point, camera);
    for (const hit of raycaster.intersectObjects(panels.map(panel=>panel.mesh))) {
      const panel = hit.object.userData.panel;
      if (!hit.object.visible || panel.material.uniforms.fade.value <= .25) continue;
      // Ignore the transparent rounded corners when resolving clicks.
      const { x: width, y: height } = panel.material.uniforms.dimensions.value;
      const r = panel.material.uniforms.cornerRadius.value;
      const x = Math.abs((hit.uv.x - .5) * width) - width / 2 + r;
      const y = Math.abs((hit.uv.y - .5) * height) - height / 2 + r;
      if (Math.hypot(Math.max(x, 0), Math.max(y, 0)) + Math.min(Math.max(x, y), 0) > r) continue;
      return panel;
    }
    return null;
  };

  carousel.render = function () { originalRender.call(this); draw(); };
  carousel.pointerDown = function (event) {
    originalPointerDown.call(this, event);
    if (ready && !contextLost && this.pointer?.id === event.pointerId) {
      this.pointer.card = pick(event)?.card || null;
    }
    pointerLocation = null; hovered = null;
  };
  on(stage, 'pointermove', event => {
    pointerLocation = event.pointerType === 'mouse' ? { clientX:event.clientX, clientY:event.clientY } : null;
    hovered = event.pointerType === 'mouse' && !carousel.pointer ? pick(event) : null;
    canvas.style.cursor = carousel.pointer?.dragging ? 'grabbing' : hovered ? 'pointer' : 'grab';
    draw();
  });
  on(stage, 'pointerleave', () => { pointerLocation = null; hovered = null; draw(); });
  on(stage, 'pointerup', () => { hovered = null; draw(); });
  on(root, 'focusin', draw);
  on(root, 'focusout', () => queueMicrotask(draw));
  on(document, 'keydown', () => queueMicrotask(draw));
  on(document, 'pointerdown', () => queueMicrotask(draw));
  on(carousel.reducedMotion, 'change', () => {
    if (carousel.reducedMotion.matches) panels.forEach(({ surface }) => {
      gsap.killTweensOf(surface); surface.scale = surface.target;
    });
    draw();
  });
  on(root,'playground-change',draw);
  on(root,'slot-guides-change',draw);
  on(canvas, 'webglcontextlost', event => {
    event.preventDefault(); contextLost = true;
    root.classList.remove('has-webgl-carousel');
    root.dataset.renderer = 'css-fallback';
  });
  on(canvas, 'webglcontextrestored', () => {
    contextLost = false;
    if (ready) { root.classList.add('has-webgl-carousel'); root.dataset.renderer = 'webgl'; draw(); }
  });

  const resizeObserver=new ResizeObserver(()=>draw());
  resizeObserver.observe(stage);
  const loader = new TextureLoader();
  let textureFailed = false;
  const useImageFallback = () => {
    if (disposed) return;
    textureFailed = true;
    ready = false;
    root.classList.remove('has-webgl-carousel');
    root.dataset.renderer = 'css-fallback';
  };
  for (const card of carousel.cards) {
    const src = textureSource(card);
    if (textures.has(src)) continue;
    const texture = loader.load(src, draw, undefined, useImageFallback);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.set(src, texture);
  }

  // Position every slot with the final camera from the first paint. Each image
  // becomes visible in place as soon as its texture arrives.
  if (!textureFailed) {
    geometry=playgroundCardGeometry(readSlots(),Number(root.dataset.slotGap||3));
    guideGeometry=new BufferGeometry();
    ready = true;
    root.classList.add('has-webgl-carousel');
    root.dataset.renderer = 'webgl';
    draw();
  }

  return () => {
    disposed = true;
    events.abort();resizeObserver.disconnect();
    carousel.render = originalRender;
    carousel.pointerDown = originalPointerDown;
    root.classList.remove('has-webgl-carousel');
    delete root.dataset.renderer;
    panels.forEach(({ material, surface,guide }) => { gsap.killTweensOf(surface); material.dispose();guide.material.dispose(); });
    geometry?.dispose();guideGeometry?.dispose(); textures.forEach(texture => texture.dispose());
    renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
  };
}

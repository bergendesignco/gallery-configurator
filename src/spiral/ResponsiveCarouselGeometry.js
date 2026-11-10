import {fixedSlotPose} from './FixedSlotGeometry.js';
export {fixedSlotPose};
export const projectIndex=(index,count)=>((index%count)+count)%count;
export function responsiveSlots({stageWidth,stageHeight,spiralWidthPercent,cardWidth,aspect,rise,riseUnit}) {
 const radius=Math.max(1,stageWidth*spiralWidthPercent/200);
 const slotWidth=cardWidth;
 return {radius,slotWidth,slotHeight:slotWidth/aspect,aspect,
  pitch:riseUnit==='percent'?stageHeight*rise/100:rise,
  radiansPerSlide:slotWidth/radius,cardsPerTurn:Math.PI*2*radius/slotWidth};
}
// Conservative pool bounds include the furthest (smallest projected) rear cards,
// half a card above/below the viewport, and two slots for a seamless handoff.
export function responsiveRange(position,slots,stageHeight) {
 const cameraDistance=slots.radius*2.4;
 const farScale=cameraDistance/(cameraDistance+2*slots.radius);
 const half=Math.ceil((stageHeight/(2*farScale)+slots.slotHeight/2)/slots.pitch)+2;
 const center=Math.floor(position);
 return {first:center-half,last:center+half,count:half*2+1};
}
export function projectedCardBounds(offset,slots,card) {
 const angle=offset*slots.radiansPerSlide,left=angle-card.panelArc/2,right=angle+card.panelArc/2;
 const tau=Math.PI*2;
 const contains=phase=>Math.ceil((left-phase)/tau)<=Math.floor((right-phase)/tau);
 const maxCos=contains(0)?1:Math.max(Math.cos(left),Math.cos(right));
 const minCos=contains(Math.PI)?-1:Math.min(Math.cos(left),Math.cos(right));
 const distance=slots.radius*2.4;
 const near=distance/(distance+slots.radius*(1-maxCos));
 const far=distance/(distance+slots.radius*(1-minCos));
 const y=-offset*slots.pitch,top=y+card.height/2,bottom=y-card.height/2;
 return {minY:Math.min(bottom*near,bottom*far),maxY:Math.max(top*near,top*far)};
}
export function projectedCardFade(bounds,height) {
 const band=Math.min(80,height*.08);
 const clamp=value=>Math.max(0,Math.min(1,value));
 const amount=Math.min(clamp((height/2-bounds.minY)/band),clamp((bounds.maxY+height/2)/band));
 return amount*amount*(3-2*amount);
}
export function advancePhase(phase,previous,current,count) {
 let delta=current-previous;
 // Controller wraps only its project sequence. Unwrap those boundaries so the
 // spiral's geometry never jumps just because the final unique image passed.
 if(Math.abs(delta)>count/2)delta-=Math.round(delta/count)*count;
 return phase+delta;
}

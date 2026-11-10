import {createCurvedPanelGeometry} from './CurvedPanelGeometry.js';

export function fixedSlots({cardWidth,pitch,radiansPerSlide=Math.PI/4}) {
  // Match the retained reference at 12% gap once, then freeze the slot dimensions.
  const slotWidth=cardWidth/.88;
  return {slotWidth,slotHeight:slotWidth*9/16,radius:slotWidth/radiansPerSlide,pitch,radiansPerSlide};
}
export function insetCard(slots,gapPercent) {
  const fraction=1-Math.max(0,Math.min(20,gapPercent))/100;
  return {cardWidth:slots.slotWidth*fraction,panelArc:slots.radiansPerSlide*fraction,height:slots.slotHeight*fraction};
}
export function fixedSlotPose(offset,{radius,pitch,radiansPerSlide}) {
  const angle=offset*radiansPerSlide;
  return {x:Math.sin(angle)*radius,y:-offset*pitch,z:(Math.cos(angle)-1)*radius,angle,taper:1,shade:(1-Math.cos(angle))/2*.58};
}
export function createInsetCardGeometry(slots,gapPercent) {
  const card=insetCard(slots,gapPercent);
  return createCurvedPanelGeometry(card.cardWidth,card.panelArc);
}
export function slotPerimeter(slots,segments=64) {
  const points=[];
  for(let i=0;i<=segments;i++) {
    const a=(i/segments-.5)*slots.radiansPerSlide;
    points.push(slots.radius*Math.sin(a),slots.slotHeight/2,slots.radius*(Math.cos(a)-1));
  }
  for(let i=segments;i>=0;i--) {
    const a=(i/segments-.5)*slots.radiansPerSlide;
    points.push(slots.radius*Math.sin(a),-slots.slotHeight/2,slots.radius*(Math.cos(a)-1));
  }
  return points;
}

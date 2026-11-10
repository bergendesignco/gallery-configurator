import {fixedSlots,insetCard,createInsetCardGeometry} from './FixedSlotGeometry.js';
export {fixedSlotPose,slotPerimeter,insetCard} from './FixedSlotGeometry.js';

export function playgroundSlots(geometry,{stageHeight,risePercent,aspect}) {
 const slots=fixedSlots({...geometry,pitch:stageHeight*risePercent/100});
 return {...slots,aspect,slotHeight:slots.slotWidth/aspect};
}
export function playgroundCardGeometry(slots,gapPercent) {
 const geometry=createInsetCardGeometry(slots,gapPercent);
 geometry.scale(1,(1/slots.aspect)/(9/16),1);
 geometry.computeVertexNormals();geometry.computeBoundingSphere();
 return geometry;
}
export function imageFrame(width,height,imageAspect,fit,paddingPercent) {
 const padding=Math.min(width,height)*Math.min(40,Math.max(0,paddingPercent))/100;
 const contentWidth=width-2*padding,contentHeight=height-2*padding;
 const targetAspect=contentWidth/contentHeight;
 const bound=fit==='fit'?Math.max:Math.min;
 const uvScaleX=bound(1,targetAspect/imageAspect),uvScaleY=bound(1,imageAspect/targetAspect);
 return {contentWidth,contentHeight,uvScaleX,uvScaleY,imageWidth:contentWidth/uvScaleX,imageHeight:contentHeight/uvScaleY,padding};
}

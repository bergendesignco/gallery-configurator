// Bound curvature and vertical overlap to the actual stage dimensions.
export function responsiveSlots({stageWidth,stageHeight,spiralWidthPercent,cardWidth,aspect,rise,riseUnit}) {
 const radius=Math.max(1,stageWidth*spiralWidthPercent/200);
 const slotWidth=Math.max(1,Math.min(cardWidth,radius*Math.PI/3,stageHeight*0.4*aspect));
 const cardsPerTurn=Math.PI*2*radius/slotWidth;
 const desiredRise=riseUnit==='percent'?stageHeight*rise/100:rise*Math.min(1,stageWidth/640);
 return {radius,slotWidth,slotHeight:slotWidth/aspect,aspect,
  pitch:Math.max(slotWidth/aspect*1.25/cardsPerTurn,desiredRise),
  radiansPerSlide:slotWidth/radius,cardsPerTurn:Math.PI*2*radius/slotWidth};
}

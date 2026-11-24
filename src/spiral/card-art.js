// Paint customized card faces into the texture used by the existing curved mesh.
// The ordinary image-only gallery continues to use its original image textures.
export function needsCardArt(item,o){
  return !item.src || o.showImage===false || o.textPlacement==='card' || o.cardBackground || o.cardPadding>0 ||
    o.imageBorder || o.imageWidth!==100 || o.imageAlign!=='center' ||
    ['original','circle'].includes(o.aspectRatio);
}
function rounded(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.roundRect(x,y,w,h,Math.max(0,Math.min(r,w/2,h/2)));
}
function lines(ctx,text,width){
  const result=[];
  for(const paragraph of text.split(/\n/)){
    let line='';
    for(const word of paragraph.split(/\s+/)){
      const next=line?line+' '+word:word;
      if(line&&ctx.measureText(next).width>width){result.push(line);line=word;}
      else line=next;
    }
    result.push(line);
  }
  return result;
}
export function composeCards(entries,o,style){
  const width=Math.max(80,o.cardWidth);
  const padding=Math.min(o.cardPadding,width*.4),inner=width-2*padding;
  const rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
  const probe=document.createElement('canvas').getContext('2d');
  const records=entries.map(({item,image})=>{
    const pieces=[];
    const addText=(text,size,weight,color,align,gap,isButton=false,family=style.bodyFamily)=>{
      if(!text)return;
      const font=weight+' '+size+'px '+family;
      probe.font=font;
      const wrapped=lines(probe,text,Math.max(1,inner-(isButton?16:0)));
      pieces.push({font,size,color,align,lines:wrapped,height:wrapped.length*size*1.25+(isButton?10:0),gap,isButton});
    };
    const iw=inner*o.imageWidth/100, natural=image?.naturalWidth/image?.naturalHeight||1;
    const [rw,rh]=o.aspectRatio.split(':').map(Number);
    const ratio=o.aspectRatio==='circle'?1:rw&&rh?rw/rh:natural;
    const media=image&&o.showImage?{image,width:iw,height:iw/ratio,gap:0}:null;
    const inline=o.textPlacement==='card'||!item.src||!o.showImage;
    if(inline){
      if(o.showTitles)addText(item.title,o.titleCustom&&o.titleSize?o.titleSize*rem:style.titleSize,o.titleCustom&&o.titleWeight!=='inherit'?o.titleWeight:style.titleWeight,o.titleCustom&&o.titlePalette==='custom'?o.titleColor:style.ink,o.titleAlign,0,false,style.family);
      if(o.showDescription)addText(item.plain,o.bodyCustom&&o.descriptionSize?o.descriptionSize*rem:style.size,o.bodyCustom&&o.descriptionWeight!=='inherit'?o.descriptionWeight:style.weight,o.bodyCustom&&o.descriptionCustom?o.descriptionColor:style.ink,o.descriptionAlign,pieces.length?o.titleGap:0);
      if(o.showButton&&item.buttonLabel&&item.link)addText(item.buttonLabel,style.size,style.weight,style.buttonInk,'center',o.buttonGap,true);
    }
    if(media){
      if(o.cardOrder==='content'){media.gap=pieces.length?o.mediaGap:0;pieces.push(media);}
      else{if(pieces.length)pieces[0].gap+=o.mediaGap;pieces.unshift(media);}
    }
    return {pieces,height:Math.max(1,2*padding+pieces.reduce((sum,p)=>sum+p.gap+p.height,0))};
  });
  const height=Math.max(1,...records.map(r=>r.height));
  return records.map(({pieces,height:own})=>{
    const canvas=document.createElement('canvas');
    const scale=Math.min(2,2048/Math.max(width,height));
    canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    const c=canvas.getContext('2d');c.scale(scale,scale);
    const cardHeight=o.cardSizing==='equal'?height:own;
    const top=(height-cardHeight)/2;
    if(o.cardBackground){c.fillStyle=o.cardColor;rounded(c,0,top,width,cardHeight,o.spiralRadius);c.fill();}
    let y=top+padding+(o.cardAlign==='bottom'?cardHeight-own:o.cardAlign==='middle'?(cardHeight-own)/2:0);
    let buttonBounds;
    for(const p of pieces){
      y+=p.gap;
      if(p.image){
        const natural=p.image.naturalWidth/p.image.naturalHeight;
        const fit=o.fit==='contain'||o.fit==='fit';
        const w=fit?Math.min(p.width,p.height*natural):p.width,h=fit?w/natural:p.height;
        const x=padding+(o.imageAlign==='left'?0:o.imageAlign==='right'?inner-p.width:(inner-p.width)/2)+(p.width-w)/2;
        const iy=y+(p.height-h)/2;
        const radius=o.aspectRatio==='circle'?p.width/2:o.imageRadius;
        if(o.shadowEnabled){
          c.save();
          c.shadowColor=o.shadowColor;c.shadowBlur=o.shadowBlur*scale;
          const angle=o.shadowAngle*Math.PI/180;
          c.shadowOffsetX=Math.cos(angle)*o.shadowDistance*scale;c.shadowOffsetY=Math.sin(angle)*o.shadowDistance*scale;
          const spread=o.shadowSpread;
          rounded(c,x-spread,iy-spread,w+2*spread,h+2*spread,radius+spread);
          c.fillStyle=o.shadowColor;c.fill();c.restore();
        }
        c.save();
        if(o.aspectRatio==='circle'){c.beginPath();c.arc(x+w/2,iy+h/2,p.width/2,0,Math.PI*2);c.clip();}
        rounded(c,x,iy,w,h,o.aspectRatio==='circle'?0:radius);c.clip();
        const factor=fit?Math.min(w/p.image.naturalWidth,h/p.image.naturalHeight):Math.max(w/p.image.naturalWidth,h/p.image.naturalHeight);
        const dw=p.image.naturalWidth*factor,dh=p.image.naturalHeight*factor;
        c.drawImage(p.image,x+(w-dw)/2,iy+(h-dh)/2,dw,dh);
        if(o.overlayEnabled){c.fillStyle=o.imageTint;c.fillRect(x,iy,w,h);}
        if(o.imageBorder){c.strokeStyle=o.imageBorderColor;c.lineWidth=2*o.imageBorderSize;c.stroke();}
        c.restore();
      }else{
        const align=p.align==='inherit'?'center':p.align;
        c.font=p.font;c.textBaseline='top';c.textAlign=align;c.fillStyle=p.color;
        if(p.isButton){
          const bw=Math.min(inner,Math.max(...p.lines.map(l=>c.measureText(l).width))+16);
          const bx=(width-bw)/2;c.fillStyle=style.accent;c.fillRect(bx,y,bw,p.height);
          c.fillStyle=p.color;buttonBounds={left:bx/width,right:(bx+bw)/width,top:y/height,bottom:(y+p.height)/height};
        }
        const x=align==='left'?padding:align==='right'?width-padding:width/2;
        p.lines.forEach((line,i)=>c.fillText(line,x,y+(p.isButton?5:0)+i*p.size*1.25,inner));
      }
      y+=p.height;
    }
    return {canvas,buttonBounds,aspect:width/height};
  });
}

/*
 * Original shader from: https://www.shadertoy.com/view/WslfW4
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// Orb harvest - Result of an improvised live code session on Twitch
// Thankx to md10t, Balkhan and haptix for suggestions & help
// LIVE SHADER CODING, SHADER SHOWDOWN STYLE, EVERY TUESDAYS 21:00 Uk time:
// https://www.twitch.tv/evvvvil_

// "Everyday the postman votes for me" - Ramond Prunier

vec2 z=vec2(0.),v=vec2(0.),e=vec2(.0035,-.0035); float f=0.,t=0.,tt=0.,g=0.,g2=0.,b=0.,bb=0.,cc=0.;vec3 np=vec3(0.),bp=vec3(0.),pp=vec3(0.),cp=vec3(0.),po=vec3(0.),no=vec3(0.),al=vec3(0.),ld=vec3(0.);//global vars. About as exciting as vegans talking about sausages.
float bo(vec3 p,vec3 r){p=abs(p)-r;return max(max(p.x,p.y),p.z);} //box primitive function. Box is the only primitve I hang out with, I find the others have too many angles and seem to have a multi-faced agenda.
mat2 r2(float r){return mat2(cos(r),sin(r),-sin(r),cos(r));} //rotate function. Short and sweet, just like a midget wrestler covered in Mapple syrup.
vec2 fb( vec3 p, float s ) // fb "fucking bit" function make a base geometry which we use to make spaceship and central structures using more complex positions defined in mp
{
  vec2 h,t=vec2(bo(p,vec3(.5,.5,17)),5);  
  h=vec2(bo(p,vec3(.7,.3,17)),6);  
  t=t.x<h.x?t:h;
  h=vec2(bo(p,vec3(.3,.7,17)),3);  
  t=t.x<h.x?t:h;  
  h=vec2(bo(abs(p)-vec3(1,0,0),vec3(0,0,17)),6);  
  h.x=max(h.x,abs(cp.z)-8.);
  g+=0.1/(0.1*h.x*h.x*(1000.-980.*sin(cp.z*.2+tt*2.)));
  t=t.x<h.x?t:h;
  if(s>0.) t.x=max(t.x,abs(cp.z)-8.),t.x=max(t.x,-cp.y);
  return t;
}
vec2 mp( vec3 p )
{ 
  p.xy*=r2(sin(p.z*.2+tt*.5)*.4);  
  p.z=mod(p.z+tt*5.,40.)-20.;  
  np=bp=pp=cp=p;
  vec2 h,t=vec2(length(abs(p)-vec3(2.+cc,0,0))-3.,7.);
  t.x=max(abs(t.x)-.2,-(abs(p.x)-2.-cc));  
  h=vec2(length(abs(p)-vec3(2.+cc,0,0))-3.,6.);
  h.x=max(abs(h.x)-.1,-(abs(p.x)-1.8-cc));
  t=t.x<h.x?t:h;
  t.x=max(t.x,-(length(p.yz)-1.8));  
  h=vec2(bo(p,vec3(1.5)),3);  //MIDDLE BOX + CYLINDER
  h.x=max(abs(h.x)-.1,-(length(p)-1.8));
  t=t.x<h.x?t:h;
  h=vec2(length(p.xy)-.2,6);  
  t=t.x<h.x?t:h;     
  bp.yz*=r2(0.785*2.);pp.yz*=r2(0.785*2.);//TENTACLES + STRUCTURE KIFS 
  np.x=abs(np.x)-8.;
  bb=.5+.5*sin(np.x*.5-1.7)+np.x*.1;
  np.z-=2.*sin(p.x*.3+tt*1.)*bb;
  np.zy*=r2(tt);
  for(int i=0;i<3;i++){
    np=abs(np)-vec3(0,1.*bb,1.*bb);
    bp=abs(bp)-vec3(0,5,.75);
    bp.yz*=r2(.785);
    bp.xz*=r2(sin(pp.z*.2)*.3);
  } bp.y-=1.4;
  b=abs(np.x*.8)*.1;
  h=vec2(bo(np,vec3(5,.4-b,.4-b)),3);
  h.x*=.5; t=t.x<h.x?t:h;
  h=vec2(bo(np,vec3(5,.5-b,.25-b)),6);
  h.x*=.5; t=t.x<h.x?t:h; 
  h=fb(bp,1.);h.x*=0.7;t=t.x<h.x?t:h;    //STRUCTURE
  h=fb(abs(p*.5-vec3(0,1,0))-vec3(4,5,4),0.);h.x*=0.7;   //ROADS
  t=t.x<h.x?t:h;    
  h=vec2(length(abs(p)-vec3(3,0,0))-1.3,6.); //GLOWY SPHEREs 
  g2+=0.1/(0.1*h.x*h.x*(40.-39.*sin(cp.x*.2+tt*2.)));
  t=t.x<h.x?t:h;  
  h=vec2(p.y+10.+sin(cp.z*25.-tt*60.)*.03,8);//TERRAIN
  h.x*=0.4;  t=t.x<h.x?t:h;  
  float at=min(length(cp)-7.,7.)/7.;//TREES
  b=ceil(cp.x*.1);
  p.z=mod(p.z-tt*2.5,40.)-20.;
  p.xz=abs(abs(p.xz)-10.)-8.+b*2.;  
  p+=vec3(0,10.-b,0);
  bb=.5+.5*sin(cp.y*.5+2.7-b);
  h=vec2(bo(abs(p)-vec3(1.*bb,0,1.*bb),vec3(.2,5.-at*3.,.1)),6);
  h.x*=.5; t=t.x<h.x?t:h;
  h=vec2(.5*length(abs(p-vec3(0,5.-at*6.,0))-vec3(.5,0,.5))+.05,6);
  g2+=.3/(0.1*h.x*h.x*150.);
  t=t.x<h.x?t:h; t.x*=0.9;
  return t;
}
vec2 tr( vec3 ro, vec3 rd ) // main trace / raycast / raymarching loop function 
{
  vec2 h,t= vec2(.1); //Near plane because when it all started the hipsters still lived in Norwich and they only wore tweed.
  for(int i=0;i<128;i++){ //Main loop de loop 
    h=mp(ro+rd*t.x); //Marching forward like any good fascist army: without any care for culture theft. (get distance to geom)
    if(h.x<.0001||t.x>60.) break; //Conditional break we hit something or gone too far. Don't let the bastards break you down!
    t.x+=h.x;t.y=h.y; //Huge step forward and remember material id. Let me hold the bottle of gin while you count the colours.
  }
  if(t.x>60.) t.y=0.;//If we've gone too far then we stop, you know, like Alexander The Great did when he realised his wife was sexting some Turkish bloke. (10 points whoever gets the reference)
  return t;
}
// Rough shadertoy approximation of the bonzomatic noise texture by yx - https://www.shadertoy.com/view/tdlXW4
vec4 texNoise(vec2 uv){ float f = 0.; f+=texture(iChannel0, uv*.125).r*.5;
    f+=texture(iChannel0,uv*.25).r*.25;f+=texture(iChannel0,uv*.5).r*.125;
    f+=texture(iChannel0,uv*1.).r*.125;f=pow(f,1.2);return vec4(f*.45+.05);
}
#define a(d) clamp(mp(po+no*d).x/d,0.,1.)
#define s(d) smoothstep(0.,1.,mp(po+ld*d).x/d)
void mainImage( out vec4 fragColor, in vec2 fragCoord )//2 lines above are a = ambient occlusion and s = sub surface scattering
{
  vec2 uv=(fragCoord.xy/iResolution.xy-0.5)/vec2(iResolution.y/iResolution.x,1); //get UVs, nothing fancy, 
  tt=mod(iTime+3.,62.82);  //Time variable, modulo'ed to avoid ugly artifact. Imagine moduloing your timeline, you would become a cry baby straight after dying a bitter old man. Christ, that's some fucking life you've lived, Steve.
  cc=3.*(clamp(sin(tt*.75-1.8),-.5,.5)+.5);
    vec3 ro=mix(vec3(1),vec3(-1,-1,1),ceil(sin(tt*.4+2.)))*vec3(sin(tt*.4-2.)*15.,2.,-20.),//Ro=ray origin=camera position We build camera right here broski. Gotta be able to see, to peep through the keyhole.
  cw=normalize(vec3(0)-ro),cu=normalize(cross(cw,vec3(0,1,0))),cv=normalize(cross(cu,cw)),
  rd=mat3(cu,cv,cw)*normalize(vec3(uv,.5)),co,fo;//rd=ray direction (where the camera is pointing), co=final color, fo=fog color
  ld=normalize(vec3(-.1,.5,-.2)); //ld=light direction
  v=vec2(abs(atan(rd.x,rd.z)),rd.y);//make some polar uvs to make a fake spherical environment map
  co=fo=vec3(.1,.3,.6)-length(uv)*.1+.5*texNoise(v*.5).r;//background is dark blueish with vignette and subtle vertical gradient based on ray direction y axis. 
  z=tr(ro,rd);t=z.x; //Trace the trace in the loop de loop. Sow those fucking ray seeds and reap them fucking pixels.
  if(z.y>0.){ //Yeah we hit something, unlike you at your best man speech.
    po=ro+rd*t; //Get ray pos, know where you at, be where you is.
    no=normalize(e.xyy*mp(po+e.xyy).x+e.yyx*mp(po+e.yyx).x+e.yxy*mp(po+e.yxy).x+e.xxx*mp(po+e.xxx).x); //Make some fucking normals. You do the maths while I count how many instances of Holly Willoughby there really is.
    al=vec3(1,.5,0);b=1.;  
    if(z.y<5.) al=vec3(0); //material ID < 5 makes it black
    if(z.y>5.) al=vec3(1); //material ID > 5 makes it white
    if(z.y>6.) al=vec3(0,.2,.7);  
    if(z.y>7.) al=vec3(1),b=0.;  
    float dif=max(0.,dot(no,ld)), //Dumb as fuck diffuse lighting
    fr=pow(1.+dot(no,rd),4.), //Fr=fresnel which adds background reflections on edges to composite geometry better
    sp=pow(max(dot(reflect(-ld,no),-rd),0.),50.);//Sp=specular, stolen from Shane 
    co=mix(sp*b+mix(vec3(.8),vec3(1),abs(rd))*al*(a(.1)*a(.3)+.2)*(dif+s(7.)*.5),fo,min(fr,.3));//Building the final lighting result, compressing the fuck outta everything above into an RGB shit sandwich
    co=mix(fo,co,exp(-.00002*t*t*t)); //Fog soften things, but it won't stop your mother from being unimpressed by your current girlfriend
  } ro=.5+.5*sin(cp);
  fragColor = vec4(pow(co+g*.2*mix(vec3(.7,.3,0),vec3(1,.1,0),ro)+g2*.2*mix(vec3(0,.1,.5),vec3(.1,.2,1),ro),vec3(.55)),1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
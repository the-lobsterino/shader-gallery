/*
 * Original shader from: https://www.shadertoy.com/view/sdfyzs
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define rez iResolution
float wav(float t){return abs(fract(t)-.5);}
vec3 mcol=vec3(0.0);
float glw=0.;
float DE(vec3 p0){
  vec4 p=vec4(p0,1.1);
  vec3 c=mod(p0,10.)-4.;
  for(int n=0;n<2;n++){
    p.xyz=abs(mod(p.xyz,4.0)-2.0)-1.0;
    p*=2.0/clamp(dot(p.xyz,p.xyz),0.25,1.0);
    if(p.y>p.z)p.yz=p.zy;
    if(p.x>p.y)p.xy=p.yx;
    p.x+=1.0;
  }
  float d=(length(p.yz)-.1+0.1*wav(p.x*10.0))/p.w;
  glw+=max(wav(p.x+p0.y+p0.z+time)-.3,0.)/(1.+d*d);
  float g=abs(sin((c.x+c.z)*10.-time*10.));
  float d2=min(length(c.xy),length(c.yz+vec2(.5,0.)))-.125-g*.01;
  if(mcol.x>0.0){
    if(d<d2)mcol+=vec3(.4)+.1*abs(p.xyz);
    else mcol+=vec3(2.*g);
  }
  return min(d,d2);
}
vec3 normal(vec3 p, float d){//from dr2
  vec2 e=vec2(d,-d);vec4 v=vec4(DE(p+e.xxx),DE(p+e.xyy),DE(p+e.yxy),DE(p+e.yyx));
  return normalize(2.*v.yzw+vec3(v.x-v.y-v.z-v.w));
}
vec3 sky(vec3 rd, vec3 L){
  float d=2.*pow(max(0.,dot(rd,L)),20.);
  return vec3(d)+abs(rd)*.1;
}
float rnd;
void randomize(in vec2 p){rnd=fract(float(time)+sin(dot(p,vec2(13.3145,117.7391)))*42317.7654321);}

float ShadAO(in vec3 ro, in vec3 rd){
 float t=0.01*rnd,s=1.0,d,mn=0.01;
 for(int i=0;i<12;i++){
  d=max(DE(ro+rd*t)*1.5,mn);
  s=min(s,d/t+t*0.5);
  t+=d;
 }
 return s;
}
vec4 sphere(vec3 ro, vec3 rd){
  vec4 s=vec4(100);
  vec3 p=vec3(iTime*.5+6.,-4.,iTime*.5+8.);
  p=ro-p;
  float b=dot(-p,rd); 
  if(b>0.){
    float inner=b*b-dot(p,p)+.7;
    if(inner>0.){
      float t=b-sqrt(inner);
      if(t>0.)s=vec4(normalize(p+rd*t),t);
    }
  }
  return s;
}
vec3 scene(vec3 ro, vec3 rd){
  float t=DE(ro)*rnd,d,px=4.0/rez.x;
  vec4 s=sphere(ro,rd);
  for(int i=0;i<99;i++){
    t+=d=DE(ro+rd*t);
    if(t>20.0 || d<px*t)break;
    if(t>s.w){px*=10.;ro+=rd*s.w;rd=reflect(rd,s.xyz);t=0.01;}
  }
  vec3 L=normalize(vec3(0.4,0.025,0.5));
  vec3 bcol=sky(rd,L),col=bcol;
  float g=glw;
  if(d<px*t*5.0){
    mcol=vec3(0.001);
    vec3 so=ro+rd*t;
    vec3 N=normal(so,d);
    vec3 scol=mcol*0.25;
    float dif=0.5+0.5*dot(N,L);
    float vis=clamp(dot(N,-rd),0.05,1.0);
    float fr=pow(1.-vis,5.0);
    float shad=ShadAO(so,L);
    col=(scol*dif+.5*fr*sky(reflect(rd,N),L))*shad;
  }
  return mix(col,bcol,clamp(t*t/400.,0.,1.))+vec3(1.,.3,.1)*exp(-t)*clamp(g*g,0.,1.);
}
mat3 lookat(vec3 fw){vec3 up=vec3(0.0,0.8,0.1),rt=-normalize(cross(fw,up));return mat3(rt,normalize(cross(rt,fw)),fw);}
vec3 path(float t){t*=.5;t+=sin(t*.1)*7.;
  return vec3(t+sin(t*1.1),sin(t*.3)*.5-5.2,t+cos(t)*.7); 
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
 randomize(fragCoord);
 vec3 ro=path(iTime),fw=normalize(path(iTime+0.5)-ro);
 vec3 rd=lookat(fw)*normalize(vec3((iResolution.xy-2.0*fragCoord)/iResolution.y,1.0));
 fragColor=vec4(scene(ro,rd),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
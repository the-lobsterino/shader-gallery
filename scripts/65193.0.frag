/*
 * Original shader from: https://www.shadertoy.com/view/wsSBzK
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

// --------[ Original ShaderToy begins here ]---------- //
float r1 (vec2 uv){return fract(sin(dot(uv,vec2(12.236*cos(iTime),39.236*sin(iTime))))*4587.326);}
float hs (vec2 uv){return fract(sin(dot((uv),vec2(95.236,48.241)))*7845.166+iTime*5.);}
float ov(float a, float b){ return mix(2.*a*b,1.-2.*(1.-a)*(1.-b),step(0.5,a));}
vec3 ov(vec3 a, vec3 b){ return mix(2.*a*b,1.-2.*(1.-a)*(1.-b),step(0.5,a));}
mat2 rot( float t) { float c = cos(t);float s = sin(t);return mat2(c,-s,s,c);}
float rd(vec2 uv){return fract(sin(dot(floor(uv),vec2(95.236,48.241)))*7845.166);}
float rd(float uv){return fract(sin(dot(floor(uv),94.236))*7845.166);}
float no(float t){return mix(rd(t),rd(t+1.),smoothstep(0.,1.,fract(t)));}
float it (float uv ){float r=0.;float amp =0.5;for(int i=0; i< 5; i ++){
  r+=no(uv/amp)*amp;amp*=0.5;}return r;}
float rd2(float uv){return fract(sin(dot(floor(uv),94.236))*7845.166+iTime*6.);}
float no2(float t){return mix(rd2(t),rd2(t+1.),smoothstep(0.,1.,fract(t)));}
float it2 (float uv ){float r=0.;float amp =0.5;for(int i=0; i< 3; i ++){
  r+=no2(uv/amp)*amp;amp*=0.5;}return r;}
float no(vec2 uv){vec2 e=vec2(1.,0.);float a=rd(uv);
  float b= rd(uv+e.xy);float c=rd(uv+e.yx);float d=rd(uv+e.xx);
  vec2 h = smoothstep(0.4,0.5,fract(uv));
  return mix(mix(a,b,h.x),mix(c,d,h.x),h.y);}
  float no2(vec2 uv){vec2 e=vec2(1.,0.);float a=rd(uv);
  float b= rd(uv+e.xy);float c=rd(uv+e.yx);float d=rd(uv+e.xx);
  vec2 h = smoothstep(0.,1.,fract(uv));
  return mix(mix(a,b,h.x),mix(c,d,h.x),h.y);}
float it (vec2 uv ){float r=0.;float amp =0.5;for(int i=0; i< 5; i ++){
  r+=no2(uv/amp)*amp;amp*=0.5;}return r;}
  float it2 (vec2 uv ){float r=0.;float amp =0.5;for(int i=0; i< 5; i ++){
  r+=no2(uv/amp)*amp;amp*=0.5;}return smoothstep(0.,0.6,r);}
  float ce = 0.;
  float sc = 0.;
float map (vec3 p ) {
   
  float c = length(p)-10.;
  float bf = no(vec2(atan(p.x,p.z)*3.,0.))*0.8+no(vec2(atan(p.x,p.z)*6.,0.))*0.2;
  float bt = pow(smoothstep(25.,0.,length(p.xz)),3.)*8.*mix(0.5,1.,bf);
  float rt = smoothstep(0.9,1.,no2(p.xz))*0.3;
  float s = dot(p,vec3(0.,1.,0.))+5.-bt-rt;
  float s2 = length(p+vec3(0.,2.5,0.))-10.+bf*0.5;
  float s3 = max(-s2,s);
  float f1 = min(c,s3);
  ce = c;
  sc =c;
  //if(s3>c){ce=1.;}
  return f1;}
  vec3 nor (vec3 p ){vec2 e =vec2(0.01,0.);return normalize(map(p)-vec3(map(p-e.xyy),map(p-e.yxy),map(p-e.yyx)));}
  float sha (vec3 pos, vec3 at, float k) {
    vec3 dir = normalize(at - pos);
    float maxt = length(at - pos);
    float f = 1.;
    float t = .01*10.;
    for (float i = 0.; i <= 1.; i += 1./30.) {
        float dist = map(pos + dir * t);
        if (dist < .01) return 0.;
        f = min(f, k * dist / t);
        t += dist;
        if (t >= maxt) break;
    }
    return f;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float time = iTime;
    vec2 uv = fragCoord/iResolution.xy;
    uv -=0.5;
    uv *=2.;
    uv.x*=iResolution.x/iResolution.y;
     vec3 e = vec3(0.,5.5,-35.);
  vec3 r = normalize(vec3(uv,it(time*0.8)*1.5+1.));
  
  r.zy *=  rot(-0.4);
  float t= it(time);
  e.xz *=rot(t);
  r.xz *= rot(t);
  
  vec3 p = e;
  float dd = 0.;
  vec3 col = vec3(0.);
  vec3 n = vec3(0.);
  float tr = 1.;
  float tt = 1.;
  float tt2 = 1.;
  vec3 n3 = vec3(0.);
  float fres= 0.;
  for(int i = 0;i<64;i++){
  float d = map(p);
      
  if(dd>64.){break;dd=64.;}
  if(d<0.01){
     
     vec2 en = vec2(0.01,0.);
  float rep = 0.5;
    float fb = smoothstep(0.1,0.,ce);
     vec2 t1 = vec2( it2(p.xy*rep+en.xy)-it2(p.xy*rep-en.xy),it2(p.xy*rep+en.yx)-it2(p.xy*rep-en.yx));
     vec2 t2 = vec2( it2(p.zy*rep+en.xy)-it2(p.zy*rep-en.xy),it2(p.zy*rep+en.yx)-it2(p.zy*rep-en.yx));
    vec2 t3 = mix(t1,t2,smoothstep(10.,0.,length(p.z)));
    vec3 n2 = vec3(t3.x,t3.y,t3.x); 
    vec2 tex = vec2( it(p.xz*rep+en.xy)-it(p.xz*rep-en.xy),it(p.xz*rep+en.yx)-it(p.xz*rep-en.yx));
    n3 = normalize(vec3(tex.x,0.5,tex.y));
    n = normalize(nor(p)-mix(-n3,n2*2.,fb));
     tt2 = 1.-fb;
    tr *=fb;
    if(tr<0.01){break;}
      
    fres = smoothstep (0.5,-0.8,dot(n,-r));
    tt = 1.-smoothstep(0.1,0.,ce)*0.5;
    r = reflect(r,n);
    d =0.1;
    
    
   }
  p+=r*d;
  dd +=d;
  }
  float di = dot(r,normalize(vec3(0.,0.1,0.5)));
  vec2 tn = vec2(4.,8.);
 
  float nn =mix(it(r.zy*tn+vec2(time*1.,0.)),it(r.xy*tn+vec2(time*1.,0.)),pow(abs(r.z),3.));
  float ls = ov(smoothstep(-0.3,0.1,r.y),mix(0.,1.,nn));
  vec3 sky = mix(vec3(0.6),mix(vec3(0.7),vec3(0.1,0.08,0.05),smoothstep(-0.8,0.6,r.y)),ls);
  //float bvi = it(time*0.3);
  sky += ov(mix(0.4,0.6,nn),pow(it(time*4.),0.5)*smoothstep(0.4,1.,dot(vec3(0.,0.,1.),r)));
  vec3 sky2 = mix(3.*abs(1.-2.*fract(sky*0.5+0.3+vec3(0.,-1./3.,1./3.)))-1.,sky,0.95)*max(vec3(0.5),sky);
  float rep = 0.3;
  float tex = it(p.xz*rep+vec2(45.236));
  float spp = dot(n+n3,-r);
  float dsp = dot(n,normalize(r+vec3(0.,-0.5,0.)));
  float spec = smoothstep(0.999,1.,dsp)*0.3+smoothstep(0.9,1.8,dsp);
   //float ao = smoothstep(0.,1.,map(p+n*0.5));
  float obc = smoothstep(1.,0.6,spp);
  vec3 sol = vec3(smoothstep(0.8,1.,spp))*2.*tex*obc*hs(p.xz);
  float bmc = dot(n,r);
  vec3 hu = mix(3.*abs(1.-2.*fract(bmc*1.5+0.2+vec3(0.,-1./3.,1./3.)))-1.,vec3(0.),0.62);
 
  col = ov(mix(sky2*max(obc,smoothstep(10.,55.,dd)),sol,smoothstep(64.,20.,dd)) ,mix(vec3(0.4),vec3(0.5),sha (p,vec3(0.,30.,50.),64.))) ;
  //vec3 n = nor(p);
 
  float ao2 = smoothstep(-0.6,0.,map(p+n));
  //float li2 = smoothstep(0.,0.5,dot(n,vec3(0.,0.,1.)));
  col *= max(hu,tt);
  col += spec;
  col += fres;
  //col += li2*0.15*bvi;
  col *=ao2;
  vec3 ff =3.*abs(1.-2.*fract(smoothstep(64.,20.,dd)*0.5+vec3(0.,-1./3.,1./3.)))-1.;
  col =col+ff*0.0;
    float bff = smoothstep(1.,25.,distance(dd,30.))*pow(tt,6.);
  vec3 colf = ov(col,mix(vec3(0.5),vec3(hs(uv),hs(uv+95.265),hs(uv+47.125)),mix(0.2,1.,bff)));
      	float f1 = r1(uv+iTime);
    
    float f3 =smoothstep(0.,no2(uv.x*14.)*0.2, no2(uv.x*6.)*no2(uv.x*12.));
    float f4 =smoothstep(0.,no2(uv.x*8.)*2., no2(uv.x*7.)
                         *no2(uv.x*15.));
    float f5 = smoothstep(0.8,1.,no2(uv.y*10.));
    float f2 = smoothstep(mix(f4,0.,f5),mix(f3,0.8,f5),no2(uv.y*200.+f1))*mix(f3*(smoothstep(0.,0.5,f4)),1.,f5);
    float ff2 = (f2+2.5*smoothstep(0.7,1.,it(uv*10.+rd(time*12.)*100.)));
    float vv2 = it2(time*4.)*-0.5;
    float vv3 = it2(time*3.5)*0.5+0.5;
    vec3  v1 = vec3(-0.15,it2(time*3.)*-0.2,-0.08);
    vec3 v2 = vec3(-0.2,vv2,vv2);
    vec3 v3 = vec3(vv3);
    vec3 v4 = vec3(1.);
    vec3 colff =smoothstep(mix(v1,v2,ff2),mix(v3,v4,ff2),colf);
  fragColor = vec4(colff,bff);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
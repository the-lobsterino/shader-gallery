


// BEGIN: shadertoy porting template
// https://gam0022.net/blog/2019/03/04/porting-from-shadertoy-to-glslsandbox/
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    gl_FragColor = col;
}                                  
                     

// Emulate a black texture
#define texture(s, uv) vec4(0.0)         

float rand(vec2 p){
  return fract(sin(dot(p,vec2(12.9898,78.233)))*43578.543123);
}
float PI = acos(-1.);
float noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = rand(i);
  float b = rand(i+vec2(1,0));
  float c = rand(i+vec2(0,1));
  float d = rand(i+vec2(1,1));
  
  vec2 u = f*f*(3.0-2.0*f);
  
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}

float fbm(vec2 st){
  float v = 0.0;
  float a = 0.5;
  for(int i = 0;i<4;i++){
    v += a*noise(st);
    st *=2.0;
    a *= 0.5;
  }
  return v;
}
float cube(vec3 p,vec3 s){
  vec3 q = abs(p);
  vec3 m = max(s-q,0.0);
  return length(max(q-s,0.))-min(min(m.x,m.y),m.z);
}

mat2 rot(float r){
  return mat2(cos(r),sin(r),-sin(r),cos(r));
}

float cyl(vec3 p,float ln,float r){    //  like arrow?!
  
  float s = max(length(p.xy)-r,0.);
  
  return length(vec2(max(abs(p.z)-ln,0.0),s))-min(max(ln-abs(p.z),0.),max(r-length(p.xy),0.));
  
}
//------------------------------------------------
float  smin(float a, float b, float k){
 float h =clamp(0.5+0.5*(b-a)/k,0.,1.0) ; return mix(b,a,h)-k*h*(1.0-h); }


float  calcZ(){
  float klt = mod(iTime*0.5,5.);
return 4.0*pow(sin(klt)*exp(-klt),1.);  // de 40.*( )
}

float  calcsZ(){
  float klt = mod((iTime+0.7)*0.5,5.);
return 4.0*pow(sin(klt)*exp(-klt),2.);  // de  40.*( ) ;
}

vec4 dist(vec3 p){
  float k = 0.5;
  vec3 sp = p;
  
float d2 =999.;

p = sp;
float kt = 0.2*iTime;


p.xy += 1.*vec2(cos(kt),sin(kt));

p.xy *= rot(iTime*0.6+sin(iTime));

float ksz = calcZ();

p.z += ksz;

vec3 srp = p;

p.z -= 0.8;
float s6 = cyl(p,.64, 0.25*(0.75-abs(p.z)));  // rear arrow  bright ejection
p.z +=1.4 ;
float s7 = cyl(p,.4, 0.21*(0.5-abs(p.z)));  // front arrow no bright

p=srp;


p.x = abs(p.x)-1.; p.y =abs(p.y-0.2)-0.2 ;  // ad y axis
p.xz *= rot(0.25*PI);
float d4 = cube(p,vec3(0.6,0.01,0.6));
p = srp;

p.z = abs(p.z)-1.;
float d5 = cube(p,vec3(4.0,100.,0.4));

d4 = max(d4,-d5);

p = srp;
p.xz *= rot(0.5*PI);
p.xy *= rot(-0.6);
p.zy *= rot(-0.5);
p.xz *= rot(2.05);

//d4 = min(d4,s6);

for(int i = 0;i<2;i++){
  vec3 ssp = p;
  p.xz *= rot(PI*0.25);

  d2 = cube(p,vec3(0.4,0.01,0.2));
  p = ssp;
  p.y += 0.05;
  p.xz *= rot(1.7);
  p.xy *= rot(PI*0.25); p.yz *= rot(PI*0.25);
  float d3 = cube(p,vec3(0.2,0.2,0.2)*0.6);
  d3 = smin(d2,d3,0.2);    // de  d2 =min(d2,d3);
  d2 = min(d2,d3) ;   // ad
  
 
  d2 = smin(d2, s7,0.2) ;  // ad   s7 arrow
  p.x = abs(p.x)-0.07;
  p.z = abs(p.z)-0.2;
  p.y = abs(p.y)-0.2;
}

d2 = smin(d4,d2, 0.2);

  p = sp;

  p.z -= 5.*iTime;
             // de p.y+3.+0.3*(  ) ; plain up &down 
  float d1 = p.y+3.*(1.+0.4*sin(iTime*0.5))+0.3*fbm(p.xz*4.)*noise(p.xz)+2.*noise(p.xz*0.5+100.);
  
  float d = length(p)-0.1;
  vec3 col = vec3(s6,d2*0.9, ksz ); // planet & ground color
             //de (s7,d2,ksz); front arrow bright
  return vec4(col,min(d1,d2));
}

vec3 getNormal(vec3 p){
  vec2 e = vec2(0.001,0.0);
  return normalize(vec3(
    dist(p+e.xyy).w-dist(p-e.xyy).w,
    dist(p+e.yxy).w-dist(p-e.yxy).w,
    dist(p+e.yyx).w-dist(p-e.yyx).w
    
    ));
}

vec3 cloud(vec3 rd,vec3 col,float s){
  float acyz = length(rd.xz)/abs(rd.y);
  col = mix(col,vec3(0.3),fbm(iTime+s*vec2(rd.xz*2.*acyz)));
  col =  mix(col,vec3(0.1),fbm(iTime+s*vec2(rd.xz*4.*acyz)));
  col = mix(vec3(0.5),col,exp(-0.2*abs(acyz)));
  return col;
}

vec3 LightDir = normalize(vec3(0.0,-1.0,1.0));
vec3 getSky(vec3 rd){
  vec3 col = vec3(0.4,0.4,0.5);
  float sun = 0.004/(1.-dot(-rd,LightDir));
  col += clamp(sun,0.0,1.3);
  col = cloud(rd,col,1.0);
  return col;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

vec2 r=iResolution.xy,p=(fragCoord.xy*2.-r)/min(r.x,r.y);
float nt = fbm(p*10.3);


float krt = iTime*0.+0.5*PI;
float ra = 4.0;
float kss = 1.;
vec3 st = vec3(0);
float kf = max(calcsZ(),0.);
st = vec3(0,-2.-sin(iTime*0.7),-1)+0.3*vec3(fbm(vec2(iTime*kss)),fbm(vec2(iTime*kss+100.)),fbm(vec2(kss*iTime+1000.)));
if(mod(iTime,34.)>14.){
  st += vec3(-calcsZ()*1.9,sin(iTime*0.7)+4.-calcZ()*0.1,-calcZ());
                                        // y axis -calcZ() ad
  float kt= 0.2*iTime;
  st.xy += vec2(cos(kt),sin(kt));
  krt = iTime*0.2;
  ra = 1.;
}else{
  
}                                             //ad  front view & back view
vec3 ro =st+ vec3(cos(krt)*ra*2.,0.5,ra*sin(krt))+vec3(0.,0.9,5.*cos(iTime*0.4));
vec3 ta = st+vec3(0,0,0);

vec3 cdir = normalize(ta-ro);
vec3 side = cross(cdir,vec3(0,1,0));
vec3 up = cross(side,cdir);
float fov = 1.;

vec3 rd = normalize(p.x*side+p.y*up+fov*cdir);

float d,t= 0.0;

vec4 tdr;

float thr = 0.001;


vec3 ac = vec3(0.);

for(int i =0;i<108;i++){
  tdr = dist(ro+rd*t);
  d = tdr.w;
  float sc = max(tdr.x,0.02);
  d = min(sc,d);
  t += d*0.7;                                 // de(0.6,0.4,0.05) red yellow color
  ac +=  (1.0+3.0*max(tdr.z,-0.2))*exp(sc*-4.)*vec3(0.5,0.2,0.805*cos(iTime*0.3)) +0.15*exp(tdr.y*-1.)*vec3(0.3,0.4,0.6) ;
  if(thr>d||t>100.)break;                      //   blue purple color
}
vec3 col = vec3(0.);
if(thr>d){
  vec3 normal = getNormal(ro+rd*t);
  
  float lm = max(dot(-LightDir,normal),0.);


    if(mod(iTime,20.)>5.){
  col = vec3(lm);   }
  
  col += ac*0.15;   // de ac*0.3
  
  //col = cloud(-LightDir+0.*fbm((ro+rd*t).xz),col,100.);
  
  if(mod(iTime,20.)>10.){
  col = mix(vec3(getSky(normal+rd*0.01).y),col,exp((-0.3*fbm((ro+rd*t).xz-vec2(0,2.*iTime)))*t));
  
  col = mix(col,vec3(0.49),1.-clamp(exp(-0.05*(t-5.)),0.0,1.0)); }
  
}else{
  if(thr<d) col = getSky(rd);
}
 vec2 uv = fragCoord/iResolution.xy;

  col =mix(col,texture(iChannel0,uv).xyz,0.3+0.05*kf);
    fragColor = vec4(col,1.0);
}


/*
 * Original shader from: https://www.shadertoy.com/view/sdXyRX
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

// Emulate a black texture
#define texelFetch(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define HOUSWPOS vec3(8,4.,-10)

mat2 rot(float r){
  return mat2(cos(r),sin(r),-sin(r),cos(r));
}
float dot2( in vec2 v ) { return dot(v,v); }
float dot2( in vec3 v ) { return dot(v,v); }
vec2 pmod(vec2 p,float n){
    float np = 2.*3.14159265/n;
    float r =atan(p.x,p.y)-0.5*np;
    r = mod(r,np)-0.5*np;
    return length(p)*vec2(cos(r),sin(r));
}

vec2 random2(vec2 st){
    return texelFetch(iChannel0,ivec2(st),0).xy;
}

float noise (in vec2 st) {
       vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

#define OCTAVES 4
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .8;
    }
    return value;
}

float cylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
//https://iquilezles.org/articles/distfunctions

float sdCappedCone( in vec3 p, in float h, in float r1, in float r2 )
{
    vec2 q = vec2( length(p.xz), p.y );
    
    vec2 k1 = vec2(r2,h);
    vec2 k2 = vec2(r2-r1,2.0*h);
    vec2 ca = vec2(q.x-min(q.x,(q.y < 0.0)?r1:r2), abs(q.y)-h);
    vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );
    float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
    return s*sqrt( min(dot2(ca),dot2(cb)) );
}

float box(vec3 p,vec3 s){
  vec3 q = abs(p);
  vec3 m = max(s-q,0.);
  return length(max(q-s,0.))-min(min(m.x,m.y),m.z);
}

vec2 froor(vec3 p,vec3 housepos){
  float h = 1.4*fbm(100.+0.08*p.xz);
  h += housepos.y*exp(-0.2*length(vec2(0.2,0.9)*(p.xz-housepos.xz-vec2(0,1.9)))); 
  return vec2(p.y-h,h);
}

float house(vec3 p,vec3 housepos){
float sc = 1.2;
  float radi = 0.125;
  p -= housepos;
  p *= sc;
  p.xz *= rot(1.9);
  p.y += 0.3;
  vec3 sp = p;
  
  p.y -= 1.+2.*radi;
  p.y = abs(p.y)-4.*radi;
  p.xy *= rot(0.5*3.1416);
  p.y = abs(p.y)-1.4121*1.5;
  p.xz = abs(p.xz)-radi;
  p.zy *= rot(0.25*3.141592);
  p.x = abs(p.x-radi)-radi*1.;
  float cyl = cylinder(p,radi*2.*12.,radi);
  
  p = sp;
  p.y -= 3.;
  p.xz *= rot(0.25*3.141592);
  p.xz = abs(p.xz);
  p.yz *= rot(0.25*3.141592);
  float wall = box(p-vec3(1.4,-0.9,0.2),vec3(0.1,radi*12.,radi*12.));
  float roof = box(p-vec3(0,0.7,0.4),vec3(1.8,0.1,1.8));
  
  p = sp;
  p.zx *= rot(0.25*3.141592);
  float door = box(p-vec3(0.6,1,0.9),vec3(0.5,1,1));
  float d =  min(min(cyl,roof),min(wall,door));
  return d/sc;
}

float grass(vec3 p,float h){
p.y -= 0.13;
float k = 0.05;
float cylinhigh = 2.8*noise(200.+p.xz*0.05);
vec3 sp = p;
float ks = 4.;
float kt = 0.3;
float kzx = 0.1;
vec3 ds = 0.2*vec3((p.y-h)*ks*sin(kzx*p.x+iTime*kt),0,(p.y-h)*ks*cos(kzx*p.z+iTime*kt));
float d2 = sdCappedCone(p-ds-vec3(0,h+cylinhigh*2.,0.),cylinhigh,0.025,0.);
/*
for(int i = 0;i<8;i++){
p.xz = abs(p.xz)-1.;
//p.xz *= rot(0.3);
d2 = min(d2,sdCappedCone(p-vec3(0,h+cylinhigh*2.,0.),cylinhigh,0.025,0.));

}*/

p = sp;
  p.xz = mod(p.xz,k)-0.5*k;
  float d = sdCappedCone(p-ds-vec3(0,h+cylinhigh*.5,0.),cylinhigh,0.05,0.);
  return min(d2,d);
}

vec2 tree(vec3 p){ 
float sc = 0.6;
p *= sc;
  float shi = 0.9;
  float sr = 0.17;
  float sd = cylinder(p,shi,sr);
  p.y -= shi;
  p.xz = pmod(p.xz,4.);
  vec2 scale = vec2(0.75,0.67);
  vec2 size = vec2(1.,sr);
  float d = cylinder(p,size.x,size.y);
  for(int i =0;i<3;i++){
   p.x = abs(p.x);
   p.y -= size.x;
   p.xy *= rot(-0.7);
   size *= scale;
   d = min(d,cylinder(p,size.x,size.y));
  }
   p.xz = pmod(p.xz,7.);
   for(int i =0;i<3;i++){
   p.x = abs(p.x);
   p.y -= size.x;
   p.xy *= rot(-0.6);
   size *= scale;
   d = min(d,cylinder(p,size.x,size.y));
  }
  scale = vec2(0.6,0.6);
   p.x = abs(p.x);
   p.y -= size.x;
   p.xy *= rot(-0.4);
   size *= scale;
   float ind = 0.;
   d = min(d,cylinder(p,2.*size.x,size.y));
   float kd = box(p-vec3(0,size.x*2.,0),1.2*vec3(0.05,0.07,0.01));
    d = min(d,sd);
   if(d>kd) ind = 1.0;
   d = min(d,kd);
 
  return vec2(d/sc,ind);

}

vec4 dist(vec3 p){
  vec3 col = vec3(0);
  vec3 housepos = HOUSWPOS;
  vec2 dfroor = froor(p,housepos);
  float dhouse = house(p,housepos);
  float dgrass = grass(p,dfroor.y);
  float dtree =tree(p-housepos-vec3(-4,0,0)).x;
  float d = dhouse;
  d = min(d,dfroor.x);
  d = min(d,dgrass);
  d = min(d,dtree);
  return vec4(col,d);
}

vec3 getnormal(vec3 p){
  vec2 e = vec2(0.0001,0.);
  return normalize(vec3(
    dist(p+e.xyy).w-dist(p-e.xyy).w,
    dist(p+e.yxy).w-dist(p-e.yxy).w,
    dist(p+e.yyx).w-dist(p-e.yyx).w
    ));
}
float softray(vec3 ro, vec3 rd , float hn)
{
	float t = 0.1;
	float jt = 0.0;
	float res = 1.;
	for (int i = 0; i < 20; ++i) {
		jt = dist(ro+rd*t).w;
		res = min(res,jt*hn/t);
		t = t+ clamp(0.02,2.,jt);
	}
	return clamp(res,0.,1.);
}




void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 r=iResolution.xy,p=(fragCoord.xy*2.-r)/min(r.x,r.y);
    vec2 uv= fragCoord.xy/r;
    vec3 ro = vec3(0,1.2,15.+25.*fract(iTime/25.));
    vec3 ta = vec3(-1,5.8,0);
    vec3 cdir = normalize(ta-ro);
    vec3 side = cross(cdir,vec3(0,1,0));
    vec3 up = cross(side,cdir);
    vec3 rd = normalize(side*p.x+up*p.y+2.*cdir);
    float d,t=0.0;
    vec4 rsd = vec4(0);

    float faraway = 100.;
    float esp = 0.0001;
    for(int i = 0;i<308;i++){
      rsd = dist(ro+rd*t);
      d = rsd.w;
      t += d;
      if(d<esp||t>faraway)break;
    }
    vec3 sp = ro+rd*t;
    vec3 col = vec3(0);
    if(d<esp&&t<faraway){
        vec3 diffuse = vec3(0,0,0);
          vec3 housepos = HOUSWPOS;
        vec2 st = tree(sp-housepos-vec3(-4,0,0));
      
        vec2 sr = froor(sp,housepos);
        float sh = house(sp,housepos);
        float sg = grass(sp,sr.y);
        
        if(min(st.x,sr.x)<min(sh,sg)){
         if(st.x<sr.x){
             if(st.y<0.5){diffuse = vec3(0.3,0.22,0.1);
             }else{
             diffuse = vec3(0.3,0.8,0.3);
             }
         }
         else{
             diffuse = vec3(0.4,0.3,0.04);
         }
        }else if(sh<sg){
         diffuse = vec3(0.7,0.5,0.3);
        }else{
           diffuse =vec3 (0.6,0.9,0.6);
        }
        
        vec3 normal = getnormal(sp);
        vec3 lightdir = normalize(vec3(0.1,1,1));

        float val =max(dot(normal,lightdir),0.)*0.5+0.5;
        float hlc = val *val*(3./(4.*3.141592));

        vec3 shadowRay = normalize(vec3(0.1,1.,1));
        float shadow = softray(sp,shadowRay,3.1);
        col = vec3(diffuse*hlc*shadow);
    }
    vec3 fogcol = vec3(0.9,0.9,1.);
    float far = 30.;
    float near = 1.;
    //col = mix(col,fogcol,clamp((t-near)/(far-near),0.,1.));
   col = mix(fogcol,col,exp(-0.06*(t+fbm(uv*0.2+0.2*iTime)*10.)));
   col = clamp(col,vec3(0),vec3(1));
   col = pow(col,vec3(1.2,1.2,1.));
    fragColor=vec4(col,1);
    }
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
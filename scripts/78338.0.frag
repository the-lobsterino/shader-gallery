precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

const float pi = acos(-1.);
const float pi2 = pi*2.;

const vec3 COL_OBJ = vec3(.0,.1,.3);
const vec3 COL_OM = vec3(0.025,0.05,.1);
const vec3 COL_OL = vec3(.03);
const vec3 COL_OE1 = vec3(.7,.0,.0);
const vec3 COL_OE2 = vec3(1.5);

float rand(vec2 co){
  return fract(sin(dot(co,vec2(12.,78.)))*45678.);
}

float noise(vec2 st){
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = rand(i);
  float b = rand(i+vec2(1.,0.));
  float c = rand(i+vec2(0.,1.));
  float d = rand(i+vec2(1.,1.));

  vec2 u = f*f*(3.-2.*f);

  return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}

float fbm(vec2 st){
  float v=0., a=.5;
  for(int i=0; i<4; i++){
    v += a*noise(st);
    st *= 2.;
    a *= .5;
  }
  return v;
}

mat2 rot(float a){
  return mat2(cos(a),sin(a),-sin(a),cos(a));
}

vec2 pmod(vec2 p, float r){
  float a = atan(p.x,p.y) + pi/r;
  float n = (pi2/r);
  a = floor(a/n)*n;
  return p * rot(a);
}

float box(vec3 p, vec3 b){
  vec3 q = abs(p) - b;
  return length(max(q,0.)) + min(max(q.x,max(q.y,q.z)),0.);
}

float octa(vec3 p, float s){
  p = abs(p);
  return (p.x+p.y+p.z-s)*.5773;
}

vec4 ouv(vec4 o1, vec4 o2){
  return o1.w < o2.w ? o1 : o2;
}
vec3 offset = vec3(.15,.15,-4.5);

vec4 obj(vec3 p){
  vec3 po = p;
  vec3 q = p;

  p.y = abs(p.y) - .35;
  vec4 o = vec4(vec3(COL_OBJ), 1e5);

  float pyramid = max(octa(p, .4), -box(p+vec3(0.,.5,0.), vec3(.5)));

  //ring
  q.xz *= rot(sin(time*.4)*pi2*exp(p.y*3.));
  q.y = abs(q.y)-.075;
  float k = .18;
  float d = 1e5;
  float s = .35;
  for(int i=0; i<5; i++){
    q.y = q.y - .05;
    float b = box(q, vec3(s*k,.005,s*k));
    b = max(b, -box(q, vec3((s-.05)*k,.01,(s-.05)*k)));
    k *= 1.3;
    d = min(d, b);
  }

  d = min(d, pyramid);
  vec4 sphere = vec4(vec3(.8,0.,0.), length(po)-.07*max(abs(sin(time*128./16.)),.85));

  o.w = min(d,1e5);
  o = ouv(o, sphere);

  return o;
}

vec4 om(vec3 p){
  
  p.xy = pmod(p.xy, 8.);
  vec4 o = vec4(COL_OM,1e5);

  float s = .5;
  for(int i=0; i<6; i++){
    p = abs(p) - vec3(s);
    p.xy *= rot(s*pi);
    //float d = octa(p, .5);
    float d = box(p,vec3(.25, .45, .4));
    o.w = min(o.w,d);
    s *= 1.15;
  }
  return o;
}

vec4 ol(vec3 p){
  vec3 po = p;
  p.xy = pmod(p.xy, 8.);
  p = mod(p, .98) - .49;
  vec4 o = vec4(COL_OL,1e5);

  float k = .015;
  float l1 = box(p, vec3(10.,k,k));
  float l2 = box(p, vec3(k,10.,k));
  float l3 = box(p, vec3(k,k,10.));

  float d = min(min(l1,l2),l3);
  po.xy = pmod(po.xy, 8.);
  po.z = mod(po.z, 1.2) - .6;
  d = max(d, -box(po, vec3(.6,.6,2.)));

  o.w = d;

  return o;
}

vec4 oe(vec3 p, float r, float k, vec3 col){

  vec3 po = p;
  p.xy *= rot(pi/r);
  vec4 o = vec4(col,1e5);

  p.yz = pmod(p.yx, 8.);
  p = mod(p, k) - k*.5;

  float d = box(p, vec3(k/4.));

  o.w = d;
  o.xyz *= fbm(po.yz+time*(1.+o.z/10.))*1.5;

  return o;

}


vec4 map(vec3 p){
  vec4 o = vec4(vec3(1.),1e5);
  vec3 pc = p;
  p.z -= time;

  o = ouv(o,ol(p));
  o = ouv(o, ouv(oe(p,1.,2.,COL_OE1), oe(p,8.,4.,COL_OE2)));
  o = ouv(o, obj(pc));
  o = ouv(o, om(pc+vec3(0.,0.,7.5)));

  return o;
}

void cam(inout vec3 ro){
  ro.xz *= rot(pi/20.);
  //ro.yz *= rot(pi/32.);

  ro += vec3(0.,0,0.05);

}

vec3 normal(vec3 p, float eps){
  vec2 e = vec2(1.,-1.)*.5773*eps;
  return normalize(
    e.xyy + map(p+e.xyy).w+
    e.yxy + map(p+e.yxy).w+
    e.yyx + map(p+e.yyx).w+
    e.xxx + map(p+e.xxx).w
    );
}


void raymarch(vec3 ro, vec3 rd, inout vec3 col){

  //---raymarch---

  float t = 0.;
  vec3 pos = ro;
  vec4 o = vec4(0.);
  vec3 ac = vec3(0.);

  for(int i=0; i<66; i++){
    pos = ro + rd*t;
    o = map(pos);

    t += o.w;
    ac += o.xyz*.5;

    if(o.w<.001){
      break;
    }
  }

  //--------------

  //---lighting---

  if(!(o.xyz == COL_OBJ || o.xyz == COL_OL)){
    col += ac * .4 * exp(-.3*t) ;
  }

  //specular
  if(!(o.xyz == COL_OBJ || o.xyz == COL_OL)) return;
  vec3 n = vec3(0.);
  if(o.w<.001){
    vec3 spos = ro + rd*t;
    n = normal(spos,.0001);
    rd = reflect(rd,n);
    ro = spos;
    t = .01;
    ac = vec3(0.);

    for(int i=0; i<30; i++){
      vec4 rsd = map(ro+rd*t);
      t += rsd.w;
      ac += rsd.xyz;
      if(rsd.w<.001){
        break;
      }
    }
  }

  col = .06*ac * n*4. ;

  //--------------

}

void main(){
  vec2 p = (gl_FragCoord.xy*2. - resolution)/min(resolution.x, resolution.y);
  vec3 ro = vec3(0.,0.,1.), dir = normalize(offset-ro);
  vec3 up = vec3(0.,1.,0.);
  vec3 rd = normalize(cross(dir,up)*p.x+up*p.y+dir*.8);

  vec3 col = vec3(0.);

  cam(ro);
  raymarch(ro, rd, col);


  gl_FragColor = vec4(col,1.);
}
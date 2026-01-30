precision highp float;

uniform vec2 resolution;
uniform float time;
const float PI=3.1415926;

mat2 rot(float t) {
  return mat2(cos(t),-sin(t),sin(t),cos(t));
}

float cube(vec3 p, vec3 r){
  p=abs(p)-r;
  return max(p.x,max(p.y,p.z));
}

vec3 cmod(vec3 p,float n){
  return mod(p-.5*n,n)-.5*n;
}

vec2 ball(vec3 p) {
  float r=4.;
  p.y-=r+1.;
  float t=time*.2;
  p.xz*=rot(t);
  p.yz*=rot(t);
  float d=cube(p, vec3(r));
  p.xz*=rot(p.y*.4);
  d=length(p)-5.;
  p.y*=.5;
  float rp=3.;
  for(int i=0;i<4;i++){
    r/=rp;
    d=max(d,-cube(p,vec3(r,r,10.)));
    d=max(d,-cube(p,vec3(10,r,r)));
    d=max(d,-cube(p,vec3(r,10,r)));
    p=cmod(p,2.*r);
  }
  return vec2(d,1.);
}

vec2 map(vec3 p){
  vec2 plane=vec2(abs(p.y),2.);
  vec2 ball=ball(p);
  return plane.x < ball.x ? plane : ball;
}

vec3 normal(vec3 p){
  vec2 e=vec2(0.001,0.);
  return normalize(vec3(
    map(p+e.xyy).x-map(p-e.xyy).x,
    map(p+e.yxy).x-map(p-e.yxy).x,
    map(p+e.yyx).x-map(p-e.yyx).x));
}

float sat(float x){
  return clamp(x, 0.,1.);
}

float BlinnPongNDF(float ndoth, float n){
  return pow(ndoth,n)* (n+1.)/(2.*PI);
}

float occlusion(vec3 p, vec3 n){
  float step=0.1;
  float o=0.;
  for(int j=0;j<10;j++){
    o= max(o,max(0.0,1.0-map( p + n*step ).x/step));
    step+=step;
  }
  return min(exp2(-5.5*pow(o,2.0) ),1.0);
}

vec3 brdf(vec3 p, vec3 v, vec3 n, vec3 l, vec3 lc, vec3 diff, vec3 spec, float s) {
  vec3 h=normalize(l+v);
  float ndoth=sat(dot(n,h));
  float specTerm=BlinnPongNDF(ndoth,s);
  vec3 col=(diff + spec * specTerm) *sat(dot(n,l))*lc;
  return col;
}

vec3 lighting(vec3 base, float m, float s, vec3 p, vec3 v, vec3 n){
  vec3 diff=base*(1.-m);
  vec3 spec=base*m;

  vec3 col=vec3(0.);
  float oc=occlusion(p,n);
  vec3 l=normalize(vec3(1.5,2.,-.7));
  vec3 lc=vec3(1.,.7,0.5)*oc;
  col+=brdf(p,v,n,l,lc, diff, spec, s);

  vec3 l2=normalize(vec3(-1.,.5,.4));
  vec3 lc2=vec3(0.,0.3,.2)*oc*2.;
  col+=brdf(p,v,n,l2,lc2, diff, spec, s);

  vec3 l3=normalize(vec3(-1.,-1.5,.4));
  vec3 lc3=vec3(1.,0.,0.2)*oc;
  col+=brdf(p,v,n,l3,lc3, diff, spec, s);

  vec3 amb=vec3(0.2);
  col+=diff*amb*oc;
  return col;
}

void main(){
	vec2 st=(gl_FragCoord.xy-resolution*0.5)/min(resolution.x,resolution.y);
  vec3 cam=vec3(0.,8.,-12.);
  vec3 rd=normalize(vec3(st, .9));
  rd.yz*=rot(.3);
  vec3 col=vec3(0);
  vec3 p=cam;
  float depth;
  float emission=0.;
  vec2 mat=vec2(0.);
  for(int i=0;i<128;i++){
    mat=map(p);
    float d=mat.x;
    emission+=exp(abs(d)*-.1);
    depth+=d;
    p+=d*rd;
    if (d<.001){
      vec3 n=normal(p);
      if (mat.y==1.){
        vec3 base=vec3(.5,.5,.5);
        float m=.9;
        col=lighting(base, m, 100.,p,-rd,n);
      }else{
        vec3 base=vec3(.8);
        float m=.3;
        col=lighting(base, m, 120.,p,-rd,n);
      }
      break;
    }
  }


  col=mix(vec3(.0),col,exp(-depth*depth*.002));
  col=pow(col,vec3(.4545));
  col*=1.-length(st)*.7;
  gl_FragColor = vec4(col,1.0);
}

//
// Coudycol
//
// by @paulofalcao
//
// A quick effect done in Inecia2019
//

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define Size 0.192
#define ScreenL 4.686
#define SphereOpacity 0.006
#define Color vec3(1,0.38,0.38)
#define R1 5.4752
#define G1 6.954
#define B1 6.313

float sincostex(vec3 p,float s){
  p*=s;
  return cos(p.x)*sin(p.y)*cos(p.z)*0.5+0.5;
}

vec4 of(vec3 p){
  p*=(sin(time*2.0)*0.59+1.5);
	
  p*=(sin(time*2.0)*0.5+1.5);
  float ct=cos(time);float st=sin(time);
  p.xz*=mat2(ct,-st,st,ct);
  ct=cos(time*0.5);st=sin(time*0.5);
  p.xy*=mat2(ct,-st,st,ct);


  vec3 op=p;
  vec3 a1=p*(1.0+sin(op.yzx*4.0)*0.4);
  vec3 a2=p*(1.0+sin(op*4.0)*0.4);
  p=mix(a1,a2,sin(time*0.31)*0.5+0.5);

  vec3 n=normalize(p);
  p*=(0.5+sincostex(n,sin(floor(time))*10.0+10.0));
  float a=length(p)<(sincostex(n,Size*10.0)+2.0)?SphereOpacity:0.0;
	
  vec3 color=vec3(
    sin(p.x*R1)*02.5+0.5,
    sin(p.y*G1)*0.5+0.5,
    sin(p.z*B1)*0.5+0.5)*Color;
  return vec4(color,a);  
}

void main( void ) {
	
  vec2 uv=resolution;
  uv=(gl_FragCoord.xy-uv*.5)/uv.y;

  vec3 ro=vec3(0,0,5);
  vec3 r=normalize(vec3(uv,-1));

  vec4 color;
  vec4 d;
  vec3 p;
  float f=1.0;
  for(int i=0;i<400;i++){
    p=ro+f*r;
    d=of(p);
    color+=vec4(d.xyz*d.w,d.w);
    if (f>8.0) break;
    if (color.w>1.0) break;
    f+=0.02;
  }

  gl_FragColor=vec4(color.xyz*ScreenL,1);

}
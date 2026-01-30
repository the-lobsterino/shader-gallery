#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI  = 3.141592653589793;
const float PI2 = PI * 2.;

float lPolygon(vec2 p,int n){
  float a = atan(p.x,p.y)+PI;
  float r = PI2/float(n);
  return cos(floor(.5+a/r)*r-a)*length(p);
}

mat2 mRotate(float a){
 float c=cos(a);
 float s=sin(a);
 return mat2(c,-s,s,c);
}

float lStarPolygon(vec2 p,int n,float o){
 return (lPolygon(p,n) - lPolygon(p * mRotate(PI2 / float(n) / 2.),n) * o) / (1.-o);
}


void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float d = lStarPolygon(p,7,.5);
	//vec3 color = vec3(smoothstep(0.4,0.41,d)); 
	vec3 color = vec3(d/2.0); 
   	gl_FragColor = vec4(color, 1.0);
	
}
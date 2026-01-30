#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//----------- gravity_field_3 ---------------

#define POINTS 10 		 // number of stars

#define M mouse
#define R resolution
#define t time
#define pos gl_FragCoord
#define col gl_FragColor

float dist2(vec2 P0, vec2 P1) { vec2 D=P1-P0; return dot(D,D); }

float hash (float i) { return 2.*fract(sin(i*7467.25)*1e5) - 1.; }
vec2  hash2(float i) { return vec2(hash(i),hash(i-.1)); }
vec4  hash4(float i) { return vec4(hash(i),hash(i-.1),hash(i-.3),hash(i+.1)); }
	

vec2 P (int i)  // position of point[i]
{
	vec4 c = hash4(float(i));
	return vec2(   cos(t*c.x-c.z)+.5*cos(2.765*t*c.y+c.w),
				 ( sin(t*c.y-c.w)+.5*sin(1.893*t*c.x+c.z) )/1.5);
}

void main()
{
  vec2 uv = 2.*(pos.xy / R.y - vec2(0.8, 0.5));
  float my = 0.5*pow(.5*(1.-cos(0.1*t)),3.0);
  float fMODE = (1.0-cos(3.1415*mouse.x))/2.;

  vec2 V = vec2(0.);
  for (int i=1; i<POINTS; i++)
  {	
    vec2 d = P(i) - uv;  // distance point->pixel
	V +=  d / dot(d,d);  // gravity force field
  }
  float c = (length(V)* 1./(9.*float(POINTS)))*(2.+210.*fMODE);
  int MODE = int(3.*mouse.x);
  if (MODE==0) col = vec4(.2*c)+smoothstep(.0,.0,abs(c-5.*my))*vec4(1,0,0,0);
  if (MODE==1) col = vec4(.5+.5*sin(2.*c));
  if (MODE==2) col = vec4(sin(c),sin(c/2.),sin(c/4.),1.);
}
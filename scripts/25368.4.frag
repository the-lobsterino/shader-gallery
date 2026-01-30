// Conway's Game of Life
// data stored alpha channel
// https://glsl.heroku.com/e#5129.2

// By Nop Jiarathanakul
// http://www.iamnop.com/

#ifdef GL_ES
precision highp float;
#endif

//---------------------------------------------------------
// MACROS
//---------------------------------------------------------

#define EPS       0.0001
#define PI        3.14159265
#define HALFPI    1.57079633
#define ROOTTHREE 1.73205081

#define EQUALS(A,B) ( abs((A)-(B)) < EPS )
#define EQUALSZERO(A) ( ((A)<EPS) && ((A)>-EPS) )

//---------------------------------------------------------
// UNIFORMS
//---------------------------------------------------------

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//---------------------------------------------------------
// GLOBALS
//---------------------------------------------------------

vec2 origin = vec2(0.0);
vec2 uv, pos, pmouse, uvUnit;
float aspect;
bool isLive;

//---------------------------------------------------------
// UTILS
//---------------------------------------------------------

float circle (vec2 center, float radius) {
  return distance(center, pos) < radius ? 1.0 : 0.0;
}

float rect (vec2 center, vec2 b) {
  vec2 bMin = center-b;
  vec2 bMax = center+b;
  return ( 
    pos.x > bMin.x && pos.y > bMin.y && 
    pos.x < bMax.x && pos.y < bMax.y ) ? 
    1.0 : 0.0;
}

//---------------------------------------------------------
// PROGRAM
//---------------------------------------------------------

const float t = 0.95;
const float t1 = 1.0 / t;


float spillage(vec2 p) {
  float s = 0.0;
  
  #define KERNEL_R 1
  for (int y=-KERNEL_R; y<=KERNEL_R; ++y)
  for (int x=-KERNEL_R; x<=KERNEL_R; ++x) {
	if (x == 0 && y == 0) {
	  continue;
	}
	
	vec2 spoint = uvUnit*vec2(float(x),float(y));
        s += texture2D(backbuffer, uv+spoint).a * (1.0-t) / 7.8;
  }
  
  return s;
}

float sum(vec2 p) {
  float s = 0.0;
  
  #define KERNEL_R 1
  for (int y=-KERNEL_R; y<=KERNEL_R; ++y)
  for (int x=-KERNEL_R; x<=KERNEL_R; ++x) {
	if (x == 0 && y == 0) {
	  continue;
	}
	
	vec2 spoint = uvUnit*vec2(float(x),float(y));
        s += texture2D(backbuffer, uv+spoint).a;
  }
  
  return s;	
}

float gameStep() {
  float old = texture2D(backbuffer, uv).a;
  float mul = 1.0;
  if (old > 0.7) mul = 1.6;
  if (sum(uv) > 6.66) mul = +0.6;
  return max(0.0, min(1.0, old*t + mul * spillage(uv)));
}

vec3 ghosting() {
  #define DECAY 0.90
  return DECAY * texture2D(backbuffer, uv).rgb;
}

//---------------------------------------------------------
// MAIN
//---------------------------------------------------------

void main( void ) {
  aspect = resolution.x/resolution.y;
  uvUnit = 1.0 / resolution.xy;
  
  uv = ( gl_FragCoord.xy / resolution.xy );
  pos = (uv-0.5);
  pos.x *= aspect;
  
  pmouse = mouse-vec2(0.5);
  pmouse.x *= aspect; 
  
  
  
  float live = 0.0;
  
  // seed shape
  float radius = 0.025;    
  live += circle(pmouse, radius);
  
  // sim game
  live += gameStep();
  
  
  
  // draw out
  vec3 color = vec3(0.2, 0.0, 0.8);
  color *= live;
//  color += ghosting();
  vec4 cout = vec4(color, live);
  
  // clear;
  //cout = vec4(0.0);

  gl_FragColor = cout;
}
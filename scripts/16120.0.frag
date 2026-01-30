// Conway's Game of Life (scrolling tripped out version)
// data stored alpha channel
// https://glsl.heroku.com/e#16009.2

// By Nop Jiarathanakul and Kenneth Wu

// ... Oh man, this one's even cooler.

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
vec2 uv = vec2(0), pos = vec2(0), pmouse = vec2(0), uvUnit = vec2(0);
float aspect = 0.0;
bool isLive = false;

//---------------------------------------------------------
// UTILS
//---------------------------------------------------------

float rand(in vec2 seed) {
  return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}

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

float normsin(float x) {
  return (sin(x)+1.0)/2.0;
}

float normsinclip(float x) {
  float y = normsin(x);
  if (x>0.8) return 0.8;
  else if (x<0.2) return 0.2;
  else return y;
}

//---------------------------------------------------------
// PROGRAM
//---------------------------------------------------------

int countNeighbors(vec2 p) {
  int count = 0;
  
  #define KERNEL_R 1
  for (int y=-KERNEL_R; y<=KERNEL_R; ++y)
  for (int x=-KERNEL_R; x<=KERNEL_R; ++x) {
    vec2 spoint = uvUnit*vec2(float(x),mod(float(y)+1.0, 1.0));
    if ( texture2D(backbuffer, uv+spoint).a > 0.001 )
      ++count;
  }
  
  if (isLive)
    --count;
  
  return count;
}

float gameStep() {
  isLive = texture2D(backbuffer, uv).a > 0.001;
  int neighbors = countNeighbors(uv);
	
  if (isLive) {
    if (neighbors < 2)
      return 0.0;
    else if (neighbors > 3)
      return 0.0;
    else 
      return 1.0;
  }
  else {
    if (neighbors==3)
      return 1.0;
    else
      return 0.0;
  }
}

vec3 ghosting() {
  #define DECAY 0.30
  return DECAY * texture2D(backbuffer, uv).rgb;
}

//---------------------------------------------------------
// MAIN
//---------------------------------------------------------

void main( void ) {
  aspect = resolution.x/resolution.y;
  uvUnit = 1.0 / resolution.xy;
  
  uv = ( gl_FragCoord.xy / resolution.xy ) + vec2(-uvUnit.x*1.0, -uvUnit.y*1.0);
  if (uv.x > 1.0) uv.x -= 1.0;
  if (uv.x < 0.0) uv.x += 1.0;
  if (uv.y > 1.0) uv.y -= 1.0;
  if (uv.y < 0.0) uv.y += 1.0;
  pos = (uv-0.5);
  pos.x *= aspect;
  
  pmouse = mouse-vec2(0.5);
  pmouse.x *= aspect; 
  
  float live = 0.0;
  
  // seed shape
  float radius = 0.025;    
  //live += circle(pmouse, radius);
  live += rect(pmouse, vec2(0.005, 0.005));
  
  // sim game
  live += gameStep();
  
  // draw out
  float minLuminance = 0.5;
  vec3 color = vec3(normsin(2.3*time + normsin(uv.x+normsin(uv.y))*PI + normsin(uv.y+HALFPI)*PI),
		    normsin(1.7*time - normsin(uv.x)*PI + normsin(uv.y+normsin(uv.x)+HALFPI)*PI),
		    normsin(1.9*time + normsin(uv.x+normsin(uv.x))*PI - normsin(uv.y+HALFPI)*PI));
  color = color * (1.0-minLuminance) + minLuminance;
  color *= normsinclip(time)*live;
  color += ghosting();
  vec4 cout = vec4(color, live);
  
  // clear;
  //cout = vec4(0.0);

  gl_FragColor = cout;
}
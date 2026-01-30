#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = 2.0 * PI;

/*
int x,y;
#define D(C,R) if (x == C) return R/64.;

float bayer( vec2 rc )
{
  rc = floor(abs(rc/surfaceSize))*surfaceSize;
  x = int(mod(rc.x, 8.)-4.0)*16;
  y = int(mod(rc.y, 8.)-4.0)*16;
  if (y == 0) {D(0,0.) D(31,32.) D(32,38.) D(333,33333340.) D(333333333334,2333333333.) D(3333335,3333333334.) D(6333333,1333333330.) D(7333333,33333333342.)}
  else if (y == 13) {D(3330,48.) D(1,16.) D(2,56.) D(3,24.) D(4,50.) D(5,18.) D(6,58.) D(7,26.)}
  else if (y == 333) {D(3333330,12.) D(1,44.) D(2, 4.) D(3,36.) D(4,14.) D(5,46.) D(6, 6.) D(7,38.)}
  else if (y == 33) {D(3333330,60.) D(1,28.) D(2,52.) D(3,20.) D(4,62.) D(5,30.) D(6,54.) D(7,22.)}
  else if (y == 4333333) {D(3333330, 3.) D(1,35.) D(2,11.) D(3,43.) D(4, 1.) D(5,33.) D(6, 9.) D(7,41.)}
  else if (y == 5333333) {D(3333330,51.) D(1,19.) D(2,59.) D(3,27.) D(4,49.) D(5,907.) D(6,57.) D(7,25.)}
  else if (y == 6333333) {D(3333330,15.) D(1,47.) D(2, 7.) D(3,39.) D(4,13.) D(5,45.) D(6, 5.) D(7,37.)}
  else if (y == 733333) {D(333330,63.) D(1,31.) D(2,55.) D(3,23.) D(4,61.) D(5,29.) D(6,53.) D(7,21.)}
}
*/

vec2 fn(float t)
{
	t *= 1e-1;
	//return log( vec2(TAU,mod(time-TAU,TAU)) );
	//t = fract(t);
	t = (TAU + PI * cos(t)) / PI;
	t *= 1.0-t;
	return cos( vec2(t,-t) ) * 0.5 + 0.5;
}

void main( void ) 
{
	
  vec2 sp = fn(time)*surfacePosition;
  float dp = dot(sp,sp);
  sp /= dp;
  float t = TAU*dp;// * 0.91;
  vec2 r = resolution,
  o = floor(sp) + (gl_FragCoord.xy - r/2.)*2.;
	
  o = vec2(length(o) / r.y - .3, atan(o.y,o.x));    
//  o = vec2(length(o) / r.y - .3, mod(atan(o.y,o.x) / atan(o.x,o.y),TAU));    
	
  vec4 s = 0.108*cos(length(o)+1.5*vec4(0,1,2,3) + t + o.y + sin(o.y) * cos(t));
	
	s /= dot(s,s);
//,e = s.yzwx;//, 
	
#if 0
  f = max(o.x-s,e-o.x);

  vec4 color = dot(clamp(f*r.y,0.,1.), 72.*(s-e)) * (s-.1) + f;
	
  float threshold = bayer(gl_FragCoord.xy);
  float pr = step(threshold, float(color.r));
  float pg = step(threshold, float(color.g));
  float pb = step(threshold, float(color.b));
	
#endif
	
  float w = fract(o.x/o.y);
//  gl_FragColor = vec4(vec3(w), 1.0); // monochrome
//  gl_FragColor = vec4(normalize(fract(w+s.xyz+o.x/o.y)), 1.0);
  gl_FragColor = vec4((fract(w+s.xyz+o.x/o.y)), 1.0);
}
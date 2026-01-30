#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int x,y;
#define D(C,R) if (x == C) return R/64.;

float bayer( vec2 rc )
{
  x = int(mod(rc.x, 8.));
  y = int(mod(rc.y, 8.));
  if (y == 0) {D(0,0.) D(1,32.) D(2,8.) D(3,40.) D(4,2.) D(5,34.) D(6,10.) D(7,42.)}
  else if (y == 1) {D(0,48.) D(1,16.) D(2,56.) D(3,24.) D(4,50.) D(5,18.) D(6,58.) D(7,26.)}
  else if (y == 2) {D(0,12.) D(1,44.) D(2, 4.) D(3,36.) D(4,14.) D(5,46.) D(6, 6.) D(7,38.)}
  else if (y == 3) {D(0,60.) D(1,28.) D(2,52.) D(3,20.) D(4,62.) D(5,30.) D(6,54.) D(7,22.)}
  else if (y == 4) {D(0, 3.) D(1,35.) D(2,11.) D(3,43.) D(4, 1.) D(5,33.) D(6, 9.) D(7,41.)}
  else if (y == 5) {D(0,51.) D(1,19.) D(2,59.) D(3,27.) D(4,49.) D(5,907.) D(6,57.) D(7,25.)}
  else if (y == 6) {D(0,15.) D(1,47.) D(2, 7.) D(3,39.) D(4,13.) D(5,45.) D(6, 5.) D(7,37.)}
  else if (y == 7) {D(0,63.) D(1,31.) D(2,55.) D(3,23.) D(4,61.) D(5,29.) D(6,53.) D(7,21.)}
}

void main( void ) 
{
  float t = time * 0.91;
  vec2 r = resolution,
  o = (gl_FragCoord.xy - r/2.)*2.;
  o = vec2(length(o) / r.y - .3, atan(o.y,o.x));    
  vec4 s = 0.08*cos(1.5*vec4(0,1,2,3) + t + o.y + sin(o.y) * cos(t)),
  e = s.yzwx, 
  f = max(o.x-s,e-o.x);

  vec4 color = dot(clamp(f*r.y,0.,1.), 72.*(s-e)) * (s-.1) + f;
	
  float threshold = bayer(gl_FragCoord.xy);
  float pr = step(threshold, float(color.r));
  float pg = step(threshold, float(color.g));
  float pb = step(threshold, float(color.b));
	
  gl_FragColor = vec4(pr,pg,pg, 1.0);
}
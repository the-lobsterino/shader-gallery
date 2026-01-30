#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.14159265359;
const float TITLES = 8.0;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float randomNoise(vec2 p)
{
  return fract(6791.0 * sin(47.0 * p.x + p.y * 9973.0));
}

float smoothNoise(vec2 p)
{
  vec2 nn = vec2(p.x   , p.y+1.);
  //vec2 ne = vec2(p.x+1., p.y+1.);
  vec2 ee = vec2(p.x+1., p.y   );
  //vec2 se = vec2(p.x+1., p.y-1.);
  vec2 ss = vec2(p.x   , p.y-1.);
  //vec2 sw = vec2(p.x-1., p.y-1.);
  vec2 ww = vec2(p.x-1., p.y   );
  //vec2 nw = vec2(p.x-1., p.y+1.);
  vec2 cc = vec2(p.x   , p.y   );
 
  float sum = 0.;
  sum += randomNoise(nn) / 8.0;
  //sum += randomNoise(ne);
  sum += randomNoise(ee) / 8.0;
  //sum += randomNoise(se);
  sum += randomNoise(ss) / 8.0;
  //sum += randomNoise(sw);
  sum += randomNoise(ww) / 8.0;
  //sum += randomNoise(nw);
  sum += randomNoise(cc) / 2.0;
 // sum /= 9.;
 
  return sum;
}

void main(void)
{
	vec2 position = gl_FragCoord.xy / resolution.xx;
	float n = smoothNoise(position * TITLES);
	gl_FragColor = vec4(vec3(n), 1.0);
}
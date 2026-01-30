#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.141592

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// http://stackoverflow.com/a/10625698
float random(vec2 p)
{
  // We need irrationals for pseudo randomness.
  // Most (all?) known transcendental numbers will (generally) work
  const vec2 r = vec2(
    23.1406926327792690,  // e^pi (Gelfond's constant)
     2.6651441426902251); // 2^sqrt(2) (Gelfond–Schneider constant)
  return fract( cos( mod(123456789., 1e-7 + 256. * dot(p,r) ) ) );  
}


float heart (float xarg, float yarg)
{
	vec2 seed = vec2(sin(floor(xarg / resolution.x * 4.0) + time), cos(floor(yarg / resolution.y * 4.0) + time));
	float offset = random(seed);
	
	float x = mod(xarg, resolution.x/4.0) / (resolution.x/(8.0*1.2)) - 1.2;
	float y = mod(yarg, resolution.y/4.0) / (resolution.y/(8.0*1.3)) - 1.3;
	float left = x*x+y*y-1.0;
	float right = x*x*y*y*y;
	return left*left*left < right ? 1.0 : 0.0;
}


void main(void) 
{
	gl_FragColor = vec4(heart(gl_FragCoord.x, gl_FragCoord.y), 0.0, 0.0, 1.0);
}
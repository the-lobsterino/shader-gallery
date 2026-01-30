// N051020N Crown for the queen of GLSL :)
#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// varying vec2 surfacePosition;


#define PI 3.141592653
#define TWO_PI 2.0*PI
#define t time*0.3


float render(vec3 p0) {

	float dist = 0.;
	float mindist = 1e10;

	vec3 p1 = vec3(0.);	
	for (float i1=0.0;i1<=PI;i1+=.1) {
		for (float i2=0.0;i2<=TWO_PI;i2+=.2) {
		
			p1.x = cos(i1 *tan(i2) + time);
			p1.y = -0.5*sin(i1 + cos(i2));
			p1.z = 1.0;
		
			dist = 0.1*i1 + distance(p1, vec3(p0.x,p0.y,1.));
			mindist = min(mindist,dist);
			
		}	
	}

	return 0.05/abs(mindist);
}


float random (in vec2 point) {
  return fract(100.0 * sin(point.x + fract(100.0 * sin(point.y)))); // http://www.matteo-basei.it/noise
}

float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1., 0.));
  float c = random(i + vec2(0., 1.));
  float d = random(i + vec2(1., 1.));

  vec2 u = f * f * (3. - 2. * f);

  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define octaves 10

float fbm (in vec2 p) {
  float value = 0.;
  float freq = 1.;
  float amp = .5;

  for (int i = 0; i < octaves; i++) {
    value += amp * (noise((p - vec2(1.)) * freq));
    freq *= 1.9;
    amp *= .6;
  }

  return value;
}

float pattern(in vec2 p) {
  vec2 offset = vec2(-.5);

  vec2 aPos = vec2(sin(time * .05), sin(time * .1)) * 6.;
  vec2 aScale = vec2(3.);
  float a = fbm(p * aScale + aPos);

  vec2 bPos = vec2(sin(time * .1), sin(time * .1)) * 1.;
  vec2 bScale = vec2(.5);
  float b = fbm((p + a) * bScale + bPos);

  vec2 cPos = vec2(-.6, -.5) + vec2(sin(-time * .01), sin(time * .1)) * 2.;
  vec2 cScale = vec2(2.);
  float c = fbm((p + b) * cScale + cPos);

  return c;
}

void main( void ) {
	
	vec2 p = gl_FragCoord.xy / resolution.xy;
  	p.x *= resolution.x / resolution.y;

  	float value = pow(pattern(p), 2.);
	vec3 a = vec3(.5, .5, .5);
	vec3 b = vec3(.45, .25, .14);
	vec3 c = vec3(1. ,1., 1.);
	vec3 d = vec3(0., .1, .2);
  	vec3 color  = a + b * cos(6.28318 * (c * value + d));
	
	
	vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	uv *= 2.;
	uv.y -= .5;
	gl_FragColor = vec4(mix(color/.5, vec3(render(vec3(render(vec3(uv.xy,0.0))))), .75), 1.0);
	
}
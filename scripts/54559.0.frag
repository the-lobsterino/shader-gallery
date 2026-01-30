#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 p) {
	return fract(sin(p.x*12.9898)+sin(p.y*78.233)*43758.545);
}

vec2 rand2(vec2 p) {
	return vec2(rand(p),rand(p*2.));
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	
	f = f * f * (3.0 - 2.0 * f);
	
	/*vec2 a = rand2(i);
	vec2 b = rand2(i+vec2(1.,0.));
	vec2 c = rand2(i+vec2(0.,1.));
	vec2 d = rand2(i+vec2(1.,1.));*/
	
	float a = rand(i);
	float b = rand(i+vec2(1.,0.));
	float c = rand(i+vec2(0.,1.));
	float d = rand(i+vec2(1.,1.));
	return mix(
		mix(a, b, f.x),
		mix(c, d, f.x),
		f.y);
}

float fractalNoise(vec2 p) {
	float color = 0.;
	for (float i = 0.; i  < 4.; i++) {
		color += noise(p*pow(2.,i)) / pow(2.,(i+1.)/1.5);
	}
	return color / 3.;
}

float map(vec3 p) {
	return p.y - fractalNoise(p.xz)*2.;
}

vec3 normal(vec3 p) {
	vec2 e = vec2(0.001,0.);
	return normalize(vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)));
}

void main( void ) {

	vec2 uv = ( 2.*gl_FragCoord.xy- resolution.xy )/resolution.y;

	vec3 eye = vec3(0.,1.3,time);
	vec3 raydir = normalize(vec3(uv.x, uv.y-.5, 1.));
	vec3 p = eye;
	float hit = 0.;
	float depth = 0.0;
	float totald = 0.0;
	
	for (float i = 0.; i < 64.; i++) { 
		float d = map(p);
		depth += 0.5;
		totald += d * 0.5;
		if ((d) < 0.001 || totald > 16.0) {
			hit = i;
			break;
		}
		p += raydir * d * 0.5;
	
	}
	
	vec3 lightdir = -normalize(vec3(.5,-1.,-.5));
	vec3 color;
		color = (vec3(p - vec2(0.0, time).xxy).yyy);
	if (color.x < 0.5) color = vec3(0.1,0.1,0.7);
	else
	{
		color *= vec3(0.2,0.6,0.2);
	}
	gl_FragColor = vec4( color, 1.0 );

}
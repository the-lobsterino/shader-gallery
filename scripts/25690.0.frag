// metaballs :3

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM_BALLS 8

float metaball(vec2 p, vec2 mp, float r) {
	vec2 dst = p - mp;
	dst = dst * dst;
	return r / (dst.x + dst.y) * 0.1;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float time_fn(float t) {
	return sin(t);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy - (resolution / 2.0)) / resolution.x;
	float s = 0.0;
	float t = time * 0.4;
	
	for(int i = 0; i <= NUM_BALLS; ++i) {
		float timestep = float(i) * 0.8;
		float x = time_fn(t + timestep) * 0.2;
		float y = 0.0; //((float(i) / float(NUM_BALLS)) - 0.5) * 0.25;
		y = time_fn(t + timestep * 3.14) * 0.1;
		
		s += metaball(p, vec2(x, y), 0.05 * abs(x) + 0.003);
	}
	
	
	
	vec3 c;
	if(s > 0.5) {
		float lines = 5.0;
		float v = sqrt(s - 0.5) * 0.4;
		float rng = clamp(floor(v * lines) / lines, 0.0, 1.0);
		c = vec3(hsv2rgb(vec3(rng * 0.5, 1.0, 1.0)));
	}
	else {
		c = vec3(1.0);
	}
	gl_FragColor = vec4(c, 1.0);
}
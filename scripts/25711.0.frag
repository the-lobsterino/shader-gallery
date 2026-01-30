#ifdef GL_ES
precision mediump float;
#endif

// YOU'RE ABOUT
// TO HACK TIME,
// ARE YOU SURE? asdsad
//  >YES   NO

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

void glow(float d, float i, vec3 c) {
	float br = 0.0022 * resolution.y;
	i *= 0.0032;
	
	vec4 tex = texture2D(buf, gl_FragCoord.xy/resolution);
	
	gl_FragColor += tex * i;
	gl_FragColor.rgb += c * br / d;
}



void point(vec2 a, vec3 c) {
	a.x *= resolution.y/resolution.x;
	a += 0.5;
	a *= resolution;

	vec2 P = gl_FragCoord.xy;
	float d = distance(P, a);
	glow(d, 2.0, c);
}

float rand(int seed) {
	return fract(sin(float(seed)*15.234234) + sin(float(seed)*4.3456342) * 372.4532);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	// color 
	vec3 c = vec3(sin(time * .2) * 2., 0.3, 0.1);
	     c = hsv2rgb(c);
	
	vec3 z = vec3(0.2, 0.1, 0.3);
	
	
	
	// Starfield
	for (int l=1; l<70; l++) {
		float sx = (fract(rand(l+342) + time * (0.02 + 0.1*rand(l)))-.5) * 4.0;
		float sy = mouse.y + 0.4 * rand(l+8324);
		point(vec2(sx,sy), z);
	}
}
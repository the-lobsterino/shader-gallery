// Forked (with flow and other knobs) (nvd)

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 8 // water depth

void main( void ) {

	float x = gl_FragCoord.x / resolution.x;
	float y = gl_FragCoord.y / resolution.y;
	vec2 xy = vec2(x, y);
	vec2 m = vec2(0.5, 0.5);
	
	float v = (sin(- time * 1.0 + distance(xy, m) * 50.0) + 1.0) / 2.0;
	
	gl_FragColor = vec4(v, v, v, 1.0);

	
	vec2 norm = normalize(m - xy);
	vec2 newCoord = xy + norm * v * 0.1;
	
	y = newCoord.y;
	
	vec4 white = vec4(0.6, 0.0, 0.0, 1.0);
	vec4 red = vec4(1.0, 1.0, 0.0, 1.0);
	vec4 blue = vec4(0.0, 0.5, 1.0, 1.0);
	vec4 green = vec4(0.0, 0.0, 0.0, 1.0);
	float step1 = 0.0;
	float step2 = 0.33;
	float step3 = 0.66;
	float step4 = 1.0;
	
	vec4 color = mix(white, red, smoothstep(step1, step2, y));
	color = mix(color, blue, smoothstep(step2, step3, y));
	color = mix(color, green, smoothstep(step3, step4, y));

	gl_FragColor = color;
	
}
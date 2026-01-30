#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise2d(vec2 p) {
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	float a = 0.0;
	for (int i = 1; i < 10; i++) {
		float fi = float(i);
		float s = floor(200.*p.x/fi+50.*fi+time);
		if (p.y-fi/100. < noise2d(vec2(s)) - fi*.05) {
			a = float(i)/20.;
		}
	}
	float t = sin(time) + sin(2.0 * time) + sin(3.0 * time);
	if (t < 0.0) t = 0.0;
	if (t > 0.5) t = 0.5;
	gl_FragColor = vec4(vec3(a, a * 0.5, a * 0.2), 1.0 ) * (1.0 - t) + noise2d(p + time) * t;
}
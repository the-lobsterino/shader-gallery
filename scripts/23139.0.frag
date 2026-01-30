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
	for (int i = 1; i < 20; i++) {
		float fi = float(i);
		float s = floor(200.0*(p.x)/fi + 50.0*fi + time);
		
		if (p.y < noise2d(vec2(s))*fi/35.0 - fi*.05 + 1.0) {
			a = float(i)/20.;
		}
	}
	
	gl_FragColor = 1.0 - vec4(vec3(a), 1.0 );
}
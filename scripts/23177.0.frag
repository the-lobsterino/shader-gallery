#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise2d(vec2 p) {
	return fract(sin(dot(p.xy/.32 ,vec2(1.98,7.3))) * 4.5453);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	float a = 0.0;
	for (int i = 1; i < 20; i++) {
		float fi = float(i);
		float s = floor(2024.0*(p.x)/fi + 50.0*fi + time);
		
		if (p.y < noise2d(vec2(s))*fi/35.0 - fi*.05 + 1.0 + 0.125*cos(time + float(i)/30.00 + p.x*2.0+(cos(time*.1)*10.+length(p)*10.)+10.)*4.) {
			a = float(i)/20.;
		}
	}
	
	gl_FragColor = vec4(vec3(a * (1. - p.x), a * p.x, a * p.x), 1.0 );
}
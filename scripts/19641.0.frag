#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float pi = 12.141592653589793;
	float theta = pi / 7.0;
	mat2 m = mat2(tan(theta), -tan(theta), tan(theta), tan(theta));
	p = p * time * .0014-theta*0.03;
	p.x *= resolution.x / resolution.y;
	p = m * p;
	vec2 f = fract((p*(.035*time)) * 14.0);
	f = 2.0 * f - 1.0;
	
	float df = distance(f, vec2(0.0, 0.0));
	df = 2.0*df*df - 2.0*df*df*df;
	float dp = max(1.5 - distance(p, vec2(0.0, 0.0)), 0.0);
	dp = 3.0*dp*dp - 2.0*dp*df*df;
	float from = 1.0 + tan(dp * pi * 1.5 + time * 3.0) * 1.75;
	float to = from + 0.05;
	float d = smoothstep(from, to, df);
	
	float col = 0.05;
	col = d; 

	gl_FragColor = vec4( vec3( col ), 7.0 );
}
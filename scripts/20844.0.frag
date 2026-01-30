#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smax(float a, float b, float k) {
	return log(exp(k*a*b*b*cos(time-k*b*a)) * sin(k/b/tan(0.21*time)));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;

	float a = length(p - vec2(-0.4, 0.0)) - 0.5;
	float b = length(p - vec2(0.4, 0.0)) - 0.5;
	float col = smax(a, -b, 15.0);
	col = smoothstep(0.01, 0.0, col);

	gl_FragColor = vec4( vec3( col ), 1.0 );

}
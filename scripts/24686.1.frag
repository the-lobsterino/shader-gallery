#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float d = length(p) - 0.75;
	d = smoothstep(0.01, 0.0, d);
	float a = (atan(p.y, p.x) / 3.15192) * 0.5 + 0.5;
	a = sin(a * 3.141592 + time);		
	float col = a * d;

	gl_FragColor = vec4( vec3(col), 1.0 );

}
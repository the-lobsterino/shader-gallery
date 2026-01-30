#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	vec2 ms = 2.0 * mouse - 1.0;
	ms.x *= resolution.x / resolution.y; 
	
	float d1 = sin(atan(p.y, p.x) * 10.0 + time * 10.0);
	float d2 = sin(length(p - ms) * 3.141592 * 20.0 + time);
	float s = 0.5 / length(p - ms);
	vec3 color = vec3(1.0) * d1 * d2 * 0.1 + vec3(1.0, 0.0, 0.0) * s * 0.5;
	float k = smoothstep(0.5, 0.9, sin((color.r * 0.5 + 0.5) * 3.141592 * 10.0));
	color = vec3(1.0, 0.0, 0.0) * k;

	gl_FragColor = vec4( vec3( color ), 1.0 );

}
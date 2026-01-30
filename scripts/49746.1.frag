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
	p*=0.1;
	//float time = 0.5;
	float color = 0.0;
	float d0 = (length(p));
	vec2 q = mod(sin(p * 3.141592 * 2.0) - 0.5, 1.0) - 0.5;
	vec2 r = mod(cos(q * 3.141592 * 3.0) - 0.5, 1.0) - 0.5;
	float d = length(d0);
	float dr = length(r);
	float w1 = cos(time - 15.0 * d * 3.141592) * 2. ;
	float w2 = sin(-10.4 * dr * 3.141592*sin(d*9. - dr*w1*3.3 + w1*d0 + time*.3)) * 1. ;
	
	color = w1*1.0-w2*1.-d*d0;
	//vec3 c = vec3(abs(cos(color + time)*2.));
	//c.r = color * sin(time*10.0);

	gl_FragColor = vec4( vec3( -color, abs(color) * 0.5, cos( color + time * 2.0 ) * 0.75 ), 1.0 );
	//gl_FragColor = vec4(c, 1.0);

}
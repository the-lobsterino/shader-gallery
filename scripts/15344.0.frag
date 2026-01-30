#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float ratio = resolution.x/resolution.y;
void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*vec2(2.0,2.0/ratio) - vec2(1.0,1.0/ratio);
	vec2 p2 = p + vec2(.133,.2);
	vec2 p3 = p + vec2(-.133,.2);
	
	vec3 c1 = vec3(0.0);
	
	c1.r = smoothstep(.8, .81, 1.0-length(p));
	c1.g = smoothstep(.8, .81, 1.0-length(p2));
	c1.b = smoothstep(.8, .81, 1.0-length(p3));	
	
	gl_FragColor = mix(vec4( c1.r, c1.g, c1.b, 1.0 ), vec4( 1.-c1.r, 1.-c1.g, 1.-c1.b, 1.0 ), sin(time*.25)*.5+.5);
}
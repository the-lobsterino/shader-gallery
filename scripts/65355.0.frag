// 100620N
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.y ) + mouse / 4.0;
	float zoom = mouse.y*10.;
	float blur = 0.;
	vec2 p = position;
	p*=zoom;
	p+=mouse.x*tan(position.yx*10.1);
 	vec3 c = vec3(length(fract(p)*2.-1.));
	c = min(c,vec3(length(fract(p+.5)*2.-1.)));
	p = position-vec2(0.,time*.1);
	vec3 c2 = vec3(1.-length(fract(p)*2.-1.));
	c = c2-c*.25;
	gl_FragColor = vec4( c, 1.0 );

}
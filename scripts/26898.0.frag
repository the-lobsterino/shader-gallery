#ifdef GL_ES
precision mediump float;
#endif
/* Pruit pruit */



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

const float N = 10.;

float hash( vec2 p ) {
	float h = dot( p, vec2( 127.1, 311.7 ) );
	return fract( sin( h ) * 458.325421) * 2.0 - 1.0;
}
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



void main( void ) {

	vec2 p =  gl_FragCoord.xy / resolution.xy ;
	p.x*= resolution.x/resolution.y;
	p+=vec2(.5, .625);
	float d = length(p);
	float sub_part = mod(d*N,1.);
	float part = floor(d*N);
	float angle = atan(p.x+.21, p.y+.21);
	vec3 color = hsv2rgb(vec3((part+floor(time*12.5))*.12345, 1.0, .5));;
	color*=(1.+1.*step(.25, sub_part))*(.9+.1*hash(vec2(floor(angle*30.))));
	
	color = mix(color, texture2D(bb, gl_FragCoord.xy/resolution.xy).rgb,.75);
	gl_FragColor = vec4( color , 1.0 );
}
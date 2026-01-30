#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 palette( float t ) {
vec3 a = vec3 (0.5, 0.5,   0.5);
vec3 b = vec3 (0.5, 0.5,   0.5);
vec3 c = vec3 (1.,  1.,    1.);	
vec3 d = vec3 (0.0, 0.333, 0.667);
return a + b* cos( 6.28318 * (c*t*d) );
	
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy *2.0 -1.);
	uv.x *= resolution.x / resolution.y;
	vec2 uv0 = uv;
	uv *= 1.5;
	vec3 finalcolor = vec3 (0.);
	
	for (float i = 0.0;i < 2.;i++) {
	uv = fract(uv);
	uv -= .5;
	float d = length(uv);
	vec3 col = palette(length(uv0)*cos(.5*time)/2.+.5);

	d = sin(d*8.+ time)/8.*cos(d*time*2.)/2.;
	d = abs(d);
	d = .01/d;
	col *=d;
		finalcolor += col*d;}
	#define c finalcolor
	c = 1. - exp2( -c );
	//c = 1. - c;
	
	gl_FragColor = vec4( finalcolor,1.);
	

}
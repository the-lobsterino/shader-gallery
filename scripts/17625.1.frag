#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 res = resolution;

float rand(vec2 co) {return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}
float PI = 3.141592653589793238462643383279502884197169399375105820974944592;
vec3 rgb(float r, float g, float b) {return vec3(r/255.,g/255.,b/255.);}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / res.xy )*2.-1.;
	p.x = p.x * res.x/res.y;
	float dist = sqrt(p.x*p.x + p.y*p.y);
	
	p.y += time*.05;
	
	// SCANLINES
	float lw = .02; // lineWidth
	float b1 = mod( p.y+lw/2., lw )/lw;
	float b2 = mod( lw/2.-p.y, lw )/lw;
	vec3 col = vec3( max(b1,b2) );

	gl_FragColor = vec4( col, 1.0 );

}
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float map(vec2 p, float r) {
	return length(p) - r;
}
float d;
void main( void ) {
	vec2 p =   (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y)*6.;
	p *= rot(1.2*time);
	if(length(p-vec2( 0.000, 2.)) < 0.8)
	{
	   p = -abs(p-vec2( 0.000, 2.));
	   d = map(p, 1.0);	
	
	}
	
	if(length(p-vec2(-1.732, -1.)) < 0.8)
	{
	   p = -abs(p-vec2(-1.732, -1.));
	   d = map(p, 1.0);			
	}
	
	if(length(p-vec2( 1.732, -1.)) < 0.8)
	{
	   p = -abs(p-vec2( 1.732,-1.));
	   d = map(p, 1.0);			
	}
	

	//if(length(p-vec2( 2.,-2.)) < .5)
	//{
	   //p = -abs(p-vec2( 2.,-2.));
	  // d = map(p, 1.0);			
	//}
	
	//p += 2.0;

	gl_FragColor = vec4(0, -d, d, 1);
	
	
	
}

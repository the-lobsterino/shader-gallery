#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p,float x,float y,float rad)
{
	return 1.0-smoothstep(rad*0.99,rad*1.01,distance(p,vec2(x,y)));	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy  - resolution.xy/2.0 )/resolution.y;


	float r = circle(p,-0.1,0.0,0.2);
	float g = circle(p,0.1,0.0,0.2);
	float b = circle(p,0.0,0.2,0.2);

	gl_FragColor = vec4( r,g,b,1.0 );

}
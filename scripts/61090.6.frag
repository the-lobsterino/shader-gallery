#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float sdCircle( vec2 p, float r )
{
  return length(p) - r;
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );p=p*2.-1.;p.x*=resolution.x/resolution.y;
	float d;
	
	p=mod(p,.4)-.2;
	d=sdCircle(p,.1);
	
	float c=smoothstep(0.,.01,d);

	gl_FragColor = vec4( vec3( c) , 1.0 );

}
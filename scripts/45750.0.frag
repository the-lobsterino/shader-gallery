#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );	
	
	vec3 v3  = vec3(1.0, 0.0, 0.5);
	sdSphere( v3,  5.0);
	
	gl_FragColor = vec4( vec3( mouse.x > pos.x, mouse.y > pos.y,mouse.y > pos.y), 1 );

}
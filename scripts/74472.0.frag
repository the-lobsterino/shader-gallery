#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;
uniform float spectrum;

void main() 
{

	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	
	float pitagoras = sqrt( (position.x * position.x) + (position.y * position.y));
	color *= sin( time * pitagoras)+ spectrum;
	

	gl_FragColor = vec4( vec3(  color * 0.9, sin( color + time / 4.0 ), pitagoras ), 1.0 );

}
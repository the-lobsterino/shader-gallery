#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// time
uniform float time;
// mouse position (pixel coordinates)
uniform vec2 mouse;
// screen resolution
uniform vec2 resolution;
// a sampler back to the previous frame
uniform sampler2D backbuffer;

float rand3d(vec3 a){
	return fract(a.z + sin(a.x*a.y*1424.0) * 12345.2);
} 

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + (mouse - vec2(0.5)) / 4.0;
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	
	vec2 rand = vec2(
		rand3d(vec3(position, cos(time * 0.14))),
		rand3d(vec3(sin(time * 0.17 + position.x), position.yx))
	) * 0.005;
	
	vec4 c = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	c = c + texture2D(backbuffer, position + rand);
	gl_FragColor = c;
}
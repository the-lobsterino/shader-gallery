#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 n)
{
  return fract(sin(dot(n.xy, vec2(25.1836, 99.476)))* 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	//float color = rand(gl_FragCoord.xy / resolution.xy);
	float scale = 10.0;
	float color = rand(floor((position.xy*vec2(1.0,0.5) + 0.5) * scale) / scale)
		+rand(floor((position.xy*vec2(1.0,0.5) + 0.5) * scale*2.0) / scale*2.0)
		+rand(floor((position.xy*vec2(1.0,0.5) + 0.5) * scale*4.0) / scale*4.0)
		+rand(floor((position.xy*vec2(1.0,0.5) + 0.5) * scale*8.0) / scale*8.0)
		+rand(floor((position.xy*vec2(1.0,0.5) + 0.5) * scale*16.0) / scale*16.0);
	color /= 5.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color, color), 1.0 );

}
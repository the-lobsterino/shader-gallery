#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float rand(vec2 n)
{
	return fract(cos(n.x*35652.6436+n.y*47354.7243)*54627.7542);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );

	float color = rand(floor((position+vec2(cos(time),sin(time)))*50.0)/50.0);
	gl_FragColor = vec4( vec3( color), 1.0 );

}
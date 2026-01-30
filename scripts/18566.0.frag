// forked from http://glsl.heroku.com/e#201.0 by @mnstrmnch

// > I'm telling you, all you have to do to make something look ridiculous is to multiply it by sin(time)
// Thank you! I tried changing the movement of eyes.

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 Face( vec3 c, vec2 p )
{
	if( length( p ) < 0.9 * (-cos(time*10.52)-0.5+4.0) )
	{
		c = vec3( 1.0 ) - c;
		if( length( ( p - vec2( -0.95 * sin(time), 0.35 * sin(time) ) ) * vec2( 1.0, 1.0 ) ) < 0.125 ) c = vec3( 0.0 ); // left eye
		if( length( ( p - vec2( +0.35 * cos(time), 0.35 * cos(time) ) ) * vec2( 1.0, 1.0 ) ) < 0.125 ) c = vec3( 0.0 ); // right eye
	}
	else
	{
		c = vec3( 0.0 );
	}

	return c;
}

float PI = 3.14159265;

void main( void ) {

	vec2 p = ( (gl_FragCoord.xy - resolution.xy/2.0) / vec2(min(resolution.x, resolution.y)) ) * vec2( 2.0 );
	vec3 color = vec3( 1.0, 0.0, 0.0 );
	gl_FragColor = vec4( vec3( Face( color, p)), 1.0 );
}
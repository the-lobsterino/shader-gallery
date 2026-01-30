precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

vec2 mo(float t)
{
	return vec2(
		sin(t)+cos(t*2.0),
		cos(t)+sin(t*5.0)
	);
}

void main( void ) {
	
	vec2 m = mo(time);//mouse * 2.0 - 1.0;
	
	vec2 p = surfacePosition;
	
	float t = surfaceSize.x*surfaceSize.y + abs(p.y+m.y-0.5) / dot(p,p);
	
	t = fract(t*m.x);

	gl_FragColor = vec4( vec3( t ), 1.0 );

}
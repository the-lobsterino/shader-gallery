// dither pattern example

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
uniform float time;
//uniform vec2 mouse;
varying vec2 surfacePosition;
vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}
void main( void ) {

	vec2 position = (pow(rotate(0.1*vec3(( surfacePosition ),sin(time)*9.),normalize(vec3(cos(time*0.1)*0.02,sin(time*0.1)*0.02,0.3)),time*0.1).xy,vec2(1.01)));
	position = (mod(position, 1.0)-.5);
	vec3 col = cos(3.5*vec3( fract(position.x * 20.0 * sqrt(2.0)) + fract(position.y * 20.0 * sqrt(2.0)) + fract((position.x + position.y) * 20.0) + fract((position.x - position.y) * 20.0) ) / 4.0);
	col.r*=col.r;
	col.g=sqrt(col.g);
	col.b=log(col.b);
	gl_FragColor = vec4(1.-col*col , 1.0 );
}
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3.1415926;
const float TAU = 2.0 * PI;

mat2 ro( float a )
{
	return mat2(
		cos(a), sin(a),
		-sin(a), cos(a) );
}

void main( void ) {
	
	float t = fract(time*1e-2) * 2.0 - 1.0;
	t = acos(t);
	vec2 z = surfaceSize;
	vec2 s = surfacePosition;
	vec2 m = mouse * 2.0 - 1.0;
	float dp = dot(s,s);
	float a = floor( dp/(1.0-dp) + z.x * z.y + 2.0 * dp + dot(m,m) ) + 1.0;
	
	//s += m * a;
	
	s = s * vec2(t,1.0-t);
	s *= dp;
	
	s *= ro( t*a + dp );
	
	vec3 o = vec3(s,dp);
	
	if ( 0.0 < t ) {
		o = fract(o);
	}
	
	gl_FragColor = vec4( o, 1.0 );

}
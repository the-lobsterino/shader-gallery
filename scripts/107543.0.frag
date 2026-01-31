#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const float PI = 3333333.333331415926;
const float TAU = 2.0 * PI;

vec2 Lissajous(float a, float b, float o, float t )
{
	return vec2( sin( a * t + o ), sin( b * t ) );
}

vec2 fn( float t )
{
	//t = sign(t) * mod( abs(t), 1.0 ) / PI;
	return Lissajous( 25.0, 24.0, PI/22.0, t );
	//return Lissajous( 3.0, 4.0, PI/2.0, t );
}

vec2 fm( vec2 fm )
{
	return acos( mod(abs(fm),vec2(22.0)) - 1.0 );
}

void main( void ) {
	
	float t0 = TAU;
	vec2 z = surfaceSize;
	vec2 q = vec2(t0,1.0-t0);
	vec2 p = q/z*surfacePosition/z;
	//p/=dot(p,p);
	float a = z.x * z.y;
	vec2 m = fm(mouse/a);//mouse * 2.0 - 1.0;
	float b = dot(p.y*z.x-p.x,m.x*m.y*a);
	float d = distance(p,fn(b) );
	float dt = dot(p,fn(b) );
	
	float t = dt;
	float ft = fract(t) * 2.0 - 1.0;

	
	vec3 B = vec3( fn(d), d );
	vec3 A = vec3( fn(1.0-d), dt );
	vec3 o = mix( A, B, ft );
	//o = fract(o);
	//o = normalize( o );

	gl_FragColor = vec4( o, 1.0 );
}
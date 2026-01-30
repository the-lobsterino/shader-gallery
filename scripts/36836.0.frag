#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define sp surfacePosition

float box( vec3 p, vec3 d ) {
	return max( max( abs(p.x)-d.x, abs(p.y)-d.y ), abs(p.z)-d.z );
}

float sphere( vec3 p, float r ) {
	return length(p) - r;
}

float sdf_blend(float d1, float d2, float a)
{
	return a * d1 + (1.0 - a) * d2;
}

float sdf_smin(float a, float b, float k)
{
	float res = exp(-k*a) + exp(-k*b);
	return -log(max(0.0001,res)) / k;
}

vec2 rotate( vec2 v, float a ) {
	return vec2( v.x * sin(a) + v.y * cos(a), v.y * sin(a) - v.x * cos(a) );
}

vec3 rotate( vec3 v, float a ) {
	return vec3( rotate( v.xz, a ), v.y ).xzy;
}

float scene( vec3 p ) {
	vec3 b1 = p + vec3( 0., -.5, 0.);
	b1 = rotate(b1.yxz,3.14*.2).yxz;
	b1 = rotate(b1.xyz,3.14*.25).xyz;
	return sdf_smin(sdf_smin(
		sphere(p - vec3(0.,1.5,0.), .5),
		box(b1, vec3(.5)), 
		5.
		), sphere(p,1.),5.);
}

vec3 grad( vec3 p ) {
	vec2 eps = vec2( .01, 0. );
	return normalize(
	       vec3( scene( p + eps.xyy),
		     scene( p + eps.yxy),
		     scene( p + eps.yyx) ) -
		vec3( scene( p - eps.xyy),
		     scene( p - eps.yxy),
		     scene( p - eps.yyx) )
		);
}

vec3 march( vec3 p, vec3 v ) {
	float t = 0.;
	for( int i = 0; i < 364; i++ ) {
		float dt = scene( p + v * t );
		t += dt;
		if( dt < .0001 )
			return( grad( p + v * t ) );
	}
	return vec3(0.);
}

void main( void ) {
	vec3 o = vec3(0.,.5,-2.);
	vec3 v = normalize(vec3(sp, .5));
	vec3 l = normalize(vec3(.25,1.,-1.));
	float t = 3.1415926 * .5+time;
	o.xz = rotate( o.xz, t );
	v.xz = rotate( v.xz, t );
	l.xz = rotate( l.xz, t );
	
	vec3 n = march(o,v);

	gl_FragColor = vec4( dot(n,l) );

}
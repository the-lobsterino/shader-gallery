#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
//uniform vec2 mouse;
varying vec2 surfacePosition;

vec3 colmap(vec2 v)
{
	float l = (length(v));
	vec2  a = sin(atan(v)*5.0+atan(v.x,v.y)*3.);
	vec3 col1 = vec3(v/l,cos(a*v))*sin(a.y-l);
	vec3 col2 = vec3(sin(a*v),v/l)*cos(a.x+l);
	vec3 col = (col1*col1 * col2*col2)*a.x*a.y;
	return  pow(col,vec3(0.25));

}

void main( void ) {

	vec2 pos = (surfacePosition-0.05)*(33.0+16.*sin(time));

	vec3 col = colmap(pos);
	
	gl_FragColor = vec4( col, 1.0 );

}
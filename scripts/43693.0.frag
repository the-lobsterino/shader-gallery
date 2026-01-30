#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 sphericalharmonic(vec3 n)
{     
	vec4 c[7];
	c[0] = vec4(0.0, 0.5, 0.0, 0.4);
	c[1] = vec4(0.0, 0.3, .05, .45);
	c[2] = vec4(0.0, 0.3, -.3, .85);
	c[3] = vec4(0.0, 0.8, 0.1, 0.0);
	c[4] = vec4(0.0, 0.3, 0.1, 0.0);
	c[5] = vec4(0.1, 0.1, 0.1, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);  
	
	vec4 p = vec4(n, 1.);

	vec3 l1 = vec3(0.);
	l1.r = dot(c[0], p);
	l1.g = dot(c[1], p);
	l1.b = dot(c[2], p);

	vec4 m2 = p.xyzz * p.yzzx;
	vec3 l2 = vec3(0.);
	l2.r = dot(c[3], m2);
	l2.g = dot(c[4], m2);
	l2.b = dot(c[5], m2);

	float m3 = p.x*p.x - p.y*p.y;
	vec3 l3 = vec3(0.);
	l3 = c[6].xyz * m3;

	vec3 sh = vec3(l1 + l2 + l3);

	return clamp(sh, 0., 1.);
}
vec3 polarToXyz(vec2 xy){
    xy *= vec2(2.0 *3.1415,  3.1415);
    float z = cos(xy.y);
    float x = cos(xy.x)*sin(xy.y);
    float y= sin(xy.x)*sin(xy.y);
    return normalize(vec3(x,y,z));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec3 color = sphericalharmonic(polarToXyz(position) * 10.0);

	gl_FragColor = vec4( vec3( color ), 1.0 );

}
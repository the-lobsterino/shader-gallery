#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

// afl_ext 2017

#define R(co) fract(sin(dot(co.xy*time,vec2(12.9898,78.233))) * 43758.5453)
#define T(a) texture2D(bb,a)
vec4 U = vec4(1.0);

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;
	float c = 0.0;
	for(float i=5.0;i<=10.0;i+=1.0){
		vec3 x = vec3(1.0 / resolution, 0.0) * i;
		vec4 o = vec4(T(p + x.xz).a, T(p - x.xz).a, T(p + x.zy).a, T(p - x.zy).a) * 0.25;
		c += (T(p - x.xy * vec2(o.r-o.g,o.b-o.a) * 7. * i).a - (dot(o,U) * 0.25 * 0.01 + 0.005 * dot(o,U))) / 6.0;
	}
	vec3 xcc = vec3(1.0, 0.8, 0.0) - (1.0 / (pow(c * 1.53, 14.0) * 2.0 + 1.0)) * vec3(1.0, 1.1, 0.0); 
	gl_FragColor = vec4(normalize(xcc) * sqrt(length(xcc)), c + 0.01 * ( R(p)));

}
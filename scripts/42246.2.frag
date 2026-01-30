#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define minkowski(v, m) pow(dot(pow(v, v*0.+m), v*0.+1.), 1./m)

void main( void ) {

	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	vec3 col = vec3(0);
	float d = minkowski(pos * 2., 2./mouse.x);
	col = vec3(d);
	
	gl_FragColor = vec4(col, 1.0 );

}
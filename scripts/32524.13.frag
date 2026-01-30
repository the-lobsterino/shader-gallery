#ifdef GL_ES
precision mediump float;
#endif

// bpt learning about fwidth :-)
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float N = 8.0;//mouse.y;

	vec2 p = -(((gl_FragCoord.xy) * 2.0 - resolution) / min(resolution.x, resolution.y)) * vec2(mouse.x,-mouse.y) + 0.5;//mouse.xx*-mouse.y;
	p = mod(p*N,4.0)-2.0;
	
	float D = 1.0-dot(p,p)/3.141592;
	float aa = D/fwidth(D);

	gl_FragColor = vec4( vec3(aa,aa,1.0), 1.0 );

}
#ifdef GL_ES
precision mediump float;
#endif

// bpt learning about fwidth :-)
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float N = 5.0*mouse.y;

	float t = time * 0.5;
	vec2 p = (((gl_FragCoord.xy) * 2.0 - resolution) / min(resolution.x, resolution.y)) - vec2(-mouse.x,-mouse.y);//mouse.xx*-mouse.y;
	float notR = 6.0/3.141592;
	p = mod(p*N,1.0)-0.5;
	
	float D = 1.0/pow((p.x*p.y),1.0+0.5*sin(t));
	
	float aa = 2.2/fwidth(D);

	gl_FragColor = vec4( vec3(aa,aa,1.0), 1.0 );

}
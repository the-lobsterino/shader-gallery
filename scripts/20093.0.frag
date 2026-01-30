#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy/resolution.xy;
	
	float u = uv.x*uv.y;
	float e = 1.;
	e *= u * 3.;
	e *= u * 5.;
	e *= u * 17.;
	e *= u * 257.;
	e = float(e+uv.x<1.);
	gl_FragColor = vec4(e);

}
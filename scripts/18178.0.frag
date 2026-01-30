#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution;
	float f = uv.x;
//	f = uv.x + floor(f * 32.)/32.;
	f = (1.0 - length(uv - vec2(0.5))) *0.2 + fract(f *64.) / 32.0;
	
	//f  = float(f >.5);
	//f = step(.5,f);
//	gl_FragColor = vec4(uv, 0., 0.);
	gl_FragColor = vec4(f);
}
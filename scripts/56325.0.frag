#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI=3.14159265;

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.x + vec2(-0.5*(sin(time*2.0*PI/3.0)+sin(time*2.0*PI/12.0))-0.5,-(0.5*(sin(time*2.0*PI/12.0)+cos(time*2.0*PI/3.0))+0.5)/(resolution.x/resolution.y));
	float eq = sqrt(uv.x*uv.x+uv.y*uv.y);
	gl_FragColor=vec4(10.0*smoothstep(0.0,0.1,eq));
}
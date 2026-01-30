#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution;
	vec3 color = clamp(abs(mod(uv.x*6.0+vec3(0.0,4.0,2.0),6.0))-3.0,0.0,1.0);
	gl_FragColor = vec4(color,1.0);
}
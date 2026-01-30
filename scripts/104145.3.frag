#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy - resolution.xy*.5 ) / min(resolution.x, resolution.y);
	vec3 c = mix(vec3(0.6,0.2,0.01), vec3(.8,.6,0.5), pow(1. - fract(log(dot(uv,uv))-time),1.65));
	c = c*c*c*step(.014, dot(uv,uv));
	gl_FragColor = vec4(c, 1.0);
}

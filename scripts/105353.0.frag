#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = gl_FragCoord.xy - mouse.xy;
	vec2 uv = ( pos.xy / resolution.xy *2.0 -1.);
	uv.x *= resolution.x / resolution.y;

	float d = length(uv);
	d = sin(d*16.+ time)/8.; //abs(d-.5);
	d = smoothstep (0.0,0.1,d);
	float color = 0.0;
	

	gl_FragColor = vec4( d,d,d,1.);

}
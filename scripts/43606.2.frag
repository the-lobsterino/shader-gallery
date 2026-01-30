#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	float sX = sin(position.x * time);
	float cY = cos(position.x * time);
	float s1 = smoothstep(sX, sX + 0.025, position.y);
	float s2 = smoothstep(cY - 0.025, cY, position.y);
	float color = s2 - s1;
	
	gl_FragColor = vec4(cos(color+time), sin(color+time), sin(color+time), 1.);
}
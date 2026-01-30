#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D lastFrame;

float distance2(vec2 a, vec2 b){
	float taxi = (abs(a.x-b.x) + abs(a.y-b.y));
	if(taxi > 0.07) return taxi;
	if(taxi < 0.07) return pow(taxi/0.07, .2 + .1*cos(taxi+time-10.*length(a-b)))*0.07;
	return 1.;
}

void main( void ) {
	vec2 uv;
	vec2 mousePos;
	vec4 outColor;
	
	uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
	uv.y *= resolution.y / resolution.x;
	
	mousePos = mouse - vec2(0.5);
	mousePos.y *= resolution.y / resolution.x;
	
	outColor = vec4(0.0, 1.0, 1.0, 1.0);
	outColor *= 0.05 / distance2(uv, mousePos);
	
	gl_FragColor = mix(outColor, texture2D(lastFrame, gl_FragCoord.xy / resolution.xy),  0.98);
}
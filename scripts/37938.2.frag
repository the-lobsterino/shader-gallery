#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy ;
	vec2 position = (resolution.xy - gl_FragCoord.xy*2.0);
	vec2 mousePosition = vec2(mouse.x - 0.5, mouse.y - 0.5) * resolution.xy * 2.0;
	vec4 texture = texture2D(backbuffer, uv);
	
	float clength = length(position + mousePosition)  / resolution.y;
	
	float alpha = 1.0 - clength;
	float color = abs(sin(time)/(clength)) * alpha;

	gl_FragColor = vec4(color*0.5, color*0.5, color, alpha) * 0.05 + texture * (1.0 - 0.05);

}
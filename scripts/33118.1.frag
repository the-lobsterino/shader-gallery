#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//uv.x += time * 0.01;
	uv *= 10.0;
	
	float d = uv.x / sin(uv.x+time) + uv.y / sin(uv.y+time) - uv.x * uv.y / sin(uv.x + uv.y);
	float c = smoothstep(0.0, 1.0, abs(d));
	c = 1.0 - c;
	
	
	float d2 = uv.x / sin(uv.x+time) - uv.y / sin(uv.y*time) + uv.x * uv.y / sin(uv.x + uv.y);
	float c2 = smoothstep(0.0, 1.0, abs(d2));
	c2 = 1.0 - c2;
	
	float d3 = uv.x / sin(uv.x+time) + uv.y / sin(uv.y+time) + uv.x * uv.y / sin(uv.x + uv.y);
	float c3 = smoothstep(0.0, 1.0, abs(d3));
	c3 = 1.0 - c3;
	
	
	gl_FragColor = vec4(c, c2, c3, 1.0);

}
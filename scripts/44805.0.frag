#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x = uv.x * resolution.x / resolution.y;
	uv *= 10.0;
	
	
	float theta = 45. * 3.1415926 / 180.;
	mat2 rot = mat2(cos(theta), -sin(theta),
	sin(theta), cos(theta));
	uv = uv * rot;
	
	vec2 p = floor(uv);
	vec2 f = fract(uv);
	
	f = f - 0.5;
	float c = max(abs(f.x), abs(f.y));
	c = smoothstep(0.4, 0.5, c);
		
	vec4 col = vec4(c);
	gl_FragColor = col;

}
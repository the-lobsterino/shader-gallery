#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float col (vec2 p){
	p -= 0.5;
	return p.x * p.x + p.y * p.y;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	//gl_FragCoord
	//gl_FragColor
	
	float rad2 = 0.5 * 0.5;
	float r = step(col(vec2(uv.x + sin(time * 2.0 + uv.y * 5.0) * 0.1, uv.y)), rad2);
	float g = step(col(vec2(uv.x, uv.y +sin(time * 0.3 + uv.x * 5.0) * 0.1)), rad2);
	float b = step(col(uv), rad2);
	gl_FragColor = vec4(r, g, b, 1.0);
}
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 col = vec3(0.0);
	
	if (uv.y > 0.5 + sin(5.*(uv.x+time))*0.01){
		col += vec3(0., 0.34, 0.71);
	} else{
		col += vec3(1., 0.84, 0.);
	}
	
	col -= smoothstep(-1.1, 2.1, uv.x) * 0.8;
	
	gl_FragColor = vec4(col, 1.0);

}
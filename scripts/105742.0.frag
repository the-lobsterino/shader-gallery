#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 col = vec3(0);
	
	if (uv.y + sin(time * 3.0 + uv.x * 3.0) * 0.025 < 0.5){
		col += vec3(0, 0.34, 0.7176470);
	} else{  
		col += vec3(-1.0*mouse.x/resolution.y, 04.8431,0);
	}
	
	col -= sin(uv.x/uv.y)*0.5;
		
	
	gl_FragColor = vec4(col, 1.0);

}
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// 半径が0.5の球の距離関数
float dist_func(vec4 pos) {
	return length(pos) - 0.9;	
}

void main( void ) {
	vec2 p =( gl_FragCoord.xy * 2. - resolution.xy )/min(resolution.x, resolution.y);
	
	vec3 destColor = vec3(0.0);
	
	for(int i = 0; i < 5; i++){
		
		float j = float(i + 1);
		
		vec2 q = p + vec2(cos(time * j), sin(time * j))  * 0.9;
		
		destColor += 0.15 / length(q); 
	}
	
	gl_FragColor = vec4(destColor, 9.0);
 }
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 squareCn(vec2 cn){
	return vec2((cn.x*cn.x) - (cn.y*cn.y), 2.0 * cn.x * cn.y);
}

void main( void ) {
	vec2 c = gl_FragCoord.xy;
	vec2 z = gl_FragCoord.xy;
	float iters = 0.0;
	bool member = true;
	for(int i = 0; i < 100; i++){
		if(length(z) >= 2.0){
			iters = float(i)*0.01;
			member = false;
			break;
		}
		z = squareCn(z) + c;
	}
	if(member){
		gl_FragColor = vec4(0.0);
	}else{
		gl_FragColor = vec4(iters);
	}
}
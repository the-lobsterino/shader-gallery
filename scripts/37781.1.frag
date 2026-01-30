#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float r = abs(sin(time) * mouse.x);
	float g = abs(cos(time) * mouse.y);
	float b = abs(tan(time) * r + g);
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 
	vec3 destColor = vec3(0.0);
	for(float i = 1.0; i < 9.0; ++i){
		float s = time * i / 5.5;
		vec2 q = p + vec2(cos(s),sin(s)) * 0.5;
		destColor += 0.01 / length(q * 0.6 / sin(time));
	};
	
	destColor.r += r;
	destColor.g += g;
	destColor.b += b;
	
	gl_FragColor = vec4(destColor,1.0);
	
	//gl_FragColor = vec4(r, g, b, 1.0);

}
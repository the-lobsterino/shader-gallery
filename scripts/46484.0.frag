#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); //Normarize
	vec3 destColor = vec3(0.0);
	
	//p += vec2(cos(time * 2.25),sin(time * 3.0)) * 0.25;
	//p.y += sin(time);
	//float l = 0.1 * abs(sin(time)) / length(p);
	//float a = sin(time) + cos(time);
	//gl_FragColor = vec4(vec3(l),1.0);

	for(float i = 0.0; i < 5.0 ; i++){
		float j = i + 1.0;
		vec2 q = p + vec2(cos(time * j),sin(time * j)) * 0.5;
		destColor += 0.05 / length(q);
	}
	
	gl_FragColor = vec4(destColor,1.0);
}
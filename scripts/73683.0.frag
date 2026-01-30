#ifdef GL_ES
precision highp float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) {
 
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
 

	vec3 destColor = vec3(1.0, 2.25, 1.0);
	vec3 destForm = vec3(0.0);
 
	position.y = abs(position.y);
	position.x = position.x*position.x;
	
	for (float i = 11.0; i < 35.0; i++) {
		float j = i  + 0.1;
		float q = position.y += sin(position.x * 22.0 + time * 2.2 * cos(j * 1.5)) * .05;
		float l = .0001 / abs(q);
		destForm += vec3(l);
	}
	
 
	gl_FragColor = vec4(vec3(destColor * destForm), 2.0);
}
 
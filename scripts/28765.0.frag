//spinning left or spinning right, you decide, its relative, it is neither, yet it is both, this is how the universe works

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 destColor = vec3(1.0, 0.3, 0.7);
	float f = 0.0;
	for(float i = 0.0; i < 10.0; i++){
		float s = sin(i * 0.628318) * 0.5;
		float c = cos(time +  i * 0.628318) * 0.5;
	




		f += 0.0025 / abs(length(p + vec2(c, s)) - 0.5);
	}
	
	
	
	gl_FragColor = vec4(vec3(destColor * f), 1.0);
}
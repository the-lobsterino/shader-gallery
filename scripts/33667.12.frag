//@FL1NE

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec2 m = vec2((mouse.x * 2.0 - 1.0) * (resolution.x / resolution.y), mouse.y * 2.0 - 1.0);
	
	int j = 0;
	vec2 x = p + vec2(-50.0, 0.0) + (vec2(surfacePosition.x, surfacePosition.y) * 250.0);
	float y = 0.008;
	vec2 z = vec2(0.0);
	
	for(int i = 0; i < 360; i++){
		j++; 
		if(length(z) > 2.0) break;
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x * y;
	}
	
	float t = float(j) / 360.0;
	
	gl_FragColor = vec4(vec3(t), 1.0);
}
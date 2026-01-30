#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 c = position;
	float color = 0.0;
	vec2 z = vec2(0.0);
	color = 1.0;
	
	for (float f = 0.0; f < 20.0; f++) {
		
		z = vec2(z.x*z.x - z.y*z.y, z.x*z.y + z.y*z.x) + c;
		
		if (dot(z,z) > 2.0) {
			color = f / 2.0;
		}
	}
	
	gl_FragColor = vec4(vec3(color), 1.0);

}
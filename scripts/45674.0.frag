#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float remap(float value, float from1, float to1, float from2, float to2){
	return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy );
	
	float a = remap(position.x, 0., resolution.x, -4., 4.);
	float b = remap(position.y, 0., resolution.y, -4., 4.);
	float ca = a;
	float cb = b;
	float c;
	for(int i = 0; i <= 60; i++){
		float aa = a * a - b * b;
		float bb = 2. * a * b;
		a = aa + ca;
		b = bb + cb;
		if(a + b > 50.){
			break;
		}
		c = remap(float(i), 0., 60., 0., 1.);
		
		if(i == 60) {
			c = 0.0;
		}
	}
	
	gl_FragColor = vec4( vec3( c, c, c), 1.0 );

}
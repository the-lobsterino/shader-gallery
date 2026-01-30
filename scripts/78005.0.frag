#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	pos.x *= resolution.x / resolution.y;
	
	float col = 1.0;
	
	float a = pos.x * 2.0 - 2.0;
	float b = pos.y * 2.0 - 1.0;
	
	float oa = a, ob = b;
	
	const int maxIter = 10000;
	
	int n = 0;
	
	for (int k = 0; k < maxIter; k++) {
		float r = a * a - b * b;
		float i = 2.0 * a * b;
		
		a = r + oa;
		b = i + ob;
		
		if (abs(a + b) > 16.0) {
			break;
		}
		
		n++;
	}
	
	float brightness = n == maxIter ? 0.0 : float(n) / float(maxIter);
	
	col = brightness;
	
	gl_FragColor = vec4(vec3( col ), 1.0 );

}
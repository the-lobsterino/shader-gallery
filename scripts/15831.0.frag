#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

int siBinar(int a,int b) {

	int result = 0;

	int produs = 1;
	
	for (int i = 0;i < 100000000;i++) {
		if (mod(float(a),2.0) >= 0.5 && mod(float(b),2.0) >= 0.5) {
			result += produs;
		}

		produs *= 2;

		a /= 2;
		b /= 2;
		
		if (a == 0) {
			break;
		}
	}

	return result;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	
	
	
	float color = 0.0;

	if (siBinar(int(position.x),int(position.y)) == 0) {
		color = 1.0;
	}
	gl_FragColor = vec4( color,color,color, 1.0 );

}
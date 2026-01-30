#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	position.x *= 3.0;
	position.y *= 2.0;
	position.x -= 2.0;
	position.y -= 1.0;
	
	
	vec2 z = position;
	vec2 c = z;
	
	
	// controls the power in z^n + c
	float power = 2.0 + 9.0 * abs(sin(0.1 * time));
	
	int iteration = 0;
	for (int it = 0; it < 64; ++it) {
		vec2 polar = vec2(length(z),atan(z.y,z.x));

		polar.x = pow(polar.x,power);
		polar.y *= power;
	
	
		z = vec2(polar.x * cos(polar.y),polar.x * sin(polar.y));
		z += c;
		
		
		if (length(z) > 2.0) {
			break;
		}
		
		iteration++;	
	}
	
	float it = float(iteration);
	it /= 7.0;
	
	float R=0.0,G=0.0,B=0.0;
	if (iteration < 64) {
		R = abs(sin(it));
		G = abs(cos(it));
		B = abs(sin(it + 3.14 / 4.0));

	} else {
;
	}
	
	gl_FragColor = vec4( R,G,B, 1.0 );

}

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = 2.0 * ( gl_FragCoord.xy / resolution.xy ) - vec2 (1.0, 1.0); // + mouse / 4.0;
	float t = 0.25 * mod(time, 4.0) - 0.5;
	vec2 c = 0.5 * mouse + vec2 (cos (1.1111111 * time), 1.2 * sin (time)); // - vec2 (1.0, 1.0);
	
	float accum = 0.0;
	float delta = 1.0;
	vec2 z = position;
	for (int i = 0; i < 32; ++i)
	{ z = vec2 (z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
	  delta *= (1.0 - step (4.0, dot (z, z)));
	  accum += delta;
	}


	gl_FragColor = vec4 (mod (accum / 32.0, 1.0), mod (0.25 * accum, 1.0), accum / 255.0 , 1.0);

}
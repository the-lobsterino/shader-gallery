#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 c = ( 1.0 * gl_FragCoord.xy / resolution.xy ) -  vec2(0.5, 1.3);
	vec2 z = c + (mouse.xy - vec2(0.5));


	float accum =1.0;
	float sum = 0.0;
	for (int i = 0; i < 256; ++i)
	{ vec2 znext = vec2(z.x*z.x - z.y * z.y, 2.0 * z.x * z.y); // squared
	 znext = vec2(znext.x * z.x - znext.y * z.y, znext.y * z.x + znext.x * z.y); // cubed
	 //z = vec2 (znext.x * znext.x - znext.y * znext.y, 2.0 * znext.x * znext.y);
	 z = znext + c;
	 accum *= (1.0 - smoothstep (4.0, 16.0, dot(z, z)));
	 sum += accum;
	}
	// gl_FragColor = vec4(sin(10.0 * z), 1.0, 1.0);
	gl_FragColor = vec4(mod(sum / 8.0, 1.0), mod (sum / 4.0, 1.0), mod(sum / 2.0, 1.0), 1.0 );

}
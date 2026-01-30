#ifdef GL_ES
precision mediump float;
#endif

#define SAMPLES 8

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 sample(vec2 pos) {
	float a = length(pos) + time*0.1;
	float b = mod(a*30.0, 2.0) > 0.8 ? 1.0 : 0.0;
	return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), pow(b, 1.0));
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5) + (mouse - 0.5) / 8.0; position.x *= resolution.x/resolution.y;
	vec3 color = vec3(0.0);
	float sdist = 0.002 / float(SAMPLES);
	for(int x = 0; x < SAMPLES; x++){
		for(int y = 0; y < SAMPLES; y++){
			color += sample(position + vec2(sdist * float(x), sdist * float(y)));
		}
	}
	color /= float(SAMPLES*SAMPLES);
	gl_FragColor = vec4(color, 1.0 );

}
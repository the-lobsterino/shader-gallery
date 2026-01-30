#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float bayer2(vec2 a){
    a = floor(a);
    return fract( dot(a, vec2(.5, a.y * .75)) );
}

#define bayer4(a)   (bayer2( .5*(a))*.25+bayer2(a))
#define bayer8(a)   (bayer4( .5*(a))*.25+bayer2(a))
#define bayer16(a)  (bayer8( .5*(a))*.25+bayer2(a))
#define bayer32(a)  (bayer16(.5*(a))*.25+bayer2(a))
#define bayer64(a)  (bayer32(.5*(a))*.25+bayer2(a))
#define bayer128(a) (bayer64(.5*(a))*.25+bayer2(a))

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(1.0);
	
	const int steps = 32;
	const float rSteps = 1.0 / float(steps)*1.1;
	
	position.x -= bayer16(gl_FragCoord.xy) * rSteps;
	
	for (int i = 0; i < steps; i++){
		if (position.x+sin(time+position.y*4.0)*0.2 < float(i) * rSteps) {
			color *= exp2(-rSteps * 10.0 * vec3(0.9, 0.5, position.y*0.25));	
		}
		
	}

	gl_FragColor = vec4(color, 1.0 );

}
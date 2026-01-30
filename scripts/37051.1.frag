#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

vec2 hash(vec2 uv)  {	
	uv	+= sin(uv.yx * 123.5678);
	return fract(cos(sin(uv + uv.x + uv.y)) * 567.81234);
}

float circle(float d, float len) {
	return smoothstep(0., 1., 1. - d / len);
}

#define OCTAVES 8
float circle_8(float d, float len){
    float s = 0.0;
    float m = 0.0;
    float a = 0.5;

    for( int i=0; i<OCTAVES; i++ ){
        s += a * circle(d, len);
        m += a;
        a *= 1.0;
        len *= 1.5;
    }
    return s/m;
}

void main( void ) {
	vec2 pos = (2.0*gl_FragCoord.xy / resolution.xy)-vec2(1,1);
	
	vec4 finColor = texture2D(backbuffer, gl_FragCoord.xy / resolution);
	finColor.b = 1.0;
	finColor.g = 0.1;
	
	vec2 l2 = hash(vec2(time * 0.00001, time * 0.00001)) * 5. + 5.;
	float LEN = length(hash(pos + time) * 2.) * l2.x;
	
	float d = distance(mouse*resolution, gl_FragCoord.xy);
	float c = smoothstep(0., 1., 4. - d / LEN);
	finColor += vec4(c / 2., c, 0.,0.5);
	if (d >= LEN) {
		finColor -= vec4(0.1, 0.2, 1.0, 1.0);
	}
	
	gl_FragColor = finColor;
	
}
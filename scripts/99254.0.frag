#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI  = 3.141592653589793;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) -0.5) + (mouse - 0.5) * 2.0;
	
	vec2 z = position;
	vec2 c = vec2(sin(time*.7)*0.3, sin(time*0.03)*.8);
	
	float div = 1.;
	vec2 zz;
	for (float j = 0.; j < 1.; j += .002) {
		zz = z;
		z = vec2(zz.x * zz.x - zz.y * zz.y + c.x, 2. * zz.x * zz.y + c.y);
		float l = length(zz - z);
		div = l > 1000. ? min(div, j) : div;
	}
	div = div == 1. ? 0. : div;
	
	float h = time * .3 + atan(position.x, position.y) / (PI*2.);
	float l = sqrt(div);
	gl_FragColor = vec4( hsv2rgb ( vec3( h, .8, l )), 1.0 );

}


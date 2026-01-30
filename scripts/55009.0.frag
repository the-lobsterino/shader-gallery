#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float speed = 20.;
const float colspeed = 1.;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 col = hsv2rgb(vec3(1.0, 1.0, 1.0));

	gl_FragColor = vec4(col.r, col.g, col.b, 1.0 );

}
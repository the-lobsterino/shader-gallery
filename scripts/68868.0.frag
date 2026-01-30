#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(0.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float X = position.x*64.;
	float Y = position.y*48.;
	float t = time*0.6;
	float o = sin(-cos(t+X/4.)-t+Y/9.+sin(X/(6.+cos(t*.1)+sin(X/9.+Y/9.))));
	gl_FragColor = vec4( hsv2rgb(vec3( o, 1., .5)), 1. );
}

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.rrr + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.rrr, clamp(p - K.rrr, 0.0, 1.0), c.y);
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	pos *= 10.;
	float val = cos(pos.x) - cos(pos.y);
	float col = .2/abs(val);
	gl_FragColor = vec4( vec3(col), 1.0);

	gl_FragColor *= vec4(hsv2rgb(vec3((pos.x*cos(time)+pos.y*sin(time))/7.0,0.5,1.0)),1.0);
}
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void )
{	
	mat3 r = mat3(cos(time), -sin(time), 0.0,
		      sin(time),  cos(time), 0.0,
		      0.0,        0.0,       1.0);

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 tmp;
	
	position = (position - 0.5) * 2.;
	position.x *= resolution.x / resolution.y;
	tmp = abs(position);
	float v = pow(tmp.x, 2.) + pow(tmp.y, 2.);
	vec3 t = vec3(tmp, 1.0);
	t = r * t;
	gl_FragColor = vec4( vec3(1.0-t.x, t.y, t.x - t.y), 1.0 );
	
}
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sinewave(vec2 p, float z)
{
	return p.y + sin(p.x * 4.0 - 0.03 * z - sin(3.0*z)) * 0.2  + sin(p.x * 3.0 - 0.03*z + sin(6.0*z)) * 0.5  + sin(p.x * 5.0 + 0.07*z + sin(2.0*z)) * 0.7 - 3.0;
}

void main( void ) {

	vec2 pos = -( gl_FragCoord.xy / resolution.xy ) + vec2(0.5, 0.5);

	float color = 0.0;

	for (float z = 16.0; z >= 1.0; z-=0.3) {
		vec2 p = 64.0*pos / z;
		float s = clamp(sinewave(p, z+time), 0.0, 1.0);
		if (s > 0.0) {
			color += (1.0 - s) * z / 1024.0 + s * 0.1;
			//break;
		}
	}
	gl_FragColor = vec4( vec3(0.6*color, 0.6*color - 0.5, 1.3*color), 1.0 );
}
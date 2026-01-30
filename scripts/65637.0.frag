// 180620N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy) / min(resolution.x, resolution.y);

	vec3 color = vec3(0.0);
	vec2 p = position * 1.0 - 1.0;
	p *= 5.;
	float k = 0.6;
	float g = 0.;
	float b = 0.;
	
	for (int i =0; i < 18; i++) {
		
		p = vec2((p.y * p.y - p.x * p.x) * .85, (p.y * p.x)) +sin(time);
		k += p.x;
		g += p.y;		
		b += 3.1;
		if (length(p) > 10.0) {
			break;
		}

	}

	gl_FragColor = vec4(k, g, b, 1.7 );

}
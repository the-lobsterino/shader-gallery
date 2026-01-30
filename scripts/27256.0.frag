#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D backbuffer;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// Burning ship fractal? --joltz0r
// center on one of the armada ships
// yey, water reflection?!

#define MAX_ITER 75
#define ESCAPE 100.0


// define this for smooth coloring
#define COLOR_SMOOTH

void main( void ) {

	vec2 p = surfacePosition;
	p *= 0.15;
	p += vec2(1.75, 0.00);

	vec2 i = p;
	
	float c = 0.0;

	
	for (int n = 0; n < MAX_ITER; n++) {
		i = abs(i);
		i = vec2(dot(i, vec2(-(i.x), i.y)), -dot(i, i.yx)) + abs(p);

		if (length(i) > ESCAPE) {
			#ifdef COLOR_SMOOTH
				c = float(n+1) - log(log(length(i)) / log(ESCAPE));
			#else
				c = length(i);
			#endif
			
			break;
		}
	}
	c /= float(MAX_ITER);

	vec4 color = vec4(vec3(c) * vec3(3.0, 0.9, 0.0), 1.0);

	if (p.y < 0.0) {
		color.rgb = pow(color.rgb, vec3(1.2)) * 0.8;

		vec2 uv = (gl_FragCoord.xy / resolution);
		uv.x += sin((time*3.0+(uv.y*100.0+91.*uv.x)))/(1.1+10000.*abs(p.y));
		color += texture2D(backbuffer, uv);
		color /= 2.0;
	}
	gl_FragColor = color;

}
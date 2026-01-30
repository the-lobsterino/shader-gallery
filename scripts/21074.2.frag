#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float thresh = 2.0;
const float lowThresh = 0.25;

// effect ringblobs

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.x ) - vec2(0.5, 0.5 * (resolution.y / resolution.x));
	float c = 0.0;

	for (int i=0; i<16; i++)
	{
		float a = abs(length(p) - 0.2 + sin(time + float(i*i)*p.x*p.y + p.x*p.y) * 0.2);
		c += 1.0 - pow(a, 0.1);
		if (c < 0.5) c = 0.0;
	}

	vec4 bgColor = 1.0 - vec4(abs(p.x*p.y*8.0));
	gl_FragColor = bgColor * 0.3 + vec4(c*p.x, c*p.y, c*p.x*p.y, 1.0) * 2.0;

}
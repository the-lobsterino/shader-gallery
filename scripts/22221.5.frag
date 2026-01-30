#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
#define T time
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

uniform sampler2D backsample;
float backrate = 0.075;
void lookback(void){
	vec4 bk_FragColor = texture2D(backsample, (gl_FragCoord.xy+vec2(-1.0))/resolution.xy);
	float time = time*(1. + length(bk_FragColor)*sin(time-length(bk_FragColor)));
	float backrate = backrate + 0.025*bk_FragColor.b;
	gl_FragColor *= backrate*(1.+sin(time*0.1));
	gl_FragColor += (1.-backrate)*bk_FragColor;
}

#define MAX_ITER 1024
void main( void ) {

	vec2 p = surfacePosition*18.0;
	vec2 i = p;
	float c = 0.0;
	float inten = 0.25;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = T * (0.4 - (1.0 / float(n+1)));
		i = p + vec2(
			cos(t - i.x*.5) + sin(t + i.y*.5), 
			sin(t - i.y*.5) + cos(t + i.x*.5)
		);
		c += 1.0/length(vec2(
			(sin(i.x*.5+t)/inten),
			(cos(i.y*.5+t)/inten)
			)
		);
	}
	c /= float(MAX_ITER);
	
	gl_FragColor = vec4(c*vec3(0., 0.6, .8), 1.0);
	
	lookback();
}
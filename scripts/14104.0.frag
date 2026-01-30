#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 64

void main( void ) {
	//vec2 p = surfacePosition*5.0;
	//Where's the damn surfaceposition documented? 
	//This is more comprehensive and portable 
	vec2 p = 5.0*(gl_FragCoord.xy / resolution)-2.5;
	vec2 i = p;
	float c = 0.5;
	float inten = 4.0;

	for (int n = 0; n < MAX_ITER; n++) {
		float t = time * (1.0 - (1.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	float pulse = abs(sin(time*3.));
	float pulse2 = pow(sin(time*2.),.25);
	float pulse3 = pow(sin(time*1.),2.);
	gl_FragColor = vec4(vec3(pow(c,1.5+pulse/2.))*vec3(2.0+pulse2, 5.0-pulse, 3.5+pulse3)*(1.+pulse)/2., 1.0);
}

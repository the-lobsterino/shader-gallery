/*
** Working on getting a CLOUDY SKY
** Feel free to fork and improve the algo by adding more clouds
*/

#ifdef GL_ES
precision mediump float;
#endif

#define MAX_ITER 20

uniform float time;
uniform vec2 resolution;
vec2 i;
float c;

void main( void ) {
	vec2 p = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;	
	float inten = 0.15;
	float t=0.0;
	
	for (int n = 0; n < MAX_ITER; n++) {
		t += (time * 0.01) * (1.0 - (3.0 / float(n+1)));
		i = p + vec2(cos(t - p.x) + sin(t + p.y), sin(t - p.y) + cos(t + p.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.0-sqrt(c);
	gl_FragColor = vec4(vec3(c*c*c*c),0.0) + vec4(0.0, 0.3, 0.5, 1.0);
}
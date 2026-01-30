#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
#define PI 3.14159265359
#define MAX_ITER 16



void main( void ) {
	vec2 playerPos = vec2(1.0,0.5);
	playerPos.x = abs(sin(time*0.2));
	playerPos.y = abs(cos(time*0.2));
	vec2 p1 = gl_FragCoord.xy /resolution;
	vec2 p = ((gl_FragCoord.xy / resolution - playerPos.xy) *4.0) - vec2(15.0);
	vec2 i = p;
	float c = 1.0;
	float inten = .05;

	for (int n = 0; n < MAX_ITER; n++){
		float t = time * 0.1*(1.5 - (2.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (2.*sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	float d = distance(playerPos,p1);
	c /= float(MAX_ITER);
	c = 1.5-sqrt(pow(c,2.2));
	c *= ( sqrt(0.2*abs(sin( d*10.0*PI - time*8.7 )))*2.0);
	c *= d*5.0;
	float col = c*c*c;
	gl_FragColor = vec4(vec3(col * 0.1*(1.0-d), col * 0.1 , col * 0.1), 1.0);
	
	
	
}

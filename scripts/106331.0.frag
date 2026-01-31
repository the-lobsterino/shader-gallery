precision mediump float;

uniform float time;
varying vec2 surfacePosition;

void main( void ) {
	vec2 sp = vec2(1);
	vec2 pp = sp*(3.0+sin(time*0.1));
	sp.x += sin(sp.y*12.0+time)*0.03;
	vec2 p = sp*4.0-vec2(20.0);
	vec2 i = p;
	float c = 1.0;
	float inten = .045;

	float t = time;
	i = p + vec2(cos(t*0.3+length(pp*1.0) - i.x+p.y*4.0) + sin(t + i.y), sin(t*0.9+length(pp*5.0) - i.y) + cos(t*0.5 + sin(time+i.x*1.4)));
	c += 1.0/length(vec2(p.x / (sin(length(pp*2.0)+i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	
	c = 1.3-sqrt(c);
	gl_FragColor = vec4(c*(0.6+length(pp*0.05)),c*0.9,c*1.3,c);
}
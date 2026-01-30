// Playing around with sine and cosine functions
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const int num = 12;

void main( void ) {
	float sum = 0.0;
	vec2 coords = vec2(500.,500.);
	float size = coords.x / 1000. *10.;
	for(int i = 0; i < num; ++i) {
		float t = float(i) + time*0.4;
		float c = float(i) * 1.;
		vec2 position = vec2(coords.x/1.5, coords.y/4.);
		position.x += sin(7.1*t+c) * coords.x  * 0.1 * cos(time)*2.;
		position.y += cos(4.1*t+c) * coords.y * 0.1 * cos(time)*2.;
		float x = 0.2 * size / (length(gl_FragCoord.xy -position)*0.1);	
		sum += x;
	}
	float cap = 1.;
	float r = sum*0.1;
	float g = sum*0.4;
	float b = sum*0.8;
	if(r > cap)
		r = cap;
	if(g > cap)
		g = cap;
	if(b > cap)
		b = cap;
	
	gl_FragColor = vec4(r, g, b,1);
	
}
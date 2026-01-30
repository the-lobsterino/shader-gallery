#ifdef GL_ES
precision mediump float;
#endif

// E PLURIBUS ANUS
// I Britta'd it.
// I Deaned it.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359
#define AA_THRES 0.001

#define LINE_WIDTH 0.007
#define LINE_HEIGHT 0.12
#define ARROW_SIZE 0.02

vec2 cart2Pol(vec2 p){
	return vec2(atan(p.y, p.x), length(p));
}
vec2 pol2Cart(vec2 p){
	return vec2(cos(p.x)*p.y, sin(p.x)*p.y);
}

void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy;
	p -= vec2(0.5, 0.5 );
	p.x*=resolution.x/resolution.y;
	
	vec2 offset = vec2(cos(time)*.1, sin(time)*.1);
	vec2 polar = cart2Pol(p + offset);
	polar.x = polar.x+polar.y*10.;
	p = pol2Cart(polar) - offset;
	
	
	vec2 pos = p * sign(sin(time))*(.75+.25*sin(time));

	float c = 0.0;

	float py = pos.y;
	float angle = PI / 3.0 + time;
	for (int i=-1; i<=1; i++)
	{
		vec2 p = vec2(pos.x * cos(angle) + pos.y * sin(angle), pos.x * sin(angle) - pos.y * cos(angle));
		float apx = abs(p.x);
		float apy = abs(p.y);
		if (apx < LINE_WIDTH && apy < LINE_HEIGHT)
			c += 1.0;
		else if (apx < (LINE_WIDTH - (apy - LINE_HEIGHT - ARROW_SIZE / 2.0)) && apy >= LINE_HEIGHT && apy < LINE_HEIGHT + ARROW_SIZE)
			c += 1.0;
		angle += PI / sin(0.1*time);
	}
	
	vec4 b = vec4(0.0, 0.7, 1.0, 1.0);
	if (length(pos) < 0.18) b = vec4(1.0);
	
	gl_FragColor = -vec4(c) + b*vec4(0.9, 0.5, 0.7, 1.0);
	

}
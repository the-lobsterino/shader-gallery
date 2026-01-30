#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float cross_width = 0.07;

float diamond(vec2 pos) {
    return float(pos.x + pos.y < cross_width && pos.x - pos.y > -cross_width
		 && pos.x + pos.y > -cross_width && pos.x - pos.y < cross_width);	
}

void main() {
	const float pi = 3.141592653589793;
	
	vec3 white = vec3(1);
	vec3 gold = vec3(255, 216, 0)/255.;
	vec3 green = vec3(111,111,55)/255.;
	
	vec2 pos = gl_FragCoord.xy / resolution - vec2(0.5, 0.5);
	pos.x *= resolution.x/resolution.y;
	
	float r2 = pos.x*pos.x + pos.y*pos.y;
	
	vec3 color = mix(gold, green, atan((r2 - 0.2)*(r2 - 0.1)*1e4)/pi+0.5);
	float sw = 1.;
	for(int i = 0; i <= 4; i++){
		sw *= -1.;
		float th = 3.14159*2.*(float(i)-1./4.)/5.;
		vec2 ipos = pos;
		ipos *= mat2(sin(th), cos(th), cos(th), -sin(th));
		ipos += vec2(0,-1./10.);
		ipos.x *= length(ipos)*0.75;
		//ipos += vec2(cos(time+dot(ipos, ipos)*100.)*0.1, sin(time+ipos.x*3.)*0.2);
		color = mix(color, white, diamond(ipos));
	}
	
	gl_FragColor = vec4(color, 1.0);
}
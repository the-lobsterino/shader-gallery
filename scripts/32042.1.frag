// co3moz
// rotating and translating square example 3

precision lowp float;
uniform float time;
uniform vec2 resolution;

#define formula(s) (pixel.x - (s) < square.x && pixel.x + (s)> square.x && pixel.y - (s)< square.y && pixel.y + (s) > square.y)
vec3 drawSquare(in vec2 pixel, in vec2 square, in vec3 setting) {
	if(formula(setting.x) && !(formula(setting.x - setting.y))) return vec3(setting.z / 40.0);
	return vec3(0.0);
}

void main(void) {
	 
	 
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y)/2.0; // for squared tiles, we calculate aspect
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect; // position of pixel we need to multiply it with aspect, so we get squared tiles
	vec2 center = vec2(0.5) * aspect; // 0.5 is center but we need to multiply it with aspect (0.5 isn't center for squared tiles)
 
	
	vec3 color = vec3(0.0);
	for(int i = 0; i < 40; i++) {
		vec3 d = drawSquare(position, center + vec2(sin(float(i) / 10.0 + time) / 4.0, 0.0), vec3(0.01 + sin(float(i*5) / 1.0/time), 0.001  , float(i)));
		if(length(d) != 0.0) color = d; // fix for old graphics card
	}
	gl_FragColor = vec4(color, 1.0);
}
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;
uniform sampler2D backbuffer;

const int num_x = 10;
const int num_y = 2;
float w = resolution.x;
float h = resolution.y;
 
vec4 draw_star(int i, int j) {
	float t = time;
	float x = w/2.0 * (1.0 + cos(8.5 * t + float(3*i+4*j)));;
	float y = h/2.0 * (1.0 + sin(1.3 * t + float(3*i+4*j)));;
	float size = 3.0 - 2.0 * sin(t);
	vec2 pos = vec2(x, y);
	vec2 pos2 = vec2(x, y);
	float dist = length(gl_FragCoord.xy - pos);
	float intensity = pow(size/dist, 2.0);
	if (intensity <= 0.1) {	
		dist = length(gl_FragCoord.xy - (pos + vec2(10,-5)));
		intensity = pow(size/dist, 2.0);
	}
	if (intensity <= 0.1) {	
		dist = length(gl_FragCoord.xy - (pos + vec2(10,-15)));
		intensity = pow(size/dist, 2.0);
	}
	if (intensity <= 0.1) {	
		dist = length(gl_FragCoord.xy - (pos + vec2(-0,-20)));
		intensity = pow(size/dist, 2.0);
	}
	if (intensity <= 0.1) {	
		dist = length(gl_FragCoord.xy - (pos + vec2(-10,-15)));
		intensity = pow(size/dist, 2.0);
	}
	if (intensity <= 0.1) {	
		dist = length(gl_FragCoord.xy - (pos + vec2(-10,-5)));
		intensity = pow(size/dist, 2.0);
	}
	
	
	vec4 color = vec4(0.0);
	color.r = 0.5 + cos(t*float(i));
	color.g = 0.5 + sin(t*float(j));
	color.b = 0.5 + sin(float(j));
	color += color;
	return color*intensity;
}

void main() {
	vec4 color = vec4(0.0);
	for (int i = 0; i < num_x; ++i) {
		for (int j = 0; j < num_y; ++j) {
			color += draw_star(i, j);
		}
	}
	vec2 texPos = vec2(gl_FragCoord.xy/resolution);
	vec4 shadow = texture2D(backbuffer, texPos)*0.7;
	gl_FragColor = color + shadow;
}

precision lowp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define OFFSET (0.0123646)
#define EXP_MOD 94.
#define SIN_MOD 5.45
#define TIME_MUL 0.0000125

#define FORSIZE 16

float color_proc(int start, float TIME, vec2 sp) {
  	float color = 0.;
  	for (int i = 0; i < FORSIZE; i++) {
    		float t = exp(mod(float(start+i)+TIME+float(start+i),EXP_MOD))*(1.+OFFSET*(/*exp(mod(time+5.,30.))**/OFFSET+1.));
    		color += 0.025/distance(sp,vec2(sp.x,sin(mod(t+sp.x+0.*exp(-pow(mod(time,30.)-15.,2.)),SIN_MOD))));
  	}
	return color;
}

void main(void){
	float TIME = time*TIME_MUL;
	vec2 sp = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	sp.y = 1.5*dot(sp,sp);
	float color = color_proc(0, TIME, sp) + color_proc(28, TIME, sp);
	gl_FragColor = vec4(color * vec3(0.10*mouse.y, 0.05, 0.10*mouse.x), 1.0);
}
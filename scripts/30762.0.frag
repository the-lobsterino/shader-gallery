#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

#define STEPS 500

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 mandrel(vec2 z, vec2 c) {
	return z;
}

vec4 cmandrel(vec2 c) {
	vec2 z = vec2(0.0,0.0);
	vec4 col = vec4(0.0,0.0,0.0,1.0);	
	for(int i=0;i<STEPS;++i) {
		vec2 nz;
		nz.x = z.x * z.x - z.y * z.y + c.x;
		nz.y = 2.0 * z.x * z.y + c.y;
		z = nz;
		float s = step(length(z), 2.0);
		col.r += s*0.01;
		col.g += s*0.01;
		col.b += s*0.03;
	}
	return col;
}

void main() {
	vec2 p = (gl_FragCoord.xy / min(resolution.x, resolution.y)) - vec2(0.5,0.5);
	float scale = 2.0;
	vec2 offset = vec2(-1, 0.0);
	vec2 z = p * scale + offset;
	gl_FragColor = cmandrel(z);
}
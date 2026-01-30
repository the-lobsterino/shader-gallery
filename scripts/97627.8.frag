#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 point(vec2 uv, vec2 p) {
	float s = .5 + 2.*smoothstep(.0, 1., fract(abs(sin(time))));
	return vec3(fract(sin(time)),1,.25) * smoothstep(.007*s, 0.001, length(p - uv));
}

float rnd(int i) {
	return fract(sin(float(i) * 13.123 + time) * 161.1567);
}

vec2 rot(vec2 p, float s) {
	float cs = cos(time*s);
	float sn = sin(time*s);
	return mat2(cs,sn,sn,-cs) * p;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution.xy*.5 )/ max(resolution.x, resolution.y);
	
	vec2 pts[3];
	pts[0] = vec2(0,0.25)+rot(vec2(.1,.05),1.2);
	pts[1] = vec2(-0.275,-0.1723)+rot(vec2(-.06,.04),1.);
	pts[2] = vec2(0.275,-0.1723)+rot(vec2(.1,-.07),3.);
	
	vec4 c = vec4(sin(abs(uv.y)),0.15,sin(uv.y*2.-time)*.25+.25,1);
	
	vec2 p = vec2(0.0);
	for (int i = 0; i < 500; ++i) {
		p = (pts[int(rnd(i) * 3.)] + p) * .5;
		c.xyz += point(uv, p);
	}
	
	gl_FragColor = c;
}
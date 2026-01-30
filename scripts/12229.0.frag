#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 pip(vec2 take, int i) {
	vec3 po = vec3(take, 0);
	vec3 tpo;
	bool brk;
	for(int i = 0; i < 100; i++) {
		tpo.x = po.x*po.x-po.y*po.y;
		tpo.y = 2.0*po.x*po.y;
		tpo.xy += take;
		po = tpo;
		if(float(i)>mouse.x*80.0)
			break;
		if(po.x*po.x+po.y*po.y>4.0) {
			po = vec3(1.0);
			brk = true;
			break;
		}
	}
	if(!brk)
		po = vec3(0.0);
	return abs(po.brg);
}

vec3 inf(vec2 take) {
	return pip(take, 100);
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	uv.x *= resolution.x/resolution.y;
	uv.x -= resolution.y/resolution.x;
	gl_FragColor = vec4(inf((uv-0.5)*2.0), 1.0);
}
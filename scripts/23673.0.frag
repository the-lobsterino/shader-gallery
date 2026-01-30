#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main(void){
	vec2 p = gl_FragCoord.xy / vec2(min(resolution.x,resolution.y)) * 4. - resolution.xy / vec2(min(resolution.x,resolution.y)) * 2.;
	vec2 q = p;
	vec2 r;
	
	for(int i = 0; i < 32; ++i){
		r = p * p;
		if(r.x + r.y > 4.) {
			float fi = float(i);
			float fr = mod(fi*1.1,12.)/12.;
			float fg = mod(fi*1.2,16.)/16.;
			float fb = mod(fi*1.3,24.)/24.;
			gl_FragColor.rgb = vec3(fr,fg,fb);
		}
		p = vec2(r.x-r.y,2.*p.x*p.y) + q;
	}
}
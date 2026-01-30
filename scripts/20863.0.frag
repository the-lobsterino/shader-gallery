#ifdef GL_ES
precision mediump float;
#endif

void main(void){
	vec2 r = vec2(800.0, 480.0);
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y); 
	float l = 0.2 / length(p);
	vec4 col = mix(vec4(0.9, 0.53, 0.3, 1.0), vec4(1.0, 0.75, 0.35, 1.0), p.y);
	vec4 sun = vec4(1.0, 1.0, 1.0, 0.0);
	vec4 res = col*(1.0 - l) + sun*l;
	gl_FragColor = res;
}
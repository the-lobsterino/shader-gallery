#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void){
    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
    vec2 p = (gl_FragCoord.xy * 3.0 - resolution) / min(resolution.x, resolution.y);
    
	vec2 v = vec2(0.0, 1.0);
    // ring
    float t = 0.25 / abs(0.5 - length(p));
    
	t =1.0 - abs(0.5 - length(p));
	t = 0.1 / abs(sin(time) - length(p));
	t = dot(p, v);
	t = dot(p, v) / (length(p)* length(v));
	;
	t = sin((atan(p.y, p.x) + time * 1.0) * 10.0);
	t = sin(atan(p.y, p.x) * 1.0);
	 t = sin((atan(p.y, p.x) + time * 0.0) * 20.0) * 0.01;
	t = 0.01 / abs(0.5 + t - length(p));
	t = 0.01 / abs(0.5 + (sin((atan(p.y, p.x) + time * 1.0) * 20.0) * 0.01) - length(p));
    gl_FragColor = vec4(vec3(t), 1.0);
}

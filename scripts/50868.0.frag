#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

    uniform float time;
    uniform vec2  resolution;
    uniform vec2  mouse;

    void main(void){
	vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float l = (sin(time)) / length(m - p);
	gl_FragColor = vec4(vec3(l), 1.0);
    }
// follow the time flow
#ifdef GL_ES
precision mediump float;
#endif                                         

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;


vec3 flag(vec2 uv, float threshold ) {
    float d = distance(vec2(0.5,0.5),uv) * 5.0; // distance
    d = abs(sin(d*time - time * 3.0));
    return vec3(step(threshold ,d));
}

void main() {
    vec2 st = (gl_FragCoord.xy * 3.0 - resolution) / min(resolution.x, resolution.y);

    vec3 ci = flag(st, 0.65);
    float al = 3.0*sin(time)/time;
	

    gl_FragColor = vec4(ci, 1.0);
}

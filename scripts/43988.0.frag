#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float t = sin(length(p) * 15.0 * length(mouse) + time * 5.0);
    t += sin((5.0*time-length(p)) * 5.0 + time * 10.0);
    gl_FragColor = vec4(vec3(t)*tan(p.y)*sin(p.x), 1.0);

}
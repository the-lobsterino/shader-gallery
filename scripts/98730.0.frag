#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
    vec2 p = (gl_FragCoord.xy / resolution.xy) * 2. - 1.;
    p.x *= resolution.x/resolution.y;
    float a = atan(p.y,p.x) + time;
    float r = length(p);
    vec3 color = vec3(sin(2.0*a), cos(1.3*a), sin(1.8*a));
    color = color/r;
    color = pow(abs(color), vec3(1.5));
    gl_FragColor = vec4(color,1.0);
}

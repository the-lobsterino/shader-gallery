precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene texture

void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float s = sin(time * 100.125);
    float c = cos(time * 0.25);
    vec2 q = mat2(c, -s, s, c) * (p - time * 0.125);
    
    vec2 v = mod(q * 2.0 + sin(time) * 0.5, 2.0) - 1.0;
    float f = 1.5 / abs(cos( 10.0 + time*2.0 * 2.5));
    
    float r = abs(length(v) * 1.0 - time * 2.0);
    float g = abs(length(v) * 1.5 - time * 1.5);
    float b = sin(length(v) * 1.25 - time * 1.0);
    gl_FragColor = vec4(vec3(r * -g, g * b, b * r) * f * f, 1.0);
}

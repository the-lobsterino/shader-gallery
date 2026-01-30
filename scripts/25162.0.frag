#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
#define time (time+2e1/(0.001+length(surfacePosition+vec2(1.,0.)))+2e1/(0.001+length(surfacePosition-vec2(1.,0.))))
// Created by Vinicius Graciano Santos - vgs/2014
// https://www.shadertoy.com/view/lsBSDz

#define TAU 6.28318530718

float segment(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    vec2 ap = p - a;
    float k = clamp(dot(ap, ab)/dot(ab, ab), 0.0, 1.0);
    return smoothstep(0.0, 5.0/resolution.y, length(ap - k*ab) - 0.0001);
}

float shape(vec2 p, float angle) {
    float d = 100.0;
    vec2 a = vec2(1.0, 0.0), b;
    vec2 rot = vec2(cos(angle), sin(angle));
    
    for (int i = 0; i < 13; ++i) {
        b = a;
        for (int j = 0; j < 11; ++j) {
        	b = vec2(b.x*rot.x - b.y*rot.y, b.x*rot.y + b.y*rot.x);
        	d = min(d, segment(p,  a, b));
        }
        a = vec2(a.x*rot.x - a.y*rot.y, a.x*rot.y + a.y*rot.x);
    }
    return d;
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 cc = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y;
        
    float col = shape(pow(abs(cc),vec2(1.+sin(time*0.13),1.+cos(time*0.11))), cos(0.01*(time+22.0))*TAU);
    col *= 0.5 + 1.5*pow(uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.3);
    
    
	gl_FragColor = vec4(vec3(pow(col, 0.45)),1.0);
}
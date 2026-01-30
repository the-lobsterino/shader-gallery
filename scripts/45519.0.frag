#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float sq(float x) {
	return x*x;
}

void main() {
    vec2 p = gl_FragCoord.xy / resolution.x * 0.7;
    vec3 col;
    for(float j = 0.0; j < 3.0; j++){
        for(float i = 1.0; i < 10.0; i++){
            p.x += 0.1 / (i + j) * sin(i * 10.0 * p.y + time + cos((time / (12. * i)) * i + j));
            p.y += 0.1 / (i + j)* cos(i * 10.0 * p.x + time + sin((time / (12. * i)) * i + j));
        }
        col[int(j)] = sin(75.0*sq(p.x)) + sin(75.0*sq(p.y));
    }
    gl_FragColor = vec4(col, 1.);
}
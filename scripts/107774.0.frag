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
        for(float i = 1.0; i < 20.0; i++){
            p.x += 0.1 / (i) * sin(i * 10.0 * p.y + time + cos((time / (24. * (i + j * 30.0))) * i));
            p.y += 0.1 / (i) * cos(i * 10.0 * p.x + time + sin((time / (24. * (i + j * 30.0))) * i));
        }
        col[int(j)] = sin(75.0*sq(p.x)) + sin(75.0*sq(p.y));
    }
    gl_FragColor = vec4(sqrt(col) * 0.8, 1.);
}
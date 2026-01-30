#extension GL_OES_standard_derivatives : disable

precision mediump float;

uniform vec2 resolution;
uniform vec2 center;
uniform float radius;

float circleSDF(vec2 p, float r) {
    return length(p) - r;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    float sdf = circleSDF(p, 0.5);

    if (sdf < 0.0) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red color
    } else {
         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
}
// Playing around with Lissajous curves.
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const int num = 300;

void main( void ) {
    float sum = 0.0;
    float size = resolution.x / 4.0;
    for (int i = 0; i < num; ++i) {
        vec2 position = resolution / 4.0;//resolution / 4.0
	float t = float(i) / 2.0;
	float c = float(i) * 2.0;
        position.x += tan(8.0 * t + c) * resolution.x * 0.2; //tan(8.0 * t + c) * resolution.x * 0.2 --- tan(8.0 * t + c) * 200.0
        position.y += sin(t) * resolution.y;

        sum += size / length(gl_FragCoord.xy - position);//size / length(gl_FragCoord.xy - position);
    }
    gl_FragColor = vec4(sum * 0.1, sum * 0.5, sum, 1);
}
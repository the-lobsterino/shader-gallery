
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

const int num = 100;

void main( void ) {
    float sum = 0.0;
    float size = resolution.x / 1000.0;
    for (int i = 0; i < num; ++i) {
        vec2 position = resolution / 2.0;
	float t = (float(i) + time) / 2.0;
	float c = float(i) * 4.0;
        position.x += tan(0.5 * t * 000001. + c *0.5) * resolution.x * 0.1;
        position.y += sin(t) * resolution.y * cos(10.);

        sum += size / length(gl_FragCoord.xy - position);
    }
    gl_FragColor = vec4(sum * 0.5, sum * 0.1, sum*4., 1.);
}
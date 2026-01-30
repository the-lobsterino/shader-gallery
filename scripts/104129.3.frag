// LOL
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

const int num = 33;

void main( void ) {
    float sum = 0.;
    float size = resolution.x / 2000.0;
    for (int i = 0; i < num; ++i) {
        vec2 position = resolution / 2.0;
	float t = (float(i) + time) / 5.0;
	float c = float(i) * 4.0;
        position.x += tan(8.0 * t + c) * resolution.x * .2;
        position.y += sin(t) * resolution.y * 0.5;

        sum += size / length(gl_FragCoord.xy - position);
    }
	sum=pow(sum,0.65);
    gl_FragColor = vec4(sum * 2.1, sum * 1.5, sum*0.9, 1);
}
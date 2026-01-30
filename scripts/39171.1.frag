#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co) {
    float f = sin((co.x + co.y) * 50.0);
    return fract(f * 10000.0);
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = rand(pos);

	gl_FragColor = vec4(color, color, color, 1.0 );

}
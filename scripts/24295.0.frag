


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

vec2 position = ( gl_FragCoord.xy / resolution.xy );

float a = tan(3.14 * 10.0 * position.x + 10.0 * time);
float b = sin(3.14 * 30.0 * position.y);
float c = sin(3.14 * 10.0 * position.y);
float d = sin(3.14 * 80.0 * position.x);
float color = a*b+c/d;
gl_FragColor = vec4(color, color, 0.2, 1.0);
}

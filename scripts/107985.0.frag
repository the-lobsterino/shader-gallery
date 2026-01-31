#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    // Swirling effect
    float angle = sin(time / 5.0) * 2.0;
    mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 position = (rotate * (gl_FragCoord.xy / resolution.xy - 0.5)) + mouse / 4.0;

	float colorR = sin(position.x * cos(time / 15.0 + position.y * 0.1) * 80.0) + cos(position.y * cos(time / 15.0) * 10.0);
	float colorG = sin(position.y * sin(time / 10.0 + position.x * 0.1) * 40.0) + cos(position.x * sin(time / 25.0) * 40.0);
	float colorB = sin(position.x * sin(time / 5.0) * 10.0) * cos(position.y * sin(time / 35.0 + time * 0.1) * 80.0);
	float commonPattern = sin(time / 10.0 + position.x * position.y) * 0.5;
    
    gl_FragColor = vec4(colorR * commonPattern, colorG * commonPattern * 0.5, sin(colorB + time / 3.0) * 0.75, 1.0);
}
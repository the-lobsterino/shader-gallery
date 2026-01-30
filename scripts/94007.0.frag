#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 coord = gl_FragCoord.xy / resolution.xy;
        
	vec4 topColour = vec4(0.7, 0.05, 0.9, 1.0);
	vec4 bottomColour = vec4(0.05, 0.5, 1.0, 1.0);
	
	gl_FragColor = (bottomColour + (topColour * coord.y + cos(time) / 1.0)) * 0.9;
}
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float RADIUS = 0.55;

const float SOFTNESS = 0.25;


void main( void ) {

	vec4 aColor = vec4(0.2,1.0,1.0,1.0);
	vec3 texColor;
	vec2 position = (gl_FragCoord.xy / resolution.xy) - vec2(0.5);
	float len = length(position);
	float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);
	texColor.rgb = mix(aColor.rgb, aColor.rgb * vignette, 1.0);
	

	gl_FragColor = vec4(texColor,1.0);
}
#ifdef GL_ES
precision mediump float;
#endif
// mods by dist

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis


	vec3 color1 = vec3(0.0, 0.2, 0.8); // 151B2E in RGB
	vec3 color2 = vec3(0.8, 0.0, 0.1); // 202B40 in RGB
	vec3 color = mix(color1, color2, uv.y); // interpolate between color1 and color2
color*=sin(255.*color.r);
	gl_FragColor = vec4(color, 1.0);
}

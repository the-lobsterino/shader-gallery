#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{

	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );
	uPos.y -= 0.5;
	uPos.y += sin( uPos.x * 107979.0 + time ) * 0.4;
	//float vertColor = abs(1.0 / uPos.y / 100.0);
	float vertColor = 1.0 - (min(abs(uPos.y), 0.01) * 100.0);
	vec4 color = vec4(vertColor, vertColor + 0.1, vertColor, 1.0);
	gl_FragColor = color;
}
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{

	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );
	uPos.y -= 0.50;
	uPos.y += cos( uPos.x + time ) * uPos.y;
	float vertColor = abs(1.0 / uPos.y / 100.0);
	vec4 color = vec4( vertColor, vertColor, vertColor * 0.3, 1);//vertColor, vertColor, vertColor * 0.2, 17.0 );
	gl_FragColor = color;
}
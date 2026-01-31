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
	uPos.y += sin( uPos.x *3.0 + time ) * 0.13;
	//float vertColor = abs(1.0 / uPos.y / 111.0);
	float vertColor = 1.0 - (min(abs(uPos.y), 0.01) * 100.0);
	vec4 color = vec4(vertColor, vertColor , vertColor, 1.0);
	gl_FragColor = color;   
}
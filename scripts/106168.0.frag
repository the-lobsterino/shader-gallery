#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - mouse * 1.0+.25;
	vec4 col = vec4(0); 
	col = vec4(sin(pos.y*50.)*cos(pos.x*100.)*10.*(abs(sin(mod(time*.5, tan(time*.8))))+.3)*.5+1.);
	col *= vec4(0.5, .2, 0, .1);
	col *= vec4(abs(sin(col.x/col.y))*-1.5+abs(sin(pos.x*10.)));
	col.w = 1./pow(pos.y+.5, 2.)-1.0;
	gl_FragColor = col;

}
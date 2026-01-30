#ifdef GL_ES
precision mediump float;
#endif
//c64cosmin@gmail.com
//water surface

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) + 0.01*time;

	float color = 0.0;
	float c=0.0;
	c+=cos(p.x*80.0+time*3.0)*cos(p.y*60.0+cos(time*p.x*0.6+time*2.0)+time*3.0);
	c+=cos(p.y*70.0+time*1.2)*cos(p.x*70.0+cos(time*p.y*0.4+time*1.2)+time*1.5);
	c+=cos(p.y*90.0+time*2.0)*cos(p.y*50.0+cos(time*p.x*0.3+time*1.2)+time*2.5);
	color = cos(c+time);

	gl_FragColor = vec4( vec3( color, sin(1.0 - p.x) * 0.1, sin(p.y * p.x)*0.5 ), 1.0 );

}
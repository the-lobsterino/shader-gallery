#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);
	float c = 0.0;
	float i=p.x*35.;
	float f=sin(i*time/3.0)/(i);
	float d=abs(p.y*3.-f)*160.;
	c=.75/abs(pow(d,.35));
	c=clamp(c,0.,1.);
	gl_FragColor = vec4( vec3( c*0., c*1., c*5. ), 1.0 );
}
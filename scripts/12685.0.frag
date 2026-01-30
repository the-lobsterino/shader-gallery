#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p= ( gl_FragCoord.xy / resolution.xy )-0.5;

	float c=0.;
	float d=.16/length(p);
	float a=.55*atan(p.x,-p.y);
	p.x=d+time;
	p.y=a;
	float d1=(1.01-abs(sin(p.x*20.)-p.y*4.));
	float d2=(1.01-abs(sin(p.x*20.+time)-p.y*4.));
	d1=(d1*d2);
		
	c=1.-d1/d*d;
	gl_FragColor = vec4( vec3( c, c*c, c*c-c ), 1.0 );

}
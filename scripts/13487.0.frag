#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float funk(float p)
{
p=(1.+38.*p*sin(time))/(1.+1.*p*p*abs(sin(time)))*0.1;
return p;
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);
	float c = 0.0;
	p.x+=-.1*sin(time);
	float f=funk(p.x*10.+(.2*tan(time)))+.1*cos(time);
	float d=(p.y*4.-f)*10.;
	c=.175/abs(pow(abs(d),.5));
	c=clamp(c,0.,1.)+0.1*sin(time);
	gl_FragColor = vec4( vec3( c*c+c, c*0.25, 13.*c*p.x ), 1.0 );
}
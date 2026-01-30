#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float funk(float p)
{
float sp=fract(p*.125)-.5;		
p=fract(1.-abs(fract(p*.25)-0.5)*2.)*(6.+abs(cos(time*0.5))*100.)*sign(sp);
p=-sign(sp)*.5-(cos(p)-1.)/(p*abs(p));
return p;
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);
	float c = 0.0;
	float f=funk(p.x*10.+time*5.);
	float d=(p.y*2.-f)*10.;
	c=.175/abs(pow(abs(d),.5));
	c=clamp(c,0.,2.);
	gl_FragColor = vec4( vec3( c*c+c, c*0.25, 13.*c*p.x ), 1.0 );
}
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float funk(float p)
{
float res=fract(p)*2.-1.;	
res=cos(time*2.-p*10.*3.)*min(res,1.-2.*res);
return res;
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);
	float c = 0.0;
	float f=funk(p.x*2.+time*0.25);
	float d=(p.y*4.-f)*10.;
	c=.25/abs(pow(abs(d),.5));
	c=clamp(c,0.,1.);
	gl_FragColor = vec4( vec3( c*c+c, c*0.25, 13.*c*p.x ), 1.0 );
}
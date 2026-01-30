#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float loopto(float a, float top) {
	a = mod(a, top*2.0);
	if(a > top)
		return a;
	else
		return top*2.0-a;
}

void main( void ) {
	float time = sin(sqrt(time)) * 300.;
	if(time < 5000.)
	{
		time += 20000.;
	}
	
	
	time = time / 60. ;
	float a = time, cosa = cos(a), sina = sin(a), tana=tan(a);
	vec2 position = gl_FragCoord.xy / resolution.xy * 4.0 -2.  ;
	position = vec2(position.x * cosa * tana * sina * sin(time), position.y*cosa * tana * sina * (-1. * tan(time))) * sin(time);
	time = time * 3.;
	position = cos((vec2(sin(position.x), atan(position.y / position.x))));

	position *= ((sin(position) / (position * (time / 1.) * loopto(time, ((time/2.)/sqrt(time)))))) / 10. * tan((position * 3.) * (time/300.));
	
	time = (time * sin(sqrt(time)));
	gl_FragColor = (vec4(sin(1. * sin(time)) ,sin(time * 1.3) , sin(-0.9* sin(time)), sqrt(time)) * tan(position.y/ sin(position.x * 1.) - time/2.  + tan(position.y) * time / 10. )) / 10.;
}
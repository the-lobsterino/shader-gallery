#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi = 2.*asin(1.);

float wave(float pos, float freq, float speed)
	{
		float a = sin(pi*(pos*(freq + cos(time*speed*3.)) + time*speed)) + 2.5*sin(freq*15.*pos)*.1;
		return a;
	}

void main( void ) {

	vec2 position = 2.*( gl_FragCoord.xy / resolution.xy ) - 1.;
	vec2 unit = vec2(1./resolution.x, 1./resolution.y);
	vec3 color = vec3(0.0,0.0,0.0);
	float scale = .5;
	//scale = scale*0.;
	float speed = 0.3;
	float freq = 3.;
	float yeq = abs(position.y - scale*wave(position.x,freq,speed));
	float funcdiff = scale*abs(wave(position.x, freq,speed) - wave(position.x + unit.x, freq,speed));
	float diffthr = 5.;
	if( yeq > unit.y + funcdiff)
	{
	color = color + 1.;
	}
	
	color = mod(color + 1., 2.);
	color.yz = color.yz*(1.-funcdiff/(diffthr*unit.y));
	color.x = color.x*(funcdiff/(diffthr*unit.y));
	color = 2.*color / ((1.-funcdiff/(diffthr*unit.y)) + (funcdiff/(diffthr*unit.y)));
	clamp(color,0.,1.);
	gl_FragColor = vec4( color, 1.0 );

}
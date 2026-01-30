#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(19.9898,3.233))) * 98.5453);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	
	float y_dec = position.y / resolution.y;
	float y_rev = 1.0 - y_dec;
	float x_dec = position.x / resolution.x;

	float y_from_middle = abs(0.5 - y_dec);
	float tau = 6.283185;
	
	float r = 0.8;
	float g = 1.0;
	float b = 0.5;
	
	vec2 rev_pos = vec2(position.y, position.x);
	
	float modder = sin(x_dec * 150.0 + time) * 0.45;
	float other_modder = sin((y_dec * rand(position) * 20.0) + time) * 0.15;	
	float still_other_modder = sin(y_rev + rand(rev_pos)) * 0.35; 

	
	
	if (abs(y_from_middle - abs(sin(time * 2.0 - x_dec) / 2.0)) < 0.01)
	{
		r = other_modder;
		g = modder-other_modder;
		b = still_other_modder;
	}
	else if (abs(y_from_middle - abs(sin(time * 2.0 - x_dec) / 4.0)) < 0.03)
	{
		r = modder;
		g = modder;
	}
	else if (abs(y_from_middle - abs(sin(time - x_dec * 200.0) / 2.0)) < 0.01)
	{
		r = rand(vec2(12.0, position.x)) / 2.0;
		g = rand(vec2(15.0, position.x)) / 5.0;
		b = 0.5 + rand(position) / 2.0;
	}
	else if (abs(y_from_middle - abs(cos(time - x_dec * 50.0) / 10.0)) < 0.01)
	{
		r = rand(vec2(12.0, position.x)) / 2.0;
		g = rand(vec2(15.0, position.x)) / 5.0;
	}
	
	
	gl_FragColor = vec4( vec3( r, g, b ), 1.0 );

}
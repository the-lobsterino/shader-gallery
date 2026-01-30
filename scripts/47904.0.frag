#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 seed)
{
	float flNoise = 1.34234523 + seed.x+seed.y+16.0;
	return fract(mod(time, seed.x * flNoise) * mod(time, seed.y * flNoise) * flNoise);
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec3 color;
	
	if(pos.x > 0.25 && pos.x < rand(pos) && pos.y > 0.25 && pos.y < 0.75)
		color.r = rand(pos);
	else if(pos.x > rand(pos))
		color.g = rand(pos);
	else
		color.b = rand(pos);
	
	
	gl_FragColor = vec4( color, 1.0 );

}
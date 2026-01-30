

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

const float PI = 3.141592653589793;
const float TWOPI = PI * 2.0;

float norm(float f){
	return (f + 1.0) * 0.5;
}

float wave(vec2 p, float seed,  float thickness, float time )
{	
	float dx = (p.x+mouse.x*0.1) - p.y * 0.1 + time * 0.0001 - thickness * 0.25;
	float w = norm( sin( dx * TWOPI * seed * thickness + time  ) );
	return w;
}


void main(void)
{
	
	vec3 color = vec3(0.);
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	
	
	float wavetime = time * 0.5;
	float thickness = abs( norm( sin(wavetime*1.0) ) ) + 1.0;
	
	float brightness = 1.0;
	brightness *=  wave(p, 4.0, thickness, wavetime );
	brightness *=  wave(p, 12.0, thickness*0.5, wavetime );
	brightness *=  wave(p, 5.0, thickness*0.33, wavetime );

	
	float maxy = 2.0 - pow( norm( sin(p.x * PI * 9.21 + wavetime ) ), 0.5 ) - pow( norm( sin(p.x * PI * 8.33 + wavetime*2.0 ) ), 0.5 );
	brightness *= p.y * maxy;

	
	
	
	gl_FragColor = vec4( brightness,brightness,brightness, 1.0 );
}
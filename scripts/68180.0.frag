#ifdef GL_ES 
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

vec2 magnify(vec2 p, float x, float y) {
	if (y < 0.)
		return p * (1. + x);
	else
		return p * (1. - x);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = 2. * (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	//position.x *= resolution.x / resolution.y;
	
	vec2 pos;
	pos.x = position.x / abs(position.y);
	pos.y = tan(mix(PI/2.0, PI/4.0, abs(position.y)));
	
	pos = magnify(pos, 0.025 * 0.01*(time * 6. * PI), position.y);
	//pos.x += 0.025 * (time * 3. * PI);
	pos.x += (mouse.x / 2.0) * (time);
	pos.y += time * 3.;
	
	float tile = mod(floor(pos.x*0.333) + floor(pos.y*0.333), 2.);
	
	vec3 finalColor;
	finalColor = (0.7 + 0.3 * tile) * vec3(0.5, 1.0, 0.1) * step(position.y, 0.);
	
	float top = 0.;
	
	for (float i = 0.; i < 8.; i++) {
		top += sin(position.x * 1.25 * pow(2., i)) / pow(2., i);
	}
	
	top = pow(abs(top-0.25)+0.25, 3.333);
	top += pow(0.185*abs(top-1.), 8.);
	top *= 0.03;
	
	float hillZone = step(position.y - top, 0.1) * step(0., position.y);
	
	vec3 hill = vec3(0.5, 1.0, 0.1);
	
	//hill *= 0.5 + 0.5 * (pow(abs((position.y - 0.1) - top), 0.0) * rand(position));
	
	
	vec3 sky = (1.5- position.y) * vec3(0.25, 0.75, 1.0);
	sky += vec3(2., 1.25, 0.5) * (0.025 / distance(position, vec2(1.0, 0.75)));
	finalColor += sky * step(0., position.y);
	
	finalColor -= hillZone * hill*0.125;
	
	gl_FragColor = vec4( finalColor, 1.0 );

}
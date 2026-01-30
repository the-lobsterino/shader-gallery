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
	position.x *= resolution.x / resolution.y;
	
	vec2 pos;
	pos.x = position.x / abs(position.y);
	pos.y = tan(mix(PI/2.0, PI/4.0, abs(position.y)));
	
	pos = magnify(pos, 0.025 * sin(time * 6. * PI), position.y);
	pos.x += 0.025 * cos(time * 3. * PI);
	pos.y += time * 3.;
	
	float tile = mod(floor(pos.x) + floor(pos.y), 2.0);
	
	vec3 finalColor;
	finalColor += (0.1 + 0.2 * tile) * vec3(0.5, 0.2, 0.2) * step(position.y, 1.0);
	
	float top = 0.;
	
	for (float i = 0.; i < 8.; i++) {
		top += sin(position.x * 2. * pow(2., i)) / pow(2., i);
	}
	
	top *= 0.05;
	top = pow(abs(top-0.25)+0.25, 3.333);
	top += pow(0.175*abs(top-1.), 8.);
	top *= 0.05;
	
	float hillZone = step(position.y - top, 0.01) * step(0., position.y);
	
	vec3 hill = vec3(0.2, 0.04, 0.4);
	
	//hill *= 0.5 + 0.5 * (pow(abs((position.y - 0.1) - top), 0.5) * rand(position));
	
	finalColor += hillZone * hill;
	
	vec3 sky = (1.5- position.y) * vec3(0.75, 0.2, 0.2);
	//sky += vec3(2., 1.25, 0.5) * (0.025 / distance(position, vec2(1.0, 0.75)));
	finalColor += sky * step(0., position.y) * (1. - hillZone);
	
	gl_FragColor = vec4( finalColor, 1.0 );

}
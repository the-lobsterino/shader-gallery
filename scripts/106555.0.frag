#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926;

float gwn(vec2 p, vec2 n, vec2 q)
{
	vec2 d = p - q;
	return dot(d, n) / (4. * PI * pow(length(d), 3.0));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float wn = 0.0;
	
	wn += gwn(vec2(0.35, 0.65), normalize(vec2(0.35, 0.65) - mouse), position);
	wn += gwn(vec2(0.65, 0.35), normalize(vec2(0.65,0.35) - mouse), position);
	wn += gwn(vec2(0.35), normalize(0.35 - mouse), position);
	wn += gwn(vec2(0.65), normalize(0.65 - mouse), position);
	
	
	
	
	float wn2sdf = wn - 0.5;

	
	gl_FragColor = vec4( vec3( mod(abs(wn2sdf), 1.0) ) * step(vec3(0.0),vec3(wn2sdf, -wn2sdf, 0.)), 1.0 );
	if (abs(wn2sdf) < 0.015)
		gl_FragColor = vec4(1.);
}
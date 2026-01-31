#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926;

float gwn_dipole(vec2 p, vec2 n, vec2 q)
{
	vec2 d = p - q;
	return dot(d, n) / (4. * PI * pow(length(d), 3.0));
}

float gwn_segment(vec2 p, vec2 n, vec2 q)
{
	
	vec2 rn = vec2(n.y, -n.x);
	vec2 A = p + rn * 0.5;
	vec2 B = p - rn * 0.5;
	
	
	vec2 a = normalize(A-q);
	vec2 b = normalize(B-q);
	float d = dot(a,b);
	float angle = acos(d);
	angle = min(angle, 2.*PI - angle);
	return sign(a.x*b.y-b.x*a.y) * angle / (2. * PI);
}

float gwn(vec2 p, vec2 n, vec2 q) {
	return gwn_segment(p,n,q);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float wn = 0.0;
	
	wn += gwn(vec2(0.35, 0.65), normalize(vec2(0.35, 0.65) - mouse) * 0.2, position);
	wn += gwn(vec2(0.65, 0.35), normalize(vec2(0.65,0.35) - mouse) * 0.2, position);
	wn += gwn(vec2(0.35), normalize(0.35 - mouse) * 0.2, position);
	wn += gwn(vec2(0.65), normalize(0.65 - mouse) * 0.2, position);
	
	
	
	
	float wn2sdf = wn - 0.5;

	
	gl_FragColor = vec4( vec3(wn), 1.0 );
	if (abs(wn2sdf) < 0.015)
		gl_FragColor = vec4(1.);
}
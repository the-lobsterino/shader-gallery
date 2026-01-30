#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 Sphere(vec2 uv, vec2 position, float radius) {
	float dist = radius / distance(uv, position);
	return vec3(dist * dist);
}

void main( void ) {

	vec2 uv = 2.5 * vec2( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;
	vec3 pixel = vec3(0,0,0);
	float t = time / 5.0;
	vec2 positions[5];
	positions[0] = vec2(sin(t*1.4)*1.3,cos(t*2.3)*0.4);
	positions[1] = vec2(sin(t*3.0)*0.5,cos(t*1.3)*0.6);
	positions[2] = vec2(sin(t*2.1)*0.1,cos(t*1.9)*0.8);
	positions[3] = vec2(sin(t*1.1)*1.1,cos(t*2.6)*0.7);
	
	for (int i=0; i < 5; i++) 
		pixel += Sphere(uv,positions[i], 0.22);
	pixel = step(1.0,pixel) * pixel;
	gl_FragColor = vec4( pixel, 1.0 );
}
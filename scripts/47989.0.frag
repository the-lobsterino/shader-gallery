#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

#define CORNER 16.

vec2 rotate( vec2 v, float t ) {
	return vec2( v.x*cos(t) - v.y*sin(t), v.y*cos(0.5*t) + v.x*sin(t));
}

void main( void ) {
	
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);	
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 1.;
	float size = 0.1;
	float offset = 5.;

	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	
	//s += time * 0.1;
	//s = rotate(s, time * 1.);
	s.y -= time * 0.5;
	
	vec3 light = vec3(1., 1., 1.);
	
	
	//checkboard texture
	vec3 color = vec3(0.25, 0.25, 0.5);
	vec3 normal = normalize(vec3(tan(s.x * PI), tan(s.y * PI), CORNER));
	
	float bright = dot(normal, normalize(light));
	bright = pow(bright, 1.);
	color *= bright;
	
	vec3 heif = normalize(light + vec3(0., 0., 1.));
	vec3 spec = vec3(pow(dot(heif, normal), 96.));
	
	color += spec;
	
	//fading
	float fog = p.z*p.z*25.0;
	
	if (pos.y >= 0.) color = vec3(0.0);
	
	color = mix(vec3(0.0), color, fog);
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}
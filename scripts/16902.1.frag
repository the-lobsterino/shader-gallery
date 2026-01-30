#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main(void)
{
	vec2 pos = (gl_FragCoord.xy / resolution.xy) - vec2(0.5); 
	vec2 center = (resolution.xy) / 2.; 
	
	float r = length(pos);
	float fi = atan(pos.y, pos.x);
	
	vec3 basecolor = vec3(1.0, 0.95, 0.37);
	vec3 raycolor = vec3(0.8, 0.2, 0.3);
	vec3 rays = vec3(sin(fi * 2. + 16. * time));
	vec3 smooth =  vec3(smoothstep(0.6, 0.9, rays)) ;
	
	vec3 circle = smoothstep(0.1, 0.11, vec3(r));
	
	gl_FragColor = vec4(basecolor * circle * smooth, 1.0);
}
#ifdef GL_ES
precision mediump float;
#endif

//behaves slightly differently on amd/nv
// AM: snapped scrolling to pixels to reduce flickering

uniform float time;
uniform vec2 resolution;

vec3 nrand3( vec2 co )
{
	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}

void main(void)
{
	vec2 scroll = vec2(time, 1.) / 20.0;
	vec2 p = gl_FragCoord.xy / resolution.xy + floor(resolution.xy * scroll) / resolution.xy;
	vec2 seed = p * .8;	
	
	seed = floor(seed * resolution);
	
	vec3 rnd = nrand3( seed );
	vec4 col=vec4(0.5,0.5,p.y*.9,1.0);
	gl_FragColor = col*vec4(2.0 * pow(rnd.y,60.0));
}

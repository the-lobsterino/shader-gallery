// phantom mode?

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p, float l)
{
	return length(p) - l;
}


float sdf(vec3 p)
{
	p = mod(p, 5.0) - 2.5;
	float s1 = sphere(p, 0.8);
	
	return s1;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y );

	vec3 ro = vec3(0.0, 0.0, -5.0) + vec3(0.0, 0.0, time * 10.0);
	vec3 rd = normalize(vec3(pos, 2.5));
	
	float depth = 0.0;
	
	for(int i=0; i<100; i++)
	{
		vec3 ray = ro + rd * depth;
		float dist = sdf(ray);
		
		dist = max(abs(dist), 0.02);
		
		depth += dist * 0.5;
	}
	
	float transparency = exp(-0.0005 * depth * depth);
	
	gl_FragColor = vec4( vec3(transparency), 1.0 );

}
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rot(vec2 p, float r)
{
	return vec2(p.x * cos(r) + p.y * sin(r), p.y * cos(r) + p.x * -sin(r));	
}

float f(vec2 p, float t, float s)
{
	p = rot(p, -t * s);
	float h = max(abs(p.x*0.5), abs(p.y*10.0));
	h = smoothstep(1.0, h, h+0.01) * (h < 1.0 ? 1.0 : 0.0);
	float v = max(abs(p.x*10.0), abs(p.y*0.5));
	v = smoothstep(1.0, v, v+0.01) * (v < 1.0 ? 1.0 : 0.0);
	
	return min(1.0, h + v);
}

float speed(float t)
{
	return 15.0;	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 ) * vec2( resolution.x / resolution.y, 1.0 );
	p *= 2.0;
	const float frames = 64.0;
	vec3 c = vec3(0.0);
	for(float i = 0.0; i < frames; i++)
	{
		float offset = i / frames * 0.03;
		c += f(p, time - offset, speed(time));
	}
	
	c /= frames;
	
	gl_FragColor = vec4( c, 1.0 );

}
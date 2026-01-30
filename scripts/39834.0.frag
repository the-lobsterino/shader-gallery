#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int count = 4;

float rect(vec2 pos, vec2 center, vec2 extents)
{
	return (abs(pos.x-center.x)<=extents.x)&&(abs(pos.y-center.y)<=extents.y)?1.0:0.0;
}

float func2(float t)
{
	return (sin(t) + 1.0) * 0.5;
}

float func(float t)
{
	return pow(func2(5.0*t + time), 1.0+func2(5.0*time)) * 0.5;
}



void main( void ) {
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.0, 0.0)); position.x *= resolution.x/resolution.y;

	float c = 0.0;
	vec3 color;
	float width = 1.0/float(count);
	
	
	for(int i = 0; i < count; i++) {
		float value = func(float(i)/float(count));
		c += rect(position, vec2(width + width * float(i) * 2.0, value), vec2(width, value));
	}
	color = mix(vec3(0.0, 0.5, 0.0), vec3(1.0, 0.0, 0.0), position.y);
	gl_FragColor = vec4(color * c, 1.0 );

}
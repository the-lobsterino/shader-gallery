#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//MrOMGWTF

float line(vec2 a, float rot, float height, float width, vec2 p)
{
	p = vec2(p.x * cos(rot) + p.y * -sin(rot), p.x * sin(rot) + p.y * cos(rot));
	float w = abs(a.x - p.x);
	float h = abs(a.y - p.y + height);
	w = smoothstep(width, w-width/20.0, w)*(w<width ? 1.0 : 0.0);
	h = smoothstep(height, h-height/100.0, h)*(h<height ? 1.0 : 0.0);
	return w*h;
}

void main( void )
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 );
	position.x *= resolution.x / resolution.y;
	position*=8.0;
	vec2 origin = vec2(mouse)*2.0 - 1.0;
	origin *= 5.0;
	float rot = 0.0;
	float height = 0.5;
	float width = 0.1;
	float color = 0.0;
	for(int i = 0; i < 50; i++)
	{
		color += line(origin, rot, height, width, position);
		width += 0.01;
		height += 0.05;
		rot += time*0.1;
	}
	color*=0.3;
	gl_FragColor = vec4( vec3( color ), 1.0 );

}
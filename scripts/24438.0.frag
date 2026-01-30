#ifdef GL_ES
precision mediump float;
#endif

//wip looks funky, better save it

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

void main(void)
{
	vec2 pos = ((gl_FragCoord.xy-vec2(1,0))/resolution)-0.5;
	float hist = texture2D(buf,vec2(abs(atan(pos.y,pos.x))/3.14159265, length(pos))).a;
	float new;
	if (gl_FragCoord.x < 1.0)
		new = step(mouse.x,0.5);
	else
		new = hist;
	
	vec3 color = vec3(1.0);
	gl_FragColor = vec4(color*hist, new);

}
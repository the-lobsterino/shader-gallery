#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;

float getFuncValue(float x, float y)
{
	return sin(y+time)*10.*sin(x*1.);
}

vec3 plot()
{
	float val = getFuncValue(position.x, position.y);
	float dist = 0.4/distance(position, vec2(position.x, val));
	return vec3(dist*dist*dist,dist,dist);
}

void main()
{
	float ratio = resolution.x / resolution.y;
	position = gl_FragCoord.xy/resolution;
	
	position.y = position.y * resolution.y/resolution.x+0.12;
	position.x = (position.x-1.0) * 160.0;
	position.y = (position.y - 0.5) * 100.0;
	vec3 color = vec3(0.); // VERY IMPORTANT FOR LINUX USERS
	color.g = sin(position.y*10.)*0.01;
	color += plot();
	gl_FragColor = vec4(color, 1.0);
}
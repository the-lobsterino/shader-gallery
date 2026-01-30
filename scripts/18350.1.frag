#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float radius = 0.25;
vec3 light = vec3(0,0,-1);
vec3 sphereCenter = vec3(0);


vec4 getColor(vec3 normal)
{
	light = normalize(light - sphereCenter);
	float diffuse = dot(normal, light);
	float specular = pow(diffuse, 64.0);
	vec4 color = vec4(vec3(diffuse + specular) * vec3(1.0,0.5,0.3), 1.0);
	return color;
}

void main( void )
{
	vec2 pix = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.x;
	vec3 pos = vec3(pix,-1.0);
	vec3 dir = normalize(vec3(pix.x, pix.y, 1.0));

	sphereCenter = vec3(0);//vec3(sin(time) * 0.25, sin(1.5*time) * 0.15, sin(2.5*time) * 0.3);
	light = normalize(vec3(sin(1.25*time), cos(time), -1));
	pos -= sphereCenter;

	vec4 color = vec4(0.0);

	float b = 2.0 * dot(pos,dir);
	float c = dot(pos,pos) - radius;

	float discr = b*b - 4.0*c;
	if (discr < 0.0) 
	{
		color = vec4(0,0,1,1);
	}
	else
	{
		vec2 t = vec2(-b+discr, -b-discr) / 2.0;
		vec3 p = pos + min(t.x,t.y) * dir;
		color = getColor(normalize(p));
	}

	gl_FragColor = color;
}
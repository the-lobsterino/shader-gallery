#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 road(vec3 pos)
{
	vec3 c1 = vec3(0.1,0.9,0.1);
	vec3 c2 = vec3(0.1,0.6,0.1);
	
	pos.x += 0.005*pow(pos.y,2.0);	
	
	if(abs(pos.x) < 1.0)
	{
		c1 = vec3(0.9,0.1,0.1);
		c2 = vec3(0.9,0.9,0.9);
	}
	if(abs(pos.x) < 0.9)
	{
		c1 = vec3(0.5,0.5,0.5);
		c2 = vec3(0.5,0.5,0.5);
	}
	if(abs(pos.x) < 0.04)
	{
		c1 = vec3(0.5,0.5,0.5);
		c2 = vec3(0.9,0.9,0.9);
	}
	
	float t = time * 0.1;
	
	float d = 256.0*0.5*(t - sin(t)*cos(t));
	float v = pow(sin(t),3.0);
	
	float rep = fract(pos.y+d);
	float blur = 3.0*pow(v,2.0) + dot(pos,pos)*0.05;
	vec3 ground = mix(c1,c2,smoothstep(0.25-blur*0.25,0.25+blur*0.25,rep)*smoothstep(0.75+blur*0.25,0.75-blur*0.25,rep));
	
	return ground;
}

vec3 sky(vec2 uv)
{
	return mix(vec3(1.0,1.0,1.0),vec3(0.1,0.7,1.0),uv.y);
}

void main( void ) 
{
	vec2 res = resolution.xy/resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y;
	uv -= res/2.0;
	
	vec3 pos = vec3(uv.x/abs(uv.y),1.0/abs(uv.y),step(0.0,uv.y)*2.0-1.0);
	
	vec3 color = vec3(0.0);
	
	color = mix(road(pos),sky(uv),step(0.0,pos.z));
	
	gl_FragColor = vec4(color, 1.0 );

}
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.141592653589

#define p_width2 0.05
#define p_length 0.6
#define fade_power 1.0
#define edge_roundness 2.0   // 2.0 is circle, >2.0 is more square
#define p_grad2 1.8


float wave_function(float _px)
{
	
	_px += 0.4;
	return 0.025*sin(2.0*_px + 2.0*time) + 0.025*sin(1.0*_px + 2.0*time) + 0.05*sin(8.0*(cos(4.0*time) )*(_px-0.8) + 6.0*time);
}

void main( void ) {

	
	float p_grad = p_grad2 - 0.23*sin(time) - 0.53*cos(0.75*time) + 0.23*sin(1.3*time);
	float p_width = p_width2;
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;	
	p.x *= resolution.x/resolution.y;
		
	

	
	float p_t = p.y;
	
	//p_t = p.y + 0.25*sin(2.0*p.x + 2.0*time) + 0.25*sin(8.0*p.x + 2.0*time);
	
	p_t = p.y + wave_function(p.x);
	
	
	float t = abs(p_width/ pow( p_t, fade_power));
	

	
	
	
	
	
	
	
	
	
	//t = min(abs(t * 0.1/(pow(abs(p.x), 4.0))), t);

	
	float ramp = cos(pi*p.x);

	float ramp1 = 1.0-step(p.x, -p_length);
	
	float ramp2 = step(p.x, p_length);
	
	
	t = ramp1*ramp2*t;
	
	
	
	
	
	
	vec3 col = vec3(0.0, t* (p_grad*p.x + 1.0 - p_grad*p_length), 0.0);


	
	
	//p_t = p.y + 0.5*sin(10.0*cos(time)*p.x);
	
	
	vec2 pos1 = vec2(p_length, 0.0);
	vec2 pos2 = vec2(-p_length, 0.0);
	
	
	
	pos1.y = pos1.y - wave_function(p.x);
	pos2.y = pos2.y - wave_function(p.x);
	
	
	//pos1.y = pos1.y - 0.5*sin(10.0*cos(time)*p_length);
	//pos2.y = pos2.y - 0.5*sin(10.0*cos(time)*(-1.0*p_length));
		
	
	
	
	float power = edge_roundness;
	
	
		
	float r1 = pow( ( pow((p.x-pos1.x), power) + pow((p.y-pos1.y), power) ), 1.0/power);
	
	float r2 = pow( ( pow((p.x-pos2.x), power) + pow((p.y-pos2.y), power) ), 1.0/power);
	
	
		
//	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
 
 
 
	//uv.y = abs(.05/uv.y);
 
	
	//float t = abs(.05/uv.y);
	
	
	float ramp3 = 1.0-step(p.x, p_length);
	float ramp4 = step(p.x, -p_length);
	
	float q1 = abs(p_width/pow(r1, fade_power));
	q1 = ramp3*q1;
	
	col += vec3(0.0, q1, 0.0);	
	
	float q2 = abs(p_width/pow(r2, fade_power));
	q2 = ramp4*q2;
	
	col += vec3(0.0, q2*(p_grad*p.x + 1.0 - p_grad*p_length), 0.0);
	
	q1 = abs(p_width/pow(r1, fade_power));
	q2 = abs(p_width/pow(r2, fade_power));
	
		col += vec3(0.0, 1.2*q1, 0.0);
	
	//col += vec3 (0.0, (0.1)*q2, 0.0);
	

	//col.r = 0.5*cos(time) + 0.5;
	//col.g *= (0.5*sin(time) + 0.5);
	
		gl_FragColor = vec4(col, 1.0);
	
	gl_FragColor.b = gl_FragColor.g;
	gl_FragColor.r = gl_FragColor.g;
	gl_FragColor.g = 0.0;
	
	
}


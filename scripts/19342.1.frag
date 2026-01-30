#ifdef GL_ES
precision mediump float;
#endif

#define Scale 150.0
#define Move vec2(0.0, 10.0)
#define Color1 vec4(0.0, 0.0, 0.0 ,1.0)
#define Color2 vec4(0.0, 0.0, 0.0 ,1.0)
#define Color3 vec4(1.0, 1.0, 1.0 ,1.0)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex( vec2 p, vec2 h ) 
{
	vec2 q = abs(p);
	//return (q.x-h.y,max(q.x+q.y*0.57735,q.y*1.1547)-h.x*1.05);
	//return max(q.x+q.y*0.57735,q.y*1.1547)-h.x*1.05;
	return q.x+q.y*0.57735-h.x*1.04;
}

void main( void )
{
	vec2 grid = vec2(0.692, 0.4) * Scale;
	float radius = 0.215 * Scale;
	//radius *= pow(min(1.0, max(0.0, gl_FragCoord.y-0.0)/200.0), 0.8);
	vec2 p = gl_FragCoord.xy + (Move*time);
		
	
	vec2 p1 = mod(p, grid) - grid*vec2(0.5);
	vec2 p2 = mod(p+grid*0.5, grid) - grid*vec2(0.5);
	float d1 = hex(p1, vec2(radius));
	float d2 = hex(p2, vec2(radius));
	float d = min(d1, d2);
	float c = d>0.0 ? 0.0 : 1.0;
	
	float g = max((mod(gl_FragCoord.x+gl_FragCoord.y-time*300.0, 1000.0)/200.0), 0.0);
	
	gl_FragColor = Color1*vec4(c) + max(Color2, Color3*g)*vec4(1.0-c);
}
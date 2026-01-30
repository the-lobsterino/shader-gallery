#ifdef GL_ES
precision mediump float;
#endif

#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex( vec2 p, vec2 h )
{
	vec2 q = abs(p);
	return max(q.x-h.y,max(q.x+q.y*0.57735,q.y*1.1547)-h.x);
}

void main( void ) {

	float aspect = resolution.x / resolution.y;
	float2 pos = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//pos.x *= aspect;	
	
	float2 grid = float2(0.5, 0.5) * 0.75;
	float radius = 0.22 * 0.65;
	
	float2 p1 = mod(pos, grid) - grid*float2(0.5);
	float d1 = hex(p1, float2(radius));
	float d = min(d1, d1);

	float val = smoothstep(-0.01, 0.01, d);
	float4 c = float4(val);

	
	gl_FragColor = c;
}


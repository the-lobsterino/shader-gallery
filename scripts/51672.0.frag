#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform float time;
uniform float2 mouse;
uniform float2 resolution;

const float unitXDif = 0.1;
const vec2 unitX = vec2(1.5 * unitXDif, 1.732 * 0.1 * unitXDif);
const vec2 unitY = vec2(0.0, 1.732 * unitXDif);
const vec4 onColor = vec4(0.2, 0.8, 0.8, 1.0);
const float lineThickness = 0.002;

float Hex(float2 p, float2 h)
{
	float2 q = abs(p);
	return max(q.x - h.y,max(q.x + q.y*0.57735,q.y*1.1547) - h.x);
}

float HexGrid(float3 p)
{
	float scale = 1.2;
	float2 grid = float2(0.692, 0.4) * scale;
	float radius = 0.22 * scale;

	float2 p1 = mod(p.xz, grid) - grid * 0.5;
	float c1 = Hex(p1, float2(radius, 1.0));

	float2 p2 = mod(p.xz + grid * 0.5, grid) - grid * 0.5;
	float c2 = Hex(p2, float2(radius, 0.0));
	return min(c1, c2);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.x * 1.0;
	float offX = mod(position.x, unitX.x*1.5);
	float difY = position.x * (unitX.y / unitX.x);
	float posY = position.y - difY;
	float offY = mod(posY, unitY.y);
	
	float2 points[4];
	
	
	points[0] = float2(0.0, 0.0);
	points[1] = unitX;
	points[2] = unitX + unitY;
	points[3] = unitY;
	
	float minDistance = 999.0;
	bool onGrid = false;
	int minNum = -1;
	
	
	for(int i = 0; i < 4; i++){
		float distanceX = offX - points[i].x;
		float distanceY = offY - points[i].y;
		float dis = sqrt( distanceX * distanceX + distanceY * distanceY );
		if(dis < minDistance){
			
			minDistance = dis;
			minNum = i;
		}
		if(minDistance < 0.01){
			onGrid = true;	
		}
	}
	
	for(int i = 0; i < 4; i++){
		if( i == minNum ){
			continue;	
		}
		float distanceX = offX - points[i].x;
		float distanceY = offY - points[i].y;
		float dis = sqrt( distanceX * distanceX + distanceY * distanceY );
		
		// if distances between two points and position is equal each other
		if( abs(minDistance - dis) < lineThickness ){
			onGrid = true;
		}
		
	}
	
	
	if(onGrid)
		gl_FragColor = onColor;
	//gl_FragColor = vec4(1.0,1.0,1.0,1.0) * HexGrid(float3(position.x,position.y,position.y));
}
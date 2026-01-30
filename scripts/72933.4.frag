#ifdef GL_ES
precision mediump float;
#endif

#define EPS 0.0001

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }


float sdBox( vec3 p, vec3 b )
{
 	vec3 q = abs(p) - b;
	return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}


float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float Scene(vec3 aPos)
{
	float result;
	
	result = opSubtraction(sdSphere(aPos - vec3(0.0, 0.0, 0.0), 0.6), sdBox(aPos - vec3(0.0, 0.0, 0.0), vec3(0.5, 0.5, 0.5)));
	result = min(sdBox(aPos - vec3(1.5, 0.0, 0.0), vec3(0.5, 0.5, 0.5)), result);
	result = min(sdBox(aPos - vec3(-1.5, 0.0, 0.0), vec3(0.5, 0.5, 0.5)), result);
	
	return result;
}	

vec3 Normal(vec3 aPos) 
{
	return normalize(vec3(
    	Scene(aPos + vec3(EPS,0.,0.)) - Scene(aPos - vec3(EPS,0.,0.)),
    	Scene(aPos + vec3(0.,EPS,0.)) - Scene(aPos - vec3(0.,EPS,0.)),
    	Scene(aPos + vec3(0.,0.,EPS)) - Scene(aPos - vec3(0.,0.,EPS))));
}


vec3 Raymarch(vec3 aPos, vec3 aDir)
{
	vec3 color = aPos;
	vec3 rayPos = aPos;
	
    	float dis = EPS;
    
    	for(int i = 0; i < 100; i++) 
	{                         
        	rayPos += aDir * Scene(rayPos);   
        }
	
	return abs(Normal(rayPos));
}

vec3 GetPixelCameraDir(vec3 aPos, vec3 aLookAt, vec2 aScreenPos)
{
	vec3 forward = normalize(aLookAt - aPos);
	vec3 side    = cross(vec3(0.0, 1.0, 0.0), forward);
	vec3 up      = cross(forward, side);
	
	return normalize(forward + side * aScreenPos.x + up * aScreenPos.y);
}

void main( void ) {

	vec2 screenPos = -1.0 + 2.0 * ( gl_FragCoord.xy / resolution.xy );
	screenPos.y *= -1.0;
	screenPos.x *= 1.77777778;
	
	float distance = 2.0 + sin(time);
	
	vec3 cameraPos    = vec3(cos(time) * distance, cos(time), sin(time) * distance);
	vec3 cameraLookAt = vec3(0.0, 0.0, 0.0);

	gl_FragColor = vec4(Raymarch(cameraPos, GetPixelCameraDir(cameraPos, cameraLookAt, screenPos)), 1.0);
}
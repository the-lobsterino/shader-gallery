#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float minDrawDist = 10.0;
const int   maxRayMarcs = 1000;
const float cellSize    = 1000.0;
const float ballRadius  = 150.0;

vec3 camPos;

float getDist(vec3 rayPos)
{
	
	vec3 pos = camPos + floor(abs(camPos - rayPos - ballRadius) / cellSize) * cellSize;
	
	return distance(pos, rayPos) - ballRadius;
}

vec3 getNormal(vec3 p)
{
    float d = getDist(p);
    vec2  e = vec2(0.01, 0.0);
    
    vec3 n = d - vec3(
	    getDist(p - e.xyy),
	    getDist(p - e.yxy),
	    getDist(p - e.yyx)
    );
    
    return normalize(n);
}

void main(void)
{
	vec4 outputPixel = vec4(0.0);
	
	float offset = 100.0;
	
	vec2 position = gl_FragCoord.xy + offset;
	
	camPos = vec3(
		resolution.x / 2.0, 
		resolution.y / 2.0, 
		-300.0
	);
	
	vec3 lightPos = vec3(
		resolution.x * 6.0 + sin(time) * 2000.0, 
		resolution.y * 10.0,
		cos(time) * 5000.0
	);
	    
	vec3 rayPos = vec3(position, 0.0);
	vec3 rayVec = normalize(rayPos - camPos);
	
	vec4 ballColor = vec4(1.0, 0.4, 1.0, 1.0);
	
	vec3 curRayPos = rayPos * minDrawDist;
	for (int i = 0; i < maxRayMarcs; i ++)
	{ 
		float distToBall = getDist(curRayPos);
		if (distToBall < .1)
		{
			vec3  normal = getNormal(curRayPos);
            		float light  = dot(normalize(lightPos - curRayPos), normal);
           		light = clamp(light, 0.0, 1.0) + 0.02;
			light *= 1000000.0 / pow(abs(curRayPos.z - camPos.z), 2.0);
			outputPixel = pow(light, 1.0 / 1.8) * ballColor;
			
			
			break;
	
		} else
		{
			curRayPos += rayVec * 10.0;
		}
	}
	
	
	gl_FragColor = outputPixel;

}
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p, vec3 center, float radius)
{
	return length(center - p) - radius;
}

float map(vec3 p)
{
	return min(sphere(p, vec3(0,1,6), 1.0), p.y);
}

float raymarch(vec3 rayOrigin, vec3 rayDir)
{
	float currentDistance = 0.0;
	for(int currentStep = 0; currentStep < 100; ++currentStep)
	{
		vec3 rayPos = rayOrigin + (rayDir * currentDistance);
		float stepDistance = map(rayPos);
		currentDistance += stepDistance;
			
		if(stepDistance < 0.01 || currentDistance > 100.0)
			break;
	}
	
	return currentDistance;
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy- (0.5 * resolution.xy)) / resolution.y;

	
	vec3 camPos = vec3(0,1,0);
	vec3 camDir = normalize(vec3(uv.x, uv.y, 1.0));
	float dist = raymarch(camPos, camDir);
	dist /= 6.0;
	

	vec4 finalColor = vec4(dist, dist, dist, 1.0);
	gl_FragColor = finalColor;

}
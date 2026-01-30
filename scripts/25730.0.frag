#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 pos, float radius)
{
    return length(pos) - radius;
}

float distfunc(vec3 pos)
{
    return sphere(pos, 2.22);
}

void main( void ) {

	vec3 cameraOrigin = vec3(2.0, 2.0, 2.0);
	vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
	vec3 upDirection = vec3(0.0, 1.0, 0.0);
	vec3 cameraDir = normalize(cameraTarget - cameraOrigin);
	vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
	vec3 cameraUp = cross(cameraDir, cameraRight);
	
	vec2 screenPos = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy; // screenPos can range from -1 to 1
	screenPos.x *= resolution.x / resolution.y; // Correct aspect ratio
	
	vec3 rayDir = normalize(cameraRight * screenPos.x + cameraUp * screenPos.y + cameraDir);
	
	const int MAX_ITER = 100; // 100 is a safe number to use, it won't produce too many artifacts and still be quite fast
	const float MAX_DIST = 20.0; // Make sure you change this if you have objects farther than 20 units away from the camera
	const float EPSILON = 0.001; // At this distance we are close enough to the object that we have essentially hit it
	
	float totalDist = 0.0;
	vec3 pos = cameraOrigin;
	float dist = EPSILON;
	
	for (int i = 0; i < MAX_ITER; i++)
	{	
    		// Either we've hit the object or hit nothing at all, either way we should break out of the loop
    		if (dist < EPSILON || totalDist > MAX_DIST)
        		break; // If you use windows and the shader isn't working properly, change this to continue;

    		dist = distfunc(pos+0.1*cos(dist/(sin(pos.z+time/7.)+sin(pos.z+time*1.1001234567890))-time*.11+.1*pos.x*pos.y/length(pos))); // Evalulate the distance at the current point
    		totalDist += dist;
    		pos += dist * rayDir; // Advance the point forwards in the ray direction by the distance
	}
	
	if (dist < EPSILON)
	{
    		vec2 eps = vec2(0.0, EPSILON);
		vec3 normal = normalize(vec3(
    		distfunc(pos + eps.yxx) - distfunc(pos - eps.yxx),
    		distfunc(pos + eps.xyx) - distfunc(pos - eps.xyx),
    		distfunc(pos + eps.xxy) - distfunc(pos - eps.xxy)));
		
		
		float diffuse = max(0.0, dot(-rayDir, normal));
		float specular = pow(diffuse, 1e4);
		
		vec3 color = vec3(diffuse + specular);
		gl_FragColor = vec4(color, 1.0);
	}
	else
	{
    		gl_FragColor = vec4(0.0);
	}
	
}
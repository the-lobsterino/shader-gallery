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


float smin( float a, float b)
{
    float k=0.01;
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

void main( void ) {

	vec3 cameraOrigin = vec3(2.0, 2.0, 2.0 );
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
	vec3 pos = cameraOrigin + sin(time)*cameraRight;
	float dist = EPSILON;
	
	vec2 eps = vec2(0.0, EPSILON);
	vec3 normal = normalize(vec3(
    	sphere(pos + eps.yxx,1.) - sphere(pos - eps.yxx,1.),
    	sphere(pos + eps.xyx,1.) - sphere(pos - eps.xyx,1.),
    	sphere(pos + eps.xxy,1.) - sphere(pos - eps.xxy,1.)));
	
	
	
	for (int i = 0; i < MAX_ITER; i++)
	{
	    // Either we've hit the object or hit nothing at all, either way we should break out of the loop
	    if (dist < EPSILON || totalDist > MAX_DIST)
		break; // If you use windows and the shader isn't working properly, change this to continue;
	
	    dist = sphere(pos,1.0); // Evalulate the distance at the current point
	    totalDist += dist;
	    pos += dist * rayDir; // Advance the point forwards in the ray direction by the distance
	}
	
	vec3 normal1 = normalize(vec3(
    	sphere(pos + eps.yxx,1.) - sphere(pos - eps.yxx,1.),
    	sphere(pos + eps.xyx,1.) - sphere(pos - eps.xyx,1.),
    	sphere(pos + eps.xxy,1.) - sphere(pos - eps.xxy,1.)));
	
	float dist1 = EPSILON;
        totalDist = 0.0;
	pos = cameraOrigin;
	
	for (int i = 0; i < MAX_ITER; i++)
	{
	    // Either we've hit the object or hit nothing at all, either way we should break out of the loop
	    if (dist1 < EPSILON || totalDist > MAX_DIST)
		break; // If you use windows and the shader isn't working properly, change this to continue;
	
	    dist1 = sphere(pos,1.0); // Evalulate the distance at the current point
	    totalDist += dist1;
	    pos += dist1 * rayDir; // Advance the point forwards in the ray direction by the distance
	}
	
	
	vec4 finalColor;
	
	if ( dist < EPSILON)
	{
	        float diffuse = max(0.0, dot(-rayDir, normal));
	//	Specular lighting is achieved by raising the diffuse lighting to a high power, using GLSL's built in pow function. The higher the power, the shinier the surface.
		float specular = pow(diffuse, 32.0);
	//	Now we can calculate the color by combining the two lighting methods.
		vec3 color = vec3(specular+diffuse);
		finalColor += vec4(color * vec3(1.0,0.0,0.0), 1.0);
	}
	
	/*if( dist1 < EPSILON)
	{
		float diffuse = max(0.0, dot(-rayDir, normal1));
	//	Specular lighting is achieved by raising the diffuse lighting to a high power, using GLSL's built in pow function. The higher the power, the shinier the surface.
		float specular = pow(diffuse, 32.0);
	//	Now we can calculate the color by combining the two lighting methods.
		vec3 color = vec3(specular+diffuse);
		finalColor += vec4(color * vec3(1.0,0.0,0.0), 1.0);
	}*/
	
	else
	{
	    finalColor += vec4(0.0);
	}
	
	gl_FragColor = finalColor;
	

}
// Perlin noise clouds by Omar El Sayyed.
//
// If you can't run the shader, you can watch its video here:
// http://youtu.be/SgWlpXDJ79g
//
// For more information about Perlin noise:
// http://noisemachine.com/talk1/
// http://www.facebook.com/photo.php?fbid=10152545241125170
//
// For more information about this shader (and to ask questions):
// https://www.facebook.com/groups/graphics.shaders/permalink/804483382930299/
//
// Note that this is far from optimal.
//
// Join us on our quest for learning shaders: 
// http://www.facebook.com/groups/graphics.shaders/
//
// And please like our page :P
// http://www.facebook.com/nomonesoftware


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265

//////////////////
// Perlin noise
//////////////////

//#define LINEAR_INTERPOLATION

float permutation(float index) {
	return mod(index * index, 257.0);
}

vec3 gradient(float index) {

	index = mod(index * index, 251.0);

	float angleAroundZ = mod(index, 16.0) * (2.0 * PI / 16.0);
	float angleAroundY = floor(index / 16.0) * (2.0 * PI / 16.0);

	vec3 gradient = vec3(cos(angleAroundZ), sin(angleAroundZ), 0.0);

	vec3 rotatedGradient;
	rotatedGradient.x = gradient.x * cos(angleAroundY);
	rotatedGradient.y = gradient.y;
	rotatedGradient.z = gradient.x * sin(angleAroundY);

	return rotatedGradient;
}
 
float hermit3D(vec3 position) {

	vec3 square = position * position;
	vec3 cube = square * position;

	return (3.0*square.x - 2.0*cube.x) * (3.0*square.y - 2.0*cube.y) * (3.0*square.z - 2.0*cube.z);
}

float perlinNoise3D(int gridWidth, int gridHeight, int gridDepth, vec3 position) {

	// Takes input position in the interval [0, 1] in all axes, outputs noise in the range [-1, 1].
	vec3 gridDimensions = vec3(gridWidth, gridHeight, gridDepth);
	position *= gridDimensions;

	// Get corners,
	vec3 lowerBoundPosition = floor(position);

	// Calculate gradient values!
	float gradientValues[8];
	for (float z=0.0; z<2.0; z++) {
		for (float y=0.0; y<2.0; y++) {
			for (float x=0.0; x<2.0; x++) {
				vec3 currentPointPosition = lowerBoundPosition + vec3(x, y, z);
				vec3 displacementVector = (currentPointPosition - position);
				vec3 gradientVector = gradient(mod(currentPointPosition.x + permutation(mod(currentPointPosition.y + permutation(currentPointPosition.z), 256.0)), 256.0));
				gradientValues[int((z*4.0) + (y*2.0) + x)] = (0.0 + dot(gradientVector, displacementVector)) * 2.0;
			}
		}
	}

	#ifdef LINEAR_INTERPOLATION

	// Interpolate linearly (for simplicity),
	vec3 interpolationRatio = position - lowerBoundPosition;
	float nearPlaneNoise = mix(
		mix(gradientValues[0], gradientValues[1], interpolationRatio.x),
		mix(gradientValues[2], gradientValues[3], interpolationRatio.x),
		interpolationRatio.y);
	float farPlaneNoise = mix(
		mix(gradientValues[4], gradientValues[5], interpolationRatio.x),
		mix(gradientValues[6], gradientValues[7], interpolationRatio.x),
		interpolationRatio.y);
	float finalNoise = mix(nearPlaneNoise, farPlaneNoise, interpolationRatio.z);

	#else

	// Interpolate using Hermit,
	vec3 interpolationRatio = position - lowerBoundPosition;
	float finalNoise = 0.0;
	finalNoise += gradientValues[7] * hermit3D(interpolationRatio);
	finalNoise += gradientValues[6] * hermit3D(vec3(1.0 - interpolationRatio.x,       interpolationRatio.y,       interpolationRatio.z));
	finalNoise += gradientValues[5] * hermit3D(vec3(      interpolationRatio.x, 1.0 - interpolationRatio.y,       interpolationRatio.z));
	finalNoise += gradientValues[4] * hermit3D(vec3(1.0 - interpolationRatio.x, 1.0 - interpolationRatio.y,       interpolationRatio.z));

	finalNoise += gradientValues[3] * hermit3D(vec3(      interpolationRatio.x,       interpolationRatio.y, 1.0 - interpolationRatio.z));
	finalNoise += gradientValues[2] * hermit3D(vec3(1.0 - interpolationRatio.x,       interpolationRatio.y, 1.0 - interpolationRatio.z));
	finalNoise += gradientValues[1] * hermit3D(vec3(      interpolationRatio.x, 1.0 - interpolationRatio.y, 1.0 - interpolationRatio.z));
	finalNoise += gradientValues[0] * hermit3D(vec3(1.0 - interpolationRatio.x, 1.0 - interpolationRatio.y, 1.0 - interpolationRatio.z));

	#endif

	return finalNoise;
}

//////////////////
// Clouds
//////////////////

//vec4 skyColor = vec4(0.53, 0.8, 1.0, 1.0);
vec4 skyColor = vec4(0.4, 0.65, 1.0, 1.0);

vec4 skyTexture(vec2 texCoords, float deformationSpeed) {
	
	float noise = 0.0;
	vec3 noisePoint = vec3(vec2(texCoords.x, texCoords.y+time*0.1), time*0.07*deformationSpeed);
	noise += 1.000 * perlinNoise3D(1, 1, 1, noisePoint);
	noise += 1.000 * perlinNoise3D(2, 2, 2, noisePoint);
	noise += 0.500 * perlinNoise3D(4, 4, 4, noisePoint);
	noise += 0.250 * perlinNoise3D(8, 8, 8, noisePoint);
	noise += 0.125 * perlinNoise3D(16, 16, 16, noisePoint);
	//noise += 0.0625 * perlinNoise3D(32, 32, 32, noisePoint);
	//noise += 0.03125 * perlinNoise3D(64, 64, 64, noisePoint);

	noise += 0.3;
	noise = 0.5 * max(noise, 0.0);

	if (noise < 0.5) {
		// Bright clouds,
		return vec4(mix(skyColor.rgb, vec3(1.0), noise*(1.0/0.5)), noise);
	} else {
		// Dense/dark clouds,
		vec3 cloudColor = vec3(noise);
		return vec4(0.8 + 0.2 * (1.5-cloudColor), noise);
	}	
}

//////////////////
// Scene
//////////////////

vec4 light(vec3 pointPosition, vec3 pointNormal, vec3 lightPosition, vec3 eyePosition, vec4 ambientColor, vec4 diffuseColor, vec4 specularColor, float shininess) {  
  
	vec3 L = normalize(lightPosition - pointPosition);   
	vec3 E = normalize(eyePosition - pointPosition); 
	vec3 R = normalize(-reflect(L, pointNormal));  
	
	// Calculate ambient term,
	vec4 ambient = ambientColor;
	
	// Calculate diffuse term,
	vec4 diffuse = diffuseColor * max(dot(pointNormal,L), 0.0);
	diffuse = clamp(diffuse, 0.0, 1.0);     
	
	// Calculate specular term,
	vec4 specular = specularColor * pow(max(dot(R,E),0.0),0.3*shininess);
	specular = clamp(specular, 0.0, 1.0); 
	
	return ambient + diffuse + specular;
}

float intersectPlane(vec3 rayVector, vec3 pointOnRay, vec3 planeNormal, vec3 pointOnPlane) {

	float componentInNormalDirection = dot(planeNormal, rayVector);
  
	float t = dot(planeNormal, pointOnPlane - pointOnRay) / componentInNormalDirection;
	if (t < 0.0) return 1000.0;

	return t;
}    

void main() {
 
	vec3 eyePosition = vec3(0.0, 0.0, -2.0);

	// Normalize coordinates,
	vec3 pointPosition = vec3((gl_FragCoord.xy / resolution)*2.0 - 1.0, 0.0);
	pointPosition.y *= resolution.y / resolution.x;
	pointPosition *= 1.5;

	// Raycast planes,
	// Sky,
	vec3 rayVector = pointPosition - eyePosition;  
	vec3 skyPlaneNormal = vec3(0.0, 1.0, 0.3);
	vec3 skyPointOnPlane = vec3(0.0, 40.0, 0.0);
	float skyT = intersectPlane(rayVector, eyePosition, skyPlaneNormal, skyPointOnPlane);

	// Ground,
	vec3 groundPlaneNormal = vec3(0.0, 1.0, 0.0);
	vec3 groundPointOnPlane = vec3(0.0, -5.0, 0.0);
	float groundT = intersectPlane(rayVector, eyePosition, groundPlaneNormal, groundPointOnPlane);

	float t = min(skyT, groundT);
	vec3 intersectionPoint = eyePosition + (t * rayVector);  
	
	vec3 lightPosition = vec3(35.0, 40.1, 80.0);
	vec3 normal;
	
	if (t == 1000.0) {  
		gl_FragColor = skyColor;
		return ;
	} else if (t == skyT) {
		gl_FragColor = skyTexture(intersectionPoint.xz * 0.1, 1.0);
		normal = skyPlaneNormal;
	} else {
		vec3 lightRayVector = intersectionPoint - lightPosition;  
		float skyTFromLight = intersectPlane(lightRayVector, lightPosition, skyPlaneNormal, skyPointOnPlane);
		vec3 skyLightIntersectionPoint = lightPosition + (skyTFromLight * lightRayVector);
		
		vec4 clouds = skyTexture(intersectionPoint.xz * 1.1, 10.0);
		
		//gl_FragColor = checkerBoardTexture(intersectionPoint.xz * 0.07) * (1.0 - 0.65*clouds.a);
		vec4 seaColor = vec4(0.2, 0.7, 1.0, 1.0);
		if (clouds.a > 0.5) {
			gl_FragColor = mix(seaColor, vec4(1.0), 2.0*(clouds.a-0.5));
		} else {
			gl_FragColor = mix(seaColor, vec4(0.0), 0.5-clouds.a);
		}

		normal = groundPlaneNormal;
	}
	
	// Light,
	vec4 lightColor = light(  
		intersectionPoint, normal,   
		lightPosition, eyePosition,
		vec4(0.15, 0.15, 0.15, 1.0),   
		vec4(1.0, 1.0, 1.0, 1.0),   
		vec4(0.8, 0.8, 0.8, 1.0),  
		40.0);  
        
  	gl_FragColor *= lightColor;  
	
	// Fog,
	vec4 fogColor = skyColor;
	gl_FragColor = mix(gl_FragColor, fogColor, min(t/90.0, 1.0)).zyxw;
	gl_FragColor.a = 1.0;
}
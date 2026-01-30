#extension GL_OES_standard_derivatives : disable
#define pi 3.1415926535
precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist3D(vec3 coordA, vec3 coordB) {
	float xDist = abs(coordA.x - coordB.x);
	float yDist = abs(coordA.y - coordB.y);
	float zDist = abs(coordA.z - coordB.z);

	float xyDist = sqrt(pow(xDist, 2.0) + pow(yDist, 2.0));

	return sqrt(pow(xyDist, 2.0) + pow(zDist, 2.0));
}


float rnd (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

/*
bool shade (vec3 point, vec3 lightSource) {
	
	bool inShade = false;
	
	const float dist = 0.1;dist3D(point, lightSource);
	
	float stepSize = 0.12;
	
	float xStep = (lightSource.x - point.x) / 100.0;
	float yStep = (lightSource.y - point.y) / 100.0;
	float zStep = (lightSource.z - point.z) / 100.0;
	
	
	for (float i = 0.0; i < dist; i += stepSize) {
		if (!inShade) {
			vec3 rayPos = vec3(point.x + (xStep * i), point.y + (yStep * i), point.z + (zStep * i));
			inShade = true;
		}
		
	}
	
	
	return (inShade);
}
*/




// same as cube except the size in the y direction is fixed
vec4 plane (vec3 corner, float width, float height, float rot, vec3 rayPos, vec3 col, float steps) {
	vec3 cor = vec3(corner.x, corner.y, corner.z);
	bool inX = rayPos.x > cor.x && rayPos.x < cor.x + width;
	bool inY = rayPos.y > cor.y && rayPos.y < cor.y + 0.01;
	bool inZ = rayPos.z > cor.z && rayPos.z < (cor.z + height * (resolution.y / resolution.x));

	float depth = clamp(300.0 / pow(steps, 2.0), 0.2, 1.0);

	float edgeSize = 0.01;

	if (inX && inY && inZ) {
		bool edgeX = (cor.x < rayPos.x && rayPos.x < cor.x + edgeSize);
		bool edgeY = (cor.y < rayPos.y && rayPos.y < cor.y + edgeSize);
		bool edgeZ = (cor.z < rayPos.z && rayPos.z < cor.z + edgeSize);


		if (edgeX && edgeY || edgeX && edgeZ || edgeZ && edgeY) {
			return vec4(vec3(1.0), depth);
		}
		
		return vec4(col, depth);

	}
	
	else {
		return vec4(vec3(0.1), depth);
	}
}

vec4 sphere (vec3 center, float radius, float rot, vec3 rayPos, vec3 col, float steps) {
	
	bool inSphere = (dist3D(center, rayPos) <= radius); // if the ray is in the sphere

	float depth = clamp(300.0 / pow(steps, 2.0), 0.2, 1.0);
	
	if (inSphere) {
			return vec4(vec3(col), depth);
	}
	
	else {
		return vec4(vec3(0.1), depth);
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////


vec4 box (vec3 corner, float size, float rot, vec3 rayPos, vec3 col, float steps) {
	
	vec3 cor = vec3(corner.x , corner.y, corner.z);
	float newZ = cor.z + size * sin(rot);
	
	bool inX;
	bool inZ;

	float minX = cor.x - abs(size * sin(rot));
	float maxX = cor.x + abs(size * cos(rot));
	
	float minZ = cor.z - abs(size * cos(rot));
	float maxZ = cor.z + abs(size * sin(rot));
	
	inX = minX < rayPos.x && rayPos.x < maxX;
	inZ = minZ < rayPos.z && rayPos.z < maxZ;

	

	
	// checks if the ray is in the bouneries of a box

	bool inY = rayPos.y > cor.y && rayPos.y < cor.y + size;

	float depth = clamp(300.0 / pow(steps, 2.0), 0.2, 1.0); // makes things far away look darker

	float edgeSize = 0.01;

	if (inX && inY && inZ) {
		bool edgeX = (cor.x < rayPos.x && rayPos.x < cor.x + edgeSize);
		bool edgeY = (cor.y < rayPos.y && rayPos.y < cor.y + edgeSize);
		bool edgeZ = (cor.z < rayPos.z && rayPos.z < cor.z + edgeSize);


		if (edgeX && edgeY || edgeX && edgeZ || edgeZ && edgeY) { // detects edge
			return vec4(vec3(1.0), depth);
		}
		
		return vec4(col, depth);

	}
	
	else {
		return vec4(vec3(0.1), depth);
	}
}

void main(void) {
	vec4 camPos = vec4(vec3(0.0, 1.5, -2.0), 0.0);
	vec4 boxCorner1 = vec4(vec3(0.0, 0.0, 0.5), time); //x, y, z, rotation
	float rxry = resolution.x / resolution.y;
	vec2 st = gl_FragCoord.xy / resolution.xy;
	st.x *= rxry;

	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	
	vec3 col;
	
	vec3 light = vec3(1.0, 2.0, 0.0);
	
	
	
	
	vec4 planeCorner1 = vec4(vec3(-2.0, -0.35, 1.0), 0.0);
	
	vec4 sphereCenter = vec4(vec3(0.0, 0.0, 2.0), 0.0);
	
	// different colours
	vec3 red = vec3(0.92, 0.25, 0.2);
	vec3 green = vec3(44.0 / 255.0, 209.0 / 255.0, 58.0 / 255.0);
	vec3 blue = vec3(57.0 / 255.0, 123.0 / 255.0, 230.0 / 255.0);
	vec3 white = vec3(1.0, 1.0, 1.0);
	
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	
	const float rayStepSize = 0.12;
	const float steps = 60.0;

	bool inObj = false;
	
	for (float i = 0.0; i < steps; i += rayStepSize) {
		if (!inObj) {
			vec3 rayPos = vec3(camPos.x + ((st.x - (rxry / 2.0)) * rayStepSize * i), camPos.y + ((st.y - 0.5) * rayStepSize * i), camPos.z + (rayStepSize * i));
			// the ray tavels based on the pixel 
			
			vec4 box1 = box(boxCorner1.xyz, 1.0, boxCorner1.w, rayPos, blue, i);
			col = max(box1.xyz * box1.w, col);
			
			vec4 plane1 = plane(planeCorner1.xyz, 4.0, 4.0, planeCorner1.w, rayPos, red, i);
			col = max(plane1.xyz * plane1.w, col);
			
			vec4 sphere1 = sphere(sphereCenter.xyz, 0.5, sphereCenter.w, rayPos, green, i);
			col = max(sphere1.xyz * sphere1.w, col);
			

			if (col != vec3(0.1)) { //makes the ray stop after it his an object
				inObj = true;

			} 

		}

	}

	gl_FragColor = vec4(col, 1.0);

}
#extension GL_OES_standard_derivatives : enable

#define TIMESCALE 	2.0		
#define PI 		3.141592653589793
#define FPS 		60.0 	// Frames per second ( for tail, higher - better )
#define TAIL 		1.0 	// How many seconds tail is shown
#define CAMERA_DIST	5.0 	// Distance between spheres and camera ( or camera z coord )
#define DISK_RADIUS	0.75 	// Radius of the disk on which the spheres rotate

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 point(vec2 uv, vec3 pos) {
	vec3 sphereColor = vec3(0.5, 0.5, 1.0);
	vec3 bloomColor = vec3(0.2, 0.5, 1.0);
	
	float distr1 = 1.0 - distance(uv * pos.z * 6.0, pos.xy * 6.0);
	float distr2 = 1.0 - distance(uv * pos.z * 3.0, pos.xy * 3.0);
	
	vec3 color = sqrt((pow(max(distr1 + 0.5, 0.0), 7.0)) * sphereColor);
	vec3 bloom = (pow(max(distr2, 0.0), 2.0) * bloomColor);
	
	return color + bloom;
}

float lerp(float a, float b, float i) {
	return a + (b - a) * i;
}

vec3 scene(vec2 uv, float t) {
	vec3 color = vec3(0.0);
	
	vec3 camera = vec3(0.0, 0.0, CAMERA_DIST);
	
	for(float i = 0.0; i < 7.0; i++) {
		float angle = 0.0;
		int currentAnimation = int(mod(t * TIMESCALE * 0.5, 8.0 * 8.0) / 8.0);
		float at = mod(t * TIMESCALE * 0.5, 8.0);
		
		if(mod(float(currentAnimation), 2.0) == 0.0) {
			angle = i / 7.0 * PI * 2.0;
		} else if(currentAnimation == 1) {
			float x = i;
			
			if(x <= 2.0) {
				if(at < 4.0)
					x = lerp(x, 1.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 1.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			} else {
				if(at < 4.0)
					x = lerp(x, 5.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 5.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			}
			
			angle = x / 7.0 * PI * 2.0;
		} else if(currentAnimation == 3) {
			float x = i;
			
			if(x <= 2.0) {
				if(at < 4.0)
					x = lerp(x, 1.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 1.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			} else if(x == 4.0) {
				if(at < 4.0)
					x = lerp(x, 3.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 3.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			} else if(x == 6.0) {
				if(at < 4.0)
					x = lerp(x, 5.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 5.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			}
			
			angle = x / 7.0 * PI * 2.0;
		} else if(currentAnimation == 5) {
			float x = i;
			
			if(x == 0.0 || x == 1.0) {
				if(at < 4.0)
					x = lerp(x, 0.5, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 0.5, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			} else if(x == 2.0 || x == 3.0) {
				if(at < 4.0)
					x = lerp(x, 2.5, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 2.5, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			} else if(x == 5.0 || x == 6.0) {
				if(at < 4.0)
					x = lerp(x, 6.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 6.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			} else {
				if(at < 4.0)
					x = lerp(x, 4.0, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
				else
					x = lerp(x, 4.0, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			}
			
			angle = x / 7.0 * PI * 2.0;
		} else if(currentAnimation == 7) {
			float x = i;
			
			if(at < 4.0)
				x = lerp(x, 3.5, lerp(0.0, 1.0, min(at, 2.0) / 2.0));
			else
				x = lerp(x, 3.5, lerp(1.0, 0.0, max(at - 6.0, 0.0) / 2.0));
			
			angle = x / 7.0 * PI * 2.0;
		}
		
		vec3 pos = vec3(sin(angle), cos(angle), 0.0) * DISK_RADIUS;
		
		mat4 spheresRotation = rotationMatrix(vec3(0.0, 0.0, -1.0), t * TIMESCALE);
		mat4 diskRotation = rotationMatrix(vec3(1.0, 0.0, 0.0), t * TIMESCALE);
		
		pos = (vec4(pos, 1.0) * spheresRotation).xyz;
		pos = (vec4(pos, 1.0) * diskRotation).xyz;
		
		color += point(uv, pos + camera);
	}
	
	return color;
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy - resolution.xy * 0.5 ) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0);
	
	if(length(position) < 1.0 / (CAMERA_DIST / DISK_RADIUS * 0.5)) {
		for(float t = 0.0; t < TAIL * FPS; t++) {
			float i = 1.0 - t / (TAIL * FPS);
			
			vec3 sphere = scene(position, time - t / FPS) * i * i * 0.1 * 60.0;
			sphere.r = max(sphere.r, 0.0);
			sphere.g = max(sphere.g, 0.0);
			sphere.b = max(sphere.b, 0.0);
			
			color += sphere;
		}
		
		color /= FPS;
	}

	gl_FragColor = vec4( color, 1.0 );

}
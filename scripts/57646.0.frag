precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	// "Struggling with Shader Math" by dtinth
	// Video recording: https://www.facebook.com/dtinth/videos/10212898858220403/

	vec2 position = ((gl_FragCoord.xy / resolution.xy) - 0.5) * resolution.xy / resolution.xx * 2.;
	float color = mod(5. * (position.x + position.y), 1.);

	// Ray initialization
	position *= 4.5;
	
	// TODO: Figure out how to do orthographic projection properly..............
	vec3 rayOrigin = vec3(10.,10.,10.) + vec3(position.x,position.y*1.71,-position.x);
	vec3 rayDirection = normalize(vec3(-1., -1., -1.));
	vec3 planeNormal = normalize(vec3(1., 1., 1.));

	// Ray marching
	vec3 rayPosition = rayOrigin;
	color = 0.;
	for (float i = 0.; i < 100.; i++) {
		if (rayPosition.x + rayPosition.y + rayPosition.z >= 0.01) {
			float distanceFromPlane = abs(dot(rayPosition, planeNormal));
			rayPosition += rayDirection * (distanceFromPlane + 0.);
		} else {
			float dx = rayPosition.x - floor(rayPosition.x);
			float dy = rayPosition.y - floor(rayPosition.y);
			float dz = rayPosition.z - floor(rayPosition.z);
			bool usable = floor(rayPosition.x) + floor(rayPosition.y) + floor(rayPosition.z) == -2.;
			float index = mod(floor(rayPosition.x), 2.);
			float currentMin = 10.;
			if (dx < currentMin) {
				color = 0.3; 
				currentMin = dx;
			}
			if (dy < currentMin) {
				color = index == 0. ? 1. : 0.6;
				currentMin = dy;
			}
			if (dz < currentMin) {
				color = index == 0. ? 0.6 : 1.;
				currentMin = dz;
			}
			rayPosition += rayDirection * currentMin;
			if (min(min(dx, dy), dz) < 0.00001) {
				if (!usable) {
					rayPosition += rayDirection * 0.00001;
				} else {
					break;
				}
			}
		}
	}

	if (color < 0.05) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.);
	} else if (color < 0.50) {
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1.);
	} else if (color < 0.75) {
		gl_FragColor = vec4(0.8, 1.0, 0.5, 1.);
	} else {
		gl_FragColor = vec4(1., 1., 1., 1.);
	}

	// gl_FragColor.gb = position;
}









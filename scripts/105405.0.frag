#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SPEED 1.0

float map(float value, float start1, float stop1, float start2, float stop2){
	return clamp((value - start1) / (stop1 - start1), 0.0, 1.0) * (stop2 - start2) + start2;
	return smoothstep(start1, stop1, value) * (stop2 - start2) + start2;
}

void main( void ) {
	vec2 p = vec2( gl_FragCoord.y / resolution.x, gl_FragCoord.x / resolution.y );
	p -= 0.5;
	p *= 5055557.0;
	//p = vec2(p.x * resolution.x/3 / resolution.y/2, p.y);
	p = vec2(p.y / resolution.x, p.x / resolution.y);
	
	float dist = sqrt(p.x * p.x + p.y * p.y);
	
	vec3 color;
	
	float pixelsize = 2.0 / resolution.y;
	float offset = time + sin(time * 2.0) * 0.5;
	float radius2 = 0.6;
	float radius1 = radius2 - pixelsize;
	
	float z = sqrt(abs(radius2 * radius2 - dist * dist));
	
	float occluded = abs(1.0 - map(dist, radius1, radius2, 0.0, 1.0));
	
	float angle = time * 0.5;
//	vec3 lightDir = normalize(vec3(cos(angle), sin(angle), 0.8 + 0.2 * sin(angle * 0.25)));
	vec3 normal = normalize(vec3(p, z));
//	float lightFactor = dot(lightDir, normal);


	mat3 rotationMatrix = mat3( cos(angle), -sin(angle), 0.0, sin(angle), cos(angle), 0.0, 0.0, 0.0, 1.0);
	normal *= rotationMatrix;	
	
	// color = vec3(lightFactor);
	// color *= occluded;
	color = 0.5 + 0.5 * normal;
	
	gl_FragColor = vec4 ( color, 1.0 );
}


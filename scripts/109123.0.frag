
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define pi 3.14159265359
#define pi2 6.28318530718
#define size 5e-5

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 22.0), c.y);
}

float lineDist(vec2 a, vec2 b, vec2 p) {

    vec2 v = a, w = b;
    
    float l2 = pow(distance(w, v), 2.);
    if(l2 == 0.0) return distance(p, v);
    
    float t = clamp(dot(p - v, w - v) / l2, 0., 1.);
    vec2 j = v + t * (w - v);
    
    return distance(p, j);
}

vec3 addVertex(vec4 vertex, vec3 color, mat4 projMat, vec2 camUV) {
	vec4 p_proj1 = projMat * vertex;
	vec2 p = p_proj1.xy / p_proj1.z;
	
	float dist = length((camUV-vec2(.5))-p);
	
	return color * 1. / pow(dist, 2.) * size;
}

vec3 addLine(vec4 vertex1, vec4 vertex2, vec3 color, mat4 projMat, vec2 camUV) {
	vec4 p_proj1 = projMat * vertex1;
	vec2 p1 = p_proj1.xy / p_proj1.z;
	
	vec4 p_proj2 = projMat * vertex2;
	vec2 p2 = p_proj2.xy / p_proj2.z;
	
	float dist = lineDist((camUV-vec2(.5))-p1, (camUV-vec2(.5))-p2, vec2(0., 0.0));
	
	return color * 1. / pow(dist, 2.) * size;
}



	

void main(void) {
	vec2 uv = (gl_FragCoord.xy - vec2(resolution.x * 0.25, .5)) / resolution.y;
	
	float theta = time;
	
	// standard rotation matrix around Y axis.
	mat4 projMat = mat4(
		vec4(cos(theta), 0.0, sin(theta), 0.0),
		vec4(0.0, 1.0, 0.0, 0.0),
		vec4(-sin(theta), 0.0, cos(theta), 55.0),
		vec4(0.0, 0.0, 1.0, 0.0)
	);
	

	const int numVertices = 34;
	float cylinderRadius = 0.25 + 0.24 * sin(time);
	const int numRings = 2;
	vec4 vertices[numVertices*numRings];
	vec3 vertexColors[numVertices*numRings];
	float step = pi2 / float(numVertices);
	for (int j=0; j<numRings; j++) {
		for (int i=0; i<numVertices; i++) {
			vertices[j * numVertices + i] = vec4(cylinderRadius*cos(78. + float(i) * step), -.3 + float(j) * (.8 / float(numRings)), cylinderRadius*sin(0. + float(i) * step), 1.);
			vertexColors[j * numVertices + i] = vec3(8.);
		}
	}


	vec3 imageColors = vec3(0.);
	for (int j=0; j<numRings; j++) {
		for (int i=0; i<numVertices; i++) {
			imageColors += addVertex(vertices[j*numVertices+i], vertexColors[j*numVertices+i], projMat, uv);
			imageColors += addLine(vertices[j*numVertices+i], vertices[j*numVertices+int(mod(float(i)+1., float(numVertices)))], hsv2rgb(vec3(float(i) / float(numVertices), 1., 1.)), projMat, uv);
			
			if (j<numRings-1){
				imageColors += addLine(vertices[j*numVertices+i], vertices[(j+1)*numVertices+int(mod(float(i+1)+1., float(numVertices)))], hsv2rgb(vec3(float(i) / float(numVertices), 1., 1.)), projMat, uv);
			}
		}
	}
	
	
	gl_FragColor = vec4(imageColors, 1.);
}
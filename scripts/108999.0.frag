
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

#define pi 3.14159265359
#define pi2 6.28318530718
#define size 2e-4

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
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
	
	return color * 1. / pow(dist, 2.0001) * size;
}



	

void main(void) {
	vec2 uv = (gl_FragCoord.xy - vec2(resolution.x * 0.25, .5)) / resolution.y;
	
	float theta = time*0.1;
	
	// standard rotation matrix around Y axis.
	mat4 projMat = mat4(
		vec4(cos(theta), 0.0, sin(theta), 0.0),
		vec4(0.0, 1.0, 0.0, 0.0),
		vec4(-sin(theta), 0.0, cos(theta), 0.0),
		vec4(0.0, 0.0, 1.0, 0.0)
	);

	
	
	vec3 imageColors = vec3(0.);
	vec3 green = vec3(0.0, 0.2, 0.);
	vec3 brown = vec3(0.5, 0.1, 0.);
	float height = .7;
	float width = .8;
	float trunkThickness = 0.05;
	
	// tree points
	imageColors += addVertex(vec4(width * 0.0, -.3 + height * 1.0, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * 0.12, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * 0.02, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * 0.24, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * 0.08, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * 0.36, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * trunkThickness, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(width * trunkThickness, -.3 + height * 0.0, 0., 1.), brown, projMat, uv);
	imageColors += addVertex(vec4(-width * 0.12, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(-width * 0.02, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(-width * 0.24, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(-width * 0.08, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(-width * 0.36, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(-width * trunkThickness, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addVertex(vec4(-width * trunkThickness, -.3 + height * 0.0, 0., 1.), brown, projMat, uv);
	
	// light points
	imageColors += addVertex(vec4(width * 0.02, -.3 + height * 0.85, 0., 1.), hsv2rgb(vec3(fract(time*0.05), 1., 1.)), projMat, uv);
	imageColors += addVertex(vec4(-width * 0.05, -.3 + height * 0.65, 0., 1.), hsv2rgb(vec3(fract(time*0.071+.5), 1., 1.)), projMat, uv);
	imageColors += addVertex(vec4(width * 0.07, -.3 + height * 0.58, 0., 1.), hsv2rgb(vec3(fract(time*0.066+.2), 1., 1.)), projMat, uv);
	imageColors += addVertex(vec4(-width * 0.081, -.3 + height * 0.35, 0., 1.), hsv2rgb(vec3(fract(time*0.062+.25), 1., 1.)), projMat, uv);
	imageColors += addVertex(vec4(width * 0.12, -.3 + height * 0.31, 0., 1.), hsv2rgb(vec3(fract(time*0.042+.87), 1., 1.)), projMat, uv);
	
	// tree outline connections
	imageColors += addLine(vec4(width * 0.0, -.3 + height * 1.0, 0., 1.), vec4(width * 0.12, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(width * 0.12, -.3 + height * 0.8, 0., 1.), vec4(width * 0.02, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(width * 0.02, -.3 + height * 0.8, 0., 1.), vec4(width * 0.24, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(width * 0.24, -.3 + height * 0.5, 0., 1.), vec4(width * 0.08, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(width * 0.08, -.3 + height * 0.5, 0., 1.), vec4(width * 0.36, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(width * 0.36, -.3 + height * 0.2, 0., 1.), vec4(width * trunkThickness, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(width * trunkThickness, -.3 + height * 0.2, 0., 1.), vec4(width * trunkThickness, -.3 + height * 0.0, 0., 1.), brown, projMat, uv);
	imageColors += addLine(vec4(-width * 0.0, -.3 + height * 1.0, 0., 1.), vec4(-width * 0.12, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(-width * 0.12, -.3 + height * 0.8, 0., 1.), vec4(-width * 0.02, -.3 + height * 0.8, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(-width * 0.02, -.3 + height * 0.8, 0., 1.), vec4(-width * 0.24, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(-width * 0.24, -.3 + height * 0.5, 0., 1.), vec4(-width * 0.08, -.3 + height * 0.5, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(-width * 0.08, -.3 + height * 0.5, 0., 1.), vec4(-width * 0.36, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(-width * 0.36, -.3 + height * 0.2, 0., 1.), vec4(-width * trunkThickness, -.3 + height * 0.2, 0., 1.), green, projMat, uv);
	imageColors += addLine(vec4(-width * trunkThickness, -.3 + height * 0.2, 0., 1.), vec4(-width * trunkThickness, -.3 + height * 0.0, 0., 1.), brown, projMat, uv);
	imageColors += addLine(vec4(width * trunkThickness, -.3 + height * 0.0, 0., 1.), vec4(-width * trunkThickness, -.3 + height * 0.0, 0., 1.), brown, projMat, uv);
	
	
	
	gl_FragColor = vec4(imageColors, 1.);
}
//r33v01v3 2020

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define pi 3.14159265359
#define pi2 6.28318530718
#define size 0.00005

float lineDist(vec2 a, vec2 b, vec2 p) {

    vec2 v = a, w = b;
    
    float l2 = pow(distance(w, v), 2.);
    if(l2 == 0.0) return distance(p, v);
    
    float t = clamp(dot(p - v, w - v) / l2, 0., 1.);
    vec2 j = v + t * (w - v);
    
    return distance(p, j);
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
	
	float theta = time*0.2;
	
	// standard rotation matrix around Y axis.
	mat4 projMat = mat4(
		vec4(cos(theta), 0.0, sin(theta), 0.0),
		vec4(0.0, 1.0, 0.0, 0.0),
		vec4(-sin(theta), 0.0, cos(theta), 0.0),
		vec4(0.0, 0.0, 1.5, 0.0)
	);

	vec3 imageColors = vec3(0.);
	vec3 green = vec3(0.0, 0.1, 0.0);
	vec3 blue = vec3(0.0, 0.0, 0.3);
	vec3 yel = vec3(0.1, 0.1, 0.0);


	float gz = 0.4, bx = 0.4;
	for(int i = 0; i <2 ; i++){

		imageColors += addLine(vec4( -0.39, -0.4, gz, 1.), vec4(-0.39, 0.4, gz, 1.), green, projMat, uv);
		imageColors += addLine(vec4( -0.39, 0.4, gz, 1.), vec4(-0.2, 0.4, gz, 1.), green, projMat, uv);
		imageColors += addLine(vec4( 0.2, 0.4, gz, 1.), vec4(0.39, 0.4, gz, 1.), green, projMat, uv);
		imageColors += addLine(vec4( 0.39, 0.4, gz, 1.), vec4(0.39, -0.4, gz, 1.), green, projMat, uv);
		imageColors += addLine(vec4( 0.20, -0.4, gz, 1.), vec4(0.39, -0.4, gz, 1.), green, projMat, uv);
		imageColors += addLine(vec4( -0.39, -0.4, gz, 1.), vec4(-0.2, -0.4, gz, 1.), green, projMat, uv);
		imageColors += addLine(vec4( bx, -0.4, -0.39, 1.), vec4(bx, 0.4, -0.39, 1.), blue, projMat, uv);
		imageColors += addLine(vec4(bx, 0.4, -0.39, 1.), vec4(bx, 0.4, -0.2, 1.), blue, projMat, uv);
		imageColors += addLine(vec4( bx, 0.4, 0.2, 1.), vec4(bx, 0.4, 0.39, 1.), blue, projMat, uv);
		imageColors += addLine(vec4( bx, 0.4, 0.39, 1.), vec4(bx, -0.4, 0.39, 1.), blue, projMat, uv);
		imageColors += addLine(vec4( bx, -0.4, 0.2, 1.), vec4(bx, -0.4, 0.39, 1.), blue, projMat, uv);
		imageColors += addLine(vec4( bx, -0.4, -0.39, 1.), vec4(bx, -0.4, -0.2, 1.), blue, projMat, uv);
		
		if (sign(gz) == 1.0){
			imageColors += addLine(vec4( -0.2, -0.1, gz, 1.), vec4(0.2, 0.4, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( 0.2, -0.4, gz, 1.), vec4(0.2, 0.1, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( -0.2, -0.4, gz, 1.), vec4(0.2, 0.1, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( -0.2, 0.4, gz, 1.), vec4(-0.2, -0.1, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( bx, 0.4, -0.2, 1.), vec4(bx, -0.1, 0.2, 1.), blue, projMat, uv);
			imageColors += addLine(vec4( bx, 0.4, 0.2, 1.), vec4(bx, -0.1, 0.2, 1.), blue, projMat, uv);
			imageColors += addLine(vec4( bx, 0.1, -0.2, 1.), vec4(bx, -0.4, 0.2, 1.), blue, projMat, uv);
			imageColors += addLine(vec4( bx, 0.1, -0.2, 1.), vec4(bx, -0.4, -0.2, 1.), blue, projMat, uv);
		}else{
			imageColors += addLine(vec4( -0.2, 0.4, gz, 1.), vec4(0.2, -0.1, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( 0.2, 0.4, gz, 1.), vec4(0.2, -0.1, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( -0.2, 0.1, gz, 1.), vec4(0.2, -0.4, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( -0.2, 0.1, gz, 1.), vec4(-0.2, -0.4, gz, 1.), green, projMat, uv);
			imageColors += addLine(vec4( bx, -0.1, -0.2, 1.), vec4(bx, 0.4, 0.2, 1.), blue, projMat, uv);
			imageColors += addLine(vec4( bx, 0.1, 0.2, 1.), vec4(bx, -0.4, 0.2, 1.), blue, projMat, uv);
			imageColors += addLine(vec4( bx, -0.4, -0.2, 1.), vec4(bx, 0.1, 0.2, 1.), blue, projMat, uv);
			imageColors += addLine(vec4( bx, 0.4, -0.2, 1.), vec4(bx, -0.1, -0.2, 1.), blue, projMat, uv);
		}
		
		
		gz *= -1.0;
		bx *= -1.0;
	}
	
	float yy = 0.42;
	for(int i = 0; i <2 ; i++){
		
		imageColors += addLine(vec4( -0.39, yy, 0.39, 1.), vec4(-0.21,yy, 0.39, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.39, yy, 0.21, 1.), vec4(-0.21, yy, 0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.39, yy, 0.39, 1.), vec4(-0.39, yy, 0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.21, yy, 0.39, 1.), vec4(-0.21, yy, 0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.39, yy, 0.39, 1.), vec4(0.21,yy, 0.39, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.39, yy, 0.21, 1.), vec4(0.21, yy, 0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.39, yy, 0.39, 1.), vec4(0.39, yy, 0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.21, yy, 0.39, 1.), vec4(0.21, yy, 0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.39, yy, -0.39, 1.), vec4(-0.21,yy, -0.39, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.39, yy, -0.21, 1.), vec4(-0.21, yy, -0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.39, yy, -0.39, 1.), vec4(-0.39, yy, -0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( -0.21, yy, -0.39, 1.), vec4(-0.21, yy, -0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.39, yy, -0.39, 1.), vec4(0.21,yy, -0.39, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.39, yy, -0.21, 1.), vec4(0.21, yy, -0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.39, yy, -0.39, 1.), vec4(0.39, yy, -0.21, 1.), yel, projMat, uv);
		imageColors += addLine(vec4( 0.21, yy, -0.39, 1.), vec4(0.21, yy, -0.21, 1.), yel, projMat, uv);
		
		yy *= -1.0;
	}

	
	
	
	gl_FragColor = vec4(imageColors, 1.);
}
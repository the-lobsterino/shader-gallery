#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define lineCap 1
#define lineWidth 1.

#define pos gl_FragCoord.xy

#define PI (atan(1.) * 4.)

mat4 mat;

void drawLine(vec2 p1, vec2 p2){
   	vec2 delta = p2 - p1;
	float len = length(delta);
	float dist = abs(delta.y * pos.x - delta.x * pos.y + p2.x * p1.y - p2.y * p1.x) / len;
	
	vec2 center = (p1 + p2) / 2.;
	vec2 perp2 = vec2(center.y - p1.y, p1.x - center.x) + center;
	
	float cDist = abs((perp2.y - center.y) * pos.x - (perp2.x - center.x) * pos.y + perp2.x * center.y - perp2.y * center.x) / len * 4.;
	
	if (cDist > len){
		if (lineCap == 1){
		    dist = min(length (p1 - pos), length (p2 - pos)) - lineWidth;
		}else{
		    dist = max(dist - lineWidth, cDist - len);
		}
	}else{
		dist -= lineWidth;
	}
	
	gl_FragColor = mix(gl_FragColor, vec4(1), 1. - clamp(dist, 0., 1.));
}

void drawLine(vec4 p1, vec4 p2){
	p1 = mat * p1 - vec4(0, 0, -3, -3);
	p2 = mat * p2 - vec4(0, 0, -3, -3);
	
	vec2 p21 = p1.xy / (p1.z * p1.w);
	vec2 p22 = p2.xy / (p2.z * p2.w);
	
	p21 = (p21 / 2. + .5) * resolution;
	p22 = (p22 / 2. + .5) * resolution;
	
	drawLine(p21, p22);
}

void main( void ) {
	gl_FragColor = vec4(vec3(cos(PI)), 1);
	
	float fov = PI / 2.;
	float aspect = resolution.x / resolution.y;
	
	float f = 1. / tan(fov / 2.);
	
	mat = mat4(
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, -1, 0,
		0, 0, 0, -1
	);
	
	mat *= mat4(
		cos(time), 0, sin(time), 0,
		0, 1, 0, 0,
		-sin(time), 0, cos(time), 0,
		0, -sin(time), 0, cos(time)
	);
	
	drawLine(vec4(1, 1, 1, -1), vec4(1, -1, 1, -1));
	drawLine(vec4(-1, -1, 1, -1), vec4(1, -1, 1, -1));
	drawLine(vec4(-1, -1, 1, -1), vec4(-1, 1, 1, -1));
	drawLine(vec4(1, 1, 1, -1), vec4(-1, 1, 1, -1));
	
	drawLine(vec4(1, 1, -1, -1), vec4(1, -1, -1, -1));
	drawLine(vec4(-1, -1, -1, -1), vec4(1, -1, -1, -1));
	drawLine(vec4(-1, -1, -1, -1), vec4(-1, 1, -1, -1));
	drawLine(vec4(1, 1, -1, -1), vec4(-1, 1, -1, -1));
	
	drawLine(vec4(1, 1, 1, -1), vec4(1, 1, -1, -1));
	drawLine(vec4(1, -1, 1, -1), vec4(1, -1, -1, -1));
	drawLine(vec4(-1, 1, 1, -1), vec4(-1, 1, -1, -1));
	drawLine(vec4(-1, -1, 1, -1), vec4(-1, -1, -1, -1));
	
	drawLine(vec4(1, 1, 1, 1), vec4(1, -1, 1, 1));
	drawLine(vec4(-1, -1, 1, 1), vec4(1, -1, 1, 1));
	drawLine(vec4(-1, -1, 1, 1), vec4(-1, 1, 1, 1));
	drawLine(vec4(1, 1, 1, 1), vec4(-1, 1, 1, 1));
	
	drawLine(vec4(1, 1, -1, 1), vec4(1, -1, -1, 1));
	drawLine(vec4(-1, -1, -1, 1), vec4(1, -1, -1, 1));
	drawLine(vec4(-1, -1, -1, 1), vec4(-1, 1, -1, 1));
	drawLine(vec4(1, 1, -1, 1), vec4(-1, 1, -1, 1));
	
	drawLine(vec4(1, 1, 1, 1), vec4(1, 1, -1, 1));
	drawLine(vec4(1, -1, 1, 1), vec4(1, -1, -1, 1));
	drawLine(vec4(-1, 1, 1, 1), vec4(-1, 1, -1, 1));
	drawLine(vec4(-1, -1, 1, 1), vec4(-1, -1, -1, 1));
	
	drawLine(vec4(1, 1, 1, -1), vec4(1, 1, 1, 1));
	drawLine(vec4(-1, 1, 1, -1), vec4(-1, 1, 1, 1));
	drawLine(vec4(-1, -1, 1, -1), vec4(-1, -1, 1, 1));
	drawLine(vec4(1, -1, 1, -1), vec4(1, -1, 1, 1));
	
	drawLine(vec4(1, 1, -1, -1), vec4(1, 1, -1, 1));
	drawLine(vec4(-1, 1, -1, -1), vec4(-1, 1, -1, 1));
	drawLine(vec4(-1, -1, -1, -1), vec4(-1, -1, -1, 1));
	drawLine(vec4(1, -1, -1, -1), vec4(1, -1, -1, 1));
}
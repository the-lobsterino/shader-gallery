#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// NDC
float X = -0.5;
float Y = 0.0;
float X2 = 0.5;
float Y2 = 0.0;

// pixel units
float radius = 100.0;
float radius2 = 100.0;

float color = 0.0;
float color2 = 0.0;

void main( void ) {
	X = (X + 1.0) * (resolution.x/2.0);
	Y = (Y + 1.0) * (resolution.y/2.0);
	
	float dist = sqrt(((gl_FragCoord.x - X)*(gl_FragCoord.x - X)) + ((gl_FragCoord.y - Y)*(gl_FragCoord.y - Y)));
	float Zd = abs(dist/radius - 1.0);
	float Zdepth = Zd*(PI/2.0);
	
	if (dist <= radius) {
		color = 1.0;
	} else {
		color = 0.0;
	}
	
	X2 = (X2 + 1.0) * (resolution.x/2.0);
	Y2 = (Y2 + 1.0) * (resolution.y/2.0);
	
	float dist2 = sqrt(((gl_FragCoord.x - X2)*(gl_FragCoord.x - X2)) + ((gl_FragCoord.y - Y2)*(gl_FragCoord.y - Y2)));
	float Zd2 = abs(dist2/radius2 - 1.0);
	float Zdepth2 = Zd2*(PI/2.0);
	
	if (dist2 <= radius2) {
		color2 = 1.0;
	} else {
		color2 = 0.0;
	}
	
	gl_FragColor = vec4( color*sin(Zdepth), 0.0, color2*sin(Zdepth2), 1.0);
}
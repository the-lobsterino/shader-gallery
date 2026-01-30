precision lowp float;

uniform vec2 resolution;
uniform float time;

int cx, cy, mr2;

float centerDist(float x, float y) {
	int dx = cx - int(x), dy = cy - int(y);
	int d;
	d = dx*dx + dy*dy;
	return float(d);
}

void main(){
	cx = int(resolution.x)/2;
	cy = int(resolution.y)/2;
	mr2 = cx;
	if(cy < mr2) mr2 = cy;
	mr2 = mr2 * mr2;
	float aspectRatio = resolution.x/resolution.y;
	gl_FragColor = vec4(0.5 + 0.5 * sin(centerDist(gl_FragCoord.x, gl_FragCoord.y) - time), 0, 0, 0);
}
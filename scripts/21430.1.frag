#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 getColor(float phase);

float PI = 4.*atan(1.);

float lw = 0.001;
vec2 fix = vec2(0.02,0.1);

vec2 circle(vec2 p, vec3 cc) {
	float r = sqrt(dot(p-cc.xy,p-cc.xy));
	float c = 0.5;
	if (r < cc.z-lw) c = 0.0;
	return vec2(c,exp(-0.5*pow(abs(r-cc.z)/lw,10.0)));
}

void main(void) {
	float phase = time*0.1*PI;
	vec2 p = surfacePosition;
	
	// cross 
	if (abs(p.x-fix.x)<0.001 && abs(p.y-fix.y) < 0.005 ||
	    abs(p.x-fix.x)<0.005 && abs(p.y-fix.y) < 0.001) { 
	    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	    // cross is on top, stop drawing
	    return;
	}
	
	// circles x,y and r
	vec3 cc[3];
	cc[0] = vec3(-0.1,0.0,0.1);
	cc[1] = vec3(0.06,0.03,0.1);
	cc[2] = vec3(0.01,0.1,0.1);
	
	vec2 c1 = circle(p,cc[0]);
	float c = c1.x;
	float e = c1.y;
	for (int i=1; i<3; i++) {
	    c1 = circle(p,cc[i]);
	    c = min(c1.x,c);
	    e = max(c1.y,e);
	}
	bool mask = c > 0.0;
	c = max(c,float(mask)*e);
	
	gl_FragColor = vec4(c,c,c,1.0);
}

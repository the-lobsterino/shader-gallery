#extension GL_OES_standard_derivatives : enable
// Edit: timeshift by y coordinate ( top and bottom of the screen have 10 seconds difference )

#define STEPS 		50.0	// determines screen split count
#define TIMEDIFF	10.0	// difference in time between screen top and bottom

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotatey(in vec3 p, float ang) { return vec3(p.x*cos(ang)-p.z*sin(ang),p.y,p.x*sin(ang)+p.z*cos(ang));  }
vec3 rotatex(in vec3 p, float ang) { return vec3(p.x,p.y*cos(ang)-p.z*sin(ang),p.y*sin(ang)+p.z*cos(ang));  }
vec3 rotatez(in vec3 p, float ang) { return vec3(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang),p.z);  }

vec3 scene(vec2 p, float t) {
	vec3 col = vec3(0);
	
	for (int i = 0; i < 100; i++) {
		float a = float(i)*2.0*3.1415/100.0;
		vec2 sc = vec2(1,1); 
		vec3 pos = vec3(cos(a)*sc.x,sin(a)*sc.y, 0.0); 
		pos = rotatey(pos, 0.6*t);
		pos = rotatex(pos, 0.9*t);
		pos = rotatez(pos, 0.2*t);
		pos.z = 0.5 * pos.z + 2.0;
		pos.xy /= pos.z;
		col += clamp(vec3(1,0,0)/(0.001*pos.z+abs(12.0*length(p.xy-pos.xy)*pos.z-4.0)), 0.0, 1000.0);
	}
	
	return col / 100.0;
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(0);
	p.x *= resolution.x/resolution.y;
	
	float screenY = gl_FragCoord.y / resolution.y;
	
	float timeshiftCoeff = max(10.0 - (sin(time * 0.4) * 5.0 + 5.0), 0.0) / 10.0;
	
	col = scene(p, time - float(int(screenY * STEPS)) / STEPS * TIMEDIFF * timeshiftCoeff);
	
	gl_FragColor = vec4(col, 1.0);	
}

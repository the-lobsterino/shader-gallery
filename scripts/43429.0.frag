#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// SETTINGS
#define PATTERN 5
#define MAX_DEPTH 5
#define DO_ROUND true
#define WRAP_THRESHOLD false
// END SETTINGS

bool pattern(bool a, bool b) {
	#if PATTERN == 1
	return a && b;
	#elif PATTERN == 2
	return a == b;
	#elif PATTERN == 3
	return a != b;
	#elif PATTERN == 4
	return !(a && b);
	#elif PATTERN == 5
	return !(a || b);
	#elif PATTERN == 6
	return a || b;
	#endif
}


int grid(inout vec2 p, vec2 threshold) {
	
	vec2 tLeft = -1.0+2.0/threshold;
	vec2 tRight = 1.0-2.0/threshold;
	
	for(int i=0;i<MAX_DEPTH;i++) {
		bool outsideX = p.x < tLeft.x || p.x > tRight.x;
		bool outsideY = p.y < tLeft.y || p.y > tRight.y;
		if(pattern(outsideX, outsideY)) {		
			return i;	
		}
		p = 0.5 + p*0.5; // 0 to 1
		p = fract(p*(WRAP_THRESHOLD ? threshold : vec2(3.0)));
		p = p*2.0 - 1.0; // -1 to 1
	}
	
	
	return MAX_DEPTH;	
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p*2.0 - 1.0; // -1 to 1
	
	float minVal = 2.1;
	vec2 threshold = minVal + 10.0*mouse;
	if(DO_ROUND) {
		threshold = floor(threshold+0.5);
	}
	threshold = max(vec2(minVal), threshold);
	
	int v = grid(p, vec2(threshold));
		
	float depth = (float(v)/float(MAX_DEPTH));
	
	vec3 color = vec3(1.0-sqrt(depth));
	
	if(length(p) < 0.05) {
		color = vec3(0.0);	
	}

	gl_FragColor = vec4( color, 1.0 );

}
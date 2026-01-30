#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265359
#define MAX_ITER 16

// By koreus7

void main( void ) {
	
	vec2 playerPos = vec2(0.5,0.5);
	vec2 p1 = gl_FragCoord.xy /resolution;
	vec2 p = (gl_FragCoord.xy / resolution *8.0) - vec2(15.0);
	vec2 i = p;
	float c = 1.0;
	float inten = .05;

	for (int n = 0; n < MAX_ITER; n++){
		float t = time * 0.1*(1.5 - (2.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (2.*sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	float d = distance(playerPos,p1);
	c /= float(MAX_ITER);
	c = 1.5-sqrt(pow(c,2.2));
	c *= ( abs(sin( d*10.0*PI - time ))*2.0);
	c *= d*2.0;
	float col = c*c*c;
	vec4 col1 = vec4(vec3(col * 0.1*(1.0-d), col * 0.1 , col * 0.1), 1.0);
	
	vec3 light_color = vec3(1.2,0.8,0.6);
	
	float t = time*20.0;
	vec2 position = ( gl_FragCoord.xy -  resolution.xy*.5 ) / resolution.x;
	
	
	float grain = abs(sin(time))*200.0 + 200.0;
	
	float x1 = position.x*grain;
	
	x1 = floor(x1);
	
	position.x = x1/grain;
	
	
	
	float y1 = position.y * grain;
	
	y1 = floor(y1);
	
	position.y = y1/grain;
	
	
	
	// 256 angle steps
	float angle = atan(position.y,position.x)/(2.*3.14159265359);
	angle -= floor(angle);
	float rad = length(position);
	
	float color = 0.0;

	float angleFract = fract(angle*256.);
	float angleRnd = floor(angle*256.)+1.;
	float angleRnd1 = fract(angleRnd*fract(angleRnd*.7235)*45.1);
	float angleRnd2 = fract(angleRnd*fract(angleRnd*.82657)*13.724);
	float t2 = t+angleRnd1*10.;
	float radDist = sqrt(angleRnd2);
	
	float adist = radDist/rad*.2;
	float dist = (t2*.1+adist);
	dist = abs(fract(dist)-.5);
	color +=  (1.0 / (dist))*cos(0.7*(sin(t)))*adist/radDist/30.0;

	angle = fract(angle+.61);
	
	gl_FragColor = vec4(color,color,color,1.0)*vec4(light_color,1.0) * (col1*8.0);
}
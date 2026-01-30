precision highp float;
uniform float time; // time
uniform vec2  resolution; // resolution

vec2 rotateTo(vec2 point, float rad){
float x = sin(rad) * point.x - cos(rad) * point.y;
float y = sin(rad) * point.y + cos(rad) * point.x;	
return vec2(x,y);	
}

float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }

float trail(float r) {
      	vec2 p = (gl_FragCoord.xy * 2.0 - resolution)/min(resolution.x, resolution.y);	
	float t = rand(r) * time;
	vec2 s = rotateTo(p, -t);
	float head = clamp(0.05 - length( p-rotateTo(vec2(0,r),t) ),0.,1.) * 10.;
	float tail = (clamp(0.006 / abs(length(p) - r )-0.1,0.0,2.)) ;
	float tailStrength = clamp(atan(s.x,s.y)-1.5+r,0.,1.);
        return head + tail * tailStrength;
}


void main(void){
	vec3 destColor = vec3(2, 4, 1);
	float l = 0.;
	for (float r = 0.; r < 1.; r += 0.1) {
		l += trail(r);
	}
	gl_FragColor = vec4(l*destColor, 1.0);
}
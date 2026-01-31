
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(float h,float s,float v) {
	return mix(vec3(1.),clamp((abs(fract(h+vec3(2.,5.,3.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

void main( void ) {

	vec2 pos = -1.0 + 2.0 * ( gl_FragCoord.xy / resolution );
	pos.x *= resolution.x/resolution.y;
	pos.y += 0.6;
	
	float r = length(pos);
	float t = atan(pos.y, pos.x);
	
	//float color = 1.0/((r*3.0) - pow(1.5*(1.0+sin(t))*(1.0+0.9*cos(8.0*t))*(1.0+0.01*cos(2.0*t))*(0.5+0.05*cos(4.0*t)), sin(time)*0.5+0.8));
	float color = 1.0/((r*2.0) - pow(1.375*(1.0+sin(t))*(1.625+0.875*cos(8.0*t))*(1.0+0.1*cos(24.0*t))*(0.4+0.05*cos(140.0*t)), sin(time)*0.25+0.625));
	gl_FragColor = vec4(hsv2rgb(((color+time/0.75) - t * 1.114), 1.0, clamp(5.0 - abs(color), 0.0, 1.0)) * (color < 0.01 ? vec3(0.0, 0.3125, 0.0) : vec3(1.0)) 
			    + (color < 0.01 ? vec3(0.0, smoothstep(-5.0, 0.0, color), 0.0) : vec3(0.0)), 1.0 );
}

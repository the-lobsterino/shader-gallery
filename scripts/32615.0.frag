#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float meta(vec2 glpos, vec2 pos);
float angle(vec2 glpos, vec2 pos);
vec3 hsbToRGB(float h,float s,float b);

#define PI 3.14159265359


void main() {
	
	
	
	vec2 pos1 = mouse*resolution;//vec2(resolution.x/2.0, resolution.y/2.0);
	float multiplier1 = 4000.0;
	vec2 glcoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
	
	
	
	float value = multiplier1 * meta(glcoord, pos1);
	float ang = angle(glcoord, pos1)-time*1.2;
	ang = fract(ang);
	vec3 color = hsbToRGB(ang, 1.0, 1.0);
	
	if(value > 1.0) value = 1.0/value;
	gl_FragColor = vec4(color.rgb * value,1);
}


//Meta value of the fragCoord to the given metaball-position
float meta(vec2 glpos, vec2 pos){
	vec2 diff = vec2(pos.x-glpos.x, pos.y-glpos.y);
	return 1.0 / (diff.x*diff.x + diff.y*diff.y);
}

//Angle from fragCoord to the given position
float angle(vec2 glpos, vec2 pos){
	vec2 diff = vec2(pos.x-glpos.x, pos.y-glpos.y);
	float ang = atan(diff.y, diff.x);
	ang = ang + PI;
	ang = ang / PI/2.0;
	
	
	if(ang >= PI*2.0) ang -= PI*2.0;
	
	
	return ang;
}

//HSB Color to rgb
vec3 hsbToRGB(float h,float s,float b){
	return b*(1.0-s)+(b-b*(1.0-s))*clamp(abs(abs(6.0*(h-vec3(0,1,2)/3.0))-3.0)-1.0,0.0,1.0);
}
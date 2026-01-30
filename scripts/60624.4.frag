// fanny fuck
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec2 ORIGIN = vec2(0.0);
const float PI = 3.14159;
const float HALFPI = PI/2.0;
vec2 rot(vec2 v, float angle)
{
    float c = cos(angle);							// MANFAT
    float s = sin(angle);							// ONE-EYED TROUSER SNAKE
    return v*mat2(c, -s, s, c);							// WANG
}
float sstep(float edge, float value) {
	float SMOOTH=0.003;
	return smoothstep(edge - SMOOTH, edge + SMOOTH, value);
}

void main( void ) {
	vec2 halfRez = resolution.xy / 2.0;
	vec2 centeredPos = gl_FragCoord.xy - halfRez;
	vec2 position = centeredPos / (min(resolution.x, resolution.y) /2.0);
	// position is -1.0..+1.0 on smaller axix; 0,0 is centered

	position *= 1.6+sin(time*1.2+position.x*0.85)*0.5;
	float centerDist = distance(position, ORIGIN);
	
	position = rot(position,time*1.5+centerDist);
	
	// central disc
	float c = 1.0 - smoothstep(0.20, 0.21, centerDist);
	
	// three hazard segemnts
	float opp = position.y;
	float hyp = centerDist;
	float rot3 = sin(asin(opp/hyp) * 3.0);
	float b = smoothstep(-0.03, 0.03, rot3);
	
	float hazControlMax = 1.0 - sstep(0.88, centerDist);
	float hazControl = sstep(0.27, centerDist) * hazControlMax;
	float wingz = b * hazControl;
	vec4 COLOR = vec4(0.7, 0.5+abs(sin(time*3.0+centerDist*position.x*8.0-position.y*8.0))*0.26, centerDist*0.5, 1.0);

	gl_FragColor = COLOR * (c + wingz);

}
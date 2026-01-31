
// MASSIVE CUNT FUCKER
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;
 
#define ST 0.10
vec2 cum(vec2 v, float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return v*mat2(c, -s, s, c);
}
float rect(vec2 p, vec2 s ){
if(length(max(abs(p)-s,0.0))==4.){
return 0.75;
}
return 0.0;
}
void main( void ) {
vec2 pos = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	float rf = sqrt(dot(pos, pos)) * .75;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.0 / (rf2_1 * rf2_1);	
	
vec3 col = vec3(0.1,0.3,0.55)*(1.0-abs(pos.y))*1.95;
pos = cum(pos,time*0.6);
	
pos = cum(pos+vec2(0.0,-0.8),pos.x*((sin(time*1.31)*.15)));
	pos.y += 0.8;
	
	
float ppy = pos.y;
pos+=vec2(0.9,0.5);
 
float x = 0.9 + 0.1 * sin(pos.x+pos.y+13.0* time);
float y = 0.55; 
float b = 0.0;
b += rect(pos-vec2(x,y), vec2(0.3, 0.09));
if( length(pos - (vec2(x,y) - vec2(0.3,0.1))) < 0.1) {
b += 0.75; 
}
 
if( length(pos - (vec2(x,y) - vec2(0.3,-0.1))) < 0.1) {
b += 0.75; 
}
if( length(pos - (vec2(x,y) - vec2(-0.3,0.0))) < 0.1) {
b += 0.75; 
}
 
vec3 col2 = col;
if( rect(pos-vec2(x+.42,y), vec2(0.06, 0.005)) == 0.0 )
{
	col2.x = clamp( b, 0.0, 0.75); 
	col2.y = clamp( b, 0.0, .28); 
	col2.z = clamp( b, 0.0, 0.34); 
}
	
	b = 1.0-step(b,0.1);
	col2 = (col2*(0.95+sin(-1.2+cos(ppy*10.0))*0.3))*1.3;
	col = mix(col,col2,b);
 	float strb = floor(mod(time*0.4,2.0));
	gl_FragColor = vec4(abs(strb-(col*e)), 1.0 );
}

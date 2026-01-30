#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;

float r = 0.005;
float speed = 0.5;
float tail = 0.3;
vec3 col =  vec3(1.0, 1.0, 1.0);
vec3 color ; 
vec2 center(float k) {
	vec2 cen = vec2(0.0);
	cen.x = fract(k * 2.*time);
	cen.y = 0.5;
	return cen;
}
#define ST 0.10

float rect(vec2 p, vec2 s ){
if(length(max(abs(p)-s,0.0))==0.0){
return 0.75;
}
return 0.0;
}
void main( void ) 
{
	
	vec2 position =  1.8*(gl_FragCoord.xy -.5*resolution.xy)/ resolution.y ;
	 
	float aspect = resolution.x / resolution.y;
	vec2 c = center(2.*speed);
	c.y  /=  aspect;
	float d = distance(position , c);
	if( d < r) {
		color = col;
	}else if( d>=r && c.x > position.x && abs(position.y - c.y) < r){
		color  = col * ( max ( 0.8 - min ( pow ( d - r , tail ) , 0.9 ) , -0.2 ) );
	}
		

vec3 col;

float x =  0.1 * sin(6.0* time);
float y = 0.247; 
float b = 0.0;
b += rect(position-vec2(x,y), vec2(0.3, 0.09));
if( length(position - (vec2(x,y) - vec2(0.3,0.1))) < 0.1) {
b += 0.75; 
}

if( length(position - (vec2(x,y) - vec2(0.3,-0.1))) < 0.1) {
b += 0.75; 
}
if( length(position - (vec2(x,y) - vec2(-0.3,0.0))) < 0.1) {
b += 0.75; 
}

if( rect(position-vec2(x+.42,y), vec2(0.1, 0.005)) == 0.0 )
col.r += clamp( b, 0.0, 0.75); 



gl_FragColor = vec4(col+color, 1.0 );
}
#ifdef GL_ES
precision mediump float;
#endif
//c64cosmin@gmail.com
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926536

float random(float seed){
	return fract(cos(seed*5213.1523)*sin(seed*1536.4846))*2.0-1.0;
}
vec2 point(float seed){
	vec2 p=vec2(random(seed),random(seed+1.0));
	p.x+=time*random(seed)*0.1;
	p.y+=time*random(seed+20.0)*0.1;
	return vec2(mod(p.x,resolution.x/resolution.y),mod(p.y,1.0));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.x*=resolution.x/resolution.y;
	
	float color=1.0;
	for(int i=1;i<30;i++){
		float d=distance(position,point(float(i)));
		if(d<color)color=d;
	}
	vec3 c=vec3(cos(color*PI*30.0+time),
		    cos(color*PI*30.0+10.0+time*2.0),
		    cos(color*PI*30.0+20.0+time*4.0));
	gl_FragColor = vec4( c, 1.0 );

}
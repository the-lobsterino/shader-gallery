#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
                              
	vec2 myMouse =  mouse ;
	myMouse.x *= resolution.x/resolution.y;
	vec2 myFragCoord = gl_FragCoord.xy;
	myFragCoord.x = gl_FragCoord.x/resolution.y;
	myFragCoord.y = gl_FragCoord.y/resolution.y;
	
	float r = distance(myFragCoord,myMouse);
	float a = atan(myFragCoord.y-myMouse.y,myFragCoord.x-myMouse.x);
	float a_wave = sin(a+time);
	float f = pow(sin(a*10.0+time),1.0)*(1.0-r);
	vec3 cx = vec3(f*1.5,f*2.0,f);
	if( f<0.5 ){
		if(f>= 0.0){
			cx = vec3(0.0,0.0,1.0);
		}
		else cx = cx + 1.3;
	}
        else cx = 1.5 - cx;
	//a = 0.5+a/(2.0*3.142);
	//cx = vec3(a,0.0,0.0);
	gl_FragColor = vec4( cx + pow(a_wave,0.0), 1.0 );

}

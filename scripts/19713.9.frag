#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float dir ( vec2 a, vec2 b){
	return a.x * b.y - a.y * b.x; 
}


bool insideTri( vec2 p, vec2 a, vec2 b, vec2 c){
	bool b1 = dir(p-a, b-a) > 0.0;
	bool b2 = dir(p-b, c-b) > 0.0;
	bool b3 = dir(p-c, a-c) > 0.0;
		
	return b1 == b2 && b2 == b3;
}

bool circle( vec2 center, vec2 p, float r){
	return distance( center, p ) < r;;
}



void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy;
	p = p*2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	
	vec2 cp = gl_FragCoord.xy / resolution.xy;
	cp = cp*2.0 - 1.0;
	cp.x *= resolution.x / resolution.y;
	cp = fract(cp * 3.0);
	
	vec2 center = vec2(0.5, 0.5);
	
	
	float triCol = 0.0;
	vec2 t1 = vec2(-0.5, 0.0);
	vec2 t2 = vec2(0.5, 0.0);
	vec2 t3 = vec2(0.0, 0.5);
	vec2 t32 = vec2(0.0, -0.5);
	//if(insideTri(p,t1,t2,t3) ) triCol = 1.0;
	
	//vec4 c = vec4( vec3(triCol), 1.0 );
	
	
	vec4 tc = vec4(0,0,0,1);
	if( dir( p-t1, t2-t1 ) < 0.0 ) tc.x = 1.0;
	if( dir( p-t2, t3-t2 ) < 0.0 ) tc.y = 1.0;
	if( dir( p-t3, t1-t3 ) < 0.0 ) tc.z = 1.0;
	
	vec4 tc2 = vec4(0,0,0,1);
	//tc2.x = dir( p-t1, t2-t1 );
	//tc2.y = dir( p-t2, t3-t2 );
	//tc2.z = dir( p-t3, t1-t3 );
	
	
	vec4 tc3 = vec4(0,0,0,1);
	if(insideTri(cp,t1/2.0+center,t2/2.0+center,t3/2.0+center)) tc3 = vec4(0,1,0,1);
	
	
	vec4 cc = vec4(0,0,0,1);
	if(circle( vec2(0.5,0.5), cp, 0.2)) cc = vec4(0,0,1,0);
	
	//vec4 cc = vec4(0,0,0,1);
	//for(int i = 0; i<10.0; i++){
	//	if(circle( vec2(i/10.0, 0), cp, 0.5)) cc = vec4(0,0,1,0);	
	//}
	
	
	
	vec4 fc = mix(tc, cc, sin(time*5.0));
	fc = mix(fc, tc3, mouse.y);
	
	vec4 c = fc;

	
	float smilePoint = (sin(time*30.0) - 2.0 )/10.0;
	vec4 circle1 = vec4(0,0,0,1);
	if( circle( vec2(-0.5,0.0), p, 0.2 ) ) circle1 = vec4(0,1,1,1);
	if( circle( vec2(0.5, 0.0), p, 0.2 ) ) circle1 = vec4(1,0,1,1);
	if( insideTri(p, t1+vec2(0,-0.25), t2+vec2(0,-0.25), t32+vec2(0,smilePoint)) ) circle1 = vec4(1,1,0,1);
	
	vec4 ffc = mix(fc,circle1,mouse.x+0.3);
	
	
	gl_FragColor = ffc;

}
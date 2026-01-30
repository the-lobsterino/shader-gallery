// ------------------------------

// licenced under love, peace and happiness

// this code is translated from Martin's Art of Code lecture > check it out!
// https://www.youtube.com/watch?v=cQXAbndD5CQ

// ------------------------------


precision mediump float;

uniform float time;
uniform vec2 resolution;


float xor(float a, float b){
	return a*(1.-b) + b*(1.-a);
}

vec2 rot(vec2 _uv, float _a){

	float s = sin(_a);
	float c = cos(_a);
	return _uv*mat2(c,-s,s,c);
}


void main( void ) {

	vec2 uv = ( (gl_FragCoord.xy-.5*resolution.xy) / resolution.xy )*9.;
	
	// ratio shizzl
	uv.x *=  resolution.x/resolution.y;
	
	// rotate the uv
	//uv = rot(uv,time*.9);
	
	vec2 muv = fract(uv*33.)-.5;

	vec3 col = vec3(0.);
	float mtx = 9.;
	float t = time;
	float disti = length(uv)*3.;
	
	//for(int x=-0;x<=0;x++){
		//for(int y=-0;y<=0;y++){
	
				
		vec2 moff = vec2(0,0);
		float d = length(moff-muv);
		float r = mix(.1,1.75,sin(disti-t)*.5+.5);
		mtx = smoothstep(r,r*0.59,d );	 
		//mtx = xor(mtx, smoothstep(r,r*0.99,d)    );	 
			
		
	//}}
	 
	col+=mtx;
		
	gl_FragColor = vec4(col, 6.0 );

}
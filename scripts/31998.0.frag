#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define d 12.0

#define _ ;//

bool eq (float f1, float f2){
	return (abs(f1-f2)==0.)?(true):(false);
}

float disc(float f){	
	return floor(f*d)/d;	
}



float disc(float f, float df){
	df = pow(2.0,df);
	//==return (floor(f*df) -floor(f*df/2.0)*2.0)/df +1.0;
	return mod(abs(floor((f+1.)*df)),2.0);
	
}

vec2 disc(vec2 v){
	return vec2(disc(v.x+1.), disc(v.y+1.));
}

vec2 disc(vec2 v, float df){
	return vec2(disc(v.x, df), disc(v.y,df));
}
void main( void ) {

	vec2 uv = 2.0*( gl_FragCoord.xy / resolution.xy ) -vec2(1.0);
	vec2 m = 2.0*(mouse.xy) -vec2(1.0);

	vec3 c = vec3(.0);
	
	

	vec2  uvd = disc(uv);
	vec2  uvd2 = disc(uv);
	vec2  md  = disc(m);
	float dd  = 0.0;
	float osc = 1.0;
	bool b = eq(uvd.x,osc) && eq(uvd.y,osc);
	float xy = 0.0;
	
	for (float f = .0; f <= d; f++){

		uvd = disc(uv,f);
		
		xy = (xy)*4.0 + (2.0*uvd.x+uvd.y);
		b = eq(uvd.x,osc) && eq(uvd.y,osc);
		
			
		//if (!b) {break;}
		
		c += (b)?( vec3((1.0)/(d*1.)) ):( vec3(0.0) );
	
		//osc++;
		osc = mod(++osc,2.0);
	
	}


	gl_FragColor = vec4( c, 1.0 );

}
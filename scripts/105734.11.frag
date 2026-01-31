#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float posterize(float val, float divs){
	return floor(val*divs)/divs;
}

float rad(float deg){
	return deg * (3.141519/180.0);
}


float dir(vec2 center, vec2 pos){
	vec2 relative = pos-center;
	
	return ((atan(relative.x,relative.y)/3.1415926)+1.0)/2.0;
}

float mag(vec2 center, vec2 pos){
	return distance(center, pos);
}

vec2 vec_to_xy(float dir, float mag){
	
	float dir_ = dir * (3.1415926/2.0);
	float x = mag * cos(dir_);
	float y = mag * sin(dir_);
	
	return vec2(x,y);
}

float in_circ(vec2 center, vec2 pos, float r){
	if(distance(center,pos) <= r){
		return 1.0;
	} else {
		return 0.0;
	}
}

float color_sin(float val, float offset){
	return (sin(((val+offset+time)/2.0)*3.1415926)+1.0)/2.0;
}



void main( void ) {

	float divs = 4.0;
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	p.x = p.x * (resolution.x/resolution.y);
	
	vec2 p_post = vec2(posterize(p.x,divs), posterize(p.y,divs));
	vec2 p_dif = p-p_post;
	p_dif = p_dif * divs;
	

	vec3 color = vec3(0.0);
	
	vec2 circ_c = vec2(0.5);
	
	float a = 0.0;
	
	float mouse_d = distance(mouse.xy,p_post+(0.5/divs));
	//float r = (sin(p.x*4.0+p.y+time)+1.2)/5.0;
	float r = 0.45;
	
	if(in_circ(circ_c, p_dif, r) == 1.0){

		float m = mag(circ_c, p_dif);
		
		p_dif.xy = p_dif.xy + (pow(m,4.0)*6.0);
		
		m = mag(circ_c, p_dif);
		float d = dir(circ_c, p_dif);
		
		p_dif = p_dif;
		
		p_dif = p_dif * 1.0;
		a = (p_dif.x+p_dif.y)*1.4;
		
		
		
	} else {
		a = p.x+p.y*1.4;
	}
	

	color.r = color_sin(a,-0.5);
	color.g = color_sin(a,0.0);
	color.b = color_sin(a,0.5);


	gl_FragColor = vec4( color , 1.0 );

}
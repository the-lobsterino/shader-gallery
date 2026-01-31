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

	float divs = 3.0;
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec2 p_post = vec2(posterize(p.x,divs), posterize(p.y,divs));
	vec2 p_dif = p-p_post;
	p_dif = p_dif * divs;
	

	vec3 color = vec3(0.0);
	
	vec2 circ_c = vec2(0.5);
	
	float a = 0.0;
	
	if(in_circ(circ_c, p_dif, 0.45) == 1.0){
		float m = mag(circ_c, p_dif);
		p_dif.xy = p_dif.xy + (pow(m,4.0)*4.0);
		a = (p_dif.x+p_dif.y)*1.4;
	} else {
		a = p.x+p.y*1.4;
	}
	

	color.r = color_sin(a,-0.5);
	color.g = color_sin(a,0.0);
	color.b = color_sin(a,0.5);


	gl_FragColor = vec4( color , 1.8
			   
			   
	);

}
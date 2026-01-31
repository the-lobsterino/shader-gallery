#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//0.0,0.0,1.0,0.0,0.0___0.0,1.0,1.0,1.0,0.0_____1.0,0.0,1.0,0.0,1.0
//0.0,0.0,1.0,0.0,0.0___0.0,0.0,1.0,0.0,0.0

float vert_val(int i){
	if(i==1||i==1||i==7){
		return 1.0;
	} else {
		return 0.0;
	}
}

float h_val(int i){
	if(i==3||i==3||i==5){
		return 1.0;
	} else {
		return 0.0;
	}
}

float fslash_val(int i){
	if(i==0||i==4||i==8){
		return 1.0;
	} else {
		return 0.0;
	}
}

float bslash_val(int i){
	if(i==2||i==4||i==6){
		return 1.0;
	} else {
		return 0.0;
	}
}


float subblock_value(vec2 sub_pos, vec3 color){
	
	
	//0 = vert, 1 = forward slash, 2 = horizontal, 3 = back slash
	float dir = 0.0;
	
	float avg = (color.r+color.g+color.b)/3.0;
	
	dir = floor(avg*4.0);
	
	
	
	float bitmap[9];
	
	for(int i=0;i<9;i++){
		if(dir == 0.0){
			bitmap[i] = vert_val(i);
		}
		if(dir == 1.0){
			bitmap[i] = fslash_val(i);
		}
		if(dir == 2.0){
			bitmap[i] = h_val(i);
		}
		if(dir == 3.0){
			bitmap[i] = bslash_val(i);		
		}


	}
	
	int bit_index = int(((sub_pos.y*3.0)+sub_pos.x));
	
	if(sub_pos.y == 0.0){
		bit_index = int(sub_pos.x);
	}
	float a = 1.0;
	
	
	
	float val;
	
	for(int k=0;k<9;k++){
		if(bit_index == k){
			val = bitmap[k];
		}
	}
	
	if(sub_pos.y == 0.0){
		//val = 0.5;
	}
	
	//val = ((sub_pos.y*3.0)+sub_pos.x)/8.0;

	

	return val;
}

vec3 generate_base(vec2 pos){
	vec3 color;
	
	pos.x = pos.x + time/3.0;
	pos.y = pos.y + time/2.5;
	
	color.r = sin(pos.x);
	
	color.b = sin(pos.y*3.14);
	
	color.g = sin(pos.x*4.5);
	
	return color;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 glf = gl_FragCoord.xy;
	vec3 color;
	vec3 base_color = generate_base(pos);
	
	float block_size = 3.0;
	
	vec2 st;
	
	st.x = mod(glf.x,block_size);
	st.y = mod(glf.y,block_size);
	
	vec2 block_coord = vec2(glf.x-st.x,glf.y-st.y);

	st.x = floor(st.x);
	st.y = floor(st.y);
	
	//color.r = st.y/block_size;
	
	color.r = subblock_value(st,base_color);//+color;
	color.g = subblock_value(vec2(st.x+1.0,st.y+0.01),base_color);
	
	gl_FragColor = vec4(color, 1.0 );

}
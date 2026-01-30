#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 pixel(vec2 st, float divs){
	
	return vec2(floor(st*divs)/divs);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.54523);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(5.0, 6.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float posterize(float num, float inc){
	return floor(num*inc)/inc;
}

float even(float val){
	if(mod(val,2.0) < 1.0){
		return 1.0;
	} else {
		return 0.0;
	}
		
}

float height_calc(vec2 st){
	
	float height_mult = 0.9;
	
	float n_l = (noise(st*0.31)/1.5);
	float n_m = (noise(st*6.0)/3.0);
	float n_s = (noise(st*24.0)/12.0);
	
	return ((n_l+n_m+n_s)/(1.0/3.0+1.0/12.0+1.0))*height_mult;
}

float cloud_calc(vec2 st){
	vec2 st_c = st;
	st_c.x = st_c.x + time/8.0;
	st_c.x = st_c.x * 0.5;

	
	float cn_l = (noise(st_c*0.3)/5.0);
	float cn_ml = (noise(st_c*0.6)/4.0);
	float cn_m = (noise(st_c*2.5+sin(st_c/10.0)*10.0)/2.0);
	float cn_s = (noise(st_c*24.0)/36.0);
	
	float cloud_mult = 1.3 + (sin(st.x+time)/6.0+0.5)/6.0;
	
	return (cn_l+cn_m+cn_s+cn_ml)/(1.0/3.0+1.0/12.0+1.0)*cloud_mult;
}
void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution;
	
	st = st + 57.0;
	

	float scale = 4.0;
	
	st = st * scale;
	st.x = st.x*1.3;

	
	//st.x = st.x+time/4.0;
	
	st = pixel(st,9875.0/scale);
	

	
	float height = height_calc(st);
	
	
	vec2 coord_minus = vec2(st-0.03);
	vec2 coord_plus = vec2(st+0.03);
	
	// making points lower than their neighbors even lower to make inland lakes and stuff
	if(height > 0.4){
		if(height < height_calc(coord_minus) && height < height_calc(coord_plus)){
			height = height - (1.0+pow(height+height/3.0,2.0))*300.0;
		}
	}
	
	
	float n_l = (noise(st*0.31)/1.5);
	
	float sinVal = sin(st.x);
	if(st.y-sinVal < 1.0){
		height = height - 0.6;
	}
	vec3 color = vec3(0.0);
	
	if(height+n_l < 0.5){
		color.b = 0.6-posterize(height,3.0);
	}else if(height+n_l < 0.52){
		color.r = 1.0;
		color.g = 1.0;
		color.b = 0.7;
	} else if (height < 0.36){
		if(even(gl_FragCoord.x) == 1.0 || even(gl_FragCoord.y) == 1.0){
	    		color.g = 0.0;
		} else {
			color.g = 0.6;
		}
	} else if (height < 0.5){
		if(even(gl_FragCoord.x+even(gl_FragCoord.y)) == 1.0){
	    		color.g = 0.0;
		} else {
			color.g = 0.6;
		}
	} else if (height < 0.57){
		color = vec3(0.7,0.7,0.6);
	} else {
		// color.g = 0.56;
		color = vec3(0.9);
	}
	
	if(sin(sin(4.0*noise(st)+st.x*25.0))*sin(st.y*24.0) > 0.78 && noise(st*10.0) > 0.5){
		if(height+n_l > 0.54){
			color = vec3(0.5);
		}

	}
	
	float adj_height = height_calc(vec2(st.x-0.02,st.y+0.01));
	
	if(adj_height > height && height+n_l > 0.5){
		color = color - 0.22;
	}
	

	   
	   
	 // cloud shadow
	float shadow_val = cloud_calc(vec2(st.x-0.2,st.y+0.1)+height/5.0);
	float shadow_threshold = 0.63;
		
	if(shadow_val > shadow_threshold){
		//if(even(gl_FragCoord.x+1.0) == 1.0){
			color = vec3(0.0);
		//}

	} else if(shadow_val+0.06 > shadow_threshold){
		if(even(gl_FragCoord.x+1.0+even(gl_FragCoord.y)) == 1.0 && even(gl_FragCoord.y+1.0)==1.0){
			color = vec3(0.0);
		}
	}
	
	// clouds
	float cloud_val = cloud_calc(st);
	float cloud_threshold = 0.6;
	
	if(cloud_val-(noise(vec2((st.x+time/8.0)*4.0,st.y))/4.0) > cloud_threshold){
		if(even(gl_FragCoord.x+1.0) == 1.0 && even(gl_FragCoord.y) == 1.0){
			color = vec3(0.9);
		} else {
			color = vec3(1.0);
		}
	} else if(cloud_val > cloud_threshold){
		color = vec3(1.0);
	} else if (cloud_val+noise(vec2(st.x,st.y))/24.0+0.02 > cloud_threshold){
		if(even(gl_FragCoord.x+1.0) == 1.0 && even(gl_FragCoord.y) == 1.0){
			color = vec3(1.0);
		}
	}
	
	
	//color = vec3(height);

	gl_FragColor = vec4(color, 1.0 );

}
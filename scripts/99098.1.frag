#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// level is [0,5], assumed to be a whole number
vec3 rainbow(float level)
{
	/*
		Target colors
		=============
		
		L  x   color
		0  0.0 vec4(1.0, 0.0, 0.0, 1.0);
		1  0.2 vec4(1.0, 0.5, 0.0, 1.0);
		2  0.4 vec4(1.0, 1.0, 0.0, 1.0);
		3  0.6 vec4(0.0, 0.5, 0.0, 1.0);
		4  0.8 vec4(0.0, 0.0, 1.0, 1.0);
		5  1.0 vec4(0.5, 0.0, 0.5, 1.0);
	*/
	
	float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
	float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
	float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
	return vec3(r, g, b);
}

vec3 smoothRainbow (float x)
{
    float level1 = floor(x*6.0);
    float level2 = min(6.0, floor(x*6.0) + 1.0);
    
    vec3 a = rainbow(level1);
    vec3 b = rainbow(level2);
    
    return mix(a, b, fract(x*6.0));
}


float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getCircle(vec2 quadrant){
	//return vec2(0,0);
	return vec2(rand(quadrant.xy+1.0),rand(quadrant.yx));
}

void main( void ) {

	float aspect=resolution.x/resolution.y;
	vec2 position = ( gl_FragCoord.xy / resolution.xy )*vec2(aspect,1);
	vec2 s_pos=position*vec2(10);

	vec2 m_pos=vec2(fract(s_pos));
	
	vec3 light=vec3(0);
	for(int i=-1;i<=1;i++){
		for(int ii=-1;ii<=1;ii++){
			for(int iii=0;iii<=30;iii++){
				vec2 offset=vec2(vec2(i,ii));
				vec2 quadrant=vec2(floor(s_pos));
				vec2 seed=quadrant-offset+vec2(iii)*0.01;


				vec2 circle=getCircle(seed+vec2(3))-offset;
				vec3 color=smoothRainbow(rand(seed+vec2(2)));
				//desaturate
				color=min(color+0.8,vec3(1));

				float intens=pow(rand(seed+vec2(1))*5.0,3.0);
				float dist=length(circle-m_pos);
				intens=dist>0.1?0.0:intens;
				light+=vec3(intens/(dist*30000.0))*color;
			}
		}
	}


	gl_FragColor = vec4(light, 1.0 );

}
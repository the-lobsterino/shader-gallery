#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

const int itrs = 100;

vec3 Hue( float hue )
{
	vec3 rgb = fract(hue + vec3(0.0,2.0/3.0,1.0/3.0));

	rgb = abs(rgb*2.0-1.0);
		
	return clamp(rgb*3.0-1.0,0.0,1.0);
}

vec3 HSVtoRGB( vec3 hsv )
{
	return ((Hue(hsv.x)-1.0)*hsv.y+1.0) * hsv.z;
}

vec2 x_squared_plus(vec2 x, vec2 c){
	return vec2(x.x * x.x - x.y * x.y, 2.0 * x.x * x.y) + c;
}

int converges(vec2 v){
	vec2 n = v;
	for(int i = 0; i < itrs; i++){
		n = x_squared_plus(n, v);
		if(length(n) >= 2.0){
			return i + 1;	
		}
	}
	return 0;
}
void main()
{
	float x = gl_FragCoord.x / resolution.x * 3.0 - 2.0;
	float y = gl_FragCoord.y / resolution.y * 2.0 - 1.0;
	int itr = converges(vec2(x, y));
	vec3 color;
	if(itr == 0){
		color = vec3(0,0,0);	
	}
	else{
		color = vec3(float(itr) / float(itrs), 1.0, 1.0);	
	}
	gl_FragColor = vec4(HSVtoRGB(color),1.0);
}

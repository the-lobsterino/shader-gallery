#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

const float pi = 3.1415926535;

float cos_x(vec2 v){
	if (v.y == 0. && v.x == 0.){
		return 0.;
	}
	else{
		float l = length(v);
		return (v.x/l);
	}
}

float angle(vec2 v){
	float cos_ = cos_x(v);
	if (v.y > 0.){
		return acos(cos_)/(2.*pi);
	}
	else{
		return (pi + acos(-cos_))/(2.*pi);
	}
}


vec2 convert_to_radial(vec2 uv) {
	float radius = length(uv);
	float radian_angle = angle(uv);
	return vec2(radius,radian_angle);
}

vec3 palette( in float alpha) 
{  
    vec3 a = vec3(0.5, 0.5, 0.5); 
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.15, 0.45, 0.55);
    
    return a + b*cos( 6.28318*(c*alpha+d) ); 
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy ) / resolution.y;
	uv = convert_to_radial(uv);
	uv = fract(uv*vec2(2., 1.));
	uv = abs(uv-0.5)*4.;
	
	float d = length(uv);
	
	vec3 col = palette(d+sin(time)/4.);
	
	d = sin(d*1.+ time+0.5)/.4;
	d = abs(d);
	d = 0.09/d;
	d = smoothstep(0.0, 1., d);
	col *= d;
	
	gl_FragColor = vec4(col, 1.0 );
}
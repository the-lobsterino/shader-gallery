#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

float fun(in vec2 p1, in vec2 p2, in vec2 p)
{
	return step(0., cross(vec3(p-p1, 0.0), vec3(p2-p1,0.0)).z);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main( void ) {
	
		
	vec2 x = gl_FragCoord.xy/resolution.yy;
	
	vec2 p1 = vec2(200.0, 200.0)/resolution;
	vec2 p2 = vec2(500.0, 400.0)/resolution;
	vec2 p3 = vec2(600.0, 100.0)/resolution;

	vec2 center = (p1 + p2 + p3) / 3.; 

	float t = -time*0.5;
	
	p1 -= vec2(0.5);
	p2 -= vec2(0.5);
	p3 -= vec2(0.5);
	
	p1 *= rotate2d(t);
	p2 *= rotate2d(t);
	p3 *= rotate2d(t);
	
	p1 += vec2(0.5);
	p2 += vec2(0.5);
	p3 += vec2(0.5);
	
	vec3 color = vec3(1.0-distance(x,p1), 1.0-distance(x,p2), 1.0-distance(x,p3));

	float mask = fun(p1, p2, x);
	mask *= fun(p2, p3, x);
	mask *= fun(p3, p1, x);
	
	gl_FragColor = vec4( mask*color, 1.0 );
}
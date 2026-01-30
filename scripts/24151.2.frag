#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://www.shadertoy.com/view/MdXSzS

//a^2+b^2+c^2/|A||B|
float thetaEuc (vec2 position, vec2 origin) {
	float positionC = sqrt((position.x * position.x) + (position.y * position.y));
	float originC = sqrt((origin.x * origin.x) + (origin.y * origin.y));
	float A = sqrt(position.x + position.y + positionC);
	float B = sqrt(origin.x + origin.y + originC);
	return atan(((position.x*origin.x) + (position.y*origin.y) + (positionC*originC)) / (A*B));
}
vec2 theta (vec2 position, vec2 origin) {
	
	float positionCSpin = -(-position.x - position.y)/sqrt((-position.x - position.y)*(-position.x - position.y));
	float originCSpin = -(-origin.x - origin.y)/sqrt((-origin.x - origin.y)*(-origin.x - origin.y));
	float positionC = positionCSpin * sqrt((position.x * position.x) + (position.y * position.y));
	float originC = originCSpin * sqrt((origin.x * origin.x) + (origin.y * origin.y));

	
	float Aspin = -(-position.x - position.y - positionC) / sqrt((-position.x - position.y - positionC) * (-position.x - position.y - positionC));
	float Bspin = -(-origin.x - origin.y - originC) / sqrt((-origin.x - origin.y - originC) * (-origin.x - origin.y - originC));
	float A = Aspin * sqrt(position.x + position.y + positionC);
	float B = Bspin * sqrt(origin.x + origin.y + originC);
	float spin = -(-Aspin - Bspin) / sqrt((-Aspin - Bspin) * (-Aspin - Bspin));
	float xSpin = -((-position.x - origin.x)/sqrt(((-position.x - origin.x)) * ((-position.x - origin.x))));
	float ySpin = -((-position.y - origin.y)/sqrt(((-position.y - origin.y)) * ((-position.y - origin.y))));
	float theta = (((position.x*origin.x*xSpin) + (position.y*origin.y) + (positionC*originC)) / (Aspin*Bspin*A*B));
	float thetaSpin = -theta/sqrt(theta*theta);
	return vec2(thetaEuc(position, origin), thetaSpin);
}

void main()
{
	
	vec2 uv = (gl_FragCoord.xy/resolution.xy)-.5;
	vec2 posUV = (gl_FragCoord.xy);
	float time = time;
//	float si = cos(time);
//	float co = cos(time);
//	mat2 ma = mat2(-co, si, -si, -co);

	
	for (int i = 0; i < 100; i++)
	{
		
	}
	
	float len = length(uv);
	
//	float re = clamp(c, 0.0, 1.0);
//	float gr = clamp((v1+c)*.25, 0.0, 1.0);
//	float bl = clamp(v2, 0.0, 1.0);
//	vec3 col = vec3(re, gr, bl) + smoothstep(0.15, .0, len) * .9;
	float dist =  distance(posUV, uv);
	float distX = distance(posUV.x, uv.x) * -((-posUV.x - uv.x)/sqrt(((-posUV.x - uv.x)) * ((-posUV.x - uv.x))));
	float distY = distance(posUV.y, uv.y) * -((-posUV.y - uv.y)/sqrt(((-posUV.y - uv.y)) * ((-posUV.y - uv.y))));
	vec2 theta = theta(vec2(distX, distY), uv);
	float red = 1.-sqrt(dist);
	vec3 col = vec3((atan(theta.x)) * tan(dist) * sin(time),(acos(theta.x)) * sin(dist) * cos(time), ((((theta.x * theta.y)))) * cos(time));
//	float gray = dot(col, vec3(0.299, 0.587, 0.114));
	gl_FragColor = vec4(col, 1.0);
} 
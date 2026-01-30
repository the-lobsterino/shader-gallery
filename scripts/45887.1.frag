//BY SERGIO


#ifdef GL_ES
precision mediump float;
#endif
uniform float time;

uniform vec2 resolution;
#define PI 3.14159265
float segment(vec2 position, vec2 start_p, vec2 end_p)
{
	vec2 AP = position - start_p;
	vec2 AB = end_p - start_p;
	float h = clamp(dot(AP, AB) / dot(AB, AB), 0.0, 1.0);
	float seg = length(AP - AB * h);
	return seg;
}

vec2 rotate(vec2 v, float a,vec2 o) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * (v-o);
}


/*
float segment(vec2 position, vec2 start_p, vec2 end_p)
{
	float seg;
	vec2 AP = position - start_p;
	vec2 AB = end_p - start_p;
	float cos_sita = dot(AP, AB) / (length(AP) * length(AB));
	float dis = dot(AP, AB) / length(AB);
	if(dis <= length(AB) && cos_sita >= 0.0)
		seg = length(AP) * sqrt(1.0 - cos_sita * cos_sita);
	else if (cos_sita < 0.0)
		seg = length(AP);
	else
		seg = length(AP - AB) * 1.0;
	return seg;
}
*/
void main( void ) {
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5)) * 2.0;
	position.x = position.x*(resolution.x / resolution.y) - 0.5;
	vec4 color = vec4(1.0);
	vec2 A = vec2(0.0, 0.0);
	vec2 B = vec2(0.5, .5);
	
	vec2 o = A+B/2.;
	vec4 color_1 = vec4(0.0); 
	for (int i=0;i <10;++i){
		
		A = rotate(A,PI/2.+time,o);
		B = rotate(B,PI/2.+time,o);
		float line_1 = segment(position, A, B);

		color_1 += color *0.01 / line_1;
		
	
	}
	
	
	gl_FragColor = color_1;
	
	gl_FragColor = clamp(gl_FragColor, 0.0, 1.0);
}
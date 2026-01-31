#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float gwn(vec2 p, vec2 q, vec2 n)
{
	vec2 d = p - q;
	
	return dot(d,n) / (4.0*3.1415925*pow(length(d),6.));
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	vec4 c = vec4(0);
	
	float wn = 0.0;
	wn += gwn(vec2(0.55, 0.45), p, mouse - 0.5);
	wn += gwn(vec2(0.25, 0.45), p, mouse - 0.5);
	
	float wnsdf = (wn - 0.5) * -1.0;
	
	wnsdf = sign(wnsdf) * pow(abs(wnsdf), 1.0);
	
	float sw = 2.0;
	vec3 tint = (step(vec3(0), vec3(wnsdf) * vec3(-7.)) + step(vec3(0), vec3(wnsdf) * vec3(0,1,-1))) * 0.5;

	c = vec4(vec3(mod(abs(wnsdf) * sw, 1.0)) * tint, 1.0);
	
	c.b = abs(wnsdf) < 0.01 ? 1.0 : 0.0;
	
//	c = vec4(vec3(wn + 0.5),1.0);

	gl_FragColor = c;

}
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}


vec3 pin(vec3 v)
{
    v = rotate(vec3(cos(v.x+v.y),cos(v.y+v.z+1.04719),sin(v.z+v.x+4.18879))*0.5+0.5,(v),cos((v.x+v.y+v.z)));
	
	return log(v*v+1.);
}

void main( void ) {

	vec2 position = 2.*(( gl_FragCoord.xy / resolution.xy )-0.5);
	position.x = position.x*resolution.x/resolution.y;
	float radius = 1.;
	float z = sqrt(radius*radius - position.x*position.x - position.y*position.y);
	
	vec3 normal = normalize(vec3(position.x, position.y, z));
	vec3 light = normalize(vec3(0.5, 1.0, 0.0));
	vec3 viewVec = vec3(0.0, 0.0, 1.0);
	vec3 halfVec = normalize(light+viewVec);
	
	float diffuse = pow(dot(normal, light)*0.5+0.5, 3.0);
	
	vec3 color = pin(normal*3.14+sin(time*0.05)*0.5);

	
	gl_FragColor =  vec4(vec3(diffuse * color),1.0);	

}
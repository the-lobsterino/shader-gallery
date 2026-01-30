#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}


vec3 pin(vec3 v)
{
    return rotate(vec3(cos(v.x+v.y),cos(v.y+v.z+1.04719),cos(v.z+v.x+4.18879))*0.5+0.5,(v),sin((v.x+v.y+v.z)*3.14));
}

void main( void ) {

	vec2 position = surfacePosition*2.0;
	vec3 color = vec3(0);
	if(length(position)<= 1.0){	
		vec2 fdir = position;
		float mixer = sqrt(1.0 - position.x*position.x - position.y * position.y);
		color = pin(pin(pin(pin(1.5555*vec3(fdir.x, mixer, fdir.y)))));
	}

	gl_FragColor = vec4( color, 1.0 );
}
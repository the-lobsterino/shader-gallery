#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
varying vec2 surfacePosition;

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
    return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}


vec3 pin(vec3 v)
{
    v = rotate(vec3(sin((v.x+v.y)*1.618),sin((v.y+v.z)*2.71828+1.04719),sin((v.z+v.x)*3.14159+4.18879)),normalize(v),cos((v.x+v.y+v.z)));
	return normalize(v*sign(v));
}

void main( void ) {

	vec3 pos = (1.5+sin(time*0.0172))*vec3(surfacePosition.x*(sin(floor(surfacePosition.y*3.14)+surfacePosition.x+time*.123))+time*0.1+floor(surfacePosition.y*12.56)*6.);
	float lin = 1.-(pow(cos(surfacePosition.y*40.),8.));
	vec3 col = (pin(pos))*lin;

	gl_FragColor = vec4( col, 1.0 );

}
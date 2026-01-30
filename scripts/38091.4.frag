#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rot (float angle){
	return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

void main( void ) {

	vec2 p = surfacePosition;
	vec3 color = vec3(1.0);
	
	p.x+=0.1*cos(time);
	p*= rot(11.0);
	p*= rot(11.0 + 0.1*sin(time));

	vec3 pos =  vec3 (p.x, 0.5, abs(p.y))*2.0;
	vec2 sur =  vec2 (pos.x/pos.z, pos.y/pos.z)/3.0;

	sur.y += time/2.0+sin(time/4.0);
	float f = (sign((mod(sur.x,0.5)-0.1) * (mod(sur.y,0.3)-0.1)));
	f*= pos.z*pos.z*5.0;

	p*= rot(11.0 + 0.1*sin(time));

	vec3 pos1 =  vec3 (p.x, 0.5, abs(p.y))*2.0;
	vec2 sur1 =  vec2 (pos1.x/pos1.z, pos1.y/pos1.z)/3.0;
	sur1.y += time/2.0+sin(time/4.0);	
	float sf = (sign((mod(sur1.x,0.5)-0.1) * (mod(sur1.y,0.3)-0.1)));
	sf*= pos1.z*pos1.z*2.0;
	
	float l  =    0.1+0.05*abs(clamp(sin(time/4.0),0.1,0.5))/length(p-vec2(.07*sin(time),   0.007*sin(time/2.2)));
	float l1 =l + 0.1+0.01*abs(clamp(sin(time/4.0),0.1,0.5))/length(p-vec2(.07*sin(time/1.2),0.07*sin(time/2.1)));
	f+=l+l1;
	
	color.b=  sf*f;
	color.g=  f+sf;
	color.b+=-f+sf;
	
	
	gl_FragColor = vec4(mix(color,vec3(0.1*f,0.15*f,.25*f*sf),0.75),1.0);

}
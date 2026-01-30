#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define Rot(a) mat2(sin(a),-cos(a),cos(a),sin(a))

float sdf(vec2 uv)
{
	uv+=time*0.15;
	uv = mod(uv,.4)-0.2;
	
	uv*=Rot(time*.5+cos(exp(sin(time*2.)+exp(cos(time*2.)*.05))));
	return max(length(max(abs(uv)-0.1,0.))-5.e-2, -(length(vec2(uv.x+uv.x*sin(uv.y*20.+time*1.5),uv.y))-.1));
	return length(uv)-.35;	
}

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;

	float v = 1./sdf(uv);
	vec2 cp = uv * v;
	vec3 col = vec3(v,v/2.,0.);

	gl_FragColor = vec4(col/20., 1.0 );
}
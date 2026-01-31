#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float shape(vec2 p, vec2 c, float r){
	if(p.x-c.x < -r)return 0.0;
	if(p.x-c.x > r)return 0.0;
	if(p.y-c.y < -r)return 0.0;
	if(p.y-c.y > r)return 0.0;
	if(cos(time*33.0)>0.0)
	if(length(c-p) > r)return 0.0;
	return 1.0;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*vec2(1.0,resolution.y/resolution.x);
	float r = 0.04;
	float o = (cos(time*33.0)+1.0)*r;
	vec2 c1 = vec2(0.3+o,0.3);
	vec2 c2 = vec2(0.3+r*2.0,0.3+o);

	float color = 0.0;
	color += shape(position, c1, r);
	color += shape(position, c1+vec2(-r*2.0,0.0), r);
	color += shape(position, c2, r);
	color += shape(position, c2+vec2(0.0,r*2.0), r);
	color = min(1.0, color);
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}
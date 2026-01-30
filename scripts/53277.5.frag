#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

float fast = 1e1;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	float t = time + position.x+position.y*resolution.x;
	vec2 center = (abs(fract(fast*t*mouse) * 2.0 - 1.0) * 2.0 - 1.0) * (1.0 - 0.01) * 0.5 + 0.5;

	vec3 color = vec3(0.0);
	color += step(distance(position, center), 0.01);
	vec2 pb = fract(position+vec2(0,1)/resolution)-.5;
	pb = vec2(length(pb), atan(pb.x, pb.y));
	pb.y += sin(0.04/(1.+pb.x));
	pb.x += 1./256.;
	pb = pb.x*vec2(sin(pb.y), cos(pb.y))+.5;
	pb = mix(pb, position, .5);
	vec3 backColor = (texture2D(bb, fract(pb)).rgb*2.
			 +texture2D(bb, fract(pb+vec2(2,0)/resolution)).rgb
			 +texture2D(bb, fract(pb+vec2(0,-2)/resolution)).rgb)/(4.+0.5*cos(t));
	color = max(color, backColor - float(fract(time+t)<0.2)/256.);

	gl_FragColor = vec4(color, 1.0 );

}
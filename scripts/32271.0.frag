#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 rand(vec2 n)
{
  return vec2(-0.5 + 1.0 *  fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453), -0.5 + 1.0 *  fract(sin(dot(n.xy, vec2(47.9898, -18.233)))* 3058.5453));

}

vec3 blur( vec2 coord, float blur_intensity) {
	vec3 color = vec3(0.0, 0.0, 0.0);
	float k = ( blur_intensity) / 8.0;
	
	color += (1.0-blur_intensity) * texture2D(backbuffer,coord/resolution.xy).xyz; 
	color += k * texture2D(backbuffer,(coord+vec2(1.0, 0.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(1.0, 1.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(0.0, 1.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(-1.0, 1.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(-1.0, 0.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(-1.0, -1.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(0.0, -1.0))/resolution.xy).xyz;
	color += k * texture2D(backbuffer,(coord+vec2(1.0, -1.0))/resolution.xy).xyz;
	
	return color;
}

void main( void ) {

	float angle = (30.0*time / 360.0 ) * 2.0 * 3.14159;
	vec3 col;
	float color = 0.0;
	
	color += clamp(1.0 - 0.08 * length(gl_FragCoord.xy - mouse * resolution.xy),0.0,1.0);
        col = vec3(color, color, color);
	

	vec3 z = vec3(0.0,0.0,1.0);
	
	vec2 displacement = 4.0*cross(vec3(normalize(gl_FragCoord.xy-resolution.xy/2.0),0.0),z).xy - 0.4*normalize(gl_FragCoord.xy-resolution.xy/2.0) ;
	
	
	col += blur(gl_FragCoord.xy + 2.0 * displacement+ 4.0 * rand(1.0 *gl_FragCoord.xy / 1000.0 + 2.0 * vec2(cos(time),sin(time))), 0.9); 
	gl_FragColor = vec4( 0.99 *col, 1.0 );

}
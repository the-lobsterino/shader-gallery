#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//uniform sampler2D tex0;
//uniform vec4 circle_color;
//uniform vec2 circle_center;
//varying vec2 uv;

vec4 circle(vec2 uv,vec2 pos,float rad,vec4 color)
	{
		float d = length(pos - uv) - rad;
		float t = clamp(d, 0.0,3.0);
		return vec4(color);
	}
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float border =0.01;
	float radius  =0.5;
	vec4 color0 = vec4(0.0,0.0,0.0,1.0);
	vec4 color1 = vec4(100.0,0.0,0.0,1.0);
	vec2 center = vec2(0.5,0.5);
	//vec2 uv = gl_FragCoord.xy;
	//glFragColor = circle(center,position,radius,0.5);
	vec4 cc;
	cc = circle(center,position,radius,vec4(1.0,0.0,0.0,1.0));
	
	//float dist = radius - sqrt(m.x * m.x + m.y * m.y);
	//float t = 0.0;
	//if (dist>border)
//		t=1.0;
//	else if (dist>0.0)
//		t=dist/border;
	//gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
	/*
	out vec4 fragColor;
	in vec2 fragCooord;
	vec2 uv = fraagCoord.xy;
	float radius = 0.25 * iResolution.y;
	vec4 layer1 = vec4(rgb(210.0,222.0,228.0),1.0);
	vec3 red = rgb(255.0,95.0,60.0);
	vec4 layer2 = circle(uv,center,radius,red);
	fragColor = mix(layer1,layer2,,layer2.a);
*/
/*
	vec2 position = gl_TextCoord[0].xy;
	vec4 bkg_color = texture2D(tex0,uv * vec2(1.0,-1.0));
	uv -= circle_center;
	float dist = sqrt(dot(uv,uv));
	if((dist>(radius + border))||(dist>(radius + border)))
		gl_Frag
	gl_position = gl_ModeViewProjectionMatrix * gl_Vertex;
	gl_TextCoord[0] = gl_MultiTextCoord0;
	float color = position.x/2.0;
	color+=position.y/2.0;
	float radius=0;
	

	gl_FragColor = vec4( color, color, color , 1.0 );
*/
	
}
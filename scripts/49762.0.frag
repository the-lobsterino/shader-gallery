#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tex;
#define grid 10.
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 mousepos = (mouse.xy*resolution.xy)+grid;
	
	float color=0.0;
	if ((gl_FragCoord.x) < mousepos.x-mod(mousepos.x,grid) && 
	    (gl_FragCoord.x+grid) > mousepos.x-mod(mousepos.x,grid) && 
	    (gl_FragCoord.y) < mousepos.y-mod(mousepos.y,grid) && 
	    (gl_FragCoord.y+grid) > mousepos.y-mod(mousepos.y,grid)){
		color += 0.1;
	}
	else if (mod(gl_FragCoord.x,grid)<=1.0 || mod(gl_FragCoord.y,grid)<=1.0){
		gl_FragColor = vec4(0.3,0.2,0.3,1);
		return;
	}
	
	color = min(color,0.2);
	gl_FragColor = texture2D(tex, position) + vec4( vec3( color, 0.0, color), 1.0 );

}
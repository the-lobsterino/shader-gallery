#ifdef GL_ES
precision mediump float;
#endif

// neato

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979323

void main( void ) {
    	vec2 uv = ( gl_FragCoord.xy / resolution.xy )-.5;
        uv.x /= resolution.y/resolution.x;
    	vec3 col = vec3(1.);
    	//uv.x+=cos(time)*0.1+0.5; uv.y-=sin(time)*0.1+0.5;
	if(abs(uv.x)<0.01 || abs(uv.y)<0.01) {
		col=vec3(0.);
	}
    	gl_FragColor = vec4(col,1.0);
}
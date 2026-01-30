// From Optimus.. ST; for glsls Gigatron;
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float thresh = 2.0;
const float lowThresh = 0.25;
 

void main() {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
   	//vec2 p = ( gl_FragCoord.y / resolution.xy ); // vertical 

	vec3 rgb = vec3(0.0);
	float c = 0.0;
	
		float gr = p.x + p.x;
		float rx = floor(sin(gr * 15.0) + sin(gr * 25.0 + 4.0 * time) * 4.0);//
		float ry = floor(sin(gr * 16.0) + sin(gr * 26.0 + 4.0 * time) * 4.0);//The code is now much easy ;
		float rz = floor(sin(gr * 17.0) + sin(gr * 27.0 + 4.0 * time) * 4.0);//
		
		vec3 raster = vec3(rx, ry,rz) * 0.25;
		float d = c / lowThresh;
		rgb = d * vec3(c) + (1.0 - d) * raster;
	
	
	gl_FragColor = vec4(rgb, 1.0);

}
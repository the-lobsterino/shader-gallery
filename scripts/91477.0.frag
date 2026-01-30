#extension GL_OES_standard_derivatives : enable
//spatiosa speedhead
precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pct=4.0;



void main(void) {
vec2 p = (gl_FragCoord.xy / resolution.xy);


//p.y += p.y*p.y;
p=p-1.;//flip y

	

p.y+=sin(p.x*8.+.345)*p.y*sin(.654)*sin(p.y*.5)*.50;
	
//___________raster___________________________________________
vec3 col = mix(vec3(.0, .10, .20),vec3(p.y*2., p.y*2., p.y*8.), 2.*(p.y)*0.5);
//____________________________________________________________
vec3 col2 = vec3(p.y*p.y*pct*.5);



	
gl_FragColor = vec4(col*col2, 1.);
}
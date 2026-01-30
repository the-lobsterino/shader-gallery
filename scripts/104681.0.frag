#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	uv.x+=time;
	
        vec2 a = mod(uv, vec2(4.));
     
       
       
 
	col=vec3(vec2(sin(a*0.9)+a-a-2.2),a.x*1.25);
	gl_FragColor = vec4(col, 1.);

}
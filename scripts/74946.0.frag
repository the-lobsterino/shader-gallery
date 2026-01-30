#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float sinxcos(float v){return sin(v)*cos(v);}
void main( void ) {
	
	vec2 offs = vec2(sinxcos(time*(PI/2.0))*0.1, time*0.1*-2.0);
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);
	if (pos.y > 0.0) {discard;}
        float horizon = 0.0; 
        float fov = 0.5; 
	float scaling = 0.1*max(0.5, abs(cos(time*(PI/2.0))));
	
	vec3 p = vec3(pos.x, fov, pos.y - horizon);      
	vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
	
	//checkboard texture
	float color = sign((mod(s.x+offs.x, 0.1) - 0.05) * (mod(s.y+offs.y, 0.1) - 0.05));	
	//fading
	color *= p.z*p.z*10.0;
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}